import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTheme } from "@/hooks/useTheme";
import { ResponseLength, ViewLayout } from "@/lib/types";
import { Columns, Moon, Rows, Settings, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SettingsDropdownProps {
  viewLayout: ViewLayout;
  setViewLayout: (layout: ViewLayout) => void;
  responseLength: ResponseLength;
  setResponseLength: (length: ResponseLength) => void;
}

export default function SettingsDropdown({ 
  viewLayout, 
  setViewLayout,
  responseLength,
  setResponseLength
}: SettingsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [persistedLayout, setPersistedLayout] = useLocalStorage<ViewLayout>("viewLayout", "columns");

  useEffect(() => {
    if (persistedLayout) {
      setViewLayout(persistedLayout);
    }
  }, [persistedLayout, setViewLayout]);

  useEffect(() => {
    setPersistedLayout(viewLayout);
  }, [viewLayout, setPersistedLayout]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const responseLengthOptions: { value: ResponseLength; emoji: string; label: string }[] = [
    { value: "brief", emoji: "🎯", label: "Brief" },
    { value: "balanced", emoji: "💬", label: "Balanced" },
    { value: "detailed", emoji: "📚", label: "Detailed" }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDropdown}
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-card text-card-foreground border-border">
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isOpen && createPortal(
        <>
          <div className="fixed inset-0 z-[99] bg-black/80" onClick={() => setIsOpen(false)} />
          <Card className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 lg:absolute lg:left-auto lg:translate-x-0 lg:right-0 lg:top-auto lg:translate-y-0 z-[100] mt-2 w-72 p-4 bg-card border-border shadow-neon backdrop-blur-sm animate-fade-in rounded-lg">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2 text-foreground">Theme</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Light</span>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
                />
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">Dark</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 text-foreground">Layout</h3>
              <div className="flex flex-col gap-2">
                <Toggle
                  pressed={viewLayout === "columns"}
                  onPressedChange={() => setViewLayout("columns")}
                  className="justify-start data-[state=on]:bg-primary/20 data-[state=on]:text-primary hover:bg-accent hover:text-accent-foreground"
                  aria-label="Columns layout"
                >
                  <Columns className="h-4 w-4 mr-2" />
                  Columns
                </Toggle>
                <Toggle
                  pressed={viewLayout === "rows"}
                  onPressedChange={() => setViewLayout("rows")}
                  className="justify-start data-[state=on]:bg-primary/20 data-[state=on]:text-primary hover:bg-accent hover:text-accent-foreground"
                  aria-label="Rows layout"
                >
                  <Rows className="h-4 w-4 mr-2" />
                  Rows
                </Toggle>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 text-foreground">Responses</h3>
              <div className="flex gap-1">
                {responseLengthOptions.map((option) => {
                  const isSelected = responseLength === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setResponseLength(option.value)}
                      className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <span className="mr-1">{option.emoji}</span>
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
        </>,
        document.body
      )}
    </div>
  );
}
