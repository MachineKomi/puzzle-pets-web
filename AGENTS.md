# AI Agent Operating Guide (Puzzle Pets)

This file defines the expected behavior for AI dev agents working in this repo.

## Non-negotiables

1) Plan-first. For any meaningful change:
   - Write a plan (bulleted steps).
   - Identify checkpoints + evidence commands.
   - Stop for approval when entering a new phase or starting a new unit.

2) Small, reviewable diffs.
   - Prefer small PRs that can be reverted.
   - Avoid large refactors unless explicitly approved.

3) Proof over prose.
   - “Done” requires objective evidence: typecheck/tests/build/e2e.
   - Attach a short validation report to the PR description and update `aidlc-docs/audit.md`.

4) Preserve Puzzle Pets DNA.
   - Family-friendly, non-punishing tone
   - Minimal reading requirements where possible
   - Large touch targets; accessible colors/shapes
   - No dark patterns, no ad-tech, no surprise purchases

## Required reading (before coding)

- `aidlc-docs/aidlc-state.md`
- `aidlc-docs/execution-plan.md`
- `aidlc-docs/inception/requirements.md`
- `aidlc-docs/inception/game-design.md`
- `aidlc-docs/inception/architecture.md`
- `aidlc-docs/inception/data-model.md`
- `aidlc-docs/inception/legacy-sudoku-pets-review.md`

## Definition of Done (per unit)

A unit is only “done” when:
- Acceptance criteria are met
- Relevant tests added/updated
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all pass
- Playwright e2e added where user-critical
- `aidlc-docs/audit.md` updated (append-only entry)
- A unit validation report is written under `aidlc-docs/construction/<unit>/validation-report.md`

## Tech defaults (unless the unit says otherwise)

- Web app: Next.js + TypeScript
- State: explicit domain model + store (Zustand or equivalent) + typed events
- Persistence: versioned save schema in IndexedDB (fallback localStorage)
- UI: responsive, touch-first
- PWA: offline-first caching strategy

## Skills

See `aidlc-docs/agent-skills.md` for recommended skills and when to use them. Skills themselves are found within the `agent-skills` directory.