import React, { useState, useMemo } from "react";
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
import { useReportAnalytics } from "../hooks/useReportAnalytics";
import { useVisa } from "../context/VisaContext";

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

export default function PerformanceReportsManagement() {
  const { data: liveData, loading, refresh } = useReportAnalytics();
  const { applications } = useVisa();

  const [timePeriod, setTimePeriod] = useState("This Month");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [searchQuery, setSearchQuery] = useState("");
  const [staffList] = useState<StaffPerformanceRecord[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffPerformanceRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const totalApps = liveData ? liveData.totalApplications : 0;
  const approvalRate = liveData && totalApps > 0 ? `${liveData.approvalRate.toFixed(1)}%` : "0.0%";
  const verifiedDocsCount = useMemo(() => {
    return applications.reduce((acc, a) => acc + (a.verifiedDocs?.passport === "verified" ? 1 : 0) + (a.verifiedDocs?.photo === "verified" ? 1 : 0), 0);
  }, [applications]);

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
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold flex items-center gap-1.5">
              Staff Productivity &amp; Audit Hub
              {loading && <span className="w-2 h-2 rounded-full bg-blue-300 animate-ping" />}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Performance &amp; Staff Audit
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
            onClick={() => refresh()}
            className="bg-white/10 hover:bg-white/20 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition border border-white/20"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button
            onClick={() => triggerToast("Exporting Staff Performance PDF Evaluation...")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
          >
            <Download size={14} /> Export Performance PDF
          </button>
        </div>
      </div>

      {/* EXECUTIVE STATISTICS CARDS (4 METRICS DYNAMIC) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* CARD 1: OVERALL EFFICIENCY */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              Approval Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
              <Zap size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{approvalRate}</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 mt-2">
            <span>Overall Success Ratio</span>
          </div>
        </div>

        {/* CARD 2: TOTAL PROCESSED */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
              Applications Handled
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileText size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{totalApps.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 mt-2">
            <TrendingUp size={14} /> Database Applications
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
          <div className="text-3xl font-black text-slate-900 font-mono">{verifiedDocsCount}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mt-2">
            Verified Attachments
          </div>
        </div>

        {/* CARD 4: REGISTERED STAFF */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
              Active Officers
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Users size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{staffList.length}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-2">
            Configured Accounts
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
            {staffList.length === 0 ? (
              <div className="py-8 text-center text-slate-400 font-medium text-xs">
                No officer performance leaderboard records in database.
              </div>
            ) : (
              staffList.slice(0, 3).map((stf, idx) => (
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
              ))
            )}
          </div>
        </div>

        {/* DEPARTMENT ACCURACY SUMMARY */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Target size={16} className="text-[#2563EB]" /> Quality &amp; SLA Compliance Overview
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Visa Application Approvals</span>
                <span className="text-emerald-600">{approvalRate}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-emerald-500 h-3 rounded-full" style={{ width: approvalRate }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Documents Verified</span>
                <span className="text-blue-600">{verifiedDocsCount > 0 ? "100.0%" : "0.0%"}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: verifiedDocsCount > 0 ? "100%" : "0%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STAFF PERFORMANCE AUDIT TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-outfit flex items-center gap-2">
              <Users size={16} className="text-[#2563EB]" /> Comprehensive Staff Performance Audit
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Detailed tracking of SLA compliance, throughput, and verified case counts
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs pl-9 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-[#2563EB] w-56 font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-500 bg-slate-50/50">
                <th className="py-3 px-4">Staff Member &amp; ID</th>
                <th className="py-3 px-4">Role &amp; Department</th>
                <th className="py-3 px-4">Handled</th>
                <th className="py-3 px-4">SLA %</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Performance Tier</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    No staff performance audit records found.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((stf) => (
                  <tr key={stf.id} className="hover:bg-blue-50/30 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <span>{stf.staffName}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">{stf.staffId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span>{stf.role}</span>
                      <span className="text-[10px] text-slate-400 block">{stf.department}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{stf.applicationsHandled}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{stf.slaCompliancePercent}%</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{stf.accuracyRatePercent}%</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                        {stf.performanceTier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedStaff(stf)}
                        className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        title="Audit Staff Performance"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
