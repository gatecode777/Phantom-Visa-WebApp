import React, { useState } from "react";
import {
  Calendar,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  PlusCircle,
  Trash2,
  CheckCircle2,
  XCircle,
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
  Map,
  RotateCcw,
  UserCheck,
  FileCheck
} from "lucide-react";

export interface AppointmentRecord {
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
    | "Biometric Submission"
    | "Embassy Interview"
    | "Document Verification"
    | "Medical Examination"
    | "VAC / VFS Collection";
  country: string;
  dateTime: string;
  dateOnly: string;
  timeOnly: string;
  location: string;
  address: string;
  city: string;
  state: string;
  googleMapLocation: string;
  status: "Scheduled" | "Completed" | "Rescheduled" | "Cancelled" | "Pending" | "No Show";
  bookedBy: "Applicant" | "Agent" | "Admin" | "Embassy Direct";
  primaryOfficer?: string;
  slotNo: string;
  totalFees: number;
  bookingDate: string;
  rescheduleCount: number;
  lastRescheduledDate?: string;
  appointmentNotes?: string;
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_APPOINTMENT_TABS = [
  "Overview",
  "Applicant Details",
  "Appointment Details",
  "Location",
  "Documents",
  "Reschedule History",
  "Activity Logs",
  "Action Notes"
];

export const APPOINTMENT_WORKFLOW_STEPS = [
  "Application Submitted",
  "Appointment Slot Selected",
  "Appointment Scheduled",
  "Confirmation Sent",
  "Reminder Sent",
  "Appointment Attended",
  "Completed"
];

export const APPOINTMENT_TYPES_CATALOG = [
  "Biometric Submission",
  "Embassy Interview",
  "Document Verification",
  "Medical Examination",
  "Visa Application Center (VAC)",
  "Premium Lounge Access",
  "Passport Collection",
  "VFS Collection",
  "Walk-in Assistance / Consultation",
  "In-Person Verification"
];

const MOCK_APPOINTMENTS: AppointmentRecord[] = [
  {
    id: "1",
    aptId: "APT-9001",
    appId: "APP-20261001",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    nationality: "Indian",
    presentAddress: "House No 42, Sector 15, Chandigarh, India",
    mobileNumber: "+91 9876543210",
    appliedBy: "Applicant",
    appointmentType: "Biometric Submission",
    country: "Canada",
    dateTime: "05 Aug 2026 10:00 AM",
    dateOnly: "05 Aug 2026",
    timeOnly: "10:00 AM",
    location: "VFS - Delhi",
    address: "Mezzanine Floor, Shivaji Stadium Metro Station, Connaught Place, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    googleMapLocation: "https://maps.google.com/?q=VFS+Delhi",
    status: "Scheduled",
    bookedBy: "Applicant",
    primaryOfficer: "Officer Officer D. Kumar",
    slotNo: "SLOT-B12",
    totalFees: 3500,
    bookingDate: "01 Aug 2026",
    rescheduleCount: 0,
    appointmentNotes: "Bring original passport and printed appointment confirmation letter.",
    actionNotes: [
      { id: "n1", author: "System", text: "Biometric appointment confirmed with VFS Canada center.", date: "01 Aug 2026 10:15 AM" }
    ]
  },
  {
    id: "2",
    aptId: "APT-9002",
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
    dateTime: "06 Aug 2026 11:30 AM",
    dateOnly: "06 Aug 2026",
    timeOnly: "11:30 AM",
    location: "Embassy - Mumbai",
    address: "Australian Consulate-General, Express Towers, Nariman Point, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    googleMapLocation: "https://maps.google.com/?q=Australian+Consulate+Mumbai",
    status: "Rescheduled",
    bookedBy: "Agent",
    primaryOfficer: "Consular Officer Sarah Jenkins",
    slotNo: "SLOT-E04",
    totalFees: 5000,
    bookingDate: "02 Aug 2026",
    rescheduleCount: 1,
    lastRescheduledDate: "03 Aug 2026",
    appointmentNotes: "Rescheduled upon applicant request due to flight timing.",
    actionNotes: []
  },
  {
    id: "3",
    aptId: "APT-9003",
    appId: "APP-20261003",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    nationality: "Indian",
    presentAddress: "3rd Cross, Indiranagar, Bengaluru, Karnataka, India",
    mobileNumber: "+91 9988776655",
    appliedBy: "Applicant",
    appointmentType: "Document Verification",
    country: "Germany",
    dateTime: "04 Aug 2026 02:00 PM",
    dateOnly: "04 Aug 2026",
    timeOnly: "02:00 PM",
    location: "VFS - Bengaluru",
    address: "Global Tech Park, Whitefield Main Road, Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    googleMapLocation: "https://maps.google.com/?q=VFS+Bengaluru",
    status: "Completed",
    bookedBy: "Applicant",
    primaryOfficer: "Verification Officer Hans Müller",
    slotNo: "SLOT-DV09",
    totalFees: 2800,
    bookingDate: "28 Jul 2026",
    rescheduleCount: 0,
    appointmentNotes: "Document verification completed and biometric data uploaded.",
    actionNotes: []
  }
];

export default function AllAppointmentsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [bookedByFilter, setBookedByFilter] = useState("All");

