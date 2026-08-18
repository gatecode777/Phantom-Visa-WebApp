/**
 * reportData.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Interface definitions and helper formatters for Report Analytics.
 * All fake/mock datasets have been permanently eliminated platform-wide.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function formatRevenue(amountL: number): string {
  if (!amountL || isNaN(amountL) || amountL === 0) return "₹0";
  if (amountL >= 100) {
    return `₹${(amountL / 100).toFixed(2)} Cr`;
  }
  return `₹${amountL.toFixed(2)} L`;
}

export interface CountryPerformanceRow {
  flag: string;
  country: string;
  applications: number;
  approved: number;
  rejected: number;
  pending: number;
  revenue: string;
  revenueL: number;
  approvalRate: string;
  avgProcessingDays: number;
  avgProcessing: string;
}

export const CANONICAL_COUNTRIES: CountryPerformanceRow[] = [];
export const CANONICAL_TOTAL_APPS: number = 0;
export const CANONICAL_APPROVED: number = 0;
export const CANONICAL_REJECTED: number = 0;
export const CANONICAL_PENDING: number = 0;
export const CANONICAL_ACTIVE_COUNTRY_COUNT: number = 0;
export const CANONICAL_FASTEST_COUNTRY: CountryPerformanceRow | null = null;
export const CANONICAL_TOP_DESTINATION: CountryPerformanceRow | null = null;

export interface RevenueSourceRow {
  source: string;
  amount: string;
  amountL: number;
}

export const CANONICAL_REVENUE_SOURCES: RevenueSourceRow[] = [];
export const CANONICAL_TOTAL_REVENUE: string = "₹0";
export const CANONICAL_TOTAL_REVENUE_L: number = 0;
export const CANONICAL_NET_REVENUE: string = "₹0";

export interface PaymentStatusRow {
  status: string;
  count: number;
  amount: string;
  amountL: number;
}

export const CANONICAL_PAYMENT_SUMMARY: PaymentStatusRow[] = [];
export const CANONICAL_TOTAL_TRANSACTIONS: number = 0;
export const CANONICAL_SUCCESSFUL_PAYMENTS: number = 0;
export const CANONICAL_PENDING_PAYMENTS: number = 0;
export const CANONICAL_FAILED_PAYMENTS: number = 0;
export const CANONICAL_REFUNDED_PAYMENTS: number = 0;
export const CANONICAL_PAYMENT_DIST = {
  successfulPct: "0.0%",
  pendingPct: "0.0%",
  failedPct: "0.0%",
  refundedPct: "0.0%",
};

export interface StatusBreakdownRow {
  status: string;
  count: number;
  percentage: string;
}

export const CANONICAL_APP_STATUS_BREAKDOWN: StatusBreakdownRow[] = [];

export interface VisaTypePerformanceRow {
  icon: string;
  visaType: string;
  applications: number;
  approved: number;
  rejected: number;
  pending: number;
  revenue: string;
  revenueL: number;
  approvalRate: string;
  avgProcessing: string;
  avgProcessingDays: number;
}

export const CANONICAL_VISA_TYPES: VisaTypePerformanceRow[] = [];
export const CANONICAL_TOP_DEMAND_VISA: VisaTypePerformanceRow | null = null;
export const CANONICAL_FASTEST_VISA: VisaTypePerformanceRow | null = null;
