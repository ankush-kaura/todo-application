import { useSWUpdate } from "@/hooks";

export function SWUpdatePrompt() {
  const { needRefresh, update, dismiss } = useSWUpdate();

  if (!needRefresh) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 shadow-lg"
    >
      <span className="text-sm text-text-primary">
        A new version is available
      </span>
      <button
        onClick={update}
        className="rounded-md bg-primary px-3 py-1 text-sm font-medium text-text-inverse transition-colors hover:bg-primary-hover"
      >
        Update
      </button>
      <button
        onClick={dismiss}
        className="rounded p-0.5 text-text-secondary opacity-60 transition-opacity hover:opacity-100"
        aria-label="Dismiss"
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
