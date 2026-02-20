## Puzzle Pets MVP prompt pack

### MVP vertical slice definition (target for these prompts)

**One complete loop, deployed:** open web app → pick a puzzle → play → win/lose feedback → rewards → pet progression → persists across refresh → mobile-friendly → auto-deployed on Vercel.

**Recommended MVP puzzle set**

* **Sudoku (4×4 + 6×6)** using gem icons (carryover from Sudoku-Pets).
* **Memory Match** (pairs) using gem icons or pet icons.
* A third tile can be **“Gem Match (coming soon)”** to signal broader puzzle variety without building match-3 in MVP.

(There’s an optional alternate prompt later if you want **Gem Match** instead of Memory.)

---

## How to run these prompts

* Copy/paste each **Agent Prompt** into your AI dev agent that has repo access.
* Copy/paste each **Human Prompt** into your own checklist / run it manually.
* Do them in order; each Agent Prompt is designed as a small-batch unit with explicit evidence.

---

# Human Prompt H0 — Repo initialization (one-time)

1. Create a new GitHub repo: `puzzle-pets` (or `Puzzle-Pets`), default branch `main`.

2. Add the inception + AI-SDLC docs you already copied from the earlier response:

* `aidlc-docs/**`
* root `README.md`
* `LICENSE` (likely MIT, consistent with legacy)

3. Push to GitHub:

```bash
git init
git add -A
git commit -m "chore: initialize Puzzle Pets AI-SDLC docs"
git branch -M main
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

---

# Agent Prompt A0 — MVP plan + repo discovery (plan-only, stop for approval)

```text
You are the AI dev agent for “Puzzle Pets”, using AI-SDLC methodology.

Task: Produce an MVP execution plan for a web replatform, and STOP for approval before implementation.

Context:
- We are replatforming from Godot (legacy repo: https://github.com/MachineKomi/Sudoku-Pets) to a web app.
- MUST reuse existing art assets, art style, theme, design principles.
- MVP must be a vertical slice: puzzle → reward → pet progression → persistence → deploy.

Repo rules:
- Treat `aidlc-docs/**` as source of truth; update artifacts (state, plan, audit).
- Use small batches / reviewable diffs.
- Do not implement code yet in this prompt—plan only.

Deliverables (must create/update):
1) `aidlc-docs/aidlc-state.md`
   - Classify project context (greenfield/brownfield/mixed)
   - Set current phase (Inception → entering Construction) BUT mark “pending approval”
2) `aidlc-docs/execution-plan.md`
   - MVP plan with units (U0..U?); each unit: scope, acceptance criteria, dependencies, evidence
3) `aidlc-docs/audit.md`
   - Append-only entry capturing key decisions proposed (framework choice, puzzle set, storage, deployment)
4) `aidlc-docs/construction/mvp-vertical-slice/`
   - `mvp-scope.md` (definition of done + out of scope)
   - `asset-gap-checklist.md` (explicit list of assets needed for MVP and where they live in repo)
   - `risk-register.md` (top 10 risks + mitigations)

Constraints / proposed defaults (you can recommend alternatives, but be opinionated):
- Web stack: Next.js (App Router), TypeScript, pnpm.
- Storage: IndexedDB (via small wrapper or lightweight lib), with versioned migrations.
- State: Zustand.
- Styling: Tailwind + CSS variables tokens OR plain CSS modules + tokens; pick one and justify.
- MVP puzzles: Sudoku (4x4 + 6x6) + Memory Match. Provide an alternate plan if we choose Gem Match instead of Memory.

Evidence plan:
- For each unit, list exact commands that will be run (lint/test/build/e2e) and what constitutes passing.
- Include Vercel auto-deploy setup checkpoint (human step).

