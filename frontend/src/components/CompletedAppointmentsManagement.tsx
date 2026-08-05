import React, { useState } from "react";
import {
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  PlusCircle,
  Trash2,
  AlertCircle,
  Globe,
  Download,
  Check,
  X,
  TrendingUp,
  Sparkles,
  User,
  Building,
  Clock,
  Send,
  Printer,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Tag,
  CheckSquare,
  AlertTriangle,
  FileText,
  MapPin,
  FileCheck,
  Award,
  BarChart3,
  FileSpreadsheet
} from "lucide-react";

export interface CompletedAppointmentRecord {
  id: string;
  aptId: string;
  appId: string;
  applicantName: string;
  passportNumber: string;
  nationality: string;
  emailAddress: string;
  mobileNumber: string;
  appliedBy: "Applicant" | "Agent";
  agentName?: string;
  appointmentType:
    | "Biometric"
    | "Embassy Interview"
    | "Document Verification"
    | "Medical Examination"
    | "Passport Submission"
    | "VFS Collection";
  country: string;
  completedDate: string;
  completedDateTime: string;
  location: string;
  duration: string;
  status: "Completed";
  attendanceStatus: "Attended & Verified";
  completedBy: string;
  officerName: string;
  completionRemarks: string;
  documentsVerified: string;
  biometricCompleted: boolean;
  interviewResult: "Passed" | "Waived" | "Under Review";
  medicalReportStatus: "Cleared" | "Pending Lab" | "N/A";
  nextProcessStage: "Embassy Decision Queue" | "Visa Stamping" | "Passport Dispatch";
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_COMPLETED_TABS = [
  "Overview",
  "Applicant Details",
  "Appointment Details",
  "Completion Summary",
  "Documents",
  "Activity Logs",
  "Admin Notes"
];

export const COMPLETED_WORKFLOW_STEPS = [
  "Appointment Scheduled",
  "Reminder Sent",
  "Applicant Attended",
  "Appointment Completed",
  "Status Updated",
  "Visa Processing Continues"
];

export const PROFESSIONAL_FEATURES = [
  "Attendance Confirmation",
  "Completion Certificate",
  "Appointment Summary Report",
  "Officer Remarks",
  "Next Processing Stage",
  "Download PDF Report",
  "Email Completion Confirmation",
  "Complete Activity Timeline"
];

const MOCK_COMPLETED_APPOINTMENTS: CompletedAppointmentRecord[] = [
  {
    id: "1",
    aptId: "APT-31001",
    appId: "APP-20268001",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    nationality: "Indian",
    emailAddress: "geeta@email.com",
    mobileNumber: "+91 9876543210",
    appliedBy: "Applicant",
    appointmentType: "Biometric",
    country: "Canada",
    completedDate: "02 Aug 2026",
    completedDateTime: "02 Aug 2026 10:20 AM",
    location: "Delhi VAC",
    duration: "20 Min",
    status: "Completed",
    attendanceStatus: "Attended & Verified",
    completedBy: "VFS Center Officer D. Kumar",
    officerName: "Officer D. Kumar",
    completionRemarks: "All 10 fingerprints captured cleanly. Facial biometric scan passed.",
    documentsVerified: "All 6 Original Documents Verified",
    biometricCompleted: true,
    interviewResult: "Passed",
    medicalReportStatus: "Cleared",
    nextProcessStage: "Embassy Decision Queue",
    actionNotes: [
      { id: "n1", author: "System", text: "Biometric data synced to IRCC Canada portal.", date: "02 Aug 2026 10:25 AM" }
    ]
  },
  {
    id: "2",
    aptId: "APT-31002",
    appId: "APP-20268002",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    nationality: "Indian",
    emailAddress: "rahul@email.com",
    mobileNumber: "+91 9811223344",
    appliedBy: "Agent",
    agentName: "Apex Travels",
    appointmentType: "Embassy Interview",
    country: "Australia",
    completedDate: "02 Aug 2026",
    completedDateTime: "02 Aug 2026 12:05 PM",
    location: "Mumbai Embassy",
    duration: "35 Min",
    status: "Completed",
    attendanceStatus: "Attended & Verified",
    completedBy: "Consular Officer Sarah Jenkins",
    officerName: "Sarah Jenkins",
    completionRemarks: "Personal interview conducted. Travel intentions verified successfully.",
    documentsVerified: "Verified Bank Statement & Cover Letter",
    biometricCompleted: true,
    interviewResult: "Passed",
    medicalReportStatus: "N/A",
    nextProcessStage: "Visa Stamping",
    actionNotes: []
  },
  {
    id: "3",
    aptId: "APT-31003",
    appId: "APP-20268003",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    nationality: "Indian",
    emailAddress: "bikram@email.com",
    mobileNumber: "+91 9988776655",
    appliedBy: "Applicant",
    appointmentType: "Medical Examination",
    country: "Germany",
    completedDate: "01 Aug 2026",
    completedDateTime: "01 Aug 2026 03:00 PM",
    location: "Apollo Hospital",
    duration: "50 Min",
    status: "Completed",
    attendanceStatus: "Attended & Verified",
    completedBy: "Dr. A. K. Varma",
    officerName: "Dr. A. K. Varma",
    completionRemarks: "General physical test and chest X-ray completed without issues.",
    documentsVerified: "Medical Clearance Certificate Issued",
    biometricCompleted: false,
    interviewResult: "Waived",
    medicalReportStatus: "Cleared",
    nextProcessStage: "Passport Dispatch",
    actionNotes: []
  }
];

export default function CompletedAppointmentsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [completedByFilter, setCompletedByFilter] = useState("All");

