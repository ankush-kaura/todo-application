import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStorageAdapter,
  getStorageBackend,
  resetStorageAdapter,
} from '../storage-service';

describe('storage-service', () => {
  beforeEach(() => {
    resetStorageAdapter();
  });

  it('returns an IndexedDB adapter when indexedDB is available', async () => {
    const adapter = await getStorageAdapter();
    expect(adapter).toBeDefined();
    expect(getStorageBackend()).toBe('indexeddb');
  });

  it('caches the adapter on subsequent calls', async () => {
    const first = await getStorageAdapter();
    const second = await getStorageAdapter();
    expect(first).toBe(second);
  });

  it('resetStorageAdapter clears the cache', async () => {
    await getStorageAdapter();
    expect(getStorageBackend()).toBe('indexeddb');

    resetStorageAdapter();
    expect(getStorageBackend()).toBeNull();
  });
});
