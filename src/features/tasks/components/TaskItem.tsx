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
  const isOverdue =
    task.dueDate !== undefined &&
    isPast(new Date(task.dueDate)) &&
    !isToday(new Date(task.dueDate)) &&
    !isDone;

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
        "group flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5",
        "transition-all duration-200 hover:border-border hover:bg-surface-hover hover:shadow-sm",
        isOverdue
          ? "border-danger/20 bg-danger-light/50"
          : "border-transparent",
        isDone && "opacity-75",
      )}
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}${isDone ? " (completed)" : ""}${isOverdue ? " (overdue)" : ""}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(task.id);
        }
      }}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={cn(
          "relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
          isDone
            ? "border-success bg-success shadow-sm shadow-success/25"
            : "border-border hover:border-primary hover:shadow-sm hover:shadow-primary/15",
        )}
        aria-label={isDone ? "Mark incomplete" : "Mark complete"}
      >
        {isDone && (
          <svg
            className="h-3 w-3 text-white animate-check-pop"
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
            "truncate text-sm transition-all duration-200",
            isDone
              ? "text-text-tertiary line-through decoration-text-tertiary/50"
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
          "shrink-0 transition-opacity duration-200",
          isDone && "opacity-40",
        )}
      >
        {priorityLabels[task.priority]}
      </Badge>

      {/* Due date */}
      {task.dueDate !== undefined && (
        <DueDateLabel timestamp={task.dueDate} />
      )}

      {/* Actions */}
      <div className="shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
        <TaskActions
          onEdit={() => onEdit(task.id)}
          onDuplicate={() => onDuplicate(task.id)}
          onDelete={() => onDelete(task.id)}
        />
      </div>
    </div>
  );
}