Stop condition:
- Output the plan + artifact diffs summary, then STOP and ask for approval text: “Reply APPROVED to proceed to U0.”
```

---

# Human Prompt H1 — Approve plan + choose MVP option

Review the agent’s plan output. Reply with:

**Approval:** `APPROVED`

**And choose one:**

* **Option A (default):** Sudoku + Memory Match
* **Option B:** Sudoku + Gem Match (match-3-lite)

**And choose one:**

* **Meta loop in MVP:**

  1. *Simple pet leveling only* (recommended), OR
  2. *Include gacha/hatching* (adds complexity)

Reply template:

```text
APPROVED
MVP puzzles: Option A
Meta loop: simple pet leveling only
```

---

# Agent Prompt A1 — U0: Web app bootstrap + CI (implementation)

```text
Implement Unit U0: Web app bootstrap + CI. Follow AI-SDLC, small batches, proof over prose.

Goal:
- Add a working Next.js TypeScript web app in `apps/web`.
- Add linting, formatting, tests scaffolding, and CI.
- Ensure the repo builds locally and in CI.

Constraints:
- Do NOT delete/overwrite `aidlc-docs/**`. Keep docs at repo root.
- Create the app under `apps/web` to avoid clobbering docs.
- Use pnpm. Commit lockfile.
- Set `packageManager` in `apps/web/package.json` (use the pnpm version you install with) so Vercel/Corepack can pin it.
- Node: set `engines.node` to a modern LTS (recommend Node 20).

Implementation tasks:
1) Create `apps/web` Next.js app:
   - App Router
   - TypeScript
   - ESLint
   - Tailwind (unless plan chose otherwise)
2) Add scripts: `lint`, `test`, `test:e2e`, `build`, `dev`
   - Unit test runner: Vitest + React Testing Library (or Jest, but justify)
   - E2E runner: Playwright (smoke test only for now)
3) Add GitHub Actions CI:
   - On PR + main: install, lint, unit test, build
4) Add minimal “smoke pages” so build is real:
   - `/` renders “Puzzle Pets” and a placeholder home UI
5) AI-SDLC artifacts:
   - Update `aidlc-docs/aidlc-state.md` (enter Construction, U0 in progress/done)
   - Append to `aidlc-docs/audit.md` (U0 completed + evidence)
   - Create `aidlc-docs/construction/U0/` with:
     - `unit-plan.md` (tasks + acceptance)
     - `validation-report.md` (commands run + results)

Evidence (must run and report results):
- `pnpm -C apps/web lint`
- `pnpm -C apps/web test`
- `pnpm -C apps/web build`
- `pnpm -C apps/web exec playwright test` (or your chosen command), even if it’s just a single smoke test

Stop condition:
- Provide a concise summary of files changed + evidence output + link to validation report.
```

---

# Human Prompt H2 — Set up Vercel auto-deploy (after U0 merged to `main`)

Do this after the repo has a real buildable `apps/web` app on `main`.

1. Sign in to Vercel, create a new project, and **import the GitHub repo**. Vercel’s flow is “Add New Project → Import repo → Deploy”. ([Vercel][1])

2. In the Vercel project settings:

* **Framework:** should auto-detect Next.js. ([Vercel][1])
* **Root Directory:** set to `apps/web` (because the app lives there).
* Leave build/output defaults unless you changed them.

3. Package manager sanity:

* Vercel detects the package manager from the lockfile (`pnpm-lock.yaml`) and/or uses the `packageManager` field if Corepack is used. ([Vercel][2])
* Avoid overriding the install command in Vercel unless required; Vercel notes override can force an older pnpm in the build container. ([Vercel][2])

4. Trigger a deployment by pushing a tiny change to `main` (e.g., edit a footer text). Confirm:

* Production URL works
* Automatic deployments trigger on push ([Vercel][1])

---

# Agent Prompt A2 — U1: Asset pipeline + theme tokens

```text
Implement Unit U1: Asset ingestion pipeline + theme tokens.

Goal:
- Create an asset folder structure in `apps/web/public/assets`.
- Provide a manifest-generation script so the app can reference assets reliably.
- Establish theme tokens (Normal vs Zen) as CSS variables.

Constraints:
- We will copy legacy art assets later; for now, create the structure + placeholders.
- Do not hardcode asset paths scattered everywhere—centralize via manifest and helpers.

