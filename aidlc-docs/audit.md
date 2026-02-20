# Audit Log & Key Decisions

## [Date: 2026-02-20] - MVP Architecture & Tech Stack
- **Framework**: Next.js (App Router) + TypeScript + pnpm.
  - *Rationale*: Industry standard for robust React apps, excellent routing, and seamless Vercel deployment.
- **Styling**: Tailwind CSS + CSS variables tokens.
  - *Rationale*: Allows rapid iteration, easy creation of design systems/theme files, and maps well to the legacy visual style with high performance.
- **State Management**: Zustand.
  - *Rationale*: Minimal boilerplate, highly performant, handles the game loop and progression state effortlessly.
- **Storage**: IndexedDB (via a lightweight wrapper/library like `idb`), with versioned migrations.
  - *Rationale*: Web standard for robust client-side storage, essential for offline-first or persistent local save data. LocalStorage is insufficient for complex pet/inventory data.
- **Puzzles**: Sudoku (4x4, 6x6) and Memory Match.
  - *Rationale*: Core to the legacy identity and feasible for a focused vertical slice.
- **Deployment**: Vercel.
  - *Rationale*: Native support for Next.js, zero-config CI/CD.