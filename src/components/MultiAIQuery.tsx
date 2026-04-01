import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMultiModelQuery } from "@/hooks/useMultiModelQuery";
import { AIModel, ResponseLength, ViewLayout } from "@/lib/types";
import { useEffect, useState } from "react";
import QueryForm from "./features/QueryForm";
import ResultsGrid from "./features/ResultsGrid";

export default function MultiAIQuery() {
  const [prompt, setPrompt] = useState("");
  const [maximizedCard, setMaximizedCard] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useLocalStorage<string[]>("selectedModels", []);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [viewLayout, setViewLayout] = useLocalStorage<ViewLayout>("viewLayout", "columns");
  const [responseLength, setResponseLength] = useLocalStorage<ResponseLength>("responseLength", "brief");
  const { toast } = useToast();
  const [loadingText, setLoadingText] = useState("Querying...");

  const availableModels: AIModel[] = [
    { id: "claude-haiku", name: "Claude Haiku 4.5" },
    { id: "claude-sonnet", name: "Claude Sonnet 4.6" },
    { id: "gemini-flash-lite", name: "Gemini 3.1 Flash Lite" },
    { id: "gemini-flash", name: "Gemini 3 Flash" },
    { id: "gpt-nano", name: "GPT-5.4 Nano" },
    { id: "gpt-mini", name: "GPT-5.4 Mini" },
    { id: "qwen-flash", name: "Qwen 3.5 Flash" },
    { id: "qwen-27b", name: "Qwen 3.5 27B" },
    { id: "deepseek", name: "DeepSeek V3.2" },
    { id: "deepseek-special", name: "DeepSeek V3.2 Special" },
    { id: "mistral-small", name: "Mistral Small 2603" },
    { id: "devstral", name: "Devstral 2512" },
    { id: "olmo-instruct", name: "OLMo 3.1 32B" },
    { id: "olmo-think", name: "OLMo 3.1 32B Think" },
    { id: "nemotron", name: "Nemotron 3 Nano" },
    { id: "trinity", name: "Trinity Large" },
    { id: "minimax", name: "MiniMax M2.7" },
    { id: "seed", name: "Seed 2.0 Mini" },
    { id: "glm", name: "GLM-4.7 Flash" },
  ];

  const {
    isLoading,
    responses,
    queryAllModels,
    stopQuery,
    isPuterReady,
    setResponses
  } = useMultiModelQuery({
    prompt,
    selectedModels,
    responseLength,
    availableModels
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMaximizedCard(null);
    await queryAllModels();
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

  const handleTaskSelect = (taskName: string | null, modelIds: string[]) => {
    setSelectedTask(taskName);
    setSelectedModels(modelIds);
  };

  const handleClear = () => {
    setSelectedTask(null);
    setSelectedModels([]);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-background min-h-0">
      <QueryForm
        prompt={prompt}
        setPrompt={setPrompt}
        isLoading={isLoading}
        selectedModels={selectedModels}
        setSelectedModels={setSelectedModels}
        onToggleModel={toggleModel}
        availableModels={availableModels}
        selectedTask={selectedTask}
        onSelectTask={handleTaskSelect}
        viewLayout={viewLayout}
        setViewLayout={setViewLayout}
        responseLength={responseLength}
        setResponseLength={setResponseLength}
        onSubmit={handleSubmit}
        onStop={stopQuery}
        onClear={handleClear}
        loadingText={loadingText}
      />

      <ResultsGrid
        isLoading={isLoading}
        responses={responses}
        selectedModels={selectedModels}
        maximizedCard={maximizedCard}
        toggleMaximize={toggleMaximize}
        viewLayout={viewLayout}
      />
    </div>
  );
}
