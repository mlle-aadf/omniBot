import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AIModel, ModelSpecialty } from "@/lib/types";
import { Brain, ChevronRight, Dices, Eraser, Globe, Info, Search, Star, Zap } from "lucide-react";
import { useState, useMemo } from "react";

const MAX_MODELS = 6;
const SPEED_ORDER: Record<string, number> = { fast: 0, mid: 1, slow: 2 };
const TIER_ORDER: Record<string, number> = { premium: 0, open: 1, fast: 2 };

const specialtyLabels: Record<ModelSpecialty, string> = {
  chat: 'Chat',
  write: 'Writing',
  analyze: 'Analysis',
  translate: 'Translation',
  brainstorm: 'Brainstorming',
};

interface ModelSelectorProps {
  availableModels: AIModel[];
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
  onSetModels: (modelIds: string[]) => void;
  selectedTask: string | null;
  taskModelMapping: Record<string, string[]>;
}

export default function ModelSelector({
  availableModels,
  selectedModels,
  onToggleModel,
  onSetModels,
  selectedTask,
  taskModelMapping,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSort, setSelectedSort] = useState("default");
  const [selectedGroup, setSelectedGroup] = useState("all");

  // Header preset handlers
  const handleRandomizer = () => {
    const count = Math.random() < 0.5 ? 3 : 4;
    const shuffled = [...availableModels].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, Math.min(count, MAX_MODELS)).map(m => m.id);
    onSetModels(picked);
  };

  const handleFastPicks = () => {
    const fastModels = availableModels.filter(m => m.speed === 'fast').slice(0, MAX_MODELS);
    onSetModels(fastModels.map(m => m.id));
  };

  const handleIntlMix = () => {
    const origins = new Set(availableModels.map(m => m.origin));
    const picked: string[] = [];
    for (const origin of origins) {
      const model = availableModels.find(m => m.origin === origin);
      if (model) picked.push(model.id);
    }
    onSetModels(picked.slice(0, MAX_MODELS));
  };

  const handlePremium = () => {
    const premiumModels = availableModels.filter(m => m.tier === 'premium').slice(0, MAX_MODELS);
    onSetModels(premiumModels.map(m => m.id));
  };

  const handleClear = () => {
    onSetModels([]);
  };

  // Filter by search and group
  const filteredModels = useMemo(() => {
    let models = availableModels;

    // Search filter
    if (search) {
      const lower = search.toLowerCase();
      models = models.filter(m =>
        m.name.toLowerCase().includes(lower) ||
        m.provider.toLowerCase().includes(lower)
      );
    }

    // Group filter
    if (selectedGroup !== 'all') {
      switch (selectedGroup) {
        case 'fast':
          models = models.filter(m => m.speed === 'fast');
          break;
        case 'balanced':
          models = models.filter(m => m.speed === 'mid');
          break;
        case 'open':
          models = models.filter(m => m.tier === 'open');
          break;
        case 'premium':
          models = models.filter(m => m.tier === 'premium');
          break;
      }
    }

    // Sort
    switch (selectedSort) {
      case 'speed':
        models = [...models].sort((a, b) => SPEED_ORDER[a.speed] - SPEED_ORDER[b.speed]);
        break;
      case 'quality':
        models = [...models].sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]);
        break;
      case 'provider':
        models = [...models].sort((a, b) => a.provider.localeCompare(b.provider) || a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return models;
  }, [availableModels, search, selectedGroup, selectedSort]);

  const recommendedModelIds = selectedTask ? taskModelMapping[selectedTask] || [] : [];
  const capReached = selectedModels.length >= MAX_MODELS;

  const activePreset = (() => {
    if (selectedModels.length === 0) return null;
    const fastIds = availableModels.filter(m => m.speed === 'fast').slice(0, MAX_MODELS).map(m => m.id);
    const premiumIds = availableModels.filter(m => m.tier === 'premium').slice(0, MAX_MODELS).map(m => m.id);
    if (selectedModels.length === fastIds.length && fastIds.every(id => selectedModels.includes(id))) return 'fast';
    if (selectedModels.length === premiumIds.length && premiumIds.every(id => selectedModels.includes(id))) return 'premium';
    return null;
  })();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-card backdrop-blur-sm border-border shadow-neon">
        <CardContent className="p-4">
          <CollapsibleTrigger className="w-full">
            <h4 className="text-base font-semibold text-primary flex items-center gap-2 retro-text cursor-pointer hover:opacity-80 transition-opacity">
              <Brain className="h-4 w-4 text-accent pixel-art flex-shrink-0" />
              <span className="truncate">Bots</span>
              <span className="text-sm text-accent font-normal">[{selectedModels.length}/{MAX_MODELS}]</span>
              <ChevronRight className={`h-4 w-4 text-muted-foreground ml-auto transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </h4>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-3 flex flex-col gap-2">
            {/* Header action presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleRandomizer}
                    className={`p-1.5 rounded-md transition-colors ${activePreset === null && selectedModels.length > 0 ? 'hover:bg-secondary/70' : ''}`}
                  >
                    <Dices className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Randomizer (3-4 models)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleFastPicks}
                    className={`p-1.5 rounded-md transition-colors ${activePreset === 'fast' ? 'bg-accent/20 text-accent' : 'hover:bg-secondary/70'}`}
                  >
                    <Zap className={`h-3.5 w-3.5 ${activePreset === 'fast' ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Fast picks</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleIntlMix}
                    className="p-1.5 rounded-md hover:bg-secondary/70 transition-colors"
                  >
                    <Globe className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">International mix</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handlePremium}
                    className={`p-1.5 rounded-md transition-colors ${activePreset === 'premium' ? 'bg-accent/20 text-accent' : 'hover:bg-secondary/70'}`}
                  >
                    <Star className={`h-3.5 w-3.5 ${activePreset === 'premium' ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Premium models</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 rounded-md hover:bg-secondary/70 transition-colors"
                  >
                    <Eraser className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Clear all</TooltipContent>
              </Tooltip>
            </div>

            {/* Search */}
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

            {/* Sort dropdown */}
            <Select value={selectedSort} onValueChange={setSelectedSort}>
              <SelectTrigger className="h-8 text-sm bg-secondary/50 border-border focus-visible:ring-accent">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="speed">Speed</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
                <SelectItem value="provider">Provider</SelectItem>
              </SelectContent>
            </Select>

            {/* Group filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'All' },
                { id: 'fast', label: 'Fast' },
                { id: 'balanced', label: 'Balanced' },
                { id: 'open', label: 'Open' },
                { id: 'premium', label: 'Premium' },
              ].map(group => (
                <Badge
                  key={group.id}
                  variant={selectedGroup === group.id ? 'default' : 'outline'}
                  className={`cursor-pointer text-xs transition-colors ${
                    selectedGroup === group.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setSelectedGroup(group.id)}
                >
                  {group.label}
                </Badge>
              ))}
            </div>

            {/* Model list */}
            <div className="flex flex-col gap-1 max-h-[28vh] overflow-y-auto pr-1 custom-scrollbar">
              {filteredModels.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-3">No models match your search.</p>
              ) : (
                filteredModels.map((model) => {
                  const isSelected = selectedModels.includes(model.id);
                  const isRecommended = recommendedModelIds.includes(model.id);
                  const isDisabled = capReached && !isSelected;

                  return (
                    <label
                      key={model.id}
                      htmlFor={`model-${model.id}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors duration-150 select-none ${
                        isDisabled ? 'opacity-40 cursor-not-allowed' : ''
                      } ${
                        isSelected
                          ? "bg-primary/15 text-foreground"
                          : "hover:bg-secondary/70 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Checkbox
                        id={`model-${model.id}`}
                        checked={isSelected}
                        onCheckedChange={() => !isDisabled && onToggleModel(model.id)}
                        disabled={isDisabled}
                      />
                      <span className="text-sm font-medium leading-none flex-1 truncate">{model.name}</span>
                      {isRecommended && (
                        <Star className="h-3 w-3 text-accent flex-shrink-0 fill-accent" />
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 hover:text-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-[220px]">
                          <div className="space-y-1 text-xs">
                            <div><span className="text-muted-foreground">Provider:</span> {model.provider}</div>
                            <div><span className="text-muted-foreground">Origin:</span> {model.origin}</div>
                            <div><span className="text-muted-foreground">Speed:</span> {model.speed.charAt(0).toUpperCase() + model.speed.slice(1)}</div>
                            <div>
                              <span className="text-muted-foreground">Tier:</span> {model.tier.charAt(0).toUpperCase() + model.tier.slice(1)}
                              {model.tier === 'premium' && <span className="ml-1 text-yellow-400">★</span>}
                            </div>
                            <div><span className="text-muted-foreground">Strengths:</span> {model.specialties.map(s => specialtyLabels[s]).join(', ')}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
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