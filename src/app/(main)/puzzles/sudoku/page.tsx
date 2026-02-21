'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SudokuEngine } from './SudokuEngine';
import { SudokuTrack } from './SudokuTrack';
import { usePuzzleSession } from '@/hooks/usePuzzleSession';
import { useGameStore } from '@/store/game';
import { PuzzleResultsModal } from '@/components/puzzle/PuzzleResultsModal';
import { PuzzleResult } from '@/lib/puzzle/types';
import { CalculatedReward } from '@/lib/puzzle/rewards';

export default function SudokuPage() {
    const { activeSession, abandonSession } = usePuzzleSession('sudoku');
    const advanceSudokuTrack = useGameStore(state => state.advanceSudokuTrack);

    // Local pre-game configuration state
    const [config, setConfig] = useState<{ level: number; size: 4 | 6; diff: 'easy' | 'medium' | 'hard' } | null>(null);

    // Results modal state — managed locally, fed by SudokuEngine's onComplete callback
    const [showResults, setShowResults] = useState(false);
    const [completedResult, setCompletedResult] = useState<{ result: PuzzleResult; reward: CalculatedReward } | null>(null);

    // Handle track level selection
    const handleSelectLevel = useCallback((level: number, size: 4 | 6, diff: 'easy' | 'medium' | 'hard') => {
        setConfig({ level, size, diff });
    }, []);

    // Called by SudokuEngine when the puzzle is completed
    const handleComplete = useCallback((result: PuzzleResult, reward: CalculatedReward) => {
        setCompletedResult({ result, reward });
        setShowResults(true);
    }, []);

    // Handle results modal close -> advance track and return to track view
    const handleResultsClose = useCallback(() => {
        if (completedResult?.result.won && config?.level) {
            advanceSudokuTrack(config.level, completedResult.result.stars);
        }
        setShowResults(false);
        setCompletedResult(null);
        setConfig(null); // Return to track view
    }, [completedResult, config, advanceSudokuTrack]);

    // If a session is active (or config is chosen), render engine
    if (activeSession?.puzzleId === 'sudoku' || config) {
        return (
            <div className="max-w-3xl mx-auto w-full pt-4">
                <SudokuEngine
                    gridSize={config?.size || 4}
                    difficulty={config?.diff || 'easy'}
                    onComplete={handleComplete}
                />

                {/* Results Modal — managed by page via onComplete callback */}
                <PuzzleResultsModal
                    isOpen={showResults}
                    onClose={handleResultsClose}
                    result={completedResult?.result || null}
                    reward={completedResult?.reward || null}
                />
            </div>
        );
    }

    // If a DIFFERENT puzzle type is active, lock them out
    if (activeSession) {
        return (
            <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
                <Card variant="panel" className="p-8 border-danger/20 w-full animate-in zoom-in">
                    <h2 className="text-2xl font-bold text-danger mb-4">Active Session Found</h2>
                    <p className="mb-6 text-foreground/80">You already have an active {activeSession.puzzleId} puzzle running. You must finish or forfeit it before starting Sudoku.</p>
                    <Button variant="danger" onClick={() => abandonSession()}>Forfeit Active Match</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto flex flex-col items-center min-h-[70vh] w-full pt-4 sm:pt-12 pb-20">
            <Card variant="elevated" className="p-8 w-full animate-in slide-in-from-bottom-4 duration-500">
                <SudokuTrack onSelectLevel={handleSelectLevel} />

                <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 max-w-sm mx-auto">
                    <Link href="/puzzles" className="contents">
                        <Button variant="ghost" className="w-full">Back to Puzzles</Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
