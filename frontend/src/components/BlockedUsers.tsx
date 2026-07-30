import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Lock,
  Unlock,
  Trash2,
  Calendar,
  Globe,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Download,
  ShieldAlert,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  UserX,
  Layers,
  Edit3,
  AlertCircle,
  Info
} from "lucide-react";

export interface BlockedUserRecord {
  id: string;
  name: string;
  avatar: string;
  email: string;
  mobile: string;
  country: string;
  flag: string;
  blockType: "Temporary" | "Permanent";
  blockedOn: string;
  blockedBy: string;
  reason: string;
  passportNumber: string;
  nationality: string;
  registrationDate: string;
  notes: string;
  applicationsSummary: {
    total: number;
    approved: number;
    underReview: number;
    rejected: number;
    cancelled: number;
  };
  recentActivities: {
    lastLogin: string;
    lastApplicationSubmitted: string;
    lastPayment: string;
    lastDocumentUploaded: string;
  };
}

const mockBlockedUsers: BlockedUserRecord[] = [
  {
    id: "APP-1025",
    name: "Geeta Bisht",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    email: "geeta@email.com",
    mobile: "+91 9876543210",
    country: "Canada",
    flag: "🇨🇦",
    blockType: "Temporary",
    blockedOn: "24 Jul 2026",
    blockedBy: "Admin (Balram Suman)",
    reason: "Fake Documents",
    passportNumber: "Z9876543",
    nationality: "Indian",
    registrationDate: "12 Jan 2026",
    notes: "Suspicious bank statement uploaded. Awaiting re-verification from embassy auditor.",
    applicationsSummary: {
      total: 3,
      approved: 1,
      underReview: 0,
      rejected: 1,
      cancelled: 1
    },
    recentActivities: {
      lastLogin: "24 Jul 2026, 10:15 AM",
      lastApplicationSubmitted: "20 Jul 2026",
      lastPayment: "₹15,000 via NetBanking (15 Jul 2026)",
      lastDocumentUploaded: "Bank Statement Copy (24 Jul 2026)"
    }
  },
  {
    id: "APP-1026",
    name: "Rahul Sharma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    email: "rahul@email.com",
    mobile: "+91 9812345678",
    country: "Australia",
    flag: "🇦🇺",
    blockType: "Permanent",
    blockedOn: "24 Jul 2026",
    blockedBy: "Admin (Balram Suman)",
    reason: "Multiple Fraud Attempts",
    passportNumber: "M4567891",
    nationality: "Indian",
    registrationDate: "05 Feb 2026",
    notes: "Attempted to upload forged passport bio page across 3 different accounts.",
    applicationsSummary: {
      total: 2,
      approved: 0,
      underReview: 0,
      rejected: 2,
      cancelled: 0
    },
    recentActivities: {
      lastLogin: "24 Jul 2026, 08:30 AM",
      lastApplicationSubmitted: "18 Jul 2026",
      lastPayment: "₹25,000 via UPI (10 Jul 2026)",
      lastDocumentUploaded: "Passport Scan (24 Jul 2026)"
    }
  },
  {
    id: "APP-1027",
    name: "Maria Wilson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
    email: "maria@email.com",
    mobile: "+1 5550192834",
    country: "USA",
    flag: "🇺🇸",
    blockType: "Temporary",
    blockedOn: "24 Jul 2026",
    blockedBy: "Automated System Security",
    reason: "Policy Violation",
    passportNumber: "U8812349",
    nationality: "American",
    registrationDate: "18 Mar 2026",
    notes: "Excessive failed OTP login attempts within 5 minutes. Temporary 48-hour lock.",
    applicationsSummary: {
      total: 4,
      approved: 1,
      underReview: 1,
      rejected: 1,
      cancelled: 1
    },
    recentActivities: {
      lastLogin: "24 Jul 2026, 09:40 PM",
      lastApplicationSubmitted: "22 Jul 2026",
      lastPayment: "$450 via Credit Card (12 Jul 2026)",
      lastDocumentUploaded: "Sponsorship Affidavit (23 Jul 2026)"
    }
  },
  {
    id: "APP-1030",
    name: "Karan Patel",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    email: "karan@email.com",
    mobile: "+91 9922114433",
    country: "UK",
    flag: "🇬🇧",
    blockType: "Permanent",
    blockedOn: "20 Jul 2026",
    blockedBy: "Admin (Balram Suman)",
    reason: "Fake Documents",
    passportNumber: "K7788990",
    nationality: "Indian",
    registrationDate: "10 Apr 2026",
    notes: "Invalid sponsorship certificate detected during embassy audit.",
    applicationsSummary: {
      total: 1,
      approved: 0,
      underReview: 0,
      rejected: 1,
      cancelled: 0
    },
    recentActivities: {
      lastLogin: "20 Jul 2026, 03:20 PM",
      lastApplicationSubmitted: "15 Jul 2026",
      lastPayment: "₹18,000 via Debit Card (14 Jul 2026)",
      lastDocumentUploaded: "COS Certificate (20 Jul 2026)"
    }
  },
  {
    id: "APP-1031",
    name: "Sophia Zhang",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
    email: "sophia@email.com",
    mobile: "+1 4155552671",
    country: "Canada",
    flag: "🇨🇦",
    blockType: "Temporary",
    blockedOn: "18 Jul 2026",
    blockedBy: "Admin (Balram Suman)",
    reason: "Unverified Identity",
    passportNumber: "E3322110",
    nationality: "Canadian",
    registrationDate: "02 May 2026",
    notes: "Passport photo image quality failed automated face matching checks.",
    applicationsSummary: {
      total: 2,
      approved: 0,
      underReview: 1,
      rejected: 0,
      cancelled: 1
    },
    recentActivities: {
      lastLogin: "18 Jul 2026, 11:00 AM",
      lastApplicationSubmitted: "10 Jul 2026",
      lastPayment: "$300 via PayPal (08 Jul 2026)",
      lastDocumentUploaded: "Passport Photo ID (18 Jul 2026)"
    }
  }
];

