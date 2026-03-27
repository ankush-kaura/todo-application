import type { StorageAdapter } from './adapter';
import { StorageError, toStorageError } from './errors';

const PREFIX = 'todo-app:';

export class LocalStorageAdapter implements StorageAdapter {
  async getAll<T>(store: string): Promise<T[]> {
    try {
      return this.readStore<T>(store);
    } catch (err) {
      throw toStorageError(err, 'READ_ERROR');
    }
  }

  async getById<T>(store: string, id: string): Promise<T | undefined> {
    try {
      const items = this.readStore<T & { id: string }>(store);
      return items.find((item) => item.id === id) as T | undefined;
    } catch (err) {
      throw toStorageError(err, 'READ_ERROR');
    }
  }

  async put<T extends { id: string }>(store: string, item: T): Promise<void> {
    try {
      const items = this.readStore<T>(store);
      const idx = items.findIndex((existing) => existing.id === item.id);
      if (idx >= 0) {
        items[idx] = item;
      } else {
        items.push(item);
      }
      this.writeStore(store, items);
    } catch (err) {
      throw toStorageError(err, 'WRITE_ERROR');
    }
  }

  async delete(store: string, id: string): Promise<void> {
    try {
      const items = this.readStore<{ id: string }>(store);
      const filtered = items.filter((item) => item.id !== id);
      this.writeStore(store, filtered);
    } catch (err) {
      throw toStorageError(err, 'DELETE_ERROR');
    }
  }

  async query<T>(store: string, filter: (item: T) => boolean): Promise<T[]> {
    try {
      return this.readStore<T>(store).filter(filter);
    } catch (err) {
      throw toStorageError(err, 'READ_ERROR');
    }
  }

  async clear(store: string): Promise<void> {
    try {
      localStorage.removeItem(PREFIX + store);
    } catch (err) {
      throw toStorageError(err, 'DELETE_ERROR');
    }
  }

  private readStore<T>(store: string): T[] {
    const raw = localStorage.getItem(PREFIX + store);
    if (raw === null) return [];

    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        throw new StorageError(
          `Corrupted data in store "${store}": expected array`,
          'CORRUPTED_DATA',
        );
      }
      return parsed as T[];
    } catch (err) {
      if (err instanceof StorageError) throw err;
      throw new StorageError(
        `Failed to parse store "${store}"`,
        'CORRUPTED_DATA',
        err,
      );
    }
  }

  private writeStore(store: string, items: unknown[]): void {
    try {
      localStorage.setItem(PREFIX + store, JSON.stringify(items));
    } catch (err) {
      throw toStorageError(err, 'WRITE_ERROR');
    }
  }
}
