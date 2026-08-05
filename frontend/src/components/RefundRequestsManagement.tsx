import React, { useState } from "react";
import {
  RotateCcw,
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
  FileText,
  BarChart3
} from "lucide-react";

export interface RefundRequestRecord {
  id: string;
  refundId: string;
  txnId: string;
  appId: string;
  applicantName: string;
  passportNumber: string;
  nationality: string;
  requestedBy: "Applicant" | "Agent" | "Admin";
  agentName?: string;
  refundAmount: number;
  originalAmount: number;
  refundMethod: "UPI" | "Credit Card" | "Debit Card" | "Net Banking" | "Wallet" | "Bank Transfer";
  refundReason:
    | "Application Cancelled"
    | "Visa Rejected"
    | "Duplicate Payment"
    | "Overpayment"
    | "Embassy Fee Revision"
    | "Service Delay"
    | "Technical Error"
    | "Travel Plan Cancelled"
    | "Incorrect Category"
    | "Other";
  requestDate: string;
  requestDateTime: string;
  status: "Pending Approval" | "Approved" | "Processed" | "Rejected" | "Not Eligible";
  approvedBy?: string;
  approvedDate?: string;
  payoutRefNo?: string;
  actionRemarks?: string;
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_REFUND_TABS = [
  "Overview",
  "Applicant Details",
  "Payment Details",
  "Refund Details",
  "Approval History",
  "Communication",
  "Activity Logs",
  "Action Notes"
];

export const REFUND_WORKFLOW_STEPS = [
  "Refund Requested by User",
  "Admin Review",
  "Approved / Rejected",
  "Banking Processing",
  "Refund Completed",
  "Applicant Notified"
];

export const COMMON_REFUND_REASONS = [
  "Application Cancelled",
  "Visa Rejected by Embassy",
  "Duplicate Payment",
  "Overpayment",
  "Embassy Fee Revision",
  "Service Delay",
  "Technical Error",
  "Travel Plan Cancelled",
  "Incorrect Category",
  "Other"
];

const MOCK_REFUND_REQUESTS: RefundRequestRecord[] = [
  {
    id: "1",
    refundId: "RFD-8001",
    txnId: "TXN-L80501",
    appId: "APP-20261001",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    nationality: "Indian",
    requestedBy: "Applicant",
    refundAmount: 8500,
    originalAmount: 8500,
    refundMethod: "UPI",
    refundReason: "Application Cancelled",
    requestDate: "01 Aug 2026",
    requestDateTime: "01 Aug 2026 11:30 AM",
    status: "Pending Approval",
    actionRemarks: "Applicant cancelled travel plans prior to document submission to embassy.",
    actionNotes: [
      { id: "n1", author: "System", text: "Refund request initiated by user from self-service portal.", date: "01 Aug 2026 11:30 AM" }
    ]
  },
  {
    id: "2",
    refundId: "RFD-8002",
    txnId: "TXN-L80502",
    appId: "APP-20261002",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    nationality: "Indian",
    requestedBy: "Agent",
    agentName: "Apex Travels",
    refundAmount: 12000,
    originalAmount: 24000,
    refundMethod: "Credit Card",
    refundReason: "Duplicate Payment",
    requestDate: "01 Aug 2026",
    requestDateTime: "01 Aug 2026 01:15 PM",
    status: "Approved",
    approvedBy: "Admin Vibhu",
    approvedDate: "01 Aug 2026 02:00 PM",
    payoutRefNo: "PAYOUT_RZP_776655",
    actionRemarks: "Duplicate charge confirmed by payment gateway audit.",
    actionNotes: []
  },
  {
    id: "3",
    refundId: "RFD-8003",
    txnId: "TXN-L80503",
    appId: "APP-20261003",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    nationality: "Indian",
    requestedBy: "Applicant",
    refundAmount: 15500,
    originalAmount: 15500,
    refundMethod: "Net Banking",
    refundReason: "Visa Rejected",
    requestDate: "01 Aug 2026",
    requestDateTime: "01 Aug 2026 03:45 PM",
    status: "Processed",
    approvedBy: "Admin Vibhu",
    approvedDate: "01 Aug 2026 04:00 PM",
    payoutRefNo: "HDFC_REFUND_998811",
    actionRemarks: "Service fee refund policy applied for rejected embassy application.",
    actionNotes: []
  }
];

export default function RefundRequestsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [reasonFilter, setReasonFilter] = useState("All");
  const [requestedByFilter, setRequestedByFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");

  // Records State
  const [refundsList, setRefundsList] = useState<RefundRequestRecord[]>(MOCK_REFUND_REQUESTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalRefund, setActiveModalRefund] = useState<RefundRequestRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredRefunds = refundsList.filter((rfd) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      rfd.refundId.toLowerCase().includes(q) ||
      rfd.txnId.toLowerCase().includes(q) ||
      rfd.appId.toLowerCase().includes(q) ||
      rfd.applicantName.toLowerCase().includes(q) ||
      (rfd.agentName && rfd.agentName.toLowerCase().includes(q));

    const matchesStatus = statusFilter === "All" || rfd.status === statusFilter;
    const matchesReason = reasonFilter === "All" || rfd.refundReason === reasonFilter;
    const matchesRequestedBy = requestedByFilter === "All" || rfd.requestedBy === requestedByFilter;
    const matchesMethod = methodFilter === "All" || rfd.refundMethod === methodFilter;

    return matchesQuery && matchesStatus && matchesReason && matchesRequestedBy && matchesMethod;
  });

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredRefunds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRefunds.map((r) => r.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleApproveRefund = (rfd: RefundRequestRecord) => {
    setRefundsList((prev) =>
      prev.map((r) => (r.id === rfd.id ? { ...r, status: "Approved", approvedBy: "Admin Vibhu" } : r))
    );
    triggerToast(`Refund ${rfd.refundId} approved for payout.`);
    if (activeModalRefund?.id === rfd.id) {
      setActiveModalRefund((prev) => (prev ? { ...prev, status: "Approved", approvedBy: "Admin Vibhu" } : null));
    }
  };

  const handleRejectRefund = (rfd: RefundRequestRecord) => {
    setRefundsList((prev) =>
      prev.map((r) => (r.id === rfd.id ? { ...r, status: "Rejected", approvedBy: "Admin Vibhu" } : r))
    );
    triggerToast(`Refund request ${rfd.refundId} rejected.`);
    if (activeModalRefund?.id === rfd.id) {
      setActiveModalRefund((prev) => (prev ? { ...prev, status: "Rejected", approvedBy: "Admin Vibhu" } : null));
    }
  };

  const handleProcessPayout = (rfd: RefundRequestRecord) => {
    setRefundsList((prev) =>
      prev.map((r) => (r.id === rfd.id ? { ...r, status: "Processed", payoutRefNo: "PAYOUT_RELEASED_" + Date.now() } : r))
    );
    triggerToast(`Payout released for refund ${rfd.refundId} (₹${rfd.refundAmount.toLocaleString()}).`);
    if (activeModalRefund?.id === rfd.id) {
      setActiveModalRefund((prev) => (prev ? { ...prev, status: "Processed", payoutRefNo: "PAYOUT_RELEASED_" + Date.now() } : null));
    }
  };

  const handleDeleteRecord = (rfd: RefundRequestRecord) => {
    setRefundsList((prev) => prev.filter((r) => r.id !== rfd.id));
    triggerToast(`Refund record ${rfd.refundId} deleted.`);
    if (activeModalRefund?.id === rfd.id) setActiveModalRefund(null);
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
            <RotateCcw size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Refund Approvals & Bank Payout Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Refund Requests
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Review and manage all visa refund requests, approvals, and payout processing.
          </p>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Refund Requests</span>
            <div className="text-2xl font-black text-slate-900 font-mono">206</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Refund Ledger</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Pending Approval</span>
            <div className="text-2xl font-black text-slate-900 font-mono">23</div>
            <span className="text-[10px] text-amber-600 font-bold">Review Queue</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Approved Requests</span>
            <div className="text-2xl font-black text-slate-900 font-mono">88</div>
            <span className="text-[10px] text-emerald-600 font-bold">Ready for Bank Payout</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Processed Refunds</span>
            <div className="text-2xl font-black text-slate-900 font-mono">68</div>
            <span className="text-[10px] text-blue-600 font-bold">Completed Payouts</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Rejected Requests</span>
            <div className="text-2xl font-black text-slate-900 font-mono">27</div>
            <span className="text-[10px] text-red-600 font-bold">Ineligible Claim</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Total Refund Amount</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹18,65,400</div>
            <span className="text-[10px] text-purple-600 font-bold">Total Disbursed</span>
          </div>
        </div>

        {/* RIGHT CARD: WORKFLOW & COMMON REFUND REASONS (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Refund Workflow
            </h3>

            {/* REFUND WORKFLOW FLOW */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {REFUND_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-[9px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* COMMON REFUND REASONS CATALOG */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-900 font-bold block mb-1">Common Refund Reasons:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px] max-h-24 overflow-y-auto [scrollbar-width:thin]">
                {COMMON_REFUND_REASONS.map((reason, i) => (
                  <div key={i} className="flex items-center gap-1 text-slate-700">
                    <Check size={11} className="text-[#2563EB]" /> {reason}
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Refund Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredRefunds.length} of {refundsList.length} Refund Requests
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (Refund ID, Txn ID, App ID, Applicant)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="RFD-8001, TXN-L80501..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* REFUND STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Refund Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Processed">Processed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* REFUND REASON */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Refund Reason
            </label>
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Reasons</option>
              <option value="Application Cancelled">Application Cancelled</option>
              <option value="Visa Rejected">Visa Rejected</option>
              <option value="Duplicate Payment">Duplicate Payment</option>
              <option value="Overpayment">Overpayment</option>
            </select>
          </div>

          {/* REQUESTED BY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Requested By
            </label>
            <select
              value={requestedByFilter}
              onChange={(e) => setRequestedByFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Requesters</option>
              <option value="Applicant">Applicant</option>
              <option value="Agent">Agent</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* REFUND METHOD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Refund Method
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
            <span>Refund Requests Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => triggerToast(`Approved ${selectedIds.length} refund requests.`)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 size={14} /> Approve Selected
            </button>
            <button
              onClick={() => triggerToast(`Rejected ${selectedIds.length} refund requests.`)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <XCircle size={14} /> Reject Selected
            </button>
            <button
              onClick={() => triggerToast(`Processing payouts for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={14} /> Process Refunds
            </button>
          </div>
        </div>
      )}

      {/* REFUND REQUESTS TABLE (COLUMNS MATCH WIREFRAME EXACTLY) */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredRefunds.length && filteredRefunds.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-mono">Refund ID</th>
                <th className="py-3.5 px-4 font-mono">Transaction ID</th>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Refund Reason</th>
                <th className="py-3.5 px-4 font-mono">Refund Amount</th>
                <th className="py-3.5 px-4 font-mono">Request Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredRefunds.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <RotateCcw size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No refund requests found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredRefunds.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(r.id)}
                        onChange={() => handleToggleSelect(r.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {r.refundId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {r.txnId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {r.applicantName}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-purple-700">
                      {r.refundReason}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">
                      ₹{r.refundAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {r.requestDate}
                    </td>
                    <td className="py-3.5 px-4">
                      {r.status === "Approved" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          🟢 Approved
                        </span>
                      ) : r.status === "Processed" ? (
                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-blue-200">
                          🔵 Processed
                        </span>
                      ) : r.status === "Rejected" ? (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                          🔴 Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-200">
                          🟡 Pending Approval
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveModalRefund(r);
                            setModalTab("Overview");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Refund Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleApproveRefund(r)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Approve Refund"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => handleRejectRefund(r)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Reject Refund"
                        >
                          <XCircle size={15} />
                        </button>
                        <button
                          onClick={() => handleProcessPayout(r)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition cursor-pointer"
                          title="Process Payout"
                        >
                          <RotateCcw size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(r)}
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
          <div>Showing 1–10 of 206 Refund Requests</div>
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
          <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Finance Refund Audit Controls
        </h3>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Refund eligibility checks active: Pending approval logs, Bank payout confirmation, Customer notification audit, and Reconciliation ledger reconciliation.
        </p>
      </div>

      {/* CENTERED POPUP DETAILS MODAL (8 RECOMMENDED TABS FROM WIREFRAME) */}
      {activeModalRefund && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center font-bold text-lg text-white">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      Refund Request {activeModalRefund.refundId}
                    </h3>
                    <span className="font-mono text-xs font-bold text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700">
                      ₹{activeModalRefund.refundAmount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Txn ID: <strong className="text-blue-300">{activeModalRefund.txnId}</strong> &bull; Applicant: {activeModalRefund.applicantName}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalRefund(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {RECOMMENDED_REFUND_TABS.map((tab) => {
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
                      Refund Claim Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Refund ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalRefund.refundId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Refund Reason</span>
                        <strong className="text-purple-700 font-bold">{activeModalRefund.refundReason}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Approval Status</span>
                        <strong className="text-emerald-700 font-bold">{activeModalRefund.status}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Payout Reference</span>
                        <strong className="text-slate-900 font-mono font-bold">{activeModalRefund.payoutRefNo || "Awaiting Release"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* ACTION REMARKS CARD */}
                  <div className="bg-blue-50/60 border border-blue-200 rounded-3xl p-5 space-y-2">
                    <h4 className="text-xs font-extrabold text-[#2563EB] uppercase tracking-wider font-outfit flex items-center gap-2">
                      <FileText size={16} /> Audit & Action Remarks
                    </h4>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      "{activeModalRefund.actionRemarks || "Refund request submitted and queued for finance audit."}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApproveRefund(activeModalRefund)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> Approve Refund
                </button>
                <button
                  onClick={() => handleRejectRefund(activeModalRefund)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <XCircle size={15} /> Reject Refund
                </button>
              </div>

              <button
                onClick={() => handleProcessPayout(activeModalRefund)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw size={14} /> Process Refund Payout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
