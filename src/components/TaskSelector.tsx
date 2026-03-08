import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { preselectModelsForTask, tasks } from "@/lib/taskData";
import { AIModel } from "@/lib/types";
import { ChevronRight, LightbulbIcon } from "lucide-react";
import { Button } from "./ui/button";

interface TaskSelectorProps {
  availableModels: AIModel[];
  selectedTask: string | null;
  onSelectTask: (taskName: string | null, modelIds: string[]) => void;
}

export default function TaskSelector({
  availableModels,
  selectedTask,
  onSelectTask
}: TaskSelectorProps) {
  const isOpen = selectedTask === null;

  const handleTaskSelect = (taskName: string) => {
    if (selectedTask === taskName) {
      onSelectTask(null, []);
    } else {
      const modelIds = preselectModelsForTask(taskName, availableModels);
      onSelectTask(taskName, modelIds);
    }
  };

  return (
    <Collapsible open={isOpen}>
      <Card className="bg-card backdrop-blur-sm border-border shadow-neon">
        <CardContent className="p-4">
          <CollapsibleTrigger
            className="w-full"
            onClick={() => {
              if (selectedTask) {
                onSelectTask(null, []);
              }
            }}
          >
            <h4 className="text-base font-semibold flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <LightbulbIcon className="h-4 w-4 text-accent pixel-art flex-shrink-0" />
              <span className="text-primary retro-text">Tasks</span>
              {selectedTask && (
                <span className="truncate text-sm text-accent font-normal">
                  [{selectedTask}]
                </span>
              )}
              <ChevronRight className={`h-4 w-4 text-muted-foreground ml-auto transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </h4>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-3">
            <div className="grid grid-cols-2 gap-2 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
              {tasks.map(task => {
                const isSelected = selectedTask === task.name;
                return (
                  <Button
                    key={task.name}
                    type="button"
                    onClick={() => handleTaskSelect(task.name)}
                    variant="outline"
                    className={`text-sm p-2 h-auto flex flex-col items-start transition-all duration-200 ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-semibold border-primary hover:bg-accent hover:text-accent-foreground hover:border-accent"
                        : "border-border bg-secondary/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent"
                    }`}
                    title={task.description}
                  >
                    <span className="font-semibold">{task.name}</span>
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
