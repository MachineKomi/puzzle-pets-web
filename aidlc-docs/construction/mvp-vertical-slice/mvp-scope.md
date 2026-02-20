# MVP Scope

## Definition of Done (DoD)
The MVP is considered complete when:
- The user can load the web app and view a main menu that utilizes the legacy Godot art assets/style.
- The user can play and complete a 4x4 or 6x6 Sudoku puzzle.
- The user can play and complete a Memory Match puzzle.
- Completing a puzzle grants in-game rewards (currency).
- The user can use rewards to progress/unlock a pet in a dedicated pet screen.
- All progress (currency, pets unlocked) persists across browser reloads via IndexedDB.
- The app is successfully deployed to Vercel.
- All CI checks (`pnpm lint`, `pnpm build`, basic tests) pass.

## Out of Scope for MVP
- Monetization / In-App Purchases (IAP).
- Multiplayer or Leaderboards.
- Backend server / Cloud Saves (relying purely on local IndexedDB for now).
- Additional game modes beyond Sudoku and Memory Match.
- Complex animations outside of basic state transitions.
- PWA / Offline manifest (can be deferred to post-MVP).
