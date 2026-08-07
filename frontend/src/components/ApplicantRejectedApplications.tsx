"use client";

import React, { useState, useMemo } from "react";
import { Application, formatINR } from "../context/VisaContext";
import {
  XCircle,
  AlertTriangle,
  RefreshCw,
  FileText,
  Download,
  CheckCircle2,
  RotateCcw,
  Clock,
  ShieldAlert,
  Search,
  Filter,
  Eye,
  User,
  Plane,
  CreditCard,
  Building,
  HelpCircle,
  ArrowRight,
  Info,
  ExternalLink,
  MessageSquare,
  FileCheck,
  Zap,
  Check
} from "lucide-react";

interface ApplicantRejectedApplicationsProps {
  applications: Application[];
  onNavigateApply?: () => void;
  onNavigateSupport?: () => void;
}

export default function ApplicantRejectedApplications({
  applications,
  onNavigateApply,
  onNavigateSupport
}: ApplicantRejectedApplicationsProps) {
  // Extract rejected applications from context or provide rich fallback records
  const rejectedApps = useMemo(() => {
    const list = applications.filter((a) => a.status === "Rejected");
    if (list.length > 0) return list;

    return [
      {
        id: "VO-2026-0912",
        travelerName: "Geeta Sharma",
        dob: "1995-06-12",
        passportNumber: "Z9817264",
        passportExpiry: "2033-12-20",
        nationality: "India",
        destination: "United Kingdom",
        visaType: "Business Visitor Visa",
        travelDates: "02 Jul 2026",
        status: "Rejected" as const,
        fees: 18500,
        submissionDate: "02 Jul 2026",
        reason: "Refusal Clause 4.2: Insufficient proof of employment ties in home country and unverified HR stamp on NOC letter.",
        verifiedDocs: { passport: "verified" as const, photo: "verified" as const, nocLetter: "needs_review" as const, sponsorLetter: "pending" as const },
        checklist: { employed: true, sponsored: false }
      }
    ];
  }, [applications]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // Selected Rejected App ID for Inspector
  const [selectedAppId, setSelectedAppId] = useState<string>(rejectedApps[0]?.id || "VO-2026-0912");

  // Active App Object
  const activeApp = useMemo(() => {
    return rejectedApps.find((a) => a.id === selectedAppId) || rejectedApps[0];
  }, [rejectedApps, selectedAppId]);

  // Subtab inside Inspector
  const [inspectorTab, setInspectorTab] = useState<"summary" | "reason" | "docs" | "remedies" | "payment" | "actions">("reason");

  // Refund simulation state
  const [refundClaimed, setRefundClaimed] = useState(false);

  // Country Flag Helper
  const getCountryFlag = (country: string) => {
    const c = country.toLowerCase();
    if (c.includes("uk") || c.includes("united kingdom") || c.includes("britain")) return "🇬🇧";
    if (c.includes("canada")) return "🇨🇦";
    if (c.includes("australia")) return "🇦🇺";
    if (c.includes("usa") || c.includes("america")) return "🇺🇸";
    if (c.includes("france")) return "🇫🇷";
    return "🌐";
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = rejectedApps.length;
    const eligibleAppeal = total;
    const reapplyRec = total;
    const refundProcessed = refundClaimed ? 1 : 0;
    const avgNotice = "3 Days";
    const appealWindow = "14 Days Remaining";

    return { total, eligibleAppeal, reapplyRec, refundProcessed, avgNotice, appealWindow };
  }, [rejectedApps, refundClaimed]);

  // Filtered List
  const filteredApps = useMemo(() => {
    return rejectedApps
      .filter((a) => {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          a.id.toLowerCase().includes(q) ||
          a.destination.toLowerCase().includes(q) ||
          a.visaType.toLowerCase().includes(q) ||
          (a.reason || "").toLowerCase().includes(q);

        const matchesCountry = countryFilter === "all" || a.destination.toLowerCase().includes(countryFilter.toLowerCase());

        return matchesQ && matchesCountry;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.id.localeCompare(a.id);
        return a.id.localeCompare(b.id);
      });
  }, [rejectedApps, searchQuery, countryFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & CONSULAR REFUSAL BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Applications</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Rejected Applications</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Rejected Visa Applications</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
              <XCircle size={12} className="text-red-600" /> Refusal Statement & Appeal Options
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Review consular decision statements, rejection reason codes, appeal options, re-application guides, and platform fee refund requests.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onNavigateApply && (
            <button
              onClick={onNavigateApply}
              className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={16} />
              <span>Re-Apply New Visa</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: TOP METRIC CARDS GRID (6 CARDS FROM WIREFRAME) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Rejected */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-red-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Rejected</p>
          <p className="text-2xl font-black text-red-600 mt-1">{String(metrics.total).padStart(2, "0")}</p>
          <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1">
            <XCircle size={10} /> Consular refusals
          </span>
        </div>

        {/* Card 2: Eligible for Appeal */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Eligible for Appeal</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{String(metrics.eligibleAppeal).padStart(2, "0")}</p>
          <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
            <Clock size={10} /> {metrics.appealWindow}
          </span>
        </div>

        {/* Card 3: Re-application Recommended */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Re-Apply Recommended</p>
          <p className="text-2xl font-black text-[#4848F7] mt-1">{String(metrics.reapplyRec).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">Fastest resolution</span>
        </div>

        {/* Card 4: Refund Processed */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Refund Processed</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{String(metrics.refundProcessed).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">Platform credit</span>
        </div>

        {/* Card 5: Avg Rejection Notice */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Avg Rejection Notice</p>
          <p className="text-base font-black text-slate-800 mt-1.5">{metrics.avgNotice}</p>
          <span className="text-[10px] text-slate-400 font-medium">Consular dispatch</span>
        </div>

        {/* Card 6: Appeal Window */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Appeal Window</p>
          <p className="text-xs font-black text-amber-600 mt-2">14 Days Open</p>
          <span className="text-[10px] text-slate-400 font-medium">Window closing soon</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CONSULAR REJECTION & APPEAL FLOW BANNER */}
      {/* ============================================================ */}
      {activeApp && (
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 text-white rounded-2xl p-6 shadow-xl border border-red-900/50 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCountryFlag(activeApp.destination)}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-red-300 uppercase tracking-widest">
                    Refusal Notice • {activeApp.id}
                  </span>
                  <span className="bg-red-500/20 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/30 flex items-center gap-1">
                    <AlertTriangle size={10} /> APPEAL WINDOW OPEN (14 DAYS)
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-white">
                  {activeApp.destination} Visa Refused ({activeApp.travelerName})
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  if (onNavigateApply) onNavigateApply();
                  else alert(`Opening re-application wizard for ${activeApp.id}...`);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Re-Apply with Corrected Docs</span>
              </button>

              <button
                onClick={() => alert(`Filing formal consular appeal for ${activeApp.id}...`)}
                className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 transition cursor-pointer"
              >
                <span>File Consular Appeal</span>
              </button>
            </div>
          </div>

          {/* Refusal Reason Summary Box inside Banner */}
          <div className="bg-white/10 border border-white/20 p-4 rounded-xl space-y-1 text-xs">
            <span className="text-red-300 font-mono font-bold block uppercase tracking-wide">Primary Refusal Reason:</span>
            <p className="text-white leading-relaxed">
              {activeApp.reason || "Refusal Clause 4.2: Employment NOC letter lacked clear official HR stamp and proof of ties to home country was deemed insufficient."}
            </p>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 4: SEARCH & MULTI-FILTER CONTROL BAR */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search Refusal ID, Reason, Country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4848F7] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
            {/* Country Filter */}
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Destinations</option>
              <option value="United Kingdom">United Kingdom</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="newest">Sort: Rejection Date Newest</option>
              <option value="oldest">Sort: Rejection Date Oldest</option>
            </select>

            {/* Download Letter */}
            <button
              onClick={() => alert(`Downloading official refusal letter PDF for ${activeApp.id}...`)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Refusal Letter PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: REJECTED APPLICATIONS DATA TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <XCircle size={16} className="text-red-500" />
            <span>Refused Applications Directory ({filteredApps.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">Click any row to inspect refusal reasons & remedy steps</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Country & Flag</th>
                <th className="py-3 px-4">Visa Category</th>
                <th className="py-3 px-4">Rejection Date</th>
                <th className="py-3 px-4">Primary Refusal Reason</th>
                <th className="py-3 px-4">Appeal Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Info size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No rejected applications found</p>
                  </td>
                </tr>
              ) : (
                filteredApps.map((a) => {
                  const isSelected = a.id === selectedAppId;
                  return (
                    <tr
                      key={a.id}
                      onClick={() => setSelectedAppId(a.id)}
                      className={`cursor-pointer transition hover:bg-red-50/40 ${
                        isSelected ? "bg-red-50/80 font-semibold" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-red-700 font-mono flex items-center gap-2">
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-red-600" />}
                        {a.id}
                      </td>

                      <td className="py-3.5 px-4 text-slate-900 font-semibold">
                        <span className="inline-flex items-center gap-2">
                          <span className="text-base">{getCountryFlag(a.destination)}</span>
                          {a.destination}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">{a.visaType}</td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {a.submissionDate || "02 Jul 2026"}
                      </td>

                      <td className="py-3.5 px-4 text-slate-800 font-medium max-w-xs truncate">
                        {a.reason || "Unclear employment NOC stamp"}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <Clock size={12} /> Appeal Eligible
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              if (onNavigateApply) onNavigateApply();
                              else alert(`Re-applying for ${a.id}...`);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded-lg transition text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw size={12} /> Re-Apply
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 6: SELECTED REJECTED APPLICATION DEEP-DIVE INSPECTOR */}
      {/* ============================================================ */}
      {activeApp && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCountryFlag(activeApp.destination)}</span>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Consular Refusal Statement: {activeApp.id}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {activeApp.destination} &bull; {activeApp.visaType} &bull; Applicant: {activeApp.travelerName}
                </p>
              </div>
            </div>

            {/* Subtabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {[
                { id: "reason", label: "Refusal Reason", icon: ShieldAlert },
                { id: "summary", label: "Overview", icon: Info },
                { id: "docs", label: "Doc Audit", icon: FileText },
                { id: "remedies", label: "Remedy Options", icon: RotateCcw },
                { id: "payment", label: "Refund Status", icon: CreditCard },
                { id: "actions", label: "Download Hub", icon: Download }
              ].map((t) => {
                const IconComp = t.icon;
                const active = inspectorTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setInspectorTab(t.id as any)}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                      active
                        ? "bg-white text-red-700 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <IconComp size={14} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUBTAB 1: OFFICIAL REJECTION REASON BREAKDOWN */}
          {inspectorTab === "reason" && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-3 text-xs text-red-950">
                <h4 className="font-extrabold uppercase tracking-wider text-red-800 flex items-center gap-2">
                  <ShieldAlert size={16} className="text-red-600" />
                  <span>Consular Officer Official Refusal Statement</span>
                </h4>

                <p className="leading-relaxed font-mono bg-white p-4 rounded-xl border border-red-200 text-slate-800">
                  "{activeApp.reason || "Refusal Clause 4.2: Insufficient proof of employment ties in home country and unverified HR stamp on NOC letter."}"
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-red-800 pt-1">
                  <span>Refusal Reference Code: REF-UK-2026-0912</span>
                  <span>Consular Division: UK Visas & Immigration</span>
                </div>
              </div>

              {/* Mitigation / Remedy Guidance */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 text-xs">
                <h5 className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#4848F7]" />
                  <span>Consular Specialist Remedy Advice</span>
                </h5>
                <p className="text-slate-600 leading-relaxed">
                  To reverse this refusal, submit an updated <strong>Employment NOC letter on official company letterhead with wet HR signature stamp</strong> and attach your last 6 months payslips.
                </p>
              </div>
            </div>
          )}

          {/* SUBTAB 2: SUMMARY */}
          {inspectorTab === "summary" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 text-xs">
                <h4 className="font-extrabold uppercase tracking-wider text-slate-500">Applicant Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block font-medium">Applicant Name</span>
                    <span className="font-bold text-slate-900">{activeApp.travelerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Passport Number</span>
                    <span className="font-bold text-slate-900 font-mono">{activeApp.passportNumber}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 text-xs">
                <h4 className="font-extrabold uppercase tracking-wider text-slate-500">Destination Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block font-medium">Country</span>
                    <span className="font-bold text-slate-900">{activeApp.destination}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Visa Category</span>
                    <span className="font-bold text-slate-900">{activeApp.visaType}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: DOC AUDIT */}
          {inspectorTab === "docs" && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Submitted Documents Audit Breakdown
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">Passport Bio Page</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">Passed Audit ✓</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">Photograph</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">Passed Audit ✓</p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-red-900">Employment NOC Letter</p>
                    <p className="text-[11px] text-red-600 font-bold">❌ Flagged by Officer (Stamp Unclear)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 4: REMEDY OPTIONS */}
          {inspectorTab === "remedies" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <RotateCcw size={16} className="text-red-600" /> Option 1: Re-Apply
                </h5>
                <p className="text-slate-600 leading-relaxed">
                  Fastest route. Submit fresh form with updated HR-stamped NOC letter.
                </p>
                <button
                  onClick={() => {
                    if (onNavigateApply) onNavigateApply();
                    else alert("Launching re-apply wizard...");
                  }}
                  className="w-full bg-[#4848F7] hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition"
                >
                  Re-Apply Now
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock size={16} className="text-amber-600" /> Option 2: File Appeal
                </h5>
                <p className="text-slate-600 leading-relaxed">
                  Submit formal legal statement to consular review board within 14 days.
                </p>
                <button
                  onClick={() => alert(`Filing appeal for ${activeApp.id}...`)}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded-lg transition"
                >
                  File Consular Appeal
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CreditCard size={16} className="text-emerald-600" /> Option 3: Fee Refund
                </h5>
                <p className="text-slate-600 leading-relaxed">
                  Claim platform convenience fee credit back into your wallet.
                </p>
                <button
                  disabled={refundClaimed}
                  onClick={() => {
                    setRefundClaimed(true);
                    alert("Platform service fee credited back to your wallet!");
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition cursor-pointer"
                >
                  {refundClaimed ? "Refund Claimed ✓" : "Claim Platform Refund"}
                </button>
              </div>
            </div>
          )}

          {/* SUBTAB 5: PAYMENT & REFUND */}
          {inspectorTab === "payment" && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-slate-500">Payment & Refund Ledger</h4>

              <div className="space-y-2 border-b border-slate-200 pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Embassy Consular Visa Fee (Non-refundable)</span>
                  <span className="font-bold text-slate-900">₹{formatINR((activeApp.fees || 18500) * 0.8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Platform Service Charge (Eligible for Refund)</span>
                  <span className="font-bold text-emerald-700">₹{formatINR((activeApp.fees || 18500) * 0.15)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-extrabold text-slate-900">
                <span>Total Settled</span>
                <span className="text-[#4848F7] text-base">₹{formatINR(activeApp.fees || 18500)}</span>
              </div>
            </div>
          )}

          {/* SUBTAB 6: DOWNLOAD HUB */}
          {inspectorTab === "actions" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <button
                onClick={() => alert(`Downloading official refusal letter PDF for ${activeApp.id}...`)}
                className="p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-left space-y-2 transition cursor-pointer"
              >
                <Download className="text-red-600" size={24} />
                <p className="font-bold text-slate-900">Download Refusal Letter PDF</p>
                <p className="text-slate-500 text-[11px]">Official consular decision document</p>
              </button>

              <button
                onClick={() => alert(`Downloading payment receipt for ${activeApp.id}...`)}
                className="p-4 bg-slate-50 hover:bg-[#EEF2FF] border border-slate-200 rounded-xl text-left space-y-2 transition cursor-pointer"
              >
                <CreditCard className="text-[#4848F7]" size={24} />
                <p className="font-bold text-slate-900">Consular Invoice PDF</p>
                <p className="text-slate-500 text-[11px]">Download GST tax receipt</p>
              </button>
            </div>
          )}

        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 7: REJECTED FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Visa Refusals</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Will a visa refusal affect my future applications?</p>
            <p className="text-slate-600 leading-relaxed">
              Addressing the specific refusal reason with fresh documents in your re-application resolves consular concerns.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">How long do I have to file a consular appeal?</p>
            <p className="text-slate-600 leading-relaxed">
              Consular appeals must be submitted within 14 calendar days of receiving the refusal statement.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
