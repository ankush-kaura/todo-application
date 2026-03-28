import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

type ToastType = "info" | "success" | "error" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

const typeStyles: Record<ToastType, string> = {
  info: "bg-surface border-border text-text-primary",
  success: "bg-success-light border-success text-success",
  error: "bg-danger-light border-danger text-danger",
  warning: "bg-warning-light border-warning text-warning",
};

const typeIcons: Record<ToastType, ReactNode> = {
  info: (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

function ToastItem({
  toast: t,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-center gap-2 rounded-lg border px-4 py-3 shadow-lg",
        t.exiting ? "animate-toast-out" : "animate-toast-in",
        typeStyles[t.type],
      )}
    >
      {typeIcons[t.type]}
      <span className="flex-1 text-sm font-medium">{t.message}</span>
      <button
        onClick={() => onDismiss(t.id)}
        className="shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100"
        aria-label="Dismiss notification"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    // Start exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );
    // Remove after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          aria-atomic="false"
          className="fixed right-4 bottom-4 z-50 flex flex-col gap-2"
        >
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
