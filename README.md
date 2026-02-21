# Puzzle Pets Arena (MVP)

A browser-based, NextJS rewritten version of the Godot classic! Puzzle Pets Arena combines relaxing match-based puzzles, Pokemon-style pet collection mechanics, and a bright/cozy aesthetic.

## Quick Start
```bash
# install dependencies
pnpm install

# run the local dev server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development Details
The application utilizes:
- **Next.js 16 (App Router)** 
- **Tailwind v4** for CSS and 'Zen' layout variables.
- **Zustand** combined with **IndexedDB (idb)** to construct highly performant local game save persistence.

### Adding Assets
Artwork (like pet sprites, UI icons, or gems) should be placed in `public/assets/`. Then, regenerate the internal manifest binding table by executing `pnpm run gen:assets`.
