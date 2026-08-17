import React, { useState, useEffect } from "react";
import {
  XCircle,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Check,
  X,
  Sparkles,
  User,
  CreditCard,
  Building,
  Calendar,
  Clock,
  Send,
  Printer,
  ShieldCheck,
  Tag,
  AlertTriangle,
  Mail,
  Phone,
  Ban,
  RotateCcw,
  FileX,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  RefreshCw,
  FileCheck
} from "lucide-react";
import { useVisa } from "../context/VisaContext";

export interface RejectedApplicationRecord {
  id: string;
  appId: string;
  refusalCode: string;
  applicantName: string;
  passportNumber: string;
  appliedBy: "Applicant" | "Agent";
  agentName?: string;
  country: string;
  category: string;
  visaType: string;
  rejectionReason:
    | "Insufficient Financial Proof"
    | "Incomplete / Fraudulent Documents"
    | "Travel Purpose Unclear"
    | "Past Overstay History"
    | "Security & Background Check"
    | "Embassy Discretion"
    | "Insufficient Documentation";
  rejectedBy: string;
  rejectedDate: string;
  rejectedTime: string;
  reApplyAllowed: boolean;
  appealEligibility: "Eligible for Appeal" | "Non-Appealable" | "Appeal Under Review" | "Re-Application Submitted";
  coolingPeriodDays: number;
  detailedRemarks: string;
  amountPaid: string;
  transactionId: string;
  status: "Rejected" | "Allowing Re-Application" | "Permanently Refused";
  // Deep detail fields
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  residenceCountry?: string;
  email?: string;
  phone?: string;
  address?: string;
  cityState?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  passportIssuingAuthority?: string;
  passportPlaceOfIssue?: string;
  travelDate?: string;
  expectedDepartureDate?: string;
  durationOfStay?: string;
  purposeOfVisit?: string;
  portOfEntry?: string;
  accommodationDetails?: string;
  occupation?: string;
  employerName?: string;
  annualIncome?: string;
  sponsorType?: string;
  embassyRefId?: string;
  uploadedDocs: { name: string; status: "Rejected" | "Incomplete" | "Verified"; reason?: string }[];
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_REJECTED_TABS = [
  "Overview",
  "Official Refusal Letter",
  "Applicant & Passport",
  "Visa & Travel",
  "Refusal Grounds & Risk Analysis",
  "Uploaded Documents",
  "Payment & Invoice",
  "Appeal & Re-Application",
  "Consular Audit Log & Notes"
];

export const REJECTION_WORKFLOW_STEPS = [
  "Application Rejected by Embassy",
  "Refusal Grounds & Code Categorized",
  "Official Refusal Letter Generated",
  "Applicant Notified with Grounds",
  "Appeal / Review Request Evaluated",
  "Re-Application / Closed Archive"
];

const MOCK_REJECTED_APPLICATIONS: RejectedApplicationRecord[] = [];

function fontBoolean(val: boolean) {
  return val;
}

export default function RejectedApplicationsManagement() {
  const { applications: contextApps, authSession } = useVisa();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectionReasonFilter, setRejectionReasonFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [appliedByFilter, setAppliedByFilter] = useState("All");
  const [appealFilter, setAppealFilter] = useState("All");

  // Records State
  const [rejectedList, setRejectedList] = useState<RejectedApplicationRecord[]>([]);

  useEffect(() => {
    if (Array.isArray(contextApps)) {
      const rejected = contextApps.filter((a: any) => a.status === "Rejected");
      const mapped: RejectedApplicationRecord[] = rejected.map((app: any) => ({
        id: app.id || app._id || String(Math.random()),
        appId: app.id || app.applicationId || "VO-2026-9001",
        refusalCode: "SEC-214B-FIN",
        applicantName: app.travelerName || (app.personalDetails ? `${app.personalDetails.givenName} ${app.personalDetails.surname}` : "Applicant"),
        firstName: app.personalDetails?.givenName || app.travelerName?.split(" ")[0] || "Applicant",
        lastName: app.personalDetails?.surname || app.travelerName?.split(" ").slice(1).join(" ") || "",
        passportNumber: app.passportNumber || app.passportDetails?.passportNo || "Z9876543",
        appliedBy: app.appliedBy || "Applicant",
        country: app.destination || app.countryName || "Canada",
        category: app.visaType?.includes("Tourist") ? "Tourist" : app.visaType?.includes("Student") ? "Student" : "Business",
        visaType: app.visaType || "Tourist Visa",
        rejectionReason: "Insufficient Documentation",
        rejectedBy: authSession?.user?.name ? `${authSession.user.name} (Consular Officer)` : "Consular Officer",
        rejectedDate: app.submissionDate || "01 Aug 2026",
        rejectedTime: "11:30 AM",
        reApplyAllowed: true,
        appealEligibility: "Eligible for Appeal",
        coolingPeriodDays: 15,
        detailedRemarks: "Applicant documentation did not meet embassy requirements.",
        amountPaid: `₹${app.fees || 12350}`,
        transactionId: "TXN-9988112",
        status: "Rejected",
        dob: app.dob || "1994-08-12",
        gender: "Female",
        maritalStatus: "Single",
        nationality: app.nationality || "Indian",
        residenceCountry: "India",
        email: app.email || "",
        phone: app.phone || "",
        address: app.address || "",
        cityState: "New Delhi, Delhi",
        passportIssueDate: "15 Jan 2020",
        passportExpiryDate: app.passportExpiry || "14 Jan 2030",
        passportIssuingAuthority: "Passport Office New Delhi",
        passportPlaceOfIssue: "New Delhi",
        travelDate: app.travelDates || "2026-09-20",
        expectedDepartureDate: "2026-10-15",
        durationOfStay: "25 Days",
        purposeOfVisit: "Tourism",
        portOfEntry: "YYZ",
        accommodationDetails: "Hotel",
        occupation: "Professional",
        employerName: "TechCorp Global",
        annualIncome: "₹6,50,000 INR",
        sponsorType: "Self Sponsored",
        embassyRefId: "CAN-REF-88190",
        uploadedDocs: Array.isArray(app.uploadedDocuments) && app.uploadedDocuments.length > 0
          ? app.uploadedDocuments.map((d: any) => ({
              name: d.title || d.fileName || "Document",
              status: "Rejected",
              reason: "Document rejected during embassy review"
            }))
          : [],
        actionNotes: []
      }));
      setRejectedList(mapped);
    }
  }, [contextApps, authSession]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalApp, setActiveModalApp] = useState<RejectedApplicationRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // Note Input inside Modal
  const [newNoteText, setNewNoteText] = useState("");

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
      app.refusalCode.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      app.passportNumber.toLowerCase().includes(q) ||
      app.rejectedBy.toLowerCase().includes(q) ||
      app.country.toLowerCase().includes(q);

    const matchesReason = rejectionReasonFilter === "All" || app.rejectionReason === rejectionReasonFilter;
    const matchesCountry = countryFilter === "All" || app.country === countryFilter;
    const matchesCategory = categoryFilter === "All" || app.category === categoryFilter;
    const matchesAppliedBy = appliedByFilter === "All" || app.appliedBy === appliedByFilter;
    const matchesAppeal = appealFilter === "All" || app.appealEligibility === appealFilter;

    return matchesQuery && matchesReason && matchesCountry && matchesCategory && matchesAppliedBy && matchesAppeal;
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
  const handleInviteReapplication = (app: RejectedApplicationRecord) => {
    setRejectedList((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Allowing Re-Application" } : a))
    );
    triggerToast(`Re-application invite link sent to ${app.applicantName} (${app.email})`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, status: "Allowing Re-Application" } : null));
    }
  };

  const handleReopenAppeal = (app: RejectedApplicationRecord) => {
    setRejectedList((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, appealEligibility: "Appeal Under Review" } : a))
    );
    triggerToast(`Application ${app.appId} re-opened for consular appeal review.`);
    if (activeModalApp?.id === app.id) {
      setActiveModalApp((prev) => (prev ? { ...prev, appealEligibility: "Appeal Under Review" } : null));
    }
  };

  const handleDeleteRecord = (app: RejectedApplicationRecord) => {
    setRejectedList((prev) => prev.filter((a) => a.id !== app.id));
    triggerToast(`Refusal record ${app.appId} removed.`);
    if (activeModalApp?.id === app.id) setActiveModalApp(null);
  };

  const handleBulkReappInvite = () => {
    setRejectedList((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, status: "Allowing Re-Application" } : a))
    );
    triggerToast(`Re-application invites sent to ${selectedIds.length} applicants.`);
    setSelectedIds([]);
  };

  const handleAddNote = () => {
    if (!newNoteText || !activeModalApp) return;
    const noteObj = {
      id: Date.now().toString(),
      author: "Consular Officer (Vibhu)",
      text: newNoteText,
      date: new Date().toLocaleString()
    };
    const updatedNotes = [...(activeModalApp.actionNotes || []), noteObj];
    setActiveModalApp({ ...activeModalApp, actionNotes: updatedNotes });
    setRejectedList((prev) =>
      prev.map((a) => (a.id === activeModalApp.id ? { ...a, actionNotes: updatedNotes } : a))
    );
    setNewNoteText("");
    triggerToast("Refusal audit note added successfully.");
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#0E1A2C] border border-red-500/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
            <XCircle size={18} />
          </div>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-[#991B1B] via-[#DC2626] to-[#EF4444] text-white p-6 rounded-3xl shadow-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-red-700">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-red-200 mb-1">
            <ShieldAlert size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Consular Visa Refusal & Appeal Registry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Rejected Applications
          </h1>
          <p className="text-xs text-red-100 font-medium mt-1">
            Audit consular refusal decisions, issue official refusal notices, analyze rejection grounds, and process re-application invites.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => triggerToast("Generating batch PDF package of all official refusal letters...")}
            className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <Download size={14} /> Batch Refusal Letters
          </button>
          <button
            onClick={() => triggerToast("Launching re-application assistance workflow...")}
            className="px-4 py-2 bg-slate-900/40 hover:bg-slate-900/60 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <RotateCcw size={14} /> Re-Application Portal
          </button>
        </div>
      </div>

      {/* TOP STATISTICS CARDS & RIGHT LIFECYCLE CARD (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 7 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Refused Visas</span>
            <div className="text-2xl font-black text-slate-900 font-mono">412</div>
            <span className="text-[10px] text-red-600 font-bold">Consular Refusals</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Rejections Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">3</div>
            <span className="text-[10px] text-red-600 font-bold">Today's Refusals</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Insufficient Funds</span>
            <div className="text-2xl font-black text-slate-900 font-mono">185</div>
            <span className="text-[10px] text-amber-600 font-bold">Financial Ground</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Incomplete Docs</span>
            <div className="text-2xl font-black text-slate-900 font-mono">120</div>
            <span className="text-[10px] text-purple-600 font-bold">Document Ground</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Purpose Unclear</span>
            <div className="text-2xl font-black text-slate-900 font-mono">75</div>
            <span className="text-[10px] text-blue-600 font-bold">GTE / Purpose Ground</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Eligible for Appeal</span>
            <div className="text-2xl font-black text-slate-900 font-mono">210</div>
            <span className="text-[10px] text-emerald-600 font-bold">Appeal Window Open</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition sm:col-span-2">
            <span className="text-[10px] font-extrabold uppercase text-emerald-700 block mb-1">Re-Applied & Approved</span>
            <div className="text-2xl font-black text-slate-900 font-mono">68 Cases</div>
            <span className="text-[10px] text-emerald-700 font-bold">Successful Appeals</span>
          </div>
        </div>

        {/* RIGHT CARD: REFUSAL & APPEAL WORKFLOW (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-red-600" /> Refusal & Appeal Workflow Steps
            </h3>
            <div className="space-y-1.5 text-[11px] text-slate-700 font-medium">
              {REJECTION_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-[10px] shrink-0">
                    ▼
                  </div>
                  <span className="font-semibold text-slate-800">{step}</span>
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
            <Filter size={16} className="text-red-600" /> Search & Refusal Audit Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredApps.length} of {rejectedList.length} Refused Applications
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (ID, Refusal Code, Applicant, Passport)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="SEC-214B..., Geeta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {/* PRIMARY REFUSAL GROUND */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Primary Refusal Ground
            </label>
            <select
              value={rejectionReasonFilter}
              onChange={(e) => setRejectionReasonFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Refusal Grounds</option>
              <option value="Insufficient Financial Proof">Insufficient Financial Proof</option>
              <option value="Incomplete / Fraudulent Documents">Incomplete Documents</option>
              <option value="Travel Purpose Unclear">Travel Purpose Unclear</option>
              <option value="Past Overstay History">Past Overstay History</option>
              <option value="Security & Background Check">Security Clearance</option>
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

          {/* APPEAL ELIGIBILITY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Appeal Eligibility
            </label>
            <select
              value={appealFilter}
              onChange={(e) => setAppealFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Appeal States</option>
              <option value="Eligible for Appeal">Eligible for Appeal</option>
              <option value="Non-Appealable">Non-Appealable</option>
              <option value="Appeal Under Review">Appeal Under Review</option>
              <option value="Re-Application Submitted">Re-Application Submitted</option>
            </select>
          </div>

          {/* APPLIED BY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Applied By Channel
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
        <div className="bg-[#0E1A2C] border border-red-500/40 text-white p-3.5 rounded-2xl shadow-xl mb-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center font-mono font-bold text-xs">
              {selectedIds.length}
            </span>
            <span>Refused Applications Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkReappInvite}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={14} /> Send Re-Application Invites
            </button>
            <button
              onClick={() => triggerToast(`Generating refusal notices for ${selectedIds.length} selected items.`)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <FileX size={14} /> Generate Refusal Letters
            </button>
            <button
              onClick={() => triggerToast(`Exporting refusal audit data for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Summary
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
                    className="rounded border-slate-300 text-red-600 focus:ring-red-600 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Application ID</th>
                <th className="py-3.5 px-4">Refusal Code</th>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Applied By</th>
                <th className="py-3.5 px-4">Country & Category</th>
                <th className="py-3.5 px-4 font-mono">Refusal Date</th>
                <th className="py-3.5 px-4">Primary Refusal Ground</th>
                <th className="py-3.5 px-4">Appeal Eligibility</th>
                <th className="py-3.5 px-4 font-mono text-center">Refusal Notice</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    <FileX size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No refused applications found matching your filters.</p>
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
                        className="rounded border-slate-300 text-red-600 focus:ring-red-600 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {a.appId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-red-700">
                      {a.refusalCode}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {a.applicantName}
                      <span className="block text-[10px] text-slate-400 font-mono font-normal">Passport: {a.passportNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {a.appliedBy === "Agent" ? (
                        <span className="text-purple-700 font-bold">Agent ({a.agentName})</span>
                      ) : (
                        <span className="text-slate-600">Self</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {a.country}
                      <span className="block text-[10px] text-slate-500 font-normal">{a.category} &bull; {a.visaType}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {a.rejectedDate} ({a.rejectedTime})
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-red-700">
                      {a.rejectionReason}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs">
                      {a.appealEligibility === "Eligible for Appeal" ? (
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
                      <button
                        onClick={() => triggerToast(`Downloading Official Refusal Letter for ${a.applicantName} (${a.refusalCode})...`)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        <Download size={12} /> Refusal PDF
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                        <XCircle size={11} /> Refused
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
                          title="View Details & Refusal Grounds"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleInviteReapplication(a)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Invite Re-Application"
                        >
                          <RotateCcw size={15} />
                        </button>
                        <button
                          onClick={() => handleReopenAppeal(a)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Re-Open Appeal Review"
                        >
                          <RefreshCw size={15} />
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
          <div>Showing 1-10 of 207 Rejected Applications</div>
          <div className="flex items-center gap-1 font-mono font-bold">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40">
              Previous
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded-lg">1</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">2</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">3</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CENTERED POPUP DETAILS MODAL (9 RECOMMENDED TABS FROM WIREFRAME) */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center font-bold text-lg text-white">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalApp.applicantName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-red-300 bg-red-900/50 px-2 py-0.5 rounded border border-red-700">
                      {activeModalApp.refusalCode}
                    </span>
                    <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded-full uppercase">
                      REFUSED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    App ID: <strong className="text-blue-300 font-mono">{activeModalApp.appId}</strong> &bull; {activeModalApp.country} &bull; {activeModalApp.category} ({activeModalApp.visaType})
                  </p>
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
                        ? "bg-red-600 text-white shadow-sm"
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
                  {/* 6-STAGE REFUSAL LIFECYCLE STEPPER */}
                  <div className="bg-red-50/50 border border-red-200 rounded-3xl p-4">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-3 flex items-center gap-2">
                      <Sparkles size={16} className="text-red-600" /> Refusal & Appeal Lifecycle Progress
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
                      {REJECTION_WORKFLOW_STEPS.map((stepName, sIdx) => (
                        <div key={sIdx} className="bg-white p-2.5 rounded-2xl border border-red-200 flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs mb-1">
                            <XCircle size={14} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-800 leading-tight">{stepName}</span>
                          <span className="text-[9px] text-red-700 font-bold mt-1">Refused</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* OVERVIEW TILES */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">
                      Core Refusal Overview
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Application ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalApp.appId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Refusal Clause Code</span>
                        <strong className="text-red-700 font-mono font-black">{activeModalApp.refusalCode}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Rejecting Consular Officer</span>
                        <strong className="text-slate-900 font-bold">{activeModalApp.rejectedBy}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Primary Refusal Ground</span>
                        <strong className="text-red-700 font-bold">{activeModalApp.rejectionReason}</strong>
                      </div>
                    </div>
                  </div>

                  {/* CONSULAR EVALUATION REMARKS */}
                  <div className="bg-red-50/60 border border-red-200 rounded-3xl p-5 space-y-2">
                    <h4 className="text-xs font-extrabold text-red-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <ShieldAlert size={16} className="text-red-600" /> Consular Officer Detailed Remarks
                    </h4>
                    <p className="text-xs text-red-950 font-medium leading-relaxed bg-white p-3.5 rounded-2xl border border-red-200">
                      "{activeModalApp.detailedRemarks}"
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: OFFICIAL REFUSAL LETTER */}
              {modalTab === "Official Refusal Letter" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white p-6 rounded-3xl shadow-xl border border-red-500/30 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400">
                          <FileX size={22} />
                        </div>
                        <div>
                          <h4 className="text-base font-black font-outfit text-white">
                            OFFICIAL CONSULAR REFUSAL NOTICE ({activeModalApp.country.toUpperCase()})
                          </h4>
                          <span className="text-xs text-red-300 font-mono">Refusal Ref: {activeModalApp.refusalCode}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-red-600 text-white font-black rounded-full text-xs uppercase font-mono">
                        REFUSED
                      </span>
                    </div>

                    <div className="space-y-3 font-sans text-xs text-slate-200">
                      <p>
                        This official notification serves to inform applicant <strong>{activeModalApp.applicantName}</strong> (Passport: <span className="font-mono text-red-300">{activeModalApp.passportNumber}</span>) that visa application <strong>{activeModalApp.appId}</strong> has been refused by the Consular Authority of {activeModalApp.country}.
                      </p>
                      <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-xs">
                        <strong className="text-red-400 block mb-1">REASON FOR REFUSAL:</strong>
                        <span className="text-slate-300">{activeModalApp.rejectionReason} — {activeModalApp.detailedRemarks}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                      <span className="text-slate-400 text-xs font-mono">Decision Date: {activeModalApp.rejectedDate}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => triggerToast(`Printing Refusal Notice for ${activeModalApp.refusalCode}...`)}
                          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <Printer size={13} /> Print Notice
                        </button>
                        <button
                          onClick={() => triggerToast(`Downloading Official PDF Refusal Notice (${activeModalApp.refusalCode})...`)}
                          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <Download size={13} /> Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: APPLICANT & PASSPORT */}
              {modalTab === "Applicant & Passport" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">
                      Personal Identity Profile
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Full Name</span>
                        <strong className="text-slate-900">{activeModalApp.applicantName}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Date of Birth</span>
                        <strong className="text-slate-900">{activeModalApp.dob || "1994-08-12"}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Gender & Status</span>
                        <strong className="text-slate-900">{activeModalApp.gender || "Female"} &bull; {activeModalApp.maritalStatus || "Single"}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Nationality</span>
                        <strong className="text-slate-900">{activeModalApp.nationality || "Indian"}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Contact Email</span>
                        <strong className="text-[#2563EB]">{activeModalApp.email || "applicant@domain.com"}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Mobile Number</span>
                        <strong className="text-slate-900">{activeModalApp.phone || "+91 98123 45678"}</strong>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">
                      Passport Credentials
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Passport Number</span>
                        <strong className="text-slate-900 font-mono font-bold">{activeModalApp.passportNumber}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Issue Date</span>
                        <strong className="text-slate-900 font-mono">{activeModalApp.passportIssueDate || "15 Jan 2020"}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Expiry Date</span>
                        <strong className="text-slate-900 font-mono">{activeModalApp.passportExpiryDate || "14 Jan 2030"}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: VISA & TRAVEL */}
              {modalTab === "Visa & Travel" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Destination Country</span>
                      <strong className="text-slate-900 font-bold">{activeModalApp.country}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Visa Category</span>
                      <strong className="text-slate-900">{activeModalApp.category}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Intended Travel Date</span>
                      <strong className="text-[#2563EB] font-mono">{activeModalApp.travelDate || "2026-09-20"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Port of Entry</span>
                      <strong className="text-slate-900">{activeModalApp.portOfEntry || "Toronto Pearson Intl (YYZ)"}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: REFUSAL GROUNDS & RISK ANALYSIS */}
              {modalTab === "Refusal Grounds & Risk Analysis" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="bg-red-50/40 border border-red-200 rounded-3xl p-5 space-y-4">
                    <div className="flex items-center gap-3 border-b border-red-200 pb-3">
                      <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold">
                        <ShieldAlert size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black font-outfit text-slate-900">
                          CONSULAR RISK ANALYSIS & REFUSAL BREAKDOWN
                        </h4>
                        <span className="text-xs font-mono font-bold text-red-700">Refusal Clause: {activeModalApp.refusalCode}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-2xl border border-red-200">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Risk Assessment Score</span>
                        <strong className="text-red-700 text-sm font-bold">High Risk Tier</strong>
                      </div>
                      <div className="bg-white p-3 rounded-2xl border border-red-200">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Primary Failure Point</span>
                        <strong className="text-slate-900">{activeModalApp.rejectionReason}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-2xl border border-red-200">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Cooling-Off Period</span>
                        <strong className="text-slate-900 font-mono">{activeModalApp.coolingPeriodDays} Days</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: UPLOADED DOCUMENTS */}
              {modalTab === "Uploaded Documents" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Uploaded Documents Evaluation Checklist
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeModalApp.uploadedDocs.map((doc, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {doc.status === "Verified" ? (
                            <CheckCircle2 size={18} className="text-emerald-600" />
                          ) : (
                            <XCircle size={18} className="text-red-600" />
                          )}
                          <div>
                            <span className="font-bold text-slate-900 block">{doc.name}</span>
                            {doc.reason ? (
                              <span className="text-[10px] text-red-600 font-semibold">{doc.reason}</span>
                            ) : (
                              <span className="text-[10px] text-emerald-600 font-mono">Verified</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: PAYMENT & INVOICE */}
              {modalTab === "Payment & Invoice" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Consular Application Fee Invoice (Non-Refundable)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Total Amount Paid</span>
                      <strong className="text-slate-900 text-sm font-black font-mono">{activeModalApp.amountPaid}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Transaction Reference ID</span>
                      <strong className="text-slate-900 font-mono">{activeModalApp.transactionId}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Fee Policy</span>
                      <strong className="text-slate-700">Consular Fee Non-Refundable</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: APPEAL & RE-APPLICATION */}
              {modalTab === "Appeal & Re-Application" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <h4 className="text-sm font-black font-outfit text-slate-900">
                          RE-APPLICATION & APPEAL ELIGIBILITY STATUS
                        </h4>
                        <span className="text-xs font-mono font-bold text-emerald-700">{activeModalApp.appealEligibility}</span>
                      </div>
                      <button
                        onClick={() => handleInviteReapplication(activeModalApp)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                      >
                        <RotateCcw size={14} /> Send Re-Application Portal Link
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      Applicants whose primary refusal ground is document non-compliance or insufficient proof can re-submit an updated application with verified documents.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 9: CONSULAR AUDIT LOG & NOTES */}
              {modalTab === "Consular Audit Log & Notes" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Consular Officer Refusal Audit Trail
                  </h4>
                  <div className="space-y-2">
                    {activeModalApp.actionNotes?.map((n) => (
                      <div key={n.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">{n.author}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                        </div>
                        <p className="text-xs text-slate-600">{n.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* ADD NOTE FORM */}
                  <div className="pt-3 border-t border-slate-200 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an audit note..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600"
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
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
                  onClick={() => handleInviteReapplication(activeModalApp)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw size={15} /> Invite Re-Application
                </button>
                <button
                  onClick={() => handleReopenAppeal(activeModalApp)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw size={15} /> Re-Open Appeal Review
                </button>
              </div>

              <button
                onClick={() => setActiveModalApp(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
