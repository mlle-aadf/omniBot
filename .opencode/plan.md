# Model Selection UI Upgrade

## Context

OmniBot is a multi-AI query app that lets users send one prompt to multiple LLMs and compare responses. The current model selector is a flat checkbox list with no metadata. The task selector is a 2-column button grid that destructively replaces model selections.

**Goals:**
- Make model browsing richer and more educational (show provider, origin, speed, tier)
- Add quick-action presets (randomizer, fast picks, international mix, clear)
- Add sort/filter/group controls
- Limit selection to 6 models max (simple hard cap)
- Make task presets non-destructive (highlight instead of replace)
- Replace task set with: Chat, Write, Analyze, Translate, Brainstorm (drop Code)

---

## Phase 1: Model Metadata Foundation

**Goal:** Create a rich model data layer that all other phases depend on.

### 1.1 Expand `AIModel` type in `src/lib/types.ts`

```typescript
export type ModelOrigin = 'US' | 'CN' | 'FR' | 'KR' | 'EU';
export type ModelTier = 'open' | 'premium' | 'fast';
export type ModelSpeed = 'fast' | 'mid' | 'slow';
export type ModelSpecialty = 'chat' | 'write' | 'analyze' | 'translate' | 'brainstorm';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  origin: ModelOrigin;
  tier: ModelTier;
  speed: ModelSpeed;
  specialties: ModelSpecialty[];
}
```

### 1.2 Create `src/lib/modelData.ts`

Move model definitions out of `MultiAIQuery.tsx` into a dedicated data file.

```typescript
import { AIModel } from './types';

export const availableModels: AIModel[] = [
  // US Premium
  { id: 'claude-sonnet',    name: 'Claude Sonnet 4.6',      provider: 'Anthropic',  origin: 'US', tier: 'premium', speed: 'mid',  specialties: ['write', 'analyze', 'brainstorm'] },
  { id: 'gpt-mini',         name: 'GPT-5.4 Mini',           provider: 'OpenAI',     origin: 'US', tier: 'premium', speed: 'fast', specialties: ['chat', 'write', 'analyze'] },
  { id: 'gemini-flash',     name: 'Gemini 3 Flash',         provider: 'Google',     origin: 'US', tier: 'premium', speed: 'fast', specialties: ['chat', 'brainstorm'] },

  // US Fast
  { id: 'claude-haiku',     name: 'Claude Haiku 4.5',       provider: 'Anthropic',  origin: 'US', tier: 'fast',    speed: 'fast', specialties: ['chat', 'write'] },
  { id: 'gemini-flash-lite',name: 'Gemini 3.1 Flash Lite',  provider: 'Google',     origin: 'US', tier: 'fast',    speed: 'fast', specialties: ['chat', 'translate'] },
  { id: 'gpt-nano',         name: 'GPT-5.4 Nano',           provider: 'OpenAI',     origin: 'US', tier: 'fast',    speed: 'fast', specialties: ['chat'] },
  { id: 'nemotron',         name: 'Nemotron 3 Nano',        provider: 'NVIDIA',     origin: 'US', tier: 'fast',    speed: 'fast', specialties: ['chat'] },

  // US Open
  { id: 'olmo-instruct',    name: 'OLMo 3.1 32B',           provider: 'AI2',        origin: 'US', tier: 'open',    speed: 'mid',  specialties: ['chat', 'write'] },
  { id: 'olmo-think',       name: 'OLMo 3.1 32B Think',     provider: 'AI2',        origin: 'US', tier: 'open',    speed: 'slow', specialties: ['analyze'] },
  { id: 'trinity',          name: 'Trinity Large',           provider: 'Arcee AI',   origin: 'US', tier: 'open',    speed: 'mid',  specialties: ['chat'] },

  // CN
  { id: 'deepseek',         name: 'DeepSeek V3.2',          provider: 'DeepSeek',   origin: 'CN', tier: 'open',    speed: 'mid',  specialties: ['chat', 'analyze', 'translate'] },
  { id: 'deepseek-special', name: 'DeepSeek V3.2 Special',  provider: 'DeepSeek',   origin: 'CN', tier: 'open',    speed: 'slow', specialties: ['analyze'] },
  { id: 'qwen-flash',       name: 'Qwen 3.5 Flash',         provider: 'Alibaba',    origin: 'CN', tier: 'open',    speed: 'fast', specialties: ['chat', 'translate'] },
  { id: 'qwen-27b',         name: 'Qwen 3.5 27B',           provider: 'Alibaba',    origin: 'CN', tier: 'open',    speed: 'mid',  specialties: ['write', 'translate'] },
  { id: 'glm',              name: 'GLM-4.7 Flash',          provider: 'Zhipu',      origin: 'CN', tier: 'open',    speed: 'fast', specialties: ['chat', 'translate'] },
  { id: 'seed',             name: 'Seed 2.0 Mini',           provider: 'ByteDance',  origin: 'CN', tier: 'open',    speed: 'fast', specialties: ['chat', 'translate'] },
  { id: 'minimax',          name: 'MiniMax M2.7',            provider: 'MiniMax',    origin: 'CN', tier: 'open',    speed: 'mid',  specialties: ['chat', 'brainstorm'] },

  // FR / EU
  { id: 'mistral-small',    name: 'Mistral Small 2603',     provider: 'Mistral',    origin: 'FR', tier: 'premium', speed: 'mid',  specialties: ['write', 'translate'] },
  { id: 'devstral',         name: 'Devstral 2512',          provider: 'Mistral',    origin: 'FR', tier: 'open',    speed: 'mid',  specialties: ['analyze'] },
];
```

