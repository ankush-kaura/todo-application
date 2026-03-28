export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: number;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  tags?: string[];
  order: number;
}

export type TaskStatus = Task['status'];
export type TaskPriority = Task['priority'];

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: number;
  tags?: string[];
}

export interface TaskFilters {
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority | TaskPriority[];
  tags?: string[];
  search?: string;
}

export type TaskSortField = 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'order';
export type SortDirection = 'asc' | 'desc';
