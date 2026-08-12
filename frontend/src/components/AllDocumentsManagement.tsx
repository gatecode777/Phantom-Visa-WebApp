import React, { useState, useEffect } from "react";
import { API_V1_URL } from "../config/api";
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
  documentType: string;
  documentName: string;
  fileFormat: string;
  fileSize: string;
  fileUrl?: string;
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
  "Passport Bio Page",
  "Passport Back Page",
  "Recent Photograph",
  "6-Month Bank Statement",
  "Employment NOC Letter",
  "Flight Round-trip Ticket",
  "Hotel Booking Voucher",
  "Income Tax Returns (ITR)",
  "Salary Slips (3 Months)",
  "Travel Insurance Policy"
];

const INITIAL_FALLBACK_DOCUMENTS: DocumentRecord[] = [
  {
    id: "1",
    docId: "DOC-0001",
    appId: "APP-20261001",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    documentType: "Passport Bio Page",
    documentName: "Passport_Bio_Page_Geeta.pdf",
    fileFormat: "PDF",
    fileSize: "2.4 MB",
    uploadedBy: "Applicant",
    uploadDate: "07 Aug 2026",
    uploadDateTime: "07 Aug 2026 09:30 AM",
    verificationStatus: "Verified",
    verifiedBy: "Amardeep Sen",
    verificationDate: "07 Aug 2026 11:15 AM",
    expiryDate: "2033-12-20",
    country: "Canada",
    remarks: "Passport bio page clearly readable and valid for >6 months.",
    actionNotes: [
      { id: "n1", author: "Amardeep Sen", text: "Identity and passport validity confirmed.", date: "07 Aug 2026 11:15 AM" }
    ]
  },
  {
    id: "2",
    docId: "DOC-0002",
    appId: "APP-20261002",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    documentType: "6-Month Bank Statement",
    documentName: "Bank_Statement_6M_Rahul.pdf",
    fileFormat: "PDF",
    fileSize: "5.1 MB",
    uploadedBy: "Agent",
    agentName: "Apex Travels",
    uploadDate: "07 Aug 2026",
    uploadDateTime: "07 Aug 2026 11:45 AM",
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
    documentType: "Employment NOC Letter",
    documentName: "employment_noc_blurry.pdf",
    fileFormat: "PDF",
    fileSize: "1.2 MB",
    uploadedBy: "Applicant",
    uploadDate: "07 Aug 2026",
    uploadDateTime: "07 Aug 2026 04:20 PM",
    verificationStatus: "Rejected",
    verifiedBy: "Sunil Solanki",
    verificationDate: "07 Aug 2026 09:00 AM",
    rejectionReason: "NOC HR wet stamp is blurry and unverified. Re-upload mandatory.",
    country: "UAE",
    remarks: "NOC stamp verification failed.",
    actionNotes: [
      { id: "n3", author: "Sunil Solanki", text: "Rejected. Re-upload requested.", date: "07 Aug 2026 09:00 AM" }
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

  // Records & Stats State
  const [documentsList, setDocumentsList] = useState<DocumentRecord[]>(INITIAL_FALLBACK_DOCUMENTS);
  const [apiStats, setApiStats] = useState({
    totalDocuments: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
    expired: 0
  });
  const [loading, setLoading] = useState(true);
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

  // Fetch Documents from Backend API
  const fetchAllDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_V1_URL}/applications/admin/all-documents`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setDocumentsList(json.data);
        if (json.stats) setApiStats(json.stats);
      }
    } catch (err) {
      console.error("Failed to fetch all documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDocuments();
  }, []);

  // Supported document types derived dynamically
  const supportedDocumentTypes = Array.from(
    new Set(documentsList.map((d) => d.documentType).filter(Boolean))
  );

  // Computed summary metrics directly from live data
  const totalDocsCount = apiStats.totalDocuments || documentsList.length;
  const verifiedDocsCount = apiStats.verified || documentsList.filter((d) => d.verificationStatus === "Verified").length;
  const pendingDocsCount = apiStats.pending || documentsList.filter((d) => d.verificationStatus === "Pending").length;
  const rejectedDocsCount = apiStats.rejected || documentsList.filter((d) => d.verificationStatus === "Rejected").length;
  const expiredDocsCount = apiStats.expired || documentsList.filter((d) => d.verificationStatus === "Expired").length;

  // Filter Logic with defensive null-safe property access
  const filteredDocs = documentsList.filter((doc) => {
    if (!doc) return false;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      (doc.docId || "").toLowerCase().includes(q) ||
      (doc.appId || "").toLowerCase().includes(q) ||
      (doc.applicantName || "").toLowerCase().includes(q) ||
      (doc.passportNumber || "").toLowerCase().includes(q) ||
      (doc.documentName || "").toLowerCase().includes(q) ||
      (doc.agentName ? doc.agentName.toLowerCase().includes(q) : false);

    const matchesType = docTypeFilter === "All" || doc.documentType === docTypeFilter;
    const matchesStatus = statusFilter === "All" || doc.verificationStatus === statusFilter;
    const matchesUploadedBy = uploadedByFilter === "All" || doc.uploadedBy === uploadedByFilter;
    const matchesCountry = countryFilter === "All" || !doc.country || doc.country === countryFilter;

    return matchesQuery && matchesType && matchesStatus && matchesUploadedBy && matchesCountry;
  });

  // Verification Action Handlers (Approve / Reject)
  const handleVerifyDocument = async (doc: DocumentRecord) => {
    if (doc.verificationStatus?.toLowerCase() === "verified") return;
    try {
      setDocumentsList((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, verificationStatus: "Verified", verifiedBy: "Admin Consular" } : d))
      );
      triggerToast(`Document ${doc.docId} verified successfully!`);

      fetch(`${API_V1_URL}/applications/${doc.appId}/documents/${doc.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "verified", verifiedBy: "Admin Consular" })
      }).catch((err) => console.error("Verify API error:", err));

      if (activeModalDoc?.id === doc.id) {
        setTimeout(() => setActiveModalDoc(null), 400);
      }
    } catch (err) {
      triggerToast(`Failed to update status for ${doc.docId}`);
    }
  };

  const handleRejectDocument = async (doc: DocumentRecord, reason?: string) => {
    if (doc.verificationStatus?.toLowerCase() === "rejected") return;
    const rejectionReason = reason || doc.rejectionReason || "HR wet stamp or document scan is unverified. Re-upload mandatory.";
    try {
      setDocumentsList((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, verificationStatus: "Rejected", rejectionReason, verifiedBy: "Admin Consular" } : d))
      );
      triggerToast(`Document ${doc.docId} marked as Rejected.`);

      fetch(`${API_V1_URL}/applications/${doc.appId}/documents/${doc.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", rejectionReason, verifiedBy: "Admin Consular" })
      }).catch((err) => console.error("Reject API error:", err));

      if (activeModalDoc?.id === doc.id) {
        setTimeout(() => setActiveModalDoc(null), 400);
      }
    } catch (err) {
      triggerToast(`Failed to reject document ${doc.docId}`);
    }
  };

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
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-800">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-mono text-[#2563EB] mb-1">
          <FileText size={14} />
          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 font-bold">
            All Documents
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">All Documents</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          View, verify, and manage all documents uploaded for visa applications by applicants and agents.
        </p>
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {/* Card 1: Total Documents */}
          <div
            onClick={() => setStatusFilter("All")}
            className={`bg-white border rounded-3xl p-4 shadow-2xs hover:shadow-md transition cursor-pointer ${statusFilter === "All" ? "border-[#2563EB] ring-2 ring-blue-200" : "border-slate-200"
              }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Documents</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{totalDocsCount}</div>
            <span className="text-[10px] text-[#2563EB] font-bold">
              {statusFilter === "All" ? "Showing all (Active)" : "Click for all docs"}
            </span>
          </div>

          {/* Card 2: Verified Documents */}
          <div
            onClick={() => setStatusFilter(statusFilter === "Verified" ? "All" : "Verified")}
            className={`bg-white border rounded-3xl p-4 shadow-2xs hover:shadow-md transition cursor-pointer ${statusFilter === "Verified" ? "border-emerald-500 ring-2 ring-emerald-200" : "border-slate-200"
              }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Verified Documents</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{verifiedDocsCount}</div>
            <span className="text-[10px] text-emerald-600 font-bold">
              {statusFilter === "Verified" ? "Showing verified (Active)" : "Click to filter verified"}
            </span>
          </div>

          {/* Card 3: Pending Verification */}
          <div
            onClick={() => setStatusFilter(statusFilter === "Pending" ? "All" : "Pending")}
            className={`bg-white border rounded-3xl p-4 shadow-2xs hover:shadow-md transition cursor-pointer ${statusFilter === "Pending" ? "border-amber-500 ring-2 ring-amber-200" : "border-slate-200"
              }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Pending Verification</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{pendingDocsCount}</div>
            <span className="text-[10px] text-amber-600 font-bold">
              {statusFilter === "Pending" ? "Showing pending (Active)" : "Click to filter pending"}
            </span>
          </div>

          {/* Card 4: Rejected Documents */}
          <div
            onClick={() => setStatusFilter(statusFilter === "Rejected" ? "All" : "Rejected")}
            className={`bg-white border rounded-3xl p-4 shadow-2xs hover:shadow-md transition cursor-pointer ${statusFilter === "Rejected" ? "border-red-500 ring-2 ring-red-200" : "border-slate-200"
              }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Rejected Documents</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{rejectedDocsCount}</div>
            <span className="text-[10px] text-red-600 font-bold">
              {statusFilter === "Rejected" ? "Showing rejected (Active)" : "Click to filter rejected"}
            </span>
          </div>

          {/* Card 5: Expired Documents */}
          <div
            onClick={() => setStatusFilter(statusFilter === "Expired" ? "All" : "Expired")}
            className={`bg-white border rounded-3xl p-4 shadow-2xs hover:shadow-md transition cursor-pointer ${statusFilter === "Expired" ? "border-purple-500 ring-2 ring-purple-200" : "border-slate-200"
              }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Expired Documents</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{expiredDocsCount}</div>
            <span className="text-[10px] text-purple-600 font-bold">
              {statusFilter === "Expired" ? "Showing expired (Active)" : "Click to filter expired"}
            </span>
          </div>

          {/* Card 6: Central Archive */}
          <div
            onClick={() => setStatusFilter("All")}
            className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition cursor-pointer"
          >
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Central Archive</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{totalDocsCount}</div>
            <span className="text-[10px] text-blue-600 font-bold">All Records</span>
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
                    â–¼
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
                          Verified
                        </span>
                      ) : d.verificationStatus === "Rejected" ? (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                          Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-200">
                          Pending
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
                        {(() => {
                          const isDocVerified = d.verificationStatus?.toLowerCase() === "verified";
                          const isDocRejected = d.verificationStatus?.toLowerCase() === "rejected";
                          return (
                            <>
                              <button
                                onClick={() => handleVerifyDocument(d)}
                                disabled={isDocVerified}
                                className={`p-1.5 rounded-lg transition ${isDocVerified
                                  ? "text-emerald-300 opacity-40 cursor-not-allowed bg-emerald-50/50"
                                  : "text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                                  }`}
                                title={isDocVerified ? "Already Verified ✓" : "Verify Document"}
                              >
                                <CheckCircle2 size={15} />
                              </button>
                              <button
                                onClick={() => handleRejectDocument(d)}
                                disabled={isDocRejected}
                                className={`p-1.5 rounded-lg transition ${isDocRejected
                                  ? "text-red-300 opacity-40 cursor-not-allowed bg-red-50/50"
                                  : "text-red-600 hover:bg-red-50 cursor-pointer"
                                  }`}
                                title={isDocRejected ? "Already Rejected ✕" : "Reject Document"}
                              >
                                <XCircle size={15} />
                              </button>
                            </>
                          );
                        })()}
                        <button
                          onClick={() => {
                            const url = d.fileUrl || `https://ik.imagekit.io/demo/sample.pdf`;
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = d.documentName || `${d.docId}.pdf`;
                            a.target = "_blank";
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          }}
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
          <div>Showing 1â€“10 of 18,450 Uploaded Documents</div>
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
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${active
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

                  {/* DOCUMENT PREVIEW BOX WITH CONTROLS */}
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
                          onClick={() => {
                            const targetUrl = activeModalDoc.fileUrl || `https://ik.imagekit.io/demo/sample.pdf`;
                            window.open(targetUrl, "_blank");
                          }}
                          className="p-1.5 bg-[#2563EB] hover:bg-blue-700 rounded-lg text-white cursor-pointer ml-1"
                          title="Open / Download"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>

                    {/* LIVE PREVIEW CANVAS CONTAINER WITH IMAGEKIT RENDERING */}
                    <div className="bg-slate-950 rounded-2xl p-4 min-h-[280px] flex items-center justify-center border border-slate-800 overflow-hidden relative group">
                      <div
                        className="transition-all duration-200 flex flex-col items-center justify-center w-full"
                        style={{ transform: `scale(${previewZoom / 100}) rotate(${previewRotation}deg)` }}
                      >
                        {activeModalDoc.fileUrl || activeModalDoc.documentName.toLowerCase().includes("png") || activeModalDoc.documentName.toLowerCase().includes("jpg") ? (
                          <img
                            src={activeModalDoc.fileUrl || `https://ik.imagekit.io/demo/tr:w-800/sample-city-park.jpg`}
                            alt={activeModalDoc.documentName}
                            className="max-h-64 object-contain rounded-lg border border-slate-700 shadow-lg"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : null}

                        <div className="text-center mt-3">
                          <FileText size={32} className="mx-auto text-blue-400 opacity-60 mb-1" />
                          <p className="font-mono text-xs text-slate-200 font-bold">{activeModalDoc.documentName}</p>
                          <a
                            href={activeModalDoc.fileUrl || `https://ik.imagekit.io/demo/sample.pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 underline mt-2 bg-blue-950/60 px-3 py-1 rounded-lg border border-blue-800"
                          >
                            <Eye size={12} /> View Full ImageKit File in New Tab
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: APPLICANT DETAILS */}
              {modalTab === "Applicant Details" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Applicant Profile Credentials
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase text-slate-400 font-extrabold block">Legal Full Name</span>
                      <strong className="text-sm text-slate-900 font-bold">{activeModalDoc.applicantName}</strong>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase text-slate-400 font-extrabold block">Passport Number</span>
                      <strong className="text-sm font-mono text-slate-900 font-bold">{activeModalDoc.passportNumber}</strong>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase text-slate-400 font-extrabold block">Linked Application ID</span>
                      <strong className="text-sm font-mono text-[#2563EB] font-bold">{activeModalDoc.appId}</strong>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase text-slate-400 font-extrabold block">Destination Country</span>
                      <strong className="text-sm text-slate-900 font-bold">{activeModalDoc.country || "Canada"}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DOCUMENT PREVIEW */}
              {modalTab === "Document Preview" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit">
                      High-Resolution Live Document Viewer
                    </h4>
                    <a
                      href={activeModalDoc.fileUrl || `https://ik.imagekit.io/demo/sample.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#2563EB] text-white rounded-xl font-bold text-xs flex items-center gap-1.5"
                    >
                      <Eye size={13} /> Open ImageKit Link
                    </a>
                  </div>
                  <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-center min-h-[350px]">
                    <iframe
                      src={activeModalDoc.fileUrl || `https://ik.imagekit.io/demo/sample.pdf`}
                      title={activeModalDoc.documentName}
                      className="w-full h-80 rounded-xl border border-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: VERIFICATION DETAILS */}
              {modalTab === "Verification Details" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Consular Verification & Audit Metadata
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase text-slate-400 font-extrabold block">Verification Status</span>
                      <strong className="text-sm text-emerald-700 font-bold">{activeModalDoc.verificationStatus}</strong>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase text-slate-400 font-extrabold block">Verified By</span>
                      <strong className="text-sm text-slate-900 font-bold">{activeModalDoc.verifiedBy || "Pending Review"}</strong>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1 col-span-2">
                      <span className="text-[10px] uppercase text-slate-400 font-extrabold block">Remarks & Rejection Notes</span>
                      <p className="text-xs text-slate-700 font-mono mt-1">{activeModalDoc.rejectionReason || activeModalDoc.remarks || "No refusal notes logged."}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: ACTIVITY LOGS */}
              {modalTab === "Activity Logs" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Timestamped Document History Log
                  </h4>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                      <span className="font-bold text-slate-900">Uploaded to Platform</span>
                      <span className="font-mono text-slate-500">{activeModalDoc.uploadDateTime || activeModalDoc.uploadDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">Verification Decision Logged</span>
                      <span className="font-mono text-slate-500">{activeModalDoc.verificationDate || "Pending"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: ACTION NOTES */}
              {modalTab === "Action Notes" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Consular Verification Notes
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add an internal audit note..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
                    >
                      Add Note
                    </button>
                  </div>

                  <div className="space-y-2 mt-3">
                    {activeModalDoc.actionNotes && activeModalDoc.actionNotes.length > 0 ? (
                      activeModalDoc.actionNotes.map((note) => (
                        <div key={note.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <strong className="text-slate-900">{note.author}</strong>
                            <span className="text-[10px] text-slate-400 font-mono">{note.date}</span>
                          </div>
                          <p className="text-slate-700">{note.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No notes added yet for this document.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(() => {
                  const isModalDocVerified = activeModalDoc.verificationStatus?.toLowerCase() === "verified";
                  const isModalDocRejected = activeModalDoc.verificationStatus?.toLowerCase() === "rejected";
                  return (
                    <>
                      <button
                        onClick={() => handleVerifyDocument(activeModalDoc)}
                        disabled={isModalDocVerified}
                        className={`px-4 py-2 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${isModalDocVerified
                          ? "bg-emerald-600/50 opacity-60 cursor-not-allowed shadow-none"
                          : "bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-sm"
                          }`}
                      >
                        <CheckCircle2 size={15} /> {isModalDocVerified ? "Verified ✓" : "Verify Document"}
                      </button>
                      <button
                        onClick={() => handleRejectDocument(activeModalDoc)}
                        disabled={isModalDocRejected}
                        className={`px-4 py-2 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${isModalDocRejected
                          ? "bg-red-600/50 opacity-60 cursor-not-allowed shadow-none"
                          : "bg-red-600 hover:bg-red-700 cursor-pointer shadow-sm"
                          }`}
                      >
                        <XCircle size={15} /> {isModalDocRejected ? "Rejected ✕" : "Reject Document"}
                      </button>
                    </>
                  );
                })()}
              </div>

              <button
                onClick={() => {
                  const targetUrl = activeModalDoc.fileUrl || `https://ik.imagekit.io/demo/sample.pdf`;
                  const a = document.createElement("a");
                  a.href = targetUrl;
                  a.download = activeModalDoc.documentName || `${activeModalDoc.docId}.pdf`;
                  a.target = "_blank";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
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
