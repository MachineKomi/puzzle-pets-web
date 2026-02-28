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
        <div className={`flex flex-col sm:flex-row min-h-screen bg-background text-foreground ${reducedMotion ? 'motion-reduce' : ''}`}>
            <Navigation />

            {/* Main Content Area — pb-nav adds safe-area-aware padding on mobile so content never hides under the nav bar */}
            <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-4 sm:p-8 pb-nav sm:pb-8 animate-in fade-in duration-300">
                <ClientHydration>
                    {children}
                </ClientHydration>
            </main>
        </div>
    );
}
