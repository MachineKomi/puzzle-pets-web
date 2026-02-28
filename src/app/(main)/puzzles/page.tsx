'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { useGameStore } from '@/store/game';

export default function PuzzlesPage() {
    const trackLevel = useGameStore(state => state.puzzles.sudokuTrackLevel);
    const completedCount = useGameStore(state => state.puzzles.completedCount);
    const isLoaded = useGameStore(state => state.isLoaded);

    const puzzleTypes = [
        {
            id: 'sudoku',
            title: 'Sudoku',
            description: 'Classic gem-based logic puzzles. Place gems to fill every row, column, and block!',
            icon: 'ui/sudoku_icon',
            href: '/puzzles/sudoku',
            gradient: 'from-teal-400 to-emerald-500',
            shadowClass: 'shadow-teal-500/25',
            progress: isLoaded ? `Level ${trackLevel} / 100` : undefined,
            available: true,
            decoGems: ['gems/gem_2', 'gems/gem_5'],
        },
        {
            id: 'memory',
            title: 'Memory Match',
            description: 'Test your memory and match pairs of colorful gems.',
            icon: 'gems/gem_1',
            href: '/puzzles/memory',
            gradient: 'from-orange-400 to-red-400',
            shadowClass: 'shadow-orange-500/25',
            progress: isLoaded && completedCount > 0 ? `${completedCount} completed` : undefined,
            available: false,
            decoGems: ['gems/gem_8', 'gems/gem_3'],
        },
    ];

    return (
        <div className="max-w-3xl mx-auto w-full h-full flex flex-col justify-center py-4">
            {/* Header with gem flourish */}
            <div className="flex items-center justify-center gap-3 mb-8">
                <Icon assetKey="gems/gem_4" size="none" className="w-8 h-8 animate-pet-float" />
                <h1 className="text-4xl font-black text-primary tracking-tight">Select a Puzzle</h1>
                <div className="w-8 h-8 animate-pet-float" style={{animationDelay: '1.5s'}}><Icon assetKey="gems/gem_6" size="none" className="w-full h-full" /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {puzzleTypes.map((puzzle) => (
                    <Link href={puzzle.available ? puzzle.href : '#'} key={puzzle.id} className={`block group ${!puzzle.available ? 'pointer-events-none' : ''}`}>
                        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${puzzle.gradient} p-8 min-h-[200px] shadow-xl ${puzzle.shadowClass} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] h-full`}>
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                            {/* Decorative floating gems */}
                            <div className="absolute top-4 left-4 opacity-15 w-6 h-6 animate-pet-float">
                                <Icon assetKey={puzzle.decoGems[0]} size="none" className="w-full h-full" />
                            </div>
                            <div className="absolute bottom-4 right-4 opacity-15 w-8 h-8 animate-pet-float" style={{animationDelay: '1s'}}>
                                <Icon assetKey={puzzle.decoGems[1]} size="none" className="w-full h-full" />
                            </div>

                            {/* Coming Soon badge */}
                            {!puzzle.available && (
                                <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                    Coming Soon
                                </div>
                            )}

                            <div className="relative flex flex-col items-center text-center gap-4">
                                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/10">
                                    <Icon assetKey={puzzle.icon} size="xl" className="drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white mb-1 drop-shadow-md">{puzzle.title}</h2>
                                    <p className="text-white/80 text-sm leading-relaxed">{puzzle.description}</p>
                                </div>
                                {puzzle.progress && (
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-xs font-bold">
                                        {puzzle.progress}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
