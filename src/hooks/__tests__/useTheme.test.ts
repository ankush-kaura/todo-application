import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('defaults to system theme (light in jsdom)', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });

  it('reads stored theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('setTheme updates localStorage and DOM', () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.setTheme('dark'));

    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(result.current.theme).toBe('dark');
  });

  it('toggleTheme switches between dark and light', () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('dark');

    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('light');
  });

  it('ignores invalid stored values', () => {
    localStorage.setItem('theme', 'invalid');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light'); // falls back to system
  });
});
