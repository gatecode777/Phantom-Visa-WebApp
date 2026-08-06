import React, { useState } from "react";
import {
  TrendingUp,
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

export interface RevenueSummaryRow {
  source: string;
  count: number;
  amount: string;
}

export interface CountryRevenueRow {
  country: string;
  applications: number;
  amount: string;
}

export const REVENUE_REPORT_WORKFLOW = [
  "Revenue Received",
  "Revenue Recorded",
  "Category Categorized",
  "Included in Revenue Reports",
  "Revenue Analysis Generated",
  "Report Downloaded / Exported"
];

export const REVENUE_REPORT_FEATURES = [
  "Real-time Revenue Tracking",
  "Revenue Source Analysis",
  "Gross vs Net Analysis",
  "Visa Category Breakdown",
  "Country Revenue Performance",
  "Agent Commission Tracking",
  "Automated Financial Reports",
  "PDF, Excel & CSV Export",
  "Interactive Visuals",
  "Complete Financial Audit"
];

const MOCK_REVENUE_SUMMARY: RevenueSummaryRow[] = [
  { source: "Visa Fees", count: 21840, amount: "₹2.10 Cr" },
  { source: "Service Charges", count: 21840, amount: "₹54.20 L" },
  { source: "Express Processing", count: 3420, amount: "₹12.50 L" },
  { source: "Document Verification", count: 14200, amount: "₹8.40 L" },
  { source: "Total", count: 21840, amount: "₹2.84 Cr" }
];

const MOCK_COUNTRY_REVENUE: CountryRevenueRow[] = [
  { country: "Canada", applications: 4200, amount: "₹78.40 L" },
  { country: "Australia", applications: 3850, amount: "₹68.20 L" },
  { country: "United Kingdom", applications: 2940, amount: "₹52.40 L" },
  { country: "United States", applications: 2500, amount: "₹44.80 L" },
  { country: "Germany", applications: 1920, amount: "₹34.60 L" }
];

export default function RevenueReportsManagement() {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [payerTypeFilter, setPayerTypeFilter] = useState("All");
  const [gatewayFilter, setGatewayFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [reportFormat, setReportFormat] = useState("PDF");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleGenerateReport = () => {
    triggerToast(`Generated Revenue Report for ${sourceFilter} (${dateRange}).`);
  };

  const handleExportFormat = (fmt: string) => {
    triggerToast(`Exported revenue report in ${fmt} format.`);
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
            <TrendingUp size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Dashboard Reports &bull; Revenue & Financial Growth Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Revenue Reports
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Analyze revenue collection, fee breakdowns, country earnings, and financial growth across the platform.
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
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Gross Revenue</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹3.84 Cr</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Gross Collections</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Net Revenue</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹3.24 Cr</div>
            <span className="text-[10px] text-emerald-600 font-bold">After Commissions</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Visa Fee Revenue</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹2.10 Cr</div>
            <span className="text-[10px] text-blue-600 font-bold">Embassy / Govt Fees</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Service Fee Revenue</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹54.20 L</div>
            <span className="text-[10px] text-teal-600 font-bold">Platform Earnings</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Express Fee Revenue</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹12.50 L</div>
            <span className="text-[10px] text-amber-600 font-bold">Priority Add-ons</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Agent Commissions</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹7.30 L</div>
            <span className="text-[10px] text-purple-600 font-bold">B2B Payouts</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Refunds Issued</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹18.65 L</div>
            <span className="text-[10px] text-red-600 font-bold">Returned Capital</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-indigo-600 block mb-1">Avg Revenue / Applicant</span>
            <div className="text-2xl font-black text-slate-900 font-mono">₹1,560</div>
            <span className="text-[10px] text-indigo-600 font-bold">Average Yield</span>
          </div>
        </div>

        {/* RIGHT COLUMN: PROFESSIONAL RECOMMENDATION BOX (MATCHING WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Revenue Audit
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              The Revenue Reports page provides comprehensive financial breakdown and earnings analysis. Include revenue breakdown by source (Visa Fee, Service Fee, Express Fee), gross vs net revenue tracking, country-wise revenue distribution, revenue growth trends, agent commission tracking, and exportable reports in PDF, Excel, and CSV formats.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-1 text-[10px] font-semibold text-slate-700">
            <div className="flex items-center gap-1"><Check size={11} className="text-emerald-600" /> Growth Rate: +14.2%</div>
            <div className="flex items-center gap-1"><Check size={11} className="text-emerald-600" /> Daily Avg: ₹1.25 L</div>
            <div className="flex items-center gap-1"><Check size={11} className="text-emerald-600" /> Monthly Avg: ₹32.0 L</div>
            <div className="flex items-center gap-1"><Check size={11} className="text-emerald-600" /> Profit Margin: 84.4%</div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & Revenue Report Filters
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
              Search (App ID, Txn ID, Applicant, Agent)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="APP-20261001, Geeta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* REVENUE SOURCE */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Revenue Source
            </label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Sources</option>
              <option value="Visa Fees">Visa Fees</option>
              <option value="Service Charges">Service Charges</option>
              <option value="Express Processing Fee">Express Processing Fee</option>
              <option value="Agent Commission">Agent Commission</option>
              <option value="Document Verification Fee">Document Verification Fee</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* PAYER TYPE */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Payer Type
            </label>
            <select
              value={payerTypeFilter}
              onChange={(e) => setPayerTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Payers</option>
              <option value="Direct Applicant">Direct Applicant</option>
              <option value="Agent">Agent</option>
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
              <option value="Razorpay">Razorpay</option>
              <option value="Stripe">Stripe</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Paytm">Paytm</option>
              <option value="UPI">UPI</option>
              <option value="Netbanking">Netbanking</option>
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
              <option value="Custom Date Range">Custom Date Range</option>
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
              <div className="flex justify-between"><span>Daily Revenue:</span><strong className="font-mono text-slate-900">₹1.25 L</strong></div>
              <div className="flex justify-between"><span>Weekly Revenue:</span><strong className="font-mono text-slate-900">₹8.75 L</strong></div>
              <div className="flex justify-between"><span>Monthly Revenue:</span><strong className="font-mono text-slate-900">₹32.00 L</strong></div>
              <div className="flex justify-between"><span>Yearly Revenue:</span><strong className="font-mono text-slate-900">₹3.84 Cr</strong></div>
            </div>
          </div>
        </div>

        {/* CARD 2: COMMUNITY SOURCE BREAKDOWN */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5">
                <PieChart size={15} className="text-purple-600" /> Source Breakdown
              </h4>
              <span className="text-[9px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-mono font-bold">Doughnut</span>
            </div>
            <div className="space-y-1.5 text-xs font-semibold text-slate-700">
              <div className="flex justify-between"><span>Visa Fees:</span><strong className="font-mono text-emerald-700">₹2.10 Cr (54.7%)</strong></div>
              <div className="flex justify-between"><span>Service Charges:</span><strong className="font-mono text-blue-700">₹54.20 L (14.1%)</strong></div>
              <div className="flex justify-between"><span>Express Processing:</span><strong className="font-mono text-amber-700">₹12.50 L (3.2%)</strong></div>
              <div className="flex justify-between"><span>Agent Commissions:</span><strong className="font-mono text-purple-700">₹7.30 L (1.9%)</strong></div>
            </div>
          </div>
        </div>

        {/* CARD 3: COUNTRY-WISE REVENUE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5">
                <Globe size={15} className="text-teal-600" /> Country Revenue Share
              </h4>
              <span className="text-[9px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded font-mono font-bold">Bar / Map</span>
            </div>
            <div className="space-y-1.5 text-xs font-semibold text-slate-700">
              <div className="flex justify-between"><span>Canada:</span><strong className="font-mono text-slate-900">₹78.40 L</strong></div>
              <div className="flex justify-between"><span>Australia:</span><strong className="font-mono text-slate-900">₹68.20 L</strong></div>
              <div className="flex justify-between"><span>United Kingdom:</span><strong className="font-mono text-slate-900">₹52.40 L</strong></div>
              <div className="flex justify-between"><span>United States:</span><strong className="font-mono text-slate-900">₹44.80 L</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY TABLES GRID (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* REVENUE SUMMARY TABLE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
            <DollarSign size={16} className="text-[#2563EB]" /> Revenue Source Breakdown Summary
          </h4>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                <th className="pb-2">Revenue Source</th>
                <th className="pb-2 text-center">Transactions</th>
                <th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {MOCK_REVENUE_SUMMARY.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2 font-bold text-slate-800">{row.source}</td>
                  <td className="py-2 text-center font-mono font-bold text-slate-900">{row.count.toLocaleString()}</td>
                  <td className="py-2 text-right font-mono font-bold text-[#2563EB]">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* COUNTRY-WISE REVENUE TABLE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
            <Globe size={16} className="text-teal-600" /> Country-wise Revenue Performance
          </h4>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                <th className="pb-2">Country</th>
                <th className="pb-2 text-center">Applications</th>
                <th className="pb-2 text-right text-emerald-600">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {MOCK_COUNTRY_REVENUE.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2 font-bold text-slate-800">{c.country}</td>
                  <td className="py-2 text-center font-mono font-bold text-slate-900">{c.applications.toLocaleString()}</td>
                  <td className="py-2 text-right font-mono font-bold text-emerald-700">{c.amount}</td>
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
              {REVENUE_REPORT_WORKFLOW.map((wf, idx) => (
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
              {REVENUE_REPORT_FEATURES.map((feat, idx) => (
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
