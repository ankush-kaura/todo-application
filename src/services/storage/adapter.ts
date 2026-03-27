export interface StorageAdapter {
  getAll<T>(store: string): Promise<T[]>;
  getById<T>(store: string, id: string): Promise<T | undefined>;
  put<T extends { id: string }>(store: string, item: T): Promise<void>;
  delete(store: string, id: string): Promise<void>;
  query<T>(store: string, filter: (item: T) => boolean): Promise<T[]>;
  clear(store: string): Promise<void>;
}
