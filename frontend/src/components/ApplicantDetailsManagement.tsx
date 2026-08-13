"use client";

import React, { useState, useEffect } from "react";
import { mockApplicants, ApplicantRecord } from "./AllApplicants";
import {
  User,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  CreditCard,
  Calendar,
  Search,
  ChevronRight,
  ChevronLeft,
  Edit,
  Download,
  Send,
  Eye,
  Lock,
  Unlock,
  Building,
  Briefcase,
  Sparkles,
  ArrowRight,
  X,
  Check,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  FileCheck
} from "lucide-react";

interface ApplicantDetailsManagementProps {
  selectedApplicant?: ApplicantRecord | null;
  onSelectApplicant?: (applicant: ApplicantRecord) => void;
  onBackToList?: () => void;
}

export default function ApplicantDetailsManagement({
  selectedApplicant: initialApplicant,
  onSelectApplicant,
  onBackToList
}: ApplicantDetailsManagementProps) {
  const [currentApplicant, setCurrentApplicant] = useState<ApplicantRecord>(
    initialApplicant || mockApplicants[0]
  );
  const [activeTab, setActiveTab] = useState<"all" | "personal" | "passport" | "visa" | "documents" | "payments" | "timeline">("all");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDocPreviewModal, setShowDocPreviewModal] = useState<{ title: string; file: string; status: string } | null>(null);

  // Editable Form State
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    mobile: "",
    country: "",
    passportNumber: "",
    passportExpiry: "",
    dob: "",
    gender: "",
    address: ""
  });

  // Sync when currentApplicant changes
  useEffect(() => {
    if (initialApplicant) {
      setCurrentApplicant(initialApplicant);
    }
  }, [initialApplicant]);

  useEffect(() => {
    setEditForm({
      name: currentApplicant.name,
      email: currentApplicant.email,
      mobile: currentApplicant.mobile,
      country: currentApplicant.country,
      passportNumber: currentApplicant.passportNumber || "Z9876543",
      passportExpiry: currentApplicant.passportExpiry || "12 Dec 2031",
      dob: currentApplicant.dob || "14 May 1994",
      gender: currentApplicant.gender || "Female",
      address: currentApplicant.address || "B-402, Green Park Avenue, New Delhi, India"
    });
  }, [currentApplicant]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleApplicantChange = (appId: string) => {
    const found = mockApplicants.find((a) => a.id === appId);
    if (found) {
      setCurrentApplicant(found);
      if (onSelectApplicant) onSelectApplicant(found);
    }
  };

  const handleSaveEdit = () => {
    const updated = {
      ...currentApplicant,
      name: editForm.name,
      email: editForm.email,
      mobile: editForm.mobile,
      country: editForm.country,
      passportNumber: editForm.passportNumber,
      passportExpiry: editForm.passportExpiry,
      dob: editForm.dob,
      gender: editForm.gender,
      address: editForm.address
    };
    setCurrentApplicant(updated);
    if (onSelectApplicant) onSelectApplicant(updated);
    setShowEditModal(false);
    triggerToast(`Applicant details updated for ${editForm.name}`);
  };

  const applicant = currentApplicant;

  return (
    <div className="space-y-6 text-slate-800 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[9999] bg-purple-900 border border-purple-400 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <Sparkles size={16} className="text-amber-300" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* TOP NAVIGATION & SELECTOR BAR */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToList && (
            <button
              onClick={onBackToList}
              className="p-2 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 transition flex items-center gap-1.5 text-xs font-bold"
            >
              <ChevronLeft size={16} />
              <span>Back to Applicant List</span>
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-purple-600 font-bold uppercase tracking-wider">
              <Users size={13} />
              <span>APPLICANT PROFILE MANAGEMENT DOSSIER</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Applicant Details</h2>
          </div>
        </div>

        {/* Applicant Switcher & Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={applicant.id}
              onChange={(e) => handleApplicantChange(e.target.value)}
              className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 focus:bg-white transition cursor-pointer appearance-none"
            >
              {mockApplicants.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.id} - {app.name} ({app.country})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200"
          >
            <Edit size={14} />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => triggerToast(`Exporting full dossier PDF for ${applicant.name}`)}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
          >
            <Download size={14} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* HERO PROFILE SUMMARY CARD */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {applicant.avatar ? (
              <img
                src={applicant.avatar}
                alt={applicant.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-400/30 shadow-md shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-purple-600/40 border border-purple-400/30 flex items-center justify-center text-white text-2xl font-black shrink-0">
                {applicant.name.charAt(0)}
              </div>
            )}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-black tracking-tight">{applicant.name}</h1>
                <span className="bg-white/10 text-purple-200 border border-purple-400/20 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
                  {applicant.id}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                    applicant.status === "Active"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : applicant.status === "Blocked"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {applicant.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-purple-200 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="text-base">{applicant.flag}</span>
                  <span className="font-semibold">{applicant.country}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Mail size={13} className="text-purple-400" />
                  <span>{applicant.email}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Phone size={13} className="text-purple-400" />
                  <span>{applicant.mobile}</span>
                </span>
              </div>

              {/* KPI Stat Chips */}
              <div className="flex items-center gap-3 text-[11px] pt-1 flex-wrap">
                <span className="bg-white/10 text-purple-200 px-2.5 py-1 rounded-lg">
                  Registered: <strong className="text-white font-mono">{applicant.registeredOn}</strong>
                </span>
                <span className="bg-white/10 text-purple-200 px-2.5 py-1 rounded-lg">
                  Total Apps: <strong className="text-white font-mono">{applicant.totalApplications}</strong>
                </span>
                <span className="bg-white/10 text-purple-200 px-2.5 py-1 rounded-lg">
                  Passport #: <strong className="text-amber-300 font-mono">{applicant.passportNumber || "Z9876543"}</strong>
                </span>
                <span className="bg-white/10 text-purple-200 px-2.5 py-1 rounded-lg">
                  Assigned Agent: <strong className="text-purple-200">{applicant.assignedAgent || "Balram Suman"}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons inside Hero Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowEmailModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Send size={14} />
              <span>Send Message</span>
            </button>
            <button
              onClick={() => triggerToast(`Document request issued for ${applicant.name}`)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <FileText size={14} />
              <span>Request Doc</span>
            </button>
            <button
              onClick={() => triggerToast(`Appointment scheduler opened for ${applicant.name}`)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Calendar size={14} />
              <span>Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* HORIZONTAL SUB-TABS NAVIGATION BAR */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold text-slate-500 overflow-x-auto">
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === "all"
              ? "border-purple-600 text-purple-700 font-extrabold"
              : "border-transparent hover:text-slate-900"
          }`}
        >
          <Users size={15} />
          <span>All Information</span>
        </button>
        <button
          onClick={() => setActiveTab("personal")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === "personal"
              ? "border-purple-600 text-purple-700 font-extrabold"
              : "border-transparent hover:text-slate-900"
          }`}
        >
          <User size={15} />
          <span>Personal Info</span>
        </button>
        <button
          onClick={() => setActiveTab("passport")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === "passport"
              ? "border-purple-600 text-purple-700 font-extrabold"
              : "border-transparent hover:text-slate-900"
          }`}
        >
          <ShieldCheck size={15} />
          <span>Passport Vault</span>
        </button>
        <button
          onClick={() => setActiveTab("visa")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === "visa"
              ? "border-purple-600 text-purple-700 font-extrabold"
              : "border-transparent hover:text-slate-900"
          }`}
        >
          <Globe size={15} />
          <span>Visa Applications</span>
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === "documents"
              ? "border-purple-600 text-purple-700 font-extrabold"
              : "border-transparent hover:text-slate-900"
          }`}
        >
          <FileText size={15} />
          <span>Documents Checklist</span>
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === "payments"
              ? "border-purple-600 text-purple-700 font-extrabold"
              : "border-transparent hover:text-slate-900"
          }`}
        >
          <CreditCard size={15} />
          <span>Payment History</span>
        </button>
        <button
          onClick={() => setActiveTab("timeline")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === "timeline"
              ? "border-purple-600 text-purple-700 font-extrabold"
              : "border-transparent hover:text-slate-900"
          }`}
        >
          <Clock size={15} />
          <span>Activity Timeline</span>
        </button>
      </div>

      {/* SECTION 1: PERSONAL INFORMATION & PASSPORT VAULT (2 COLUMNS GRID) */}
      {(activeTab === "all" || activeTab === "personal" || activeTab === "passport") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Personal Details */}
          {(activeTab === "all" || activeTab === "personal") && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <User size={16} className="text-purple-600" />
                  <span>Personal Details & Demographics</span>
                </h3>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="text-xs text-purple-600 hover:text-purple-700 font-bold transition flex items-center gap-1"
                >
                  <Edit size={13} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Full Name</span>
                  <span className="font-bold text-slate-900">{applicant.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Date of Birth</span>
                  <span className="font-mono font-semibold text-slate-800">{applicant.dob || "14 May 1994"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Gender</span>
                  <span className="font-semibold text-slate-800">{applicant.gender || "Female"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Marital Status</span>
                  <span className="font-semibold text-slate-800">Single</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Nationality</span>
                  <span className="font-semibold text-slate-800">{applicant.nationality || "Indian"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Occupation</span>
                  <span className="font-semibold text-slate-800">Software Developer</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Mobile Number</span>
                  <span className="font-mono text-slate-800">{applicant.mobile}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Email Address</span>
                  <span className="font-mono text-purple-700 font-semibold">{applicant.email}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block mb-0.5">Residential Address</span>
                  <span className="font-medium text-slate-700">{applicant.address || "B-402, Green Park Avenue, New Delhi, India"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">City / State</span>
                  <span className="font-semibold text-slate-800">{applicant.city || "New Delhi, Delhi"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Emergency Contact</span>
                  <span className="font-semibold text-slate-800">Ramesh Bisht (+91 9876500000)</span>
                </div>
              </div>
            </div>
          )}

          {/* Card 2: Passport Information */}
          {(activeTab === "all" || activeTab === "passport") && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-purple-600" />
                  <span>Passport & Identity Vault</span>
                </h3>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>OCR Scanned & Verified</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Passport Number</span>
                  <span className="font-mono font-black text-purple-700 text-sm">{applicant.passportNumber || "Z9876543"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Country of Issue</span>
                  <span className="font-bold text-slate-800">{applicant.nationality || "India"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Place of Issue</span>
                  <span className="font-semibold text-slate-800">RPO New Delhi</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Passport Type</span>
                  <span className="font-semibold text-slate-800">Regular Ordinary (Type P)</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Date of Issue</span>
                  <span className="font-mono font-semibold text-slate-700">13 Dec 2021</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Date of Expiry</span>
                  <span className="font-mono font-bold text-emerald-600">{applicant.passportExpiry || "12 Dec 2031"}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block mb-1">MRZ Code Strip Snippet</span>
                  <div className="bg-slate-900 text-amber-400 font-mono text-[11px] p-2.5 rounded-xl overflow-x-auto tracking-widest border border-slate-700">
                    P&lt;IND{applicant.name.replace(/\s+/g, "&lt;")}
                    <br />
                    {applicant.passportNumber || "Z9876543"}9IND9405142F31121281&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: VISA APPLICATIONS LIST */}
      {(activeTab === "all" || activeTab === "visa") && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Globe size={16} className="text-purple-600" />
              <span>Visa Applications History</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Total: {applicant.totalApplications} Applications</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-3">Application Ref</th>
                  <th className="p-3">Destination Country</th>
                  <th className="p-3">Visa Type</th>
                  <th className="p-3">Applied Date</th>
                  <th className="p-3">Current Processing Stage</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-purple-700">VO-2026-1250</td>
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-base">{applicant.flag}</span>
                    <span>{applicant.destinationCountry || applicant.country}</span>
                  </td>
                  <td className="p-3 text-slate-700 font-medium">{applicant.visaType || "Tourist Visa Subclass 600"}</td>
                  <td className="p-3 font-mono text-slate-500">{applicant.registeredOn}</td>
                  <td className="p-3 font-semibold text-amber-700">{applicant.processingStage || "Embassy Document Verification"}</td>
                  <td className="p-3">
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                      {applicant.applicationStatus || "Under Review"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => triggerToast("Opening Visa Application VO-2026-1250 details")}
                      className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] transition inline-flex items-center gap-1"
                    >
                      <Eye size={13} />
                      <span>View App</span>
                    </button>
                  </td>
                </tr>
                {applicant.totalApplications > 1 && (
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-purple-700">VO-2025-9921</td>
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <span className="text-base">🇦🇺</span>
                      <span>Australia</span>
                    </td>
                    <td className="p-3 text-slate-700 font-medium">Visitor Visa (Subclass 600)</td>
                    <td className="p-3 font-mono text-slate-500">15 Mar 2025</td>
                    <td className="p-3 font-semibold text-emerald-700">Visa Grant Letter Issued</td>
                    <td className="p-3">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                        Approved
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => triggerToast("Opening Visa Application VO-2025-9921 details")}
                        className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] transition inline-flex items-center gap-1"
                      >
                        <Eye size={13} />
                        <span>View App</span>
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: DOCUMENTS CHECKLIST & COMPLIANCE */}
      {(activeTab === "all" || activeTab === "documents") && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileText size={16} className="text-purple-600" />
              <span>Document Compliance & Verification Matrix</span>
            </h3>
            <button
              onClick={() => triggerToast("Request missing document issued to applicant")}
              className="text-xs text-purple-600 hover:text-purple-700 font-bold transition flex items-center gap-1"
            >
              <Plus size={14} />
              <span>Request Additional Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Doc 1: Passport Scan */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Passport (Front & Back)</h4>
                  <p className="text-[11px] text-slate-500 font-mono">passport_scan_hd.pdf</p>
                </div>
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Verified
                </span>
                <span className="text-slate-400 font-mono">2.4 MB</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex gap-2">
                <button
                  onClick={() => setShowDocPreviewModal({ title: "Passport (Front & Back)", file: "passport_scan_hd.pdf", status: "Verified" })}
                  className="flex-1 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold hover:bg-slate-100 transition"
                >
                  View
                </button>
                <button
                  onClick={() => triggerToast("Downloading passport_scan_hd.pdf")}
                  className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-[11px] font-bold hover:bg-purple-100 transition"
                >
                  <Download size={13} />
                </button>
              </div>
            </div>

            {/* Doc 2: Photograph */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">35x45mm Photo</h4>
                  <p className="text-[11px] text-slate-500 font-mono">photo_icao_std.jpg</p>
                </div>
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Verified
                </span>
                <span className="text-slate-400 font-mono">850 KB</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex gap-2">
                <button
                  onClick={() => setShowDocPreviewModal({ title: "35x45mm Photograph", file: "photo_icao_std.jpg", status: "Verified" })}
                  className="flex-1 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold hover:bg-slate-100 transition"
                >
                  View
                </button>
                <button
                  onClick={() => triggerToast("Downloading photo_icao_std.jpg")}
                  className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-[11px] font-bold hover:bg-purple-100 transition"
                >
                  <Download size={13} />
                </button>
              </div>
            </div>

            {/* Doc 3: Bank Statement */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Bank Statement (6 Months)</h4>
                  <p className="text-[11px] text-slate-500 font-mono">hdfc_stmt_6m.pdf</p>
                </div>
                {applicant.documents?.bankStatement ? (
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                ) : (
                  <Clock size={18} className="text-amber-500 shrink-0" />
                )}
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span
                  className={`font-bold px-2 py-0.5 rounded ${
                    applicant.documents?.bankStatement
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {applicant.documents?.bankStatement ? "Verified" : "Under Review"}
                </span>
                <span className="text-slate-400 font-mono">4.1 MB</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex gap-2">
                <button
                  onClick={() => setShowDocPreviewModal({ title: "Bank Statement (6 Months)", file: "hdfc_stmt_6m.pdf", status: applicant.documents?.bankStatement ? "Verified" : "Under Review" })}
                  className="flex-1 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold hover:bg-slate-100 transition"
                >
                  View
                </button>
                <button
                  onClick={() => triggerToast("Downloading hdfc_stmt_6m.pdf")}
                  className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-[11px] font-bold hover:bg-purple-100 transition"
                >
                  <Download size={13} />
                </button>
              </div>
            </div>

            {/* Doc 4: Employment NOC Letter */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Employment NOC Letter</h4>
                  <p className="text-[11px] text-slate-500 font-mono">company_noc.pdf</p>
                </div>
                {applicant.documents?.invitationLetter ? (
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle size={18} className="text-rose-500 shrink-0" />
                )}
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span
                  className={`font-bold px-2 py-0.5 rounded ${
                    applicant.documents?.invitationLetter
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {applicant.documents?.invitationLetter ? "Verified" : "Pending Upload"}
                </span>
                <span className="text-slate-400 font-mono">1.1 MB</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex gap-2">
                <button
                  onClick={() => setShowDocPreviewModal({ title: "Employment NOC Letter", file: "company_noc.pdf", status: applicant.documents?.invitationLetter ? "Verified" : "Pending Upload" })}
                  className="flex-1 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold hover:bg-slate-100 transition"
                >
                  View
                </button>
                <button
                  onClick={() => triggerToast("Request reupload sent to applicant")}
                  className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-[11px] font-bold hover:bg-purple-100 transition"
                >
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: FINANCIAL LEDGER & PAYMENT HISTORY */}
      {(activeTab === "all" || activeTab === "payments") && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CreditCard size={16} className="text-purple-600" />
              <span>Financial Ledger & Transaction History</span>
            </h3>
            <div className="flex gap-4 text-xs font-bold">
              <span className="text-slate-500">
                Total Paid: <strong className="text-emerald-600 font-mono">₹{(applicant.payments?.totalPaid || 45000).toLocaleString()}</strong>
              </span>
              <span className="text-slate-500">
                Pending: <strong className="text-rose-600 font-mono">₹{(applicant.payments?.pendingAmount || 0).toLocaleString()}</strong>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-3">Txn Reference</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Payment Description</th>
                  <th className="p-3">Method</th>
                  <th className="p-3 text-right">Amount (INR)</th>
                  <th className="p-3 text-right">Status</th>
                  <th className="p-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {(applicant.payments?.history || [
                  { date: "20 Jul 2026", amount: 25000, desc: "Initial Embassy Fee & Processing", method: "UPI / Net Banking" },
                  { date: "22 Jul 2026", amount: 20000, desc: "Biometric & VFS Service Charge", method: "Credit Card" }
                ]).map((pay, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-purple-700">TXN-8849{i + 1}</td>
                    <td className="p-3 font-semibold text-slate-700">{pay.date}</td>
                    <td className="p-3 font-sans text-slate-900 font-medium">{pay.desc}</td>
                    <td className="p-3 text-slate-500 font-sans">{pay.method}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">₹{pay.amount.toLocaleString()}</td>
                    <td className="p-3 text-right font-sans">
                      <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">
                        Success
                      </span>
                    </td>
                    <td className="p-3 text-right font-sans">
                      <button
                        onClick={() => triggerToast(`Downloading invoice TXN-8849${i + 1}.pdf`)}
                        className="text-purple-600 hover:text-purple-800 font-bold text-[11px] inline-flex items-center gap-1"
                      >
                        <FileText size={12} />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 5: ACTIVITY TIMELINE & EVENT AUDIT LOG */}
      {(activeTab === "all" || activeTab === "timeline") && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock size={16} className="text-purple-600" />
              <span>Activity Log & Event Audit Trail</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Chronological Event Logs</span>
          </div>

          <div className="relative border-l-2 border-purple-100 ml-4 space-y-6 py-2">
            {(applicant.timeline || [
              { title: "Account Created & Registered", time: "20 Jul 2026, 10:15 AM", completed: true },
              { title: "Visa Application VO-2026-1250 Created", time: "20 Jul 2026, 11:30 AM", completed: true },
              { title: "Documents Uploaded (Passport, Photo, Bank Stmt)", time: "21 Jul 2026, 03:45 PM", completed: true },
              { title: "Payment of ₹20,000 Verified", time: "22 Jul 2026, 06:12 PM", completed: true },
              { title: "Application assigned to Balram Suman for review", time: "24 Jul 2026, 09:00 AM", completed: true }
            ]).map((step, idx) => (
              <div key={idx} className="relative pl-6">
                <div
                  className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    step.completed
                      ? "bg-purple-600 border-purple-600 text-white"
                      : "bg-white border-slate-300 text-slate-400"
                  }`}
                >
                  {step.completed && <CheckCircle2 size={10} />}
                </div>
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-slate-900 block">{step.title}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{step.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT APPLICANT MODAL DIALOG */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999]">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Edit size={16} className="text-purple-600" />
                <span>Edit Applicant Details ({applicant.id})</span>
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={editForm.mobile}
                  onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Passport Number</label>
                <input
                  type="text"
                  value={editForm.passportNumber}
                  onChange={(e) => setEditForm({ ...editForm, passportNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Passport Expiry</label>
                <input
                  type="text"
                  value={editForm.passportExpiry}
                  onChange={(e) => setEditForm({ ...editForm, passportExpiry: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Date of Birth</label>
                <input
                  type="text"
                  value={editForm.dob}
                  onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Country</label>
                <input
                  type="text"
                  value={editForm.country}
                  onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-600 font-semibold mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEND EMAIL MODAL DIALOG */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999]">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Send size={16} className="text-purple-600" />
                <span>Send Notification Email</span>
              </h3>
              <button onClick={() => setShowEmailModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Recipient</label>
                <input
                  type="text"
                  readOnly
                  value={`${applicant.name} <${applicant.email}>`}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  defaultValue={`Update regarding your Visa Application ${(applicant as any).lastApp || "VO-2026-1250"}`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Message Body</label>
                <textarea
                  rows={4}
                  defaultValue={`Dear ${applicant.name},\n\nWe are pleased to inform you that your visa application is progressing smoothly through embassy verification.\n\nBest regards,\nPhantom Visa Team`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-purple-500 font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  triggerToast(`Email dispatched successfully to ${applicant.email}`);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Send size={13} />
                <span>Send Email</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL DIALOG */}
      {showDocPreviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999]">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">{showDocPreviewModal.title}</h3>
                <span className="text-xs text-slate-400 font-mono">{showDocPreviewModal.file}</span>
              </div>
              <button onClick={() => setShowDocPreviewModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-900 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3 text-white border border-slate-700">
              <FileCheck size={48} className="text-purple-400 animate-pulse" />
              <div>
                <span className="font-bold text-sm block">{showDocPreviewModal.file}</span>
                <span className="text-xs text-slate-400">PDF Document • 2.4 MB • ICAO Compliant</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-0.5 rounded-full text-xs font-bold">
                Status: {showDocPreviewModal.status}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowDocPreviewModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  triggerToast(`Downloading ${showDocPreviewModal.file}`);
                  setShowDocPreviewModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Download size={13} />
                <span>Download File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
