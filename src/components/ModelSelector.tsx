import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { AIModel } from "@/lib/types";
import { Brain, ChevronRight, Search } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredModels = availableModels.filter((model) =>
    model.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-card backdrop-blur-sm border-border shadow-neon">
        <CardContent className="p-4">
          <CollapsibleTrigger className="w-full">
            <h4 className="text-base font-semibold text-primary flex items-center gap-2 retro-text cursor-pointer hover:opacity-80 transition-opacity">
              <Brain className="h-4 w-4 text-accent pixel-art flex-shrink-0" />
              <span className="truncate">Bots</span>
              {selectedModels.length > 0 && (
                <span className="text-sm text-accent font-normal">[{selectedModels.length}]</span>
              )}
              <ChevronRight className={`h-4 w-4 text-muted-foreground ml-auto transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </h4>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-3 flex flex-col gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search models..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-sm bg-secondary/50 border-border focus-visible:ring-accent"
              />
            </div>

            <div className="flex flex-col gap-1 max-h-[28vh] overflow-y-auto pr-1 custom-scrollbar">
              {filteredModels.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-3">No models match your search.</p>
              ) : (
                filteredModels.map((model) => {
                  const isSelected = selectedModels.includes(model.id);
                  return (
                    <label
                      key={model.id}
                      htmlFor={`model-${model.id}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors duration-150 select-none ${
                        isSelected
                          ? "bg-primary/15 text-foreground"
                          : "hover:bg-secondary/70 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Checkbox
                        id={`model-${model.id}`}
                        checked={isSelected}
                        onCheckedChange={() => onToggleModel(model.id)}
                      />
                      <span className="text-sm font-medium leading-none">{model.name}</span>
                    </label>
                  );
                })
              )}
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
}
