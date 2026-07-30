import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
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
  Bell,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  ChevronLeft,
  ChevronRight,
  X,
  MessageSquare,
  UserCheck,
  Layers,
  AlertCircle
} from "lucide-react";

export interface ActiveUserRecord {
  id: string;
  name: string;
  avatar: string;
  email: string;
  mobile: string;
  country: string;
  flag: string;
  activeApplications: number;
  lastLogin: string;
  status: "Active" | "Online" | "Suspended";
  passportNumber: string;
  nationality: string;
  registrationDate: string;
  applicationsSummary: {
    total: number;
    approved: number;
    underReview: number;
    rejected: number;
    pending: number;
  };
  recentActivities: {
    title: string;
    time: string;
    completed: boolean;
  }[];
}

const mockActiveUsers: ActiveUserRecord[] = [
  {
    id: "APP-1025",
    name: "Geeta Bisht",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    email: "geeta@email.com",
    mobile: "+91 9876543210",
    country: "Canada",
    flag: "🇨🇦",
    activeApplications: 2,
    lastLogin: "10 mins ago",
    status: "Active",
    passportNumber: "Z9876543",
    nationality: "Indian",
    registrationDate: "12 Jan 2026",
    applicationsSummary: {
      total: 3,
      approved: 1,
      underReview: 1,
      rejected: 0,
      pending: 1
    },
    recentActivities: [
      { title: "Logged in from Chrome (Windows)", time: "10 mins ago", completed: true },
      { title: "Submitted Express Entry Visa PR application", time: "2 hours ago", completed: true },
      { title: "Uploaded Biometric Passport Scan", time: "Yesterday, 04:15 PM", completed: true },
      { title: "Made fee payment ₹45,000 via NetBanking", time: "14 Jul 2026", completed: true },
      { title: "Booked Embassy Appointment Slot", time: "10 Jul 2026", completed: true }
    ]
  },
  {
    id: "APP-1026",
    name: "Rahul Sharma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    email: "rahul@email.com",
    mobile: "+91 9812345678",
    country: "Australia",
    flag: "🇦🇺",
    activeApplications: 1,
    lastLogin: "1 hour ago",
    status: "Active",
    passportNumber: "M4567891",
    nationality: "Indian",
    registrationDate: "05 Feb 2026",
    applicationsSummary: {
      total: 2,
      approved: 1,
      underReview: 1,
      rejected: 0,
      pending: 0
    },
    recentActivities: [
      { title: "Logged in from Safari (macOS)", time: "1 hour ago", completed: true },
      { title: "Uploaded Bank Statement (6 Months)", time: "3 hours ago", completed: true },
      { title: "Submitted Student Visa Subclass 500", time: "2 days ago", completed: true }
    ]
  },
  {
    id: "APP-1027",
    name: "Maria Wilson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
    email: "maria@email.com",
    mobile: "+1 5550192834",
    country: "USA",
    flag: "🇺🇸",
    activeApplications: 3,
    lastLogin: "Yesterday",
    status: "Active",
    passportNumber: "U8812349",
    nationality: "American",
    registrationDate: "18 Mar 2026",
    applicationsSummary: {
      total: 4,
      approved: 1,
      underReview: 2,
      rejected: 0,
      pending: 1
    },
    recentActivities: [
      { title: "Logged in from Mobile App (iOS)", time: "Yesterday, 09:40 PM", completed: true },
      { title: "Requested Priority Document Review", time: "Yesterday, 10:15 AM", completed: true },
      { title: "Updated Residential Address Details", time: "3 days ago", completed: true }
    ]
  },
  {
    id: "APP-1028",
    name: "Vikram Malhotra",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    email: "vikram@email.com",
    mobile: "+91 9988776655",
    country: "UK",
    flag: "🇬🇧",
    activeApplications: 1,
    lastLogin: "3 hours ago",
    status: "Active",
    passportNumber: "K9023412",
    nationality: "Indian",
    registrationDate: "10 Apr 2026",
    applicationsSummary: {
      total: 1,
      approved: 0,
      underReview: 1,
      rejected: 0,
      pending: 0
    },
    recentActivities: [
      { title: "Logged in from Firefox (Windows)", time: "3 hours ago", completed: true },
      { title: "Submitted Skilled Worker Visa Application", time: "1 week ago", completed: true }
    ]
  },
  {
    id: "APP-1029",
    name: "Ananya Roy",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
    email: "ananya@email.com",
    mobile: "+91 9765432109",
    country: "Canada",
    flag: "🇨🇦",
    activeApplications: 2,
    lastLogin: "5 mins ago",
    status: "Active",
    passportNumber: "P1239874",
    nationality: "Indian",
    registrationDate: "02 May 2026",
    applicationsSummary: {
      total: 2,
      approved: 0,
      underReview: 2,
      rejected: 0,
      pending: 0
    },
    recentActivities: [
      { title: "Logged in from Chrome (MacBook)", time: "5 mins ago", completed: true },
      { title: "Uploaded Academic Transcripts", time: "1 hour ago", completed: true },
      { title: "Booked Medical Exam Appointment", time: "Yesterday", completed: true }
    ]
  }
];

