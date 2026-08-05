import React, { useState } from "react";
import {
  CreditCard,
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
  Briefcase,
  Users,
  Layers,
  Zap,
  Award,
  BarChart3,
  TrendingDown,
  FileText
} from "lucide-react";

export interface PaymentSummaryRow {
  status: string;
  count: number;
  amount: string;
}

export interface RevenueSourceRow {
  source: string;
  amount: string;
}

export const PAYMENT_REPORT_WORKFLOW = [
  "Transaction Initiated",
  "Transaction Processed",
  "Payment Recorded",
  "Payment Included in Reports",
  "Analytics Generated",
  "Report Downloaded / Exported"
];

export const PAYMENT_REPORT_FEATURES = [
  "Real-time Revenue Analytics",
  "Payment Gateway Reports",
  "Payment Method Breakdown",
  "Refund Tracking & Analysis",
  "Financial Audit Logs",
  "Transaction Details Tracking",
  "Interactive Revenue Charts",
  "PDF, Excel & CSV Export",
  "Scheduled Financial Reports",
  "Role-based Financial Access"
];

const MOCK_PAYMENT_SUMMARY: PaymentSummaryRow[] = [
  { status: "Successful", count: 21840, amount: "₹2.84 Cr" },
  { status: "Pending", count: 560, amount: "₹98.87 L" },
  { status: "Failed", count: 240, amount: "₹21.50 L" },
  { status: "Refunded", count: 200, amount: "₹18.65 L" }
];

const MOCK_REVENUE_SOURCES: RevenueSourceRow[] = [
  { source: "Visa Fees", amount: "₹2.10 Cr" },
  { source: "Service Charges", amount: "₹54.20 L" },
  { source: "Express Processing Fee", amount: "₹12.50 L" },
  { source: "Agent Commissions", amount: "₹7.30 L" }
];

