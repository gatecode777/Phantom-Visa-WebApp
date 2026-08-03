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
  UserPlus,
  Mail,
  Phone,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  FileText,
  ShieldAlert
} from "lucide-react";

export interface RejectedDocumentRecord {
  id: string;
  docId: string;
  appId: string;
  applicantName: string;
  passportNumber: string;
  documentType:
    | "Passport"
    | "Photograph"
    | "Bank Statement"
    | "Travel Insurance"
    | "Medical Certificate"
    | "Police Clearance Certificate (PCC)"
    | "Invitation Letter"
    | "Other";
  documentName: string;
  fileFormat: "PDF" | "JPG" | "PNG";
  fileSize: string;
  uploadedBy: "Applicant" | "Agent";
  agentName?: string;
  uploadDate: string;
  rejectionReason:
    | "Expired Document"
    | "Blurred or Low Quality Scan"
    | "Incorrect Information"
    | "Missing Pages"
    | "Invalid File Format"
    | "File Corrupted"
    | "Document Mismatch"
    | "Signature Missing"
    | "Embassy Requirement Not Met"
    | "Incorrect Size"
    | "Other";
  rejectedBy: string;
  rejectedDate: string;
  reuploadStatus: "Awaiting Upload" | "Re-submitted" | "Overdue" | "Re-verified";
  detailedRemarks?: string;
  reuploadDeadline?: string;
  country?: string;
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_REJECTED_DOCUMENT_TABS = [
  "Overview",
  "Applicant Details",
  "Document Preview",
  "Rejection Details",
  "Re-upload History",
  "Communication",
  "Activity Logs",
  "Action Notes"
];

export const REJECTED_WORKFLOW_STEPS = [
  "Document Uploaded",
  "Document Verification",
  "Rejected",
  "Applicant Notified",
  "Re-upload Requested",
  "New Document Submitted",
  "Verification Again",
  "Verified"
];

export const COMMON_REJECTION_REASONS = [
  "Expired Document",
  "Blurred or Low Quality Scan",
  "Incorrect Information",
  "Missing Pages",
  "Invalid File Format",
  "File Corrupted",
  "Document Mismatch",
  "Signature Missing",
  "Embassy Requirement Not Met",
  "Applicant Tarnished",
  "Other"
];

const MOCK_REJECTED_DOCUMENTS: RejectedDocumentRecord[] = [
  {
    id: "1",
    docId: "DOC-20545",
    appId: "APP-20261045",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    documentType: "Passport",
    documentName: "Geeta_Passport_Old.pdf",
    fileFormat: "PDF",
    fileSize: "2.8 MB",
    uploadedBy: "Applicant",
    uploadDate: "01 Aug 2026",
    rejectionReason: "Expired Document",
    rejectedBy: "Rahul Sharma",
    rejectedDate: "01 Aug 2026",
    reuploadStatus: "Awaiting Upload",
    detailedRemarks: "Passport validity expires within 3 months. Minimum 6 months required.",
    reuploadDeadline: "05 Aug 2026",
    country: "Canada",
    actionNotes: [
      { id: "n1", author: "Rahul Sharma", text: "Rejection notice emailed to applicant.", date: "01 Aug 2026 11:00 AM" }
    ]
  },
  {
    id: "2",
    docId: "DOC-20546",
    appId: "APP-20261046",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    documentType: "Bank Statement",
    documentName: "Bikram_Bank_Scan_Blur.jpg",
    fileFormat: "JPG",
    fileSize: "1.5 MB",
    uploadedBy: "Agent",
    agentName: "Apex Travels",
    uploadDate: "01 Aug 2026",
    rejectionReason: "Blurred or Low Quality Scan",
    rejectedBy: "David Thomas",
    rejectedDate: "01 Aug 2026",
    reuploadStatus: "Re-submitted",
    detailedRemarks: "Account number and bank stamp illegible due to resolution.",
    reuploadDeadline: "04 Aug 2026",
    country: "Australia",
    actionNotes: []
  },
  {
    id: "3",
    docId: "DOC-20547",
    appId: "APP-20261047",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    documentType: "Photograph",
    documentName: "Rahul_Photo_Selfie.png",
    fileFormat: "PNG",
    fileSize: "3.2 MB",
    uploadedBy: "Applicant",
    uploadDate: "28 Jul 2026",
    rejectionReason: "Incorrect Size",
    rejectedBy: "Sarah Johnston",
    rejectedDate: "29 Jul 2026",
    reuploadStatus: "Overdue",
    detailedRemarks: "Background must be white and dimensions 35x45mm.",
    reuploadDeadline: "31 Jul 2026",
    country: "UAE",
    actionNotes: [
      { id: "n3", author: "Sarah Johnston", text: "Overdue reminder sent via SMS.", date: "01 Aug 2026 09:00 AM" }
    ]
  }
];

export default function RejectedDocumentsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [docTypeFilter, setDocTypeFilter] = useState("All");
  const [reasonFilter, setReasonFilter] = useState("All");
  const [reuploadStatusFilter, setReuploadStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");

  // Records State
  const [rejectedDocs, setRejectedDocs] = useState<RejectedDocumentRecord[]>(MOCK_REJECTED_DOCUMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalDoc, setActiveModalDoc] = useState<RejectedDocumentRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // Preview Controls State
  const [previewZoom, setPreviewZoom] = useState<number>(100);
  const [previewRotation, setPreviewRotation] = useState<number>(0);

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredDocs = rejectedDocs.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      doc.docId.toLowerCase().includes(q) ||
      doc.appId.toLowerCase().includes(q) ||
      doc.applicantName.toLowerCase().includes(q) ||
      doc.passportNumber.toLowerCase().includes(q) ||
      doc.rejectedBy.toLowerCase().includes(q) ||
      (doc.agentName && doc.agentName.toLowerCase().includes(q));

    const matchesType = docTypeFilter === "All" || doc.documentType === docTypeFilter;
    const matchesReason = reasonFilter === "All" || doc.rejectionReason === reasonFilter;
    const matchesStatus = reuploadStatusFilter === "All" || doc.reuploadStatus === reuploadStatusFilter;
    const matchesCountry = countryFilter === "All" || doc.country === countryFilter;

    return matchesQuery && matchesType && matchesReason && matchesStatus && matchesCountry;
  });

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredDocs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDocs.map((d) => d.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleRequestReupload = (doc: RejectedDocumentRecord) => {
    setRejectedDocs((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, reuploadStatus: "Awaiting Upload" } : d))
    );
    triggerToast(`Re-upload requested for ${doc.docId}.`);
    if (activeModalDoc?.id === doc.id) {
      setActiveModalDoc((prev) => (prev ? { ...prev, reuploadStatus: "Awaiting Upload" } : null));
    }
  };

  const handleVerifyResubmitted = (doc: RejectedDocumentRecord) => {
    setRejectedDocs((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, reuploadStatus: "Re-verified" } : d))
    );
    triggerToast(`Document ${doc.docId} marked as Re-verified.`);
    if (activeModalDoc?.id === doc.id) {
      setActiveModalDoc((prev) => (prev ? { ...prev, reuploadStatus: "Re-verified" } : null));
    }
  };

  const handleDeleteRecord = (doc: RejectedDocumentRecord) => {
    setRejectedDocs((prev) => prev.filter((d) => d.id !== doc.id));
    triggerToast(`Rejected record ${doc.docId} deleted.`);
    if (activeModalDoc?.id === doc.id) setActiveModalDoc(null);
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
              Document Rejection & Deficiency Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Rejected Documents
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            View and manage all documents that have been rejected during the verification process and require applicant action.
          </p>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Rejected</span>
            <div className="text-2xl font-black text-slate-900 font-mono">967</div>
            <span className="text-[10px] text-red-600 font-bold">Refused Files</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Rejected Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">24</div>
            <span className="text-[10px] text-red-600 font-bold">Daily Refusals</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Awaiting Re-upload</span>
            <div className="text-2xl font-black text-slate-900 font-mono">212</div>
            <span className="text-[10px] text-amber-600 font-bold">Pending Action</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Re-submitted</span>
            <div className="text-2xl font-black text-slate-900 font-mono">198</div>
            <span className="text-[10px] text-blue-600 font-bold">Ready for Review</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Permanent Rejections</span>
            <div className="text-2xl font-black text-slate-900 font-mono">41</div>
            <span className="text-[10px] text-purple-600 font-bold">Closed Cases</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Resolved Cases</span>
            <div className="text-2xl font-black text-slate-900 font-mono">494</div>
            <span className="text-[10px] text-emerald-600 font-bold">Corrected & Verified</span>
          </div>
        </div>

        {/* RIGHT CARD: RECOMMENDED TABS, WORKFLOW & REJECTION REASONS (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Document Rejection Workflow
            </h3>

            {/* REJECTION WORKFLOW FLOW */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {REJECTED_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-[9px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* COMMON REJECTION REASONS CATALOG */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-900 font-bold block mb-1">Common Rejection Reasons:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px] max-h-24 overflow-y-auto [scrollbar-width:thin]">
                {COMMON_REJECTION_REASONS.map((reason, i) => (
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Rejection Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredDocs.length} of {rejectedDocs.length} Rejected Documents
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (Doc ID, App ID, Applicant, Officer)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="DOC-20545, APP-20261045..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* DOCUMENT TYPE */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Document Type
            </label>
            <select
              value={docTypeFilter}
              onChange={(e) => setDocTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Types</option>
              <option value="Passport">Passport</option>
              <option value="Photograph">Photograph</option>
              <option value="Bank Statement">Bank Statement</option>
              <option value="Travel Insurance">Travel Insurance</option>
              <option value="Medical Certificate">Medical Certificate</option>
            </select>
          </div>

          {/* REJECTION REASON */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Rejection Reason
            </label>
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Reasons</option>
              <option value="Expired Document">Expired Document</option>
              <option value="Blurred or Low Quality Scan">Blurred or Low Quality Scan</option>
              <option value="Incorrect Information">Incorrect Information</option>
              <option value="Incorrect Size">Incorrect Size</option>
            </select>
          </div>

          {/* RE-UPLOAD STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Re-upload Status
            </label>
            <select
              value={reuploadStatusFilter}
              onChange={(e) => setReuploadStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Awaiting Upload">Awaiting Upload</option>
              <option value="Re-submitted">Re-submitted</option>
              <option value="Overdue">Overdue</option>
              <option value="Re-verified">Re-verified</option>
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
            <span>Rejected Documents Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => triggerToast(`Requesting re-upload for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={14} /> Request Re-upload
            </button>
            <button
              onClick={() => triggerToast(`Sending notification reminder to ${selectedIds.length} applicants.`)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Send size={14} /> Send Reminder
            </button>
            <button
              onClick={() => triggerToast(`Exporting rejection report for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Report
            </button>
          </div>
        </div>
      )}

      {/* REJECTED DOCUMENTS TABLE (COLUMNS MATCH WIREFRAME EXACTLY) */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredDocs.length && filteredDocs.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-mono">Document ID</th>
                <th className="py-3.5 px-4 font-mono">Application ID</th>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Document Type</th>
                <th className="py-3.5 px-4">Rejection Reason</th>
                <th className="py-3.5 px-4">Rejected By</th>
                <th className="py-3.5 px-4 font-mono">Rejected Date</th>
                <th className="py-3.5 px-4">Re-upload Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <XCircle size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No rejected documents found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(d.id)}
                        onChange={() => handleToggleSelect(d.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {d.docId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {d.appId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {d.applicantName}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {d.documentType}
                      <span className="block text-[10px] font-normal text-slate-400">{d.fileFormat} &bull; {d.fileSize}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-red-600">
                      {d.rejectionReason}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {d.rejectedBy}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {d.rejectedDate}
                    </td>
                    <td className="py-3.5 px-4">
                      {d.reuploadStatus === "Re-submitted" ? (
                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-blue-200">
                          🔵 Re-submitted
                        </span>
                      ) : d.reuploadStatus === "Overdue" ? (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                          🔴 Overdue
                        </span>
                      ) : d.reuploadStatus === "Re-verified" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          🟢 Re-verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-200">
                          🟡 Awaiting Upload
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveModalDoc(d);
                            setModalTab("Overview");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Rejection Details & Canvas"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleRequestReupload(d)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition cursor-pointer"
                          title="Request Re-upload"
                        >
                          <RotateCcw size={15} />
                        </button>
                        <button
                          onClick={() => handleVerifyResubmitted(d)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Verify Re-submitted Document"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(d)}
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
          <div>Showing 1–10 of 967 Rejected Documents</div>
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

      {/* CENTERED POPUP DETAILS MODAL (8 RECOMMENDED TABS & PREVIEW CONTROLS FROM WIREFRAME) */}
      {activeModalDoc && (
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
                      {activeModalDoc.documentName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-red-300 bg-red-900/50 px-2 py-0.5 rounded border border-red-700">
                      {activeModalDoc.docId} (REJECTED)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">App ID: <strong className="text-blue-300">{activeModalDoc.appId}</strong> &bull; Rejected By: {activeModalDoc.rejectedBy} ({activeModalDoc.rejectedDate})</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalDoc(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {RECOMMENDED_REJECTED_DOCUMENT_TABS.map((tab) => {
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
                  {/* REJECTION SUMMARY TILES */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">
                      Rejection & Re-upload Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Document ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalDoc.docId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Rejection Reason</span>
                        <strong className="text-red-600 font-bold">{activeModalDoc.rejectionReason}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Re-upload Deadline</span>
                        <strong className="text-slate-900 font-mono font-bold">{activeModalDoc.reuploadDeadline || "N/A"}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Re-upload Status</span>
                        <strong className="text-amber-700 font-bold">{activeModalDoc.reuploadStatus}</strong>
                      </div>
                    </div>
                  </div>

                  {/* REJECTION REMARKS CARD */}
                  <div className="bg-red-50/60 border border-red-200 rounded-3xl p-5 space-y-2">
                    <h4 className="text-xs font-extrabold text-red-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <AlertTriangle size={16} className="text-red-600" /> Officer Detailed Rejection Remarks
                    </h4>
                    <p className="text-xs text-red-800 font-medium leading-relaxed">
                      "{activeModalDoc.detailedRemarks || "The document submitted does not meet official visa guidelines. Please review rejection reason and re-upload."}"
                    </p>
                  </div>

                  {/* DOCUMENT PREVIEW BOX WITH CONTROLS (FROM WIREFRAME) */}
                  <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 font-outfit flex items-center gap-2">
                        <FileText size={16} className="text-red-400" /> Preview Rejected Document
                      </h4>
                      {/* PREVIEW CONTROLS: ZOOM IN, ZOOM OUT, ROTATE, DOWNLOAD */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setPreviewZoom((z) => Math.min(z + 20, 200))}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 cursor-pointer"
                          title="Zoom In"
                        >
                          <ZoomIn size={14} />
                        </button>
                        <button
                          onClick={() => setPreviewZoom((z) => Math.max(z - 20, 60))}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 cursor-pointer"
                          title="Zoom Out"
                        >
                          <ZoomOut size={14} />
                        </button>
                        <button
                          onClick={() => setPreviewRotation((r) => (r + 90) % 360)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 cursor-pointer"
                          title="Rotate"
                        >
                          <RotateCw size={14} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Downloading ${activeModalDoc.documentName}...`)}
                          className="p-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-white cursor-pointer ml-1"
                          title="Download"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-950 rounded-2xl p-6 min-h-[220px] flex items-center justify-center border border-slate-800 overflow-hidden">
                      <div
                        className="text-center transition-all duration-200"
                        style={{ transform: `scale(${previewZoom / 100}) rotate(${previewRotation}deg)` }}
                      >
                        <XCircle size={48} className="mx-auto mb-2 text-red-500" />
                        <p className="font-mono text-xs text-slate-200 font-bold">{activeModalDoc.documentName}</p>
                        <p className="text-[10px] text-red-400 font-mono mt-1">❌ Rejected File Canvas ({previewZoom}%)</p>
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
                  onClick={() => handleRequestReupload(activeModalDoc)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw size={15} /> Request Re-upload
                </button>
                <button
                  onClick={() => handleVerifyResubmitted(activeModalDoc)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> Verify Re-submitted Document
                </button>
              </div>

              <button
                onClick={() => triggerToast(`Sending notification reminder to applicant...`)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Send size={14} /> Send Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
