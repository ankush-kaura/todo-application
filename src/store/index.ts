export { useTaskStore } from './task-store';
export { useUIStore, type SidebarView } from './ui-store';

import type { TaskPriority } from '@/types';

export const selectPriorityBadgeVariant = (
  priority: TaskPriority,
): "danger" | "warning" | "primary" | "default" => {
  switch (priority) {
    case "urgent":
      return "danger";
    case "high":
      return "warning";
    case "medium":
      return "primary";
    case "low":
      return "default";
  }
};
