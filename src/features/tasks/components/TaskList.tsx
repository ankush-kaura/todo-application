import { useCallback, useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Task, CreateTaskInput } from "@/types";
import { useTaskStore } from "@/store";
import { useToast, EmptyState, Button } from "@/components/ui";
import { TaskItem } from "./TaskItem";
import { TaskCreateForm } from "./TaskCreateForm";
import { TaskDetailPanel } from "./TaskDetailPanel";

const TASK_ROW_HEIGHT = 48;

export function TaskList() {
  const tasks = useTaskStore((s) => s.tasks);
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
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const input: CreateTaskInput = { title: `${task.title} (copy)`, priority: task.priority };
      if (task.description != null) input.description = task.description;
      if (task.dueDate != null) input.dueDate = task.dueDate;
      if (task.tags != null) input.tags = [...task.tags];
      await addTask(input);
      toast("Task duplicated", "success");
    },
    [tasks, addTask, toast],
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
    ? tasks.find((t) => t.id === detailTaskId)
    : undefined;

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
          title="No tasks yet"
          description="Create your first task above to get started."
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
