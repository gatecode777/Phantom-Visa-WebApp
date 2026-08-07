"use client";

import React, { useState, useMemo } from "react";
import { Application, formatINR } from "../context/VisaContext";
import {
  Search,
  Filter,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Upload,
  Calendar,
  CreditCard,
  User,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Send,
  HelpCircle,
  Printer,
  ExternalLink,
  RefreshCw,
  FileCheck,
  ArrowRight,
  Eye,
  Info,
  Check,
  Building,
  Plane,
  FilePlus,
  Briefcase
} from "lucide-react";

interface ApplicantAllApplicationsProps {
  applications: Application[];
  onSelectAppForTracking?: (appId: string) => void;
  onNavigateApply?: () => void;
  onNavigateSupport?: () => void;
  onUpdateDocs?: (appId: string, docKey: keyof Application["verifiedDocs"], status: "verified" | "needs_review" | "pending" | "uploading") => void;
}

export default function ApplicantAllApplications({
  applications,
  onSelectAppForTracking,
  onNavigateApply,
  onNavigateSupport,
  onUpdateDocs
}: ApplicantAllApplicationsProps) {
  // State for search, filtering, and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [visaTypeFilter, setVisaTypeFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "status">("newest");
  
  // Selected Application ID for expanded deep-dive inspection
  const [selectedAppId, setSelectedAppId] = useState<string>(
    applications[0]?.id || "VO-2026-1025"
  );
  
  // Selected Application object
  const activeApp = useMemo(() => {
    return applications.find((a) => a.id === selectedAppId) || applications[0] || {
      id: "VO-2026-1025",
      travelerName: "Geeta Sharma",
      dob: "1995-06-12",
      passportNumber: "Z9817264",
      passportExpiry: "2033-12-20",
      nationality: "India",
      destination: "Canada",
      visaType: "Tourist Visa",
      travelDates: "2026-11-10 to 2026-11-25",
      status: "Embassy Processing",
      fees: 14500,
      submissionDate: "18 Jul 2026",
      verifiedDocs: { passport: "verified", photo: "verified", nocLetter: "needs_review", sponsorLetter: "pending" },
      checklist: { employed: true, sponsored: false }
    };
  }, [applications, selectedAppId]);

  // Tab inside deep-dive detail inspector
  const [detailTab, setDetailTab] = useState<"overview" | "timeline" | "documents" | "payment" | "communication" | "actions">("overview");

  // Document upload simulation state inside active app
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [docUploadSuccess, setDocUploadSuccess] = useState<string | null>(null);

  // Agent Chat state in active app
  const [agentMsg, setAgentMsg] = useState("");
  const [agentChatLogs, setAgentChatLogs] = useState([
    { id: "1", sender: "Agent (Sarah J.)", text: "Hello Geeta, your passport copy is verified. Please re-upload a clearer scan of your employment NOC letter.", time: "18 Jul, 10:30 AM" },
    { id: "2", sender: "Applicant (You)", text: "Sure, I am scanning the stamped NOC from HR right away.", time: "18 Jul, 11:15 AM" }
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
    setAgentChatLogs((prev) => [...prev, newMsg]);
    setAgentMsg("");
    
    // Auto simulated response
    setTimeout(() => {
      setAgentChatLogs((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: "Agent (Sarah J.)",
          text: "Thank you for the update. Our team is auditing the document now.",
          time: "Just now"
        }
      ]);
    }, 1200);
  };

  const handleSimulateDocUpload = (docKey: keyof Application["verifiedDocs"]) => {
    setUploadingDoc(docKey);
    setTimeout(() => {
      setUploadingDoc(null);
      setDocUploadSuccess(`Successfully uploaded and submitted ${docKey} for verification.`);
      if (onUpdateDocs && activeApp) {
        onUpdateDocs(activeApp.id, docKey, "verified");
      }
      setTimeout(() => setDocUploadSuccess(null), 4000);
    }, 1200);
  };

  // Helper for country flags
  const getCountryFlag = (country: string) => {
    const c = country.toLowerCase();
    if (c.includes("canada")) return "🇨🇦";
    if (c.includes("australia")) return "🇦🇺";
    if (c.includes("uk") || c.includes("united kingdom") || c.includes("britain")) return "🇬🇧";
    if (c.includes("usa") || c.includes("united states") || c.includes("america")) return "🇺🇸";
    if (c.includes("france")) return "🇫🇷";
    if (c.includes("germany")) return "🇩🇪";
    if (c.includes("japan")) return "🇯🇵";
    if (c.includes("singapore")) return "🇸🇬";
    if (c.includes("uae") || c.includes("dubai")) return "🇦🇪";
    return "🌐";
  };

  // Status Badge Styling Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Rejected
          </span>
        );
      case "Embassy Processing":
      case "Submitted":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Under Review
          </span>
        );
      case "Docs Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <AlertTriangle size={12} className="text-purple-600" /> Docs Required
          </span>
        );
      case "Draft":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400" /> Draft
          </span>
        );
    }
  };

  // Doc Verification Pill Helper
  const getDocVerificationBadge = (docs?: Application["verifiedDocs"]) => {
    if (!docs) return <span className="text-xs text-slate-400">Standard</span>;
    const vals = Object.values(docs);
    const hasNeedsReview = vals.includes("needs_review");
    const hasPending = vals.includes("pending");
    const allVerified = vals.every((v) => v === "verified");

    if (allVerified) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <CheckCircle2 size={12} /> All Verified
        </span>
      );
    }
    if (hasNeedsReview) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200 animate-pulse">
          <AlertTriangle size={12} /> Action Needed
        </span>
      );
    }
    if (hasPending) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
          <Clock size={12} /> Verification Pending
        </span>
      );
    }
    return <span className="text-xs text-slate-500">In Audit</span>;
  };

  // Metric Computations
  const metrics = useMemo(() => {
    const total = applications.length;
    const underReview = applications.filter((a) => ["Submitted", "Embassy Processing"].includes(a.status)).length;
    const approved = applications.filter((a) => a.status === "Approved").length;
    const rejected = applications.filter((a) => a.status === "Rejected").length;
    const drafts = applications.filter((a) => a.status === "Draft").length;
    const actionRequired = applications.filter((a) => 
      a.status === "Docs Pending" || 
      (a.verifiedDocs && Object.values(a.verifiedDocs).includes("needs_review"))
    ).length;

    return { total, underReview, approved, rejected, drafts, actionRequired, avgDays: "5 - 7 Days" };
  }, [applications]);

  // Filtered Applications List
  const filteredApps = useMemo(() => {
    return applications
      .filter((app) => {
        // Search query
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          app.id.toLowerCase().includes(q) ||
          app.destination.toLowerCase().includes(q) ||
          app.visaType.toLowerCase().includes(q) ||
          app.travelerName.toLowerCase().includes(q) ||
          app.passportNumber.toLowerCase().includes(q);

        // Status Filter
        let matchesStatus = true;
        if (statusFilter !== "all") {
          if (statusFilter === "under_review") matchesStatus = ["Submitted", "Embassy Processing"].includes(app.status);
          else if (statusFilter === "action_required") matchesStatus = app.status === "Docs Pending" || (app.verifiedDocs && Object.values(app.verifiedDocs).includes("needs_review"));
          else matchesStatus = app.status === statusFilter;
        }

        // Visa Type Filter
        const matchesVisaType = visaTypeFilter === "all" || app.visaType.toLowerCase().includes(visaTypeFilter.toLowerCase());

        // Country Filter
        const matchesCountry = countryFilter === "all" || app.destination.toLowerCase().includes(countryFilter.toLowerCase());

        return matchesQuery && matchesStatus && matchesVisaType && matchesCountry;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.id.localeCompare(a.id);
        if (sortBy === "oldest") return a.id.localeCompare(b.id);
        return a.status.localeCompare(b.status);
      });
  }, [applications, searchQuery, statusFilter, visaTypeFilter, countryFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & BREADCRUMB BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Applications</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">All Applications</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">All Visa Applications</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Manage & track all your visa applications, submission history, real-time embassy processing timelines, document status, and communication logs in one place.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onNavigateApply && (
            <button
              onClick={onNavigateApply}
              className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <FilePlus size={16} />
              <span>Apply New Visa</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: TOP METRIC CARDS GRID (7 CARDS FROM WIREFRAME) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Card 1: Total */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Applications</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(metrics.total).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">All logged submissions</span>
        </div>

        {/* Card 2: Under Review */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Under Review</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{String(metrics.underReview).padStart(2, "0")}</p>
          <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
            <Clock size={10} /> Active processing
          </span>
        </div>

        {/* Card 3: Action Required */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-red-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Action Required</p>
          <p className="text-2xl font-black text-red-600 mt-1">{String(metrics.actionRequired).padStart(2, "0")}</p>
          <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1">
            <AlertTriangle size={10} /> Upload docs pending
          </span>
        </div>

        {/* Card 4: Approved Visas */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Approved Visas</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{String(metrics.approved).padStart(2, "0")}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 size={10} /> E-Visa ready
          </span>
        </div>

        {/* Card 5: Rejected */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Rejected</p>
          <p className="text-2xl font-black text-slate-700 mt-1">{String(metrics.rejected).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">Consular decisions</span>
        </div>

        {/* Card 6: Avg Processing Time */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Avg Processing</p>
          <p className="text-lg font-black text-indigo-600 mt-1.5">{metrics.avgDays}</p>
          <span className="text-[10px] text-slate-400 font-medium">Standard turnaround</span>
        </div>

        {/* Card 7: Drafts */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Drafts</p>
          <p className="text-2xl font-black text-slate-600 mt-1">{String(metrics.drafts).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">Saved forms</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: ACTIVE APPLICATION PRIORITY BANNER & STEPPER */}
      {/* ============================================================ */}
      {activeApp && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCountryFlag(activeApp.destination)}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-widest">
                    Active Application • {activeApp.id}
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

            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-[11px] text-slate-400 font-medium">Submission Date</p>
                <p className="text-xs font-bold text-white">{activeApp.submissionDate || "18 Jul 2026"}</p>
              </div>
              <button
                onClick={() => setSelectedAppId(activeApp.id)}
                className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl border border-white/20 transition cursor-pointer flex items-center gap-1.5"
              >
                <Eye size={14} />
                <span>View Full Audit</span>
              </button>
            </div>
          </div>

          {/* Stepper Timeline Bar */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-indigo-200">Consular Lifecycle Timeline Progress:</p>
            <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-semibold">
              <div className="space-y-1">
                <div className="h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 size={12} /> Form Submitted
                </span>
              </div>

              <div className="space-y-1">
                <div className={`h-2 rounded-full ${activeApp.status !== "Draft" ? "bg-emerald-500" : "bg-white/20"}`} />
                <span className={activeApp.status !== "Draft" ? "text-emerald-400 flex items-center justify-center gap-1" : "text-slate-400"}>
                  <ShieldCheck size={12} /> Doc Verification
                </span>
              </div>

              <div className="space-y-1">
                <div className={`h-2 rounded-full ${["Embassy Processing", "Approved"].includes(activeApp.status) ? "bg-amber-400 animate-pulse" : "bg-white/20"}`} />
                <span className={["Embassy Processing", "Approved"].includes(activeApp.status) ? "text-amber-300 font-bold flex items-center justify-center gap-1" : "text-slate-400"}>
                  <Building size={12} /> Embassy Audit
                </span>
              </div>

              <div className="space-y-1">
                <div className={`h-2 rounded-full ${activeApp.status === "Approved" ? "bg-emerald-500" : "bg-white/20"}`} />
                <span className={activeApp.status === "Approved" ? "text-emerald-400 flex items-center justify-center gap-1" : "text-slate-400"}>
                  <Calendar size={12} /> Biometrics / Interview
                </span>
              </div>

              <div className="space-y-1">
                <div className={`h-2 rounded-full ${activeApp.status === "Approved" ? "bg-emerald-500" : "bg-white/20"}`} />
                <span className={activeApp.status === "Approved" ? "text-emerald-400 font-bold flex items-center justify-center gap-1" : "text-slate-400"}>
                  <FileCheck size={12} /> E-Visa Issued
                </span>
              </div>
            </div>
          </div>

          {/* Urgent Action Warning Box inside Banner */}
          {activeApp.verifiedDocs?.nocLetter === "needs_review" && (
            <div className="bg-red-500/20 border border-red-400/40 rounded-xl p-3.5 flex items-center justify-between text-xs text-red-100">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="text-red-400 shrink-0" size={18} />
                <span>
                  <strong>Action Required:</strong> Consular audit flagged NOC letter. Please re-upload an official stamped NOC from your employer.
                </span>
              </div>
              <button
                onClick={() => setDetailTab("documents")}
                className="bg-red-500 hover:bg-red-600 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-lg shadow-sm shrink-0 cursor-pointer"
              >
                Upload Now &rarr;
              </button>
            </div>
          )}
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

          {/* Filters & Export */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Statuses</option>
              <option value="under_review">Under Review</option>
              <option value="action_required">Action Required</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Draft">Draft</option>
            </select>

            {/* Visa Type Filter */}
            <select
              value={visaTypeFilter}
              onChange={(e) => setVisaTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Visa Types</option>
              <option value="Tourist">Tourist Visa</option>
              <option value="Business">Business Visa</option>
              <option value="Student">Student Visa</option>
              <option value="Transit">Transit Visa</option>
            </select>

            {/* Country Filter */}
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Destinations</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="UK">United Kingdom</option>
              <option value="USA">USA</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="status">Sort: By Status</option>
            </select>

            {/* Export CSV Button */}
            <button
              onClick={() => alert("Exporting applications summary as CSV...")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: APPLICATIONS DATA TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileText size={16} className="text-[#4848F7]" />
            <span>Applications Directory ({filteredApps.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">Click any row to view full details below</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">App ID</th>
                <th className="py-3 px-4">Country & Flag</th>
                <th className="py-3 px-4">Visa Type</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Doc Verification</th>
                <th className="py-3 px-4">Fee Paid</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Info size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No matching applications found</p>
                    <p className="text-[11px] mt-1">Try resetting filters or search query.</p>
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
                        {a.submissionDate || "18 Jul 2026"}
                      </td>

                      <td className="py-3.5 px-4">{getStatusBadge(a.status)}</td>

                      <td className="py-3.5 px-4">{getDocVerificationBadge(a.verifiedDocs)}</td>

                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        ₹{formatINR(a.fees || 14500)}
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedAppId(a.id)}
                            className="bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#4848F7] text-slate-700 font-bold px-2.5 py-1 rounded-lg transition text-[11px]"
                          >
                            Details
                          </button>

                          {a.status === "Approved" && (
                            <button
                              onClick={() => alert(`Downloading E-Visa PDF for ${a.id}...`)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg transition text-[11px] flex items-center gap-1"
                            >
                              <Download size={12} /> E-Visa
                            </button>
                          )}
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
      {/* SECTION 6: SELECTED APPLICATION DEEP-DIVE INSPECTOR */}
      {/* ============================================================ */}
      {activeApp && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          
          {/* Top Bar for Inspector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCountryFlag(activeApp.destination)}</span>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Application Breakdown: {activeApp.id}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {activeApp.destination} &bull; {activeApp.visaType} &bull; Traveler: {activeApp.travelerName}
                </p>
              </div>
            </div>

            {/* Inspector Navigation Sub-tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {[
                { id: "overview", label: "Overview", icon: Info },
                { id: "timeline", label: "Timeline", icon: Clock },
                { id: "documents", label: "Documents", icon: FileCheck },
                { id: "payment", label: "Financials", icon: CreditCard },
                { id: "communication", label: "Agent Messages", icon: MessageSquare },
                { id: "actions", label: "Download Hub", icon: Download }
              ].map((tab) => {
                const IconComp = tab.icon;
                const active = detailTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setDetailTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                      active
                        ? "bg-white text-[#4848F7] shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <IconComp size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Alert for Upload simulation */}
          {docUploadSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{docUploadSuccess}</span>
            </div>
          )}

          {/* SUBTAB 1: OVERVIEW & PERSONAL/TRAVEL DETAILS */}
          {detailTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Personal & Passport Info */}
              <div className="lg:col-span-6 bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <User size={15} className="text-[#4848F7]" />
                  <span>Applicant Personal Information</span>
                </h4>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">Full Legal Name</span>
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

                  <div>
                    <span className="text-slate-500 font-medium block">Nationality / Gender</span>
                    <span className="font-semibold text-slate-800">{activeApp.nationality} (Female)</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Employment Status</span>
                    <span className="font-semibold text-slate-800">Salaried Professional</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Travel & Stay Details */}
              <div className="lg:col-span-6 bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Plane size={15} className="text-[#4848F7]" />
                  <span>Travel & Consular Scope Details</span>
                </h4>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">Destination Country</span>
                    <span className="font-bold text-slate-900">{activeApp.destination}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Visa Sub-category</span>
                    <span className="font-bold text-slate-900">{activeApp.visaType} (Multiple Entry)</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Intended Travel Dates</span>
                    <span className="font-semibold text-slate-800">{activeApp.travelDates}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Processing Speed Tier</span>
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      Standard Consular (5-7 Days)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Assigned Visa Agent</span>
                    <span className="font-semibold text-slate-800">Sarah Jenkins (Senior Auditor)</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Consular Application ID</span>
                    <span className="font-mono font-semibold text-slate-800">{activeApp.id}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: CONSULAR TIMELINE STEPPER */}
          {detailTab === "timeline" && (
            <div className="space-y-6">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Consular Processing History & Event Log
              </h4>

              <div className="relative pl-6 space-y-6 border-l-2 border-slate-200">
                
                {/* Event 1 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">Application Form & Documents Submitted</span>
                      <span className="text-[11px] text-slate-400">18 Jul 2026, 09:15 AM</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Initial digital submission validated by AI MRZ Scanner. Application ID {activeApp.id} generated.
                    </p>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">Document Verification Audit</span>
                      <span className="text-[11px] text-slate-400">18 Jul 2026, 11:30 AM</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Passport scan and photo passed automated resolution checks. NOC letter flagged for stamp clarity.
                    </p>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100 animate-pulse" />
                  <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-amber-900">Dispatched to Consular Division</span>
                      <span className="text-[11px] text-amber-700">19 Jul 2026, 02:00 PM</span>
                    </div>
                    <p className="text-xs text-amber-800">
                      Files transmitted securely to embassy processing pipeline. Under active evaluation by visa officer.
                    </p>
                  </div>
                </div>

                {/* Event 4 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-300" />
                  <div className="p-4 rounded-xl border border-slate-200 space-y-1 opacity-60">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">Consular Decision & E-Visa Grant</span>
                      <span className="text-[11px] text-slate-400">Pending</span>
                    </div>
                    <p className="text-xs text-slate-500">Decision expected within 5-7 business days.</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SUBTAB 3: DOCUMENT CHECKLIST & RE-UPLOAD HUB */}
          {detailTab === "documents" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Required Documents & Verification Status
                </h4>
                <span className="text-xs text-slate-500">Mandatory 300 DPI Clear Scans</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Doc 1: Passport */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-[#4848F7]" size={20} />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Passport Bio Page</p>
                      <p className="text-[11px] text-slate-500">Verified by AI OCR ✓</p>
                    </div>
                  </div>

                  <button
                    disabled={uploadingDoc === "passport"}
                    onClick={() => handleSimulateDocUpload("passport")}
                    className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
                  >
                    {uploadingDoc === "passport" ? "Uploading..." : "Replace File"}
                  </button>
                </div>

                {/* Doc 2: Photo */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-[#4848F7]" size={20} />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Photograph (35x45mm)</p>
                      <p className="text-[11px] text-slate-500">White Background Verified ✓</p>
                    </div>
                  </div>

                  <button
                    disabled={uploadingDoc === "photo"}
                    onClick={() => handleSimulateDocUpload("photo")}
                    className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
                  >
                    {uploadingDoc === "photo" ? "Uploading..." : "Replace File"}
                  </button>
                </div>

                {/* Doc 3: NOC Letter */}
                <div className="bg-red-50/50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="text-red-500" size={20} />
                    <div>
                      <p className="text-xs font-bold text-red-900">Employment NOC Letter</p>
                      <p className="text-[11px] text-red-600 font-semibold">Consular Stamp Unclear &bull; Action Required</p>
                    </div>
                  </div>

                  <button
                    disabled={uploadingDoc === "nocLetter"}
                    onClick={() => handleSimulateDocUpload("nocLetter")}
                    className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <Upload size={12} />
                    {uploadingDoc === "nocLetter" ? "Uploading..." : "Re-Upload NOC"}
                  </button>
                </div>

                {/* Doc 4: Sponsor / Bank Statement */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-[#4848F7]" size={20} />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Bank Statement (6 Months)</p>
                      <p className="text-[11px] text-amber-600 font-medium">Under Verification Audit</p>
                    </div>
                  </div>

                  <button
                    disabled={uploadingDoc === "sponsorLetter"}
                    onClick={() => handleSimulateDocUpload("sponsorLetter")}
                    className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
                  >
                    {uploadingDoc === "sponsorLetter" ? "Uploading..." : "Update File"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 4: FINANCIAL SUMMARY & PAYMENT LEDGER */}
          {detailTab === "payment" && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Payment Breakdown & Consular Invoices
              </h4>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="space-y-2 text-xs border-b border-slate-200 pb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Embassy Consular Visa Fee ({activeApp.destination})</span>
                    <span className="font-bold text-slate-900">₹{formatINR((activeApp.fees || 14500) * 0.8)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">Platform Convenience & Documentation Fee</span>
                    <span className="font-bold text-slate-900">₹{formatINR((activeApp.fees || 14500) * 0.15)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">GST / Consular Tax (18%)</span>
                    <span className="font-bold text-slate-900">₹{formatINR((activeApp.fees || 14500) * 0.05)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm font-extrabold text-slate-900">
                  <span>Total Fee Settled</span>
                  <span className="text-[#4848F7] text-base">₹{formatINR(activeApp.fees || 14500)}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Payment Status:</span>
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                      PAID FULLY ✓
                    </span>
                  </div>

                  <button
                    onClick={() => alert(`Downloading official tax receipt for invoice INV-2026-${activeApp.id.replace("VO-", "")}...`)}
                    className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Download Receipt PDF</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 5: AGENT MESSAGES & COMMUNICATION LOG */}
          {detailTab === "communication" && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Direct Communication with Assigned Visa Specialist
              </h4>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 h-64 overflow-y-auto">
                {agentChatLogs.map((m) => (
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
                <button
                  type="submit"
                  className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={14} />
                  <span>Send Note</span>
                </button>
              </form>
            </div>
          )}

          {/* SUBTAB 6: DOWNLOAD HUB & SHORTCUTS */}
          {detailTab === "actions" && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Application Documents & Quick Action Hub
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <button
                  onClick={() => alert(`Downloading submitted application form PDF for ${activeApp.id}...`)}
                  className="p-4 bg-slate-50 hover:bg-[#EEF2FF] border border-slate-200 rounded-xl text-left space-y-2 transition cursor-pointer group"
                >
                  <FileText className="text-[#4848F7] group-hover:scale-110 transition" size={24} />
                  <p className="font-bold text-slate-900">Submitted Form PDF</p>
                  <p className="text-slate-500 text-[11px]">Print official application copy</p>
                </button>

                <button
                  onClick={() => alert(`Downloading payment receipt for ${activeApp.id}...`)}
                  className="p-4 bg-slate-50 hover:bg-[#EEF2FF] border border-slate-200 rounded-xl text-left space-y-2 transition cursor-pointer group"
                >
                  <CreditCard className="text-[#4848F7] group-hover:scale-110 transition" size={24} />
                  <p className="font-bold text-slate-900">Consular Fee Invoice</p>
                  <p className="text-slate-500 text-[11px]">Download GST tax receipt</p>
                </button>

                <button
                  onClick={() => {
                    if (activeApp.status === "Approved") alert("Downloading E-Visa Stamped Letter PDF...");
                    else alert("E-Visa letter will be available immediately upon embassy approval.");
                  }}
                  className={`p-4 border rounded-xl text-left space-y-2 transition cursor-pointer group ${
                    activeApp.status === "Approved"
                      ? "bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                      : "bg-slate-50 border-slate-200 opacity-60"
                  }`}
                >
                  <FileCheck className={activeApp.status === "Approved" ? "text-emerald-600" : "text-slate-400"} size={24} />
                  <p className="font-bold text-slate-900">Download E-Visa Letter</p>
                  <p className="text-slate-500 text-[11px]">
                    {activeApp.status === "Approved" ? "Official stamped grant letter" : "Available post approval"}
                  </p>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 7: CONSULAR FAQS & SUPPORT ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Visa Processing</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">How long does embassy processing take?</p>
            <p className="text-slate-600 leading-relaxed">
              Standard processing ranges between 5 to 7 business days from the date of biometrics/document verification.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">What happens if a document requires re-uploading?</p>
            <p className="text-slate-600 leading-relaxed">
              You will receive an instant notification in your dashboard. You can upload the updated file directly in the Documents tab.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
