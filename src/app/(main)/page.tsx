import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

export default function HomePage() {
    return (
        <div className="flex flex-col items-center gap-8 max-w-2xl mx-auto mt-4">
            {/* Active Pet Panel Stub */}
            <Card variant="elevated" className="w-full text-center p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <div className="flex justify-center mb-6 relative">
                    {/* Subtle glowing background effect behind pet */}
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-50 w-48 h-48 mx-auto animate-pulse"></div>
                    <Icon assetKey="pets/cat" size="xl" className="w-48 h-48 z-10 transition-transform hover:scale-105 hover:-rotate-3" />
                </div>
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">My Pet</h1>
                <p className="text-lg text-foreground/70 mb-4">Level 1 (0 / 100 XP)</p>
            </Card>

            {/* Main Action Buttons */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/puzzles" className="contents">
                    <div className="flex flex-col items-center justify-center p-8 bg-primary text-white rounded-2xl shadow-md hover:bg-primary-hover hover:scale-105 hover:-rotate-1 transition-all duration-300 font-bold text-2xl group cursor-pointer">
                        <Icon assetKey="ui/puzzles_icon" className="w-16 h-16 mb-4 group-hover:animate-bounce" />
                        Play Puzzles
                    </div>
                </Link>
                <Link href="/pets" className="contents">
                    <div className="flex flex-col items-center justify-center p-8 bg-accent text-white rounded-2xl shadow-md hover:brightness-110 hover:scale-105 hover:rotate-1 transition-all duration-300 font-bold text-2xl group cursor-pointer">
                        <Icon assetKey="ui/pets_icon" className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform" />
                        Pet Arena
                    </div>
                </Link>
            </div>
        </div>
    );
}
