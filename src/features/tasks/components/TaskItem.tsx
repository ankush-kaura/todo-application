import { useCallback } from "react";
import { format, isPast, isToday } from "date-fns";
import type { Task } from "@/types";
import { Badge } from "@/components/ui";
import { cn } from "@/utils/cn";
import { selectPriorityBadgeVariant } from "@/store";
import { TaskActions } from "./TaskActions";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
}

const priorityLabels: Record<Task["priority"], string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

function DueDateLabel({ timestamp }: { timestamp: number }) {
  const date = new Date(timestamp);
  const overdue = isPast(date) && !isToday(date);
  const today = isToday(date);

  return (
    <span
      className={cn(
        "shrink-0 text-xs",
        overdue
          ? "font-medium text-danger"
          : today
            ? "font-medium text-warning"
            : "text-text-tertiary",
      )}
    >
      {overdue && "Overdue: "}
      {today ? "Today" : format(date, "MMM d")}
    </span>
  );
}

export function TaskItem({
  task,
  onToggle,
  onEdit,
  onDuplicate,
  onDelete,
  onClick,
}: TaskItemProps) {
  const isDone = task.status === "done";

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggle(task.id);
    },
    [onToggle, task.id],
  );

  return (
    <div
      onClick={() => onClick(task.id)}
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2.5",
        "transition-colors hover:border-border hover:bg-surface-hover",
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick(task.id);
      }}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={cn(
          "relative flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
          isDone
            ? "border-success bg-success"
            : "border-border hover:border-primary",
        )}
        aria-label={isDone ? "Mark incomplete" : "Mark complete"}
      >
        {isDone && (
          <svg
            className="h-3.5 w-3.5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Title + metadata */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm",
            isDone
              ? "text-text-tertiary line-through"
              : "text-text-primary",
          )}
        >
          {task.title}
        </p>
      </div>

      {/* Priority badge */}
      <Badge
        variant={selectPriorityBadgeVariant(task.priority)}
        size="sm"
        className={cn(
          "shrink-0 transition-opacity",
          isDone && "opacity-50",
        )}
      >
        {priorityLabels[task.priority]}
      </Badge>

      {/* Due date */}
      {task.dueDate !== undefined && (
        <DueDateLabel timestamp={task.dueDate} />
      )}

      {/* Actions */}
      <div className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
        <TaskActions
          onEdit={() => onEdit(task.id)}
          onDuplicate={() => onDuplicate(task.id)}
          onDelete={() => onDelete(task.id)}
        />
      </div>
    </div>
  );
}
