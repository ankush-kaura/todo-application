import { useState, useCallback } from 'react';

export function useRegisterSW(_opts?: Record<string, unknown>) {
  const [needRefresh, setNeedRefresh] = useState(false);
  const updateServiceWorker = useCallback((_reloadPage?: boolean) => {}, []);

  return {
    needRefresh: [needRefresh, setNeedRefresh] as const,
    offlineReady: [false, () => {}] as const,
    updateServiceWorker,
  };
}
