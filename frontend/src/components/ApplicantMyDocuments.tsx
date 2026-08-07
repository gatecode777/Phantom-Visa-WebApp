"use client";

import React, { useState, useMemo } from "react";
import { Application } from "../context/VisaContext";
import {
  FolderCheck,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  FileText,
  Eye,
  Download,
  Trash2,
  RefreshCw,
  Info,
  HelpCircle,
  Search,
  Filter,
  Layers,
  Lock,
  Calendar,
  Share2,
  Plus,
  ArrowRight,
  User,
  Plane,
  Building,
  HardDrive,
  BellRing,
  Bell,
  MessageSquare
} from "lucide-react";

export type VaultDocStatus = "verified" | "pending" | "rejected" | "expired" | "resubmit";

export interface VaultDocItem {
  id: string;
  name: string;
  category: "Identity" | "Financial" | "Employment" | "Travel" | "Personal" | "Other";
  uploadDate: string;
  issueDate?: string;
  expiryDate: string;
  verificationDate?: string;
  status: VaultDocStatus;
  size: string;
  fileName: string;
  format: string;
  updatedBy: string;
  notes?: string;
}

interface ApplicantMyDocumentsProps {
  applications: Application[];
  onNavigateUpload?: () => void;
  onNavigateSupport?: () => void;
}

