import React, { useState, useMemo } from "react";
import {
  BarChart3,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Printer,
  Sparkles,
  TrendingUp,
  FileText,
  Building,
  User,
  Users,
  ShieldCheck,
  Globe,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle
} from "lucide-react";
import { useReportAnalytics } from "../hooks/useReportAnalytics";
import { useVisa } from "../context/VisaContext";

export interface DailyReportOfficerRecord {
  id: string;
  officerId: string;
  officerName: string;
  role: string;
  assignedCount: number;
  processedCount: number;
  approvedCount: number;
  rejectedCount: number;
  approvalRate: number;
  avgProcessingTimeMins: number;
  status: "Target Achieved" | "On Track" | "Pending Queue";
}

export interface DailyCountryStat {
  country: string;
  flag: string;
  applicationsCount: number;
  revenue: number;
  approvalRate: number;
}

export default function DailyReportsManagement() {
  const { data: liveData, loading, refresh, formatINR } = useReportAnalytics();
  const { applications } = useVisa();

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [datePreset, setDatePreset] = useState("Today");
  const [searchQuery, setSearchQuery] = useState("");
  const [officerList] = useState<DailyReportOfficerRecord[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState<DailyReportOfficerRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Compute live daily metrics from live applications & analytics
  const todayStr = new Date().toISOString().split("T")[0];
  const appsToday = useMemo(() => {
    return applications.filter((a) => a.submissionDate === todayStr);
  }, [applications, todayStr]);

  const totalAppsToday = appsToday.length > 0 ? appsToday.length : (liveData?.totalApplications || 0);
  const approvedToday = appsToday.filter((a) => a.status === "Approved").length || (liveData?.approvedApplications || 0);
  const pendingToday = appsToday.filter((a) => a.status === "Submitted" || a.status === "Under Review" || a.status === "Docs Pending").length || (liveData?.pendingApplications || 0);
  const rejectedToday = appsToday.filter((a) => a.status === "Rejected").length || (liveData?.rejectedApplications || 0);
  const revenueToday = liveData ? formatINR(liveData.totalRevenue) : "₹0";

  const approvalRateToday = totalAppsToday > 0
    ? ((approvedToday / totalAppsToday) * 100).toFixed(1)
    : "0.0";

  const approvedPct = totalAppsToday > 0 ? ((approvedToday / totalAppsToday) * 100).toFixed(1) : "0.0";
  const pendingPct = totalAppsToday > 0 ? ((pendingToday / totalAppsToday) * 100).toFixed(1) : "0.0";
  const rejectedPct = totalAppsToday > 0 ? ((rejectedToday / totalAppsToday) * 100).toFixed(1) : "0.0";

  // Destinations Breakdown
  const countryBreakdown = liveData?.countryBreakdown || [];

  const filteredOfficers = officerList.filter(
    (off) =>
      off.officerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      off.officerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      off.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* HEADER SECTION WITH PRESETS & EXPORT BUTTONS */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-6 rounded-3xl shadow-xl mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-blue-700">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-200 mb-1">
            <BarChart3 size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold flex items-center gap-1.5">
              Operations &amp; Performance Analytics
              {loading && <span className="w-2 h-2 rounded-full bg-blue-300 animate-ping" />}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Daily Report &amp; Operations
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Executive daily summary of visa applications submitted, processed, approved, revenue generated, and officer workloads.
          </p>
        </div>

        {/* DATE PRESETS & EXPORT CONTROLS */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white/10 border border-white/20 backdrop-blur-md p-1.5 rounded-2xl flex items-center gap-1">
            {["Today", "Yesterday", "Last 7 Days", "This Month"].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setDatePreset(preset);
                  triggerToast(`Loaded daily report for ${preset}`);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  datePreset === preset
                    ? "bg-white text-[#2563EB] shadow-md"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          <button
            onClick={() => refresh()}
            className="bg-white/10 hover:bg-white/20 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition border border-white/20"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button
            onClick={() => triggerToast("Exporting Daily Executive PDF Report...")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
          >
            <Download size={14} /> Export PDF Report
          </button>
        </div>
      </div>

      {/* EXECUTIVE STATISTICS CARDS (4 METRICS DYNAMICALLY CALCULATED) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* CARD 1: RECEIVED TODAY */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              Applications Received
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
              <FileText size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{totalAppsToday}</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-blue-600 mt-2">
            <span>{totalAppsToday} Cases Recorded</span>
          </div>
        </div>

        {/* CARD 2: VISAS APPROVED */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
              Visas Approved
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{approvedToday}</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 mt-2">
            <TrendingUp size={14} /> {approvalRateToday}% Approval Rate
          </div>
        </div>

        {/* CARD 3: REVENUE GENERATED */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{revenueToday}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mt-2">
            Visa Fees &amp; Service Charges
          </div>
        </div>

        {/* CARD 4: PENDING PROCESSING QUEUE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
              Pending Processing
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{pendingToday}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-2">
            Active Processing Queue
          </div>
        </div>
      </div>

      {/* DASHBOARD MIDDLE SECTION: DECISIONS BREAKDOWN & TOP DESTINATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* DAILY DECISIONS BREAKDOWN */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles size={16} className="text-[#2563EB]" /> Decisions Breakdown
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Approved Visas ({approvedToday})</span>
                <span className="text-emerald-600">{approvedPct}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${approvedPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Under Review / Pending ({pendingToday})</span>
                <span className="text-blue-600">{pendingPct}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${pendingPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Rejected Applications ({rejectedToday})</span>
                <span className="text-red-600">{rejectedPct}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-red-500 h-3 rounded-full" style={{ width: `${rejectedPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* TOP DESTINATION COUNTRIES */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe size={16} className="text-[#2563EB]" /> Destination Breakdown
          </h3>

          <div className="space-y-3">
            {countryBreakdown.length === 0 ? (
              <div className="py-8 text-center text-slate-400 font-medium text-xs">
                No destination country applications recorded in database.
              </div>
            ) : (
              countryBreakdown.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌐</span>
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">{c.country}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{c.applications} Applications</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 font-mono block">₹{c.revenue.toLocaleString()}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">{c.approvalRate} Approval</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* OFFICER WORKLOAD & PERFORMANCE TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-outfit flex items-center gap-2">
              <Users size={16} className="text-[#2563EB]" /> Officer &amp; Agent Workload Report
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Daily processing efficiency, approvals, and queue breakdown per officer
            </span>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search officer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs pl-9 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-[#2563EB] w-56 font-semibold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-500 bg-slate-50/50">
                <th className="py-3 px-4">Officer Name &amp; Role</th>
                <th className="py-3 px-4">Assigned</th>
                <th className="py-3 px-4">Processed</th>
                <th className="py-3 px-4">Approved</th>
                <th className="py-3 px-4">Approval Rate</th>
                <th className="py-3 px-4">Avg Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOfficers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-medium">
                    No officer performance records logged for this period.
                  </td>
                </tr>
              ) : (
                filteredOfficers.map((off) => (
                  <tr key={off.id} className="hover:bg-blue-50/30 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-[#0E1A2C] block">{off.officerName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{off.officerId} &bull; {off.role}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{off.assignedCount}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{off.processedCount}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{off.approvedCount}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{off.approvalRate}%</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{off.avgProcessingTimeMins} mins</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          off.status === "Target Achieved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : off.status === "On Track"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {off.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedOfficer(off)}
                        className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        title="View Officer Performance Details"
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
      </div>
    </div>
  );
}
