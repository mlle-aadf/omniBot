import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AIModel } from "@/lib/types";
import { Brain, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ModelSelectorProps {
  availableModels: AIModel[];
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
}

export default function ModelSelector({
  availableModels,
  selectedModels,
  onToggleModel,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-card backdrop-blur-sm border-border shadow-neon">
        <CardContent className="p-4">
          <CollapsibleTrigger className="w-full">
            <h4 className="text-base font-semibold text-primary flex items-center gap-2 retro-text cursor-pointer hover:opacity-80 transition-opacity">
              <Brain className="h-4 w-4 text-accent pixel-art flex-shrink-0" />
              <span className="truncate">Bots</span>
              <ChevronRight className={`h-4 w-4 text-muted-foreground ml-auto transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </h4>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-3">
            <div className="grid grid-cols-2 gap-2 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
              {availableModels.map((model) => {
                const isSelected = selectedModels.includes(model.id);
                return (
                  <Button
                    key={model.id}
                    type="button"
                    onClick={() => onToggleModel(model.id)}
                    variant="outline"
                    className={`text-sm p-2 h-auto transition-all duration-200 ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-semibold border-primary hover:bg-primary/90"
                        : "border-border bg-secondary/50 text-foreground hover:bg-secondary"
                    }`}
                  >
                    {model.name}
                  </Button>
                );
              })}
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
}
