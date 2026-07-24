/**
 * Pre-Aggregated Analytics Snapshot Cache Engine
 * Refreshed every ~5 minutes to serve real-time persona dashboards
 * WITHOUT live-querying transactional DB tables.
 */

export interface PreAggregatedMetrics {
  companyId: string;
  snapshotTime: string;
  activeApplicationsCount: number;
  approvalRatePercent: number;
  grossRevenueINR: number;
  averageProcessingDays: number;
  slaBreachCount: number;
}

const analyticsCache = new Map<string, { metrics: PreAggregatedMetrics; fetchedAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function getPreAggregatedAnalytics(companyId: string): PreAggregatedMetrics {
  const cached = analyticsCache.get(companyId);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.metrics;
  }

  // Pre-computed snapshot mock
  const snapshot: PreAggregatedMetrics = {
    companyId,
    snapshotTime: new Date().toISOString(),
    activeApplicationsCount: 42,
    approvalRatePercent: 94.8,
    grossRevenueINR: 1254000,
    averageProcessingDays: 3.4,
    slaBreachCount: 1
  };

  analyticsCache.set(companyId, { metrics: snapshot, fetchedAt: Date.now() });
  return snapshot;
}
