import { SudokuCell } from './types';

type GridSize = 4 | 6 | 9;

function createEmptyGrid(size: GridSize): number[][] {
    return Array.from({ length: size }, () => Array(size).fill(0));
}

/** Block dimensions for each grid size: [rows, cols] */
function getBlockDims(size: GridSize): [number, number] {
    if (size === 4) return [2, 2];
    if (size === 6) return [2, 3];
    return [3, 3]; // 9×9
}

// Simple Sudoku validation checking row, col, and subgrid constraints
function isValid(grid: number[][], row: number, col: number, num: number, size: GridSize): boolean {
    // Check row and col
    for (let i = 0; i < size; i++) {
        if (grid[row][i] === num || grid[i][col] === num) return false;
    }

    // Check subgrid
    const [blockRows, blockCols] = getBlockDims(size);
    const startRow = row - (row % blockRows);
    const startCol = col - (col % blockCols);

    for (let i = 0; i < blockRows; i++) {
        for (let j = 0; j < blockCols; j++) {
            if (grid[i + startRow][j + startCol] === num) return false;
        }
    }

    return true;
}

// Backtracking solver to generate a complete board
function solveGrid(grid: number[][], size: GridSize): boolean {
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (grid[row][col] === 0) {
                // Shuffle numbers 1-size for randomization
                const nums = Array.from({ length: size }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
                for (const num of nums) {
                    if (isValid(grid, row, col, num, size)) {
                        grid[row][col] = num;
                        if (solveGrid(grid, size)) return true;
                        grid[row][col] = 0;
                    }
                }
                return false; // Backtrack
            }
        }
    }
    return true;
}

/**
 * Generates a playable Sudoku grid.
 * @param size The grid dimension (4x4, 6x6, or 9x9)
 * @param difficulty Percentage of cells to clear (e.g., 0.5 clears 50% of the board)
 */
export function generateSudoku(size: GridSize, difficulty: number = 0.5): SudokuCell[][] {
    // 1. Generate full solved grid
    const solutionGrid = createEmptyGrid(size);
    solveGrid(solutionGrid, size);

    // 2. Clear cells based on difficulty
    const numCellsToClear = Math.floor(size * size * difficulty);
    let cleared = 0;

    const playGrid = solutionGrid.map(row => [...row]); // Deep copy

    while (cleared < numCellsToClear) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        if (playGrid[row][col] !== 0) {
            playGrid[row][col] = 0;
            cleared++;
        }
    }

    // 3. Map to SudokuCell domain models
    return playGrid.map((rowArr, rowIdx) =>
        rowArr.map((val, colIdx) => ({
            row: rowIdx,
            col: colIdx,
            value: val === 0 ? null : val,
            solution: solutionGrid[rowIdx][colIdx],
            isGiven: val !== 0,
            isError: false,
            notes: [],
        }))
    );
}