### 1.3 Update `src/lib/ai-clients.ts`

No changes needed — `MODEL_CONFIG` stays as the ID-to-Puter mapping. It's independent of the metadata layer.

### 1.4 Update `src/components/MultiAIQuery.tsx`

- Remove the inline `availableModels` array (lines 19-39)
- Import `availableModels` from `@/lib/modelData`
- Replace the `AIModel` import from `types.ts` with the expanded version

**Acceptance criteria:** App still works identically. Models load from modelData.ts. No visual changes yet.

---

## Phase 2: Task Preset Rework

**Goal:** Replace the 6 tasks with 5 new ones. Make task selection non-destructive (highlights instead of replacing selections).

### 2.1 Update `src/lib/taskData.ts`

Replace task definitions and mappings. Use model IDs instead of display names.

```typescript
import { AIModel } from './types';

export interface Task {
  id: string;
  name: string;
  description: string;
}

export const tasks: Task[] = [
  { id: 'chat',      name: 'Chat',      description: 'Everyday Q&A, quick answers, conversations.' },
  { id: 'write',     name: 'Write',     description: 'Create blog posts, stories, emails, marketing copy.' },
  { id: 'analyze',   name: 'Analyze',   description: 'Math, logic, summarization, breaking down complex info.' },
  { id: 'translate', name: 'Translate', description: 'Convert text between languages accurately.' },
  { id: 'brainstorm',name: 'Brainstorm',description: 'Generate ideas, explore possibilities, creative problem-solving.' },
];

// Maps task ID to recommended model IDs
export const taskModelMapping: Record<string, string[]> = {
  chat:      ['gpt-nano', 'gemini-flash-lite', 'claude-haiku', 'nemotron', 'qwen-flash', 'glm'],
  write:     ['claude-sonnet', 'qwen-27b', 'mistral-small', 'gpt-mini', 'olmo-instruct'],
  analyze:   ['olmo-think', 'claude-sonnet', 'gpt-mini', 'deepseek-special', 'devstral'],
  translate: ['deepseek', 'qwen-flash', 'glm', 'seed', 'mistral-small'],
  brainstorm:['claude-sonnet', 'gemini-flash', 'qwen-27b', 'minimax', 'mistral-small'],
};
```

### 2.2 Update `src/components/TaskSelector.tsx`

**Key change:** Task selection no longer calls `onSelectTask(taskName, modelIds)` with replacement IDs. Instead it only sets the task name for highlighting purposes.

