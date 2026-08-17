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
  AlertCircle,
  Layers,
  PieChart
} from "lucide-react";
import { useReportAnalytics } from "../hooks/useReportAnalytics";

export interface MonthlyCountryRecord {
  id: string;
  country: string;
  flag: string;
  embassy: string;
  totalApplications: number;
  approvedCount: number;
  rejectedCount: number;
  avgSlaDays: number;
  revenue: number;
  revenueSharePercent: number;
  targetStatus: "Target Exceeded" | "Target Achieved" | "Behind Schedule";
}

export default function MonthlyReportsManagement() {
  const { data: liveData, loading, refresh, formatINR } = useReportAnalytics();

  const [selectedMonth, setSelectedMonth] = useState("Current Month");
  const [monthPreset, setMonthPreset] = useState("Current Month");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<MonthlyCountryRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const totalApps = liveData ? liveData.totalApplications : 0;
  const approvedApps = liveData ? liveData.approvedApplications : 0;
  const rejectedApps = liveData ? liveData.rejectedApplications : 0;
  const pendingApps = liveData ? liveData.pendingApplications : 0;
  const totalRevenue = liveData ? formatINR(liveData.totalRevenue) : "₹0";

  const monthlyApprovalRate = totalApps > 0
    ? ((approvedApps / totalApps) * 100).toFixed(1)
    : "0.0";

  const countryList: MonthlyCountryRecord[] = useMemo(() => {
    if (!liveData || !liveData.countryBreakdown) return [];
    return liveData.countryBreakdown.map((c, i) => {
      const share = totalApps > 0 ? (c.applications / totalApps) * 100 : 0;
      return {
        id: `m-cnt-${i + 1}`,
        country: c.country,
        flag: "🌐",
        embassy: `${c.country} Embassy Consular`,
        totalApplications: c.applications,
        approvedCount: c.approved,
        rejectedCount: c.rejected,
        avgSlaDays: 7,
        revenue: c.revenue,
        revenueSharePercent: parseFloat(share.toFixed(1)),
        targetStatus: "Target Achieved"
      };
    });
  }, [liveData, totalApps]);

  const filteredCountries = countryList.filter(
    (c) =>
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.embassy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visaCategories = liveData?.visaTypeBreakdown || [];

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

      {/* HEADER SECTION WITH MONTH PRESETS & EXPORT BUTTONS */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-6 rounded-3xl shadow-xl mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-blue-700">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-200 mb-1">
            <PieChart size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold flex items-center gap-1.5">
              Strategic Executive Insights
              {loading && <span className="w-2 h-2 rounded-full bg-blue-300 animate-ping" />}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Monthly Report &amp; Analytics
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            High-level monthly performance analytics, application growth trends, monthly revenue breakdown, and embassy processing SLA tracking.
          </p>
        </div>

        {/* MONTH PRESETS & EXPORT CONTROLS */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white/10 border border-white/20 backdrop-blur-md p-1.5 rounded-2xl flex items-center gap-1">
            {["Current Month", "Previous Month", "Q1", "Q2", "YTD"].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setMonthPreset(preset);
                  triggerToast(`Loaded monthly report for ${preset}`);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  monthPreset === preset
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
            onClick={() => triggerToast("Exporting Executive Monthly PDF Report...")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
          >
            <Download size={14} /> Export PDF Report
          </button>
        </div>
      </div>

      {/* EXECUTIVE STATISTICS CARDS (4 METRICS DYNAMIC) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* CARD 1: TOTAL MONTHLY APPLICATIONS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              Total Applications Received
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
              <FileText size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{totalApps.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-blue-600 mt-2">
            <span>{totalApps} Total Inflow</span>
          </div>
        </div>

        {/* CARD 2: TOTAL VISAS APPROVED */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
              Total Visas Approved
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{approvedApps.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 mt-2">
            <TrendingUp size={14} /> {monthlyApprovalRate}% Monthly Approval Rate
          </div>
        </div>

        {/* CARD 3: TOTAL MONTHLY REVENUE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600">
              Total Monthly Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{totalRevenue}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mt-2">
            Visa Fees &amp; Service Charges
          </div>
        </div>

        {/* CARD 4: PENDING PROCESSING */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
              Pending in Pipeline
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{pendingApps.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-2">
            <span>{pendingApps} Cases Pending</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD MIDDLE SECTION: CATEGORY SHARE & REGIONAL BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* MONTHLY VISA CATEGORY BREAKDOWN */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Layers size={16} className="text-[#2563EB]" /> Visa Category Distribution
          </h3>

          <div className="space-y-3">
            {visaCategories.length === 0 ? (
              <div className="py-8 text-center text-slate-400 font-medium text-xs">
                No visa category data recorded in database.
              </div>
            ) : (
              visaCategories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📄</span>
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">{cat.visaType}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{cat.applications} Applications</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 font-mono block">₹{cat.revenue.toLocaleString()}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">{cat.approvalRate} Approval</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* DESTINATION COUNTRY MONTHLY SHARE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe size={16} className="text-[#2563EB]" /> Destination Country Share
          </h3>

          <div className="space-y-3">
            {countryList.length === 0 ? (
              <div className="py-8 text-center text-slate-400 font-medium text-xs">
                No destination country applications recorded in database.
              </div>
            ) : (
              countryList.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{c.flag}</span>
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">{c.country}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{c.totalApplications} Cases</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-blue-600 font-mono block">{c.revenueSharePercent}% Share</span>
                    <span className="text-[10px] text-emerald-600 font-bold">₹{c.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MONTHLY COUNTRY BREAKDOWN TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-outfit flex items-center gap-2">
              <Building size={16} className="text-[#2563EB]" /> Embassy Processing &amp; Destination Report
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Monthly breakdown by destination country, approvals, and revenue share
            </span>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search destination..."
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
                <th className="py-3 px-4">Destination Country</th>
                <th className="py-3 px-4">Applications</th>
                <th className="py-3 px-4">Approved</th>
                <th className="py-3 px-4">Rejected</th>
                <th className="py-3 px-4">Avg SLA</th>
                <th className="py-3 px-4">Revenue</th>
                <th className="py-3 px-4">Share %</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCountries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-medium">
                    No country performance records logged for this month.
                  </td>
                </tr>
              ) : (
                filteredCountries.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/30 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span>{c.flag}</span>
                      <span>{c.country}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{c.totalApplications.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{c.approvedCount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-red-600">{c.rejectedCount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{c.avgSlaDays} Days</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">₹{c.revenue.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{c.revenueSharePercent}%</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {c.targetStatus}
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
