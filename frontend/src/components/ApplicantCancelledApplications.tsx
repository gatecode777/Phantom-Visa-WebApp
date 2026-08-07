"use client";

import React, { useState, useMemo } from "react";
import { Application, formatINR } from "../context/VisaContext";
import {
  Ban,
  Clock,
  RotateCcw,
  Wallet,
  FileText,
  Download,
  CheckCircle2,
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
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Calendar,
  AlertCircle
} from "lucide-react";

interface ApplicantCancelledApplicationsProps {
  applications: Application[];
  onNavigateApply?: () => void;
  onNavigatePayments?: () => void;
}

export default function ApplicantCancelledApplications({
  applications,
  onNavigateApply,
  onNavigatePayments
}: ApplicantCancelledApplicationsProps) {
  // Extract cancelled/withdrawn applications or provide rich fallback records
  const cancelledApps = useMemo(() => {
    const list = applications.filter((a) => a.status === "Docs Pending");
    if (list.length > 0) return list;

    return [
      {
        id: "VO-2026-0711",
        travelerName: "Geeta Sharma",
        dob: "1995-06-12",
        passportNumber: "Z9817264",
        passportExpiry: "2033-12-20",
        nationality: "India",
        destination: "Australia",
        visaType: "Tourist Subclass 600",
        travelDates: "15 Aug 2026",
        status: "Docs Pending" as const,
        fees: 14500,
        submissionDate: "12 Aug 2026",
        reason: "Withdrawal requested by applicant due to personal trip postponement.",
        verifiedDocs: { passport: "verified" as const, photo: "verified" as const, nocLetter: "pending" as const },
        checklist: { employed: true, sponsored: false }
      }
    ];
  }, [applications]);

  // State for search & filter
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // Selected Cancelled App ID for Inspector
  const [selectedAppId, setSelectedAppId] = useState<string>(cancelledApps[0]?.id || "VO-2026-0711");

  // Active App Object
  const activeApp = useMemo(() => {
    return cancelledApps.find((a) => a.id === selectedAppId) || cancelledApps[0];
  }, [cancelledApps, selectedAppId]);

  // Subtab inside Inspector
  const [inspectorTab, setInspectorTab] = useState<"overview" | "reason" | "refund" | "docs" | "timeline" | "reinstate" | "actions">("overview");

  // Reinstatement simulation state
  const [reinstated, setReinstated] = useState(false);

  // Country Flag Helper
  const getCountryFlag = (country: string) => {
    const c = country.toLowerCase();
    if (c.includes("australia")) return "🇦🇺";
    if (c.includes("canada")) return "🇨🇦";
    if (c.includes("uk") || c.includes("united kingdom")) return "🇬🇧";
    if (c.includes("germany")) return "🇩🇪";
    return "🌐";
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = cancelledApps.length;
    const byApplicant = total;
    const bySystem = 0;
    const refundProcessed = total;
    const reinstateEligible = reinstated ? 0 : total;
    const avgCancelTime = "Immediate (< 2h)";

    return { total, byApplicant, bySystem, refundProcessed, reinstateEligible, avgCancelTime };
  }, [cancelledApps, reinstated]);

  // Filtered List
  const filteredApps = useMemo(() => {
    return cancelledApps
      .filter((a) => {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          a.id.toLowerCase().includes(q) ||
          a.destination.toLowerCase().includes(q) ||
          a.visaType.toLowerCase().includes(q) ||
          a.travelerName.toLowerCase().includes(q);

        const matchesCountry = countryFilter === "all" || a.destination.toLowerCase().includes(countryFilter.toLowerCase());

        return matchesQ && matchesCountry;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.id.localeCompare(a.id);
        return a.id.localeCompare(b.id);
      });
  }, [cancelledApps, searchQuery, countryFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & CANCELLATION STATUS BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Applications</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Cancelled Applications</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Cancelled & Withdrawn Visas</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              <Ban size={12} className="text-slate-500" /> Processing Stopped & Refunded
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            View and manage your cancelled or withdrawn visa applications, wallet refund status, and application reinstatement options.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onNavigatePayments && (
            <button
              onClick={onNavigatePayments}
              className="bg-slate-100 hover:bg-[#EEF2FF] text-[#4848F7] font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition flex items-center gap-2 cursor-pointer"
            >
              <Wallet size={16} />
              <span>View Wallet Ledger</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: TOP METRIC CARDS GRID (6 CARDS FROM WIREFRAME) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Cancelled */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Cancelled</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(metrics.total).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">Withdrawn applications</span>
        </div>

        {/* Card 2: Cancelled by Applicant */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-slate-400">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">By Applicant</p>
          <p className="text-2xl font-black text-slate-700 mt-1">{String(metrics.byApplicant).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
            <User size={10} /> User requested
          </span>
        </div>

        {/* Card 3: Cancelled by System */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">By System</p>
          <p className="text-2xl font-black text-slate-600 mt-1">{String(metrics.bySystem).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">Consular timeout</span>
        </div>

        {/* Card 4: Refund Processed */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Refund Processed</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{String(metrics.refundProcessed).padStart(2, "0")}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <Wallet size={10} /> Credited to wallet
          </span>
        </div>

        {/* Card 5: Reinstatement Eligible */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Reinstate Eligible</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{String(metrics.reinstateEligible).padStart(2, "0")}</p>
          <span className="text-[10px] text-indigo-600 font-medium">Restorable anytime</span>
        </div>

        {/* Card 6: Avg Cancellation Time */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Avg Cancel Time</p>
          <p className="text-xs font-black text-slate-800 mt-2">{metrics.avgCancelTime}</p>
          <span className="text-[10px] text-slate-400 font-medium">Instant stop</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CANCELLATION & REFUND FLOWCHART BANNER */}
      {/* ============================================================ */}
      {activeApp && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-700/50 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCountryFlag(activeApp.destination)}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                    Cancelled Application • {activeApp.id}
                  </span>
                  <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                    <Wallet size={10} /> ₹{formatINR(activeApp.fees || 14500)} REFUND CREDITED
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-white">
                  {activeApp.destination} Visa ({activeApp.travelerName})
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                disabled={reinstated}
                onClick={() => {
                  setReinstated(true);
                  alert(`Reinstating application ${activeApp.id} back to active submitted status!`);
                }}
                className="bg-[#4848F7] hover:bg-indigo-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>{reinstated ? "Application Reinstated ✓" : "Re-Activate Application"}</span>
              </button>
            </div>
          </div>

          {/* Flowchart Stepper */}
          <div className="space-y-2 text-xs">
            <span className="text-slate-300 font-semibold">Cancellation Lifecycle Flow:</span>
            <div className="grid grid-cols-4 gap-2 text-center font-medium">
              <div className="bg-white/10 p-2.5 rounded-xl text-slate-300">
                1. Form Submitted ✓
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl text-slate-300">
                2. Cancel Requested ✓
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl text-slate-300">
                3. Consular Stopped ✓
              </div>
              <div className="bg-emerald-500/20 border border-emerald-400/30 p-2.5 rounded-xl text-emerald-300 font-bold">
                4. Wallet Refund Settled ✓
              </div>
            </div>
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
              placeholder="Search App ID, Country, Reason..."
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
              <option value="Australia">Australia</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="newest">Sort: Cancellation Newest</option>
              <option value="oldest">Sort: Cancellation Oldest</option>
            </select>

            {/* Export */}
            <button
              onClick={() => alert(`Downloading cancellation receipt for ${activeApp.id}...`)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Receipt PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: CANCELLED APPLICATIONS DATA TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Ban size={16} className="text-slate-500" />
            <span>Cancelled Applications Directory ({filteredApps.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">Click any row to view refund & reinstatement details</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Country & Flag</th>
                <th className="py-3 px-4">Visa Category</th>
                <th className="py-3 px-4">Cancellation Timestamp</th>
                <th className="py-3 px-4">Cancelled By</th>
                <th className="py-3 px-4">Refund Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Info size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No cancelled applications found</p>
                  </td>
                </tr>
              ) : (
                filteredApps.map((a) => {
                  const isSelected = a.id === selectedAppId;
                  return (
                    <tr
                      key={a.id}
                      onClick={() => setSelectedAppId(a.id)}
                      className={`cursor-pointer transition hover:bg-slate-50/80 ${
                        isSelected ? "bg-slate-100 font-semibold" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-800 font-mono flex items-center gap-2">
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />}
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
                        {a.submissionDate || "12 Aug 2026"}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        Applicant Request
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Wallet size={12} /> Refund Settled
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedAppId(a.id)}
                          className="bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#4848F7] text-slate-700 font-bold px-2.5 py-1 rounded-lg transition text-[11px]"
                        >
                          Details
                        </button>
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
      {/* SECTION 6: SELECTED CANCELLED APPLICATION DEEP-DIVE INSPECTOR */}
      {/* ============================================================ */}
      {activeApp && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCountryFlag(activeApp.destination)}</span>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Cancelled Application Inspector: {activeApp.id}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {activeApp.destination} &bull; {activeApp.visaType} &bull; Applicant: {activeApp.travelerName}
                </p>
              </div>
            </div>

            {/* Subtabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {[
                { id: "overview", label: "Overview", icon: Info },
                { id: "reason", label: "Cancellation Reason", icon: FileText },
                { id: "refund", label: "Wallet Refund", icon: Wallet },
                { id: "docs", label: "Archived Docs", icon: ShieldCheck },
                { id: "timeline", label: "Lifecycle", icon: Clock },
                { id: "reinstate", label: "Reinstatement", icon: RotateCcw },
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
                        ? "bg-white text-slate-900 shadow-xs font-bold"
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

          {/* SUBTAB 1: OVERVIEW */}
          {inspectorTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <h4 className="font-extrabold uppercase tracking-wider text-slate-500">Cancellation Reference</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block font-medium">Application ID</span>
                    <span className="font-bold text-slate-900 font-mono">{activeApp.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Refund Reference ID</span>
                    <span className="font-bold text-emerald-700 font-mono">RFD-2026-0711</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <h4 className="font-extrabold uppercase tracking-wider text-slate-500">Applicant Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block font-medium">Traveler Name</span>
                    <span className="font-bold text-slate-900">{activeApp.travelerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Passport Number</span>
                    <span className="font-bold text-slate-900 font-mono">{activeApp.passportNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: REASON */}
          {inspectorTab === "reason" && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-slate-500">Withdrawal Reason Statement</h4>
              <p className="text-slate-800 leading-relaxed font-mono bg-white p-4 rounded-xl border border-slate-200">
                "{activeApp.reason || "Traveler requested application withdrawal due to personal schedule change before embassy submission."}"
              </p>
            </div>
          )}

          {/* SUBTAB 3: REFUND LEDGER */}
          {inspectorTab === "refund" && (
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 space-y-4 text-xs text-emerald-950">
              <h4 className="font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                <Wallet size={16} className="text-emerald-600" />
                <span>Wallet Refund Settlement Proof</span>
              </h4>

              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-emerald-200">
                <div>
                  <span className="text-slate-500 block">Refund Amount Credited</span>
                  <span className="text-xl font-black text-emerald-600">₹{formatINR(activeApp.fees || 14500)}</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                  CREDITED TO WALLET ✓
                </span>
              </div>
            </div>
          )}

          {/* SUBTAB 4: ARCHIVED DOCS */}
          {inspectorTab === "docs" && (
            <div className="space-y-4 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-slate-500">Archived Submitted Documents</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <span className="font-bold text-slate-800">Passport Bio Page (Archived)</span>
                  <span className="text-slate-500 font-medium">Stored Safely ✓</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <span className="font-bold text-slate-800">Photograph (Archived)</span>
                  <span className="text-slate-500 font-medium">Stored Safely ✓</span>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 5: TIMELINE */}
          {inspectorTab === "timeline" && (
            <div className="space-y-6 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-slate-500">Cancellation Lifecycle History</h4>
              <div className="relative pl-6 space-y-6 border-l-2 border-slate-300">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-400" />
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900">Application Submitted</span>
                    <p className="text-slate-600">{activeApp.submissionDate}</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-1 text-emerald-950">
                    <span className="font-bold">Withdrawal Processed & Refund Credited</span>
                    <p className="text-emerald-800">Processing stopped and fee returned to wallet.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 6: REINSTATEMENT */}
          {inspectorTab === "reinstate" && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-slate-500">Reinstatement & Re-Activation</h4>
              <p className="text-slate-600 leading-relaxed">
                You can restore this application back to active submitted status without re-uploading documents or re-entering personal data.
              </p>
              <button
                disabled={reinstated}
                onClick={() => {
                  setReinstated(true);
                  alert(`Reinstating ${activeApp.id}...`);
                }}
                className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer"
              >
                {reinstated ? "Reinstated ✓" : "Reinstate Application Now"}
              </button>
            </div>
          )}

          {/* SUBTAB 7: ACTION SHORTCUTS */}
          {inspectorTab === "actions" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <button
                onClick={() => alert(`Downloading cancellation statement for ${activeApp.id}...`)}
                className="p-4 bg-slate-50 hover:bg-[#EEF2FF] border border-slate-200 rounded-xl text-left space-y-2 transition cursor-pointer"
              >
                <Download className="text-[#4848F7]" size={24} />
                <p className="font-bold text-slate-900">Download Cancellation Statement PDF</p>
              </button>

              <button
                onClick={() => alert(`Downloading wallet refund receipt for ${activeApp.id}...`)}
                className="p-4 bg-slate-50 hover:bg-[#EEF2FF] border border-slate-200 rounded-xl text-left space-y-2 transition cursor-pointer"
              >
                <Wallet className="text-emerald-600" size={24} />
                <p className="font-bold text-slate-900">Download Wallet Refund Receipt</p>
              </button>
            </div>
          )}

        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 7: CANCELLED FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Cancelled Applications</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Can I reactivate a cancelled application?</p>
            <p className="text-slate-600 leading-relaxed">
              Yes, you can click "Reinstate Application" to restore your saved data and resume submission.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">How long does a wallet refund take?</p>
            <p className="text-slate-600 leading-relaxed">
              Wallet refunds for cancelled applications are processed immediately upon withdrawal request.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
