import React, { useState } from "react";
import {
  Briefcase,
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
  UserCheck,
  UserX,
  Layers,
  Award,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  X,
  MessageSquare,
  AlertCircle,
  Check
} from "lucide-react";

export interface AgentRecord {
  id: string;
  name: string;
  avatar: string;
  agencyName: string;
  email: string;
  mobile: string;
  assignedApps: number;
  completedApps: number;
  activeCases: number;
  rating: number;
  status: "Active" | "Inactive" | "Pending Approval" | "Blocked";
  country: string;
  flag: string;
  dob: string;
  gender: string;
  address: string;
  agencyRegNo: string;
  businessLicense: string;
  officeAddress: string;
  website: string;
  gstTaxNo: string;
  performance: {
    assigned: number;
    completed: number;
    pending: number;
    rejected: number;
    approvalRate: string;
    avgProcessingTime: string;
  };
  kyc: {
    identityProof: boolean;
    businessRegistration: boolean;
    officeAddressProof: boolean;
    bankDetails: boolean;
    taxCertificate: boolean;
    status: "Verified" | "Pending Audit" | "Rejected";
  };
  accountInfo: {
    regDate: string;
    lastLogin: string;
    emailVerified: boolean;
    mobileVerified: boolean;
  };
  recentActivities: {
    title: string;
    time: string;
  }[];
}

