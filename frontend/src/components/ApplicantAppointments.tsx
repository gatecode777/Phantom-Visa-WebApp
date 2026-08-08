"use client";

import React, { useState, useMemo } from "react";
import { Application, formatINR } from "../context/VisaContext";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  QrCode,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  Layers,
  Building,
  User,
  HelpCircle,
  XCircle,
  ChevronRight,
  Navigation,
  Info,
  Check,
  Zap,
  ArrowRight,
  FileCheck
} from "lucide-react";

export type AppointmentStatus = "upcoming" | "completed" | "rescheduled" | "cancelled";
export type AppointmentCategory = "Biometrics Collection" | "Consular Interview" | "Document Drop-off" | "Medical Verification";

export interface AppointmentRecord {
  id: string;
  appId: string;
  country: string;
  category: AppointmentCategory;
  date: string;
  timeSlot: string;
  vacCenter: string;
  address: string;
  city: string;
  status: AppointmentStatus;
  travelerName: string;
  passportNumber: string;
  qrCodeRef: string;
  slipPdfName: string;
}

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
  // Mock Dataset matching wireframe
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([
    {
      id: "APT-2026-9910",
      appId: "VO-2026-1025",
      country: "Australia 🇦🇺",
      category: "Biometrics Collection",
      date: "15 Aug 2026",
      timeSlot: "11:00 AM - 11:30 AM",
      vacCenter: "VFS Global Visa Application Centre",
      address: "Shivaji Stadium Metro Station, Mezzanine Level, Connaught Place",
      city: "New Delhi",
      status: "upcoming",
      travelerName: "Geeta Sharma",
      passportNumber: "Z9817264",
      qrCodeRef: "VFS-AU-9817264-DEL",
      slipPdfName: "appointment_slip_APT-2026-9910.pdf"
    },
    {
      id: "APT-2026-8812",
      appId: "VO-2026-0982",
      country: "Schengen / France 🇫🇷",
      category: "Consular Interview",
      date: "26 Jul 2026",
      timeSlot: "09:30 AM - 10:00 AM",
      vacCenter: "VFS Global Visa Center",
      address: "45, Residency Road, Shanthala Nagar",
      city: "Bengaluru",
      status: "completed",
      travelerName: "Rohan Verma",
      passportNumber: "M4419283",
      qrCodeRef: "VFS-FR-4419283-BLR",
      slipPdfName: "appointment_slip_APT-2026-8812.pdf"
    },
    {
      id: "APT-2026-7734",
      appId: "VO-2026-0814",
      country: "United Kingdom 🇬🇧",
      category: "Document Drop-off",
      date: "20 Jul 2026",
      timeSlot: "02:00 PM - 02:30 PM",
      vacCenter: "VFS UK Application Hub",
      address: "12, Marine Drive, Churchgate",
      city: "Mumbai",
      status: "rescheduled",
      travelerName: "Amitabh Patel",
      passportNumber: "K9921048",
      qrCodeRef: "VFS-UK-9921048-BOM",
      slipPdfName: "appointment_slip_APT-2026-7734.pdf"
    },
    {
      id: "APT-2026-6620",
      appId: "VO-2026-0512",
      country: "Singapore 🇸🇬",
      category: "Medical Verification",
      date: "10 Jun 2026",
      timeSlot: "03:30 PM - 04:00 PM",
      vacCenter: "Consulate Authorized Medical Clinic",
      address: "Sector 18, Commercial Belt",
      city: "Noida",
      status: "completed",
      travelerName: "Karan Mehta",
      passportNumber: "P1102938",
      qrCodeRef: "VFS-SG-1102938-NOI",
      slipPdfName: "appointment_slip_APT-2026-6620.pdf"
    }
  ]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"earliest" | "status">("earliest");

  // Selected Appointment ID for Details Inspector
  const [selectedAptId, setSelectedAptId] = useState<string>("APT-2026-9910");

  // Reschedule Modal State
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("2026-08-20");
  const [rescheduleSlot, setRescheduleSlot] = useState("02:00 PM - 02:30 PM");

  const activeApt = useMemo(() => {
    return appointments.find((a) => a.id === selectedAptId) || appointments[0];
  }, [appointments, selectedAptId]);

  // Metrics
  const metrics = useMemo(() => {
    const total = appointments.length;
    const upcoming = appointments.filter((a) => a.status === "upcoming").length;
    const completed = appointments.filter((a) => a.status === "completed").length;
    const rescheduled = appointments.filter((a) => a.status === "rescheduled").length;
    const cancelled = appointments.filter((a) => a.status === "cancelled").length;

    return { total, upcoming, completed, rescheduled, cancelled };
  }, [appointments]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((a) => {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          a.id.toLowerCase().includes(q) ||
          a.appId.toLowerCase().includes(q) ||
          a.travelerName.toLowerCase().includes(q) ||
          a.country.toLowerCase().includes(q) ||
          a.vacCenter.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q);

        const matchesStatus = statusFilter === "all" || a.status === statusFilter;
        const matchesCategory = categoryFilter === "all" || a.category === categoryFilter;

        return matchesQ && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "status") return a.status.localeCompare(b.status);
        return a.date.localeCompare(b.date);
      });
  }, [appointments, searchQuery, statusFilter, categoryFilter, sortBy]);

  // Reschedule Action
  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === selectedAptId
          ? { ...item, date: rescheduleDate, timeSlot: rescheduleSlot, status: "rescheduled" }
          : item
      )
    );
    setShowRescheduleModal(false);
    alert(`Appointment ${selectedAptId} rescheduled to ${rescheduleDate} at ${rescheduleSlot}!`);
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & STATUS BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Appointments</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Schedule & Manage</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Biometrics & Consular Appointments</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck size={12} className="text-emerald-600" /> VFS / Embassy Slot Confirmed
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Schedule, reschedule, or cancel biometrics collection, embassy interviews, and document submission appointments.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowRescheduleModal(true)}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Calendar size={16} />
            <span>Book / Reschedule Slot</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: DASHBOARD STATISTICS CARDS GRID (6 CARDS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Appointments */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Slots</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(metrics.total).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">All VAC bookings</span>
        </div>

        {/* Card 2: Upcoming Appointments */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Upcoming</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{String(metrics.upcoming).padStart(2, "0")}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <Calendar size={10} /> Active slot ready
          </span>
        </div>

        {/* Card 3: Completed Appointments */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Completed</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{String(metrics.completed).padStart(2, "0")}</p>
          <span className="text-[10px] text-indigo-600 font-medium flex items-center gap-1">
            <CheckCircle2 size={10} /> Biometrics captured
          </span>
        </div>

        {/* Card 4: Rescheduled Appointments */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Rescheduled</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{String(metrics.rescheduled).padStart(2, "0")}</p>
          <span className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
            <RefreshCw size={10} /> Updated slot
          </span>
        </div>

        {/* Card 5: Cancelled Appointments */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-red-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Cancelled</p>
          <p className="text-2xl font-black text-red-600 mt-1">{String(metrics.cancelled).padStart(2, "0")}</p>
          <span className="text-[10px] text-red-600 font-medium">Slot released</span>
        </div>

        {/* Card 6: Appointment Readiness */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Doc Readiness</p>
          <p className="text-2xl font-black text-[#4848F7] mt-1">100%</p>
          <span className="text-[10px] text-[#4848F7] font-semibold flex items-center gap-1">
            <QrCode size={10} /> Slips & Passport Ready
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CONCEPTUAL WORKFLOW BANNER (CONNECTED 3-PARTY APPOINTMENT FLOW) */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Appointment Audit Workflow (Slot Lock ➔ VFS Confirmation ➔ Slip Issued ➔ Biometric Verification)
            </h3>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
            VFS Global Direct Integration
          </span>
        </div>

        {/* Workflow Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 1</span>
            <p className="text-white">Slot Selection & Lock</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 2</span>
            <p className="text-white">VFS / Embassy Confirmation</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 3</span>
            <p className="text-white">Appointment Confirmation Slip Issued</p>
          </div>

          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Stage 4</span>
            <p className="font-bold">Biometrics & Interview Complete ✓</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl text-xs space-y-1 text-slate-300">
          <p className="font-bold text-white">VAC Center Rules & Security Protocol:</p>
          <ul className="list-disc pl-4 space-y-1 leading-relaxed text-[11px]">
            <li>Arrive at least 15 minutes prior to your scheduled time slot with your printed appointment slip.</li>
            <li>Mobile phones, laptops, and large bags are strictly prohibited inside biometric collection halls.</li>
            <li>Original passport is mandatory for identity verification at the security desk.</li>
          </ul>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 4: SEARCH & MULTI-FILTER CONTROL BAR */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search Ref ID, App ID, VAC Center, City..."
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
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming 🗓️</option>
              <option value="completed">Completed ✓</option>
              <option value="rescheduled">Rescheduled 🔄</option>
              <option value="cancelled">Cancelled ❌</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Categories</option>
              <option value="Biometrics Collection">Biometrics Collection</option>
              <option value="Consular Interview">Consular Interview</option>
              <option value="Document Drop-off">Document Drop-off</option>
              <option value="Medical Verification">Medical Verification</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="earliest">Sort: Date Earliest</option>
              <option value="status">Sort: Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: APPOINTMENTS DIRECTORY TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={16} className="text-[#4848F7]" />
            <span>Scheduled Appointment Slots Directory ({filteredAppointments.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">Click any row to open appointment slip inspector</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Appointment Ref ID</th>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Country & Category</th>
                <th className="py-3 px-4">Date & Time Slot</th>
                <th className="py-3 px-4">VAC Location Center</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.map((apt) => {
                const isSelected = apt.id === selectedAptId;
                return (
                  <tr
                    key={apt.id}
                    onClick={() => setSelectedAptId(apt.id)}
                    className={`cursor-pointer transition hover:bg-indigo-50/40 ${
                      isSelected ? "bg-indigo-50/80 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4848F7]" />}
                      {apt.id}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">{apt.appId}</td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{apt.country}</p>
                      <p className="text-[10px] text-slate-500">{apt.category}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{apt.date}</p>
                      <p className="text-[10px] text-slate-500">{apt.timeSlot}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{apt.vacCenter}</p>
                      <p className="text-[10px] text-slate-500">{apt.city}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      {apt.status === "upcoming" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <Calendar size={12} /> Upcoming
                        </span>
                      )}

                      {apt.status === "completed" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                          <CheckCircle2 size={12} /> Completed
                        </span>
                      )}

                      {apt.status === "rescheduled" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <RefreshCw size={12} /> Rescheduled
                        </span>
                      )}

                      {apt.status === "cancelled" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                          <XCircle size={12} /> Cancelled
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedAptId(apt.id)}
                          className="bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#4848F7] text-slate-700 font-bold px-2 py-1 rounded-lg transition text-[11px]"
                        >
                          Inspect
                        </button>

                        <button
                          onClick={() => alert(`Downloading ${apt.slipPdfName}...`)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                          title="Download Appointment Slip PDF"
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
      {/* SECTION 6: SELECTED APPOINTMENT DETAILS INSPECTOR CARD */}
      {/* ============================================================ */}
      {activeApt && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <FileCheck size={26} className="text-[#4848F7]" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">Appointment Inspector: {activeApt.id}</h3>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    Slot Confirmed
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Application Ref: <span className="font-mono">{activeApt.appId}</span> &bull; Traveler: {activeApt.travelerName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRescheduleModal(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RefreshCw size={14} /> Reschedule Slot
              </button>

              <button
                onClick={() => alert(`Downloading official confirmation slip ${activeApt.slipPdfName}...`)}
                className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download size={14} /> Download Confirmation Slip PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Appointment Details & Location */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <MapPin size={15} className="text-[#4848F7]" /> VAC Center Location & Timing
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
                    <span className="font-bold text-emerald-700">{activeApt.date}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Time Slot:</span>
                    <span className="font-bold text-emerald-700">{activeApt.timeSlot}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Traveler & QR Verification Slip */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <QrCode size={15} className="text-[#4848F7]" /> Security & QR Entry Verification
                </h4>

                <div className="space-y-2 pt-1">
                  <div>
                    <span className="text-slate-500 block">Passport Number:</span>
                    <span className="font-mono font-bold text-slate-900">{activeApt.passportNumber}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Biometric Security Code:</span>
                    <span className="font-mono font-bold text-indigo-600">{activeApt.qrCodeRef}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-3 rounded-lg flex items-center gap-3 text-[11px] text-slate-600">
                <QrCode size={36} className="text-slate-800 shrink-0" />
                <p>Present this QR code on your mobile or printed slip at the VFS reception desk for express queue entry.</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 7: VAC LOCATION & DIRECTIONS CARD */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
        <h4 className="font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Navigation size={15} className="text-[#4848F7]" />
          <span>VFS Global VAC Center Location & Transit Directions</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">Delhi VAC Hub</span>
            <p className="text-slate-600">Shivaji Stadium Metro Station, Mezzanine Level, Baba Kharak Singh Marg, CP, New Delhi - 110001</p>
            <span className="text-[10px] text-indigo-600 font-semibold">Landmark: Opposite Hanuman Temple</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">Public Transit & Metro</span>
            <p className="text-slate-600">Airport Express Line - Shivaji Stadium Metro Station (Exit Gate No. 2 directly enters the center).</p>
            <span className="text-[10px] text-emerald-600 font-semibold">Parking: Paid parking available at station basement</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">Operating Working Hours</span>
            <p className="text-slate-600">Monday to Friday: 08:00 AM – 04:00 PM (Passport Collection: 01:00 PM – 04:00 PM)</p>
            <span className="text-[10px] text-slate-400">Closed on Saturdays, Sundays & Public Holidays</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 8: APPOINTMENT ENTRY CHECKLIST */}
      {/* ============================================================ */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg space-y-4 text-xs">
        <h4 className="font-extrabold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-3">
          <FileCheck size={18} className="text-[#4848F7]" />
          <span>Mandatory Appointment Entry Checklist</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-slate-200">
          <div className="flex items-start gap-2 bg-white/10 p-3 rounded-xl border border-white/10">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Original Passport</p>
              <p className="text-[10px] text-slate-300">Valid for at least 6 months with 2 blank pages.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-white/10 p-3 rounded-xl border border-white/10">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Appointment Slip</p>
              <p className="text-[10px] text-slate-300">Printed confirmation slip featuring QR code.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-white/10 p-3 rounded-xl border border-white/10">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Visa Fee Receipt</p>
              <p className="text-[10px] text-slate-300">Consular payment clearance proof receipt.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-white/10 p-3 rounded-xl border border-white/10">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Passport Photos</p>
              <p className="text-[10px] text-slate-300">2 recent photos (35mm x 45mm, white background).</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 9: APPOINTMENTS FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Biometrics & Appointments</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Can I reschedule my appointment slot?</p>
            <p className="text-slate-600 leading-relaxed">
              Yes, click "Book / Reschedule Slot" up to 24 hours prior to your slot time. You can reschedule up to 2 times without extra fees.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">What happens if I arrive late or miss my appointment?</p>
            <p className="text-slate-600 leading-relaxed">
              Missed appointments are marked as no-show by VFS reception. You will need to wait 24 hours before booking a fresh slot.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL: INTERACTIVE RESCHEDULE SLOT MODAL */}
      {/* ============================================================ */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Calendar size={18} className="text-[#4848F7]" />
                <span>Reschedule Appointment Slot ({selectedAptId})</span>
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
