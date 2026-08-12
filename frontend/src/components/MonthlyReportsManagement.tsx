import React, { useState } from "react";
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

export interface MonthlyCategoryStat {
  categoryName: string;
  icon: string;
  applicationsCount: number;
  revenue: number;
  approvalRate: number;
}

const MOCK_MONTHLY_COUNTRIES: MonthlyCountryRecord[] = [
  { id: "1", country: "Canada", flag: "🇨🇦", embassy: "High Commission of Canada", totalApplications: 1450, approvedCount: 1280, rejectedCount: 170, avgSlaDays: 4.2, revenue: 3625000, revenueSharePercent: 41.0, targetStatus: "Target Exceeded" },
  { id: "2", country: "Australia", flag: "🇦🇺", embassy: "Australian High Commission", totalApplications: 1100, approvedCount: 950, rejectedCount: 150, avgSlaDays: 3.5, revenue: 2750000, revenueSharePercent: 31.1, targetStatus: "Target Exceeded" },
  { id: "3", country: "United Kingdom", flag: "🇬🇧", embassy: "British High Commission", totalApplications: 850, approvedCount: 720, rejectedCount: 130, avgSlaDays: 2.8, revenue: 1700000, revenueSharePercent: 19.2, targetStatus: "Target Achieved" },
  { id: "4", country: "UAE", flag: "🇦🇪", embassy: "Embassy of the UAE", totalApplications: 500, approvedCount: 480, rejectedCount: 20, avgSlaDays: 1.2, revenue: 500000, revenueSharePercent: 5.6, targetStatus: "Target Achieved" },
  { id: "5", country: "USA", flag: "🇺🇸", embassy: "US Embassy & Consulates", totalApplications: 350, approvedCount: 150, rejectedCount: 200, avgSlaDays: 6.5, revenue: 275000, revenueSharePercent: 3.1, targetStatus: "Behind Schedule" }
];

const MOCK_MONTHLY_CATEGORIES: MonthlyCategoryStat[] = [
  { categoryName: "Tourist Visa", icon: "✈️", applicationsCount: 2100, revenue: 4200000, approvalRate: 88.5 },
  { categoryName: "Business Visa", icon: "💼", applicationsCount: 1250, revenue: 3125000, approvalRate: 86.0 },
  { categoryName: "Student Visa", icon: "🎓", applicationsCount: 600, revenue: 1200000, approvalRate: 79.2 },
  { categoryName: "Work Permit", icon: "🛠️", applicationsCount: 300, revenue: 325000, approvalRate: 74.0 }
];

export default function MonthlyReportsManagement() {
  const [selectedMonth, setSelectedMonth] = useState("July 2026");
  const [monthPreset, setMonthPreset] = useState("Current Month");
  const [searchQuery, setSearchQuery] = useState("");
  const [countryList] = useState<MonthlyCountryRecord[]>(MOCK_MONTHLY_COUNTRIES);
  const [selectedCountry, setSelectedCountry] = useState<MonthlyCountryRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredCountries = countryList.filter(
    (c) =>
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.embassy.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Strategic Executive Insights
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Monthly Report & Analytics
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            High-level monthly performance analytics, application growth trends, monthly revenue breakdown, and embassy processing SLA tracking.
          </p>
        </div>

        {/* MONTH PRESETS & EXPORT CONTROLS */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white/10 border border-white/20 backdrop-blur-md p-1.5 rounded-2xl flex items-center gap-1">
            {["Current Month", "Previous Month", "Q1 2026", "Q2 2026", "YTD 2026"].map((preset) => (
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
            onClick={() => triggerToast("Exporting Executive Monthly PDF Report...")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
          >
            <Download size={14} /> Export PDF Report
          </button>
        </div>
      </div>

      {/* EXECUTIVE STATISTICS CARDS (4 METRICS MATCHING WIREFRAME) */}
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
          <div className="text-3xl font-black text-slate-900 font-mono">4,250</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 mt-2">
            <ArrowUpRight size={14} /> +18.5% MoM Growth
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
          <div className="text-3xl font-black text-slate-900 font-mono">3,580</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 mt-2">
            <TrendingUp size={14} /> 84.2% Monthly Approval Rate
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
          <div className="text-3xl font-black text-slate-900 font-mono">₹88,50,000</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mt-2">
            Visa Fees & Service Charges
          </div>
        </div>

        {/* CARD 4: AVG PROCESSING SLA */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
              Avg Processing SLA
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">3.4 Days</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 mt-2">
            <ArrowDownRight size={14} /> -0.8 Days Faster MoM
          </div>
        </div>
      </div>

      {/* DASHBOARD MIDDLE SECTION: VISA CATEGORY PERFORMANCE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Layers size={16} className="text-[#2563EB]" /> Monthly Visa Category Performance
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_MONTHLY_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {cat.approvalRate}% Approval
                </span>
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">{cat.categoryName}</span>
                <span className="text-xl font-black text-slate-900 font-mono block">{cat.applicationsCount} Apps</span>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex justify-between text-[11px] text-slate-500 font-bold">
                <span>Revenue Generated:</span>
                <span className="font-mono text-slate-900">₹{cat.revenue.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MONTHLY COUNTRY & EMBASSY PERFORMANCE TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-outfit flex items-center gap-2">
              <Globe size={16} className="text-[#2563EB]" /> Country & Embassy SLA Breakdown
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Monthly applications, approval ratios, average SLA days, and target status per destination
            </span>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search country / embassy..."
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
                <th className="py-3 px-4">Country & Embassy</th>
                <th className="py-3 px-4">Total Apps</th>
                <th className="py-3 px-4">Approved</th>
                <th className="py-3 px-4">Rejected</th>
                <th className="py-3 px-4">Avg SLA</th>
                <th className="py-3 px-4">Monthly Revenue</th>
                <th className="py-3 px-4">Target Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCountries.map((c) => (
                <tr key={c.id} className="hover:bg-blue-50/30 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{c.flag}</span>
                      <div>
                        <span className="font-extrabold text-[#0E1A2C] block">{c.country}</span>
                        <span className="text-[10px] text-slate-400">{c.embassy}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{c.totalApplications}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{c.approvedCount}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-red-600">{c.rejectedCount}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{c.avgSlaDays} Days</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">₹{c.revenue.toLocaleString()} ({c.revenueSharePercent}%)</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        c.targetStatus === "Target Exceeded"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : c.targetStatus === "Target Achieved"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {c.targetStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedCountry(c)}
                      className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                      title="View Country Monthly Details"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MONTHLY DETAIL MODAL */}
      {selectedCountry && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedCountry.flag}</span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-blue-600 block">Monthly Country Audit</span>
                  <h3 className="font-extrabold text-base text-slate-900">{selectedCountry.country}</h3>
                </div>
              </div>
              <button onClick={() => setSelectedCountry(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-extrabold block">Total Applications</span>
                <span className="text-lg font-black text-slate-900 font-mono">{selectedCountry.totalApplications}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-extrabold block">Approved Visas</span>
                <span className="text-lg font-black text-emerald-600 font-mono">{selectedCountry.approvedCount}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-extrabold block">Monthly Revenue</span>
                <span className="text-lg font-black text-purple-600 font-mono">₹{selectedCountry.revenue.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-extrabold block">Average SLA</span>
                <span className="text-lg font-black text-blue-600 font-mono">{selectedCountry.avgSlaDays} Days</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedCountry(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
