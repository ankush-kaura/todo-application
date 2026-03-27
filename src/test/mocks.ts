import type { StorageAdapter } from "@/services/storage/adapter";
import type { Task } from "@/types";

export function createMockStorageAdapter(): StorageAdapter {
  const stores = new Map<string, Map<string, unknown>>();

  function getStore(name: string): Map<string, unknown> {
    let store = stores.get(name);
    if (!store) {
      store = new Map();
      stores.set(name, store);
    }
    return store;
  }

  return {
    async getAll<T>(store: string): Promise<T[]> {
      return [...getStore(store).values()] as T[];
    },

    async getById<T>(store: string, id: string): Promise<T | undefined> {
      return getStore(store).get(id) as T | undefined;
    },

    async put<T extends { id: string }>(store: string, item: T): Promise<void> {
      getStore(store).set(item.id, item);
    },

    async delete(store: string, id: string): Promise<void> {
      getStore(store).delete(id);
    },

    async query<T>(store: string, filter: (item: T) => boolean): Promise<T[]> {
      return ([...getStore(store).values()] as T[]).filter(filter);
    },

    async clear(store: string): Promise<void> {
      getStore(store).clear();
    },
  };
}

export function createMockTask(overrides?: Partial<Task>): Task {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: "Test Task",
    status: "todo",
    priority: "medium",
    createdAt: now,
    updatedAt: now,
    order: 0,
    ...overrides,
  };
}
