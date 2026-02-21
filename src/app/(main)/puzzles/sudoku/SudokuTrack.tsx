'use client';

import React, { useRef, useEffect } from 'react';
import { useGameStore } from '@/store/game';
import { Icon } from '@/components/ui/Icon';

// Track level definitions: level -> { size, difficulty, label }
const TRACK_LEVELS: Array<{ size: 4 | 6; diff: 'easy' | 'medium' | 'hard'; label: string }> = [
    // Levels 1-6: 4x4
    { size: 4, diff: 'easy', label: '4×4 Easy' },
    { size: 4, diff: 'easy', label: '4×4 Easy' },
    { size: 4, diff: 'easy', label: '4×4 Easy' },
    { size: 4, diff: 'hard', label: '4×4 Hard' },
    { size: 4, diff: 'hard', label: '4×4 Hard' },
    { size: 4, diff: 'hard', label: '4×4 Hard' },
    // Levels 7-12: 6x6
    { size: 6, diff: 'easy', label: '6×6 Easy' },
    { size: 6, diff: 'easy', label: '6×6 Easy' },
    { size: 6, diff: 'easy', label: '6×6 Easy' },
    { size: 6, diff: 'medium', label: '6×6 Medium' },
    { size: 6, diff: 'medium', label: '6×6 Medium' },
    { size: 6, diff: 'medium', label: '6×6 Medium' },
    // Levels 13-20: 6x6 Hard
    { size: 6, diff: 'hard', label: '6×6 Hard' },
    { size: 6, diff: 'hard', label: '6×6 Hard' },
    { size: 6, diff: 'hard', label: '6×6 Hard' },
    { size: 6, diff: 'hard', label: '6×6 Hard' },
    { size: 6, diff: 'hard', label: '6×6 Hard' },
    { size: 6, diff: 'hard', label: '6×6 Hard' },
    { size: 6, diff: 'hard', label: '6×6 Hard' },
    { size: 6, diff: 'hard', label: '6×6 Hard' },
];

interface SudokuTrackProps {
    onSelectLevel: (level: number, size: 4 | 6, diff: 'easy' | 'medium' | 'hard') => void;
}

export const SudokuTrack: React.FC<SudokuTrackProps> = ({ onSelectLevel }) => {
    const currentLevel = useGameStore(state => state.puzzles.sudokuTrackLevel);
    const trackStars = useGameStore(state => state.puzzles.sudokuTrackStars);
    const currentLevelRef = useRef<HTMLButtonElement>(null);

    // Auto-scroll to current level on mount
    useEffect(() => {
        if (currentLevelRef.current) {
            currentLevelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentLevel]);

    // Reversed so level 1 is at the bottom, higher levels at the top (scroll upward = progress)
    const reversedLevels = [...TRACK_LEVELS].reverse();

    return (
        <div className="max-w-lg mx-auto w-full">
            <h1 className="text-4xl font-black text-primary mb-2 tracking-tight text-center">Sudoku</h1>
            <p className="text-foreground/70 mb-6 text-lg text-center">
                Complete puzzles to advance along the track!
            </p>

            {/* Track Path — scrollable, reversed (level 1 at bottom) */}
            <div className="relative max-h-[60vh] overflow-y-auto px-4 py-6" style={{ scrollbarWidth: 'thin' }}>
                {/* MASTER trophy at the top */}
                <div className="flex flex-col items-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-4 border-amber-300 flex items-center justify-center shadow-lg shadow-amber-400/30">
                        <Icon assetKey="ui/puzzles_icon" size="md" />
                    </div>
                    <span className="text-xs font-black text-amber-500 mt-1 uppercase tracking-widest">Master</span>
                </div>

                {/* Winding path of levels */}
                <div className="flex flex-col items-center gap-0">
                    {reversedLevels.map((lvl, revIdx) => {
                        const levelNum = TRACK_LEVELS.length - revIdx; // e.g. 20, 19, 18...
                        const stars = trackStars[levelNum] || 0;
                        const isCompleted = stars > 0;
                        const isCurrent = levelNum === currentLevel;
                        const isLocked = levelNum > currentLevel;

                        // Winding offset: alternating left/right based on original level number
                        const windDirection = levelNum % 2 === 1 ? 'ml-0 mr-auto' : 'mr-0 ml-auto';
                        // For a 3-node pattern: left, center, right, center...
                        const windOffset = levelNum % 4;
                        let translateClass = '';
                        if (windOffset === 1) translateClass = '-translate-x-16 sm:-translate-x-24';
                        else if (windOffset === 2) translateClass = '-translate-x-6 sm:-translate-x-10';
                        else if (windOffset === 3) translateClass = 'translate-x-16 sm:translate-x-24';
                        else translateClass = 'translate-x-6 sm:translate-x-10';

                        return (
                            <div key={levelNum} className="relative flex flex-col items-center w-full">
                                {/* Connector line */}
                                {revIdx > 0 && (
                                    <div className={`w-0.5 h-5 ${isLocked && levelNum > currentLevel + 1 ? 'bg-black/10' : 'bg-primary/30'}`} />
                                )}

                                {/* Level Node */}
                                <div className={`flex flex-col items-center ${translateClass} transition-transform`}>
                                    <button
                                        ref={isCurrent ? currentLevelRef : null}
                                        onClick={() => !isLocked && onSelectLevel(levelNum, lvl.size, lvl.diff)}
                                        disabled={isLocked}
                                        className={`
                                            relative flex flex-col items-center justify-center
                                            w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 transition-all duration-300
                                            ${isCurrent
                                                ? 'bg-gradient-to-br from-primary to-primary-hover text-white border-primary shadow-lg shadow-primary/40 scale-110 animate-pulse'
                                                : isCompleted
                                                    ? 'bg-gradient-to-br from-primary/5 to-primary/15 text-primary border-primary/40 hover:scale-105 hover:shadow-md cursor-pointer'
                                                    : 'bg-black/5 text-foreground/25 border-black/10 cursor-not-allowed opacity-60'
                                            }
                                        `}
                                    >
                                        <span className="text-lg sm:text-xl font-black">{levelNum}</span>
                                        {/* Stars */}
                                        {isCompleted && (
                                            <div className="flex gap-[2px] -mt-1">
                                                {[1, 2, 3].map(s => (
                                                    <span key={s} className={`text-[10px] sm:text-xs ${s <= stars ? 'text-amber-400 drop-shadow-sm' : 'text-black/15'}`}>★</span>
                                                ))}
                                            </div>
                                        )}
                                        {isCurrent && !isCompleted && (
                                            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider -mt-0.5">PLAY</span>
                                        )}
                                    </button>

                                    {/* Level label */}
                                    <span className={`
                                        text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-1
                                        ${isLocked ? 'text-foreground/15' : isCompleted ? 'text-primary/50' : 'text-foreground/50'}
                                    `}>
                                        {lvl.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* START marker at the bottom */}
                <div className="flex flex-col items-center mt-4">
                    <div className="w-0.5 h-5 bg-primary/30" />
                    <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                        <span className="text-primary text-lg">🚀</span>
                    </div>
                    <span className="text-[10px] font-bold text-primary/50 mt-1 uppercase tracking-widest">Start</span>
                </div>
            </div>
        </div>
    );
};

export { TRACK_LEVELS };
