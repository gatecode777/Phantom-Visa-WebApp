import React, { useState } from "react";
import {
  UserCheck,
  User,
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
  Star,
  Building,
  Layers,
  Award,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  X,
  MessageSquare,
  AlertCircle,
  Check,
  Briefcase,
  Activity
} from "lucide-react";

export interface ActiveAgentRecord {
  id: string;
  name: string;
  avatar: string;
  agencyName: string;
  agencyType: "Travel Agency" | "Immigration Consultant" | "Corporate Partner" | "Individual Agent";
  country: string;
  flag: string;
  assignedApps: number;
  completedApps: number;
  pendingApps: number;
  rating: number;
  lastLogin: string;
  status: "Active";
  email: string;
  mobile: string;
  regDate: string;
  agencyRegNo: string;
  officeAddress: string;
  website: string;
  performance: {
    assigned: number;
    completed: number;
    pending: number;
    approvalRate: string;
    avgProcessingTime: string;
    customerRating: number;
  };
  recentActivities: {
    title: string;
    time: string;
  }[];
  accountInfo: {
    status: string;
    lastLogin: string;
    lastActive: string;
    emailVerified: boolean;
    mobileVerified: boolean;
  };
}

const mockActiveAgents: ActiveAgentRecord[] = [
  {
    id: "AGT-1001",
    name: "Geeta Bisht",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    agencyName: "Global Visa Services",
    agencyType: "Travel Agency",
    country: "Canada",
    flag: "🇨🇦",
    assignedApps: 52,
    completedApps: 45,
    pendingApps: 7,
    rating: 4.9,
    lastLogin: "10 mins ago",
    status: "Active",
    email: "geeta@gmail.com",
    mobile: "+91 9876543210",
    regDate: "12 Jan 2025",
    agencyRegNo: "REG-IND-99120",
    officeAddress: "Suite 401, Global Tower, CP, New Delhi",
    website: "https://globalvisa.com",
    performance: {
      assigned: 52,
      completed: 45,
      pending: 7,
      approvalRate: "92%",
      avgProcessingTime: "4.2 Days",
      customerRating: 4.9
    },
    recentActivities: [
      { title: "Logged In to Agent Dashboard", time: "10 mins ago" },
      { title: "Reviewed Visa Application APP-1025", time: "45 mins ago" },
      { title: "Verified Identity Documents for 3 Applicants", time: "2 hours ago" },
      { title: "Updated Application Status to Embassy Submitted", time: "1 day ago" },
      { title: "Responded to Applicant Enquiry", time: "2 days ago" }
    ],
    accountInfo: {
      status: "Active",
      lastLogin: "10 mins ago",
      lastActive: "Just now",
      emailVerified: true,
      mobileVerified: true
    }
  },
  {
    id: "AGT-1002",
    name: "Rahul Sharma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    agencyName: "Visa Experts Ltd",
    agencyType: "Immigration Consultant",
    country: "Australia",
    flag: "🇦🇺",
    assignedApps: 38,
    completedApps: 34,
    pendingApps: 4,
    rating: 4.8,
    lastLogin: "25 mins ago",
    status: "Active",
    email: "rahul@gmail.com",
    mobile: "+91 9812345678",
    regDate: "05 Feb 2025",
    agencyRegNo: "REG-UP-44512",
    officeAddress: "2nd Floor, Visa Plaza, Noida Sector 62",
    website: "https://visaexperts.in",
    performance: {
      assigned: 38,
      completed: 34,
      pending: 4,
      approvalRate: "89.5%",
      avgProcessingTime: "4.8 Days",
      customerRating: 4.8
    },
    recentActivities: [
      { title: "Logged In", time: "25 mins ago" },
      { title: "Uploaded Biometric Receipt", time: "1 hour ago" },
      { title: "Verified Passport Copies", time: "3 hours ago" }
    ],
    accountInfo: {
      status: "Active",
      lastLogin: "25 mins ago",
      lastActive: "15 mins ago",
      emailVerified: true,
      mobileVerified: true
    }
  },
  {
    id: "AGT-1003",
    name: "Balram Suman",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    agencyName: "World Travel Agency",
    agencyType: "Individual Agent",
    country: "UK",
    flag: "🇬🇧",
    assignedApps: 24,
    completedApps: 21,
    pendingApps: 3,
    rating: 4.6,
    lastLogin: "1 hour ago",
    status: "Active",
    email: "balram@gmail.com",
    mobile: "+91 9988776655",
    regDate: "20 Jul 2026",
    agencyRegNo: "REG-RAJ-88123",
    officeAddress: "G-10, Travel Hub, MI Road, Jaipur",
    website: "https://worldtravel.co.in",
    performance: {
      assigned: 24,
      completed: 21,
      pending: 3,
      approvalRate: "87.5%",
      avgProcessingTime: "5.1 Days",
      customerRating: 4.6
    },
    recentActivities: [
      { title: "Logged In", time: "1 hour ago" },
      { title: "Responded to Applicant Ticket", time: "2 hours ago" }
    ],
    accountInfo: {
      status: "Active",
      lastLogin: "1 hour ago",
      lastActive: "45 mins ago",
      emailVerified: true,
      mobileVerified: true
    }
  }
];

