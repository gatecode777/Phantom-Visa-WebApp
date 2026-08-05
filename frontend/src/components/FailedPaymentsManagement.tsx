import React, { useState } from "react";
import {
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  PlusCircle,
  Trash2,
  CheckCircle2,
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
  FileText,
  RotateCcw,
  BarChart3,
  Link as LinkIcon,
  ShieldAlert
} from "lucide-react";

export interface FailedPaymentRecord {
  id: string;
  txnId: string;
  appId: string;
  applicantName: string;
  passportNumber: string;
  nationality: string;
  paidBy: "Applicant" | "Agent";
  agentName?: string;
  amount: number;
  paymentMethod: "UPI" | "Credit Card" | "Debit Card" | "Net Banking" | "Wallet" | "Bank Transfer";
  failureReason:
    | "Insufficient Balance"
    | "Bank Server Error"
    | "Authentication Failed"
    | "Session Timeout"
    | "User Cancelled"
    | "Card Declined"
    | "Incorrect Details"
    | "Technical Error";
  failedDate: string;
  failedDateTime: string;
  status: "Failed" | "Retry Pending" | "Retry Successful";
  country: string;
  visaCategory: "Tourist" | "Business" | "Student" | "Work" | "Medical" | "Transit";
  paymentGateway: "Razorpay" | "Stripe" | "HDFC Netbanking";
  failureCode: string;
  gatewayErrorMsg: string;
  retryCount: number;
  breakdown: {
    visaFee: number;
    serviceCharge: number;
    processingFee: number;
    taxGst: number;
  };
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_FAILED_PAYMENT_TABS = [
  "Overview",
  "Applicant Details",
  "Payment Details",
  "Failure Details",
  "Retry History",
  "Activity Logs",
  "Action Notes"
];

export const FAILED_PAYMENT_WORKFLOW_STEPS = [
  "Payment Initiated",
  "Payment Gateway (Successful / Failed)",
  "Failure Reason Logged",
  "Applicant Notified",
  "Retry Requested (Successful / Failed Again)"
];

export const COMMON_FAILURE_REASONS = [
  "Insufficient Balance",
  "Bank Server Down / Error",
  "3D Secure / OTP Authentication Failed",
  "Session Timeout",
  "User Cancelled Payment",
  "Card Declined",
  "Incorrect Card Details",
  "OTP Not Entered / Expired",
  "Daily Transaction Limit Exceeded",
  "Technical Error"
];

const MOCK_FAILED_PAYMENTS: FailedPaymentRecord[] = [
  {
    id: "1",
    txnId: "TXN-F98101",
    appId: "APP-20264001",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    nationality: "Indian",
    paidBy: "Applicant",
    amount: 12500,
    paymentMethod: "UPI",
    failureReason: "Insufficient Balance",
    failedDate: "01 Aug 2026",
    failedDateTime: "01 Aug 2026 10:15 AM",
    status: "Failed",
    country: "Canada",
    visaCategory: "Tourist",
    paymentGateway: "Razorpay",
    failureCode: "ERR_UPI_NSF_402",
    gatewayErrorMsg: "Account balance insufficient for transaction amount.",
    retryCount: 1,
    breakdown: {
      visaFee: 8500,
      serviceCharge: 2000,
      processingFee: 1000,
      taxGst: 1000
    },
    actionNotes: [
      { id: "n1", author: "System", text: "Automated retry payment link dispatched via SMS.", date: "01 Aug 2026 10:16 AM" }
    ]
  },
  {
    id: "2",
    txnId: "TXN-F98102",
    appId: "APP-20264002",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    nationality: "Indian",
    paidBy: "Agent",
    agentName: "Apex Travels",
    amount: 28000,
    paymentMethod: "Credit Card",
    failureReason: "Bank Server Error",
    failedDate: "01 Aug 2026",
    failedDateTime: "01 Aug 2026 11:30 AM",
    status: "Retry Pending",
    country: "Australia",
    visaCategory: "Business",
    paymentGateway: "Stripe",
    failureCode: "ERR_BANK_503_TIMEOUT",
    gatewayErrorMsg: "Issuer bank server failed to respond within 30s.",
    retryCount: 2,
    breakdown: {
      visaFee: 18000,
      serviceCharge: 4000,
      processingFee: 3000,
      taxGst: 3000
    },
    actionNotes: []
  },
  {
    id: "3",
    txnId: "TXN-F98103",
    appId: "APP-20264003",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    nationality: "Indian",
    paidBy: "Applicant",
    amount: 15800,
    paymentMethod: "Net Banking",
    failureReason: "Session Timeout",
    failedDate: "01 Aug 2026",
    failedDateTime: "01 Aug 2026 02:10 PM",
    status: "Failed",
    country: "UAE",
    visaCategory: "Tourist",
    paymentGateway: "HDFC Netbanking",
    failureCode: "ERR_SESSION_TIMEOUT_408",
    gatewayErrorMsg: "User idle on bank authentication page for >5 mins.",
    retryCount: 0,
    breakdown: {
      visaFee: 10000,
      serviceCharge: 2500,
      processingFee: 1800,
      taxGst: 1500
    },
    actionNotes: []
  }
];

export default function FailedPaymentsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [reasonFilter, setReasonFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [paidByFilter, setPaidByFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");

  // Records State
  const [failedPayments, setFailedPayments] = useState<FailedPaymentRecord[]>(MOCK_FAILED_PAYMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalPayment, setActiveModalPayment] = useState<FailedPaymentRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredPayments = failedPayments.filter((pay) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      pay.txnId.toLowerCase().includes(q) ||
      pay.appId.toLowerCase().includes(q) ||
      pay.applicantName.toLowerCase().includes(q) ||
      (pay.agentName && pay.agentName.toLowerCase().includes(q));

    const matchesReason = reasonFilter === "All" || pay.failureReason === reasonFilter;
    const matchesMethod = methodFilter === "All" || pay.paymentMethod === methodFilter;
    const matchesPaidBy = paidByFilter === "All" || pay.paidBy === paidByFilter;
    const matchesCategory = categoryFilter === "All" || pay.visaCategory === categoryFilter;
    const matchesCountry = countryFilter === "All" || pay.country === countryFilter;

    return matchesQuery && matchesReason && matchesMethod && matchesPaidBy && matchesCategory && matchesCountry;
  });

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredPayments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPayments.map((p) => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleTriggerRetry = (pay: FailedPaymentRecord) => {
    setFailedPayments((prev) =>
      prev.map((p) => (p.id === pay.id ? { ...p, status: "Retry Pending", retryCount: p.retryCount + 1 } : p))
    );
    triggerToast(`Retry payment link initiated for ${pay.txnId}.`);
    if (activeModalPayment?.id === pay.id) {
      setActiveModalPayment((prev) => (prev ? { ...prev, status: "Retry Pending", retryCount: prev.retryCount + 1 } : null));
    }
  };

  const handleDeleteRecord = (pay: FailedPaymentRecord) => {
    setFailedPayments((prev) => prev.filter((p) => p.id !== pay.id));
    triggerToast(`Failed payment record ${pay.txnId} deleted.`);
    if (activeModalPayment?.id === pay.id) setActiveModalPayment(null);
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
            <XCircle size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Payment Gateway Failure Audit & Recovery
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Failed Payments
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            View and manage all failed payment transactions for visa applications and initiate retry or assistance.
          </p>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Failed</span>
            <div className="text-2xl font-black text-slate-900 font-mono">580</div>
            <span className="text-[10px] text-red-600 font-bold">Failed Log Archive</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Failed Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">22</div>
            <span className="text-[10px] text-red-600 font-bold">Daily Failures</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Gateway Failures</span>
            <div className="text-2xl font-black text-slate-900 font-mono">260</div>
            <span className="text-[10px] text-purple-600 font-bold">Server Error 503/408</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Bank Failures</span>
            <div className="text-2xl font-black text-slate-900 font-mono">180</div>
            <span className="text-[10px] text-amber-600 font-bold">Card & Balance Declines</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-[#2563EB] block mb-1">User Cancelled</span>
            <div className="text-2xl font-black text-slate-900 font-mono">84</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Manual Abandoned</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Retry Successful</span>
            <div className="text-2xl font-black text-slate-900 font-mono">36</div>
            <span className="text-[10px] text-emerald-600 font-bold">Recovered Revenue</span>
          </div>
        </div>

        {/* RIGHT CARD: WORKFLOW & FAILURE REASONS CATALOG (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Payment Failure Workflow
            </h3>

            {/* FAILURE WORKFLOW FLOW */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {FAILED_PAYMENT_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-[9px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* COMMON FAILURE REASONS */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-900 font-bold block mb-1">Common Failure Reasons:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px] max-h-24 overflow-y-auto [scrollbar-width:thin]">
                {COMMON_FAILURE_REASONS.map((reason, i) => (
                  <div key={i} className="flex items-center gap-1 text-slate-700">
                    <Check size={11} className="text-red-600" /> {reason}
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Failure Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredPayments.length} of {failedPayments.length} Failed Payments
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
                placeholder="TXN-F98101, APP-20264001..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* FAILURE REASON */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Failure Reason
            </label>
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Reasons</option>
              <option value="Insufficient Balance">Insufficient Balance</option>
              <option value="Bank Server Error">Bank Server Error</option>
              <option value="Session Timeout">Session Timeout</option>
              <option value="Card Declined">Card Declined</option>
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
        </div>
      </div>

      {/* CONTEXTUAL BULK ACTIONS TOOLBAR */}
      {selectedIds.length > 0 && (
        <div className="bg-[#0E1A2C] border border-[#2563EB]/40 text-white p-3.5 rounded-2xl shadow-xl mb-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-6 h-6 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-mono font-bold text-xs">
              {selectedIds.length}
            </span>
            <span>Failed Payments Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => triggerToast(`Resending payment links for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <LinkIcon size={14} /> Resend Payment Links
            </button>
            <button
              onClick={() => triggerToast(`Sending failure notice emails to ${selectedIds.length} applicants.`)}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Send size={14} /> Send Failure Notices
            </button>
            <button
              onClick={() => triggerToast(`Exporting failure details for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Report
            </button>
          </div>
        </div>
      )}

      {/* FAILED PAYMENTS TABLE (COLUMNS MATCH WIREFRAME EXACTLY) */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredPayments.length && filteredPayments.length > 0}
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
                <th className="py-3.5 px-4">Failure Reason</th>
                <th className="py-3.5 px-4 font-mono">Failed Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <XCircle size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No failed payments found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => handleToggleSelect(p.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {p.txnId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {p.appId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {p.applicantName}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {p.paidBy}
                      {p.agentName && <span className="block text-[10px] text-slate-400 font-normal">({p.agentName})</span>}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-red-600">
                      ₹{p.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {p.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-red-600">
                      {p.failureReason}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {p.failedDate}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.status === "Retry Pending" ? (
                        <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-purple-200">
                          🔄 Retry Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                          🔴 Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveModalPayment(p);
                            setModalTab("Overview");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Failure Details & Error Logs"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleTriggerRetry(p)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition cursor-pointer"
                          title="Retry Payment"
                        >
                          <RotateCcw size={15} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Failure notice emailed to ${p.applicantName}...`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Send Failure Notice"
                        >
                          <Send size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(p)}
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
          <div>Showing 1–10 of 580 Failed Payments</div>
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
      <div className="bg-[#0E1A2C] border border-[#2563EB]/40 text-white rounded-3xl p-5 space-y-2 mb-6">
        <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-slate-800 pb-2">
          <ShieldAlert size={16} className="text-red-400" /> Professional Finance Failure Recovery Strategy
        </h3>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Automated failure recovery features active: Failure Reason classification, Customer notification logs, Retry attempt tracking, Potential revenue recovery analysis, and Instant link generation.
        </p>
      </div>

      {/* CENTERED POPUP DETAILS MODAL (7 RECOMMENDED TABS FROM WIREFRAME) */}
      {activeModalPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center font-bold text-lg text-white">
                  <XCircle size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      Transaction {activeModalPayment.txnId}
                    </h3>
                    <span className="font-mono text-xs font-bold text-red-300 bg-red-900/50 px-2 py-0.5 rounded border border-red-700">
                      ₹{activeModalPayment.amount.toLocaleString()} (FAILED)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">App ID: <strong className="text-blue-300">{activeModalPayment.appId}</strong> &bull; Failure: {activeModalPayment.failureReason}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalPayment(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {RECOMMENDED_FAILED_PAYMENT_TABS.map((tab) => {
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
                      Failure Audit Overview
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Transaction ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalPayment.txnId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Failure Reason</span>
                        <strong className="text-red-600 font-bold">{activeModalPayment.failureReason}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Failure Code</span>
                        <strong className="text-purple-700 font-mono font-bold">{activeModalPayment.failureCode}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Retry Attempts</span>
                        <strong className="text-slate-900 font-mono font-bold">{activeModalPayment.retryCount} times</strong>
                      </div>
                    </div>
                  </div>

                  {/* GATEWAY ERROR DETAILS CARD */}
                  <div className="bg-red-50/60 border border-red-200 rounded-3xl p-5 space-y-2">
                    <h4 className="text-xs font-extrabold text-red-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <AlertTriangle size={16} className="text-red-600" /> Gateway Debug Log Message
                    </h4>
                    <p className="text-xs text-red-800 font-mono font-medium leading-relaxed">
                      "{activeModalPayment.gatewayErrorMsg}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTriggerRetry(activeModalPayment)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw size={15} /> Trigger Payment Retry
                </button>
                <button
                  onClick={() => triggerToast(`Dispatched payment recovery link to ${activeModalPayment.applicantName}...`)}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <LinkIcon size={15} /> Resend Payment Link
                </button>
              </div>

              <button
                onClick={() => triggerToast(`Dispatched failure alert SMS/email...`)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Send size={14} /> Send Failure Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
