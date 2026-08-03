import React, { useState } from "react";
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
  Layers,
  Sparkles
} from "lucide-react";

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

const MOCK_PERFORMANCE_RECORDS: AgentPerformanceRecord[] = [
  {
    id: "1",
    agentId: "AGT-1001",
    agentName: "Geeta Bisht",
    agencyName: "Global Visa Services",
    email: "geeta.bisht@globalvisa.com",
    mobile: "+91 98765 43210",
    country: "Canada",
    assigned: 120,
    completed: 112,
    pending: 8,
    rejected: 5,
    approvalRate: "93.3%",
    rejectionRate: "4.2%",
    avgProcTime: "3.8 Days",
    avgResponseTime: "0.8 Hours",
    rating: 4.9,
    totalReviews: 142,
    positiveFeedback: "98.5%",
    negativeFeedback: "1.5%",
    performanceTier: "Excellent",
    monthlyApps: 45,
    monthlyCompleted: 42,
    monthlyPending: 3,
    monthlyGrowth: "+15.2%",
    attendanceStatus: "Active",
    recentActivities: [
      { action: "Reviewed Visa Application for APP-1030", time: "10 mins ago" },
      { action: "Approved Documents for Canada Express Permit", time: "45 mins ago" },
      { action: "Scheduled VFS Appointment in New Delhi", time: "2 hours ago" },
      { action: "Updated Visa Status to Embassy Under Review", time: "4 hours ago" },
      { action: "Responded to Applicant Inquiry", time: "5 hours ago" }
    ]
  },
  {
    id: "2",
    agentId: "AGT-1012",
    agentName: "Rahul Sharma",
    agencyName: "Visa Experts Ltd.",
    email: "rahul.sharma@visaexperts.com",
    mobile: "+91 98123 45678",
    country: "Australia",
    assigned: 95,
    completed: 87,
    pending: 8,
    rejected: 6,
    approvalRate: "91.6%",
    rejectionRate: "6.3%",
    avgProcTime: "4.2 Days",
    avgResponseTime: "1.1 Hours",
    rating: 4.8,
    totalReviews: 118,
    positiveFeedback: "96.0%",
    negativeFeedback: "4.0%",
    performanceTier: "Good",
    monthlyApps: 38,
    monthlyCompleted: 35,
    monthlyPending: 3,
    monthlyGrowth: "+10.8%",
    attendanceStatus: "Active",
    recentActivities: [
      { action: "Approved Documents for Australia Subclass 600", time: "25 mins ago" },
      { action: "Scheduled Biometrics at VFS Mumbai", time: "1 hour ago" },
      { action: "Responded to Applicant Inquiry", time: "3 hours ago" },
      { action: "Updated Visa Status to Approved", time: "6 hours ago" }
    ]
  },
  {
    id: "3",
    agentId: "AGT-1022",
    agentName: "Balram Suman",
    agencyName: "World Travel Agency",
    email: "b.suman@worldtravel.com",
    mobile: "+91 99887 76655",
    country: "UK",
    assigned: 78,
    completed: 69,
    pending: 9,
    rejected: 8,
    approvalRate: "88.5%",
    rejectionRate: "10.2%",
    avgProcTime: "5.1 Days",
    avgResponseTime: "1.8 Hours",
    rating: 4.5,
    totalReviews: 86,
    positiveFeedback: "92.0%",
    negativeFeedback: "8.0%",
    performanceTier: "Good",
    monthlyApps: 28,
    monthlyCompleted: 24,
    monthlyPending: 4,
    monthlyGrowth: "+5.4%",
    attendanceStatus: "Active",
    recentActivities: [
      { action: "Reviewed UK Standard Visitor Visa File", time: "50 mins ago" },
      { action: "Responded to Applicant Inquiry", time: "2 hours ago" },
      { action: "Updated Visa Status to In Progress", time: "5 hours ago" }
    ]
  },
  {
    id: "4",
    agentId: "AGT-1035",
    agentName: "Pooja Verma",
    agencyName: "Apex Migration Services",
    email: "pooja.v@apexvisas.com",
    mobile: "+91 97112 23344",
    country: "USA",
    assigned: 62,
    completed: 50,
    pending: 12,
    rejected: 9,
    approvalRate: "80.6%",
    rejectionRate: "14.5%",
    avgProcTime: "6.4 Days",
    avgResponseTime: "2.4 Hours",
    rating: 3.9,
    totalReviews: 54,
    positiveFeedback: "82.0%",
    negativeFeedback: "18.0%",
    performanceTier: "Average",
    monthlyApps: 20,
    monthlyCompleted: 15,
    monthlyPending: 5,
    monthlyGrowth: "-2.1%",
    attendanceStatus: "On Leave",
    recentActivities: [
      { action: "Reviewed US B1/B2 Interview Waiver", time: "1 day ago" },
      { action: "Updated Visa Status to Additional Docs Required", time: "2 days ago" }
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
  const [records, setRecords] = useState<AgentPerformanceRecord[]>(MOCK_PERFORMANCE_RECORDS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
            <BarChart3 size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Productivity & KPI Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Agent Performance
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Monitor agent productivity, application processing, approval rates, and overall performance across the VisaOS platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedTier("All");
              setSelectedCountry("All");
              setSelectedAppStatus("All");
              triggerToast("Filters reset to default.");
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw size={14} /> Reset View
          </button>
        </div>
      </div>

      {/* PERFORMANCE OVERVIEW CARDS (8 CARDS AS IN WIREFRAME) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
            Total Agents
          </span>
          <div className="text-xl font-black text-slate-900 font-mono">245</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
            Top Performers
          </span>
          <div className="text-xl font-black text-emerald-700 font-mono">38</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB] block mb-1">
            Average Approval
          </span>
          <div className="text-xl font-black text-[#2563EB] font-mono">92.4%</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
            Avg. Proc Time
          </span>
          <div className="text-xl font-black text-slate-900 font-mono">4.3 Days</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
            Apps Assigned
          </span>
          <div className="text-xl font-black text-slate-900 font-mono">2,845</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
            Completed
          </span>
          <div className="text-xl font-black text-emerald-700 font-mono">2,532</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block mb-1">
            Pending Apps
          </span>
          <div className="text-xl font-black text-amber-700 font-mono">313</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 block mb-1">
            Satisfaction
          </span>
          <div className="text-xl font-black text-amber-600 font-mono">⭐ 4.8 / 5</div>
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
              <option value="Excellent">⭐⭐⭐⭐⭐ Excellent (&gt;90%)</option>
              <option value="Good">⭐⭐⭐⭐ Good (85-90%)</option>
              <option value="Average">⭐⭐⭐ Average (75-85%)</option>
              <option value="Low">⭐⭐ Low (&lt;75%)</option>
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
                      ⭐ {rec.rating}
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
          <div>Showing 1–10 of 245 Agents</div>
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
              <strong className="text-amber-800 font-mono font-bold">⭐ 4.8 / 5</strong>
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
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-md">
                🥇
              </div>
              <div>
                <strong className="text-slate-900 font-extrabold block text-sm">Geeta Bisht</strong>
                <span className="text-slate-500 text-xs font-mono">112 Completed Apps</span>
              </div>
            </div>
            <span className="text-amber-600 font-black font-mono text-base">⭐ 4.9</span>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-300 text-slate-700 flex items-center justify-center font-black text-lg shadow-md">
                🥈
              </div>
              <div>
                <strong className="text-slate-900 font-extrabold block text-sm">Rahul Sharma</strong>
                <span className="text-slate-500 text-xs font-mono">87 Completed Apps</span>
              </div>
            </div>
            <span className="text-slate-700 font-black font-mono text-base">⭐ 4.8</span>
          </div>

          <div className="bg-gradient-to-br from-amber-50/30 to-amber-100/30 border border-amber-200/80 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-700/20 text-amber-800 flex items-center justify-center font-black text-lg shadow-md">
                🥉
              </div>
              <div>
                <strong className="text-slate-900 font-extrabold block text-sm">Balram Suman</strong>
                <span className="text-slate-500 text-xs font-mono">69 Completed Apps</span>
              </div>
            </div>
            <span className="text-amber-700 font-black font-mono text-base">⭐ 4.5</span>
          </div>
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
                      <strong className="text-amber-500 text-lg font-mono font-black">⭐ {activeRecord.rating}</strong>
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
