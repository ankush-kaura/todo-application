import { useCallback, useRef, useState } from "react";
import type { TaskPriority, CreateTaskInput } from "@/types";
import { Button, Input, Select } from "@/components/ui";
import { cn } from "@/utils/cn";

interface TaskCreateFormProps {
  onSubmit: (input: CreateTaskInput) => void;
}

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export function TaskCreateForm({ onSubmit }: TaskCreateFormProps) {
  const [title, setTitle] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setTitle("");
    setPriority("medium");
    setDueDate("");
    setExpanded(false);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = title.trim();
    if (!trimmed) return;

    const input: CreateTaskInput = { title: trimmed, priority };
    if (dueDate) input.dueDate = new Date(dueDate).getTime();
    onSubmit(input);
    reset();
    inputRef.current?.focus();
  }, [title, priority, dueDate, onSubmit, reset]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === "Escape") {
        reset();
        inputRef.current?.blur();
      }
    },
    [handleSubmit, reset],
  );

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-3 transition-shadow",
        expanded && "shadow-md",
      )}
    >
      <div className="flex items-center gap-2">
        <svg
          className="h-5 w-5 shrink-0 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task... (Enter to create)"
          className="h-8 flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
        />
        {title.trim() && (
          <Button size="sm" onClick={handleSubmit}>
            Add
          </Button>
        )}
      </div>

      {expanded && (
        <div className="mt-3 flex flex-wrap items-end gap-3 border-t border-border pt-3">
          <div className="w-36">
            <Select
              label="Priority"
              options={priorityOptions}
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            />
          </div>
          <div className="w-44">
            <Input
              label="Due date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="sm" onClick={reset}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
