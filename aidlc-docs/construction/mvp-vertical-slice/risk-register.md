# Risk Register (Top 10)

| ID | Risk | Impact | Likelihood | Mitigation |
|----|------|--------|------------|------------|
| 1 | Asset Extraction Difficulty | High | Medium | Inspect legacy Godot `.import` files and raw assets early in U1 to ensure they are standard PNGs/OGGs. |
| 2 | IndexedDB Quota/Wipe | High | Low | Educate user that clearing browser data wipes saves; implement robust try/catch and fallback for storage wrapper. |
| 3 | State Migration Bugs | High | Medium | Implement strict versioning in IndexedDB wrapper from day 1 to handle schema changes gracefully. |
| 4 | Next.js App Router Complexity | Medium | Low | Stick to Client Components (`"use client"`) for game logic; server components only for initial shell if needed. |
| 5 | Tailwind styling drift | Medium | Medium | Define rigid CSS variable tokens mapped directly to legacy Godot UI pixel values before building components. |
| 6 | Puzzle generation edge cases | Medium | Medium | Use established algorithms for Sudoku/Memory generation; implement extensive unit tests in U2. |
| 7 | Performance issues (React renders) | Medium | Low | Use Zustand to avoid unnecessary re-renders; memoize puzzle grid components. |
| 8 | Missing Godot proprietary logic | Medium | High | Rewrite core logic from GDScript to TypeScript from scratch rather than trying to transpile. |
| 9 | Mobile responsiveness | High | High | Design UI mobile-first using Tailwind arbitrary values or strict container aspect ratios to mimic the Godot resolution. |
| 10 | Scope Creep (Animations) | Medium | High | Strictly defer complex Godot particle effects/shaders; use CSS animations or basic framemotion only for MVP. |
