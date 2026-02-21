/**
 * Standard puzzle identifiers supported by the application.
 */
export type PuzzleId = 'sudoku' | 'memory' | 'gem_match';

/**
 * Represents an active puzzle gameplay session.
 */
export interface PuzzleSession {
    id: string;          // Unique session ID
    puzzleId: PuzzleId;  // Which puzzle engine is running
    seed: string;        // RNG seed for the session
    startedAt: number;   // Timestamp of session start
    state: Record<string, unknown> | null;  // Opaque state managed by the specific puzzle engine (e.g. board layout)
}

/**
 * Represents the outcome of a completed puzzle session.
 */
export interface PuzzleResult {
    won: boolean;           // Did the player successfully complete the puzzle?
    stars: number;          // 1 to 3 stars rating, 0 if lost
    durationMs: number;     // Total time spent playing the puzzle
    mistakes: number;       // Number of mistakes made
    metadata?: Record<string, unknown>; // Puzzle-specific metadata (e.g., max combo, score)
}

/**
 * Standard log event for puzzle sessions.
 */
export interface SessionEvent {
    timestamp: number;
    sessionId: string;
    eventType: 'start' | 'resume' | 'pause' | 'complete' | 'abandon' | 'mistake';
    details?: Record<string, unknown>;
}
