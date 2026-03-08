import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AIResponse } from "@/lib/types";
import { ChevronDown, ChevronUp, Maximize, Minimize, MessageSquare } from "lucide-react";

interface ResponseCardProps {
  response: AIResponse;
  isExpanded: boolean;
  isMaximized: boolean;
  onToggleExpand: () => void;
  onToggleMaximize: () => void;
  viewLayout: "columns" | "rows";
}

export default function ResponseCard({
  response,
  isExpanded,
  isMaximized,
  onToggleExpand,
  onToggleMaximize,
  viewLayout,
}: ResponseCardProps) {
  const isVerticalTab = viewLayout === "columns" && !isExpanded;

  return (
    <Card className={`w-full backdrop-blur-sm border-border shadow-neon hover:shadow-neon-lg transition-all duration-300 flex ${isVerticalTab ? 'flex-row' : 'flex-col'} ${
      isMaximized ? "absolute inset-4 z-10 overflow-hidden" : "relative"
    } ${isExpanded ? "opacity-100 h-full" : "opacity-80 hover:opacity-100 h-auto"} bg-card`}>
      <CardHeader 
        className={`cursor-pointer hover:bg-secondary/50 transition-colors ${isVerticalTab ? 'rounded-l-lg py-2 px-1 flex flex-col items-center justify-center w-8' : 'rounded-t-lg flex flex-row items-center justify-between py-3 px-4'}`}
        onClick={isVerticalTab ? onToggleExpand : undefined}
      >
        <div className={`${isVerticalTab ? 'flex-1 -rotate-90 whitespace-nowrap transform origin-center' : 'flex-1'}`} onClick={isVerticalTab ? undefined : onToggleExpand}>
          <CardTitle className={`flex ${isVerticalTab ? 'items-end justify-center' : 'items-center gap-2'} text-primary ${isVerticalTab ? 'text-base' : 'text-lg'} retro-text`}>
            {!isVerticalTab && <MessageSquare className="h-4 w-4 text-accent" />}
            {response.model}
          </CardTitle>
        </div>
        
        {!isVerticalTab && (
          <div className="flex items-center gap-1">
            <button 
              onClick={onToggleExpand} 
              className="p-1 rounded-md hover:bg-secondary transition-colors"
              aria-label={isExpanded ? "Collapse response" : "Expand response"}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            
            {isExpanded && (
              <button 
                onClick={onToggleMaximize}
                className="p-1 rounded-md hover:bg-secondary transition-colors"
                aria-label={isMaximized ? "Minimize response" : "Maximize response"}
              >
                {isMaximized ? (
                  <Minimize className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Maximize className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )}
          </div>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="flex-1 overflow-auto custom-scrollbar">
          {response.error ? (
            <p className="text-destructive">{response.error}</p>
          ) : (
            <p className="whitespace-pre-wrap text-foreground leading-relaxed">{response.response}</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
