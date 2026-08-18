import { useState, useEffect, useCallback } from "react";
import {
  fetchLiveReportSummary,
  AnalyticsSummaryResponse,
  formatDynamicINR,
} from "../services/reportService";

export function useReportAnalytics() {
  const [data, setData] = useState<AnalyticsSummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const summary = await fetchLiveReportSummary();
      setData(summary);
    } catch (err: any) {
      console.error("useReportAnalytics error:", err);
      setError(err.message || "Failed to load live report analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refresh: loadData,
    formatINR: formatDynamicINR,
  };
}
