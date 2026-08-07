"use client";

import React, { useState, useMemo } from "react";
import { Application, formatINR } from "../context/VisaContext";
import {
  Clock,
  ShieldCheck,
  Building,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  User,
  Plane,
  CreditCard,
  MessageSquare,
  Calendar,
  HelpCircle,
  ArrowRight,
  Info,
  RefreshCw,
  Send,
  Zap,
  Check,
  Upload
} from "lucide-react";

interface ApplicantUnderReviewApplicationsProps {
  applications: Application[];
  onSelectAppForTracking?: (appId: string) => void;
  onNavigateSupport?: () => void;
  onUpdateDocs?: (
    appId: string,
    docKey: keyof Application["verifiedDocs"],
    status: "verified" | "needs_review" | "pending" | "uploading"
  ) => void;
}

export default function ApplicantUnderReviewApplications({
  applications,
  onSelectAppForTracking,
  onNavigateSupport,
  onUpdateDocs
}: ApplicantUnderReviewApplicationsProps) {
  // Extract under-review applications from context or provide rich fallback records
  const reviewApps = useMemo(() => {
    const list = applications.filter((a) =>
      ["Submitted", "Embassy Processing", "Docs Uploaded"].includes(a.status)
    );
    if (list.length > 0) return list;

    return [
      {
        id: "VO-2026-1025",
        travelerName: "Geeta Sharma",
        dob: "1995-06-12",
        passportNumber: "Z9817264",
        passportExpiry: "2033-12-20",
        nationality: "India",
        destination: "Canada",
        visaType: "Tourist Visa",
        travelDates: "2026-11-10 to 2026-11-25",
        status: "Embassy Processing" as const,
        fees: 14500,
        submissionDate: "18 Jul 2026",
        verifiedDocs: { passport: "verified" as const, photo: "verified" as const, nocLetter: "needs_review" as const, sponsorLetter: "pending" as const },
        checklist: { employed: true, sponsored: false }
      },
      {
        id: "VO-2026-1104",
        travelerName: "Geeta Sharma",
        dob: "1995-06-12",
        passportNumber: "Z9817264",
        passportExpiry: "2033-12-20",
        nationality: "India",
        destination: "Germany",
        visaType: "Schengen Business Visa",
        travelDates: "2026-12-10 to 2026-12-20",
        status: "Submitted" as const,
        fees: 17200,
        submissionDate: "01 Aug 2026",
        verifiedDocs: { passport: "verified" as const, photo: "verified" as const, nocLetter: "verified" as const, sponsorLetter: "verified" as const },
        checklist: { employed: true, sponsored: false }
      }
    ];
  }, [applications]);

  // State for search, filter & sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"review_start" | "decision_est">("review_start");

  // Selected Under Review App ID for inspector
  const [selectedAppId, setSelectedAppId] = useState<string>(reviewApps[0]?.id || "VO-2026-1025");

  // Active App Object
  const activeApp = useMemo(() => {
    return reviewApps.find((a) => a.id === selectedAppId) || reviewApps[0];
  }, [reviewApps, selectedAppId]);

  // Subtab inside Inspector
  const [inspectorTab, setInspectorTab] = useState<"overview" | "timeline" | "checklist" | "officer" | "updates" | "notes" | "actions">("overview");

  // Officer Chat state in active app
  const [officerMsg, setOfficerMsg] = useState("");
  const [chatLogs, setChatLogs] = useState([
    { id: "1", sender: "Consular Desk #4 (Sarah J.)", text: "Your financial proof has passed automated verification. We are awaiting secondary NOC stamp verification.", time: "18 Jul, 03:00 PM" },
    { id: "2", sender: "Applicant (You)", text: "Understood. The NOC has been re-uploaded with employer seal.", time: "18 Jul, 03:45 PM" }
  ]);

  const handleSendOfficerMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerMsg.trim()) return;
    const newMsg = {
      id: String(Date.now()),
      sender: "Applicant (You)",
      text: officerMsg.trim(),
      time: "Just now"
    };
    setChatLogs((prev) => [...prev, newMsg]);
    setOfficerMsg("");

    setTimeout(() => {
      setChatLogs((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: "Consular Desk #4 (Sarah J.)",
          text: "Message noted. Update will be published in your audit log.",
          time: "Just now"
        }
      ]);
    }, 1200);
  };

  // Country Flag Helper
  const getCountryFlag = (country: string) => {
    const c = country.toLowerCase();
    if (c.includes("canada")) return "🇨🇦";
    if (c.includes("germany")) return "🇩🇪";
    if (c.includes("uk") || c.includes("united kingdom")) return "🇬🇧";
    if (c.includes("australia")) return "🇦🇺";
    if (c.includes("usa") || c.includes("america")) return "🇺🇸";
    if (c.includes("france")) return "🇫🇷";
    return "🌐";
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = reviewApps.length;
    const bgPassed = reviewApps.filter((a) => a.verifiedDocs?.passport === "verified").length;
    const embassyDesk = reviewApps.filter((a) => a.status === "Embassy Processing").length;
    const avgTurnaround = "3 - 5 Days";
    const priorityTier = "Standard Consular";
    const decisionPending = total;

    return { total, bgPassed, embassyDesk, avgTurnaround, priorityTier, decisionPending };
  }, [reviewApps]);

  // Filtered List
  const filteredApps = useMemo(() => {
    return reviewApps
      .filter((a) => {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          a.id.toLowerCase().includes(q) ||
          a.destination.toLowerCase().includes(q) ||
          a.visaType.toLowerCase().includes(q) ||
          a.travelerName.toLowerCase().includes(q);

        const matchesCountry = countryFilter === "all" || a.destination.toLowerCase().includes(countryFilter.toLowerCase());

        let matchesStage = true;
        if (stageFilter === "embassy") matchesStage = a.status === "Embassy Processing";
        else if (stageFilter === "audit") matchesStage = a.status === "Submitted";

        return matchesQ && matchesCountry && matchesStage;
      })
      .sort((a, b) => {
        return b.id.localeCompare(a.id);
      });
  }, [reviewApps, searchQuery, countryFilter, stageFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & LIVE CONSULAR AUDIT STATUS BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Applications</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Under Review</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Applications Under Consular Review</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Under Active Consular Audit
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Track and monitor your visa applications currently undergoing active consular audit, background checks, and embassy evaluation.
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: TOP METRIC CARDS GRID (6 CARDS FROM WIREFRAME) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Under Review */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Under Review</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(metrics.total).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">Active evaluations</span>
        </div>

        {/* Card 2: Background Check Passed */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">BG Check Passed</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{String(metrics.bgPassed).padStart(2, "0")}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <ShieldCheck size={10} /> OCR & Security clear
          </span>
        </div>

        {/* Card 3: Embassy Processing */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Embassy Desk</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{String(metrics.embassyDesk).padStart(2, "0")}</p>
          <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
            <Building size={10} /> Consular Officer assigned
          </span>
        </div>

        {/* Card 4: Avg Turnaround */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Avg Turnaround</p>
          <p className="text-base font-black text-indigo-600 mt-1.5">{metrics.avgTurnaround}</p>
          <span className="text-[10px] text-slate-400 font-medium">Standard SLA</span>
        </div>

        {/* Card 5: Consular Priority */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Consular Priority</p>
          <p className="text-xs font-black text-slate-800 mt-2">{metrics.priorityTier}</p>
          <span className="text-[10px] text-slate-400 font-medium">Standard Queue</span>
        </div>

        {/* Card 6: Decision Pending */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Decision Pending</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{String(metrics.decisionPending).padStart(2, "0")}</p>
          <span className="text-[10px] text-indigo-600 font-medium">Awaiting final stamp</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: UNDER REVIEW CONSULAR FLOW BANNER */}
      {/* ============================================================ */}
      {activeApp && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCountryFlag(activeApp.destination)}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
                    Under Review • {activeApp.id}
                  </span>
                  <span className="bg-white/10 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20">
                    {activeApp.visaType}
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-white">
                  {activeApp.destination} Visa ({activeApp.travelerName})
                </h2>
              </div>
            </div>

            <button
              onClick={() => alert(`Upgrading processing tier for ${activeApp.id} to Express Priority...`)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs px-4 py-2 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Zap size={14} fill="white" />
              <span>Request Priority Speed-Up</span>
            </button>
          </div>

          {/* Progress Gauge Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-indigo-200">Consular Audit Completion:</span>
              <span className="font-black text-amber-300">70% Completed</span>
            </div>

            <div className="w-full bg-white/15 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-indigo-400 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: "70%" }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-300 font-medium">
              <span>Step 1: System Audit ✓</span>
              <span>Step 2: Doc Verification ✓</span>
              <span className="text-amber-300 font-bold">Step 3: Consular Audit ⏳</span>
              <span>Step 4: Visa Grant Stamp</span>
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
              placeholder="Search App ID, Country, Passport..."
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
            {/* Stage Filter */}
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Audit Stages</option>
              <option value="embassy">Embassy Desk Review</option>
              <option value="audit">Initial System Audit</option>
            </select>

            {/* Country Filter */}
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Destinations</option>
              <option value="Canada">Canada</option>
              <option value="Germany">Germany</option>
            </select>

            {/* Export */}
            <button
              onClick={() => alert("Exporting under review status report as PDF/CSV...")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: UNDER REVIEW APPLICATIONS DATA TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Clock size={16} className="text-amber-500" />
            <span>Under Review Directory ({filteredApps.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">Click any row to inspect live audit stream</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Country & Flag</th>
                <th className="py-3 px-4">Visa Category</th>
                <th className="py-3 px-4">Review Start Date</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4">Current Audit Stage</th>
                <th className="py-3 px-4">Audit Health</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Info size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No applications currently under review</p>
                  </td>
                </tr>
              ) : (
                filteredApps.map((a) => {
                  const isSelected = a.id === selectedAppId;
                  return (
                    <tr
                      key={a.id}
                      onClick={() => setSelectedAppId(a.id)}
                      className={`cursor-pointer transition hover:bg-amber-50/40 ${
                        isSelected ? "bg-amber-50/80 font-semibold" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-[#4848F7] font-mono flex items-center gap-2">
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
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
                        {a.submissionDate || "18 Jul 2026"}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        Consular Desk #4 (Sarah J.)
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Embassy Evaluation
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 size={12} /> Normal Audit
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedAppId(a.id)}
                          className="bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#4848F7] text-slate-700 font-bold px-2.5 py-1 rounded-lg transition text-[11px]"
                        >
                          Live Audit
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
      {/* SECTION 6: SELECTED UNDER REVIEW APPLICATION DEEP-DIVE INSPECTOR */}
      {/* ============================================================ */}
      {activeApp && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCountryFlag(activeApp.destination)}</span>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Consular Audit Stream: {activeApp.id}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {activeApp.destination} &bull; {activeApp.visaType} &bull; Traveler: {activeApp.travelerName}
                </p>
              </div>
            </div>

            {/* Inspector Subtabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {[
                { id: "overview", label: "Overview", icon: Info },
                { id: "timeline", label: "Audit Timeline", icon: Clock },
                { id: "checklist", label: "Doc Verification", icon: ShieldCheck },
                { id: "officer", label: "Officer Desk", icon: User },
                { id: "updates", label: "Audit Stream", icon: RefreshCw },
                { id: "notes", label: "Consular Notes", icon: FileText },
                { id: "actions", label: "Shortcuts", icon: Download }
              ].map((t) => {
                const IconComp = t.icon;
                const active = inspectorTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setInspectorTab(t.id as any)}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                      active
                        ? "bg-white text-amber-700 shadow-xs font-bold"
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

          {/* SUBTAB 1: REVIEW OVERVIEW */}
          {inspectorTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <User size={15} className="text-amber-600" />
                  <span>Applicant & Passport Audit Data</span>
                </h4>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">Applicant Name</span>
                    <span className="font-bold text-slate-900">{activeApp.travelerName}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Passport Number</span>
                    <span className="font-bold text-slate-900 font-mono">{activeApp.passportNumber}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Review Start Date</span>
                    <span className="font-semibold text-slate-800">{activeApp.submissionDate || "18 Jul 2026"}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Estimated Decision</span>
                    <span className="font-bold text-emerald-700">23 Jul 2026 (5 Days)</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Building size={15} className="text-amber-600" />
                  <span>Consulate Division Metadata</span>
                </h4>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">Destination Embassy</span>
                    <span className="font-bold text-slate-900">{activeApp.destination} High Commission</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Assigned Desk</span>
                    <span className="font-bold text-slate-900">Consular Desk #4</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Senior Auditor</span>
                    <span className="font-semibold text-slate-800">Sarah Jenkins</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Audit Speed Tier</span>
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      Standard SLA (3-5 Days)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: DETAILED TIMELINE */}
          {inspectorTab === "timeline" && (
            <div className="space-y-6">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Detailed Consular Review Progress Timeline
              </h4>

              <div className="relative pl-6 space-y-6 border-l-2 border-slate-200">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">Initial System Audit & MRZ Verification</span>
                      <span className="text-[11px] text-slate-400">18 Jul 2026, 09:15 AM</span>
                    </div>
                    <p className="text-xs text-slate-600">Passed automated resolution & security scan.</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#4848F7] ring-4 ring-indigo-100" />
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">Financial & Employment Proof Verification</span>
                      <span className="text-[11px] text-slate-400">18 Jul 2026, 11:30 AM</span>
                    </div>
                    <p className="text-xs text-slate-600">Bank statement verified. NOC stamp under verification.</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100 animate-pulse" />
                  <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-amber-900">Embassy Security & Background Evaluation</span>
                      <span className="text-[11px] text-amber-700">In Progress ⏳</span>
                    </div>
                    <p className="text-xs text-amber-800">Under active evaluation by consular officer.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: VERIFICATION CHECKLIST */}
          {inspectorTab === "checklist" && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Consular Document Verification Checklist
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-600" size={20} />
                    <div>
                      <p className="font-bold text-slate-800">Passport Bio Page</p>
                      <p className="text-[11px] text-emerald-600">Passed System Audit ✓</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-600" size={20} />
                    <div>
                      <p className="font-bold text-slate-800">Passport Photograph</p>
                      <p className="text-[11px] text-emerald-600">Passed System Audit ✓</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-600" size={20} />
                    <div>
                      <p className="font-bold text-slate-800">Bank Statement Proof</p>
                      <p className="text-[11px] text-emerald-600">Financial Audit Passed ✓</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="text-amber-600" size={20} />
                    <div>
                      <p className="font-bold text-amber-900">Employment NOC Letter</p>
                      <p className="text-[11px] text-amber-700">Secondary Audit In Progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 4: OFFICER DESK */}
          {inspectorTab === "officer" && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">Senior Visa Auditor</p>
                  <p className="text-slate-600">Sarah Jenkins &bull; Desk #4</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                  ON DESK
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 h-56 overflow-y-auto">
                {chatLogs.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl text-xs max-w-lg space-y-1 ${
                      m.sender.includes("You")
                        ? "bg-[#4848F7] text-white ml-auto"
                        : "bg-white text-slate-800 border border-slate-200 mr-auto"
                    }`}
                  >
                    <div className="flex justify-between items-center gap-3 text-[10px] opacity-80">
                      <span className="font-bold">{m.sender}</span>
                      <span>{m.time}</span>
                    </div>
                    <p className="leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendOfficerMsg} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message to your consular auditor..."
                  value={officerMsg}
                  onChange={(e) => setOfficerMsg(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#4848F7]"
                />
                <button type="submit" className="bg-[#4848F7] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer">
                  <Send size={14} /> Send Note
                </button>
              </form>
            </div>
          )}

          {/* SUBTAB 5: AUDIT STREAM */}
          {inspectorTab === "updates" && (
            <div className="space-y-3 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-slate-500">Live Consular Audit Activity Log</h4>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <p className="font-bold text-slate-900">Background Security Audit Triggered</p>
                <p className="text-slate-600">Embassy automated check initiated.</p>
                <span className="text-[10px] text-slate-400">19 Jul 2026, 01:15 PM</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <p className="font-bold text-slate-900">MRZ Passport Scan Passed</p>
                <p className="text-slate-600">Machine readable zone validated.</p>
                <span className="text-[10px] text-slate-400">18 Jul 2026, 10:00 AM</span>
              </div>
            </div>
          )}

          {/* SUBTAB 6: CONSULAR NOTES */}
          {inspectorTab === "notes" && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-slate-500">Official Consular Officer Notes</h4>
              <p className="text-slate-700 leading-relaxed font-mono bg-white p-4 rounded-xl border border-slate-200">
                "Passport scan clear. Photo dimensions match 35x45mm requirement. Financial bank balance exceeds minimum threshold. Secondary HR seal verification on NOC currently in progress."
              </p>
            </div>
          )}

          {/* SUBTAB 7: ACTION SHORTCUTS */}
          {inspectorTab === "actions" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <button
                onClick={() => alert(`Downloading progress audit report for ${activeApp.id}...`)}
                className="p-4 bg-slate-50 hover:bg-[#EEF2FF] border border-slate-200 rounded-xl text-left space-y-2 transition cursor-pointer"
              >
                <FileText className="text-[#4848F7]" size={24} />
                <p className="font-bold text-slate-900">Download Progress Audit PDF</p>
                <p className="text-slate-500 text-[11px]">Print official status report</p>
              </button>

              <button
                onClick={() => alert(`Downloading fee receipt for ${activeApp.id}...`)}
                className="p-4 bg-slate-50 hover:bg-[#EEF2FF] border border-slate-200 rounded-xl text-left space-y-2 transition cursor-pointer"
              >
                <CreditCard className="text-[#4848F7]" size={24} />
                <p className="font-bold text-slate-900">Payment Invoice PDF</p>
                <p className="text-slate-500 text-[11px]">Download GST tax receipt</p>
              </button>
            </div>
          )}

        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 7: UNDER REVIEW FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Under Review Applications</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">How long does the Under Review stage take?</p>
            <p className="text-slate-600 leading-relaxed">
              Standard review turnaround takes 3 to 5 business days depending on consular workload.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Can I speed up my application review?</p>
            <p className="text-slate-600 leading-relaxed">
              Yes, you can request an Express Priority upgrade from your dashboard.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
