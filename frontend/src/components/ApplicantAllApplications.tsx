"use client";

import React, { useState, useMemo, useRef } from "react";
import { Application, formatINR, ApplicationDocument } from "../context/VisaContext";
import { uploadImageToImageKit } from "../services/imageKitService";
import { API_V1_URL } from "../config/api";
import {
  Search,
  Filter,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
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
  Briefcase,
  Copy,
  X,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon
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
    applications[0]?.id || ""
  );
  
  // Selected Application object
  const activeApp = useMemo(() => {
    return applications.find((a) => a.id === selectedAppId) || applications[0] || null;
  }, [applications, selectedAppId]);

  // Tab inside deep-dive detail inspector
  const [detailTab, setDetailTab] = useState<"overview" | "timeline" | "documents" | "payment" | "communication" | "actions">("overview");

  // Document upload state inside active app
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [docUploadSuccess, setDocUploadSuccess] = useState<string | null>(null);
  const [docRevisionKey, setDocRevisionKey] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [targetDocToUpload, setTargetDocToUpload] = useState<{ id: string; title: string } | null>(null);

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
    verifiedBy?: string;
    verificationDate?: string;
  } | null>(null);

  // Agent Chat state in active app
  const [agentMsg, setAgentMsg] = useState("");
  const [agentChatLogs, setAgentChatLogs] = useState<Array<{ id: string; sender: string; text: string; time: string }>>([]);

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
          text: "Thank you for the update. Our consular audit team is reviewing your documents.",
          time: "Just now"
        }
      ]);
    }, 1200);
  };

  // Trigger file selection for replacement
  const handleTriggerReplace = (docId: string, docTitle: string) => {
    setTargetDocToUpload({ id: docId, title: docTitle });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Upload selected file to ImageKit and persist to backend MongoDB
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetDocToUpload || !activeApp) return;

    const docId = targetDocToUpload.id;
    const docTitle = targetDocToUpload.title;
    setUploadingDocId(docId);

    try {
      // 1. Upload to ImageKit
      const ikResult = await uploadImageToImageKit(file, "/PHANTOM-VISA/applications/documents/");
      
      // 2. Persist new ImageKit URL & metadata to backend MongoDB
      try {
        await fetch(`${API_V1_URL}/applications/${activeApp.id}/documents/${encodeURIComponent(docId)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileUrl: ikResult.url,
            fileName: ikResult.fileName || file.name,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            format: file.name.split(".").pop()?.toUpperCase() || "JPG",
            title: docTitle
          })
        });
      } catch (apiErr) {
        console.warn("Backend doc sync note:", apiErr);
      }

      // 3. Update activeApp local state immutably
      if (!activeApp.uploadedDocuments) {
        activeApp.uploadedDocuments = [];
      }
      const existingIndex = activeApp.uploadedDocuments.findIndex(
        (d: any) => String(d._id) === docId || d.requirementId === docId || (d.title && d.title.toLowerCase() === docTitle.toLowerCase())
      );
      if (existingIndex >= 0) {
        activeApp.uploadedDocuments[existingIndex] = {
          ...activeApp.uploadedDocuments[existingIndex],
          fileUrl: ikResult.url,
          fileName: ikResult.fileName || file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          format: file.name.split(".").pop()?.toUpperCase() || "JPG",
          status: "uploaded",
          rejectionReason: "",
          uploadedAt: new Date().toISOString()
        };
      } else {
        activeApp.uploadedDocuments.push({
          _id: docId,
          title: docTitle,
          documentType: file.name.toLowerCase().endsWith(".pdf") ? "PDF Document" : "Image Scan",
          fileUrl: ikResult.url,
          fileName: ikResult.fileName || file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          format: file.name.split(".").pop()?.toUpperCase() || "JPG",
          status: "uploaded",
          rejectionReason: "",
          uploadedAt: new Date().toISOString()
        });
      }

      // Trigger reactive UI refresh
      setDocRevisionKey((prev) => prev + 1);

      if (onUpdateDocs) {
        onUpdateDocs(activeApp.id, docId as any, "verified");
      }

      setDocUploadSuccess(`Successfully uploaded and synced "${docTitle}" to ImageKit!`);
      setTimeout(() => setDocUploadSuccess(null), 4000);
    } catch (err: any) {
      console.error("Document upload error:", err);
      alert(err.message || "Failed to upload document to ImageKit.");
    } finally {
      setUploadingDocId(null);
      setTargetDocToUpload(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
        <CheckCircle2 size={12} /> Uploaded
      </span>
    );
  };

  // Active documents array for currently viewed application
  const activeDocs = useMemo(() => {
    if (activeApp?.uploadedDocuments && activeApp.uploadedDocuments.length > 0) {
      return activeApp.uploadedDocuments;
    }
    return [
      {
        _id: "doc-1",
        title: "Passport Bio Page",
        documentType: "Image Scan",
        fileUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800",
        fileName: "passport_bio_page.png",
        status: "verified" as const,
        rejectionReason: ""
      },
      {
        _id: "doc-2",
        title: "Photograph (35×45mm)",
        documentType: "Image Scan",
        fileUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
        fileName: "applicant_photo.png",
        status: "verified" as const,
        rejectionReason: ""
      },
      {
        _id: "doc-3",
        title: "Employment NOC Letter",
        documentType: "PDF Document",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileName: "employment_noc_letter.pdf",
        status: "needs_review" as const,
        rejectionReason: "Consular Stamp Unclear • Action Required"
      },
      {
        _id: "doc-4",
        title: "Bank Statement (6 Months)",
        documentType: "PDF Document",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileName: "bank_statement_6m.pdf",
        status: "pending" as const,
        rejectionReason: ""
      }
    ];
  }, [activeApp, docRevisionKey]);

  // Derived filtered applications
  const filteredApps = useMemo(() => {
    return applications
      .filter((a) => {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          !q ||
          a.id.toLowerCase().includes(q) ||
          a.destination.toLowerCase().includes(q) ||
          a.visaType.toLowerCase().includes(q) ||
          a.travelerName.toLowerCase().includes(q) ||
          a.passportNumber.toLowerCase().includes(q);

        const matchesStatus =
          statusFilter === "all" ||
          a.status.toLowerCase() === statusFilter.toLowerCase() ||
          (statusFilter === "review" && (a.status === "Under Review" || a.status === "Submitted" || a.status === "Embassy Processing"));

        const matchesVisaType =
          visaTypeFilter === "all" || a.visaType.toLowerCase().includes(visaTypeFilter.toLowerCase());

        const matchesCountry =
          countryFilter === "all" || a.destination.toLowerCase().includes(countryFilter.toLowerCase());

        return matchesQ && matchesStatus && matchesVisaType && matchesCountry;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.submissionDate || "2026-08-01").getTime() - new Date(a.submissionDate || "2026-08-01").getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.submissionDate || "2026-08-01").getTime() - new Date(b.submissionDate || "2026-08-01").getTime();
        }
        return a.status.localeCompare(b.status);
      });
  }, [applications, searchQuery, statusFilter, visaTypeFilter, countryFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* Hidden File Input for Document Replacement */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,application/pdf"
      />

      {/* ============================================================ */}
      {/* SECTION 1: HEADER BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Applications</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">All Applications</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">All Visa Applications</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage & track all your visa applications, submission history, real-time embassy processing timelines, document status, and communication logs in one place.
          </p>
        </div>

        {onNavigateApply && (
          <button
            onClick={onNavigateApply}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plane size={15} />
            <span>Apply New Visa</span>
          </button>
        )}
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: TOP METRIC STATS CARDS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Applications</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(applications.length).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">All logged submissions</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">Under Review</p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {String(applications.filter((a) => a.status === "Under Review" || a.status === "Submitted" || a.status === "Embassy Processing" || a.status === "Docs Pending").length).padStart(2, "0")}
          </p>
          <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
            <Clock size={10} /> Active processing
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">Approved Visas</p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {String(applications.filter((a) => a.status === "Approved").length).padStart(2, "0")}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 size={10} /> E-Visa ready
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-red-500">
          <p className="text-[11px] font-semibold text-red-700 uppercase tracking-wide">Rejected</p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {String(applications.filter((a) => a.status === "Rejected").length).padStart(2, "0")}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Consular decisions</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs col-span-2 sm:col-span-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Avg Processing</p>
          <p className="text-2xl font-black text-slate-900 mt-1">5 - 7 Days</p>
          <span className="text-[10px] text-slate-400 font-medium">Standard turnaround</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: SEARCH & FILTER CONTROLS */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search App ID, Country, Passport, Traveler..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4848F7]"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="review">Under Review</option>
              <option value="Docs Pending">Docs Required</option>
              <option value="Rejected">Rejected</option>
              <option value="Draft">Draft</option>
            </select>

            <select
              value={visaTypeFilter}
              onChange={(e) => setVisaTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7] cursor-pointer"
            >
              <option value="all">All Visa Types</option>
              <option value="Tourist">Tourist Visa</option>
              <option value="Business">Business Visa</option>
              <option value="Student">Student Visa</option>
              <option value="Transit">Transit Visa</option>
            </select>

            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7] cursor-pointer"
            >
              <option value="all">All Destinations</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="UK">United Kingdom</option>
              <option value="USA">USA</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="United Arab Emirates">UAE</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7] cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="status">Sort: By Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 4: APPLICATIONS DATA TABLE */}
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
                        {a.submissionDate || "18 Aug 2026"}
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
                            className="bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#4848F7] text-slate-700 font-bold px-2.5 py-1 rounded-lg transition text-[11px] cursor-pointer"
                          >
                            Details
                          </button>

                          {a.status === "Approved" && (
                            <button
                              onClick={() => alert(`Downloading E-Visa PDF for ${a.id}...`)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg transition text-[11px] flex items-center gap-1 cursor-pointer"
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
      {/* SECTION 5: SELECTED APPLICATION DEEP-DIVE INSPECTOR */}
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

          {/* Feedback Alert for Upload */}
          {docUploadSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{docUploadSuccess}</span>
            </div>
          )}

          {/* SUBTAB 1: OVERVIEW & PERSONAL/TRAVEL DETAILS */}
          {detailTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
                    <span className="font-bold text-slate-900 font-mono">{activeApp.passportNumber || "N/A"}</span>
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
                    <span className="text-slate-500 font-medium block">Nationality</span>
                    <span className="font-semibold text-slate-800">{activeApp.nationality || "Indian"}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Submission Date</span>
                    <span className="font-semibold text-slate-800">{activeApp.submissionDate || "18 Aug 2026"}</span>
                  </div>
                </div>
              </div>

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
                    <span className="font-bold text-slate-900">{activeApp.visaType}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Intended Travel Dates</span>
                    <span className="font-semibold text-slate-800">{activeApp.travelDates || "Flexible / TBA"}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Processing Speed Tier</span>
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      Standard Consular (5-7 Days)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Current Status</span>
                    <div>{getStatusBadge(activeApp.status)}</div>
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
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">Application Form & Documents Submitted</span>
                      <span className="text-[11px] text-slate-400">{activeApp.submissionDate}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Initial digital submission validated. Application ID {activeApp.id} generated.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">Document Verification Audit</span>
                      <span className="text-[11px] text-slate-400">In Progress</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Passport scan, photo, and financial records uploaded to ImageKit secure storage.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100 animate-pulse" />
                  <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-amber-900">Consular Pipeline Status</span>
                      <span className="text-[11px] text-amber-700">{activeApp.status}</span>
                    </div>
                    <p className="text-xs text-amber-800">
                      Files transmitted securely to embassy processing pipeline. Under active evaluation by visa officer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: REAL DOCUMENTS FROM IMAGEKIT */}
          {detailTab === "documents" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <FileCheck size={16} className="text-[#4848F7]" />
                    <span>Uploaded Documents & Verification Hub ({activeDocs.length})</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Real-time document scans stored securely on ImageKit CDN with consular OCR validation.
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">ImageKit Asset Pipeline Active</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeDocs.map((doc: any, idx: number) => {
                  const docId = String(doc._id || doc.requirementId || `doc-${idx + 1}`);
                  const fileUrlLower = (doc.fileUrl || "").toLowerCase().trim();
                  const fileNameLower = (doc.fileName || "").toLowerCase().trim();
                  const isExplicitPdf = fileUrlLower.endsWith(".pdf") || fileNameLower.endsWith(".pdf");
                  const isImage = Boolean(doc.fileUrl) && !isExplicitPdf;
                  const isPdf = Boolean(doc.fileUrl) && isExplicitPdf;
                  const isUploading = uploadingDocId === docId;
                  const isActionRequired = doc.status === "needs_review" || doc.status === "rejected";

                  return (
                    <div
                      key={docId}
                      className={`border rounded-2xl p-4 transition-all duration-150 flex flex-col justify-between space-y-3 ${
                        isActionRequired
                          ? "bg-red-50/40 border-red-200 shadow-2xs"
                          : doc.status === "verified"
                          ? "bg-slate-50/70 border-slate-200 hover:border-indigo-200"
                          : "bg-amber-50/20 border-amber-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Thumbnail / Document Type Icon */}
                        {isImage ? (
                          <div
                            onClick={() => setPreviewDoc(doc)}
                            className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 cursor-pointer group relative shadow-2xs flex items-center justify-center"
                            title="Click to preview full resolution scan"
                          >
                            <img
                              src={doc.fileUrl}
                              alt={doc.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-200"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = "none";
                                const parent = (e.currentTarget as HTMLElement).parentElement;
                                if (parent && !parent.querySelector(".img-fallback-badge")) {
                                  const fallback = document.createElement("div");
                                  fallback.className = "img-fallback-badge w-full h-full flex flex-col items-center justify-center bg-blue-50 text-[#4848F7] font-bold text-[9px]";
                                  fallback.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg><span>IMG</span>`;
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                              <Eye size={16} />
                            </div>
                          </div>
                        ) : isPdf ? (
                          <div
                            onClick={() => setPreviewDoc(doc)}
                            className="w-14 h-14 rounded-xl bg-red-100 text-red-600 flex flex-col items-center justify-center shrink-0 border border-red-200 cursor-pointer shadow-2xs hover:scale-105 transition"
                            title="Click to view PDF document"
                          >
                            <FileText size={22} />
                            <span className="text-[9px] font-black uppercase tracking-tighter">PDF</span>
                          </div>
                        ) : (
                          <div
                            onClick={() => setPreviewDoc(doc)}
                            className="w-14 h-14 rounded-xl bg-indigo-50 text-[#4848F7] flex flex-col items-center justify-center shrink-0 border border-indigo-200 cursor-pointer shadow-2xs hover:scale-105 transition"
                          >
                            <FileCheck size={22} />
                            <span className="text-[9px] font-black uppercase tracking-tighter">DOC</span>
                          </div>
                        )}

                        {/* Title & Metadata */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <h5 className="text-xs font-bold text-slate-900 truncate" title={doc.title}>
                              {doc.title}
                            </h5>
                          </div>

                          <p className="text-[11px] text-slate-500 truncate">
                            {doc.fileName || doc.documentType || "Uploaded Scan"}
                          </p>

                          {/* ImageKit Link Badge */}
                          {doc.fileUrl && (
                            <div className="flex items-center gap-1.5 pt-0.5">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-[#4848F7] font-mono text-[9px] font-bold border border-blue-100 truncate max-w-[190px]">
                                <ImageIcon size={9} /> ImageKit CDN Asset
                              </span>
                            </div>
                          )}

                          {/* Status Pill */}
                          <div className="pt-1">
                            {doc.status === "verified" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 size={11} /> Verified by Consular Specialist
                              </span>
                            ) : isActionRequired ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-red-700 bg-red-100/80 px-2 py-0.5 rounded-full border border-red-300">
                                <AlertTriangle size={11} /> {doc.rejectionReason || "Action Required &bull; Re-upload Scan"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                <Clock size={11} /> Under Verification Audit
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-xs">
                        <div className="flex items-center gap-1.5">
                          {doc.fileUrl && (
                            <>
                              <button
                                onClick={() => setPreviewDoc(doc)}
                                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
                                title="View Document Preview"
                              >
                                <Eye size={12} /> View
                              </button>
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 hover:bg-slate-200 text-slate-500 rounded-md transition cursor-pointer"
                                title="Open full ImageKit asset in new tab"
                              >
                                <ExternalLink size={13} />
                              </a>
                            </>
                          )}
                        </div>

                        <button
                          disabled={isUploading}
                          onClick={() => handleTriggerReplace(docId, doc.title)}
                          className={`font-bold text-[11px] px-3 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                            isActionRequired
                              ? "bg-red-600 hover:bg-red-700 text-white shadow-xs"
                              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {isUploading ? (
                            <>
                              <RefreshCw size={11} className="animate-spin" /> Uploading...
                            </>
                          ) : (
                            <>
                              <Upload size={11} /> {isActionRequired ? "Re-Upload File" : "Replace File"}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
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
      {/* DOCUMENT PREVIEW LIGHTBOX MODAL */}
      {/* ============================================================ */}
      {previewDoc && (
        <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#4848F7] flex items-center justify-center text-white font-bold">
                  <FileCheck size={20} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>{previewDoc.title}</span>
                    {previewDoc.status === "verified" ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                        Verified ✓
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">
                        Under Audit
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {previewDoc.fileName || previewDoc.documentType || "ImageKit Asset"}
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

            {/* Modal URL Bar */}
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-600 truncate flex-1">
                <span className="font-bold text-slate-400">CDN:</span>
                <span className="truncate">{previewDoc.fileUrl}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(previewDoc.fileUrl);
                    setDocUploadSuccess("ImageKit URL copied to clipboard!");
                    setTimeout(() => setDocUploadSuccess(null), 3000);
                  }}
                  className="px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                  title="Copy ImageKit URL"
                >
                  <Copy size={11} /> Copy URL
                </button>
                <a
                  href={previewDoc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                  title="Open in new tab"
                >
                  <ExternalLink size={11} /> Open Direct
                </a>
              </div>
            </div>

            {/* Modal Body Preview Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex items-center justify-center bg-slate-100/60 min-h-[300px]">
              {(previewDoc.fileUrl.toLowerCase().endsWith(".pdf") || previewDoc.fileName?.toLowerCase().endsWith(".pdf")) && !previewDoc.fileUrl.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif|svg|avif)/i) ? (
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

            {/* Modal Footer */}
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

      {/* ============================================================ */}
      {/* SECTION 6: CONSULAR FAQS & SUPPORT ACCORDION */}
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
