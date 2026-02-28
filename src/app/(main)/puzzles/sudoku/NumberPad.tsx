'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { GEM_MAP, GEM_DRAFT_MAP } from './SudokuGrid';

interface NumberPadProps {
    size: 4 | 6 | 9;
    onNumberSelect: (num: number) => void;
    onErase: () => void;
    isNotesMode: boolean;
    onToggleNotes: () => void;
}

export const NumberPad: React.FC<NumberPadProps> = ({ size, onNumberSelect, onErase, isNotesMode, onToggleNotes }) => {
    const numbers = Array.from({ length: size }, (_, i) => i + 1);

    return (
        <div className="flex flex-col gap-4 w-full max-w-[400px] mx-auto">
            {/* Gem Selection Buttons — plain <button> to avoid Button component padding conflicts */}
            <div className="flex gap-1.5 sm:gap-2 justify-center flex-wrap">
                {numbers.map(num => (
                    <button
                        key={num}
                        aria-label={`Select Gem ${num}`}
                        className={`${size === 9 ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-14 h-14 sm:w-16 sm:h-16'} p-1 rounded-xl bg-transparent hover:bg-black/5 dark:hover:bg-white/10 shadow-md hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-focus-ring`}
                        onClick={() => onNumberSelect(num)}
                    >
                        <img
                            src={`/assets/${isNotesMode ? GEM_DRAFT_MAP[num] : GEM_MAP[num]}.png`}
                            alt={`Gem ${num}`}
                            className="w-full h-full object-contain drop-shadow-sm"
                        />
                    </button>
                ))}
            </div>

            {/* Utilities Row */}
            <div className="flex gap-2 justify-center">
                <Button variant="ghost" onClick={onErase} className="flex-1">
                    🪄 Erase
                </Button>
                <Button
                    variant={isNotesMode ? "primary" : "ghost"}
                    className="flex-1"
                    onClick={onToggleNotes}
                >
                    <Icon assetKey="ui/draft_icon" size="sm" className="inline-block mr-1" /> Notes {isNotesMode ? 'ON' : 'OFF'}
                </Button>
            </div>
        </div>
    );
};
