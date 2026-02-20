# Legacy Review — Sudoku Pets (Godot)

## 1) What Sudoku Pets already proves
Legacy repo demonstrates:
- Kid-friendly Sudoku with gem visuals
- Pet collection and progression motivation loop
- World map progression and star ratings
- Strong ethical/parent-trust messaging (no ads, no real-money gambling)

## 2) Key design DNA to preserve
From legacy docs:
- Gem/shape-first visuals for pre-readers
- Helpful hints that teach “why”
- Non-punishing pets (no death/decay loops)
- Zen mode option (reduced stimulation)
- Touch-first UX

## 3) Legacy architecture patterns worth reusing conceptually
Legacy component model splits:
- UI scenes (menu/map/puzzle/pets/settings)
- Domain logic (board/progress/pet collection/settings)
- Service autoloads (game/save/audio/event bus)
- Data resources (puzzle data/pet data/level config)

Web mapping:
- UI routes/components
- Domain modules (pure logic)
- Services (store + persistence + audio + event emitter)
- Content definitions (JSON/TS data)

## 4) Algorithm notes
- Sudoku generation uses backtracking to create a full solution then removes a percentage of cells for difficulty.
- The removal approach may not guarantee uniqueness; decide whether uniqueness is required for Puzzle Pets.

## 5) Save system notes
Legacy SaveManager stores JSON save data with keys like:
- player_xp, player_gold, player_level
- completed_levels
- owned_pets
- settings

This maps cleanly to a versioned IndexedDB schema in web.

## 6) Reality check on current state
Docs indicate broad feature completeness, but handoff notes highlight:
- Some UI icons were placeholders (emoji/unicode)
- Audio not fully hooked up
- Power-ups visible but not implemented

For Puzzle Pets:
- Treat docs + assets as the canonical intent
- Treat the Godot implementation as reference only