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
    { id: "gpt4", name: "GPT-4" },
    { id: "gemini", name: "Gemini" },
    { id: "claude", name: "Claude" },
    { id: "deepseek", name: "Deepseek" },
    { id: "grok", name: "Grok" },
    { id: "llama", name: "Llama" },
    { id: "mistral", name: "Mistral" },
    { id: "gemma", name: "Gemma" }
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
