import React, { useState } from "react";
import {
  BarChart3,
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
  Award,
  Star,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle
} from "lucide-react";

export interface StaffPerformanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  role: "Visa Officer" | "Documentation Specialist" | "Consular Liaison" | "Verification Agent";
  department: string;
  applicationsHandled: number;
  slaCompliancePercent: number;
  avgHandlingTimeMins: number;
  accuracyRatePercent: number;
  csatRating: number;
  performanceTier: "Top Performer" | "Exceeds Target" | "On Target" | "Needs Improvement";
  auditNotes: string;
}

const MOCK_STAFF_RECORDS: StaffPerformanceRecord[] = [
  { id: "1", staffId: "STF-901", staffName: "Rahul Sharma", role: "Visa Officer", department: "Canada & US Desk", applicationsHandled: 450, slaCompliancePercent: 98.2, avgHandlingTimeMins: 10.5, accuracyRatePercent: 99.4, csatRating: 4.95, performanceTier: "Top Performer", auditNotes: "Consistently exceeds daily SLA targets with zero document error flags." },
  { id: "2", staffId: "STF-902", staffName: "Priya Patel", role: "Documentation Specialist", department: "Schengen & UK Desk", applicationsHandled: 410, slaCompliancePercent: 96.5, avgHandlingTimeMins: 11.2, accuracyRatePercent: 98.8, csatRating: 4.88, performanceTier: "Exceeds Target", auditNotes: "High verification accuracy and fast applicant document turnaround." },
  { id: "3", staffId: "STF-903", staffName: "Balram Suman", role: "Consular Liaison", department: "Australia & NZ Desk", applicationsHandled: 380, slaCompliancePercent: 94.0, avgHandlingTimeMins: 12.8, accuracyRatePercent: 97.9, csatRating: 4.80, performanceTier: "Exceeds Target", auditNotes: "Strong embassy rapport and accurate biometric verification handling." },
  { id: "4", staffId: "STF-904", staffName: "Sarah Johnston", role: "Verification Agent", department: "Middle East & Asia Desk", applicationsHandled: 320, slaCompliancePercent: 91.5, avgHandlingTimeMins: 14.0, accuracyRatePercent: 96.2, csatRating: 4.72, performanceTier: "On Target", auditNotes: "Steady throughput with good customer communication scores." },
  { id: "5", staffId: "STF-905", staffName: "Ankit Verma", role: "Visa Officer", department: "Student & Work Desk", applicationsHandled: 290, slaCompliancePercent: 88.0, avgHandlingTimeMins: 16.5, accuracyRatePercent: 94.5, csatRating: 4.60, performanceTier: "Needs Improvement", auditNotes: "Recommended for express document verification workflow refresher." }
];

