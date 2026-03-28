import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';

vi.mock('@/store/task-store', async () => {
  const { create } = await import('zustand');
  const useTaskStore = create(() => ({
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
  return { useTaskStore };
});

import { ToastProvider } from '@/components/ui/Toast';
import { TaskList } from '../TaskList';

function renderTaskList() {
  return renderWithProviders(
    <ToastProvider>
      <TaskList />
    </ToastProvider>,
  );
}

describe('TaskList', () => {
  it('shows empty state when loaded with no tasks', async () => {
    renderTaskList();
    await waitFor(() => {
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    });
  });

  it('shows task creation form after loading', async () => {
    renderTaskList();
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Add a task/)).toBeInTheDocument();
    });
  });

  it('shows keyboard shortcuts hint', async () => {
    renderTaskList();
    await waitFor(() => {
      expect(screen.getByText('create')).toBeInTheDocument();
    });
  });
});
