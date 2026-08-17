import { API_V1_URL } from "../config/api";

export interface AnalyticsSummaryResponse {
  totalRevenue: number;
  netRevenue: number;
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  approvalRate: number;
  totalTransactions: number;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments: number;
  refundedAmount: number;
  applicationBreakdown: Record<string, number>;
  paymentBreakdown: Record<string, { count: number; totalAmount: number }>;
  revenueSources: Array<{ source: string; amount: number }>;
  countryBreakdown: Array<{
    country: string;
    applications: number;
    approved: number;
    rejected: number;
    pending: number;
    revenue: number;
    approvalRate: string;
  }>;
  visaTypeBreakdown: Array<{
    visaType: string;
    applications: number;
    approved: number;
    rejected: number;
    pending: number;
    revenue: number;
    approvalRate: string;
  }>;
}

/**
 * Currency formatter for dynamic numbers:
 * - If >= 1,00,00,000 (1 Cr) -> ₹X.XX Cr
 * - If >= 1,00,000 (1 Lakh) -> ₹X.XX L
 * - Otherwise -> ₹XX,XXX (standard locale format)
 */
export function formatDynamicINR(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (abs >= 10000000) {
    return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  }
  return `${sign}₹${abs.toLocaleString("en-IN")}`;
}

/**
 * Fetches the live aggregated report analytics directly from MongoDB
 */
export async function fetchLiveReportSummary(): Promise<AnalyticsSummaryResponse> {
  const res = await fetch(`${API_V1_URL}/finance/analytics/summary`);
  const json = await res.json();
  if (res.ok && json.success && json.data) {
    return json.data as AnalyticsSummaryResponse;
  }
  throw new Error(json.message || "Failed to fetch live report analytics");
}
