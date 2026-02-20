# Puzzle Catalog — Puzzle Pets

This file defines the puzzle lineup and design constraints.

## Puzzle interface expectations (for all puzzle types)
Every puzzle must provide:
- Deterministic generation from seed + difficulty
- A move/action model that supports undo
- A completion rule (solved check)
- A hint/assist model (even if minimal)
- Accessibility notes (color is not the only cue)

---

## Tier 1 (MVP)

### PZ-001: Gem Sudoku
**Core mechanic:** fill grid with gems without repeating in row/col/region  
**Difficulty scaling:**
- board size (4x4 → 6x6 → 9x9)
- number of givens
- hint availability

**Assists:**
- notes mode
- highlight row/col/region
- hint v1: naked single explanation

**Reward emphasis:** Focus

---

### PZ-002: Memory Match
**Core mechanic:** flip tiles, match pairs  
**Difficulty scaling:**
- grid size
- time assist (optional)
- “peek” helper for very young players (optional)

**Reward emphasis:** Memory

---

## Tier 2 (VNext / early)

### PZ-101: Match Game Variant
**Option A (swap):** classic swap adjacent gems to form matches  
**Option B (drag path):** drag a gem around to reorder and create multiple matches in one move (“PAD-like”)  
Pick one for first release of this puzzle to avoid scope blowup.

**Difficulty scaling:**
- board size
- move limit vs relaxed mode
- special tiles set size (start minimal)

**Reward emphasis:** Speed

**Accessibility:**
- shapes/pattern overlays
- high contrast mode
- reduced motion option

---

## Tier 3 (Backlog candidates)
Only add if they fit the “short, teachable, family-friendly” bar:
- Simple pattern copy (Simon-style)
- Spot-the-rule mini-logic (very small grids)
- “Connect the gems” path puzzle (no time pressure)