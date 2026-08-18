import { useState, useEffect, useCallback } from "react";
import { SystemHealthData, fetchSystemHealth } from "../services/systemService";

export function useSystemHealth(pollIntervalMs: number = 30000) {
  const [health, setHealth] = useState<SystemHealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSystemHealth();
      setHealth(data);
      setLastRefreshed(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, pollIntervalMs);
    return () => clearInterval(interval);
  }, [refresh, pollIntervalMs]);

  return { health, loading, lastRefreshed, refresh };
}
