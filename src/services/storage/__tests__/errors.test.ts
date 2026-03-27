import { describe, it, expect } from 'vitest';
import { StorageError, toStorageError } from '../errors';

describe('StorageError', () => {
  it('creates error with code and message', () => {
    const err = new StorageError('bad data', 'CORRUPTED_DATA');
    expect(err.message).toBe('bad data');
    expect(err.code).toBe('CORRUPTED_DATA');
    expect(err.name).toBe('StorageError');
    expect(err).toBeInstanceOf(Error);
  });

  it('stores cause', () => {
    const cause = new Error('original');
    const err = new StorageError('wrapped', 'READ_ERROR', cause);
    expect(err.cause).toBe(cause);
  });
});

describe('toStorageError', () => {
  it('returns StorageError as-is', () => {
    const original = new StorageError('test', 'WRITE_ERROR');
    const result = toStorageError(original, 'READ_ERROR');
    expect(result).toBe(original);
    expect(result.code).toBe('WRITE_ERROR');
  });

  it('wraps regular Error', () => {
    const err = new Error('oops');
    const result = toStorageError(err, 'READ_ERROR');
    expect(result).toBeInstanceOf(StorageError);
    expect(result.code).toBe('READ_ERROR');
    expect(result.message).toBe('oops');
    expect(result.cause).toBe(err);
  });

  it('wraps non-Error values', () => {
    const result = toStorageError('string error', 'WRITE_ERROR');
    expect(result.message).toBe('string error');
    expect(result.code).toBe('WRITE_ERROR');
  });

  it('detects QuotaExceededError by name', () => {
    const dom = new DOMException('quota', 'QuotaExceededError');
    const result = toStorageError(dom, 'WRITE_ERROR');
    expect(result.code).toBe('QUOTA_EXCEEDED');
  });
});
