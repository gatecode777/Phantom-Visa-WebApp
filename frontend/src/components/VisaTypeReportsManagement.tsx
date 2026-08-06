import React, { useState } from "react";
import {
  Tag,
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
  FileText,
  Trophy,
  Plane
} from "lucide-react";

export interface VisaTypePerformanceRow {
  icon: string;
  visaType: string;
  applications: number;
  approved: number;
  rejected: number;
  pending: number;
  revenue: string;
  approvalRate: string;
  avgProcessing: string;
}

export const VISA_TYPE_REPORT_WORKFLOW = [
  "Application Submitted",
  "Category Categorized",
  "Decision Processed",
  "Visa Type Stats Aggregated",
  "Analytics Generated",
  "Report Exported"
];

export const VISA_TYPE_REPORT_FEATURES = [
  "Visa Category Breakdown",
  "Demand Analysis by Visa Type",
  "Revenue by Category Tracking",
  "Processing Time Breakdown",
  "Approval Rate Metrics",
  "Express Request Demand",
  "Inter-country Type Trends",
  "PDF, Excel & CSV Export",
  "Custom Date Analytics",
  "Seasonal Demand Trends"
];

const MOCK_VISA_TYPE_PERFORMANCE: VisaTypePerformanceRow[] = [
  { icon: "🧳", visaType: "Tourist Visa", applications: 7200, approved: 5148, rejected: 612, pending: 1440, revenue: "₹1.12 Cr", approvalRate: "88.4%", avgProcessing: "6 Days" },
  { icon: "💼", visaType: "Business Visa", applications: 4850, approved: 3950, rejected: 485, pending: 415, revenue: "₹98.20 L", approvalRate: "91.5%", avgProcessing: "8 Days" },
  { icon: "🎓", visaType: "Student Visa", applications: 3940, approved: 2970, rejected: 360, pending: 610, revenue: "₹1.15 Cr", approvalRate: "89.2%", avgProcessing: "14 Days" },
  { icon: "👷", visaType: "Work Visa", applications: 1920, approved: 1480, rejected: 170, pending: 270, revenue: "₹42.60 L", approvalRate: "87.8%", avgProcessing: "18 Days" },
  { icon: "🏥", visaType: "Medical Visa", applications: 632, approved: 510, rejected: 32, pending: 90, revenue: "₹16.40 L", approvalRate: "94.1%", avgProcessing: "4 Days" }
];