```typescript
// BEFORE (destructive):
const handleTaskSelect = (taskName: string) => {
  if (selectedTask === taskName) {
    onSelectTask(null, []);
  } else {
    const modelIds = preselectModelsForTask(taskName, availableModels);
    onSelectTask(taskName, modelIds);  // REPLACES all selections
  }
};

// AFTER (non-destructive):
const handleTaskSelect = (taskName: string) => {
  onSelectTask(selectedTask === taskName ? null : taskName);  // Only toggles task name
};
```

- Remove the "apply suggested" button from the component (keep it simple for now — just highlight)
- Keep the 2-column grid layout but update task names
- Update `onSelectTask` signature to `(taskName: string | null) => void` (no model IDs param)

### 2.3 Update `src/components/MultiAIQuery.tsx` — task handler

```typescript
// BEFORE:
const handleTaskSelect = (taskName: string | null, modelIds: string[]) => {
  setSelectedTask(taskName);
  setSelectedModels(modelIds);  // This line gets removed
};

// AFTER:
const handleTaskSelect = (taskName: string | null) => {
  setSelectedTask(taskName);
};
```

### 2.4 Update `src/components/features/QueryForm.tsx`

- Update `TaskSelector` props to match new signature (remove `availableModels` prop, update `onSelectTask` type)
- Update the `onSelectTask` prop type in `QueryFormProps`

**Acceptance criteria:** Tasks highlight recommended models (Phase 3 adds the star). Clicking a task twice deselects it. Manual model selections are never overwritten by task selection.

---

## Phase 3: ModelSelector UI Overhaul

**Goal:** Rich model list with metadata badges, header action presets, sort/filter/group, selection cap.

### 3.1 Header action presets

Add a row of icon buttons above the search bar in ModelSelector:

| Icon | Label | Behavior |
|---|---|---|
| `Dices` (lucide) | Randomizer | Picks 3-4 random models (replace current selection). Re-roll on each click. |
| `Zap` (lucide) | Fast picks | Selects all `speed: 'fast'` models (up to cap of 6). |
| `Globe` (lucide) | Intl. mix | Picks one model per unique origin country. |
| `Star` (lucide) | Premium | Selects all `tier: 'premium'` models. |
| `Eraser` / `X` | Clear | Deselects all models. |

Implementation: Render as small icon buttons in a horizontal row. Each has a tooltip. When a preset is active, the button gets a highlighted style.

### 3.2 Sort dropdown

Add a compact `<Select>` (from existing `ui/select.tsx`) above the model list:

Options:
- **Default** — original order (by provider, then name)
- **Speed** — fast first, then mid, then slow
- **Quality** — premium first, then open, then fast
- **Provider** — alphabetical by provider

Implementation: Store as `selectedSort` state in ModelSelector (local, not persisted). Sort `filteredModels` array before rendering.

### 3.3 Group filter pills

Add a row of clickable `<Badge>` pills below the sort:

- **All** (default, active)
- **Fast** — filter to `speed: 'fast'`
- **Balanced** — filter to `speed: 'mid'`
- **Open** — filter to `tier: 'open'`
- **Premium** — filter to `tier: 'premium'`

Implementation: Store as `selectedGroup` state in ModelSelector (local). Filter `models` before sorting. Pills use the existing `Badge` component with variant toggling.

### 3.4 Model row with info popover

Each model row stays clean and minimal:

```
☐  Claude Sonnet 4.6  ⭐  ℹ
```

Visible in row:
- **Checkbox** — existing, but disabled when cap reached and model not selected
- **Model name** — existing text
- **Task star** — small ⭐ rendered when `model.id` is in `taskModelMapping[selectedTask]` (recommends this model for the selected task)
- **Info icon** — small `(i)` or `Info` icon, hover/tap reveals a popover with full metadata:

Popover content on hover:
```
Provider: Anthropic
Origin: US
Speed: Mid
Tier: Premium
Strengths: Writing, Analysis, Brainstorming
```

- Use Radix `Tooltip` (or `Popover` for mobile tap support) to display metadata
- Premium models get a small ★ star next to the tier label inside the popover (not inline in the row)
- This keeps the row height compact and the list scannable while preserving the educational layer

### 3.5 Selection cap (6 max)

- When `selectedModels.length >= 6`, disable unchecked model checkboxes
- Counter is shown in the collapsible header only, updating the existing `[count]` badge to `"Bots [3/6]"` format (instead of the current `"Bots [3]"`)

