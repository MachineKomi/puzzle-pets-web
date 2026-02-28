'use client';

import React, { useRef, useLayoutEffect, useCallback, useEffect } from 'react';
import { useGameStore } from '@/store/game';
import { TRACK_LEVELS, BIOMES, getBiomeForLevel } from '@/lib/puzzle/sudoku/biomes';

interface SudokuTrackProps {
    onSelectLevel: (level: number, size: 4 | 6 | 9, diff: 'easy' | 'medium' | 'hard') => void;
}

export const SudokuTrack: React.FC<SudokuTrackProps> = ({ onSelectLevel }) => {
    const currentLevel = useGameStore(state => state.puzzles.sudokuTrackLevel);
    const trackStars = useGameStore(state => state.puzzles.sudokuTrackStars);
    const scrollRef = useRef<HTMLDivElement>(null);
    const currentLevelRef = useRef<HTMLButtonElement>(null);

    // The highest visible level: current + 3 (can't scroll beyond this)
    const maxVisibleLevel = currentLevel + 3;

    // On mount: instantly position scroll so the current level is centered.
    // No animation, no jump — the user never sees any other position.
    useLayoutEffect(() => {
        // Use requestAnimationFrame to ensure DOM has painted the nodes
        requestAnimationFrame(() => {
            if (currentLevelRef.current && scrollRef.current) {
                const container = scrollRef.current;
                const node = currentLevelRef.current;
                const nodeRect = node.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                // Calculate where the node is relative to the scroll container
                const nodeOffsetTop = node.offsetTop || (nodeRect.top - containerRect.top + container.scrollTop);
                const targetScroll = nodeOffsetTop - container.clientHeight / 2 + node.clientHeight / 2;
                container.scrollTop = targetScroll;
            }
        });
    }, [currentLevel]);

    // Clamp scroll: prevent scrolling UP past maxVisibleLevel.
    // Since the track is reversed (level 100 at top, level 1 at bottom),
    // high-numbered levels are at LOW scrollTop values. We enforce a
    // minimum scrollTop so levels above maxVisibleLevel stay hidden.
    const handleScroll = useCallback(() => {
        const container = scrollRef.current;
        if (!container) return;
        // Find the sentinel: the first level ABOVE the max visible range
        const sentinel = container.querySelector(`[data-level="${maxVisibleLevel + 1}"]`);
        if (!sentinel) return;
        const sentinelEl = sentinel as HTMLElement;
        // Minimum scrollTop = just past this sentinel so it's hidden above the fold
        const minScroll = sentinelEl.offsetTop + sentinelEl.offsetHeight;
        if (container.scrollTop < minScroll) {
            container.scrollTop = minScroll;
        }
    }, [maxVisibleLevel]);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Reversed so level 1 is at the bottom
    const reversedLevels = [...TRACK_LEVELS].map((lvl, i) => ({ ...lvl, levelNum: i + 1 })).reverse();

    // Precompute biome divider positions
    const biomeDividerSet = new Set<number>();
    {
        let prev = -1;
        for (let i = 0; i < reversedLevels.length; i++) {
            const bi = reversedLevels[i].biomeIndex;
            if (bi !== prev) {
                biomeDividerSet.add(i);
                prev = bi;
            }
        }
    }

    return (
        <div className="max-w-lg mx-auto w-full flex-1 min-h-0 flex flex-col">
            <h1 className="text-4xl font-black text-primary mb-2 tracking-tight text-center shrink-0">Sudoku</h1>
            <p className="text-foreground/70 mb-4 text-lg text-center shrink-0">
                Complete puzzles to advance along the track!
            </p>

            {/* Track Path — scrollable, reversed (level 1 at bottom) */}
            <div
                ref={scrollRef}
                className="relative flex-1 min-h-0 overflow-y-auto px-4 py-6 rounded-2xl"
                style={{ scrollbarWidth: 'thin' }}
            >
                {/* MASTER trophy at the top — only shown if near top */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-4 border-amber-300 flex items-center justify-center shadow-lg shadow-amber-400/30">
                        <span className="text-2xl">🏆</span>
                    </div>
                    <span className="text-xs font-black text-amber-500 mt-1 uppercase tracking-widest">Master</span>
                </div>

                {/* Winding path of levels */}
                <div className="flex flex-col items-center gap-0">
                    {reversedLevels.map((lvl, revIdx) => {
                        const { levelNum } = lvl;
                        const stars = trackStars[levelNum] || 0;
                        const isCompleted = stars > 0;
                        const isCurrent = levelNum === currentLevel;
                        const isLocked = levelNum > currentLevel + 2;
                        const isSemiLocked = !isLocked && levelNum > currentLevel && !isCompleted;

                        const biome = getBiomeForLevel(levelNum);
                        const showBiomeDivider = biomeDividerSet.has(revIdx);

                        // Winding offset pattern
                        const windOffset = levelNum % 4;
                        let translateClass = '';
                        if (windOffset === 1) translateClass = '-translate-x-14 sm:-translate-x-20';
                        else if (windOffset === 2) translateClass = '-translate-x-4 sm:-translate-x-8';
                        else if (windOffset === 3) translateClass = 'translate-x-14 sm:translate-x-20';
                        else translateClass = 'translate-x-4 sm:translate-x-8';

                        return (
                            <React.Fragment key={levelNum}>
                                {/* Biome transition divider */}
                                {showBiomeDivider && (
                                    <div className="flex items-center gap-3 my-4 w-full px-4">
                                        <div className="flex-1 h-px bg-foreground/10" />
                                        <span className="text-lg">{biome.emoji}</span>
                                        <span className="text-xs font-black uppercase tracking-widest text-foreground/40">{biome.name}</span>
                                        <span className="text-lg">{biome.emoji}</span>
                                        <div className="flex-1 h-px bg-foreground/10" />
                                    </div>
                                )}

                                <div
                                    className="relative flex flex-col items-center w-full"
                                    data-level={levelNum}
                                >
                                    {/* Connector line */}
                                    {revIdx > 0 && !showBiomeDivider && (
                                        <div
                                            className="w-1 h-5 rounded-full"
                                            style={{ backgroundColor: isLocked ? '#e5e5e5' : biome.colors.connector }}
                                        />
                                    )}

                                    {/* Level Node */}
                                    <div className={`flex flex-col items-center ${translateClass} transition-transform`}>
                                        <button
                                            ref={isCurrent ? currentLevelRef : null}
                                            onClick={() => !isLocked && onSelectLevel(levelNum, lvl.size, lvl.diff)}
                                            disabled={isLocked}
                                            className={`
                                                relative flex flex-col items-center justify-center
                                                w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[3px] transition-all duration-300
                                                ${isCurrent
                                                    ? 'text-white border-white shadow-lg scale-110'
                                                    : isCompleted
                                                        ? 'text-white border-white/60 hover:scale-105 hover:shadow-md cursor-pointer'
                                                        : isSemiLocked
                                                            ? 'bg-foreground/5 text-foreground/30 border-foreground/10 cursor-pointer hover:scale-105'
                                                            : 'bg-neutral-200 text-foreground/20 border-neutral-300 cursor-not-allowed'
                                                }
                                            `}
                                            style={
                                                isCurrent
                                                    ? { background: `linear-gradient(135deg, ${biome.colors.nodeActive}, ${biome.colors.nodeCompleted})`, boxShadow: `0 0 20px ${biome.colors.nodeActive}60, 0 0 40px ${biome.colors.nodeActive}30` }
                                                    : isCompleted
                                                        ? { background: `linear-gradient(135deg, ${biome.colors.nodeCompleted}cc, ${biome.colors.nodeActive}cc)` }
                                                        : undefined
                                            }
                                        >
                                            {isLocked ? (
                                                <span className="text-base">🔒</span>
                                            ) : (
                                                <>
                                                    <span className="text-base sm:text-lg font-black leading-none">{levelNum}</span>
                                                    {isCompleted && (
                                                        <div className="flex gap-[1px] -mt-0.5">
                                                            {[1, 2, 3].map(s => (
                                                                <span key={s} className={`text-[8px] sm:text-[10px] ${s <= stars ? 'text-amber-300 drop-shadow-sm' : 'text-white/30'}`}>★</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {isCurrent && !isCompleted && (
                                                        <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-wider -mt-0.5">PLAY</span>
                                                    )}
                                                </>
                                            )}

                                            {/* Pulsing ring for current level */}
                                            {isCurrent && (
                                                <span
                                                    className="absolute inset-0 rounded-full animate-ping opacity-30"
                                                    style={{ backgroundColor: biome.colors.nodeActive }}
                                                />
                                            )}
                                        </button>

                                        {/* Level label */}
                                        <span className={`
                                            text-[8px] sm:text-[9px] font-bold uppercase tracking-wider mt-1
                                            ${isLocked ? 'text-foreground/15' : 'text-foreground/40'}
                                        `}>
                                            {lvl.label}
                                        </span>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* START marker at the bottom */}
                <div className="flex flex-col items-center mt-6">
                    <div className="w-1 h-5 rounded-full" style={{ backgroundColor: BIOMES[0].colors.connector }} />
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-[3px] border-emerald-300 flex items-center justify-center shadow-lg">
                        <span className="text-xl">🚀</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 mt-1 uppercase tracking-widest">Start</span>
                </div>
            </div>
        </div>
    );
};

export { TRACK_LEVELS };
