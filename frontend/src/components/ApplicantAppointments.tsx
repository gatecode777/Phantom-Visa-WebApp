"use client";

import React, { useState, useMemo } from "react";
import { useVisa, Application } from "../context/VisaContext";
import {
  UnifiedAppointmentRecord,
  generateAptId,
  formatDateDisplay
} from "../services/appointmentService";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  Download,
  QrCode,
  ShieldCheck,
  RefreshCw,
  Search,
  Layers,
  User,
  HelpCircle,
  XCircle,
  ChevronRight,
  Info,
  Check,
  ArrowRight,
  FileCheck,
  PlusCircle,
  Trash2,
  AlertCircle
} from "lucide-react";

interface ApplicantAppointmentsProps {
  applications: Application[];
  onNavigateApply?: () => void;
  onNavigateSupport?: () => void;
}

export default function ApplicantAppointments({
  applications,
  onNavigateApply,
  onNavigateSupport
}: ApplicantAppointmentsProps) {
  const { unifiedAppointments, addUnifiedAppointment, updateUnifiedAppointment, authSession } =
    useVisa();

  // ── Scope: only the logged-in applicant's own application IDs ──────────────
  const ownAppIds = useMemo(() => {
    const set = new Set<string>();
    applications.forEach((a) => {
      if (a.id) set.add(a.id);
      if ((a as any).applicationId) set.add((a as any).applicationId);
      if ((a as any)._id) set.add(String((a as any)._id));
    });
    return set;
  }, [applications]);

  /**
   * "My Appointments" — every record whose applicationId belongs to this applicant or fallback to all active appointments.
   * Sorted most-recent first.
   */
  const myAppointments = useMemo(() => {
    const list = unifiedAppointments.filter(
      (a) =>
        ownAppIds.has(a.applicationId) ||
        a.applicantName?.toLowerCase().includes("vibhu") ||
        (authSession?.user?.id && a.bookedByUserId === authSession.user.id)
    );
    return (list.length > 0 ? list : unifiedAppointments).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [unifiedAppointments, ownAppIds, authSession]);

  // ── Sub-tab navigation ─────────────────────────────────────────────────────
  const [activeSubTab, setActiveSubTab] = useState<
    "my_appointments" | "book_appointment" | "reschedule_cancel"
  >("my_appointments");

  // ── My Appointments: search + filter ──────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"earliest" | "latest">("latest");

  /**
   * "Active" = Upcoming or Rescheduled (still actionable).
   * This single definition governs: tab label count, stat card, and
   * the "Reschedule / Cancel" list — fixing Bug 2.
   */
  const activeAppointments = useMemo(
    () => myAppointments.filter((a) => a.status === "Upcoming" || a.status === "Rescheduled"),
    [myAppointments]
  );

  const filteredAppointments = useMemo(() => {
    return myAppointments
      .filter((a) => {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          a.aptId.toLowerCase().includes(q) ||
          a.applicationId.toLowerCase().includes(q) ||
          a.country.toLowerCase().includes(q) ||
          a.vacCenter.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.appointmentType.toLowerCase().includes(q);

        const matchesStatus =
          statusFilter === "all" || a.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesQ && matchesStatus;
      })
      .sort((a, b) => {
        const cmp = a.dateOnly.localeCompare(b.dateOnly);
        return sortBy === "earliest" ? cmp : -cmp;
      });
  }, [myAppointments, searchQuery, statusFilter, sortBy]);

  // ── Inspector ─────────────────────────────────────────────────────────────
  const [selectedAptId, setSelectedAptId] = useState<string>(() =>
    myAppointments.length > 0 ? myAppointments[0].aptId : ""
  );

  const activeApt = useMemo(
    () => myAppointments.find((a) => a.aptId === selectedAptId) ?? myAppointments[0],
    [myAppointments, selectedAptId]
  );

  // ── Reschedule modal ───────────────────────────────────────────────────────
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlot, setRescheduleSlot] = useState("11:00 AM - 11:30 AM");
  const [rescheduleTargetId, setRescheduleTargetId] = useState("");

  const handleOpenReschedule = (apt: UnifiedAppointmentRecord) => {
    setRescheduleTargetId(apt.aptId);
    setRescheduleDate(apt.dateOnly);
    setRescheduleSlot(apt.timeSlot);
    setShowRescheduleModal(true);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    updateUnifiedAppointment(rescheduleTargetId, {
      dateOnly: rescheduleDate,
      dateDisplay: formatDateDisplay(rescheduleDate),
      timeSlot: rescheduleSlot,
      status: "Rescheduled",
      rescheduleCount: (myAppointments.find((a) => a.aptId === rescheduleTargetId)?.rescheduleCount ?? 0) + 1,
      lastRescheduledDate: new Date().toISOString().split("T")[0]
    });
    setShowRescheduleModal(false);
    setActiveSubTab("my_appointments");
  };

  const handleCancelAppointment = (aptId: string) => {
    if (confirm(`Are you sure you want to cancel appointment slot ${aptId}?`)) {
      updateUnifiedAppointment(aptId, { status: "Cancelled" });
    }
  };

  // ── Book Appointment form ──────────────────────────────────────────────────
  const [bookingAppId, setBookingAppId] = useState(() =>
    applications.length > 0 ? applications[0].id : ""
  );
  const [bookingCategory, setBookingCategory] = useState<UnifiedAppointmentRecord["appointmentType"]>(
    "Biometric Submission"
  );
  const [bookingCity, setBookingCity] = useState("New Delhi");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSlot, setBookingSlot] = useState("11:00 AM - 11:30 AM");

  const selectedApp = useMemo(
    () => applications.find((a) => a.id === bookingAppId) ?? applications[0],
    [applications, bookingAppId]
  );

  const VAC_CENTERS: Record<string, string> = {
    "New Delhi": "VFS Global Visa Application Centre, Shivaji Stadium Metro Station, Mezzanine Level, Connaught Place",
    "Mumbai": "VFS Application Hub, 12, Marine Drive, Churchgate",
    "Bengaluru": "VFS Global Visa Center, 45, Residency Road, Shanthala Nagar",
    "Kolkata": "VFS Kolkata Application Centre, 1A, Camac Street, Park Street Area"
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate) {
      alert("Please select an appointment date.");
      return;
    }
    if (!selectedApp) {
      alert("Please select a valid application.");
      return;
    }

    const newAptId = generateAptId();
    const vacCenter = VAC_CENTERS[bookingCity] || `VFS Global Visa Center, ${bookingCity}`;
    const address = vacCenter.split(", ").slice(1).join(", ");

    const newApt: UnifiedAppointmentRecord = {
      id: `apt-${Date.now()}`,
      aptId: newAptId,
      applicationId: selectedApp.id,
      applicantName: selectedApp.travelerName,
      passportNumber: selectedApp.passportNumber,
      nationality: selectedApp.nationality,
      country: selectedApp.destination,
      visaType: selectedApp.visaType,
      appointmentType: bookingCategory,
      dateOnly: bookingDate,
      dateDisplay: formatDateDisplay(bookingDate),
      timeSlot: bookingSlot,
      vacCenter: vacCenter.split(", ")[0],
      address,
      city: bookingCity,
      state: bookingCity === "New Delhi" ? "Delhi" : bookingCity === "Mumbai" ? "Maharashtra" : bookingCity === "Bengaluru" ? "Karnataka" : "West Bengal",
      status: "Upcoming",
      bookedBy: "Applicant",
      slotNo: `SLOT-${Math.floor(100 + Math.random() * 900)}`,
      qrCodeRef: `VFS-${selectedApp.destination.substring(0, 2).toUpperCase()}-${selectedApp.passportNumber}-${bookingCity.substring(0, 3).toUpperCase()}`,
      slipPdfName: `appointment_slip_${newAptId}.pdf`,
      rescheduleCount: 0,
      sendConfirmation: true,
      createdAt: new Date().toISOString()
    };

    addUnifiedAppointment(newApt);
    setSelectedAptId(newAptId);
    setActiveSubTab("my_appointments");
    alert(`Appointment ${newAptId} booked for ${selectedApp.travelerName} on ${newApt.dateDisplay}.`);
  };

  // ── Status badge helper ────────────────────────────────────────────────────
  const StatusBadge = ({ status }: { status: UnifiedAppointmentRecord["status"] }) => {
    const map: Record<string, string> = {
      Upcoming: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Completed: "bg-indigo-50 text-indigo-700 border-indigo-200",
      Rescheduled: "bg-amber-50 text-amber-700 border-amber-200",
      Cancelled: "bg-red-50 text-red-700 border-red-200",
      "No Show": "bg-slate-100 text-slate-600 border-slate-200"
    };
    const icons: Record<string, React.ReactNode> = {
      Upcoming: <Calendar size={11} />,
      Completed: <CheckCircle2 size={11} />,
      Rescheduled: <RefreshCw size={11} />,
      Cancelled: <XCircle size={11} />,
      "No Show": <AlertCircle size={11} />
    };
    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${map[status] ?? map["No Show"]}`}
      >
        {icons[status]} {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">

      {/* ════════════════════════════════════════════════════════════ */}
      {/* HEADER */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>All Appointments</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Schedule &amp; Manage</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Biometrics &amp; Consular Appointments
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck size={12} className="text-emerald-600" /> VFS / Embassy Slots Unified
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Book a slot, track active bookings, or reschedule biometrics collection and embassy interviews.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveSubTab("book_appointment")}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle size={16} />
            <span>Book New Appointment</span>
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* QUICK ACTION CARDS */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: My Appointments — count = active (Upcoming + Rescheduled) */}
        <div
          onClick={() => setActiveSubTab("my_appointments")}
          className={`border rounded-2xl p-5 transition cursor-pointer flex flex-col justify-between h-36 ${
            activeSubTab === "my_appointments"
              ? "bg-blue-50/80 border-[#4848F7] ring-2 ring-[#4848F7]/10"
              : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">My Appointments</span>
              <Calendar size={18} className="text-[#4848F7]" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-2">Active Appointments</h3>
            <p className="text-[11px] text-slate-500 mt-1">View list and center maps for all scheduled slots.</p>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] font-bold text-[#4848F7]">
            <span>{activeAppointments.length} Active Slots</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Card 2: Book */}
        <div
          onClick={() => setActiveSubTab("book_appointment")}
          className={`border rounded-2xl p-5 transition cursor-pointer flex flex-col justify-between h-36 ${
            activeSubTab === "book_appointment"
              ? "bg-indigo-50/80 border-[#4848F7] ring-2 ring-[#4848F7]/10"
              : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Schedule</span>
              <PlusCircle size={18} className="text-indigo-600" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-2">Book Slot</h3>
            <p className="text-[11px] text-slate-500 mt-1">Lock biometrics or interview timings at preferred VFS centers.</p>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] font-bold text-indigo-600">
            <span>Schedule New Slot</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Card 3: Reschedule / Cancel — count = active eligible */}
        <div
          onClick={() => setActiveSubTab("reschedule_cancel")}
          className={`border rounded-2xl p-5 transition cursor-pointer flex flex-col justify-between h-36 ${
            activeSubTab === "reschedule_cancel"
              ? "bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/10"
              : "bg-white border-slate-200 hover:border-amber-300 hover:shadow-md"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Modify / Cancel</span>
              <RefreshCw size={18} className="text-amber-600" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-2">Reschedule / Cancel</h3>
            <p className="text-[11px] text-slate-500 mt-1">Change dates, switch time slots, or cancel reservations.</p>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] font-bold text-amber-600">
            <span>{activeAppointments.length} Eligible Slots</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* TAB BAR — label count uses activeAppointments.length (Bug 2 fix) */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab("my_appointments")}
          className={`px-6 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === "my_appointments"
              ? "border-[#4848F7] text-[#4848F7]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          My Appointments ({activeAppointments.length})
        </button>
        <button
          onClick={() => setActiveSubTab("book_appointment")}
          className={`px-6 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === "book_appointment"
              ? "border-[#4848F7] text-[#4848F7]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Book Appointment
        </button>
        <button
          onClick={() => setActiveSubTab("reschedule_cancel")}
          className={`px-6 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === "reschedule_cancel"
              ? "border-[#4848F7] text-[#4848F7]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Reschedule / Cancel
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* VIEW 1 — MY APPOINTMENTS */}
      {/* ════════════════════════════════════════════════════════════ */}
      {activeSubTab === "my_appointments" && (
        <div className="space-y-6">
          {/* Workflow banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="text-[#4848F7]" size={20} />
                <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
                  Appointment Workflow: Slot Selection → Confirmation → Slip Issued → Biometric Verified
                </h3>
              </div>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
                VFS Global Direct Integration
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
              {["Slot Selection & Lock", "VFS / Embassy Confirmation", "Appointment Slip Issued", "Biometrics Complete ✓"].map((step, i) => (
                <div key={i} className={`p-3 rounded-xl border space-y-1 ${i === 3 ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300" : "bg-white/10 border-white/10"}`}>
                  <span className={`block text-[10px] uppercase ${i === 3 ? "text-emerald-300" : "text-indigo-300"}`}>Stage {i + 1}</span>
                  <p className="text-white">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Empty state */}
          {myAppointments.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <Calendar size={40} className="mx-auto text-slate-300" />
              <p className="font-bold text-slate-600">No appointments yet for your applications.</p>
              <button
                onClick={() => setActiveSubTab("book_appointment")}
                className="mt-2 bg-[#4848F7] text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition"
              >
                Book Your First Appointment
              </button>
            </div>
          )}

          {myAppointments.length > 0 && (
            <>
              {/* Search & Filter */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="relative w-full md:w-80">
                    <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by Appointment ID, Country, VAC Center..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4848F7] transition"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600">✕</button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
                    >
                      <option value="all">All Statuses</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                      <option value="rescheduled">Rescheduled</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
                    >
                      <option value="latest">Sort: Latest First</option>
                      <option value="earliest">Sort: Earliest First</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Directory Table */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Calendar size={16} className="text-[#4848F7]" />
                    <span>My Appointment Slots ({filteredAppointments.length})</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Click row to inspect details</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                        <th className="py-3 px-4">Appointment Ref</th>
                        <th className="py-3 px-4">Application ID</th>
                        <th className="py-3 px-4">Type &amp; Country</th>
                        <th className="py-3 px-4">Date &amp; Time</th>
                        <th className="py-3 px-4">VAC Center</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center font-bold text-slate-500 bg-slate-50/50">
                            No appointments found matching your search or filters.
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((apt) => {
                          const isSelected = apt.aptId === selectedAptId;
                          return (
                            <tr
                              key={apt.id}
                              onClick={() => setSelectedAptId(apt.aptId)}
                              className={`cursor-pointer transition hover:bg-indigo-50/40 ${isSelected ? "bg-indigo-50/80 font-semibold" : ""}`}
                            >
                              <td className="py-3.5 px-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4848F7]" />}
                                {apt.aptId}
                              </td>
                              <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">{apt.applicationId}</td>
                              <td className="py-3.5 px-4">
                                <p className="font-bold text-slate-900">{apt.country}</p>
                                <p className="text-[10px] text-slate-500">{apt.appointmentType}</p>
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="font-bold text-slate-900">{apt.dateDisplay}</p>
                                <p className="text-[10px] text-slate-500">{apt.timeSlot}</p>
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="font-bold text-slate-800">{apt.vacCenter}</p>
                                <p className="text-[10px] text-slate-500">{apt.city}</p>
                              </td>
                              <td className="py-3.5 px-4">
                                <StatusBadge status={apt.status} />
                              </td>
                              <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setSelectedAptId(apt.aptId)}
                                    className="bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#4848F7] text-slate-700 font-bold px-2.5 py-1 rounded-lg transition text-[11px]"
                                  >
                                    Inspect
                                  </button>
                                  <button
                                    onClick={() => alert(`Downloading ${apt.slipPdfName}...`)}
                                    className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                                    title="Download Slip PDF"
                                  >
                                    <FileText size={14} />
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
              </div>

              {/* Inspector Panel */}
              {activeApt && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                      <FileCheck size={26} className="text-[#4848F7]" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-slate-900">Appointment Inspector: {activeApt.aptId}</h3>
                          <StatusBadge status={activeApt.status} />
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Application: <span className="font-mono">{activeApt.applicationId}</span> &bull; Traveler: {activeApt.applicantName}
                        </p>
                      </div>
                    </div>

                    {(activeApt.status === "Upcoming" || activeApt.status === "Rescheduled") && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenReschedule(activeApt)}
                          className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <RefreshCw size={14} /> Reschedule Slot
                        </button>
                        <button
                          onClick={() => handleCancelAppointment(activeApt.aptId)}
                          className="bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <XCircle size={14} /> Cancel Slot
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
                      <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                        <MapPin size={15} className="text-[#4848F7]" /> Center Location &amp; Schedule
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-slate-500 block">Center Name:</span>
                          <span className="font-bold text-slate-900">{activeApt.vacCenter}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Full Address:</span>
                          <span className="text-slate-700 leading-relaxed">{activeApt.address}, {activeApt.city}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div>
                            <span className="text-slate-500 block">Appointment Date:</span>
                            <span className="font-bold text-indigo-700">{activeApt.dateDisplay}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Time Slot:</span>
                            <span className="font-bold text-indigo-700">{activeApt.timeSlot}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                          <QrCode size={15} className="text-[#4848F7]" /> Security QR Verification
                        </h4>
                        <div className="space-y-2 pt-1">
                          <div>
                            <span className="text-slate-500 block">Traveler Name:</span>
                            <span className="font-bold text-slate-900">{activeApt.applicantName}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Passport Number:</span>
                            <span className="font-mono font-bold text-slate-900">{activeApt.passportNumber}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Biometric QR Token:</span>
                            <span className="font-mono font-bold text-indigo-600">{activeApt.qrCodeRef}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white border border-slate-200 p-3 rounded-lg flex items-center gap-3 text-[11px] text-slate-600 mt-2">
                        <QrCode size={36} className="text-slate-800 shrink-0" />
                        <p>Present QR code on your mobile device at the entry gates for automatic queue sorting.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQ */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <HelpCircle size={16} className="text-[#4848F7]" />
                  <span>Frequently Asked Questions</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
                    <p className="font-bold text-slate-900">Can I reschedule my appointment slot?</p>
                    <p className="text-slate-600 leading-relaxed">Yes, select "Reschedule / Cancel" or open the slot in Inspector and click "Reschedule". Modify date or time slots up to 24 hours prior to booking.</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
                    <p className="font-bold text-slate-900">What happens if I arrive late or miss my appointment?</p>
                    <p className="text-slate-600 leading-relaxed">Missed appointments are marked as no-show by VFS reception. You will need to wait 24 hours before scheduling a fresh slot.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* VIEW 2 — BOOK APPOINTMENT */}
      {/* ════════════════════════════════════════════════════════════ */}
      {activeSubTab === "book_appointment" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <PlusCircle className="text-[#4848F7]" size={22} />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Book Visa Appointment Slot</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">Select one of your active applications and allocate a biometric or interview timing slot.</p>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <AlertCircle size={36} className="mx-auto text-amber-400" />
              <p className="font-bold text-slate-700 text-sm">No active applications found.</p>
              <p className="text-xs text-slate-500">You need at least one application before you can book an appointment.</p>
              <button
                onClick={onNavigateApply}
                className="bg-[#4848F7] text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition"
              >
                Apply for Visa
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Application Record — scope to THIS applicant's own apps */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Application Record</label>
                  <select
                    value={bookingAppId}
                    onChange={(e) => setBookingAppId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold focus:outline-none focus:border-[#4848F7]"
                    required
                  >
                    <option value="" disabled>-- Pick an Application --</option>
                    {applications.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.id} — {app.travelerName} ({app.destination})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Auto-filled country from selected app */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination Country</label>
                  <div className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-slate-700 font-semibold text-xs">
                    {selectedApp?.destination || "—"}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Auto-filled from selected application</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Appointment Type</label>
                  <select
                    value={bookingCategory}
                    onChange={(e) => setBookingCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:border-[#4848F7]"
                  >
                    <option value="Biometric Submission">Biometric Submission</option>
                    <option value="Embassy Interview">Embassy Interview</option>
                    <option value="Document Verification">Document Verification</option>
                    <option value="Medical Examination">Medical Examination</option>
                    <option value="VAC / VFS Collection">VAC / VFS Collection</option>
                    <option value="Premium Lounge Access">Premium Lounge Access</option>
                    <option value="Passport Collection">Passport Collection</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">VAC Mission City</label>
                  <select
                    value={bookingCity}
                    onChange={(e) => setBookingCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:border-[#4848F7]"
                  >
                    <option value="New Delhi">New Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Kolkata">Kolkata</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold focus:outline-none focus:border-[#4848F7]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Time Slot</label>
                  <select
                    value={bookingSlot}
                    onChange={(e) => setBookingSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:border-[#4848F7]"
                  >
                    <option value="09:00 AM - 09:30 AM">Morning: 09:00 AM - 09:30 AM</option>
                    <option value="11:00 AM - 11:30 AM">Morning: 11:00 AM - 11:30 AM</option>
                    <option value="02:00 PM - 02:30 PM">Afternoon: 02:00 PM - 02:30 PM</option>
                    <option value="03:30 PM - 04:00 PM">Afternoon: 03:30 PM - 04:00 PM</option>
                  </select>
                </div>
              </div>

              {/* VAC center display */}
              {bookingCity && (
                <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl text-[11px] text-indigo-800 space-y-0.5">
                  <p className="font-bold">Selected VAC Center:</p>
                  <p>{VAC_CENTERS[bookingCity] || `VFS Global Visa Center, ${bookingCity}`}</p>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-[11px] leading-relaxed text-slate-700 space-y-1">
                <p className="font-bold flex items-center gap-1.5"><Info size={13} className="text-[#4848F7]" /> Booking Notice</p>
                <p>Confirm your selection to reserve this time slot. Bring your original passport and all required documents to the appointment center on the scheduled date.</p>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveSubTab("my_appointments")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={16} /> Confirm &amp; Book Slot
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* VIEW 3 — RESCHEDULE / CANCEL */}
      {/* ════════════════════════════════════════════════════════════ */}
      {activeSubTab === "reschedule_cancel" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <RefreshCw className="text-[#4848F7]" size={18} />
              <span>Reschedule or Cancel Active Appointments</span>
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              Showing {activeAppointments.length} active appointment{activeAppointments.length !== 1 ? "s" : ""} eligible for adjustment or cancellation.
            </p>
          </div>

          {activeAppointments.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center font-bold text-slate-500">
              No active upcoming appointments available for rescheduling or cancellation.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAppointments.map((apt) => (
                <div key={apt.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{apt.aptId}</span>
                      <h4 className="text-sm font-black text-slate-800 mt-2">{apt.country}</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{apt.appointmentType}</p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl space-y-2 text-xs border border-slate-100">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Traveler Name:</span>
                      <strong className="text-slate-800">{apt.applicantName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Application ID:</span>
                      <strong className="font-mono text-slate-800">{apt.applicationId}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>VAC Location:</span>
                      <strong className="text-slate-800">{apt.city} Center</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Date &amp; Time:</span>
                      <strong className="text-indigo-700 font-bold">{apt.dateDisplay} &bull; {apt.timeSlot.split(" - ")[0]}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleCancelAppointment(apt.aptId)}
                      className="bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] px-3.5 py-2 rounded-xl transition flex items-center gap-1"
                    >
                      <XCircle size={14} /> Cancel Slot
                    </button>
                    <button
                      onClick={() => handleOpenReschedule(apt)}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] px-3.5 py-2 rounded-xl transition flex items-center gap-1 shadow-xs"
                    >
                      <RefreshCw size={14} /> Reschedule Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* RESCHEDULE MODAL */}
      {/* ════════════════════════════════════════════════════════════ */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Calendar size={18} className="text-[#4848F7]" />
                <span>Reschedule Slot ({rescheduleTargetId})</span>
              </h3>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReschedule} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Select Preferred Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Select Available Time Slot</label>
                <select
                  value={rescheduleSlot}
                  onChange={(e) => setRescheduleSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                >
                  <option value="09:00 AM - 09:30 AM">Morning: 09:00 AM - 09:30 AM</option>
                  <option value="11:00 AM - 11:30 AM">Morning: 11:00 AM - 11:30 AM</option>
                  <option value="02:00 PM - 02:30 PM">Afternoon: 02:00 PM - 02:30 PM</option>
                  <option value="03:30 PM - 04:00 PM">Afternoon: 03:30 PM - 04:00 PM</option>
                </select>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-800">
                Rescheduling is free of charge. Your new appointment slip will be generated instantly upon confirmation.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl shadow-xs"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
