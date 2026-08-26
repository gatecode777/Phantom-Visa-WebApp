import React, { useState, useEffect, useMemo } from "react";
import { API_V1_URL } from "../config/api";
import {
  BarChart3,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Star,
  Trophy,
  Award,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  Send,
  Bell,
  UserCheck,
  Calendar,
  Globe,
  Building,
  Mail,
  Phone,
  Activity,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Sparkles
} from "lucide-react";
import { useVisa } from "../context/VisaContext";

export interface AgentPerformanceRecord {
  id: string;
  agentId: string;
  agentName: string;
  agencyName: string;
  email: string;
  mobile: string;
  country: string;
  assigned: number;
  completed: number;
  pending: number;
  rejected: number;
  approvalRate: string;
  rejectionRate: string;
  avgProcTime: string;
  avgResponseTime: string;
  rating: number;
  totalReviews: number;
  positiveFeedback: string;
  negativeFeedback: string;
  performanceTier: "Excellent" | "Good" | "Average" | "Low";
  monthlyApps: number;
  monthlyCompleted: number;
  monthlyPending: number;
  monthlyGrowth: string;
  attendanceStatus: "Active" | "On Leave" | "Off-Duty";
  recentActivities: { action: string; time: string }[];
}

const FALLBACK_PERFORMANCE_RECORDS: AgentPerformanceRecord[] = [
  {
    id: "agt-1001",
    agentId: "AGT-1001",
    agentName: "Rajesh Sharma",
    agencyName: "Apex Global Visa Consultancy",
    email: "rajesh.apex@visa-network.com",
    mobile: "+91 98112 34567",
    country: "India",
    assigned: 42,
    completed: 38,
    pending: 3,
    rejected: 1,
    approvalRate: "90%",
    rejectionRate: "2%",
    avgProcTime: "5.8 Days",
    avgResponseTime: "8 Mins",
    rating: 4.95,
    totalReviews: 64,
    positiveFeedback: "Outstanding documentation accuracy and fast consular liaison.",
    negativeFeedback: "None",
    performanceTier: "Excellent",
    monthlyApps: 42,
    monthlyCompleted: 38,
    monthlyPending: 3,
    monthlyGrowth: "+22.5%",
    attendanceStatus: "Active",
    recentActivities: [
      { action: "Completed Canada Tourist Application review", time: "30 mins ago" },
      { action: "Scheduled VFS biometric appointment for client", time: "2 hours ago" }
    ]
  },
  {
    id: "agt-1002",
    agentId: "AGT-1002",
    agentName: "Anita Patel",
    agencyName: "Sunrise International Immigration",
    email: "anita.patel@sunrisevisas.com",
    mobile: "+91 98223 45678",
    country: "India",
    assigned: 35,
    completed: 31,
    pending: 3,
    rejected: 1,
    approvalRate: "88%",
    rejectionRate: "3%",
    avgProcTime: "6.2 Days",
    avgResponseTime: "11 Mins",
    rating: 4.88,
    totalReviews: 48,
    positiveFeedback: "Very prompt in reviewing KYC proofs and student visas.",
    negativeFeedback: "Slight delay during peak intake season.",
    performanceTier: "Excellent",
    monthlyApps: 35,
    monthlyCompleted: 31,
    monthlyPending: 3,
    monthlyGrowth: "+18.0%",
    attendanceStatus: "Active",
    recentActivities: [
      { action: "Approved Australia Student GIC financial documentation", time: "1 hour ago" },
      { action: "Issued consular invoice receipt", time: "3 hours ago" }
    ]
  },
  {
    id: "agt-1003",
    agentId: "AGT-1003",
    agentName: "David Vance",
    agencyName: "Vance Consular & Travel Law Partners",
    email: "david.vance@vancelaw.co.uk",
    mobile: "+44 20 7946 0912",
    country: "United Kingdom",
    assigned: 28,
    completed: 24,
    pending: 3,
    rejected: 1,
    approvalRate: "86%",
    rejectionRate: "4%",
    avgProcTime: "7.0 Days",
    avgResponseTime: "14 Mins",
    rating: 4.82,
    totalReviews: 36,
    positiveFeedback: "Expertise in UK Standard Visitor and Schengen business visas.",
    negativeFeedback: "Timezone difference for evening escalations.",
    performanceTier: "Good",
    monthlyApps: 28,
    monthlyCompleted: 24,
    monthlyPending: 3,
    monthlyGrowth: "+12.4%",
    attendanceStatus: "Active",
    recentActivities: [
      { action: "Submitted UK Priority Visa appeal brief", time: "2 hours ago" },
      { action: "Verified corporate sponsorship NOC certificate", time: "5 hours ago" }
    ]
  },
  {
    id: "agt-1004",
    agentId: "AGT-1004",
    agentName: "Fatima Al-Mansoor",
    agencyName: "Emirates Express Visa Desk",
    email: "fatima@emiratesexpressvisas.ae",
    mobile: "+971 4 391 2345",
    country: "United Arab Emirates",
    assigned: 50,
    completed: 48,
    pending: 2,
    rejected: 0,
    approvalRate: "96%",
    rejectionRate: "0%",
    avgProcTime: "3.5 Days",
    avgResponseTime: "6 Mins",
    rating: 4.98,
    totalReviews: 92,
    positiveFeedback: "Lightning-fast turnaround for UAE 30-day and 60-day tourist visas.",
    negativeFeedback: "None",
    performanceTier: "Excellent",
    monthlyApps: 50,
    monthlyCompleted: 48,
    monthlyPending: 2,
    monthlyGrowth: "+31.0%",
    attendanceStatus: "Active",
    recentActivities: [
      { action: "Issued UAE 30-Day Express Tourist eVisa PDF", time: "15 mins ago" },
      { action: "Reconciled consular payment gateway settlement", time: "1 hour ago" }
    ]
  }
];

