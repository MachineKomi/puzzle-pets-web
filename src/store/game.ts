import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import debounce from 'lodash.debounce';
import { saveStorage, SaveData, INITIAL_SAVE_DATA } from '@/lib/storage';

interface GameState extends SaveData {
    isLoaded: boolean;

    // Actions
    initLoad: () => Promise<void>;
    addCoins: (amount: number) => void;
    addGems: (amount: number) => void;
    gainXp: (amount: number) => void;
    unlockPet: (petId: string) => void;
    setActivePet: (petId: string) => void;
    feedPet: () => boolean;      // Returns false if insufficient coins
    playWithPet: () => boolean;  // Returns false if insufficient coins
    boostMood: (amount: number) => void;
    recordPuzzleCompletion: (puzzleType: string, stars: number, time: number) => void;
    advanceSudokuTrack: (level: number, stars: number) => void;
    setActiveSession: (session: import('@/lib/puzzle/types').PuzzleSession | null) => void;
    resetSaveData: () => Promise<void>;
}

// Debounced save wrapper to prevent spamming IndexedDB on rapid XP/Coin changes
const debouncedSave = debounce((state: SaveData) => {
    const dataToSave: SaveData = {
        profile: state.profile,
        wallet: state.wallet,
        pets: state.pets,
        puzzles: state.puzzles,
    };
    saveStorage.setSave(dataToSave).catch(console.error);
}, 1000);

// Determine next level threshold (simple quadratic scaling: 100, 400, 900...)
const getXpRequirement = (level: number) => level * level * 100;

export const useGameStore = create<GameState>((set) => ({
    ...INITIAL_SAVE_DATA,
    isLoaded: false,

    initLoad: async () => {
        const savedData = await saveStorage.getSave();
        if (savedData) {
            // Deep-merge with defaults so new fields added in code updates get their initial values.
            // Without this, old saved data missing new fields (e.g. sudokuTrackLevel) causes crashes.
            const merged: SaveData = {
                profile: { ...INITIAL_SAVE_DATA.profile, ...savedData.profile },
                wallet: { ...INITIAL_SAVE_DATA.wallet, ...savedData.wallet },
                pets: { ...INITIAL_SAVE_DATA.pets, ...savedData.pets },
                puzzles: { ...INITIAL_SAVE_DATA.puzzles, ...savedData.puzzles },
            };
            set({ ...merged, isLoaded: true });
        } else {
            // First time playing: Initialize empty save data with a generated profile ID
            const newSave = {
                ...INITIAL_SAVE_DATA,
                profile: { ...INITIAL_SAVE_DATA.profile, id: uuidv4(), createdAt: Date.now() }
            };
            await saveStorage.setSave(newSave);
            set({ ...newSave, isLoaded: true });
        }
    },

    addCoins: (amount: number) => {
        set((state) => {
            const newState = { wallet: { ...state.wallet, coins: state.wallet.coins + amount } };
            debouncedSave({ ...state, ...newState });
            return newState;
        });
    },

    addGems: (amount: number) => {
        set((state) => {
            const newState = { wallet: { ...state.wallet, gems: state.wallet.gems + amount } };
            debouncedSave({ ...state, ...newState });
            return newState;
        });
    },

    gainXp: (amount: number) => {
        set((state) => {
            let newXp = state.pets.xp + amount;
            let newLevel = state.pets.level;

            // Level up loop
            while (newXp >= getXpRequirement(newLevel)) {
                newXp -= getXpRequirement(newLevel);
                newLevel += 1;
            }

            const newState = { pets: { ...state.pets, xp: newXp, level: newLevel } };
            debouncedSave({ ...state, ...newState });
            return newState;
        });
    },

    unlockPet: (petId: string) => {
        set((state) => {
            if (state.pets.collection.includes(petId)) return state;
            const newState = { pets: { ...state.pets, collection: [...state.pets.collection, petId] } };
            debouncedSave({ ...state, ...newState });
            return newState;
        });
    },

    setActivePet: (petId: string) => {
        set((state) => {
            const newState = { pets: { ...state.pets, activePetId: petId } };
            debouncedSave({ ...state, ...newState });
            return newState;
        });
    },

    feedPet: () => {
        const FEED_COST = 20;
        const FEED_MOOD = 15;
        let success = false;
        set((state) => {
            if (state.wallet.coins < FEED_COST) return state;
            success = true;
            const newMood = Math.min(100, state.pets.mood + FEED_MOOD);
            const newState = {
                wallet: { ...state.wallet, coins: state.wallet.coins - FEED_COST },
                pets: { ...state.pets, mood: newMood },
            };
            debouncedSave({ ...state, ...newState });
            return newState;
        });
        return success;
    },

    playWithPet: () => {
        const PLAY_COST = 10;
        const PLAY_MOOD = 8;
        let success = false;
        set((state) => {
            if (state.wallet.coins < PLAY_COST) return state;
            success = true;
            const newMood = Math.min(100, state.pets.mood + PLAY_MOOD);
            const newState = {
                wallet: { ...state.wallet, coins: state.wallet.coins - PLAY_COST },
                pets: { ...state.pets, mood: newMood },
            };
            debouncedSave({ ...state, ...newState });
            return newState;
        });
        return success;
    },

    boostMood: (amount: number) => {
        set((state) => {
            const newMood = Math.min(100, state.pets.mood + amount);
            const newState = { pets: { ...state.pets, mood: newMood } };
            debouncedSave({ ...state, ...newState });
            return newState;
        });
    },

    recordPuzzleCompletion: (puzzleType: string, stars: number, time: number) => {
        set((state) => {
            const currentStats = state.puzzles.bestStats[puzzleType];

            // Only record if it's the first time, or if we got more stars, or same stars but faster time.
            const isNewBest = !currentStats ||
                stars > currentStats.stars ||
                (stars === currentStats.stars && time < currentStats.time);

            const newStats = { ...state.puzzles.bestStats };
            if (isNewBest) {
                newStats[puzzleType] = { stars, time };
            }

            const newState = {
                puzzles: {
                    ...state.puzzles,
                    completedCount: state.puzzles.completedCount + 1,
                    bestStats: newStats
                }
            };

            debouncedSave({ ...state, ...newState });
            return newState;
        });
    },

    advanceSudokuTrack: (level: number, stars: number) => {
        set((state) => {
            const newStars = { ...state.puzzles.sudokuTrackStars };
            // Only update if new stars are higher
            if (!newStars[level] || stars > newStars[level]) {
                newStars[level] = stars;
            }
            const nextLevel = Math.max(state.puzzles.sudokuTrackLevel, level + 1);
            const newState = {
                puzzles: {
                    ...state.puzzles,
                    sudokuTrackLevel: nextLevel,
                    sudokuTrackStars: newStars,
                }
            };
            debouncedSave({ ...state, ...newState });
            return newState;
        });
    },

    setActiveSession: (session: import('@/lib/puzzle/types').PuzzleSession | null) => {
        set((state) => {
            const newState = { puzzles: { ...state.puzzles, activeSession: session } };
            debouncedSave({ ...state, ...newState });
            return newState;
        });
    },

    resetSaveData: async () => {
        await saveStorage.clearSave();
        const freshSave = {
            ...INITIAL_SAVE_DATA,
            profile: { ...INITIAL_SAVE_DATA.profile, id: uuidv4(), createdAt: Date.now() }
        };
        await saveStorage.setSave(freshSave);
        set({ ...freshSave, isLoaded: true });
    }
}));
