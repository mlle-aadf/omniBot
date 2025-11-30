
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ViewLayout } from "@/lib/types";
import { Columns, Rows, RefreshCw } from "lucide-react";

interface ViewControlsProps {
  viewLayout: ViewLayout;
  setViewLayout: (layout: ViewLayout) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function ViewControls({
  viewLayout,
  setViewLayout,
  onRefresh,
  isLoading,
}: ViewControlsProps) {
  return (
    <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-purple-100 dark:border-gray-700 shadow-md">
      <CardContent className="p-2 flex items-center justify-between">
        <div className="flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={viewLayout === "columns" ? "bg-purple-100 dark:bg-gray-800" : ""}
                  onClick={() => setViewLayout("columns")}
                >
                  <Columns className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Columns View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={viewLayout === "rows" ? "bg-purple-100 dark:bg-gray-800" : ""}
                  onClick={() => setViewLayout("rows")}
                >
                  <Rows className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rows View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={isLoading}
                onClick={onRefresh}
                className="ml-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh Results</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
