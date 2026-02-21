'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/game';
import { Icon } from '@/components/ui/Icon';

interface PuzzleCompanionProps {
    isHappy?: boolean;
    isSad?: boolean;
}

const HAPPY_PHRASES = [
    "You got this!",
    "Wow, great move!",
    "Brilliant!",
    "Keep it up!",
    "Amazing!"
];

const SAD_PHRASES = [
    "Hmm, let's think...",
    "Oops! Try again.",
    "Not quite right!",
    "We can fix this!",
    "Don't give up!"
];

const IDLE_PHRASES = [
    "I believe in you!",
    "Take your time...",
    "Puzzle Master in training!",
    "Gems everywhere...",
    "*purr*"
];

export const PuzzleCompanion: React.FC<PuzzleCompanionProps> = ({ isHappy, isSad }) => {
    const activePetId = useGameStore(state => state.pets.activePetId);
    const [bubbleText, setBubbleText] = useState("");
    const [showBubble, setShowBubble] = useState(false);
    // Counter to force remount of the pet div, replaying one-shot CSS animations
    const animKeyRef = useRef(0);

    // Random idle banter
    useEffect(() => {
        if (isHappy || isSad) return;

        const banterInterval = setInterval(() => {
            if (Math.random() > 0.5) {
                const phrase = IDLE_PHRASES[Math.floor(Math.random() * IDLE_PHRASES.length)];
                setBubbleText(phrase);
                setShowBubble(true);
                setTimeout(() => setShowBubble(false), 3000);
            }
        }, 8000);

        return () => clearInterval(banterInterval);
    }, [isHappy, isSad]);

    // Reactive banter
    useEffect(() => {
        if (isHappy) {
            animKeyRef.current += 1;
            const phrase = HAPPY_PHRASES[Math.floor(Math.random() * HAPPY_PHRASES.length)];
            setBubbleText(phrase);
            setShowBubble(true);
            const timer = setTimeout(() => setShowBubble(false), 2000);
            return () => clearTimeout(timer);
        } else if (isSad) {
            animKeyRef.current += 1;
            const phrase = SAD_PHRASES[Math.floor(Math.random() * SAD_PHRASES.length)];
            setBubbleText(phrase);
            setShowBubble(true);
            const timer = setTimeout(() => setShowBubble(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isHappy, isSad]);

    const assetKey = activePetId ? `pets/${activePetId}` : `pets/cat`;

    let animationClass = "animate-pet-float";
    if (isHappy) animationClass = "animate-pet-bounce";
    if (isSad) animationClass = "animate-pet-shake";

    return (
        <div className="relative flex flex-col items-center justify-center p-4">
            {/* Speech Bubble */}
            <div className={`
                absolute -top-6 bg-panel border-2 border-primary/20 
                rounded-xl p-2 px-4 shadow-sm text-sm font-bold text-primary/80
                transition-all duration-300 z-10 whitespace-nowrap
                ${showBubble ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}
            `}>
                {bubbleText}
                {/* Bubble tail */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-panel border-b-2 border-r-2 border-primary/20 rotate-45 transform"></div>
            </div>

            {/* Pet Graphic — key forces remount to replay one-shot animations */}
            <div key={animKeyRef.current} className={`w-32 h-32 drop-shadow-md z-0 transition-all ${animationClass}`}>
                <Icon assetKey={assetKey} size="none" className="w-full h-full object-contain" />
            </div>

        </div>
    );
};
