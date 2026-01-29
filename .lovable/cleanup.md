# Project Cleanup & Overhaul Plan

This document outlines the step-by-step plan to refactor the Omnibot application, addressing architectural, type safety, and code quality issues.

## 1. Type Safety & Configuration (The Foundation)

We cannot refactor effectively without a safety net.

1.  **Strict TypeScript Config**
    *   **Action**: Update `tsconfig.json` and `tsconfig.app.json`.
    *   **Details**: Set `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`.
    *   **Goal**: Catch potential runtime errors during build time.

2.  **Global Types Definition**
    *   **Action**: Update `src/vite-env.d.ts` (or create `src/types/global.d.ts`).
    *   **Details**: Properly define the `window.puter` interface so we stop using `any` or implicit globals.
    *   **Goal**: Type-safe interactions with the OS API.

## 2. Data Layer Refactoring (DRY Principle)

The current `ai-clients.ts` file has high code duplication.

3.  **Unified AI Service**
    *   **Action**: Rewrite `src/lib/ai-clients.ts`.
    *   **Details**: 
        *   Create a single `queryModel(modelId, prompt, config)` function.
        *   Create a configuration object mapping internal IDs (`gpt4`) to Puter model strings (`gpt-4o-mini`).
        *   Remove individual wrapper functions (`queryOpenAI`, `queryGemini`, etc.).
    *   **Goal**: Reduce 250+ lines of repetitive code to ~50 lines of robust logic.

4.  **Custom Key Hook**
    *   **Action**: Create `src/hooks/useMultiModelQuery.ts`.
    *   **Details**: Move the `Promise.allSettled`, loading state, and abort controller logic out of the UI component.
    *   **Goal**: Separate business logic from UI rendering.

## 3. Component Architecture (Decomposition)

`MultiAIQuery.tsx` is doing too much.

5.  **Extract Query Form**
    *   **Action**: Create `src/components/features/QueryForm.tsx`.
    *   **Details**: Move the textarea, model selector, and submit button here.
    *   **Goal**: Isolate input rendering (performance).

6.  **Extract Results Grid**
    *   **Action**: Create `src/components/features/ResultsGrid.tsx`.
    *   **Details**: Move the grid layout logic and mapping of `ResponseCard`s here.
    *   **Goal**: Clean up the main view.

7.  **Refactor Main Component**
    *   **Action**: Clean up `MultiAIQuery.tsx`.
    *   **Details**: It should simply compose `<QueryForm />` and `<ResultsGrid />` and hold the shared state (likely via the new hook).

## 4. Styling & Theme (Maintainability)

8.  **Tailwind Configuration**
    *   **Action**: Update `tailwind.config.ts`.
    *   **Details**: Move colors from `index.css` (`--vaporwave-pink`) into the Tailwind theme configuration (e.g., `theme.extend.colors.vaporwave.pink`).
    *   **Goal**: Enable type-safe class usage (e.g., `bg-vaporwave-pink`) and reduce raw CSS.

9.  **CSS Cleanup**
    *   **Action**: Clean `src/index.css`.
    *   **Details**: Remove the hardcoded `@layer base` variables that were migrated. Keep only essential global animations.

## 5. Performance & Polish

10. **Optimization**
    *   **Action**: Apply `React.memo` to `ResponseCard`.
    *   **Details**: Prevent completed AI responses from re-rendering while the user types a new prompt.
