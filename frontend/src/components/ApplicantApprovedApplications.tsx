"use client";

import React, { useState, useMemo } from "react";
import { Application, formatINR } from "../context/VisaContext";
import {
  CheckCircle2,
  Download,
  Printer,
  Share2,
  Clock,
  ShieldCheck,
  FileCheck,
  Search,
  Filter,
  Eye,
  FileText,
  User,
  Plane,
  CreditCard,
  Building,
  HelpCircle,
  ArrowRight,
  Info,
  RefreshCw,
  ExternalLink,
  Award,
  Calendar,
  Check,
  Mail
} from "lucide-react";

interface ApplicantApprovedApplicationsProps {
  applications: Application[];
  onSelectAppForTracking?: (appId: string) => void;
  onNavigateSupport?: () => void;
}

export default function ApplicantApprovedApplications({
  applications,
  onSelectAppForTracking,
  onNavigateSupport
}: ApplicantApprovedApplicationsProps) {
  // Extract approved applications from context or provide rich fallback records
  const approvedApps = useMemo(() => {
    const list = applications.filter((a) => a.status === "Approved");
    if (list.length > 0) return list;

    return [
      {
        id: "VO-2026-0987",
        travelerName: "Geeta Sharma",
        dob: "1995-06-12",
        passportNumber: "Z9817264",
        passportExpiry: "2033-12-20",
        nationality: "India",
        destination: "Australia",
        visaType: "Subclass 600 Tourist Visa",
        travelDates: "10 Aug 2026 to 10 Aug 2027",
        status: "Approved" as const,
        fees: 16500,
        submissionDate: "10 Jul 2026",
        verifiedDocs: { passport: "verified" as const, photo: "verified" as const, nocLetter: "verified" as const, sponsorLetter: "verified" as const },
        checklist: { employed: true, sponsored: false }
      },
      {
        id: "VO-2026-0742",
        travelerName: "Geeta Sharma",
        dob: "1995-06-12",
        passportNumber: "Z9817264",
        passportExpiry: "2033-12-20",
        nationality: "India",
        destination: "United Arab Emirates",
        visaType: "30-Day Express Tourist E-Visa",
        travelDates: "01 Nov 2026 to 30 Nov 2026",
        status: "Approved" as const,
        fees: 8500,
        submissionDate: "15 Jun 2026",
        verifiedDocs: { passport: "verified" as const, photo: "verified" as const },
        checklist: { employed: true, sponsored: false }
      }
    ];
  }, [applications]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [entryFilter, setEntryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // Selected Approved App ID for Inspector
  const [selectedAppId, setSelectedAppId] = useState<string>(approvedApps[0]?.id || "VO-2026-0987");

  // Active App Object
  const activeApp = useMemo(() => {
    return approvedApps.find((a) => a.id === selectedAppId) || approvedApps[0];
  }, [approvedApps, selectedAppId]);

  // Subtab inside Inspector
  const [inspectorTab, setInspectorTab] = useState<"summary" | "credentials" | "docshub" | "payment" | "decision" | "timeline" | "advisory" | "actions">("summary");

  // Helper for country flags
  const getCountryFlag = (country: string) => {
    const c = country.toLowerCase();
    if (c.includes("australia")) return "🇦🇺";
    if (c.includes("uae") || c.includes("united arab emirates") || c.includes("dubai")) return "🇦🇪";
    if (c.includes("canada")) return "🇨🇦";
    if (c.includes("uk") || c.includes("united kingdom")) return "🇬🇧";
    if (c.includes("singapore")) return "🇸🇬";
    if (c.includes("japan")) return "🇯🇵";
    return "🌐";
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = approvedApps.length;
    const activeValid = total;
    const readyDownload = total;
    const multiEntry = approvedApps.filter((a) => a.visaType.toLowerCase().includes("tourist") || a.visaType.toLowerCase().includes("subclass")).length;
    const expiringSoon = 0;
    const avgApprovalTime = "5.2 Days";

    return { total, activeValid, readyDownload, multiEntry, expiringSoon, avgApprovalTime };
  }, [approvedApps]);

  // Filtered List
  const filteredApps = useMemo(() => {
    return approvedApps
      .filter((a) => {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          a.id.toLowerCase().includes(q) ||
          a.destination.toLowerCase().includes(q) ||
          a.visaType.toLowerCase().includes(q) ||
          a.travelerName.toLowerCase().includes(q);

        const matchesCountry = countryFilter === "all" || a.destination.toLowerCase().includes(countryFilter.toLowerCase());

        return matchesQ && matchesCountry;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.id.localeCompare(a.id);
        return a.id.localeCompare(b.id);
      });
  }, [approvedApps, searchQuery, countryFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & E-VISA GRANT STATUS BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Applications</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Approved Visas</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Approved Visas & E-Visa Documents</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={12} className="text-emerald-600" /> Granted & Ready to Download
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            View and download your granted e-visas, official approval letters, travel insurance vouchers, and stamped visa certificates.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => alert("Packaging all active granted E-Visas into a ZIP file...")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Download size={16} />
            <span>Download All Visas (ZIP)</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: TOP METRIC CARDS GRID (6 CARDS FROM WIREFRAME) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Approved */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Approved</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{String(metrics.total).padStart(2, "0")}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 size={10} /> Consular granted
          </span>
        </div>

        {/* Card 2: Active Valid Visas */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Active Valid Visas</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(metrics.activeValid).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">Border clearance ready</span>
        </div>

        {/* Card 3: Ready for Download */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">E-Visas Ready</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{String(metrics.readyDownload).padStart(2, "0")}</p>
          <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
            <Download size={10} /> PDF Stamped Copy
          </span>
        </div>

        {/* Card 4: Multi-Entry Visas */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Multi-Entry Visas</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{String(metrics.multiEntry).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">Multiple visits permitted</span>
        </div>

        {/* Card 5: Expiring Soon */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Expiring Soon</p>
          <p className="text-2xl font-black text-slate-700 mt-1">{String(metrics.expiringSoon).padStart(2, "0")}</p>
          <span className="text-[10px] text-slate-400 font-medium">&gt; 90 days validity</span>
        </div>

        {/* Card 6: Avg Approval Time */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Avg Approval Time</p>
          <p className="text-base font-black text-emerald-600 mt-1.5">{metrics.avgApprovalTime}</p>
          <span className="text-[10px] text-slate-400 font-medium">Turnaround speed</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: APPROVED E-VISA HIGHLIGHT BANNER */}
      {/* ============================================================ */}
      {activeApp && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-xl border border-emerald-800/50 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getCountryFlag(activeApp.destination)}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-widest">
                    Official Consular Grant • {activeApp.id}
                  </span>
                  <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                    <CheckCircle2 size={10} /> GRANTED & ACTIVE
                  </span>
                </div>
                <h2 className="text-xl font-black text-white mt-0.5">
                  {activeApp.destination} E-Visa ({activeApp.travelerName})
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => alert(`Downloading official E-Visa PDF for ${activeApp.id}...`)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Download size={16} />
                <span>Download E-Visa PDF</span>
              </button>
            </div>
          </div>

          {/* Visa Grant Details Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-white/5 border border-white/10 p-4 rounded-xl">
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">E-Visa Grant Number</span>
              <span className="font-mono font-bold text-emerald-300 text-sm">
                AUS-{activeApp.id.replace("VO-", "")}-EVISA
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Validity Scope</span>
              <span className="font-bold text-white">1 Year (Multiple Entry)</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Permitted Stay / Visit</span>
              <span className="font-bold text-white">Up to 90 Days per Entry</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Issuing Embassy</span>
              <span className="font-bold text-white">{activeApp.destination} High Commission</span>
            </div>
          </div>
        </div>
      )}

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
              placeholder="Search Visa Grant No, App ID, Country..."
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
            {/* Country Filter */}
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Destinations</option>
              <option value="Australia">Australia</option>
              <option value="United Arab Emirates">UAE / Dubai</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="newest">Sort: Approval Date Newest</option>
              <option value="oldest">Sort: Approval Date Oldest</option>
            </select>

            {/* Export List */}
            <button
              onClick={() => alert("Exporting approved visas summary report as CSV...")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: APPROVED APPLICATIONS DATA TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Award size={16} className="text-emerald-600" />
            <span>Granted Visas Directory ({filteredApps.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">Click any row to inspect e-visa certificate & documents</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Country & Flag</th>
                <th className="py-3 px-4">Visa Category</th>
                <th className="py-3 px-4">Approval Date</th>
                <th className="py-3 px-4">Validity Period</th>
                <th className="py-3 px-4">Grant Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Info size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No approved visas found</p>
                  </td>
                </tr>
              ) : (
                filteredApps.map((a) => {
                  const isSelected = a.id === selectedAppId;
                  return (
                    <tr
                      key={a.id}
                      onClick={() => setSelectedAppId(a.id)}
                      className={`cursor-pointer transition hover:bg-emerald-50/40 ${
                        isSelected ? "bg-emerald-50/80 font-semibold" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-emerald-700 font-mono flex items-center gap-2">
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                        {a.id}
                      </td>

                      <td className="py-3.5 px-4 text-slate-900 font-semibold">
                        <span className="inline-flex items-center gap-2">
                          <span className="text-base">{getCountryFlag(a.destination)}</span>
                          {a.destination}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">{a.visaType}</td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {a.submissionDate}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {a.travelDates}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={12} className="text-emerald-600" /> Granted
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => alert(`Downloading E-Visa PDF for ${a.id}...`)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg transition text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Download size={12} /> E-Visa
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

      {/* ============================================================ */}
      {/* SECTION 6: SELECTED APPROVED APPLICATION DEEP-DIVE INSPECTOR */}
      {/* ============================================================ */}
      {activeApp && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCountryFlag(activeApp.destination)}</span>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Approved Visa Certificate: {activeApp.id}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {activeApp.destination} &bull; {activeApp.visaType} &bull; Passport Holder: {activeApp.travelerName}
                </p>
              </div>
            </div>

            {/* Subtabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {[
                { id: "summary", label: "Grant Certificate", icon: Award },
                { id: "credentials", label: "Passport Info", icon: User },
                { id: "docshub", label: "Travel Documents", icon: FileCheck },
                { id: "payment", label: "Payment Ledger", icon: CreditCard },
                { id: "decision", label: "Consular Decision", icon: ShieldCheck },
                { id: "timeline", label: "Full Lifecycle", icon: Clock },
                { id: "advisory", label: "Travel Advisory", icon: Plane },
                { id: "actions", label: "Download Hub", icon: Download }
              ].map((t) => {
                const IconComp = t.icon;
                const active = inspectorTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setInspectorTab(t.id as any)}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                      active
                        ? "bg-white text-emerald-700 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <IconComp size={14} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUBTAB 1: VISA APPROVAL SUMMARY & GRANT CERTIFICATE */}
          {inspectorTab === "summary" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-6 bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                  <Award size={15} className="text-emerald-600" />
                  <span>Consular Visa Grant Details</span>
                </h4>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">E-Visa Grant Number</span>
                    <span className="font-mono font-bold text-slate-900">AUS-{activeApp.id.replace("VO-", "")}-EVISA</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Destination</span>
                    <span className="font-bold text-slate-900">{activeApp.destination}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Visa Sub-category</span>
                    <span className="font-semibold text-slate-800">{activeApp.visaType}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Entry Type</span>
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Multiple Entry
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Calendar size={15} className="text-emerald-600" />
                  <span>Validity & Stay Allowances</span>
                </h4>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">Validity Period</span>
                    <span className="font-bold text-slate-900">{activeApp.travelDates}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Max Duration per Visit</span>
                    <span className="font-bold text-slate-900">90 Days Consecutive Stay</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Issuing Authority</span>
                    <span className="font-semibold text-slate-800">{activeApp.destination} High Commission</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Status</span>
                    <span className="font-bold text-emerald-700">GRANTED & VALID ✓</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: PASSPORT & TRAVELER CREDENTIALS */}
          {inspectorTab === "credentials" && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <User size={15} className="text-[#4848F7]" />
                <span>Passport Holder Credentials</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Passport Holder Name</span>
                  <span className="font-bold text-slate-900">{activeApp.travelerName}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">Passport Number</span>
                  <span className="font-bold text-slate-900 font-mono">{activeApp.passportNumber}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">Date of Birth</span>
                  <span className="font-semibold text-slate-800">{activeApp.dob || "12 Jun 1995"}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">Nationality</span>
                  <span className="font-semibold text-slate-800">{activeApp.nationality}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">Passport Expiry</span>
                  <span className="font-semibold text-slate-800">{activeApp.passportExpiry || "20 Dec 2033"}</span>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: APPROVED TRAVEL DOCUMENTS HUB */}
          {inspectorTab === "docshub" && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Official Consular Documents & E-Visa Files
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="text-emerald-600" size={24} />
                    <div>
                      <p className="font-bold text-slate-900">Stamped E-Visa Certificate</p>
                      <p className="text-[11px] text-emerald-700 font-semibold">High Resolution PDF ✓</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Downloading E-Visa PDF for ${activeApp.id}...`)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    <Download size={12} /> Download
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-[#4848F7]" size={24} />
                    <div>
                      <p className="font-bold text-slate-900">Embassy Approval Letter</p>
                      <p className="text-[11px] text-slate-500 font-medium">Official Consular Dispatch</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Downloading Approval Letter PDF for ${activeApp.id}...`)}
                    className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-3 py-1.5 rounded-lg border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 4: PAYMENT LEDGER */}
          {inspectorTab === "payment" && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 text-xs">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Payment Settlement Breakdown
              </h4>

              <div className="space-y-2 border-b border-slate-200 pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Consular Visa Fee ({activeApp.destination})</span>
                  <span className="font-bold text-slate-900">₹{formatINR((activeApp.fees || 16500) * 0.8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Documentation & Platform Charge</span>
                  <span className="font-bold text-slate-900">₹{formatINR((activeApp.fees || 16500) * 0.15)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">GST / Taxes (18%)</span>
                  <span className="font-bold text-slate-900">₹{formatINR((activeApp.fees || 16500) * 0.05)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-extrabold text-slate-900">
                <span>Total Amount Paid</span>
                <span className="text-emerald-700 text-base">₹{formatINR(activeApp.fees || 16500)}</span>
              </div>

              <button
                onClick={() => alert(`Downloading payment receipt for ${activeApp.id}...`)}
                className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-4 py-2 rounded-lg border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={14} />
                <span>Download Consular Tax Invoice PDF</span>
              </button>
            </div>
          )}

          {/* SUBTAB 5: CONSULAR DECISION AUDIT */}
          {inspectorTab === "decision" && (
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 space-y-3 text-xs text-emerald-950">
              <h4 className="font-extrabold uppercase tracking-wider text-emerald-800">Final Consular Decision & Endorsement</h4>
              <p className="leading-relaxed font-mono bg-white p-4 rounded-xl border border-emerald-200">
                "Application approved for {activeApp.visaType} to {activeApp.destination}. Validity granted for 1 year with multiple entry permissions. Passport holder verified by border control database."
              </p>
              <div className="flex justify-between text-[11px] font-semibold text-emerald-800">
                <span>Approved By: Consular Officer Sarah Jenkins</span>
                <span>Stamp Ref: STAMP-2026-{activeApp.id.replace("VO-", "")}</span>
              </div>
            </div>
          )}

          {/* SUBTAB 6: FULL LIFECYCLE TIMELINE */}
          {inspectorTab === "timeline" && (
            <div className="space-y-6">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Full Application Lifecycle & Approval History
              </h4>

              <div className="relative pl-6 space-y-6 border-l-2 border-emerald-500">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <span className="font-bold text-slate-900">Form & Documents Submitted</span>
                    <p className="text-slate-600">Application submitted online and verified.</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <span className="font-bold text-slate-900">Consular Verification Passed</span>
                    <p className="text-slate-600">Passport, photo & financial audit approved.</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-1 text-xs">
                    <span className="font-bold text-emerald-900">Visa Granted & E-Visa Issued ✓</span>
                    <p className="text-emerald-700 font-medium">Official E-Visa certificate stamped and released.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 7: TRAVEL ADVISORY */}
          {inspectorTab === "advisory" && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-slate-500">Border Entry Regulations & Travel Advisory</h4>
              <ul className="space-y-2 text-slate-700 list-disc pl-4 leading-relaxed">
                <li>Carry a printed color copy of your granted E-Visa certificate along with your original passport.</li>
                <li>Ensure your passport remains valid for at least 6 months beyond your travel arrival date.</li>
                <li>Hold proof of return flight tickets and hotel accommodation voucher at immigration border control.</li>
              </ul>
            </div>
          )}

          {/* SUBTAB 8: ACTION SHORTCUTS */}
          {inspectorTab === "actions" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <button
                onClick={() => alert(`Downloading E-Visa PDF for ${activeApp.id}...`)}
                className="p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left space-y-2 transition cursor-pointer"
              >
                <Download className="text-emerald-600" size={24} />
                <p className="font-bold text-slate-900">Download E-Visa PDF</p>
                <p className="text-slate-500 text-[11px]">Print official certificate</p>
              </button>

              <button
                onClick={() => alert(`Sending E-Visa copy to ${activeApp.travelerName}'s email...`)}
                className="p-4 bg-slate-50 hover:bg-[#EEF2FF] border border-slate-200 rounded-xl text-left space-y-2 transition cursor-pointer"
              >
                <Mail className="text-[#4848F7]" size={24} />
                <p className="font-bold text-slate-900">Email E-Visa Copy</p>
                <p className="text-slate-500 text-[11px]">Send to mobile email</p>
              </button>

              <button
                onClick={() => alert(`Downloading payment receipt for ${activeApp.id}...`)}
                className="p-4 bg-slate-50 hover:bg-[#EEF2FF] border border-slate-200 rounded-xl text-left space-y-2 transition cursor-pointer"
              >
                <CreditCard className="text-[#4848F7]" size={24} />
                <p className="font-bold text-slate-900">Consular Invoice PDF</p>
                <p className="text-slate-500 text-[11px]">Download GST tax receipt</p>
              </button>
            </div>
          )}

        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 7: APPROVED FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Approved Visas</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">How do I present my e-visa at airport border control?</p>
            <p className="text-slate-600 leading-relaxed">
              Show your printed E-Visa PDF certificate alongside your original passport to airline check-in staff and immigration officers.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Can I extend my stay beyond the granted duration?</p>
            <p className="text-slate-600 leading-relaxed">
              Visa extension guidelines depend on the destination country. You can contact support to apply for an in-country extension.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
