import React, { useState } from "react";
import {
  FileText,
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
  TrendingDown
} from "lucide-react";

export interface ApplicationSummaryRow {
  status: string;
  count: number;
  percentage: string;
}

export interface CountryReportRow {
  country: string;
  total: number;
  approved: number;
  rejected: number;
  pending: number;
}

export const APPLICATION_REPORT_WORKFLOW = [
  "Application Submitted",
  "Application Processing",
  "Decision Recorded",
  "Application Included in Reports",
  "Analytics Generated",
  "Report Downloaded / Exported"
];

export const APPLICATION_REPORT_FEATURES = [
  "Real-time Application Analytics",
  "Country-wise Reports",
  "Visa Category Reports",
  "Direct vs Agent Application Analysis",
  "Approval vs Rejection Trends",
  "Processing Time Analysis",
  "Interactive Charts",
  "PDF, Excel & CSV Export",
  "Scheduled Reports",
  "Drill-down Analytics"
];

const MOCK_SUMMARY_ROWS: ApplicationSummaryRow[] = [
  { status: "New", count: 1112, percentage: "6.0%" },
  { status: "Pending", count: 1248, percentage: "6.7%" },
  { status: "Under Review", count: 1024, percentage: "5.5%" },
  { status: "Approved", count: 12654, percentage: "68.2%" },
  { status: "Rejected", count: 2112, percentage: "11.4%" },
  { status: "Completed", count: 2321, percentage: "12.5%" },
  { status: "Cancelled", count: 176, percentage: "0.9%" }
];

const MOCK_COUNTRY_ROWS: CountryReportRow[] = [
  { country: "Canada", total: 4200, approved: 3148, rejected: 412, pending: 640 },
  { country: "Australia", total: 3850, approved: 2950, rejected: 385, pending: 515 },
  { country: "United Kingdom", total: 2940, approved: 2270, rejected: 260, pending: 410 },
  { country: "Germany", total: 1920, approved: 1480, rejected: 170, pending: 270 },
  { country: "USA", total: 2500, approved: 1850, rejected: 270, pending: 380 }
];