export default function ActiveAgents() {
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [agencyTypeFilter, setAgencyTypeFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [performanceFilter, setPerformanceFilter] = useState("All");

  // Selection States for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Selected Agent Detail Modal State
  const [viewAgent, setViewAgent] = useState<ActiveAgentRecord | null>(null);
  const [modalTab, setModalTab] = useState<
    | "personal"
    | "agency"
    | "performanceSummary"
    | "activities"
    | "account"
    | "performanceOverview"
    | "quickActions"
    | "bulkActions"
  >("personal");

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Active Agents List State
  const [agents, setAgents] = useState<ActiveAgentRecord[]>(mockActiveAgents);

  // Filter Logic
  const filteredAgents = agents.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.mobile.includes(searchTerm);

    const matchesAgencyType = agencyTypeFilter === "All" || a.agencyType === agencyTypeFilter;
    const matchesCountry = countryFilter === "All" || a.country === countryFilter;

    let matchesPerf = true;
    if (performanceFilter === "Excellent") matchesPerf = a.rating >= 4.8;
    else if (performanceFilter === "Good") matchesPerf = a.rating >= 4.5 && a.rating < 4.8;
    else if (performanceFilter === "Average") matchesPerf = a.rating >= 4.0 && a.rating < 4.5;
    else if (performanceFilter === "Low") matchesPerf = a.rating < 4.0;

    return matchesSearch && matchesAgencyType && matchesCountry && matchesPerf;
  });

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

  const handleBulkAction = (action: string) => {
    if (selectedIds.length === 0) {
      triggerToast("Please select at least one active agent first.");
      return;
    }

    if (action === "block") {
      setAgents((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
      triggerToast(`Blocked ${selectedIds.length} selected agent(s).`);
      setSelectedIds([]);
    } else if (action === "delete") {
      setAgents((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
      setSelectedIds([]);
      triggerToast(`Deleted ${selectedIds.length} selected agent record(s).`);
    } else {
      triggerToast(`Executed '${action}' for ${selectedIds.length} active agent(s).`);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setAgencyTypeFilter("All");
    setCountryFilter("All");
    setPerformanceFilter("All");
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
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 mb-1">
          <UserCheck size={14} />
          <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 font-bold">
            Active Agents
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Agents</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          View and manage all approved and active agents. Monitor performance, assigned applications, and account activity.
        </p>
      </div>

      {/* TOP STATISTICS CARDS (4 CARDS GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Active Agents */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Active Agents</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <UserCheck size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">215</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <ShieldCheck size={13} />
            <span>87.7% Operational Rate</span>
          </div>
        </div>

        {/* Card 2: Online Now */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Online Now</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Activity size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">46</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>21.4% currently online</span>
          </div>
        </div>

        {/* Card 3: Applications in Progress */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Applications in Progress</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Briefcase size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">587</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 font-semibold mt-2">
            <ArrowUpRight size={13} />
            <span>Active Cases Pipeline</span>
          </div>
        </div>

        {/* Card 4: Completed This Month */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Completed This Month</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">432</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <CheckCircle2 size={13} />
            <span>94.2% Success Rate</span>
          </div>
        </div>
      </div>

      {/* SEARCH & MULTI-CRITERIA FILTERS BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" />
            <span>Search & Filter Active Agents</span>
          </h3>
          <button
            onClick={handleResetFilters}
            className="text-xs text-slate-500 hover:text-[#2563EB] font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <RefreshCw size={12} /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
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
              <option value="UK">🇬🇧 UK</option>
              <option value="India">🇮🇳 India</option>
              <option value="USA">🇺🇸 USA</option>
            </select>
          </div>

          {/* Filter 4: Performance Tier */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Performance Rating
            </label>
            <select
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
            >
              <option value="All">All Tiers</option>
              <option value="Excellent">⭐ Excellent (4.8+)</option>
              <option value="Good">⭐ Good (4.5 - 4.7)</option>
              <option value="Average">⭐ Average (4.0 - 4.4)</option>
              <option value="Low">⭐ Low (&lt; 4.0)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            onClick={() => triggerToast(`Filters applied: ${filteredAgents.length} active agent(s) found`)}
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
            <span>{selectedIds.length} Active Agent(s) Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => handleBulkAction("export")}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} /> Export Agent List
            </button>
            <button
              onClick={() => handleBulkAction("email")}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Mail size={14} /> Send Email
            </button>
            <button
              onClick={() => handleBulkAction("notification")}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Bell size={14} /> Send Notification
            </button>
            <button
              onClick={() => handleBulkAction("block")}
              className="px-3.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded-lg border border-amber-300 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Lock size={14} /> Block Selected
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

      {/* ACTIVE AGENTS TABLE */}
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
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4 text-center">Assigned Apps</th>
                <th className="py-3.5 px-4 text-center">Completed</th>
                <th className="py-3.5 px-4 text-center">Pending</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    <AlertCircle size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-bold">No active agents match your search criteria.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 text-xs text-[#2563EB] font-semibold underline cursor-pointer"
                    >
                      Clear search filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => (
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
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <span>{agent.flag}</span> {agent.country}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-extrabold text-slate-800">
                      {agent.assignedApps}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-extrabold text-emerald-600">
                      {agent.completedApps}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold bg-blue-50 text-[#2563EB] border border-blue-200">
                        {agent.pendingApps}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 font-bold text-amber-600">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span>{agent.rating}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{agent.lastLogin}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border bg-emerald-50 text-emerald-700 border-emerald-200 inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
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
                          onClick={() => triggerToast(`Edit profile opened for ${agent.name}`)}
                          title="Edit Agent Profile"
                          className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition cursor-pointer"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Application assignment modal opened for ${agent.name}`)}
                          title="Assign Applications"
                          className="p-1.5 hover:bg-blue-100 text-[#2563EB] rounded-lg transition cursor-pointer"
                        >
                          <Briefcase size={15} />
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
            Showing <strong className="text-slate-900">1–{filteredAgents.length}</strong> of{" "}
            <strong className="text-slate-900">215 Active Agents</strong>
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
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer flex items-center gap-1 font-semibold">
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE AGENT DETAILS CENTERED VIEW MODAL (8 TABS / SECTIONS) */}
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
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-bold font-mono border bg-emerald-500/30 text-white border-white/30">
                      {viewAgent.status}
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 font-mono flex items-center gap-2 mt-1">
                    <span>{viewAgent.id}</span>
                    <span className="text-blue-300">•</span>
                    <span>{viewAgent.agencyName}</span>
                    <span className="text-blue-300">•</span>
                    <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-white font-sans font-semibold">
                      <span>{viewAgent.flag}</span> {viewAgent.country}
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

            {/* 8 Section Navigation Tabs */}
            <div className="bg-[#EEF2FF] border-b-2 border-blue-200 px-4 flex items-center gap-1.5 overflow-x-auto shrink-0 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-blue-100 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full">
              {[
                { id: "personal", label: "Personal Information", icon: User },
                { id: "agency", label: "Agency Information", icon: Building },
                { id: "performanceSummary", label: "Performance Summary", icon: BarChart2 },
                { id: "activities", label: "Recent Activities", icon: Clock },
                { id: "account", label: "Account Information", icon: FileText },
                { id: "performanceOverview", label: "Performance Overview", icon: Award },
                { id: "quickActions", label: "Quick Actions", icon: Briefcase },
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
                        Country
                      </span>
                      <strong className="text-slate-900 font-extrabold flex items-center gap-2">
                        <span>{viewAgent.flag}</span> {viewAgent.country}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Registration Date
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewAgent.regDate}
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

              {/* 3. PERFORMANCE SUMMARY TAB */}
              {modalTab === "performanceSummary" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <BarChart2 size={16} className="text-[#2563EB]" />
                      <span>Performance Summary</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-center">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Applications Assigned
                      </span>
                      <strong className="text-2xl font-black text-slate-900 font-mono">
                        {viewAgent.performance.assigned}
                      </strong>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
                        Applications Completed
                      </span>
                      <strong className="text-2xl font-black text-emerald-700 font-mono">
                        {viewAgent.performance.completed}
                      </strong>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block mb-1">
                        Applications Pending
                      </span>
                      <strong className="text-2xl font-black text-amber-700 font-mono">
                        {viewAgent.performance.pending}
                      </strong>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB] block mb-1">
                        Approval Rate
                      </span>
                      <strong className="text-2xl font-black text-[#2563EB] font-mono">
                        {viewAgent.performance.approvalRate}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Average Processing Time
                      </span>
                      <strong className="text-2xl font-black text-slate-800 font-mono">
                        {viewAgent.performance.avgProcessingTime}
                      </strong>
                    </div>

                    <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block mb-1">
                        Customer Rating
                      </span>
                      <strong className="text-2xl font-black text-amber-600 font-mono flex items-center justify-center gap-1 mt-0.5">
                        <Star size={20} className="fill-amber-400 text-amber-400" />
                        <span>{viewAgent.performance.customerRating}</span>
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. RECENT ACTIVITIES TAB */}
              {modalTab === "activities" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Clock size={16} className="text-[#2563EB]" />
                      <span>Recent Activities Log</span>
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {viewAgent.recentActivities.map((act, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-emerald-600" />
                          <span className="font-bold text-slate-800">{act.title}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. ACCOUNT INFORMATION TAB */}
              {modalTab === "account" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <FileText size={16} className="text-[#2563EB]" />
                      <span>Account Information</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Account Status
                      </span>
                      <strong className="text-emerald-600 font-bold">
                        {viewAgent.accountInfo.status}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Last Login
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewAgent.accountInfo.lastLogin}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Last Active
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewAgent.accountInfo.lastActive}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Verification Status
                      </span>
                      <div className="flex items-center gap-3 mt-1 font-bold text-[11px]">
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Email Verified
                        </span>
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Mobile Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. PERFORMANCE OVERVIEW TAB */}
              {modalTab === "performanceOverview" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Award size={16} className="text-[#2563EB]" />
                      <span>Performance Overview Metrics</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Total Assigned
                      </span>
                      <strong className="text-2xl font-black text-slate-900 font-mono">
                        {viewAgent.performance.assigned}
                      </strong>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
                        Completed
                      </span>
                      <strong className="text-2xl font-black text-emerald-700 font-mono">
                        {viewAgent.performance.completed}
                      </strong>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block mb-1">
                        Pending
                      </span>
                      <strong className="text-2xl font-black text-amber-700 font-mono">
                        {viewAgent.performance.pending}
                      </strong>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB] block mb-1">
                        Approval Rate
                      </span>
                      <strong className="text-2xl font-black text-[#2563EB] font-mono">
                        {viewAgent.performance.approvalRate}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Avg Processing Time
                      </span>
                      <strong className="text-2xl font-black text-slate-800 font-mono">
                        {viewAgent.performance.avgProcessingTime}
                      </strong>
                    </div>

                    <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block mb-1">
                        Customer Rating
                      </span>
                      <strong className="text-2xl font-black text-amber-600 font-mono flex items-center gap-1 mt-0.5">
                        <Star size={20} className="fill-amber-400 text-amber-400" />
                        <span>{viewAgent.rating}</span>
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. QUICK ACTIONS TAB */}
              {modalTab === "quickActions" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Briefcase size={16} className="text-[#2563EB]" />
                      <span>Quick Operational Actions</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                    <button
                      onClick={() => triggerToast(`Profile opened for ${viewAgent.name}`)}
                      className="p-3.5 bg-white hover:bg-[#EEF2FF] border border-slate-200 hover:border-[#2563EB]/50 rounded-xl font-bold text-[#2563EB] flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>View Profile</span>
                      <Eye size={15} />
                    </button>

                    <button
                      onClick={() => triggerToast(`Edit agent triggered for ${viewAgent.name}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Edit Agent</span>
                      <Edit3 size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => triggerToast(`Assign applications modal opened for ${viewAgent.name}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Assign Applications</span>
                      <Briefcase size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => triggerToast(`Filtering assigned cases for ${viewAgent.name}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>View Assigned Applications ({viewAgent.assignedApps})</span>
                      <Layers size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => setModalTab("performanceOverview")}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>View Performance</span>
                      <BarChart2 size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => triggerToast(`Message sent to ${viewAgent.email}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Send Message</span>
                      <MessageSquare size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => triggerToast(`Notification sent to ${viewAgent.name}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Send Notification</span>
                      <Bell size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => {
                        setAgents((prev) => prev.filter((a) => a.id !== viewAgent.id));
                        triggerToast(`Blocked active agent account for ${viewAgent.name}`);
                        setViewAgent(null);
                      }}
                      className="p-3.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Block Agent</span>
                      <Lock size={15} />
                    </button>

                    <button
                      onClick={() => {
                        setAgents((prev) => prev.filter((a) => a.id !== viewAgent.id));
                        triggerToast(`Deleted active agent record for ${viewAgent.name}`);
                        setViewAgent(null);
                      }}
                      className="p-3.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Delete Agent</span>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* 8. BULK ACTIONS TAB */}
              {modalTab === "bulkActions" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Layers size={16} className="text-[#2563EB]" />
                      <span>Bulk Operational Actions</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <button
                      onClick={() => handleSelectAll(true)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Select All Active Agents</span>
                      <CheckCircle2 size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => handleBulkAction("export")}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Export Agent List</span>
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
                      onClick={() => handleBulkAction("block")}
                      className="p-3.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Block Selected</span>
                      <Lock size={15} />
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
