import { useCallback, useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return null;
}

function getEffectiveTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  // Enable smooth theme transition
  root.classList.add("theme-transitioning");

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  // Update meta theme-color for browser chrome
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "dark" ? "#0f172a" : "#3b82f6");
  }

  // Remove transition class after animation completes
  setTimeout(() => {
    root.classList.remove("theme-transitioning");
  }, 350);
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): Theme {
  return getEffectiveTheme();
}

// Listen for system theme changes
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
mediaQuery.addEventListener("change", () => {
  // Only react to system changes if user hasn't set a manual preference
  if (getStoredTheme() === null) {
    applyTheme(getEffectiveTheme());
    listeners.forEach((l) => l());
  }
});

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot);

  // Ensure theme is applied on mount (handles SSR hydration edge case)
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
    listeners.forEach((l) => l());
  }, []);

  const toggleTheme = useCallback(() => {
    const current = getEffectiveTheme();
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
  }, [setTheme]);

  return { theme, setTheme, toggleTheme };
}
