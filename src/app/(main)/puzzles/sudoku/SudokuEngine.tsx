'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePuzzleSession } from '@/hooks/usePuzzleSession';
import { useGameStore } from '@/store/game';
import { generateSudoku } from '@/lib/puzzle/sudoku/generator';
import { SudokuState, SudokuCell } from '@/lib/puzzle/sudoku/types';
import { SudokuGrid } from './SudokuGrid';
import { NumberPad } from './NumberPad';
import { PuzzleCompanion } from './PuzzleCompanion';
import { ParticleBurst } from './ParticleBurst';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

const getBlockIndices = (r: number, c: number, size: 4 | 6 | 9) => {
    const blockRows = size === 9 ? 3 : 2;
    const blockCols = size === 4 ? 2 : 3;
    const startRow = Math.floor(r / blockRows) * blockRows;
    const startCol = Math.floor(c / blockCols) * blockCols;

    const indices: { r: number, c: number }[] = [];
    for (let i = 0; i < blockRows; i++) {
        for (let j = 0; j < blockCols; j++) {
            indices.push({ r: startRow + i, c: startCol + j });
        }
    }
    return indices;
};

interface SudokuEngineProps {
    difficulty: 'easy' | 'medium' | 'hard';
    gridSize: 4 | 6 | 9;
    onComplete?: (result: import('@/lib/puzzle/types').PuzzleResult, reward: import('@/lib/puzzle/rewards').CalculatedReward) => void;
}

