# Functional Requirements — Puzzle Pets

## Legend
- FR = Functional Requirement
- MVP = must be in first playable release
- VNext = next milestone after MVP

---

## FR-100: App shell & navigation
- FR-101 (MVP): App opens to a simple Home/Hub with clear large buttons.
- FR-102 (MVP): Player can navigate to:
  - Puzzle Select
  - Pet Arena (hub)
  - Settings
- FR-103 (MVP): Navigation is fully usable on mobile touch + desktop mouse/keyboard.

## FR-200: Profiles & save
- FR-201 (MVP): Support multiple local profiles (e.g., “Kid”, “Parent”, “Grandparent”).
- FR-202 (MVP): Autosave progress after meaningful actions (puzzle move, reward grant, pet change).
- FR-203 (VNext): Optional export/import save (QR code or file) for device transfer (no accounts).

## FR-300: Puzzle catalog & sessions
- FR-301 (MVP): Puzzle Select shows available puzzle types and difficulties.
- FR-302 (MVP): Each puzzle runs as a “Session” with:
  - start time, end time
  - move history (for undo)
  - completion outcome
- FR-303 (MVP): All puzzles share a consistent reward contract:
  - rewards include player XP/currency and pet XP
- FR-304 (MVP): Puzzles are short-session friendly (typical session 1–5 minutes for easy modes).
- FR-305 (VNext): Daily “Training Set” (3 short puzzles) with a small reward bonus.

## FR-400: Sudoku (ported core)
- FR-401 (MVP): Sudoku playable with gem/shape visuals (pre-reader friendly).
- FR-402 (MVP): Board sizes:
  - 4x4 and 6x6 in MVP (9x9 can be included if stable)
- FR-403 (MVP): Notes mode (“pencil marks”).
- FR-404 (MVP): Hint v1 teaches *why* (at least “naked single” style hint).
- FR-405 (VNext): Zen mode theme toggle for classic numbers/paper aesthetic.

## FR-500: Memory Match (MVP puzzle #2)
- FR-501 (MVP): Memory tile game (match pairs).
- FR-502 (MVP): Difficulty scaling via grid size and optional helpers (peek assist).
- FR-503 (MVP): Reward contract consistent with Sudoku.

## FR-600: Match‑3 variant (planned early, post-MVP unless explicitly pulled in)
- FR-601 (VNext): Match game using gems (swap or drag-path “Puzzle & Dragons”-like).
- FR-602 (VNext): Basic combos and simple special tiles.
- FR-603 (VNext): Accessibility: shape variants or overlays for colorblind support.

## FR-700: Pets & pet arena meta-game
- FR-701 (MVP): Pet collection screen: view owned pets, rarity, level.
- FR-702 (MVP): Choose an “active companion” that reacts to puzzle play.
- FR-703 (MVP): Pets gain XP from puzzle sessions.
- FR-704 (MVP): Pet interactions: tap/feed/play (non-punishing; no death/decay loops).
- FR-705 (VNext): “Pet Arena” visualization: show pets training/progress in a cozy scene.

## FR-800: Rewards, currencies, and ethics
- FR-801 (MVP): Earn rewards only through play.
- FR-802 (MVP): No ads, no real-money gambling mechanics.
- FR-803 (VNext): Optional DLC packs can exist, but must not block core gameplay.

## FR-900: Settings & accessibility
- FR-901 (MVP): Audio settings: music/sfx toggles and volume.
- FR-902 (MVP): Visual accessibility:
  - large text mode
  - colorblind-safe option and/or shape-first cues
- FR-903 (MVP): Reduced motion option.

---

## Constraints
- C-1: Preserve and reuse existing art assets and overall art direction where possible.
- C-2: Family-friendly content; no scary visuals; encouraging feedback.
- C-3: Offline-first user experience (no always-online dependency).