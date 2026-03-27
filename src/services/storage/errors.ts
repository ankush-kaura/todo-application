export class StorageError extends Error {
  constructor(
    message: string,
    public readonly code: StorageErrorCode,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

export type StorageErrorCode =
  | 'QUOTA_EXCEEDED'
  | 'NOT_FOUND'
  | 'READ_ERROR'
  | 'WRITE_ERROR'
  | 'DELETE_ERROR'
  | 'CORRUPTED_DATA'
  | 'UNAVAILABLE';

export function toStorageError(err: unknown, fallbackCode: StorageErrorCode): StorageError {
  if (err instanceof StorageError) return err;

  const message = err instanceof Error ? err.message : String(err);

  if (
    err instanceof DOMException &&
    (err.name === 'QuotaExceededError' || err.code === 22)
  ) {
    return new StorageError('Storage quota exceeded', 'QUOTA_EXCEEDED', err);
  }

  return new StorageError(message, fallbackCode, err);
}
