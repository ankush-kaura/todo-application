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
