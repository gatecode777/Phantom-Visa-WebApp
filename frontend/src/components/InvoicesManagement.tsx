import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  PlusCircle,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe,
  Download,
  Check,
  X,
  TrendingUp,
  Sparkles,
  User,
  CreditCard,
  Building,
  Calendar,
  Clock,
  Send,
  Printer,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Tag,
  CheckSquare,
  AlertTriangle,
  Receipt,
  DollarSign,
  BarChart3,
  Copy
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

const MOCK_INVOICES: InvoiceRecord[] = [
  {
    id: "1",
    invoiceNo: "INV-2026-501",
    txnId: "TXN-L80501",
    appId: "APP-20261001",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    nationality: "Indian",
    appliedBy: "Applicant",
    invoiceAmount: 8500,
    invoiceDate: "01 Aug 2026",
    invoiceDateTime: "01 Aug 2026 10:15 AM",
    invoiceType: "Tax Invoice",
    status: "Paid",
    country: "Canada",
    visaCategory: "Tourist",
    paymentMethod: "UPI",
    sacCode: "998311",
    gstin: "07AAAAA0000A1Z5",
    breakdown: {
      visaFee: 5000,
      serviceCharge: 1500,
      processingFee: 1000,
      discount: 0,
      cgst: 500,
      sgst: 500,
      igst: 0,
      totalTax: 1000
    },
    companyDetails: {
      name: "Phantom Visa Services Pvt Ltd",
      gstin: "07AAAAA0000A1Z5",
      address: "Suite 402, Trade Tower, Connaught Place, New Delhi 110001",
      email: "billing@phantomvisa.com",
      signatory: "Authorized Finance Officer"
    },
    actionNotes: [
      { id: "n1", author: "System", text: "Automated GST Tax Invoice generated on payment completion.", date: "01 Aug 2026 10:15 AM" }
    ]
  },
  {
    id: "2",
    invoiceNo: "INV-2026-502",
    txnId: "TXN-L80502",
    appId: "APP-20261002",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    nationality: "Indian",
    appliedBy: "Agent",
    agentName: "Apex Travels",
    invoiceAmount: 12000,
    invoiceDate: "01 Aug 2026",
    invoiceDateTime: "01 Aug 2026 11:45 AM",
    invoiceType: "Agent B2B Invoice",
    status: "Pending",
    country: "Australia",
    visaCategory: "Business",
    paymentMethod: "Credit Card",
    sacCode: "998311",
    gstin: "27BBBBB1111B1Z2",
    breakdown: {
      visaFee: 7500,
      serviceCharge: 2000,
      processingFee: 1500,
      discount: 0,
      cgst: 500,
      sgst: 500,
      igst: 0,
      totalTax: 1000
    },
    companyDetails: {
      name: "Phantom Visa Services Pvt Ltd",
      gstin: "07AAAAA0000A1Z5",
      address: "Suite 402, Trade Tower, Connaught Place, New Delhi 110001",
      email: "billing@phantomvisa.com",
      signatory: "Authorized Finance Officer"
    },
    actionNotes: []
  },
  {
    id: "3",
    invoiceNo: "INV-2026-503",
    txnId: "TXN-L80503",
    appId: "APP-20261003",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    nationality: "Indian",
    appliedBy: "Applicant",
    invoiceAmount: 15500,
    invoiceDate: "01 Aug 2026",
    invoiceDateTime: "01 Aug 2026 01:20 PM",
    invoiceType: "Tax Invoice",
    status: "Cancelled",
    country: "UAE",
    visaCategory: "Tourist",
    paymentMethod: "Net Banking",
    sacCode: "998311",
    gstin: "07AAAAA0000A1Z5",
    breakdown: {
      visaFee: 9500,
      serviceCharge: 2500,
      processingFee: 2000,
      discount: 0,
      cgst: 750,
      sgst: 750,
      igst: 0,
      totalTax: 1500
    },
    companyDetails: {
      name: "Phantom Visa Services Pvt Ltd",
      gstin: "07AAAAA0000A1Z5",
      address: "Suite 402, Trade Tower, Connaught Place, New Delhi 110001",
      email: "billing@phantomvisa.com",
      signatory: "Authorized Finance Officer"
    },
    actionNotes: []
  }
];

