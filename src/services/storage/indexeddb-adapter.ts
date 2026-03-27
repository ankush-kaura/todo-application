import Dexie, { type EntityTable } from 'dexie';
import type { Task } from '@/types';
import type { StorageAdapter } from './adapter';
import { toStorageError } from './errors';

class TodoDatabase extends Dexie {
  tasks!: EntityTable<Task, 'id'>;

  constructor() {
    super('todo-app');

    this.version(1).stores({
      tasks: 'id, status, priority, dueDate, createdAt, order, *tags',
    });
  }
}

export class IndexedDBAdapter implements StorageAdapter {
  private db: TodoDatabase;

  constructor() {
    this.db = new TodoDatabase();
  }

  async getAll<T>(store: string): Promise<T[]> {
    try {
      return (await this.table(store).toArray()) as T[];
    } catch (err) {
      throw toStorageError(err, 'READ_ERROR');
    }
  }

  async getById<T>(store: string, id: string): Promise<T | undefined> {
    try {
      return (await this.table(store).get(id)) as T | undefined;
    } catch (err) {
      throw toStorageError(err, 'READ_ERROR');
    }
  }

  async put<T extends { id: string }>(store: string, item: T): Promise<void> {
    try {
      await this.table(store).put(item);
    } catch (err) {
      throw toStorageError(err, 'WRITE_ERROR');
    }
  }

  async delete(store: string, id: string): Promise<void> {
    try {
      await this.table(store).delete(id);
    } catch (err) {
      throw toStorageError(err, 'DELETE_ERROR');
    }
  }

  async query<T>(store: string, filter: (item: T) => boolean): Promise<T[]> {
    try {
      const all = (await this.table(store).toArray()) as T[];
      return all.filter(filter);
    } catch (err) {
      throw toStorageError(err, 'READ_ERROR');
    }
  }

  async clear(store: string): Promise<void> {
    try {
      await this.table(store).clear();
    } catch (err) {
      throw toStorageError(err, 'DELETE_ERROR');
    }
  }

  private table(store: string) {
    const table = this.db.table(store);
    if (!table) {
      throw toStorageError(new Error(`Unknown store: ${store}`), 'READ_ERROR');
    }
    return table;
  }
}
