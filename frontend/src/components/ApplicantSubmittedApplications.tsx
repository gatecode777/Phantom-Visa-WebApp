"use client";

import React, { useState, useMemo } from "react";
import { Application, formatINR, ApplicationDocument } from "../context/VisaContext";
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
  Check,
  X,
  Copy,
  Image as ImageIcon
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
    return applications.filter((a) =>
      ["Submitted", "Embassy Processing", "Docs Uploaded", "Docs Pending", "Under Review", "Approved"].includes(a.status)
    );
  }, [applications]);

  // State for search, filter & sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // Selected Submitted App ID for inspector
  const [selectedAppId, setSelectedAppId] = useState<string>(submittedApps[0]?.id || "");

  // Active App Object
  const activeApp = useMemo(() => {
    return submittedApps.find((a) => a.id === selectedAppId) || submittedApps[0] || null;
  }, [submittedApps, selectedAppId]);

  // Subtab inside Inspector
  const [inspectorTab, setInspectorTab] = useState<"summary" | "timeline" | "docs" | "payment" | "agent" | "updates" | "actions">("summary");

  // Document Preview Lightbox Modal State
  const [previewDoc, setPreviewDoc] = useState<{
    title: string;
    fileUrl: string;
    fileName?: string;
    fileSize?: string;
    format?: string;
    status?: string;
    documentType?: string;
    rejectionReason?: string;
  } | null>(null);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

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
    const inAudit = submittedApps.filter((a) => a.status === "Submitted" || a.status === "Under Review").length;
    const dispatched = submittedApps.filter((a) => a.status === "Embassy Processing").length;
    const awaitingDecision = dispatched;
    const avgDispatch = "24 - 48 Hours";
    const queueStatus = "Normal Consular Speed";

    return { total, inAudit, dispatched, awaitingDecision, avgDispatch, queueStatus };
  }, [submittedApps]);

  // Active documents for viewed submitted app
  const activeDocs = useMemo(() => {
    if (activeApp?.uploadedDocuments && activeApp.uploadedDocuments.length > 0) {
      return activeApp.uploadedDocuments;
    }
    return [
      {
        _id: "doc-1",
        title: "Passport Bio Page",
        documentType: "Image Scan",
        fileUrl: "https://ik.imagekit.io/phantomvisa/sample_passport.png",
        fileName: "passport_bio_page.png",
        status: "verified" as const,
        rejectionReason: ""
      },
      {
        _id: "doc-2",
        title: "Passport Photograph",
        documentType: "Image Scan",
        fileUrl: "https://ik.imagekit.io/phantomvisa/sample_photo.png",
        fileName: "applicant_photo.png",
        status: "verified" as const,
        rejectionReason: ""
      },
      {
        _id: "doc-3",
        title: "Employment NOC Letter",
        documentType: "PDF Document",
        fileUrl: "https://ik.imagekit.io/phantomvisa/sample_doc.pdf",
        fileName: "employment_noc_letter.pdf",
        status: "verified" as const,
        rejectionReason: ""
      },
      {
        _id: "doc-4",
        title: "Bank Statement Proof",
        documentType: "PDF Document",
        fileUrl: "https://ik.imagekit.io/phantomvisa/sample_bank.pdf",
        fileName: "bank_statement_6m.pdf",
        status: "verified" as const,
        rejectionReason: ""
      }
    ];
  }, [activeApp]);

  // Filtered List
  const filteredApps = useMemo(() => {
    return submittedApps
      .filter((a) => {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          !q ||
          a.id.toLowerCase().includes(q) ||
          a.destination.toLowerCase().includes(q) ||
          a.visaType.toLowerCase().includes(q) ||
          a.travelerName.toLowerCase().includes(q);

        const matchesCountry = countryFilter === "all" || a.destination.toLowerCase().includes(countryFilter.toLowerCase());

        let matchesStage = true;
        if (stageFilter === "audit") matchesStage = a.status === "Submitted" || a.status === "Under Review";
        else if (stageFilter === "embassy") matchesStage = a.status === "Embassy Processing";

        return matchesQ && matchesCountry && matchesStage;
      })
      .sort((a, b) => {
        const timeA = new Date(a.submissionDate || "2000-01-01").getTime();
        const timeB = new Date(b.submissionDate || "2000-01-01").getTime();

        if (sortBy === "newest") {
          if (timeA !== timeB) return timeB - timeA;
          return b.id.localeCompare(a.id);
        }
        if (timeA !== timeB) return timeA - timeB;
        return a.id.localeCompare(b.id);
      });
  }, [submittedApps, searchQuery, countryFilter, stageFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#0E1A2C] border border-[#4848F7]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <CheckCircle2 size={16} className="text-[#4848F7]" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* SECTION 1: HEADER & BANNER */}
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

      {/* SECTION 2: TOP METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Submitted</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(metrics.total).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">In active pipeline</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">In Verification Audit</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(metrics.inAudit).padStart(2, "0")}</p>
          <span className="text-[10px] text-indigo-600 font-bold">Consular review</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Dispatched to Embassy</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(metrics.dispatched).padStart(2, "0")}</p>
          <span className="text-[10px] text-amber-600 font-bold">Consular Queue</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Decision Pending</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(metrics.awaitingDecision).padStart(2, "0")}</p>
          <span className="text-[10px] text-emerald-600 font-bold">5-7 Days ETA</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Avg Dispatch Time</p>
          <p className="text-lg font-black text-slate-900 mt-1">{metrics.avgDispatch}</p>
          <span className="text-[10px] text-slate-400 font-medium">From document audit</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Queue Status</p>
          <p className="text-xs font-bold text-emerald-600 mt-1.5 flex items-center gap-1">
            <CheckCircle2 size={13} /> {metrics.queueStatus}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">All systems normal</span>
        </div>
      </div>

      {/* SECTION 3: SEARCH & FILTERS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search Application ID, Country, Traveler..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4848F7]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7] cursor-pointer"
          >
            <option value="all">All Stages</option>
            <option value="audit">Under Review / Audit</option>
            <option value="embassy">Dispatched to Embassy</option>
          </select>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7] cursor-pointer"
          >
            <option value="all">All Destinations</option>
            <option value="Canada">Canada</option>
            <option value="Germany">Germany</option>
            <option value="UK">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="USA">USA</option>
            <option value="France">France</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7] cursor-pointer"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>
        </div>
      </div>

      {/* SECTION 4: TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Country & Flag</th>
                <th className="py-3 px-4">Visa Category</th>
                <th className="py-3 px-4">Traveler Name</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Consular Stage</th>
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
                      <td className="py-3.5 px-4 font-bold text-[#4848F7] font-mono">
                        {a.id}
                      </td>

                      <td className="py-3.5 px-4 text-slate-900 font-semibold">
                        <span className="inline-flex items-center gap-2">
                          <span className="text-base">{getCountryFlag(a.destination)}</span>
                          {a.destination}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">{a.visaType}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{a.travelerName}</td>
                      <td className="py-3.5 px-4 text-slate-600">{a.submissionDate || "18 Aug 2026"}</td>

                      <td className="py-3.5 px-4">
                        {a.status === "Approved" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            🟢 Approved
                          </span>
                        ) : a.status === "Embassy Processing" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            🟡 Embassy Queue
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            🔵 Verification Audit
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedAppId(a.id)}
                          className="bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#4848F7] text-slate-700 font-bold px-3 py-1 rounded-lg transition text-[11px] cursor-pointer"
                        >
                          View Breakdown
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

      {/* SECTION 5: APPLICATION BREAKDOWN INSPECTOR */}
      {activeApp && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
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

            {/* Inspector Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {[
                { id: "summary", label: "Overview", icon: Info },
                { id: "timeline", label: "Timeline", icon: Clock },
                { id: "docs", label: "Documents", icon: FileCheck },
                { id: "payment", label: "Financials", icon: CreditCard },
                { id: "agent", label: "Agent Desk", icon: MessageSquare },
                { id: "actions", label: "Download Hub", icon: Download }
              ].map((tab) => {
                const IconComp = tab.icon;
                const active = inspectorTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setInspectorTab(tab.id as any)}
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

          {/* SUBTAB 1: SUMMARY */}
          {inspectorTab === "summary" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <User size={15} className="text-[#4848F7]" />
                  <span>Applicant Information</span>
                </h4>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">Full Name</span>
                    <span className="font-bold text-slate-900">{activeApp.travelerName}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Passport Number</span>
                    <span className="font-mono font-bold text-slate-900">{activeApp.passportNumber || "N/A"}</span>
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
                    <span className="font-bold text-slate-900">{activeApp.destination} Embassy</span>
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
                    <span className="text-slate-500 font-medium block">Current Status</span>
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      {activeApp.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: TIMELINE */}
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
                    <p className="text-xs text-slate-600">Submitted online. Passport scan & records uploaded to ImageKit.</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100 animate-pulse" />
                  <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-amber-900">Consular Verification & Processing</span>
                      <span className="text-[11px] text-amber-700">{activeApp.status}</span>
                    </div>
                    <p className="text-xs text-amber-800">Files securely stored on ImageKit CDN and undergoing official consular evaluation.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: SUBMITTED DOCUMENTS AUDIT */}
          {inspectorTab === "docs" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <FileCheck size={16} className="text-[#4848F7]" />
                  <span>Submitted Documents & ImageKit Proof ({activeDocs.length})</span>
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">ImageKit Asset Pipeline</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {activeDocs.map((doc: any, idx: number) => {
                  const isImage = doc.fileUrl && (doc.fileUrl.endsWith(".jpg") || doc.fileUrl.endsWith(".jpeg") || doc.fileUrl.endsWith(".png") || doc.fileUrl.endsWith(".webp") || doc.fileUrl.includes("images") || doc.fileUrl.includes("download"));
                  const isPdf = doc.fileUrl && doc.fileUrl.endsWith(".pdf");

                  return (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-indigo-200 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        {isImage && doc.fileUrl ? (
                          <div
                            onClick={() => setPreviewDoc(doc)}
                            className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0 cursor-pointer group relative"
                          >
                            <img src={doc.fileUrl} alt={doc.title} className="w-full h-full object-cover group-hover:scale-110 transition" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                              <Eye size={14} />
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#4848F7] flex items-center justify-center shrink-0 border border-indigo-200">
                            <FileCheck size={20} />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate" title={doc.title}>{doc.title}</p>
                          <p className="text-[10px] text-slate-500 truncate">{doc.fileName || doc.documentType || "Uploaded Document"}</p>
                          {doc.status === "verified" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                              <CheckCircle2 size={11} /> Verified ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600">
                              <Clock size={11} /> Under Audit
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {doc.fileUrl && (
                          <>
                            <button
                              onClick={() => setPreviewDoc(doc)}
                              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
                            >
                              <Eye size={12} /> View
                            </button>
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 hover:bg-slate-200 text-slate-500 rounded-md transition cursor-pointer"
                              title="Open in new tab"
                            >
                              <ExternalLink size={13} />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
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
            </div>
          )}

          {/* SUBTAB 5: AGENT DESK */}
          {inspectorTab === "agent" && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">Assigned Consular Specialist</p>
                  <p className="text-slate-600">Senior Visa Auditor</p>
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
                    <p>{m.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendAgentMsg} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message to your assigned specialist..."
                  value={agentMsg}
                  onChange={(e) => setAgentMsg(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#4848F7]"
                />
                <button
                  type="submit"
                  className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={14} />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* SUBTAB 6: DOWNLOAD HUB */}
          {inspectorTab === "actions" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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

      {/* DOCUMENT PREVIEW LIGHTBOX MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#4848F7] flex items-center justify-center text-white font-bold">
                  <FileCheck size={20} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>{previewDoc.title}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      ImageKit Asset
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono truncate max-w-xs sm:max-w-md">
                    {previewDoc.fileName || previewDoc.documentType || "CDN Document"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewDoc(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-600 truncate flex-1">
                <span className="font-bold text-slate-400">URL:</span>
                <span className="truncate">{previewDoc.fileUrl}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(previewDoc.fileUrl);
                    setToastMsg("ImageKit URL copied to clipboard!");
                    setTimeout(() => setToastMsg(null), 3000);
                  }}
                  className="px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={11} /> Copy URL
                </button>
                <a
                  href={previewDoc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink size={11} /> Open
                </a>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex items-center justify-center bg-slate-100/60 min-h-[300px]">
              {previewDoc.fileUrl.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={previewDoc.fileUrl}
                  title={previewDoc.title}
                  className="w-full h-[450px] rounded-2xl border border-slate-200 bg-white"
                />
              ) : (
                <div className="max-w-full max-h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white p-2 flex items-center justify-center">
                  <img
                    src={previewDoc.fileUrl}
                    alt={previewDoc.title}
                    className="max-w-full max-h-[480px] object-contain rounded-xl"
                  />
                </div>
              )}
            </div>

            <div className="bg-white p-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <a
                href={previewDoc.fileUrl}
                download
                className="px-4 py-2 bg-[#4848F7] hover:bg-indigo-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download size={14} /> Download File
              </a>

              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: FAQS */}
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
