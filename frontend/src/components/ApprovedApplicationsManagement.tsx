import React, { useState } from "react";
import {
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  PlusCircle,
  Trash2,
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
  Award,
  FileCheck,
  Plane
} from "lucide-react";

export interface ApprovedApplicationRecord {
  id: string;
  appId: string;
  applicantName: string;
  passportNumber: string;
  appliedBy: "Applicant" | "Agent";
  agentName?: string;
  country: string;
  category: string;
  visaType: string;
  approvedBy: string;
  approvalDate: string;
  approvalTime: string;
  visaNumber: string;
  visaIssueDate: string;
  visaStatus: "Visa Issued" | "Ready for Issue" | "Completed" | "Ready to Travel";
  status: "Approved";
  amountPaid: string;
  transactionId: string;
  // Detail fields
  dob?: string;
  gender?: string;
  nationality?: string;
  email?: string;
  phone?: string;
  travelDate?: string;
  visaValidity?: string;
  issuedDocs: { name: string; status: "Issued" | "Available" }[];
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_APPROVED_TABS = [
  "Overview",
  "Applicant Details",
  "Visa Details",
  "Approval Details",
  "Issued Documents",
  "Payment Details",
  "Communication",
  "Activity Logs"
];

export const APPROVAL_WORKFLOW_STEPS = [
  "Application Submitted",
  "Document Verification",
  "Under Review",
  "Approved",
  "Visa Issued",
  "Applicant Notified",
  "Completed"
];

const MOCK_APPROVED_APPLICATIONS: ApprovedApplicationRecord[] = [
  {
    id: "1",
    appId: "APP-20265001",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    appliedBy: "Applicant",
    country: "Canada",
    category: "Tourist",
    visaType: "eVisa",
    approvedBy: "Rahul Sharma",
    approvalDate: "01 Aug 2026",
    approvalTime: "10:30 AM",
    visaNumber: "CAN-V2026-9912",
    visaIssueDate: "01 Aug 2026",
    visaStatus: "Visa Issued",
    status: "Approved",
    amountPaid: "₹12,350",
    transactionId: "TXN-9988112",
    dob: "1994-08-12",
    gender: "Female",
    nationality: "Indian",
    email: "geeta.bisht@gmail.com",
    phone: "+91 98123 45678",
    travelDate: "2026-09-20",
    visaValidity: "10 Years Multiple Entry",
    issuedDocs: [
      { name: "Visa Approval Letter", status: "Issued" },
      { name: "Visa Certificate", status: "Issued" },
      { name: "Payment Receipt", status: "Available" },
      { name: "Travel Advisory", status: "Available" },
      { name: "Visa Copy PDF", status: "Issued" }
    ],
    actionNotes: [
      { id: "n1", author: "Rahul Sharma", text: "Approved Canada Tourist eVisa after complete document verification.", date: "01 Aug 2026 10:30 AM" }
    ]
  },
  {
    id: "2",
    appId: "APP-20265002",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    appliedBy: "Agent",
    agentName: "Apex Travels",
    country: "Australia",
    category: "Student",
    visaType: "Sticker Visa",
    approvedBy: "David Thomas",
    approvalDate: "31 Jul 2026",
    approvalTime: "04:15 PM",
    visaNumber: "AUS-V2026-4410",
    visaIssueDate: "31 Jul 2026",
    visaStatus: "Ready for Issue",
    status: "Approved",
    amountPaid: "₹18,930",
    transactionId: "TXN-7733441",
    dob: "1999-02-15",
    gender: "Male",
    nationality: "Indian",
    email: "rahul.sharma@outlook.com",
    phone: "+91 91234 56789",
    travelDate: "2026-10-01",
    visaValidity: "2 Years Student Grant",
    issuedDocs: [
      { name: "Visa Grant Notice", status: "Issued" },
      { name: "Payment Receipt", status: "Available" }
    ],
    actionNotes: [
      { id: "n2", author: "David Thomas", text: "Student Subclass 500 granted. Stamping pending at VFS.", date: "31 Jul 2026 04:15 PM" }
    ]
  },
  {
    id: "3",
    appId: "APP-20265003",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    appliedBy: "Applicant",
    country: "UAE",
    category: "Business",
    visaType: "Multiple Entry",
    approvedBy: "Sarah Johnston",
    approvalDate: "30 Jul 2026",
    approvalTime: "02:00 PM",
    visaNumber: "UAE-V2026-3319",
    visaIssueDate: "30 Jul 2026",
    visaStatus: "Completed",
    status: "Approved",
    amountPaid: "₹8,670",
    transactionId: "TXN-5511223",
    dob: "1988-06-25",
    gender: "Male",
    nationality: "Indian",
    email: "bikram.s@techsolutions.com",
    phone: "+91 99887 76655",
    travelDate: "2026-08-12",
    visaValidity: "30 Days Multiple Entry",
    issuedDocs: [
      { name: "UAE E-Visa Approval", status: "Issued" },
      { name: "Payment Receipt", status: "Available" }
    ],
    actionNotes: [
      { id: "n3", author: "Sarah Johnston", text: "Visa issued and delivered via email to applicant.", date: "30 Jul 2026 02:00 PM" }
    ]
  }
];

export default function ApprovedApplicationsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalStatusFilter, setApprovalStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [appliedByFilter, setAppliedByFilter] = useState("All");

