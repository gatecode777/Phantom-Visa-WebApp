import React, { useState } from "react";
import {
  UserX,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  Globe,
  Mail,
  Phone,
  Building,
  FileText,
  Send,
  Download,
  Bell,
  Lock,
  Unlock,
  Trash2,
  User,
  Star,
  Activity,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  X,
  Check
} from "lucide-react";

export interface InactiveAgent {
  id: string;
  agentId: string;
  agentName: string;
  agencyName: string;
  agencyType: string;
  country: string;
  email: string;
  mobile: string;
  registrationDate: string;
  inactiveSince: string;
  reason: string;
  lastLogin: string;
  lastActiveDate: string;
  status: "Inactive" | "Suspended" | "Pending Activation";
  emailVerified: boolean;
  mobileVerified: boolean;
  photoUrl?: string;
  regNumber: string;
  officeAddress: string;
  website: string;
  appsAssigned: number;
  appsCompleted: number;
  appsPending: number;
  approvalRate: string;
  rating: number;
  avgProcTime: string;
  recentActivities: { action: string; time: string }[];
}

const MOCK_INACTIVE_AGENTS: InactiveAgent[] = [
  {
    id: "1",
    agentId: "AGT-1025",
    agentName: "Geeta Bisht",
    agencyName: "Global Visa Services",
    agencyType: "Travel Agency",
    country: "Canada",
    email: "geeta.bisht@globalvisa.com",
    mobile: "+91 98765 43210",
    registrationDate: "15 Jan 2025",
    inactiveSince: "15 Jul 2026",
    reason: "No Activity",
    lastLogin: "14 Jul 2026",
    lastActiveDate: "14 Jul 2026",
    status: "Inactive",
    emailVerified: true,
    mobileVerified: true,
    regNumber: "REG-CA-9921",
    officeAddress: "Suite 402, Toronto Trade Tower, ON",
    website: "https://globalvisa.ca",
    appsAssigned: 42,
    appsCompleted: 38,
    appsPending: 4,
    approvalRate: "90.4%",
    rating: 4.6,
    avgProcTime: "5.1 Days",
    recentActivities: [
      { action: "Last Login", time: "14 Jul 2026, 04:30 PM" },
      { action: "Last Application Processed", time: "12 Jul 2026, 11:15 AM" },
      { action: "Last Document Verified", time: "10 Jul 2026, 02:40 PM" },
      { action: "Last Status Update", time: "08 Jul 2026, 09:20 AM" }
    ]
  },
  {
    id: "2",
    agentId: "AGT-1032",
    agentName: "Rahul Sharma",
    agencyName: "Visa Experts Ltd.",
    agencyType: "Immigration Consultant",
    country: "Australia",
    email: "rahul.s@visaexperts.com",
    mobile: "+91 98123 45678",
    registrationDate: "02 Mar 2025",
    inactiveSince: "10 Jul 2026",
    reason: "Suspended",
    lastLogin: "09 Jul 2026",
    lastActiveDate: "09 Jul 2026",
    status: "Suspended",
    emailVerified: true,
    mobileVerified: true,
    regNumber: "REG-AU-5541",
    officeAddress: "Level 12, Collins Street, Melbourne",
    website: "https://visaexperts.com.au",
    appsAssigned: 65,
    appsCompleted: 52,
    appsPending: 13,
    approvalRate: "80.0%",
    rating: 4.1,
    avgProcTime: "6.8 Days",
    recentActivities: [
      { action: "Account Suspended by Admin", time: "10 Jul 2026, 10:00 AM" },
      { action: "Last Login", time: "09 Jul 2026, 05:45 PM" },
      { action: "Last Document Verified", time: "07 Jul 2026, 03:10 PM" },
      { action: "Last Status Update", time: "05 Jul 2026, 01:25 PM" }
    ]
  },
  {
    id: "3",
    agentId: "AGT-1040",
    agentName: "Balram Suman",
    agencyName: "World Travel Agency",
    agencyType: "Corporate Partner",
    country: "UK",
    email: "b.suman@worldtravel.co.uk",
    mobile: "+44 7700 900077",
    registrationDate: "18 Nov 2024",
    inactiveSince: "05 Jul 2026",
    reason: "Admin Disabled",
    lastLogin: "05 Jul 2026",
    lastActiveDate: "05 Jul 2026",
    status: "Inactive",
    emailVerified: true,
    mobileVerified: false,
    regNumber: "REG-UK-8812",
    officeAddress: "221 Oxford Street, London",
    website: "https://worldtravel.co.uk",
    appsAssigned: 88,
    appsCompleted: 80,
    appsPending: 8,
    approvalRate: "90.9%",
    rating: 4.8,
    avgProcTime: "4.5 Days",
    recentActivities: [
      { action: "Admin Disabled Account", time: "05 Jul 2026, 02:00 PM" },
      { action: "Last Login", time: "05 Jul 2026, 01:15 PM" },
      { action: "Last Application Processed", time: "03 Jul 2026, 04:50 PM" },
      { action: "Last Status Update", time: "01 Jul 2026, 11:30 AM" }
    ]
  },
  {
    id: "4",
    agentId: "AGT-1048",
    agentName: "Pooja Verma",
    agencyName: "Apex Migration Services",
    agencyType: "Individual Agent",
    country: "India",
    email: "pooja.verma@apexvisas.in",
    mobile: "+91 99887 76655",
    registrationDate: "10 Feb 2025",
    inactiveSince: "20 Jun 2026",
    reason: "Pending Activation",
    lastLogin: "18 Jun 2026",
    lastActiveDate: "18 Jun 2026",
    status: "Pending Activation",
    emailVerified: true,
    mobileVerified: true,
    regNumber: "REG-IN-3321",
    officeAddress: "Sector 18, Noida, UP",
    website: "https://apexvisas.in",
    appsAssigned: 15,
    appsCompleted: 10,
    appsPending: 5,
    approvalRate: "66.7%",
    rating: 3.9,
    avgProcTime: "7.2 Days",
    recentActivities: [
      { action: "Pending Re-activation Audit", time: "20 Jun 2026, 09:00 AM" },
      { action: "Last Login", time: "18 Jun 2026, 11:00 AM" },
      { action: "Last Document Verified", time: "15 Jun 2026, 03:20 PM" },
      { action: "Last Status Update", time: "12 Jun 2026, 02:15 PM" }
    ]
  }
];

