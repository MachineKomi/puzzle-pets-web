'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

const links = [
    { name: 'Home',     path: '/',         icon: 'ui/home_icon'     },
    { name: 'Puzzles',  path: '/puzzles',  icon: 'ui/puzzles_icon'  },
    { name: 'Pets',     path: '/pets',     icon: 'ui/pets_icon'     },
    { name: 'Settings', path: '/settings', icon: 'ui/settings_icon' },
];

function NavIcon({ icon, name, isActive }: { icon: string; name: string; isActive: boolean }) {
    return (
        <div className={`relative w-[4.5rem] h-[4.5rem] transition-all duration-200 ${isActive ? 'scale-110 drop-shadow-[0_0_12px_rgba(13,148,136,0.7)]' : 'opacity-80'}`}>
            <Icon assetKey={icon} size="none" className="w-full h-full" />
            {/* Label overlaid at the bottom of the icon — Pokemon style */}
            <span
                className="game-label absolute -bottom-1 left-0 right-0 text-center text-[11px] font-black text-white leading-none tracking-wider pointer-events-none"
            >
                {name.toUpperCase()}
            </span>
        </div>
    );
}

export const Navigation = () => {
    const pathname = usePathname();

    const isActive = (path: string) =>
        path === '/' ? pathname === '/' : pathname.startsWith(path);

    return (
        <>
            {/* ── Mobile Bottom Nav — Dark Game HUD ──────────────── */}
            <nav className="h-nav fixed bottom-0 left-0 right-0 bg-gradient-to-t from-stone-900/95 to-stone-800/90 backdrop-blur-md border-t-2 border-primary/30 px-2 sm:hidden z-50 flex justify-around items-center">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        href={link.path}
                        className="flex flex-col items-center justify-center transition-all duration-200 hover:opacity-90 active:scale-95"
                        aria-label={link.name}
                    >
                        <NavIcon icon={link.icon} name={link.name} isActive={isActive(link.path)} />
                    </Link>
                ))}
            </nav>

            {/* ── Desktop/Tablet Side Nav — Dark Sidebar ────────── */}
            <aside className="hidden sm:flex flex-col w-56 bg-gradient-to-b from-stone-900 to-stone-800 border-r-2 border-primary/20 h-dvh sticky top-0 p-4 shrink-0">
                {/* Logo */}
                <div className="flex items-center justify-center mb-6 pb-4 border-b-2 border-white/10">
                    <Icon assetKey="ui/puzzle_pets_arena_logo" size="none" className="w-full h-auto max-w-[180px]" />
                </div>

                {/* Nav links */}
                <nav className="flex flex-col gap-1.5 flex-1">
                    {links.map((link) => {
                        const active = isActive(link.path);
                        return (
                            <Link
                                key={link.path}
                                href={link.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200
                                    ${active
                                        ? 'bg-primary/20 text-teal-200 shadow-sm scale-[1.02]'
                                        : 'text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {/* Icon with overlay label */}
                                <div className="relative w-14 h-14 shrink-0">
                                    <Icon assetKey={link.icon} size="none" className="w-full h-full" />
                                    <span className="game-label absolute bottom-0 left-0 right-0 text-center text-[8px] font-black text-white leading-none pointer-events-none">
                                        {link.name.toUpperCase()}
                                    </span>
                                </div>
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};
