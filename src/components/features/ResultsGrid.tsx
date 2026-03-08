import { Skeleton } from "@/components/ui/skeleton";
import ResponseCard from "@/components/ResponseCard";
import { AIResponse, ViewLayout } from "@/lib/types";

interface ResultsGridProps {
    isLoading: boolean;
    responses: AIResponse[];
    selectedModels: string[];
    expandedCards: string[];
    maximizedCard: string | null;
    toggleCard: (modelId: string) => void;
    toggleMaximize: (modelId: string) => void;
    viewLayout: ViewLayout;
}

export default function ResultsGrid({
    isLoading,
    responses,
    selectedModels,
    expandedCards,
    maximizedCard,
    toggleCard,
    toggleMaximize,
    viewLayout
}: ResultsGridProps) {

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

    return (
        <div className="flex-1 p-4 lg:p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className={`grid gap-4 ${getLayoutClass()} flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar`}>
                {isLoading ? (
                    selectedModels.map((modelId) => (
                        <div key={modelId} className="min-h-[200px]">
                            <Skeleton className="h-full w-full bg-secondary animate-pulse" />
                        </div>
                    ))
                ) : (
                    responses.map((response, index) => {
                        const modelId = selectedModels[index];
                        if (!response || !modelId) return null;

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
    );
}
