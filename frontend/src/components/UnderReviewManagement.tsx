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
  UserPlus,
  Mail,
  Phone,
  BarChart2,
  Users,
  ShieldAlert,
  FileCheck
} from "lucide-react";

export interface UnderReviewRecord {
  id: string;
  appId: string;
  applicantName: string;
  passportNumber: string;
  country: string;
  category: string;
  visaType: string;
  assignedOfficer: string;
  reviewStage:
    | "Document Audit"
    | "Payment Verification"
    | "Background Check"
    | "Embassy Compliance"
    | "Final Review";
  documentsStatus: "Complete" | "Missing (1)" | "Missing (2+)";
  reviewDate: string;
  priority: "Normal" | "High" | "Urgent";
  status: "Under Review" | "Doc Pending" | "Ready for Approval" | "Rejected";
  // Detail fields
  dob?: string;
  gender?: string;
  nationality?: string;
  email?: string;
  phone?: string;
  purposeOfVisit?: string;
  travelDate?: string;
  reviewChecklist: {
    verifyIdentityDocs: boolean;
    financialVerification: boolean;
    employmentVerification: boolean;
    travelHistoryVerification: boolean;
    policeBackgroundCheck: boolean;
    finalApprovalReview: boolean;
  };
  submittedDocs: { name: string; status: "Verified" | "Missing" | "Pending" }[];
  reviewNotes: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_UNDER_REVIEW_TABS = [
  "Overview",
  "Applicant Details",
  "Visa Details",
  "Verification Checklist",
  "Verification Notes",
  "Decision Stream",
  "Communication",
  "Activity Logs"
];

export const REVIEW_WORKFLOW_STEPS = [
  "Application Submitted",
  "Initial Verification",
  "Under Review (Document Audit)",
  "Financial Verification",
  "Background Check",
  "Embassy Compliance Audit",
  "Ready for Approval",
  "Approval / Rejection"
];

const MOCK_UNDER_REVIEW: UnderReviewRecord[] = [
  {
    id: "1",
    appId: "APP-20263001",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    country: "Canada",
    category: "Tourist",
    visaType: "eVisa",
    assignedOfficer: "Amardeep Sen",
    reviewStage: "Document Audit",
    documentsStatus: "Complete",
    reviewDate: "01 Jul 2026",
    priority: "Normal",
    status: "Under Review",
    dob: "1994-08-12",
    gender: "Female",
    nationality: "Indian",
    email: "geeta.bisht@gmail.com",
    phone: "+91 98123 45678",
    purposeOfVisit: "Vacation Tour",
    travelDate: "2026-09-20",
    reviewChecklist: {
      verifyIdentityDocs: true,
      financialVerification: true,
      employmentVerification: true,
      travelHistoryVerification: false,
      policeBackgroundCheck: false,
      finalApprovalReview: false
    },
    submittedDocs: [
      { name: "Passport Bio Page", status: "Verified" },
      { name: "Photograph", status: "Verified" },
      { name: "Bank Statement", status: "Verified" },
      { name: "Travel Insurance", status: "Verified" },
      { name: "Flight Reservation", status: "Verified" },
      { name: "Hotel Booking", status: "Verified" },
      { name: "Cover Letter", status: "Verified" }
    ],
    reviewNotes: [
      { id: "n1", author: "Amardeep Sen", text: "Identity documents match passport record.", date: "01 Jul 2026 11:30 AM" }
    ]
  },
  {
    id: "2",
    appId: "APP-20263002",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    country: "Australia",
    category: "Student",
    visaType: "Sticker Visa",
    assignedOfficer: "Devender Sharma",
    reviewStage: "Background Check",
    documentsStatus: "Complete",
    reviewDate: "02 Jul 2026",
    priority: "High",
    status: "Under Review",
    dob: "1999-02-15",
    gender: "Male",
    nationality: "Indian",
    email: "rahul.sharma@outlook.com",
    phone: "+91 91234 56789",
    purposeOfVisit: "University Education",
    travelDate: "2026-10-01",
    reviewChecklist: {
      verifyIdentityDocs: true,
      financialVerification: true,
      employmentVerification: true,
      travelHistoryVerification: true,
      policeBackgroundCheck: true,
      finalApprovalReview: false
    },
    submittedDocs: [
      { name: "Passport Bio Page", status: "Verified" },
      { name: "Admission CoE", status: "Verified" },
      { name: "PCC Clearance", status: "Verified" }
    ],
    reviewNotes: [
      { id: "n2", author: "Devender Sharma", text: "Police clearance verified via Interpol database.", date: "02 Jul 2026 03:00 PM" }
    ]
  },
  {
    id: "3",
    appId: "APP-20263003",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    country: "UAE",
    category: "Business",
    visaType: "Multiple Entry",
    assignedOfficer: "Sunil Solanki",
    reviewStage: "Final Review",
    documentsStatus: "Missing (1)",
    reviewDate: "03 Aug 2026",
    priority: "Urgent",
    status: "Doc Pending",
    dob: "1988-06-25",
    gender: "Male",
    nationality: "Indian",
    email: "bikram.s@techsolutions.com",
    phone: "+91 99887 76655",
    purposeOfVisit: "Business Summit",
    travelDate: "2026-08-12",
    reviewChecklist: {
      verifyIdentityDocs: true,
      financialVerification: true,
      employmentVerification: false,
      travelHistoryVerification: true,
      policeBackgroundCheck: true,
      finalApprovalReview: false
    },
    submittedDocs: [
      { name: "Passport Bio Page", status: "Verified" },
      { name: "Company Cover Letter", status: "Missing" },
      { name: "UAE Sponsor Letter", status: "Verified" }
    ],
    reviewNotes: [
      { id: "n3", author: "Sunil Solanki", text: "Requested updated company cover letter.", date: "03 Aug 2026 09:15 AM" }
    ]
  }
];

export default function UnderReviewManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewStageFilter, setReviewStageFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [assignedFilter, setAssignedFilter] = useState("All");

