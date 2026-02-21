import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Minimal mock for IndexedDB (idb wrapper) so our store tests pass in Node/jsdom
const mockDb: Record<string, unknown> = {};

vi.mock('idb', () => ({
    openDB: vi.fn().mockResolvedValue({
        get: vi.fn().mockImplementation((store, key) => Promise.resolve(mockDb[key])),
        put: vi.fn().mockImplementation((store, val, key) => {
            mockDb[key] = val;
            return Promise.resolve();
        }),
        delete: vi.fn().mockImplementation((store, key) => {
            delete mockDb[key];
            return Promise.resolve();
        }),
    }),
}));
