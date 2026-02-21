import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { PuzzleResult } from '@/lib/puzzle/types';
import { CalculatedReward } from '@/lib/puzzle/rewards';

export interface PuzzleResultsModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: PuzzleResult | null;
    reward: CalculatedReward | null;
}

export const PuzzleResultsModal: React.FC<PuzzleResultsModalProps> = ({ isOpen, onClose, result, reward }) => {
    if (!result || !reward) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={result.won ? 'Puzzle Complete!' : 'Out of Time!'} showCloseButton={false}>
            <div className="flex flex-col items-center justify-center p-4">
                {/* Stars Display */}
                <div className="flex gap-2 mb-6">
                    {[1, 2, 3].map((starIdx) => (
                        <Icon
                            key={starIdx}
                            assetKey="ui/star" // Assuming 'ui/star' is added to manifest eventually, fallback is handled by Icon component
                            size="lg"
                            className={`transition-all duration-500 transform ${starIdx <= result.stars ? 'scale-110 opacity-100' : 'scale-90 opacity-30 grayscale'}`}
                        />
                    ))}
                </div>

                {/* Stats */}
                <div className="w-full bg-black/5 dark:bg-white/5 rounded-xl p-4 mb-6 text-center">
                    <p className="text-foreground/80 mb-2">Time: <span className="font-bold text-foreground">{Math.floor(result.durationMs / 1000)}s</span></p>
                    <p className="text-foreground/80 mb-2">Mistakes: <span className="font-bold text-foreground">{result.mistakes}</span></p>

                    <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 flex justify-center gap-6">
                        <div className="flex items-center gap-2">
                            <Icon assetKey="gems/gem_1" size="sm" />
                            <span className="font-bold text-primary">+{reward.coins}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon assetKey="ui/star" size="sm" />
                            <span className="font-bold text-accent">+{reward.xp} XP</span>
                        </div>
                        {reward.gems > 0 && (
                            <div className="flex items-center gap-2">
                                <Icon assetKey="gems/gem_2" size="sm" />
                                <span className="font-bold text-secondary">+{reward.gems} Gem</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center w-full">
                    <Button variant="primary" onClick={onClose} className="w-full sm:w-auto">
                        Continue
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