Implementation tasks:
1) Create folders:
   - `apps/web/public/assets/legacy/` (raw migrated assets)
   - `apps/web/public/assets/ui/` (new UI assets)
   - `apps/web/public/assets/pets/`
   - `apps/web/public/assets/puzzles/`
2) Add asset manifest generator:
   - Node script in `apps/web/scripts/gen-assets.(ts|js)`
   - It scans `public/assets/**` and outputs:
     - `apps/web/src/assets/manifest.generated.json` (or .ts), and
     - a stable helper `apps/web/src/assets/index.ts` to query assets by logical keys.
   - Add `pnpm -C apps/web gen:assets`
3) Theme tokens:
   - Define CSS variables in `apps/web/src/app/globals.css` (or your styling system)
   - Tokens: background, panel, text, primary, accent, danger, focus ring, etc.
   - Implement Normal + Zen modes (Zen can just tweak palette + texture usage for MVP)
4) Base UI components:
   - `Button`, `Card/Panel`, `Icon`, `Modal`, `ProgressBar`
   - Ensure large touch targets and keyboard focus styles
5) AI-SDLC artifacts:
   - `aidlc-docs/construction/U1/unit-plan.md`
   - `aidlc-docs/construction/U1/validation-report.md`
   - Update `aidlc-docs/aidlc-state.md` and append to `aidlc-docs/audit.md`

Evidence to run:
- `pnpm -C apps/web gen:assets`
- `pnpm -C apps/web lint`
- `pnpm -C apps/web test`
- `pnpm -C apps/web build`

Stop condition:
- Summarize asset structure + how to add legacy assets + show manifest example keys.
```

---

# Human Prompt H3 — Migrate legacy art assets + generate missing MVP assets

## Step 1 — Copy legacy assets into the new repo

From your local machine:

1. Download/clone legacy:

* `https://github.com/MachineKomi/Sudoku-Pets`

2. Copy the existing art assets into:

* `apps/web/public/assets/legacy/` (keep original folder structure if possible)

3. Commit:

```bash
git add -A
git commit -m "chore(assets): migrate legacy Sudoku Pets art assets"
git push
```

## Step 2 — Regenerate manifest

```bash
pnpm -C apps/web gen:assets
git add -A
git commit -m "chore(assets): generate asset manifest"
git push
```

## Step 3 — Generate additional assets (if missing)

Use your preferred image model/tool. For best style consistency:

* Provide 3–5 reference images from your migrated legacy assets (a gem set, a pet sprite, a UI panel texture).
* Output **transparent PNGs** when applicable.
* Keep outlines, shading, palette consistent with the legacy art.

### Asset list for MVP (generate only what’s missing)

Save into `apps/web/public/assets/ui/` unless noted.

#### A) App icon + favicon (if you want a new “Puzzle Pets” branding)

**Prompt (icon, 1024×1024, transparent background):**

```text
Cute family-friendly game icon for “Puzzle Pets”: a smiling pastel pet face peeking out of a jewel-like puzzle tile. Rounded shapes, soft shading, thick clean outline, bright but gentle colors, child-safe vibe, no text, centered composition, transparent background. Match the style of the provided reference sprites.
```

#### B) Puzzle select card art (2–3 images)

**Prompt (card background, 1536×1024):**

```text
Whimsical puzzle-themed background illustration in the same style as the reference art: soft pastel gradient, subtle sparkles, cozy kid-friendly atmosphere, minimal visual clutter, leaves room for UI text overlay. No text. 
```

#### C) UI icons (export as SVG or 256×256 transparent PNG)

Generate a matching set: `home`, `puzzles`, `pets`, `settings`, `back`, `sound-on/off`, `music-on/off`.

**Prompt (icon set):**

```text
Create a cohesive set of 8 simple cute UI icons for a children’s puzzle game. Rounded shapes, thick outline, soft shading, consistent stroke thickness, bright pastel palette, transparent background. Icons: home, puzzle piece, paw print (pets), gear (settings), back arrow, speaker on, speaker off, music note. No text.
```