export default function InactiveAgents() {
  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedAgencyType, setSelectedAgencyType] = useState("All");
  const [selectedReason, setSelectedReason] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Table Data & Selection
  const [agents, setAgents] = useState<InactiveAgent[]>(MOCK_INACTIVE_AGENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Modal State
  const [activeModalAgent, setActiveModalAgent] = useState<InactiveAgent | null>(null);
  const [modalTab, setModalTab] = useState<"personal" | "agency" | "account" | "performance" | "activity">("personal");

  // UI Toast State
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Quick Action Handlers
  const handleActivateAgent = (agent: InactiveAgent) => {
    setAgents((prev) => prev.filter((a) => a.id !== agent.id));
    triggerToast(`Agent ${agent.agentId} (${agent.agentName}) has been activated successfully.`);
    if (activeModalAgent?.id === agent.id) setActiveModalAgent(null);
  };

  const handleBlockAgent = (agent: InactiveAgent) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agent.id ? { ...a, status: "Suspended", reason: "Suspended" } : a))
    );
    triggerToast(`Agent ${agent.agentId} status updated to Suspended.`);
  };

  const handleDeleteAgent = (agent: InactiveAgent) => {
    setAgents((prev) => prev.filter((a) => a.id !== agent.id));
    triggerToast(`Agent ${agent.agentId} has been permanently deleted.`);
    if (activeModalAgent?.id === agent.id) setActiveModalAgent(null);
  };

  // Bulk Actions
  const handleSelectAll = () => {
    if (selectedIds.length === filteredAgents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAgents.map((a) => a.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleBulkActivate = () => {
    setAgents((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
    triggerToast(`${selectedIds.length} agents activated successfully.`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setAgents((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
    triggerToast(`${selectedIds.length} agents permanently deleted.`);
    setSelectedIds([]);
  };

  // Filtering Logic
  const filteredAgents = agents.filter((ag) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      ag.agentId.toLowerCase().includes(q) ||
      ag.agentName.toLowerCase().includes(q) ||
      ag.agencyName.toLowerCase().includes(q) ||
      ag.email.toLowerCase().includes(q) ||
      ag.mobile.toLowerCase().includes(q);

    const matchesStatus = selectedStatus === "All" || ag.status === selectedStatus;
    const matchesType = selectedAgencyType === "All" || ag.agencyType === selectedAgencyType;
    const matchesReason = selectedReason === "All" || ag.reason === selectedReason;

    return matchesQuery && matchesStatus && matchesType && matchesReason;
  });

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
            <UserX size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Agent Governance & Recovery
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Inactive Agents
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            View and manage agents whose accounts are currently inactive. Activate, review, or permanently remove agent accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedStatus("All");
              setSelectedAgencyType("All");
              setSelectedReason("All");
              triggerToast("Filters reset to default.");
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw size={14} /> Reset View
          </button>
        </div>
      </div>

      {/* TOP STATISTICS CARDS (EXACT WIREFRAME STATS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
              Total Inactive Agents
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <UserX size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">18</div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">
            Accounts Requiring Review
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
              Temporarily Inactive
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">10</div>
          <span className="text-[11px] text-[#2563EB] font-semibold mt-1 inline-block">
            Dormant &gt; 30 Days
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
              Not Activated
            </span>
            <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">5</div>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 inline-block">
            Pending Onboarding Audit
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
              Suspended
            </span>
            <div className="w-9 h-9 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">3</div>
          <span className="text-[11px] text-red-600 font-semibold mt-1 inline-block">
            Admin Compliance Restriction
          </span>
        </div>
      </div>

      {/* SEARCH & MULTI-CRITERIA FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredAgents.length} of {agents.length} Matches
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH BY KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search By Keyword
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Agent ID, Name, Email, Mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition"
              />
            </div>
          </div>

          {/* STATUS FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending Activation">Pending Activation</option>
            </select>
          </div>

          {/* AGENCY TYPE FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Agency Type
            </label>
            <select
              value={selectedAgencyType}
              onChange={(e) => setSelectedAgencyType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Agency Types</option>
              <option value="Travel Agency">Travel Agency</option>
              <option value="Immigration Consultant">Immigration Consultant</option>
              <option value="Corporate Partner">Corporate Partner</option>
              <option value="Individual Agent">Individual Agent</option>
            </select>
          </div>

          {/* INACTIVE REASON FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Reason
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Reasons</option>
              <option value="No Activity">No Activity</option>
              <option value="Suspended">Suspended</option>
              <option value="Admin Disabled">Admin Disabled</option>
              <option value="Pending Activation">Pending Activation</option>
            </select>
          </div>

          {/* INACTIVE SINCE DATE RANGE */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Inactive Since Range
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-1/2 bg-slate-50 border border-slate-200 text-slate-800 text-[11px] px-2 py-1.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-1/2 bg-slate-50 border border-slate-200 text-slate-800 text-[11px] px-2 py-1.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
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
            <span>Inactive Agents Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkActivate}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 size={14} /> Activate Selected
            </button>
            <button
              onClick={() => triggerToast(`Email notification sent to ${selectedIds.length} agents.`)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Mail size={14} /> Send Email
            </button>
            <button
              onClick={() => triggerToast(`Push notification sent to ${selectedIds.length} agents.`)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Bell size={14} /> Send Notification
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Trash2 size={14} /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* INACTIVE AGENTS TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredAgents.length && filteredAgents.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Agent ID</th>
                <th className="py-3.5 px-4">Agent Name</th>
                <th className="py-3.5 px-4">Agency Name</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Inactive Since</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <UserX size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No inactive agents found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => (
                  <tr
                    key={agent.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(agent.id)}
                        onChange={() => handleToggleSelect(agent.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {agent.agentId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {agent.agentName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {agent.agencyName}
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      {agent.country}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {agent.inactiveSince}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {agent.reason}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {agent.lastLogin}
                    </td>
                    <td className="py-3.5 px-4">
                      {agent.status === "Inactive" ? (
                        <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-slate-200">
                          Inactive
                        </span>
                      ) : agent.status === "Suspended" ? (
                        <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                          Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-200">
                          Pending Activation
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveModalAgent(agent);
                            setModalTab("personal");
                          }}
                          title="View Details"
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => {
                            setActiveModalAgent(agent);
                            setModalTab("agency");
                          }}
                          title="Edit Agent"
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleActivateAgent(agent)}
                          title="Activate Agent"
                          className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                        >
                          <CheckCircle2 size={15} />
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
          <div>Showing 1–10 of 245 Inactive Agents</div>
          <div className="flex items-center gap-1 font-mono font-bold">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#2563EB] text-white rounded-lg">1</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">2</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">3</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">4</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CENTERED AGENT DETAILS POPUP VIEW MODAL (5 TABS AS SPECIFIED IN WIREFRAME) */}
      {activeModalAgent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  {activeModalAgent.agentName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalAgent.agentName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
                      {activeModalAgent.agentId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activeModalAgent.agencyName} &bull; {activeModalAgent.country}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalAgent(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {[
                { id: "personal", label: "Personal Information", icon: User },
                { id: "agency", label: "Agency Information", icon: Building },
                { id: "account", label: "Account Information", icon: Lock },
                { id: "performance", label: "Previous Performance", icon: Activity },
                { id: "activity", label: "Recent Activity", icon: Clock }
              ].map((tab) => {
                const IconComp = tab.icon;
                const active = modalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      active
                        ? "bg-[#2563EB] text-white shadow-sm"
                        : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                    }`}
                  >
                    <IconComp size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* MODAL BODY (LIGHT BLUE SLIM SCROLLBAR) */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {/* TAB 1: PERSONAL INFORMATION */}
              {modalTab === "personal" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Personal Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Agent ID</span>
                      <strong className="text-slate-900 font-mono font-bold">{activeModalAgent.agentId}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Full Name</span>
                      <strong className="text-slate-900 font-bold">{activeModalAgent.agentName}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Email Address</span>
                      <strong className="text-[#2563EB] font-mono">{activeModalAgent.email}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Mobile Number</span>
                      <strong className="text-slate-900 font-mono">{activeModalAgent.mobile}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Country</span>
                      <strong className="text-slate-900 font-bold">{activeModalAgent.country}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Registration Date</span>
                      <strong className="text-slate-900 font-mono">{activeModalAgent.registrationDate}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: AGENCY INFORMATION */}
              {modalTab === "agency" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Agency & Organization Info
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Agency Name</span>
                      <strong className="text-slate-900 font-bold">{activeModalAgent.agencyName}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Agency Type</span>
                      <strong className="text-[#2563EB] font-bold">{activeModalAgent.agencyType}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Registration Number</span>
                      <strong className="text-slate-900 font-mono">{activeModalAgent.regNumber}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Official Website</span>
                      <a href={activeModalAgent.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-mono">
                        {activeModalAgent.website}
                      </a>
                    </div>
                    <div className="sm:col-span-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Office Address</span>
                      <strong className="text-slate-900 font-medium">{activeModalAgent.officeAddress}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ACCOUNT INFORMATION */}
              {modalTab === "account" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Account Status & Credentials
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Account Status</span>
                      <span className="text-amber-700 font-bold">{activeModalAgent.status}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Last Login</span>
                      <strong className="text-slate-900 font-mono">{activeModalAgent.lastLogin}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Last Active Date</span>
                      <strong className="text-slate-900 font-mono">{activeModalAgent.lastActiveDate}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Inactive Since</span>
                      <strong className="text-amber-700 font-mono">{activeModalAgent.inactiveSince}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Inactive Reason</span>
                      <strong className="text-slate-900 font-bold">{activeModalAgent.reason}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Verification Badges</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Email Verified
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Mobile Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PREVIOUS PERFORMANCE */}
              {modalTab === "performance" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Historical Track Record
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Assigned</span>
                      <strong className="text-slate-900 text-lg font-mono font-black">{activeModalAgent.appsAssigned}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-emerald-600 font-extrabold uppercase block">Completed</span>
                      <strong className="text-emerald-700 text-lg font-mono font-black">{activeModalAgent.appsCompleted}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-amber-600 font-extrabold uppercase block">Pending</span>
                      <strong className="text-amber-700 text-lg font-mono font-black">{activeModalAgent.appsPending}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-[#2563EB] font-extrabold uppercase block">Approval Rate</span>
                      <strong className="text-[#2563EB] text-lg font-mono font-black">{activeModalAgent.approvalRate}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Rating</span>
                      <strong className="text-amber-500 text-lg font-mono font-black">⭐ {activeModalAgent.rating}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Avg Speed</span>
                      <strong className="text-slate-900 text-sm font-mono font-extrabold">{activeModalAgent.avgProcTime}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: RECENT ACTIVITY */}
              {modalTab === "activity" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Recent System Audits & Activity Log
                  </h4>
                  <div className="space-y-2">
                    {activeModalAgent.recentActivities.map((act, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-[10px]">
                            ✓
                          </div>
                          <span className="font-bold text-slate-900">{act.action}</span>
                        </div>
                        <span className="font-mono text-slate-400 text-[11px]">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER QUICK ACTIONS (EXACT WIREFRAME QUICK ACTIONS) */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleActivateAgent(activeModalAgent)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} /> Activate Agent
                </button>
                <button
                  onClick={() => triggerToast(`Email notification sent to ${activeModalAgent.email}.`)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Mail size={14} /> Send Email
                </button>
                <button
                  onClick={() => triggerToast(`Notification sent to ${activeModalAgent.agentName}.`)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Bell size={14} /> Send Notification
                </button>
                <button
                  onClick={() => handleBlockAgent(activeModalAgent)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Lock size={14} /> Block Agent
                </button>
              </div>

              <button
                onClick={() => handleDeleteAgent(activeModalAgent)}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Delete Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