export default function PerformanceReportsManagement() {
  const [timePeriod, setTimePeriod] = useState("This Month");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [searchQuery, setSearchQuery] = useState("");
  const [staffList] = useState<StaffPerformanceRecord[]>(MOCK_STAFF_RECORDS);
  const [selectedStaff, setSelectedStaff] = useState<StaffPerformanceRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredStaff = staffList.filter((stf) => {
    const matchesSearch =
      stf.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stf.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stf.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All Roles" || stf.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
            <Award size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Staff Productivity & Audit Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Performance & Staff Audit
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Evaluate officer productivity, processing SLA compliance, verification accuracy, customer satisfaction (CSAT), and workload distribution.
          </p>
        </div>

        {/* TIME PRESETS & EXPORT CONTROLS */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white/10 border border-white/20 backdrop-blur-md p-1.5 rounded-2xl flex items-center gap-1">
            {["This Month", "Last Month", "Quarter to Date", "Custom Range"].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setTimePeriod(preset);
                  triggerToast(`Loaded performance audit for ${preset}`);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  timePeriod === preset
                    ? "bg-white text-[#2563EB] shadow-md"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          <button
            onClick={() => triggerToast("Exporting Staff Performance PDF Evaluation...")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
          >
            <Download size={14} /> Export Performance PDF
          </button>
        </div>
      </div>

      {/* EXECUTIVE STATISTICS CARDS (4 METRICS MATCHING WIREFRAME) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* CARD 1: OVERALL EFFICIENCY */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              Overall Team Efficiency
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
              <Zap size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">94.8%</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 mt-2">
            <ArrowUpRight size={14} /> SLA Compliance Rate
          </div>
        </div>

        {/* CARD 2: AVG HANDLING TIME */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
              Avg Processing Time
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">12.5 Mins</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 mt-2">
            <TrendingUp size={14} /> Per Visa Application
          </div>
        </div>

        {/* CARD 3: TOTAL DOCUMENTS VERIFIED */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600">
              Documents Verified
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">14,820</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mt-2">
            Zero Compliance Breach
          </div>
        </div>

        {/* CARD 4: CSAT RATING */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
              Avg CSAT Rating
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Star size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">4.85 / 5.0</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-2">
            Based on 1,240 Reviews
          </div>
        </div>
      </div>

      {/* LEADERBOARD & QUALITY METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* TOP PERFORMERS LEADERBOARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Award size={16} className="text-[#2563EB]" /> Top Officer Leaderboard
          </h3>

          <div className="space-y-3">
            {MOCK_STAFF_RECORDS.slice(0, 3).map((stf, idx) => (
              <div key={stf.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm">
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">{stf.staffName}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{stf.role} &bull; {stf.department}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 font-mono block">{stf.slaCompliancePercent}% Efficiency</span>
                  <span className="text-[10px] text-slate-400 font-extrabold">{stf.applicationsHandled} Applications</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACCURACY & COMPLIANCE SUMMARY */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Target size={16} className="text-[#2563EB]" /> Quality & Audit Accuracy
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Document Verification Accuracy Rate</span>
                <span className="text-emerald-600">99.1%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-emerald-500 h-3 rounded-full" style={{ width: "99.1%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Document Rejection Accuracy Rate</span>
                <span className="text-blue-600">98.4%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: "98.4%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Audit Flagged Compliance Cases</span>
                <span className="text-amber-600">0.9%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-amber-500 h-3 rounded-full" style={{ width: "0.9%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED STAFF PERFORMANCE TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-outfit flex items-center gap-2">
              <Users size={16} className="text-[#2563EB]" /> Staff Performance Breakdown
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Individual staff SLA compliance, handling speed, verification accuracy, and CSAT scores
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs px-3 py-1.5 rounded-xl font-bold focus:outline-none focus:border-[#2563EB]"
            >
              <option value="All Roles">All Roles</option>
              <option value="Visa Officer">Visa Officer</option>
              <option value="Documentation Specialist">Documentation Specialist</option>
              <option value="Consular Liaison">Consular Liaison</option>
              <option value="Verification Agent">Verification Agent</option>
            </select>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs pl-9 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-[#2563EB] w-48 font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-500 bg-slate-50/50">
                <th className="py-3 px-4">Staff Name & ID</th>
                <th className="py-3 px-4">Role & Department</th>
                <th className="py-3 px-4">Applications</th>
                <th className="py-3 px-4">SLA Rate</th>
                <th className="py-3 px-4">Avg Speed</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">CSAT</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((stf) => (
                <tr key={stf.id} className="hover:bg-blue-50/30 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-[#0E1A2C] block">{stf.staffName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{stf.staffId}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800 block">{stf.role}</span>
                    <span className="text-[10px] text-slate-400">{stf.department}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{stf.applicationsHandled}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{stf.slaCompliancePercent}%</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{stf.avgHandlingTimeMins} mins</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{stf.accuracyRatePercent}%</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-600">⭐ {stf.csatRating}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        stf.performanceTier === "Top Performer"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : stf.performanceTier === "Exceeds Target"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : stf.performanceTier === "On Target"
                          ? "bg-slate-100 text-slate-700 border-slate-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {stf.performanceTier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedStaff(stf)}
                      className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                      title="View Staff Performance Scorecard"
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

      {/* STAFF SCORECARD MODAL */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-blue-600 block">Performance Scorecard</span>
                <h3 className="font-extrabold text-base text-slate-900">{selectedStaff.staffName} ({selectedStaff.staffId})</h3>
              </div>
              <button onClick={() => setSelectedStaff(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-extrabold block">SLA Compliance</span>
                <span className="text-lg font-black text-emerald-600 font-mono">{selectedStaff.slaCompliancePercent}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-extrabold block">Avg Handling Speed</span>
                <span className="text-lg font-black text-blue-600 font-mono">{selectedStaff.avgHandlingTimeMins} mins</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-extrabold block">Verification Accuracy</span>
                <span className="text-lg font-black text-purple-600 font-mono">{selectedStaff.accuracyRatePercent}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-extrabold block">CSAT Score</span>
                <span className="text-lg font-black text-amber-600 font-mono">⭐ {selectedStaff.csatRating} / 5.0</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl">
              <span className="text-[10px] font-extrabold uppercase text-blue-700 block mb-1">Supervisor Evaluation Notes</span>
              <p className="text-xs text-slate-700 leading-relaxed">{selectedStaff.auditNotes}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedStaff(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
              >
                Close Scorecard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