  // Records State
  const [approvedList, setApprovedList] = useState<ApprovedApplicationRecord[]>(MOCK_APPROVED_APPLICATIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalApp, setActiveModalApp] = useState<ApprovedApplicationRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredApps = approvedList.filter((app) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      app.appId.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      app.passportNumber.toLowerCase().includes(q) ||
      app.approvedBy.toLowerCase().includes(q) ||
      app.country.toLowerCase().includes(q);

    const matchesStatus = approvalStatusFilter === "All" || app.visaStatus === approvalStatusFilter;
    const matchesCountry = countryFilter === "All" || app.country === countryFilter;
    const matchesCategory = categoryFilter === "All" || app.category === categoryFilter;
    const matchesAppliedBy = appliedByFilter === "All" || app.appliedBy === appliedByFilter;

    return matchesQuery && matchesStatus && matchesCountry && matchesCategory && matchesAppliedBy;
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
  const handleIssueVisa = (app: ApprovedApplicationRecord) => {
    setApprovedList((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, visaStatus: "Visa Issued" } : a))
    );
    triggerToast(`Visa issued for ${app.applicantName} (${app.appId})!`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, visaStatus: "Visa Issued" } : null));
    }
  };

  const handleMarkCompleted = (app: ApprovedApplicationRecord) => {
    setApprovedList((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, visaStatus: "Completed" } : a))
    );
    triggerToast(`Application ${app.appId} marked as Completed!`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, visaStatus: "Completed" } : null));
    }
  };

  const handleDeleteRecord = (app: ApprovedApplicationRecord) => {
    setApprovedList((prev) => prev.filter((a) => a.id !== app.id));
    triggerToast(`Approved record ${app.appId} deleted.`);
    if (activeModalApp?.id === app.id) setActiveModalApp(null);
  };

  const handleBulkIssueVisas = () => {
    setApprovedList((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, visaStatus: "Visa Issued" } : a))
    );
    triggerToast(`Visas issued for ${selectedIds.length} applications.`);
    setSelectedIds([]);
  };

  const handleBulkNotification = () => {
    triggerToast(`Approval notifications sent to ${selectedIds.length} applicants.`);
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
            <Award size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Visa Issuance & Approval Registry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Approved Applications
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            View and manage all visa applications that have been approved and are ready for visa issuance or completion.
          </p>
        </div>
      </div>

      {/* TOP STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Approved Applications</span>
            <div className="text-2xl font-black text-slate-900 font-mono">1,856</div>
            <span className="text-[10px] text-emerald-600 font-bold">Total Granted Visas</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Approved Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">42</div>
            <span className="text-[10px] text-emerald-600 font-bold">Daily Grants</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-[#2563EB] block mb-1">Visa Issued</span>
            <div className="text-2xl font-black text-slate-900 font-mono">1,745</div>
            <span className="text-[10px] text-blue-600 font-bold">Stamped / E-Visa Sent</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Pending Visa Issue</span>
            <div className="text-2xl font-black text-slate-900 font-mono">111</div>
            <span className="text-[10px] text-amber-600 font-bold">In Issuance Queue</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Approval Rate</span>
            <div className="text-2xl font-black text-slate-900 font-mono">95%</div>
            <span className="text-[10px] text-purple-600 font-bold">High Success Ratio</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-700 block mb-1">Completed Cases</span>
            <div className="text-2xl font-black text-slate-900 font-mono">1,690</div>
            <span className="text-[10px] text-emerald-700 font-bold">Archived Completed</span>
          </div>
        </div>

        {/* RIGHT CARD: RECOMMENDED TABS & WORKFLOW FLOW (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Approval & Issuance Lifecycle
            </h3>
            <div className="space-y-1 text-[11px] text-slate-700 font-medium">
              {APPROVAL_WORKFLOW_STEPS.map((step, idx) => (
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Approval Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredApps.length} of {approvedList.length} Approved Applications
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search By (ID, Applicant, Passport, Approved By)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="APP-20265001, Geeta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* APPROVAL STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Visa Issuance Status
            </label>
            <select
              value={approvalStatusFilter}
              onChange={(e) => setApprovalStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Visa Issued">Visa Issued</option>
              <option value="Ready for Issue">Ready for Issue</option>
              <option value="Completed">Completed</option>
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
            <span>Approved Applications Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkNotification}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Send size={14} /> Send Approval Notification
            </button>
            <button
              onClick={handleBulkIssueVisas}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Award size={14} /> Issue Selected Visas
            </button>
            <button
              onClick={() => triggerToast(`Exporting data for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Applications
            </button>
          </div>
        </div>
      )}

      {/* APPROVED APPLICATIONS TABLE */}
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
                <th className="py-3.5 px-4">Approved By</th>
                <th className="py-3.5 px-4 font-mono">Approval Date</th>
                <th className="py-3.5 px-4 font-mono">Visa Status</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Award size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No approved applications found matching your filters.</p>
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
                    <td className="py-3.5 px-4 font-bold text-[#2563EB]">
                      {a.approvedBy}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {a.approvalDate}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {a.visaStatus === "Visa Issued" ? (
                        <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[10px] border border-purple-200">
                          🟣 Visa Issued
                        </span>
                      ) : a.visaStatus === "Completed" ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                          🏁 Completed
                        </span>
                      ) : (
                        <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px] border border-blue-200">
                          📋 Ready for Issue
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                        🟢 Approved
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
                          title="View Approval Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleIssueVisa(a)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition cursor-pointer"
                          title="Issue Visa"
                        >
                          <Award size={15} />
                        </button>
                        <button
                          onClick={() => handleMarkCompleted(a)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Mark Completed"
                        >
                          <CheckCircle2 size={15} />
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
          <div>Showing 1–10 of 1,856 Approved Applications</div>
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
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <Award size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalApp.applicantName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-700">
                      {activeModalApp.appId} (APPROVED)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activeModalApp.country} &bull; Visa No: <strong className="text-emerald-300 font-mono">{activeModalApp.visaNumber}</strong> &bull; Approved By: {activeModalApp.approvedBy}</p>
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
              {RECOMMENDED_APPROVED_TABS.map((tab) => {
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
                      Approval & Visa Details Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Application ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalApp.appId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Approved Visa Number</span>
                        <strong className="text-emerald-700 font-mono font-black">{activeModalApp.visaNumber}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Approved By</span>
                        <strong className="text-slate-900 font-bold">{activeModalApp.approvedBy}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Validity</span>
                        <strong className="text-slate-900 font-bold">{activeModalApp.visaValidity || "10 Years Multiple Entry"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* ISSUED DOCUMENTS CHECKLIST (FROM WIREFRAME) */}
                  <div className="bg-emerald-50/50 border border-emerald-200 rounded-3xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <FileCheck size={16} className="text-emerald-600" /> Issued Visa Documents & Downloads
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-bold text-emerald-900">
                      {activeModalApp.issuedDocs.map((doc, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 size={15} className="text-emerald-600" /> {doc.name}
                          </span>
                          <button
                            onClick={() => triggerToast(`Downloading ${doc.name}...`)}
                            className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-[10px] font-extrabold flex items-center gap-1 cursor-pointer"
                          >
                            <Download size={12} /> Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleIssueVisa(activeModalApp)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Award size={15} /> Issue Visa Copy
                </button>
                <button
                  onClick={() => handleMarkCompleted(activeModalApp)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> Mark Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