export const SudokuEngine: React.FC<SudokuEngineProps> = ({ difficulty, gridSize, onComplete }) => {
    const { activeSession, startSession, completeSession, abandonSession, logEvent } = usePuzzleSession('sudoku');

    const [selectedCell, setSelectedCell] = useState<{ r: number, c: number } | null>(null);
    const [isNotesMode, setIsNotesMode] = useState(false);

    const [recentlyPlaced, setRecentlyPlaced] = useState<{ r: number, c: number } | null>(null);
    const [completedCells, setCompletedCells] = useState<{ r: number, c: number }[]>([]);

    const [isPetHappy, setIsPetHappy] = useState(false);
    const [isPetSad, setIsPetSad] = useState(false);
    const [activeBurst, setActiveBurst] = useState<{ x: number, y: number, color: string } | null>(null);
    const [multiBursts, setMultiBursts] = useState<Array<{ id: number, x: number, y: number, color: string }>>([]);

    // Global Store Integration for EXP
    const gainXp = useGameStore(state => state.gainXp);

    // Undo stack keeping historical versions of the grid
    const [history, setHistory] = useState<SudokuCell[][][]>([]);

    // Safe accessor to our structured state injected into the session
    const state = activeSession?.state as unknown as SudokuState | undefined;

    // Boot up a new session only if we are idle and missing an active session context
    useEffect(() => {
        if (!activeSession && !selectedCell) {
            const blanks = difficulty === 'easy' ? 0.3 : difficulty === 'medium' ? 0.5 : 0.7;
            const initialGrid = generateSudoku(gridSize, blanks);

            const initialState: SudokuState = {
                gridSize,
                grid: initialGrid,
                mistakes: 0,
                timeElapsed: 0,
            };

            startSession(initialState as unknown as Record<string, unknown>);
        }
    }, [activeSession, difficulty, gridSize, startSession, selectedCell]);

    const handleCellClick = useCallback((row: number, col: number, e?: React.MouseEvent) => {
        if (!state) return;
        const targetCell = state.grid[row][col];
        if (targetCell.isGiven || targetCell.value === targetCell.solution) return; // Prevent editing correct/given cells
        setSelectedCell({ r: row, c: col });

        // Save coordinate if provided by the mouse event for particle origin
        if (e && e.currentTarget) {
            const rect = e.currentTarget.getBoundingClientRect();
            document.documentElement.dataset.lastActiveX = String(rect.left + rect.width / 2);
            document.documentElement.dataset.lastActiveY = String(rect.top + rect.height / 2);
        }
    }, [state]);

    const pushHistory = useCallback((currentGrid: SudokuCell[][]) => {
        setHistory(prev => [...prev, currentGrid.map(row => row.map(cell => ({ ...cell, notes: [...cell.notes] })))]);
    }, []);

    const handleUndo = useCallback(() => {
        if (!state || history.length === 0) return;
        const newHistory = [...history];
        const prevGrid = newHistory.pop()!;
        setHistory(newHistory);
        // eslint-disable-next-line react-hooks/immutability
        state.grid = prevGrid;
        setSelectedCell(null); // Force react redraw by referencing
    }, [state, history]);

    const checkWin = useCallback((grid: SudokuCell[][]) => {
        if (!activeSession) return;
        let isComplete = true;
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (grid[row][col].value !== grid[row][col].solution) {
                    isComplete = false;
                    break;
                }
            }
        }
        if (isComplete) {
            const result = {
                won: true,
                stars: state!.mistakes === 0 ? 3 : state!.mistakes <= 2 ? 2 : 1,
                mistakes: state!.mistakes,
                durationMs: Date.now() - activeSession.startedAt,
                metadata: { difficulty, gridSize }
            };
            const { reward } = completeSession(result);
            if (onComplete && reward) {
                onComplete(result, reward);
            }
        }
    }, [activeSession, gridSize, state, difficulty, completeSession, onComplete]);

    const handleHint = useCallback(() => {
        if (!state) return;
        // Find empty cell
        const emptyCells: { r: number, c: number }[] = [];
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (state.grid[r][c].value === null) emptyCells.push({ r, c });
            }
        }
        if (emptyCells.length === 0) return;
        const target = emptyCells[Math.floor(Math.random() * emptyCells.length)];

        pushHistory(state.grid);

        const newGrid = state.grid.map(row => [...row]);
        const cell = { ...newGrid[target.r][target.c], value: newGrid[target.r][target.c].solution, isError: false, notes: [] };
        newGrid[target.r][target.c] = cell;

        // eslint-disable-next-line react-hooks/immutability
        state.grid = newGrid;
        state.mistakes += 1; // Penalty for hint
        logEvent('hint', { row: target.r, col: target.c });
        setSelectedCell({ r: target.r, c: target.c });
        checkWin(newGrid);
    }, [state, gridSize, pushHistory, logEvent, checkWin]);

    const handleInput = useCallback((num: number | null) => {
        if (!state || !selectedCell || !activeSession) return;

        const { r, c } = selectedCell;
        const targetCell = state.grid[r][c];

        if (targetCell.isGiven || targetCell.value === targetCell.solution) return;

        pushHistory(state.grid);
        const newGrid = state.grid.map(row => [...row]);
        const cell = { ...newGrid[r][c] };

        if (isNotesMode && num !== null) {
            // Toggle note
            if (cell.notes.includes(num)) {
                cell.notes = cell.notes.filter(n => n !== num);
            } else {
                cell.notes = [...cell.notes, num];
            }
            newGrid[r][c] = cell;
        } else {
            // Set value
            cell.value = num;
            if (num !== null && num !== targetCell.solution) {
                cell.isError = true;
                logEvent('mistake', { row: r, col: c, input: num, solution: targetCell.solution });
                state.mistakes += 1;

                // Trigger Sad Pet
                setIsPetSad(true);
                setTimeout(() => setIsPetSad(false), 2000);
            } else {
                cell.isError = false;
                cell.notes = []; // Clear notes if placed

                // Track newly placed cell for simple thumping
                setRecentlyPlaced({ r, c });
                setTimeout(() => setRecentlyPlaced(null), 1000);

                if (num !== null) {
                    logEvent('correct_input', { row: r, col: c, value: num });
                    // Trigger Happy Pet
                    setIsPetHappy(true);
                    setTimeout(() => setIsPetHappy(false), 2000);

                    // Fire localized sparkles
                    const x = parseFloat(document.documentElement.dataset.lastActiveX || "0");
                    const y = parseFloat(document.documentElement.dataset.lastActiveY || "0");

                    // Quick map for gem colours
                    const colors: Record<number, string> = {
                        1: '#ef4444', 2: '#f59e0b', 3: '#fbbf24', 4: '#10b981', 5: '#3b82f6', 6: '#8b5cf6', 7: '#ec4899', 8: '#14b8a6', 9: '#f97316'
                    };

                    if (x && y) {
                        setActiveBurst({ x, y, color: colors[num] || '#ffffff' });
                    }
                }
            }
            newGrid[r][c] = cell;
        }

        state.grid = newGrid;
        setSelectedCell({ r, c });

        if (!isNotesMode && num !== null && num === targetCell.solution) {
            // Check for row/col/block completion
            let isRowComplete = true;
            let isColComplete = true;
            let isBlockComplete = true;

            const newCompleted: { r: number, c: number }[] = [];

            // Check Row
            for (let i = 0; i < gridSize; i++) {
                if (newGrid[r][i].value !== newGrid[r][i].solution) isRowComplete = false;
            }
            if (isRowComplete) {
                for (let i = 0; i < gridSize; i++) newCompleted.push({ r, c: i });
            }

            // Check Col
            for (let i = 0; i < gridSize; i++) {
                if (newGrid[i][c].value !== newGrid[i][c].solution) isColComplete = false;
            }
            if (isColComplete) {
                for (let i = 0; i < gridSize; i++) newCompleted.push({ r: i, c });
            }

            // Check Block
            const blockIndices = getBlockIndices(r, c, gridSize);
            for (const idx of blockIndices) {
                if (newGrid[idx.r][idx.c].value !== newGrid[idx.r][idx.c].solution) isBlockComplete = false;
            }
            if (isBlockComplete) {
                newCompleted.push(...blockIndices);
            }

            if (newCompleted.length > 0) {
                setCompletedCells(prev => {
                    const merged = [...prev];
                    newCompleted.forEach(nc => {
                        if (!merged.some(m => m.r === nc.r && m.c === nc.c)) {
                            merged.push(nc);
                        }
                    });
                    return merged;
                });

                // Trigger Happy Pet & Grant EXP
                setIsPetHappy(true);
                setTimeout(() => setIsPetHappy(false), 2000);
                gainXp(newCompleted.length * 10); // 10 XP per cleared tile

                // Quick map for gem colours
                const colors: Record<number, string> = {
                    1: '#ef4444', 2: '#f59e0b', 3: '#fbbf24', 4: '#10b981', 5: '#3b82f6', 6: '#8b5cf6', 7: '#ec4899', 8: '#14b8a6', 9: '#f97316'
                };

                // Fire localized bursts with a slight delay so they don't stack on the single-gem burst
                setTimeout(() => {
                    const bursts = newCompleted.map((nc, idx) => {
                        const cellEl = document.querySelector(`[aria-label="Cell ${nc.r}-${nc.c}"]`);
                        let cx = 0, cy = 0;
                        if (cellEl) {
                            const rect = cellEl.getBoundingClientRect();
                            cx = rect.left + rect.width / 2;
                            cy = rect.top + rect.height / 2;
                        }

                        return {
                            id: Date.now() + idx,
                            x: cx,
                            y: cy,
                            color: colors[newGrid[nc.r][nc.c].value as number] || '#ffffff'
                        };
                    });

                    setMultiBursts(prev => [...prev, ...bursts]);

                    // Clean up multi-bursts after animation
                    setTimeout(() => {
                        setMultiBursts([]);
                    }, 1200);
                }, 400);
            }
        }

        if (!isNotesMode) checkWin(newGrid);

    }, [state, selectedCell, activeSession, isNotesMode, pushHistory, logEvent, gridSize, checkWin, gainXp]);

    if (!activeSession || !state) return null;

    /*
     * LAYOUT STRATEGY — viewport-budget approach:
     * Mobile: header(40px) + grid(flex) + numpad(fixed ~90px) + nav(~70px safe area) = 100dvh
     * Desktop: side-by-side — grid left, controls right, all in one viewport height
     *
     * The grid is the only flexible element. It gets an explicit max-height
     * computed from the remaining viewport budget so it can NEVER overflow.
     */

    return (
        <div className="sudoku-layout relative">

            {activeBurst && (
                <ParticleBurst
                    x={activeBurst.x}
                    y={activeBurst.y}
                    color={activeBurst.color}
                    onComplete={() => setActiveBurst(null)}
                />
            )}

            {multiBursts.map(burst => (
                <ParticleBurst
                    key={burst.id}
                    x={burst.x}
                    y={burst.y}
                    color={burst.color}
                />
            ))}

            {/* Compact header — single line on mobile */}
            <div className="sudoku-header flex justify-between items-center bg-panel px-3 py-2 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <span className="text-xs text-foreground/50 uppercase tracking-wider font-bold">
                        {gridSize}×{gridSize} • {difficulty}
                    </span>
                    <span className="text-xs text-danger font-bold">
                        ❌ {state.mistakes}
                    </span>
                </div>
                <div className="flex gap-1.5">
                    <Button variant="ghost" size="sm" onClick={handleHint} className="!px-2 !py-1 !text-xs">
                        <Icon assetKey="ui/hint_icon" size="sm" className="inline-block mr-0.5" /> Hint
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleUndo} disabled={history.length === 0} className="!px-2 !py-1 !text-xs">
                        ↩️
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => abandonSession()} className="!px-2 !py-1 !text-xs">
                        ✕
                    </Button>
                </div>
            </div>

            {/* Main play area */}
            <div className="sudoku-play-area flex flex-col lg:flex-row gap-2 lg:gap-6 items-center justify-center">
                {/* Grid — the flex child that sizes itself to the budget */}
                <div className="sudoku-grid-container flex items-center justify-center">
                    <SudokuGrid
                        grid={state.grid}
                        size={gridSize}
                        selectedCell={selectedCell}
                        onCellClick={handleCellClick}
                        recentlyPlaced={recentlyPlaced}
                        completedCells={completedCells}
                    />
                </div>

                {/* Controls — fixed height, never flexes */}
                <div className="sudoku-controls w-full lg:w-64 lg:shrink-0 flex flex-col justify-center gap-2">
                    {/* Pet — hidden on mobile to save space, visible on desktop */}
                    <div className="hidden lg:block">
                        <PuzzleCompanion isHappy={isPetHappy} isSad={isPetSad} />
                    </div>
                    <NumberPad
                        size={gridSize}
                        onNumberSelect={(num) => handleInput(num)}
                        onErase={() => handleInput(null)}
                        isNotesMode={isNotesMode}
                        onToggleNotes={() => setIsNotesMode(!isNotesMode)}
                    />
                </div>
            </div>
        </div>
    );
};
