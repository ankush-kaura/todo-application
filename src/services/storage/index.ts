export type { StorageAdapter } from './adapter';
export { StorageError, type StorageErrorCode } from './errors';
export { IndexedDBAdapter } from './indexeddb-adapter';
export { LocalStorageAdapter } from './localstorage-adapter';
export {
  getStorageAdapter,
  getStorageBackend,
  resetStorageAdapter,
  type StorageBackend,
} from './storage-service';
