# Data Model — Puzzle Pets (v0)

This defines canonical domain objects and save schema concepts.
Implementation is in TypeScript, but this doc is language-agnostic.

## 1) Save root
SaveRoot
- schemaVersion: number
- activeProfileId: string
- profiles: Record<ProfileId, PlayerProfile>

## 2) Player profile
PlayerProfile
- id: string
- displayName: string
- createdAt: ISODate
- updatedAt: ISODate

- progression: ProgressionState
- inventory: InventoryState
- pets: PetState
- settings: SettingsState
- unlocks: UnlockState
- history: HistoryState

## 3) Progression
ProgressionState
- playerLevel: number
- playerXp: number
- coins: number
- starsTotal: number
- completedNodes: Record<NodeId, CompletionRecord> (if using map/trail)

CompletionRecord
- bestStars: 1|2|3
- bestTimeMs?: number
- bestMistakes?: number
- lastPlayedAt: ISODate

## 4) Pets
PetState
- owned: Record<PetInstanceId, PetInstance>
- activePetId?: PetInstanceId
- seenSpecies: Record<PetSpeciesId, boolean>

PetInstance
- id: string
- speciesId: string
- nickname?: string
- rarity: "common"|"rare"|"epic"|"legendary"
- level: number
- xp: number
- stats: PetStats
- cosmetics: PetCosmetics
- createdAt: ISODate

PetStats (lightweight)
- focus: number
- memory: number
- speed: number
- joy: number

## 5) Puzzles and sessions
PuzzleTypeId: "sudoku" | "memory" | "match"

PuzzleSession
- id: string
- puzzleType: PuzzleTypeId
- seed: string
- difficulty: string
- startedAt: ISODate
- endedAt?: ISODate
- outcome: "solved"|"failed"|"quit"
- moves: MoveRecord[]
- metrics: SessionMetrics
- rewardsGranted?: RewardBundle

MoveRecord
- t: number (ms from start)
- action: object (puzzle-specific, but versioned)
- meta?: object

SessionMetrics
- durationMs: number
- mistakes: number
- hintsUsed: number
- undosUsed: number

RewardBundle
- xp: number
- coins: number
- stars: 0|1|2|3
- petXp: number
- items?: ItemGrant[]

## 6) Settings
SettingsState
- musicVolume: 0..1
- sfxVolume: 0..1
- theme: "gem"|"zen"
- reducedMotion: boolean
- largeText: boolean
- colorblindMode: "off"|"high-contrast"|"shape-overlay"

## 7) Migrations
- Increment schemaVersion for any breaking change
- Provide pure migration steps:
  - v0 -> v1: add field defaults
  - v1 -> v2: rename keys, etc