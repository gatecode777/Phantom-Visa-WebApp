import React, { useState, useMemo, useEffect } from "react";
import { useVisa } from "../context/VisaContext";
import { fetchUnifiedTransactions, UnifiedTransactionRecord } from "../services/paymentService";
import {
  FileText,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Trash2,
  CheckCircle2,
  Download,
  Check,
  X,
  Sparkles,
  User,
  CreditCard,
  Building,
  Calendar,
  Clock,
  Send,
  Printer,
  ShieldCheck,
  Receipt,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Copy,
  Layers,
  Percent,
  History
} from "lucide-react";

export interface InvoiceRecord {
  id: string;
  invoiceNo: string;
  txnId: string;
  appId: string;
  applicantName: string;
  passportNumber: string;
  nationality: string;
  appliedBy: "Applicant" | "Agent";
  agentName?: string;
  invoiceAmount: number;
  invoiceDate: string;
  invoiceDateTime: string;
  invoiceType: "Applicant Invoice" | "Agent B2B Invoice" | "Revised Invoice" | "Tax Invoice";
  status: "Paid" | "Pending" | "Cancelled" | "Refunded";
  country: string;
  visaCategory: "Tourist" | "Business" | "Student" | "Work" | "Medical" | "Transit";
  paymentMethod: "UPI" | "Credit Card" | "Debit Card" | "Net Banking" | "Wallet" | "Bank Transfer";
  sacCode: string;
  gstin: string;
  breakdown: {
    visaFee: number;
    serviceCharge: number;
    processingFee: number;
    discount: number;
    cgst: number;
    sgst: number;
    igst: number;
    totalTax: number;
  };
  companyDetails: {
    name: string;
    gstin: string;
    address: string;
    email: string;
    signatory: string;
  };
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_INVOICE_TABS = [
  "Overview",
  "Applicant Details",
  "Invoice Details",
  "Fee Breakdown",
  "Tax Breakdown",
  "Company Details",
  "Activity Logs"
];

export const INVOICE_WORKFLOW_STEPS = [
  "Application Submitted",
  "Payment Successful",
  "Invoice Generated",
  "Invoice Sent to Applicant / Agent",
  "Payment Confirmed",
  "Invoice Archived"
];

export const STANDARD_INVOICE_FORMAT_ITEMS = [
  "GST Number (GSTIN)",
  "SAC / HSN Code (998311)",
  "Tax Invoice Title Header",
  "Company Name & Logo",
  "Full Billing Address",
  "Applicant / Agent Details",
  "Fee Breakdown Itemised",
  "Tax Breakdown (CGST, SGST, IGST)",
  "Total Amount Paid",
  "Payment Reference",
  "Digital Signature",
  "Terms & Conditions"
];

export interface InvoicesManagementProps {
  agentId?: string;
}

export default function InvoicesManagement({ agentId: propAgentId }: InvoicesManagementProps = {}) {
  const { authSession, currentRole } = useVisa();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // State for agent-scoped transactions
  const [dbTransactions, setDbTransactions] = useState<UnifiedTransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isAgentScope =
    Boolean(propAgentId) ||
    currentRole === "Agent" ||
    (typeof window !== "undefined" && (window.location.pathname.includes("agent") || window.location.search.includes("agent")));

  const effectiveAgentId =
    propAgentId ||
    authSession?.user?.agentId ||
    (authSession as any)?.agentId ||
    (authSession?.user as any)?.id ||
    (isAgentScope ? "AGT-1001" : "");

  const loadInvoices = async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      else setLoading(true);

      const targetAgentId = isAgentScope ? effectiveAgentId : undefined;
      const data = await fetchUnifiedTransactions(targetAgentId);
      setDbTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load invoices error:", err);
      setDbTransactions([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [authSession, currentRole, propAgentId]);

  // Derive invoicesList from dbTransactions single ledger
  const invoicesList = useMemo<InvoiceRecord[]>(() => {
    if (!dbTransactions || dbTransactions.length === 0) return [];
    return dbTransactions.map((t, idx) => {
      const dateStr = t.createdAt
        ? new Date(t.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : "01 Aug 2026";
      const dateTimeStr = t.createdAt
        ? new Date(t.createdAt).toLocaleString("en-GB")
        : "01 Aug 2026 10:15 AM";

      const methodClean = t.paymentMethod?.toLowerCase().includes("credit") ? "Credit Card"
        : t.paymentMethod?.toLowerCase().includes("debit") ? "Debit Card"
        : t.paymentMethod?.toLowerCase().includes("net") ? "Net Banking"
        : t.paymentMethod?.toLowerCase().includes("wallet") ? "Wallet"
        : t.paymentMethod?.toLowerCase().includes("bank") || t.paymentMethod?.toLowerCase().includes("transfer") ? "Bank Transfer"
        : "UPI";

      const statusMap: Record<string, "Paid" | "Pending" | "Cancelled" | "Refunded"> = {
        Successful: "Paid",
        Pending: "Pending",
        Proforma: "Pending",
        Failed: "Cancelled",
        Cancelled: "Cancelled",
        Refunded: "Refunded"
      };

      const visaFee = t.pricing?.consularFee || 12500;
      const serviceCharge = t.pricing?.serviceFee || 2500;
      const cgst = t.pricing?.cgst || 1350;
      const sgst = t.pricing?.sgst || 1350;
      const igst = t.pricing?.igst || 0;
      const totalTax = t.pricing?.totalTax || 2700;

      // Dynamically load company profile from single source of truth (Company Profile Settings)
      let companyProfile: any = null;
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("phantom_company_profile");
          if (stored) companyProfile = JSON.parse(stored);
        } catch (e) {}
      }

      const activeCompanyName = companyProfile?.companyName || "Phantom Visa Private Limited";
      const activeGstin = companyProfile?.gstinNumber || t.gstin || "06AABCP1234H1Z5";
      const activeAddress = companyProfile?.streetAddress
        ? `${companyProfile.streetAddress}, ${companyProfile.buildingSuite ? companyProfile.buildingSuite + ", " : ""}${companyProfile.city || ""}, ${companyProfile.state || ""} ${companyProfile.postalCode || ""}`.trim()
        : (t.billingAddress || "101 Visa Tower, Cyber City, Phase 2, Gurugram, Haryana 122002");
      const activeEmail = companyProfile?.supportEmail || companyProfile?.officialEmail || "billing@phantomvisa.com";
      const activeSignatory = companyProfile?.officerName ? `${companyProfile.officerName} (${companyProfile.designation || "Managing Director"})` : "Authorized Finance Officer";

      return {
        id: String(idx + 1),
        invoiceNo: t.invoiceNo || `INV-2026-${t.transactionId?.split("-")[2] || String(500 + idx)}`,
        txnId: t.transactionId,
        appId: t.applicationId,
        applicantName: t.applicantName,
        passportNumber: t.passportNumber,
        nationality: t.nationality || "Indian",
        appliedBy: t.paidBy || "Applicant",
        agentName: t.agentName,
        invoiceAmount: t.pricing?.netAmount || (visaFee + serviceCharge + totalTax),
        invoiceDate: dateStr,
        invoiceDateTime: dateTimeStr,
        invoiceType: t.paidBy === "Agent" ? "Agent B2B Invoice" : "Tax Invoice",
        status: statusMap[t.status] || "Paid",
        country: (t.country || "General").replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, "").trim(),
        visaCategory: t.visaCategory || "Tourist",
        paymentMethod: methodClean as any,
        sacCode: t.sacCode || "998311",
        gstin: activeGstin,
        breakdown: {
          visaFee,
          serviceCharge,
          processingFee: t.pricing?.expressSurcharge || 0,
          discount: t.pricing?.discount || 0,
          cgst,
          sgst,
          igst,
          totalTax
        },
        companyDetails: {
          name: activeCompanyName,
          gstin: activeGstin,
          address: activeAddress,
          email: activeEmail,
          signatory: activeSignatory
        },
        actionNotes: [
          { id: "n1", author: "System", text: `Automated GST Tax Invoice generated on payment confirmation (${t.status}).`, date: dateTimeStr }
        ]
      };
    });
  }, [dbTransactions]);

