# Unit U4: Puzzle Framework (Shared Engine)

## Overview
This unit focuses on establishing a common, reusable interface and reward engine capable of hosting *any* future puzzle type. By modularizing the state and rewards, implementing Sudoku or Memory Match simply becomes a matter of plugging local components into this overarching session architecture.

## Tasks Completed
1. **Domain Models**: Authored `src/lib/puzzle/types.ts` documenting explicit structures for `PuzzleSession`, `PuzzleId`, `PuzzleResult`, and `SessionEvent` tracking.
2. **Reward Engine**: Implemented `calculateReward()` within `rewards.ts` that dynamically calculates currency (coins) and player XP based on:
   - Specific Puzzle Base Rewards (Sudoku yields more than Memory).
   - Star Multipliers (1-3 stars multiplier).
   - Mistake Penalties.
3. **Session Logger**: Established an in-memory debug logger mapping session events without polluting the Zustand state manager.
4. **State Persistence Integration**: Extended `SaveData` schema in `storage.ts` to allow `activeSession` persistence enabling resumable matches if players close the browser.
5. **React Architecture**: 
   - Authored the `usePuzzleSession` hook containing all orchestrations (Start, Resume, Abandon, Complete).
   - Created `PuzzleResultsModal.tsx` mapping visual assets (Stars, Coins, XP) automatically shown when a puzzle is finalized.
6. **Robust Testing**: Engineered automated `jsdom` evaluations utilizing `vitest` covering reward multiplier regressions and session logging bounds.

## Evidence
- Automated tests via `pnpm run test` cover all Reward calculations flawlessly.
- `pnpm run lint` and `pnpm run build` finish successfully denoting strict TS definitions across the framework hooks.
