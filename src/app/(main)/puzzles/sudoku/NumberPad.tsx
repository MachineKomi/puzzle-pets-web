'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { GEM_MAP, GEM_DRAFT_MAP } from './SudokuGrid';

interface NumberPadProps {
    size: 4 | 6;
    onNumberSelect: (num: number) => void;
    onErase: () => void;
    isNotesMode: boolean;
    onToggleNotes: () => void;
}

export const NumberPad: React.FC<NumberPadProps> = ({ size, onNumberSelect, onErase, isNotesMode, onToggleNotes }) => {
    const numbers = Array.from({ length: size }, (_, i) => i + 1);

    return (
        <div className="flex flex-col gap-4 w-full max-w-[400px] mx-auto">
            {/* Number Buttons Row */}
            <div className="flex gap-2 justify-center flex-wrap">
                {numbers.map(num => (
                    <Button
                        key={num}
                        variant="ghost"
                        aria-label={`Select Gem ${num}`}
                        className="w-14 h-14 p-2 shadow-md hover:scale-105 transition-transform"
                        onClick={() => onNumberSelect(num)}
                    >
                        <div className="w-full h-full drop-shadow-sm pointer-events-none flex items-center justify-center transform scale-150">
                            <Icon assetKey={isNotesMode ? GEM_DRAFT_MAP[num] as string : GEM_MAP[num] as string} />
                        </div>
                    </Button>
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