export default function BlockedUsers() {
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [blockTypeFilter, setBlockTypeFilter] = useState("All");
  const [blockedByFilter, setBlockedByFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Selection States for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Selected User Detail Modal State
  const [viewUser, setViewUser] = useState<BlockedUserRecord | null>(null);
  const [modalTab, setModalTab] = useState<
    "personal" | "blockInfo" | "applications" | "activity" | "quickActions" | "bulkActions"
  >("personal");

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Blocked Users List State
  const [blockedUsers, setBlockedUsers] = useState<BlockedUserRecord[]>(mockBlockedUsers);

  // Filter Logic
  const filteredUsers = blockedUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.mobile.includes(searchTerm) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.passportNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBlockType = blockTypeFilter === "All" || u.blockType === blockTypeFilter;
    const matchesBlockedBy =
      blockedByFilter === "All" ||
      (blockedByFilter === "Admin" && u.blockedBy.includes("Admin")) ||
      (blockedByFilter === "System" && u.blockedBy.includes("System"));

    return matchesSearch && matchesBlockType && matchesBlockedBy;
  });

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Unblock User Handler
  const handleUnblockUser = (id: string) => {
    const target = blockedUsers.find((u) => u.id === id);
    setBlockedUsers((prev) => prev.filter((u) => u.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    if (viewUser?.id === id) setViewUser(null);
    triggerToast(`Restored & Unblocked user account for ${target?.name || id}`);
  };

  // Delete User Handler
  const handleDeleteUser = (id: string) => {
    const target = blockedUsers.find((u) => u.id === id);
    setBlockedUsers((prev) => prev.filter((u) => u.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    if (viewUser?.id === id) setViewUser(null);
    triggerToast(`Permanently deleted record for ${target?.name || id}`);
  };

  // Bulk Action Handler
  const handleBulkAction = (action: string) => {
    if (selectedIds.length === 0) {
      triggerToast("Please select at least one blocked user first.");
      return;
    }

    if (action === "unblock") {
      setBlockedUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
      triggerToast(`Unblocked & restored ${selectedIds.length} selected user(s).`);
      setSelectedIds([]);
    } else if (action === "delete") {
      setBlockedUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
      triggerToast(`Permanently deleted ${selectedIds.length} selected record(s).`);
      setSelectedIds([]);
    } else {
      triggerToast(`Executed '${action}' for ${selectedIds.length} user(s).`);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setBlockTypeFilter("All");
    setBlockedByFilter("All");
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
        <div className="flex items-center gap-2 text-xs font-mono text-red-600 mb-1">
          <ShieldAlert size={14} />
          <span className="px-2 py-0.5 rounded bg-red-50 border border-red-100 font-bold">
            Blocked Users
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Blocked Users</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Manage blocked applicants, review suspension reasons, and restore accounts when appropriate.
        </p>
      </div>

      {/* STATISTICS CARDS (4 CARDS GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Blocked Users */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Blocked Users</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <UserX size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">18</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-red-600 font-semibold mt-2">
            <ShieldAlert size={13} />
            <span>Restricted Accounts</span>
          </div>
        </div>

        {/* Card 2: Blocked This Month */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Blocked This Month</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Calendar size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">05</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-semibold mt-2">
            <AlertTriangle size={13} />
            <span>+2 added this week</span>
          </div>
        </div>

        {/* Card 3: Permanent Blocks */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Permanent Blocks</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Lock size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">07</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-red-700 font-semibold mt-2">
            <XCircle size={13} />
            <span>Non-appealable Bans</span>
          </div>
        </div>

        {/* Card 4: Temporary Suspensions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Temporary Suspensions</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Clock size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">11</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-[#2563EB] font-semibold mt-2">
            <Info size={13} />
            <span>Review / Audit Pending</span>
          </div>
        </div>
      </div>

      {/* SEARCH & MULTI-CRITERIA FILTERS BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" />
            <span>Search & Filter Blocked Users</span>
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
                placeholder="Name, Email, Mobile, Passport..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Filter 2: Block Type */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Block Type
            </label>
            <select
              value={blockTypeFilter}
              onChange={(e) => setBlockTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
            >
              <option value="All">All Block Types</option>
              <option value="Temporary">Temporary Suspension</option>
              <option value="Permanent">Permanent Block</option>
            </select>
          </div>

          {/* Filter 3: Blocked By */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Blocked By
            </label>
            <select
              value={blockedByFilter}
              onChange={(e) => setBlockedByFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
            >
              <option value="All">All Admins / System</option>
              <option value="Admin">Admin Initiated</option>
              <option value="System">Automated System</option>
            </select>
          </div>

          {/* Filter 4: From Blocked Date */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              From Blocked Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
            />
          </div>

          {/* Filter 5: To Blocked Date */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              To Blocked Date
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
            onClick={() => triggerToast(`Filters applied: ${filteredUsers.length} blocked record(s) found`)}
            className="px-5 py-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-bold rounded-xl shadow-md shadow-[#2563EB]/20 transition cursor-pointer flex items-center gap-1.5"
          >
            <Filter size={14} /> Apply Filters
          </button>
        </div>
      </div>

      {/* CONTEXTUAL BULK ACTIONS TOOLBAR */}
      {selectedIds.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs text-red-700 font-bold">
            <CheckCircle2 size={16} />
            <span>{selectedIds.length} Blocked Record(s) Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => handleBulkAction("unblock")}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Unlock size={14} /> Unblock Selected
            </button>
            <button
              onClick={() => handleBulkAction("email")}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Mail size={14} /> Send Email
            </button>
            <button
              onClick={() => handleBulkAction("export")}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} /> Export List
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={14} /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* BLOCKED USERS TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length > 0 && selectedIds.length === filteredUsers.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">User ID</th>
                <th className="py-3.5 px-4">Applicant Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Mobile</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Block Type</th>
                <th className="py-3.5 px-4">Blocked On</th>
                <th className="py-3.5 px-4">Blocked By</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <AlertCircle size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-bold">No blocked records match your search criteria.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 text-xs text-[#2563EB] font-semibold underline cursor-pointer"
                    >
                      Clear search filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-red-50/20 transition-colors ${
                      selectedIds.includes(user.id) ? "bg-red-50/40" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(user.id)}
                        onChange={() => handleToggleSelect(user.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {user.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 grayscale"
                        />
                        <span className="font-extrabold text-slate-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{user.email}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{user.mobile}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <span>{user.flag}</span> {user.country}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                          user.blockType === "Permanent"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {user.blockType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {user.blockedOn}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-semibold">{user.blockedBy}</td>
                    <td className="py-3.5 px-4 font-bold text-red-600">{user.reason}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setViewUser(user);
                            setModalTab("personal");
                          }}
                          title="View Details"
                          className="p-1.5 hover:bg-blue-100 text-slate-600 hover:text-[#2563EB] rounded-lg transition cursor-pointer"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleUnblockUser(user.id)}
                          title="Unblock User"
                          className="p-1.5 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 rounded-lg transition cursor-pointer"
                        >
                          <Unlock size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete Account Record"
                          className="p-1.5 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition cursor-pointer"
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
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900">1–{filteredUsers.length}</strong> of{" "}
            <strong className="text-slate-900">18 Blocked Users</strong>
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

      {/* USER DETAILS CENTERED VIEW MODAL (6 SECTIONS) */}
      {viewUser && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewUser(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-slate-800">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-5 flex items-center justify-between border-b border-blue-700 shrink-0 rounded-t-3xl shadow-md">
              <div className="flex items-center gap-3.5">
                <img
                  src={viewUser.avatar}
                  alt={viewUser.name}
                  className="w-13 h-13 rounded-full object-cover border-2 border-white/90 shadow-md grayscale"
                />
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-black text-white font-outfit tracking-wide">
                      {viewUser.name}
                    </h2>
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-bold font-mono bg-red-500/30 text-white border border-white/30">
                      Blocked ({viewUser.blockType})
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 font-mono flex items-center gap-2 mt-1">
                    <span>{viewUser.id}</span>
                    <span className="text-blue-300">•</span>
                    <span>{viewUser.email}</span>
                    <span className="text-blue-300">•</span>
                    <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-white font-sans font-semibold">
                      <span>{viewUser.flag}</span> {viewUser.country}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewUser(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer border border-white/20"
              >
                <X size={18} />
              </button>
            </div>

            {/* 6 Section Navigation Tabs */}
            <div className="bg-[#EEF2FF] border-b-2 border-blue-200 px-4 flex items-center gap-1.5 overflow-x-auto shrink-0 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-blue-100 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full">
              {[
                { id: "personal", label: "Personal Information", icon: FileText },
                { id: "blockInfo", label: "Block Information", icon: ShieldAlert },
                { id: "applications", label: "Visa Application Summary", icon: Layers },
                { id: "activity", label: "Recent Activity", icon: Clock },
                { id: "quickActions", label: "Quick Actions", icon: UserX },
                { id: "bulkActions", label: "Bulk Actions", icon: Users }
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
                      <FileText size={16} className="text-[#2563EB]" />
                      <span>Personal Information</span>
                    </h3>
                    <span className="text-[10px] font-mono text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100 font-bold">
                      Blocked Account Profile
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Full Name
                      </span>
                      <strong className="text-slate-900 text-sm font-extrabold">
                        {viewUser.name}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Email Address
                      </span>
                      <strong className="text-[#2563EB] font-mono font-bold">
                        {viewUser.email}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Mobile Number
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewUser.mobile}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Passport Number
                      </span>
                      <strong className="text-[#2563EB] font-mono text-sm font-extrabold">
                        {viewUser.passportNumber}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Nationality
                      </span>
                      <strong className="text-slate-800 font-bold">
                        {viewUser.nationality}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Registration Date
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewUser.registrationDate}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. BLOCK INFORMATION TAB */}
              {modalTab === "blockInfo" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <ShieldAlert size={16} className="text-red-600" />
                      <span>Block & Suspension Audit Log</span>
                    </h3>
                    <span className="text-[10px] font-mono text-red-700 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 font-bold">
                      Restricted Access
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Account Status
                      </span>
                      <strong className="text-red-600 font-bold font-mono">
                        Blocked ({viewUser.blockType})
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Blocked On
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewUser.blockedOn}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Blocked By
                      </span>
                      <strong className="text-slate-800 font-bold">
                        {viewUser.blockedBy}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Block Type
                      </span>
                      <strong className="text-slate-900 font-extrabold">
                        {viewUser.blockType} Suspension
                      </strong>
                    </div>

                    <div className="md:col-span-2 bg-red-50/70 p-3.5 rounded-xl border border-red-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 block mb-1">
                        Reason for Blocking
                      </span>
                      <strong className="text-red-700 text-sm font-extrabold">
                        {viewUser.reason}
                      </strong>
                    </div>

                    <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Internal Auditor Notes
                      </span>
                      <p className="text-slate-700 font-medium">
                        {viewUser.notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. VISA APPLICATION SUMMARY TAB */}
              {modalTab === "applications" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Layers size={16} className="text-[#2563EB]" />
                      <span>Visa Application Summary</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-xs text-center">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Total
                      </span>
                      <strong className="text-2xl font-black text-slate-900 font-mono">
                        {viewUser.applicationsSummary.total}
                      </strong>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
                        Approved
                      </span>
                      <strong className="text-2xl font-black text-emerald-700 font-mono">
                        {viewUser.applicationsSummary.approved}
                      </strong>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block mb-1">
                        Under Review
                      </span>
                      <strong className="text-2xl font-black text-amber-700 font-mono">
                        {viewUser.applicationsSummary.underReview}
                      </strong>
                    </div>

                    <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 block mb-1">
                        Rejected
                      </span>
                      <strong className="text-2xl font-black text-red-700 font-mono">
                        {viewUser.applicationsSummary.rejected}
                      </strong>
                    </div>

                    <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Cancelled
                      </span>
                      <strong className="text-2xl font-black text-slate-700 font-mono">
                        {viewUser.applicationsSummary.cancelled}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. RECENT ACTIVITY TAB */}
              {modalTab === "activity" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Clock size={16} className="text-[#2563EB]" />
                      <span>Recent Activity Log</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Last Login Timestamp
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewUser.recentActivities.lastLogin}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Last Application Submitted
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewUser.recentActivities.lastApplicationSubmitted}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Last Payment Record
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewUser.recentActivities.lastPayment}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Last Document Uploaded
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewUser.recentActivities.lastDocumentUploaded}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. QUICK ACTIONS TAB */}
              {modalTab === "quickActions" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <UserX size={16} className="text-[#2563EB]" />
                      <span>Quick Operational Actions</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <button
                      onClick={() => triggerToast(`Navigated to profile of ${viewUser.name}`)}
                      className="p-3.5 bg-white hover:bg-[#EEF2FF] border border-slate-200 hover:border-[#2563EB]/50 rounded-xl font-bold text-[#2563EB] flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>View Profile</span>
                      <Eye size={15} />
                    </button>

                    <button
                      onClick={() => triggerToast(`View applications for ${viewUser.name}`)}
                      className="p-3.5 bg-white hover:bg-[#EEF2FF] border border-slate-200 hover:border-[#2563EB]/50 rounded-xl font-bold text-[#2563EB] flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>View Applications ({viewUser.applicationsSummary.total})</span>
                      <Layers size={15} />
                    </button>

                    <button
                      onClick={() => handleUnblockUser(viewUser.id)}
                      className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl font-bold text-emerald-700 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Unblock User</span>
                      <Unlock size={15} />
                    </button>

                    <button
                      onClick={() => triggerToast(`Edit block reason modal triggered for ${viewUser.name}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Edit Block Reason</span>
                      <Edit3 size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => triggerToast(`Email notification sent to ${viewUser.email}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Send Email</span>
                      <Mail size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleDeleteUser(viewUser.id)}
                      className="p-3.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Delete Account</span>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* 6. BULK ACTIONS TAB */}
              {modalTab === "bulkActions" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Users size={16} className="text-[#2563EB]" />
                      <span>Bulk Blocked Operational Actions</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <button
                      onClick={() => handleSelectAll(true)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Select All Blocked</span>
                      <CheckCircle2 size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBulkAction("unblock")}
                      className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl font-bold text-emerald-700 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Unblock Selected</span>
                      <Unlock size={15} />
                    </button>

                    <button
                      onClick={() => handleBulkAction("email")}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Send Email</span>
                      <Mail size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBulkAction("export")}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Export List</span>
                      <Download size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBulkAction("delete")}
                      className="p-3.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Delete Selected</span>
                      <Trash2 size={15} />
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
