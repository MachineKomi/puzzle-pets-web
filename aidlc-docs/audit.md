# Audit Log (append-only) — Puzzle Pets

> Append-only. New entries go at the top.

## 2026-02-20 — Decision: Replatform to Web (Next.js + Vercel default)
**Context**
- Legacy project is Godot-based, but web-app development is expected to be faster with current AI dev tooling and easier cross-device iteration.

**Decision**
- Build Puzzle Pets as a web app (PWA-capable), default deployment target: Vercel.

**Alternatives considered**
- Continue in Godot (harder for some AI coding workflows)
- Cloudflare Pages / Netlify (possible, but start with Vercel given Next.js alignment)
- Native wrappers (Capacitor/Tauri) (defer until needed)

**Consequences**
- Need explicit offline-first design (service worker + IndexedDB)
- Need careful mobile UI ergonomics (touch targets, responsiveness)
- Must recreate “game feel” with web animation patterns

---

## 2026-02-20 — Decision: Preserve legacy art/style + ethical design philosophy
**Decision**
- Reuse existing art assets/art direction and preserve core design principles:
  - Gem/shape-first visuals for pre-readers
  - Non-punishing pet philosophy
  - No ads, no real-money gambling loops
  - Family-friendly tone and UX

**Consequences**
- Asset migration pipeline required
- Accessibility requirements (shape + color) remain core
- Content additions must remain “kid safe”

---

## 2026-02-20 — Decision: Multi-puzzle “Puzzle Gym” structure
**Decision**
- Expand from Sudoku-only to a curated set of short puzzles (Sudoku, Memory, Match-3 variants first), unified by:
  - Shared rewards/progression
  - Shared “gem” visual language
  - Pet training/arena motivation loop

**Consequences**
- Need puzzle plugin framework early (U4)
- Need balancing across puzzle types (reward normalization)