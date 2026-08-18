import React, { useState } from "react";
import {
  Tag,
  Search,
  Filter,
  CheckCircle2,
  Globe,
  Download,
  FileSpreadsheet,
  BarChart3,
  Trophy,
  RefreshCw,
} from "lucide-react";
import { useReportAnalytics } from "../hooks/useReportAnalytics";

export default function VisaTypeReportsManagement() {
  const { data: liveData, loading, refresh, formatINR } = useReportAnalytics();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All Countries");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Visa icon helper
  const getVisaIcon = (name: string) => {
    const l = name.toLowerCase();
    if (l.includes("tourist") || l.includes("visitor")) return "🧳";
    if (l.includes("business")) return "💼";
    if (l.includes("student") || l.includes("study")) return "🎓";
    if (l.includes("work") || l.includes("employment")) return "👷";
    if (l.includes("medical")) return "🏥";
    return "📄";
  };

  // Dynamic visa list (zero fallback when database is empty)
  const visaList = liveData && liveData.visaTypeBreakdown.length > 0
    ? liveData.visaTypeBreakdown.map((v) => ({
        icon: getVisaIcon(v.visaType),
        visaType: v.visaType,
        applications: v.applications,
        approved: v.approved,
        rejected: v.rejected,
        pending: v.pending,
        revenue: formatINR(v.revenue),
        revenueRaw: v.revenue,
        approvalRate: v.approvalRate,
        avgProcessing: "6 Days",
      }))
    : [];

  const filteredTypes = visaList.filter((v) =>
    v.visaType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalApps = liveData ? liveData.totalApplications : 0;
  const totalRevenue = liveData ? formatINR(liveData.totalRevenue) : "₹0";

  const topDemandVisa = [...visaList].sort((a, b) => b.applications - a.applications)[0] || { icon: "📄", visaType: "None", applications: 0 };
  const topRevenueVisa = [...visaList].sort((a, b) => b.revenueRaw - a.revenueRaw)[0] || { icon: "📄", visaType: "None", revenue: "₹0" };
  const highestApprovalVisa = [...visaList].sort((a, b) => parseFloat(b.approvalRate) - parseFloat(a.approvalRate))[0] || { icon: "📄", visaType: "None", approvalRate: "0.0%" };

  const handleGenerateReport = () =>
    triggerToast(`Generated Visa Type Report for ${categoryFilter} (${dateRange}).`);
  const handleExportFormat = (fmt: string) =>
    triggerToast(`Exported visa type report in ${fmt} format.`);

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* TOAST */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-6 rounded-3xl shadow-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-700">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-200 mb-1">
            <Tag size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold flex items-center gap-1.5">
              Dashboard Reports &bull; Visa Categories &amp; Subclass Analytics
              {loading && <span className="w-2 h-2 rounded-full bg-blue-300 animate-ping" />}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Visa Type Reports
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Track and analyze visa subclass performance, approvals, rejection patterns, and revenue per visa category.
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
            onClick={() => handleExportFormat("PDF")}
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Download size={15} /> Export PDF
          </button>
          <button
            onClick={() => handleExportFormat("Excel")}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <FileSpreadsheet size={15} /> Export Excel
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Visa Types</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{visaList.length}</div>
          <span className="text-[10px] text-slate-500 font-bold">Configured Types</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Submissions</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalApps.toLocaleString()}</div>
          <span className="text-[10px] text-blue-600 font-bold">All Visa Applications</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Visa Revenue</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalRevenue}</div>
          <span className="text-[10px] text-emerald-600 font-bold">Gross Earnings</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Top Demand Type</span>
          <div className="text-2xl font-black text-slate-900 font-mono truncate">{topDemandVisa.visaType}</div>
          <span className="text-[10px] text-purple-600 font-bold">{topDemandVisa.applications.toLocaleString()} Applications</span>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Visa Type Performance Filters
          </h3>
          <button
            onClick={handleGenerateReport}
            className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <BarChart3 size={14} /> Filter Reports
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Search Visa Type</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-8 pr-3 py-2 rounded-xl"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Category</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold">
              <option value="All">All Categories</option><option>Tourist</option><option>Business</option>
              <option>Student</option><option>Work</option><option>Medical</option><option>Transit</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Country Filter</label>
            <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold">
              <option value="All Countries">All Countries</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Source</label>
            <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold">
              <option value="All">All Sources</option><option>Direct Applicant</option><option>Agent</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Date Range</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold">
              <option>Today</option><option>Yesterday</option><option>Last 7 Days</option>
              <option>Last 30 Days</option><option>This Month</option><option>This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* LEADERBOARD + PERFORMANCE TABLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Category Leaderboard */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5">
                <Trophy size={15} className="text-amber-500" /> Category Leaderboard
              </h4>
              <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">Top Demand</span>
            </div>
            <div className="space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex justify-between items-center bg-blue-50/60 p-2 rounded-xl border border-blue-200">
                <span>Highest Volume:</span>
                <strong className="font-bold text-slate-900">{topDemandVisa.icon} {topDemandVisa.visaType} ({topDemandVisa.applications.toLocaleString()})</strong>
              </div>
              <div className="flex justify-between items-center bg-purple-50/60 p-2 rounded-xl border border-purple-200">
                <span>Highest Revenue:</span>
                <strong className="font-bold text-slate-900">{topRevenueVisa.icon} {topRevenueVisa.visaType} ({topRevenueVisa.revenue})</strong>
              </div>
              <div className="flex justify-between items-center bg-emerald-50/60 p-2 rounded-xl border border-emerald-200">
                <span>Highest Approval Rate:</span>
                <strong className="font-bold text-slate-900">{highestApprovalVisa.icon} {highestApprovalVisa.visaType} ({highestApprovalVisa.approvalRate})</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Visa Type Performance Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
            <Tag size={16} className="text-[#2563EB]" /> Visa Type Performance Breakdown
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                  <th className="pb-2">Visa Type</th>
                  <th className="pb-2 text-center">Applications</th>
                  <th className="pb-2 text-center text-emerald-600">Approved</th>
                  <th className="pb-2 text-center text-red-600">Rejected</th>
                  <th className="pb-2 text-center text-amber-600">Pending</th>
                  <th className="pb-2 text-right">Revenue</th>
                  <th className="pb-2 text-center">Approval %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTypes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                      No visa type performance records found in database.
                    </td>
                  </tr>
                ) : (
                  filteredTypes.map((v, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 font-bold text-slate-800 flex items-center gap-1.5">
                        <span>{v.icon}</span><span>{v.visaType}</span>
                      </td>
                      <td className="py-2 text-center font-mono font-bold text-slate-900">{v.applications.toLocaleString()}</td>
                      <td className="py-2 text-center font-mono font-bold text-emerald-700">{v.approved.toLocaleString()}</td>
                      <td className="py-2 text-center font-mono font-bold text-red-700">{v.rejected.toLocaleString()}</td>
                      <td className="py-2 text-center font-mono font-bold text-amber-700">{v.pending.toLocaleString()}</td>
                      <td className="py-2 text-right font-mono font-bold text-blue-700">{v.revenue}</td>
                      <td className="py-2 text-center font-mono font-bold text-emerald-800">{v.approvalRate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
