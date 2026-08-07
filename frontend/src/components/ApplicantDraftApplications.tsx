"use client";

import React, { useState, useMemo } from "react";
import { Application, formatINR } from "../context/VisaContext";
import {
  FileEdit,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  ArrowRight,
  Play,
  Copy,
  Trash2,
  Calendar,
  User,
  Plane,
  Upload,
  CreditCard,
  History,
  Share2,
  HelpCircle,
  Plus,
  Info,
  ShieldCheck,
  FileText,
  Eye,
  RefreshCw,
  ExternalLink
} from "lucide-react";

interface ApplicantDraftApplicationsProps {
  applications: Application[];
  onResumeDraft?: (draftId: string) => void;
  onCreateNewDraft?: () => void;
  onUpdateDocs?: (
    appId: string,
    docKey: keyof Application["verifiedDocs"],
    status: "verified" | "needs_review" | "pending" | "uploading"
  ) => void;
}

export default function ApplicantDraftApplications({
  applications,
  onResumeDraft,
  onCreateNewDraft,
  onUpdateDocs
}: ApplicantDraftApplicationsProps) {
  // Extract draft applications from context or provide rich fallback draft records
  const draftApps = useMemo(() => {
    const drafts = applications.filter((a) => a.status === "Draft");
    if (drafts.length > 0) return drafts;

    // Default rich sample draft applications for full interactive demonstration
    return [
      {
        id: "DFT-2026-8819",
        travelerName: "Geeta Sharma",
        dob: "1995-06-12",
        passportNumber: "Z9817264",
        passportExpiry: "2033-12-20",
        nationality: "India",
        destination: "United Kingdom",
        visaType: "Standard Visitor Visa",
        travelDates: "2026-10-15 to 2026-10-30",
        status: "Draft" as const,
        fees: 18500,
        submissionDate: "05 Aug 2026",
        verifiedDocs: { passport: "verified" as const, photo: "verified" as const, nocLetter: "pending" as const, sponsorLetter: "pending" as const },
        checklist: { employed: true, sponsored: false }
      },
      {
        id: "DFT-2026-7412",
        travelerName: "Rahul Sharma",
        dob: "1992-03-24",
        passportNumber: "P4512981",
        passportExpiry: "2031-08-14",
        nationality: "India",
        destination: "Schengen (France)",
        visaType: "Tourist Short Stay",
        travelDates: "2026-12-01 to 2026-12-15",
        status: "Draft" as const,
        fees: 16200,
        submissionDate: "02 Aug 2026",
        verifiedDocs: { passport: "verified" as const, photo: "needs_review" as const, nocLetter: "pending" as const, sponsorLetter: "pending" as const },
        checklist: { employed: true, sponsored: false }
      },
      {
        id: "DFT-2026-6105",
        travelerName: "Geeta Sharma",
        dob: "1995-06-12",
        passportNumber: "Z9817264",
        passportExpiry: "2033-12-20",
        nationality: "India",
        destination: "Japan",
        visaType: "Short-term Business Visa",
        travelDates: "2026-11-20 to 2026-11-28",
        status: "Draft" as const,
        fees: 9800,
        submissionDate: "28 Jul 2026",
        verifiedDocs: { passport: "pending" as const, photo: "pending" as const },
        checklist: { employed: true, sponsored: true }
      }
    ];
  }, [applications]);

  // State for search, filter & sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"recently_saved" | "completion" | "expiry">("recently_saved");

  // Selected Draft ID for expanded inspector
  const [selectedDraftId, setSelectedDraftId] = useState<string>(draftApps[0]?.id || "DFT-2026-8819");
  
  // Selected Draft object
  const activeDraft = useMemo(() => {
    return draftApps.find((d) => d.id === selectedDraftId) || draftApps[0];
  }, [draftApps, selectedDraftId]);

  // Subtab inside Inspector
  const [inspectorTab, setInspectorTab] = useState<"health" | "personal" | "trip" | "documents" | "pricing" | "history">("health");

  // Document upload simulation state
  const [uploadingDocKey, setUploadingDocKey] = useState<string | null>(null);
  const [docUploadFeedback, setDocUploadFeedback] = useState<string | null>(null);

  // Notes state
  const [draftNotes, setDraftNotes] = useState("Remember to collect official HR stamp on NOC before final submission on Friday.");

  const handleSimulateUpload = (docKey: keyof Application["verifiedDocs"]) => {
    setUploadingDocKey(docKey);
    setTimeout(() => {
      setUploadingDocKey(null);
      setDocUploadFeedback(`Document '${docKey}' uploaded and verified locally in draft.`);
      if (onUpdateDocs && activeDraft) {
        onUpdateDocs(activeDraft.id, docKey, "verified");
      }
      setTimeout(() => setDocUploadFeedback(null), 3500);
    }, 1200);
  };

  // Helper for country flag icons
  const getCountryFlag = (country: string) => {
    const c = country.toLowerCase();
    if (c.includes("uk") || c.includes("united kingdom") || c.includes("britain")) return "🇬🇧";
    if (c.includes("france") || c.includes("schengen")) return "🇫🇷";
    if (c.includes("japan")) return "🇯🇵";
    if (c.includes("canada")) return "🇨🇦";
    if (c.includes("australia")) return "🇦🇺";
    if (c.includes("usa") || c.includes("america")) return "🇺🇸";
    return "🌐";
  };

  // Helper for completion percentage calculation
  const getCompletionPercentage = (draft: Application) => {
    let score = 30; // Base form created
    if (draft.travelerName && draft.passportNumber) score += 25; // Personal details done
    if (draft.destination && draft.travelDates) score += 20; // Trip details done
    if (draft.verifiedDocs) {
      const docs = Object.values(draft.verifiedDocs);
      const verifiedCount = docs.filter((d) => d === "verified").length;
      score += Math.min(25, verifiedCount * 12);
    }
    return Math.min(100, score);
  };

  // Computed Metrics
  const metrics = useMemo(() => {
    const total = draftApps.length;
    const missingDocs = draftApps.filter((d) => {
      const docs = d.verifiedDocs ? Object.values(d.verifiedDocs) : [];
      return docs.includes("pending") || docs.includes("needs_review");
    }).length;
    const readyToSubmit = draftApps.filter((d) => getCompletionPercentage(d) >= 90).length;
    const incompleteDetails = total - readyToSubmit;
    const expiringSoon = 1;
    const avgCompletion = Math.round(
      draftApps.reduce((acc, curr) => acc + getCompletionPercentage(curr), 0) / (total || 1)
    );

    return { total, missingDocs, readyToSubmit, incompleteDetails, expiringSoon, avgCompletion };
  }, [draftApps]);

  // Filtered drafts list
  const filteredDrafts = useMemo(() => {
    return draftApps
      .filter((d) => {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          d.id.toLowerCase().includes(q) ||
          d.destination.toLowerCase().includes(q) ||
          d.visaType.toLowerCase().includes(q) ||
          d.travelerName.toLowerCase().includes(q);

        const matchesCountry = countryFilter === "all" || d.destination.toLowerCase().includes(countryFilter.toLowerCase());

        let matchesStage = true;
        const comp = getCompletionPercentage(d);
        if (stageFilter === "ready") matchesStage = comp >= 90;
        else if (stageFilter === "docs_missing") matchesStage = comp < 90;

        return matchesQ && matchesCountry && matchesStage;
      })
      .sort((a, b) => {
        if (sortBy === "completion") return getCompletionPercentage(b) - getCompletionPercentage(a);
        return b.id.localeCompare(a.id);
      });
  }, [draftApps, searchQuery, countryFilter, stageFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & AUTO-SAVE SYNC BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Applications</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Draft Applications</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Draft Visa Applications</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Auto-Saved & Synced
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Resume, complete, edit details, upload missing document scans, and finalize saved application drafts before consular submission.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onCreateNewDraft && (
            <button
              onClick={onCreateNewDraft}
              className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Start New Application</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: TOP METRIC CARDS GRID (6 CARDS FROM WIREFRAME) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Drafts */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Saved Drafts</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(metrics.total).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">Incomplete forms</span>
        </div>

        {/* Card 2: Incomplete Details */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Incomplete Info</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{String(metrics.incompleteDetails).padStart(2, "0")}</p>
          <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
            <Clock size={10} /> Fields missing
          </span>
        </div>

        {/* Card 3: Missing Documents */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-red-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Missing Documents</p>
          <p className="text-2xl font-black text-red-600 mt-1">{String(metrics.missingDocs).padStart(2, "0")}</p>
          <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1">
            <AlertTriangle size={10} /> Upload required
          </span>
        </div>

        {/* Card 4: Ready to Submit */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Ready to Submit</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{String(metrics.readyToSubmit).padStart(2, "0")}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 size={10} /> 90%+ completed
          </span>
        </div>

        {/* Card 5: Expiring Soon */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Expiring Soon</p>
          <p className="text-2xl font-black text-purple-600 mt-1">{String(metrics.expiringSoon).padStart(2, "0")}</p>
          <span className="text-[10px] text-purple-600 font-medium">&lt; 48 hours remaining</span>
        </div>

        {/* Card 6: Avg Completion Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Avg Completion</p>
          <p className="text-lg font-black text-indigo-600 mt-1.5">{metrics.avgCompletion}%</p>
          <span className="text-[10px] text-slate-400 font-medium">Overall progress</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: ACTIVE DRAFT RESUME HIGHLIGHT BANNER */}
      {/* ============================================================ */}
      {activeDraft && (
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-purple-900/50 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCountryFlag(activeDraft.destination)}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-widest">
                    Saved Draft • {activeDraft.id}
                  </span>
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                    <Clock size={10} /> Expiring in 5 days
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-white">
                  {activeDraft.destination} Visa Draft ({activeDraft.travelerName})
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (onResumeDraft) onResumeDraft(activeDraft.id);
                  else alert(`Resuming draft form wizard for ${activeDraft.id}...`);
                }}
                className="bg-[#4848F7] hover:bg-indigo-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Play size={15} fill="white" />
                <span>Resume Application</span>
              </button>
            </div>
          </div>

          {/* Progress Tracker Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-purple-200">Form Completion Progress:</span>
              <span className="font-black text-amber-300">{getCompletionPercentage(activeDraft)}% Completed</span>
            </div>

            <div className="w-full bg-white/15 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${getCompletionPercentage(activeDraft)}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-300 font-medium">
              <span>Step 1: Personal Info ✓</span>
              <span>Step 2: Trip Details ✓</span>
              <span className="text-amber-300 font-bold">Step 3: Document Scans ⚠️</span>
              <span>Step 4: Consular Fee Settlement</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 4: SEARCH, MULTI-FILTER & SORT CONTROL BAR */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search Draft ID, Country, Passport..."
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
              <option value="all">All Completion Stages</option>
              <option value="ready">Ready to Submit (90%+)</option>
              <option value="docs_missing">Documents Missing</option>
            </select>

            {/* Country Filter */}
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Destinations</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="France">Schengen / France</option>
              <option value="Japan">Japan</option>
              <option value="Canada">Canada</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="recently_saved">Sort: Recently Saved</option>
              <option value="completion">Sort: Completion %</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: DRAFT APPLICATIONS DATA TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileEdit size={16} className="text-[#4848F7]" />
            <span>Saved Drafts Directory ({filteredDrafts.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">Click any row to inspect & complete draft details</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Draft ID</th>
                <th className="py-3 px-4">Country & Flag</th>
                <th className="py-3 px-4">Visa Category</th>
                <th className="py-3 px-4">Last Auto-Saved</th>
                <th className="py-3 px-4">Completion %</th>
                <th className="py-3 px-4">Missing Blockers</th>
                <th className="py-3 px-4">Draft Expiry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredDrafts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Info size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No draft applications found</p>
                    <p className="text-[11px] mt-1">Start a new visa application wizard anytime.</p>
                  </td>
                </tr>
              ) : (
                filteredDrafts.map((d) => {
                  const isSelected = d.id === selectedDraftId;
                  const compPct = getCompletionPercentage(d);
                  return (
                    <tr
                      key={d.id}
                      onClick={() => setSelectedDraftId(d.id)}
                      className={`cursor-pointer transition hover:bg-purple-50/40 ${
                        isSelected ? "bg-purple-50/80 font-semibold" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-purple-700 font-mono flex items-center gap-2">
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />}
                        {d.id}
                      </td>

                      <td className="py-3.5 px-4 text-slate-900 font-semibold">
                        <span className="inline-flex items-center gap-2">
                          <span className="text-base">{getCountryFlag(d.destination)}</span>
                          {d.destination}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">{d.visaType}</td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {d.submissionDate || "05 Aug 2026"}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#4848F7] h-full rounded-full"
                              style={{ width: `${compPct}%` }}
                            />
                          </div>
                          <span className="font-extrabold text-slate-800 text-[11px]">{compPct}%</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {compPct >= 90 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 size={12} /> Ready to Submit
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            <AlertTriangle size={12} /> NOC & Photo Scan
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-purple-700 font-medium">
                        15 Days
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              if (onResumeDraft) onResumeDraft(d.id);
                              else alert(`Resuming draft wizard for ${d.id}...`);
                            }}
                            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded-lg transition text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Play size={11} fill="white" /> Resume
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
      {/* SECTION 6: SELECTED DRAFT DEEP-DIVE INSPECTOR */}
      {/* ============================================================ */}
      {activeDraft && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          
          {/* Top Bar for Inspector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCountryFlag(activeDraft.destination)}</span>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Draft Inspection: {activeDraft.id}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {activeDraft.destination} &bull; {activeDraft.visaType} &bull; Applicant: {activeDraft.travelerName}
                </p>
              </div>
            </div>

            {/* Subtab Navigation */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {[
                { id: "health", label: "Health Audit", icon: ShieldCheck },
                { id: "personal", label: "Personal Data", icon: User },
                { id: "trip", label: "Trip Details", icon: Plane },
                { id: "documents", label: "Document Audit", icon: Upload },
                { id: "pricing", label: "Fee Estimate", icon: CreditCard },
                { id: "history", label: "Auto-Save History", icon: History }
              ].map((t) => {
                const IconComp = t.icon;
                const active = inspectorTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setInspectorTab(t.id as any)}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                      active
                        ? "bg-white text-purple-700 shadow-xs font-bold"
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

          {/* Feedback Alert for Upload */}
          {docUploadFeedback && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{docUploadFeedback}</span>
            </div>
          )}

          {/* SUBTAB 1: HEALTH AUDIT & STEP CHECKLIST */}
          {inspectorTab === "health" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <ShieldCheck size={15} className="text-purple-600" />
                  <span>Draft Readiness & Checklist Status</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="font-bold text-slate-800">1. Applicant Bio & Passport Info</span>
                    <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold text-[11px] border border-emerald-200">
                      COMPLETE ✓
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="font-bold text-slate-800">2. Destination & Itinerary Dates</span>
                    <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold text-[11px] border border-emerald-200">
                      COMPLETE ✓
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="font-bold text-slate-800">3. Document Uploads (NOC & Photo)</span>
                    <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold text-[11px] border border-amber-200">
                      ACTION REQUIRED ⚠️
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="font-bold text-slate-800">4. Consular Fee Payment</span>
                    <span className="text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-semibold text-[11px]">
                      PENDING FINAL STEP
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Clock size={15} className="text-purple-600" />
                  <span>Draft Expiry Risk & Recommendations</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <p className="text-slate-600 leading-relaxed">
                    This draft is auto-saved and synced to your cloud account. It will expire in <strong>15 days</strong> if not submitted to embassy processing pipeline.
                  </p>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 space-y-2 text-purple-900">
                    <p className="font-bold">Next Action to Complete Application:</p>
                    <p className="text-[11px]">
                      Upload your employer NOC letter in the <strong>Document Audit</strong> tab or resume the step-by-step form wizard.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (onResumeDraft) onResumeDraft(activeDraft.id);
                      else alert(`Opening wizard for ${activeDraft.id}...`);
                    }}
                    className="w-full bg-[#4848F7] hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Launch Step-by-Step Form Wizard</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: SAVED PERSONAL DATA */}
          {inspectorTab === "personal" && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <User size={15} className="text-[#4848F7]" />
                <span>Saved Applicant Personal Data</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Full Name</span>
                  <span className="font-bold text-slate-900">{activeDraft.travelerName}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">Passport Number</span>
                  <span className="font-bold text-slate-900 font-mono">{activeDraft.passportNumber}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">Date of Birth</span>
                  <span className="font-semibold text-slate-800">{activeDraft.dob || "12 Jun 1995"}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">Nationality</span>
                  <span className="font-semibold text-slate-800">{activeDraft.nationality}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">Passport Expiry</span>
                  <span className="font-semibold text-slate-800">{activeDraft.passportExpiry || "20 Dec 2033"}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">Employment Type</span>
                  <span className="font-semibold text-slate-800">Salaried (Full Time)</span>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: TRIP DETAILS */}
          {inspectorTab === "trip" && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Plane size={15} className="text-[#4848F7]" />
                <span>Saved Travel & Itinerary Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Destination Country</span>
                  <span className="font-bold text-slate-900">{activeDraft.destination}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">Visa Sub-category</span>
                  <span className="font-bold text-slate-900">{activeDraft.visaType}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">Intended Travel Dates</span>
                  <span className="font-semibold text-slate-800">{activeDraft.travelDates}</span>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 4: DOCUMENT AUDIT & DIRECT UPLOAD */}
          {inspectorTab === "documents" && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Uploaded vs Pending Document Attachments
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Passport */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">Passport Bio Page Scan</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">Uploaded & Saved ✓</p>
                  </div>
                  <button
                    disabled={uploadingDocKey === "passport"}
                    onClick={() => handleSimulateUpload("passport")}
                    className="bg-white hover:bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
                  >
                    {uploadingDocKey === "passport" ? "Uploading..." : "Replace"}
                  </button>
                </div>

                {/* Photo */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">Passport Photograph</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">Uploaded & Saved ✓</p>
                  </div>
                  <button
                    disabled={uploadingDocKey === "photo"}
                    onClick={() => handleSimulateUpload("photo")}
                    className="bg-white hover:bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
                  >
                    {uploadingDocKey === "photo" ? "Uploading..." : "Replace"}
                  </button>
                </div>

                {/* NOC Letter */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-amber-900">Employment NOC Letter</p>
                    <p className="text-[11px] text-amber-700 font-bold">⚠️ Pending Attachment</p>
                  </div>
                  <button
                    disabled={uploadingDocKey === "nocLetter"}
                    onClick={() => handleSimulateUpload("nocLetter")}
                    className="bg-[#4848F7] hover:bg-indigo-700 text-white font-extrabold px-3.5 py-1.5 rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <Upload size={12} />
                    {uploadingDocKey === "nocLetter" ? "Uploading..." : "Upload File"}
                  </button>
                </div>

                {/* Bank Statement */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">Bank Statement (6 Months)</p>
                    <p className="text-[11px] text-slate-500">Optional Supporting Proof</p>
                  </div>
                  <button
                    disabled={uploadingDocKey === "sponsorLetter"}
                    onClick={() => handleSimulateUpload("sponsorLetter")}
                    className="bg-white hover:bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
                  >
                    {uploadingDocKey === "sponsorLetter" ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 5: FEE ESTIMATE */}
          {inspectorTab === "pricing" && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Estimated Fee & Consular Settlement Breakdown
              </h4>

              <div className="space-y-2 text-xs border-b border-slate-200 pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Consular Visa Fee ({activeDraft.destination})</span>
                  <span className="font-bold text-slate-900">₹{formatINR((activeDraft.fees || 18500) * 0.8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Platform Documentation & Verification Charge</span>
                  <span className="font-bold text-slate-900">₹{formatINR((activeDraft.fees || 18500) * 0.15)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Consular Taxes & GST (18%)</span>
                  <span className="font-bold text-slate-900">₹{formatINR((activeDraft.fees || 18500) * 0.05)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-extrabold text-slate-900">
                <span>Total Estimated Amount</span>
                <span className="text-[#4848F7] text-base">₹{formatINR(activeDraft.fees || 18500)}</span>
              </div>
            </div>
          )}

          {/* SUBTAB 6: AUTO-SAVE HISTORY & NOTES */}
          {inspectorTab === "history" && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Auto-Save Log & Personal Applicant Notes
              </h4>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                <p className="font-bold text-slate-800">Auto-Save Cloud Synced</p>
                <p className="text-slate-500">Last synced: 30 seconds ago from Chrome Browser (Desktop)</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Personal Draft Reminder Notes:</label>
                <textarea
                  rows={3}
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#4848F7]"
                />
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 7: DRAFT FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Draft Applications</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">How long will my saved draft remain active?</p>
            <p className="text-slate-600 leading-relaxed">
              Draft applications are safely stored in your account for 30 days before automatic archiving.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Is my draft information saved automatically?</p>
            <p className="text-slate-600 leading-relaxed">
              Yes, any character typed or file attached is auto-synced every 30 seconds to prevent data loss.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
