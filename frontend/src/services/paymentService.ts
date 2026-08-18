import { API_V1_URL } from "../config/api";

export interface UnifiedTransactionPricing {
  consularFee: number;
  serviceFee: number;
  expressSurcharge: number;
  taxableBase: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  discount: number;
  netAmount: number;
}

export interface UnifiedRefundDetails {
  status: string;
  amount: number;
  date: string;
  refNo: string;
  reason: string;
}

export interface UnifiedTransactionRecord {
  id: string;
  transactionId: string;
  invoiceNo: string;
  applicationId: string;
  applicantName: string;
  passportNumber: string;
  nationality: string;
  country: string;
  visaType: string;
  visaCategory: "Tourist" | "Business" | "Student" | "Work" | "Medical" | "Transit";
  paidBy: "Applicant" | "Agent";
  agentName?: string;
  pricing: UnifiedTransactionPricing;
  paymentMethod: string;
  paymentGateway: string;
  paymentRef: string;
  status: "Successful" | "Pending" | "Failed" | "Refunded" | "Cancelled" | "Proforma";
  gstin: string;
  billingAddress: string;
  sacCode: string;
  refundDetails?: UnifiedRefundDetails;
  createdAt: string;
}

/**
 * Initial shared canonical transactions seed for client state initialization
 */
export const INITIAL_UNIFIED_TRANSACTIONS: UnifiedTransactionRecord[] = [];

export async function fetchUnifiedTransactions(agentId?: string): Promise<UnifiedTransactionRecord[]> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const url = agentId
      ? `${API_V1_URL}/finance/transactions?agentId=${encodeURIComponent(agentId)}`
      : `${API_V1_URL}/finance/transactions`;

    const res = await fetch(url, { headers });
    const json = await res.json();
    if (res.ok && json.success && Array.isArray(json.data)) {
      return json.data.map((item: any) => ({
        id: item._id || item.transactionId,
        transactionId: item.transactionId,
        invoiceNo: item.invoiceNo,
        applicationId: item.applicationId,
        applicantName: item.applicantName,
        passportNumber: item.passportNumber,
        nationality: item.nationality || "Indian",
        country: item.country,
        visaType: item.visaType,
        visaCategory: item.visaCategory || "Tourist",
        paidBy: item.paidBy || "Applicant",
        agentName: item.agentName || "",
        pricing: item.pricing || {
          consularFee: 0,
          serviceFee: 0,
          expressSurcharge: 0,
          taxableBase: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          totalTax: 0,
          discount: 0,
          netAmount: 0
        },
        paymentMethod: item.paymentMethod || "UPI",
        paymentGateway: item.paymentGateway || "Razorpay",
        paymentRef: item.paymentRef || "",
        status: item.status || "Successful",
        gstin: item.gstin || "",
        billingAddress: item.billingAddress || "",
        sacCode: item.sacCode || "998311",
        refundDetails: item.refundDetails,
        createdAt: item.createdAt || new Date().toISOString()
      }));
    }
  } catch (err) {
    console.error("Failed to fetch transactions from backend API:", err);
  }
  return [];
}

export async function updateTransactionStatusApi(id: string, status: string, refundReason?: string, refundAmount?: number) {
  try {
    const res = await fetch(`${API_V1_URL}/finance/transactions/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, refundReason, refundAmount })
    });
    return await res.json();
  } catch (err) {
    console.error("Failed to update status API:", err);
    return null;
  }
}

export async function updateInvoiceGstinApi(id: string, gstin: string, billingAddress?: string) {
  try {
    const res = await fetch(`${API_V1_URL}/finance/invoices/${id}/gstin`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gstin, billingAddress })
    });
    return await res.json();
  } catch (err) {
    console.error("Failed to update GSTIN API:", err);
    return null;
  }
}
