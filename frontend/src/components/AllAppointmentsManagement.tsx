import React, { useState, useMemo } from "react";
import { useVisa } from "../context/VisaContext";
import {
  UnifiedAppointmentRecord,
  generateAptId,
  formatDateDisplay,
  APPOINTMENT_TYPES_CATALOG,
  APPOINTMENT_WORKFLOW_STEPS
} from "../services/appointmentService";
import {
  Calendar,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  PlusCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Check,
  X,
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
  FileText,
  MapPin,
  Map,
  RotateCcw,
  UserCheck,
  FileCheck
} from "lucide-react";

// ── Re-export catalog constants so other components can reference them ────────
export { APPOINTMENT_TYPES_CATALOG, APPOINTMENT_WORKFLOW_STEPS };

const RECOMMENDED_APPOINTMENT_TABS = [
  "Overview",
  "Applicant Details",
  "Appointment Details",
  "Location",
  "Reschedule History",
  "Activity Logs",
  "Action Notes"
];

const PAGE_SIZE = 10;

export default function AllAppointmentsManagement() {
  const {
    unifiedAppointments,
    addUnifiedAppointment,
    updateUnifiedAppointment,
    unifiedTransactions
  } = useVisa();

  // ── Search & Filter ────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [bookedByFilter, setBookedByFilter] = useState("All");

  // ── Pagination ─────────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);

  // ── Selection ──────────────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ── Detail modal ───────────────────────────────────────────────────────────
  const [activeModalApt, setActiveModalApt] = useState<UnifiedAppointmentRecord | null>(null);
  const [modalTab, setModalTab] = useState("Overview");

  // ── Schedule New Appointment modal ─────────────────────────────────────────
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Schedule form state
  const [schedAppSearch, setSchedAppSearch] = useState("");
  const [schedSelectedTxnId, setSchedSelectedTxnId] = useState("");
  const [schedType, setSchedType] = useState<UnifiedAppointmentRecord["appointmentType"]>("Biometric Submission");
  const [schedCenter, setSchedCenter] = useState("");
  const [schedDate, setSchedDate] = useState("");
  const [schedSlot, setSchedSlot] = useState("11:00 AM - 11:30 AM");
  const [schedBookedBy, setSchedBookedBy] = useState<"Applicant" | "Agent" | "Admin">("Admin");
  const [schedOfficer, setSchedOfficer] = useState("");
  const [schedSendConfirmation, setSchedSendConfirmation] = useState(true);
  const [schedNotes, setSchedNotes] = useState("");

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // ── Derived metrics ────────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const total = unifiedAppointments.length;
    const scheduled = unifiedAppointments.filter((a) => a.status === "Upcoming").length;
    const completed = unifiedAppointments.filter((a) => a.status === "Completed").length;
    const rescheduled = unifiedAppointments.filter((a) => a.status === "Rescheduled").length;
    const cancelled = unifiedAppointments.filter((a) => a.status === "Cancelled").length;
    return { total, scheduled, completed, rescheduled, cancelled };
  }, [unifiedAppointments]);

  // ── Unique countries for filter ───────────────────────────────────────────
  const countries = useMemo(
    () => Array.from(new Set(unifiedAppointments.map((a) => a.country))).sort(),
    [unifiedAppointments]
  );

  // ── Filter logic ───────────────────────────────────────────────────────────
  const filteredAppointments = useMemo(() => {
    return unifiedAppointments.filter((apt) => {
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        apt.aptId.toLowerCase().includes(q) ||
        apt.applicationId.toLowerCase().includes(q) ||
        apt.applicantName.toLowerCase().includes(q) ||
        apt.passportNumber.toLowerCase().includes(q) ||
        (apt.agentName && apt.agentName.toLowerCase().includes(q));

      const matchesType = typeFilter === "All" || apt.appointmentType === typeFilter;
      const matchesStatus = statusFilter === "All" || apt.status === statusFilter;
      const matchesCountry = countryFilter === "All" || apt.country === countryFilter;
      const matchesBookedBy = bookedByFilter === "All" || apt.bookedBy === bookedByFilter;

      return matchesQuery && matchesType && matchesStatus && matchesCountry && matchesBookedBy;
    });
  }, [unifiedAppointments, searchQuery, typeFilter, statusFilter, countryFilter, bookedByFilter]);

  // Reset to page 1 when filters change
  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedAppointments = filteredAppointments.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  // Pagination display text
  const paginationFrom = filteredAppointments.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const paginationTo = Math.min(safePage * PAGE_SIZE, filteredAppointments.length);

  // ── Selection helpers ──────────────────────────────────────────────────────
  const handleSelectAll = () => {
    if (selectedIds.length === pagedAppointments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pagedAppointments.map((a) => a.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleConfirmApt = (apt: UnifiedAppointmentRecord) => {
    updateUnifiedAppointment(apt.aptId, { status: "Upcoming" });
    triggerToast(`Appointment ${apt.aptId} confirmed as Upcoming.`);
    if (activeModalApt?.aptId === apt.aptId) {
      setActiveModalApt((prev) => (prev ? { ...prev, status: "Upcoming" } : null));
    }
  };

  const handleCancelApt = (apt: UnifiedAppointmentRecord) => {
    updateUnifiedAppointment(apt.aptId, { status: "Cancelled" });
    triggerToast(`Appointment ${apt.aptId} cancelled.`);
    if (activeModalApt?.aptId === apt.aptId) {
      setActiveModalApt((prev) => (prev ? { ...prev, status: "Cancelled" } : null));
    }
  };

  // ── Schedule New Appointment submission ────────────────────────────────────
  const selectedTxn = useMemo(
    () => unifiedTransactions.find((t) => t.id === schedSelectedTxnId || t.transactionId === schedSelectedTxnId),
    [unifiedTransactions, schedSelectedTxnId]
  );

  const filteredTxnsForSearch = useMemo(() => {
    const q = schedAppSearch.toLowerCase();
    if (!q) return unifiedTransactions.slice(0, 8);
    return unifiedTransactions
      .filter(
        (t) =>
          t.applicationId.toLowerCase().includes(q) ||
          t.applicantName.toLowerCase().includes(q) ||
          t.passportNumber.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [unifiedTransactions, schedAppSearch]);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxn) {
      alert("Please select an application before scheduling.");
      return;
    }
    if (!schedDate) {
      alert("Please select a date.");
      return;
    }

    const newAptId = generateAptId();
    const newApt: UnifiedAppointmentRecord = {
      id: `apt-admin-${Date.now()}`,
      aptId: newAptId,
      applicationId: selectedTxn.applicationId,
      applicantName: selectedTxn.applicantName,
      passportNumber: selectedTxn.passportNumber,
      nationality: selectedTxn.nationality,
      country: selectedTxn.country.replace(/\s*[\u{1F1E0}-\u{1F1FF}]{1,2}/gu, "").trim(),
      visaType: selectedTxn.visaType,
      appointmentType: schedType,
      dateOnly: schedDate,
      dateDisplay: formatDateDisplay(schedDate),
      timeSlot: schedSlot,
      vacCenter: schedCenter || "VFS Global Application Centre",
      address: schedCenter || "Appointment Center",
      city: schedCenter.split(",").pop()?.trim() || "New Delhi",
      state: "Delhi",
      status: "Upcoming",
      bookedBy: schedBookedBy,
      primaryOfficer: schedOfficer || undefined,
      slotNo: `SLOT-ADM-${Math.floor(100 + Math.random() * 900)}`,
      qrCodeRef: `VFS-ADM-${selectedTxn.passportNumber}-ADM`,
      slipPdfName: `appointment_slip_${newAptId}.pdf`,
      rescheduleCount: 0,
      appointmentNotes: schedNotes || undefined,
      sendConfirmation: schedSendConfirmation,
      createdAt: new Date().toISOString()
    };

    addUnifiedAppointment(newApt);
    triggerToast(`Appointment ${newAptId} created for ${selectedTxn.applicantName}.`);

    // Reset form
    setShowScheduleModal(false);
    setSchedAppSearch("");
    setSchedSelectedTxnId("");
    setSchedType("Biometric Submission");
    setSchedCenter("");
    setSchedDate("");
    setSchedSlot("11:00 AM - 11:30 AM");
    setSchedBookedBy("Admin");
    setSchedOfficer("");
    setSchedNotes("");
    setSchedSendConfirmation(true);
  };

  // ── Status badge ───────────────────────────────────────────────────────────
  const StatusBadge = ({ status }: { status: UnifiedAppointmentRecord["status"] }) => {
    const map: Record<string, string> = {
      Upcoming: "text-emerald-700 bg-emerald-50 border-emerald-200",
      Completed: "text-blue-700 bg-blue-50 border-blue-200",
      Rescheduled: "text-amber-700 bg-amber-50 border-amber-200",
      Cancelled: "text-red-700 bg-red-50 border-red-200",
      "No Show": "text-slate-600 bg-slate-100 border-slate-200"
    };
    const icons: Record<string, string> = {
      Upcoming: "🟢",
      Completed: "🔵",
      Rescheduled: "🟠",
      Cancelled: "🔴",
      "No Show": "⚫"
    };
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold border px-2.5 py-0.5 rounded-full ${map[status] ?? map["No Show"]}`}>
        {icons[status] ?? "⚫"} {status}
      </span>
    );
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">

      {/* TOAST */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-6 rounded-3xl shadow-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-700">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-200 mb-1">
            <Calendar size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Embassy &amp; Biometric Appointment Manager
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">All Appointments</h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Platform-wide ledger of every appointment — view, schedule, and manage embassy and biometric slots.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2 shrink-0"
        >
          <PlusCircle size={16} /> Schedule New Appointment
        </button>
      </div>

      {/* METRICS CARDS + WORKFLOW CATALOG */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {[
            { label: "Total Appointments", value: metrics.total, filter: "All", accent: "text-[#2563EB]", sub: "Slot Master Registry", active: "bg-blue-50 border-[#2563EB] ring-2 ring-[#2563EB]/10" },
            { label: "Upcoming Slots", value: metrics.scheduled, filter: "Upcoming", accent: "text-emerald-600", sub: "Active slots", active: "bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-500/10", border: "border-l-4 border-l-emerald-500" },
            { label: "Completed Slots", value: metrics.completed, filter: "Completed", accent: "text-purple-600", sub: "Attended & Verified", active: "bg-purple-50/50 border-purple-500 ring-2 ring-purple-500/10", border: "border-l-4 border-l-purple-500" },
            { label: "Rescheduled", value: metrics.rescheduled, filter: "Rescheduled", accent: "text-amber-600", sub: "Slot Shifted", active: "bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/10", border: "border-l-4 border-l-amber-500" },
            { label: "Cancelled Slots", value: metrics.cancelled, filter: "Cancelled", accent: "text-red-600", sub: "Released Slots", active: "bg-red-50/50 border-red-500 ring-2 ring-red-500/10", border: "border-l-4 border-l-red-500" }
          ].map(({ label, value, filter, accent, sub, active, border }) => (
            <div
              key={label}
              onClick={() => { setStatusFilter(filter); setCurrentPage(1); }}
              className={`border rounded-3xl p-4 shadow-2xs transition cursor-pointer ${border ?? ""} ${statusFilter === filter ? active : "bg-white border-slate-200 hover:shadow-md"}`}
            >
              <span className={`text-[10px] font-extrabold uppercase block mb-1 ${statusFilter === filter ? accent : "text-slate-500"}`}>{label}</span>
              <div className="text-2xl font-black text-slate-900 font-mono">{value}</div>
              <span className={`text-[10px] font-bold ${accent}`}>{sub}</span>
            </div>
          ))}
        </div>

        {/* Workflow + Types catalog */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Appointment Workflow
            </h3>
            <div className="space-y-1 text-[11px] text-slate-700 font-medium mb-3">
              {APPOINTMENT_WORKFLOW_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[9px] shrink-0">▼</div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
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

      {/* SEARCH & FILTERS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Filter size={16} className="text-[#2563EB]" /> Search &amp; Appointment Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredAppointments.length} of {unifiedAppointments.length} Appointments
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search (Apt ID, App ID, Applicant, Passport)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="APT-2026-9910, VO-2026-1025..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Appointment Type</label>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Types</option>
              {APPOINTMENT_TYPES_CATALOG.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No Show">No Show</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Country</label>
            <select
              value={countryFilter}
              onChange={(e) => { setCountryFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
            >
              <option value="All">All Countries</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">Booked By</label>
            <select
              value={bookedByFilter}
              onChange={(e) => { setBookedByFilter(e.target.value); setCurrentPage(1); }}
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

      {/* BULK ACTIONS */}
      {selectedIds.length > 0 && (
        <div className="bg-[#0E1A2C] border border-[#2563EB]/40 text-white p-3.5 rounded-2xl shadow-xl mb-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-6 h-6 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-mono font-bold text-xs">{selectedIds.length}</span>
            <span>Appointments Selected</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => triggerToast(`Sending reminders for ${selectedIds.length} appointments.`)} className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1">
              <Send size={14} /> Send Reminders
            </button>
            <button onClick={() => triggerToast(`Exporting ${selectedIds.length} appointment records.`)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1">
              <Download size={14} /> Export
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === pagedAppointments.length && pagedAppointments.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-mono">Appointment ID</th>
                <th className="py-3.5 px-4 font-mono">Application ID</th>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4 font-mono">Date &amp; Time</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {pagedAppointments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Calendar size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No appointments found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                pagedAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(apt.id)}
                        onChange={() => handleToggleSelect(apt.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{apt.aptId}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">{apt.applicationId}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {apt.applicantName}
                      {apt.agentName && <span className="block text-[10px] text-slate-400 font-normal">({apt.agentName})</span>}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-purple-700">{apt.appointmentType}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{apt.country}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      <p>{apt.dateDisplay}</p>
                      <p className="text-[10px]">{apt.timeSlot}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      <p>{apt.vacCenter}</p>
                      <p className="text-[10px] text-slate-400">{apt.city}</p>
                    </td>
                    <td className="py-3.5 px-4"><StatusBadge status={apt.status} /></td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => { setActiveModalApt(apt); setModalTab("Overview"); }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleConfirmApt(apt)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Confirm / Mark Upcoming"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => triggerToast(`Reschedule prompt initiated for ${apt.aptId}...`)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title="Reschedule"
                        >
                          <RotateCcw size={15} />
                        </button>
                        <button
                          onClick={() => handleCancelApt(apt)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Cancel"
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

        {/* PAGINATION FOOTER — dynamic, never hardcoded (Bug 4 fix) */}
        <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            {filteredAppointments.length === 0
              ? "No appointments found"
              : `Showing ${paginationFrom}–${paginationTo} of ${filteredAppointments.length} Appointments`}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-1 font-mono font-bold">
              <button
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-3 py-1 rounded-lg ${p === safePage ? "bg-[#2563EB] text-white" : "bg-white border border-slate-200 hover:bg-slate-100 transition"}`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AUDIT CONTROLS */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2 mb-6">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-blue-100 pb-2">
          <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Appointment Audit Controls
        </h3>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Appointment slot tracking active: VAC/Embassy center mapping, automated SMS/email reminders, reschedule history log, officer allocation, and no-show audit trail.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* DETAIL MODAL */}
      {/* ════════════════════════════════════════════════════════════ */}
      {activeModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">Appointment {activeModalApt.aptId}</h3>
                    <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-700">
                      {activeModalApt.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    App ID: <strong className="text-blue-300">{activeModalApt.applicationId}</strong> &bull; {activeModalApt.applicantName} ({activeModalApt.passportNumber})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalApt(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin]">
              {RECOMMENDED_APPOINTMENT_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setModalTab(tab)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    modalTab === tab
                      ? "bg-[#2563EB] text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin]">
              {modalTab === "Overview" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { label: "Appointment ID", value: activeModalApt.aptId, cls: "text-[#2563EB] font-mono" },
                      { label: "Appointment Type", value: activeModalApt.appointmentType, cls: "text-purple-700" },
                      { label: "Date & Time", value: `${activeModalApt.dateDisplay} · ${activeModalApt.timeSlot}`, cls: "text-emerald-700 font-mono" },
                      { label: "Center Location", value: activeModalApt.vacCenter, cls: "text-slate-900" }
                    ].map(({ label, value, cls }) => (
                      <div key={label} className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">{label}</span>
                        <strong className={`font-bold ${cls}`}>{value}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <MapPin size={16} className="text-[#2563EB]" /> Location &amp; Officer Allocation
                    </h4>
                    <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                      <p><strong>Address:</strong> {activeModalApt.address}</p>
                      <p><strong>City / State:</strong> {activeModalApt.city}, {activeModalApt.state}</p>
                      <p><strong>Assigned Officer:</strong> {activeModalApt.primaryOfficer || "—"}</p>
                      <p><strong>Slot Number:</strong> <span className="font-mono font-bold text-purple-700">{activeModalApt.slotNo}</span></p>
                      <p><strong>Booked By:</strong> {activeModalApt.bookedBy}</p>
                    </div>
                  </div>
                </div>
              )}

              {modalTab === "Applicant Details" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Applicant Name", value: activeModalApt.applicantName },
                      { label: "Passport Number", value: activeModalApt.passportNumber },
                      { label: "Nationality", value: activeModalApt.nationality },
                      { label: "Application ID", value: activeModalApt.applicationId },
                      { label: "Country", value: activeModalApt.country },
                      { label: "Visa Type", value: activeModalApt.visaType }
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">{label}</span>
                        <strong className="font-bold text-slate-900 font-mono">{value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalTab === "Appointment Details" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Appointment Date", value: activeModalApt.dateDisplay },
                      { label: "Time Slot", value: activeModalApt.timeSlot },
                      { label: "Appointment Type", value: activeModalApt.appointmentType },
                      { label: "Slot Number", value: activeModalApt.slotNo },
                      { label: "Status", value: activeModalApt.status },
                      { label: "Booked By", value: activeModalApt.bookedBy }
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">{label}</span>
                        <strong className="font-bold text-slate-900">{value}</strong>
                      </div>
                    ))}
                  </div>
                  {activeModalApt.appointmentNotes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                      <span className="text-[10px] font-extrabold uppercase text-blue-500 block mb-1">Appointment Notes</span>
                      <p className="text-slate-700 text-xs leading-relaxed">{activeModalApt.appointmentNotes}</p>
                    </div>
                  )}
                </div>
              )}

              {modalTab === "Location" && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                    <p><strong>Center:</strong> {activeModalApt.vacCenter}</p>
                    <p><strong>Address:</strong> {activeModalApt.address}, {activeModalApt.city}, {activeModalApt.state}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-blue-700 text-xs">
                    <MapPin size={14} className="inline mr-1" />
                    Use Google Maps or the VFS app to navigate to the center.
                  </div>
                </div>
              )}

              {modalTab === "Reschedule History" && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <p><strong>Total Reschedules:</strong> {activeModalApt.rescheduleCount}</p>
                  {activeModalApt.lastRescheduledDate && (
                    <p><strong>Last Rescheduled:</strong> {activeModalApt.lastRescheduledDate}</p>
                  )}
                  {activeModalApt.rescheduleCount === 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-500 text-center">
                      No reschedules for this appointment.
                    </div>
                  )}
                </div>
              )}

              {(modalTab === "Activity Logs" || modalTab === "Action Notes") && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-400 animate-in fade-in duration-150">
                  <FileText size={28} className="mx-auto mb-2 opacity-40" />
                  <p className="font-bold">Activity logs coming soon.</p>
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleConfirmApt(activeModalApt)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> Confirm Upcoming
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
                <Send size={14} /> Send Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* SCHEDULE NEW APPOINTMENT MODAL (Bug 7 fix) */}
      {/* ════════════════════════════════════════════════════════════ */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal header */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white p-5 flex items-center justify-between border-b border-blue-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <PlusCircle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Schedule New Appointment</h3>
                  <p className="text-xs text-blue-200 mt-0.5">Create an appointment against an existing application record.</p>
                </div>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs [scrollbar-width:thin]">

              {/* 1. Application Search */}
              <div className="space-y-2">
                <label className="block font-extrabold text-slate-700 text-[11px] uppercase tracking-wider">
                  Search &amp; Select Application <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by Application ID, Applicant Name, or Passport Number..."
                    value={schedAppSearch}
                    onChange={(e) => { setSchedAppSearch(e.target.value); setSchedSelectedTxnId(""); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                {/* Search results */}
                {!schedSelectedTxnId && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-40 overflow-y-auto">
                    {filteredTxnsForSearch.length === 0 ? (
                      <p className="px-4 py-3 text-slate-400 text-center">No matching applications found.</p>
                    ) : (
                      filteredTxnsForSearch.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => { setSchedSelectedTxnId(t.id); setSchedAppSearch(""); }}
                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition text-xs"
                        >
                          <span className="font-mono font-bold text-[#2563EB]">{t.applicationId}</span>
                          <span className="mx-2 text-slate-400">—</span>
                          <span className="font-bold text-slate-800">{t.applicantName}</span>
                          <span className="text-slate-400 ml-1">({t.passportNumber})</span>
                          <span className="ml-2 text-slate-500">{t.country}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}

                {/* Selected application badge */}
                {selectedTxn && (
                  <div className="bg-blue-50 border border-blue-300 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-[#2563EB]">{selectedTxn.applicationId}</span>
                      <span className="mx-2 text-slate-400">—</span>
                      <span className="font-bold text-slate-800">{selectedTxn.applicantName}</span>
                      <span className="text-slate-500 ml-2 text-[10px]">{selectedTxn.passportNumber}</span>
                    </div>
                    <button type="button" onClick={() => setSchedSelectedTxnId("")} className="text-slate-400 hover:text-red-600 transition"><X size={14} /></button>
                  </div>
                )}
              </div>

              {/* 2. Auto-filled read-only fields */}
              {selectedTxn && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Applicant Name", value: selectedTxn.applicantName },
                    { label: "Country", value: selectedTxn.country.replace(/\s*[\u{1F1E0}-\u{1F1FF}]{1,2}/gu, "").trim() },
                    { label: "Visa Category", value: selectedTxn.visaCategory }
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <label className="block font-bold text-slate-600 mb-1">{label} <span className="text-[10px] text-slate-400">(auto-filled)</span></label>
                      <div className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 font-semibold">{value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. Appointment Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Appointment Type <span className="text-red-500">*</span></label>
                  <select
                    value={schedType}
                    onChange={(e) => setSchedType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-semibold focus:outline-none focus:border-[#2563EB]"
                    required
                  >
                    {APPOINTMENT_TYPES_CATALOG.slice(0, 7).map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">VAC / Embassy Center</label>
                  <input
                    type="text"
                    placeholder="e.g. VFS Global, Connaught Place, New Delhi"
                    value={schedCenter}
                    onChange={(e) => setSchedCenter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* 4. Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={schedDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setSchedDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-bold focus:outline-none focus:border-[#2563EB]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Time Slot <span className="text-red-500">*</span></label>
                  <select
                    value={schedSlot}
                    onChange={(e) => setSchedSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-semibold focus:outline-none focus:border-[#2563EB]"
                    required
                  >
                    <option value="09:00 AM - 09:30 AM">Morning: 09:00 AM - 09:30 AM</option>
                    <option value="11:00 AM - 11:30 AM">Morning: 11:00 AM - 11:30 AM</option>
                    <option value="02:00 PM - 02:30 PM">Afternoon: 02:00 PM - 02:30 PM</option>
                    <option value="03:30 PM - 04:00 PM">Afternoon: 03:30 PM - 04:00 PM</option>
                  </select>
                </div>
              </div>

              {/* 5. Booked By & Officer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Booked By</label>
                  <select
                    value={schedBookedBy}
                    onChange={(e) => setSchedBookedBy(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-semibold focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Agent">Agent</option>
                    <option value="Applicant">Applicant</option>
                  </select>
                </div>
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Officer Assigned <span className="text-slate-400 text-[10px] font-normal">(optional)</span></label>
                  <input
                    type="text"
                    placeholder="Officer name..."
                    value={schedOfficer}
                    onChange={(e) => setSchedOfficer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* 6. Notes */}
              <div>
                <label className="block font-extrabold text-slate-700 mb-1">Notes <span className="text-slate-400 text-[10px] font-normal">(optional)</span></label>
                <textarea
                  rows={2}
                  placeholder="Internal admin notes about this appointment..."
                  value={schedNotes}
                  onChange={(e) => setSchedNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-[#2563EB] resize-none"
                />
              </div>

              {/* 7. Send Confirmation */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={schedSendConfirmation}
                  onChange={(e) => setSchedSendConfirmation(e.target.checked)}
                  className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer w-4 h-4"
                />
                <span className="text-slate-700 font-semibold group-hover:text-[#2563EB] transition">Send SMS &amp; Email Confirmation to Applicant</span>
              </label>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-[11px] text-blue-800">
                <strong>Note:</strong> On save, this appointment will be immediately visible to the applicant on their own "My Appointments" page.
              </div>
            </form>

            <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                form=""
                onClick={handleScheduleSubmit}
                className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 text-xs"
              >
                <PlusCircle size={15} /> Create Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
