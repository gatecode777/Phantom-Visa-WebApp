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
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileCheck,
  ShieldAlert,
  FileSpreadsheet
} from "lucide-react";

export interface DocumentRecord {
  id: string;
  docId: string;
  appId: string;
  applicantName: string;
  passportNumber: string;
  documentType:
    | "Passport"
    | "Passport Photograph"
    | "National ID"
    | "Bank Statement"
    | "Salary Slip"
    | "Income Tax Return (ITR)"
    | "Employment Letter"
    | "Travel Insurance"
    | "Flight Ticket"
    | "Hotel Booking"
    | "Medical Certificate"
    | "Police Clearance Certificate (PCC)"
    | "Invitation Letter"
    | "University Admission Letter"
    | "Business Invitation Letter"
    | "Cover Letter"
    | "Sponsorship Letter"
    | "Other Supporting Documents";
  documentName: string;
  fileFormat: "PDF" | "JPG" | "PNG";
  fileSize: string;
  uploadedBy: "Applicant" | "Agent";
  agentName?: string;
  uploadDate: string;
  uploadDateTime: string;
  verificationStatus:
    | "Verified"
    | "Pending"
    | "Rejected"
    | "Expired"
    | "Re-upload Requested";
  verifiedBy?: string;
  verificationDate?: string;
  expiryDate?: string;
  remarks?: string;
  rejectionReason?: string;
  // Detail fields
  country?: string;
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_DOCUMENT_TABS = [
  "Overview",
  "Applicant Details",
  "Document Preview",
  "Verification Details",
  "Activity Logs",
  "Action Notes"
];

export const DOCUMENT_VERIFICATION_WORKFLOW_STEPS = [
  "Document Uploaded",
  "Pending Verification",
  "Admin Review",
  "Verified / Rejected Decision",
  "Application Continues / Request Re-upload"
];

export const SUPPORTED_DOCUMENT_TYPES = [
  "Passport",
  "Passport Photograph",
  "National ID",
  "Bank Statement",
  "Salary Slip",
  "Income Tax Return (ITR)",
  "Employment Letter",
  "Travel Insurance",
  "Flight Ticket",
  "Hotel Booking",
  "Medical Certificate",
  "Police Clearance Certificate (PCC)",
  "Invitation Letter",
  "University Admission Letter",
  "Business Invitation Letter",
  "Cover Letter",
  "Sponsorship Letter",
  "Other Supporting Documents"
];

const MOCK_ALL_DOCUMENTS: DocumentRecord[] = [
  {
    id: "1",
    docId: "DOC-0001",
    appId: "APP-20261001",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    documentType: "Passport",
    documentName: "Passport_Bio_Page_Geeta.pdf",
    fileFormat: "PDF",
    fileSize: "2.4 MB",
    uploadedBy: "Applicant",
    uploadDate: "01 Aug 2026",
    uploadDateTime: "01 Aug 2026 09:30 AM",
    verificationStatus: "Verified",
    verifiedBy: "Amardeep Sen",
    verificationDate: "01 Aug 2026 11:15 AM",
    expiryDate: "2032-10-15",
    country: "Canada",
    remarks: "Passport bio page clearly readable and valid for >6 months.",
    actionNotes: [
      { id: "n1", author: "Amardeep Sen", text: "Identity and passport validity confirmed.", date: "01 Aug 2026 11:15 AM" }
    ]
  },
  {
    id: "2",
    docId: "DOC-0002",
    appId: "APP-20261002",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    documentType: "Bank Statement",
    documentName: "Bank_Statement_6M_Rahul.pdf",
    fileFormat: "PDF",
    fileSize: "5.1 MB",
    uploadedBy: "Agent",
    agentName: "Apex Travels",
    uploadDate: "01 Aug 2026",
    uploadDateTime: "01 Aug 2026 11:45 AM",
    verificationStatus: "Pending",
    country: "Australia",
    remarks: "Awaiting financial audit verification.",
    actionNotes: []
  },
  {
    id: "3",
    docId: "DOC-0003",
    appId: "APP-20261003",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    documentType: "Travel Insurance",
    documentName: "Travel_Insurance_Policy.jpg",
    fileFormat: "JPG",
    fileSize: "1.2 MB",
    uploadedBy: "Applicant",
    uploadDate: "31 Jul 2026",
    uploadDateTime: "31 Jul 2026 04:20 PM",
    verificationStatus: "Rejected",
    verifiedBy: "Sunil Solanki",
    verificationDate: "01 Aug 2026 09:00 AM",
    rejectionReason: "Coverage amount below minimum $50,000 USD requirement.",
    country: "UAE",
    remarks: "Insurance coverage insufficient for destination country.",
    actionNotes: [
      { id: "n3", author: "Sunil Solanki", text: "Rejected. Re-upload requested.", date: "01 Aug 2026 09:00 AM" }
    ]
  }
];

export default function AllDocumentsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [docTypeFilter, setDocTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [uploadedByFilter, setUploadedByFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");

  // Records State
  const [documentsList, setDocumentsList] = useState<DocumentRecord[]>(MOCK_ALL_DOCUMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Popup Modal State
  const [activeModalDoc, setActiveModalDoc] = useState<DocumentRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // Preview Controls State
  const [previewZoom, setPreviewZoom] = useState<number>(100);
  const [previewRotation, setPreviewRotation] = useState<number>(0);

  // New Note State
  const [newNoteText, setNewNoteText] = useState("");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredDocs = documentsList.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      doc.docId.toLowerCase().includes(q) ||
      doc.appId.toLowerCase().includes(q) ||
      doc.applicantName.toLowerCase().includes(q) ||
      doc.passportNumber.toLowerCase().includes(q) ||
      doc.documentName.toLowerCase().includes(q) ||
      (doc.agentName && doc.agentName.toLowerCase().includes(q));

    const matchesType = docTypeFilter === "All" || doc.documentType === docTypeFilter;
    const matchesStatus = statusFilter === "All" || doc.verificationStatus === statusFilter;
    const matchesUploadedBy = uploadedByFilter === "All" || doc.uploadedBy === uploadedByFilter;
    const matchesCountry = countryFilter === "All" || doc.country === countryFilter;

    return matchesQuery && matchesType && matchesStatus && matchesUploadedBy && matchesCountry;
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
  const handleVerifyDocument = (doc: DocumentRecord) => {
    setDocumentsList((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, verificationStatus: "Verified", verifiedBy: "Admin Vibhu" } : d))
    );
    triggerToast(`Document ${doc.docId} verified successfully!`);
    if (activeModalDoc?.id === doc.id) {
      setActiveModalDoc((prev) => (prev ? { ...prev, verificationStatus: "Verified", verifiedBy: "Admin Vibhu" } : null));
    }
  };

  const handleRejectDocument = (doc: DocumentRecord) => {
    setDocumentsList((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, verificationStatus: "Rejected", verifiedBy: "Admin Vibhu" } : d))
    );
    triggerToast(`Document ${doc.docId} marked as Rejected.`);
    if (activeModalDoc?.id === doc.id) {
      setActiveModalDoc((prev) => (prev ? { ...prev, verificationStatus: "Rejected", verifiedBy: "Admin Vibhu" } : null));
    }
  };

  const handleDeleteRecord = (doc: DocumentRecord) => {
    setDocumentsList((prev) => prev.filter((d) => d.id !== doc.id));
    triggerToast(`Document record ${doc.docId} deleted.`);
    if (activeModalDoc?.id === doc.id) setActiveModalDoc(null);
  };

  const handleBulkVerify = () => {
    setDocumentsList((prev) =>
      prev.map((d) => (selectedIds.includes(d.id) ? { ...d, verificationStatus: "Verified", verifiedBy: "Admin Vibhu" } : d))
    );
    triggerToast(`${selectedIds.length} documents verified successfully.`);
    setSelectedIds([]);
  };

  const handleBulkReject = () => {
    setDocumentsList((prev) =>
      prev.map((d) => (selectedIds.includes(d.id) ? { ...d, verificationStatus: "Rejected", verifiedBy: "Admin Vibhu" } : d))
    );
    triggerToast(`${selectedIds.length} documents rejected.`);
    setSelectedIds([]);
  };

  const handleAddNote = () => {
    if (!newNoteText || !activeModalDoc) return;
    const noteObj = {
      id: Date.now().toString(),
      author: "Admin Vibhu",
      text: newNoteText,
      date: new Date().toLocaleString()
    };
    const updatedNotes = [...(activeModalDoc.actionNotes || []), noteObj];
    setActiveModalDoc({ ...activeModalDoc, actionNotes: updatedNotes });
    setDocumentsList((prev) =>
      prev.map((d) => (d.id === activeModalDoc.id ? { ...d, actionNotes: updatedNotes } : d))
    );
    setNewNoteText("");
    triggerToast("Verification note added.");
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
            <FileText size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Master Document Repository & Verification Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            All Documents
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            View, verify, and manage all documents uploaded for visa applications by applicants and agents.
          </p>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Documents</span>
            <div className="text-2xl font-black text-slate-900 font-mono">18,450</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Central Archive</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Verified Documents</span>
            <div className="text-2xl font-black text-slate-900 font-mono">14,250</div>
            <span className="text-[10px] text-emerald-600 font-bold">Cleared Audit</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Pending Verification</span>
            <div className="text-2xl font-black text-slate-900 font-mono">3,054</div>
            <span className="text-[10px] text-amber-600 font-bold">Queue for Review</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Rejected Documents</span>
            <div className="text-2xl font-black text-slate-900 font-mono">654</div>
            <span className="text-[10px] text-red-600 font-bold">Refused Compliance</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Expired Documents</span>
            <div className="text-2xl font-black text-slate-900 font-mono">492</div>
            <span className="text-[10px] text-purple-600 font-bold">Validity Outdated</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Uploaded Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">165</div>
            <span className="text-[10px] text-blue-600 font-bold">Fresh Uploads</span>
          </div>
        </div>

        {/* RIGHT CARD: RECOMMENDED TABS, WORKFLOW & SUPPORTED DOC TYPES (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Document Verification Workflow
            </h3>

            {/* VERIFICATION WORKFLOW FLOW */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {DOCUMENT_VERIFICATION_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-[9px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* SUPPORTED DOCUMENT TYPES LIST */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-900 font-bold block mb-1">Supported Document Types:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px] max-h-24 overflow-y-auto [scrollbar-width:thin]">
                {SUPPORTED_DOCUMENT_TYPES.slice(0, 10).map((type, i) => (
                  <div key={i} className="flex items-center gap-1 text-slate-700">
                    <Check size={11} className="text-[#2563EB]" /> {type}
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Verification Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredDocs.length} of {documentsList.length} Uploaded Documents
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (Doc ID, App ID, Applicant, Passport)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="DOC-0001, APP-20261001..."
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
              <option value="Photograph">Passport Photograph</option>
              <option value="Bank Statement">Bank Statement</option>
              <option value="Travel Insurance">Travel Insurance</option>
              <option value="Flight Ticket">Flight Ticket</option>
              <option value="Hotel Booking">Hotel Booking</option>
              <option value="Medical Certificate">Medical Certificate</option>
            </select>
          </div>

          {/* VERIFICATION STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Verification Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* UPLOADED BY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Uploaded By
            </label>
            <select
              value={uploadedByFilter}
              onChange={(e) => setUploadedByFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Uploaders</option>
              <option value="Applicant">Applicant (Self)</option>
              <option value="Agent">Agent</option>
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
            <span>Documents Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkVerify}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 size={14} /> Verify Selected
            </button>
            <button
              onClick={handleBulkReject}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <XCircle size={14} /> Reject Selected
            </button>
            <button
              onClick={() => triggerToast(`Exporting data for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Document List
            </button>
          </div>
        </div>
      )}

      {/* DOCUMENTS DATA TABLE */}
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
                <th className="py-3.5 px-4">Uploaded By</th>
                <th className="py-3.5 px-4 font-mono">Upload Date</th>
                <th className="py-3.5 px-4">Verification Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <FileText size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No documents found matching your filters.</p>
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
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {d.uploadedBy}
                      {d.agentName && <span className="block text-[10px] text-slate-400 font-normal">({d.agentName})</span>}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {d.uploadDate}
                    </td>
                    <td className="py-3.5 px-4">
                      {d.verificationStatus === "Verified" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          🟢 Verified
                        </span>
                      ) : d.verificationStatus === "Rejected" ? (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                          🔴 Rejected
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
                            setActiveModalDoc(d);
                            setModalTab("Overview");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Document & Preview"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleVerifyDocument(d)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Verify Document"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => handleRejectDocument(d)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Reject Document"
                        >
                          <XCircle size={15} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Downloading ${d.documentName}...`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Download File"
                        >
                          <Download size={15} />
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
          <div>Showing 1–10 of 18,450 Uploaded Documents</div>
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

      {/* CENTERED POPUP DETAILS MODAL (6 RECOMMENDED TABS & PREVIEW CONTROLS FROM WIREFRAME) */}
      {activeModalDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalDoc.documentName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
                      {activeModalDoc.docId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Application: <strong className="text-blue-300">{activeModalDoc.appId}</strong> &bull; Applicant: {activeModalDoc.applicantName} ({activeModalDoc.passportNumber})</p>
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
              {RECOMMENDED_DOCUMENT_TABS.map((tab) => {
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
                      Basic & Document Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Document ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalDoc.docId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Document Type</span>
                        <strong className="text-slate-900 font-bold">{activeModalDoc.documentType}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">File Format & Size</span>
                        <strong className="text-purple-700 font-mono font-bold">{activeModalDoc.fileFormat} ({activeModalDoc.fileSize})</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Verification Status</span>
                        <strong className="text-emerald-700 font-bold">{activeModalDoc.verificationStatus}</strong>
                      </div>
                    </div>
                  </div>

                  {/* DOCUMENT PREVIEW BOX WITH CONTROLS (FROM WIREFRAME) */}
                  <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 font-outfit flex items-center gap-2">
                        <FileText size={16} className="text-blue-400" /> Document Preview
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
                          className="p-1.5 bg-[#2563EB] hover:bg-blue-700 rounded-lg text-white cursor-pointer ml-1"
                          title="Download"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>

                    {/* PREVIEW CANVAS CONTAINER */}
                    <div className="bg-slate-950 rounded-2xl p-6 min-h-[220px] flex items-center justify-center border border-slate-800 overflow-hidden">
                      <div
                        className="text-center transition-all duration-200"
                        style={{ transform: `scale(${previewZoom / 100}) rotate(${previewRotation}deg)` }}
                      >
                        <FileText size={48} className="mx-auto mb-2 text-blue-400" />
                        <p className="font-mono text-xs text-slate-200 font-bold">{activeModalDoc.documentName}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-1">High-Resolution Document Render Preview ({previewZoom}%)</p>
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
                  onClick={() => handleVerifyDocument(activeModalDoc)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> Verify Document
                </button>
                <button
                  onClick={() => handleRejectDocument(activeModalDoc)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <XCircle size={15} /> Reject Document
                </button>
              </div>

              <button
                onClick={() => triggerToast(`Downloading ${activeModalDoc.documentName}...`)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Download size={14} /> Download File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
