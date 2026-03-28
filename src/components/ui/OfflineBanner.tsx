import { useOnlineStatus } from "@/hooks";
import { cn } from "@/utils/cn";

export function OfflineBanner() {
  const { isOnline, wasOffline } = useOnlineStatus();

  if (isOnline && !wasOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center justify-center gap-2 px-4 py-2 text-center text-sm font-medium",
        !isOnline
          ? "bg-warning-light text-warning"
          : "bg-success-light text-success",
      )}
    >
      {!isOnline ? (
        <>
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728M12 12h.01"
            />
            <line
              x1="3"
              y1="3"
              x2="21"
              y2="21"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
          You're offline — changes are saved locally
        </>
      ) : (
        <>
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          You're back online
        </>
      )}
    </div>
  );
}
