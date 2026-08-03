import React, { useState } from "react";
import {
  Ban,
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
  FileText,
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
  UserPlus,
  Mail,
  Phone,
  DollarSign,
  Archive,
  HelpCircle,
  RotateCcw
} from "lucide-react";

export interface CancelledApplicationRecord {
  id: string;
  appId: string;
  applicantName: string;
  passportNumber: string;
  appliedBy: "Applicant" | "Agent";
  agentName?: string;
  country: string;
  category: string;
  visaType: string;
  cancelledBy: "Applicant" | "Agent" | "Admin";
  cancellationDate: string;
  cancellationReason:
    | "Personal Reason"
    | "Travel Plans Changed"
    | "Duplicate Application"
    | "Payment Issue"
    | "Incorrect Information"
    | "Document Issue"
    | "Visa No Longer Required"
    | "Other";
  cancellationRemarks: string;
  refundEligible: boolean;
  refundAmount: string;
  refundStatus: "Pending" | "Approved" | "Processed" | "Rejected" | "Not Eligible";
  refundMethod?: string;
  refundTransactionId?: string;
  refundDate?: string;
  status: "Cancelled" | "Archived";
  // Detail fields
  dob?: string;
  gender?: string;
  nationality?: string;
  email?: string;
  phone?: string;
  communicationHistory: {
    cancellationEmailSent: boolean;
    smsSent: boolean;
    inAppNotified: boolean;
    applicantResponse?: string;
  };
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_CANCELLED_TABS = [
  "Overview",
  "Applicant Details",
  "Visa Details",
  "Cancellation Details",
  "Refund Information",
  "Communication",
  "Activity Logs",
  "Action Notes"
];

export const CANCELLATION_WORKFLOW_STEPS = [
  "Application Submitted",
  "Application Processing",
  "Cancellation Request",
  "Admin Review",
  "Application Cancelled",
  "Refund Processing",
  "Archived"
];

export const COMMON_CANCELLATION_REASONS = [
  "Applicant Requested Cancellation",
  "Travel Plans Changed",
  "Duplicate Application",
  "Incorrect Information Submitted",
  "Incomplete Documents",
  "Payment Failure",
  "Visa No Longer Required",
  "Admin Cancellation",
  "Agent Cancellation",
  "Other"
];

const MOCK_CANCELLED_APPLICATIONS: CancelledApplicationRecord[] = [
  {
    id: "1",
    appId: "APP-20261601",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    appliedBy: "Applicant",
    country: "Canada",
    category: "Tourist",
    visaType: "eVisa",
    cancelledBy: "Applicant",
    cancellationDate: "01 Aug 2026",
    cancellationReason: "Travel Plans Changed",
    cancellationRemarks: "Applicant postponed trip due to personal emergency.",
    refundEligible: true,
    refundAmount: "₹8,500",
    refundStatus: "Pending",
    refundMethod: "Bank Transfer",
    status: "Cancelled",
    dob: "1994-08-12",
    gender: "Female",
    nationality: "Indian",
    email: "geeta.bisht@gmail.com",
    phone: "+91 98123 45678",
    communicationHistory: {
      cancellationEmailSent: true,
      smsSent: true,
      inAppNotified: true,
      applicantResponse: "Requested speed refund process."
    },
    actionNotes: [
      { id: "n1", author: "Admin Vibhu", text: "Cancellation approved. Partial refund initiated.", date: "01 Aug 2026 02:00 PM" }
    ]
  },
  {
    id: "2",
    appId: "APP-20261602",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    appliedBy: "Agent",
    agentName: "Apex Travels",
    country: "Australia",
    category: "Student",
    visaType: "Sticker Visa",
    cancelledBy: "Admin",
    cancellationDate: "31 Jul 2026",
    cancellationReason: "Duplicate Application",
    cancellationRemarks: "System detected duplicate intake submission under APP-20261002.",
    refundEligible: true,
    refundAmount: "₹18,930",
    refundStatus: "Processed",
    refundMethod: "Original Payment Gateway",
    refundTransactionId: "REF-8822114",
    refundDate: "01 Aug 2026",
    status: "Cancelled",
    dob: "1999-02-15",
    gender: "Male",
    nationality: "Indian",
    email: "rahul.sharma@outlook.com",
    phone: "+91 91234 56789",
    communicationHistory: {
      cancellationEmailSent: true,
      smsSent: true,
      inAppNotified: true
    },
    actionNotes: [
      { id: "n2", author: "Admin Vibhu", text: "100% refund credited back to agent portal balance.", date: "01 Aug 2026 11:00 AM" }
    ]
  },
  {
    id: "3",
    appId: "APP-20261603",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    appliedBy: "Agent",
    agentName: "Global Visa Solutions",
    country: "UAE",
    category: "Business",
    visaType: "Multiple Entry",
    cancelledBy: "Agent",
    cancellationDate: "30 Jul 2026",
    cancellationReason: "Personal Reason",
    cancellationRemarks: "Client decided to travel on existing valid visa.",
    refundEligible: false,
    refundAmount: "₹0",
    refundStatus: "Not Eligible",
    status: "Cancelled",
    dob: "1988-06-25",
    gender: "Male",
    nationality: "Indian",
    email: "bikram.s@techsolutions.com",
    phone: "+91 99887 76655",
    communicationHistory: {
      cancellationEmailSent: true,
      smsSent: false,
      inAppNotified: true
    },
    actionNotes: [
      { id: "n3", author: "Global Visa Solutions", text: "Cancelled by agent prior to embassy submission.", date: "30 Jul 2026 04:30 PM" }
    ]
  }
];

export default function CancelledApplicationsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [cancelledByFilter, setCancelledByFilter] = useState("All");
  const [cancellationReasonFilter, setCancellationReasonFilter] = useState("All");
  const [refundStatusFilter, setRefundStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");

  // Records State
  const [cancelledApps, setCancelledApps] = useState<CancelledApplicationRecord[]>(MOCK_CANCELLED_APPLICATIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalApp, setActiveModalApp] = useState<CancelledApplicationRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // Process Refund Modal State
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundTargetApp, setRefundTargetApp] = useState<CancelledApplicationRecord | null>(null);

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredApps = cancelledApps.filter((app) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      app.appId.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      app.passportNumber.toLowerCase().includes(q) ||
      (app.agentName && app.agentName.toLowerCase().includes(q)) ||
      app.country.toLowerCase().includes(q);

    const matchesCancelledBy = cancelledByFilter === "All" || app.cancelledBy === cancelledByFilter;
    const matchesReason = cancellationReasonFilter === "All" || app.cancellationReason === cancellationReasonFilter;
    const matchesRefund = refundStatusFilter === "All" || app.refundStatus === refundStatusFilter;
    const matchesCountry = countryFilter === "All" || app.country === countryFilter;

    return matchesQuery && matchesCancelledBy && matchesReason && matchesRefund && matchesCountry;
  });

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredApps.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApps.map((a) => a.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleOpenProcessRefund = (app: CancelledApplicationRecord) => {
    setRefundTargetApp(app);
    setShowRefundModal(true);
  };

  const handleConfirmProcessRefund = () => {
    if (!refundTargetApp) return;
    setCancelledApps((prev) =>
      prev.map((a) =>
        a.id === refundTargetApp.id
          ? {
              ...a,
              refundStatus: "Processed",
              refundTransactionId: `REF-${Date.now().toString().slice(-6)}`,
              refundDate: new Date().toLocaleDateString()
            }
          : a
      )
    );
    triggerToast(`Refund processed for ${refundTargetApp.appId}!`);
    if (activeModalApp?.id === refundTargetApp.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, refundStatus: "Processed" } : null));
    }
    setShowRefundModal(false);
    setRefundTargetApp(null);
  };

  const handleArchiveRecord = (app: CancelledApplicationRecord) => {
    setCancelledApps((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Archived" } : a))
    );
    triggerToast(`Cancelled record ${app.appId} moved to Archives!`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, status: "Archived" } : null));
    }
  };

  const handleDeleteRecord = (app: CancelledApplicationRecord) => {
    setCancelledApps((prev) => prev.filter((a) => a.id !== app.id));
    triggerToast(`Cancelled record ${app.appId} deleted.`);
    if (activeModalApp?.id === app.id) setActiveModalApp(null);
  };

  const handleBulkProcessRefunds = () => {
    setCancelledApps((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, refundStatus: "Processed" } : a))
    );
    triggerToast(`Refunds processed for ${selectedIds.length} items.`);
    setSelectedIds([]);
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
            <Ban size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Cancellation Audit & Refund Processing Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Cancelled Applications
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            View and manage all visa applications that have been cancelled by applicants, agents, or administrators before completion.
          </p>
        </div>
      </div>

      {/* STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Cancelled</span>
            <div className="text-2xl font-black text-slate-900 font-mono">114</div>
            <span className="text-[10px] text-red-600 font-bold">Cancelled Intake</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Cancelled Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">5</div>
            <span className="text-[10px] text-red-600 font-bold">Daily Cancellations</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Applicant Cancelled</span>
            <div className="text-2xl font-black text-slate-900 font-mono">58</div>
            <span className="text-[10px] text-purple-600 font-bold">User Self-Requested</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Agent Cancelled</span>
            <div className="text-2xl font-black text-slate-900 font-mono">33</div>
            <span className="text-[10px] text-blue-600 font-bold">B2B Portal Action</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-600 block mb-1">Admin Cancelled</span>
            <div className="text-2xl font-black text-slate-900 font-mono">23</div>
            <span className="text-[10px] text-slate-600 font-bold">Internal Compliance</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Refund Pending</span>
            <div className="text-2xl font-black text-slate-900 font-mono">23</div>
            <span className="text-[10px] text-amber-600 font-bold">Awaiting Payout</span>
          </div>
        </div>

        {/* RIGHT CARD: RECOMMENDED TABS, WORKFLOW & COMMON REASONS (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Cancellation Workflow & Reasons
            </h3>

            {/* CANCELLATION WORKFLOW LIST */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {CANCELLATION_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-[9px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* COMMON CANCELLATION REASONS LIST */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-900 font-bold block mb-1">Common Cancellation Reasons:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                {COMMON_CANCELLATION_REASONS.slice(0, 6).map((reason, i) => (
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Cancellation Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredApps.length} of {cancelledApps.length} Cancelled Applications
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search By (ID, Applicant, Passport, Agent)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="APP-20261601, Geeta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* CANCELLED BY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Cancelled By
            </label>
            <select
              value={cancelledByFilter}
              onChange={(e) => setCancelledByFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Initiators</option>
              <option value="Applicant">Applicant</option>
              <option value="Agent">Agent</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* CANCELLATION REASON */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Cancellation Reason
            </label>
            <select
              value={cancellationReasonFilter}
              onChange={(e) => setCancellationReasonFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Reasons</option>
              <option value="Personal Reason">Personal Reason</option>
              <option value="Travel Plans Changed">Travel Plans Changed</option>
              <option value="Duplicate Application">Duplicate Application</option>
              <option value="Payment Issue">Payment Issue</option>
            </select>
          </div>

          {/* REFUND STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Refund Status
            </label>
            <select
              value={refundStatusFilter}
              onChange={(e) => setRefundStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Refund Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processed">Processed</option>
              <option value="Not Eligible">Not Eligible</option>
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
            <span>Cancelled Applications Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkProcessRefunds}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <DollarSign size={14} /> Process Refunds
            </button>
            <button
              onClick={() => triggerToast(`Sending cancellation notices to ${selectedIds.length} applicants.`)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Send size={14} /> Send Notifications
            </button>
            <button
              onClick={() => triggerToast(`Exporting report for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Report
            </button>
          </div>
        </div>
      )}

      {/* CANCELLED APPLICATIONS TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredApps.length && filteredApps.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Application ID</th>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Visa Category</th>
                <th className="py-3.5 px-4">Cancelled By</th>
                <th className="py-3.5 px-4 font-mono">Cancellation Date</th>
                <th className="py-3.5 px-4">Refund Status</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Ban size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No cancelled applications found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredApps.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(a.id)}
                        onChange={() => handleToggleSelect(a.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {a.appId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {a.applicantName}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {a.country}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {a.category}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-purple-700">
                      {a.cancelledBy}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {a.cancellationDate}
                    </td>
                    <td className="py-3.5 px-4">
                      {a.refundStatus === "Processed" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                          🟢 Processed
                        </span>
                      ) : a.refundStatus === "Pending" ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200">
                          ⌛ Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200">
                          ❌ Not Eligible
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                        ✕ Cancelled
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveModalApp(a);
                            setModalTab("Overview");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        {a.refundStatus === "Pending" && (
                          <button
                            onClick={() => handleOpenProcessRefund(a)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                            title="Process Refund"
                          >
                            <DollarSign size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => handleArchiveRecord(a)}
                          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Archive Record"
                        >
                          <Archive size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(a)}
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
          <div>Showing 1–10 of 114 Cancelled Applications</div>
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

      {/* CENTERED POPUP DETAILS MODAL (8 RECOMMENDED TABS FROM WIREFRAME CATALOG) */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center font-bold text-lg text-white">
                  <Ban size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalApp.applicantName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-red-300 bg-red-900/50 px-2 py-0.5 rounded border border-red-700">
                      {activeModalApp.appId} (CANCELLED)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activeModalApp.country} &bull; Cancelled By: <strong className="text-purple-300">{activeModalApp.cancelledBy}</strong> &bull; Reason: {activeModalApp.cancellationReason}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalApp(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {RECOMMENDED_CANCELLED_TABS.map((tab) => {
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
                      Cancellation Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Application ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalApp.appId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Cancelled By</span>
                        <strong className="text-purple-700 font-bold">{activeModalApp.cancelledBy}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Cancellation Date</span>
                        <strong className="text-slate-900 font-mono font-bold">{activeModalApp.cancellationDate}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Refund Status</span>
                        <strong className="text-amber-700 font-bold">{activeModalApp.refundStatus}</strong>
                      </div>
                    </div>
                  </div>

                  {/* REMARKS CARD */}
                  <div className="bg-red-50/50 border border-red-200 rounded-3xl p-5 space-y-2">
                    <h4 className="text-xs font-extrabold text-red-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <AlertTriangle size={16} className="text-red-600" /> Cancellation Remarks & Reason
                    </h4>
                    <p className="text-slate-800 text-xs font-medium leading-relaxed bg-white p-3.5 rounded-2xl border border-red-100">
                      {activeModalApp.cancellationRemarks}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeModalApp.refundStatus === "Pending" && (
                  <button
                    onClick={() => handleOpenProcessRefund(activeModalApp)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <DollarSign size={15} /> Process Refund
                  </button>
                )}
                <button
                  onClick={() => handleArchiveRecord(activeModalApp)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Archive size={15} /> Move to Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REFUND MODAL */}
      {showRefundModal && refundTargetApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-black text-slate-900 font-outfit flex items-center gap-2">
              <DollarSign size={18} className="text-amber-600" />
              <span>Process Refund: {refundTargetApp.appId}</span>
            </h3>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-semibold space-y-1">
              <div>Refund Amount: <strong className="text-emerald-700">{refundTargetApp.refundAmount}</strong></div>
              <div>Refund Method: <strong>{refundTargetApp.refundMethod || "Original Payment Method"}</strong></div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setShowRefundModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmProcessRefund}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-lg"
              >
                Confirm Refund Payout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
