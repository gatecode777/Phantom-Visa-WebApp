import React, { useState } from "react";
import {
  Briefcase,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  PlusCircle,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe,
  Download,
  Check,
  X,
  TrendingUp,
  Sparkles,
  User,
  Building,
  Clock,
  Send,
  Printer,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Tag,
  CheckSquare,
  AlertTriangle,
  FileSpreadsheet,
  PieChart,
  Calendar,
  DollarSign,
  Users,
  Layers,
  Zap,
  Award,
  BarChart3,
  Star,
  Trophy
} from "lucide-react";

export interface AgentPerformanceRow {
  agentId: string;
  agentName: string;
  contactPerson: string;
  applications: number;
  approved: number;
  rejected: number;
  approvalRate: string;
  revenue: string;
  rating: number;
}

export const AGENT_REPORT_WORKFLOW = [
  "Agent Registration",
  "Applications Submitted",
  "Decisions Recorded",
  "Performance Calculated",
  "Report Generated",
  "Analytics & Insights Produced"
];

export const AGENT_REPORT_FEATURES = [
  "Real-time Performance Tracking",
  "Agent Volume Analysis",
  "Approval Rate Metrics",
  "Average Processing Time",
  "Revenue Generated",
  "Commission Earned",
  "Customer Satisfaction Rating",
  "Response Time",
  "Leaderboards",
  "Export Reports"
];

const MOCK_AGENT_PERFORMANCE: AgentPerformanceRow[] = [
  { agentId: "AG-1001", agentName: "Apex Travels", contactPerson: "Rahul Verma", applications: 580, approved: 540, rejected: 22, approvalRate: "93.1%", revenue: "₹48.50 L", rating: 4.9 },
  { agentId: "AG-1002", agentName: "Global Visas", contactPerson: "Priya Shah", applications: 420, approved: 385, rejected: 18, approvalRate: "91.6%", revenue: "₹36.20 L", rating: 4.8 },
  { agentId: "AG-1003", agentName: "Sun Travel", contactPerson: "Amit Kumar", applications: 310, approved: 280, rejected: 12, approvalRate: "90.3%", revenue: "₹25.80 L", rating: 4.7 },
  { agentId: "AG-1004", agentName: "Fast Track Visas", contactPerson: "Suresh Menon", applications: 290, approved: 265, rejected: 10, approvalRate: "91.4%", revenue: "₹22.10 L", rating: 4.9 },
  { agentId: "AG-1005", agentName: "Jet Airways B2B", contactPerson: "Kavita Rao", applications: 240, approved: 215, rejected: 14, approvalRate: "89.5%", revenue: "₹18.40 L", rating: 4.6 }
];

