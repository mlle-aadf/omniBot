
# UI Improvements: Pill Buttons, Selection Highlighting, and Typography

## Overview
This plan transforms the ModelSelector from checkboxes to pill-buttons (matching TaskSelector), adds visual highlighting for selected items in both components, and improves overall legibility with a better font and larger text sizes.

---

## Changes Summary

### 1. Convert ModelSelector to Pill-Buttons
Replace the current checkbox + label format with a grid of pill-buttons, matching the TaskSelector layout.

**File: `src/components/ModelSelector.tsx`**
- Remove `Checkbox` import
- Change from vertical list layout to 2-column grid (like TaskSelector)
- Use `Button` components styled as pill-buttons
- Keep toggle behavior (clicking selects/deselects)

### 2. Add Selection Highlighting with Inverted Colors
Create clear visual distinction between selected and unselected states for both Bots and Tasks.

**Selected state styling:**
- Colored background (cyan/pink gradient)
- Dark text color

**Unselected state styling:**
- Dark/transparent background
- Colored text (cyan)

**Files affected:**
- `src/components/ModelSelector.tsx` - Add conditional styling based on `selectedModels`
- `src/components/TaskSelector.tsx` - Track selected task and apply inverted colors

**Note:** TaskSelector needs state to track which task is currently selected (adding `selectedTask` state)

### 3. Improve Typography and Legibility
Switch to "Source Code Pro" font and increase text sizes.

**File: `src/index.css`**
- Import "Source Code Pro" from Google Fonts
- Replace "VT323" with "Source Code Pro" as the body font
- Keep "Press Start 2P" for headers (OmniBot title, section headers)
- Increase base font size from 1.1rem to 1.15rem

**File: `src/components/MultiAIQuery.tsx`**
- Add larger text class to Textarea for prompt input

---

## Technical Details

### ModelSelector Transformation

Current structure (checkbox list):
```text
+---------------------------+
| [ ] GPT-4                 |
| [ ] Gemini                |
| [ ] Claude                |
+---------------------------+
```

New structure (pill-button grid):
```text
+---------------------------+
| [GPT-4]  [Gemini]         |
| [Claude] [Deepseek]       |
| [Grok]   [Llama]          |
+---------------------------+
```

### Color Scheme for Selection States

**Selected (inverted):**
- Background: `bg-gradient-to-r from-pink-500 to-cyan-500`
- Text: `text-gray-900` (dark)
- Border: `border-cyan-400`

**Unselected:**
- Background: `bg-indigo-800/30` (dark/transparent)
- Text: `text-cyan-200` (colored)
- Border: `border-pink-300/30`

### TaskSelector Enhancement
Add `selectedTask` state to track which task is currently active, allowing proper highlight styling.

### Font Changes

| Element | Current | New |
|---------|---------|-----|
| Body text | VT323 (1.1rem) | Source Code Pro (1.15rem) |
| Headers | Press Start 2P | Press Start 2P (unchanged) |
| Textarea | Default | text-lg class added |
| Placeholder | Default | text-lg (inherited) |

---

## Files to Modify

1. **`src/index.css`**
   - Add Source Code Pro font import
   - Update body font-family
   - Increase base font-size

2. **`src/components/ModelSelector.tsx`**
   - Remove Checkbox, add Button
   - Change layout to grid
   - Add selection-based conditional styling

3. **`src/components/TaskSelector.tsx`**
   - Add `selectedTask` state
   - Apply inverted colors for selected task

4. **`src/components/MultiAIQuery.tsx`**
   - Add `text-lg` class to Textarea for larger prompt text
