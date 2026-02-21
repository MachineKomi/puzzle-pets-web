'use client';

import React, { useEffect, useState } from 'react';

interface ParticleBurstProps {
    x: number;
    y: number;
    color: string;
    onComplete?: () => void;
}

export const ParticleBurst: React.FC<ParticleBurstProps> = ({ x, y, color, onComplete }) => {
    const [particles, setParticles] = useState<Array<{ id: number; dx: number; dy: number; spin: number; scale: number; lifetime: number }>>([]);

    useEffect(() => {
        // Generate 12-16 particles in a starburst pattern
        const count = Math.floor(Math.random() * 5) + 12;
        const newParticles = Array.from({ length: count }).map((_, i) => {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
            const speed = 20 + Math.random() * 40;
            return {
                id: i,
                dx: Math.cos(angle) * speed,
                dy: Math.sin(angle) * speed,
                spin: (Math.random() - 0.5) * 360,
                scale: 0.5 + Math.random() * 0.8,
                lifetime: 600 + Math.random() * 400 // ms
            };
        });

        setParticles(newParticles);

        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 1100);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div
            className="fixed pointer-events-none z-50 flex items-center justify-center w-0 h-0"
            style={{ left: x, top: y }}
        >
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute rounded-full opacity-0 particle-fly"
                    style={{
                        backgroundColor: color,
                        width: '8px',
                        height: '8px',
                        boxShadow: `0 0 6px ${color}`,
                        ['--dx' as string]: `${p.dx}px`,
                        ['--dy' as string]: `${p.dy}px`,
                        ['--spin' as string]: `${p.spin}deg`,
                        ['--scale' as string]: p.scale,
                        animationDuration: `${p.lifetime}ms`
                    }}
                />
            ))}
        </div>
    );
};