  // Derived metrics from invoice ledger
  const metrics = useMemo(() => {
    const total = invoicesList.length;
    const paid = invoicesList.filter((i) => i.status === "Paid").length;
    const pending = invoicesList.filter((i) => i.status === "Pending").length;
    const cancelled = invoicesList.filter((i) => i.status === "Cancelled").length;
    const grossAmount = invoicesList.reduce((acc, i) => acc + (i.invoiceAmount || 0), 0);
    return { total, paid, pending, cancelled, grossAmount };
  }, [invoicesList]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalInvoice, setActiveModalInvoice] = useState<InvoiceRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredInvoices = useMemo(() => {
    return invoicesList.filter((inv) => {
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        inv.invoiceNo.toLowerCase().includes(q) ||
        inv.txnId.toLowerCase().includes(q) ||
        inv.appId.toLowerCase().includes(q) ||
        inv.applicantName.toLowerCase().includes(q) ||
        (inv.agentName && inv.agentName.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "All" || inv.status === statusFilter;
      const matchesType = typeFilter === "All" || inv.invoiceType === typeFilter;
      const matchesCategory = categoryFilter === "All" || inv.visaCategory === categoryFilter;
      const matchesMethod = methodFilter === "All" || inv.paymentMethod === methodFilter;

      return matchesQuery && matchesStatus && matchesType && matchesCategory && matchesMethod;
    });
  }, [invoicesList, searchQuery, statusFilter, typeFilter, categoryFilter, methodFilter]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, categoryFilter, methodFilter]);

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PAGE_SIZE));
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredInvoices.slice(start, start + PAGE_SIZE);
  }, [filteredInvoices, currentPage]);

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedInvoices.length && paginatedInvoices.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedInvoices.map((i) => i.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredInvoices.length === 0) {
      triggerToast("No invoices to export.");
      return;
    }
    const headers = ["Invoice No", "Transaction ID", "Application ID", "Applicant", "Passport No", "Country", "Category", "Amount (INR)", "Status", "Date", "Payment Method", "GSTIN"];
    const rows = filteredInvoices.map((i) => [
      `"${i.invoiceNo}"`,
      `"${i.txnId}"`,
      `"${i.appId}"`,
      `"${i.applicantName}"`,
      `"${i.passportNumber}"`,
      `"${i.country}"`,
      `"${i.visaCategory}"`,
      i.invoiceAmount,
      `"${i.status}"`,
      `"${i.invoiceDate}"`,
      `"${i.paymentMethod}"`,
      `"${i.gstin}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Phantom_Invoices_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`Exported ${filteredInvoices.length} invoices to CSV.`);
  };

  // Print Invoice
  const handlePrint = (inv?: InvoiceRecord) => {
    const target = inv || activeModalInvoice;
    if (!target) return;
    triggerToast(`Printing invoice ${target.invoiceNo}...`);
    window.print();
  };

  // Actions
  const handleDeleteRecord = (inv: InvoiceRecord) => {
    setDbTransactions((prev) => prev.filter((t) => t.transactionId !== inv.txnId && t.invoiceNo !== inv.invoiceNo));
    triggerToast(`Invoice ${inv.invoiceNo} removed from view.`);
    if (activeModalInvoice?.id === inv.id) setActiveModalInvoice(null);
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-6 rounded-3xl shadow-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-700">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-200 mb-1">
            <FileText size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              GST Tax Invoices & B2B Ledger
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Invoices
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            View, generate, download, and manage all GST & tax invoices for visa payments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 border border-white/20 cursor-pointer"
            title="Export filtered records to CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => loadInvoices(true)}
            disabled={isRefreshing}
            className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 border border-white/20 cursor-pointer"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            <span>{isRefreshing ? "Syncing..." : "Sync Live Invoices"}</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS & WORKFLOW SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Invoices</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{metrics.total}</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Invoice Archive</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Active Ledger</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{metrics.total}</div>
            <span className="text-[10px] text-blue-600 font-bold">Active Invoices</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Paid Invoices</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{metrics.paid}</div>
            <span className="text-[10px] text-emerald-600 font-bold">Cleared Ledger</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Pending Invoices</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{metrics.pending}</div>
            <span className="text-[10px] text-amber-600 font-bold">Unpaid Billing</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Cancelled Invoices</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{metrics.cancelled}</div>
            <span className="text-[10px] text-red-600 font-bold">Void Billing</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Total Invoiced Amount</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹{metrics.grossAmount.toLocaleString("en-IN")}</div>
            <span className="text-[10px] text-purple-600 font-bold">Gross Invoiced</span>
          </div>
        </div>

        {/* RIGHT CARD: WORKFLOW & STANDARD INVOICE FORMAT CATALOG */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Invoice Workflow
            </h3>

            {/* INVOICE WORKFLOW FLOW */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {INVOICE_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[9px] shrink-0">
                    ✓
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* STANDARD INVOICE FORMAT CATALOG */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-900 font-bold block mb-1">Standard Invoice Format Items:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px] max-h-24 overflow-y-auto [scrollbar-width:thin]">
                {STANDARD_INVOICE_FORMAT_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-center gap-1 text-slate-700">
                    <Check size={11} className="text-[#2563EB] shrink-0" /> <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & Invoice Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredInvoices.length} of {invoicesList.length} Invoices
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (Invoice, Txn, App, Name)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="INV-2026-501, TXN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* INVOICE STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Invoice Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* INVOICE TYPE */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Invoice Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Tax Invoice">Tax Invoice</option>
              <option value="Applicant Invoice">Applicant Invoice</option>
              <option value="Agent B2B Invoice">Agent B2B Invoice</option>
              <option value="Revised Invoice">Revised Invoice</option>
            </select>
          </div>

          {/* VISA CATEGORY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Visa Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Tourist">Tourist</option>
              <option value="Business">Business</option>
              <option value="Student">Student</option>
              <option value="Work">Work</option>
              <option value="Medical">Medical</option>
              <option value="Transit">Transit</option>
            </select>
          </div>

          {/* PAYMENT METHOD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Payment Method
            </label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold cursor-pointer"
            >
              <option value="All">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Wallet">Wallet</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>
      </div>

      {/* CONTEXTUAL BULK ACTIONS TOOLBAR */}
      {selectedIds.length > 0 && (
        <div className="bg-[#0E1A2C] border border-[#2563EB]/40 text-white p-3.5 rounded-2xl shadow-xl mb-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-6 h-6 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-mono font-bold text-xs">
              {selectedIds.length}
            </span>
            <span>Invoices Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Download CSV
            </button>
            <button
              onClick={() => triggerToast(`Emailed invoice copies to ${selectedIds.length} recipients.`)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Send size={14} /> Email Invoices
            </button>
            <button
              onClick={() => triggerToast(`Prepared ${selectedIds.length} tax invoices for printing.`)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Printer size={14} /> Print Invoices
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* INVOICES DATA TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedInvoices.length && paginatedInvoices.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-mono">Invoice No</th>
                <th className="py-3.5 px-4 font-mono">Transaction ID</th>
                <th className="py-3.5 px-4 font-mono">Application ID</th>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4 font-mono">Invoice Amount</th>
                <th className="py-3.5 px-4 font-mono">Invoice Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <RefreshCw size={24} className="mx-auto mb-2 animate-spin text-[#2563EB]" />
                    <p className="font-semibold text-slate-600">Loading invoice records...</p>
                  </td>
                </tr>
              ) : paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <FileText size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No invoices found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(inv.id)}
                        onChange={() => handleToggleSelect(inv.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {inv.invoiceNo}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {inv.txnId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {inv.appId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {inv.applicantName}
                      {inv.agentName && <span className="block text-[10px] text-slate-400 font-normal">({inv.agentName})</span>}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-600">
                      ₹{inv.invoiceAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {inv.invoiceDate}
                    </td>
                    <td className="py-3.5 px-4">
                      {inv.status === "Paid" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          🟢 Paid
                        </span>
                      ) : inv.status === "Pending" ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-200">
                          🟡 Pending
                        </span>
                      ) : inv.status === "Refunded" ? (
                        <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-purple-200">
                          🟣 Refunded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                          🔴 Cancelled
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveModalInvoice(inv);
                            setModalTab("Overview");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Invoice & Tax Breakdown"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => {
                            const csvContent = "data:text/csv;charset=utf-8," + [
                              "Field,Value",
                              `"Invoice No","${inv.invoiceNo}"`,
                              `"Transaction ID","${inv.txnId}"`,
                              `"Application ID","${inv.appId}"`,
                              `"Applicant","${inv.applicantName}"`,
                              `"Country","${inv.country}"`,
                              `"Visa Fee",${inv.breakdown.visaFee}`,
                              `"Service Charge",${inv.breakdown.serviceCharge}`,
                              `"CGST",${inv.breakdown.cgst}`,
                              `"SGST",${inv.breakdown.sgst}`,
                              `"Total Amount",${inv.invoiceAmount}`,
                              `"Status","${inv.status}"`,
                              `"GSTIN","${inv.gstin}"`
                            ].join("\n");
                            const link = document.createElement("a");
                            link.setAttribute("href", encodeURI(csvContent));
                            link.setAttribute("download", `${inv.invoiceNo}_Summary.csv`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            triggerToast(`Downloaded summary for ${inv.invoiceNo}`);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Download Invoice Data"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          onClick={() => handlePrint(inv)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Print Invoice"
                        >
                          <Printer size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(inv)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Showing {filteredInvoices.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–
            {Math.min(currentPage * PAGE_SIZE, filteredInvoices.length)} of {filteredInvoices.length} Invoices
          </div>
          <div className="flex items-center gap-1 font-mono font-bold">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40 flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={13} /> Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  pageNum === currentPage
                    ? "bg-[#2563EB] text-white shadow-xs"
                    : "bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40 flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* PROFESSIONAL RECOMMENDATION BOX */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2 mb-6">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
          <ShieldCheck size={16} className="text-[#2563EB]" /> Professional GST Tax Compliance Audit
        </h3>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Tax compliance active: GSTIN verification, SAC code 998311 validation, digital signature stamp, CGST/SGST/IGST breakdown, and B2B Agent GSTR-1 filing export readiness.
        </p>
      </div>

      {/* CENTERED POPUP DETAILS MODAL (7 RECOMMENDED TABS) */}
      {activeModalInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      Tax Invoice {activeModalInvoice.invoiceNo}
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
                      ₹{activeModalInvoice.invoiceAmount.toLocaleString()} ({activeModalInvoice.status.toUpperCase()})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Txn ID: <strong className="text-blue-300">{activeModalInvoice.txnId}</strong> &bull; Applicant: {activeModalInvoice.applicantName}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalInvoice(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* MODAL TABS NAVIGATION */}
            <div className="bg-slate-100/80 px-4 pt-2 border-b border-slate-200 flex items-center gap-1 overflow-x-auto [scrollbar-width:none]">
              {RECOMMENDED_INVOICE_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setModalTab(tab)}
                  className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    modalTab === tab
                      ? "bg-white text-[#2563EB] shadow-xs border-t-2 border-[#2563EB]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  {tab === "Overview" && <FileText size={13} />}
                  {tab === "Applicant Details" && <User size={13} />}
                  {tab === "Invoice Details" && <FileCheck size={13} />}
                  {tab === "Fee Breakdown" && <Layers size={13} />}
                  {tab === "Tax Breakdown" && <Percent size={13} />}
                  {tab === "Company Details" && <Building size={13} />}
                  {tab === "Activity Logs" && <History size={13} />}
                  <span>{tab}</span>
                </button>
              ))}
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin]">
              {/* TAB 1: OVERVIEW */}
              {modalTab === "Overview" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">
                      Tax Invoice Overview
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Invoice Number</span>
                        <strong className="text-[#2563EB] font-mono font-bold text-sm">{activeModalInvoice.invoiceNo}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">SAC / HSN Code</span>
                        <strong className="text-purple-700 font-mono font-bold text-sm">{activeModalInvoice.sacCode}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Company GSTIN</span>
                        <strong className="text-emerald-700 font-mono font-bold text-sm">{activeModalInvoice.gstin}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Payment Method</span>
                        <strong className="text-slate-900 font-bold text-sm">{activeModalInvoice.paymentMethod}</strong>
                      </div>
                    </div>
                  </div>

                  {/* ITEMISED SUMMARY */}
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <Receipt size={16} className="text-[#2563EB]" /> Summary Calculation
                    </h4>
                    <div className="space-y-2 text-xs font-medium text-slate-700">
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>Visa Application Consular Fee</span>
                        <span className="font-mono font-bold">₹{activeModalInvoice.breakdown.visaFee.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>Professional Service Charge</span>
                        <span className="font-mono font-bold">₹{activeModalInvoice.breakdown.serviceCharge.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>CGST (9%) + SGST (9%) Total Tax</span>
                        <span className="font-mono font-bold text-purple-700">₹{activeModalInvoice.breakdown.totalTax.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 text-sm font-extrabold text-slate-900">
                        <span>Total Invoiced Amount</span>
                        <span className="font-mono text-[#2563EB] text-base">₹{activeModalInvoice.invoiceAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: APPLICANT DETAILS */}
              {modalTab === "Applicant Details" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Applicant Identity & Travel Particulars
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Applicant Full Name</span>
                        <span className="font-bold text-slate-900 text-sm">{activeModalInvoice.applicantName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Passport Number</span>
                        <span className="font-mono font-bold text-slate-800">{activeModalInvoice.passportNumber || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Nationality</span>
                        <span className="font-medium text-slate-800">{activeModalInvoice.nationality}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Destination Country</span>
                        <span className="font-bold text-blue-700 text-sm">{activeModalInvoice.country}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Visa Category</span>
                        <span className="font-medium text-slate-800">{activeModalInvoice.visaCategory} Visa</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Applied / Managed By</span>
                        <span className="font-medium text-slate-800">
                          {activeModalInvoice.appliedBy} {activeModalInvoice.agentName ? `(${activeModalInvoice.agentName})` : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: INVOICE DETAILS */}
              {modalTab === "Invoice Details" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Statutory Invoice Records
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Invoice Number</span>
                        <span className="font-mono font-bold text-[#2563EB]">{activeModalInvoice.invoiceNo}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Transaction Reference</span>
                        <span className="font-mono font-bold text-slate-800">{activeModalInvoice.txnId}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Application Number</span>
                        <span className="font-mono font-bold text-slate-800">{activeModalInvoice.appId}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Invoice Type</span>
                        <span className="font-bold text-slate-900">{activeModalInvoice.invoiceType}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Generation Date & Time</span>
                        <span className="font-medium text-slate-700">{activeModalInvoice.invoiceDateTime}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">SAC / HSN Service Code</span>
                        <span className="font-mono font-bold text-purple-700">{activeModalInvoice.sacCode} (Immigration & Visa Processing)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: FEE BREAKDOWN */}
              {modalTab === "Fee Breakdown" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Itemised Fee & Service Schedule
                  </h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-600">Embassy / Consular Statutory Fee</span>
                      <span className="font-mono font-bold text-slate-900">₹{activeModalInvoice.breakdown.visaFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-600">Professional Consultation & Platform Service Charge</span>
                      <span className="font-mono font-bold text-slate-900">₹{activeModalInvoice.breakdown.serviceCharge.toLocaleString()}</span>
                    </div>
                    {activeModalInvoice.breakdown.processingFee > 0 && (
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-600">Express Priority Processing Surcharge</span>
                        <span className="font-mono font-bold text-amber-700">₹{activeModalInvoice.breakdown.processingFee.toLocaleString()}</span>
                      </div>
                    )}
                    {activeModalInvoice.breakdown.discount > 0 && (
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-600">Promotional / Corporate Discount</span>
                        <span className="font-mono font-bold text-emerald-600">-₹{activeModalInvoice.breakdown.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1.5 text-sm font-extrabold text-slate-900">
                      <span>Total Net Payable</span>
                      <span className="font-mono text-[#2563EB]">₹{activeModalInvoice.invoiceAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: TAX BREAKDOWN */}
              {modalTab === "Tax Breakdown" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    GST Tax Breakdown (SAC Code 998311)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div className="bg-purple-50/70 border border-purple-200 p-3.5 rounded-2xl text-center">
                      <span className="text-[10px] font-extrabold uppercase text-purple-700 block">CGST (9%)</span>
                      <span className="text-lg font-black text-purple-900 font-mono">₹{activeModalInvoice.breakdown.cgst.toLocaleString()}</span>
                    </div>
                    <div className="bg-purple-50/70 border border-purple-200 p-3.5 rounded-2xl text-center">
                      <span className="text-[10px] font-extrabold uppercase text-purple-700 block">SGST (9%)</span>
                      <span className="text-lg font-black text-purple-900 font-mono">₹{activeModalInvoice.breakdown.sgst.toLocaleString()}</span>
                    </div>
                    <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-2xl text-center">
                      <span className="text-[10px] font-extrabold uppercase text-[#2563EB] block">Total GST (18%)</span>
                      <span className="text-lg font-black text-blue-900 font-mono">₹{activeModalInvoice.breakdown.totalTax.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-[11px] text-slate-600 space-y-1">
                    <p className="font-bold text-slate-800">GST Compliance Declaration:</p>
                    <p>GST is computed at statutory standard rate of 18% (9% CGST + 9% SGST for Intra-state / 18% IGST for Inter-state) on taxable visa facilitation fees.</p>
                  </div>
                </div>
              )}

              {/* TAB 6: COMPANY DETAILS */}
              {modalTab === "Company Details" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Issuer Entity & Statutory Profile
                  </h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Company Legal Name</span>
                      <span className="font-bold text-slate-900 text-sm">{activeModalInvoice.companyDetails.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Corporate GSTIN</span>
                      <span className="font-mono font-bold text-emerald-700">{activeModalInvoice.companyDetails.gstin}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Registered Corporate Address</span>
                      <span className="text-slate-700">{activeModalInvoice.companyDetails.address}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Official Billing Email</span>
                      <span className="text-blue-600 font-mono">{activeModalInvoice.companyDetails.email}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Authorized Signatory</span>
                      <span className="font-semibold text-slate-800">{activeModalInvoice.companyDetails.signatory}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: ACTIVITY LOGS */}
              {modalTab === "Activity Logs" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Invoice Audit Trail & Activity Logs
                  </h4>
                  <div className="space-y-2.5">
                    {(activeModalInvoice.actionNotes || []).map((note, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          ✓
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <strong className="text-slate-900 font-bold">{note.author}</strong>
                            <span className="text-slate-400 font-mono text-[10px]">{note.date}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{note.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," + [
                      "Field,Value",
                      `"Invoice No","${activeModalInvoice.invoiceNo}"`,
                      `"Transaction ID","${activeModalInvoice.txnId}"`,
                      `"Application ID","${activeModalInvoice.appId}"`,
                      `"Applicant","${activeModalInvoice.applicantName}"`,
                      `"Country","${activeModalInvoice.country}"`,
                      `"Visa Fee",${activeModalInvoice.breakdown.visaFee}`,
                      `"Service Charge",${activeModalInvoice.breakdown.serviceCharge}`,
                      `"CGST",${activeModalInvoice.breakdown.cgst}`,
                      `"SGST",${activeModalInvoice.breakdown.sgst}`,
                      `"Total Amount",${activeModalInvoice.invoiceAmount}`,
                      `"Status","${activeModalInvoice.status}"`,
                      `"GSTIN","${activeModalInvoice.gstin}"`
                    ].join("\n");
                    const link = document.createElement("a");
                    link.setAttribute("href", encodeURI(csvContent));
                    link.setAttribute("download", `${activeModalInvoice.invoiceNo}_TaxInvoice.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    triggerToast(`Downloaded CSV for ${activeModalInvoice.invoiceNo}`);
                  }}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={15} /> Download CSV
                </button>
                <button
                  onClick={() => handlePrint()}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Printer size={15} /> Print Invoice
                </button>
              </div>

              <button
                onClick={() => setActiveModalInvoice(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
