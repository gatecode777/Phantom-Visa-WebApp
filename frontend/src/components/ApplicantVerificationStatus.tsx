"use client";

import React, { useState, useMemo } from "react";
import { Application } from "../context/VisaContext";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  FileText,
  Eye,
  Download,
  RefreshCw,
  Info,
  HelpCircle,
  Search,
  Filter,
  Layers,
  UserCheck,
  Building,
  User,
  Plane,
  RotateCcw,
  Zap,
  Check,
  FileCheck,
  MessageSquare,
  Bell
} from "lucide-react";

export type AuditStatus = "verified" | "pending" | "rejected" | "resubmit";

export interface VerificationDocRecord {
  id: string;
  name: string;
  category: string;
  submissionDate: string;
  verifiedBy: "AI System" | "Agent Sarah Jenkins" | "Admin Consular";
  verificationDate: string;
  status: AuditStatus;
  remarks: string;
  aiMatchScore: number;
  ocrData: { passportNo?: string; dob?: string; nameMatch?: boolean };
}

interface ApplicantVerificationStatusProps {
  applications: Application[];
  onNavigateUpload?: () => void;
  onNavigateSupport?: () => void;
}

export default function ApplicantVerificationStatus({
  applications,
  onNavigateUpload,
  onNavigateSupport
}: ApplicantVerificationStatusProps) {
  // Mock verification records matching wireframe
  const [verificationItems, setVerificationItems] = useState<VerificationDocRecord[]>([
    {
      id: "v-rec-1",
      name: "Passport Bio Page",
      category: "Identity",
      submissionDate: "07 Aug 2026",
      verifiedBy: "AI System",
      verificationDate: "07 Aug 2026, 10:15 AM",
      status: "verified",
      remarks: "High-resolution 300 DPI scan verified. Full border visible.",
      aiMatchScore: 99,
      ocrData: { passportNo: "Z9817264", dob: "12 Jun 1995", nameMatch: true }
    },
    {
      id: "v-rec-2",
      name: "Passport Back Page",
      category: "Identity",
      submissionDate: "07 Aug 2026",
      verifiedBy: "AI System",
      verificationDate: "07 Aug 2026, 10:16 AM",
      status: "verified",
      remarks: "Address details matched with application records.",
      aiMatchScore: 98,
      ocrData: { nameMatch: true }
    },
    {
      id: "v-rec-3",
      name: "Recent Photograph (35x45mm)",
      category: "Identity",
      submissionDate: "07 Aug 2026",
      verifiedBy: "Agent Sarah Jenkins",
      verificationDate: "07 Aug 2026, 10:20 AM",
      status: "verified",
      remarks: "Biometrics criteria 35x45mm white background verified.",
      aiMatchScore: 96,
      ocrData: {}
    },
    {
      id: "v-rec-4",
      name: "6-Month Bank Statement",
      category: "Financial",
      submissionDate: "07 Aug 2026",
      verifiedBy: "Agent Sarah Jenkins",
      verificationDate: "07 Aug 2026, 10:25 AM",
      status: "verified",
      remarks: "Opening and closing balance verified (> ₹3,50,000 threshold).",
      aiMatchScore: 94,
      ocrData: {}
    },
    {
      id: "v-rec-5",
      name: "Employment NOC Letter",
      category: "Employment",
      submissionDate: "07 Aug 2026",
      verifiedBy: "Agent Sarah Jenkins",
      verificationDate: "07 Aug 2026, 10:30 AM",
      status: "rejected",
      remarks: "Refusal Clause 4.2: HR wet stamp is blurry and unverified. Resubmission required.",
      aiMatchScore: 60,
      ocrData: {}
    },
    {
      id: "v-rec-6",
      name: "Flight Round-trip Ticket",
      category: "Travel",
      submissionDate: "07 Aug 2026",
      verifiedBy: "AI System",
      verificationDate: "Pending Agent Audit",
      status: "pending",
      remarks: "Flight PNR code pending airline database check.",
      aiMatchScore: 90,
      ocrData: {}
    },
    {
      id: "v-rec-7",
      name: "Hotel Booking Voucher",
      category: "Travel",
      submissionDate: "07 Aug 2026",
      verifiedBy: "AI System",
      verificationDate: "Pending Agent Audit",
      status: "pending",
      remarks: "Hotel confirmation code pending hotel desk verification.",
      aiMatchScore: 88,
      ocrData: {}
    }
  ]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verifierFilter, setVerifierFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "name" | "score">("newest");

  // Selected Record for Inspector
  const [selectedRecId, setSelectedRecId] = useState<string>("v-rec-1");

  const activeRec = useMemo(() => {
    return verificationItems.find((r) => r.id === selectedRecId) || verificationItems[0];
  }, [verificationItems, selectedRecId]);

  // Active App Reference
  const activeApp = useMemo(() => {
    return applications[0] || {
      id: "VO-2026-1025",
      travelerName: "Geeta Sharma",
      dob: "1995-06-12",
      passportNumber: "Z9817264",
      destination: "Australia",
      visaType: "Tourist Subclass 600"
    };
  }, [applications]);

  // Metrics
  const metrics = useMemo(() => {
    const total = verificationItems.length;
    const verified = verificationItems.filter((v) => v.status === "verified").length;
    const pending = verificationItems.filter((v) => v.status === "pending").length;
    const rejected = verificationItems.filter((v) => v.status === "rejected").length;
    const resubmit = verificationItems.filter((v) => v.status === "resubmit" || v.status === "rejected").length;
    const speed = "100% On Track (< 24h)";

    return { total, verified, pending, rejected, resubmit, speed };
  }, [verificationItems]);

  // Filtered List
  const filteredRecords = useMemo(() => {
    return verificationItems
      .filter((v) => {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          v.name.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.verifiedBy.toLowerCase().includes(q) ||
          v.remarks.toLowerCase().includes(q);

        const matchesStatus = statusFilter === "all" || v.status === statusFilter;
        const matchesVerifier = verifierFilter === "all" || v.verifiedBy.toLowerCase().includes(verifierFilter.toLowerCase());

        return matchesQ && matchesStatus && matchesVerifier;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "score") return b.aiMatchScore - a.aiMatchScore;
        return b.id.localeCompare(a.id);
      });
  }, [verificationItems, searchQuery, statusFilter, verifierFilter, sortBy]);

  // Flagged Record Reference
  const flaggedRec = useMemo(() => {
    return verificationItems.find((v) => v.status === "rejected" || v.status === "resubmit");
  }, [verificationItems]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & AUDIT STATUS BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Applications</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Verification Status</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Real-Time Verification Audit Status</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-[#4848F7] border border-indigo-200">
              <ShieldCheck size={12} /> Live Verification Audit • 80% Completed
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Track real-time document verification, consular audit status, agent review stages, and approval progress across all submitted files.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => alert("Downloading official Verification Audit Report PDF...")}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition flex items-center gap-2 cursor-pointer"
          >
            <Download size={16} />
            <span>Download Audit Report</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: DASHBOARD STATISTICS CARDS GRID (6 CARDS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Documents */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Documents</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(metrics.total).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">In verification queue</span>
        </div>

        {/* Card 2: Verified Documents */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Verified Docs</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{String(metrics.verified).padStart(2, "0")}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 size={10} /> Consular approved
          </span>
        </div>

        {/* Card 3: Pending Verification */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Pending Review</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{String(metrics.pending).padStart(2, "0")}</p>
          <span className="text-[10px] text-amber-600 font-medium">Agent queue</span>
        </div>

        {/* Card 4: Rejected / Flagged */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-red-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Rejected / Flagged</p>
          <p className="text-2xl font-black text-red-600 mt-1">{String(metrics.rejected).padStart(2, "0")}</p>
          <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1">
            <AlertTriangle size={10} /> Re-upload required
          </span>
        </div>

        {/* Card 5: Resubmission Required */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Resubmit Needed</p>
          <p className="text-2xl font-black text-slate-700 mt-1">{String(metrics.resubmit).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">Pending user upload</span>
        </div>

        {/* Card 6: Audit Speed */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Audit Speed</p>
          <p className="text-xs font-black text-emerald-600 mt-2">{metrics.speed}</p>
          <span className="text-[10px] text-slate-400 font-medium">Turnaround time</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CONCEPTUAL WORKFLOW BANNER (CONNECTED 3-PARTY WORKFLOW FROM WIREFRAME) */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Workflow (Applicant ➔ Agent ➔ Admin)
            </h3>
          </div>
          <span className="text-[11px] bg-white/10 text-slate-300 font-mono px-3 py-1 rounded-full">
            Multi-Party Audit Loop
          </span>
        </div>

        {/* Workflow Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 1</span>
            <p className="text-white">Applicant Uploads Document</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 2</span>
            <p className="text-white">Agent AI / OCR Scan (99% Match)</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 3</span>
            <p className="text-white">Verification Verified / Pending</p>
          </div>

          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Stage 4</span>
            <p className="font-bold">Admin Final Consular Approval ✓</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl text-xs space-y-1 text-slate-300">
          <p className="font-bold text-white">Professional Recommendation & Verification Rules:</p>
          <ul className="list-disc pl-4 space-y-1 leading-relaxed text-[11px]">
            <li>Documents undergo automated AI OCR scanning for instant text match validation.</li>
            <li>Senior licensed verifier agents review passport biometric resolution and bank seals.</li>
            <li>Flagged documents trigger an automated alert notification with specific remedy instructions.</li>
          </ul>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 4: APPLICATION INFORMATION SUMMARY CARD */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Info size={15} className="text-[#4848F7]" />
          <span>Active Verification Target Credentials</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Application ID</span>
            <span className="font-mono font-bold text-slate-900">{activeApp.id}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Applicant Name</span>
            <span className="font-bold text-slate-900">{activeApp.travelerName}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Destination Country</span>
            <span className="font-bold text-slate-900">{activeApp.destination} 🇦🇺</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Assigned Verifier</span>
            <span className="font-semibold text-slate-800">Agent Desk #2 (Sarah Jenkins)</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Visa Subtype</span>
            <span className="font-semibold text-slate-800">{activeApp.visaType}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Passport Number</span>
            <span className="font-mono font-bold text-slate-800">{activeApp.passportNumber}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Verification Stage</span>
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              Agent Audit Stage 2
            </span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Last Audit Date</span>
            <span className="font-semibold text-slate-800">07 Aug 2026</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: REJECTION & RESUBMISSION ALERT CARD */}
      {/* ============================================================ */}
      {flaggedRec && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4 text-xs text-red-950">
          <div className="flex items-center gap-3">
            <AlertTriangle size={22} className="text-red-600 shrink-0" />
            <div>
              <p className="font-extrabold text-red-900 text-sm">
                Document Action Needed: {flaggedRec.name}
              </p>
              <p className="text-red-700 font-medium mt-0.5">
                Remarks: "{flaggedRec.remarks}"
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (onNavigateUpload) onNavigateUpload();
              else alert("Navigating to upload page...");
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2 rounded-xl transition shrink-0 cursor-pointer"
          >
            Re-Upload Now
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 6: SEARCH & MULTI-FILTER CONTROL BAR */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search Document Name, Verifier, Remarks..."
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
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified ✓</option>
              <option value="pending">Pending ⏳</option>
              <option value="rejected">Rejected ❌</option>
            </select>

            {/* Verifier Filter */}
            <select
              value={verifierFilter}
              onChange={(e) => setVerifierFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Verifiers</option>
              <option value="AI">AI System</option>
              <option value="Agent">Agent Sarah Jenkins</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="newest">Sort: Date Newest</option>
              <option value="name">Sort: Document Name</option>
              <option value="score">Sort: AI Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 7: DOCUMENT VERIFICATION TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#4848F7]" />
            <span>Document Verification Directory ({filteredRecords.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">Click any row to inspect AI OCR score & verifier notes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Verified By</th>
                <th className="py-3 px-4">Verification Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Remarks</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => {
                const isSelected = r.id === selectedRecId;
                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedRecId(r.id)}
                    className={`cursor-pointer transition hover:bg-indigo-50/40 ${
                      isSelected ? "bg-indigo-50/80 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4848F7]" />}
                      {r.name}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">{r.submissionDate}</td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">{r.verifiedBy}</td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">{r.verificationDate}</td>

                    <td className="py-3.5 px-4">
                      {r.status === "verified" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      )}

                      {r.status === "pending" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <Clock size={12} /> Pending Review
                        </span>
                      )}

                      {r.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                          <AlertTriangle size={12} /> Flagged
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium max-w-xs truncate">
                      {r.remarks}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedRecId(r.id)}
                        className="bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#4848F7] text-slate-700 font-bold px-2.5 py-1 rounded-lg transition text-[11px]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 8: VERIFICATION DETAILS INSPECTOR CARD */}
      {/* ============================================================ */}
      {activeRec && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-3">
              <FileCheck size={24} className="text-[#4848F7]" />
              <div>
                <h3 className="text-base font-black text-slate-900">Audit Inspector: {activeRec.name}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Verified By: {activeRec.verifiedBy} &bull; Timestamp: {activeRec.verificationDate}
                </p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-1">
              <Zap size={14} className="text-emerald-600" /> AI OCR Match Score: {activeRec.aiMatchScore}%
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <p className="font-bold text-slate-900">Consular Verifier Remarks & OCR Summary:</p>
            <p className="font-mono text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
              "{activeRec.remarks}"
            </p>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 9: VERIFICATION PROGRESS CHECKLIST STEPPER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
        <h4 className="font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2 border-b border-slate-100 pb-3">
          <CheckCircle2 size={15} className="text-emerald-600" />
          <span>Real-Time Document Verification Checklist Stepper</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {verificationItems.map((item) => (
            <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">{item.name}</p>
                <p className="text-[11px] text-slate-500">{item.verifiedBy}</p>
              </div>

              {item.status === "verified" && <CheckCircle2 className="text-emerald-600 shrink-0" size={18} />}
              {item.status === "pending" && <Clock className="text-amber-500 shrink-0" size={18} />}
              {item.status === "rejected" && <XCircle className="text-red-500 shrink-0" size={18} />}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 10: VERIFICATION HISTORY LOG TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Clock size={16} className="text-slate-500" />
            <span>Verification Audit History Log</span>
          </h3>
          <span className="text-[11px] text-slate-400">Multi-party timestamped audit trail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Verified By</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {verificationItems.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{activeApp.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{r.name}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">AI OCR Scan & Verifier Audit</td>
                  <td className="py-3 px-4 text-slate-600 font-semibold">{r.verifiedBy}</td>
                  <td className="py-3 px-4 font-bold text-slate-800 uppercase">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 11: QUICK ACTIONS & SHORTCUTS BAR */}
      {/* ============================================================ */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg text-xs">
        <div>
          <h4 className="font-extrabold text-white">Need Live Help with Document Verification?</h4>
          <p className="text-slate-400 mt-0.5">Contact your assigned verifier agent (Sarah Jenkins) for priority clearance.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => alert("Downloading official Verification Audit Report PDF...")}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} /> Audit Report PDF
          </button>

          <button
            onClick={() => {
              if (onNavigateSupport) onNavigateSupport();
              else alert("Connecting to agent support desk...");
            }}
            className="bg-[#4848F7] hover:bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare size={14} /> Contact Verifier Agent
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 12: VERIFICATION STATUS FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Document Verification</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">How long does document verification take?</p>
            <p className="text-slate-600 leading-relaxed">
              AI OCR checks occur instantly upon upload. Senior agent audits are completed within 24 business hours.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Who verifies my uploaded documents?</p>
            <p className="text-slate-600 leading-relaxed">
              Documents undergo dual verification: automated AI OCR scanning followed by manual inspection by licensed consular agents.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
