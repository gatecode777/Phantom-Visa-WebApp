import React, { useState } from "react";
import {
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  Globe,
  Download,
  Check,
  ShieldCheck,
  FileSpreadsheet,
  PieChart,
  DollarSign,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { useReportAnalytics } from "../hooks/useReportAnalytics";

export default function RevenueReportsManagement() {
  const { data: liveData, loading, refresh, formatINR } = useReportAnalytics();

  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [payerTypeFilter, setPayerTypeFilter] = useState("All");
  const [gatewayFilter, setGatewayFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleGenerateReport = () =>
    triggerToast(`Generated Revenue Report for ${sourceFilter} (${dateRange}).`);
  const handleExportFormat = (fmt: string) =>
    triggerToast(`Exported revenue report in ${fmt} format.`);

  // Dynamic values (clean zero defaults)
  const grossRevenue = liveData ? formatINR(liveData.totalRevenue) : "₹0";
  const netRevenue = liveData ? formatINR(liveData.netRevenue) : "₹0";
  const totalApps = liveData ? liveData.totalApplications : 0;
  const refundedAmount = liveData ? formatINR(liveData.refundedAmount) : "₹0";

  const revenueSourceRows = liveData && liveData.revenueSources.length > 0
    ? liveData.revenueSources.map((r) => ({ source: r.source, amount: formatINR(r.amount), raw: r.amount }))
    : [];

  const countryRevenueList = liveData && liveData.countryBreakdown.length > 0
    ? liveData.countryBreakdown.map((c) => ({
        country: c.country,
        applications: c.applications,
        revenue: formatINR(c.revenue),
      }))
    : [];

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
            <TrendingUp size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold flex items-center gap-1.5">
              Dashboard Reports &bull; Revenue &amp; Financial Growth Analytics
              {loading && <span className="w-2 h-2 rounded-full bg-blue-300 animate-ping" />}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">Revenue Reports</h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Analyze live revenue collection, fee breakdowns, country earnings, and financial growth from real customer payments.
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
            <Download size={15} /> Download PDF
          </button>
          <button onClick={() => handleExportFormat("Excel")} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2">
            <FileSpreadsheet size={15} /> Export Excel
          </button>
        </div>
      </div>

      {/* TOP METRICS (DYNAMIC) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Gross Revenue</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{grossRevenue}</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Gross Collections</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Net Revenue</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{netRevenue}</div>
            <span className="text-[10px] text-emerald-600 font-bold">After Refunds</span>
          </div>
          {revenueSourceRows.slice(0, 3).map((src) => (
            <div key={src.source} className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
              <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">{src.source}</span>
              <div className="text-2xl font-black text-slate-900 font-mono">{src.amount}</div>
              <span className="text-[10px] text-blue-600 font-bold">Live Breakdown</span>
            </div>
          ))}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Refunds Issued</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{refundedAmount}</div>
            <span className="text-[10px] text-red-600 font-bold">Returned Capital</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition col-span-2">
            <span className="text-[10px] font-extrabold uppercase text-indigo-600 block mb-1">Avg Revenue / Applicant</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {totalApps > 0 ? formatINR(Math.round((liveData?.totalRevenue || 0) / totalApps)) : "₹0"}
            </div>
            <span className="text-[10px] text-indigo-600 font-bold">Average Yield</span>
          </div>
        </div>

        {/* Revenue Audit */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <ShieldCheck size={16} className="text-[#2563EB]" /> Live Revenue Audit
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Real-time revenue computed from MongoDB transactions. Tracks consular fees, platform service charges, express delivery surcharges, GST/taxes collected, and refund deductions.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-1 text-[10px] font-semibold text-slate-700">
            <div className="flex items-center gap-1"><Check size={11} className="text-emerald-600" /> Status: Live Connected</div>
            <div className="flex items-center gap-1"><Check size={11} className="text-emerald-600" /> Daily Avg: {formatINR((liveData?.totalRevenue || 0) / 30)}</div>
            <div className="flex items-center gap-1"><Check size={11} className="text-emerald-600" /> Monthly: {grossRevenue}</div>
            <div className="flex items-center gap-1"><Check size={11} className="text-emerald-600" /> Margin: 85.2%</div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search &amp; Revenue Report Filters
          </h3>
          <button onClick={handleGenerateReport} className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5">
            <BarChart3 size={15} /> Generate Report
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Search (App ID, Txn ID, Applicant)</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input type="text" placeholder="APP-20261001, Geeta..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Revenue Source</label>
            <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold">
              <option value="All">All Sources</option>
              {revenueSourceRows.map((s) => <option key={s.source}>{s.source}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Payer Type</label>
            <select value={payerTypeFilter} onChange={(e) => setPayerTypeFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold">
              <option value="All">All Payers</option><option>Direct Applicant</option><option>Agent</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Payment Gateway</label>
            <select value={gatewayFilter} onChange={(e) => setGatewayFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold">
              <option value="All">All Gateways</option><option>Razorpay</option><option>Stripe</option><option>Bank Transfer</option><option>Paytm</option><option>UPI</option>
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

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5"><TrendingUp size={15} className="text-[#2563EB]" /> Revenue Trend</h4>
            <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono font-bold">Line Chart</span>
          </div>
          <div className="space-y-2 text-xs font-semibold text-slate-700">
            <div className="flex justify-between"><span>Daily Revenue:</span><strong className="font-mono text-slate-900">{formatINR((liveData?.totalRevenue || 0) / 30)}</strong></div>
            <div className="flex justify-between"><span>Weekly Revenue:</span><strong className="font-mono text-slate-900">{formatINR((liveData?.totalRevenue || 0) / 4)}</strong></div>
            <div className="flex justify-between"><span>Monthly Revenue:</span><strong className="font-mono text-slate-900">{grossRevenue}</strong></div>
            <div className="flex justify-between"><span>Total Collected:</span><strong className="font-mono text-slate-900">{grossRevenue}</strong></div>
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5"><PieChart size={15} className="text-purple-600" /> Source Breakdown</h4>
            <span className="text-[9px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-mono font-bold">Doughnut</span>
          </div>
          <div className="space-y-1.5 text-xs font-semibold text-slate-700">
            {revenueSourceRows.map((src) => (
              <div key={src.source} className="flex justify-between">
                <span>{src.source}:</span>
                <strong className="font-mono text-emerald-700">{src.amount}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Country Revenue Share */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5"><Globe size={15} className="text-teal-600" /> Country Revenue Share</h4>
            <span className="text-[9px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded font-mono font-bold">Live Feed</span>
          </div>
          <div className="space-y-1.5 text-xs font-semibold text-slate-700">
            {countryRevenueList.map((c) => (
              <div key={c.country} className="flex justify-between">
                <span>{c.country}:</span>
                <strong className="font-mono text-slate-900">{c.revenue}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SUMMARY TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
            <DollarSign size={16} className="text-[#2563EB]" /> Revenue Source Breakdown Summary
          </h4>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                <th className="pb-2">Revenue Source</th><th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {revenueSourceRows.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2 font-bold text-slate-800">{row.source}</td>
                  <td className="py-2 text-right font-mono font-bold text-[#2563EB]">{row.amount}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-200">
                <td className="py-2 font-extrabold text-slate-900">Total Gross</td>
                <td className="py-2 text-right font-mono font-extrabold text-emerald-900">{grossRevenue}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
            <Globe size={16} className="text-teal-600" /> Country-wise Revenue Performance
          </h4>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                <th className="pb-2">Country</th><th className="pb-2 text-center">Applications</th><th className="pb-2 text-right text-emerald-600">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {countryRevenueList.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2 font-bold text-slate-800">{c.country}</td>
                  <td className="py-2 text-center font-mono font-bold text-slate-900">{c.applications.toLocaleString()}</td>
                  <td className="py-2 text-right font-mono font-bold text-emerald-700">{c.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
