import React, { useState } from "react";
import {
  BarChart3,
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
  FileText,
  FileSpreadsheet,
  PieChart,
  Calendar,
  DollarSign,
  Briefcase,
  Users,
  Layers,
  Zap,
  Award
} from "lucide-react";

export interface DashboardReportMetric {
  title: string;
  value: string;
  change: string;
  status: "up" | "down" | "neutral";
}

export const REPORT_MODULES = [
  "All Modules",
  "Applications",
  "Payments",
  "Appointments",
  "Documents",
  "Users & Agents"
];

export const REPORT_EXPORT_FORMATS = [
  "PDF Summary",
  "Excel Spreadsheet (.xlsx)",
  "CSV Data Export",
  "Printable PDF Report"
];

export const REPORT_GENERATION_WORKFLOW = [
  "Select Report Filters",
  "Preview Dashboard Report",
  "Export to PDF / Excel / CSV",
  "Email / Download / Print Report"
];

export const REPORT_PROFESSIONAL_FEATURES = [
  "Real-time PDF Generation",
  "Automated Email Reports",
  "Custom Date Range Analytics",
  "Multi-module Filtering",
  "Executive PDF Summaries",
  "Export to CSV & Excel",
  "Interactive Charts & Visuals",
  "Automated Daily Report",
  "Role-based Data Access",
  "Complete Audit Trail"
];

