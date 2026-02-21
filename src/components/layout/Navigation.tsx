'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

export const Navigation = () => {
    const pathname = usePathname();

    const links = [
        { name: 'Home', path: '/', icon: 'ui/home_icon' },
        { name: 'Puzzles', path: '/puzzles', icon: 'ui/puzzles_icon' },
        { name: 'Pets', path: '/pets', icon: 'ui/pets_icon' },
        { name: 'Settings', path: '/settings', icon: 'ui/settings_icon' },
    ];

    return (
        <>
            {/* Mobile Bottom Nav — large icon-only buttons */}
            <nav className="fixed bottom-0 left-0 right-0 bg-panel border-t border-black/10 dark:border-white/10 px-2 py-1 sm:hidden z-50 flex justify-around items-center h-24">
                {links.map((link) => {
                    const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
                    return (
                        <Link
                            key={link.path}
                            href={link.path}
                            className={`flex items-center justify-center p-1 rounded-xl transition-all ${isActive ? 'scale-110' : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                                }`}
                        >
                            <Icon assetKey={link.icon} size="none" className="w-16 h-16" />
                        </Link>
                    );
                })}
            </nav>

            {/* Desktop/Tablet Side Nav */}
            <aside className="hidden sm:flex flex-col w-64 bg-panel border-r border-black/10 dark:border-white/10 h-screen sticky top-0 p-4">
                <div className="flex flex-col items-center justify-center mb-6 shadow-sm py-2 border-b border-black/5">
                    <Icon assetKey="ui/puzzle_pets_arena_logo" size="none" className="w-[100%] h-auto max-w-[250px]" />
                </div>
                <nav className="flex flex-col gap-3">
                    {links.map((link) => {
                        const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
                        return (
                            <Link
                                key={link.path}
                                href={link.path}
                                className={`flex items-center justify-center p-2 rounded-xl transition-all ${isActive
                                    ? 'bg-primary/10 shadow-sm scale-105'
                                    : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                                    }`}
                            >
                                <Icon assetKey={link.icon} size="none" className="w-full max-w-[140px] h-auto" />
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};
