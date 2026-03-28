import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { startOfDay, endOfDay, addDays } from "date-fns";
import type { Task, CreateTaskInput } from "@/types";
import { useTaskStore } from "@/store";
import { useUIStore } from "@/store/ui-store";
import { useToast, EmptyState, Button } from "@/components/ui";
import { TaskItem } from "./TaskItem";
import { TaskCreateForm } from "./TaskCreateForm";
import { TaskDetailPanel } from "./TaskDetailPanel";

const TASK_ROW_HEIGHT = 48;

function useFilteredTasks(allTasks: Task[]): Task[] {
  const sidebarView = useUIStore((s) => s.sidebarView);

  return useMemo(() => {
    switch (sidebarView) {
      case "today": {
        const todayEnd = endOfDay(new Date()).getTime();
        const todayStart = startOfDay(new Date()).getTime();
        return allTasks.filter(
          (t) => t.status !== "done" && t.dueDate != null && t.dueDate >= todayStart && t.dueDate <= todayEnd,
        );
      }
      case "upcoming": {
        const tomorrowStart = startOfDay(addDays(new Date(), 1)).getTime();
        return allTasks.filter(
          (t) => t.status !== "done" && t.dueDate != null && t.dueDate >= tomorrowStart,
        );
      }
      case "completed":
        return allTasks.filter((t) => t.status === "done");
      case "all":
      default:
        return allTasks;
    }
  }, [allTasks, sidebarView]);
}

export function TaskList() {
  const allTasks = useTaskStore((s) => s.tasks);
  const tasks = useFilteredTasks(allTasks);
  const isLoading = useTaskStore((s) => s.isLoading);
  const loadTasks = useTaskStore((s) => s.loadTasks);
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const toggleComplete = useTaskStore((s) => s.toggleComplete);

  const { toast } = useToast();
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  // Load tasks on mount
  useEffect(() => {
    void loadTasks().then(() => setLoaded(true));
  }, [loadTasks]);

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => TASK_ROW_HEIGHT,
    overscan: 10,
  });

  const handleCreate = useCallback(
    async (input: CreateTaskInput) => {
      await addTask(input);
      toast("Task created", "success");
    },
    [addTask, toast],
  );

  const handleToggle = useCallback(
    async (id: string) => {
      await toggleComplete(id);
    },
    [toggleComplete],
  );

  const handleEdit = useCallback((id: string) => {
    setDetailTaskId(id);
  }, []);

  const handleDuplicate = useCallback(
    async (id: string) => {
      const task = allTasks.find((t) => t.id === id);
      if (!task) return;
      const input: CreateTaskInput = { title: `${task.title} (copy)`, priority: task.priority };
      if (task.description != null) input.description = task.description;
      if (task.dueDate != null) input.dueDate = task.dueDate;
      if (task.tags != null) input.tags = [...task.tags];
      await addTask(input);
      toast("Task duplicated", "success");
    },
    [allTasks, addTask, toast],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteTask(id);
      toast("Task deleted", "info");
    },
    [deleteTask, toast],
  );

  const handleSave = useCallback(
    async (id: string, updates: Partial<Task>) => {
      await updateTask(id, updates);
      toast("Task updated", "success");
    },
    [updateTask, toast],
  );

  // Keyboard shortcut: Delete key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Delete" && detailTaskId) {
        void handleDelete(detailTaskId);
        setDetailTaskId(null);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [detailTaskId, handleDelete]);

  const detailTask = detailTaskId
    ? allTasks.find((t) => t.id === detailTaskId)
    : undefined;

  const sidebarView = useUIStore((s) => s.sidebarView);
  let emptyTitle: string;
  let emptyDescription: string;
  switch (sidebarView) {
    case "today":
      emptyTitle = "Nothing due today";
      emptyDescription = "Tasks with today's due date will appear here.";
      break;
    case "upcoming":
      emptyTitle = "No upcoming tasks";
      emptyDescription = "Tasks with future due dates will appear here.";
      break;
    case "completed":
      emptyTitle = "No completed tasks";
      emptyDescription = "Completed tasks will appear here.";
      break;
    default:
      emptyTitle = "No tasks yet";
      emptyDescription = "Create your first task above to get started.";
  }

  if (!loaded || isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-[72px] animate-pulse rounded-xl bg-bg-tertiary" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-12 animate-pulse rounded-lg bg-bg-tertiary"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
      </div>

      {/* Create form */}
      <TaskCreateForm onSubmit={handleCreate} />

      {/* Keyboard shortcuts hint */}
      <div className="flex gap-3 text-xs text-text-tertiary">
        <span>
          <kbd className="rounded border border-border bg-bg-secondary px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd>{" "}
          create
        </span>
        <span>
          <kbd className="rounded border border-border bg-bg-secondary px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd>{" "}
          cancel
        </span>
        <span>
          <kbd className="rounded border border-border bg-bg-secondary px-1.5 py-0.5 font-mono text-[10px]">Del</kbd>{" "}
          delete selected
        </span>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <EmptyState
          className="animate-fade-in"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
          title={emptyTitle}
          description={emptyDescription}
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                const input = document.querySelector<HTMLInputElement>(
                  'input[placeholder*="Add a task"]',
                );
                input?.focus();
              }}
            >
              Create a task
            </Button>
          }
        />
      ) : (
        <div
          ref={parentRef}
          className="max-h-[calc(100vh-280px)] overflow-auto"
        >
          <div
            className="relative w-full"
            style={{ height: `${virtualizer.getTotalSize()}px` }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const task = tasks[virtualRow.index];
              if (!task) return null;
              return (
                <div
                  key={task.id}
                  className="absolute left-0 top-0 w-full"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <TaskItem
                    task={task}
                    onToggle={handleToggle}
                    onEdit={handleEdit}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                    onClick={handleEdit}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detail panel */}
      <TaskDetailPanel
        task={detailTask}
        open={detailTaskId !== null && detailTask !== undefined}
        onClose={() => setDetailTaskId(null)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