#### D) Reward burst / stars

**Prompt (512×512 transparent):**

```text
A celebratory reward burst with 3 cute star badges (1-star, 2-star, 3-star variants). Rounded cartoon style, soft glow, pastel colors, thick outline, transparent background. Match reference UI style.
```

#### E) Memory card back pattern (seamless tile)

Save to `apps/web/public/assets/puzzles/memory/`.
**Prompt (tileable, 512×512):**

```text
Seamless repeating pattern for the back of memory cards: tiny paw prints, sparkles, and gem shapes. Pastel colors, subtle contrast, child-friendly, low visual noise, tileable edges, no text.
```

After generating assets:

* Place them at the agreed paths.
* Run `pnpm -C apps/web gen:assets` again.
* Commit and push.

---

# Agent Prompt A3 — U2: App shell + navigation + pages

```text
Implement Unit U2: App shell + navigation + MVP pages scaffold.

Goal:
- Build the navigable UI skeleton for the MVP:
  - Home
  - Puzzle Select
  - Sudoku page (placeholder if not implemented yet)
  - Memory (or Gem Match) page (placeholder)
  - Pet Arena
  - Settings
- Ensure mobile-first layout and touch-friendly controls.

Constraints:
- No heavy game engine; pure web.
- Use asset manifest for icons/images when possible; fall back to minimal inline SVG if missing.
- Keep logic minimal here; puzzle logic comes later.

Implementation tasks:
1) Routes (Next.js App Router):
   - `/` Home (shows active pet panel + big buttons)
   - `/puzzles` puzzle select list/cards
   - `/puzzles/sudoku`
   - `/puzzles/memory` (or `/puzzles/gem-match`)
   - `/pets`
   - `/settings`
2) Navigation:
   - Bottom nav on small screens, side/top nav on desktop
3) Basic settings UI:
   - toggles: theme (normal/zen), sfx/music (can be stubbed), reduced motion, large text
4) AI-SDLC artifacts:
   - `aidlc-docs/construction/U2/unit-plan.md`
   - `aidlc-docs/construction/U2/validation-report.md`
   - update state + audit

Evidence:
- `pnpm -C apps/web lint`
- `pnpm -C apps/web test`
- `pnpm -C apps/web build`
- Add/extend a Playwright smoke test that visits the key routes and asserts page headings.
```

---

# Agent Prompt A4 — U3: Persistence (IndexedDB) + migrations

```text
Implement Unit U3: Local persistence with migrations.

Goal:
- Persist player profile + progress across refresh.
- Use versioned schema/migrations so future changes don’t break old saves.

Data to persist (MVP):
- profile: id, createdAt, settings
- wallet: coins
- pets: collection, activePetId, xp/level/mood
- puzzle progress: completed count, best stars/time per puzzle type

Implementation tasks:
1) Storage module:
   - IndexedDB wrapper (either small custom wrapper or lightweight dependency)
   - `schemaVersion` + migrations
2) Integrate with state store:
   - Load on app start
   - Save on debounced changes
   - Provide “Reset Save” in Settings (with confirmation)
3) Tests:
   - Unit tests for migrations
   - Basic save/load roundtrip test
4) AI-SDLC artifacts + evidence commands in validation report

Evidence:
- `pnpm -C apps/web lint`
- `pnpm -C apps/web test`
- `pnpm -C apps/web build`
```

---

# Agent Prompt A5 — U4: Puzzle framework (shared engine)

