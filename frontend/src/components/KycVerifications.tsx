import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Download,
  FileText,
  UserCheck,
  RotateCcw,
  Bell,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
  Layers,
  MessageSquare,
  AlertCircle,
  Check,
  Building,
  User
} from "lucide-react";

export interface KycRecord {
  id: string;
  applicantName: string;
  avatar: string;
  passportNo: string;
  country: string;
  flag: string;
  submittedOn: string;
  kycStatus: "Pending" | "Approved" | "Rejected";
  assignedAgent: string;
  dob: string;
  nationality: string;
  email: string;
  mobile: string;
  documentType: "Passport" | "National ID" | "Driving License" | "Residence Permit";
  submittedDocuments: {
    name: string;
    type: string;
    verified: boolean;
    size: string;
  }[];
  verificationChecklist: {
    passportNumberMatches: boolean;
    nameMatches: boolean;
    dobVerified: boolean;
    passportExpiryValid: boolean;
    faceVerification: boolean;
    addressVerified: boolean;
  };
  remarks: string;
}

const mockKycRecords: KycRecord[] = [
  {
    id: "KYC-1001",
    applicantName: "Geeta Bisht",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    passportNo: "P12345678",
    country: "India",
    flag: "🇮🇳",
    submittedOn: "24 Jul 2026",
    kycStatus: "Pending",
    assignedAgent: "Sarah Wilson",
    dob: "14 May 1994",
    nationality: "Indian",
    email: "geeta@email.com",
    mobile: "+91 9876543210",
    documentType: "Passport",
    submittedDocuments: [
      { name: "Biometric Passport Front & Back", type: "PDF", verified: true, size: "2.4 MB" },
      { name: "Passport Size Photograph (Studio White BG)", type: "JPG", verified: true, size: "850 KB" },
      { name: "National Aadhaar ID Card", type: "PDF", verified: false, size: "1.1 MB" },
      { name: "Verified Address Proof (Utility Bill)", type: "PDF", verified: true, size: "1.8 MB" },
      { name: "Live Selfie holding Passport Bio Page", type: "PNG", verified: false, size: "3.2 MB" }
    ],
    verificationChecklist: {
      passportNumberMatches: true,
      nameMatches: true,
      dobVerified: true,
      passportExpiryValid: true,
      faceVerification: false,
      addressVerified: true
    },
    remarks: "Passport bio page scan verified clean. Pending live selfie face match verification by agent."
  },
  {
    id: "KYC-1002",
    applicantName: "Rahul Sharma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    passportNo: "P98765432",
    country: "India",
    flag: "🇮🇳",
    submittedOn: "24 Jul 2026",
    kycStatus: "Approved",
    assignedAgent: "David Lee",
    dob: "22 Aug 1991",
    nationality: "Indian",
    email: "rahul@email.com",
    mobile: "+91 9812345678",
    documentType: "Passport",
    submittedDocuments: [
      { name: "Official Indian Passport Scan", type: "PDF", verified: true, size: "3.1 MB" },
      { name: "High-Res Passport Photograph", type: "JPG", verified: true, size: "920 KB" },
      { name: "Pan Card Identity Proof", type: "PDF", verified: true, size: "1.4 MB" },
      { name: "Residential Address Verification", type: "PDF", verified: true, size: "2.0 MB" },
      { name: "Biometric Face Match Selfie", type: "PNG", verified: true, size: "2.8 MB" }
    ],
    verificationChecklist: {
      passportNumberMatches: true,
      nameMatches: true,
      dobVerified: true,
      passportExpiryValid: true,
      faceVerification: true,
      addressVerified: true
    },
    remarks: "All identity documents cross-verified with government passport portal database. KYC Approved."
  },
  {
    id: "KYC-1003",
    applicantName: "Maria Wilson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
    passportNo: "X45678901",
    country: "USA",
    flag: "🇺🇸",
    submittedOn: "24 Jul 2026",
    kycStatus: "Rejected",
    assignedAgent: "Sarah Wilson",
    dob: "10 Oct 1996",
    nationality: "American",
    email: "maria@email.com",
    mobile: "+1 5550192834",
    documentType: "Passport",
    submittedDocuments: [
      { name: "US Passport Scan (Low Resolution)", type: "PDF", verified: false, size: "450 KB" },
      { name: "Passport Photo", type: "JPG", verified: false, size: "310 KB" },
      { name: "State Driver License", type: "PDF", verified: true, size: "1.5 MB" }
    ],
    verificationChecklist: {
      passportNumberMatches: false,
      nameMatches: true,
      dobVerified: true,
      passportExpiryValid: false,
      faceVerification: false,
      addressVerified: true
    },
    remarks: "Passport image copy was blurry and bio MRZ barcode unreadable. Resubmission requested."
  },
  {
    id: "KYC-1004",
    applicantName: "Vikram Malhotra",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    passportNo: "K9023412",
    country: "India",
    flag: "🇮🇳",
    submittedOn: "23 Jul 2026",
    kycStatus: "Pending",
    assignedAgent: "David Lee",
    dob: "05 Nov 1988",
    nationality: "Indian",
    email: "vikram@email.com",
    mobile: "+91 9988776655",
    documentType: "Passport",
    submittedDocuments: [
      { name: "Indian Passport Copy", type: "PDF", verified: true, size: "2.7 MB" },
      { name: "Digital Passport Photograph", type: "JPG", verified: true, size: "1.0 MB" },
      { name: "Voter ID Card", type: "PDF", verified: true, size: "1.2 MB" }
    ],
    verificationChecklist: {
      passportNumberMatches: true,
      nameMatches: true,
      dobVerified: true,
      passportExpiryValid: true,
      faceVerification: false,
      addressVerified: true
    },
    remarks: "Awaiting final automated OCR MRZ checksum confirmation."
  },
  {
    id: "KYC-1005",
    applicantName: "Ananya Roy",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
    passportNo: "P1239874",
    country: "India",
    flag: "🇮🇳",
    submittedOn: "22 Jul 2026",
    kycStatus: "Approved",
    assignedAgent: "Sarah Wilson",
    dob: "19 Feb 1995",
    nationality: "Indian",
    email: "ananya@email.com",
    mobile: "+91 9765432109",
    documentType: "Passport",
    submittedDocuments: [
      { name: "Passport Bio & Address Pages", type: "PDF", verified: true, size: "3.5 MB" },
      { name: "Studio Photo", type: "JPG", verified: true, size: "900 KB" },
      { name: "Aadhaar Card Copy", type: "PDF", verified: true, size: "1.9 MB" }
    ],
    verificationChecklist: {
      passportNumberMatches: true,
      nameMatches: true,
      dobVerified: true,
      passportExpiryValid: true,
      faceVerification: true,
      addressVerified: true
    },
    remarks: "All 6 verification checklist items passed. KYC identity approved."
  }
];

