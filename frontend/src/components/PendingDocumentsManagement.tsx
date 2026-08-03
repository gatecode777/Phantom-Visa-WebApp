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
  HelpCircle,
  UploadCloud
} from "lucide-react";

export interface PendingDocumentRecord {
  id: string;
  appId: string;
  applicantName: string;
  passportNumber: string;
  appliedBy: "Applicant" | "Agent";
  agentName?: string;
  country: string;
  category: string;
  visaType: string;
  missingDocs: string[];
  requestedDate: string;
  deadline: string;
  requestedBy: string;
  reminderSentCount: number;
  emailStatus: "Delivered" | "Sent" | "Opened" | "Bounced";
  status:
    | "Pending Upload"
    | "Additional Documents Requested"
    | "Re-uploaded"
    | "Overdue"
    | "Documents Verified"
    | "Ready for Verification";
  // Detail fields
  dob?: string;
  email?: string;
  phone?: string;
  nationality?: string;
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_PENDING_DOCS_TABS = [
  "Overview",
  "Applicant Details",
  "Visa Information",
  "Required Documents",
  "Uploaded Documents",
  "Pending Documents",
  "Communication",
  "Activity Logs",
  "Action Notes"
];

export const PENDING_DOCS_WORKFLOW_STEPS = [
  "Application Submitted",
  "Document Verification (Missing Docs ⚠️)",
  "Request Additional Documents",
  "Applicant Uploads Documents",
  "Document Verification",
  "Ready for Processing"
];

const MOCK_PENDING_DOCUMENTS: PendingDocumentRecord[] = [
  {
    id: "1",
    appId: "APP-20263001",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    appliedBy: "Applicant",
    country: "Canada",
    category: "Tourist",
    visaType: "eVisa",
    missingDocs: ["Bank Statement (6 Months)"],
    requestedDate: "01 Jul 2026",
    deadline: "05 Aug 2026",
    requestedBy: "Amardeep Sen",
    reminderSentCount: 2,
    emailStatus: "Opened",
    status: "Pending Upload",
    email: "geeta.bisht@gmail.com",
    phone: "+91 98123 45678",
    nationality: "Indian",
    actionNotes: [
      { id: "n1", author: "Amardeep Sen", text: "Sent email reminder for bank statement.", date: "02 Jul 2026 10:00 AM" }
    ]
  },
  {
    id: "2",
    appId: "APP-20263002",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    appliedBy: "Agent",
    agentName: "Apex Travels",
    country: "Australia",
    category: "Student",
    visaType: "Sticker Visa",
    missingDocs: ["Admission Letter", "IELTS Scorecard"],
    requestedDate: "02 Jul 2026",
    deadline: "06 Aug 2026",
    requestedBy: "Devender Sharma",
    reminderSentCount: 1,
    emailStatus: "Delivered",
    status: "Additional Documents Requested",
    email: "rahul.sharma@outlook.com",
    phone: "+91 91234 56789",
    nationality: "Indian",
    actionNotes: [
      { id: "n2", author: "Devender Sharma", text: "Requested original CoE and IELTS transcript.", date: "02 Jul 2026 02:15 PM" }
    ]
  },
  {
    id: "3",
    appId: "APP-20263003",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    appliedBy: "Applicant",
    country: "UAE",
    category: "Business",
    visaType: "Multiple Entry",
    missingDocs: ["Passport Bio Copy"],
    requestedDate: "30 Jul 2026",
    deadline: "01 Aug 2026",
    requestedBy: "Sunil Solanki",
    reminderSentCount: 3,
    emailStatus: "Opened",
    status: "Overdue",
    email: "bikram.s@techsolutions.com",
    phone: "+91 99887 76655",
    nationality: "Indian",
    actionNotes: [
      { id: "n3", author: "Sunil Solanki", text: "Deadline passed. Overdue notice triggered.", date: "02 Aug 2026 09:00 AM" }
    ]
  }
];

export default function PendingDocumentsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedByFilter, setAppliedByFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deadlineFilter, setDeadlineFilter] = useState("All");

  // Records State
  const [pendingApps, setPendingApps] = useState<PendingDocumentRecord[]>(MOCK_PENDING_DOCUMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Popup Modal State
  const [activeModalApp, setActiveModalApp] = useState<PendingDocumentRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // Extend Deadline Modal State
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendTargetApp, setExtendTargetApp] = useState<PendingDocumentRecord | null>(null);
  const [newDeadlineDate, setNewDeadlineDate] = useState("2026-08-15");

  // New Note State
  const [newNoteText, setNewNoteText] = useState("");

  // Edit Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState<PendingDocumentRecord | null>(null);

  const [formData, setFormData] = useState({
    applicantName: "",
    passportNumber: "",
    appliedBy: "Applicant" as "Applicant" | "Agent",
    agentName: "",
    country: "Canada",
    category: "Tourist",
    visaType: "eVisa",
    missingDocsInput: "",
    deadline: "2026-08-15",
    status: "Pending Upload" as PendingDocumentRecord["status"]
  });

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredApps = pendingApps.filter((app) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      app.appId.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      app.passportNumber.toLowerCase().includes(q) ||
      (app.agentName && app.agentName.toLowerCase().includes(q)) ||
      app.country.toLowerCase().includes(q);

    const matchesAppliedBy = appliedByFilter === "All" || app.appliedBy === appliedByFilter;
    const matchesCountry = countryFilter === "All" || app.country === countryFilter;
    const matchesCategory = categoryFilter === "All" || app.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;

    return matchesQuery && matchesAppliedBy && matchesCountry && matchesCategory && matchesStatus;
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
  const handleSendReminder = (app: PendingDocumentRecord) => {
    setPendingApps((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, reminderSentCount: a.reminderSentCount + 1 } : a))
    );
    triggerToast(`Email reminder sent to ${app.applicantName} (${app.email}).`);
  };

  const handleMarkVerified = (app: PendingDocumentRecord) => {
    setPendingApps((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Documents Verified" } : a))
    );
    triggerToast(`Pending documents for ${app.appId} verified!`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, status: "Documents Verified" } : null));
    }
  };

  const handleDeleteRecord = (app: PendingDocumentRecord) => {
    setPendingApps((prev) => prev.filter((a) => a.id !== app.id));
    triggerToast(`Pending document record ${app.appId} deleted.`);
    if (activeModalApp?.id === app.id) setActiveModalApp(null);
  };

  const handleOpenExtend = (app: PendingDocumentRecord) => {
    setExtendTargetApp(app);
    setShowExtendModal(true);
  };

  const handleConfirmExtend = () => {
    if (!extendTargetApp) return;
    setPendingApps((prev) =>
      prev.map((a) => (a.id === extendTargetApp.id ? { ...a, deadline: newDeadlineDate } : a))
    );
    triggerToast(`Deadline for ${extendTargetApp.appId} extended to ${newDeadlineDate}.`);
    if (activeModalApp?.id === extendTargetApp.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, deadline: newDeadlineDate } : null));
    }
    setShowExtendModal(false);
    setExtendTargetApp(null);
  };

  const handleAddNote = () => {
    if (!newNoteText || !activeModalApp) return;
    const noteObj = {
      id: Date.now().toString(),
      author: activeModalApp.requestedBy || "Admin",
      text: newNoteText,
      date: new Date().toLocaleString()
    };
    const updatedNotes = [...(activeModalApp.actionNotes || []), noteObj];
    setActiveModalApp({ ...activeModalApp, actionNotes: updatedNotes });
    setPendingApps((prev) =>
      prev.map((a) => (a.id === activeModalApp.id ? { ...a, actionNotes: updatedNotes } : a))
    );
    setNewNoteText("");
    triggerToast("Note added to pending document record.");
  };

  const handleBulkReminder = () => {
    setPendingApps((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, reminderSentCount: a.reminderSentCount + 1 } : a))
    );
    triggerToast(`Reminders sent to ${selectedIds.length} applicants.`);
    setSelectedIds([]);
  };

  const handleSaveApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.passportNumber) {
      triggerToast("Applicant Name and Passport Number are required.");
      return;
    }

    const missingDocsArray = formData.missingDocsInput
      ? formData.missingDocsInput.split(",").map((s) => s.trim())
      : ["Bank Statement"];

    if (editingApp) {
      setPendingApps((prev) =>
        prev.map((a) =>
          a.id === editingApp.id
            ? {
                ...a,
                applicantName: formData.applicantName,
                passportNumber: formData.passportNumber,
                appliedBy: formData.appliedBy,
                agentName: formData.agentName,
                country: formData.country,
                category: formData.category,
                visaType: formData.visaType,
                missingDocs: missingDocsArray,
                deadline: formData.deadline,
                status: formData.status
              }
            : a
        )
      );
      triggerToast(`Pending document request for ${editingApp.appId} updated.`);
    }

    setShowAddModal(false);
    setEditingApp(null);
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
            <AlertTriangle size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Applicant Document Deficiencies & Query Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Pending Documents
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Monitor and manage applications with missing, incomplete, or rejected documents awaiting applicant submission.
          </p>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Pending Documents</span>
            <div className="text-2xl font-black text-slate-900 font-mono">210</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Incomplete Applications</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Missing Documents</span>
            <div className="text-2xl font-black text-slate-900 font-mono">127</div>
            <span className="text-[10px] text-amber-600 font-bold">Awaiting Upload</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Additional Requested</span>
            <div className="text-2xl font-black text-slate-900 font-mono">83</div>
            <span className="text-[10px] text-purple-600 font-bold">Officer Queries Sent</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Re-uploaded Documents</span>
            <div className="text-2xl font-black text-slate-900 font-mono">52</div>
            <span className="text-[10px] text-blue-600 font-bold">Fresh Submissions</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Overdue Documents</span>
            <div className="text-2xl font-black text-slate-900 font-mono">23</div>
            <span className="text-[10px] text-red-600 font-bold">Deadline Expired</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Pending Verification</span>
            <div className="text-2xl font-black text-slate-900 font-mono">32</div>
            <span className="text-[10px] text-emerald-600 font-bold">Ready for Re-Audit</span>
          </div>
        </div>

        {/* RIGHT CARD: RECOMMENDED TABS & WORKFLOW FLOW (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Document Deficiency Workflow
            </h3>
            <div className="space-y-1 text-[11px] text-slate-700 font-medium">
              {PENDING_DOCS_WORKFLOW_STEPS.map((step, idx) => (
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Deficiency Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredApps.length} of {pendingApps.length} Pending Document Records
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
                placeholder="APP-20263001, Geeta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
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

          {/* DOCUMENT STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Document Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Pending Upload">Pending Upload</option>
              <option value="Additional Documents Requested">Additional Requested</option>
              <option value="Overdue">Overdue</option>
              <option value="Documents Verified">Documents Verified</option>
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
            <span>Pending Document Items Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkReminder}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Send size={14} /> Send Email Reminder
            </button>
            <button
              onClick={() => triggerToast(`Extending deadline for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Clock size={14} /> Extend Deadline
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

      {/* PENDING DOCUMENTS TABLE */}
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
                <th className="py-3.5 px-4">Missing Documents</th>
                <th className="py-3.5 px-4 font-mono">Requested Date</th>
                <th className="py-3.5 px-4 font-mono">Deadline</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <AlertTriangle size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No pending document records found matching your filters.</p>
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
                    <td className="py-3.5 px-4 font-bold text-amber-700">
                      {a.missingDocs.join(", ")}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {a.requestedDate}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-red-600">
                      {a.deadline}
                    </td>
                    <td className="py-3.5 px-4">
                      {a.status === "Documents Verified" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          🟢 Documents Verified
                        </span>
                      ) : a.status === "Overdue" ? (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                          🔴 Overdue
                        </span>
                      ) : a.status === "Additional Documents Requested" ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-200">
                          🟠 Additional Requested
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-200">
                          🟡 Pending Upload
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
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleSendReminder(a)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Send Email Reminder"
                        >
                          <Send size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenExtend(a)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title="Extend Deadline"
                        >
                          <Clock size={15} />
                        </button>
                        <button
                          onClick={() => handleMarkVerified(a)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Mark Verified"
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
          <div>Showing 1–10 of 210 Pending Document Records</div>
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

      {/* CENTERED POPUP DETAILS MODAL (9 RECOMMENDED TABS FROM WIREFRAME CATALOG) */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalApp.applicantName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
                      {activeModalApp.appId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activeModalApp.country} &bull; Deadline: <strong className="text-red-300">{activeModalApp.deadline}</strong> &bull; Requested By: {activeModalApp.requestedBy}</p>
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
              {RECOMMENDED_PENDING_DOCS_TABS.map((tab) => {
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
                      Pending Document Request Overview
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Application ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalApp.appId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Applicant Name</span>
                        <strong className="text-slate-900 font-bold">{activeModalApp.applicantName}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Deadline Date</span>
                        <strong className="text-red-600 font-mono font-bold">{activeModalApp.deadline}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Reminders Sent</span>
                        <strong className="text-purple-600 font-mono font-bold">{activeModalApp.reminderSentCount} Sent</strong>
                      </div>
                    </div>
                  </div>

                  {/* PENDING DOCUMENTS CHECKLIST LIST (FROM WIREFRAME) */}
                  <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <AlertTriangle size={16} className="text-amber-600" /> Pending & Deficient Document List
                    </h4>
                    <div className="space-y-2 text-xs font-bold text-amber-900">
                      {activeModalApp.missingDocs.map((doc, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <span className="text-red-500">☒</span> {doc}
                          </span>
                          <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-extrabold">Missing</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: ACTION NOTES */}
              {modalTab === "Action Notes" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Reviewer Notes & Query History
                  </h4>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto [scrollbar-width:thin]">
                    {(activeModalApp.actionNotes || []).length === 0 ? (
                      <p className="text-slate-400 text-xs italic">No notes recorded yet.</p>
                    ) : (
                      activeModalApp.actionNotes?.map((note) => (
                        <div key={note.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span className="font-bold text-[#2563EB]">{note.author}</span>
                            <span>{note.date}</span>
                          </div>
                          <p className="text-slate-800 text-xs font-medium">{note.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <input
                      type="text"
                      placeholder="Add query note..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold cursor-pointer"
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSendReminder(activeModalApp)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Send size={15} /> Send Email Reminder
                </button>
                <button
                  onClick={() => handleMarkVerified(activeModalApp)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> Verify Documents
                </button>
              </div>

              <button
                onClick={() => handleOpenExtend(activeModalApp)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Clock size={14} /> Extend Deadline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXTEND DEADLINE MODAL */}
      {showExtendModal && extendTargetApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-black text-slate-900 font-outfit flex items-center gap-2">
              <Clock size={18} className="text-amber-600" />
              <span>Extend Deadline: {extendTargetApp.appId}</span>
            </h3>

            <div className="space-y-2 text-xs">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 block">Select New Submission Deadline</label>
              <input
                type="date"
                value={newDeadlineDate}
                onChange={(e) => setNewDeadlineDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-800"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setShowExtendModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExtend}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl shadow-lg"
              >
                Confirm New Deadline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
