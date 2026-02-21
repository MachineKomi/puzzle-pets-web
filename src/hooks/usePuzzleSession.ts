import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGameStore } from '@/store/game';
import { PuzzleId, PuzzleSession, PuzzleResult } from '@/lib/puzzle/types';
import { calculateReward, CalculatedReward } from '@/lib/puzzle/rewards';
import { sessionLogger } from '@/lib/puzzle/logger';

export function usePuzzleSession(puzzleId: PuzzleId) {
    const store = useGameStore();
    const activeSession = store.puzzles.activeSession;

    // Local state for the end-of-game modal
    const [showResults, setShowResults] = useState(false);
    const [lastResult, setLastResult] = useState<{ result: PuzzleResult, reward: CalculatedReward } | null>(null);

    /**
     * Starts a new session or resumes if one already exists for this puzzleId.
     */
    const startSession = useCallback((initialState?: Record<string, unknown>) => {
        if (activeSession && activeSession.puzzleId === puzzleId) {
            // Resume existing session
            sessionLogger.log({ eventType: 'resume', sessionId: activeSession.id });
            return activeSession;
        }

        // Create new
        const newSession: PuzzleSession = {
            id: uuidv4(),
            puzzleId,
            seed: Math.random().toString(36).substring(2, 10),
            startedAt: Date.now(),
            state: initialState || null,
        };

        store.setActiveSession(newSession);
        sessionLogger.log({ eventType: 'start', sessionId: newSession.id, details: { seed: newSession.seed } });
        return newSession;
    }, [activeSession, puzzleId, store]);

    const logEvent = useCallback((eventType: any, details?: Record<string, unknown>) => {
        if (activeSession) {
            sessionLogger.log({ eventType, sessionId: activeSession.id, details });
        }
    }, [activeSession]);

    /**
     * Completes the current session, calculates rewards, records completion, and clears active state.
     */
    const completeSession = useCallback((result: PuzzleResult) => {
        if (!activeSession) return { reward: null };

        sessionLogger.log({ eventType: 'complete', sessionId: activeSession.id, details: { result } });

        // 1. Calculate and distribute rewards
        const reward = calculateReward(activeSession.puzzleId, result);
        store.addCoins(reward.coins);
        store.gainXp(reward.xp);
        if (reward.gems > 0) {
            store.addGems(reward.gems);
        }

        // 2. Record completion stats if won
        if (result.won && result.stars > 0) {
            store.recordPuzzleCompletion(activeSession.puzzleId, result.stars, result.durationMs);
        }

        // 3. Clear session
        store.setActiveSession(null);

        // 4. Trigger UI modal
        setLastResult({ result, reward });
        setShowResults(true);

        return { reward };
    }, [activeSession, store]);

    /**
     * Abandons the puzzle entirely.
     */
    const abandonSession = useCallback(() => {
        if (!activeSession) return;
        sessionLogger.log({ eventType: 'abandon', sessionId: activeSession.id });
        store.setActiveSession(null);
    }, [activeSession, store]);

    return {
        activeSession,
        startSession,
        completeSession,
        abandonSession,
        logEvent,
        showResults,
        setShowResults,
        lastResult,
    };
}
