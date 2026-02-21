import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'puzzle-pets-save';
const STORE_NAME = 'game-state';
// Bump this version when adding new fields or restructing the save file schema.
const DB_VERSION = 1;

export interface SaveData {
    profile: {
        id: string;
        createdAt: number;
        settings: Record<string, unknown>;
    };
    wallet: {
        coins: number;
        gems: number;
    };
    pets: {
        collection: string[]; // array of pet IDs grabbed from manifest
        activePetId: string | null;
        xp: number;
        level: number;
        mood: number;
    };
    puzzles: {
        completedCount: number;
        bestStats: Record<string, { stars: number; time: number }>; // e.g. 'sudoku_4x4' -> { stars: 3, time: 120 }
        activeSession: import('./puzzle/types').PuzzleSession | null;
    };
}

export const INITIAL_SAVE_DATA: SaveData = {
    profile: {
        id: '', // Will be generated on first init
        createdAt: Date.now(),
        settings: {}, // Settings remain in Zustand persist for UI, but backed up here if needed
    },
    wallet: { coins: 0, gems: 0 },
    pets: {
        collection: [],
        activePetId: 'cat',
        xp: 0,
        level: 1,
        mood: 100,
    },
    puzzles: {
        completedCount: 0,
        bestStats: {},
        activeSession: null,
    },
};

/**
 * Initializes and handles migrations for the IndexedDB save file.
 */
async function initDB(): Promise<IDBPDatabase> {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db, _oldVersion, _newVersion, _transaction) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }

            // Future Migrations Example:
            // if (oldVersion < 2) { 
            //    // grab existing data `transaction.objectStore(STORE_NAME).get('save')`
            //    // mutate data
            //    // `transaction.objectStore(STORE_NAME).put(migratedData, 'save')`
            // }
        },
        blocked() {
            console.error('IndexedDB is blocked. Close other tabs of this site!');
        },
        blocking() {
            console.warn('IndexedDB needs to upgrade but is blocked by this tab.');
        }
    });
}

export const saveStorage = {
    async getSave(): Promise<SaveData | null> {
        try {
            const db = await initDB();
            const data = await db.get(STORE_NAME, 'save');
            return data || null;
        } catch (e) {
            console.error('Failed to get save from IndexedDB:', e);
            return null;
        }
    },

    async setSave(data: SaveData): Promise<void> {
        try {
            const db = await initDB();
            await db.put(STORE_NAME, data, 'save');
        } catch (e) {
            console.error('Failed to write save to IndexedDB:', e);
        }
    },

    async clearSave(): Promise<void> {
        try {
            const db = await initDB();
            await db.delete(STORE_NAME, 'save');
        } catch (e) {
            console.error('Failed to clear save in IndexedDB:', e);
        }
    }
};
