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
  AlertCircle
} from "lucide-react";

export interface DailyReportOfficerRecord {
  id: string;
  officerId: string;
  officerName: string;
  role: "Visa Officer" | "Documentation Lead" | "Consular Admin" | "Senior Agent";
  assignedCount: number;
  processedCount: number;
  approvedCount: number;
  rejectedCount: number;
  approvalRate: number;
  avgProcessingTimeMins: number;
  status: "Target Achieved" | "On Track" | "Pending Queue";
}

export interface DailyCountryStat {
  country: string;
  flag: string;
  applicationsCount: number;
  revenue: number;
  approvalRate: number;
}

const MOCK_OFFICER_PERFORMANCE: DailyReportOfficerRecord[] = [
  { id: "1", officerId: "OFF-101", officerName: "Rahul Sharma", role: "Visa Officer", assignedCount: 45, processedCount: 42, approvedCount: 38, rejectedCount: 4, approvalRate: 90.5, avgProcessingTimeMins: 14, status: "Target Achieved" },
  { id: "2", officerId: "OFF-102", officerName: "Priya Patel", role: "Documentation Lead", assignedCount: 40, processedCount: 38, approvedCount: 34, rejectedCount: 4, approvalRate: 89.4, avgProcessingTimeMins: 16, status: "Target Achieved" },
  { id: "3", officerId: "OFF-103", officerName: "Balram Suman", role: "Consular Admin", assignedCount: 35, processedCount: 32, approvedCount: 28, rejectedCount: 4, approvalRate: 87.5, avgProcessingTimeMins: 18, status: "On Track" },
  { id: "4", officerId: "OFF-104", officerName: "Sarah Johnston", role: "Senior Agent", assignedCount: 30, processedCount: 25, approvedCount: 20, rejectedCount: 5, approvalRate: 80.0, avgProcessingTimeMins: 22, status: "Pending Queue" },
  { id: "5", officerId: "OFF-105", officerName: "Ankit Verma", role: "Visa Officer", assignedCount: 25, processedCount: 22, approvedCount: 20, rejectedCount: 2, approvalRate: 90.9, avgProcessingTimeMins: 15, status: "On Track" }
];

const MOCK_COUNTRY_STATS: DailyCountryStat[] = [
  { country: "Canada", flag: "🇨🇦", applicationsCount: 54, revenue: 135000, approvalRate: 92.5 },
  { country: "Australia", flag: "🇦🇺", applicationsCount: 38, revenue: 95000, approvalRate: 88.0 },
  { country: "United Kingdom", flag: "🇬🇧", applicationsCount: 28, revenue: 70000, approvalRate: 85.7 },
  { country: "UAE", flag: "🇦🇪", applicationsCount: 25, revenue: 25000, approvalRate: 96.0 },
  { country: "USA", flag: "🇺🇸", applicationsCount: 20, revenue: 20000, approvalRate: 85.0 }
];

