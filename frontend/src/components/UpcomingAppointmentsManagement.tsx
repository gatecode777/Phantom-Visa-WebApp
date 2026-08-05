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
  QrCode,
  Bell,
  Smartphone,
  Share2
} from "lucide-react";

export interface UpcomingAppointmentRecord {
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
  dateOnly: string;
  timeOnly: string;
  location: string;
  address: string;
  city: string;
  state: string;
  googleMapLink: string;
  status: "Scheduled" | "Confirmed" | "Rescheduled" | "Reminder Pending";
  bookedBy: "Applicant" | "Agent" | "Admin" | "Embassy Direct";
  primaryOfficer?: string;
  prepInstructions: string;
  reminderStatus: "Sent" | "Pending" | "Failed";
  reminderDate: string;
  emailStatus: "Delivered" | "Pending";
  smsStatus: "Delivered" | "Pending";
  whatsappStatus: "Delivered" | "Pending";
  totalRemindersSent: number;
  actionNotes?: { id: string; author: string; text: string; date: string }[];
}

export const RECOMMENDED_UPCOMING_TABS = [
  "Overview",
  "Applicant Details",
  "Appointment Details",
  "Location",
  "Reminder History",
  "Confirmation Details",
  "Activity Logs",
  "Action Notes"
];

export const UPCOMING_WORKFLOW_STEPS = [
  "Appointment Scheduled",
  "Confirmation Notice Sent",
  "Reminder Sent",
  "Preparation Checklist",
  "Location Reminder Sent",
  "Appointment Attended"
];

export const PROFESSIONAL_FEATURES = [
  "Calendar View (Daily/Weekly/Monthly)",
  "Time Slot Management",
  "Automated Email Reminders",
  "SMS Notifications",
  "WhatsApp Notifications",
  "QR Code Appointment Pass",
  "Google Calendar Integration",
  "Direction / Location Map Link",
  "Reschedule Request Handler",
  "Attendance Tracking"
];

const MOCK_UPCOMING_APPOINTMENTS: UpcomingAppointmentRecord[] = [
  {
    id: "1",
    aptId: "APT-U1001",
    appId: "APP-20261001",
    applicantName: "Geeta Bisht",
    passportNumber: "Z9876543",
    nationality: "Indian",
    presentAddress: "House No 42, Sector 15, Chandigarh, India",
    mobileNumber: "+91 9876543210",
    appliedBy: "Applicant",
    appointmentType: "Biometrics",
    country: "Canada",
    dateOnly: "05 Aug 2026",
    timeOnly: "10:00 AM",
    location: "Embassy - VFS",
    address: "Mezzanine Floor, Shivaji Stadium Metro Station, Connaught Place, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    googleMapLink: "https://maps.google.com/?q=VFS+Delhi",
    status: "Scheduled",
    bookedBy: "Applicant",
    primaryOfficer: "Officer D. Kumar",
    prepInstructions: "Carry original passport, barcoded appointment letter, and payment receipt.",
    reminderStatus: "Sent",
    reminderDate: "04 Aug 2026 09:00 AM",
    emailStatus: "Delivered",
    smsStatus: "Delivered",
    whatsappStatus: "Delivered",
    totalRemindersSent: 2,
    actionNotes: [
      { id: "n1", author: "System", text: "Automated 24hr reminder dispatched via Email & SMS.", date: "04 Aug 2026 09:00 AM" }
    ]
  },
  {
    id: "2",
    aptId: "APT-U1002",
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
    dateOnly: "06 Aug 2026",
    timeOnly: "11:30 AM",
    location: "Consulate General",
    address: "Australian Consulate-General, Express Towers, Nariman Point, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    googleMapLink: "https://maps.google.com/?q=Australian+Consulate+Mumbai",
    status: "Rescheduled",
    bookedBy: "Agent",
    primaryOfficer: "Consular Officer Sarah Jenkins",
    prepInstructions: "Arrive 15 minutes prior to slot. Electronic devices prohibited inside consulate.",
    reminderStatus: "Pending",
    reminderDate: "05 Aug 2026 09:00 AM",
    emailStatus: "Pending",
    smsStatus: "Pending",
    whatsappStatus: "Pending",
    totalRemindersSent: 0,
    actionNotes: []
  },
  {
    id: "3",
    aptId: "APT-U1003",
    appId: "APP-20261003",
    applicantName: "Bikram Suman",
    passportNumber: "K4567890",
    nationality: "Indian",
    presentAddress: "3rd Cross, Indiranagar, Bengaluru, Karnataka, India",
    mobileNumber: "+91 9988776655",
    appliedBy: "Applicant",
    appointmentType: "Medical Examination",
    country: "Germany",
    dateOnly: "07 Aug 2026",
    timeOnly: "09:30 AM",
    location: "Apollo Hospital",
    address: "Apollo Health City, Jubilee Hills, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    googleMapLink: "https://maps.google.com/?q=Apollo+Hospital+Hyderabad",
    status: "Confirmed",
    bookedBy: "Applicant",
    primaryOfficer: "Dr. A. K. Varma",
    prepInstructions: "Fast for 8 hours prior to medical examination.",
    reminderStatus: "Sent",
    reminderDate: "03 Aug 2026 10:00 AM",
    emailStatus: "Delivered",
    smsStatus: "Delivered",
    whatsappStatus: "Delivered",
    totalRemindersSent: 1,
    actionNotes: []
  }
];

