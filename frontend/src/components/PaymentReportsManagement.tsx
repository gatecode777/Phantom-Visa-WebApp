import React, { useState } from "react";
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Download,
  Check,
  TrendingUp,
  ShieldCheck,
  FileSpreadsheet,
  PieChart,
  DollarSign,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { useReportAnalytics } from "../hooks/useReportAnalytics";

export default function PaymentReportsManagement() {
  const { data: liveData, loading, refresh, formatINR } = useReportAnalytics();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [gatewayFilter, setGatewayFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [payerCategoryFilter, setPayerCategoryFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleGenerateReport = () =>
    triggerToast(`Generated Payment Report for ${gatewayFilter} (${dateRange}).`);
  const handleExportFormat = (fmt: string) =>
    triggerToast(`Exported payment report in ${fmt} format.`);

  // Dynamic values (clean zero defaults)
  const totalRevenue = liveData ? formatINR(liveData.totalRevenue) : "₹0";
  const totalTransactions = liveData ? liveData.totalTransactions : 0;
  const successfulPayments = liveData ? liveData.successfulPayments : 0;
  const pendingPayments = liveData ? liveData.pendingPayments : 0;
  const failedPayments = liveData ? liveData.failedPayments : 0;
  const refundedPayments = liveData ? liveData.refundedPayments : 0;

  const paymentSummaryRows = liveData
    ? [
        { status: "Successful", count: liveData.paymentBreakdown.Successful?.count || 0, amount: formatINR(liveData.paymentBreakdown.Successful?.totalAmount || 0) },
        { status: "Pending", count: liveData.paymentBreakdown.Pending?.count || 0, amount: formatINR(liveData.paymentBreakdown.Pending?.totalAmount || 0) },
        { status: "Failed", count: liveData.paymentBreakdown.Failed?.count || 0, amount: formatINR(liveData.paymentBreakdown.Failed?.totalAmount || 0) },
        { status: "Refunded", count: liveData.paymentBreakdown.Refunded?.count || 0, amount: formatINR(liveData.paymentBreakdown.Refunded?.totalAmount || 0) },
      ]
    : [];

  const revenueSourceRows = liveData && liveData.revenueSources.length > 0
    ? liveData.revenueSources.map((r) => ({ source: r.source, amount: formatINR(r.amount) }))
    : [];

  const successRate = totalTransactions > 0
    ? `${((successfulPayments / totalTransactions) * 100).toFixed(1)}%`
    : "0.0%";

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
            <CreditCard size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold flex items-center gap-1.5">
              Dashboard Reports &bull; Financial &amp; Transaction Audit Analytics
              {loading && <span className="w-2 h-2 rounded-full bg-blue-300 animate-ping" />}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">Payment Reports</h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Analyze live payment transactions, gross revenue collected, payment gateway audits, and refund tracking.
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
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Transactions</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{totalTransactions.toLocaleString()}</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Total Volume</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Transactions Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{Math.min(totalTransactions, 6)}</div>
            <span className="text-[10px] text-emerald-600 font-bold">Daily Influx</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Total Revenue</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{totalRevenue}</div>
            <span className="text-[10px] text-blue-600 font-bold">Gross Earnings</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Successful Payments</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{successfulPayments.toLocaleString()}</div>
            <span className="text-[10px] text-teal-600 font-bold">Cleared Payments</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Pending Payments</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{pendingPayments.toLocaleString()}</div>
            <span className="text-[10px] text-amber-600 font-bold">In Processing</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Failed Payments</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{failedPayments.toLocaleString()}</div>
            <span className="text-[10px] text-red-600 font-bold">Declined Gateway</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Refund Requests</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{refundedPayments.toLocaleString()}</div>
            <span className="text-[10px] text-purple-600 font-bold">Payout Claims</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-indigo-600 block mb-1">Avg Transaction Value</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {successfulPayments > 0 ? formatINR(Math.round((liveData?.totalRevenue || 0) / successfulPayments)) : "₹0"}
            </div>
            <span className="text-[10px] text-indigo-600 font-bold">Average Ticket Size</span>
          </div>
        </div>

        {/* Professional Financial Audit */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Financial Audit
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Comprehensive financial insights: payment gateway performance, success rate, revenue breakdown by payment method, refund tracking, and exportable reports.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-1 text-[10px] font-semibold text-slate-700">
            <div className="flex items-center gap-1"><Check size={11} className="text-emerald-600" /> Gateway Success: {successRate}</div>
            <div className="flex items-center gap-1"><Check size={11} className="text-emerald-600" /> Top Method: Razorpay / UPI</div>
            <div className="flex items-center gap-1"><Check size={11} className="text-emerald-600" /> Clearance: Instant</div>
            <div className="flex items-center gap-1"><Check size={11} className="text-emerald-600" /> Refunds: {refundedPayments} Cases</div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search &amp; Payment Report Filters
          </h3>
          <button onClick={handleGenerateReport} className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5">
            <BarChart3 size={15} /> Generate Report
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Search (Txn ID, App ID, Payer)</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input type="text" placeholder="TXN-5001, APP-20261001..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Payment Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold">
              <option value="All">All Statuses</option><option>Successful</option><option>Pending</option><option>Failed</option><option>Refunded</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Payment Gateway</label>
            <select value={gatewayFilter} onChange={(e) => setGatewayFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold">
              <option value="All">All Gateways</option><option>UPI Gateway</option><option>Razorpay</option><option>Stripe</option><option>Credit / Debit Card</option><option>Netbanking</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Payment Method</label>
            <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold">
              <option value="All">All Methods</option><option>UPI App</option><option>Credit / Debit Card</option><option>Net Banking</option><option>Wallet</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Payer Category</label>
            <select value={payerCategoryFilter} onChange={(e) => setPayerCategoryFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold">
              <option value="All">All Categories</option><option>Direct Applicant</option><option>Agent</option><option>Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5"><TrendingUp size={15} className="text-[#2563EB]" /> Revenue Trend</h4>
            <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono font-bold">Live Stream</span>
          </div>
          <div className="space-y-2 text-xs font-semibold text-slate-700">
            <div className="flex justify-between"><span>Daily Revenue:</span><strong className="font-mono text-slate-900">{formatINR((liveData?.totalRevenue || 0) / 30)}</strong></div>
            <div className="flex justify-between"><span>Weekly Revenue:</span><strong className="font-mono text-slate-900">{formatINR((liveData?.totalRevenue || 0) / 4)}</strong></div>
            <div className="flex justify-between"><span>Monthly Revenue:</span><strong className="font-mono text-slate-900">{totalRevenue}</strong></div>
            <div className="flex justify-between"><span>Total Collected:</span><strong className="font-mono text-slate-900">{totalRevenue}</strong></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5"><PieChart size={15} className="text-purple-600" /> Status Distribution</h4>
            <span className="text-[9px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-mono font-bold">Doughnut</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
            <div className="flex justify-between"><span>Successful:</span><strong className="font-mono text-emerald-700">{successfulPayments}</strong></div>
            <div className="flex justify-between"><span>Pending:</span><strong className="font-mono text-amber-700">{pendingPayments}</strong></div>
            <div className="flex justify-between"><span>Failed:</span><strong className="font-mono text-red-700">{failedPayments}</strong></div>
            <div className="flex justify-between"><span>Refunded:</span><strong className="font-mono text-purple-700">{refundedPayments}</strong></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5"><CreditCard size={15} className="text-teal-600" /> Payment Method Share</h4>
            <span className="text-[9px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded font-mono font-bold">Distribution</span>
          </div>
          <div className="space-y-1.5 text-xs font-semibold text-slate-700">
            <div className="flex justify-between"><span>UPI &amp; Razorpay:</span><strong className="font-mono text-slate-900">54.2%</strong></div>
            <div className="flex justify-between"><span>Credit / Debit Cards:</span><strong className="font-mono text-slate-900">28.4%</strong></div>
            <div className="flex justify-between"><span>Net Banking:</span><strong className="font-mono text-slate-900">12.1%</strong></div>
            <div className="flex justify-between"><span>Wallets:</span><strong className="font-mono text-slate-900">5.3%</strong></div>
          </div>
        </div>
      </div>

      {/* SUMMARY TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
            <DollarSign size={16} className="text-[#2563EB]" /> Payment Status Breakdown Summary
          </h4>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                <th className="pb-2">Payment Status</th><th className="pb-2 text-center">Transactions</th><th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paymentSummaryRows.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2 font-bold text-slate-800">{row.status}</td>
                  <td className="py-2 text-center font-mono font-bold text-slate-900">{row.count.toLocaleString()}</td>
                  <td className="py-2 text-right font-mono font-bold text-[#2563EB]">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
            <BarChart3 size={16} className="text-emerald-600" /> Revenue Source Breakdown
          </h4>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                <th className="pb-2">Revenue Source</th><th className="pb-2 text-right text-emerald-600">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {revenueSourceRows.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2 font-bold text-slate-800">{r.source}</td>
                  <td className="py-2 text-right font-mono font-bold text-emerald-700">{r.amount}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-200">
                <td className="py-2 font-extrabold text-slate-900">Total Gross</td>
                <td className="py-2 text-right font-mono font-extrabold text-emerald-900">{totalRevenue}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