export default function ActiveUsers() {
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [countryFilter, setCountryFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Selected User Detail Modal State
  const [viewUser, setViewUser] = useState<ActiveUserRecord | null>(null);
  const [modalTab, setModalTab] = useState<
    "personal" | "applications" | "activity" | "quickActions" | "bulkActions"
  >("personal");

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Active Users List State
  const [users, setUsers] = useState<ActiveUserRecord[]>(mockActiveUsers);

  // Filter Logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.mobile.includes(searchTerm) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.passportNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || u.status === statusFilter;
    const matchesCountry = countryFilter === "All" || u.country === countryFilter;

    return matchesSearch && matchesStatus && matchesCountry;
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

  // Actions
  const handleSuspendUser = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "Suspended" ? "Active" : "Suspended" } : u
      )
    );
    const target = users.find((u) => u.id === id);
    triggerToast(
      target?.status === "Suspended"
        ? `Re-activated account for ${target.name}`
        : `Suspended account for ${target?.name}`
    );
    if (viewUser && viewUser.id === id) {
      setViewUser((prev) =>
        prev ? { ...prev, status: prev.status === "Suspended" ? "Active" : "Suspended" } : null
      );
    }
  };

  const handleDeleteUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    if (viewUser?.id === id) setViewUser(null);
    triggerToast(`Deleted user account for ${target?.name || id}`);
  };

  const handleBulkAction = (action: string) => {
    if (selectedIds.length === 0) {
      triggerToast("Please select at least one active user first.");
      return;
    }
    if (action === "suspend") {
      setUsers((prev) =>
        prev.map((u) => (selectedIds.includes(u.id) ? { ...u, status: "Suspended" } : u))
      );
      triggerToast(`Suspended ${selectedIds.length} selected user(s).`);
    } else if (action === "delete") {
      setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
      setSelectedIds([]);
      triggerToast(`Deleted ${selectedIds.length} selected user(s).`);
    } else {
      triggerToast(`Executed '${action}' for ${selectedIds.length} selected user(s).`);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("Active");
    setCountryFilter("All");
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
          <UserCheck size={14} />
          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 font-bold">
            Active Users
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Users</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          View and manage all active applicants registered on the VisaOS platform.
        </p>
      </div>

      {/* STATISTICS CARDS (4 CARDS GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Active Users */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Active Users</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Users size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">1,032</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <ArrowUpRight size={13} />
            <span>+8.2% vs last month</span>
          </div>
        </div>

        {/* Card 2: Online Now */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Online Now</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Activity size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">124</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Active Live Sessions</span>
          </div>
        </div>

        {/* Card 3: New This Month */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">New This Month</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <UserCheck size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">58</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <ArrowUpRight size={13} />
            <span>+15 new registrations today</span>
          </div>
        </div>

        {/* Card 4: Verified Users */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Verified Users</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <ShieldCheck size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">987</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-teal-700 font-semibold mt-2">
            <ShieldCheck size={13} />
            <span>95.6% Passport KYC Verified</span>
          </div>
        </div>
      </div>

      {/* SEARCH & MULTI-CRITERIA FILTERS BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" />
            <span>Search & Filter Active Users</span>
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

          {/* Filter 2: Account Status */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Account Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Active">✓ Active Only</option>
              <option value="Online">Online Now</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Filter 3: Country */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Country
            </label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
            >
              <option value="All">All Countries</option>
              <option value="Canada">🇨🇦 Canada</option>
              <option value="Australia">🇦🇺 Australia</option>
              <option value="USA">🇺🇸 USA</option>
              <option value="UK">🇬🇧 UK</option>
            </select>
          </div>

          {/* Filter 4: From Registration Date */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              From Reg. Date
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
              To Reg. Date
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
            onClick={() => triggerToast(`Filters applied: ${filteredUsers.length} active user(s) found`)}
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
            <span>{selectedIds.length} Active User(s) Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => handleBulkAction("export")}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} /> Export Users
            </button>
            <button
              onClick={() => handleBulkAction("email")}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Mail size={14} /> Send Email
            </button>
            <button
              onClick={() => handleBulkAction("notification")}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Bell size={14} /> Send Notification
            </button>
            <button
              onClick={() => handleBulkAction("suspend")}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded-lg border border-amber-300 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Lock size={14} /> Suspend Selected
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE USERS TABLE */}
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
                <th className="py-3.5 px-4 text-center">Active Applications</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <AlertCircle size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-bold">No active users match your filter criteria.</p>
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
                    className={`hover:bg-blue-50/40 transition-colors ${
                      selectedIds.includes(user.id) ? "bg-blue-50/60" : ""
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
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
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
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold bg-blue-50 text-[#2563EB] border border-blue-200">
                        {user.activeApplications}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {user.lastLogin}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border inline-flex items-center gap-1.5 ${
                          user.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status === "Active" ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />
                        {user.status}
                      </span>
                    </td>
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
                          onClick={() => triggerToast(`Edit record triggered for ${user.name}`)}
                          title="Edit Profile"
                          className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition cursor-pointer"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleSuspendUser(user.id)}
                          title={user.status === "Suspended" ? "Activate User" : "Suspend User"}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            user.status === "Suspended"
                              ? "hover:bg-emerald-100 text-emerald-600"
                              : "hover:bg-amber-100 text-amber-600"
                          }`}
                        >
                          {user.status === "Suspended" ? <Unlock size={15} /> : <Lock size={15} />}
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
            <strong className="text-slate-900">1,032 Active Users</strong>
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
            <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer">
              3
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer">
              4
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer">
              5
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer flex items-center gap-1 font-semibold">
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* USER DETAILS CENTERED VIEW MODAL (5 SECTIONS) */}
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
                  className="w-13 h-13 rounded-full object-cover border-2 border-white/90 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-black text-white font-outfit tracking-wide">
                      {viewUser.name}
                    </h2>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                        viewUser.status === "Active"
                          ? "bg-emerald-500/20 text-white border-white/30"
                          : "bg-red-500/30 text-white border-white/30"
                      }`}
                    >
                      {viewUser.status}
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

            {/* 5 Section Navigation Tabs */}
            <div className="bg-[#EEF2FF] border-b-2 border-blue-200 px-4 flex items-center gap-1.5 overflow-x-auto shrink-0 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-blue-100 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full">
              {[
                { id: "personal", label: "Personal Information", icon: FileText },
                { id: "applications", label: "Application Summary", icon: Layers },
                { id: "activity", label: "Recent Activity", icon: Clock },
                { id: "quickActions", label: "Quick Actions", icon: UserCheck },
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
                    <span className="text-[10px] font-mono text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 font-bold">
                      Active User Profile
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

                    <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Last Login Timestamp
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewUser.lastLogin}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. APPLICATION SUMMARY TAB */}
              {modalTab === "applications" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Layers size={16} className="text-[#2563EB]" />
                      <span>Application Summary</span>
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

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB] block mb-1">
                        Pending
                      </span>
                      <strong className="text-2xl font-black text-[#2563EB] font-mono">
                        {viewUser.applicationsSummary.pending}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. RECENT ACTIVITY TAB */}
              {modalTab === "activity" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Clock size={16} className="text-[#2563EB]" />
                      <span>Recent Activity Log</span>
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {viewUser.recentActivities.map((act, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
                          <span className="font-bold text-slate-800">{act.title}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. QUICK ACTIONS TAB */}
              {modalTab === "quickActions" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <UserCheck size={16} className="text-[#2563EB]" />
                      <span>Quick User Actions</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <button
                      onClick={() => triggerToast(`Navigated to full profile of ${viewUser.name}`)}
                      className="p-3.5 bg-white hover:bg-[#EEF2FF] border border-slate-200 hover:border-[#2563EB]/50 rounded-xl font-bold text-[#2563EB] flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>View Profile</span>
                      <Eye size={15} />
                    </button>

                    <button
                      onClick={() => triggerToast(`View applications for ${viewUser.name}`)}
                      className="p-3.5 bg-white hover:bg-[#EEF2FF] border border-slate-200 hover:border-[#2563EB]/50 rounded-xl font-bold text-[#2563EB] flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>View Applications ({viewUser.activeApplications})</span>
                      <Layers size={15} />
                    </button>

                    <button
                      onClick={() => triggerToast(`Direct message sent to ${viewUser.email}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Send Message</span>
                      <MessageSquare size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => triggerToast(`Push notification sent to ${viewUser.name}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Send Notification</span>
                      <Bell size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleSuspendUser(viewUser.id)}
                      className={`p-3.5 border rounded-xl font-bold flex items-center justify-between transition cursor-pointer shadow-2xs ${
                        viewUser.status === "Suspended"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      }`}
                    >
                      <span>{viewUser.status === "Suspended" ? "Activate User" : "Suspend User"}</span>
                      {viewUser.status === "Suspended" ? <Unlock size={15} /> : <Lock size={15} />}
                    </button>

                    <button
                      onClick={() => handleDeleteUser(viewUser.id)}
                      className="p-3.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Delete User</span>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* 5. BULK ACTIONS TAB */}
              {modalTab === "bulkActions" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Users size={16} className="text-[#2563EB]" />
                      <span>Bulk User Operational Actions</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <button
                      onClick={() => handleSelectAll(true)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Select All Users</span>
                      <CheckCircle2 size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBulkAction("export")}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Export Users</span>
                      <Download size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBulkAction("email")}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Send Email</span>
                      <Mail size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBulkAction("notification")}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Send Notification</span>
                      <Bell size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBulkAction("suspend")}
                      className="p-3.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Suspend Selected</span>
                      <Lock size={15} />
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
