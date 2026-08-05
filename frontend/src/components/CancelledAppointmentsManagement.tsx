import React, { useState } from "react";
import {
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  PlusCircle,
  Trash2,
  CheckCircle2,
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
  RotateCcw,
  ShieldAlert,
  BarChart3,
  FileSpreadsheet,
  Calendar
} from "lucide-react";

export interface CancelledAppointmentRecord {
  id: string;
  aptId: string;
  appId: string;
  applicantName: string;
  passportNumber: string;
  nationality: string;
  presentAddress: string;
  mobileNumber: string;
  appliedBy: "Applicant" | "Agent";
  agentName?: string;
  appointmentType:
    | "Biometrics"
    | "Embassy Interview"
    | "Document Verification"
    | "Medical Examination"
    | "Passport Submission"
    | "VFS Collection";
  country: string;
  cancelledBy: "Applicant" | "Agent" | "Admin" | "Embassy";
  cancelledDate: string;
  cancelledDateTime: string;
  cancellationReason:
    | "Personal Reasons"
    | "Scheduling Conflict"
    | "Customer Request"
    | "Incomplete Documents"
    | "Embassy Cancelled"
    | "Payment Issue"
    | "Technical Error"
    | "Other";
  scheduledDate: string;
  scheduledTime: string;
  location: string;
  status: "Cancelled";
  systemRemarks: string;
  rescheduleRequested: boolean;
  rescheduleStatus?: "Requested" | "Approved" | "None";
  rescheduledAptId?: string;
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_CANCELLED_TABS = [
  "Overview",
  "Applicant Details",
  "Appointment Details",
  "Cancellation Details",
  "Reschedule History",
  "Communication History",
  "Activity Logs",
  "Action Notes"
];

export const CANCELLED_WORKFLOW_STEPS = [
  "Appointment Scheduled",
  "Cancellation Requested",
  "Cancellation Reason Recorded",
  "Slot Released to System",
  "Applicant Notified",
  "Rescheduled or Terminated"
];

export const COMMON_CANCELLATION_REASONS = [
  "Personal Reasons",
  "Scheduling Conflict",
  "Customer Request",
  "Incomplete Documents",
  "Travel Date Changed",
  "Embassy Unavailability",
  "Duplicate Booking",
  "Payment Issue",
  "System / Technical Error",
  "Other"
];

const MOCK_CANCELLED_APPOINTMENTS: CancelledAppointmentRecord[] = [
  {
    id: "1",
    aptId: "APT-C1001",
    appId: "APP-20261001",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    nationality: "Indian",
    presentAddress: "House No 42, Sector 15, Chandigarh, India",
    mobileNumber: "+91 9876543210",
    appliedBy: "Applicant",
    appointmentType: "Biometrics",
    country: "Canada",
    cancelledBy: "Applicant",
    cancelledDate: "02 Aug 2026",
    cancelledDateTime: "02 Aug 2026 11:15 AM",
    cancellationReason: "Personal Reasons",
    scheduledDate: "05 Aug 2026",
    scheduledTime: "10:00 AM",
    location: "VFS - Delhi",
    status: "Cancelled",
    systemRemarks: "Applicant cancelled appointment via portal due to urgent personal travel.",
    rescheduleRequested: true,
    rescheduleStatus: "Requested",
    actionNotes: [
      { id: "n1", author: "System", text: "Slot B12 released back to available inventory pool.", date: "02 Aug 2026 11:16 AM" }
    ]
  },
  {
    id: "2",
    aptId: "APT-C1002",
    appId: "APP-20261002",
    applicantName: "Rahul Sharma",
    passportNumber: "M1234567",
    nationality: "Indian",
    presentAddress: "Flat 201, Sunshine Heights, Andheri West, Mumbai, India",
    mobileNumber: "+91 9811223344",
    appliedBy: "Agent",
    agentName: "Apex Travels",
    appointmentType: "Embassy Interview",
    country: "Australia",
    cancelledBy: "Embassy",
    cancelledDate: "02 Aug 2026",
    cancelledDateTime: "02 Aug 2026 01:30 PM",
    cancellationReason: "Embassy Cancelled",
    scheduledDate: "06 Aug 2026",
    scheduledTime: "11:30 AM",
    location: "Embassy - Mumbai",
    status: "Cancelled",
    systemRemarks: "Consulate closed for emergency maintenance on scheduled date.",
    rescheduleRequested: true,
    rescheduleStatus: "Approved",
    rescheduledAptId: "APT-9002",
    actionNotes: []
  },
  {
    id: "3",
    aptId: "APT-C1003",
    appId: "APP-20261003",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    nationality: "Indian",
    presentAddress: "3rd Cross, Indiranagar, Bengaluru, Karnataka, India",
    mobileNumber: "+91 9988776655",
    appliedBy: "Applicant",
    appointmentType: "Medical Examination",
    country: "Germany",
    cancelledBy: "Admin",
    cancelledDate: "01 Aug 2026",
    cancelledDateTime: "01 Aug 2026 04:20 PM",
    cancellationReason: "Incomplete Documents",
    scheduledDate: "04 Aug 2026",
    scheduledTime: "02:00 PM",
    location: "Apollo Hospital",
    status: "Cancelled",
    systemRemarks: "Cancelled by Admin due to missing blood test clearance form.",
    rescheduleRequested: false,
    rescheduleStatus: "None",
    actionNotes: []
  }
];

export default function CancelledAppointmentsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [cancelledByFilter, setCancelledByFilter] = useState("All");
  const [reasonFilter, setReasonFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");

  // Records State
  const [cancelledList, setCancelledList] = useState<CancelledAppointmentRecord[]>(MOCK_CANCELLED_APPOINTMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalApt, setActiveModalApt] = useState<CancelledAppointmentRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredAppointments = cancelledList.filter((apt) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      apt.aptId.toLowerCase().includes(q) ||
      apt.appId.toLowerCase().includes(q) ||
      apt.applicantName.toLowerCase().includes(q) ||
      apt.passportNumber.toLowerCase().includes(q) ||
      (apt.agentName && apt.agentName.toLowerCase().includes(q));

    const matchesType = typeFilter === "All" || apt.appointmentType === typeFilter;
    const matchesCancelledBy = cancelledByFilter === "All" || apt.cancelledBy === cancelledByFilter;
    const matchesReason = reasonFilter === "All" || apt.cancellationReason === reasonFilter;
    const matchesCountry = countryFilter === "All" || apt.country === countryFilter;

    return matchesQuery && matchesType && matchesCancelledBy && matchesReason && matchesCountry;
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
  const handleReschedule = (apt: CancelledAppointmentRecord) => {
    triggerToast(`Reschedule process initiated for cancelled appointment ${apt.aptId}.`);
  };

  const handleDeleteRecord = (apt: CancelledAppointmentRecord) => {
    setCancelledList((prev) => prev.filter((a) => a.id !== apt.id));
    triggerToast(`Cancelled appointment ${apt.aptId} record deleted.`);
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
            <XCircle size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Cancelled Slots Audit & Re-booking Log
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Cancelled Appointments
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            View and manage all cancelled visa-related appointment slots and reasons.
          </p>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Cancelled</span>
            <div className="text-2xl font-black text-slate-900 font-mono">180</div>
            <span className="text-[10px] text-red-600 font-bold">Cancelled Archive</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Cancelled Today</span>
            <div className="text-2xl font-black text-slate-900 font-mono">12</div>
            <span className="text-[10px] text-red-600 font-bold">Daily Cancellations</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-[#2563EB] block mb-1">By Applicant</span>
            <div className="text-2xl font-black text-slate-900 font-mono">98</div>
            <span className="text-[10px] text-[#2563EB] font-bold">User Self-Cancel</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">By Agent</span>
            <div className="text-2xl font-black text-slate-900 font-mono">48</div>
            <span className="text-[10px] text-purple-600 font-bold">Agent Released</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">By Admin</span>
            <div className="text-2xl font-black text-slate-900 font-mono">22</div>
            <span className="text-[10px] text-amber-600 font-bold">Admin Voided</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">By Embassy</span>
            <div className="text-2xl font-black text-slate-900 font-mono">12</div>
            <span className="text-[10px] text-teal-600 font-bold">Embassy Closed</span>
          </div>
        </div>

        {/* RIGHT CARD: WORKFLOW & REASONS CATALOG (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Appointment Workflow
            </h3>

            {/* WORKFLOW FLOW */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {CANCELLED_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-[9px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* COMMON CANCELLATION REASONS CATALOG */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-900 font-bold block mb-1">Common Cancellation Reasons:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px] max-h-24 overflow-y-auto [scrollbar-width:thin]">
                {COMMON_CANCELLATION_REASONS.map((reason, i) => (
                  <div key={i} className="flex items-center gap-1 text-slate-700">
                    <Check size={11} className="text-red-600" /> {reason}
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Cancellation Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredAppointments.length} of {cancelledList.length} Cancelled Appointments
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (Apt ID, App ID, Applicant, Passport)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="APT-C1001, APP-20261001..."
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
              <option value="Biometrics">Biometrics</option>
              <option value="Embassy Interview">Embassy Interview</option>
              <option value="Document Verification">Document Verification</option>
              <option value="Medical Examination">Medical Examination</option>
            </select>
          </div>

          {/* CANCELLED BY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Cancelled By
            </label>
            <select
              value={cancelledByFilter}
              onChange={(e) => setCancelledByFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Sources</option>
              <option value="Applicant">Applicant</option>
              <option value="Agent">Agent</option>
              <option value="Admin">Admin</option>
              <option value="Embassy">Embassy</option>
            </select>
          </div>

          {/* CANCELLATION REASON */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Cancellation Reason
            </label>
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Reasons</option>
              <option value="Personal Reasons">Personal Reasons</option>
              <option value="Scheduling Conflict">Scheduling Conflict</option>
              <option value="Incomplete Documents">Incomplete Documents</option>
              <option value="Embassy Cancelled">Embassy Cancelled</option>
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
        </div>
      </div>

      {/* CONTEXTUAL BULK ACTIONS TOOLBAR */}
      {selectedIds.length > 0 && (
        <div className="bg-[#0E1A2C] border border-[#2563EB]/40 text-white p-3.5 rounded-2xl shadow-xl mb-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-6 h-6 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-mono font-bold text-xs">
              {selectedIds.length}
            </span>
            <span>Cancelled Appointments Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => triggerToast(`Initiated reschedule prompt for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={14} /> Reschedule Selected
            </button>
            <button
              onClick={() => triggerToast(`Sending cancellation emails to ${selectedIds.length} applicants.`)}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Send size={14} /> Send Notifications
            </button>
            <button
              onClick={() => triggerToast(`Exporting cancellation audit report for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Report
            </button>
          </div>
        </div>
      )}

      {/* CANCELLED APPOINTMENTS TABLE (COLUMNS MATCH WIREFRAME EXACTLY) */}
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
                <th className="py-3.5 px-4">Cancelled By</th>
                <th className="py-3.5 px-4 font-mono">Cancelled Date</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <XCircle size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No cancelled appointments found matching your filters.</p>
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
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      {apt.cancelledBy}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {apt.cancelledDate}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-red-600">
                      {apt.cancellationReason}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                        🔴 Cancelled
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
                          title="View Cancellation Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleReschedule(apt)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title="Reschedule Appointment"
                        >
                          <RotateCcw size={15} />
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
          <div>Showing 1–10 of 180 Cancelled Appointments</div>
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
      <div className="bg-red-50/50 border border-red-200 rounded-3xl p-5 space-y-2 mb-6">
        <h3 className="text-xs font-extrabold text-red-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-red-100 pb-2">
          <ShieldAlert size={16} className="text-red-600" /> Professional Cancellation Audit Strategy
        </h3>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Features active: Cancellation source auditing (Applicant/Agent/Admin/Embassy), slot auto-release automation, automated cancellation notices, fee refund/penalty handling, and re-booking assistance workflow.
        </p>
      </div>

      {/* CENTERED POPUP DETAILS MODAL (8 RECOMMENDED TABS FROM WIREFRAME) */}
      {activeModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center font-bold text-lg text-white">
                  <XCircle size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      Cancelled Appointment {activeModalApt.aptId}
                    </h3>
                    <span className="font-mono text-xs font-bold text-red-300 bg-red-900/50 px-2 py-0.5 rounded border border-red-700">
                      CANCELLED BY {activeModalApt.cancelledBy.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">App ID: <strong className="text-blue-300">{activeModalApt.appId}</strong> &bull; Reason: {activeModalApt.cancellationReason}</p>
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
              {RECOMMENDED_CANCELLED_TABS.map((tab) => {
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
                      Cancellation Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Appointment ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalApt.aptId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Cancelled By</span>
                        <strong className="text-red-600 font-bold">{activeModalApt.cancelledBy}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Cancelled Date</span>
                        <strong className="text-slate-900 font-mono font-bold">{activeModalApt.cancelledDateTime}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Cancellation Reason</span>
                        <strong className="text-purple-700 font-bold">{activeModalApt.cancellationReason}</strong>
                      </div>
                    </div>
                  </div>

                  {/* SYSTEM REMARKS CARD */}
                  <div className="bg-red-50/60 border border-red-200 rounded-3xl p-5 space-y-2">
                    <h4 className="text-xs font-extrabold text-red-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <AlertTriangle size={16} className="text-red-600" /> System Cancellation Remarks
                    </h4>
                    <p className="text-xs text-red-800 font-medium leading-relaxed">
                      "{activeModalApt.systemRemarks}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReschedule(activeModalApt)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw size={15} /> Reschedule Appointment
                </button>
                <button
                  onClick={() => triggerToast(`Cancellation letter downloaded for ${activeModalApt.aptId}...`)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={15} /> Download Cancellation Letter
                </button>
              </div>

              <button
                onClick={() => triggerToast(`Sending cancellation notice to ${activeModalApt.applicantName}...`)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Send size={14} /> Send Cancellation Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
