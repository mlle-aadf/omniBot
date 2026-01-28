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
      <Card className="bg-indigo-900/40 dark:bg-gray-900/70 backdrop-blur-sm border-pink-300/30 dark:border-pink-800/30 shadow-neon">
        <CardContent className="p-4">
          <CollapsibleTrigger className="w-full">
            <h4 className="text-base font-semibold text-cyan-300 dark:text-cyan-400 flex items-center gap-2 retro-text cursor-pointer hover:text-cyan-200 transition-colors">
              <Brain className="h-4 w-4 text-pink-500 pixel-art flex-shrink-0" />
              <span className="truncate">Bots</span>
              <ChevronRight className={`h-4 w-4 text-pink-500 ml-auto transition-transform ${isOpen ? 'rotate-90' : ''}`} />
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
                        ? "bg-gradient-to-r from-pink-500 to-cyan-500 text-gray-900 font-semibold border-cyan-400 hover:from-pink-600 hover:to-cyan-600"
                        : "border-pink-300/30 dark:border-pink-800/30 bg-indigo-800/30 dark:bg-gray-800/30 text-cyan-200 hover:bg-indigo-700/50 dark:hover:bg-gray-700/50"
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
