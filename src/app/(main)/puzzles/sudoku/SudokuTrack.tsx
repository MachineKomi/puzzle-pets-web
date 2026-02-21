'use client';

import React from 'react';
import { useGameStore } from '@/store/game';
import { Icon } from '@/components/ui/Icon';

// Track level definitions: level -> { size, difficulty, label }
const TRACK_LEVELS: Array<{ size: 4 | 6; diff: 'easy' | 'medium' | 'hard'; label: string }> = [
    // Levels 1-6: 4x4 Easy
    { size: 4, diff: 'easy', label: '4×4 Easy' },
    { size: 4, diff: 'easy', label: '4×4 Easy' },
    { size: 4, diff: 'easy', label: '4×4 Easy' },
    { size: 4, diff: 'hard', label: '4×4 Hard' },
    { size: 4, diff: 'hard', label: '4×4 Hard' },
    { size: 4, diff: 'hard', label: '4×4 Hard' },
    // Levels 7-12: 6x6 Easy
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

    return (
        <div className="max-w-lg mx-auto w-full">
            <h1 className="text-4xl font-black text-primary mb-2 tracking-tight text-center">Sudoku</h1>
            <p className="text-foreground/70 mb-8 text-lg text-center">
                Complete puzzles to advance along the track!
            </p>

            {/* Track Path */}
            <div className="relative flex flex-col items-center gap-0">
                {TRACK_LEVELS.map((lvl, idx) => {
                    const levelNum = idx + 1;
                    const stars = trackStars[levelNum] || 0;
                    const isCompleted = stars > 0;
                    const isCurrent = levelNum === currentLevel;
                    const isLocked = levelNum > currentLevel;

                    // Alternating left/right offset for a winding path
                    const offsetClass = idx % 2 === 0 ? '-translate-x-12' : 'translate-x-12';

                    return (
                        <div key={levelNum} className="relative flex flex-col items-center">
                            {/* Connector line */}
                            {idx > 0 && (
                                <div className={`w-1 h-6 ${isLocked ? 'bg-black/10' : 'bg-primary/40'}`} />
                            )}

                            {/* Level Node */}
                            <button
                                onClick={() => !isLocked && onSelectLevel(levelNum, lvl.size, lvl.diff)}
                                disabled={isLocked}
                                className={`
                                    relative ${offsetClass} flex flex-col items-center justify-center
                                    w-20 h-20 rounded-full border-4 transition-all duration-300
                                    ${isCurrent
                                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-110 animate-pulse'
                                        : isCompleted
                                            ? 'bg-primary/10 text-primary border-primary/40 hover:scale-105 hover:shadow-md cursor-pointer'
                                            : 'bg-black/5 text-foreground/30 border-black/10 cursor-not-allowed'
                                    }
                                `}
                            >
                                <span className="text-xl font-black">{levelNum}</span>
                                {/* Stars below the number */}
                                {isCompleted && (
                                    <div className="flex gap-[2px] mt-[-2px]">
                                        {[1, 2, 3].map(s => (
                                            <span key={s} className={`text-[10px] ${s <= stars ? 'text-amber-400' : 'text-black/20'}`}>★</span>
                                        ))}
                                    </div>
                                )}
                                {isCurrent && !isCompleted && (
                                    <span className="text-[9px] font-bold uppercase tracking-wider mt-[-1px]">GO!</span>
                                )}
                            </button>

                            {/* Level label */}
                            <span className={`
                                text-[10px] font-bold uppercase tracking-wider mt-1 ${offsetClass}
                                ${isLocked ? 'text-foreground/20' : 'text-foreground/50'}
                            `}>
                                {lvl.label}
                            </span>
                        </div>
                    );
                })}

                {/* End marker */}
                <div className="w-1 h-6 bg-black/10" />
                <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center">
                    <Icon assetKey="ui/puzzles_icon" size="md" />
                </div>
                <span className="text-xs font-bold text-accent mt-1">MASTER</span>
            </div>
        </div>
    );
};

export { TRACK_LEVELS };
