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
  Ban,
  RotateCcw,
  FileX
} from "lucide-react";

export interface RejectedApplicationRecord {
  id: string;
  appId: string;
  applicantName: string;
  passportNumber: string;
  appliedBy: "Applicant" | "Agent";
  agentName?: string;
  country: string;
  category: string;
  visaType: string;
  rejectionReason:
    | "Incomplete Documents"
    | "Eligibility Criteria"
    | "Invalid Information"
    | "Payment Failure"
    | "Passport Issues"
    | "Background Verification"
    | "Embassy Decision"
    | "Other";
  rejectedBy: string;
  rejectedDate: string;
  reApplyAllowed: boolean;
  coolingPeriodDays?: number;
  detailedRemarks: string;
  status: "Rejected" | "Allowing Re-Application" | "Permanently Rejected";
  // Detail fields
  dob?: string;
  gender?: string;
  nationality?: string;
  email?: string;
  phone?: string;
  travelDate?: string;
  communicationHistory: {
    rejectionEmailSent: boolean;
    smsSent: boolean;
    inAppNotified: boolean;
    applicantResponse?: string;
  };
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_REJECTED_TABS = [
  "Overview",
  "Applicant Details",
  "Visa Details",
  "Rejection Details",
  "Uploaded Documents",
  "Communication History",
  "Activity Logs",
  "Action Notes"
];

export const REJECTION_WORKFLOW_STEPS = [
  "Application Submitted",
  "Document Verification",
  "Application Review",
  "Rejected",
  "Applicant Notified",
  "Re-Application (Optional)"
];

const MOCK_REJECTED_APPLICATIONS: RejectedApplicationRecord[] = [
  {
    id: "1",
    appId: "APP-20261501",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    appliedBy: "Applicant",
    country: "Canada",
    category: "Tourist",
    visaType: "eVisa",
    rejectionReason: "Incomplete Documents",
    rejectedBy: "Rahul Sharma",
    rejectedDate: "01 Aug 2026",
    reApplyAllowed: true,
    coolingPeriodDays: 15,
    detailedRemarks: "Failed to submit bank statement for the last 6 months despite two reminders.",
    status: "Rejected",
    dob: "1994-08-12",
    gender: "Female",
    nationality: "Indian",
    email: "geeta.bisht@gmail.com",
    phone: "+91 98123 45678",
    travelDate: "2026-09-20",
    communicationHistory: {
      rejectionEmailSent: true,
      smsSent: true,
      inAppNotified: true,
      applicantResponse: "Acknowledged. Will re-apply with complete bank statement."
    },
    actionNotes: [
      { id: "n1", author: "Rahul Sharma", text: "Rejection notice issued due to document non-compliance.", date: "01 Aug 2026 11:30 AM" }
    ]
  },
  {
    id: "2",
    appId: "APP-20261502",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    appliedBy: "Agent",
    agentName: "Apex Travels",
    country: "Australia",
    category: "Student",
    visaType: "Sticker Visa",
    rejectionReason: "Eligibility Criteria",
    rejectedBy: "David Thomas",
    rejectedDate: "31 Jul 2026",
    reApplyAllowed: false,
    coolingPeriodDays: 90,
    detailedRemarks: "Did not satisfy genuine student criteria and academic gap requirement.",
    status: "Permanently Rejected",
    dob: "1988-06-25",
    gender: "Male",
    nationality: "Indian",
    email: "bikram.s@techsolutions.com",
    phone: "+91 99887 76655",
    travelDate: "2026-10-01",
    communicationHistory: {
      rejectionEmailSent: true,
      smsSent: true,
      inAppNotified: true
    },
    actionNotes: [
      { id: "n2", author: "David Thomas", text: "Permanent refusal logged under Subclass 500 rules.", date: "31 Jul 2026 03:45 PM" }
    ]
  },
  {
    id: "3",
    appId: "APP-20261503",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    appliedBy: "Applicant",
    country: "UAE",
    category: "Business",
    visaType: "Multiple Entry",
    rejectionReason: "Payment Failure",
    rejectedBy: "Sarah Johnston",
    rejectedDate: "30 Jul 2026",
    reApplyAllowed: true,
    coolingPeriodDays: 0,
    detailedRemarks: "Embassy submission fee transaction was reversed by bank.",
    status: "Allowing Re-Application",
    dob: "1999-02-15",
    gender: "Male",
    nationality: "Indian",
    email: "rahul.sharma@outlook.com",
    phone: "+91 91234 56789",
    travelDate: "2026-08-12",
    communicationHistory: {
      rejectionEmailSent: true,
      smsSent: false,
      inAppNotified: true
    },
    actionNotes: [
      { id: "n3", author: "Sarah Johnston", text: "Applicant can re-apply immediately upon fee payment.", date: "30 Jul 2026 01:20 PM" }
    ]
  }
];

export default function RejectedApplicationsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectionReasonFilter, setRejectionReasonFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [appliedByFilter, setAppliedByFilter] = useState("All");