### 3.6 Update component interface

```typescript
interface ModelSelectorProps {
  availableModels: AIModel[];
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
  selectedTask: string | null;           // NEW: for highlighting recommended models
  taskModelMapping: Record<string, string[]>;  // NEW: for star calculation
}
```

### 3.7 Cap enforcement in `MultiAIQuery.tsx`

Update `toggleModel`:

```typescript
const MAX_MODELS = 6;

const toggleModel = (modelId: string) => {
  setSelectedModels(prev => {
    if (prev.includes(modelId)) {
      return prev.filter(id => id !== modelId);
    }
    if (prev.length >= MAX_MODELS) {
      return prev;  // Don't add beyond cap
    }
    return [...prev, modelId];
  });
};
```

**Acceptance criteria:** Header action presets work (dice, lightning, globe, star, clear). Sort dropdown changes model order. Group pills filter the list. Each model row is compact (checkbox + name + ⭐ + ℹ). Hovering ℹ shows popover with provider, origin, speed, tier, strengths. Task star appears on recommended models. Premium star shows inside popover. Max 6 models selectable, counter shows "Bots [#/6]" in header only.

---

## Phase 4: Wire Up & Polish

**Goal:** Connect all pieces, update mobile layout, ensure consistency.

### 4.1 Update `QueryForm.tsx` — mobile layout

- Update mobile top bar pill badges: show selected count, selected task, and active filter (if any)
- Ensure drawer layout accommodates the taller ModelSelector (with header presets + sort + groups)
- Test that the model list scrolls properly on mobile with the new header elements

### 4.2 Update `QueryForm.tsx` — props

Pass new props to `ModelSelector`:

```typescript
<ModelSelector
  availableModels={availableModels}
  selectedModels={selectedModels}
  onToggleModel={onToggleModel}
  selectedTask={selectedTask}
  taskModelMapping={taskModelMapping}
/>
```

### 4.3 Update `TaskSelector.tsx` — props

Remove `availableModels` prop (no longer needed since tasks don't replace selections):

```typescript
interface TaskSelectorProps {
  selectedTask: string | null;
  onSelectTask: (taskName: string | null) => void;
}
```

### 4.4 Update `MultiAIQuery.tsx` — prop wiring

Ensure `QueryForm` receives and passes all new props correctly.

### 4.5 Clean up legacy code

- Delete `src/components/ui/task-selector.tsx` (legacy, unused)
- Remove any dead imports

**Acceptance criteria:** Full flow works end-to-end. Desktop sidebar and mobile drawer both display correctly. All presets, sort, filter, tasks, and cap work together without conflicts.

---

## File Change Summary

| File | Phase | Action |
|---|---|---|
| `src/lib/types.ts` | 1 | Expand AIModel interface, add type aliases |
| `src/lib/modelData.ts` | 1 | **CREATE** — model definitions with metadata |
| `src/lib/taskData.ts` | 2 | Replace tasks, switch mapping to use IDs |
| `src/components/MultiAIQuery.tsx` | 1, 2, 4 | Import from modelData, update handlers, add cap |
| `src/components/ModelSelector.tsx` | 3 | **Major rewrite** — header presets, sort, filter, badges, cap UI |
| `src/components/TaskSelector.tsx` | 2 | Make non-destructive, update props |
| `src/components/features/QueryForm.tsx` | 2, 4 | Update props, mobile layout |
| `src/components/ui/task-selector.tsx` | 4 | **DELETE** — orphaned legacy file |

## Notes

- The `Badge` component (`src/components/ui/badge.tsx`) already exists and is unused — Phase 3 will use it for group filter pills.
- The `Select` component (`src/components/ui/select.tsx`) already exists and is unused — Phase 3 will use it for the sort dropdown.
- Model metadata is shown via hover popover on an `(i)` icon, not inline in each row — keeps the list compact.
- `MODEL_CONFIG` in `ai-clients.ts` is unchanged — it's the Puter API mapping and doesn't need metadata.
- All new state (sort, group) is local to ModelSelector, not persisted. Only `selectedModels` and `selectedTask` persist via `useLocalStorage`.
