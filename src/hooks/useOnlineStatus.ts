import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

export function useOnlineStatus(): {
  isOnline: boolean;
  wasOffline: boolean;
} {
  const isOnline = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [wasOffline, setWasOffline] = useState(false);
  const prevOnline = useRef(isOnline);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    }
    if (isOnline && !prevOnline.current) {
      // Came back online — keep wasOffline true briefly for the banner
      setWasOffline(true);
      const timer = setTimeout(() => setWasOffline(false), 4000);
      return () => clearTimeout(timer);
    }
    prevOnline.current = isOnline;
  }, [isOnline]);

  return { isOnline, wasOffline };
}
