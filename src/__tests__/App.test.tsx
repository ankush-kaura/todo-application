import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';

// Mock task store to avoid storage side effects
vi.mock('@/store/task-store', async () => {
  const { create } = await import('zustand');
  const mockStore = create(() => ({
    tasks: [],
    isLoading: false,
    error: null,
    loadTasks: vi.fn().mockResolvedValue(undefined),
    addTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    toggleComplete: vi.fn(),
    reorderTasks: vi.fn(),
    getFilteredTasks: vi.fn().mockReturnValue([]),
    clearError: vi.fn(),
  }));
  return { useTaskStore: mockStore };
});

import { App } from '@/App';

describe('App', () => {
  it('renders without crashing and shows header', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('Todo')).toBeInTheDocument();
  });

  it('renders sidebar navigation', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('All Tasks')).toBeInTheDocument();
  });
});
