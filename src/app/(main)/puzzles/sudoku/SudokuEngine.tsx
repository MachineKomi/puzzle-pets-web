'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePuzzleSession } from '@/hooks/usePuzzleSession';
import { generateSudoku } from '@/lib/puzzle/sudoku/generator';
import { SudokuState, SudokuCell } from '@/lib/puzzle/sudoku/types';
import { SudokuGrid } from './SudokuGrid';
import { NumberPad } from './NumberPad';
import { Button } from '@/components/ui/Button';

interface SudokuEngineProps {
    difficulty: 'easy' | 'medium' | 'hard';
    gridSize: 4 | 6;
}

export const SudokuEngine: React.FC<SudokuEngineProps> = ({ difficulty, gridSize }) => {
    const { activeSession, startSession, completeSession, abandonSession, logEvent } = usePuzzleSession('sudoku');

    const [selectedCell, setSelectedCell] = useState<{ r: number, c: number } | null>(null);
    const [isNotesMode, setIsNotesMode] = useState(false);

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

    const handleCellClick = useCallback((row: number, col: number) => {
        if (!state) return;
        const targetCell = state.grid[row][col];
        if (targetCell.isGiven || targetCell.value === targetCell.solution) return; // Prevent editing correct/given cells
        setSelectedCell({ r: row, c: col });
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
            completeSession({
                won: true,
                stars: state!.mistakes === 0 ? 3 : state!.mistakes <= 2 ? 2 : 1,
                mistakes: state!.mistakes,
                durationMs: Date.now() - activeSession.startedAt,
                metadata: { difficulty, gridSize }
            });
        }
    }, [activeSession, gridSize, state, difficulty, completeSession]);

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
        // eslint-disable-next-line react-hooks/immutability
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
                // eslint-disable-next-line react-hooks/immutability
                state.mistakes += 1;
            } else {
                cell.isError = false;
                cell.notes = []; // Clear notes if placed
                if (num !== null) logEvent('correct_input', { row: r, col: c, value: num });
            }
            newGrid[r][c] = cell;
        }

        // eslint-disable-next-line react-hooks/immutability
        state.grid = newGrid;
        setSelectedCell({ r, c });

        if (!isNotesMode) checkWin(newGrid);

    }, [state, selectedCell, activeSession, isNotesMode, pushHistory, logEvent, checkWin]);

    if (!activeSession || !state) return <div className="p-8 text-center animate-pulse">Loading Sudoku...</div>;

    return (
        <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-500 pb-12">

            {/* Header Info */}
            <div className="flex justify-between items-center bg-panel p-4 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
                <div>
                    <div className="text-sm text-foreground/70 uppercase tracking-wider font-bold">
                        {gridSize}x{gridSize} • {difficulty}
                    </div>
                    <div className="text-danger font-bold">
                        Mistakes: {state.mistakes}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleHint}>💡 Hint</Button>
                    <Button variant="ghost" size="sm" onClick={handleUndo} disabled={history.length === 0}>↩️ Undo</Button>
                    <Button variant="danger" size="sm" onClick={() => abandonSession()}>Forfeit</Button>
                </div>
            </div>

            <SudokuGrid
                grid={state.grid}
                size={gridSize}
                selectedCell={selectedCell}
                onCellClick={handleCellClick}
            />

            <NumberPad
                size={gridSize}
                onNumberSelect={(num) => handleInput(num)}
                onErase={() => handleInput(null)}
                isNotesMode={isNotesMode}
                onToggleNotes={() => setIsNotesMode(!isNotesMode)}
            />

        </div>
    );
};
