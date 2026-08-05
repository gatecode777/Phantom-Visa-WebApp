import React, { useState } from "react";
import {
  Clock,
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
  Link as LinkIcon
} from "lucide-react";

export interface PendingPaymentRecord {
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
  pendingSince: string;
  pendingSinceTime: string;
  pendingReason:
    | "Awaiting Payment"
    | "Gateway Processing"
    | "Bank Verification"
    | "Manual Verification"
    | "Payment Timeout";
  status: "Pending" | "Confirmed" | "Failed";
  country: string;
  visaCategory: "Tourist" | "Business" | "Student" | "Work" | "Medical" | "Transit";
  paymentGateway: "Razorpay" | "Stripe" | "HDFC Netbanking";
  verificationAttempt: number;
  breakdown: {
    visaFee: number;
    serviceCharge: number;
    processingFee: number;
    taxGst: number;
  };
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_PENDING_PAYMENT_TABS = [
  "Overview",
  "Applicant Details",
  "Payment Details",
  "Pending Status",
  "Payment Gateway Logs",
  "Activity Logs",
  "Action Notes"
];

export const PENDING_PAYMENT_WORKFLOW_STEPS = [
  "Application Submitted",
  "Payment Initiated",
  "Pending Payments",
  "Gateway Processing / Awaiting Option",
  "Payment Confirmed",
  "Application Processing"
];

export const PENDING_PAYMENT_REASONS = [
  "Awaiting Applicant Payment",
  "Gateway Server Processing",
  "Bank Verification Pending",
  "OTP / 3D Secure Incomplete",
  "Network Timeout",
  "Approval Notification Pending",
  "Agent Credit Approval",
  "Manual Release Required"
];

const MOCK_PENDING_PAYMENTS: PendingPaymentRecord[] = [
  {
    id: "1",
    txnId: "TXN-P98001",
    appId: "APP-20263001",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    nationality: "Indian",
    paidBy: "Applicant",
    amount: 12500,
    paymentMethod: "UPI",
    pendingSince: "01 Aug 2026",
    pendingSinceTime: "01 Aug 2026 10:15 AM",
    pendingReason: "Awaiting Payment",
    status: "Pending",
    country: "Canada",
    visaCategory: "Tourist",
    paymentGateway: "Razorpay",
    verificationAttempt: 1,
    breakdown: {
      visaFee: 8500,
      serviceCharge: 2000,
      processingFee: 1000,
      taxGst: 1000
    },
    actionNotes: [
      { id: "n1", author: "System", text: "Payment link sent to applicant email.", date: "01 Aug 2026 10:16 AM" }
    ]
  },
  {
    id: "2",
    txnId: "TXN-P98002",
    appId: "APP-20263002",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    nationality: "Indian",
    paidBy: "Agent",
    agentName: "Apex Travels",
    amount: 28000,
    paymentMethod: "Credit Card",
    pendingSince: "01 Aug 2026",
    pendingSinceTime: "01 Aug 2026 11:30 AM",
    pendingReason: "Gateway Processing",
    status: "Pending",
    country: "Australia",
    visaCategory: "Business",
    paymentGateway: "Stripe",
    verificationAttempt: 2,
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
    txnId: "TXN-P98003",
    appId: "APP-20263003",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    nationality: "Indian",
    paidBy: "Applicant",
    amount: 15800,
    paymentMethod: "Net Banking",
    pendingSince: "01 Aug 2026",
    pendingSinceTime: "01 Aug 2026 02:10 PM",
    pendingReason: "Bank Verification",
    status: "Pending",
    country: "UAE",
    visaCategory: "Tourist",
    paymentGateway: "HDFC Netbanking",
    verificationAttempt: 1,
    breakdown: {
      visaFee: 10000,
      serviceCharge: 2500,
      processingFee: 1800,
      taxGst: 1500
    },
    actionNotes: []
  }
];

export default function PendingPaymentsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [reasonFilter, setReasonFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [paidByFilter, setPaidByFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");

  // Records State
  const [pendingPayments, setPendingPayments] = useState<PendingPaymentRecord[]>(MOCK_PENDING_PAYMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalPayment, setActiveModalPayment] = useState<PendingPaymentRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredPayments = pendingPayments.filter((pay) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      pay.txnId.toLowerCase().includes(q) ||
      pay.appId.toLowerCase().includes(q) ||
      pay.applicantName.toLowerCase().includes(q) ||
      (pay.agentName && pay.agentName.toLowerCase().includes(q));

    const matchesReason = reasonFilter === "All" || pay.pendingReason === reasonFilter;
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
  const handleConfirmPayment = (pay: PendingPaymentRecord) => {
    setPendingPayments((prev) =>
      prev.map((p) => (p.id === pay.id ? { ...p, status: "Confirmed" } : p))
    );
    triggerToast(`Payment ${pay.txnId} confirmed and released!`);
    if (activeModalPayment?.id === pay.id) {
      setActiveModalPayment((prev) => (prev ? { ...prev, status: "Confirmed" } : null));
    }
  };

  const handleDeleteRecord = (pay: PendingPaymentRecord) => {
    setPendingPayments((prev) => prev.filter((p) => p.id !== pay.id));
    triggerToast(`Pending payment record ${pay.txnId} deleted.`);
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
            <Clock size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Pending Ledger Audit Queue
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Pending Payments
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Monitor and manage all pending visa payment transactions, awaiting bank or user confirmation.
          </p>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Pending</span>
            <div className="text-2xl font-black text-slate-900 font-mono">824</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Pending Queue</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Pending Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">62</div>
            <span className="text-[10px] text-amber-600 font-bold">Today's Intake</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Gateway Approval</span>
            <div className="text-2xl font-black text-slate-900 font-mono">116</div>
            <span className="text-[10px] text-blue-600 font-bold">Server Processing</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Awaiting User Action</span>
            <div className="text-2xl font-black text-slate-900 font-mono">421</div>
            <span className="text-[10px] text-purple-600 font-bold">User Link Sent</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Pending Processing</span>
            <div className="text-2xl font-black text-slate-900 font-mono">225</div>
            <span className="text-[10px] text-teal-600 font-bold">Verification Stage</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Pending Amount</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹98,87,500</div>
            <span className="text-[10px] text-red-600 font-bold">Potential Revenue</span>
          </div>
        </div>

        {/* RIGHT CARD: WORKFLOW & PENDING REASONS CATALOG (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Payment Workflow
            </h3>

            {/* PAYMENT WORKFLOW FLOW */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {PENDING_PAYMENT_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-[9px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* PENDING PAYMENT REASONS CATALOG */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-900 font-bold block mb-1">Pending Payment Reasons:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                {PENDING_PAYMENT_REASONS.map((reason, i) => (
                  <div key={i} className="flex items-center gap-1 text-slate-700">
                    <Check size={11} className="text-amber-600" /> {reason}
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Pending Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredPayments.length} of {pendingPayments.length} Pending Payments
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (Txn ID, App ID, Applicant, Agent)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="TXN-P98001, APP-20263001..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* PENDING REASON */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Pending Reason
            </label>
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Reasons</option>
              <option value="Awaiting Payment">Awaiting Payment</option>
              <option value="Gateway Processing">Gateway Processing</option>
              <option value="Bank Verification">Bank Verification</option>
              <option value="Manual Verification">Manual Verification</option>
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
              <option value="Work">Work</option>
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
            <span>Pending Payments Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => triggerToast(`Sending payment reminders to ${selectedIds.length} applicants.`)}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Send size={14} /> Send Payment Reminders
            </button>
            <button
              onClick={() => triggerToast(`Verifying selected ${selectedIds.length} payments.`)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 size={14} /> Verify Selected Payments
            </button>
            <button
              onClick={() => triggerToast(`Resending payment links for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <LinkIcon size={14} /> Resend Payment Links
            </button>
          </div>
        </div>
      )}

      {/* PENDING PAYMENTS TABLE (COLUMNS MATCH WIREFRAME EXACTLY) */}
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
                <th className="py-3.5 px-4 font-mono">Pending Since</th>
                <th className="py-3.5 px-4">Pending Reason</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <Clock size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No pending payments found matching your filters.</p>
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
                    <td className="py-3.5 px-4 font-mono font-extrabold text-amber-600">
                      ₹{p.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {p.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {p.pendingSince}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-700">
                      {p.pendingReason}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.status === "Confirmed" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          🟢 Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-200">
                          🟡 Pending
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
                          title="View Pending Payment Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleConfirmPayment(p)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Verify & Release Payment"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Payment reminder sent to ${p.applicantName}...`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Send Payment Reminder"
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
          <div>Showing 1–10 of 824 Pending Payments</div>
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
          <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Finance Recommendation
        </h3>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          All columns for professional finance dashboard are fully active: Transaction ID, Application ID, Applicant Name, Paid By, Visa Category, Amount Payable, Service Fee, Tax, Payment Method, Date/Time, Invoice No, Receipt No, Status, Actions.
        </p>
      </div>

      {/* CENTERED POPUP DETAILS MODAL (7 RECOMMENDED TABS FROM WIREFRAME) */}
      {activeModalPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600 flex items-center justify-center font-bold text-lg text-white">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      Transaction {activeModalPayment.txnId}
                    </h3>
                    <span className="font-mono text-xs font-bold text-amber-300 bg-amber-900/50 px-2 py-0.5 rounded border border-amber-700">
                      ₹{activeModalPayment.amount.toLocaleString()} (PENDING)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">App ID: <strong className="text-blue-300">{activeModalPayment.appId}</strong> &bull; Applicant: {activeModalPayment.applicantName}</p>
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
              {RECOMMENDED_PENDING_PAYMENT_TABS.map((tab) => {
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
                      Pending Details Overview
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Transaction ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalPayment.txnId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Pending Reason</span>
                        <strong className="text-amber-700 font-bold">{activeModalPayment.pendingReason}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Verification Attempt</span>
                        <strong className="text-purple-700 font-mono font-bold">Attempt #{activeModalPayment.verificationAttempt}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Pending Since</span>
                        <strong className="text-slate-900 font-mono font-bold">{activeModalPayment.pendingSince}</strong>
                      </div>
                    </div>
                  </div>

                  {/* PAYABLE AMOUNT BREAKDOWN */}
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <Receipt size={16} className="text-amber-600" /> Pending Payable Amount Breakdown
                    </h4>
                    <div className="space-y-2 text-xs font-medium text-slate-700">
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>Visa Application Fee</span>
                        <span className="font-mono font-bold">₹{activeModalPayment.breakdown.visaFee.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>Service Charge</span>
                        <span className="font-mono font-bold">₹{activeModalPayment.breakdown.serviceCharge.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>Processing Fee</span>
                        <span className="font-mono font-bold">₹{activeModalPayment.breakdown.processingFee.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span>Tax (18% GST)</span>
                        <span className="font-mono font-bold">₹{activeModalPayment.breakdown.taxGst.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 text-sm font-extrabold text-slate-900">
                        <span>Total Payable Amount Due</span>
                        <span className="font-mono text-amber-600">₹{activeModalPayment.amount.toLocaleString()}</span>
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
                  onClick={() => handleConfirmPayment(activeModalPayment)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> Verify & Release Payment
                </button>
                <button
                  onClick={() => triggerToast(`Payment reminder sent to ${activeModalPayment.applicantName}...`)}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Send size={15} /> Send Payment Reminder
                </button>
              </div>

              <button
                onClick={() => triggerToast(`Generated fresh payment link for ${activeModalPayment.txnId}...`)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <LinkIcon size={14} /> Resend Payment Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