```text
Implement Unit U4: Puzzle framework shared by all puzzles.

Goal:
- Define a standard interface for puzzles so we can plug in Sudoku, Memory, Gem Match later.
- Standardize:
  - session creation (seeded)
  - in-progress state
  - completion event → reward calculation → persistence update

Implementation tasks:
1) Domain model:
   - `PuzzleId` (e.g., "sudoku", "memory")
   - `PuzzleSession` (id, puzzleId, seed, startedAt, state)
   - `PuzzleResult` (won, stars, durationMs, mistakes, metadata)
2) Reward engine:
   - coins + pet xp based on result
3) Hooks/components:
   - `usePuzzleSession(puzzleId)` to start/resume session
   - `PuzzleResultsModal` reusable
4) Logging:
   - Keep simple local event log for debugging (“session events”)
5) AI-SDLC artifacts + tests

Evidence:
- `pnpm -C apps/web lint`
- `pnpm -C apps/web test`
- `pnpm -C apps/web build`
```

---

# Agent Prompt A6 — U5: Sudoku MVP (4×4 + 6×6, gem-based)

```text
Implement Unit U5: Sudoku MVP puzzle.

Goal:
- Playable Sudoku with gem icons instead of numbers.
- Support 4×4 and 6×6 boards (MVP). (9×9 later.)
- Works well on mobile: tap cell, tap gem to place; notes mode toggle.

Core features:
- Generator produces a valid puzzle with a stored solution.
- Validation:
  - Detect conflicts (row/col/box duplicates)
  - Mistake count increments when user places incorrect value (MVP policy: either immediate error OR only check on “validate”; pick one and document)
- Notes mode: allow storing candidates per cell.
- Hint (MVP-simple): highlight a cell that has only one possible candidate OR reveal one correct cell with small penalty.

UI requirements:
- Large tap targets, clear selected cell highlight.
- Gem palette at bottom (for mobile) or side (desktop).
- Optional “Erase” and “Undo” (undo can be session-local).

Integration:
- Must use puzzle framework (U4).
- On completion, emit PuzzleResult and show reward modal.
- Rewards update coins + pet xp (even if pet system is minimal at this moment).

Tests:
- Solver/validator unit tests (at least row/col/box rules)
- Generator sanity: generated puzzles are solvable; solution matches constraints
- If you implement uniqueness checking, test it; otherwise document as out-of-scope for MVP.

AI-SDLC artifacts:
- U5 unit plan + validation report + audit entry with evidence.

Evidence:
- `pnpm -C apps/web lint`
- `pnpm -C apps/web test`
- `pnpm -C apps/web build`
- Playwright: start a Sudoku session, place at least one move, ensure UI updates.
```

---

# Agent Prompt A7 — U6: Pets meta-game MVP (arena + leveling)

```text
Implement Unit U6: Pets MVP meta-loop.

Goal:
- A simple tamagotchi-style layer that motivates puzzle play.
- Show pet in a “pet arena” page.
- Pet gains XP from puzzle rewards; levels up.

MVP data model:
- Pet: id, name, rarity (optional), level, xp, mood (0-100)
- Player: pet collection, activePetId, coins

MVP features:
- Pet Arena page:
  - show active pet sprite
  - show level + xp progress bar
  - show mood meter
  - buttons: Feed, Play (increase mood; optionally cost coins)
- Puzzle completion:
  - adds xp to active pet
  - increases mood a bit
  - reward modal shows coins + xp and references the pet
- Persistence must store pet progression (uses U3)

Art usage:
- Prefer legacy pet sprites. If missing, use placeholder silhouette and leave TODO in asset gap checklist.

AI-SDLC artifacts + evidence.

Evidence:
- `pnpm -C apps/web lint`
- `pnpm -C apps/web test`
- `pnpm -C apps/web build`
- Playwright: complete a mock puzzle result (or finish a small Sudoku) and confirm pet xp increases on /pets.
```

---

# Agent Prompt A8A — U7: Memory Match puzzle (recommended MVP second puzzle)

