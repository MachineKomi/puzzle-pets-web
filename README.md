# Puzzle Pets

Puzzle Pets is a family-friendly, low-commitment “puzzle gym” where solving short, satisfying puzzles helps you raise adorable pets in a cozy pet arena.

This project is a replatform/restart of the public Godot project “Sudoku Pets” into a web app while preserving:
- Art style + theme + “gem” visual language
- Family-friendly, non-punishing pet philosophy
- Ethical, parent-trustworthy design (no ads, no real-money gambling loops)

Primary goal:
- A web app that works well on desktop + mobile (PWA-friendly), suitable for play-testing across ages (kids, adults, grandparents).

## Repo workflow

This repo follows an AI‑SDLC / AI‑DLC style workflow:
- Plan-first, small batches, proof-based validation
- Requirements → units → code → evidence (traceability)

Start here:
- `aidlc-docs/aidlc-state.md` (current phase/status)
- `aidlc-docs/execution-plan.md` (approved plan + unit gates)
- `aidlc-docs/inception/*` (inception artifacts)

## Development (planned)

> Note: code scaffold is built during Construction Unit U0.
Expected workflow:
- Node.js LTS
- pnpm
- `pnpm dev` for local dev
- `pnpm test` for unit tests
- `pnpm exec playwright test` for e2e

## License

Puzzle Pets intends to continue with an MIT-style license consistent with the legacy repo’s stated license posture.
Confirm asset ownership + licensing before any public release.