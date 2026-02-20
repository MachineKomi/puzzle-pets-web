# Asset Migration Plan — Sudoku Pets → Puzzle Pets

## Goal
Reuse legacy art assets and preserve the visual identity while adapting to web delivery.

## A) Inventory and classification (required)
1. Create an inventory of all legacy assets:
   - sprites (UI, gems, pets, backgrounds)
   - icons
   - fonts (if any)
   - audio (if any)
2. Classify each asset:
   - MUST KEEP (core identity)
   - NICE TO HAVE
   - REPLACE (temporary/placeholder)

## B) Web-friendly packaging
1. Copy assets into:
   - `public/assets/...` (served statically)
2. Normalize filenames:
   - kebab-case
   - stable names for caching
3. Prefer:
   - PNG/WebP for sprites
   - SVG for UI icons when appropriate
4. Remove engine-specific artifacts (`.import` etc).

## C) Asset manifest
Create a machine-readable manifest file:
- `assets/manifest.json`
Containing:
- id, file path, tags (puzzle/ui/pet/background), scale variants
- intended usage sites

This supports AI agents:
- locating assets
- preventing duplicates
- enforcing consistent usage

## D) Licensing/ownership check (gate before public release)
- Confirm that Puzzle Pets has rights to reuse all legacy assets.
- Add a clear LICENSE file in the new repo.
- If any assets were generated with AI tools, document any constraints.

## E) UI baseline recreation
Recreate these core UI primitives:
- Gem icons set (numbers/shapes)
- Button styles + frames
- Background textures/panels
- Pet portrait frames + rarity markers

## F) Performance considerations
- Prefer sprite atlases only if needed
- Avoid loading all pet sprites on first load
- Lazy-load heavy assets per route/puzzle