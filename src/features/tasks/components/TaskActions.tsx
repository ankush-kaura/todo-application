import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface TaskActionsProps {
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function TaskActions({ onEdit, onDuplicate, onDelete }: TaskActionsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, close]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((p) => !p);
        }}
        className="rounded-md p-1 text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
        aria-label="Task actions"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 z-30 mt-1 w-40 rounded-lg border border-border bg-surface py-1 shadow-lg",
            "animate-scale-in",
          )}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              close();
            }}
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
              close();
            }}
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Duplicate
          </button>
          <hr className="my-1 border-border" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              close();
            }}
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-danger-light"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