export default function DailyReportsManagement() {
  const [selectedDate, setSelectedDate] = useState("2026-07-26");
  const [datePreset, setDatePreset] = useState("Today");
  const [searchQuery, setSearchQuery] = useState("");
  const [officerList] = useState<DailyReportOfficerRecord[]>(MOCK_OFFICER_PERFORMANCE);
  const [selectedOfficer, setSelectedOfficer] = useState<DailyReportOfficerRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredOfficers = officerList.filter(
    (off) =>
      off.officerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      off.officerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      off.role.toLowerCase().includes(searchQuery.toLowerCase())
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

      {/* HEADER SECTION WITH PRESETS & EXPORT BUTTONS */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-6 rounded-3xl shadow-xl mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-blue-700">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-200 mb-1">
            <BarChart3 size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Operations & Performance Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Daily Report & Operations
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Executive daily summary of visa applications submitted, processed, approved, revenue generated, and officer workloads.
          </p>
        </div>

        {/* DATE PRESETS & EXPORT CONTROLS */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white/10 border border-white/20 backdrop-blur-md p-1.5 rounded-2xl flex items-center gap-1">
            {["Today", "Yesterday", "Last 7 Days", "This Month"].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setDatePreset(preset);
                  triggerToast(`Loaded daily report for ${preset}`);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  datePreset === preset
                    ? "bg-white text-[#2563EB] shadow-md"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          <button
            onClick={() => triggerToast("Exporting Daily Executive PDF Report...")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
          >
            <Download size={14} /> Export PDF Report
          </button>
        </div>
      </div>

      {/* EXECUTIVE STATISTICS CARDS (4 METRICS MATCHING WIREFRAME) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* CARD 1: RECEIVED TODAY */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              Applications Received Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
              <FileText size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">165</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 mt-2">
            <ArrowUpRight size={14} /> +12.4% vs Yesterday
          </div>
        </div>

        {/* CARD 2: VISAS APPROVED TODAY */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
              Visas Approved Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">128</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 mt-2">
            <TrendingUp size={14} /> 77.5% Daily Approval Rate
          </div>
        </div>

        {/* CARD 3: REVENUE GENERATED TODAY */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600">
              Total Revenue Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">₹3,45,000</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mt-2">
            Visa Fees + Service Charge
          </div>
        </div>

        {/* CARD 4: PENDING PROCESSING QUEUE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
              Pending Processing
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">42</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-2">
            Active Processing Queue
          </div>
        </div>
      </div>

      {/* DASHBOARD MIDDLE SECTION: DECISIONS BREAKDOWN & TOP DESTINATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* DAILY DECISIONS BREAKDOWN */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles size={16} className="text-[#2563EB]" /> Daily Decisions Breakdown
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Approved Visas (128)</span>
                <span className="text-emerald-600">70.3%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-emerald-500 h-3 rounded-full" style={{ width: "70.3%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Under Review / Processing (24)</span>
                <span className="text-blue-600">13.2%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: "13.2%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Document Pending (18)</span>
                <span className="text-amber-600">9.9%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-amber-500 h-3 rounded-full" style={{ width: "9.9%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Rejected Applications (12)</span>
                <span className="text-red-600">6.6%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-red-500 h-3 rounded-full" style={{ width: "6.6%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* TOP DESTINATION COUNTRIES TODAY */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe size={16} className="text-[#2563EB]" /> Top Destinations Today
          </h3>

          <div className="space-y-3">
            {MOCK_COUNTRY_STATS.map((c, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">{c.country}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{c.applicationsCount} Applications Today</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 font-mono block">₹{c.revenue.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">{c.approvalRate}% Approval</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OFFICER WORKLOAD & PERFORMANCE TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-outfit flex items-center gap-2">
              <Users size={16} className="text-[#2563EB]" /> Officer & Agent Workload Report
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Daily processing efficiency, approvals, and queue breakdown per officer
            </span>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search officer..."
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
                <th className="py-3 px-4">Officer Name & Role</th>
                <th className="py-3 px-4">Assigned</th>
                <th className="py-3 px-4">Processed</th>
                <th className="py-3 px-4">Approved</th>
                <th className="py-3 px-4">Approval Rate</th>
                <th className="py-3 px-4">Avg Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOfficers.map((off) => (
                <tr key={off.id} className="hover:bg-blue-50/30 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-[#0E1A2C] block">{off.officerName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{off.officerId} &bull; {off.role}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{off.assignedCount}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{off.processedCount}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{off.approvedCount}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{off.approvalRate}%</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{off.avgProcessingTimeMins} mins</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        off.status === "Target Achieved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : off.status === "On Track"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {off.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedOfficer(off)}
                      className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                      title="View Officer Performance Details"
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

      {/* OFFICER DETAIL MODAL */}
      {selectedOfficer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-blue-600 block">Officer Performance Audit</span>
                <h3 className="font-extrabold text-base text-slate-900">{selectedOfficer.officerName}</h3>
              </div>
              <button onClick={() => setSelectedOfficer(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-extrabold block">Assigned Queue</span>
                <span className="text-lg font-black text-slate-900 font-mono">{selectedOfficer.assignedCount}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-extrabold block">Processed Applications</span>
                <span className="text-lg font-black text-blue-600 font-mono">{selectedOfficer.processedCount}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-extrabold block">Visas Approved</span>
                <span className="text-lg font-black text-emerald-600 font-mono">{selectedOfficer.approvedCount}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-extrabold block">Avg Speed</span>
                <span className="text-lg font-black text-purple-600 font-mono">{selectedOfficer.avgProcessingTimeMins} mins</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedOfficer(null)}
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
