'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

export const Navigation = () => {
    const pathname = usePathname();

    const links = [
        { name: 'Home', path: '/', icon: '🏠' },
        { name: 'Puzzles', path: '/puzzles', icon: '🧩' },
        { name: 'Pets', path: '/pets', icon: '🐾' },
        { name: 'Settings', path: '/settings', icon: '⚙️' },
    ];

    return (
        <>
            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-panel border-t border-black/10 dark:border-white/10 p-2 sm:hidden z-50 flex justify-around items-center h-16">
                {links.map((link) => {
                    const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
                    return (
                        <Link
                            key={link.path}
                            href={link.path}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isActive ? 'text-primary font-bold scale-110' : 'text-foreground/70 hover:bg-black/5 dark:hover:bg-white/5'
                                }`}
                        >
                            <span className="text-xl mb-1">{link.icon}</span>
                            <span className="text-[10px] sm:hidden">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Desktop/Tablet Side/Top Nav (hidden on mobile) */}
            <aside className="hidden sm:flex flex-col w-64 bg-panel border-r border-black/10 dark:border-white/10 h-screen sticky top-0 p-4">
                <div className="flex flex-col items-center justify-center mb-6 shadow-sm py-2 border-b border-black/5">
                    <Icon assetKey="ui/puzzle_pets_arena_logo" className="w-[100%] h-auto max-w-[250px]" />
                </div>
                <nav className="flex flex-col gap-2">
                    {links.map((link) => {
                        const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
                        return (
                            <Link
                                key={link.path}
                                href={link.path}
                                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive
                                    ? 'bg-primary/10 text-primary font-bold shadow-sm'
                                    : 'text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                                    }`}
                            >
                                <span className="text-2xl">{link.icon}</span>
                                <span className="text-lg">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};
