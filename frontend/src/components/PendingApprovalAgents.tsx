import React, { useState, useEffect } from "react";
import { API_V1_URL } from "../config/api";
import {
  Clock,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Building,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Send,
  Download,
  Bell,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
  Layers,
  MessageSquare,
  FilePlus,
  Check,
  HelpCircle,
  AlertTriangle
} from "lucide-react";

export interface PendingAgentRecord {
  id: string;
  name: string;
  avatar: string;
  agencyName: string;
  agencyType: "Travel Agency" | "Immigration Consultant" | "Corporate Partner" | "Individual Agent";
  regDate: string;
  kycStatus: "Pending" | "Under Review";
  submittedDocs: string; // e.g. "6/6"
  status: "Pending Approval";
  email: string;
  mobile: string;
  dob: string;
  address: string;
  agencyRegNo: string;
  businessLicense: string;
  gstTaxNo: string;
  officeAddress: string;
  website: string;
  documentsList: {
    name: string;
    submitted: boolean;
    size: string;
  }[];
  checklist: {
    identityVerified: boolean;
    businessRegVerified: boolean;
    licenseVerified: boolean;
    addressVerified: boolean;
    bankVerified: boolean;
  };
  remarks: string;
}

const mockPendingAgents: PendingAgentRecord[] = [
  {
    id: "AGT-1001",
    name: "Geeta Bisht",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    agencyName: "Global Visa Services",
    agencyType: "Travel Agency",
    regDate: "28 Jul 2026",
    kycStatus: "Pending",
    submittedDocs: "6/6",
    status: "Pending Approval",
    email: "geeta@gmail.com",
    mobile: "+91 9876543210",
    dob: "14 May 1990",
    address: "B-402, Connaught Place, New Delhi, India",
    agencyRegNo: "REG-IND-99120",
    businessLicense: "LIC-DEL-88912",
    gstTaxNo: "07AAAAA0000A1Z5",
    officeAddress: "Suite 401, Global Tower, CP, New Delhi",
    website: "https://globalvisa.com",
    documentsList: [
      { name: "Government ID (Aadhaar/Passport)", submitted: true, size: "2.4 MB" },
      { name: "Business Registration Certificate", submitted: true, size: "3.1 MB" },
      { name: "Business License Document", submitted: true, size: "1.8 MB" },
      { name: "Office Address Proof (Utility Bill)", submitted: true, size: "1.5 MB" },
      { name: "Bank Passbook / Cancelled Cheque", submitted: true, size: "2.0 MB" },
      { name: "Agency Official Logo", submitted: true, size: "850 KB" }
    ],
    checklist: {
      identityVerified: true,
      businessRegVerified: true,
      licenseVerified: true,
      addressVerified: true,
      bankVerified: false
    },
    remarks: "Submitted all 6 required verification documents. Bank details pending final audit."
  },
  {
    id: "AGT-1002",
    name: "Rahul Sharma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    agencyName: "Visa Experts Ltd",
    agencyType: "Immigration Consultant",
    regDate: "28 Jul 2026",
    kycStatus: "Under Review",
    submittedDocs: "5/6",
    status: "Pending Approval",
    email: "rahul@gmail.com",
    mobile: "+91 9812345678",
    dob: "22 Aug 1988",
    address: "A-12, Sector 62, Noida, UP, India",
    agencyRegNo: "REG-UP-44512",
    businessLicense: "LIC-NOI-33219",
    gstTaxNo: "09BBBBB1111B2Y6",
    officeAddress: "2nd Floor, Visa Plaza, Noida Sector 62",
    website: "https://visaexperts.in",
    documentsList: [
      { name: "Government ID (Aadhaar/Passport)", submitted: true, size: "2.1 MB" },
      { name: "Business Registration Certificate", submitted: true, size: "2.9 MB" },
      { name: "Business License Document", submitted: true, size: "1.4 MB" },
      { name: "Office Address Proof", submitted: true, size: "1.2 MB" },
      { name: "Bank Passbook", submitted: true, size: "1.9 MB" },
      { name: "Agency Logo", submitted: false, size: "0 KB" }
    ],
    checklist: {
      identityVerified: true,
      businessRegVerified: true,
      licenseVerified: false,
      addressVerified: true,
      bankVerified: true
    },
    remarks: "Agency logo missing from upload bundle. Re-submission requested for logo image."
  },
  {
    id: "AGT-1003",
    name: "David Lee",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    agencyName: "World Travel Agency",
    agencyType: "Individual Agent",
    regDate: "27 Jul 2026",
    kycStatus: "Pending",
    submittedDocs: "6/6",
    status: "Pending Approval",
    email: "david@worldtravel.com",
    mobile: "+91 9988776655",
    dob: "10 Apr 1985",
    address: "C-88, Malviya Nagar, Jaipur, Rajasthan",
    agencyRegNo: "REG-RAJ-88123",
    businessLicense: "LIC-JAI-11209",
    gstTaxNo: "08CCCCC2222C3X7",
    officeAddress: "G-10, Travel Hub, MI Road, Jaipur",
    website: "https://worldtravel.co.in",
    documentsList: [
      { name: "Government ID", submitted: true, size: "3.0 MB" },
      { name: "Business Registration Certificate", submitted: true, size: "2.2 MB" },
      { name: "Business License Document", submitted: true, size: "1.9 MB" },
      { name: "Office Address Proof", submitted: true, size: "1.6 MB" },
      { name: "Bank Verification Cheque", submitted: true, size: "2.4 MB" },
      { name: "Agency Logo", submitted: true, size: "900 KB" }
    ],
    checklist: {
      identityVerified: true,
      businessRegVerified: true,
      licenseVerified: true,
      addressVerified: true,
      bankVerified: true
    },
    remarks: "All 6 verification checklist items passed. Ready for single-click approval."
  }
];