export default function InvoicesManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");

  // Records State
  const [invoicesList, setInvoicesList] = useState<InvoiceRecord[]>(MOCK_INVOICES);
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
  const filteredInvoices = invoicesList.filter((inv) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
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

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredInvoices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredInvoices.map((i) => i.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleDeleteRecord = (inv: InvoiceRecord) => {
    setInvoicesList((prev) => prev.filter((i) => i.id !== inv.id));
    triggerToast(`Invoice ${inv.invoiceNo} deleted.`);
    if (activeModalInvoice?.id === inv.id) setActiveModalInvoice(null);
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
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
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Invoices</span>
            <div className="text-2xl font-black text-slate-900 font-mono">22,420</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Invoice Archive</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Generated Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">180</div>
            <span className="text-[10px] text-blue-600 font-bold">Today's Invoices</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Paid Invoices</span>
            <div className="text-2xl font-black text-slate-900 font-mono">21,840</div>
            <span className="text-[10px] text-emerald-600 font-bold">Cleared Ledger</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Pending Invoices</span>
            <div className="text-2xl font-black text-slate-900 font-mono">560</div>
            <span className="text-[10px] text-amber-600 font-bold">Unpaid Billing</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Cancelled Invoices</span>
            <div className="text-2xl font-black text-slate-900 font-mono">20</div>
            <span className="text-[10px] text-red-600 font-bold">Void Billing</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Total Invoiced Amount</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹2,98,45,000</div>
            <span className="text-[10px] text-purple-600 font-bold">Gross Invoiced</span>
          </div>
        </div>

        {/* RIGHT CARD: WORKFLOW & STANDARD INVOICE FORMAT CATALOG (FROM WIREFRAME) */}
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
                    ▼
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
                    <Check size={11} className="text-[#2563EB]" /> {item}
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
              Search (Invoice No, Txn ID, App ID, Applicant)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="INV-2026-501, TXN-L80501..."
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
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
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
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
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
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Categories</option>
              <option value="Tourist">Tourist</option>
              <option value="Business">Business</option>
              <option value="Student">Student</option>
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
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
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
              onClick={() => triggerToast(`Downloading PDF bundle for ${selectedIds.length} invoices.`)}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Download Invoices
            </button>
            <button
              onClick={() => triggerToast(`Emailed invoice copies to ${selectedIds.length} recipients.`)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Send size={14} /> Email Invoices
            </button>
            <button
              onClick={() => triggerToast(`Printing ${selectedIds.length} tax invoices.`)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Printer size={14} /> Print Invoices
            </button>
          </div>
        </div>
      )}

      {/* INVOICES DATA TABLE (COLUMNS MATCH WIREFRAME EXACTLY) */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredInvoices.length && filteredInvoices.length > 0}
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
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <FileText size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No invoices found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
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
                          onClick={() => triggerToast(`Downloading PDF for invoice ${inv.invoiceNo}...`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Download PDF Invoice"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Printing tax invoice ${inv.invoiceNo}...`)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Print Invoice"
                        >
                          <Printer size={15} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Emailed invoice copy to ${inv.applicantName}...`)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Email Invoice"
                        >
                          <Send size={15} />
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
        <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>Showing 1–10 of 22,420 Invoices</div>
          <div className="flex items-center gap-1 font-mono font-bold">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#2563EB] text-white rounded-lg">1</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">2</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">3</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* PROFESSIONAL RECOMMENDATION BOX (FROM WIREFRAME) */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2 mb-6">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
          <ShieldCheck size={16} className="text-[#2563EB]" /> Professional GST Tax Compliance Audit
        </h3>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Tax compliance active: GSTIN verification, SAC code 998311 validation, digital signature stamp, CGST/SGST/IGST breakdown, and B2B Agent GSTR-1 filing export readiness.
        </p>
      </div>

      {/* CENTERED POPUP DETAILS MODAL (7 RECOMMENDED TABS FROM WIREFRAME) */}
      {activeModalInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
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

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {RECOMMENDED_INVOICE_TABS.map((tab) => {
                const active = modalTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setModalTab(tab)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      active
                        ? "bg-[#2563EB] text-white shadow-sm"
                        : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                    }`}
                  >
                    <span>{tab}</span>
                  </button>
                );
              })}
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {/* TAB 1: OVERVIEW */}
              {modalTab === "Overview" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* OVERVIEW TILES */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">
                      Tax Invoice Overview
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Invoice Number</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalInvoice.invoiceNo}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">SAC / HSN Code</span>
                        <strong className="text-purple-700 font-mono font-bold">{activeModalInvoice.sacCode}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Company GSTIN</span>
                        <strong className="text-emerald-700 font-mono font-bold">{activeModalInvoice.gstin}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Invoice Type</span>
                        <strong className="text-slate-900 font-bold">{activeModalInvoice.invoiceType}</strong>
                      </div>
                    </div>
                  </div>

                  {/* ITEMISED TAX & FEE BREAKDOWN TABLE */}
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <Receipt size={16} className="text-[#2563EB]" /> Itemised Tax & Fee Calculation
                    </h4>
                    <div className="space-y-2 text-xs font-medium text-slate-700">
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>Visa Application Fee</span>
                        <span className="font-mono font-bold">₹{activeModalInvoice.breakdown.visaFee.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>Service Charge</span>
                        <span className="font-mono font-bold">₹{activeModalInvoice.breakdown.serviceCharge.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>CGST (9%)</span>
                        <span className="font-mono font-bold">₹{activeModalInvoice.breakdown.cgst.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>SGST (9%)</span>
                        <span className="font-mono font-bold">₹{activeModalInvoice.breakdown.sgst.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 text-sm font-extrabold text-slate-900">
                        <span>Total Invoiced Amount</span>
                        <span className="font-mono text-[#2563EB]">₹{activeModalInvoice.invoiceAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerToast(`Downloading PDF for invoice ${activeModalInvoice.invoiceNo}...`)}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={15} /> Download PDF
                </button>
                <button
                  onClick={() => triggerToast(`Printing invoice ${activeModalInvoice.invoiceNo}...`)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Printer size={15} /> Print Invoice
                </button>
              </div>

              <button
                onClick={() => triggerToast(`Emailed invoice copy to ${activeModalInvoice.applicantName}...`)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Send size={14} /> Email Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