export default function KycVerifications() {
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [docTypeFilter, setDocTypeFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Selection States for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Selected KYC Record for Detail Modal State
  const [viewRecord, setViewRecord] = useState<KycRecord | null>(null);
  const [modalTab, setModalTab] = useState<
    "applicantInfo" | "documents" | "checklist" | "remarks" | "quickActions" | "bulkActions"
  >("applicantInfo");

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // KYC Records State
  const [records, setRecords] = useState<KycRecord[]>(mockKycRecords);

  // Filter Logic
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.passportNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || r.kycStatus === statusFilter;
    const matchesDocType = docTypeFilter === "All" || r.documentType === docTypeFilter;

    return matchesSearch && matchesStatus && matchesDocType;
  });

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredRecords.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Actions
  const handleApproveKyc = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, kycStatus: "Approved" } : r))
    );
    const target = records.find((r) => r.id === id);
    triggerToast(`KYC Approved for ${target?.applicantName || id}`);
    if (viewRecord?.id === id) {
      setViewRecord((prev) => (prev ? { ...prev, kycStatus: "Approved" } : null));
    }
  };

  const handleRejectKyc = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, kycStatus: "Rejected" } : r))
    );
    const target = records.find((r) => r.id === id);
    triggerToast(`KYC Rejected for ${target?.applicantName || id}`);
    if (viewRecord?.id === id) {
      setViewRecord((prev) => (prev ? { ...prev, kycStatus: "Rejected" } : null));
    }
  };

  const handleRequestResubmission = (id: string) => {
    const target = records.find((r) => r.id === id);
    triggerToast(`Document Resubmission requested for ${target?.applicantName || id}`);
  };

  const handleBulkAction = (action: string) => {
    if (selectedIds.length === 0) {
      triggerToast("Please select at least one KYC request first.");
      return;
    }

    if (action === "approve") {
      setRecords((prev) =>
        prev.map((r) => (selectedIds.includes(r.id) ? { ...r, kycStatus: "Approved" } : r))
      );
      triggerToast(`Approved KYC for ${selectedIds.length} selected request(s).`);
      setSelectedIds([]);
    } else if (action === "reject") {
      setRecords((prev) =>
        prev.map((r) => (selectedIds.includes(r.id) ? { ...r, kycStatus: "Rejected" } : r))
      );
      triggerToast(`Rejected KYC for ${selectedIds.length} selected request(s).`);
      setSelectedIds([]);
    } else {
      triggerToast(`Executed '${action}' for ${selectedIds.length} selected request(s).`);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setDocTypeFilter("All");
    setFromDate("");
    setToDate("");
    triggerToast("Search & Filter inputs reset to default.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-800">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-mono text-[#2563EB] mb-1">
          <ShieldCheck size={14} />
          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 font-bold">
            KYC Verifications
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">KYC Verifications</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Review, verify, approve, or reject applicant identity documents submitted for KYC verification.
        </p>
      </div>

      {/* STATISTICS CARDS (4 CARDS GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total KYC Requests */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total KYC Requests</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <FileText size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">1,248</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <ArrowUpRight size={13} />
            <span>+14.2% vs last month</span>
          </div>
        </div>

        {/* Card 2: Pending Verification */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Pending Verification</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Clock size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">124</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-semibold mt-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>12 Urgent Queue</span>
          </div>
        </div>

        {/* Card 3: Approved KYC */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Approved KYC</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">1,082</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <ShieldCheck size={13} />
            <span>95.2% Approval Rate</span>
          </div>
        </div>

        {/* Card 4: Rejected KYC */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Rejected KYC</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <XCircle size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">42</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-red-600 font-semibold mt-2">
            <XCircle size={13} />
            <span>Doc Mismatch / Blurry</span>
          </div>
        </div>
      </div>

      {/* SEARCH & MULTI-CRITERIA FILTERS BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" />
            <span>Search & Filter KYC Submissions</span>
          </h3>
          <button
            onClick={handleResetFilters}
            className="text-xs text-slate-500 hover:text-[#2563EB] font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <RefreshCw size={12} /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* Filter 1: Search Query */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Search Keyword
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Name, Email, Passport, KYC ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Filter 2: KYC Status */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              KYC Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">🟡 Pending Verification</option>
              <option value="Approved">🟢 Approved</option>
              <option value="Rejected">🔴 Rejected</option>
            </select>
          </div>

          {/* Filter 3: Document Type */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Document Type
            </label>
            <select
              value={docTypeFilter}
              onChange={(e) => setDocTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
            >
              <option value="All">All Document Types</option>
              <option value="Passport">Passport</option>
              <option value="National ID">National ID</option>
              <option value="Driving License">Driving License</option>
              <option value="Residence Permit">Residence Permit</option>
            </select>
          </div>

          {/* Filter 4: From Submitted Date */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              From Submitted Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
            />
          </div>

          {/* Filter 5: To Submitted Date */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              To Submitted Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            onClick={() => triggerToast(`Filters applied: ${filteredRecords.length} KYC record(s) found`)}
            className="px-5 py-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-bold rounded-xl shadow-md shadow-[#2563EB]/20 transition cursor-pointer flex items-center gap-1.5"
          >
            <Filter size={14} /> Apply Filters
          </button>
        </div>
      </div>

      {/* CONTEXTUAL BULK ACTIONS TOOLBAR */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs text-[#2563EB] font-bold">
            <CheckCircle2 size={16} />
            <span>{selectedIds.length} KYC Request(s) Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => handleBulkAction("approve")}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 size={14} /> Approve Selected
            </button>
            <button
              onClick={() => handleBulkAction("reject")}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle size={14} /> Reject Selected
            </button>
            <button
              onClick={() => handleBulkAction("notification")}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Bell size={14} /> Send Notification
            </button>
            <button
              onClick={() => handleBulkAction("export")}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} /> Export KYC Report
            </button>
          </div>
        </div>
      )}

      {/* KYC VERIFICATION TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length > 0 && selectedIds.length === filteredRecords.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">KYC ID</th>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Passport No.</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Submitted On</th>
                <th className="py-3.5 px-4">KYC Status</th>
                <th className="py-3.5 px-4">Assigned Agent</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <AlertCircle size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-bold">No KYC records match your filter criteria.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 text-xs text-[#2563EB] font-semibold underline cursor-pointer"
                    >
                      Clear search filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr
                    key={r.id}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      selectedIds.includes(r.id) ? "bg-blue-50/60" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(r.id)}
                        onChange={() => handleToggleSelect(r.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {r.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={r.avatar}
                          alt={r.applicantName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <span className="font-extrabold text-slate-900">{r.applicantName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono font-bold">{r.passportNo}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <span>{r.flag}</span> {r.country}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{r.submittedOn}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border inline-flex items-center gap-1.5 ${
                          r.kycStatus === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : r.kycStatus === "Rejected"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            r.kycStatus === "Approved"
                              ? "bg-emerald-500"
                              : r.kycStatus === "Rejected"
                              ? "bg-red-500"
                              : "bg-amber-500"
                          }`}
                        />
                        {r.kycStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-semibold">{r.assignedAgent}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setViewRecord(r);
                            setModalTab("applicantInfo");
                          }}
                          title="View Details & Documents"
                          className="p-1.5 hover:bg-blue-100 text-slate-600 hover:text-[#2563EB] rounded-lg transition cursor-pointer"
                        >
                          <Eye size={15} />
                        </button>
                        {r.kycStatus !== "Approved" && (
                          <button
                            onClick={() => handleApproveKyc(r.id)}
                            title="Approve KYC"
                            className="p-1.5 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 rounded-lg transition cursor-pointer"
                          >
                            <CheckCircle2 size={15} />
                          </button>
                        )}
                        {r.kycStatus !== "Rejected" && (
                          <button
                            onClick={() => handleRejectKyc(r.id)}
                            title="Reject KYC"
                            className="p-1.5 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition cursor-pointer"
                          >
                            <XCircle size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => handleRequestResubmission(r.id)}
                          title="Request Resubmission"
                          className="p-1.5 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-lg transition cursor-pointer"
                        >
                          <RotateCcw size={15} />
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
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900">1–{filteredRecords.length}</strong> of{" "}
            <strong className="text-slate-900">124 Pending KYC Requests</strong>
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 cursor-pointer flex items-center gap-1 font-semibold">
              <ChevronLeft size={14} /> Previous
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#2563EB] text-white font-bold cursor-pointer">
              1
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer">
              2
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer flex items-center gap-1 font-semibold">
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* KYC DETAILS CENTERED VIEW MODAL (6 SECTIONS) */}
      {viewRecord && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewRecord(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-slate-800">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-5 flex items-center justify-between border-b border-blue-700 shrink-0 rounded-t-3xl shadow-md">
              <div className="flex items-center gap-3.5">
                <img
                  src={viewRecord.avatar}
                  alt={viewRecord.applicantName}
                  className="w-13 h-13 rounded-full object-cover border-2 border-white/90 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-black text-white font-outfit tracking-wide">
                      {viewRecord.applicantName}
                    </h2>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                        viewRecord.kycStatus === "Approved"
                          ? "bg-emerald-500/20 text-white border-white/30"
                          : viewRecord.kycStatus === "Rejected"
                          ? "bg-red-500/30 text-white border-white/30"
                          : "bg-amber-500/20 text-white border-white/30"
                      }`}
                    >
                      KYC Status: {viewRecord.kycStatus}
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 font-mono flex items-center gap-2 mt-1">
                    <span>{viewRecord.id}</span>
                    <span className="text-blue-300">•</span>
                    <span>Passport: {viewRecord.passportNo}</span>
                    <span className="text-blue-300">•</span>
                    <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-white font-sans font-semibold">
                      <span>{viewRecord.flag}</span> {viewRecord.country}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewRecord(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer border border-white/20"
              >
                <X size={18} />
              </button>
            </div>

            {/* 6 Section Navigation Tabs */}
            <div className="bg-[#EEF2FF] border-b-2 border-blue-200 px-4 flex items-center gap-1.5 overflow-x-auto shrink-0 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-blue-100 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full">
              {[
                { id: "applicantInfo", label: "Applicant Information", icon: User },
                { id: "documents", label: "Submitted Documents", icon: FileText },
                { id: "checklist", label: "Verification Checklist", icon: CheckCircle2 },
                { id: "remarks", label: "Admin Remarks", icon: MessageSquare },
                { id: "quickActions", label: "Quick Actions", icon: UserCheck },
                { id: "bulkActions", label: "Bulk Actions", icon: Layers }
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = modalTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id as any)}
                    className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all duration-200 whitespace-nowrap cursor-pointer -mb-[2px] ${
                      isActive
                        ? "bg-[#2563EB] text-white font-extrabold rounded-t-xl shadow-md border-[#2563EB]"
                        : "border-transparent text-slate-700 hover:text-[#2563EB] hover:bg-white/80"
                    }`}
                  >
                    <IconComp size={15} className={isActive ? "text-white" : "text-[#2563EB]/70"} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/90 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#F1F5F9] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* 1. APPLICANT INFORMATION TAB */}
              {modalTab === "applicantInfo" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <User size={16} className="text-[#2563EB]" />
                      <span>Applicant Information</span>
                    </h3>
                    <span className="text-[10px] font-mono text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 font-bold">
                      KYC Identity Dossier
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Full Name
                      </span>
                      <strong className="text-slate-900 text-sm font-extrabold">
                        {viewRecord.applicantName}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Date of Birth
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewRecord.dob}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Nationality
                      </span>
                      <strong className="text-slate-800 font-bold">
                        {viewRecord.nationality}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Passport Number
                      </span>
                      <strong className="text-[#2563EB] font-mono text-sm font-extrabold">
                        {viewRecord.passportNo}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Email Address
                      </span>
                      <strong className="text-[#2563EB] font-mono font-bold">
                        {viewRecord.email}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Mobile Number
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewRecord.mobile}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. SUBMITTED DOCUMENTS TAB */}
              {modalTab === "documents" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <FileText size={16} className="text-[#2563EB]" />
                      <span>Submitted Identity Documents</span>
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    {viewRecord.submittedDocuments.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200/80 bg-slate-50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-[#2563EB]" />
                          <div>
                            <span className="font-extrabold text-slate-800 block">{doc.name}</span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {doc.type} • {doc.size}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => triggerToast(`Preview opened for ${doc.name}`)}
                            className="px-3 py-1 bg-white hover:bg-blue-50 text-[#2563EB] border border-blue-200 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Eye size={13} /> View
                          </button>
                          {doc.verified ? (
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold font-mono text-[11px] flex items-center gap-1">
                              <CheckCircle2 size={13} /> Verified
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-bold font-mono text-[11px] flex items-center gap-1">
                              <Clock size={13} /> Pending Audit
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. VERIFICATION CHECKLIST TAB */}
              {modalTab === "checklist" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <CheckCircle2 size={16} className="text-[#2563EB]" />
                      <span>Verification Audit Checklist</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    {[
                      { key: "passportNumberMatches", label: "Passport Number Matches Database" },
                      { key: "nameMatches", label: "Applicant Name Matches Document" },
                      { key: "dobVerified", label: "Date of Birth Verified" },
                      { key: "passportExpiryValid", label: "Passport Expiry Date Valid (>6 Months)" },
                      { key: "faceVerification", label: "Biometric Live Selfie Face Match" },
                      { key: "addressVerified", label: "Residential Address Verified" }
                    ].map((item) => {
                      const isPassed =
                        viewRecord.verificationChecklist[
                          item.key as keyof typeof viewRecord.verificationChecklist
                        ];

                      return (
                        <div
                          key={item.key}
                          className={`p-3.5 rounded-xl border flex items-center justify-between font-bold ${
                            isPassed
                              ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
                              : "bg-amber-50/70 border-amber-200 text-amber-800"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {isPassed ? (
                              <CheckCircle2 size={16} className="text-emerald-600" />
                            ) : (
                              <XCircle size={16} className="text-amber-600" />
                            )}
                            <span>{item.label}</span>
                          </span>
                          <span className="font-mono text-[11px] font-extrabold uppercase">
                            {isPassed ? "PASSED" : "PENDING"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. ADMIN REMARKS TAB */}
              {modalTab === "remarks" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <MessageSquare size={16} className="text-[#2563EB]" />
                      <span>Auditor Remarks & Audit Notes</span>
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Current Remarks
                      </span>
                      <p className="text-slate-800 font-semibold leading-relaxed">
                        {viewRecord.remarks}
                      </p>
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Add Audit Remark Note
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Enter internal verification remarks for agent review..."
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs p-3 rounded-xl focus:outline-none focus:border-[#2563EB]"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => triggerToast("Audit remark updated.")}
                          className="px-4 py-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                        >
                          Save Remarks
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. QUICK ACTIONS TAB */}
              {modalTab === "quickActions" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <UserCheck size={16} className="text-[#2563EB]" />
                      <span>Quick Operational Actions</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <button
                      onClick={() => setModalTab("documents")}
                      className="p-3.5 bg-white hover:bg-[#EEF2FF] border border-slate-200 hover:border-[#2563EB]/50 rounded-xl font-bold text-[#2563EB] flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>View Documents</span>
                      <Eye size={15} />
                    </button>

                    <button
                      onClick={() => handleApproveKyc(viewRecord.id)}
                      className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl font-bold text-emerald-700 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Approve KYC</span>
                      <CheckCircle2 size={15} />
                    </button>

                    <button
                      onClick={() => handleRejectKyc(viewRecord.id)}
                      className="p-3.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl font-bold text-red-700 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Reject KYC</span>
                      <XCircle size={15} />
                    </button>

                    <button
                      onClick={() => handleRequestResubmission(viewRecord.id)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Request Resubmission</span>
                      <RotateCcw size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => triggerToast(`Push notification sent to ${viewRecord.applicantName}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Notify Applicant</span>
                      <Bell size={15} className="text-[#2563EB]" />
                    </button>
                  </div>
                </div>
              )}

              {/* 6. BULK ACTIONS TAB */}
              {modalTab === "bulkActions" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Layers size={16} className="text-[#2563EB]" />
                      <span>Bulk KYC Actions</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <button
                      onClick={() => handleSelectAll(true)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Select All Requests</span>
                      <CheckCircle2 size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBulkAction("approve")}
                      className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl font-bold text-emerald-700 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Approve Selected</span>
                      <CheckCircle2 size={15} />
                    </button>

                    <button
                      onClick={() => handleBulkAction("reject")}
                      className="p-3.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl font-bold text-red-700 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Reject Selected</span>
                      <XCircle size={15} />
                    </button>

                    <button
                      onClick={() => handleBulkAction("notification")}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Send Notification</span>
                      <Bell size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBulkAction("export")}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Export KYC Report</span>
                      <Download size={15} className="text-[#2563EB]" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
