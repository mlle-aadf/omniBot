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
                            <Skeleton className="h-full w-full bg-indigo-900/40 animate-pulse" />
                        </div>
                    ))
                ) : (
                    responses.map((response, index) => {
                        // Need to match response to selected model correctly.
                        // The responses array in MultiAIQuery was aligned with selectedModels order.
                        // Assuming responses array order matches selectedModels indexing.
                        // CAUTION: The previous logic used `selectedModels[index]` to identify the model for the response at `index`.
                        // We must preserve this correlation.

                        // Wait, previous logic:
                        // responses.map((response, index) => {
                        //   const modelId = selectedModels[index];
                        //   if (!selectedModels.includes(modelId)) return null; 

                        // If `responses` is stateful and potentially out of sync during filtering changes, we need to be careful.
                        // But usually `responses` is set after a query based on `selectedModels` at that time.
                        // If user changes selection AFTER query, existing responses might mismatch if we just use index?
                        // Actually, `useMultiModelQuery` resets responses on new query.
                        // But if I unselect a model, I probably want to hide its response.
                        // The parent `visibleResponses` logic was:
                        // responses.filter((_, index) => selectedModels.includes(selectedModels[index]))

                        // Let's rely on the passed-in `responses` list which should ideally contain what we want to show, 
                        // OR we iterate `selectedModels` if we want to show placeholders?

                        // The previous code mapped `responses`.
                        // But `responses` from `useMultiModelQuery` returns `AIResponse[]`. 
                        // `AIResponse` has a `model` field (which we set to the name).
                        // But for `key` and toggling we need `modelId`.
                        // `useMultiModelQuery` returns responses in same order as the input `selectedModels`.
                        // If the user changes `selectedModels` (unchecks one), the `responses` array hasn't changed its length immediately unless we trigger a re-query or filter it.

                        // In the previous component:
                        // const visibleResponses = responses.filter((_, index) => 
                        //   selectedModels.includes(selectedModels[index])
                        // );
                        // But the render loop used `responses.map`.
                        // AND checked `if (!selectedModels.includes(modelId)) return null;`

                        // Let's replicate strict logic:

                        const modelId = selectedModels[index];
                        // This assumes responses[i] corresponds to selectedModels[i] at the time of query?
                        // If I select A,B -> Query -> Responses[A,B]
                        // Then I select C -> selectedModels is A,B,C. responses is still [A,B].
                        // index 2 is C. responses[2] is undefined.

                        if (!response || !modelId) return null;

                        // If we want to hide unselected ones effectively without re-querying:
                        // But if I unselect A: selectedModels is B.
                        // responses is [A,B]. index 0 is B. responses[0] is A. Mismatch!
                        // This implies current architecture is fragile to selection changes without re-query.
                        // However, let's stick to the extraction of EXISTING logic.

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
