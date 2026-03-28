import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import type { Task, TaskPriority } from "@/types";
import { Button, Input, Select, TextArea, Badge } from "@/components/ui";
import { cn } from "@/utils/cn";
import { selectPriorityBadgeVariant } from "@/store";

interface TaskDetailPanelProps {
  task: Task | undefined;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

function formatDateForInput(timestamp: number | undefined): string {
  if (timestamp === undefined) return "";
  return format(new Date(timestamp), "yyyy-MM-dd");
}

export function TaskDetailPanel({
  task,
  open,
  onClose,
  onSave,
  onDelete,
}: TaskDetailPanelProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<Task["status"]>("todo");
  const [dueDate, setDueDate] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  // Sync form when task changes
  useEffect(() => {
    if (!task) return;
    setTitle(task.title);
    setDescription(task.description ?? "");
    setPriority(task.priority);
    setStatus(task.status);
    setDueDate(formatDateForInput(task.dueDate));
    setTagsInput(task.tags?.join(", ") ?? "");
  }, [task]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleSave = useCallback(() => {
    if (!task || !title.trim()) return;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updates: Partial<Task> = {
      title: title.trim(),
      priority,
      status,
    };
    if (description) updates.description = description;
    if (dueDate) updates.dueDate = new Date(dueDate).getTime();
    if (status === "done") updates.completedAt = task.completedAt ?? Date.now();
    if (tags.length > 0) updates.tags = tags;

    onSave(task.id, updates);
    onClose();
  }, [task, title, description, priority, status, dueDate, tagsInput, onSave, onClose]);

  if (!open || !task) return null;

  const titleError = !title.trim() ? "Title is required" : null;

  return createPortal(
    <div className="fixed inset-0 z-40 flex justify-end" role="presentation">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-overlay animate-backdrop-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Edit task: ${task.title}`}
        className={cn(
          "relative z-10 flex h-full w-full max-w-lg flex-col bg-surface shadow-xl",
          "animate-slide-in-right",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-text-primary">
              Task Details
            </h2>
            <Badge variant={selectPriorityBadgeVariant(task.priority)} size="sm">
              {task.priority}
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
            aria-label="Close panel"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={titleError ?? undefined}
          />

          <TextArea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            rows={4}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              options={priorityOptions}
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            />
            <Select
              label="Status"
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value as Task["status"])}
            />
          </div>

          <Input
            label="Due date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <Input
            label="Tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Comma-separated tags"
            helperText="e.g. work, personal, urgent"
          />

          {/* Metadata */}
          <div className="rounded-lg bg-bg-secondary p-3 text-xs text-text-tertiary">
            <p>Created: {format(new Date(task.createdAt), "MMM d, yyyy h:mm a")}</p>
            <p>Updated: {format(new Date(task.updatedAt), "MMM d, yyyy h:mm a")}</p>
            {task.completedAt !== undefined && (
              <p>Completed: {format(new Date(task.completedAt), "MMM d, yyyy h:mm a")}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onDelete(task.id);
              onClose();
            }}
          >
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!title.trim()}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