  // Records State
  const [completedList, setCompletedList] = useState<CompletedAppointmentRecord[]>(MOCK_COMPLETED_APPOINTMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalApt, setActiveModalApt] = useState<CompletedAppointmentRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredAppointments = completedList.filter((apt) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      apt.aptId.toLowerCase().includes(q) ||
      apt.appId.toLowerCase().includes(q) ||
      apt.applicantName.toLowerCase().includes(q) ||
      apt.passportNumber.toLowerCase().includes(q) ||
      (apt.agentName && apt.agentName.toLowerCase().includes(q));

    const matchesType = typeFilter === "All" || apt.appointmentType === typeFilter;
    const matchesCountry = countryFilter === "All" || apt.country === countryFilter;
    const matchesCompletedBy = completedByFilter === "All" || apt.appliedBy === completedByFilter;

    return matchesQuery && matchesType && matchesCountry && matchesCompletedBy;
  });

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredAppointments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAppointments.map((a) => a.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleDeleteRecord = (apt: CompletedAppointmentRecord) => {
    setCompletedList((prev) => prev.filter((a) => a.id !== apt.id));
    triggerToast(`Completed appointment ${apt.aptId} record deleted.`);
    if (activeModalApt?.id === apt.id) setActiveModalApt(null);
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
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
            <CheckCircle2 size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Verified Attendance & Completed Slots Vault
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Completed Appointments
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            View and manage all successfully completed visa-related appointments.
          </p>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Completed</span>
            <div className="text-2xl font-black text-slate-900 font-mono">3,984</div>
            <span className="text-[10px] text-emerald-600 font-bold">Completed Vault</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Completed Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">42</div>
            <span className="text-[10px] text-emerald-600 font-bold">Daily Completion</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Completed This Week</span>
            <div className="text-2xl font-black text-slate-900 font-mono">218</div>
            <span className="text-[10px] text-blue-600 font-bold">Weekly Clearance</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Completed This Month</span>
            <div className="text-2xl font-black text-slate-900 font-mono">846</div>
            <span className="text-[10px] text-purple-600 font-bold">Monthly Clearance</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Attendance Rate</span>
            <div className="text-2xl font-black text-slate-900 font-mono">97.8%</div>
            <span className="text-[10px] text-teal-600 font-bold">Show Rate</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Avg Duration</span>
            <div className="text-2xl font-black text-slate-900 font-mono">28 Mins</div>
            <span className="text-[10px] text-amber-600 font-bold">Average Slot Time</span>
          </div>
        </div>

        {/* RIGHT CARD: WORKFLOW & PROFESSIONAL FEATURES CATALOG (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Completed Appointment Workflow
            </h3>

            {/* WORKFLOW FLOW */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {COMPLETED_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-[9px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* PROFESSIONAL FEATURES CATALOG */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-900 font-bold block mb-1">Professional Features:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px] max-h-24 overflow-y-auto [scrollbar-width:thin]">
                {PROFESSIONAL_FEATURES.map((item, i) => (
                  <div key={i} className="flex items-center gap-1 text-slate-700">
                    <Check size={11} className="text-emerald-600" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & Completed Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredAppointments.length} of {completedList.length} Completed Appointments
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (Apt ID, App ID, Applicant, Passport)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="APT-31001, APP-20268001..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* APPOINTMENT TYPE */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Appointment Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Types</option>
              <option value="Biometric">Biometric</option>
              <option value="Embassy Interview">Embassy Interview</option>
              <option value="Document Verification">Document Verification</option>
              <option value="Medical Examination">Medical Examination</option>
            </select>
          </div>

          {/* COUNTRY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Country
            </label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Countries</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
            </select>
          </div>

          {/* COMPLETED BY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Applied By
            </label>
            <select
              value={completedByFilter}
              onChange={(e) => setCompletedByFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Payers</option>
              <option value="Applicant">Applicant</option>
              <option value="Agent">Agent</option>
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
            <span>Completed Appointments Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => triggerToast(`Exporting completed report list for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Completed List
            </button>
            <button
              onClick={() => triggerToast(`Sending completion emails to ${selectedIds.length} applicants.`)}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Send size={14} /> Send Completion Emails
            </button>
            <button
              onClick={() => triggerToast(`Printing ${selectedIds.length} appointment completion slips.`)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Printer size={14} /> Print Records
            </button>
          </div>
        </div>
      )}

      {/* COMPLETED APPOINTMENTS TABLE (COLUMNS MATCH WIREFRAME EXACTLY) */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredAppointments.length && filteredAppointments.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-mono">Appointment ID</th>
                <th className="py-3.5 px-4 font-mono">Application ID</th>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Appointment Type</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4 font-mono">Completed Date</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4 font-mono">Duration</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <CheckCircle2 size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No completed appointments found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(apt.id)}
                        onChange={() => handleToggleSelect(apt.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {apt.aptId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {apt.appId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {apt.applicantName}
                      {apt.agentName && <span className="block text-[10px] text-slate-400 font-normal">({apt.agentName})</span>}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-purple-700">
                      {apt.appointmentType}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {apt.country}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {apt.completedDate}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {apt.location}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {apt.duration}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                        🟢 Completed
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveModalApt(apt);
                            setModalTab("Overview");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Completion Summary & Results"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Printing completion report for ${apt.aptId}...`)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Print Summary Report"
                        >
                          <Printer size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(apt)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>Showing 1–10 of 3,984 Completed Appointments</div>
          <div className="flex items-center gap-1 font-mono font-bold">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#2563EB] text-white rounded-lg">1</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">2</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">3</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* PROFESSIONAL RECOMMENDATION BOX (FROM WIREFRAME) */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2 mb-6">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
          <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Completion Audit Controls
        </h3>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Features active: Attendance verification, officer outcome logging, next-stage automated trigger, digital completion certificate, and PDF activity timeline download.
        </p>
      </div>

      {/* CENTERED POPUP DETAILS MODAL (7 RECOMMENDED TABS FROM WIREFRAME) */}
      {activeModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-lg text-white">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      Completed Appointment {activeModalApt.aptId}
                    </h3>
                    <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-700">
                      COMPLETED ({activeModalApt.duration})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">App ID: <strong className="text-blue-300">{activeModalApt.appId}</strong> &bull; Applicant: {activeModalApt.applicantName} ({activeModalApt.passportNumber})</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalApt(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {RECOMMENDED_COMPLETED_TABS.map((tab) => {
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
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {/* TAB 1: OVERVIEW */}
              {modalTab === "Overview" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* OVERVIEW TILES */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 mb-3">
                      Completion Summary & Outcome
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Appointment ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalApt.aptId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Completed Date</span>
                        <strong className="text-emerald-700 font-mono font-bold">{activeModalApt.completedDateTime}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Interview Result</span>
                        <strong className="text-purple-700 font-bold">{activeModalApt.interviewResult}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Next Processing Stage</span>
                        <strong className="text-slate-900 font-bold">{activeModalApt.nextProcessStage}</strong>
                      </div>
                    </div>
                  </div>

                  {/* OFFICER REMARKS CARD */}
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-3xl p-5 space-y-2">
                    <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <FileCheck size={16} className="text-emerald-600" /> Officer Verification Remarks
                    </h4>
                    <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                      "{activeModalApt.completionRemarks}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerToast(`Downloading completion certificate for ${activeModalApt.aptId}...`)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Award size={15} /> Download Certificate
                </button>
                <button
                  onClick={() => triggerToast(`Printing completion report for ${activeModalApt.aptId}...`)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Printer size={15} /> Print Summary Report
                </button>
              </div>

              <button
                onClick={() => triggerToast(`Emailed completion confirmation to ${activeModalApt.applicantName}...`)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Send size={14} /> Email Confirmation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
