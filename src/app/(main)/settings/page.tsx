'use client';

import { useState } from 'react';
import { useSettingsStore } from '@/store/settings';
import { useGameStore } from '@/store/game';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

const ToggleSwitch = ({ label, description, isChecked, onChange }: { label: string, description: string, isChecked: boolean, onChange: () => void }) => (
    <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-xl">
        <div>
            <h3 className="font-bold text-lg">{label}</h3>
            <p className="text-sm text-foreground/70">{description}</p>
        </div>
        <button
            role="switch"
            aria-checked={isChecked}
            onClick={onChange}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-focus-ring ${isChecked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${isChecked ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
    </div>
);

export default function SettingsPage() {
    const { theme, sfxEnabled, musicEnabled, reducedMotion, toggleTheme, toggleSfx, toggleMusic, toggleReducedMotion } = useSettingsStore();
    const resetSaveData = useGameStore((state) => state.resetSaveData);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    const handleReset = async () => {
        await resetSaveData();
        setIsResetModalOpen(false);
        alert('Save data has been completely erased.');
        window.location.reload(); // Hard reload to clear everything purely
    };

    return (
        <div className="max-w-2xl mx-auto pb-12">
            <h1 className="text-4xl font-extrabold mb-8 text-center sm:text-left">Settings</h1>

            <h2 className="text-2xl font-bold mb-4 text-primary">Preferences</h2>
            <Card variant="panel" className="mb-8 p-2">
                <ToggleSwitch
                    label="Zen Mode"
                    description="Use soothing, calmer pastel colors designed for relaxation."
                    isChecked={theme === 'zen'}
                    onChange={toggleTheme}
                />
                <ToggleSwitch
                    label="Sound Effects"
                    description="Enable UI chimes, match noises, and interactions."
                    isChecked={sfxEnabled}
                    onChange={toggleSfx}
                />
                <ToggleSwitch
                    label="Background Music"
                    description="Enable relaxing music while you puzzle."
                    isChecked={musicEnabled}
                    onChange={toggleMusic}
                />
                <ToggleSwitch
                    label="Reduce Motion"
                    description="Disable zooming and complex CSS animations across the interface."
                    isChecked={reducedMotion}
                    onChange={toggleReducedMotion}
                />
            </Card>

            <h2 className="text-2xl font-bold mb-4 text-danger">Data Management</h2>
            <Card variant="panel" className="p-6 border-danger/20">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center text-center sm:text-left">
                    <div>
                        <h3 className="font-bold text-lg">Reset Save Data</h3>
                        <p className="text-sm text-foreground/70">Permanently deletes all currency, pets, and puzzle progress. Settings are kept.</p>
                    </div>
                    <Button variant="danger" onClick={() => setIsResetModalOpen(true)}>
                        Delete Data
                    </Button>
                </div>
            </Card>

            <Modal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} title="Are you absolutely sure?">
                <p className="mb-6 text-foreground/80">
                    This action will <strong>permanently erase</strong> your local save file, meaning you will lose all unlocked pets, collected coins, and puzzle high scores. This cannot be undone!
                </p>
                <div className="flex gap-4 justify-end mt-4">
                    <Button variant="ghost" onClick={() => setIsResetModalOpen(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleReset}>Yes, Delete My Data</Button>
                </div>
            </Modal>

            <div className="text-center text-sm text-foreground/50 mt-12">
                <p>Puzzle Pets Arena MVP - aidlc-v1.0</p>
            </div>
        </div>
    );
}
