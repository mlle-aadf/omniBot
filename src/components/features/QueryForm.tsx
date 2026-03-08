import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AIModel, ResponseLength, ViewLayout } from "@/lib/types";
import { Loader, MessageSquare, StopCircle } from "lucide-react";
import ModelSelector from "@/components/ModelSelector";
import SettingsDropdown from "@/components/SettingsDropdown";
import TaskSelector from "@/components/TaskSelector";
import { Bot } from "lucide-react";

interface QueryFormProps {
    prompt: string;
    setPrompt: (value: string) => void;
    isLoading: boolean;
    selectedModels: string[];
    setSelectedModels: (models: string[]) => void;
    onToggleModel: (modelId: string) => void;
    availableModels: AIModel[];
    selectedTask: string | null;
    onSelectTask: (taskName: string | null, modelIds: string[]) => void;
    viewLayout: ViewLayout;
    setViewLayout: (layout: ViewLayout) => void;
    responseLength: ResponseLength;
    setResponseLength: (length: ResponseLength) => void;
    onSubmit: (e: React.FormEvent) => void;
    onStop: () => void;
    loadingText: string;
}

export default function QueryForm({
    prompt,
    setPrompt,
    isLoading,
    selectedModels,
    setSelectedModels,
    onToggleModel,
    availableModels,
    selectedTask,
    onSelectTask,
    viewLayout,
    setViewLayout,
    responseLength,
    setResponseLength,
    onSubmit,
    onStop,
    loadingText
}: QueryFormProps) {

    return (
        <div className="w-full lg:w-1/4 h-full p-4 lg:p-6 flex flex-col gap-4 neon-card overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-primary flex items-center gap-2 omnibot-title">
                    <Bot className="h-7 w-7 text-accent" />
                    OmniBot
                </h1>
                <SettingsDropdown
                    viewLayout={viewLayout}
                    setViewLayout={setViewLayout}
                    responseLength={responseLength}
                    setResponseLength={setResponseLength}
                />
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-4 flex-1 min-h-0">
                <div className="flex flex-col gap-4 flex-shrink-0">
                    <ModelSelector
                        availableModels={availableModels}
                        selectedModels={selectedModels}
                        onToggleModel={onToggleModel}
                    />

                    <TaskSelector
                        availableModels={availableModels}
                        selectedTask={selectedTask}
                        onSelectTask={onSelectTask}
                    />
                </div>

                <div className="flex flex-col flex-1 min-h-0">
                    <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your prompt here..."
                        className="mb-4 resize-none border-border focus-visible:ring-accent flex-1 bg-secondary/50 text-foreground placeholder:text-muted-foreground shadow-neon text-lg"
                    />
                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-neon hover:shadow-neon-lg disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
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
                                    Select a model
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
                            className="shadow-red-neon"
                            onClick={onStop}
                            disabled={!isLoading}
                        >
                            <StopCircle className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
