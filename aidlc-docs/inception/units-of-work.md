# Units of Work — Puzzle Pets

Each unit is independently verifiable and should produce:
- Small PR(s)
- Tests
- Evidence command outputs
- Validation report

## U0 — Repo bootstrap (web)
Scope:
- Next.js + TS scaffold
- CI with lint/typecheck/test/build
- Playwright setup

Acceptance criteria:
- CI green on first PR
- `pnpm dev` runs locally
- One smoke route renders

Dependencies: none

---

## U1 — Asset ingestion + theme tokens
Scope:
- `public/assets` structure + manifest
- Theme tokens (colors/spacing/typography)
- Gem primitives usable in UI

Acceptance criteria:
- Manifest exists and is referenced
- One screen uses theme tokens consistently

Depends on: U0

---

## U2 — App shell + navigation + profiles
Scope:
- Home hub
- Puzzle select
- Pet arena hub (empty ok)
- Settings screen
- Local profiles

Acceptance criteria:
- Playwright navigation test passes
- Profile switch persists

Depends on: U0, U1

---

## U3 — Persistence + migrations
Scope:
- SaveRoot schema + versioning
- IndexedDB adapter + fallback localStorage
- Autosave triggers

Acceptance criteria:
- Refresh preserves state
- Migration test exists

Depends on: U2

---

## U4 — Puzzle framework
Scope:
- Puzzle interface contract
- Session recording + undo
- Reward contract

Acceptance criteria:
- One “demo puzzle” implements contract
- Unit tests for determinism and undo

Depends on: U0, U3

---

## U5 — Sudoku plugin
Scope:
- Generator/validator (seeded)
- 4x4 + 6x6
- Notes mode
- Hint v1

Acceptance criteria:
- Sudoku sessions produce rewards
- Tests for validator + hint behavior
- Playwright “complete puzzle” flow exists

Depends on: U4

---

## U6 — Pets v1
Scope:
- Pet collection view
- Active pet selection
- Pet XP gained from puzzle sessions
- Simple interactions (tap/feed/play)

Acceptance criteria:
- Completing a puzzle increases active pet XP
- Save/restore pet state works

Depends on: U3, U5

---

## U7 — Memory Match plugin
Scope:
- Memory puzzle plugin
- Difficulty scaling
- Rewards

Acceptance criteria:
- Playwright: complete a memory session
- Unit tests: matching logic

Depends on: U4, U3

---

## U8 — Match game plugin (variant)
Scope:
- Match game plugin
- Minimal combos

Acceptance criteria:
- Deterministic board generation tests
- Basic clear logic tests
- One end-to-end “play a move” test

Depends on: U4, U3

---

## U9 — Offline hardening (PWA)
Scope:
- Service worker caching
- Offline behavior verified

Acceptance criteria:
- Offline load after first visit
- State still works offline

Depends on: U0..U8

---

## U10 — Release readiness
Scope:
- Performance and accessibility passes
- Content safety review
- Changelog

Acceptance criteria:
- CI green
- A11y checklist complete
- Release notes drafted

Depends on: all