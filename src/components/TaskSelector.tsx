import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { preselectModelsForTask, tasks } from "@/lib/taskData";
import { AIModel } from "@/lib/types";
import { ChevronRight, LightbulbIcon } from "lucide-react";
import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(true);

  const handleTaskSelect = (taskName: string) => {
    if (selectedTask === taskName) {
      // Deselect task and clear all model selections
      onSelectTask(null, []);
    } else {
      // Select task and preselect models
      const modelIds = preselectModelsForTask(taskName, availableModels);
      onSelectTask(taskName, modelIds);
    }
  };

  // Build header text
  const headerText = selectedTask ? `Tasks: [${selectedTask}]` : "Tasks";

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-indigo-900/40 dark:bg-gray-900/70 backdrop-blur-sm border-pink-300/30 dark:border-pink-800/30 shadow-neon">
        <CardContent className="p-4">
          <CollapsibleTrigger className="w-full">
            <h4 className="text-base font-semibold flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <LightbulbIcon className="h-4 w-4 text-pink-500 pixel-art flex-shrink-0" />
              <span className="truncate text-base text-cyan-300 dark:text-cyan-400 retro-text">
                Tasks
              </span>
              {selectedTask && (
                <span className="truncate text-sm text-cyan-400 dark:text-cyan-300 font-normal">
                  [{selectedTask}]
                </span>
              )}
              <ChevronRight className={`h-4 w-4 text-pink-500 ml-auto transition-transform ${isOpen ? 'rotate-90' : ''}`} />
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
                        ? "bg-gradient-to-r from-pink-500 to-cyan-500 text-gray-900 font-semibold border-cyan-400 hover:from-pink-600 hover:to-cyan-600"
                        : "border-pink-300/30 dark:border-pink-800/30 bg-indigo-800/30 dark:bg-gray-800/30 text-cyan-200 hover:bg-indigo-700/50 dark:hover:bg-gray-700/50"
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
