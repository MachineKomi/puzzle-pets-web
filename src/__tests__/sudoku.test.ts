import { describe, it, expect } from 'vitest';
import { generateSudoku } from '../lib/puzzle/sudoku/generator';

describe('Sudoku Generator & Validator', () => {
    it('generates a valid 4x4 grid', () => {
        const grid = generateSudoku(4, 0.5);
        expect(grid.length).toBe(4);
        expect(grid[0].length).toBe(4);

        // Check if there are some given cells
        let givens = 0;
        grid.forEach(row => row.forEach(cell => {
            if (cell.isGiven) givens++;
            // The solution should be 1-4
            expect(cell.solution).toBeGreaterThanOrEqual(1);
            expect(cell.solution).toBeLessThanOrEqual(4);
        }));

        expect(givens).toBeGreaterThan(0);
        expect(givens).toBeLessThan(16);
    });

    it('generates a valid 6x6 grid with valid backtracking logic', () => {
        const grid = generateSudoku(6, 0.5);
        expect(grid.length).toBe(6);
        expect(grid[0].length).toBe(6);

        // Ensure no duplicates in the first row of solutions
        const firstRowSols = grid[0].map(c => c.solution);
        const unique = new Set(firstRowSols);
        expect(unique.size).toBe(6);
    });
});
