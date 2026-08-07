"use client";

import React, { useState, useMemo } from "react";
import { Application } from "../context/VisaContext";
import {
  UploadCloud,
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
  ShieldCheck,
  Search,
  Filter,
  Check,
  Plus,
  ArrowRight,
  User,
  Plane,
  Building,
  Calendar,
  FileUp,
  Layers,
  Zap
} from "lucide-react";

export type DocStatus = "verified" | "pending" | "rejected" | "resubmit" | "not_uploaded";

export interface DocItem {
  id: string;
  name: string;
  category: string;
  required: boolean;
  format: string;
  maxSize: string;
  fileName: string;
  size: string;
  status: DocStatus;
  rejectionReason?: string;
  uploadedAt: string;
  updatedBy: string;
}

interface ApplicantUploadDocumentsProps {
  applications: Application[];
  onUpdateDocs?: (appId: string, docKey: "passport" | "photo" | "nocLetter" | "sponsorLetter", status: "verified" | "needs_review" | "pending" | "uploading") => void;
  onNavigateApply?: () => void;
  onNavigateSupport?: () => void;
}

export default function ApplicantUploadDocuments({
  applications,
  onUpdateDocs,
  onNavigateApply,
  onNavigateSupport
}: ApplicantUploadDocumentsProps) {
  // Select active application (or fallback mock)
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || "VO-2026-1025");

  const activeApp = useMemo(() => {
    return applications.find((a) => a.id === selectedAppId) || {
      id: "VO-2026-1025",
      travelerName: "Geeta Sharma",
      dob: "1995-06-12",
      passportNumber: "Z9817264",
      passportExpiry: "2033-12-20",
      nationality: "India",
      destination: "Australia",
      visaType: "Tourist Subclass 600",
      travelDates: "10 Aug 2026 to 25 Aug 2026",
      status: "Submitted" as const,
      fees: 16500,
      submissionDate: "07 Aug 2026",
      verifiedDocs: { passport: "verified" as const, photo: "verified" as const, nocLetter: "needs_review" as const, sponsorLetter: "pending" as const },
      checklist: { employed: true, sponsored: false }
    };
  }, [applications, selectedAppId]);

  // Document items mock list
  const [docItems, setDocItems] = useState<DocItem[]>([
    {
      id: "doc-1",
      name: "Passport Bio Page",
      category: "Identity",
      required: true,
      format: "PDF / JPG",
      maxSize: "5 MB",
      fileName: "geeta_passport_bio.pdf",
      size: "2.1 MB",
      status: "verified" as const, // verified, pending, rejected, resubmit, not_uploaded
      uploadedAt: "07 Aug 2026, 10:15 AM",
      updatedBy: "Applicant"
    },
    {
      id: "doc-2",
      name: "Passport Back Page",
      category: "Identity",
      required: true,
      format: "JPG / PNG",
      maxSize: "5 MB",
      fileName: "geeta_passport_back.jpg",
      size: "1.8 MB",
      status: "verified" as const,
      uploadedAt: "07 Aug 2026, 10:16 AM",
      updatedBy: "Applicant"
    },
    {
      id: "doc-3",
      name: "Recent Photograph",
      category: "Identity",
      required: true,
      format: "JPG / PNG",
      maxSize: "2 MB",
      fileName: "geeta_photo_35x45.jpg",
      size: "850 KB",
      status: "verified" as const,
      uploadedAt: "07 Aug 2026, 10:18 AM",
      updatedBy: "Applicant"
    },
    {
      id: "doc-4",
      name: "6-Month Bank Statement",
      category: "Financial",
      required: true,
      format: "PDF",
      maxSize: "10 MB",
      fileName: "bank_statement_sbi.pdf",
      size: "4.5 MB",
      status: "verified" as const,
      uploadedAt: "07 Aug 2026, 10:20 AM",
      updatedBy: "Applicant"
    },
    {
      id: "doc-5",
      name: "Employment NOC Letter",
      category: "Employment",
      required: true,
      format: "PDF",
      maxSize: "5 MB",
      fileName: "employment_noc_blurry.pdf",
      size: "1.2 MB",
      status: "rejected" as const,
      rejectionReason: "NOC letter HR wet stamp is blurry and unverified. Please upload a clear original scan on official company letterhead.",
      uploadedAt: "07 Aug 2026, 10:25 AM",
      updatedBy: "Consular Officer (Sarah Jenkins)"
    },
    {
      id: "doc-6",
      name: "Flight Round-trip Ticket",
      category: "Travel",
      required: false,
      format: "PDF",
      maxSize: "5 MB",
      fileName: "flight_itinerary.pdf",
      size: "2.4 MB",
      status: "pending" as const,
      uploadedAt: "07 Aug 2026, 10:30 AM",
      updatedBy: "Applicant"
    },
    {
      id: "doc-7",
      name: "Hotel Booking Voucher",
      category: "Travel",
      required: false,
      format: "PDF",
      maxSize: "5 MB",
      fileName: "hotel_booking_sydney.pdf",
      size: "1.9 MB",
      status: "pending" as const,
      uploadedAt: "07 Aug 2026, 10:32 AM",
      updatedBy: "Applicant"
    },
    {
      id: "doc-8",
      name: "Income Tax Returns (ITR)",
      category: "Financial",
      required: false,
      format: "PDF",
      maxSize: "10 MB",
      fileName: "itr_v_acknowledgement.pdf",
      size: "3.1 MB",
      status: "verified" as const,
      uploadedAt: "07 Aug 2026, 10:35 AM",
      updatedBy: "Applicant"
    },
    {
      id: "doc-9",
      name: "Salary Slips (Last 3 Months)",
      category: "Employment",
      required: false,
      format: "PDF",
      maxSize: "5 MB",
      fileName: "",
      size: "",
      status: "not_uploaded" as const,
      uploadedAt: "-",
      updatedBy: "-"
    },
    {
      id: "doc-10",
      name: "Cover Letter & Travel Plan",
      category: "Travel",
      required: false,
      format: "PDF / DOCX",
      maxSize: "5 MB",
      fileName: "",
      size: "",
      status: "not_uploaded" as const,
      uploadedAt: "-",
      updatedBy: "-"
    }
  ]);

  // Upload Form Dropzone State
  const [selectedCategory, setSelectedCategory] = useState("Identity");
  const [selectedDocId, setSelectedDocId] = useState("doc-5");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = docItems.length;
    const uploaded = docItems.filter((d) => d.status !== "not_uploaded").length;
    const pending = docItems.filter((d) => d.status === "not_uploaded").length;
    const verified = docItems.filter((d) => d.status === "verified").length;
    const rejected = docItems.filter((d) => d.status === "rejected" || d.status === "resubmit").length;
    const completionRate = Math.round((uploaded / total) * 100);

    return { total, uploaded, pending, verified, rejected, completionRate };
  }, [docItems]);

  // Handle Mock Upload
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocId) return;

    setIsUploading(true);
    setTimeout(() => {
      setDocItems((prev) =>
        prev.map((item) => {
          if (item.id === selectedDocId) {
            return {
              ...item,
              fileName: uploadFile ? uploadFile.name : `reuploaded_${item.name.toLowerCase().replace(/ /g, "_")}.pdf`,
              size: uploadFile ? `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB` : "2.5 MB",
              status: "pending",
              uploadedAt: "Just now",
              updatedBy: "Applicant"
            };
          }
          return item;
        })
      );

      setIsUploading(false);
      setUploadSuccess(true);
      setUploadFile(null);
      setTimeout(() => setUploadSuccess(false), 4000);
    }, 1200);
  };

  // Rejected document reference
  const rejectedDoc = useMemo(() => {
    return docItems.find((d) => d.status === "rejected" || d.status === "resubmit");
  }, [docItems]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & STATUS BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Home</span>
            <span>/</span>
            <span>Documents</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Upload Documents</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Document Verification & Upload Hub</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-[#4848F7] border border-indigo-200">
              <ShieldCheck size={12} /> {metrics.completionRate}% Upload Complete
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Upload and manage required visa documents, verify upload status, view re-upload requests, and track document verification.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => alert("Packaging all uploaded documents into ZIP archive...")}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition flex items-center gap-2 cursor-pointer"
          >
            <Download size={16} />
            <span>Download All ZIP</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: DASHBOARD STATISTICS CARDS GRID (6 CARDS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Required */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Required</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(metrics.total).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">Document checklist</span>
        </div>

        {/* Card 2: Uploaded */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Uploaded Files</p>
          <p className="text-2xl font-black text-[#4848F7] mt-1">{String(metrics.uploaded).padStart(2, "0")}</p>
          <span className="text-[10px] text-[#4848F7] font-semibold flex items-center gap-1">
            <UploadCloud size={10} /> Saved in Vault
          </span>
        </div>

        {/* Card 3: Pending Uploads */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Pending Uploads</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{String(metrics.pending).padStart(2, "0")}</p>
          <span className="text-[10px] text-amber-600 font-medium">Action required</span>
        </div>

        {/* Card 4: Verified Documents */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Verified Docs</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{String(metrics.verified).padStart(2, "0")}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 size={10} /> Consular passed
          </span>
        </div>

        {/* Card 5: Rejected Documents */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-red-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Rejected Docs</p>
          <p className="text-2xl font-black text-red-600 mt-1">{String(metrics.rejected).padStart(2, "0")}</p>
          <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1">
            <AlertTriangle size={10} /> Re-upload needed
          </span>
        </div>

        {/* Card 6: Completion Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Completion Rate</p>
          <p className="text-2xl font-black text-indigo-700 mt-1">{metrics.completionRate}%</p>
          <span className="text-[10px] text-slate-400 font-medium">Ready for submission</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CONCEPTUAL WORKFLOW BANNER (FROM WIREFRAME) */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Conceptual Workflow (As Shown in Wireframe)
            </h3>
          </div>
          <span className="text-[11px] bg-white/10 text-slate-300 font-mono px-3 py-1 rounded-full">
            Real-Time Document Pipeline
          </span>
        </div>

        {/* Workflow Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 1</span>
            <p className="text-white">Applicant Uploads Documents</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 2</span>
            <p className="text-white">Agent / AI OCR Verification</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 3</span>
            <p className="text-white">Mandatory Verified / Optional Reviewed</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 4</span>
            <p className="text-white">Application Approved & Paid</p>
          </div>

          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Step 5</span>
            <p className="font-bold">Archived in Secure Vault ✓</p>
          </div>
        </div>

        {/* Key Workflow Guidance Box */}
        <div className="bg-white/5 p-4 rounded-xl text-xs space-y-1.5 text-slate-300">
          <p className="font-bold text-white">Workflow & Document Guidelines:</p>
          <ul className="list-disc pl-4 space-y-1 leading-relaxed text-[11px]">
            <li>Drag & drop files or choose single/multiple documents for instant upload.</li>
            <li>File format validation ensures 300 DPI clarity and prevents rejection.</li>
            <li>Real-time verification badges (Verified, Pending, Rejected, Resubmission Required).</li>
          </ul>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 4: APPLICATION INFORMATION SUMMARY CARD */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Info size={15} className="text-[#4848F7]" />
          <span>Active Application Information</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Application ID</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{activeApp.id}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Applicant Legal Name</span>
            <span className="font-bold text-slate-900">{activeApp.travelerName}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Destination Country</span>
            <span className="font-bold text-slate-900">{activeApp.destination} 🇦🇺</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Visa Subcategory</span>
            <span className="font-semibold text-slate-800">{activeApp.visaType}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Passport Number</span>
            <span className="font-mono font-bold text-slate-800">{activeApp.passportNumber}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Application Status</span>
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              Under Verification
            </span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Last Updated Date</span>
            <span className="font-semibold text-slate-800">{activeApp.submissionDate}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Upload Progress</span>
            <span className="font-bold text-emerald-700">{metrics.uploaded} / {metrics.total} Files</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: REJECTED DOCUMENT ALERT & RE-UPLOAD DRAWER */}
      {/* ============================================================ */}
      {rejectedDoc && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-4 border-b border-red-200 pb-3">
            <div className="flex items-center gap-3">
              <AlertTriangle size={22} className="text-red-600 shrink-0" />
              <div>
                <h4 className="text-sm font-extrabold text-red-900">
                  Re-Upload Action Required: {rejectedDoc.name}
                </h4>
                <p className="text-xs text-red-700 font-medium mt-0.5">
                  Consular officer flagged this document during initial verification audit.
                </p>
              </div>
            </div>
            <span className="bg-red-100 text-red-800 text-[11px] font-bold px-3 py-1 rounded-full border border-red-300">
              RE-UPLOAD MANDATORY
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-red-200 text-xs space-y-2">
            <p className="font-bold text-red-900">Consular Rejection Remark:</p>
            <p className="text-slate-800 font-mono leading-relaxed">
              "{rejectedDoc.rejectionReason}"
            </p>
            <p className="text-[11px] text-slate-500">Flagged Date: 05 Aug 2026 &bull; Flagged By: Consular Auditor Sarah Jenkins</p>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 6: DRAG & DROP UPLOAD DROPZONE */}
      {/* ============================================================ */}
      <form onSubmit={handleUploadSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <UploadCloud size={18} className="text-[#4848F7]" />
          <span>Document Upload Dropzone</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Select Document Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#4848F7]"
            >
              <option value="Identity">Identity Documents (Passport, Photo)</option>
              <option value="Financial">Financial Proofs (Bank Statement, ITR)</option>
              <option value="Employment">Employment Documents (NOC, Payslips)</option>
              <option value="Travel">Travel Plans (Flight, Hotel Booking)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Select Target Document Slot</label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#4848F7]"
            >
              {docItems.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.required ? "Mandatory" : "Optional"}) - Status: {d.status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Drag Drop Box */}
        <div className="border-2 border-dashed border-slate-300 hover:border-[#4848F7] bg-slate-50/50 rounded-2xl p-8 text-center space-y-3 transition">
          <UploadCloud size={36} className="mx-auto text-[#4848F7]" />
          <div>
            <p className="text-sm font-bold text-slate-900">Drag and drop your file here or click to browse</p>
            <p className="text-xs text-slate-400 mt-1">Supports PDF, JPG, PNG (Maximum file size: 10 MB)</p>
          </div>

          <input
            type="file"
            onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
            className="hidden"
            id="file-upload-input"
          />

          <label
            htmlFor="file-upload-input"
            className="inline-block bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs px-5 py-2 rounded-xl border border-slate-300 transition cursor-pointer"
          >
            Choose File
          </label>

          {uploadFile && (
            <div className="mt-2 inline-flex items-center gap-2 bg-indigo-50 text-[#4848F7] text-xs font-bold px-3 py-1.5 rounded-lg border border-indigo-200">
              <FileText size={14} />
              <span>{uploadFile.name} ({(uploadFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isUploading}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            {isUploading ? <RefreshCw size={14} className="animate-spin" /> : <UploadCloud size={14} />}
            <span>{isUploading ? "Uploading Document..." : "Submit & Save Document"}</span>
          </button>
        </div>

        {uploadSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Document uploaded successfully! Verification pipeline updated.</span>
          </div>
        )}
      </form>

      {/* ============================================================ */}
      {/* SECTION 7: REQUIRED DOCUMENTS INTERACTIVE TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileText size={16} className="text-[#4848F7]" />
            <span>Required Documents List ({docItems.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">All mandatory documents must be verified before submission</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Required</th>
                <th className="py-3 px-4">File Format</th>
                <th className="py-3 px-4">Max Size</th>
                <th className="py-3 px-4">Uploaded File</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {docItems.map((d) => {
                return (
                  <tr key={d.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {d.name}
                    </td>

                    <td className="py-3.5 px-4">
                      {d.required ? (
                        <span className="bg-red-50 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-red-200">
                          Mandatory ✓
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          Optional
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono">{d.format}</td>

                    <td className="py-3.5 px-4 text-slate-500">{d.maxSize}</td>

                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                      {d.fileName || <span className="text-slate-400 italic">Not Uploaded</span>}
                    </td>

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
                          <AlertTriangle size={12} /> Re-upload
                        </span>
                      )}

                      {d.status === "not_uploaded" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          Not Uploaded
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {d.fileName ? (
                          <>
                            <button
                              onClick={() => alert(`Viewing document: ${d.fileName}`)}
                              className="p-1.5 text-slate-600 hover:text-[#4848F7] hover:bg-slate-100 rounded-lg transition"
                              title="View Document"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDocId(d.id);
                                window.scrollTo({ top: 400, behavior: "smooth" });
                              }}
                              className="bg-indigo-50 hover:bg-indigo-100 text-[#4848F7] font-bold px-2.5 py-1 rounded-lg text-[11px] transition"
                            >
                              Re-upload
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedDocId(d.id);
                              window.scrollTo({ top: 400, behavior: "smooth" });
                            }}
                            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] transition"
                          >
                            Upload
                          </button>
                        )}
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
      {/* SECTION 8: UPLOAD GUIDELINES & CHECKLIST TRACKER */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Guidelines */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <Info size={15} className="text-[#4848F7]" />
            <span>Upload Guidelines & Rules</span>
          </h4>

          <ul className="text-xs text-slate-700 space-y-2 list-disc pl-4 leading-relaxed">
            <li><strong>File Formats:</strong> PDF, JPG, PNG files are allowed. Maximum 10MB per file.</li>
            <li><strong>Scan Quality:</strong> Documents must be original high-resolution 300 DPI color scans.</li>
            <li><strong>Bank Statements:</strong> Must show last 6 months transactions with bank seal and signature.</li>
            <li><strong>No Glare / Cropping:</strong> Ensure all 4 borders of the document are visible without shadow.</li>
          </ul>
        </div>

        {/* Upload Progress Checklist Tracker */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span>Upload Progress Checklist</span>
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {docItems.map((d) => (
              <div key={d.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                {d.status === "verified" && <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />}
                {d.status === "pending" && <Clock size={14} className="text-amber-500 shrink-0" />}
                {(d.status === "rejected" || d.status === "resubmit") && <XCircle size={14} className="text-red-500 shrink-0" />}
                {d.status === "not_uploaded" && <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />}

                <span className="font-semibold text-slate-800 truncate">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 9: DOCUMENT HISTORY LOG TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Clock size={16} className="text-slate-500" />
            <span>Document Audit & Upload History Log</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Updated By</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {docItems
                .filter((d) => d.uploadedAt !== "-")
                .map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-slate-500 font-medium">{d.uploadedAt}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{d.name}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">Uploaded / Resubmitted</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{d.status}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{d.updatedBy}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 10: QUICK ACTIONS BAR */}
      {/* ============================================================ */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div>
          <h4 className="text-sm font-extrabold text-white">Ready for Final Consular Verification?</h4>
          <p className="text-xs text-slate-400 mt-0.5">Submit your verified documents package to embassy processing team.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Submitting documents for consular verification...")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
          >
            Submit for Final Verification
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 11: UPLOAD DOCUMENTS FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Document Uploads</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">What file formats are accepted for uploads?</p>
            <p className="text-slate-600 leading-relaxed">
              We accept PDF, JPG, and PNG files up to 10MB each. Scans must be in color at minimum 300 DPI resolution.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">What should I do if my document is rejected?</p>
            <p className="text-slate-600 leading-relaxed">
              Review the specific consular rejection reason in the red alert box above and upload a clear, updated file.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
