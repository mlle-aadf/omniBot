import { Skeleton } from "@/components/ui/skeleton";
import ResponseCard from "@/components/ResponseCard";
import { AIResponse, ViewLayout } from "@/lib/types";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

interface ResultsGridProps {
  isLoading: boolean;
  responses: AIResponse[];
  selectedModels: string[];
  maximizedCard: string | null;
  toggleMaximize: (modelId: string) => void;
  viewLayout: ViewLayout;
}

export default function ResultsGrid({
  isLoading,
  responses,
  selectedModels,
  maximizedCard,
  toggleMaximize,
  viewLayout,
}: ResultsGridProps) {
  const items = isLoading
    ? selectedModels.map((modelId) => ({ type: "loading" as const, modelId }))
    : responses.map((response, index) => ({
        type: "response" as const,
        modelId: selectedModels[index],
        response,
      }));

  const validItems = items.filter((item) => item.modelId);

  if (validItems.length === 0) {
    return (
      <div className="flex-1 p-4 lg:p-6 flex items-center justify-center text-muted-foreground">
        Select models and submit a prompt to see responses
      </div>
    );
  }

  const direction = viewLayout === "rows" ? "vertical" : "horizontal";

  // For columns with 5+ models, split into 2 rows
  const useDoubleRow = viewLayout === "columns" && validItems.length >= 5;

  const renderPanel = (item: (typeof validItems)[number], index: number) => {
    const isMaximized = maximizedCard === item.modelId;

    return (
      <ResizablePanel key={item.modelId} defaultSize={100 / validItems.length} minSize={10}>
        <div className="h-full p-1 relative">
          {item.type === "loading" ? (
            <Skeleton className="h-full w-full bg-secondary animate-pulse rounded-lg" />
          ) : (
            <ResponseCard
              response={item.response!}
              isMaximized={isMaximized}
              onToggleMaximize={() => toggleMaximize(item.modelId)}
            />
          )}
        </div>
      </ResizablePanel>
    );
  };

  const renderHandlesBetween = (items: (typeof validItems), startIndex: number = 0) => {
    const elements: React.ReactNode[] = [];
    items.forEach((item, i) => {
      elements.push(renderPanel(item, startIndex + i));
      if (i < items.length - 1) {
        elements.push(
          <ResizableHandle key={`handle-${startIndex + i}`} withHandle />
        );
      }
    });
    return elements;
  };

  if (useDoubleRow) {
    const midpoint = Math.ceil(validItems.length / 2);
    const topRow = validItems.slice(0, midpoint);
    const bottomRow = validItems.slice(midpoint);

    return (
      <div className="flex-1 p-4 lg:p-6 relative overflow-hidden">
        <ResizablePanelGroup direction="vertical" className="h-full">
          <ResizablePanel defaultSize={50} minSize={20}>
            <ResizablePanelGroup direction="horizontal" className="h-full">
              {renderHandlesBetween(topRow, 0)}
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={20}>
            <ResizablePanelGroup direction="horizontal" className="h-full">
              {renderHandlesBetween(bottomRow, midpoint)}
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-6 relative overflow-hidden">
      <ResizablePanelGroup direction={direction} className="h-full">
        {renderHandlesBetween(validItems)}
      </ResizablePanelGroup>
    </div>
  );
}
