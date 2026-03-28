import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import type { Task } from '@/types';

// Mock the storage module before importing the store
const mockAdapter = {
  getAll: vi.fn().mockResolvedValue([]),
  getById: vi.fn().mockResolvedValue(undefined),
  put: vi.fn().mockResolvedValue(undefined),
  delete: vi.fn().mockResolvedValue(undefined),
  query: vi.fn().mockResolvedValue([]),
  clear: vi.fn().mockResolvedValue(undefined),
};

vi.mock('@/services/storage', () => ({
  getStorageAdapter: vi.fn().mockResolvedValue(mockAdapter),
}));

// Import store after mocks are set up
const { useTaskStore } = await import('@/store/task-store');

function getStore() {
  return useTaskStore.getState();
}

function makeTask(overrides?: Partial<Task>): Task {
  const now = Date.now();
  return {
    id: `t-${Math.random().toString(36).slice(2, 6)}`,
    title: 'Test Task',
    status: 'todo',
    priority: 'medium',
    createdAt: now,
    updatedAt: now,
    order: 0,
    ...overrides,
  };
}

describe('task-store', () => {
  beforeEach(() => {
    // Reset store state
    useTaskStore.setState({ tasks: [], isLoading: false, error: null });
    vi.clearAllMocks();
    mockAdapter.getAll.mockResolvedValue([]);
    mockAdapter.put.mockResolvedValue(undefined);
    mockAdapter.delete.mockResolvedValue(undefined);
    mockAdapter.clear.mockResolvedValue(undefined);
  });

  describe('loadTasks', () => {
    it('sets isLoading while loading', async () => {
      let resolveGetAll!: (v: Task[]) => void;
      mockAdapter.getAll.mockReturnValue(
        new Promise<Task[]>((r) => {
          resolveGetAll = r;
        }),
      );

      const promise = act(() => getStore().loadTasks());
      expect(getStore().isLoading).toBe(true);
      expect(getStore().error).toBeNull();

      await act(async () => resolveGetAll([]));
      await promise;

      expect(getStore().isLoading).toBe(false);
    });

    it('loads and sorts tasks by order', async () => {
      const tasks = [
        makeTask({ id: 'a', order: 2, title: 'Second' }),
        makeTask({ id: 'b', order: 0, title: 'First' }),
        makeTask({ id: 'c', order: 1, title: 'Middle' }),
      ];
      mockAdapter.getAll.mockResolvedValue(tasks);

      await act(() => getStore().loadTasks());

      const loaded = getStore().tasks;
      expect(loaded).toHaveLength(3);
      expect(loaded[0]!.id).toBe('b');
      expect(loaded[1]!.id).toBe('c');
      expect(loaded[2]!.id).toBe('a');
    });

    it('sets error on load failure', async () => {
      mockAdapter.getAll.mockRejectedValue(new Error('network'));

      await act(() => getStore().loadTasks());

      expect(getStore().isLoading).toBe(false);
      expect(getStore().error).toBe('Failed to load tasks.');
    });

    it('sets corrupted data error for CORRUPTED_DATA code', async () => {
      const { StorageError } = await import('@/services/storage/errors');
      mockAdapter.getAll.mockRejectedValue(
        new StorageError('corrupt', 'CORRUPTED_DATA'),
      );

      await act(() => getStore().loadTasks());

      expect(getStore().error).toBe('Task data is corrupted. Please reset your data.');
    });
  });

  describe('addTask', () => {
    it('adds a task optimistically and persists it', async () => {
      const task = await act(() =>
        getStore().addTask({ title: 'New Task', priority: 'high' }),
      );

      expect(task.title).toBe('New Task');
      expect(task.priority).toBe('high');
      expect(task.status).toBe('todo');
      expect(getStore().tasks).toHaveLength(1);
      expect(mockAdapter.put).toHaveBeenCalledWith('tasks', expect.objectContaining({ title: 'New Task' }));
    });

    it('assigns incremental order', async () => {
      await act(() => getStore().addTask({ title: 'First' }));
      await act(() => getStore().addTask({ title: 'Second' }));

      const tasks = getStore().tasks;
      expect(tasks[0]!.order).toBe(0);
      expect(tasks[1]!.order).toBe(1);
    });

    it('defaults priority to medium', async () => {
      const task = await act(() => getStore().addTask({ title: 'T' }));
      expect(task.priority).toBe('medium');
    });

    it('includes optional fields', async () => {
      const task = await act(() =>
        getStore().addTask({
          title: 'T',
          description: 'desc',
          dueDate: 1234567890,
          tags: ['work'],
        }),
      );

      expect(task.description).toBe('desc');
      expect(task.dueDate).toBe(1234567890);
      expect(task.tags).toEqual(['work']);
    });

    it('rolls back on persist failure', async () => {
      mockAdapter.put.mockRejectedValue(new Error('write fail'));

      await act(() => getStore().addTask({ title: 'Will fail' }));

      expect(getStore().tasks).toHaveLength(0);
      expect(getStore().error).toBe('Failed to save task.');
    });

    it('sets quota error on QUOTA_EXCEEDED', async () => {
      const { StorageError } = await import('@/services/storage/errors');
      mockAdapter.put.mockRejectedValue(
        new StorageError('full', 'QUOTA_EXCEEDED'),
      );

      await act(() => getStore().addTask({ title: 'Quota' }));

      expect(getStore().error).toBe('Storage is full. Please delete some tasks.');
    });
  });

  describe('updateTask', () => {
    it('updates a task optimistically and persists', async () => {
      useTaskStore.setState({
        tasks: [makeTask({ id: 't1', title: 'Old' })],
      });

      await act(() => getStore().updateTask('t1', { title: 'New' }));

      expect(getStore().tasks[0]!.title).toBe('New');
      expect(getStore().tasks[0]!.updatedAt).toBeGreaterThan(0);
      expect(mockAdapter.put).toHaveBeenCalled();
    });

    it('preserves original id on update', async () => {
      useTaskStore.setState({
        tasks: [makeTask({ id: 't1' })],
      });

      await act(() => getStore().updateTask('t1', { id: 'hacked' } as Partial<Task>));

      expect(getStore().tasks[0]!.id).toBe('t1');
    });

    it('rolls back on persist failure', async () => {
      useTaskStore.setState({
        tasks: [makeTask({ id: 't1', title: 'Original' })],
      });
      mockAdapter.put.mockRejectedValue(new Error('fail'));

      await act(() => getStore().updateTask('t1', { title: 'Changed' }));

      expect(getStore().tasks[0]!.title).toBe('Original');
      expect(getStore().error).toBe('Failed to update task.');
    });

    it('no-ops for nonexistent task', async () => {
      await act(() => getStore().updateTask('nope', { title: 'X' }));
      expect(mockAdapter.put).not.toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('removes a task optimistically and deletes from storage', async () => {
      useTaskStore.setState({
        tasks: [makeTask({ id: 't1' }), makeTask({ id: 't2' })],
      });

      await act(() => getStore().deleteTask('t1'));

      expect(getStore().tasks).toHaveLength(1);
      expect(getStore().tasks[0]!.id).toBe('t2');
      expect(mockAdapter.delete).toHaveBeenCalledWith('tasks', 't1');
    });

    it('rolls back on delete failure', async () => {
      useTaskStore.setState({
        tasks: [makeTask({ id: 't1' })],
      });
      mockAdapter.delete.mockRejectedValue(new Error('fail'));

      await act(() => getStore().deleteTask('t1'));

      expect(getStore().tasks).toHaveLength(1);
      expect(getStore().error).toBe('Failed to delete task.');
    });

    it('no-ops for nonexistent task', async () => {
      await act(() => getStore().deleteTask('nope'));
      expect(mockAdapter.delete).not.toHaveBeenCalled();
    });
  });

  describe('toggleComplete', () => {
    it('toggles todo to done', async () => {
      useTaskStore.setState({
        tasks: [makeTask({ id: 't1', status: 'todo' })],
      });

      await act(() => getStore().toggleComplete('t1'));

      const task = getStore().tasks[0]!;
      expect(task.status).toBe('done');
      expect(task.completedAt).toBeDefined();
    });

    it('toggles done back to todo', async () => {
      useTaskStore.setState({
        tasks: [makeTask({ id: 't1', status: 'done', completedAt: 123 })],
      });

      await act(() => getStore().toggleComplete('t1'));

      expect(getStore().tasks[0]!.status).toBe('todo');
    });

    it('no-ops for nonexistent task', async () => {
      await act(() => getStore().toggleComplete('nope'));
      expect(mockAdapter.put).not.toHaveBeenCalled();
    });
  });

  describe('reorderTasks', () => {
    it('reorders tasks and updates order field', async () => {
      useTaskStore.setState({
        tasks: [
          makeTask({ id: 'a', order: 0 }),
          makeTask({ id: 'b', order: 1 }),
          makeTask({ id: 'c', order: 2 }),
        ],
      });

      await act(() => getStore().reorderTasks(0, 2));

      const ids = getStore().tasks.map((t) => t.id);
      expect(ids).toEqual(['b', 'c', 'a']);
      getStore().tasks.forEach((t, i) => expect(t.order).toBe(i));
    });

    it('rolls back on persist failure', async () => {
      useTaskStore.setState({
        tasks: [
          makeTask({ id: 'a', order: 0 }),
          makeTask({ id: 'b', order: 1 }),
        ],
      });
      mockAdapter.clear.mockRejectedValue(new Error('fail'));

      await act(() => getStore().reorderTasks(0, 1));

      expect(getStore().error).toBe('Failed to reorder tasks.');
    });

    it('ignores out-of-bounds indices', async () => {
      useTaskStore.setState({
        tasks: [makeTask({ id: 'a', order: 0 })],
      });

      await act(() => getStore().reorderTasks(-1, 0));
      await act(() => getStore().reorderTasks(0, 5));

      expect(mockAdapter.clear).not.toHaveBeenCalled();
    });
  });

  describe('getFilteredTasks', () => {
    const tasks: Task[] = [
      makeTask({ id: 'a', title: 'Buy groceries', status: 'todo', priority: 'high', order: 0, tags: ['personal'] }),
      makeTask({ id: 'b', title: 'Write code', status: 'in_progress', priority: 'medium', order: 1, tags: ['work'] }),
      makeTask({ id: 'c', title: 'Read book', status: 'done', priority: 'low', order: 2, tags: ['personal'] }),
      makeTask({ id: 'd', title: 'Fix bug in app', status: 'todo', priority: 'urgent', order: 3, tags: ['work'] }),
    ];

    beforeEach(() => {
      useTaskStore.setState({ tasks });
    });

    it('returns all tasks with empty filters', () => {
      const result = getStore().getFilteredTasks({});
      expect(result).toHaveLength(4);
    });

    it('filters by single status', () => {
      const result = getStore().getFilteredTasks({ status: 'todo' });
      expect(result).toHaveLength(2);
      result.forEach((t) => expect(t.status).toBe('todo'));
    });

    it('filters by multiple statuses', () => {
      const result = getStore().getFilteredTasks({ status: ['todo', 'in_progress'] });
      expect(result).toHaveLength(3);
    });

    it('filters by single priority', () => {
      const result = getStore().getFilteredTasks({ priority: 'high' });
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe('a');
    });

    it('filters by multiple priorities', () => {
      const result = getStore().getFilteredTasks({ priority: ['high', 'urgent'] });
      expect(result).toHaveLength(2);
    });

    it('filters by tags', () => {
      const result = getStore().getFilteredTasks({ tags: ['work'] });
      expect(result).toHaveLength(2);
    });

    it('filters by search query (title)', () => {
      const result = getStore().getFilteredTasks({ search: 'groceries' });
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe('a');
    });

    it('filters by search query (case insensitive)', () => {
      const result = getStore().getFilteredTasks({ search: 'BUY' });
      expect(result).toHaveLength(1);
    });

    it('searches description too', () => {
      useTaskStore.setState({
        tasks: [makeTask({ id: 'x', title: 'Task', description: 'find me here' })],
      });
      const result = getStore().getFilteredTasks({ search: 'find me' });
      expect(result).toHaveLength(1);
    });

    it('combines multiple filters', () => {
      const result = getStore().getFilteredTasks({ status: 'todo', priority: 'urgent' });
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe('d');
    });

    it('sorts by order ascending by default', () => {
      const result = getStore().getFilteredTasks({});
      expect(result.map((t) => t.order)).toEqual([0, 1, 2, 3]);
    });

    it('sorts by priority ascending', () => {
      const result = getStore().getFilteredTasks({}, 'priority', 'asc');
      expect(result.map((t) => t.priority)).toEqual(['urgent', 'high', 'medium', 'low']);
    });

    it('sorts by priority descending', () => {
      const result = getStore().getFilteredTasks({}, 'priority', 'desc');
      expect(result.map((t) => t.priority)).toEqual(['low', 'medium', 'high', 'urgent']);
    });

    it('sorts by createdAt descending', () => {
      useTaskStore.setState({
        tasks: [
          makeTask({ id: 'x', createdAt: 100, order: 0 }),
          makeTask({ id: 'y', createdAt: 300, order: 1 }),
          makeTask({ id: 'z', createdAt: 200, order: 2 }),
        ],
      });
      const result = getStore().getFilteredTasks({}, 'createdAt', 'desc');
      expect(result.map((t) => t.id)).toEqual(['y', 'z', 'x']);
    });
  });

  describe('clearError', () => {
    it('clears the error state', () => {
      useTaskStore.setState({ error: 'some error' });
      act(() => getStore().clearError());
      expect(getStore().error).toBeNull();
    });
  });
});
