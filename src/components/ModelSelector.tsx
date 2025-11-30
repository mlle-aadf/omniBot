import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AIModel } from "@/lib/types";
import { Bot, ChevronRight } from "lucide-react";
import { useState } from "react";
interface ModelSelectorProps {
  availableModels: AIModel[];
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
}
export default function ModelSelector({
  availableModels,
  selectedModels,
  onToggleModel
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const sortedModels = availableModels.sort((a, b) => {
    const aSelected = selectedModels.includes(a.id);
    const bSelected = selectedModels.includes(b.id);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });
  return <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-indigo-900/40 dark:bg-gray-900/70 backdrop-blur-sm border-pink-300/30 dark:border-pink-800/30 shadow-neon">
        <CardContent className="p-4">
          <CollapsibleTrigger className="w-full">
            <h4 className="text-base font-semibold text-cyan-300 dark:text-cyan-400 flex items-center gap-2 retro-text cursor-pointer hover:text-cyan-200 transition-colors">
              <Bot className="h-4 w-4 text-pink-500 pixel-art flex-shrink-0" />
              <span className="truncate text-base">Choose Bots</span>
              <ChevronRight className={`h-4 w-4 text-pink-500 ml-auto transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </h4>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-3">
            <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
              {sortedModels.map(model => <div key={model.id} className={`flex items-center space-x-2 hover:bg-indigo-800/40 dark:hover:bg-gray-800/40 p-2 rounded-md transition-colors ${selectedModels.includes(model.id) ? "bg-indigo-800/50 dark:bg-gray-800/50" : ""}`}>
                  <Checkbox id={model.id} checked={selectedModels.includes(model.id)} onCheckedChange={() => onToggleModel(model.id)} className="border-pink-400 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500" />
                  <label htmlFor={model.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-cyan-200">
                    {model.name}
                  </label>
                </div>)}
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>;
}