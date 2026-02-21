import { test, expect } from '@playwright/test';

test.describe('Sudoku MVP Integration', () => {
    test.beforeEach(async ({ page }) => {
        // Go to sudoku start page
        await page.goto('/puzzles/sudoku');
    });

    test('can start a 4x4 puzzle, select a cell, and input a note', async ({ page }) => {
        // Click Track Level 1 (first available level on the puzzle track)
        const levelButton = page.getByRole('button', { name: '1' }).first();
        await levelButton.click();

        // Ensure Sudoku grid rendered
        await expect(page.getByText('4x4 • easy')).toBeVisible();

        // Find the first cell on the grid and click it
        const firstCell = page.getByRole('button', { name: 'Cell 0-0' });
        await firstCell.click();

        // Toggle notes
        const notesBtn = page.getByRole('button', { name: /Notes/i });
        await notesBtn.click();

        // Select '1' from numpad via accessible label
        const num1Btn = page.getByRole('button', { name: 'Select Gem 1' });
        await num1Btn.click();

        // Verify some state changed visually (the cell is still visible and didn't crash)
        await expect(page.getByRole('button', { name: 'Cell 0-0' })).toBeVisible();
    });
});
