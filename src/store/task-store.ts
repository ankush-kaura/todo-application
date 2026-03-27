import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  Task,
  CreateTaskInput,
  TaskFilters,
  TaskPriority,
  TaskSortField,
  SortDirection,
} from '../types';
import { getStorageAdapter } from '../services/storage';
import type { StorageAdapter } from '../services/storage/adapter';
import { StorageError } from '../services/storage/errors';

const STORE_NAME = 'tasks';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

interface TaskActions {
  loadTasks(): Promise<void>;
  addTask(input: CreateTaskInput): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<void>;
  deleteTask(id: string): Promise<void>;
  toggleComplete(id: string): Promise<void>;
  reorderTasks(sourceIndex: number, destIndex: number): Promise<void>;
  getFilteredTasks(filters: TaskFilters, sortBy?: TaskSortField, sortDir?: SortDirection): Task[];
  clearError(): void;
}

type TaskStore = TaskState & TaskActions;

let storagePromise: Promise<StorageAdapter> | null = null;

function getStorage(): Promise<StorageAdapter> {
  if (!storagePromise) {
    storagePromise = getStorageAdapter();
  }
  return storagePromise;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

async function persistTask(task: Task): Promise<void> {
  const storage = await getStorage();
  await storage.put(STORE_NAME, task);
}

async function removeTask(id: string): Promise<void> {
  const storage = await getStorage();
  await storage.delete(STORE_NAME, id);
}

async function persistAll(tasks: Task[]): Promise<void> {
  const storage = await getStorage();
  await storage.clear(STORE_NAME);
  await Promise.all(tasks.map((t) => storage.put(STORE_NAME, t)));
}

function buildTask(input: CreateTaskInput, order: number): Task {
  const now = Date.now();
  const task: Task = {
    id: generateId(),
    title: input.title,
    status: 'todo',
    priority: input.priority ?? 'medium',
    createdAt: now,
    updatedAt: now,
    order,
  };
  if (input.description !== undefined) task.description = input.description;
  if (input.dueDate !== undefined) task.dueDate = input.dueDate;
  if (input.tags !== undefined) task.tags = input.tags;
  return task;
}

export const useTaskStore = create<TaskStore>()(
  immer((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,

    async loadTasks() {
      set((s) => {
        s.isLoading = true;
        s.error = null;
      });

      try {
        const storage = await getStorage();
        const tasks = await storage.getAll<Task>(STORE_NAME);
        tasks.sort((a, b) => a.order - b.order);
        set((s) => {
          s.tasks = tasks;
          s.isLoading = false;
        });
      } catch (err) {
        const message =
          err instanceof StorageError && err.code === 'CORRUPTED_DATA'
            ? 'Task data is corrupted. Please reset your data.'
            : 'Failed to load tasks.';
        set((s) => {
          s.isLoading = false;
          s.error = message;
        });
      }
    },

    async addTask(input) {
      const { tasks } = get();
      const maxOrder = tasks.length > 0 ? Math.max(...tasks.map((t) => t.order)) : -1;
      const task = buildTask(input, maxOrder + 1);

      // Optimistic update
      set((s) => {
        s.tasks.push(task);
      });

      try {
        await persistTask(task);
      } catch (err) {
        // Rollback
        set((s) => {
          s.tasks = s.tasks.filter((t) => t.id !== task.id);
          s.error =
            err instanceof StorageError && err.code === 'QUOTA_EXCEEDED'
              ? 'Storage is full. Please delete some tasks.'
              : 'Failed to save task.';
        });
      }

      return task;
    },

    async updateTask(id, updates) {
      const { tasks } = get();
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) return;

      const prev = { ...tasks[index] };
      const updated = { ...prev, ...updates, id: prev.id, updatedAt: Date.now() } as Task;

      // Optimistic update
      set((s) => {
        s.tasks[index] = updated as Task;
      });

      try {
        await persistTask(updated);
      } catch {
        // Rollback
        set((s) => {
          s.tasks[index] = prev as Task;
          s.error = 'Failed to update task.';
        });
      }
    },

    async deleteTask(id) {
      const { tasks } = get();
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) return;

      const prev = { ...tasks[index] };

      // Optimistic
      set((s) => {
        s.tasks.splice(index, 1);
      });

      try {
        await removeTask(id);
      } catch {
        // Rollback
        set((s) => {
          s.tasks.splice(index, 0, prev as Task);
          s.error = 'Failed to delete task.';
        });
      }
    },

    async toggleComplete(id) {
      const { tasks } = get();
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const now = Date.now();
      const isDone = task.status === 'done';
      const updates: Partial<Task> = {
        status: isDone ? 'todo' : 'done',
        updatedAt: now,
      };
      if (!isDone) {
        updates.completedAt = now;
      }

      await get().updateTask(id, updates);
    },

    async reorderTasks(sourceIndex, destIndex) {
      const { tasks } = get();
      if (
        sourceIndex < 0 ||
        sourceIndex >= tasks.length ||
        destIndex < 0 ||
        destIndex >= tasks.length
      ) {
        return;
      }

      const prevTasks = tasks.map((t) => ({ ...t }));

      set((s) => {
        const [moved] = s.tasks.splice(sourceIndex, 1);
        s.tasks.splice(destIndex, 0, moved!);
        s.tasks.forEach((t, i) => {
          t.order = i;
          t.updatedAt = Date.now();
        });
      });

      try {
        await persistAll(get().tasks);
      } catch {
        set((s) => {
          s.tasks = prevTasks as Task[];
          s.error = 'Failed to reorder tasks.';
        });
      }
    },

    getFilteredTasks(filters, sortBy = 'order', sortDir = 'asc') {
      let result = get().tasks;

      if (filters.status) {
        const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
        result = result.filter((t) => statuses.includes(t.status));
      }

      if (filters.priority) {
        const priorities = Array.isArray(filters.priority) ? filters.priority : [filters.priority];
        result = result.filter((t) => priorities.includes(t.priority));
      }

      if (filters.tags && filters.tags.length > 0) {
        result = result.filter((t) => filters.tags!.some((tag) => t.tags?.includes(tag)));
      }

      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q),
        );
      }

      const dir = sortDir === 'asc' ? 1 : -1;
      return [...result].sort((a, b) => {
        if (sortBy === 'priority') {
          return (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]) * dir;
        }
        const aVal = a[sortBy] ?? 0;
        const bVal = b[sortBy] ?? 0;
        return ((aVal as number) - (bVal as number)) * dir;
      });
    },

    clearError() {
      set((s) => {
        s.error = null;
      });
    },
  })),
);
