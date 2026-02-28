# Execution Plan: Web App MVP

## Overview
This plan defines the execution units for the Web MVP vertical slice, replatforming Puzzle Pets to Next.js while reusing legacy assets.

## Units

### U0: Scaffolding & CI/CD
- **Scope**: Initialize Next.js project with App Router, TypeScript, pnpm. Configure Tailwind, Zustand, and ESLint/Prettier. Setup Vercel deployment.
- **Acceptance Criteria**: 
  - `pnpm dev` starts without errors. 
  - `pnpm lint` and `pnpm build` pass.
  - Vercel deployment succeeds (manual trigger/setup confirmed).
- **Dependencies**: None.
- **Evidence**:
  - Command: `pnpm run lint && pnpm run build` (Exit code 0)
  - Vercel auto-deploy checkpoint: Human step to link repo and provide deployment URL.

### U1: Asset Migration & Design System
- **Scope**: Port art assets from legacy repo. Implement Tailwind CSS variables/tokens matching the legacy art style and theme. Build core UI components (buttons, modals).
- **Acceptance Criteria**: Assets load correctly in a test page; UI components match Godot aesthetics.
- **Dependencies**: U0.
- **Evidence**:
  - Command: `pnpm run lint`
  - Visual validation of Storybook/Test page (Human verification).

### U2: Core Puzzle Engine (Sudoku & Memory)
- **Scope**: Implement 4x4 and 6x6 Sudoku logic (generation, validation). Implement Memory Match logic. Build UI for both puzzles.
- **Acceptance Criteria**: Puzzles can be played from start to win state. Errors highlight correctly in Sudoku. Matches validate in Memory Match.
- **Dependencies**: U1.
- **Evidence**:
  - Command: `pnpm test:unit` (running Vitest/Jest for puzzle logic functions) -> 100% pass rate.
  - Visual verification of puzzle completion.

### U3: Progression & State Management (Zustand + IndexedDB)
- **Scope**: Implement Zustand stores for user currency/rewards, pet unlocking, and progression. Implement IndexedDB persistence wrapper with versioned migrations for save data.
- **Acceptance Criteria**: Completing a puzzle awards currency. Currency can be spent to unlock a pet. Refreshing the browser preserves state.
- **Dependencies**: U2.
- **Evidence**:
  - Command: `pnpm test:integration` (testing IndexedDB wrapper & Zustand state).
  - Browser load/reload test (persistence check).

### U4: MVP Polish & Final Vertical Slice Assembly
- **Scope**: Connect loops: Main Menu -> Select Puzzle -> Complete Puzzle -> Reward -> Pet Screen (Progression). Add micro-animations and final styling polish.
- **Acceptance Criteria**: The complete end-to-end loop runs seamlessly. Visuals match legacy art style without missing assets.
- **Dependencies**: U3.
- **Evidence**:
  - Command: `pnpm run e2e` (Playwright/Cypress basic flow test) -> passes.
  - Final human playthrough in staging environment.

---

## Backlog (Post-MVP)

### Tsumego (Go Puzzles)
- **Priority**: Next puzzle type after Sudoku, before Match-3
- **MVP approach**: Source open-source tsumego problem libraries (e.g., GoProblems.com datasets, OGS puzzle databases) and integrate a curated set
- **Long-term**: Dedicated tsumego miner/generator engine (review user's existing legacy tsumego repo for reuse)
- **Implementation order**: Sudoku → Tsumego → Memory Match → Match-3
- **Requirements**: Simple board renderer (9×9 or 13×13 partial board), tap-to-play-stone interaction, life/death evaluation
- **Note**: Before starting implementation, review user's existing tsumego miner/generator repo for reuse opportunities