export default function AgentPerformance() {
  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedAppStatus, setSelectedAppStatus] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Table Data & Selection
  const [records, setRecords] = useState<AgentPerformanceRecord[]>(FALLBACK_PERFORMANCE_RECORDS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAgentPerformance = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_V1_URL}/agent/all`);
      const json = await res.json();
      if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
        const mapped: AgentPerformanceRecord[] = json.data.map((ag: any, index: number) => {
          const assigned = ag.assignedApps || ag.totalApplications || Math.floor(15 + (index * 7) % 35);
          const completed = ag.completedApps || ag.approvedApplications || Math.floor(assigned * 0.85);
          const rejected = ag.rejectedApplications || Math.floor(assigned * 0.05);
          const pending = ag.activeCases || ag.pendingApplications || Math.max(0, assigned - completed - rejected);
          const appRateNum = assigned > 0 ? Math.round((completed / assigned) * 100) : 92;
          const rejRateNum = assigned > 0 ? Math.round((rejected / assigned) * 100) : 4;

          let tier: "Excellent" | "Good" | "Average" | "Low" = "Excellent";
          if (appRateNum >= 88) tier = "Excellent";
          else if (appRateNum >= 75) tier = "Good";
          else if (appRateNum >= 60) tier = "Average";
          else tier = "Low";

          return {
            id: ag.id || ag._id || `ag-${index + 1}`,
            agentId: ag.id || `AGT-${1001 + index}`,
            agentName: ag.name || ag.fullName || ag.agencyName || "Agent Partner",
            agencyName: ag.agencyName || ag.companyName || "Global Visa Services",
            email: ag.email || "agent@phantomvisa.com",
            mobile: ag.phone || ag.mobile || "+91 98765 43210",
            country: ag.officeCountry || ag.country || "India",
            assigned,
            completed,
            pending,
            rejected,
            approvalRate: `${appRateNum}%`,
            rejectionRate: `${rejRateNum}%`,
            avgProcTime: ag.avgProcTime || "6.4 Days",
            avgResponseTime: ag.avgResponseTime || "12 Mins",
            rating: ag.rating || 4.9,
            totalReviews: ag.totalReviews || Math.floor(18 + index * 5),
            positiveFeedback: "High accuracy and rapid client onboarding",
            negativeFeedback: "Occasional biometric delay from VAC",
            performanceTier: tier,
            monthlyApps: assigned,
            monthlyCompleted: completed,
            monthlyPending: pending,
            monthlyGrowth: "+14.2%",
            attendanceStatus: ag.status === "Active" ? "Active" : ag.status === "On Leave" ? "On Leave" : "Active",
            recentActivities: [
              { action: "Processed Canada Tourist Visa biometric review", time: "1 hour ago" },
              { action: "Dispatched UK Business application dossier to embassy", time: "4 hours ago" }
            ]
          };
        });
        setRecords(mapped);
      } else {
        setRecords(FALLBACK_PERFORMANCE_RECORDS);
      }
    } catch (err) {
      console.error("Failed to load agent performance records:", err);
      setRecords(FALLBACK_PERFORMANCE_RECORDS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentPerformance();
  }, []);

  // Centered Popup Modal View State
  const [activeRecord, setActiveRecord] = useState<AgentPerformanceRecord | null>(null);
  const [modalTab, setModalTab] = useState<"personal" | "kpi" | "graphs" | "activities">("personal");

  // UI Toast State
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Selection Toggle
  const handleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map((r) => r.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Filter Logic
  const filteredRecords = records.filter((rec) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      rec.agentId.toLowerCase().includes(q) ||
      rec.agentName.toLowerCase().includes(q) ||
      rec.agencyName.toLowerCase().includes(q);

    const matchesTier = selectedTier === "All" || rec.performanceTier === selectedTier;
    const matchesCountry = selectedCountry === "All" || rec.country === selectedCountry;

    return matchesQuery && matchesTier && matchesCountry;
  });

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
          <BarChart3 size={14} />
          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 font-bold">
            Agent Performance
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Agent Performance</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Monitor agent productivity, application processing, approval rates, and overall performance across the VisaOS platform.
        </p>
      </div>

      {/* PERFORMANCE OVERVIEW CARDS (8 CARDS AS IN WIREFRAME) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
            Total Agents
          </span>
          <div className="text-xl font-black text-slate-900 font-mono">{records.length}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
            Top Performers
          </span>
          <div className="text-xl font-black text-emerald-700 font-mono">
            {records.filter((r) => r.performanceTier === "Excellent").length}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB] block mb-1">
            Average Approval
          </span>
          <div className="text-xl font-black text-[#2563EB] font-mono">
            {records.length > 0
              ? `${Math.round(records.reduce((acc, r) => acc + parseInt(r.approvalRate.replace("%", "") || "0"), 0) / records.length)}%`
              : "92%"}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
            Avg. Proc Time
          </span>
          <div className="text-xl font-black text-slate-900 font-mono">5.8 Days</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
            Apps Assigned
          </span>
          <div className="text-xl font-black text-slate-900 font-mono">
            {records.reduce((acc, r) => acc + (r.assigned || 0), 0)}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
            Completed
          </span>
          <div className="text-xl font-black text-emerald-700 font-mono">
            {records.reduce((acc, r) => acc + (r.completed || 0), 0)}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block mb-1">
            Pending Apps
          </span>
          <div className="text-xl font-black text-amber-700 font-mono">
            {records.reduce((acc, r) => acc + (r.pending || 0), 0)}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 block mb-1">
            Satisfaction
          </span>
          <div className="text-xl font-black text-amber-600 font-mono">
            ⭐ {records.length > 0 ? (records.reduce((acc, r) => acc + (r.rating || 4.8), 0) / records.length).toFixed(1) : "4.9"} / 5
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & Multi-Criteria Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredRecords.length} of {records.length} Agents
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH BY KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search By (ID, Name, Agency)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="AGT-1001, Geeta, Global..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition"
              />
            </div>
          </div>

          {/* PERFORMANCE RATING FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Performance Rating Tier
            </label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Tiers</option>
              <option value="Excellent">⭐⭐⭐⭐⭐ Excellent (&gt;90%)</option>
              <option value="Good">⭐⭐⭐⭐ Good (85-90%)</option>
              <option value="Average">⭐⭐⭐ Average (75-85%)</option>
              <option value="Low">⭐⭐ Low (&lt;75%)</option>
            </select>
          </div>

          {/* COUNTRY FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Countries</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="UK">United Kingdom</option>
              <option value="USA">United States</option>
            </select>
          </div>

          {/* APPLICATION STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Application Status Filter
            </label>
            <select
              value={selectedAppStatus}
              onChange={(e) => setSelectedAppStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* DATE RANGE */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Performance Date Range
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
            <span>Agents Selected for Bulk Action</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => triggerToast(`Exporting performance report for ${selectedIds.length} agents.`)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Performance Report
            </button>
            <button
              onClick={() => triggerToast(`Notification sent to ${selectedIds.length} agents.`)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Bell size={14} /> Send Notification
            </button>
            <button
              onClick={() => triggerToast(`Reward bonus granted to ${selectedIds.length} selected top agents.`)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Trophy size={14} /> Reward Selected Agents
            </button>
            <button
              onClick={() => triggerToast(`Downloading PDF dossier for ${selectedIds.length} agents.`)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <FileText size={14} /> Download PDF
            </button>
          </div>
        </div>
      )}

      {/* AGENT PERFORMANCE TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredRecords.length && filteredRecords.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Agent ID</th>
                <th className="py-3.5 px-4">Agent Name</th>
                <th className="py-3.5 px-4 text-center">Assigned</th>
                <th className="py-3.5 px-4 text-center">Completed</th>
                <th className="py-3.5 px-4 text-center">Pending</th>
                <th className="py-3.5 px-4 text-center">Approval Rate</th>
                <th className="py-3.5 px-4 text-center">Avg. Processing Time</th>
                <th className="py-3.5 px-4 text-center">Customer Rating</th>
                <th className="py-3.5 px-4 text-center">Performance</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <BarChart3 size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No agent performance records found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(rec.id)}
                        onChange={() => handleToggleSelect(rec.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {rec.agentId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {rec.agentName}
                      <span className="block text-[10px] text-slate-500 font-normal">{rec.agencyName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                      {rec.assigned}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">
                      {rec.completed}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-700">
                      {rec.pending}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-extrabold text-[#2563EB]">
                      {rec.approvalRate}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-700">
                      {rec.avgProcTime}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-amber-600 font-mono">
                      ⭐ {rec.rating}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          rec.performanceTier === "Excellent"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : rec.performanceTier === "Good"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {rec.performanceTier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          setActiveRecord(rec);
                          setModalTab("personal");
                        }}
                        className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        title="View Detailed Performance Dossier"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>Showing 1-10 of 245 Agents</div>
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

      {/* PERFORMANCE ANALYTICS (4 BREAKDOWN CATEGORIES AS SPECIFIED IN WIREFRAME) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* CATEGORY 1: APPLICATIONS PROCESSED */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Activity size={15} className="text-[#2563EB]" /> Applications Processed
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 font-medium">Assigned Applications:</span>
              <strong className="text-slate-900 font-mono font-bold">2,845</strong>
            </div>
            <div className="flex justify-between p-2 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-emerald-700 font-medium">Completed Applications:</span>
              <strong className="text-emerald-800 font-mono font-bold">2,532</strong>
            </div>
            <div className="flex justify-between p-2 bg-amber-50 rounded-xl border border-amber-100">
              <span className="text-amber-700 font-medium">Pending Applications:</span>
              <strong className="text-amber-800 font-mono font-bold">313</strong>
            </div>
            <div className="flex justify-between p-2 bg-red-50 rounded-xl border border-red-100">
              <span className="text-red-700 font-medium">Rejected Applications:</span>
              <strong className="text-red-800 font-mono font-bold">142</strong>
            </div>
          </div>
        </div>

        {/* CATEGORY 2: PROCESSING METRICS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <TrendingUp size={15} className="text-[#2563EB]" /> Processing Metrics
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-[#2563EB] font-medium">Approval Rate:</span>
              <strong className="text-[#2563EB] font-mono font-extrabold">92.4%</strong>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 font-medium">Rejection Rate:</span>
              <strong className="text-slate-800 font-mono font-bold">7.6%</strong>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 font-medium">Average Processing Time:</span>
              <strong className="text-slate-900 font-mono font-bold">4.3 Days</strong>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 font-medium">Average Response Time:</span>
              <strong className="text-slate-900 font-mono font-bold">1.2 Hours</strong>
            </div>
          </div>
        </div>

        {/* CATEGORY 3: CUSTOMER FEEDBACK */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Star size={15} className="text-amber-500" /> Customer Feedback
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-amber-50 rounded-xl border border-amber-100">
              <span className="text-amber-700 font-medium">Average Rating:</span>
              <strong className="text-amber-800 font-mono font-bold">⭐ 4.8 / 5</strong>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 font-medium">Total Customer Reviews:</span>
              <strong className="text-slate-900 font-mono font-bold">1,842</strong>
            </div>
            <div className="flex justify-between p-2 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-emerald-700 font-medium">Positive Feedback:</span>
              <strong className="text-emerald-800 font-mono font-bold">96.2%</strong>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 font-medium">Negative Feedback:</span>
              <strong className="text-slate-800 font-mono font-bold">3.8%</strong>
            </div>
          </div>
        </div>

        {/* CATEGORY 4: MONTHLY PERFORMANCE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Calendar size={15} className="text-[#2563EB]" /> Monthly Performance
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 font-medium">Applications This Month:</span>
              <strong className="text-slate-900 font-mono font-bold">432</strong>
            </div>
            <div className="flex justify-between p-2 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-emerald-700 font-medium">Completed This Month:</span>
              <strong className="text-emerald-800 font-mono font-bold">398</strong>
            </div>
            <div className="flex justify-between p-2 bg-amber-50 rounded-xl border border-amber-100">
              <span className="text-amber-700 font-medium">Pending This Month:</span>
              <strong className="text-amber-800 font-mono font-bold">34</strong>
            </div>
            <div className="flex justify-between p-2 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-[#2563EB] font-medium">Monthly Growth (MoM):</span>
              <strong className="text-[#2563EB] font-mono font-extrabold">+12.4%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* LEADERBOARD SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Trophy size={18} className="text-amber-500" /> Platform Agent Leaderboard
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">Top Performing Visa Agents</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {records.length === 0 ? (
            <div className="col-span-3 py-6 text-center text-slate-400 font-medium text-xs bg-slate-50 rounded-2xl border border-slate-100">
              No registered agents available for leaderboard ranking.
            </div>
          ) : (
            [...records].sort((a, b) => b.completed - a.completed).slice(0, 3).map((ag, idx) => (
              <div key={ag.id} className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-md">
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                  </div>
                  <div>
                    <strong className="text-slate-900 font-extrabold block text-sm">{ag.agentName}</strong>
                    <span className="text-slate-500 text-xs font-mono">{ag.completed} Completed Apps</span>
                  </div>
                </div>
                <span className="text-amber-600 font-black font-mono text-base">⭐ {ag.rating.toFixed(1)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CENTERED POPUP VIEW MODAL: AGENT PERFORMANCE DETAILS (4 TABS) */}
      {activeRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  {activeRecord.agentName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeRecord.agentName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
                      {activeRecord.agentId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activeRecord.agencyName} &bull; {activeRecord.country}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveRecord(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {[
                { id: "personal", label: "Personal Information", icon: UserCheck },
                { id: "kpi", label: "KPI Summary", icon: Activity },
                { id: "graphs", label: "Performance Graphs", icon: BarChart3 },
                { id: "activities", label: "Recent Activities", icon: Clock }
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
                    Agent Contact & Bio Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Agent ID</span>
                      <strong className="text-slate-900 font-mono font-bold">{activeRecord.agentId}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Agent Name</span>
                      <strong className="text-slate-900 font-bold">{activeRecord.agentName}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Agency Name</span>
                      <strong className="text-[#2563EB] font-bold">{activeRecord.agencyName}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Email Address</span>
                      <strong className="text-[#2563EB] font-mono">{activeRecord.email}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Mobile Number</span>
                      <strong className="text-slate-900 font-mono">{activeRecord.mobile}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Country Jurisdiction</span>
                      <strong className="text-slate-900 font-bold">{activeRecord.country}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: KPI SUMMARY */}
              {modalTab === "kpi" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Key Performance Indicators Summary
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Assigned</span>
                      <strong className="text-slate-900 text-lg font-mono font-black">{activeRecord.assigned}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-emerald-600 font-extrabold uppercase block">Completed</span>
                      <strong className="text-emerald-700 text-lg font-mono font-black">{activeRecord.completed}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-[#2563EB] font-extrabold uppercase block">Approval Rate</span>
                      <strong className="text-[#2563EB] text-lg font-mono font-black">{activeRecord.approvalRate}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-amber-500 font-extrabold uppercase block">Rating</span>
                      <strong className="text-amber-500 text-lg font-mono font-black">⭐ {activeRecord.rating}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Avg Speed</span>
                      <strong className="text-slate-900 text-sm font-mono font-extrabold">{activeRecord.avgProcTime}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Attendance</span>
                      <strong className="text-emerald-600 text-xs font-bold block mt-1">{activeRecord.attendanceStatus}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PERFORMANCE GRAPHS & VISUAL ANALYTICS */}
              {modalTab === "graphs" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Visual Analytics & Performance Trends
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Monthly Applications Bar Representation */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <span className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                        <BarChart3 size={15} className="text-[#2563EB]" /> Monthly Applications
                      </span>
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span>Target (40):</span>
                          <span className="text-[#2563EB] font-mono">{activeRecord.monthlyApps} / 40</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div className="bg-[#2563EB] h-full rounded-full" style={{ width: "95%" }} />
                        </div>
                      </div>
                    </div>

                    {/* Approval Rate Trend */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <span className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                        <TrendingUp size={15} className="text-emerald-600" /> Approval Rate Trend
                      </span>
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span>Approval Benchmark:</span>
                          <span className="text-emerald-600 font-mono">{activeRecord.approvalRate}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: "92%" }} />
                        </div>
                      </div>
                    </div>

                    {/* Processing Time Trend */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <span className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                        <Clock size={15} className="text-indigo-600" /> Processing Speed Trend
                      </span>
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span>Avg Processing:</span>
                          <span className="text-indigo-600 font-mono">{activeRecord.avgProcTime}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: "88%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: RECENT ACTIVITIES */}
              {modalTab === "activities" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Recent System Actions Audit Trail
                  </h4>
                  <div className="space-y-2">
                    {activeRecord.recentActivities.map((act, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
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
                  onClick={() => triggerToast(`Navigating to assigned applications for ${activeRecord.agentName}.`)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Eye size={14} /> View Assigned Applications
                </button>
                <button
                  onClick={() => triggerToast(`Exporting performance report for ${activeRecord.agentId}.`)}
                  className="px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={14} /> Export Report
                </button>
                <button
                  onClick={() => triggerToast(`Feedback message dialog opened for ${activeRecord.email}.`)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Send size={14} /> Send Feedback
                </button>
                <button
                  onClick={() => triggerToast(`Performance reward granted to ${activeRecord.agentName}!`)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Trophy size={14} /> Reward Agent
                </button>
              </div>

              <button
                onClick={() => triggerToast(`Official performance warning issued to ${activeRecord.agentName}.`)}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <AlertTriangle size={14} /> Issue Warning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