export default function AgentPerformanceReportsManagement() {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All Countries");
  const [territoryFilter, setTerritoryFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [reportFormat, setReportFormat] = useState("PDF");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredAgents = MOCK_AGENT_PERFORMANCE.filter((agent) => {
    const q = searchQuery.toLowerCase();
    return (
      agent.agentId.toLowerCase().includes(q) ||
      agent.agentName.toLowerCase().includes(q) ||
      agent.contactPerson.toLowerCase().includes(q)
    );
  });

  const handleGenerateReport = () => {
    triggerToast(`Generated Agent Performance Report (${dateRange}).`);
  };

  const handleExportFormat = (fmt: string) => {
    triggerToast(`Exported agent performance report in ${fmt} format.`);
  };

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
            <Briefcase size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Dashboard Reports &bull; B2B Partner & Agent Performance Hub
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
            onClick={() => handleExportFormat("PDF")}
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Download size={15} /> Download PDF
          </button>
          <button
            onClick={() => handleExportFormat("Excel")}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <FileSpreadsheet size={15} /> Export Excel
          </button>
        </div>
      </div>

      {/* TOP METRICS DASHBOARD (8 CARDS MATCHING WIREFRAME EXACTLY) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-slate-500 block mb-1">Total Agents</span>
          <div className="text-xl font-black text-slate-900 font-mono">420</div>
          <span className="text-[9px] text-[#2563EB] font-bold">Registered B2B</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-emerald-600 block mb-1">Active Agents</span>
          <div className="text-xl font-black text-slate-900 font-mono">380</div>
          <span className="text-[9px] text-emerald-600 font-bold">Submitting Cases</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-blue-600 block mb-1">Submissions</span>
          <div className="text-xl font-black text-slate-900 font-mono">15,840</div>
          <span className="text-[9px] text-blue-600 font-bold">Total Cases</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-teal-600 block mb-1">Approval Rate</span>
          <div className="text-xl font-black text-slate-900 font-mono">92.4%</div>
          <span className="text-[9px] text-teal-600 font-bold">Agent Success</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-purple-600 block mb-1">Agent Revenue</span>
          <div className="text-xl font-black text-slate-900 font-mono">₹2.45 Cr</div>
          <span className="text-[9px] text-purple-600 font-bold">Gross Volume</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-amber-600 block mb-1">Avg Processing</span>
          <div className="text-xl font-black text-slate-900 font-mono">7.2 Days</div>
          <span className="text-[9px] text-amber-600 font-bold">Turnaround Time</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-indigo-600 block mb-1">Commissions</span>
          <div className="text-xl font-black text-slate-900 font-mono">₹18.50 L</div>
          <span className="text-[9px] text-indigo-600 font-bold">Paid Payouts</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-amber-500 block mb-1">Avg Rating</span>
          <div className="text-xl font-black text-slate-900 font-mono">4.8 / 5.0</div>
          <span className="text-[9px] text-amber-600 font-bold">CSAT Rating</span>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & Agent Performance Filters
          </h3>
          <button
            onClick={handleGenerateReport}
            className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <BarChart3 size={15} /> Generate Report
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (Agent ID, Name, Contact)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="AG-1001, Apex Travels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* PERFORMANCE TIER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Performance Tier
            </label>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Tiers</option>
              <option value="Top Performer">Top Performer</option>
              <option value="High Volume">High Volume</option>
              <option value="Average">Average</option>
              <option value="Low Volume">Low Volume</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>

          {/* AGENT STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Agent Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending Approval">Pending Approval</option>
            </select>
          </div>

          {/* TERRITORY / CITY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Territory / Region
            </label>
            <select
              value={territoryFilter}
              onChange={(e) => setTerritoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Regions</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Punjab">Punjab</option>
              <option value="Abroad">Abroad</option>
            </select>
          </div>

          {/* DATE RANGE */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* CHARTS & TOP PERFORMERS SECTION (MATCHING WIREFRAME) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* TOP PERFORMING AGENTS RANKING */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5">
                <Trophy size={15} className="text-amber-500" /> Leaderboard Rankings
              </h4>
              <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">Top Agents</span>
            </div>
            <div className="space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex justify-between items-center bg-amber-50/60 p-2 rounded-xl border border-amber-200">
                <span>Top Agent by Revenue:</span>
                <strong className="font-bold text-slate-900">Apex Travels (₹48.5L)</strong>
              </div>
              <div className="flex justify-between items-center bg-blue-50/60 p-2 rounded-xl border border-blue-200">
                <span>Top Agent by Volume:</span>
                <strong className="font-bold text-slate-900">Global Visas (420)</strong>
              </div>
              <div className="flex justify-between items-center bg-emerald-50/60 p-2 rounded-xl border border-emerald-200">
                <span>Top Approval Rate:</span>
                <strong className="font-bold text-slate-900">Sun Travel (90.3%)</strong>
              </div>
              <div className="flex justify-between items-center bg-purple-50/60 p-2 rounded-xl border border-purple-200">
                <span>Top Rated Agent:</span>
                <strong className="font-bold text-slate-900">Fast Track (4.9 ★)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* AGENT PERFORMANCE TABLE */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
            <Briefcase size={16} className="text-[#2563EB]" /> Agent Performance Breakdown
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                  <th className="pb-2">Agent ID</th>
                  <th className="pb-2">Agent Name</th>
                  <th className="pb-2 text-center">Submissions</th>
                  <th className="pb-2 text-center text-emerald-600">Approved</th>
                  <th className="pb-2 text-center text-red-600">Rejected</th>
                  <th className="pb-2 text-center font-mono">Success %</th>
                  <th className="pb-2 text-right">Revenue</th>
                  <th className="pb-2 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredAgents.map((ag) => (
                  <tr key={ag.agentId} className="hover:bg-slate-50">
                    <td className="py-2 font-mono font-bold text-slate-900">{ag.agentId}</td>
                    <td className="py-2 font-bold text-slate-800">
                      {ag.agentName}
                      <span className="block text-[10px] text-slate-400 font-normal">({ag.contactPerson})</span>
                    </td>
                    <td className="py-2 text-center font-mono font-bold">{ag.applications}</td>
                    <td className="py-2 text-center font-mono font-bold text-emerald-700">{ag.approved}</td>
                    <td className="py-2 text-center font-mono font-bold text-red-700">{ag.rejected}</td>
                    <td className="py-2 text-center font-mono font-bold text-blue-700">{ag.approvalRate}</td>
                    <td className="py-2 text-right font-mono font-bold text-emerald-800">{ag.revenue}</td>
                    <td className="py-2 text-center font-bold text-amber-600">⭐ {ag.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* WORKFLOW & PROFESSIONAL FEATURES CATALOG (MATCHING WIREFRAME) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-[#2563EB]" /> Report Generation Workflow & Features
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <span className="font-bold text-slate-900 block mb-2">Workflow Pipeline:</span>
            <div className="space-y-1 text-slate-700">
              {AGENT_REPORT_WORKFLOW.map((wf, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 font-bold text-[9px] flex items-center justify-center">▼</span>
                  <span>{wf}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="font-bold text-slate-900 block mb-2">Professional Features:</span>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              {AGENT_REPORT_FEATURES.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1 text-slate-700">
                  <Check size={11} className="text-[#2563EB]" /> {feat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PROFESSIONAL RECOMMENDATION BOX (FROM WIREFRAME) */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2 mb-6">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
          <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Recommendation
        </h3>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          The Agent Performance page provides comprehensive B2B partner analytics. Track agent submission volume, approval rates, average processing time, revenue contribution, commission payouts, customer ratings, leaderboard rankings, and export detailed agent audit reports in PDF, Excel, and CSV formats.
        </p>
      </div>
    </div>
  );
}
