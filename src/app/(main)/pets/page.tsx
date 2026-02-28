'use client';

import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

const PET_PLACEHOLDERS = [
    { name: 'Cat',           asset: 'pets/cat',              requirement: 'Your starter pet!',        unlocked: true },
    { name: 'Bunny',         asset: 'pets/bunny',            requirement: 'Complete 10 puzzles',      unlocked: false },
    { name: 'Owl',           asset: 'pets/owl',              requirement: 'Reach Level 5',            unlocked: false },
    { name: 'Panda',         asset: 'pets/panda',            requirement: 'Earn 500 coins',           unlocked: false },
    { name: 'Copper Dragon', asset: 'pets/babycopperdragon', requirement: 'Complete Meadow Garden',   unlocked: false },
    { name: 'Cosmic Owl',    asset: 'pets/cosmicowl',        requirement: 'Complete Crystal Caves',   unlocked: false },
    { name: 'Nine-Tail Fox', asset: 'pets/ninetailfoxkami',  requirement: 'Complete Sunset Beach',    unlocked: false },
    { name: 'Phoenix Cat',   asset: 'pets/phoenixcat',       requirement: 'Complete all 100 levels',  unlocked: false },
];

export default function PetsPage() {
    return (
        <div className="max-w-5xl mx-auto w-full h-full flex flex-col py-4 overflow-y-auto">
            <h1 className="text-4xl font-black mb-2 text-center sm:text-left text-primary tracking-tight">Pet Arena</h1>
            <p className="text-foreground/60 mb-6 text-center sm:text-left">Collect and train adorable puzzle companions!</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {PET_PLACEHOLDERS.map((pet, i) => (
                    <Card
                        key={i}
                        variant="panel"
                        className={`relative aspect-square flex flex-col items-center justify-center p-4 transition-all duration-300 overflow-hidden ${
                            pet.unlocked
                                ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                                : 'cursor-default'
                        }`}
                    >
                        {/* Pet image — locked pets get black silhouette (Smash Bros style) */}
                        <div className={`relative ${pet.unlocked ? '' : 'brightness-0 opacity-40'}`}>
                            <Icon assetKey={pet.asset} size="none" className={`w-20 h-20 sm:w-24 sm:h-24 ${pet.unlocked ? 'drop-shadow-lg' : ''}`} />
                            {/* Mystery shimmer for locked pets */}
                            {!pet.unlocked && (
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent animate-pulse rounded-full" />
                            )}
                        </div>

                        {/* Pet name */}
                        <span className={`mt-3 font-black text-sm ${pet.unlocked ? 'text-foreground' : 'text-foreground/40'}`}>
                            {pet.unlocked ? pet.name : '???'}
                        </span>

                        {/* Unlock requirement */}
                        <span className={`text-[10px] text-center leading-tight mt-1 ${pet.unlocked ? 'text-primary font-bold' : 'text-foreground/30'}`}>
                            {pet.requirement}
                        </span>

                        {/* Lock badge */}
                        {!pet.unlocked && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-foreground/10 rounded-full flex items-center justify-center">
                                <span className="text-xs">🔒</span>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
