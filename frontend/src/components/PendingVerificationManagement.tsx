"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Check,
  X,
  Clock,
  Send,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  Copy,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { useVisa } from "../context/VisaContext";
import { API_V1_URL } from "../config/api";

export interface PendingVerificationRecord {
  id: string;
  docId: string;
  appId: string;
  applicantName: string;
  passportNumber: string;
  documentType: string;
  documentName: string;
  fileFormat: "PDF" | "JPG" | "PNG";
  fileSize: string;
  fileUrl: string;
  uploadedBy: "Applicant" | "Agent";
  agentName?: string;
  uploadDate: string;
  uploadDateTime: string;
  priority: "Normal" | "High" | "Urgent";
  status: "Pending Verification" | "Verified" | "Rejected" | "Re-upload Requested";
  expiryDate?: string;
  country?: string;
  rejectionReason?: string;
  verificationChecklist: {
    documentIsClear: boolean;
    infoMatchesApp: boolean;
    documentIsValid: boolean;
    notExpired: boolean;
    noAlterations: boolean;
    meetsEmbassyReqs: boolean;
  };
  verificationNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_PENDING_VERIFICATION_TABS = [
  "Overview",
  "Applicant Details",
  "Document Preview",
  "Verification Checklist",
  "Verification Notes"
];

export const PENDING_VERIFICATION_WORKFLOW_STEPS = [
  "Document Uploaded",
  "Pending Verification",
  "Consular / Agent Review",
  "Verified / Rejected / Re-upload Requested",
  "Applicant Real-Time Notification & Live Status Sync"
];

export const PROFESSIONAL_VERIFICATION_RULES = [
  "Verify document clarity",
  "Check document validity",
  "Verify applicant information",
  "Check document expiry date",
  "Detect duplicate uploads",
  "Match visa requirements",
  "Ensure embassy compliance"
];

const STANDARD_DEFICIENCY_REASONS = [
  "Blurry or Low-Resolution Scan (Text unreadable)",
  "Passport Details / Name Mismatch with Application",
  "Bank Statement Outdated / Missing Bank Wet Stamp",
  "Incomplete Schedule / Missing Supporting Pages",
  "Document Expired or Validity Less Than 6 Months",
  "Incorrect Document Format or Type Uploaded",
  "Other / Custom Consular Deficiency Remark"
];

export interface PendingVerificationManagementProps {
  agentId?: string;
}

export default function PendingVerificationManagement({ agentId: propAgentId }: PendingVerificationManagementProps = {}) {
  const { authSession, currentRole } = useVisa();

  // Records & Loading State
  const [pendingDocs, setPendingDocs] = useState<PendingVerificationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [docTypeFilter, setDocTypeFilter] = useState("All");
  const [uploadedByFilter, setUploadedByFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");

  // Category Pill Filter Tabs State
  const [activeCategoryTab, setActiveCategoryTab] = useState<
    "all" | "pending" | "verified" | "reupload" | "rejected" | "priority"
  >("all");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Popup Modal State
  const [activeModalDoc, setActiveModalDoc] = useState<PendingVerificationRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // Preview Controls State
  const [previewZoom, setPreviewZoom] = useState<number>(100);
  const [previewRotation, setPreviewRotation] = useState<number>(0);

  // Reason Action Modal (Strictly Mandatory Reason for Reject / Re-upload)
  const [actionModal, setActionModal] = useState<{
    doc: PendingVerificationRecord;
    actionType: "reject" | "reupload";
    presetReason: string;
    customReason: string;
    error: string | null;
  } | null>(null);

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Fetch Agent-Scoped Document Queue from Real Backend
  const fetchDocuments = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setIsRefreshing(true);
      else setLoading(true);

      const token = authSession?.token || localStorage.getItem("token") || "";
      const isAgentScope =
        Boolean(propAgentId) ||
        currentRole === "Agent" ||
        currentRole === "agent" ||
        (typeof window !== "undefined" && (window.location.pathname.includes("agent") || window.location.search.includes("agent")));

      const resolvedAgentId =
        propAgentId ||
        authSession?.user?.agentId ||
        (authSession as any)?.agentId ||
        (authSession?.user as any)?.id ||
        (isAgentScope ? "AGT-1001" : "");

      // If in Agent scope, pass agentId for server-side scoping
      const url = isAgentScope && resolvedAgentId
        ? `${API_V1_URL}/applications/admin/all-documents?agentId=${encodeURIComponent(resolvedAgentId)}`
        : `${API_V1_URL}/applications/admin/all-documents`;

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(url, { headers });
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        const mapped: PendingVerificationRecord[] = data.data.map((d: any, idx: number) => ({
          id: d.id || `doc_${idx}`,
          docId: d.docId || `DOC-${String(idx + 1).padStart(5, "0")}`,
          appId: d.appId || "APP-000",
          applicantName: d.applicantName || "Applicant",
          passportNumber: d.passportNumber || "N/A",
          documentType: d.documentType || "Passport",
          documentName: d.documentName || "document.pdf",
          fileFormat: d.fileFormat || (d.fileUrl?.endsWith(".pdf") ? "PDF" : "JPG"),
          fileSize: d.fileSize || "2.4 MB",
          fileUrl: d.fileUrl || "",
          uploadedBy: d.uploadedBy || "Applicant",
          agentName: d.agentName || "",
          uploadDate: d.uploadDate || "",
          uploadDateTime: d.uploadDateTime || "",
          priority: d.priority || "Normal",
          status: d.status || d.verificationStatus || "Pending Verification",
          expiryDate: d.expiryDate || "",
          country: d.country || "",
          rejectionReason: d.rejectionReason || "",
          verificationChecklist: {
            documentIsClear: true,
            infoMatchesApp: true,
            documentIsValid: true,
            notExpired: true,
            noAlterations: true,
            meetsEmbassyReqs: true
          },
          verificationNotes: []
        }));
        setPendingDocs(mapped);
      } else {
        setPendingDocs([]);
      }
    } catch (err) {
      console.error("Fetch document queue error:", err);
      setPendingDocs([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [authSession, currentRole]);

  // Live Scoped Metric Counts (Single Source of Truth)
  const allCount = pendingDocs.length;
  const pendingCount = pendingDocs.filter((d) => d.status === "Pending Verification").length;
  const verifiedCount = pendingDocs.filter((d) => d.status === "Verified").length;
  const reuploadCount = pendingDocs.filter((d) => d.status === "Re-upload Requested").length;
  const rejectedCount = pendingDocs.filter((d) => d.status === "Rejected").length;
  const priorityCount = pendingDocs.filter((d) => d.priority === "High" || d.priority === "Urgent").length;

  // Extract unique countries and document types for filters
  const uniqueCountries = useMemo(() => {
    const set = new Set<string>();
    pendingDocs.forEach((d) => {
      if (d.country) set.add(d.country);
    });
    return Array.from(set);
  }, [pendingDocs]);

  const uniqueDocTypes = useMemo(() => {
    const set = new Set<string>();
    pendingDocs.forEach((d) => {
      if (d.documentType) set.add(d.documentType);
    });
    return Array.from(set);
  }, [pendingDocs]);

  // Live Filtered Documents
  const filteredDocs = useMemo(() => {
    return pendingDocs.filter((doc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        doc.docId.toLowerCase().includes(q) ||
        doc.appId.toLowerCase().includes(q) ||
        doc.applicantName.toLowerCase().includes(q) ||
        doc.passportNumber.toLowerCase().includes(q) ||
        doc.documentName.toLowerCase().includes(q) ||
        (doc.agentName && doc.agentName.toLowerCase().includes(q));

      let matchesCategory = true;
      if (activeCategoryTab === "pending") matchesCategory = doc.status === "Pending Verification";
      else if (activeCategoryTab === "verified") matchesCategory = doc.status === "Verified";
      else if (activeCategoryTab === "reupload") matchesCategory = doc.status === "Re-upload Requested";
      else if (activeCategoryTab === "rejected") matchesCategory = doc.status === "Rejected";
      else if (activeCategoryTab === "priority") matchesCategory = doc.priority === "High" || doc.priority === "Urgent";

      const matchesType = docTypeFilter === "All" || doc.documentType === docTypeFilter;
      const matchesUploadedBy = uploadedByFilter === "All" || doc.uploadedBy === uploadedByFilter;
      const matchesPriority = priorityFilter === "All" || doc.priority === priorityFilter;
      const matchesCountry = countryFilter === "All" || doc.country === countryFilter;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesType &&
        matchesUploadedBy &&
        matchesPriority &&
        matchesCountry
      );
    });
  }, [
    pendingDocs,
    searchQuery,
    activeCategoryTab,
    docTypeFilter,
    uploadedByFilter,
    priorityFilter,
    countryFilter
  ]);

  // Contextual Empty-State Messaging
  const getEmptyStateMessage = () => {
    if (searchQuery.trim()) {
      return {
        title: "No Matching Verification Documents Found",
        subtitle: `No documents matched your search query "${searchQuery}". Try refining your keywords or clearing the search filter.`
      };
    }
    switch (activeCategoryTab) {
      case "pending":
        return {
          title: "No Pending Verification Documents",
          subtitle: "All assigned applicant documents are currently verified or up to date in your queue."
        };
      case "verified":
        return {
          title: "No Verified Documents Found",
          subtitle: "There are currently no verified documents recorded under the selected filters."
        };
      case "reupload":
        return {
          title: "No Re-upload Requests Pending",
          subtitle: "No applicants currently have deficiency notices or re-upload requests in this queue."
        };
      case "rejected":
        return {
          title: "No Rejected Documents Found",
          subtitle: "There are no rejected non-compliant documents on file in your queue."
        };
      case "priority":
        return {
          title: "No High Priority Cases",
          subtitle: "There are no Express or VIP fast-track document reviews pending right now."
        };
      default:
        return {
          title: "No Documents Found in Queue",
          subtitle: "There are no uploaded documents on file for the applications assigned to your agency."
        };
    }
  };

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredDocs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDocs.map((d) => d.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Real Approve Action Handler
  const handleApproveDocument = async (doc: PendingVerificationRecord) => {
    const verifiedBy = authSession?.user?.name || (currentRole === "agent" ? "Assigned Visa Agent" : "Consular Officer");
    try {
      // Optimistic state update
      setPendingDocs((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, status: "Verified", rejectionReason: "" } : d))
      );
      if (activeModalDoc?.id === doc.id) {
        setActiveModalDoc((prev) => (prev ? { ...prev, status: "Verified", rejectionReason: "" } : null));
      }
      triggerToast(`Document ${doc.docId} verified and approved successfully!`);

      // Persist to unified MongoDB Application document endpoint
      const token = authSession?.token || localStorage.getItem("token") || "";
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      await fetch(`${API_V1_URL}/applications/${doc.appId}/documents/${doc.id}/status`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status: "verified", verifiedBy })
      });

      // Refetch to guarantee 100% sync
      fetchDocuments(true);
    } catch (err) {
      console.error("Approve document error:", err);
      triggerToast(`Failed to update status for ${doc.docId}`);
    }
  };

  // Open Mandatory Reason Modal for Rejection or Re-upload Request
  const openActionReasonModal = (doc: PendingVerificationRecord, actionType: "reject" | "reupload") => {
    setActionModal({
      doc,
      actionType,
      presetReason: STANDARD_DEFICIENCY_REASONS[0],
      customReason: "",
      error: null
    });
  };

  // Submit Mandatory Reason Action (Reject or Re-upload Requested)
  const handleSubmitActionReason = async () => {
    if (!actionModal) return;
    const { doc, actionType, presetReason, customReason } = actionModal;

    const finalReason =
      presetReason === "Other / Custom Consular Deficiency Remark"
        ? customReason.trim()
        : customReason.trim()
        ? `${presetReason} — ${customReason.trim()}`
        : presetReason.trim();

    if (!finalReason) {
      setActionModal((prev) => (prev ? { ...prev, error: "A detailed consular reason is strictly mandatory." } : null));
      return;
    }

    const verifiedBy = authSession?.user?.name || (currentRole === "agent" ? "Assigned Visa Agent" : "Consular Officer");
    const targetStatus = actionType === "reject" ? "Rejected" : "Re-upload Requested";
    const apiStatus = actionType === "reject" ? "rejected" : "needs_review";

    try {
      // Optimistic state update
      setPendingDocs((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, status: targetStatus, rejectionReason: finalReason } : d))
      );
      if (activeModalDoc?.id === doc.id) {
        setActiveModalDoc((prev) => (prev ? { ...prev, status: targetStatus, rejectionReason: finalReason } : null));
      }

      setActionModal(null);
      triggerToast(
        actionType === "reject"
          ? `Document ${doc.docId} marked as Rejected.`
          : `Deficiency notice issued: Re-upload requested for ${doc.docId}.`
      );

      // Persist to unified MongoDB Application document endpoint
      const token = authSession?.token || localStorage.getItem("token") || "";
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      await fetch(`${API_V1_URL}/applications/${doc.appId}/documents/${doc.id}/status`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          status: apiStatus,
          rejectionReason: finalReason,
          verifiedBy
        })
      });

      // Refetch to guarantee 100% sync
      fetchDocuments(true);
    } catch (err) {
      console.error("Update document status error:", err);
      triggerToast(`Failed to update status for ${doc.docId}`);
    }
  };

  const handleToggleChecklist = (field: keyof PendingVerificationRecord["verificationChecklist"]) => {
    if (!activeModalDoc) return;
    const updatedChecklist = {
      ...activeModalDoc.verificationChecklist,
      [field]: !activeModalDoc.verificationChecklist[field]
    };
    setActiveModalDoc({ ...activeModalDoc, verificationChecklist: updatedChecklist });
    setPendingDocs((prev) =>
      prev.map((d) => (d.id === activeModalDoc.id ? { ...d, verificationChecklist: updatedChecklist } : d))
    );
    triggerToast("Verification checklist item updated.");
  };

  // Bulk Verification
  const handleBulkVerify = async () => {
    if (selectedIds.length === 0) return;
    const verifiedBy = authSession?.user?.name || "Assigned Visa Agent";
    const token = authSession?.token || localStorage.getItem("token") || "";
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const selectedDocs = pendingDocs.filter((d) => selectedIds.includes(d.id));

    setPendingDocs((prev) =>
      prev.map((d) => (selectedIds.includes(d.id) ? { ...d, status: "Verified" } : d))
    );
    triggerToast(`${selectedIds.length} documents verified successfully!`);
    setSelectedIds([]);

    await Promise.all(
      selectedDocs.map((doc) =>
        fetch(`${API_V1_URL}/applications/${doc.appId}/documents/${doc.id}/status`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ status: "verified", verifiedBy })
        }).catch((err) => console.error(err))
      )
    );

    fetchDocuments(true);
  };

  const emptyState = getEmptyStateMessage();

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

      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-6 rounded-3xl shadow-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-700">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-200 mb-1">
            <Clock size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Document Audit Queue & Verification Controls
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Document Verification
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Review, verify, and audit documents submitted by applicants and agents before processing visa applications.
          </p>
        </div>

        <button
          onClick={() => fetchDocuments(true)}
          disabled={isRefreshing}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 border border-white/20 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          <span>{isRefreshing ? "Syncing Queue..." : "Sync Live Queue"}</span>
        </button>
      </div>

      {/* TOP INTERACTIVE STATISTICS CARDS (CLICK TO FILTER) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <button
            type="button"
            onClick={() => setActiveCategoryTab("pending")}
            className={`text-left p-4 rounded-3xl border transition-all cursor-pointer hover:shadow-md ${
              activeCategoryTab === "pending"
                ? "bg-blue-50/50 border-[#2563EB] ring-2 ring-[#2563EB]/30 shadow-sm"
                : "bg-white border-slate-200 shadow-2xs hover:border-slate-300"
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Pending Documents</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{pendingCount}</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Total Verification Queue</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab("all")}
            className={`text-left p-4 rounded-3xl border transition-all cursor-pointer hover:shadow-md ${
              activeCategoryTab === "all"
                ? "bg-blue-50/50 border-[#2563EB] ring-2 ring-[#2563EB]/30 shadow-sm"
                : "bg-white border-slate-200 shadow-2xs hover:border-slate-300"
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">All Documents</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{allCount}</div>
            <span className="text-[10px] text-blue-600 font-bold">Total File Registry</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab("verified")}
            className={`text-left p-4 rounded-3xl border transition-all cursor-pointer hover:shadow-md ${
              activeCategoryTab === "verified"
                ? "bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-500/30 shadow-sm"
                : "bg-white border-slate-200 shadow-2xs hover:border-slate-300"
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Verified Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{verifiedCount}</div>
            <span className="text-[10px] text-emerald-600 font-bold">Audited & Approved</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab("rejected")}
            className={`text-left p-4 rounded-3xl border transition-all cursor-pointer hover:shadow-md ${
              activeCategoryTab === "rejected"
                ? "bg-red-50/50 border-red-500 ring-2 ring-red-500/30 shadow-sm"
                : "bg-white border-slate-200 shadow-2xs hover:border-slate-300"
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Rejected Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{rejectedCount}</div>
            <span className="text-[10px] text-red-600 font-bold">Non-Compliant Files</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab("reupload")}
            className={`text-left p-4 rounded-3xl border transition-all cursor-pointer hover:shadow-md ${
              activeCategoryTab === "reupload"
                ? "bg-purple-50/50 border-purple-500 ring-2 ring-purple-500/30 shadow-sm"
                : "bg-white border-slate-200 shadow-2xs hover:border-slate-300"
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Re-upload Requested</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{reuploadCount}</div>
            <span className="text-[10px] text-purple-600 font-bold">Deficiency Notice Sent</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab("priority")}
            className={`text-left p-4 rounded-3xl border transition-all cursor-pointer hover:shadow-md ${
              activeCategoryTab === "priority"
                ? "bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/30 shadow-sm"
                : "bg-white border-slate-200 shadow-2xs hover:border-slate-300"
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">High Priority Cases</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{priorityCount}</div>
            <span className="text-[10px] text-amber-600 font-bold">Express Fast-Track</span>
          </button>
        </div>

        {/* RIGHT CARD: RECOMMENDED TABS, WORKFLOW & VERIFICATION RULES */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Verification Workflow
            </h3>

            {/* VERIFICATION WORKFLOW FLOW */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {PENDING_VERIFICATION_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-[9px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* PROFESSIONAL VERIFICATION RULES LIST */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-900 font-bold block mb-1">Professional Verification Rules:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                {PROFESSIONAL_VERIFICATION_RULES.map((rule, i) => (
                  <div key={i} className="flex items-center gap-1 text-slate-700">
                    <Check size={11} className="text-[#2563EB]" /> {rule}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER PILL TABS BAR */}
      <div className="bg-white border border-slate-200 rounded-3xl p-3 shadow-2xs mb-6 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <button
            type="button"
            onClick={() => setActiveCategoryTab("all")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
              activeCategoryTab === "all"
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <span>All Documents</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeCategoryTab === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
            }`}>
              {allCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab("pending")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
              activeCategoryTab === "pending"
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <span>Pending Verification</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeCategoryTab === "pending" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
            }`}>
              {pendingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab("verified")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
              activeCategoryTab === "verified"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <span>Verified Documents</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeCategoryTab === "verified" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
            }`}>
              {verifiedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab("reupload")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
              activeCategoryTab === "reupload"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <span>Re-upload Requested</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeCategoryTab === "reupload" ? "bg-white/20 text-white" : "bg-purple-100 text-purple-800"
            }`}>
              {reuploadCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab("rejected")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
              activeCategoryTab === "rejected"
                ? "bg-red-600 text-white shadow-md shadow-red-500/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <span>Rejected Documents</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeCategoryTab === "rejected" ? "bg-white/20 text-white" : "bg-red-100 text-red-800"
            }`}>
              {rejectedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab("priority")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
              activeCategoryTab === "priority"
                ? "bg-amber-600 text-white shadow-md shadow-amber-500/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <span>High Priority</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeCategoryTab === "priority" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
            }`}>
              {priorityCount}
            </span>
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-[#2563EB]" />
            <h3 className="font-extrabold text-sm text-slate-900 font-outfit">Search & Verification Filters</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900 font-mono">{filteredDocs.length}</strong> of <strong className="text-slate-900 font-mono">{allCount}</strong> Assigned Documents
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* SEARCH INPUT */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (Doc ID, App ID, Applicant, Passport)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="DOC-00045, VO-2026-1045..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-8 pr-3 py-2 rounded-xl font-medium focus:bg-white focus:border-[#2563EB] outline-none"
              />
            </div>
          </div>

          {/* DOCUMENT TYPE */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Document Type
            </label>
            <select
              value={docTypeFilter}
              onChange={(e) => setDocTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold focus:bg-white focus:border-[#2563EB] outline-none cursor-pointer"
            >
              <option value="All">All Types</option>
              {uniqueDocTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* UPLOADED BY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Uploaded By
            </label>
            <select
              value={uploadedByFilter}
              onChange={(e) => setUploadedByFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold focus:bg-white focus:border-[#2563EB] outline-none cursor-pointer"
            >
              <option value="All">All Channels</option>
              <option value="Applicant">Applicant Direct</option>
              <option value="Agent">Assigned Agent</option>
            </select>
          </div>

          {/* PRIORITY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Priority Tier
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold focus:bg-white focus:border-[#2563EB] outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Normal">Normal</option>
              <option value="High">High (Express)</option>
              <option value="Urgent">Urgent (VIP)</option>
            </select>
          </div>

          {/* COUNTRY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Destination Country
            </label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold focus:bg-white focus:border-[#2563EB] outline-none cursor-pointer"
            >
              <option value="All">All Countries</option>
              {uniqueCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CONTEXTUAL BULK ACTIONS TOOLBAR */}
      {selectedIds.length > 0 && (
        <div className="bg-[#0E1A2C] border border-[#2563EB]/40 text-white p-3.5 rounded-2xl shadow-xl mb-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-6 h-6 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-mono font-bold text-xs">
              {selectedIds.length}
            </span>
            <span>Documents Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkVerify}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 size={14} /> Verify Selected
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* PENDING VERIFICATION TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredDocs.length && filteredDocs.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-mono">Document ID</th>
                <th className="py-3.5 px-4 font-mono">Application ID</th>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Document Type</th>
                <th className="py-3.5 px-4">Uploaded By</th>
                <th className="py-3.5 px-4 font-mono">Upload Date</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <RefreshCw size={28} className="mx-auto mb-2 animate-spin text-[#2563EB]" />
                    <p className="font-bold text-slate-600">Loading live document queue...</p>
                  </td>
                </tr>
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Clock size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-700 text-sm">{emptyState.title}</p>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                      {emptyState.subtitle}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((d) => {
                  const isVerified = d.status === "Verified";
                  const isRejected = d.status === "Rejected";
                  const isReupload = d.status === "Re-upload Requested";

                  return (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(d.id)}
                          onChange={() => handleToggleSelect(d.id)}
                          className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{d.docId}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">{d.appId}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div>{d.applicantName}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{d.passportNumber}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{d.documentType}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{d.documentName}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{d.uploadedBy}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{d.uploadDate}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            d.priority === "Urgent"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : d.priority === "High"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {d.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1 ${
                            isVerified
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : isRejected
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : isReupload
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-blue-50 text-[#2563EB] border border-blue-200"
                          }`}
                        >
                          {isVerified ? (
                            <CheckCircle2 size={11} />
                          ) : isRejected ? (
                            <XCircle size={11} />
                          ) : isReupload ? (
                            <RotateCcw size={11} />
                          ) : (
                            <Clock size={11} />
                          )}
                          <span>{d.status}</span>
                        </span>
                        {d.rejectionReason && (
                          <p className="text-[10px] text-red-600 font-sans mt-0.5 max-w-[180px] truncate" title={d.rejectionReason}>
                            {d.rejectionReason}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* VIEW DOCUMENT ACTION */}
                          <button
                            onClick={() => {
                              setActiveModalDoc(d);
                              setModalTab("Document Preview");
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="View Full Document Details"
                          >
                            <Eye size={15} />
                          </button>

                          {/* APPROVE ACTION */}
                          <button
                            onClick={() => handleApproveDocument(d)}
                            disabled={isVerified}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              isVerified
                                ? "text-slate-300 opacity-50 cursor-not-allowed"
                                : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                            }`}
                            title="Approve / Verify Document"
                          >
                            <CheckCircle2 size={15} />
                          </button>

                          {/* RE-UPLOAD REQUEST ACTION */}
                          <button
                            onClick={() => openActionReasonModal(d, "reupload")}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition cursor-pointer"
                            title="Request Re-upload (Deficiency Notice)"
                          >
                            <RotateCcw size={15} />
                          </button>

                          {/* REJECT ACTION */}
                          <button
                            onClick={() => openActionReasonModal(d, "reject")}
                            disabled={isRejected}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              isRejected
                                ? "text-slate-300 opacity-50 cursor-not-allowed"
                                : "text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            }`}
                            title="Reject Document (Mandatory Reason)"
                          >
                            <XCircle size={15} />
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

        {/* PAGINATION FOOTER (100% SYNCHRONIZED & SCOPED) */}
        <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900 font-mono">{filteredDocs.length > 0 ? 1 : 0}–{filteredDocs.length}</strong> of{" "}
            <strong className="text-slate-900 font-mono">{filteredDocs.length}</strong> Assigned Verification Documents
          </div>
          <div className="flex items-center gap-1 font-mono font-bold">
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-600">
              Page 1 of 1
            </span>
          </div>
        </div>
      </div>

      {/* MANDATORY REASON MODAL FOR REJECT / RE-UPLOAD REQUEST */}
      {actionModal && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg ${
                    actionModal.actionType === "reject" ? "bg-rose-600 text-white" : "bg-purple-600 text-white"
                  }`}
                >
                  {actionModal.actionType === "reject" ? <XCircle size={20} /> : <RotateCcw size={20} />}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white font-outfit">
                    {actionModal.actionType === "reject"
                      ? "Reject Applicant Document"
                      : "Request Document Re-upload"}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Doc: {actionModal.doc.docId} &bull; App: {actionModal.doc.appId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActionModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 flex items-start gap-2.5">
                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Mandatory Requirement:</strong> The consular reason provided here will be stored in the document record and displayed in real time to the applicant on their portal.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                  Standard Deficiency Category
                </label>
                <select
                  value={actionModal.presetReason}
                  onChange={(e) =>
                    setActionModal({
                      ...actionModal,
                      presetReason: e.target.value,
                      error: null
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl font-semibold outline-none focus:border-blue-500 cursor-pointer"
                >
                  {STANDARD_DEFICIENCY_REASONS.map((r, i) => (
                    <option key={i} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                  Consular Remark / Specific Feedback (Mandatory)
                </label>
                <textarea
                  rows={3}
                  placeholder="Specify exact deficiency (e.g., 'Please upload original colour passport bio-page scan with all 4 corners visible')..."
                  value={actionModal.customReason}
                  onChange={(e) =>
                    setActionModal({
                      ...actionModal,
                      customReason: e.target.value,
                      error: null
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs p-3 rounded-xl font-medium outline-none focus:bg-white focus:border-blue-500"
                />
                {actionModal.error && (
                  <p className="text-xs text-rose-600 font-bold mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {actionModal.error}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setActionModal(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitActionReason}
                className={`px-4 py-2 text-white rounded-xl text-xs font-extrabold transition cursor-pointer shadow-md flex items-center gap-1.5 ${
                  actionModal.actionType === "reject"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                <Send size={13} />
                <span>
                  {actionModal.actionType === "reject"
                    ? "Submit Rejection"
                    : "Issue Deficiency Notice"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CENTERED POPUP DETAILS / LIGHTBOX MODAL */}
      {activeModalDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalDoc.documentName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-amber-300 bg-amber-900/50 px-2 py-0.5 rounded border border-amber-700">
                      {activeModalDoc.docId} ({activeModalDoc.status.toUpperCase()})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    App ID: <strong className="text-blue-300">{activeModalDoc.appId}</strong> &bull; Applicant: {activeModalDoc.applicantName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activeModalDoc.fileUrl && (
                  <a
                    href={activeModalDoc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <ExternalLink size={13} /> Open File
                  </a>
                )}
                <button
                  onClick={() => setActiveModalDoc(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* TAB BAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
              {RECOMMENDED_PENDING_VERIFICATION_TABS.map((tab) => {
                const active = modalTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setModalTab(tab)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      active
                        ? "bg-[#2563EB] text-white shadow-sm"
                        : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                    }`}
                  >
                    <span>{tab}</span>
                  </button>
                );
              })}
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6">
              {/* TAB: OVERVIEW */}
              {modalTab === "Overview" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">
                      Basic Document Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Document ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalDoc.docId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Document Type</span>
                        <strong className="text-slate-900 font-bold">{activeModalDoc.documentType}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Format & Size</span>
                        <strong className="text-purple-700 font-mono font-bold">{activeModalDoc.fileFormat} ({activeModalDoc.fileSize})</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Priority Tier</span>
                        <strong className="text-amber-600 font-bold">{activeModalDoc.priority}</strong>
                      </div>
                    </div>
                  </div>

                  {/* CHECKLIST SUMMARY */}
                  <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <ShieldCheck size={16} className="text-[#2563EB]" /> Official Verification Checklist
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-semibold text-slate-800">
                      {[
                        { key: "documentIsClear", label: "Document is Clear and Legible" },
                        { key: "infoMatchesApp", label: "Information Matches Application" },
                        { key: "documentIsValid", label: "Document is Authentic & Valid" },
                        { key: "notExpired", label: "Document is Not Expired" },
                        { key: "noAlterations", label: "No Signs of Tampering or Alteration" },
                        { key: "meetsEmbassyReqs", label: "Meets Target Embassy Requirements" }
                      ].map((item) => {
                        const checked = activeModalDoc.verificationChecklist[item.key as keyof PendingVerificationRecord["verificationChecklist"]];
                        return (
                          <label key={item.key} className="flex items-center gap-2.5 cursor-pointer p-2.5 bg-white rounded-xl border border-blue-100 hover:border-blue-300 transition">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleChecklist(item.key as any)}
                              className="rounded border-slate-300 text-[#2563EB]"
                            />
                            <span className={checked ? "text-slate-800" : "text-slate-400"}>
                              {item.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: DOCUMENT PREVIEW */}
              {modalTab === "Document Preview" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 font-outfit flex items-center gap-2">
                        <FileText size={16} className="text-blue-400" /> Document Preview Canvas
                      </h4>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setPreviewZoom((z) => Math.min(z + 20, 200))}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 cursor-pointer"
                          title="Zoom In"
                        >
                          <ZoomIn size={14} />
                        </button>
                        <button
                          onClick={() => setPreviewZoom((z) => Math.max(z - 20, 60))}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 cursor-pointer"
                          title="Zoom Out"
                        >
                          <ZoomOut size={14} />
                        </button>
                        <button
                          onClick={() => setPreviewRotation((r) => (r + 90) % 360)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 cursor-pointer"
                          title="Rotate"
                        >
                          <RotateCw size={14} />
                        </button>
                        {activeModalDoc.fileUrl && (
                          <a
                            href={activeModalDoc.fileUrl}
                            download={activeModalDoc.documentName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-[#2563EB] hover:bg-blue-700 rounded-lg text-white cursor-pointer ml-1 inline-flex"
                            title="Download"
                          >
                            <Download size={14} />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-950 rounded-2xl p-4 min-h-[360px] flex items-center justify-center border border-slate-800 overflow-hidden">
                      {activeModalDoc.fileUrl &&
                      (activeModalDoc.fileUrl.toLowerCase().endsWith(".png") ||
                        activeModalDoc.fileUrl.toLowerCase().endsWith(".jpg") ||
                        activeModalDoc.fileUrl.toLowerCase().endsWith(".jpeg") ||
                        activeModalDoc.fileUrl.toLowerCase().endsWith(".webp") ||
                        activeModalDoc.fileUrl.startsWith("data:image/")) ? (
                        <img
                          src={activeModalDoc.fileUrl}
                          alt={activeModalDoc.documentName}
                          className="max-h-[420px] max-w-full object-contain rounded-xl transition-all duration-200"
                          style={{ transform: `scale(${previewZoom / 100}) rotate(${previewRotation}deg)` }}
                        />
                      ) : activeModalDoc.fileUrl && activeModalDoc.fileUrl.toLowerCase().endsWith(".pdf") ? (
                        <iframe
                          src={activeModalDoc.fileUrl}
                          title={activeModalDoc.documentName}
                          className="w-full h-[400px] rounded-xl bg-white border-0"
                        />
                      ) : (
                        <div
                          className="text-center transition-all duration-200"
                          style={{ transform: `scale(${previewZoom / 100}) rotate(${previewRotation}deg)` }}
                        >
                          <FileText size={56} className="mx-auto mb-3 text-blue-400 animate-pulse" />
                          <p className="font-mono text-xs text-slate-200 font-bold">{activeModalDoc.documentName}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-1">Format: {activeModalDoc.fileFormat} &bull; Size: {activeModalDoc.fileSize}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: APPLICANT DETAILS */}
              {modalTab === "Applicant Details" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Applicant Full Name</span>
                      <strong className="text-slate-900 font-bold text-sm">{activeModalDoc.applicantName}</strong>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Passport Number</span>
                      <strong className="text-purple-700 font-mono font-bold text-sm">{activeModalDoc.passportNumber}</strong>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Application Reference</span>
                      <strong className="text-blue-600 font-mono font-bold">{activeModalDoc.appId}</strong>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Destination Country</span>
                      <strong className="text-slate-900 font-bold">{activeModalDoc.country || "General"}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: VERIFICATION NOTES */}
              {modalTab === "Verification Notes" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {activeModalDoc.rejectionReason ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900">
                      <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">
                        Consular Deficiency Remark on File
                      </span>
                      <p className="font-semibold text-xs leading-relaxed">{activeModalDoc.rejectionReason}</p>
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                      <FileText size={24} className="mx-auto mb-1 opacity-50" />
                      <p className="font-medium text-xs">No deficiency remarks or internal notes recorded.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApproveDocument(activeModalDoc)}
                  disabled={activeModalDoc.status === "Verified"}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shadow-sm ${
                    activeModalDoc.status === "Verified"
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  <CheckCircle2 size={15} /> Approve & Verify
                </button>
                <button
                  onClick={() => openActionReasonModal(activeModalDoc, "reject")}
                  disabled={activeModalDoc.status === "Rejected"}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                    activeModalDoc.status === "Rejected"
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-rose-600 hover:bg-rose-700 text-white"
                  }`}
                >
                  <XCircle size={15} /> Reject Document
                </button>
              </div>

              <button
                onClick={() => openActionReasonModal(activeModalDoc, "reupload")}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <RotateCcw size={14} /> Request Re-upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
