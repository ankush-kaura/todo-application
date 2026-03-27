import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/utils/cn";

interface HeaderProps {
  onMenuToggle: () => void;
  className?: string;
}

export function Header({ onMenuToggle, className }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 flex h-14 items-center border-b border-border bg-surface px-4",
        className,
      )}
      role="banner"
    >
      <button
        onClick={onMenuToggle}
        className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary md:hidden"
        aria-label="Toggle sidebar"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div className="flex items-center gap-2 md:ml-0">
        <svg
          className="h-6 w-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <span className="text-lg font-semibold text-text-primary">Todo</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="relative rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {/* Sun icon */}
          <svg
            className={cn(
              "h-5 w-5 transition-all duration-300",
              theme === "dark"
                ? "rotate-0 scale-100 opacity-100"
                : "rotate-90 scale-0 opacity-0 absolute inset-2",
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          {/* Moon icon */}
          <svg
            className={cn(
              "h-5 w-5 transition-all duration-300",
              theme === "dark"
                ? "-rotate-90 scale-0 opacity-0 absolute inset-2"
                : "rotate-0 scale-100 opacity-100",
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
