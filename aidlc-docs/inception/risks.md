# Risks — Puzzle Pets

## R-001: Asset licensing ambiguity
- Risk: Legacy README states MIT license, but ensure license file + asset rights are explicit before release.
- Mitigation: add LICENSE, document asset provenance, confirm rights.
- Status: Open

## R-002: Match game scope creep
- Risk: Match-3 variants can balloon (combos, special tiles, animations).
- Mitigation: pick ONE variant for first implementation; minimal special tiles; strict unit scope.
- Status: Open

## R-003: Offline persistence edge cases
- Risk: IndexedDB quirks and migration bugs can corrupt saves.
- Mitigation: versioned schema; migration tests; backup snapshot before migrate.
- Status: Open

## R-004: Accessibility regressions (color reliance)
- Risk: gems/colors can exclude colorblind users.
- Mitigation: shape overlays, high contrast mode, and “color not only cue” policy.
- Status: Open

## R-005: “Game feel” on web
- Risk: Web animations can feel less “game-like” than engine-based.
- Mitigation: deliberate animation system; reduced-motion support; performance budgets.
- Status: Open

## R-006: Sudoku uniqueness
- Risk: generator may create puzzles with multiple solutions.
- Mitigation: decide if uniqueness is required; implement uniqueness check if needed.
- Status: Open