const mockAgents: AgentRecord[] = [
  {
    id: "AGT-1001",
    name: "Geeta Bisht",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    agencyName: "Global Visa Services",
    email: "geeta@gmail.com",
    mobile: "+91 9876543210",
    assignedApps: 52,
    completedApps: 45,
    activeCases: 7,
    rating: 4.9,
    status: "Active",
    country: "India",
    flag: "🇮🇳",
    dob: "14 May 1990",
    gender: "Female",
    address: "B-402, Connaught Place, New Delhi, India",
    agencyRegNo: "REG-IND-99120",
    businessLicense: "LIC-DEL-88912",
    officeAddress: "Suite 401, Global Tower, CP, New Delhi",
    website: "https://globalvisa.com",
    gstTaxNo: "07AAAAA0000A1Z5",
    performance: {
      assigned: 52,
      completed: 45,
      pending: 7,
      rejected: 0,
      approvalRate: "92%",
      avgProcessingTime: "4.2 Days"
    },
    kyc: {
      identityProof: true,
      businessRegistration: true,
      officeAddressProof: true,
      bankDetails: true,
      taxCertificate: true,
      status: "Verified"
    },
    accountInfo: {
      regDate: "12 Jan 2025",
      lastLogin: "10 mins ago",
      emailVerified: true,
      mobileVerified: true
    },
    recentActivities: [
      { title: "Logged in from Chrome (Windows)", time: "10 mins ago" },
      { title: "Reviewed Application APP-1025 for Tourist Visa", time: "1 hour ago" },
      { title: "Verified Documents for 3 new applicants", time: "Yesterday" },
      { title: "Updated Visa Status to Embassy Under Review", time: "2 days ago" },
      { title: "Sent Direct Notification to Geeta Bisht", time: "3 days ago" }
    ]
  },
  {
    id: "AGT-1002",
    name: "Rahul Sharma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    agencyName: "Visa Experts Ltd",
    email: "rahul@gmail.com",
    mobile: "+91 9812345678",
    assignedApps: 34,
    completedApps: 30,
    activeCases: 4,
    rating: 4.8,
    status: "Active",
    country: "India",
    flag: "🇮🇳",
    dob: "22 Aug 1988",
    gender: "Male",
    address: "A-12, Sector 62, Noida, UP, India",
    agencyRegNo: "REG-UP-44512",
    businessLicense: "LIC-NOI-33219",
    officeAddress: "2nd Floor, Visa Plaza, Noida Sector 62",
    website: "https://visaexperts.in",
    gstTaxNo: "09BBBBB1111B2Y6",
    performance: {
      assigned: 34,
      completed: 30,
      pending: 4,
      rejected: 0,
      approvalRate: "88%",
      avgProcessingTime: "5.1 Days"
    },
    kyc: {
      identityProof: true,
      businessRegistration: true,
      officeAddressProof: true,
      bankDetails: true,
      taxCertificate: true,
      status: "Verified"
    },
    accountInfo: {
      regDate: "05 Feb 2025",
      lastLogin: "1 hour ago",
      emailVerified: true,
      mobileVerified: true
    },
    recentActivities: [
      { title: "Logged in from Safari (macOS)", time: "1 hour ago" },
      { title: "Uploaded Embassy Submission Slip", time: "3 hours ago" },
      { title: "Approved Student Visa Application", time: "1 day ago" }
    ]
  },
  {
    id: "AGT-1003",
    name: "Balram Suman",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    agencyName: "World Travel Agency",
    email: "balram@gmail.com",
    mobile: "+91 9988776655",
    assignedApps: 21,
    completedApps: 18,
    activeCases: 3,
    rating: 4.6,
    status: "Pending Approval",
    country: "India",
    flag: "🇮🇳",
    dob: "10 Apr 1985",
    gender: "Male",
    address: "C-88, Malviya Nagar, Jaipur, Rajasthan",
    agencyRegNo: "REG-RAJ-88123",
    businessLicense: "LIC-JAI-11209",
    officeAddress: "G-10, Travel Hub, MI Road, Jaipur",
    website: "https://worldtravel.co.in",
    gstTaxNo: "08CCCCC2222C3X7",
    performance: {
      assigned: 21,
      completed: 18,
      pending: 3,
      rejected: 0,
      approvalRate: "85%",
      avgProcessingTime: "5.8 Days"
    },
    kyc: {
      identityProof: true,
      businessRegistration: true,
      officeAddressProof: false,
      bankDetails: true,
      taxCertificate: false,
      status: "Pending Audit"
    },
    accountInfo: {
      regDate: "20 Jul 2026",
      lastLogin: "2 hours ago",
      emailVerified: true,
      mobileVerified: false
    },
    recentActivities: [
      { title: "Agent Account Registered", time: "20 Jul 2026" },
      { title: "Uploaded Agency License Documents", time: "20 Jul 2026" }
    ]
  },
  {
    id: "AGT-1004",
    name: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
    agencyName: "Pacific Migration Partners",
    email: "sarah@pacificvisa.com",
    mobile: "+1 4155552671",
    assignedApps: 68,
    completedApps: 62,
    activeCases: 6,
    rating: 4.95,
    status: "Active",
    country: "USA",
    flag: "🇺🇸",
    dob: "18 Mar 1991",
    gender: "Female",
    address: "500 Market St, San Francisco, CA, USA",
    agencyRegNo: "REG-US-10293",
    businessLicense: "LIC-CA-99182",
    officeAddress: "Suite 1200, Financial District, SF",
    website: "https://pacificmigration.com",
    gstTaxNo: "US-EIN-9928120",
    performance: {
      assigned: 68,
      completed: 62,
      pending: 6,
      rejected: 0,
      approvalRate: "96%",
      avgProcessingTime: "3.5 Days"
    },
    kyc: {
      identityProof: true,
      businessRegistration: true,
      officeAddressProof: true,
      bankDetails: true,
      taxCertificate: true,
      status: "Verified"
    },
    accountInfo: {
      regDate: "10 Mar 2025",
      lastLogin: "30 mins ago",
      emailVerified: true,
      mobileVerified: true
    },
    recentActivities: [
      { title: "Logged in from Chrome (MacBook)", time: "30 mins ago" },
      { title: "Completed Express Entry PR Audit", time: "2 hours ago" }
    ]
  },
  {
    id: "AGT-1005",
    name: "David Chen",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    agencyName: "Apex Immigrations",
    email: "david@apexvisa.ca",
    mobile: "+1 6045558912",
    assignedApps: 15,
    completedApps: 10,
    activeCases: 5,
    rating: 4.2,
    status: "Inactive",
    country: "Canada",
    flag: "🇨🇦",
    dob: "05 Nov 1986",
    gender: "Male",
    address: "700 W Georgia St, Vancouver, BC, Canada",
    agencyRegNo: "REG-CAN-88192",
    businessLicense: "LIC-BC-77281",
    officeAddress: "Pacific Centre, Vancouver",
    website: "https://apexvisa.ca",
    gstTaxNo: "CA-BN-8829102",
    performance: {
      assigned: 15,
      completed: 10,
      pending: 5,
      rejected: 0,
      approvalRate: "75%",
      avgProcessingTime: "7.1 Days"
    },
    kyc: {
      identityProof: true,
      businessRegistration: true,
      officeAddressProof: true,
      bankDetails: true,
      taxCertificate: false,
      status: "Verified"
    },
    accountInfo: {
      regDate: "15 Nov 2025",
      lastLogin: "15 days ago",
      emailVerified: true,
      mobileVerified: true
    },
    recentActivities: [
      { title: "Logged in from Chrome (Windows)", time: "15 days ago" }
    ]
  }
];

