# Agent Skills Index (Puzzle Pets)

This repo stores reusable "skills" as markdown files under the repo root:
- Skills directory: `agent-skills/`
- This file is the index and usage guidance for agents.

## Rules for agents using skills
1) Load skills on demand.
   - Only load the minimum set required for the current unit of work.
2) Declare skill usage explicitly.
   - In the unit plan and validation report, list which skill files were loaded.
3) Skills do not override repo requirements.
   - If a skill conflicts with `aidlc-docs/inception/*`, inception docs win.
4) Skills must produce evidence.
   - If a skill recommends checks, run them (or justify why not).

## Skill catalog (expected in `agent-skills/`)

Note: If a file listed below does not exist yet, the agent (or human) must add it to `agent-skills/` before attempting to use it.

| Skill (canonical) | File in this repo | Source family | Use when | Expected outputs | Evidence expectations |
|---|---|---|---|---|---|
| frontend-design | `agent-skills/frontend-design.md` | skills.sh | Designing/polishing any UI screen or component; mobile layout; “make it feel like a game” | UI spec for the change (states + responsive behavior) and consistent tokens | Screenshots (mobile + desktop), no console errors |
| puzzle-design | `agent-skills/puzzle-design.md` | skills.sh | Designing puzzle rules, onboarding, hints, difficulty curve, reward tuning | Puzzle spec + difficulty knobs + hint rules + “frustration guards” | Playtest checklist; acceptance checks (solvable, deterministic where required) |
| next-best-practices | `agent-skills/next-best-practices.md` | skills.sh | Next.js App Router structure, server/client boundaries, routing/layout patterns | Correct folder structure, correct client/server usage | `pnpm -C apps/web build` passes; no hydration warnings |
| react-best-practices | `agent-skills/react-best-practices.md` | skills.sh | Preventing rerender issues, avoiding performance traps, state organization patterns | Refactor notes + chosen patterns (why) | Profiling notes (optional); no obvious rerender loops; build/test pass |
| playwright-cli | `agent-skills/playwright-cli.md` | skills.sh | Setting up/expanding Playwright usage, debugging E2E, stable selectors | Playwright tests + clear run instructions | `pnpm -C apps/web exec playwright test` passes |
| vitest-dev | `agent-skills/vitest-dev.md` | skills.sh | Adding unit tests for engines (sudoku/memory), migrations, reducers/state machines | Unit tests with clear assertions | `pnpm -C apps/web test` passes |
| tailwind-4-docs | `agent-skills/tailwind-4-docs.md` | skills.sh | Tailwind usage patterns, tokenization, responsive styling conventions | Consistent utility usage or token-based approach | Visual spot-check + build pass |
| webapp-testing | `agent-skills/webapp-testing.md` | awesome-claude-skills | End-to-end test design: smoke flows, regression flows, CI hardening | E2E plan + stable tests (no brittle selectors) | CI green; traces/screenshots on failure |
| theme-factory | `agent-skills/theme-factory.md` | awesome-claude-skills | Establishing consistent theme tokens, palettes, visual grammar, component consistency | Theme tokens + component guidelines | Visual diff screenshots; consistency checks |
| artifacts-builder | `agent-skills/artifacts-builder.md` | awesome-claude-skills | Rapid prototyping UI or flows to validate before full implementation | Prototype plan + quick demo route | Prototype build runs; documented limitations |
| changelog-generator | `agent-skills/changelog-generator.md` | awesome-claude-skills | Creating playtest release notes and change summaries | Changelog entry (human-readable) | References to merged PRs/units; version tag note |

## Recommended skill bundles by unit type

### Repo bootstrap / CI / tooling
- next-best-practices
- vitest-dev
- playwright-cli

### UI-heavy unit (home, puzzle select, pet arena, settings)
- frontend-design
- theme-factory
- react-best-practices (if rerenders/perf matter)

### Puzzle engine / rules unit (Sudoku, Memory, Gem Match)
- puzzle-design
- vitest-dev
- webapp-testing (add at least one E2E smoke)

### Release/playtest unit
- changelog-generator
- webapp-testing
- playwright-cli

## Where skills should be referenced in AI-SDLC artifacts
- Unit plan: list skills to load under a “Skills used” section.
- Validation report: list skills used + what checklists were applied.
- Audit log: only note skills if they materially changed decisions or architecture.