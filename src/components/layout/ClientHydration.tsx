'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/game';

export function ClientHydration({ children }: { children: React.ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);
    const { initLoad } = useGameStore();

    useEffect(() => {
        // eslint-disable-next-line
        setIsMounted(true);
        // Load local save from IndexedDB
        initLoad().catch(console.error);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Prevent SSR hydration mismatch by only rendering children when safely on client
    if (!isMounted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
}