export default function ApplicantMyDocuments({
  applications,
  onNavigateUpload,
  onNavigateSupport
}: ApplicantMyDocumentsProps) {
  // Mock stored vault items matching wireframe
  const [vaultItems, setVaultItems] = useState<VaultDocItem[]>([
    {
      id: "v-doc-1",
      name: "Passport Bio Page",
      category: "Identity",
      uploadDate: "07 Aug 2026",
      issueDate: "21 Dec 2023",
      expiryDate: "20 Dec 2033",
      verificationDate: "07 Aug 2026, 10:15 AM",
      status: "verified",
      size: "2.1 MB",
      fileName: "geeta_passport_bio.pdf",
      format: "PDF",
      updatedBy: "Applicant",
      notes: "Original high-res 300 DPI scan verified by consular agent."
    },
    {
      id: "v-doc-2",
      name: "Passport Back Page",
      category: "Identity",
      uploadDate: "07 Aug 2026",
      issueDate: "21 Dec 2023",
      expiryDate: "20 Dec 2033",
      verificationDate: "07 Aug 2026, 10:16 AM",
      status: "verified",
      size: "1.8 MB",
      fileName: "geeta_passport_back.jpg",
      format: "JPG",
      updatedBy: "Applicant",
      notes: "Permanent residential address verified."
    },
    {
      id: "v-doc-3",
      name: "Recent Photograph (35x45mm)",
      category: "Identity",
      uploadDate: "07 Aug 2026",
      issueDate: "01 Aug 2026",
      expiryDate: "07 Feb 2027",
      verificationDate: "07 Aug 2026, 10:18 AM",
      status: "verified",
      size: "850 KB",
      fileName: "geeta_photo_35x45.jpg",
      format: "JPG",
      updatedBy: "Applicant",
      notes: "Biometrics studio photo meeting 80% face coverage rule."
    },
    {
      id: "v-doc-4",
      name: "6-Month Bank Statement",
      category: "Financial",
      uploadDate: "07 Aug 2026",
      issueDate: "01 Feb 2026",
      expiryDate: "07 Nov 2026",
      verificationDate: "07 Aug 2026, 10:20 AM",
      status: "verified",
      size: "4.5 MB",
      fileName: "bank_statement_sbi.pdf",
      format: "PDF",
      updatedBy: "Applicant",
      notes: "Sufficient liquidity balance > ₹3,50,000 verified with bank stamp."
    },
    {
      id: "v-doc-5",
      name: "Employment NOC Letter",
      category: "Employment",
      uploadDate: "07 Aug 2026",
      issueDate: "15 Jul 2026",
      expiryDate: "07 Sep 2026",
      verificationDate: "07 Aug 2026, 10:25 AM",
      status: "rejected",
      size: "1.2 MB",
      fileName: "employment_noc_blurry.pdf",
      format: "PDF",
      updatedBy: "Consular Officer (Sarah Jenkins)",
      notes: "HR wet stamp is blurry and unverified. Resubmission required."
    },
    {
      id: "v-doc-6",
      name: "Flight Round-trip Ticket",
      category: "Travel",
      uploadDate: "07 Aug 2026",
      issueDate: "05 Aug 2026",
      expiryDate: "25 Aug 2026",
      verificationDate: "Pending Audit",
      status: "pending",
      size: "2.4 MB",
      fileName: "flight_itinerary.pdf",
      format: "PDF",
      updatedBy: "Applicant",
      notes: "Confirmed PNR itinerary pending airline desk check."
    },
    {
      id: "v-doc-7",
      name: "Hotel Booking Voucher",
      category: "Travel",
      uploadDate: "07 Aug 2026",
      issueDate: "05 Aug 2026",
      expiryDate: "25 Aug 2026",
      verificationDate: "Pending Audit",
      status: "pending",
      size: "1.9 MB",
      fileName: "hotel_booking_sydney.pdf",
      format: "PDF",
      updatedBy: "Applicant",
      notes: "Hotel accommodation confirmation in Sydney."
    },
    {
      id: "v-doc-8",
      name: "Income Tax Returns (ITR-V)",
      category: "Financial",
      uploadDate: "07 Aug 2026",
      issueDate: "30 Jun 2026",
      expiryDate: "31 Mar 2027",
      verificationDate: "07 Aug 2026, 10:35 AM",
      status: "verified",
      size: "3.1 MB",
      fileName: "itr_v_acknowledgement.pdf",
      format: "PDF",
      updatedBy: "Applicant"
    },
    {
      id: "v-doc-9",
      name: "Travel Insurance Policy",
      category: "Personal",
      uploadDate: "01 Jul 2026",
      issueDate: "01 Jul 2026",
      expiryDate: "01 Sep 2026",
      verificationDate: "Expired",
      status: "expired",
      size: "1.5 MB",
      fileName: "travel_insurance_old.pdf",
      format: "PDF",
      updatedBy: "Applicant",
      notes: "Policy expired on 01 Sep 2026. Renewal mandatory."
    }
  ]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "name" | "expiry">("newest");

  // Selected Vault Doc for Inspector Drawer
  const [selectedDocId, setSelectedDocId] = useState<string>("v-doc-1");

  // Selected Vault Doc object
  const activeDoc = useMemo(() => {
    return vaultItems.find((d) => d.id === selectedDocId) || vaultItems[0];
  }, [vaultItems, selectedDocId]);

  // Active App Mock Reference
  const activeApp = useMemo(() => {
    return applications[0] || {
      id: "VO-2026-1025",
      travelerName: "Geeta Sharma",
      dob: "1995-06-12",
      passportNumber: "Z9817264",
      passportExpiry: "20 Dec 2033",
      nationality: "India",
      destination: "Australia",
      visaType: "Tourist Subclass 600"
    };
  }, [applications]);

  // Metrics
  const metrics = useMemo(() => {
    const total = vaultItems.length;
    const activeValid = vaultItems.filter((d) => d.status === "verified").length;
    const verified = activeValid;
    const pending = vaultItems.filter((d) => d.status === "pending").length;
    const rejected = vaultItems.filter((d) => d.status === "rejected" || d.status === "resubmit").length;
    const expired = vaultItems.filter((d) => d.status === "expired").length;
    const storageUsed = "42 MB / 500 MB";

    return { total, activeValid, verified, pending, rejected, expired, storageUsed };
  }, [vaultItems]);

  // Filtered List
  const filteredVault = useMemo(() => {
    return vaultItems
      .filter((d) => {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          d.name.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.fileName.toLowerCase().includes(q);

        const matchesCat = categoryFilter === "all" || d.category.toLowerCase() === categoryFilter.toLowerCase();
        const matchesStatus = statusFilter === "all" || d.status === statusFilter;

        return matchesQ && matchesCat && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "expiry") return a.expiryDate.localeCompare(b.expiryDate);
        return b.id.localeCompare(a.id);
      });
  }, [vaultItems, searchQuery, categoryFilter, statusFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & VAULT STATUS BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Home</span>
            <span>/</span>
            <span>Documents</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">My Documents</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Personal Encrypted Document Vault</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Lock size={12} className="text-emerald-600" /> AES-256 Encrypted & Re-usable
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Manage, view, download, and organize all stored visa and personal documents across active and past applications.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onNavigateUpload && (
            <button
              onClick={onNavigateUpload}
              className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Upload New Document</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: DASHBOARD STATISTICS CARDS GRID (6 CARDS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Stored */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Stored</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(metrics.total).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">Stored in vault</span>
        </div>

        {/* Card 2: Active Valid Docs */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Active Valid Docs</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{String(metrics.activeValid).padStart(2, "0")}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 size={10} /> Valid for applications
          </span>
        </div>

        {/* Card 3: Verified Docs */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Verified Docs</p>
          <p className="text-2xl font-black text-[#4848F7] mt-1">{String(metrics.verified).padStart(2, "0")}</p>
          <span className="text-[10px] text-[#4848F7] font-semibold flex items-center gap-1">
            <ShieldCheck size={10} /> Audit passed
          </span>
        </div>

        {/* Card 4: Pending Verification */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Pending Review</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{String(metrics.pending).padStart(2, "0")}</p>
          <span className="text-[10px] text-amber-600 font-medium">In agent queue</span>
        </div>

        {/* Card 5: Expired / Flagged */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-red-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Expired / Flagged</p>
          <p className="text-2xl font-black text-red-600 mt-1">{String(metrics.expired + metrics.rejected).padStart(2, "0")}</p>
          <span className="text-[10px] text-red-600 font-medium">Renewal required</span>
        </div>

        {/* Card 6: Storage Capacity */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Vault Storage</p>
          <p className="text-xs font-black text-indigo-700 mt-2">{metrics.storageUsed}</p>
          <span className="text-[10px] text-slate-400 font-medium">Secure cloud vault</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CONCEPTUAL WORKFLOW BANNER (CONNECTED APPLICANT -> AGENT -> ADMIN) */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Workflow (Applicant ➔ Agent ➔ Admin)
            </h3>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
            Auto Re-usable Vault
          </span>
        </div>

        {/* Workflow Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 1</span>
            <p className="text-white">Applicant Uploads to Vault</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 2</span>
            <p className="text-white">Saved in Vault & AI OCR Scan</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 3</span>
            <p className="text-white">Agent Verification (Audit Passed)</p>
          </div>

          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Stage 4</span>
            <p className="font-bold">Archived for Future Applications ✓</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl text-xs space-y-1 text-slate-300">
          <p className="font-bold text-white">Professional Recommendation & Vault Policy:</p>
          <ul className="list-disc pl-4 space-y-1 leading-relaxed text-[11px]">
            <li>Store verified passport scans and biometrics to skip re-uploading on new applications.</li>
            <li>Financial proofs and bank statements are auto-flagged when older than 6 months.</li>
            <li>AES-256 bank-level encryption guarantees document privacy and security.</li>
          </ul>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 4: APPLICATION INFORMATION SUMMARY CARD */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Info size={15} className="text-[#4848F7]" />
          <span>Application Credentials & Vault Target Information</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Applicant ID</span>
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
            <span className="text-slate-500 font-medium block">Visa Subtype</span>
            <span className="font-semibold text-slate-800">{activeApp.visaType}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Passport Number</span>
            <span className="font-mono font-bold text-slate-800">{activeApp.passportNumber}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Passport Expiry</span>
            <span className="font-semibold text-slate-800">{activeApp.passportExpiry || "20 Dec 2033"}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Vault Storage Status</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Encrypted & Active ✓
            </span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Total Vault Files</span>
            <span className="font-bold text-indigo-700">{metrics.total} Documents</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: EXPIRY ALERTS & NOTIFICATIONS PANEL */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Expiry Warning Alert */}
        <div className="lg:col-span-8 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-3">
            <BellRing size={22} className="text-amber-600 shrink-0" />
            <div>
              <p className="font-extrabold text-amber-950">Document Expiry Alert</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Your <strong>Travel Insurance Policy</strong> expired on 01 Sep 2026. Passport <strong>{activeApp.passportNumber}</strong> is valid until 2033.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (onNavigateUpload) onNavigateUpload();
              else alert("Navigating to upload page...");
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg shrink-0 transition cursor-pointer"
          >
            Renew Doc
          </button>
        </div>

        {/* Notifications Panel */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2 text-xs">
          <h4 className="font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <Bell size={14} className="text-[#4848F7]" />
            <span>Recent Vault Notifications</span>
          </h4>

          <div className="space-y-1.5 text-[11px]">
            <p className="text-slate-700 font-medium flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-emerald-600" /> Bank statement verified by Sarah Jenkins.
            </p>
            <p className="text-red-700 font-medium flex items-center gap-1.5">
              <AlertTriangle size={12} className="text-red-600" /> Employment NOC letter flagged for re-upload.
            </p>
          </div>
        </div>
      </div>

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
              placeholder="Search Document Name, Category, Format..."
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
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Categories</option>
              <option value="Identity">Identity</option>
              <option value="Financial">Financial</option>
              <option value="Employment">Employment</option>
              <option value="Travel">Travel</option>
              <option value="Personal">Personal</option>
            </select>

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
              <option value="expired">Expired ⚠️</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="newest">Sort: Upload Date Newest</option>
              <option value="name">Sort: Document Name</option>
              <option value="expiry">Sort: Expiry Date</option>
            </select>

            {/* Download ZIP */}
            <button
              onClick={() => alert("Downloading all vault documents in a ZIP archive...")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Download ZIP</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 7: MY DOCUMENTS DIRECTORY TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FolderCheck size={16} className="text-[#4848F7]" />
            <span>My Documents List ({filteredVault.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">Click any document row to view detailed metadata drawer</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Approval / Upload Date</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredVault.map((d) => {
                const isSelected = d.id === selectedDocId;
                return (
                  <tr
                    key={d.id}
                    onClick={() => setSelectedDocId(d.id)}
                    className={`cursor-pointer transition hover:bg-indigo-50/40 ${
                      isSelected ? "bg-indigo-50/80 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4848F7]" />}
                      {d.name}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                        {d.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">{d.uploadDate}</td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono">{d.expiryDate}</td>

                    <td className="py-3.5 px-4">
                      {d.status === "verified" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      )}

                      {d.status === "pending" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <Clock size={12} /> Pending Audit
                        </span>
                      )}

                      {(d.status === "rejected" || d.status === "resubmit") && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                          <AlertTriangle size={12} /> Flagged
                        </span>
                      )}

                      {d.status === "expired" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          Expired
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => alert(`Viewing file: ${d.fileName}`)}
                          className="p-1.5 text-slate-600 hover:text-[#4848F7] hover:bg-slate-100 rounded-lg transition"
                          title="View Document"
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          onClick={() => alert(`Downloading ${d.fileName}...`)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                          title="Download Document"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 8: SELECTED DOCUMENT DETAILS INSPECTOR DRAWER */}
      {/* ============================================================ */}
      {activeDoc && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-3">
              <FileText size={24} className="text-[#4848F7]" />
              <div>
                <h3 className="text-base font-black text-slate-900">{activeDoc.name}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Category: {activeDoc.category} &bull; File: {activeDoc.fileName} ({activeDoc.size})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert(`Downloading ${activeDoc.fileName}...`)}
                className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={14} /> Download File
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-medium block">Document Format</span>
              <span className="font-mono font-bold text-slate-900">{activeDoc.format}</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Issue / Approval Date</span>
              <span className="font-bold text-slate-900">{activeDoc.issueDate || "01 Aug 2026"}</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Expiry Date</span>
              <span className="font-mono font-bold text-slate-900">{activeDoc.expiryDate}</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Verification Date</span>
              <span className="font-semibold text-slate-800">{activeDoc.verificationDate || "07 Aug 2026"}</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Verification Status</span>
              <span className="font-bold text-emerald-700 uppercase">{activeDoc.status}</span>
            </div>
          </div>

          {activeDoc.notes && (
            <div className="bg-indigo-50/50 border border-indigo-200 p-4 rounded-xl text-xs text-indigo-950 space-y-1">
              <p className="font-bold">Consular Audit Remarks & Notes:</p>
              <p className="font-mono leading-relaxed">{activeDoc.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 9: DOCUMENT HISTORY LOG TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Clock size={16} className="text-slate-500" />
            <span>Document Audit & Activity History Log</span>
          </h3>
          <span className="text-[11px] text-slate-400">Timestamped audit trail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Updated By</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {vaultItems.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 text-slate-500 font-medium">{d.uploadDate}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{d.name}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">Uploaded / Verified</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{d.status}</td>
                  <td className="py-3 px-4 text-slate-600">{d.updatedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 10: DOWNLOAD CENTER HUB & QUICK ACTIONS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Download Center Hub */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
          <h4 className="font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Download size={15} className="text-emerald-600" />
            <span>Download Center Hub</span>
          </h4>

          <div className="space-y-2">
            <button
              onClick={() => alert("Downloading Passport PDF...")}
              className="w-full bg-slate-50 hover:bg-slate-100 p-3 rounded-xl border border-slate-200 text-left font-bold text-slate-800 flex justify-between items-center transition cursor-pointer"
            >
              <span>Download Passport Scan (PDF)</span>
              <Download size={14} className="text-slate-500" />
            </button>

            <button
              onClick={() => alert("Downloading Bank Statement PDF...")}
              className="w-full bg-slate-50 hover:bg-slate-100 p-3 rounded-xl border border-slate-200 text-left font-bold text-slate-800 flex justify-between items-center transition cursor-pointer"
            >
              <span>Download 6-Month Bank Statement</span>
              <Download size={14} className="text-slate-500" />
            </button>

            <button
              onClick={() => alert("Downloading Stamped Visa Certificate...")}
              className="w-full bg-emerald-50 hover:bg-emerald-100 p-3 rounded-xl border border-emerald-200 text-left font-bold text-emerald-900 flex justify-between items-center transition cursor-pointer"
            >
              <span>Download Granted E-Visa Certificate</span>
              <Download size={14} className="text-emerald-600" />
            </button>

            <button
              onClick={() => alert("Downloading Tax Invoice PDF...")}
              className="w-full bg-slate-50 hover:bg-slate-100 p-3 rounded-xl border border-slate-200 text-left font-bold text-slate-800 flex justify-between items-center transition cursor-pointer"
            >
              <span>Download Consular Tax Invoice (PDF)</span>
              <Download size={14} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg space-y-3 text-xs flex flex-col justify-between">
          <div>
            <h4 className="font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-2 border-b border-white/10 pb-3">
              <Share2 size={15} className="text-indigo-400" />
              <span>Vault Sharing & Quick Actions</span>
            </h4>
            <p className="text-slate-400 mt-2 leading-relaxed">
              Share encrypted document access with verified consular officers or download complete application portfolios.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {onNavigateUpload && (
              <button
                onClick={onNavigateUpload}
                className="bg-[#4848F7] hover:bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} /> Upload New Document
              </button>
            )}

            <button
              onClick={() => alert("Generating secure 24-hour vault access link...")}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 size={14} /> Share Vault Link
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 11: MY DOCUMENTS FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding My Documents Vault</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Can I reuse stored documents for new visa applications?</p>
            <p className="text-slate-600 leading-relaxed">
              Yes, valid documents in your vault like passport scans and photos can be automatically attached to future applications.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">How long are my documents stored in the vault?</p>
            <p className="text-slate-600 leading-relaxed">
              Documents are encrypted with AES-256 and stored indefinitely until you choose to delete or replace them.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
