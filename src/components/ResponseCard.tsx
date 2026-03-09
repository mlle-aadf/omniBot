import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AIResponse } from "@/lib/types";
import { Maximize, Minimize, MessageSquare } from "lucide-react";

interface ResponseCardProps {
  response: AIResponse;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  compact?: boolean;
}

export default function ResponseCard({
  response,
  isMaximized,
  onToggleMaximize,
  compact = false,
}: ResponseCardProps) {
  return (
    <Card className={`w-full h-full backdrop-blur-sm border-border shadow-neon hover:shadow-neon-lg transition-all duration-300 flex flex-col bg-card ${
      isMaximized ? "absolute inset-0 z-10" : "relative"
    }`}>
      <CardHeader className="flex flex-row items-center justify-between py-2 px-4 shrink-0">
        <CardTitle className="flex items-center gap-2 text-primary text-sm retro-text">
          <MessageSquare className="h-4 w-4 text-accent" />
          {response.model}
        </CardTitle>
        
        {!compact && (
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleMaximize(); }}
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
      </CardHeader>
      
      {!compact && (
        <CardContent className="flex-1 overflow-auto custom-scrollbar pb-2">
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