  // Records State
  const [underReviewList, setUnderReviewList] = useState<UnderReviewRecord[]>(MOCK_UNDER_REVIEW);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Popup Modal State
  const [activeModalApp, setActiveModalApp] = useState<UnderReviewRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // New Note State
  const [newNoteText, setNewNoteText] = useState("");

  // Edit Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState<UnderReviewRecord | null>(null);

  const [formData, setFormData] = useState({
    applicantName: "",
    passportNumber: "",
    country: "Canada",
    category: "Tourist",
    visaType: "eVisa",
    assignedOfficer: "Amardeep Sen",
    reviewStage: "Document Audit" as UnderReviewRecord["reviewStage"],
    priority: "Normal" as "Normal" | "High" | "Urgent",
    status: "Under Review" as UnderReviewRecord["status"]
  });

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredApps = underReviewList.filter((app) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      app.appId.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      app.passportNumber.toLowerCase().includes(q) ||
      app.assignedOfficer.toLowerCase().includes(q) ||
      app.country.toLowerCase().includes(q);

    const matchesStage = reviewStageFilter === "All" || app.reviewStage === reviewStageFilter;
    const matchesCategory = categoryFilter === "All" || app.category === categoryFilter;
    const matchesPriority = priorityFilter === "All" || app.priority === priorityFilter;

    return matchesQuery && matchesStage && matchesCategory && matchesPriority;
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
  const handleMarkReadyForApproval = (app: UnderReviewRecord) => {
    setUnderReviewList((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Ready for Approval" } : a))
    );
    triggerToast(`Application ${app.appId} marked as Ready for Approval!`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, status: "Ready for Approval" } : null));
    }
  };

  const handleRejectApp = (app: UnderReviewRecord) => {
    setUnderReviewList((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Rejected" } : a))
    );
    triggerToast(`Application ${app.appId} rejected.`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, status: "Rejected" } : null));
    }
  };

  const handleDeleteRecord = (app: UnderReviewRecord) => {
    setUnderReviewList((prev) => prev.filter((a) => a.id !== app.id));
    triggerToast(`Review record ${app.appId} deleted.`);
    if (activeModalApp?.id === app.id) setActiveModalApp(null);
  };

  const handleToggleChecklist = (field: keyof UnderReviewRecord["reviewChecklist"]) => {
    if (!activeModalApp) return;
    const updatedChecklist = {
      ...activeModalApp.reviewChecklist,
      [field]: !activeModalApp.reviewChecklist[field]
    };
    setActiveModalApp({ ...activeModalApp, reviewChecklist: updatedChecklist });
    setUnderReviewList((prev) =>
      prev.map((a) => (a.id === activeModalApp.id ? { ...a, reviewChecklist: updatedChecklist } : a))
    );
    triggerToast("Review checklist updated.");
  };

  const handleAddNote = () => {
    if (!newNoteText || !activeModalApp) return;
    const noteObj = {
      id: Date.now().toString(),
      author: activeModalApp.assignedOfficer,
      text: newNoteText,
      date: new Date().toLocaleString()
    };
    const updatedNotes = [...(activeModalApp.reviewNotes || []), noteObj];
    setActiveModalApp({ ...activeModalApp, reviewNotes: updatedNotes });
    setUnderReviewList((prev) =>
      prev.map((a) => (a.id === activeModalApp.id ? { ...a, reviewNotes: updatedNotes } : a))
    );
    setNewNoteText("");
    triggerToast("Reviewer note added.");
  };

  const handleBulkMarkReady = () => {
    setUnderReviewList((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, status: "Ready for Approval" } : a))
    );
    triggerToast(`${selectedIds.length} applications marked as Ready for Approval.`);
    setSelectedIds([]);
  };

  const handleSaveApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.passportNumber) {
      triggerToast("Applicant Name and Passport Number are required.");
      return;
    }

    if (editingApp) {
      setUnderReviewList((prev) =>
        prev.map((a) =>
          a.id === editingApp.id
            ? {
                ...a,
                applicantName: formData.applicantName,
                passportNumber: formData.passportNumber,
                country: formData.country,
                category: formData.category,
                visaType: formData.visaType,
                assignedOfficer: formData.assignedOfficer,
                reviewStage: formData.reviewStage,
                priority: formData.priority,
                status: formData.status
              }
            : a
        )
      );
      triggerToast(`Review record ${editingApp.appId} updated.`);
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
            <ShieldCheck size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Active Verification & Document Compliance Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Under Review
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Monitor and process visa applications undergoing active verification prior to final decision.
          </p>
        </div>
      </div>

      {/* TOP STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Applications Under Review</span>
            <div className="text-2xl font-black text-slate-900 font-mono">334</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Active Audit Stream</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Documents Verified</span>
            <div className="text-2xl font-black text-slate-900 font-mono">240</div>
            <span className="text-[10px] text-emerald-600 font-bold">Checklist Cleared</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Doc Requested</span>
            <div className="text-2xl font-black text-slate-900 font-mono">34</div>
            <span className="text-[10px] text-amber-600 font-bold">Missing Files Query</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Pending Decisions</span>
            <div className="text-2xl font-black text-slate-900 font-mono">60</div>
            <span className="text-[10px] text-purple-600 font-bold">Final Signature Ready</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Average Review Time</span>
            <div className="text-2xl font-black text-slate-900 font-mono">2.5 Days</div>
            <span className="text-[10px] text-blue-600 font-bold">Turnaround Speed</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">High Priority Cases</span>
            <div className="text-2xl font-black text-slate-900 font-mono">24</div>
            <span className="text-[10px] text-red-600 font-bold">Express Queue</span>
          </div>
        </div>

        {/* RIGHT CARD: RECOMMENDED TABS & WORKFLOW FLOW (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Review Workflow Stages
            </h3>
            <div className="space-y-1 text-[11px] text-slate-700 font-medium">
              {REVIEW_WORKFLOW_STEPS.map((step, idx) => (
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Verification Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredApps.length} of {underReviewList.length} Under Review Applications
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search By (ID, Applicant, Officer, Country)
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

          {/* REVIEW STAGE */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Review Stage
            </label>
            <select
              value={reviewStageFilter}
              onChange={(e) => setReviewStageFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Stages</option>
              <option value="Document Audit">Document Audit</option>
              <option value="Payment Verification">Payment Verification</option>
              <option value="Background Check">Background Check</option>
              <option value="Final Review">Final Review</option>
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

          {/* PRIORITY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Priority Tier
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Priorities</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
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
            <span>Under Review Items Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkMarkReady}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 size={14} /> Mark Ready for Approval
            </button>
            <button
              onClick={() => triggerToast(`Requesting additional docs for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <AlertCircle size={14} /> Request Documents
            </button>
            <button
              onClick={() => triggerToast(`Generating report for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Audit Report
            </button>
          </div>
        </div>
      )}

      {/* UNDER REVIEW TABLE */}
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
                <th className="py-3.5 px-4">Assigned Officer</th>
                <th className="py-3.5 px-4 font-mono">Review Stage</th>
                <th className="py-3.5 px-4">Documents</th>
                <th className="py-3.5 px-4 font-mono">Review Date</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    <ShieldCheck size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No applications under review matching your filters.</p>
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
                      {a.assignedOfficer}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-purple-700 font-bold">
                      {a.reviewStage}
                    </td>
                    <td className="py-3.5 px-4">
                      {a.documentsStatus === "Complete" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                          ✓ Complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200">
                          ⚠️ {a.documentsStatus}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {a.reviewDate}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        a.priority === "Urgent" ? "bg-red-50 text-red-600 border border-red-200" :
                        a.priority === "High" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-slate-100 text-slate-600"
                      }`}>
                        {a.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {a.status === "Ready for Approval" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          🟢 Ready for Approval
                        </span>
                      ) : a.status === "Doc Pending" ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-200">
                          🟠 Doc Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-blue-200">
                          🔵 Under Review
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
                          title="View Details & Review Checklist"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleMarkReadyForApproval(a)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Mark Ready for Approval"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => handleRejectApp(a)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Reject Application"
                        >
                          <XCircle size={15} />
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
          <div>Showing 1–10 of 334 Applications Under Review</div>
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

      {/* CENTERED POPUP DETAILS MODAL (8 RECOMMENDED TABS & INTERACTIVE REVIEW CHECKLIST FROM WIREFRAME) */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <ShieldCheck size={20} />
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
                  <p className="text-xs text-slate-400">{activeModalApp.country} &bull; Stage: <strong className="text-purple-300">{activeModalApp.reviewStage}</strong> &bull; Reviewer: {activeModalApp.assignedOfficer}</p>
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
              {RECOMMENDED_UNDER_REVIEW_TABS.map((tab) => {
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
              {/* TAB 1: OVERVIEW & REVIEW CHECKLIST */}
              {modalTab === "Overview" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* OVERVIEW TILES */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">
                      Review Verification Overview
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
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Review Stage</span>
                        <strong className="text-purple-600 font-bold">{activeModalApp.reviewStage}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Reviewer</span>
                        <strong className="text-slate-900 font-bold">{activeModalApp.assignedOfficer}</strong>
                      </div>
                    </div>
                  </div>

                  {/* INTERACTIVE REVIEW CHECKLIST (FROM WIREFRAME) */}
                  <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <CheckSquare size={16} className="text-[#2563EB]" /> Official Review Checklist
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-semibold text-slate-800">
                      {[
                        { key: "verifyIdentityDocs", label: "Verify Identity Documents" },
                        { key: "financialVerification", label: "Financial Verification" },
                        { key: "employmentVerification", label: "Employment Verification" },
                        { key: "travelHistoryVerification", label: "Travel History Verification" },
                        { key: "policeBackgroundCheck", label: "Police & Background Check" },
                        { key: "finalApprovalReview", label: "Final Approval Review" }
                      ].map((item) => {
                        const checked = activeModalApp.reviewChecklist[item.key as keyof UnderReviewRecord["reviewChecklist"]];
                        return (
                          <label key={item.key} className="flex items-center gap-2.5 cursor-pointer p-2.5 bg-white rounded-xl border border-blue-100 hover:border-blue-300 transition">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleChecklist(item.key as any)}
                              className="rounded border-slate-300 text-[#2563EB]"
                            />
                            <span className={checked ? "line-through text-slate-400" : "text-slate-800"}>
                              {item.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: VERIFICATION NOTES */}
              {modalTab === "Verification Notes" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Reviewer Notes Stream
                  </h4>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto [scrollbar-width:thin]">
                    {(activeModalApp.reviewNotes || []).length === 0 ? (
                      <p className="text-slate-400 text-xs italic">No reviewer notes recorded yet.</p>
                    ) : (
                      activeModalApp.reviewNotes?.map((note) => (
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
                      placeholder="Add reviewer audit note..."
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
                  onClick={() => handleMarkReadyForApproval(activeModalApp)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> Mark Ready for Approval
                </button>
                <button
                  onClick={() => handleRejectApp(activeModalApp)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <XCircle size={15} /> Reject Application
                </button>
              </div>

              <button
                onClick={() => {
                  setEditingApp(activeModalApp);
                  setShowAddModal(true);
                }}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 size={14} /> Edit Audit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
