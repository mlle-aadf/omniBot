

# Mobile-First Responsive Redesign

## Problem
On mobile, the query form takes too much vertical space even at 45vh, leaving little room for responses. Both selectors should be collapsible but currently only Bots is.

## Solution: Bottom Sheet Modal on Mobile

**Desktop (lg+):** Keep current sidebar layout, no changes.

**Mobile/Tablet (<lg):** Replace the sidebar with:
1. A compact **top bar** showing: OmniBot title, selected model/task summary chips, settings button, and a "Prompt" button
2. Tapping "Prompt" opens a **Sheet (bottom drawer)** containing the full form (model selector, task selector, textarea, submit/stop buttons)
3. After submitting, the sheet auto-closes and responses fill the full screen

This uses the existing `vaul` drawer component (`src/components/ui/drawer.tsx`).

## Changes

### `src/components/features/QueryForm.tsx`
- Split into two rendering modes using `useIsMobile()` hook
- **Mobile:** Render a compact top bar + `Drawer` containing the form content
- **Desktop:** Render current sidebar layout unchanged
- Auto-close drawer on form submit

### `src/components/ModelSelector.tsx`
- Both desktop and mobile: start collapsed by default (change `useState(true)` → `useState(false)`)
- Show selected count in header: "Bots [3]"

### `src/components/TaskSelector.tsx`
- Already collapses when a task is selected — no changes needed (it was already collapsible, the user's concern was about ModelSelector)

### `src/components/MultiAIQuery.tsx`
- No structural changes needed — QueryForm already receives all necessary props

## Mobile Layout

```text
+----------------------------------+
| 🤖 OmniBot  [GPT-4,Claude] [⚙️] [📝 Prompt] |  <- compact bar
+----------------------------------+
|                                  |
|   Response cards (full screen)   |
|   with resizable split panes    |
|                                  |
+----------------------------------+

Tap "Prompt" → bottom drawer slides up:
+----------------------------------+
| Bots ▸  [3 selected]            |
| Tasks ▸ [Summarize]             |
| ┌──────────────────────────────┐ |
| │ Enter your prompt...         │ |
| └──────────────────────────────┘ |
| [Query Selected AIs]      [Stop]|
+----------------------------------+
```