export default function UpcomingAppointmentsManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [bookedByFilter, setBookedByFilter] = useState("All");

  // Records State
  const [upcomingList, setUpcomingList] = useState<UpcomingAppointmentRecord[]>(MOCK_UPCOMING_APPOINTMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Details Modal State
  const [activeModalApt, setActiveModalApt] = useState<UpcomingAppointmentRecord | null>(null);
  const [modalTab, setModalTab] = useState<string>("Overview");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredAppointments = upcomingList.filter((apt) => {
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
  const handleConfirmApt = (apt: UpcomingAppointmentRecord) => {
    setUpcomingList((prev) =>
      prev.map((a) => (a.id === apt.id ? { ...a, status: "Confirmed" } : a))
    );
    triggerToast(`Appointment ${apt.aptId} confirmed.`);
    if (activeModalApt?.id === apt.id) {
      setActiveModalApt((prev) => (prev ? { ...prev, status: "Confirmed" } : null));
    }
  };

  const handleDeleteRecord = (apt: UpcomingAppointmentRecord) => {
    setUpcomingList((prev) => prev.filter((a) => a.id !== apt.id));
    triggerToast(`Upcoming appointment ${apt.aptId} deleted.`);
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
            <Clock size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Scheduled Future Slots & Reminder Queue
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Upcoming Appointments
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Manage all upcoming visa appointments scheduled for today, tomorrow, and future dates.
          </p>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS & RIGHT CATALOG CARDS (FROM WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 6 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Upcoming</span>
            <div className="text-2xl font-black text-slate-900 font-mono">412</div>
            <span className="text-[10px] text-[#2563EB] font-bold">Upcoming Queue</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Today's Upcoming</span>
            <div className="text-2xl font-black text-slate-900 font-mono">76</div>
            <span className="text-[10px] text-emerald-600 font-bold">Today's Schedule</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Tomorrow's Upcoming</span>
            <div className="text-2xl font-black text-slate-900 font-mono">94</div>
            <span className="text-[10px] text-blue-600 font-bold">Tomorrow's Schedule</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">This Week</span>
            <div className="text-2xl font-black text-slate-900 font-mono">188</div>
            <span className="text-[10px] text-purple-600 font-bold">7-Day Window</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Next 30 Days</span>
            <div className="text-2xl font-black text-slate-900 font-mono">412</div>
            <span className="text-[10px] text-teal-600 font-bold">Monthly Schedule</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Reminders Pending</span>
            <div className="text-2xl font-black text-slate-900 font-mono">48</div>
            <span className="text-[10px] text-amber-600 font-bold">Notification Queue</span>
          </div>
        </div>

        {/* RIGHT CARD: WORKFLOW & PROFESSIONAL FEATURES CATALOG (FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Upcoming Appointment Workflow
            </h3>

            {/* WORKFLOW FLOW */}
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {UPCOMING_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[9px] shrink-0">
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
            <Filter size={16} className="text-[#2563EB]" /> Search & Upcoming Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredAppointments.length} of {upcomingList.length} Upcoming Appointments
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
                placeholder="APT-U1001, APP-20261001..."
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
              <option value="Passport Submission">Passport Submission</option>
              <option value="VFS Collection">VFS Collection</option>
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
              <option value="Confirmed">Confirmed</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Reminder Pending">Reminder Pending</option>
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
            <span>Upcoming Appointments Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => triggerToast(`Sending email reminders for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Send size={14} /> Send Email Reminders
            </button>
            <button
              onClick={() => triggerToast(`Sending SMS reminders for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Smartphone size={14} /> Send SMS Reminders
            </button>
            <button
              onClick={() => triggerToast(`Sending WhatsApp reminders for ${selectedIds.length} items.`)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <MessageSquare size={14} /> Send WhatsApp
            </button>
            <button
              onClick={() => triggerToast(`Confirmed ${selectedIds.length} appointments.`)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 size={14} /> Confirm Selected
            </button>
          </div>
        </div>
      )}

      {/* UPCOMING APPOINTMENTS TABLE (COLUMNS MATCH WIREFRAME EXACTLY) */}
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
                <th className="py-3.5 px-4 font-mono">Date</th>
                <th className="py-3.5 px-4 font-mono">Time</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <Clock size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No upcoming appointments found matching your filters.</p>
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
                      {apt.dateOnly}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {apt.timeOnly}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {apt.location}
                    </td>
                    <td className="py-3.5 px-4">
                      {apt.status === "Confirmed" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          🟢 Confirmed
                        </span>
                      ) : apt.status === "Scheduled" ? (
                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-blue-200">
                          🟢 Scheduled
                        </span>
                      ) : apt.status === "Rescheduled" ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-200">
                          🟠 Rescheduled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-purple-200">
                          🟡 Reminder Pending
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
                          title="View Details & Preparation List"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleConfirmApt(apt)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Confirm Appointment"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Reminder sent to ${apt.applicantName}...`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Send Reminder"
                        >
                          <Bell size={15} />
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
          <div>Showing 1–10 of 412 Upcoming Appointments</div>
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
          <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Upcoming Audit & Reminders
        </h3>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Features active: Calendar slot optimization, automated SMS/Email/WhatsApp notification dispatch, QR code pass generation, Google Calendar sync, and map direction routing.
        </p>
      </div>

      {/* CENTERED POPUP DETAILS MODAL (8 RECOMMENDED TABS FROM WIREFRAME) */}
      {activeModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-lg text-white">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      Upcoming Appointment {activeModalApt.aptId}
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
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
              {RECOMMENDED_UPCOMING_TABS.map((tab) => {
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
                      Upcoming Appointment Summary
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
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Scheduled Date & Time</span>
                        <strong className="text-emerald-700 font-mono font-bold">{activeModalApt.dateOnly} @ {activeModalApt.timeOnly}</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Reminder Status</span>
                        <strong className="text-slate-900 font-bold">{activeModalApt.reminderStatus} ({activeModalApt.totalRemindersSent} Sent)</strong>
                      </div>
                    </div>
                  </div>

                  {/* PREPARATION INSTRUCTIONS CARD */}
                  <div className="bg-blue-50/60 border border-blue-200 rounded-3xl p-5 space-y-2">
                    <h4 className="text-xs font-extrabold text-[#2563EB] uppercase tracking-wider font-outfit flex items-center gap-2">
                      <FileText size={16} /> Preparation & Checklist Instructions
                    </h4>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      "{activeModalApt.prepInstructions}"
                    </p>
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
                  onClick={() => triggerToast(`Generating QR Code Pass for ${activeModalApt.aptId}...`)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <QrCode size={15} /> Generate Pass
                </button>
              </div>

              <button
                onClick={() => triggerToast(`Sending reminder to ${activeModalApt.applicantName}...`)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Send size={14} /> Send Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