  // Records State
  const [appointmentsList, setAppointmentsList] = useState<AppointmentRecord[]>(MOCK_APPOINTMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalApt, setActiveModalApt] = useState<AppointmentRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredAppointments = appointmentsList.filter((apt) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      apt.aptId.toLowerCase().includes(q) ||
      apt.appId.toLowerCase().includes(q) ||
      apt.applicantName.toLowerCase().includes(q) ||
      apt.passportNumber.toLowerCase().includes(q) ||
      (apt.agentName && apt.agentName.toLowerCase().includes(q));

    const matchesType = typeFilter === "All" || apt.appointmentType === typeFilter;
    const matchesStatus = statusFilter === "All" || apt.status === statusFilter;
    const matchesCountry = countryFilter === "All" || apt.country === countryFilter;
    const matchesBookedBy = bookedByFilter === "All" || apt.bookedBy === bookedByFilter;

    return matchesQuery && matchesType && matchesStatus && matchesCountry && matchesBookedBy;
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
  const handleConfirmApt = (apt: AppointmentRecord) => {
    setAppointmentsList((prev) =>
      prev.map((a) => (a.id === apt.id ? { ...a, status: "Scheduled" } : a))
    );
    triggerToast(`Appointment ${apt.aptId} confirmed.`);
    if (activeModalApt?.id === apt.id) {
      setActiveModalApt((prev) => (prev ? { ...prev, status: "Scheduled" } : null));
    }
  };

  const handleCancelApt = (apt: AppointmentRecord) => {
    setAppointmentsList((prev) =>
      prev.map((a) => (a.id === apt.id ? { ...a, status: "Cancelled" } : a))
    );
    triggerToast(`Appointment ${apt.aptId} cancelled.`);
    if (activeModalApt?.id === apt.id) {
      setActiveModalApt((prev) => (prev ? { ...prev, status: "Cancelled" } : null));
    }
  };

  const handleDeleteRecord = (apt: AppointmentRecord) => {
    setAppointmentsList((prev) => prev.filter((a) => a.id !== apt.id));
    triggerToast(`Appointment ${apt.aptId} deleted.`);
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
            <Calendar size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Embassy & Biometric Appointment Manager
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            All Appointments
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            View, schedule, and manage all embassy and biometric appointments for visa applications.
          </p>
        </div>

        <button
          onClick={() => triggerToast("Opening appointment scheduler wizard...")}
          className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2 shrink-0"
        >
          <PlusCircle size={16} /> Schedule New Appointment
        </button>
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Appointments</span>
            <div className="text-2xl font-black text-slate-900 font-mono">3,840</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Slot Master Registry</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Today's Appointments</span>
            <div className="text-2xl font-black text-slate-900 font-mono">76</div>
            <span className="text-[10px] text-emerald-600 font-bold">Active Today</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Upcoming Appointments</span>
            <div className="text-2xl font-black text-slate-900 font-mono">412</div>
            <span className="text-[10px] text-blue-600 font-bold">Queued Schedule</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Completed Appointments</span>
            <div className="text-2xl font-black text-slate-900 font-mono">3,120</div>
            <span className="text-[10px] text-purple-600 font-bold">Attended & Verified</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Rescheduled Appointments</span>
            <div className="text-2xl font-black text-slate-900 font-mono">180</div>
            <span className="text-[10px] text-amber-600 font-bold">Slot Shifted</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Pending Appointments</span>
            <div className="text-2xl font-black text-slate-900 font-mono">104</div>
            <span className="text-[10px] text-teal-600 font-bold">Slot Awaiting</span>
          </div>
        </div>

        {/* RIGHT CARD: WORKFLOW & APPOINTMENT TYPES CATALOG (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Appointment Workflow
            </h3>

            {/* APPOINTMENT WORKFLOW FLOW */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {APPOINTMENT_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[9px] shrink-0">
                    ▼
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* APPOINTMENT TYPES CATALOG */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px] font-semibold text-slate-600">
              <span className="text-slate-900 font-bold block mb-1">Appointment Types Catalog:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px] max-h-24 overflow-y-auto [scrollbar-width:thin]">
                {APPOINTMENT_TYPES_CATALOG.map((item, i) => (
                  <div key={i} className="flex items-center gap-1 text-slate-700">
                    <Check size={11} className="text-[#2563EB]" /> {item}
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Appointment Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredAppointments.length} of {appointmentsList.length} Appointments
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (Apt ID, App ID, Applicant, Passport, Agent)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="APT-9001, APP-20261001..."
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
              <option value="Biometric Submission">Biometric Submission</option>
              <option value="Embassy Interview">Embassy Interview</option>
              <option value="Document Verification">Document Verification</option>
              <option value="Medical Examination">Medical Examination</option>
              <option value="VAC / VFS Collection">VAC / VFS Collection</option>
            </select>
          </div>

          {/* APPOINTMENT STATUS */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Appointment Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Pending">Pending</option>
              <option value="No Show">No Show</option>
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

          {/* BOOKED BY */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Booked By
            </label>
            <select
              value={bookedByFilter}
              onChange={(e) => setBookedByFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Bookers</option>
              <option value="Applicant">Applicant</option>
              <option value="Agent">Agent</option>
              <option value="Admin">Admin</option>
              <option value="Embassy Direct">Embassy Direct</option>
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
            <span>Appointments Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => triggerToast(`Sending appointment reminders for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Send size={14} /> Send Reminders
            </button>
            <button
              onClick={() => triggerToast(`Opening batch reschedule tool for ${selectedIds.length} appointments.`)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={14} /> Batch Reschedule
            </button>
            <button
              onClick={() => triggerToast(`Exporting ${selectedIds.length} appointment records.`)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Report
            </button>
          </div>
        </div>
      )}

      {/* APPOINTMENTS DATA TABLE (COLUMNS MATCH WIREFRAME EXACTLY) */}
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
                <th className="py-3.5 px-4 font-mono">Date & Time</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Calendar size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No appointments found matching your filters.</p>
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
                      {apt.dateTime}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {apt.location}
                    </td>
                    <td className="py-3.5 px-4">
                      {apt.status === "Scheduled" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          🟢 Scheduled
                        </span>
                      ) : apt.status === "Completed" ? (
                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-blue-200">
                          🔵 Completed
                        </span>
                      ) : apt.status === "Rescheduled" ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-200">
                          🟠 Rescheduled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                          🔴 Cancelled
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveModalApt(apt);
                            setModalTab("Overview");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Appointment Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Opening edit window for ${apt.aptId}...`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Edit Appointment"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Reschedule prompt initiated for ${apt.aptId}...`)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title="Reschedule Appointment"
                        >
                          <RotateCcw size={15} />
                        </button>
                        <button
                          onClick={() => handleCancelApt(apt)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Cancel Appointment"
                        >
                          <XCircle size={15} />
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
          <div>Showing 1–10 of 3,840 Appointments</div>
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
          <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Appointment Audit Controls
        </h3>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Appointment slot tracking active: VAC/Embassy center mapping, automated SMS/email reminders, reschedule history log, officer allocation, and no-show audit trail.
        </p>
      </div>

      {/* CENTERED POPUP DETAILS MODAL (8 RECOMMENDED TABS FROM WIREFRAME) */}
      {activeModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      Appointment {activeModalApt.aptId}
                    </h3>
                    <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-700">
                      {activeModalApt.status.toUpperCase()}
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
              {RECOMMENDED_APPOINTMENT_TABS.map((tab) => {
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
                      Appointment Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Appointment ID</span>
                        <strong className="text-[#2563EB] font-mono font-bold">{activeModalApt.aptId}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Appointment Type</span>
                        <strong className="text-purple-700 font-bold">{activeModalApt.appointmentType}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Date & Time</span>
                        <strong className="text-emerald-700 font-mono font-bold">{activeModalApt.dateTime}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Center Location</span>
                        <strong className="text-slate-900 font-bold">{activeModalApt.location}</strong>
                      </div>
                    </div>
                  </div>

                  {/* LOCATION & OFFICER DETAILS CARD */}
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                      <MapPin size={16} className="text-[#2563EB]" /> Location & Officer Allocation
                    </h4>
                    <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                      <p><strong>Address:</strong> {activeModalApt.address}</p>
                      <p><strong>City / State:</strong> {activeModalApt.city}, {activeModalApt.state}</p>
                      <p><strong>Assigned Officer:</strong> {activeModalApt.primaryOfficer}</p>
                      <p><strong>Slot Number:</strong> <span className="font-mono font-bold text-purple-700">{activeModalApt.slotNo}</span></p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleConfirmApt(activeModalApt)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> Confirm Appointment
                </button>
                <button
                  onClick={() => triggerToast(`Reschedule prompt initiated for ${activeModalApt.aptId}...`)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw size={15} /> Reschedule Slot
                </button>
              </div>

              <button
                onClick={() => triggerToast(`Sending reminder to ${activeModalApt.applicantName}...`)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Send size={14} /> Send Reminder Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