export default function DashboardReportsManagement() {
  // Filter States
  const [reportPeriod, setReportPeriod] = useState("Last 30 Days");
  const [moduleFilter, setModuleFilter] = useState("All Modules");
  const [countryFilter, setCountryFilter] = useState("All Countries");
  const [exportFormat, setExportFormat] = useState("PDF Summary");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleGenerateReport = () => {
    triggerToast(`Generating system report for ${moduleFilter} (${reportPeriod})...`);
  };

  const handleExportData = (format: string) => {
    triggerToast(`Exporting ${moduleFilter} report as ${format}...`);
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
            <BarChart3 size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              System-Wide Analytics & Executive Report Generator
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Dashboard & System Reports
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Generate comprehensive system-wide reports, executive summaries, analytics, and exportable data files.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportData("PDF")}
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Download size={15} /> Export PDF Report
          </button>
          <button
            onClick={() => handleExportData("Excel")}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <FileSpreadsheet size={15} /> Export Excel
          </button>
        </div>
      </div>

      {/* DASHBOARD STATISTICS (12 METRIC TILES FROM WIREFRAME) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Applications</span>
          <div className="text-xl font-black text-slate-900 font-mono">24,520</div>
          <span className="text-[10px] text-[#2563EB] font-bold">+12% vs last month</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Applications Today</span>
          <div className="text-xl font-black text-slate-900 font-mono">142</div>
          <span className="text-[10px] text-emerald-600 font-bold">Daily Influx</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Active Applicants</span>
          <div className="text-xl font-black text-slate-900 font-mono">18,450</div>
          <span className="text-[10px] text-blue-600 font-bold">Active User Base</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Registered Agents</span>
          <div className="text-xl font-black text-slate-900 font-mono">420</div>
          <span className="text-[10px] text-purple-600 font-bold">B2B Network</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Approved Applications</span>
          <div className="text-xl font-black text-slate-900 font-mono">16,840</div>
          <span className="text-[10px] text-teal-600 font-bold">Visa Granted</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Rejected Applications</span>
          <div className="text-xl font-black text-slate-900 font-mono">1,280</div>
          <span className="text-[10px] text-red-600 font-bold">Refused Cases</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Pending Applications</span>
          <div className="text-xl font-black text-slate-900 font-mono">6,400</div>
          <span className="text-[10px] text-amber-600 font-bold">In Processing</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Approval Rate</span>
          <div className="text-xl font-black text-slate-900 font-mono">92.8%</div>
          <span className="text-[10px] text-emerald-600 font-bold">Success Ratio</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Total Revenue</span>
          <div className="text-xl font-black text-slate-900 font-mono">₹3.84 Cr</div>
          <span className="text-[10px] text-blue-600 font-bold">Gross Collections</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Total Payments</span>
          <div className="text-xl font-black text-slate-900 font-mono">22,420</div>
          <span className="text-[10px] text-purple-600 font-bold">Transactions</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Completed Appointments</span>
          <div className="text-xl font-black text-slate-900 font-mono">3,984</div>
          <span className="text-[10px] text-teal-600 font-bold">Attended Slots</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-indigo-600 block mb-1">Avg Processing Time</span>
          <div className="text-xl font-black text-slate-900 font-mono">8.4 Days</div>
          <span className="text-[10px] text-indigo-600 font-bold">Turnaround Time</span>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Report Generation & Multi-Module Filters
          </h3>
          <button
            onClick={handleGenerateReport}
            className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <BarChart3 size={15} /> Generate Report
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {/* REPORT PERIOD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Report Period
            </label>
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Year">This Year</option>
              <option value="Custom Date Range">Custom Date Range</option>
            </select>
          </div>

          {/* MODULE FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Target Module
            </label>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              {REPORT_MODULES.map((mod) => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          </div>

          {/* COUNTRY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Country
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
              <option value="United States">United States</option>
              <option value="Germany">Germany</option>
              <option value="Schengen Area">Schengen Area</option>
            </select>
          </div>

          {/* EXPORT FORMAT */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Export Format
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              {REPORT_EXPORT_FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>{fmt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CHARTS & ANALYTICS CARDS (MATCHING WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT COLUMN: APPLICATION & REVENUE SUMMARY TABLES */}
        <div className="lg:col-span-2 space-y-6">
          {/* SUMMARY TABLES GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* APPLICATIONS SUMMARY TABLE */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-2 flex items-center gap-1.5">
                <FileText size={14} className="text-[#2563EB]" /> Applications Summary
              </h4>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                    <th className="pb-1">Status</th>
                    <th className="pb-1 text-right">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr><td className="py-1.5 text-slate-700">Total Applications</td><td className="py-1.5 text-right font-mono font-bold text-slate-900">24,520</td></tr>
                  <tr><td className="py-1.5 text-amber-700">Under Processing</td><td className="py-1.5 text-right font-mono font-bold text-amber-700">6,400</td></tr>
                  <tr><td className="py-1.5 text-emerald-700">Approved</td><td className="py-1.5 text-right font-mono font-bold text-emerald-700">16,840</td></tr>
                  <tr><td className="py-1.5 text-red-700">Rejected</td><td className="py-1.5 text-right font-mono font-bold text-red-700">1,280</td></tr>
                  <tr><td className="py-1.5 text-slate-500">Cancelled</td><td className="py-1.5 text-right font-mono font-bold text-slate-500">570</td></tr>
                  <tr><td className="py-1.5 text-blue-700">Completed</td><td className="py-1.5 text-right font-mono font-bold text-blue-700">3,984</td></tr>
                </tbody>
              </table>
            </div>

            {/* PAYMENTS SUMMARY TABLE */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-2 flex items-center gap-1.5">
                <DollarSign size={14} className="text-emerald-600" /> Payments Summary
              </h4>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                    <th className="pb-1">Status</th>
                    <th className="pb-1 text-center">Count</th>
                    <th className="pb-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr><td className="py-1.5 text-emerald-700">Successful</td><td className="py-1.5 text-center font-mono font-bold">21,840</td><td className="py-1.5 text-right font-mono font-bold text-emerald-700">₹2.84 Cr</td></tr>
                  <tr><td className="py-1.5 text-amber-700">Pending</td><td className="py-1.5 text-center font-mono font-bold">824</td><td className="py-1.5 text-right font-mono font-bold text-amber-700">₹98.87 L</td></tr>
                  <tr><td className="py-1.5 text-red-700">Failed</td><td className="py-1.5 text-center font-mono font-bold">580</td><td className="py-1.5 text-right font-mono font-bold text-red-700">₹21.50 L</td></tr>
                  <tr><td className="py-1.5 text-purple-700">Refunded</td><td className="py-1.5 text-center font-mono font-bold">206</td><td className="py-1.5 text-right font-mono font-bold text-purple-700">₹18.65 L</td></tr>
                </tbody>
              </table>
            </div>

            {/* APPOINTMENTS SUMMARY TABLE */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-2 flex items-center gap-1.5">
                <Calendar size={14} className="text-purple-600" /> Appointments Summary
              </h4>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                    <th className="pb-1">Status</th>
                    <th className="pb-1 text-right">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr><td className="py-1.5 text-blue-700">Upcoming</td><td className="py-1.5 text-right font-mono font-bold text-blue-700">412</td></tr>
                  <tr><td className="py-1.5 text-emerald-700">Completed</td><td className="py-1.5 text-right font-mono font-bold text-emerald-700">3,984</td></tr>
                  <tr><td className="py-1.5 text-red-700">Cancelled</td><td className="py-1.5 text-right font-mono font-bold text-red-700">180</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* PERFORMANCE METRICS CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#2563EB]" /> Key Performance Metrics Audit
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-2xl">
                <span className="text-[10px] font-extrabold text-blue-700 uppercase block mb-1">Application Approval Rate</span>
                <span className="text-xl font-black font-mono text-blue-900">92.8%</span>
              </div>
              <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-2xl">
                <span className="text-[10px] font-extrabold text-emerald-700 uppercase block mb-1">Average Processing Time</span>
                <span className="text-xl font-black font-mono text-emerald-900">8.4 Days</span>
              </div>
              <div className="bg-purple-50/60 border border-purple-100 p-3 rounded-2xl">
                <span className="text-[10px] font-extrabold text-purple-700 uppercase block mb-1">Average Document Clearance</span>
                <span className="text-xl font-black font-mono text-purple-900">1.8 Days</span>
              </div>
              <div className="bg-amber-50/60 border border-amber-100 p-3 rounded-2xl">
                <span className="text-[10px] font-extrabold text-amber-700 uppercase block mb-1">Appointment Wait Time</span>
                <span className="text-xl font-black font-mono text-amber-900">3.2 Days</span>
              </div>
              <div className="bg-teal-50/60 border border-teal-100 p-3 rounded-2xl">
                <span className="text-[10px] font-extrabold text-teal-700 uppercase block mb-1">Agent Conversion Rate</span>
                <span className="text-xl font-black font-mono text-teal-900">88.5%</span>
              </div>
              <div className="bg-indigo-50/60 border border-indigo-100 p-3 rounded-2xl">
                <span className="text-[10px] font-extrabold text-indigo-700 uppercase block mb-1">Customer Satisfaction</span>
                <span className="text-xl font-black font-mono text-indigo-900">4.9 / 5.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: WORKFLOW & PROFESSIONAL FEATURES (MATCHING WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Report Generation Overview
            </h3>

            {/* WORKFLOW FLOW */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {REPORT_GENERATION_WORKFLOW.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[9px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* PROFESSIONAL FEATURES CATALOG */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-900 font-bold block mb-1">Professional Features:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px] max-h-36 overflow-y-auto [scrollbar-width:thin]">
                {REPORT_PROFESSIONAL_FEATURES.map((item, i) => (
                  <div key={i} className="flex items-center gap-1 text-slate-700">
                    <Check size={11} className="text-[#2563EB]" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROFESSIONAL RECOMMENDATION BOX (FROM WIREFRAME) */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2 mb-6">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
          <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Report Audit Strategy
        </h3>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Real-time report generation for Executive / Admin / Agent performance dashboards, full audit trails, automated daily email dispatches, and multi-format PDF/Excel exports.
        </p>
      </div>
    </div>
  );
}