  // Records State
  const [rejectedList, setRejectedList] = useState<RejectedApplicationRecord[]>(MOCK_REJECTED_APPLICATIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalApp, setActiveModalApp] = useState<RejectedApplicationRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredApps = rejectedList.filter((app) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      app.appId.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      app.passportNumber.toLowerCase().includes(q) ||
      app.rejectedBy.toLowerCase().includes(q) ||
      app.country.toLowerCase().includes(q);

    const matchesReason = rejectionReasonFilter === "All" || app.rejectionReason === rejectionReasonFilter;
    const matchesCountry = countryFilter === "All" || app.country === countryFilter;
    const matchesCategory = categoryFilter === "All" || app.category === categoryFilter;
    const matchesAppliedBy = appliedByFilter === "All" || app.appliedBy === appliedByFilter;

    return matchesQuery && matchesReason && matchesCountry && matchesCategory && matchesAppliedBy;
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
  const handleToggleReApply = (app: RejectedApplicationRecord) => {
    const nextAllowed = !app.reApplyAllowed;
    setRejectedList((prev) =>
      prev.map((a) =>
        a.id === app.id
          ? {
              ...a,
              reApplyAllowed: nextAllowed,
              status: nextAllowed ? "Allowing Re-Application" : "Permanently Rejected"
            }
          : a
      )
    );
    triggerToast(`Re-application permission for ${app.appId} set to: ${nextAllowed ? "Allowed" : "Not Allowed"}`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) =>
        prev
          ? {
              ...prev,
              reApplyAllowed: nextAllowed,
              status: nextAllowed ? "Allowing Re-Application" : "Permanently Rejected"
            }
          : null
      );
    }
  };

  const handleDeleteRecord = (app: RejectedApplicationRecord) => {
    setRejectedList((prev) => prev.filter((a) => a.id !== app.id));
    triggerToast(`Rejected record ${app.appId} deleted.`);
    if (activeModalApp?.id === app.id) setActiveModalApp(null);
  };

  const handleSendRejectionEmail = (app: RejectedApplicationRecord) => {
    triggerToast(`Rejection email re-sent to ${app.applicantName} (${app.email}).`);
  };

  const handleBulkEnableReApply = () => {
    setRejectedList((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, reApplyAllowed: true, status: "Allowing Re-Application" } : a))
    );
    triggerToast(`Re-application enabled for ${selectedIds.length} items.`);
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
            <XCircle size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Refusal Audit & Re-application Control Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Rejected Applications
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            View and manage all visa applications that have been rejected, along with rejection reasons and applicant notifications.
          </p>
        </div>
      </div>

      {/* TOP STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Rejected</span>
            <div className="text-2xl font-black text-slate-900 font-mono">207</div>
            <span className="text-[10px] text-red-600 font-bold">Refusal Log</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Rejected Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">12</div>
            <span className="text-[10px] text-red-600 font-bold">Daily Refusals</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Document Issues</span>
            <div className="text-2xl font-black text-slate-900 font-mono">96</div>
            <span className="text-[10px] text-amber-600 font-bold">Incomplete / Deficient</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Eligibility Issues</span>
            <div className="text-2xl font-black text-slate-900 font-mono">74</div>
            <span className="text-[10px] text-purple-600 font-bold">Criteria Non-Match</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Payment Issues</span>
            <div className="text-2xl font-black text-slate-900 font-mono">22</div>
            <span className="text-[10px] text-blue-600 font-bold">Transaction Reversed</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Re-Applications Pending</span>
            <div className="text-2xl font-black text-slate-900 font-mono">25</div>
            <span className="text-[10px] text-emerald-600 font-bold">Re-Intake Allowed</span>
          </div>
        </div>

        {/* RIGHT CARD: RECOMMENDED TABS & WORKFLOW FLOW (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Rejection Workflow
            </h3>
            <div className="space-y-1 text-[11px] text-slate-700 font-medium">
              {REJECTION_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-[10px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & Rejection Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredApps.length} of {rejectedList.length} Rejected Applications
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search By (ID, Applicant, Passport, Officer)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="APP-20261501, Geeta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* REJECTION REASON */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Rejection Reason
            </label>
            <select
              value={rejectionReasonFilter}
              onChange={(e) => setRejectionReasonFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Reasons</option>
              <option value="Incomplete Documents">Incomplete Documents</option>
              <option value="Eligibility Criteria">Eligibility Criteria</option>
              <option value="Invalid Information">Invalid Information</option>
              <option value="Payment Failure">Payment Failure</option>
              <option value="Passport Issues">Passport Issues</option>
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

          {/* CATEGORY */}
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

          {/* APPLIED BY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Applied By
            </label>
            <select
              value={appliedByFilter}
              onChange={(e) => setAppliedByFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Channels</option>
              <option value="Applicant">Applicant (Self)</option>
              <option value="Agent">Agent Submitted</option>
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
            <span>Rejected Applications Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkEnableReApply}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={14} /> Enable Re-Application
            </button>
            <button
              onClick={() => triggerToast(`Sending notifications to ${selectedIds.length} applicants.`)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Send size={14} /> Send Rejection Mail
            </button>
            <button
              onClick={() => triggerToast(`Exporting data for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Report
            </button>
          </div>
        </div>
      )}

      {/* REJECTED APPLICATIONS TABLE */}
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
                <th className="py-3.5 px-4">Rejection Reason</th>
                <th className="py-3.5 px-4">Rejected By</th>
                <th className="py-3.5 px-4 font-mono">Rejected Date</th>
                <th className="py-3.5 px-4">Re-Apply</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <XCircle size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No rejected applications found matching your filters.</p>
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
                    <td className="py-3.5 px-4 font-bold text-red-700">
                      {a.rejectionReason}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#2563EB]">
                      {a.rejectedBy}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {a.rejectedDate}
                    </td>
                    <td className="py-3.5 px-4">
                      {a.reApplyAllowed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                          ✅ Allowed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded text-[10px] font-bold border border-red-200">
                          ❌ Not Allowed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveModalApp(a);
                            setModalTab("Overview");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Rejection Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleReApply(a)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Toggle Re-Apply Permission"
                        >
                          <RotateCcw size={15} />
                        </button>
                        <button
                          onClick={() => handleSendRejectionEmail(a)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Send Email"
                        >
                          <Send size={15} />
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
          <div>Showing 1–10 of 207 Rejected Applications</div>
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
                  <XCircle size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalApp.applicantName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-red-300 bg-red-900/50 px-2 py-0.5 rounded border border-red-700">
                      {activeModalApp.appId} (REJECTED)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activeModalApp.country} &bull; Reason: <strong className="text-red-300">{activeModalApp.rejectionReason}</strong> &bull; Rejected By: {activeModalApp.rejectedBy}</p>
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
              {RECOMMENDED_REJECTED_TABS.map((tab) => {
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
                      Rejection Audit Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Application ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalApp.appId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Rejection Reason</span>
                        <strong className="text-red-700 font-bold">{activeModalApp.rejectionReason}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Rejected By</span>
                        <strong className="text-slate-900 font-bold">{activeModalApp.rejectedBy}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Re-Application Status</span>
                        <strong className="text-emerald-700 font-bold">{activeModalApp.reApplyAllowed ? "Allowed" : "Not Allowed"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* DETAILED REMARKS CARD */}
                  <div className="bg-red-50/50 border border-red-200 rounded-3xl p-5 space-y-2">
                    <h4 className="text-xs font-extrabold text-red-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <AlertTriangle size={16} className="text-red-600" /> Officer Detailed Remarks
                    </h4>
                    <p className="text-slate-800 text-xs font-medium leading-relaxed bg-white p-3.5 rounded-2xl border border-red-100">
                      {activeModalApp.detailedRemarks}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleReApply(activeModalApp)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw size={15} /> Toggle Re-Apply Permission
                </button>
                <button
                  onClick={() => handleSendRejectionEmail(activeModalApp)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Send size={15} /> Re-send Rejection Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
