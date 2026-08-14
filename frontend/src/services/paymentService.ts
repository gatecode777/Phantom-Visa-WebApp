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
 * Initial shared canonical transactions seed for offline / client state initialization
 */
export const INITIAL_UNIFIED_TRANSACTIONS: UnifiedTransactionRecord[] = [
  {
    id: "tx-1025",
    transactionId: "PAY-2026-1025",
    invoiceNo: "INV-2026-1025",
    applicationId: "VO-2026-1025",
    applicantName: "Geeta Sharma",
    passportNumber: "Z9817264",
    nationality: "Indian",
    country: "Australia 🇦🇺",
    visaType: "Subclass 600 Tourist Visa",
    visaCategory: "Tourist",
    paidBy: "Applicant",
    pricing: {
      consularFee: 12500,
      serviceFee: 2500,
      expressSurcharge: 2000,
      taxableBase: 15000,
      cgst: 1350,
      sgst: 1350,
      igst: 0,
      totalTax: 2700,
      discount: 1000,
      netAmount: 16700
    },
    paymentMethod: "Credit Card (Visa •••• 8892)",
    paymentGateway: "Razorpay",
    paymentRef: "RAZOR-9817264-AU",
    status: "Successful",
    gstin: "27AAACG1234H1Z5",
    billingAddress: "104, Park Street, Connaught Place, New Delhi - 110001",
    sacCode: "998311",
    createdAt: "2026-08-07T10:15:00.000Z"
  },
  {
    id: "tx-9841",
    transactionId: "PAY-2026-9841",
    invoiceNo: "INV-2026-9841",
    applicationId: "VO-2026-9841",
    applicantName: "Geeta Sharma",
    passportNumber: "Z9817264",
    nationality: "Indian",
    country: "Canada 🇨🇦",
    visaType: "Canada Express Visitor Visa",
    visaCategory: "Tourist",
    paidBy: "Applicant",
    pricing: {
      consularFee: 8500,
      serviceFee: 2500,
      expressSurcharge: 2000,
      taxableBase: 11000,
      cgst: 990,
      sgst: 990,
      igst: 0,
      totalTax: 1980,
      discount: 0,
      netAmount: 14980
    },
    paymentMethod: "UPI Instant (Google Pay)",
    paymentGateway: "Razorpay",
    paymentRef: "UPI-481920-CA",
    status: "Successful",
    gstin: "27AAACG1234H1Z5",
    billingAddress: "104, Park Street, Connaught Place, New Delhi - 110001",
    sacCode: "998311",
    createdAt: "2026-08-01T16:30:00.000Z"
  },
  {
    id: "tx-1229",
    transactionId: "PAY-2026-1229",
    invoiceNo: "INV-2026-1229",
    applicationId: "VO-2026-1229",
    applicantName: "Vikram Mehta",
    passportNumber: "Z4481920",
    nationality: "Indian",
    country: "Australia 🇦🇺",
    visaType: "Subclass 600 Tourist Visa",
    visaCategory: "Tourist",
    paidBy: "Applicant",
    pricing: {
      consularFee: 12500,
      serviceFee: 2500,
      expressSurcharge: 2000,
      taxableBase: 15000,
      cgst: 1350,
      sgst: 1350,
      igst: 0,
      totalTax: 2700,
      discount: 1000,
      netAmount: 16700
    },
    paymentMethod: "Credit Card (MasterCard)",
    paymentGateway: "Stripe",
    paymentRef: "PAY-STP-33445566",
    status: "Successful",
    gstin: "27BBBBB1111B1Z2",
    billingAddress: "45, Residency Road, Bengaluru - 560025",
    sacCode: "998311",
    createdAt: "2026-08-01T11:45:00.000Z"
  },
  {
    id: "tx-0814",
    transactionId: "PAY-2026-0814",
    invoiceNo: "PRO-2026-0814",
    applicationId: "VO-2026-0814",
    applicantName: "Amitabh Patel",
    passportNumber: "P8812301",
    nationality: "Indian",
    country: "United Kingdom 🇬🇧",
    visaType: "Standard Visitor 6 Months",
    visaCategory: "Tourist",
    paidBy: "Applicant",
    pricing: {
      consularFee: 11000,
      serviceFee: 2500,
      expressSurcharge: 0,
      taxableBase: 13500,
      cgst: 1215,
      sgst: 1215,
      igst: 0,
      totalTax: 2430,
      discount: 500,
      netAmount: 15430
    },
    paymentMethod: "Net Banking (HDFC)",
    paymentGateway: "HDFC Netbanking",
    paymentRef: "NETB-391827-UK",
    status: "Pending",
    gstin: "27AAACG1234H1Z5",
    billingAddress: "12, Marine Drive, Mumbai - 400020",
    sacCode: "998311",
    createdAt: "2026-07-25T14:10:00.000Z"
  },
  {
    id: "tx-0720",
    transactionId: "PAY-2026-0720",
    invoiceNo: "PRO-2026-0720",
    applicationId: "VO-2026-0720",
    applicantName: "Priya Sundaram",
    passportNumber: "K9928172",
    nationality: "Indian",
    country: "United States 🇺🇸",
    visaType: "B1/B2 Tourist Visitor",
    visaCategory: "Tourist",
    paidBy: "Applicant",
    pricing: {
      consularFee: 15000,
      serviceFee: 2500,
      expressSurcharge: 0,
      taxableBase: 17500,
      cgst: 1575,
      sgst: 1575,
      igst: 0,
      totalTax: 3150,
      discount: 0,
      netAmount: 20650
    },
    paymentMethod: "Awaiting Checkout",
    paymentGateway: "Razorpay",
    paymentRef: "UNPAID",
    status: "Proforma",
    gstin: "27AAACG1234H1Z5",
    billingAddress: "88, T. Nagar, Chennai - 600017",
    sacCode: "998311",
    createdAt: "2026-07-15T11:00:00.000Z"
  },
  {
    id: "tx-0650",
    transactionId: "PAY-2026-0650",
    invoiceNo: "RFD-2026-0650",
    applicationId: "VO-2026-0650",
    applicantName: "Vikram Malhotra",
    passportNumber: "S8817263",
    nationality: "Indian",
    country: "Canada 🇨🇦",
    visaType: "Visitor Visa V-1",
    visaCategory: "Tourist",
    paidBy: "Applicant",
    pricing: {
      consularFee: 13000,
      serviceFee: 2500,
      expressSurcharge: 0,
      taxableBase: 15500,
      cgst: 1395,
      sgst: 1395,
      igst: 0,
      totalTax: 2790,
      discount: 0,
      netAmount: 18290
    },
    paymentMethod: "Wallet Balance (Prepaid)",
    paymentGateway: "Prepaid Wallet",
    paymentRef: "WLT-RFD-55102",
    status: "Refunded",
    gstin: "27AAACG1234H1Z5",
    billingAddress: "104, Park Street, New Delhi - 110001",
    sacCode: "998311",
    refundDetails: {
      status: "Refunded",
      amount: 18290,
      date: "2026-07-01",
      refNo: "RFD-55102",
      reason: "Refusal Clause 4.1 Platform Refund Guarantee"
    },
    createdAt: "2026-07-01T09:45:00.000Z"
  }
];

export async function fetchUnifiedTransactions(): Promise<UnifiedTransactionRecord[]> {
  try {
    const res = await fetch(`${API_V1_URL}/finance/transactions`);
    const json = await res.json();
    if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
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
          consularFee: 12500,
          serviceFee: 2500,
          expressSurcharge: 2000,
          taxableBase: 15000,
          cgst: 1350,
          sgst: 1350,
          igst: 0,
          totalTax: 2700,
          discount: 1000,
          netAmount: 16700
        },
        paymentMethod: item.paymentMethod || "UPI",
        paymentGateway: item.paymentGateway || "Razorpay",
        paymentRef: item.paymentRef || "RAZOR-9817264-AU",
        status: item.status || "Successful",
        gstin: item.gstin || "27AAACG1234H1Z5",
        billingAddress: item.billingAddress || "104, Park Street, New Delhi - 110001",
        sacCode: item.sacCode || "998311",
        refundDetails: item.refundDetails,
        createdAt: item.createdAt || new Date().toISOString()
      }));
    }
  } catch (err) {
    console.error("Failed to fetch transactions from backend API:", err);
  }
  return INITIAL_UNIFIED_TRANSACTIONS;
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
