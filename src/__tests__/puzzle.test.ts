import { describe, it, expect, beforeEach } from 'vitest';
import { calculateReward } from '@/lib/puzzle/rewards';
import { sessionLogger } from '@/lib/puzzle/logger';

describe('Puzzle Framework', () => {
    describe('calculateReward()', () => {
        it('gives a consolation prize if the puzzle is lost', () => {
            const reward = calculateReward('sudoku', { won: false, stars: 0, durationMs: 10000, mistakes: 3 });
            expect(reward.coins).toBe(5);
            expect(reward.xp).toBe(10);
        });

        it('calculates full reward for a perfect 3-star sudoku', () => {
            const reward = calculateReward('sudoku', { won: true, stars: 3, durationMs: 60000, mistakes: 0 });
            // Base Sudoku is 75 coins, 150 xp
            // 3 stars = 1.0 multiplier
            // 0 mistakes = 1.0 multiplier
            expect(reward.coins).toBe(75);
            expect(reward.xp).toBe(150);
        });

        it('applies penalties for lower stars and mistakes in memory match', () => {
            const reward = calculateReward('memory', { won: true, stars: 2, durationMs: 45000, mistakes: 2 });
            // Base Memory is 40 coins, 80 xp
            // 2 stars = 0.666 multiplier
            // 2 mistakes = 0.8 multiplier
            // Coins: floor(40 * 0.666 * 0.8) = floor(21.312) = 21
            // XP: floor(80 * 0.666 * 0.8) = floor(42.624) = 42
            expect(reward.coins).toBe(21);
            expect(reward.xp).toBe(42);
        });
    });

    describe('SessionLogger', () => {
        beforeEach(() => {
            sessionLogger.clear();
        });

        it('logs events and assigns timestamps', () => {
            sessionLogger.log({ sessionId: 'session-123', eventType: 'start' });

            const events = sessionLogger.getEvents();
            expect(events.length).toBe(1);
            expect(events[0].sessionId).toBe('session-123');
            expect(events[0].eventType).toBe('start');
            expect(events[0].timestamp).toBeGreaterThan(0);
        });

        it('filters events by sessionId', () => {
            sessionLogger.log({ sessionId: 'session-123', eventType: 'start' });
            sessionLogger.log({ sessionId: 'session-456', eventType: 'start' });

            const events123 = sessionLogger.getEvents('session-123');
            expect(events123.length).toBe(1);
            expect(events123[0].sessionId).toBe('session-123');
        });
    });
});
