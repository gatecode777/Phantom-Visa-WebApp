import React, { useState } from "react";
import {
  FileCheck,
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
  RotateCcw,
  FileText
} from "lucide-react";

export interface VerifiedDocumentRecord {
  id: string;
  docId: string;
  appId: string;
  applicantName: string;
  passportNumber: string;
  documentType:
    | "Passport"
    | "Passport Photograph"
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
  verifiedBy: string;
  verificationDate: string;
  verificationTime: string;
  expiryDate: string;
  status: "Verified" | "Expiring Soon" | "Expired" | "Re-verification Required";
  country?: string;
  verificationRemarks?: string;
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_VERIFIED_DOCUMENT_TABS = [
  "Overview",
  "Applicant Details",
  "Document Preview",
  "Verification Details",
  "Verification History",
  "Activity Logs"
];

export const VERIFIED_WORKFLOW_STEPS = [
  "Document Uploaded",
  "Pending Verification",
  "Admin Review",
  "Verified",
  "Application Processing",
  "Visa Approval"
];

const MOCK_VERIFIED_DOCUMENTS: VerifiedDocumentRecord[] = [
  {
    id: "1",
    docId: "DOC-10245",
    appId: "APP-20261045",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    documentType: "Passport",
    documentName: "Bikram_Passport_Bio.pdf",
    fileFormat: "PDF",
    fileSize: "2.4 MB",
    uploadedBy: "Applicant",
    uploadDate: "01 Aug 2026",
    verifiedBy: "Rahul Sharma",
    verificationDate: "01 Aug 2026",
    verificationTime: "10:30 AM",
    expiryDate: "15 Mar 2032",
    status: "Verified",
    country: "Canada",
    verificationRemarks: "Verified against original passport biometric record.",
    actionNotes: [
      { id: "n1", author: "Rahul Sharma", text: "Verified and approved for Canada eVisa intake.", date: "01 Aug 2026 10:30 AM" }
    ]
  },
  {
    id: "2",
    docId: "DOC-10246",
    appId: "APP-20261046",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    documentType: "Bank Statement",
    documentName: "Geeta_Bank_Statement_6M.pdf",
    fileFormat: "PDF",
    fileSize: "5.1 MB",
    uploadedBy: "Agent",
    agentName: "Apex Travels",
    uploadDate: "01 Aug 2026",
    verifiedBy: "David Thomas",
    verificationDate: "01 Aug 2026",
    verificationTime: "01:15 PM",
    expiryDate: "N/A",
    status: "Verified",
    country: "Australia",
    verificationRemarks: "Closing balance exceeds required financial threshold.",
    actionNotes: []
  },
  {
    id: "3",
    docId: "DOC-10247",
    appId: "APP-20261047",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    documentType: "Travel Insurance",
    documentName: "Rahul_Travel_Insurance_Policy.jpg",
    fileFormat: "JPG",
    fileSize: "1.8 MB",
    uploadedBy: "Applicant",
    uploadDate: "31 Jul 2026",
    verifiedBy: "Sarah Johnston",
    verificationDate: "31 Jul 2026",
    verificationTime: "04:00 PM",
    expiryDate: "25 Sep 2026",
    status: "Expiring Soon",
    country: "UAE",
    verificationRemarks: "Valid travel policy. Renewal alert set for Sep 2026.",
    actionNotes: [
      { id: "n3", author: "Sarah Johnston", text: "Policy verified for 30-day stay.", date: "31 Jul 2026 04:00 PM" }
    ]
  }
];

export default function VerifiedDocumentsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [docTypeFilter, setDocTypeFilter] = useState("All");
  const [verifiedByFilter, setVerifiedByFilter] = useState("All");
  const [uploadedByFilter, setUploadedByFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");

  // Records State
  const [verifiedDocs, setVerifiedDocs] = useState<VerifiedDocumentRecord[]>(MOCK_VERIFIED_DOCUMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalDoc, setActiveModalDoc] = useState<VerifiedDocumentRecord | null>(null);
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
  const filteredDocs = verifiedDocs.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      doc.docId.toLowerCase().includes(q) ||
      doc.appId.toLowerCase().includes(q) ||
      doc.applicantName.toLowerCase().includes(q) ||
      doc.passportNumber.toLowerCase().includes(q) ||
      doc.verifiedBy.toLowerCase().includes(q) ||
      (doc.agentName && doc.agentName.toLowerCase().includes(q));

    const matchesType = docTypeFilter === "All" || doc.documentType === docTypeFilter;
    const matchesVerifiedBy = verifiedByFilter === "All" || doc.verifiedBy === verifiedByFilter;
    const matchesUploadedBy = uploadedByFilter === "All" || doc.uploadedBy === uploadedByFilter;
    const matchesCountry = countryFilter === "All" || doc.country === countryFilter;

    return matchesQuery && matchesType && matchesVerifiedBy && matchesUploadedBy && matchesCountry;
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
  const handleRequestReverification = (doc: VerifiedDocumentRecord) => {
    setVerifiedDocs((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, status: "Re-verification Required" } : d))
    );
    triggerToast(`Re-verification requested for ${doc.docId}.`);
    if (activeModalDoc?.id === doc.id) {
      setActiveModalDoc((prev) => (prev ? { ...prev, status: "Re-verification Required" } : null));
    }
  };

  const handleDeleteRecord = (doc: VerifiedDocumentRecord) => {
    setVerifiedDocs((prev) => prev.filter((d) => d.id !== doc.id));
    triggerToast(`Verified document record ${doc.docId} deleted.`);
    if (activeModalDoc?.id === doc.id) setActiveModalDoc(null);
  };

  const handleBulkDownload = () => {
    triggerToast(`Downloading ${selectedIds.length} verified document files.`);
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
            <FileCheck size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Verified Compliance Archive
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Verified Documents
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            View and manage all documents that have been successfully verified and approved for visa processing.
          </p>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Verified</span>
            <div className="text-2xl font-black text-slate-900 font-mono">14,286</div>
            <span className="text-[10px] text-emerald-600 font-bold">Approved Document Vault</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Verified Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">128</div>
            <span className="text-[10px] text-emerald-600 font-bold">Daily Approvals</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Verified This Week</span>
            <div className="text-2xl font-black text-slate-900 font-mono">892</div>
            <span className="text-[10px] text-blue-600 font-bold">Weekly Audit</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Verified This Month</span>
            <div className="text-2xl font-black text-slate-900 font-mono">3,545</div>
            <span className="text-[10px] text-purple-600 font-bold">Monthly Volume</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Expiring Soon</span>
            <div className="text-2xl font-black text-slate-900 font-mono">124</div>
            <span className="text-[10px] text-amber-600 font-bold">Validity Warning</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Expired Documents</span>
            <div className="text-2xl font-black text-slate-900 font-mono">48</div>
            <span className="text-[10px] text-red-600 font-bold">Renewal Needed</span>
          </div>
        </div>

        {/* RIGHT CARD: RECOMMENDED TABS, WORKFLOW & FEATURES (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Verification Workflow
            </h3>

            {/* VERIFICATION WORKFLOW FLOW */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {VERIFIED_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-[9px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* PROFESSIONAL FEATURES: STATUS INDICATORS & TABLE COLUMNS */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-900 font-bold block mb-1">Status Indicators:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                <div className="flex items-center gap-1 text-emerald-700">🟢 Verified</div>
                <div className="flex items-center gap-1 text-amber-700">⚠️ Expiring Soon</div>
                <div className="flex items-center gap-1 text-red-700">🔴 Expired</div>
                <div className="flex items-center gap-1 text-blue-700">🔄 Re-verification</div>
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
            Showing {filteredDocs.length} of {verifiedDocs.length} Verified Documents
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
                placeholder="DOC-10245, APP-20261045..."
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
              <option value="Bank Statement">Bank Statement</option>
              <option value="Travel Insurance">Travel Insurance</option>
              <option value="Medical Certificate">Medical Certificate</option>
            </select>
          </div>

          {/* VERIFIED BY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Verified By
            </label>
            <select
              value={verifiedByFilter}
              onChange={(e) => setVerifiedByFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Admins</option>
              <option value="Rahul Sharma">Rahul Sharma</option>
              <option value="David Thomas">David Thomas</option>
              <option value="Sarah Johnston">Sarah Johnston</option>
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
            <span>Verified Documents Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkDownload}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Download Selected
            </button>
            <button
              onClick={() => triggerToast(`Exporting data for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <FileCheck size={14} /> Export Verified Documents
            </button>
          </div>
        </div>
      )}

      {/* VERIFIED DOCUMENTS TABLE (COLUMNS MATCH WIREFRAME EXACTLY) */}
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
                <th className="py-3.5 px-4">Verified By</th>
                <th className="py-3.5 px-4 font-mono">Verification Date</th>
                <th className="py-3.5 px-4 font-mono">Expiry Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <FileCheck size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No verified documents found matching your filters.</p>
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
                    <td className="py-3.5 px-4 font-bold text-[#2563EB]">
                      {d.verifiedBy}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {d.verificationDate}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {d.expiryDate}
                    </td>
                    <td className="py-3.5 px-4">
                      {d.status === "Expiring Soon" ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-200">
                          ⚠️ Expiring Soon
                        </span>
                      ) : d.status === "Expired" ? (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                          🔴 Expired
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          🟢 Verified
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
                          title="View Document Details & Preview"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Downloading ${d.documentName}...`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Download File"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Printing ${d.documentName}...`)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Print Document"
                        >
                          <Printer size={15} />
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
          <div>Showing 1–10 of 14,286 Verified Documents</div>
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
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-lg text-white">
                  <FileCheck size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalDoc.documentName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-700">
                      {activeModalDoc.docId} (VERIFIED)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">App ID: <strong className="text-blue-300">{activeModalDoc.appId}</strong> &bull; Verified By: {activeModalDoc.verifiedBy} ({activeModalDoc.verificationDate})</p>
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
              {RECOMMENDED_VERIFIED_DOCUMENT_TABS.map((tab) => {
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
                      Verification Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Document ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalDoc.docId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Verified By</span>
                        <strong className="text-[#2563EB] font-bold">{activeModalDoc.verifiedBy}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Verification Timestamp</span>
                        <strong className="text-slate-900 font-mono font-bold">{activeModalDoc.verificationDate} ({activeModalDoc.verificationTime})</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Expiry Date</span>
                        <strong className="text-slate-900 font-mono font-bold">{activeModalDoc.expiryDate}</strong>
                      </div>
                    </div>
                  </div>

                  {/* DOCUMENT PREVIEW BOX WITH CONTROLS (FROM WIREFRAME) */}
                  <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 font-outfit flex items-center gap-2">
                        <FileText size={16} className="text-emerald-400" /> Verified Document Render Preview
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
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white cursor-pointer ml-1"
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
                        <FileCheck size={48} className="mx-auto mb-2 text-emerald-400" />
                        <p className="font-mono text-xs text-slate-200 font-bold">{activeModalDoc.documentName}</p>
                        <p className="text-[10px] text-emerald-400 font-mono mt-1">✓ Verified Stamp Applied ({previewZoom}%)</p>
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
                  onClick={() => triggerToast(`Downloading ${activeModalDoc.documentName}...`)}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={15} /> Download Document
                </button>
                <button
                  onClick={() => triggerToast(`Printing ${activeModalDoc.documentName}...`)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Printer size={15} /> Print Document
                </button>
              </div>

              <button
                onClick={() => handleRequestReverification(activeModalDoc)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw size={14} /> Request Re-verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
