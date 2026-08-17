import React, { useState } from "react";
import {
  Globe,
  Search,
  Filter,
  CheckCircle2,
  Download,
  Check,
  FileSpreadsheet,
  BarChart3,
  Trophy,
  RefreshCw,
} from "lucide-react";
import { useReportAnalytics } from "../hooks/useReportAnalytics";

export default function CountryReportsManagement() {
  const { data: liveData, loading, refresh, formatINR } = useReportAnalytics();

  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Dynamic country breakdown list (zero fallback when database is empty)
  const countryList = liveData && liveData.countryBreakdown.length > 0
    ? liveData.countryBreakdown.map((c) => ({
        country: c.country,
        applications: c.applications,
        approved: c.approved,
        rejected: c.rejected,
        pending: c.pending,
        revenue: formatINR(c.revenue),
        revenueRaw: c.revenue,
        approvalRate: c.approvalRate,
        avgProcessing: "10 Days",
      }))
    : [];

  const filteredCountries = countryList.filter((c) =>
    c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalApps = liveData ? liveData.totalApplications : 0;
  const totalRevenue = liveData ? formatINR(liveData.totalRevenue) : "₹0";
  const activeCountryCount = countryList.length;

  const topByVolume = [...countryList].sort((a, b) => b.applications - a.applications)[0] || { country: "None", applications: 0 };
  const topByRevenue = [...countryList].sort((a, b) => b.revenueRaw - a.revenueRaw)[0] || { country: "None", revenue: "₹0" };
  const highestApproval = [...countryList].sort((a, b) => parseFloat(b.approvalRate) - parseFloat(a.approvalRate))[0] || { country: "None", approvalRate: "0.0%" };

  const handleGenerateReport = () =>
    triggerToast(`Generated Country-wise Report for ${regionFilter} (${dateRange}).`);
  const handleExportFormat = (fmt: string) =>
    triggerToast(`Exported country report in ${fmt} format.`);

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
            <Globe size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold flex items-center gap-1.5">
              Dashboard Reports &bull; Destination Country Analytics Hub
              {loading && <span className="w-2 h-2 rounded-full bg-blue-300 animate-ping" />}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Country-Wise Reports
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Track and analyze visa application volumes, approval rates, and revenue generation grouped by destination countries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refresh()}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button onClick={() => handleExportFormat("PDF")} className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2">
            <Download size={15} /> Export PDF
          </button>
          <button onClick={() => handleExportFormat("Excel")} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2">
            <FileSpreadsheet size={15} /> Export Excel
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Destinations</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{activeCountryCount}</div>
          <span className="text-[10px] text-slate-500 font-bold">Active Countries</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Submissions</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalApps.toLocaleString()}</div>
          <span className="text-[10px] text-blue-600 font-bold">All Country Volume</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Country Revenue</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalRevenue}</div>
          <span className="text-[10px] text-emerald-600 font-bold">Gross Fees</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Top Volume Country</span>
          <div className="text-2xl font-black text-slate-900 font-mono truncate">{topByVolume.country}</div>
          <span className="text-[10px] text-purple-600 font-bold">{topByVolume.applications.toLocaleString()} Applications</span>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Country Performance Filters
          </h3>
          <button onClick={handleGenerateReport} className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5">
            <BarChart3 size={14} /> Filter Reports
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Search Country</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input type="text" placeholder="Search destination..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-8 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Continent / Region</label>
            <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold">
              <option value="All">All Regions</option><option>North America</option><option>Europe</option>
              <option>Oceania</option><option>Asia</option><option>Middle East</option><option>Latin America</option><option>Africa</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Visa Category</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold">
              <option value="All">All Categories</option><option>Tourist</option><option>Business</option>
              <option>Student</option><option>Work</option><option>Medical</option><option>Transit</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Application Source</label>
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
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5">
              <Trophy size={15} className="text-amber-500" /> Live Country Leaderboard
            </h4>
          </div>
          <div className="space-y-2 text-xs font-semibold text-slate-700">
            <div className="flex justify-between items-center bg-blue-50/60 p-2 rounded-xl border border-blue-200">
              <span>Top Country by Volume:</span>
              <strong className="font-bold text-slate-900">{topByVolume.country}</strong>
            </div>
            <div className="flex justify-between items-center bg-emerald-50/60 p-2 rounded-xl border border-emerald-200">
              <span>Top Country by Revenue:</span>
              <strong className="font-bold text-slate-900">{topByRevenue.country}</strong>
            </div>
            <div className="flex justify-between items-center bg-purple-50/60 p-2 rounded-xl border border-purple-200">
              <span>Highest Approval Rate:</span>
              <strong className="font-bold text-slate-900">{highestApproval.country} ({highestApproval.approvalRate})</strong>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
            <Globe size={16} className="text-[#2563EB]" /> Country Performance Breakdown
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                  <th className="pb-2">Country</th>
                  <th className="pb-2 text-center">Applications</th>
                  <th className="pb-2 text-center text-emerald-600">Approved</th>
                  <th className="pb-2 text-center text-red-600">Rejected</th>
                  <th className="pb-2 text-center text-amber-600">Pending</th>
                  <th className="pb-2 text-right">Revenue</th>
                  <th className="pb-2 text-center">Approval %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredCountries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                      No destination country records found in database.
                    </td>
                  </tr>
                ) : (
                  filteredCountries.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 font-bold text-slate-800">{c.country}</td>
                      <td className="py-2 text-center font-mono font-bold text-slate-900">{c.applications.toLocaleString()}</td>
                      <td className="py-2 text-center font-mono font-bold text-emerald-700">{c.approved.toLocaleString()}</td>
                      <td className="py-2 text-center font-mono font-bold text-red-700">{c.rejected.toLocaleString()}</td>
                      <td className="py-2 text-center font-mono font-bold text-amber-700">{c.pending.toLocaleString()}</td>
                      <td className="py-2 text-right font-mono font-bold text-blue-700">{c.revenue}</td>
                      <td className="py-2 text-center font-mono font-bold text-emerald-800">{c.approvalRate}</td>
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
