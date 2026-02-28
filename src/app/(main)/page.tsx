'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { useGameStore } from '@/store/game';

function CurrencyPip({ emoji, gemIcon, value, label }: { emoji?: string; gemIcon?: string; value: number; label: string }) {
    return (
        <div className="flex items-center gap-2 bg-stone-900/80 backdrop-blur-sm border-2 border-amber-400/30 rounded-full px-4 py-2 shadow-lg shadow-black/20">
            {gemIcon
                ? <Icon assetKey={gemIcon} size="none" className="w-5 h-5" />
                : <span className="text-base leading-none">{emoji}</span>
            }
            <span className="font-black text-sm text-white tabular-nums">{value.toLocaleString()}</span>
            <span className="text-xs text-amber-300/70 font-bold">{label}</span>
        </div>
    );
}

interface GameButtonProps {
    href: string;
    icon: string;
    label: string;
    sublabel: string;
    colorClass: string;      // gradient classes
    shadowClass: string;     // 3d shadow utility
}

function GameButton({ href, icon, label, sublabel, colorClass, shadowClass }: GameButtonProps) {
    return (
        <Link href={href} className="block">
            <button
                className={`relative w-full rounded-3xl ${colorClass} ${shadowClass} border-2 border-white/20 transition-all duration-150 flex flex-col items-center justify-center gap-3 py-7 px-4 active:scale-95 group cursor-pointer overflow-hidden`}
            >
                {/* Inner shine */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                {/* Icon with overlay label */}
                <div className="relative w-20 h-20">
                    <Icon assetKey={icon} size="none" className="w-full h-full drop-shadow-lg group-hover:scale-110 transition-transform duration-200" />
                    <span className="game-label absolute bottom-1 left-0 right-0 text-center text-[11px] font-black text-white leading-none tracking-wider">
                        {label.toUpperCase()}
                    </span>
                </div>
                {/* Text label below icon */}
                <span className="relative text-white font-black text-xl leading-tight drop-shadow-md">{sublabel}</span>
            </button>
        </Link>
    );
}

export default function HomePage() {
    const pets = useGameStore(state => state.pets);
    const wallet = useGameStore(state => state.wallet);
    const isLoaded = useGameStore(state => state.isLoaded);

    const level = pets.level;
    const xp = pets.xp;
    const xpRequired = level * level * 100;
    const xpPercent = Math.min(100, Math.round((xp / xpRequired) * 100));

    const moodEmoji = pets.mood >= 80 ? '😄' : pets.mood >= 50 ? '😊' : pets.mood >= 20 ? '😐' : '😔';
    const moodLabel = pets.mood >= 80 ? 'Happy' : pets.mood >= 50 ? 'Content' : pets.mood >= 20 ? 'Bored' : 'Sad';

    return (
        <div className="flex flex-col gap-4 max-w-lg mx-auto w-full h-full justify-center py-4">

            {/* ── Currency HUD — Dark RPG-style ─────────────── */}
            {isLoaded && (
                <div className="flex gap-2 justify-end flex-wrap">
                    <CurrencyPip emoji="🪙" value={wallet.coins} label="coins" />
                    <CurrencyPip gemIcon="gems/gem_1" value={wallet.gems} label="gems" />
                </div>
            )}

            {/* ── Pet Display Card ───────────────────────────── */}
            <div className="relative bg-gradient-to-br from-teal-50 via-white to-orange-50 rounded-3xl border-2 border-primary/25 ring-2 ring-primary/10 ring-offset-2 ring-offset-background shadow-lg p-5 text-center overflow-hidden">
                {/* Background glow + depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8 rounded-3xl pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-32 bg-gradient-to-b from-white/40 to-transparent rounded-full pointer-events-none" />

                {/* Decorative floating gems */}
                <div className="absolute top-3 right-4 opacity-15 w-8 h-8 animate-pet-float" style={{animationDelay: '0.5s'}}>
                    <Icon assetKey="gems/gem_3" size="none" className="w-full h-full" />
                </div>
                <div className="absolute bottom-8 left-3 opacity-10 w-6 h-6 animate-pet-float" style={{animationDelay: '1.2s'}}>
                    <Icon assetKey="gems/gem_7" size="none" className="w-full h-full" />
                </div>
                <div className="absolute top-12 left-6 opacity-10 w-5 h-5 animate-pet-float" style={{animationDelay: '2s'}}>
                    <Icon assetKey="gems/gem_5" size="none" className="w-full h-full" />
                </div>

                {/* Pet sprite */}
                <div className="relative flex justify-center mb-3">
                    <div className="absolute inset-0 bg-primary/15 blur-3xl rounded-full opacity-60 animate-pulse scale-75 mx-auto" />
                    <Icon
                        assetKey="pets/cat"
                        size="none"
                        className="w-40 h-40 sm:w-48 sm:h-48 z-10 drop-shadow-xl animate-pet-float"
                    />
                </div>

                {/* Pet info */}
                <div className="relative z-10">
                    <h2 className="text-2xl font-black text-foreground mb-0.5">My Pet</h2>
                    <p className="text-sm font-bold text-foreground/50 mb-3">
                        {moodEmoji} {moodLabel} &nbsp;•&nbsp; Level {isLoaded ? level : '…'}
                    </p>

                    {/* XP bar */}
                    <div className="mx-2 mb-1">
                        <div className="relative h-3.5 bg-black/10 rounded-full overflow-hidden">
                            <div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-teal-300 rounded-full transition-all duration-700"
                                style={{ width: isLoaded ? `${xpPercent}%` : '0%' }}
                            />
                        </div>
                        {isLoaded && (
                            <p className="text-xs font-bold text-foreground/40 mt-1 text-right">
                                {xp} / {xpRequired} XP
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Main Action Buttons ────────────────────────── */}
            <div className="grid grid-cols-2 gap-4">
                <GameButton
                    href="/puzzles"
                    icon="ui/puzzles_icon"
                    label="Puzzles"
                    sublabel="Play Now"
                    colorClass="bg-gradient-to-b from-teal-400 to-teal-600"
                    shadowClass="btn-3d-teal"
                />
                <GameButton
                    href="/pets"
                    icon="ui/pets_icon"
                    label="Arena"
                    sublabel="Pet Arena"
                    colorClass="bg-gradient-to-b from-orange-400 to-orange-600"
                    shadowClass="btn-3d-orange"
                />
            </div>

        </div>
    );
}
