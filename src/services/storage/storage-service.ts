import type { StorageAdapter } from './adapter';
import { IndexedDBAdapter } from './indexeddb-adapter';
import { LocalStorageAdapter } from './localstorage-adapter';

export type StorageBackend = 'indexeddb' | 'localstorage';

let cachedAdapter: StorageAdapter | null = null;
let cachedBackend: StorageBackend | null = null;

async function detectIndexedDB(): Promise<boolean> {
  if (typeof indexedDB === 'undefined') return false;

  try {
    const testName = '__idb_test__';
    const req = indexedDB.open(testName);
    return await new Promise<boolean>((resolve) => {
      req.onsuccess = () => {
        req.result.close();
        indexedDB.deleteDatabase(testName);
        resolve(true);
      };
      req.onerror = () => resolve(false);
      req.onblocked = () => resolve(false);
    });
  } catch {
    return false;
  }
}

export async function getStorageAdapter(): Promise<StorageAdapter> {
  if (cachedAdapter) return cachedAdapter;

  const idbAvailable = await detectIndexedDB();

  if (idbAvailable) {
    cachedAdapter = new IndexedDBAdapter();
    cachedBackend = 'indexeddb';
  } else {
    cachedAdapter = new LocalStorageAdapter();
    cachedBackend = 'localstorage';
  }

  return cachedAdapter;
}

export function getStorageBackend(): StorageBackend | null {
  return cachedBackend;
}

/** Reset cached adapter — useful for testing. */
export function resetStorageAdapter(): void {
  cachedAdapter = null;
  cachedBackend = null;
}