```text
Implement Unit U7A: Memory Match puzzle.

Goal:
- Simple, fun, all-ages puzzle to broaden appeal.
- Uses gem icons or pet icons as card faces.
- Integrates with puzzle framework and rewards/pets.

Game rules (MVP):
- Grid size: start with 3×4 (6 pairs) or 4×4 (8 pairs).
- Tap to flip 2 cards:
  - If match: keep them revealed.
  - If not: flip back after short delay.
- Win when all pairs matched.
- Track moves and time; stars based on thresholds (document thresholds).

Implementation details:
- Deterministic shuffle using session seed.
- Reduce motion setting should disable flip animations/delays (or shorten them).
- Assets:
  - card back texture from `assets/puzzles/memory/`
  - faces: gem assets from legacy OR fallback emoji-like vector

Tests:
- Deterministic shuffle test by seed
- Basic reducer/state machine tests

Evidence:
- `pnpm -C apps/web lint`
- `pnpm -C apps/web test`
- `pnpm -C apps/web build`
- Playwright: start memory game, flip a card, ensure UI state changes.
```

---

# Agent Prompt A8B — U7 alternate: “Gem Match” (match-3-lite) instead of Memory

Use this only if you chose Option B in H1.

```text
Implement Unit U7B: Gem Match (match-3-lite).

Goal:
- A basic swap-and-match game using gem icons.
- Integrates with puzzle framework + rewards + pets.

MVP scope guardrails (keep it small):
- 6×6 board
- swap adjacent tiles
- if swap creates 3+ match: clear matched tiles, drop down, refill
- no special tiles, no combos scoring complexity (optional simple combo multiplier)
- win condition: clear N tiles OR score >= target within M moves

Determinism:
- Use seeded RNG for initial board + refills.

Evidence:
- Lint/test/build + at least one Playwright smoke test that performs a swap.
```

---

# Agent Prompt A9 — MVP hardening + “done with proof”

```text
Implement MVP hardening and produce final MVP validation report.

Goal:
- Ensure the vertical slice is stable, testable, and deployable.
- Update documentation so new agents can continue safely.

Tasks:
1) UX polish:
   - Responsive layout checks (small mobile width + desktop)
   - Large text / reduced motion toggles actually affect UI
   - Clear “how to play” microcopy on puzzle pages
2) Performance:
   - Avoid huge unoptimized images; use Next Image where appropriate
3) Testing:
   - Expand Playwright to cover: home → puzzles → start sudoku → make a move → finish (can be simplified) → rewards modal appears → pet xp increases
4) Documentation:
   - `aidlc-docs/construction/mvp-vertical-slice/validation-report.md` (end-to-end evidence)
   - update `aidlc-docs/aidlc-state.md` to “MVP complete (vertical slice)”
   - append audit entry with links to unit reports

Evidence (must run and paste results/summary):
- `pnpm -C apps/web lint`
- `pnpm -C apps/web test`
- `pnpm -C apps/web build`
- `pnpm -C apps/web exec playwright test`

Stop condition:
- Summarize MVP features shipped + known gaps + next recommended unit backlog (post-MVP).
```

---

# Human Prompt H4 — MVP playtest loop (family-friendly)

1. On a phone + tablet + desktop:

* Visit the Vercel production URL
* Do one full loop:

  * start Sudoku 4×4, finish it
  * observe reward and pet xp
  * refresh page → confirm progress persists
  * start Memory Match, finish it

2. Capture feedback in GitHub Issues:

* “Confusing” moments (4-year-old feedback is gold)
* Touch target problems
* Too much text / too little guidance
* Anything that feels slow or visually cluttered

3. Decide MVP+1:

* Add Gem Match
* Add daily training
* Add more pets/biomes
* Add gacha/hatching
* Add 9×9 Sudoku + difficulty ladder

---

## Notes for Vercel setup consistency

* Vercel auto-detects and deploys from GitHub, producing preview URLs and automatic deployments on pushes. ([Vercel][1])
* Package manager detection is based on lockfiles; if Corepack is used, Vercel uses the `packageManager` field. ([Vercel][2])
* Avoid install command overrides unless necessary; Vercel documents that overrides can force an older pnpm version. ([Vercel][2])

[1]: https://vercel.com/academy/ai-summary-app-with-nextjs/deploy-the-app "https://vercel.com/academy/ai-summary-app-with-nextjs/deploy-the-app"
[2]: https://vercel.com/docs/package-managers "https://vercel.com/docs/package-managers"
