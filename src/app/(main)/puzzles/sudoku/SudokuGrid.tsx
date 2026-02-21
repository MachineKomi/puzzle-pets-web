'use client';

import React from 'react';
import { SudokuCell } from '@/lib/puzzle/sudoku/types';
import { Icon } from '@/components/ui/Icon';

export const GEM_MAP: Record<number, string> = {
    1: 'gems/gem_1',
    2: 'gems/gem_2',
    3: 'gems/gem_3',
    4: 'gems/gem_4',
    5: 'gems/gem_5',
    6: 'gems/gem_6',
};

export const GEM_GLOW_MAP: Record<number, string> = {
    1: 'gems/gem_1_glowing',
    2: 'gems/gem_2_glowing',
    3: 'gems/gem_3_glowing',
    4: 'gems/gem_4_glowing',
    5: 'gems/gem_5_glowing',
    6: 'gems/gem_6_glowing',
};

export const GEM_DRAFT_MAP: Record<number, string> = {
    1: 'gems/gem_1_draftnote',
    2: 'gems/gem_2_draftnote',
    3: 'gems/gem_3_draftnote',
    4: 'gems/gem_4_draftnote',
    5: 'gems/gem_5_draftnote',
    6: 'gems/gem_6_draftnote',
};

interface SudokuGridProps {
    grid: SudokuCell[][];
    size: 4 | 6;
    selectedCell: { r: number; c: number } | null;
    onCellClick: (row: number, col: number) => void;
    recentlyPlaced: { r: number, c: number } | null;
    completedCells: { r: number, c: number }[];
}

export const SudokuGrid: React.FC<SudokuGridProps> = ({ grid, size, selectedCell, onCellClick, recentlyPlaced, completedCells }) => {
    // Determine CSS Grid styles based on size
    const gridClass = size === 4 ? 'grid-cols-4' : 'grid-cols-6';
    const blockRows = 2;
    const blockCols = size === 4 ? 2 : 3;

    return (
        <div className={`grid ${gridClass} gap-1 bg-black/20 dark:bg-white/20 p-2 sm:p-3 rounded-xl shadow-inner w-full h-full max-w-[min(100%,80vh)] max-h-[min(100%,80vw)] aspect-square mx-auto`}>
            {grid.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                    const isSelected = selectedCell?.r === rIdx && selectedCell?.c === cIdx;

                    // Determine thick borders for subgrids
                    const borderRight = (cIdx + 1) % blockCols === 0 && cIdx !== size - 1 ? 'border-r-2 border-r-black/50 dark:border-r-white/50' : '';
                    const borderBottom = (rIdx + 1) % blockRows === 0 && rIdx !== size - 1 ? 'border-b-2 border-b-black/50 dark:border-b-white/50' : '';

                    // Determine styling states
                    let bgClass = 'bg-panel hover:bg-black/5 dark:hover:bg-white/5';
                    if (isSelected) bgClass = 'bg-primary/20 hover:bg-primary/30';
                    else if (cell.isGiven) bgClass = 'bg-black/5 dark:bg-white/5';

                    let textClass = 'text-foreground font-bold';
                    if (cell.isGiven) textClass = 'text-foreground/70';
                    else if (cell.isError) textClass = 'text-danger font-bold';
                    else textClass = 'text-primary font-bold';

                    const isRecentlyPlaced = recentlyPlaced?.r === rIdx && recentlyPlaced?.c === cIdx;
                    const isCompleted = completedCells.some(cc => cc.r === rIdx && cc.c === cIdx);
                    const animationClass = isRecentlyPlaced ? 'animate-gem-thump' : isCompleted && !cell.isError && !cell.isGiven ? 'animate-gem-glow' : '';
                    const currentAssetKey = isCompleted || cell.isGiven ? GEM_GLOW_MAP[cell.value as number] : GEM_MAP[cell.value as number];

                    return (
                        <button
                            key={`${rIdx}-${cIdx}`}
                            aria-label={`Cell ${rIdx}-${cIdx}`}
                            className={`
                                aspect-square w-full h-full flex items-center justify-center transition-colors relative
                                ${bgClass} ${textClass} ${borderRight} ${borderBottom}
                                ${rIdx === 0 && cIdx === 0 ? 'rounded-tl-lg' : ''}
                                ${rIdx === 0 && cIdx === size - 1 ? 'rounded-tr-lg' : ''}
                                ${rIdx === size - 1 && cIdx === 0 ? 'rounded-bl-lg' : ''}
                                ${rIdx === size - 1 && cIdx === size - 1 ? 'rounded-br-lg' : ''}
                            `}
                            onClick={() => onCellClick(rIdx, cIdx)}
                        >
                            {cell.value ? (
                                <div className={`w-[90%] h-[90%] drop-shadow-md flex items-center justify-center ${cell.isError ? 'opacity-50 grayscale' : ''} ${cell.isGiven ? 'opacity-70' : ''}`}>
                                    <Icon assetKey={currentAssetKey} className={animationClass} />
                                </div>
                            ) : cell.notes.length > 0 ? (
                                <div className="absolute inset-1 grid grid-cols-2 grid-rows-2 sm:grid-cols-3 sm:grid-rows-2 gap-[1px] p-[2px] opacity-70">
                                    {Array.from({ length: size }, (_, i) => i + 1).map(num => (
                                        <div key={num} className="flex items-center justify-center">
                                            {cell.notes.includes(num) && (
                                                <div className="w-full h-full p-[1px] flex items-center justify-center">
                                                    <Icon assetKey={GEM_DRAFT_MAP[num]} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </button>
                    );
                })
            )}
        </div>
    );
};