export default function ApplicationReportsManagement() {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All Countries");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [reportFormat, setReportFormat] = useState("PDF");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleGenerateReport = () => {
    triggerToast(`Generated Application Report for ${categoryFilter} (${dateRange}).`);
  };

  const handleExportFormat = (fmt: string) => {
    triggerToast(`Exported application report in ${fmt} format.`);
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
            <FileText size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Dashboard Reports &bull; Application Performance Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Application Reports
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Analyze visa application data, approval rates, processing trends, and application performance across the platform.
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

      {/* TOP METRICS & KPI DASHBOARD (MATCHING WIREFRAME EXACTLY) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT COLUMN: 8 METRIC CARDS GRID */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Applications</span>
            <div className="text-2xl font-black text-slate-900 font-mono">18,542</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Volume Archive</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Applications Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">146</div>
            <span className="text-[10px] text-emerald-600 font-bold">Daily Influx</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Pending Applications</span>
            <div className="text-2xl font-black text-slate-900 font-mono">1,248</div>
            <span className="text-[10px] text-amber-600 font-bold">In Pipeline</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Approved Applications</span>
            <div className="text-2xl font-black text-slate-900 font-mono">12,654</div>
            <span className="text-[10px] text-teal-600 font-bold">Granted Visas</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Rejected Applications</span>
            <div className="text-2xl font-black text-slate-900 font-mono">2,112</div>
            <span className="text-[10px] text-red-600 font-bold">Refused Cases</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Completed Applications</span>
            <div className="text-2xl font-black text-slate-900 font-mono">2,321</div>
            <span className="text-[10px] text-blue-600 font-bold">Closed Vault</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Cancelled Applications</span>
            <div className="text-2xl font-black text-slate-900 font-mono">176</div>
            <span className="text-[10px] text-purple-600 font-bold">Withdrawn</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-indigo-600 block mb-1">Avg Processing Time</span>
            <div className="text-2xl font-black text-slate-900 font-mono">12 Days</div>
            <span className="text-[10px] text-indigo-600 font-bold">Turnaround Time</span>
          </div>
        </div>

        {/* RIGHT COLUMN: PROCESSING PERFORMANCE & KPIS (MATCHING WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Clock size={16} className="text-[#2563EB]" /> Processing Performance
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Avg Processing</span>
                <strong className="text-slate-900 font-mono font-bold">12 Days</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Fastest Processing</span>
                <strong className="text-emerald-700 font-mono font-bold">3 Days</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Longest Processing</span>
                <strong className="text-red-700 font-mono font-bold">28 Days</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Processed Today</span>
                <strong className="text-blue-700 font-mono font-bold">146 Cases</strong>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5">
              <TrendingUp size={16} className="text-emerald-600" /> Key Performance Indicators (KPIs)
            </h3>
            <div className="space-y-1.5 text-[11px] font-semibold text-slate-700">
              <div className="flex justify-between items-center bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                <span>Application Approval Rate:</span>
                <span className="font-mono font-bold text-emerald-800">68.2%</span>
              </div>
              <div className="flex justify-between items-center bg-red-50/70 p-2 rounded-xl border border-red-100">
                <span>Application Rejection Rate:</span>
                <span className="font-mono font-bold text-red-800">11.4%</span>
              </div>
              <div className="flex justify-between items-center bg-purple-50/70 p-2 rounded-xl border border-purple-100">
                <span>Agent Submission Ratio:</span>
                <span className="font-mono font-bold text-purple-800">64.5%</span>
              </div>
              <div className="flex justify-between items-center bg-blue-50/70 p-2 rounded-xl border border-blue-100">
                <span>Direct Applicant Ratio:</span>
                <span className="font-mono font-bold text-blue-800">35.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & Application Report Filters
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
              Search (App ID, Applicant, Passport, Agent)
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

          {/* APPLICATION SOURCE */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Application Source
            </label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Sources</option>
              <option value="Direct Applicant">Direct Applicant</option>
              <option value="Agent">Agent</option>
            </select>
          </div>

          {/* APPLICATION STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Application Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* VISA CATEGORY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Visa Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Categories</option>
              <option value="Tourist">Tourist</option>
              <option value="Business">Business</option>
              <option value="Student">Student</option>
              <option value="Work">Work</option>
              <option value="Medical">Medical</option>
              <option value="Transit">Transit</option>
              <option value="Permanent Residence">Permanent Residence</option>
            </select>
          </div>

          {/* DESTINATION COUNTRY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Destination Country
            </label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All Countries">All Countries</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Germany">Germany</option>
              <option value="USA">USA</option>
            </select>
          </div>
        </div>
      </div>

      {/* REPORT CHARTS & VISUAL CARDS GRID (6 CARDS FROM WIREFRAME) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* CARD 1: APPLICATION TREND */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5">
                <TrendingUp size={15} className="text-[#2563EB]" /> Application Trend
              </h4>
              <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono font-bold">Line Chart</span>
            </div>
            <div className="space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex justify-between"><span>Daily Applications:</span><strong className="font-mono text-slate-900">146</strong></div>
              <div className="flex justify-between"><span>Weekly Applications:</span><strong className="font-mono text-slate-900">1,020</strong></div>
              <div className="flex justify-between"><span>Monthly Applications:</span><strong className="font-mono text-slate-900">4,380</strong></div>
              <div className="flex justify-between"><span>Yearly Applications:</span><strong className="font-mono text-slate-900">18,542</strong></div>
            </div>
          </div>
        </div>

        {/* CARD 2: APPLICATION STATUS DISTRIBUTION */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5">
                <PieChart size={15} className="text-purple-600" /> Status Distribution
              </h4>
              <span className="text-[9px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-mono font-bold">Doughnut</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
              <div className="flex justify-between"><span>Approved:</span><strong className="font-mono text-emerald-700">68.2%</strong></div>
              <div className="flex justify-between"><span>Rejected:</span><strong className="font-mono text-red-700">11.4%</strong></div>
              <div className="flex justify-between"><span>Completed:</span><strong className="font-mono text-blue-700">12.5%</strong></div>
              <div className="flex justify-between"><span>Pending:</span><strong className="font-mono text-amber-700">6.7%</strong></div>
            </div>
          </div>
        </div>

        {/* CARD 3: COUNTRY-WISE APPLICATIONS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase font-outfit flex items-center gap-1.5">
                <Globe size={15} className="text-teal-600" /> Country-wise Share
              </h4>
              <span className="text-[9px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded font-mono font-bold">Bar / Map</span>
            </div>
            <div className="space-y-1.5 text-xs font-semibold text-slate-700">
              <div className="flex justify-between"><span>Canada:</span><strong className="font-mono text-slate-900">4,200 (22.6%)</strong></div>
              <div className="flex justify-between"><span>Australia:</span><strong className="font-mono text-slate-900">3,850 (20.7%)</strong></div>
              <div className="flex justify-between"><span>United Kingdom:</span><strong className="font-mono text-slate-900">2,940 (15.8%)</strong></div>
              <div className="flex justify-between"><span>USA:</span><strong className="font-mono text-slate-900">2,500 (13.4%)</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY TABLES GRID (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* APPLICATION SUMMARY TABLE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
            <FileText size={16} className="text-[#2563EB]" /> Application Status Breakdown Summary
          </h4>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                <th className="pb-2">Status</th>
                <th className="pb-2 text-center">Total Applications</th>
                <th className="pb-2 text-right">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {MOCK_SUMMARY_ROWS.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2 font-bold text-slate-800">{row.status}</td>
                  <td className="py-2 text-center font-mono font-bold text-slate-900">{row.count.toLocaleString()}</td>
                  <td className="py-2 text-right font-mono font-bold text-[#2563EB]">{row.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* COUNTRY-WISE REPORT TABLE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
            <Globe size={16} className="text-teal-600" /> Country-wise Performance Breakdown
          </h4>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                <th className="pb-2">Country</th>
                <th className="pb-2 text-center">Applications</th>
                <th className="pb-2 text-center text-emerald-600">Approved</th>
                <th className="pb-2 text-center text-red-600">Rejected</th>
                <th className="pb-2 text-right text-amber-600">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {MOCK_COUNTRY_ROWS.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2 font-bold text-slate-800">{c.country}</td>
                  <td className="py-2 text-center font-mono font-bold text-slate-900">{c.total.toLocaleString()}</td>
                  <td className="py-2 text-center font-mono font-bold text-emerald-700">{c.approved.toLocaleString()}</td>
                  <td className="py-2 text-center font-mono font-bold text-red-700">{c.rejected.toLocaleString()}</td>
                  <td className="py-2 text-right font-mono font-bold text-amber-700">{c.pending.toLocaleString()}</td>
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
              {APPLICATION_REPORT_WORKFLOW.map((wf, idx) => (
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
              {APPLICATION_REPORT_FEATURES.map((feat, idx) => (
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
          The Application Reports page provides summary-level insights and detailed analysis including Direct Applicant vs Agent comparison, country-wise approval rates, visa category demand, daily/weekly/monthly/yearly trends, average processing time, and multi-format PDF/Excel/CSV exports.
        </p>
      </div>
    </div>
  );
}
