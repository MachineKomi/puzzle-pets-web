import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import debounce from 'lodash.debounce';
import { saveStorage, SaveData, INITIAL_SAVE_DATA } from '@/lib/storage';

interface GameState extends SaveData {
    isLoaded: boolean;

    // Actions
    initLoad: () => Promise<void>;
    addCoins: (amount: number) => void;
    gainXp: (amount: number) => void;
    unlockPet: (petId: string) => void;
    setActivePet: (petId: string) => void;
    recordPuzzleCompletion: (puzzleType: string, stars: number, time: number) => void;
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
            set({ ...savedData, isLoaded: true });
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