export default function AllAgents() {
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [performanceFilter, setPerformanceFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Selection States for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Selected Agent Detail Modal State
  const [viewAgent, setViewAgent] = useState<AgentRecord | null>(null);
  const [modalTab, setModalTab] = useState<
    | "personal"
    | "agency"
    | "performanceSummary"
    | "kyc"
    | "account"
    | "activity"
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

  // Agent List State
  const [agents, setAgents] = useState<AgentRecord[]>(mockAgents);

  // Filter Logic
  const filteredAgents = agents.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.mobile.includes(searchTerm);

    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    const matchesCountry = countryFilter === "All" || a.country === countryFilter;
    
    let matchesPerf = true;
    if (performanceFilter === "Excellent") matchesPerf = a.rating >= 4.8;
    else if (performanceFilter === "Good") matchesPerf = a.rating >= 4.5 && a.rating < 4.8;
    else if (performanceFilter === "Average") matchesPerf = a.rating >= 4.0 && a.rating < 4.5;
    else if (performanceFilter === "Low") matchesPerf = a.rating < 4.0;

    return matchesSearch && matchesStatus && matchesCountry && matchesPerf;
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

  // Actions
  const handleApproveAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Active" } : a))
    );
    const target = agents.find((a) => a.id === id);
    triggerToast(`Approved agent account for ${target?.name || id}`);
    if (viewAgent?.id === id) {
      setViewAgent((prev) => (prev ? { ...prev, status: "Active" } : null));
    }
  };

  const handleBlockAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === "Blocked" ? "Active" : "Blocked" } : a
      )
    );
    const target = agents.find((a) => a.id === id);
    triggerToast(
      target?.status === "Blocked"
        ? `Re-activated agent account for ${target.name}`
        : `Blocked agent account for ${target?.name}`
    );
    if (viewAgent?.id === id) {
      setViewAgent((prev) =>
        prev ? { ...prev, status: prev.status === "Blocked" ? "Active" : "Blocked" } : null
      );
    }
  };

  const handleDeleteAgent = (id: string) => {
    const target = agents.find((a) => a.id === id);
    setAgents((prev) => prev.filter((a) => a.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    if (viewAgent?.id === id) setViewAgent(null);
    triggerToast(`Deleted agent record for ${target?.name || id}`);
  };

  const handleBulkAction = (action: string) => {
    if (selectedIds.length === 0) {
      triggerToast("Please select at least one agent first.");
      return;
    }

    if (action === "block") {
      setAgents((prev) =>
        prev.map((a) => (selectedIds.includes(a.id) ? { ...a, status: "Blocked" } : a))
      );
      triggerToast(`Blocked ${selectedIds.length} selected agent(s).`);
    } else if (action === "delete") {
      setAgents((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
      setSelectedIds([]);
      triggerToast(`Deleted ${selectedIds.length} selected agent(s).`);
    } else {
      triggerToast(`Executed '${action}' for ${selectedIds.length} agent(s).`);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCountryFilter("All");
    setPerformanceFilter("All");
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
          <Briefcase size={14} />
          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 font-bold">
            All Agents
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">All Agents</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Manage all registered agents, monitor their performance, assign applications, and manage account status.
        </p>
      </div>

      {/* TOP STATISTICS CARDS (4 CARDS GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Agents */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Agents</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Briefcase size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">245</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <ArrowUpRight size={13} />
            <span>+10.4% vs last quarter</span>
          </div>
        </div>

        {/* Card 2: Active Agents */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Agents</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <UserCheck size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">215</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <ShieldCheck size={13} />
            <span>87.7% Active Operational Rate</span>
          </div>
        </div>

        {/* Card 3: Inactive Agents */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Inactive Agents</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <UserX size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">18</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold mt-2">
            <Clock size={13} />
            <span>No activity in 30 days</span>
          </div>
        </div>

        {/* Card 4: Pending Approval */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Pending Approval</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Clock size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-3 font-mono">5</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-semibold mt-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Awaiting License Review</span>
          </div>
        </div>
      </div>

      {/* SEARCH & MULTI-CRITERIA FILTERS BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" />
            <span>Search & Filter Registered Agents</span>
          </h3>
          <button
            onClick={handleResetFilters}
            className="text-xs text-slate-500 hover:text-[#2563EB] font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <RefreshCw size={12} /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* Filter 1: Search By Keyword */}
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
              <option value="Active">🟢 Active</option>
              <option value="Inactive">⚪ Inactive</option>
              <option value="Pending Approval">🟡 Pending Approval</option>
              <option value="Blocked">🔴 Blocked</option>
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
              <option value="India">🇮🇳 India</option>
              <option value="USA">🇺🇸 USA</option>
              <option value="Canada">🇨🇦 Canada</option>
              <option value="Australia">🇦🇺 Australia</option>
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

          {/* Filter 5: Registration Date Range */}
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
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            onClick={() => triggerToast(`Filters applied: ${filteredAgents.length} agent(s) found`)}
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
            <span>{selectedIds.length} Agent(s) Selected</span>
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

      {/* AGENTS TABLE */}
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
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Mobile</th>
                <th className="py-3.5 px-4 text-center">Assigned Apps</th>
                <th className="py-3.5 px-4 text-center">Completed</th>
                <th className="py-3.5 px-4 text-center">Active Cases</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    <AlertCircle size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-bold">No agents match your search criteria.</p>
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
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{agent.email}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{agent.mobile}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-extrabold text-slate-800">
                      {agent.assignedApps}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-extrabold text-emerald-600">
                      {agent.completedApps}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold bg-blue-50 text-[#2563EB] border border-blue-200">
                        {agent.activeCases}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 font-bold text-amber-600">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span>{agent.rating}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border inline-flex items-center gap-1.5 ${
                          agent.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : agent.status === "Pending Approval"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : agent.status === "Blocked"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            agent.status === "Active"
                              ? "bg-emerald-500"
                              : agent.status === "Pending Approval"
                              ? "bg-amber-500 animate-ping"
                              : agent.status === "Blocked"
                              ? "bg-red-500"
                              : "bg-slate-400"
                          }`}
                        />
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
                          onClick={() => triggerToast(`Edit record triggered for ${agent.name}`)}
                          title="Edit Agent Profile"
                          className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition cursor-pointer"
                        >
                          <Edit3 size={15} />
                        </button>
                        {agent.status === "Pending Approval" && (
                          <button
                            onClick={() => handleApproveAgent(agent.id)}
                            title="Approve Agent"
                            className="p-1.5 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 rounded-lg transition cursor-pointer"
                          >
                            <Check size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => handleBlockAgent(agent.id)}
                          title={agent.status === "Blocked" ? "Activate Agent" : "Block Agent"}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            agent.status === "Blocked"
                              ? "hover:bg-emerald-100 text-emerald-600"
                              : "hover:bg-amber-100 text-amber-600"
                          }`}
                        >
                          {agent.status === "Blocked" ? <Unlock size={15} /> : <Lock size={15} />}
                        </button>
                        <button
                          onClick={() => handleDeleteAgent(agent.id)}
                          title="Delete Agent Record"
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
            Showing <strong className="text-slate-900">1–{filteredAgents.length}</strong> of{" "}
            <strong className="text-slate-900">245 Registered Agents</strong>
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

      {/* AGENT DETAILS CENTERED VIEW MODAL (9 TABS / SECTIONS) */}
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
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                        viewAgent.status === "Active"
                          ? "bg-emerald-500/20 text-white border-white/30"
                          : viewAgent.status === "Pending Approval"
                          ? "bg-amber-500/30 text-white border-white/30"
                          : "bg-slate-500/30 text-white border-white/30"
                      }`}
                    >
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

            {/* 9 Section Navigation Tabs */}
            <div className="bg-[#EEF2FF] border-b-2 border-blue-200 px-4 flex items-center gap-1.5 overflow-x-auto shrink-0 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-blue-100 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full">
              {[
                { id: "personal", label: "Personal Info", icon: UserCheck },
                { id: "agency", label: "Agency Info", icon: Building },
                { id: "performanceSummary", label: "Performance Summary", icon: BarChart2 },
                { id: "kyc", label: "KYC Verification", icon: ShieldCheck },
                { id: "account", label: "Account Info", icon: FileText },
                { id: "activity", label: "Recent Activities", icon: Clock },
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
                      <UserCheck size={16} className="text-[#2563EB]" />
                      <span>Personal Information</span>
                    </h3>
                    <span className="text-[10px] font-mono text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 font-bold">
                      Verified Agent Dossier
                    </span>
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
                        Date of Birth
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewAgent.dob}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Gender
                      </span>
                      <strong className="text-slate-800 font-bold">
                        {viewAgent.gender}
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

                    <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Address
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
                        Agency Registration Number
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
                        GST / Tax Number (Optional)
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewAgent.gstTaxNo}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Official Website
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

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs text-center">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Assigned Applications
                      </span>
                      <strong className="text-2xl font-black text-slate-900 font-mono">
                        {viewAgent.performance.assigned}
                      </strong>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
                        Completed Applications
                      </span>
                      <strong className="text-2xl font-black text-emerald-700 font-mono">
                        {viewAgent.performance.completed}
                      </strong>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block mb-1">
                        Pending Applications
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
                  </div>
                </div>
              )}

              {/* 4. KYC VERIFICATION TAB */}
              {modalTab === "kyc" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <ShieldCheck size={16} className="text-[#2563EB]" />
                      <span>KYC & Business Verification</span>
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
                      {viewAgent.kyc.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    {[
                      { label: "Identity Proof (Passport/National ID)", verified: viewAgent.kyc.identityProof },
                      { label: "Business Registration Certificate", verified: viewAgent.kyc.businessRegistration },
                      { label: "Office Address Proof", verified: viewAgent.kyc.officeAddressProof },
                      { label: "Bank Account Details", verified: viewAgent.kyc.bankDetails },
                      { label: "GST / Tax Certificate", verified: viewAgent.kyc.taxCertificate }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border flex items-center justify-between font-bold ${
                          item.verified
                            ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
                            : "bg-amber-50/70 border-amber-200 text-amber-800"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {item.verified ? (
                            <CheckCircle2 size={16} className="text-emerald-600" />
                          ) : (
                            <XCircle size={16} className="text-amber-600" />
                          )}
                          <span>{item.label}</span>
                        </span>
                        <span className="font-mono text-[11px] font-extrabold uppercase">
                          {item.verified ? "VERIFIED" : "PENDING"}
                        </span>
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
                        Registration Date
                      </span>
                      <strong className="text-slate-800 font-mono font-bold">
                        {viewAgent.accountInfo.regDate}
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
                        Account Status
                      </span>
                      <strong className="text-slate-900 font-bold">
                        {viewAgent.status}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Email & Mobile Verification
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

              {/* 6. RECENT ACTIVITIES TAB */}
              {modalTab === "activity" && (
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
                          <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
                          <span className="font-bold text-slate-800">{act.title}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. PERFORMANCE OVERVIEW TAB */}
              {modalTab === "performanceOverview" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-wide flex items-center gap-2 font-outfit">
                      <Award size={16} className="text-[#2563EB]" />
                      <span>Detailed Performance Metrics</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                        Applications Assigned
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

              {/* 8. QUICK ACTIONS TAB */}
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
                      onClick={() => triggerToast(`Navigated to profile of ${viewAgent.name}`)}
                      className="p-3.5 bg-white hover:bg-[#EEF2FF] border border-slate-200 hover:border-[#2563EB]/50 rounded-xl font-bold text-[#2563EB] flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>View Profile</span>
                      <Eye size={15} />
                    </button>

                    <button
                      onClick={() => triggerToast(`Edit agent form triggered for ${viewAgent.name}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Edit Agent</span>
                      <Edit3 size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => triggerToast(`Application assignment modal opened for ${viewAgent.name}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Assign Applications</span>
                      <Briefcase size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => triggerToast(`Filtering cases for ${viewAgent.name}`)}
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
                      onClick={() => triggerToast(`Direct message sent to ${viewAgent.email}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Send Message</span>
                      <MessageSquare size={15} className="text-[#2563EB]" />
                    </button>

                    <button
                      onClick={() => triggerToast(`Push notification sent to ${viewAgent.name}`)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Send Notification</span>
                      <Bell size={15} className="text-[#2563EB]" />
                    </button>

                    {viewAgent.status === "Pending Approval" && (
                      <button
                        onClick={() => handleApproveAgent(viewAgent.id)}
                        className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl font-bold text-emerald-700 flex items-center justify-between transition cursor-pointer shadow-2xs"
                      >
                        <span>Approve Agent</span>
                        <CheckCircle2 size={15} />
                      </button>
                    )}

                    <button
                      onClick={() => handleBlockAgent(viewAgent.id)}
                      className={`p-3.5 border rounded-xl font-bold flex items-center justify-between transition cursor-pointer shadow-2xs ${
                        viewAgent.status === "Blocked"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      }`}
                    >
                      <span>{viewAgent.status === "Blocked" ? "Activate Agent" : "Block Agent"}</span>
                      {viewAgent.status === "Blocked" ? <Unlock size={15} /> : <Lock size={15} />}
                    </button>

                    <button
                      onClick={() => handleDeleteAgent(viewAgent.id)}
                      className="p-3.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold flex items-center justify-between transition cursor-pointer shadow-2xs"
                    >
                      <span>Delete Agent</span>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* 9. BULK ACTIONS TAB */}
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
                      <span>Select All Agents</span>
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
