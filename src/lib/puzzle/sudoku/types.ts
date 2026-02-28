/**
 * A standard 4x4, 6x6, or 9x9 Sudoku Cell.
 */
export interface SudokuCell {
    row: number;
    col: number;
    value: number | null;     // The current value, null if empty
    solution: number;         // The correct value for this cell
    isGiven: boolean;         // True if this cell was provided at the start of the puzzle
    isError: boolean;         // True if the current value violates Sudoku rules
    notes: number[];          // Small pencil-in notes
}

/**
 * State object stored structurally inside `PuzzleSession` `state`.
 */
export interface SudokuState {
    gridSize: 4 | 6 | 9;      // Sudoku variations
    grid: SudokuCell[][];     // 2D Array [row][col]
    mistakes: number;         // Tracked within the individual puzzle session
    timeElapsed: number;      // Current play time recorded locally
}
