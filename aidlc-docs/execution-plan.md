# Execution Plan — Puzzle Pets (AI‑DLC)

This plan decomposes work into small, independently verifiable units with explicit gates.

## Phase A — Inception (WHAT + WHY)

### A0 — Discovery & Analysis (legacy intake)
**Goal:** Extract “Puzzle Pets DNA” from legacy repo (art, design philosophy, gameplay loops).  
**Outputs:**
- `aidlc-docs/inception/legacy-sudoku-pets-review.md`
- `aidlc-docs/inception/asset-migration-plan.md`

**Gate A0 exit criteria:**
- Inventory of legacy assets + intended reuse approach
- Clear list of “must preserve” design principles

### A1 — Requirements & scope
**Goal:** Convert intent into testable requirements and a scoped MVP.  
**Outputs:**
- `requirements.md`, `nfrs.md`, `game-design.md`, `puzzle-catalog.md`
- `success-metrics.md`
- `risks.md`

**Gate A1 exit criteria (Inception Approved):**
- MVP scope agreed
- FR/NFR reviewed
- Risks acknowledged + mitigations planned
- Units-of-work accepted
- Decision log started (`aidlc-docs/audit.md`)

---

## Phase B — Construction (HOW)

Each unit produces:
- Small diffs
- Tests
- Evidence commands output
- A validation report under `aidlc-docs/construction/<unit>/validation-report.md`

### U0 — Repo bootstrap (web)
**Deliverables**
- Next.js + TypeScript scaffold
- Code quality: ESLint/Prettier, strict TS
- Test harness: Vitest + RTL
- E2E harness: Playwright
- CI workflow: lint/typecheck/test/build

**Evidence**
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm exec playwright test` (basic smoke)

### U1 — Asset ingestion + UI theme tokens
**Deliverables**
- `public/assets/` structure
- Asset manifest + usage mapping
- Theme tokens: colors, spacing, typography
- “Gem” visual primitives shared across puzzles

**Evidence**
- Visual snapshot tests (if used)
- Manual mobile check
- Build passes

### U2 — App shell + navigation + profiles
**Deliverables**
- Responsive app shell
- Puzzle Select screen
- Pet Arena hub screen (empty state OK)
- Settings screen
- Local profiles (kid/parent/grandparent)

**Evidence**
- Playwright navigation flow tests

### U3 — Persistence + migrations
**Deliverables**
- Versioned save schema
- IndexedDB persistence + migration framework
- Autosave triggers

**Evidence**
- Unit tests for migrations
- Playwright: refresh retains state

### U4 — Puzzle framework (plugin architecture)
**Deliverables**
- Puzzle interface contract
- Session recorder (moves, undo, timer)
- Reward calculator contract
- Shared puzzle UI scaffolding

**Evidence**
- Unit tests: deterministic seeds, undo correctness

### U5 — Sudoku (ported design intent)
**Deliverables**
- Sudoku generator/validator (seeded)
- 4x4 / 6x6 / 9x9 (MVP can start with 4x4 + 6x6)
- Notes mode, hint v1 (naked singles)
- Gem visuals + optional “Zen” theme

**Evidence**
- Unit tests: validator invariants
- Playwright: solve flow + reward

### U6 — Pet meta-game v1
**Deliverables**
- Pet collection + companion selection
- Rewards feed into pet XP
- Pet interactions (tap/feed/play) non-punishing
- Simple “arena” visualization (no competitive logic)

**Evidence**
- Playwright: solve puzzle → pet XP increases

### U7 — Memory Match puzzle
**Deliverables**
- Memory tiles puzzle plugin
- Difficulty scaling: grid size, time assist, “peek” helper
- Rewards consistent with framework

**Evidence**
- Unit tests for matching logic
- Playwright: complete session

### U8 — Match-3 variant (early)
**Deliverables**
- Match-3 plugin (swap or drag-path variant)
- Combos + special pieces (minimal set)
- Accessibility: shape + color support

**Evidence**
- Deterministic board generation tests
- Playwright: basic match clears

### U9 — PWA + offline hardening
**Deliverables**
- Service worker caching
- Offline-first behavior validated
- Installable on mobile

**Evidence**
- Playwright/offline mode checks (where feasible)
- Manual install check

### U10 — Release readiness
**Deliverables**
- Performance budget checks
- Accessibility checks
- Content safety + parent-trust checklist
- Release notes + changelog

**Evidence**
- Lighthouse run outputs (documented)
- A11y audit notes
- CI green

---

## Phase C — Operations (RUN)

- Vercel deployment config
- Observability (minimal, privacy-respecting)
- Runbook and rollback notes
- Cost model (near-zero baseline for static hosting)