export default function PendingApprovalAgents() {
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [agencyTypeFilter, setAgencyTypeFilter] = useState("All");
  const [kycStatusFilter, setKycStatusFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Selection States for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Selected Agent Details Modal State
  const [viewAgent, setViewAgent] = useState<PendingAgentRecord | null>(null);
  const [modalTab, setModalTab] = useState<
    "personal" | "agency" | "documents" | "checklist" | "remarks" | "quickActions" | "bulkActions"
  >("personal");

  // Approval Confirmation Modal State
  const [approveAgentTarget, setApproveAgentTarget] = useState<PendingAgentRecord | null>(null);

  // Rejection Modal State
  const [rejectAgentTarget, setRejectAgentTarget] = useState<PendingAgentRecord | null>(null);
  const [rejectionReasons, setRejectionReasons] = useState<{ [key: string]: boolean }>({
    incompleteDocs: false,
    invalidLicense: false,
    failedKyc: false,
    other: false
  });
  const [customRejectReason, setCustomRejectReason] = useState("");

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Agent Records List State (Loaded dynamically from MongoDB)
  const [agents, setAgents] = useState<PendingAgentRecord[]>([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch(`${API_V1_URL}/agent/all`);
        const json = await res.json();
        if (res.ok && json.success && Array.isArray(json.data)) {
          const apiAgents: PendingAgentRecord[] = json.data
            .filter((item: any) => item.status === "Pending Approval")
            .map((item: any) => ({
              id: item.id || "AGT-1001",
              name: item.name || "Travel Agent",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
              agencyName: item.agencyName || "Visa Agency",
              agencyType: "Travel Agency",
              regDate: item.registeredOn || "Recently",
              kycStatus: "Pending",
              submittedDocs: "6/6",
              status: "Pending Approval",
              email: item.email || "agent@email.com",
              mobile: item.phone || "+91 9876543210",
              dob: item.dob || "N/A",
              address: `${item.city || 'New Delhi'}, ${item.country || 'India'}`,
              agencyRegNo: item.agencyRegNo || "REG-99120",
              businessLicense: item.businessLicense || "LIC-11209",
              gstTaxNo: item.gstTaxNo || "08AAAAA0000A1Z5",
              officeAddress: item.officeAddress || "N/A",
              website: item.website || "N/A",
              documentsList: [
                { name: "Government ID", submitted: true, size: "2.5 MB" },
                { name: "Business Registration Certificate", submitted: true, size: "1.8 MB" }
              ],
              checklist: {
                identityVerified: true,
                businessRegVerified: true,
                licenseVerified: true,
                addressVerified: true,
                bankVerified: true
              },
              remarks: "Verification documents submitted and awaiting admin approval."
            }));
          setAgents(apiAgents);
        }
      } catch (err) {
        console.error("Failed to fetch pending agents:", err);
      }
    };
    fetchAgents();
  }, []);

  // Filter Logic
  const filteredAgents = agents.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.mobile.includes(searchTerm);

    const matchesAgencyType = agencyTypeFilter === "All" || a.agencyType === agencyTypeFilter;
    const matchesKycStatus = kycStatusFilter === "All" || a.kycStatus === kycStatusFilter;

    return matchesSearch && matchesAgencyType && matchesKycStatus;
  });

  // Dynamic Pagination State & Math
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredAgents.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, agencyTypeFilter, kycStatusFilter]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredAgents.length);
  const paginatedAgents = filteredAgents.slice(startIndex, endIndex);

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredAgents.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Approval Action Execution
  const confirmApproveAgent = () => {
    if (!approveAgentTarget) return;
    const targetId = approveAgentTarget.id;
    const targetName = approveAgentTarget.name;

    setAgents((prev) => prev.filter((a) => a.id !== targetId));
    setSelectedIds((prev) => prev.filter((item) => item !== targetId));
    if (viewAgent?.id === targetId) setViewAgent(null);
    setApproveAgentTarget(null);

    triggerToast(`Approved agent registration for ${targetName} (${targetId})`);
  };

  // Rejection Action Execution
  const confirmRejectAgent = () => {
    if (!rejectAgentTarget) return;
    const targetId = rejectAgentTarget.id;
    const targetName = rejectAgentTarget.name;

    setAgents((prev) => prev.filter((a) => a.id !== targetId));
    setSelectedIds((prev) => prev.filter((item) => item !== targetId));
    if (viewAgent?.id === targetId) setViewAgent(null);
    setRejectAgentTarget(null);
    setRejectionReasons({ incompleteDocs: false, invalidLicense: false, failedKyc: false, other: false });
    setCustomRejectReason("");

    triggerToast(`Rejected agent registration application for ${targetName} (${targetId})`);
  };

  const handleBulkAction = (action: string) => {
    if (selectedIds.length === 0) {
      triggerToast("Please select at least one pending request first.");
      return;
    }

    if (action === "approve") {
      setAgents((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
      triggerToast(`Approved ${selectedIds.length} selected agent request(s).`);
      setSelectedIds([]);
    } else if (action === "reject") {
      setAgents((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
      triggerToast(`Rejected ${selectedIds.length} selected agent request(s).`);
      setSelectedIds([]);
    } else {
      triggerToast(`Executed '${action}' for ${selectedIds.length} request(s).`);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setAgencyTypeFilter("All");
    setKycStatusFilter("All");
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
          <Clock size={14} />
          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 font-bold">
            Pending Approval
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pending Approval</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Review newly registered agents, verify their documents, and approve or reject their registration requests.
        </p>
      </div>

      {/* TOP STATISTICS CARDS (4 CARDS GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Requests */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Pending Requests</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Clock size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">24</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-semibold mt-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Awaiting Review Queue</span>
          </div>
        </div>

        {/* Card 2: Today's Requests */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Today's Requests</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <FilePlus size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">6</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-[#2563EB] font-semibold mt-2">
            <ArrowUpRight size={13} />
            <span>+2 received this morning</span>
          </div>
        </div>

        {/* Card 3: Approved Today */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Approved Today</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">12</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <ShieldCheck size={13} />
            <span>Credentials Issued</span>
          </div>
        </div>

        {/* Card 4: Rejected Today */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Rejected Today</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <XCircle size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">2</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-red-600 font-semibold mt-2">
            <XCircle size={13} />
            <span>License Mismatch</span>
          </div>
        </div>
      </div>

      {/* SEARCH & MULTI-CRITERIA FILTERS BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" />
            <span>Search & Filter Pending Requests</span>
          </h3>
          <button
            onClick={handleResetFilters}
            className="text-xs text-slate-500 hover:text-[#2563EB] font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <RefreshCw size={12} /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* Filter 1: Search Keyword */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Search Keyword
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Agent ID, Name, Agency, Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Filter 2: Agency Type */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Agency Type
            </label>
            <select
              value={agencyTypeFilter}
              onChange={(e) => setAgencyTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
            >
              <option value="All">All Agency Types</option>
              <option value="Travel Agency">Travel Agency</option>
              <option value="Immigration Consultant">Immigration Consultant</option>
              <option value="Corporate Partner">Corporate Partner</option>
              <option value="Individual Agent">Individual Agent</option>
            </select>
          </div>

          {/* Filter 3: Verification Status */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Verification Status
            </label>
            <select
              value={kycStatusFilter}
              onChange={(e) => setKycStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">🟡 Pending Verification</option>
              <option value="Under Review">🟡 Under Review</option>
            </select>
          </div>

          {/* Filter 4: From Registration Date */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              From Registration Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
            />
          </div>

          {/* Filter 5: To Registration Date */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              To Registration Date
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
            onClick={() => triggerToast(`Filters applied: ${filteredAgents.length} pending request(s) found`)}
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
            <span>{selectedIds.length} Request(s) Selected</span>
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
              <Download size={14} /> Export List
            </button>
          </div>
        </div>
      )}

      {/* PENDING APPROVAL TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length > 0 && selectedIds.length === filteredAgents.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Agent ID</th>
                <th className="py-3.5 px-4">Agent Name</th>
                <th className="py-3.5 px-4">Agency Name</th>
                <th className="py-3.5 px-4">Agency Type</th>
                <th className="py-3.5 px-4">Registration Date</th>
                <th className="py-3.5 px-4">KYC Status</th>
                <th className="py-3.5 px-4 text-center">Submitted Documents</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <AlertCircle size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-bold">No pending agent approval requests match your filters.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 text-xs text-[#2563EB] font-semibold underline cursor-pointer"
                    >
                      Clear search filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedAgents.map((agent) => (
                  <tr
                    key={agent.id}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      selectedIds.includes(agent.id) ? "bg-blue-50/60" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(agent.id)}
                        onChange={() => handleToggleSelect(agent.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {agent.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <span className="font-extrabold text-slate-900">{agent.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-bold">{agent.agencyName}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{agent.agencyType}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{agent.regDate}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border bg-amber-50 text-amber-700 border-amber-200 inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        {agent.kycStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-extrabold text-slate-800">
                      {agent.submittedDocs}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border bg-blue-50 text-[#2563EB] border-blue-200 inline-flex items-center gap-1.5">
                        {agent.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setViewAgent(agent);
                            setModalTab("personal");
                          }}
                          title="View Details"
                          className="p-1.5 hover:bg-blue-100 text-slate-600 hover:text-[#2563EB] rounded-lg transition cursor-pointer"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setApproveAgentTarget(agent)}
                          title="Approve Application"
                          className="p-1.5 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 rounded-lg transition cursor-pointer"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => setRejectAgentTarget(agent)}
                          title="Reject Application"
                          className="p-1.5 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition cursor-pointer"
                        >
                          <XCircle size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* DYNAMIC PAGINATION FOOTER */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900">{filteredAgents.length === 0 ? 0 : startIndex + 1}–{endIndex}</strong> of{" "}
            <strong className="text-slate-900">{filteredAgents.length} Pending Agent Requests</strong>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-semibold transition"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg font-bold transition cursor-pointer ${
                  currentPage === pageNum
                    ? "bg-[#2563EB] text-white"
                    : "border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold"
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-semibold transition"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* APPROVAL CONFIRMATION POPUP MODAL */}
      {approveAgentTarget && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setApproveAgentTarget(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-base">
                <CheckCircle2 size={20} />
                <span>Approval Confirmation</span>
              </div>
              <button
                onClick={() => setApproveAgentTarget(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-700 font-semibold">
                Are you sure you want to approve this agent registration request?
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 font-mono">
                <div>
                  <span className="text-slate-500">Agent Name:</span>{" "}
                  <strong className="text-slate-900 font-sans font-bold">{approveAgentTarget.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Agency:</span>{" "}
                  <strong className="text-[#2563EB] font-sans font-bold">{approveAgentTarget.agencyName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Agent ID:</span>{" "}
                  <strong className="text-slate-800">{approveAgentTarget.id}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 text-xs pt-2">
              <button
                onClick={() => setApproveAgentTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmApproveAgent}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} /> Approve Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION POPUP MODAL */}
      {rejectAgentTarget && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setRejectAgentTarget(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-red-600 font-extrabold text-base">
                <XCircle size={20} />
                <span>Reject Application</span>
              </div>
              <button
                onClick={() => setRejectAgentTarget(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-700 font-semibold">
                Please select reason for rejecting <strong>{rejectAgentTarget.name}</strong> ({rejectAgentTarget.agencyName}):
              </p>

              <div className="space-y-2 font-bold">
                {[
                  { key: "incompleteDocs", label: "Incomplete Documents" },
                  { key: "invalidLicense", label: "Invalid Business License" },
                  { key: "failedKyc", label: "Failed KYC Verification" },
                  { key: "other", label: "Other Reason" }
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={rejectionReasons[item.key]}
                      onChange={(e) =>
                        setRejectionReasons((prev) => ({
                          ...prev,
                          [item.key]: e.target.checked
                        }))
                      }
                      className="rounded border-slate-300 text-red-600 focus:ring-0 cursor-pointer"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                  Additional Rejection Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Specify feedback for agent resubmission..."
                  value={customRejectReason}
                  onChange={(e) => setCustomRejectReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs p-3 rounded-xl focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 text-xs pt-2">
              <button
                onClick={() => setRejectAgentTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmRejectAgent}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <XCircle size={14} /> Reject Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AGENT DETAILS CENTERED VIEW MODAL (7 TABS / SECTIONS) */}
      {viewAgent && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewAgent(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-slate-800">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-5 flex items-center justify-between border-b border-blue-700 shrink-0 rounded-t-3xl shadow-md">
              <div className="flex items-center gap-3.5">
                <img
                  src={viewAgent.avatar}
                  alt={viewAgent.name}
                  className="w-13 h-13 rounded-full object-cover border-2 border-white/90 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-black text-white font-outfit tracking-wide">
                      {viewAgent.name}
                    </h2>
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-bold font-mono border bg-amber-500/30 text-white border-white/30">
                      {viewAgent.status}
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 font-mono flex items-center gap-2 mt-1">
                    <span>{viewAgent.id}</span>
                    <span className="text-blue-300">•</span>
                    <span>{viewAgent.agencyName}</span>
                    <span className="text-blue-300">•</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-white font-sans font-semibold">
                      {viewAgent.agencyType}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewAgent(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer border border-white/20"
              >
                <X size={18} />
              </button>
            </div>

            {/* 7 Section Navigation Tabs */}
            <div className="bg-[#EEF2FF] border-b-2 border-blue-200 px-4 flex items-center gap-1.5 overflow-x-auto shrink-0 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-blue-100 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full">
              {[
                { id: "personal", label: "Personal Information", icon: User },
                { id: "agency", label: "Agency Information", icon: Building },
                { id: "documents", label: "Submitted Documents", icon: FileText },
                { id: "checklist", label: "Verification Checklist", icon: CheckCircle2 },
                { id: "remarks", label: "Admin Remarks", icon: MessageSquare },
                { id: "quickActions", label: "Quick Actions", icon: Clock },
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
              {/* 1. PERSONAL INFORMATION TAB */}
              {modalTab === "personal" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <User size={16} className="text-[#2563EB]" />
                      <span>Personal Information</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Agent ID
                      </span>
                      <strong className="text-[#2563EB] font-mono text-sm font-extrabold">
                        {viewAgent.id}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Full Name
                      </span>
                      <strong className="text-slate-900 text-sm font-extrabold">
                        {viewAgent.name}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Email Address
                      </span>
                      <strong className="text-[#2563EB] font-mono font-bold">
                        {viewAgent.email}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Mobile Number
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewAgent.mobile}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Date of Birth
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewAgent.dob}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Residential Address
                      </span>
                      <strong className="text-slate-800 font-semibold">
                        {viewAgent.address}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. AGENCY INFORMATION TAB */}
              {modalTab === "agency" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Building size={16} className="text-[#2563EB]" />
                      <span>Agency Information</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Agency Name
                      </span>
                      <strong className="text-slate-900 text-sm font-extrabold">
                        {viewAgent.agencyName}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Agency Type
                      </span>
                      <strong className="text-slate-800 font-bold">
                        {viewAgent.agencyType}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Registration Number
                      </span>
                      <strong className="text-[#2563EB] font-mono font-bold">
                        {viewAgent.agencyRegNo}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Business License Number
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewAgent.businessLicense}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        GST / Tax Number
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewAgent.gstTaxNo}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Website
                      </span>
                      <a
                        href={viewAgent.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#2563EB] underline font-bold"
                      >
                        {viewAgent.website}
                      </a>
                    </div>

                    <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Office Address
                      </span>
                      <strong className="text-slate-800 font-semibold">
                        {viewAgent.officeAddress}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. SUBMITTED DOCUMENTS TAB */}
              {modalTab === "documents" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <FileText size={16} className="text-[#2563EB]" />
                      <span>Submitted KYC & License Documents</span>
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    {viewAgent.documentsList.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200/80 bg-slate-50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-[#2563EB]" />
                          <div>
                            <span className="font-extrabold text-slate-800 block">{doc.name}</span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              PDF Document • {doc.size}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {doc.submitted ? (
                            <>
                              <button
                                onClick={() => triggerToast(`Preview opened for ${doc.name}`)}
                                className="px-3 py-1 bg-white hover:bg-blue-50 text-[#2563EB] border border-blue-200 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              >
                                <Eye size={13} /> View
                              </button>
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold font-mono text-[11px] flex items-center gap-1">
                                <CheckCircle2 size={13} /> Attached
                              </span>
                            </>
                          ) : (
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-bold font-mono text-[11px] flex items-center gap-1">
                              <AlertTriangle size={13} /> Missing
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. VERIFICATION CHECKLIST TAB */}
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
                      { key: "identityVerified", label: "Identity Verified (Govt ID Match)" },
                      { key: "businessRegVerified", label: "Business Registration Verified" },
                      { key: "licenseVerified", label: "Business License Verified" },
                      { key: "addressVerified", label: "Office Address Verified" },
                      { key: "bankVerified", label: "Bank Details Verified" }
                    ].map((item) => {
                      const isPassed =
                        viewAgent.checklist[item.key as keyof typeof viewAgent.checklist];

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
                              <Clock size={16} className="text-amber-600" />
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

              {/* 5. ADMIN REMARKS TAB */}
              {modalTab === "remarks" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <MessageSquare size={16} className="text-[#2563EB]" />
                      <span>Admin Verification Remarks</span>
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Auditor Notes
                      </span>
                      <p className="text-slate-800 font-semibold leading-relaxed">
                        {viewAgent.remarks}
                      </p>
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Add Audit Remark Note
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Enter internal registration audit comments..."
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs p-3 rounded-xl focus:outline-none focus:border-[#2563EB]"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => triggerToast("Audit remark saved.")}
                          className="px-4 py-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                        >
                          Save Remarks
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. QUICK ACTIONS TAB */}
              {modalTab === "quickActions" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Clock size={16} className="text-[#2563EB]" />
                      <span>Quick Operational Actions</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <button
                      onClick={() => setApproveAgentTarget(viewAgent)}
                      className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl font-bold text-emerald-700 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Approve Agent</span>
                      <CheckCircle2 size={15} />
                    </button>

                    <button
                      onClick={() => setRejectAgentTarget(viewAgent)}
                      className="p-3.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl font-bold text-red-700 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Reject Application</span>
                      <XCircle size={15} />
                    </button>

                    <button
                      onClick={() => triggerToast(`Request for additional docs sent to ${viewAgent.email}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Request Additional Documents</span>
                      <FilePlus size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => triggerToast(`Email notification sent to ${viewAgent.email}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Send Email</span>
                      <Mail size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => triggerToast(`Message prompt opened for ${viewAgent.name}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Send Message</span>
                      <MessageSquare size={15} className="text-[#2563EB]" />
                    </button>
                  </div>
                </div>
              )}

              {/* 7. BULK ACTIONS TAB */}
              {modalTab === "bulkActions" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Layers size={16} className="text-[#2563EB]" />
                      <span>Bulk Approval Actions</span>
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
                      <span>Export List</span>
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
