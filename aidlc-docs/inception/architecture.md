# Architecture — Puzzle Pets (Web)

## 1) Target runtime
- Web app usable on desktop + mobile browsers
- PWA-capable for “install to home screen”
- Offline-first after first load

## 2) Recommended stack (default)
- Next.js (App Router) + TypeScript
- Deployment: Vercel (default)
- Styling: Tailwind or equivalent token-based system
- State: lightweight store + explicit domain model
- Persistence: IndexedDB (fallback localStorage)
- Testing: Vitest + React Testing Library + Playwright

## 3) High-level module map
- `app/` (routing, pages)
- `ui/` (shared components)
- `domain/` (events, services, rules)
- `puzzles/` (puzzle plugins)
- `pets/` (pet models + UI)
- `progression/` (rewards, leveling)
- `storage/` (save schema, migrations, adapters)
- `assets/` (manifest + references)

## 4) Puzzle plugin framework
Define a common contract:

- PuzzleDefinition (metadata)
- PuzzleEngine (pure logic):
  - `create(seed, difficulty) -> PuzzleState`
  - `apply(state, action) -> { state, events }`
  - `getHint(state) -> Hint | null`
  - `isSolved(state) -> boolean`
- PuzzleRenderer (UI):
  - React component consuming state + dispatch

Keep engine logic deterministic and testable; UI is a thin layer.

## 5) Domain events (conceptual port from legacy EventBus)
Use typed events to decouple:
- `PUZZLE_STARTED`
- `PUZZLE_ACTION_APPLIED`
- `PUZZLE_SOLVED`
- `REWARD_GRANTED`
- `PET_XP_GAINED`
- `SAVE_REQUESTED`

## 6) Persistence strategy
- Versioned schema: `schemaVersion: number`
- Store per-profile:
  - player progression
  - pets
  - settings
  - puzzle unlocks/history
- Autosave on key events; throttle writes.

## 7) Offline strategy (PWA)
- Cache shell + critical assets
- Store dynamic state in IndexedDB
- Explicit “offline status” indicator (non-alarming)

## 8) Deployment notes
Default: Vercel.
Alternatives (if needed later):
- Netlify
- Cloudflare Pages
- Self-hosted Node runtime (Docker/Fly.io)