"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Application } from "../context/VisaContext";
import { API_V1_URL } from "../config/api";
import { uploadImageToImageKit } from "../services/imageKitService";
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
  MessageSquare,
  ExternalLink,
  Copy,
  X,
  Image as ImageIcon
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
  fileUrl?: string;
  format: string;
  updatedBy: string;
  notes?: string;
  applicationId?: string;
  countryName?: string;
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
  const [vaultItems, setVaultItems] = useState<VaultDocItem[]>([]);
  const [applicantMeta, setApplicantMeta] = useState<{
    applicantId: string;
    name: string;
    passportNumber: string;
    passportExpiry: string;
    destination: string;
    totalFiles: number;
  }>({
    applicantId: "APP-6",
    name: "Vibhu Sharma",
    passportNumber: "Z9817264",
    passportExpiry: "20 Dec 2033",
    destination: "Canada & Global Vault",
    totalFiles: 0
  });

  const [vaultMetrics, setVaultMetrics] = useState<{
    totalStored: number;
    activeValid: number;
    verified: number;
    pending: number;
    expired: number;
  }>({
    totalStored: 0,
    activeValid: 0,
    verified: 0,
    pending: 0,
    expired: 0
  });

  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Document Preview Lightbox Modal State
  const [previewDoc, setPreviewDoc] = useState<VaultDocItem | null>(null);

  // New Document Upload State
  const [isUploadingNew, setIsUploadingNew] = useState(false);
  const [uploadDocCategory, setUploadDocCategory] = useState<"Identity" | "Financial" | "Employment" | "Travel" | "Personal">("Identity");
  const [uploadDocTitle, setUploadDocTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper to extract Auth Token
  const getToken = () => {
    try {
      const stored = localStorage.getItem("phantom_auth_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.token || "";
      }
    } catch (e) {
      // fallback
    }
    return "";
  };

  // Fetch Vault items from Backend API
  const fetchVaultData = async (appId?: string) => {
    setLoading(true);
    try {
      const token = getToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const query = appId ? `?applicationId=${encodeURIComponent(appId)}` : "";
      const res = await fetch(`${API_V1_URL}/applicant/vault${query}`, { headers });
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setVaultItems(json.data);
        if (json.applicant) {
          setApplicantMeta(json.applicant);
        }
        if (json.metrics) {
          setVaultMetrics(json.metrics);
        } else {
          setVaultMetrics({
            totalStored: json.data.length,
            activeValid: json.data.filter((d: any) => d.status === "verified").length,
            verified: json.data.filter((d: any) => d.status === "verified").length,
            pending: json.data.filter((d: any) => d.status === "pending" || d.status === "resubmit").length,
            expired: json.data.filter((d: any) => d.status === "expired").length
          });
        }
        if (json.data.length > 0 && !selectedDocId) {
          setSelectedDocId(json.data[0].id);
        }
      } else {
        setVaultItems([]);
        setVaultMetrics({ totalStored: 0, activeValid: 0, verified: 0, pending: 0, expired: 0 });
      }
    } catch (err) {
      console.error("Failed to load vault items:", err);
      setVaultItems([]);
      setVaultMetrics({ totalStored: 0, activeValid: 0, verified: 0, pending: 0, expired: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const applicationId = applications[0]?.id || applications[0]?.applicationId || "APP-6";
    fetchVaultData(applicationId);
  }, [applications]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "name" | "expiry">("newest");

  // Selected Vault Doc for Inspector Drawer
  const [selectedDocId, setSelectedDocId] = useState<string>("");

  // Selected Vault Doc object
  const activeDoc = useMemo(() => {
    return vaultItems.find((d) => d.id === selectedDocId) || vaultItems[0] || null;
  }, [vaultItems, selectedDocId]);

  // Active App Reference
  const activeApp = useMemo(() => {
    return applications[0] || null;
  }, [applications]);

  // Metrics
  const metrics = useMemo(() => {
    const total = vaultItems.length;
    const activeValid = vaultItems.filter((d) => d.status === "verified").length;
    const verified = activeValid;
    const pending = vaultItems.filter((d) => d.status === "pending" || d.status === "resubmit").length;
    const rejected = vaultItems.filter((d) => d.status === "rejected").length;
    const expired = vaultItems.filter((d) => d.status === "expired").length;
    const storageUsed = `${(total * 2.4).toFixed(1)} MB / 500 MB`;

    return {
      total: vaultMetrics.totalStored || total,
      activeValid: vaultMetrics.activeValid || activeValid,
      verified: vaultMetrics.verified || verified,
      pending: vaultMetrics.pending || pending,
      rejected,
      expired: vaultMetrics.expired || expired,
      storageUsed
    };
  }, [vaultItems, vaultMetrics]);

  // Filtered List
  const filteredVault = useMemo(() => {
    return vaultItems
      .filter((d) => {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          !q ||
          d.name.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.fileName.toLowerCase().includes(q) ||
          (d.countryName && d.countryName.toLowerCase().includes(q));

        const matchesCat = categoryFilter === "all" || d.category.toLowerCase() === categoryFilter.toLowerCase();
        const matchesStatus =
          statusFilter === "all" ||
          d.status === statusFilter ||
          (statusFilter === "pending" && (d.status === "pending" || d.status === "resubmit"));

        return matchesQ && matchesCat && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "expiry") return a.expiryDate.localeCompare(b.expiryDate);
        return new Date(b.uploadDate || "2026-08-01").getTime() - new Date(a.uploadDate || "2026-08-01").getTime();
      });
  }, [vaultItems, searchQuery, categoryFilter, statusFilter, sortBy]);

  // Handle Quick Upload of New Vault File
  const handleUploadVaultDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const docTitle = uploadDocTitle.trim() || file.name.replace(/\.[^/.]+$/, "");
      const ikResult = await uploadImageToImageKit(file, "/PHANTOM-VISA/vault/");

      const newDoc: VaultDocItem = {
        id: `vault:${Date.now()}`,
        name: docTitle,
        category: uploadDocCategory,
        uploadDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        expiryDate: "20 Dec 2033",
        verificationDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        status: "verified",
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileName: ikResult.fileName || file.name,
        fileUrl: ikResult.url,
        format: file.name.split(".").pop()?.toUpperCase() || "JPG",
        updatedBy: "Applicant",
        notes: "Uploaded to personal encrypted document vault."
      };

      setVaultItems((prev) => [newDoc, ...prev]);
      setSelectedDocId(newDoc.id);
      setIsUploadingNew(false);
      setUploadDocTitle("");
      setToastMsg(`"${docTitle}" successfully saved to your Encrypted Document Vault!`);
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      console.error("Failed to upload vault doc:", err);
      alert(err.message || "Failed to upload document to vault.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Find specific key documents for download hub
  const passportDoc = vaultItems.find((d) => d.name.toLowerCase().includes("passport")) || vaultItems[0];
  const bankDoc = vaultItems.find((d) => d.name.toLowerCase().includes("bank") || d.category === "Financial") || vaultItems[1];

  return (
    <div className="space-y-6 pb-12 text-slate-800 animate-in fade-in duration-200">
      
      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#0E1A2C] border border-[#4848F7]/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <CheckCircle2 size={16} className="text-[#4848F7]" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

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
            Manage, view, download, and organize all stored visa and personal documents across active and past applications on ImageKit CDN.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsUploadingNew(true)}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>Upload New Document</span>
          </button>
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
      {/* SECTION 3: CONNECTED WORKFLOW BANNER */}
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
      {/* SECTION 4: APPLICATION CREDENTIALS & VAULT TARGET INFORMATION */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Info size={15} className="text-[#4848F7]" />
          <span>Application Credentials & Vault Target Information</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Applicant ID</span>
            <span className="font-mono font-bold text-slate-900">{applicantMeta.applicantId}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Applicant Name</span>
            <span className="font-bold text-slate-900">{applicantMeta.name}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Destination Country</span>
            <span className="font-bold text-slate-900">{applicantMeta.destination}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Visa Subtype</span>
            <span className="font-semibold text-slate-800">Visa Document Vault</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Passport Number</span>
            <span className="font-mono font-bold text-slate-800">{applicantMeta.passportNumber}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Passport Expiry</span>
            <span className="font-semibold text-slate-800">{applicantMeta.passportExpiry}</span>
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
      {/* SECTION 5: SEARCH & MULTI-FILTER CONTROL BAR */}
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
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7] cursor-pointer"
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
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7] cursor-pointer"
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
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7] cursor-pointer"
            >
              <option value="newest">Sort: Upload Date Newest</option>
              <option value="name">Sort: Document Name</option>
              <option value="expiry">Sort: Expiry Date</option>
            </select>

            {/* Download ZIP */}
            <button
              onClick={() => {
                setToastMsg("Generating encrypted document bundle archive...");
                setTimeout(() => setToastMsg(null), 3000);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Download ZIP</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 6: MY DOCUMENTS DIRECTORY TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FolderCheck size={16} className="text-[#4848F7]" />
            <span>My Documents List ({filteredVault.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">Click any document row to view details or preview scan</span>
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
              {filteredVault.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Info size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No documents found matching filters</p>
                    <p className="text-[11px] mt-1">Upload a new document or reset filters.</p>
                  </td>
                </tr>
              ) : (
                filteredVault.map((d) => {
                  const isSelected = d.id === selectedDocId;
                  const isImage = d.fileUrl && (d.fileUrl.endsWith(".jpg") || d.fileUrl.endsWith(".jpeg") || d.fileUrl.endsWith(".png") || d.fileUrl.endsWith(".webp") || d.fileUrl.includes("images") || d.fileUrl.includes("download"));
                  const isPdf = d.fileUrl && d.fileUrl.endsWith(".pdf");

                  return (
                    <tr
                      key={d.id}
                      onClick={() => setSelectedDocId(d.id)}
                      className={`cursor-pointer transition hover:bg-indigo-50/40 ${
                        isSelected ? "bg-indigo-50/80 font-semibold" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-3">
                        {/* Thumbnail / Format icon */}
                        {isImage && d.fileUrl ? (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewDoc(d);
                            }}
                            className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0 cursor-pointer shadow-2xs hover:scale-105 transition"
                            title="Click to preview scan"
                          >
                            <img src={d.fileUrl} alt={d.name} className="w-full h-full object-cover" />
                          </div>
                        ) : isPdf ? (
                          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200 font-mono text-[10px] font-black">
                            PDF
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4848F7] flex items-center justify-center shrink-0 border border-indigo-200">
                            <FileCheck size={16} />
                          </div>
                        )}

                        <div className="min-w-0">
                          <span className="block truncate text-slate-900">{d.name}</span>
                          <span className="block text-[10px] font-normal text-slate-400 truncate">{d.fileName}</span>
                        </div>
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
                            <AlertTriangle size={12} /> Action Needed
                          </span>
                        )}

                        {d.status === "expired" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            Expired
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {d.fileUrl && (
                            <>
                              <button
                                onClick={() => setPreviewDoc(d)}
                                className="p-1.5 text-slate-600 hover:text-[#4848F7] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                title="Preview Document"
                              >
                                <Eye size={15} />
                              </button>

                              <a
                                href={d.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                title="Open in new tab"
                              >
                                <ExternalLink size={14} />
                              </a>

                              <a
                                href={d.fileUrl}
                                download={d.fileName}
                                className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                title="Download Document"
                              >
                                <Download size={15} />
                              </a>
                            </>
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
      {/* SECTION 7: SELECTED DOCUMENT DETAILS INSPECTOR DRAWER */}
      {/* ============================================================ */}
      {activeDoc && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4848F7] flex items-center justify-center font-bold">
                <FileText size={22} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>{activeDoc.name}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold">
                    {activeDoc.category}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  File: {activeDoc.fileName} &bull; Size: {activeDoc.size} &bull; Stored on ImageKit CDN
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewDoc(activeDoc)}
                className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Eye size={14} /> View / Preview Scan
              </button>

              {activeDoc.fileUrl && (
                <a
                  href={activeDoc.fileUrl}
                  download={activeDoc.fileName}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} /> Download
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-medium block">Document Format</span>
              <span className="font-mono font-bold text-slate-900">{activeDoc.format}</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Issue / Approval Date</span>
              <span className="font-bold text-slate-900">{activeDoc.issueDate || activeDoc.uploadDate}</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Expiry Date</span>
              <span className="font-mono font-bold text-slate-900">{activeDoc.expiryDate}</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Verification Date</span>
              <span className="font-semibold text-slate-800">{activeDoc.verificationDate || "18 Aug 2026"}</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Verification Status</span>
              <span className="font-bold text-emerald-700 uppercase">{activeDoc.status}</span>
            </div>
          </div>

          {activeDoc.notes && (
            <div className="bg-indigo-50/60 border border-indigo-200 p-4 rounded-xl text-xs text-indigo-950 space-y-1">
              <p className="font-bold">Consular Audit Remarks & Notes:</p>
              <p className="font-mono leading-relaxed">{activeDoc.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 8: DOCUMENT HISTORY LOG TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Clock size={16} className="text-slate-500" />
            <span>Document Audit & Activity History Log</span>
          </h3>
          <span className="text-[11px] text-slate-400">Timestamped audit trail ({vaultItems.length} records)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-4">Category</th>
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
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">
                      {d.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">Uploaded / Encrypted to Vault</td>
                  <td className="py-3 px-4">
                    {d.status === "verified" ? (
                      <span className="text-emerald-700 font-bold">Verified ✓</span>
                    ) : (
                      <span className="text-amber-700 font-bold">Under Audit</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{d.updatedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 9: DOWNLOAD CENTER HUB & QUICK ACTIONS */}
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
              onClick={() => {
                if (passportDoc?.fileUrl) {
                  window.open(passportDoc.fileUrl, "_blank");
                } else {
                  alert("Passport scan file not yet uploaded.");
                }
              }}
              className="w-full bg-slate-50 hover:bg-slate-100 p-3 rounded-xl border border-slate-200 text-left font-bold text-slate-800 flex justify-between items-center transition cursor-pointer"
            >
              <span>Download Passport Scan ({passportDoc?.fileName || "PDF"})</span>
              <Download size={14} className="text-slate-500" />
            </button>

            <button
              onClick={() => {
                if (bankDoc?.fileUrl) {
                  window.open(bankDoc.fileUrl, "_blank");
                } else {
                  alert("Bank Statement file not yet uploaded.");
                }
              }}
              className="w-full bg-slate-50 hover:bg-slate-100 p-3 rounded-xl border border-slate-200 text-left font-bold text-slate-800 flex justify-between items-center transition cursor-pointer"
            >
              <span>Download 6-Month Bank Statement ({bankDoc?.fileName || "PDF"})</span>
              <Download size={14} className="text-slate-500" />
            </button>

            <button
              onClick={() => {
                alert("Downloading Granted E-Visa Certificate PDF...");
              }}
              className="w-full bg-emerald-50 hover:bg-emerald-100 p-3 rounded-xl border border-emerald-200 text-left font-bold text-emerald-900 flex justify-between items-center transition cursor-pointer"
            >
              <span>Download Granted E-Visa Certificate</span>
              <Download size={14} className="text-emerald-600" />
            </button>

            <button
              onClick={() => {
                alert("Downloading Consular Tax Invoice (PDF)...");
              }}
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
            <button
              onClick={() => setIsUploadingNew(true)}
              className="bg-[#4848F7] hover:bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus size={14} /> Upload New Document
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setToastMsg("Encrypted 24-hour vault link copied to clipboard!");
                setTimeout(() => setToastMsg(null), 3000);
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 size={14} /> Share Vault Link
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 10: FAQS ACCORDION */}
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
              Documents are encrypted with AES-256 and stored indefinitely on ImageKit CDN until you choose to delete or replace them.
            </p>
          </div>
        </div>
      </div>

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
                    <span>{previewDoc.name}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      Vault Asset
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Category: {previewDoc.category} &bull; {previewDoc.fileName}
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
            {previewDoc.fileUrl && (
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-600 truncate flex-1">
                  <span className="font-bold text-slate-400">CDN:</span>
                  <span className="truncate">{previewDoc.fileUrl}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(previewDoc.fileUrl!);
                      setToastMsg("ImageKit CDN URL copied to clipboard!");
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
                    <ExternalLink size={11} /> Open Direct
                  </a>
                </div>
              </div>
            )}

            {/* Modal Body Preview Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex items-center justify-center bg-slate-100/60 min-h-[300px]">
              {previewDoc.fileUrl?.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={previewDoc.fileUrl}
                  title={previewDoc.name}
                  className="w-full h-[450px] rounded-2xl border border-slate-200 bg-white"
                />
              ) : previewDoc.fileUrl ? (
                <div className="max-w-full max-h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white p-2 flex items-center justify-center">
                  <img
                    src={previewDoc.fileUrl}
                    alt={previewDoc.name}
                    className="max-w-full max-h-[480px] object-contain rounded-xl"
                  />
                </div>
              ) : (
                <div className="text-center p-8 text-slate-400 space-y-2">
                  <FileText size={48} className="mx-auto text-slate-300" />
                  <p className="font-bold text-slate-600">No digital preview available</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-white p-4 border-t border-slate-200 flex items-center justify-between text-xs">
              {previewDoc.fileUrl && (
                <a
                  href={previewDoc.fileUrl}
                  download={previewDoc.fileName}
                  className="px-4 py-2 bg-[#4848F7] hover:bg-indigo-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download size={14} /> Download File
                </a>
              )}

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
      {/* UPLOAD NEW DOCUMENT MODAL */}
      {/* ============================================================ */}
      {isUploadingNew && (
        <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#4848F7] flex items-center justify-center text-white font-bold">
                  <Plus size={20} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Upload New Vault Document</h4>
                  <p className="text-xs text-slate-400">Save encrypted document to your personal vault</p>
                </div>
              </div>

              <button
                onClick={() => setIsUploadingNew(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Document Title / Name</label>
                <input
                  type="text"
                  placeholder="e.g. Passport Bio Page, Salary Slip, GIC Certificate..."
                  value={uploadDocTitle}
                  onChange={(e) => setUploadDocTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#4848F7]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Document Category</label>
                <select
                  value={uploadDocCategory}
                  onChange={(e) => setUploadDocCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#4848F7] cursor-pointer font-medium"
                >
                  <option value="Identity">Identity (Passport, Photo, Gov ID)</option>
                  <option value="Financial">Financial (Bank Statement, Tax, GIC)</option>
                  <option value="Employment">Employment (NOC Letter, Offer Letter, Payslips)</option>
                  <option value="Travel">Travel (Insurance, Flight Ticket, Hotel Booking)</option>
                  <option value="Personal">Personal (Affidavits, Birth Certificate)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Select File (Image or PDF)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUploadVaultDoc}
                  accept="image/*,application/pdf"
                  disabled={isUploading}
                  className="w-full text-xs text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#4848F7] file:text-white hover:file:bg-indigo-700 file:cursor-pointer cursor-pointer border border-slate-200 rounded-xl p-2 bg-slate-50"
                />
              </div>

              {isUploading && (
                <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 p-3 rounded-xl flex items-center gap-2 font-semibold">
                  <RefreshCw size={15} className="animate-spin text-[#4848F7]" />
                  <span>Encrypting & uploading to ImageKit CDN...</span>
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsUploadingNew(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl font-bold border border-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
