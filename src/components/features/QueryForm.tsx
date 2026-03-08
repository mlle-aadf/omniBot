import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AIModel, ResponseLength, ViewLayout } from "@/lib/types";
import { Loader, MessageSquare, RotateCcw, StopCircle, Bot, PenLine } from "lucide-react";
import ModelSelector from "@/components/ModelSelector";
import SettingsDropdown from "@/components/SettingsDropdown";
import TaskSelector from "@/components/TaskSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useState } from "react";

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
    onClear: () => void;
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
    onClear,
    loadingText
}: QueryFormProps) {
    const isMobile = useIsMobile();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const hasSelections = selectedModels.length > 0 || selectedTask !== null;

    const selectedModelNames = selectedModels
        .map(id => availableModels.find(m => m.id === id)?.name)
        .filter(Boolean);

    const handleMobileSubmit = (e: React.FormEvent) => {
        onSubmit(e);
        setDrawerOpen(false);
    };

    const formContent = (
        <form onSubmit={isMobile ? handleMobileSubmit : onSubmit} className="flex flex-col gap-4 flex-1 min-h-0">
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
                    className="mb-4 resize-none border-border focus-visible:ring-accent flex-1 min-h-[80px] bg-secondary/50 text-foreground placeholder:text-muted-foreground shadow-neon text-lg"
                />
                <div className="flex gap-2">
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground transition-all duration-300 shadow-neon hover:shadow-neon-lg disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
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
    );

    // Mobile/Tablet: compact top bar + drawer
    if (isMobile) {
        return (
            <>
                <div className="w-full p-3 flex items-center gap-2 neon-card shrink-0">
                    <h1 className="text-lg font-bold text-primary flex items-center gap-1.5 omnibot-title shrink-0">
                        <Bot className="h-5 w-5 text-accent" />
                        OmniBot
                    </h1>

                    <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
                        {selectedModelNames.length > 0 && (
                            <span className="text-xs text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                                {selectedModelNames.length} bot{selectedModelNames.length !== 1 ? 's' : ''}
                            </span>
                        )}
                        {selectedTask && (
                            <span className="text-xs text-accent bg-secondary/80 px-2 py-0.5 rounded-full whitespace-nowrap truncate">
                                {selectedTask}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        {hasSelections && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={onClear}
                                className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                aria-label="Clear all selections"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                            </Button>
                        )}
                        <SettingsDropdown
                            viewLayout={viewLayout}
                            setViewLayout={setViewLayout}
                            responseLength={responseLength}
                            setResponseLength={setResponseLength}
                        />
                        <Button
                            size="sm"
                            onClick={() => setDrawerOpen(true)}
                            className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground shadow-neon gap-1.5"
                        >
                            <PenLine className="h-3.5 w-3.5" />
                            Prompt
                        </Button>
                    </div>
                </div>

                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerContent className="max-h-[92vh] min-h-[70vh] px-4 pb-6">
                        <DrawerHeader className="px-0 pb-2">
                            <DrawerTitle className="text-primary retro-text">Configure & Prompt</DrawerTitle>
                        </DrawerHeader>
                        {formContent}
                    </DrawerContent>
                </Drawer>
            </>
        );
    }

    // Desktop: sidebar
    return (
        <div className="w-full lg:w-1/4 lg:h-full p-4 lg:p-6 flex flex-col gap-4 neon-card overflow-y-auto custom-scrollbar shrink-0">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-primary flex items-center gap-2 omnibot-title">
                    <Bot className="h-7 w-7 text-accent" />
                    OmniBot
                </h1>
                <div className="flex items-center gap-1">
                    {hasSelections && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onClear}
                            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            aria-label="Clear all selections"
                            title="Clear all selections"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    )}
                    <SettingsDropdown
                        viewLayout={viewLayout}
                        setViewLayout={setViewLayout}
                        responseLength={responseLength}
                        setResponseLength={setResponseLength}
                    />
                </div>
            </div>
            {formContent}
        </div>
    );
}
