import React, { useState, useMemo } from "react";
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  BarChart3,
  Trophy,
  RefreshCw,
  Eye,
  DollarSign,
  TrendingUp,
  Star,
  Users,
  ShieldCheck,
  Building
} from "lucide-react";
import { useReportAnalytics } from "../hooks/useReportAnalytics";
import { useVisa } from "../context/VisaContext";

export interface AgentPerformanceRow {
  agentId: string;
  agentName: string;
  contactPerson: string;
  region: string;
  applicationsSubmitted: number;
  approved: number;
  rejected: number;
  pending: number;
  revenue: number;
  approvalRate: number;
  status: "Active" | "Inactive" | "Under Review";
}

export default function AgentPerformanceReportsManagement() {
  const { data: liveData, loading, refresh, formatINR } = useReportAnalytics();
  const { agents } = useVisa();

  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [selectedAgent, setSelectedAgent] = useState<AgentPerformanceRow | null>(null);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const agentRows: AgentPerformanceRow[] = useMemo(() => {
    return (agents || []).map((ag: any, index: number) => ({
      agentId: ag.id || `AG-${1001 + index}`,
      agentName: ag.name || ag.agencyName || "Agent Partner",
      contactPerson: ag.contactPerson || ag.email || "",
      region: ag.region || "India",
      applicationsSubmitted: ag.totalApplications || 0,
      approved: ag.approvedApplications || 0,
      rejected: ag.rejectedApplications || 0,
      pending: ag.pendingApplications || 0,
      revenue: ag.totalRevenue || 0,
      approvalRate: ag.totalApplications > 0 ? Math.round((ag.approvedApplications / ag.totalApplications) * 100) : 0,
      status: ag.status || "Active"
    }));
  }, [agents]);

  const filteredAgents = agentRows.filter((agent) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      agent.agentId.toLowerCase().includes(q) ||
      agent.agentName.toLowerCase().includes(q) ||
      agent.contactPerson.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAgents = agentRows.length;
  const activeAgents = agentRows.filter((a) => a.status === "Active").length;
  const totalSubmissions = liveData ? liveData.totalApplications : 0;
  const approvalRate = liveData && totalSubmissions > 0 ? `${liveData.approvalRate.toFixed(1)}%` : "0.0%";
  const agentRevenue = liveData ? formatINR(liveData.totalRevenue) : "₹0";

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
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
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-6 rounded-3xl shadow-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-700">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-200 mb-1">
            <Briefcase size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Dashboard Reports &bull; B2B Partner &amp; Agent Performance Hub
              {loading && <span className="w-2 h-2 rounded-full bg-blue-300 animate-ping" />}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Agent Performance Reports
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Track and analyze performance metrics, revenue, and approval rates of all registered B2B visa agents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refresh()}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button
            onClick={() => triggerToast("Exporting Agent Performance PDF Report...")}
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Download size={15} /> Download PDF
          </button>
          <button
            onClick={() => triggerToast("Exporting Agent Performance Excel Report...")}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <FileSpreadsheet size={15} /> Export Excel
          </button>
        </div>
      </div>

      {/* TOP METRICS DASHBOARD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Agents</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalAgents}</div>
          <span className="text-[10px] text-[#2563EB] font-bold">Registered B2B</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Active Agents</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{activeAgents}</div>
          <span className="text-[10px] text-emerald-600 font-bold">Currently Active</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Total Submissions</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalSubmissions.toLocaleString()}</div>
          <span className="text-[10px] text-blue-600 font-bold">Application Cases</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Platform Revenue</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{agentRevenue}</div>
          <span className="text-[10px] text-purple-600 font-bold">Gross Volume</span>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search &amp; Agent Performance Filters
          </h3>
          <button
            onClick={() => triggerToast(`Filtered agents for ${dateRange}`)}
            className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <BarChart3 size={15} /> Filter Reports
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search Agent
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search agent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
            >
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* PERFORMANCE TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
          <Briefcase size={16} className="text-[#2563EB]" /> Agent Performance Breakdown
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                <th className="pb-2">Agent ID &amp; Name</th>
                <th className="pb-2">Contact Person</th>
                <th className="pb-2 text-center">Submissions</th>
                <th className="pb-2 text-center text-emerald-600">Approved</th>
                <th className="pb-2 text-center text-red-600">Rejected</th>
                <th className="pb-2 text-center text-amber-600">Pending</th>
                <th className="pb-2 text-right">Revenue</th>
                <th className="pb-2 text-center">Approval Rate</th>
                <th className="pb-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-medium">
                    No agent performance records found in database.
                  </td>
                </tr>
              ) : (
                filteredAgents.map((ag) => (
                  <tr key={ag.agentId} className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold text-slate-800">
                      <div>{ag.agentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{ag.agentId}</div>
                    </td>
                    <td className="py-2.5 text-slate-600">{ag.contactPerson || "—"}</td>
                    <td className="py-2.5 text-center font-mono font-bold text-slate-900">{ag.applicationsSubmitted}</td>
                    <td className="py-2.5 text-center font-mono font-bold text-emerald-700">{ag.approved}</td>
                    <td className="py-2.5 text-center font-mono font-bold text-red-700">{ag.rejected}</td>
                    <td className="py-2.5 text-center font-mono font-bold text-amber-700">{ag.pending}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-blue-700">₹{ag.revenue.toLocaleString()}</td>
                    <td className="py-2.5 text-center font-mono font-bold text-emerald-800">{ag.approvalRate}%</td>
                    <td className="py-2.5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          ag.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {ag.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
