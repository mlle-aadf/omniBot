
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePuter } from "@/hooks/usePuter";
import { queryClaude, queryDeepseek, queryGemini, queryGemma, queryGrok, queryLlama, queryMistral, queryOpenAI } from "@/lib/ai-clients";
import { AIModel, AIResponse, ViewLayout } from "@/lib/types";
import { Loader, MessageSquare, Sparkles, StopCircle } from "lucide-react";
import { useEffect, useState } from "react";
import ModelSelector from "./ModelSelector";
import ResponseCard from "./ResponseCard";
import SettingsDropdown from "./SettingsDropdown";
import TaskSelector from "./TaskSelector";

export default function MultiAIQuery() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const [maximizedCard, setMaximizedCard] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useLocalStorage<string[]>("selectedModels", []);
  const [viewLayout, setViewLayout] = useLocalStorage<ViewLayout>("viewLayout", "columns");
  const { toast } = useToast();
  const { isPuterReady, error: puterError } = usePuter();
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [loadingText, setLoadingText] = useState("Querying...");

  const loadingPhrases = [
    "Powering up processors...",
    "Scanning the cyberverse...",
    "Loading cosmic algorithms...",
    "Summoning AI magic...",
    "Interfacing with bots...",
    "Consulting digital oracles...",
    "Mining data crystals...",
    "Enhancing neural networks..."
  ];

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * loadingPhrases.length);
        setLoadingText(loadingPhrases[randomIndex]);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const availableModels: AIModel[] = [
    { id: "gpt4", name: "GPT-4", queryFn: queryOpenAI },
    { id: "gemini", name: "Gemini", queryFn: queryGemini },
    { id: "claude", name: "Claude", queryFn: queryClaude },
    { id: "deepseek", name: "Deepseek", queryFn: queryDeepseek },
    { id: "grok", name: "Grok", queryFn: queryGrok },
    { id: "llama", name: "Llama", queryFn: queryLlama },
    { id: "mistral", name: "Mistral", queryFn: queryMistral },
    { id: "gemma", name: "Gemma", queryFn: queryGemma }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPuterReady) {
      toast({
        title: "Error",
        description: "Puter API is not ready yet. Please wait...",
        variant: "destructive",
      });
      return;
    }

    if (puterError) {
      toast({
        title: "Error",
        description: "Failed to initialize Puter API. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    if (selectedModels.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one AI model",
        variant: "destructive",
      });
      return;
    }

    await queryModels();
  };

  const stopQuery = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsLoading(false);
      toast({
        title: "Query Stopped",
        description: "AI query has been stopped",
      });
    }
  };

  const queryModels = async () => {
    setIsLoading(true);
    setResponses([]);
    setMaximizedCard(null);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const selectedModelQueries = availableModels
        .filter(model => selectedModels.includes(model.id))
        .map(model => model.queryFn(prompt));

      const results = await Promise.allSettled(selectedModelQueries);

      if (controller.signal.aborted) {
        return;
      }

      const formattedResponses = results.map((result, index) => {
        const modelId = selectedModels[index];
        const modelName = availableModels.find(m => m.id === modelId)?.name || "Unknown";
        
        if (result.status === "fulfilled") {
          console.log("RESULTS: ", result.value);
          return result.value;
        } else {
          return {
            model: modelName,
            response: "",
            error: "Failed to get response",
          };
        }
      });

      setResponses(formattedResponses);
      setExpandedCards(selectedModels);
    } catch (error) {
      if (!controller.signal.aborted) {
        toast({
          title: "Error",
          description: "Failed to query AI models",
          variant: "destructive",
        });
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
        setAbortController(null);
      }
    }
  };

  const toggleCard = (modelId: string) => {
    if (expandedCards.includes(modelId)) {
      if (maximizedCard === modelId) {
        setMaximizedCard(null);
      }
      setExpandedCards(prev => prev.filter(id => id !== modelId));
    } else {
      setExpandedCards(prev => [...prev, modelId]);
    }
  };

  const toggleMaximize = (modelId: string) => {
    setMaximizedCard(prev => prev === modelId ? null : modelId);
  };

  const toggleModel = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleTaskSelect = (modelIds: string[]) => {
    setSelectedModels(modelIds);
  };

  const getLayoutClass = () => {
    switch (viewLayout) {
      case "columns":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      case "rows":
        return "grid-cols-1";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }
  };

  // Filter responses based on selected models
  const visibleResponses = responses.filter((_, index) => 
    selectedModels.includes(selectedModels[index])
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full overflow-hidden bg-gradient-to-br from-purple-800 to-indigo-900 dark:from-gray-900 dark:to-gray-800 vaporwave-bg">
      <div className="w-full lg:w-1/4 p-4 lg:p-6 flex flex-col gap-4 neon-card max-h-screen overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2 omnibot-title">
            <Sparkles className="h-6 w-6 text-pink-500" />
            OmniBot
          </h1>
          <SettingsDropdown viewLayout={viewLayout} setViewLayout={setViewLayout} />
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1 min-h-0">
          <div className="flex flex-col gap-4 flex-shrink-0">
            <ModelSelector 
              availableModels={availableModels} 
              selectedModels={selectedModels}
              onToggleModel={toggleModel}
            />

            <TaskSelector
              availableModels={availableModels}
              onSelectTask={handleTaskSelect}
            />
          </div>

          <div className="flex flex-col flex-1 min-h-0">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="mb-4 resize-none border-pink-300 focus-visible:ring-cyan-400 flex-1 bg-indigo-900/40 dark:bg-gray-900/70 text-white placeholder:text-cyan-200/50 shadow-neon"
            />
            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 transition-all duration-300 shadow-neon hover:shadow-neon-lg disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
                disabled={isLoading || selectedModels.length === 0}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    {loadingText}
                  </>
                ) : selectedModels.length === 0 ? (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Select at least one model
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Query Selected AIs
                  </>
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="destructive"
                className="bg-red-500 hover:bg-red-600 shadow-red-neon"
                onClick={stopQuery}
                disabled={!isLoading}
              >
                <StopCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="flex-1 p-4 lg:p-6 flex flex-col gap-4 relative overflow-hidden">
        <div className={`grid gap-4 ${getLayoutClass()} flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar`}>
          {isLoading ? (
            selectedModels.map((modelId) => (
              <div key={modelId} className="min-h-[200px]">
                <Skeleton className="h-full w-full bg-indigo-900/40 animate-pulse" />
              </div>
            ))
          ) : (
            responses.map((response, index) => {
              const modelId = selectedModels[index];
              // Only render response card if model is selected
              if (!selectedModels.includes(modelId)) return null;
              
              const isExpanded = expandedCards.includes(modelId);
              const isMaximized = maximizedCard === modelId;

              return (
                <div 
                  key={modelId} 
                  className={`${isExpanded ? 'min-h-[200px]' : 'h-auto'} ${isMaximized ? 'col-span-full row-span-full' : ''}`}
                  style={{ zIndex: isMaximized ? 10 : 1 }}
                >
                  <ResponseCard
                    response={response}
                    isExpanded={isExpanded}
                    isMaximized={isMaximized}
                    onToggleExpand={() => toggleCard(modelId)}
                    onToggleMaximize={() => toggleMaximize(modelId)}
                    viewLayout={viewLayout}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