export default function VisaTypeReportsManagement() {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All Countries");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [reportFormat, setReportFormat] = useState("PDF");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredTypes = MOCK_VISA_TYPE_PERFORMANCE.filter((v) => {
    const q = searchQuery.toLowerCase();
    return v.visaType.toLowerCase().includes(q);
  });

  const handleGenerateReport = () => {
    triggerToast(`Generated Visa Type Report for ${categoryFilter} (${dateRange}).`);
  };

  const handleExportFormat = (fmt: string) => {
    triggerToast(`Exported visa type report in ${fmt} format.`);
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
            <Tag size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Dashboard Reports &bull; Visa Category & Type Analytics Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Visa Type Reports
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Analyze visa application demand, approval rates, revenue, and processing speed by visa category and type.
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

      {/* TOP METRICS DASHBOARD (8 CARDS MATCHING WIREFRAME EXACTLY) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-slate-500 block mb-1">Visa Types</span>
          <div className="text-xl font-black text-slate-900 font-mono">48</div>
          <span className="text-[9px] text-[#2563EB] font-bold">Active Offerings</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-blue-600 block mb-1">Total Demand</span>
          <div className="text-xl font-black text-slate-900 font-mono">18,542</div>
          <span className="text-[9px] text-blue-600 font-bold">Applications</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-emerald-600 block mb-1">Most Popular</span>
          <div className="text-xl font-black text-slate-900 font-mono">Tourist</div>
          <span className="text-[9px] text-emerald-600 font-bold">7,200 Cases</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-purple-600 block mb-1">Top Revenue</span>
          <div className="text-xl font-black text-slate-900 font-mono">Student</div>
          <span className="text-[9px] text-purple-600 font-bold">₹1.15 Cr</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-teal-600 block mb-1">Total Revenue</span>
          <div className="text-xl font-black text-slate-900 font-mono">₹3.84 Cr</div>
          <span className="text-[9px] text-teal-600 font-bold">Gross Earnings</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-amber-600 block mb-1">Avg Processing</span>
          <div className="text-xl font-black text-slate-900 font-mono">12.4 Days</div>
          <span className="text-[9px] text-amber-600 font-bold">Turnaround Time</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-indigo-600 block mb-1">Approval Rate</span>
          <div className="text-xl font-black text-slate-900 font-mono">92.8%</div>
          <span className="text-[9px] text-indigo-600 font-bold">Overall Success</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition">
          <span className="text-[9px] font-extrabold uppercase text-teal-700 block mb-1">Fastest Type</span>
          <div className="text-xl font-black text-slate-900 font-mono">Transit</div>
          <span className="text-[9px] text-teal-700 font-bold">2.5 Days</span>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & Visa Type Report Filters
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
              Search (Visa Name / Code / Country)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tourist, Student, Canada..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
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
              <option value="Tourist Visa">Tourist Visa</option>
              <option value="Business Visa">Business Visa</option>
              <option value="Student Visa">Student Visa</option>
              <option value="Work Visa">Work Visa</option>
              <option value="Medical Visa">Medical Visa</option>
              <option value="Transit Visa">Transit Visa</option>
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
            </select>
          </div>
        </div>
      </div>

      {/* CHARTS & VISA TYPE PERFORMANCE SECTION (MATCHING WIREFRAME) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* TOP PERFORMING VISA TYPES RANKING */}
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
                <strong className="font-bold text-slate-900">Tourist Visa (7,200)</strong>
              </div>
              <div className="flex justify-between items-center bg-purple-50/60 p-2 rounded-xl border border-purple-200">
                <span>Highest Revenue:</span>
                <strong className="font-bold text-slate-900">Student Visa (₹1.15 Cr)</strong>
              </div>
              <div className="flex justify-between items-center bg-emerald-50/60 p-2 rounded-xl border border-emerald-200">
                <span>Highest Approval Rate:</span>
                <strong className="font-bold text-slate-900">Medical Visa (94.1%)</strong>
              </div>
              <div className="flex justify-between items-center bg-teal-50/60 p-2 rounded-xl border border-teal-200">
                <span>Fastest Processing:</span>
                <strong className="font-bold text-slate-900">Transit Visa (2.5 Days)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* VISA TYPE PERFORMANCE TABLE */}
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
                  <th className="pb-2 text-center">Avg Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTypes.map((v, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2 font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{v.icon}</span>
                      <span>{v.visaType}</span>
                    </td>
                    <td className="py-2 text-center font-mono font-bold text-slate-900">{v.applications.toLocaleString()}</td>
                    <td className="py-2 text-center font-mono font-bold text-emerald-700">{v.approved.toLocaleString()}</td>
                    <td className="py-2 text-center font-mono font-bold text-red-700">{v.rejected.toLocaleString()}</td>
                    <td className="py-2 text-center font-mono font-bold text-amber-700">{v.pending.toLocaleString()}</td>
                    <td className="py-2 text-right font-mono font-bold text-blue-700">{v.revenue}</td>
                    <td className="py-2 text-center font-mono font-bold text-emerald-800">{v.approvalRate}</td>
                    <td className="py-2 text-center font-mono font-bold text-slate-700">{v.avgProcessing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              {VISA_TYPE_REPORT_WORKFLOW.map((wf, idx) => (
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
              {VISA_TYPE_REPORT_FEATURES.map((feat, idx) => (
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
          The Visa Type Reports page provides category-level demand and performance analysis. Track application volumes, approval rates, average processing time, revenue generation, express service demands across visa types, and export detailed category audit reports in PDF, Excel, and CSV formats.
        </p>
      </div>
    </div>
  );
}
