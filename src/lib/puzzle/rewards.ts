import { PuzzleId, PuzzleResult } from './types';

export interface CalculatedReward {
    coins: number;
    xp: number;
}

/**
 * Calculates the reward for completing a puzzle.
 * Different puzzle types can scale rewards differently.
 */
export function calculateReward(puzzleId: PuzzleId, result: PuzzleResult): CalculatedReward {
    if (!result.won || result.stars === 0) {
        // Basic consolation prize for trying
        return { coins: 5, xp: 10 };
    }

    // Base rewards depend on the puzzle difficulty / type
    // Simple MVP approach: flat base + scale by stars and speed penalty reduction
    let baseCoins = 50;
    let baseXp = 100;

    switch (puzzleId) {
        case 'sudoku':
            // Sudoku takes longer, higher potential ceiling
            baseCoins = 75;
            baseXp = 150;
            break;
        case 'memory':
            baseCoins = 40;
            baseXp = 80;
            break;
        case 'gem_match':
            baseCoins = 60;
            baseXp = 120;
            break;
    }

    // Scale rewards by stars earned (1 to 3)
    const starMultiplier = result.stars / 3; // e.g., 3 stars = 1.0, 1 star = 0.33

    // Penalty for mistakes (up to 50% reduction)
    const mistakePenalty = Math.max(0, 1 - (result.mistakes * 0.1));

    const coins = Math.floor(baseCoins * starMultiplier * mistakePenalty);
    const xp = Math.floor(baseXp * starMultiplier * mistakePenalty);

    return { coins, xp };
}
