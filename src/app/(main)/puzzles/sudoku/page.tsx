'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SudokuEngine } from './SudokuEngine';
import { usePuzzleSession } from '@/hooks/usePuzzleSession';

export default function SudokuPage() {
    const { activeSession, abandonSession } = usePuzzleSession('sudoku');

    // Local pre-game configuration state
    const [config, setConfig] = useState<{ size: 4 | 6, diff: 'easy' | 'medium' | 'hard' } | null>(null);

    // If a session is active (or resuming) OR config is chosen, render engine
    if (activeSession?.puzzleId === 'sudoku' || config) {
        const size = (activeSession?.state as any)?.gridSize as 4 | 6 || config?.size || 4;
        const diff = config?.diff || 'easy'; // Fallback if restoring via IDB without local config memory
        return (
            <div className="max-w-3xl mx-auto w-full pt-4">
                <SudokuEngine gridSize={size} difficulty={diff} />
            </div>
        );
    }

    // If a DIFFERENT puzzle types active, lock them out
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
        <div className="max-w-3xl mx-auto flex flex-col items-center min-h-[70vh] w-full pt-4 sm:pt-12">
            <Card variant="elevated" className="p-8 text-center w-full animate-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-4xl font-black text-primary mb-2 tracking-tight">Sudoku</h1>
                <p className="text-foreground/70 mb-10 text-lg">
                    Balance the grid with numbers 1 through N. No duplicates in any row, column, or sub-box!
                </p>

                <div className="flex flex-col gap-8 max-w-sm mx-auto">
                    {/* 4x4 Mini Options */}
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-foreground/60 uppercase tracking-widest text-sm text-left mb-1">4x4 Grid (Mini)</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="primary" onClick={() => setConfig({ size: 4, diff: 'easy' })}>Easy</Button>
                            <Button variant="accent" onClick={() => setConfig({ size: 4, diff: 'hard' })}>Hard</Button>
                        </div>
                    </div>

                    {/* 6x6 Standard Options */}
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-foreground/60 uppercase tracking-widest text-sm text-left mb-1">6x6 Grid (Standard)</h3>
                        <div className="grid grid-cols-3 gap-2">
                            <Button variant="primary" onClick={() => setConfig({ size: 6, diff: 'easy' })}>Easy</Button>
                            <Button variant="primary" className="opacity-80" onClick={() => setConfig({ size: 6, diff: 'medium' })}>Mod</Button>
                            <Button variant="accent" onClick={() => setConfig({ size: 6, diff: 'hard' })}>Hard</Button>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5">
                        <Link href="/puzzles" className="contents">
                            <Button variant="ghost" className="w-full">Back to Menu</Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
}

