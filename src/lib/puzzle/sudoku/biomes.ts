/** Biome definitions for the 100-level Sudoku track */

export interface BiomeDef {
  name: string;
  levelRange: [number, number]; // inclusive
  colors: {
    bg: [string, string];        // gradient from/to
    nodeActive: string;
    nodeCompleted: string;
    nodeLocked: string;
    connector: string;
  };
  emoji: string;                 // decorative divider icon
}

export const BIOMES: BiomeDef[] = [
  {
    name: 'Meadow Garden',
    levelRange: [1, 20],
    colors: {
      bg: ['#ecfccb', '#d9f99d'],       // lime-100 → lime-200
      nodeActive: '#65a30d',             // lime-600
      nodeCompleted: '#84cc16',          // lime-500
      nodeLocked: '#d4d4d4',            // gray-300
      connector: 'rgba(101,163,13,0.3)',
    },
    emoji: '🌸',
  },
  {
    name: 'Crystal Caves',
    levelRange: [21, 40],
    colors: {
      bg: ['#ede9fe', '#c4b5fd'],        // violet-100 → violet-300
      nodeActive: '#7c3aed',             // violet-600
      nodeCompleted: '#8b5cf6',          // violet-500
      nodeLocked: '#d4d4d4',
      connector: 'rgba(124,58,237,0.3)',
    },
    emoji: '💎',
  },
  {
    name: 'Sunset Beach',
    levelRange: [41, 60],
    colors: {
      bg: ['#ffedd5', '#fed7aa'],        // orange-100 → orange-200
      nodeActive: '#ea580c',             // orange-600
      nodeCompleted: '#f97316',          // orange-500
      nodeLocked: '#d4d4d4',
      connector: 'rgba(234,88,12,0.3)',
    },
    emoji: '🌅',
  },
  {
    name: 'Starlight Forest',
    levelRange: [61, 80],
    colors: {
      bg: ['#e0e7ff', '#c7d2fe'],        // indigo-100 → indigo-200
      nodeActive: '#4338ca',             // indigo-700
      nodeCompleted: '#6366f1',          // indigo-500
      nodeLocked: '#94a3b8',            // slate-400
      connector: 'rgba(67,56,202,0.3)',
    },
    emoji: '✨',
  },
  {
    name: 'Cloud Kingdom',
    levelRange: [81, 100],
    colors: {
      bg: ['#fefce8', '#fde68a'],        // yellow-50 → amber-200
      nodeActive: '#d97706',             // amber-600
      nodeCompleted: '#f59e0b',          // amber-500
      nodeLocked: '#d4d4d4',
      connector: 'rgba(217,119,6,0.3)',
    },
    emoji: '☁️',
  },
];

export interface TrackLevel {
  size: 4 | 6 | 9;
  diff: 'easy' | 'medium' | 'hard';
  label: string;
  biomeIndex: number; // index into BIOMES
}

/** Generate all 100 levels programmatically based on biome definitions */
function generateTrackLevels(): TrackLevel[] {
  const levels: TrackLevel[] = [];

  // Biome 0: Meadow Garden (1-20) — 4×4
  for (let i = 0; i < 20; i++) {
    const diff: 'easy' | 'medium' | 'hard' =
      i < 8 ? 'easy' : i < 14 ? 'medium' : 'hard';
    levels.push({ size: 4, diff, label: `4×4 ${capitalize(diff)}`, biomeIndex: 0 });
  }

  // Biome 1: Crystal Caves (21-40) — 6×6
  for (let i = 0; i < 20; i++) {
    const diff: 'easy' | 'medium' | 'hard' =
      i < 8 ? 'easy' : i < 14 ? 'medium' : 'hard';
    levels.push({ size: 6, diff, label: `6×6 ${capitalize(diff)}`, biomeIndex: 1 });
  }

  // Biome 2: Sunset Beach (41-60) — 6×6 medium-hard
  for (let i = 0; i < 20; i++) {
    const diff: 'easy' | 'medium' | 'hard' =
      i < 6 ? 'medium' : 'hard';
    levels.push({ size: 6, diff, label: `6×6 ${capitalize(diff)}`, biomeIndex: 2 });
  }

  // Biome 3: Starlight Forest (61-80) — 6×6 hard + 9×9 easy
  for (let i = 0; i < 20; i++) {
    if (i < 10) {
      levels.push({ size: 6, diff: 'hard', label: '6×6 Hard', biomeIndex: 3 });
    } else {
      const diff: 'easy' | 'medium' | 'hard' = i < 16 ? 'easy' : 'medium';
      levels.push({ size: 9, diff, label: `9×9 ${capitalize(diff)}`, biomeIndex: 3 });
    }
  }

  // Biome 4: Cloud Kingdom (81-100) — 9×9
  for (let i = 0; i < 20; i++) {
    const diff: 'easy' | 'medium' | 'hard' =
      i < 7 ? 'medium' : 'hard';
    levels.push({ size: 9, diff, label: `9×9 ${capitalize(diff)}`, biomeIndex: 4 });
  }

  return levels;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const TRACK_LEVELS = generateTrackLevels();
export const TOTAL_LEVELS = TRACK_LEVELS.length; // 100

/** Get biome for a given level number (1-indexed) */
export function getBiomeForLevel(levelNum: number): BiomeDef {
  const idx = TRACK_LEVELS[levelNum - 1]?.biomeIndex ?? 0;
  return BIOMES[idx];
}