export default function PaymentReportsManagement() {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [gatewayFilter, setGatewayFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [payerCategoryFilter, setPayerCategoryFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [reportFormat, setReportFormat] = useState("PDF");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleGenerateReport = () => {
    triggerToast(`Generated Payment Report for ${gatewayFilter} (${dateRange}).`);
  };

  const handleExportFormat = (fmt: string) => {
    triggerToast(`Exported payment report in ${fmt} format.`);
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
            <CreditCard size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Dashboard Reports &bull; Financial & Transaction Audit Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Payment Reports
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Analyze payment transaction data, revenue collection, gateway performance, refunds, and financial metrics across the platform.
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

      {/* TOP METRICS & RECOMMENDATION BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT COLUMN: 8 METRIC CARDS GRID */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Transactions</span>
            <div className="text-2xl font-black text-slate-900 font-mono">22,840</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Total Volume</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Transactions Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">180</div>
            <span className="text-[10px] text-emerald-600 font-bold">Daily Influx</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Total Revenue</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹2.84 Cr</div>
            <span className="text-[10px] text-blue-600 font-bold">Gross Earnings</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Successful Payments</span>
            <div className="text-2xl font-black text-slate-900 font-mono">21,840</div>
            <span className="text-[10px] text-teal-600 font-bold">Cleared Payments</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Pending Payments</span>
            <div className="text-2xl font-black text-slate-900 font-mono">560</div>
            <span className="text-[10px] text-amber-600 font-bold">In Processing</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Failed Payments</span>
            <div className="text-2xl font-black text-slate-900 font-mono">240</div>
            <span className="text-[10px] text-red-600 font-bold">Declined Gateway</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Refund Requests</span>
            <div className="text-2xl font-black text-slate-900 font-mono">200</div>
            <span className="text-[10px] text-purple-600 font-bold">Payout Claims</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-indigo-600 block mb-1">Avg Transaction Value</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹12,450</div>
            <span className="text-[10px] text-indigo-600 font-bold">Average Ticket Size</span>
          </div>
        </div>

        {/* RIGHT COLUMN: PROFESSIONAL RECOMMENDATION BOX (MATCHING WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Financial Audit
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              The Payment Reports page provides comprehensive financial insights and transaction analysis. Include payment gateway performance, success rate, revenue breakdown by payment method, refund tracking, daily/weekly/monthly/yearly revenue trends, and exportable reports in PDF, Excel, and CSV formats.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-1 text-[10px] font-semibold text-slate-700">
            <div className="flex items-center gap-1"><Check size={11} className="text-emerald-600" /> Gateway Success: 98.2%</div>
            <div className="flex items-center gap-1"><Check size={11} className="text-emerald-600" /> Top Method: UPI</div>
            <div className="flex items-center gap-1"><Check size={11} className="text-emerald-600" /> Clearance: 1.2 Mins</div>
            <div className="flex items-center gap-1"><Check size={11} className="text-emerald-600" /> Refund Rate: 0.8%</div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & Payment Report Filters
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
              Search (Txn ID, App ID, Payer, Agent)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="TXN-5001, APP-20261001..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* PAYMENT STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Payment Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Successful">Successful</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* PAYMENT GATEWAY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Payment Gateway
            </label>
            <select
              value={gatewayFilter}
              onChange={(e) => setGatewayFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Gateways</option>
              <option value="UPI">UPI Gateway</option>
              <option value="Razorpay">Razorpay</option>
              <option value="Stripe">Stripe</option>
              <option value="Credit / Debit Card">Credit / Debit Card</option>
              <option value="Netbanking">Netbanking</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {/* PAYMENT METHOD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Payment Method
            </label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Methods</option>
              <option value="UPI App">UPI App</option>
              <option value="Card">Credit / Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Wallet">Wallet</option>
            </select>
          </div>

          {/* PAYER CATEGORY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Payer Category
            </label>
            <select
              value={payerCategoryFilter}
              onChange={(e) => setPayerCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Categories</option>
              <option value="Direct Applicant">Direct Applicant</option>
              <option value="Agent">Agent</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* REPORT CHARTS & VISUAL CARDS GRID (6 CARDS FROM WIREFRAME) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* CARD 1: REVENUE TREND */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5">
                <TrendingUp size={15} className="text-[#2563EB]" /> Revenue Trend
              </h4>
              <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono font-bold">Line Chart</span>
            </div>
            <div className="space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex justify-between"><span>Daily Revenue:</span><strong className="font-mono text-slate-900">₹8.45 L</strong></div>
              <div className="flex justify-between"><span>Weekly Revenue:</span><strong className="font-mono text-slate-900">₹62.40 L</strong></div>
              <div className="flex justify-between"><span>Monthly Revenue:</span><strong className="font-mono text-slate-900">₹2.84 Cr</strong></div>
              <div className="flex justify-between"><span>Yearly Revenue:</span><strong className="font-mono text-slate-900">₹28.40 Cr</strong></div>
            </div>
          </div>
        </div>

        {/* CARD 2: PAYMENT STATUS DISTRIBUTION */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5">
                <PieChart size={15} className="text-purple-600" /> Status Distribution
              </h4>
              <span className="text-[9px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-mono font-bold">Doughnut</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
              <div className="flex justify-between"><span>Successful:</span><strong className="font-mono text-emerald-700">95.6%</strong></div>
              <div className="flex justify-between"><span>Pending:</span><strong className="font-mono text-amber-700">2.5%</strong></div>
              <div className="flex justify-between"><span>Failed:</span><strong className="font-mono text-red-700">1.1%</strong></div>
              <div className="flex justify-between"><span>Refunded:</span><strong className="font-mono text-purple-700">0.8%</strong></div>
            </div>
          </div>
        </div>

        {/* CARD 3: PAYMENT METHOD SHARE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5">
                <CreditCard size={15} className="text-teal-600" /> Payment Method Share
              </h4>
              <span className="text-[9px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded font-mono font-bold">Pie Chart</span>
            </div>
            <div className="space-y-1.5 text-xs font-semibold text-slate-700">
              <div className="flex justify-between"><span>UPI Apps (GooglePay/PhonePe):</span><strong className="font-mono text-slate-900">54.2%</strong></div>
              <div className="flex justify-between"><span>Credit / Debit Cards:</span><strong className="font-mono text-slate-900">28.4%</strong></div>
              <div className="flex justify-between"><span>Net Banking:</span><strong className="font-mono text-slate-900">12.1%</strong></div>
              <div className="flex justify-between"><span>Wallets & Others:</span><strong className="font-mono text-slate-900">5.3%</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY TABLES GRID (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* PAYMENT SUMMARY TABLE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
            <DollarSign size={16} className="text-[#2563EB]" /> Payment Status Breakdown Summary
          </h4>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                <th className="pb-2">Payment Status</th>
                <th className="pb-2 text-center">Transactions</th>
                <th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {MOCK_PAYMENT_SUMMARY.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2 font-bold text-slate-800">{row.status}</td>
                  <td className="py-2 text-center font-mono font-bold text-slate-900">{row.count.toLocaleString()}</td>
                  <td className="py-2 text-right font-mono font-bold text-[#2563EB]">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* REVENUE BREAKDOWN TABLE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
            <BarChart3 size={16} className="text-emerald-600" /> Revenue Source Breakdown
          </h4>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                <th className="pb-2">Revenue Source</th>
                <th className="pb-2 text-right text-emerald-600">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {MOCK_REVENUE_SOURCES.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2 font-bold text-slate-800">{r.source}</td>
                  <td className="py-2 text-right font-mono font-bold text-emerald-700">{r.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
              {PAYMENT_REPORT_WORKFLOW.map((wf, idx) => (
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
              {PAYMENT_REPORT_FEATURES.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1 text-slate-700">
                  <Check size={11} className="text-[#2563EB]" /> {feat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
