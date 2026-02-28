'use client';

import { useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { useSettingsStore } from '@/store/settings';
import { ClientHydration } from '@/components/layout/ClientHydration';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const theme = useSettingsStore((state) => state.theme);
    const reducedMotion = useSettingsStore((state) => state.reducedMotion);

    // Apply theme to html/body tags
    useEffect(() => {
        if (theme === 'zen') {
            document.documentElement.setAttribute('data-theme', 'zen');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [theme]);

    return (
        <div className={`flex flex-col sm:flex-row h-dvh bg-background text-foreground overflow-hidden ${reducedMotion ? 'motion-reduce' : ''}`}>
            <Navigation />

            {/* Main Content Area — viewport-locked, each page controls its own scrolling */}
            <main className="flex-1 min-h-0 w-full px-4 sm:px-6 pb-nav sm:pb-0 animate-in fade-in duration-300">
                <ClientHydration>
                    {children}
                </ClientHydration>
            </main>
        </div>
    );
}
