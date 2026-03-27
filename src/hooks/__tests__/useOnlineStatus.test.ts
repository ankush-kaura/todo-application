import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOnlineStatus } from '../useOnlineStatus';

describe('useOnlineStatus', () => {
  beforeEach(() => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
  });

  it('returns online status', () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current.isOnline).toBe(true);
  });

  it('detects offline', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current.isOnline).toBe(false);
  });

  it('updates wasOffline when going offline', () => {
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);
    expect(result.current.wasOffline).toBe(true);
  });

  it('clears wasOffline after coming back online', () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useOnlineStatus());

    // Go offline
    act(() => {
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
      window.dispatchEvent(new Event('offline'));
    });

    // Come back online
    act(() => {
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.wasOffline).toBe(true);

    act(() => vi.advanceTimersByTime(4100));
    expect(result.current.wasOffline).toBe(false);

    vi.useRealTimers();
  });
});
