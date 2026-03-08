

# Resizable Split Panes for Response Cards

## Approach
Use `react-resizable-panels` (already installed) to replace the CSS grid with draggable split panes. Each response card becomes a panel with a drag handle between them. Users can resize to give more space to any response.

## Layout

```text
Columns view (2-4 models):
+--------+|+--------+|+--------+|+--------+
| GPT-4  ||| Gemini ||| Claude ||| Deep.. |
|        |||        |||        |||        |
| scroll |||  scroll|||  scroll|||  scroll|
+--------+|+--------+|+--------+|+--------+
           ^drag      ^drag      ^drag

Rows view:
+------------------------------------+
| GPT-4          (scrollable)        |
+====================================+  <- drag handle
| Gemini         (scrollable)        |
+====================================+  <- drag handle
| Claude         (scrollable)        |
+------------------------------------+

1-2 models: single row of horizontal panes
3-4 models: single row of horizontal panes
5+ models: 2 rows of horizontal panes (split vertically first)
```

## Changes

### `src/components/features/ResultsGrid.tsx`
- Import `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle` from `@/components/ui/resizable`
- Replace CSS grid with `ResizablePanelGroup`
- Columns view: `direction="horizontal"`, each card in a `ResizablePanel`
- Rows view: `direction="vertical"`, each card in a `ResizablePanel`
- For 5+ models in columns: nest two horizontal groups inside a vertical group (2 rows)
- Remove `expandedCards` and `toggleCard` props entirely

### `src/components/ResponseCard.tsx`
- Remove `isExpanded` / `onToggleExpand` props
- Always show content with `flex-1 overflow-auto`
- Keep maximize button only
- Card fills its panel: `h-full flex flex-col`

### `src/components/MultiAIQuery.tsx`
- Remove `expandedCards` state and `toggleCard` function
- Remove `expandedCards`/`toggleCard` from ResultsGrid props
- Simplify `handleSubmit` (no expandedCards setup)

### `src/components/ui/resizable.tsx` (existing)
- May style the drag handle for better visibility (accent color on hover)

