"use client";

import React, { useState, useMemo } from "react";
import { Application, formatINR } from "../context/VisaContext";
import {
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  FileCheck,
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  User,
  Plane,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Calendar,
  HelpCircle,
  ArrowRight,
  Info,
  RefreshCw,
  ExternalLink,
  MapPin,
  Check
} from "lucide-react";

interface ApplicantSubmittedApplicationsProps {
  applications: Application[];
  onSelectAppForTracking?: (appId: string) => void;
  onNavigateSupport?: () => void;
  onUpdateDocs?: (
    appId: string,
    docKey: keyof Application["verifiedDocs"],
    status: "verified" | "needs_review" | "pending" | "uploading"
  ) => void;
}

export default function ApplicantSubmittedApplications({
  applications,
  onSelectAppForTracking,
  onNavigateSupport,
  onUpdateDocs
}: ApplicantSubmittedApplicationsProps) {
  // Extract submitted applications from context or provide rich fallback records
  const submittedApps = useMemo(() => {
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
        submissionDate: "18 Jul 2026, 09:15 AM",
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
        submissionDate: "01 Aug 2026, 02:40 PM",
        verifiedDocs: { passport: "verified" as const, photo: "verified" as const, nocLetter: "verified" as const, sponsorLetter: "verified" as const },
        checklist: { employed: true, sponsored: false }
      },
      {
        id: "VO-2026-0891",
        travelerName: "Rahul Sharma",
        dob: "1992-03-24",
        passportNumber: "P4512981",
        passportExpiry: "2031-08-14",
        nationality: "India",
        destination: "United Kingdom",
        visaType: "Standard Visitor",
        travelDates: "2026-10-01 to 2026-10-15",
        status: "Submitted" as const,
        fees: 18500,
        submissionDate: "25 Jul 2026, 11:00 AM",
        verifiedDocs: { passport: "verified" as const, photo: "verified" as const, nocLetter: "verified" as const },
        checklist: { employed: true, sponsored: false }
      }
    ];
  }, [applications]);

  // State for search, filter & sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // Selected Submitted App ID for inspector
  const [selectedAppId, setSelectedAppId] = useState<string>(submittedApps[0]?.id || "VO-2026-1025");

  // Active App Object
  const activeApp = useMemo(() => {
    return submittedApps.find((a) => a.id === selectedAppId) || submittedApps[0];
  }, [submittedApps, selectedAppId]);

  // Subtab inside Inspector
  const [inspectorTab, setInspectorTab] = useState<"summary" | "timeline" | "docs" | "payment" | "agent" | "updates" | "actions">("summary");

  // Agent Chat state in active submitted app
  const [agentMsg, setAgentMsg] = useState("");
  const [chatLogs, setChatLogs] = useState([
    { id: "1", sender: "Agent (Sarah Jenkins)", text: "Your application files have been submitted and dispatched to the High Commission consular queue.", time: "18 Jul, 02:30 PM" },
    { id: "2", sender: "Applicant (You)", text: "Thank you Sarah! Could you confirm if biometrics interview slot is required?", time: "18 Jul, 03:10 PM" },
    { id: "3", sender: "Agent (Sarah Jenkins)", text: "Biometrics appointment is pre-scheduled for 26 July at VAC New Delhi.", time: "18 Jul, 04:00 PM" }
  ]);

  const handleSendAgentMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentMsg.trim()) return;
    const newMsg = {
      id: String(Date.now()),
      sender: "Applicant (You)",
      text: agentMsg.trim(),
      time: "Just now"
    };
    setChatLogs((prev) => [...prev, newMsg]);
    setAgentMsg("");

    setTimeout(() => {
      setChatLogs((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: "Agent (Sarah Jenkins)",
          text: "Message received. Consular updates will be posted here automatically.",
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
    const total = submittedApps.length;
    const inAudit = submittedApps.filter((a) => a.status === "Submitted").length;
    const dispatched = submittedApps.filter((a) => a.status === "Embassy Processing").length;
    const awaitingDecision = dispatched;
    const avgDispatch = "24 - 48 Hours";
    const queueStatus = "Normal Consular Speed";

    return { total, inAudit, dispatched, awaitingDecision, avgDispatch, queueStatus };
  }, [submittedApps]);

  // Filtered List
  const filteredApps = useMemo(() => {
    return submittedApps
      .filter((a) => {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          a.id.toLowerCase().includes(q) ||
          a.destination.toLowerCase().includes(q) ||
          a.visaType.toLowerCase().includes(q) ||
          a.travelerName.toLowerCase().includes(q);

        const matchesCountry = countryFilter === "all" || a.destination.toLowerCase().includes(countryFilter.toLowerCase());

        let matchesStage = true;
        if (stageFilter === "audit") matchesStage = a.status === "Submitted";
        else if (stageFilter === "embassy") matchesStage = a.status === "Embassy Processing";

        return matchesQ && matchesCountry && matchesStage;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.id.localeCompare(a.id);
        return a.id.localeCompare(b.id);
      });
  }, [submittedApps, searchQuery, countryFilter, stageFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & CONSULAR QUEUE BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Applications</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Submitted Applications</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Submitted Visa Applications</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Submitted & Queued
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Manage, track, and monitor all your submitted visa applications currently queued or dispatched to official consular processing.
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: TOP METRIC CARDS GRID (6 CARDS FROM WIREFRAME) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Submitted */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Submitted</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(metrics.total).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">In active pipeline</span>
        </div>

        {/* Card 2: In Verification Audit */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">In Verification Audit</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{String(metrics.inAudit).padStart(2, "0")}</p>
          <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
            <ShieldCheck size={10} /> AI MRZ Scan done
          </span>
        </div>

        {/* Card 3: Dispatched to Embassy */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Dispatched to Embassy</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{String(metrics.dispatched).padStart(2, "0")}</p>
          <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
            <Building size={10} /> High Commission desk
          </span>
        </div>

        {/* Card 4: Awaiting Decision */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Awaiting Decision</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{String(metrics.awaitingDecision).padStart(2, "0")}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <Clock size={10} /> Turnaround in 5 days
          </span>
        </div>

        {/* Card 5: Avg Dispatch Time */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Avg Dispatch Time</p>
          <p className="text-base font-black text-slate-800 mt-1.5">{metrics.avgDispatch}</p>
          <span className="text-[10px] text-slate-400 font-medium">Fast-track dispatch</span>
        </div>

        {/* Card 6: Queue Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Queue Status</p>
          <p className="text-xs font-black text-emerald-600 mt-2 flex items-center gap-1">
            <CheckCircle2 size={14} /> Normal Speed
          </p>
          <span className="text-[10px] text-slate-400 font-medium">No delays reported</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CONSULAR PROCESSING FLOWCHART BANNER */}
      {/* ============================================================ */}
      {activeApp && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCountryFlag(activeApp.destination)}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-widest">
                    Submitted Application • {activeApp.id}
                  </span>
                  <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                    Decision Expected in 4 Days
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-white">
                  {activeApp.destination} Visa ({activeApp.travelerName})
                </h2>
              </div>
            </div>

            <button
              onClick={() => {
                if (onSelectAppForTracking) onSelectAppForTracking(activeApp.id);
                else alert(`Opening live tracking modal for ${activeApp.id}...`);
              }}
              className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-4 py-2 rounded-xl border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Eye size={14} />
              <span>Track Live Status</span>
            </button>
          </div>

          {/* Consular Flowchart Stepper */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-indigo-200">Consular Submission Pipeline Flowchart:</p>

            <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-semibold">
              <div className="bg-white/10 border border-white/20 p-3 rounded-xl space-y-1">
                <span className="text-emerald-400 block font-bold">Step 1: Submitted ✓</span>
                <span className="text-[10px] text-slate-300 block">{activeApp.submissionDate}</span>
              </div>

              <div className="bg-white/10 border border-white/20 p-3 rounded-xl space-y-1">
                <span className="text-emerald-400 block font-bold">Step 2: AI Doc Audit ✓</span>
                <span className="text-[10px] text-slate-300 block">MRZ & Photo Passed</span>
              </div>

              <div className="bg-amber-400/20 border border-amber-400/40 p-3 rounded-xl space-y-1 text-amber-200">
                <span className="text-amber-300 block font-bold">Step 3: Dispatched 🏛️</span>
                <span className="text-[10px] block">In Embassy Queue</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-1 opacity-60">
                <span className="text-slate-400 block font-bold">Step 4: Consular Decision</span>
                <span className="text-[10px] text-slate-400 block">Pending Grant</span>
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
              <option value="all">All Submitted Stages</option>
              <option value="audit">In Verification Audit</option>
              <option value="embassy">Dispatched to Embassy</option>
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
              <option value="United Kingdom">United Kingdom</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="newest">Sort: Submission Newest</option>
              <option value="oldest">Sort: Submission Oldest</option>
            </select>

            {/* Export Report */}
            <button
              onClick={() => alert("Exporting submitted applications report as PDF/CSV...")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: SUBMITTED APPLICATIONS DATA TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileCheck size={16} className="text-[#4848F7]" />
            <span>Submitted Applications Directory ({filteredApps.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">Click any row to inspect submitted consular audit</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Country & Flag</th>
                <th className="py-3 px-4">Visa Sub-type</th>
                <th className="py-3 px-4">Submission Timestamp</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4">Consular Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Info size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No submitted applications found</p>
                  </td>
                </tr>
              ) : (
                filteredApps.map((a) => {
                  const isSelected = a.id === selectedAppId;
                  return (
                    <tr
                      key={a.id}
                      onClick={() => setSelectedAppId(a.id)}
                      className={`cursor-pointer transition hover:bg-indigo-50/40 ${
                        isSelected ? "bg-[#EEF2FF]/70 font-semibold" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-[#4848F7] font-mono flex items-center gap-2">
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4848F7]" />}
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
                        {a.submissionDate}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        Sarah Jenkins (Senior Auditor)
                      </td>

                      <td className="py-3.5 px-4">
                        {a.status === "Embassy Processing" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Embassy Queue
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <ShieldCheck size={12} /> Verification Audit
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedAppId(a.id)}
                            className="bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#4848F7] text-slate-700 font-bold px-2.5 py-1 rounded-lg transition text-[11px]"
                          >
                            Audit Details
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
      {/* SECTION 6: SELECTED SUBMITTED APPLICATION DEEP-DIVE INSPECTOR */}
      {/* ============================================================ */}
      {activeApp && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCountryFlag(activeApp.destination)}</span>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Consular Submission Audit: {activeApp.id}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {activeApp.destination} &bull; {activeApp.visaType} &bull; Applicant: {activeApp.travelerName}
                </p>
              </div>
            </div>

            {/* Inspector Subtabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {[
                { id: "summary", label: "Overview", icon: Info },
                { id: "timeline", label: "Timeline", icon: Clock },
                { id: "docs", label: "Submitted Docs", icon: FileCheck },
                { id: "payment", label: "Financials", icon: CreditCard },
                { id: "agent", label: "Agent Desk", icon: User },
                { id: "updates", label: "Audit Log", icon: ShieldCheck },
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
                        ? "bg-white text-[#4848F7] shadow-xs font-bold"
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

          {/* SUBTAB 1: SUBMISSION OVERVIEW */}
          {inspectorTab === "summary" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <User size={15} className="text-[#4848F7]" />
                  <span>Applicant & Passport Metadata</span>
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
                    <span className="text-slate-500 font-medium block">Date of Birth</span>
                    <span className="font-semibold text-slate-800">{activeApp.dob || "12 Jun 1995"}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Passport Expiry</span>
                    <span className="font-semibold text-slate-800">{activeApp.passportExpiry || "20 Dec 2033"}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Plane size={15} className="text-[#4848F7]" />
                  <span>Consular Reference Details</span>
                </h4>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">Destination Embassy</span>
                    <span className="font-bold text-slate-900">{activeApp.destination} High Commission</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Visa Sub-category</span>
                    <span className="font-bold text-slate-900">{activeApp.visaType}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Submission Date</span>
                    <span className="font-semibold text-slate-800">{activeApp.submissionDate}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Consular Reference</span>
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      REF-{activeApp.id.replace("VO-", "")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: STEP-BY-STEP TIMELINE */}
          {inspectorTab === "timeline" && (
            <div className="space-y-6">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Live Consular Processing Timeline & History
              </h4>

              <div className="relative pl-6 space-y-6 border-l-2 border-slate-200">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">Application Form & Docs Submitted</span>
                      <span className="text-[11px] text-slate-400">{activeApp.submissionDate}</span>
                    </div>
                    <p className="text-xs text-slate-600">Submitted online. AI OCR verified passport bio page.</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">Document Verification Completed</span>
                      <span className="text-[11px] text-slate-400">18 Jul 2026, 11:30 AM</span>
                    </div>
                    <p className="text-xs text-slate-600">Senior Auditor Sarah Jenkins verified all submitted documents.</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100 animate-pulse" />
                  <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-amber-900">Dispatched to Embassy Processing Pipeline</span>
                      <span className="text-[11px] text-amber-700">19 Jul 2026, 02:00 PM</span>
                    </div>
                    <p className="text-xs text-amber-800">Transmitted securely to embassy consular division.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: SUBMITTED DOCUMENTS AUDIT */}
          {inspectorTab === "docs" && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Submitted Documents & Verification Proof
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="text-emerald-600" size={20} />
                    <div>
                      <p className="font-bold text-slate-800">Passport Bio Page</p>
                      <p className="text-[11px] text-emerald-600">Verified ✓</p>
                    </div>
                  </div>
                  <button onClick={() => alert("Previewing passport scan...")} className="text-[#4848F7] font-bold hover:underline">
                    View
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="text-emerald-600" size={20} />
                    <div>
                      <p className="font-bold text-slate-800">Passport Photograph</p>
                      <p className="text-[11px] text-emerald-600">Verified ✓</p>
                    </div>
                  </div>
                  <button onClick={() => alert("Previewing photograph...")} className="text-[#4848F7] font-bold hover:underline">
                    View
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="text-emerald-600" size={20} />
                    <div>
                      <p className="font-bold text-slate-800">Employment NOC Letter</p>
                      <p className="text-[11px] text-emerald-600">Verified ✓</p>
                    </div>
                  </div>
                  <button onClick={() => alert("Previewing NOC letter...")} className="text-[#4848F7] font-bold hover:underline">
                    View
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="text-emerald-600" size={20} />
                    <div>
                      <p className="font-bold text-slate-800">Bank Statement Proof</p>
                      <p className="text-[11px] text-emerald-600">Verified ✓</p>
                    </div>
                  </div>
                  <button onClick={() => alert("Previewing bank statement...")} className="text-[#4848F7] font-bold hover:underline">
                    View
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 4: FINANCIALS */}
          {inspectorTab === "payment" && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 text-xs">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Consular Settlement & Payment Ledger
              </h4>

              <div className="space-y-2 border-b border-slate-200 pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Consular Visa Fee ({activeApp.destination})</span>
                  <span className="font-bold text-slate-900">₹{formatINR((activeApp.fees || 14500) * 0.8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Documentation & Platform Charge</span>
                  <span className="font-bold text-slate-900">₹{formatINR((activeApp.fees || 14500) * 0.15)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">GST / Taxes (18%)</span>
                  <span className="font-bold text-slate-900">₹{formatINR((activeApp.fees || 14500) * 0.05)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-extrabold text-slate-900">
                <span>Total Amount Paid</span>
                <span className="text-[#4848F7] text-base">₹{formatINR(activeApp.fees || 14500)}</span>
              </div>

              <button
                onClick={() => alert(`Downloading payment receipt for ${activeApp.id}...`)}
                className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-4 py-2 rounded-lg border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={14} />
                <span>Download Consular Tax Invoice PDF</span>
              </button>
            </div>
          )}

          {/* SUBTAB 5: AGENT DESK */}
          {inspectorTab === "agent" && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">Assigned Consular Specialist</p>
                  <p className="text-slate-600">Sarah Jenkins &bull; Senior Visa Auditor</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                  ACTIVE ON DESK
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

              <form onSubmit={handleSendAgentMsg} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message to your visa agent..."
                  value={agentMsg}
                  onChange={(e) => setAgentMsg(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#4848F7]"
                />
                <button type="submit" className="bg-[#4848F7] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer">
                  <Send size={14} /> Send Note
                </button>
              </form>
            </div>
          )}

          {/* SUBTAB 6: AUDIT UPDATES */}
          {inspectorTab === "updates" && (
            <div className="space-y-3 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-slate-500">Real-time Consular Audit Event Log</h4>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <p className="font-bold text-slate-900">Dispatched to High Commission Embassy Queue</p>
                <p className="text-slate-600">Files transmitted via secure encrypted consular API.</p>
                <span className="text-[10px] text-slate-400">19 Jul 2026, 02:00 PM</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <p className="font-bold text-slate-900">Document Verification Passed</p>
                <p className="text-slate-600">Passport, Photo & Financial proofs verified.</p>
                <span className="text-[10px] text-slate-400">18 Jul 2026, 11:30 AM</span>
              </div>
            </div>
          )}

          {/* SUBTAB 7: DOWNLOAD HUB */}
          {inspectorTab === "actions" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <button
                onClick={() => alert(`Downloading submitted application PDF for ${activeApp.id}...`)}
                className="p-4 bg-slate-50 hover:bg-[#EEF2FF] border border-slate-200 rounded-xl text-left space-y-2 transition cursor-pointer"
              >
                <FileText className="text-[#4848F7]" size={24} />
                <p className="font-bold text-slate-900">Submitted Form PDF</p>
                <p className="text-slate-500 text-[11px]">Download official copy</p>
              </button>

              <button
                onClick={() => alert(`Downloading consular payment receipt for ${activeApp.id}...`)}
                className="p-4 bg-slate-50 hover:bg-[#EEF2FF] border border-slate-200 rounded-xl text-left space-y-2 transition cursor-pointer"
              >
                <CreditCard className="text-[#4848F7]" size={24} />
                <p className="font-bold text-slate-900">Payment Invoice PDF</p>
                <p className="text-slate-500 text-[11px]">Download tax receipt</p>
              </button>
            </div>
          )}

        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 7: SUBMITTED FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Submitted Applications</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Can I make edits after submission?</p>
            <p className="text-slate-600 leading-relaxed">
              Once an application is dispatched to embassy processing, details cannot be changed directly. Contact your assigned agent for urgent corrections.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">How do I track my visa decision status?</p>
            <p className="text-slate-600 leading-relaxed">
              Real-time updates are automatically posted in your timeline and notified via email/SMS.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
