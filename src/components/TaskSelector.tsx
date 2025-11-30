import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { preselectModelsForTask, tasks } from "@/lib/taskData";
import { AIModel } from "@/lib/types";
import { LightbulbIcon, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface TaskSelectorProps {
  availableModels: AIModel[];
  onSelectTask: (modelIds: string[]) => void;
}

export default function TaskSelector({
  availableModels,
  onSelectTask,
}: TaskSelectorProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  const handleTaskSelect = (taskName: string) => {
    const modelIds = preselectModelsForTask(taskName, availableModels);
    onSelectTask(modelIds);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-indigo-900/40 dark:bg-gray-900/70 backdrop-blur-sm border-pink-300/30 dark:border-pink-800/30 shadow-neon">
        <CardContent className="p-4">
          <CollapsibleTrigger className="w-full">
            <h4 className="text-base font-semibold text-cyan-300 dark:text-cyan-400 flex items-center gap-2 retro-text cursor-pointer hover:text-cyan-200 transition-colors">
              <LightbulbIcon className="h-4 w-4 text-pink-500 pixel-art flex-shrink-0" />
              <span className="truncate">Tasks</span>
              <ChevronRight className={`h-4 w-4 text-pink-500 ml-auto transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </h4>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-3">
            <div className="grid grid-cols-2 gap-2 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
              {tasks.map((task) => (
                <Button
                  key={task.name}
                  onClick={() => handleTaskSelect(task.name)}
                  variant="outline"
                  className="text-sm p-2 h-auto border-pink-300/30 dark:border-pink-800/30 bg-indigo-800/30 dark:bg-gray-800/30 text-cyan-200 hover:bg-indigo-700/50 dark:hover:bg-gray-700/50 flex flex-col items-start"
                  title={task.description}
                >
                  <span className="font-semibold">{task.name}</span>
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
}
