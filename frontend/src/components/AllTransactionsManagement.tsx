import React, { useState } from "react";
import {
  CreditCard,
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
  FileText,
  RotateCcw,
  Wallet
} from "lucide-react";

export interface TransactionRecord {
  id: string;
  txnId: string;
  appId: string;
  applicantName: string;
  passportNumber: string;
  paidBy: "Applicant" | "Agent";
  agentName?: string;
  amount: number;
  paymentMethod: "UPI" | "Credit Card" | "Debit Card" | "Net Banking" | "Wallet" | "Bank Transfer" | "Cash";
  txnDate: string;
  txnDateTime: string;
  status: "Successful" | "Pending" | "Failed" | "Refunded" | "Cancelled";
  country: string;
  visaCategory: "Tourist" | "Business" | "Student" | "Work" | "Medical" | "Transit";
  paymentGateway: "Razorpay" | "Stripe" | "HDFC Netbanking" | "Bank Wire";
  paymentRefNo: string;
  invoiceNo: string;
  breakdown: {
    embassyFee: number;
    vfsFee: number;
    courierCharge: number;
    processingFee: number;
  };
  refundDetails?: {
    status: string;
    amount: number;
    date: string;
    refNo: string;
    reason: string;
  };
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_TRANSACTION_TABS = [
  "Overview",
  "Applicant Details",
  "Payment Details",
  "Invoice",
  "Refund Details",
  "Activity Logs",
  "Notes"
];

export const PAYMENT_WORKFLOW_STEPS = [
  "Application Created",
  "Payment Initiated",
  "Payment Gateway (Successful / Failed)",
  "Receipt Generated / Retry Payment",
  "Application Processing",
  "Visa Approved / Completed"
];

export const SUPPORTED_PAYMENT_METHODS = [
  "UPI",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Bank Transfer",
  "Wallet",
  "Cash / Agent Counter",
  "Payment Gateway (Razorpay/Stripe)"
];

const MOCK_TRANSACTIONS: TransactionRecord[] = [
  {
    id: "1",
    txnId: "TXN-98230101",
    appId: "APP-20261001",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    paidBy: "Applicant",
    amount: 12500,
    paymentMethod: "UPI",
    txnDate: "01 Aug 2026",
    txnDateTime: "01 Aug 2026 10:15 AM",
    status: "Successful",
    country: "Canada",
    visaCategory: "Tourist",
    paymentGateway: "Razorpay",
    paymentRefNo: "PAY_RZP_99881122",
    invoiceNo: "INV-2026-0801",
    breakdown: {
      embassyFee: 8500,
      vfsFee: 2000,
      courierCharge: 500,
      processingFee: 1500
    },
    actionNotes: [
      { id: "n1", author: "System", text: "Instant UPI payment verified by Razorpay webhooks.", date: "01 Aug 2026 10:15 AM" }
    ]
  },
  {
    id: "2",
    txnId: "TXN-98230102",
    appId: "APP-20261002",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    paidBy: "Agent",
    agentName: "Apex Travels",
    amount: 28000,
    paymentMethod: "Credit Card",
    txnDate: "01 Aug 2026",
    txnDateTime: "01 Aug 2026 11:30 AM",
    status: "Pending",
    country: "Australia",
    visaCategory: "Business",
    paymentGateway: "Stripe",
    paymentRefNo: "PAY_STP_33445566",
    invoiceNo: "INV-2026-0802",
    breakdown: {
      embassyFee: 18000,
      vfsFee: 4000,
      courierCharge: 1000,
      processingFee: 5000
    },
    actionNotes: []
  },
  {
    id: "3",
    txnId: "TXN-98230103",
    appId: "APP-20261003",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    paidBy: "Applicant",
    amount: 15800,
    paymentMethod: "Net Banking",
    txnDate: "31 Jul 2026",
    txnDateTime: "31 Jul 2026 04:45 PM",
    status: "Failed",
    country: "UAE",
    visaCategory: "Tourist",
    paymentGateway: "HDFC Netbanking",
    paymentRefNo: "PAY_HDFC_11223344",
    invoiceNo: "INV-2026-0799",
    breakdown: {
      embassyFee: 10000,
      vfsFee: 2500,
      courierCharge: 500,
      processingFee: 2800
    },
    actionNotes: [
      { id: "n3", author: "System", text: "Transaction timed out at bank server.", date: "31 Jul 2026 04:46 PM" }
    ]
  }
];

export default function AllTransactionsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [paidByFilter, setPaidByFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Records State
  const [transactionsList, setTransactionsList] = useState<TransactionRecord[]>(MOCK_TRANSACTIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalTxn, setActiveModalTxn] = useState<TransactionRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredTxns = transactionsList.filter((txn) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      txn.txnId.toLowerCase().includes(q) ||
      txn.appId.toLowerCase().includes(q) ||
      txn.applicantName.toLowerCase().includes(q) ||
      txn.paymentRefNo.toLowerCase().includes(q) ||
      (txn.agentName && txn.agentName.toLowerCase().includes(q));

    const matchesStatus = statusFilter === "All" || txn.status === statusFilter;
    const matchesMethod = methodFilter === "All" || txn.paymentMethod === methodFilter;
    const matchesPaidBy = paidByFilter === "All" || txn.paidBy === paidByFilter;
    const matchesCountry = countryFilter === "All" || txn.country === countryFilter;
    const matchesCategory = categoryFilter === "All" || txn.visaCategory === categoryFilter;

    return matchesQuery && matchesStatus && matchesMethod && matchesPaidBy && matchesCountry && matchesCategory;
  });

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredTxns.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTxns.map((t) => t.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleVerifyPayment = (txn: TransactionRecord) => {
    setTransactionsList((prev) =>
      prev.map((t) => (t.id === txn.id ? { ...t, status: "Successful" } : t))
    );
    triggerToast(`Payment ${txn.txnId} verified successfully!`);
    if (activeModalTxn?.id === txn.id) {
      setActiveModalTxn((prev) => (prev ? { ...prev, status: "Successful" } : null));
    }
  };

  const handleProcessRefund = (txn: TransactionRecord) => {
    setTransactionsList((prev) =>
      prev.map((t) => (t.id === txn.id ? { ...t, status: "Refunded" } : t))
    );
    triggerToast(`Refund processed for ${txn.txnId} (₹${txn.amount.toLocaleString()}).`);
    if (activeModalTxn?.id === txn.id) {
      setActiveModalTxn((prev) => (prev ? { ...prev, status: "Refunded" } : null));
    }
  };

  const handleDeleteRecord = (txn: TransactionRecord) => {
    setTransactionsList((prev) => prev.filter((t) => t.id !== txn.id));
    triggerToast(`Transaction record ${txn.txnId} deleted.`);
    if (activeModalTxn?.id === txn.id) setActiveModalTxn(null);
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
            <CreditCard size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Master Financial Ledger & Payment Gateway Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            All Transactions
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            View, track, and manage all payments, refunds, and invoices across applicants and B2B agents.
          </p>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Transactions</span>
            <div className="text-2xl font-black text-slate-900 font-mono">23,450</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Central Ledger</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Successful Payments</span>
            <div className="text-2xl font-black text-slate-900 font-mono">21,840</div>
            <span className="text-[10px] text-emerald-600 font-bold">Cleared Revenue</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Pending Payments</span>
            <div className="text-2xl font-black text-slate-900 font-mono">824</div>
            <span className="text-[10px] text-amber-600 font-bold">Awaiting Gateway</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Failed Payments</span>
            <div className="text-2xl font-black text-slate-900 font-mono">580</div>
            <span className="text-[10px] text-red-600 font-bold">Gateway Timeouts</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Refunded Payments</span>
            <div className="text-2xl font-black text-slate-900 font-mono">206</div>
            <span className="text-[10px] text-purple-600 font-bold">Processed Payouts</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Today's Revenue</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹18,74,500</div>
            <span className="text-[10px] text-blue-600 font-bold">Daily Collection</span>
          </div>
        </div>

        {/* RIGHT CARD: WORKFLOW & PAYMENT METHODS CATALOG (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Payment Workflow
            </h3>

            {/* PAYMENT WORKFLOW FLOW */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {PAYMENT_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-[9px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* SUPPORTED PAYMENT METHODS */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-900 font-bold block mb-1">Supported Payment Methods:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                {SUPPORTED_PAYMENT_METHODS.map((method, i) => (
                  <div key={i} className="flex items-center gap-1 text-slate-700">
                    <Check size={11} className="text-[#2563EB]" /> {method}
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Ledger Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredTxns.length} of {transactionsList.length} Transactions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (Txn ID, App ID, Applicant, Ref)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="TXN-98230101, APP-20261001..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* PAYMENT STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Payment Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Successful">Successful</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
              <option value="Cancelled">Cancelled</option>
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
              <option value="Wallet">Wallet</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {/* PAID BY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Paid By
            </label>
            <select
              value={paidByFilter}
              onChange={(e) => setPaidByFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Payers</option>
              <option value="Applicant">Applicant (Direct)</option>
              <option value="Agent">Agent (B2B Wallet)</option>
            </select>
          </div>

          {/* COUNTRY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Country
            </label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Countries</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="UAE">UAE</option>
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
              <option value="Work">Work</option>
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
            <span>Transactions Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => triggerToast(`Downloading receipts for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Receipt size={14} /> Download Receipts
            </button>
            <button
              onClick={() => triggerToast(`Exporting financial report for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Reports
            </button>
          </div>
        </div>
      )}

      {/* TRANSACTIONS TABLE (COLUMNS MATCH WIREFRAME EXACTLY) */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredTxns.length && filteredTxns.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-mono">Transaction ID</th>
                <th className="py-3.5 px-4 font-mono">Application ID</th>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Paid By</th>
                <th className="py-3.5 px-4 font-mono">Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4 font-mono">Transaction Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <CreditCard size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No transactions found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredTxns.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(t.id)}
                        onChange={() => handleToggleSelect(t.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {t.txnId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {t.appId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {t.applicantName}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {t.paidBy}
                      {t.agentName && <span className="block text-[10px] text-slate-400 font-normal">({t.agentName})</span>}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">
                      ₹{t.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {t.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {t.txnDate}
                    </td>
                    <td className="py-3.5 px-4">
                      {t.status === "Successful" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          🟢 Successful
                        </span>
                      ) : t.status === "Pending" ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-200">
                          🟡 Pending
                        </span>
                      ) : t.status === "Failed" ? (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                          🔴 Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-purple-200">
                          🔵 Refunded
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveModalTxn(t);
                            setModalTab("Overview");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Transaction Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Downloading receipt for ${t.txnId}...`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Download Receipt"
                        >
                          <Receipt size={15} />
                        </button>
                        <button
                          onClick={() => handleVerifyPayment(t)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Verify Payment"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(t)}
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
          <div>Showing 1–10 of 23,450 Transactions</div>
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

      {/* CENTERED POPUP DETAILS MODAL (7 RECOMMENDED TABS FROM WIREFRAME) */}
      {activeModalTxn && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <CreditCard size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      Transaction {activeModalTxn.txnId}
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
                      ₹{activeModalTxn.amount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">App ID: <strong className="text-blue-300">{activeModalTxn.appId}</strong> &bull; Applicant: {activeModalTxn.applicantName} ({activeModalTxn.passportNumber})</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalTxn(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {RECOMMENDED_TRANSACTION_TABS.map((tab) => {
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
                  {/* SUMMARY TILES */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">
                      Payment & Gateway Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Transaction ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalTxn.txnId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Gateway & Ref</span>
                        <strong className="text-slate-900 font-bold">{activeModalTxn.paymentGateway} ({activeModalTxn.paymentRefNo})</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Invoice Number</span>
                        <strong className="text-purple-700 font-mono font-bold">{activeModalTxn.invoiceNo}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Payment Status</span>
                        <strong className="text-emerald-700 font-bold">{activeModalTxn.status}</strong>
                      </div>
                    </div>
                  </div>

                  {/* SERVICE BREAKDOWN CARD */}
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <Receipt size={16} className="text-[#2563EB]" /> Service Fee Breakdown
                    </h4>
                    <div className="space-y-2 text-xs font-medium text-slate-700">
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>Embassy Service Fee</span>
                        <span className="font-mono font-bold">₹{activeModalTxn.breakdown.embassyFee.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>VFS / Service Center Fee</span>
                        <span className="font-mono font-bold">₹{activeModalTxn.breakdown.vfsFee.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>Courier & Doorstep Logistics</span>
                        <span className="font-mono font-bold">₹{activeModalTxn.breakdown.courierCharge.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>Portal Processing & Convenience Fee</span>
                        <span className="font-mono font-bold">₹{activeModalTxn.breakdown.processingFee.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 text-sm font-extrabold text-slate-900">
                        <span>Total Paid Amount</span>
                        <span className="font-mono text-[#2563EB]">₹{activeModalTxn.amount.toLocaleString()}</span>
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
                  onClick={() => triggerToast(`Downloading receipt for ${activeModalTxn.txnId}...`)}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Receipt size={15} /> Download Receipt
                </button>
                <button
                  onClick={() => handleVerifyPayment(activeModalTxn)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> Verify Payment
                </button>
              </div>

              <button
                onClick={() => handleProcessRefund(activeModalTxn)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw size={14} /> Process Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
