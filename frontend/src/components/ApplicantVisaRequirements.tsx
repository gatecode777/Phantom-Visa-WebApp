"use client";

import React, { useState, useMemo } from "react";
import { Application, formatINR } from "../context/VisaContext";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  Search,
  Filter,
  Layers,
  Building,
  User,
  HelpCircle,
  ArrowRight,
  Plane,
  FileCheck,
  Info,
  DollarSign,
  Camera,
  Briefcase,
  FileSpreadsheet,
  QrCode,
  Sparkles,
  Award
} from "lucide-react";

export interface CountryRequirementRecord {
  id: string;
  country: string;
  flag: string;
  subclass: string;
  mandatoryDocsCount: number;
  minBankBalance: string;
  itrRequired: string;
  biometricsMandate: boolean;
  photoSpecs: string;
  checklistItems: { title: string; category: string; mandatory: boolean; tip: string }[];
}

interface ApplicantVisaRequirementsProps {
  onNavigateApply?: (countryName?: string) => void;
  onNavigateUpload?: () => void;
  onNavigateSupport?: () => void;
}

export default function ApplicantVisaRequirements({
  onNavigateApply,
  onNavigateUpload,
  onNavigateSupport
}: ApplicantVisaRequirementsProps) {
  // Mock Dataset matching wireframe
  const [requirementsData] = useState<CountryRequirementRecord[]>([
    {
      id: "REQ-AU",
      country: "Australia",
      flag: "🇦🇺",
      subclass: "Tourist Subclass 600",
      mandatoryDocsCount: 7,
      minBankBalance: "₹1.5 Lakhs",
      itrRequired: "3 Years ITR-V",
      biometricsMandate: true,
      photoSpecs: "35mm x 45mm, White background, 80% face coverage, Matte finish",
      checklistItems: [
        { title: "Original Passport (Color Scans)", category: "Identity", mandatory: true, tip: "Must have at least 6 months validity from travel date" },
        { title: "Bank Balance Certificate & 6 Mo Statements", category: "Financial", mandatory: true, tip: "Must carry official bank stamp & signature" },
        { title: "Income Tax Returns (ITR-V) 3 Years", category: "Financial", mandatory: true, tip: "Form 16 or ITR verification acknowledgement" },
        { title: "Employment NOC / Leave Sanction Letter", category: "Employment", mandatory: true, tip: "On official company letterhead with HR contact" },
        { title: "Cover Letter with Day-wise Itinerary", category: "Itinerary", mandatory: true, tip: "Highlight travel dates, places to visit & stay" },
        { title: "Confirmed Flight Reservations & Hotel Bookings", category: "Itinerary", mandatory: true, tip: "Must match cover letter itinerary exactly" },
        { title: "2 Passport Size Photographs", category: "Identity", mandatory: true, tip: "35mm x 45mm, matte finish, 80% face close-up" }
      ]
    },
    {
      id: "REQ-FR",
      country: "France (Schengen)",
      flag: "🇫🇷",
      subclass: "Short-Stay Type C Schengen",
      mandatoryDocsCount: 8,
      minBankBalance: "₹2.0 Lakhs",
      itrRequired: "3 Years ITR-V",
      biometricsMandate: true,
      photoSpecs: "35mm x 45mm, Off-white background, Neutral expression, No glasses",
      checklistItems: [
        { title: "Schengen Visa Application Form", category: "Identity", mandatory: true, tip: "Duly signed on VFS Portal" },
        { title: "Passport (Current & Previous Passports)", category: "Identity", mandatory: true, tip: "Must have at least 2 blank visa pages" },
        { title: "Schengen Travel Medical Insurance (€30,000)", category: "Medical", mandatory: true, tip: "Covers all 27 Schengen states for full stay" },
        { title: "Personal Bank Statements 6 Months", category: "Financial", mandatory: true, tip: "Original bank stamp required" },
        { title: "ITR Returns 3 Years / Form 16", category: "Financial", mandatory: true, tip: "Clear copy with tax filing proof" },
        { title: "Leave Sanction / Salary Slips 3 Months", category: "Employment", mandatory: true, tip: "Employer NOC required" },
        { title: "Roundtrip Flight Itinerary & Hotel Proof", category: "Itinerary", mandatory: true, tip: "Confirmed voucher vouchers" }
      ]
    },
    {
      id: "REQ-UK",
      country: "United Kingdom",
      flag: "🇬🇧",
      subclass: "Standard Visitor 6 Months",
      mandatoryDocsCount: 7,
      minBankBalance: "₹2.5 Lakhs",
      itrRequired: "2 Years ITR-V",
      biometricsMandate: true,
      photoSpecs: "45mm x 35mm, Cream/light grey background, Taken within last 1 month",
      checklistItems: [
        { title: "UK Home Office Online Form Summary", category: "Identity", mandatory: true, tip: "Printed GWF application confirmation" },
        { title: "Valid Passport & Old Expired Passports", category: "Identity", mandatory: true, tip: "Original physical passport needed for stamping" },
        { title: "Financial Proof of Savings & Assets", category: "Financial", mandatory: true, tip: "Bank statements, FD receipts, property papers" },
        { title: "Proof of Employment / Business Incorporation", category: "Employment", mandatory: true, tip: "Company GSTIN / Salary certificate" },
        { title: "Detailed Travel Plan & Accommodation Details", category: "Itinerary", mandatory: true, tip: "Include host invitation if staying with family" }
      ]
    },
    {
      id: "REQ-US",
      country: "United States",
      flag: "🇺🇸",
      subclass: "B1/B2 Visitor Visa",
      mandatoryDocsCount: 5,
      minBankBalance: "₹3.0 Lakhs",
      itrRequired: "3 Years ITR-V",
      biometricsMandate: true,
      photoSpecs: "2 x 2 inches (51mm x 51mm), Square format, Plain white background",
      checklistItems: [
        { title: "DS-160 Confirmation Page with Barcode", category: "Identity", mandatory: true, tip: "Printed high-resolution barcode page" },
        { title: "US Visa Appointment Confirmation Letter", category: "Identity", mandatory: true, tip: "OFV & Consular interview appointment slip" },
        { title: "Original Passport (Valid 6+ months)", category: "Identity", mandatory: true, tip: "Must bring physical passport to interview" },
        { title: "Financial Ties & Liquid Assets Proof", category: "Financial", mandatory: true, tip: "Bank statements, property deeds, investments" }
      ]
    }
  ]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [travelerType, setTravelerType] = useState("employed");
  const [selectedReqId, setSelectedReqId] = useState<string>("REQ-AU");

  const activeReq = useMemo(() => {
    return requirementsData.find((r) => r.id === selectedReqId) || requirementsData[0];
  }, [requirementsData, selectedReqId]);

  // Filtered List
  const filteredRequirements = useMemo(() => {
    return requirementsData.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesQ =
        r.country.toLowerCase().includes(q) ||
        r.subclass.toLowerCase().includes(q) ||
        r.minBankBalance.toLowerCase().includes(q);

      const matchesCountry = countryFilter === "all" || r.country === countryFilter;
      return matchesQ && matchesCountry;
    });
  }, [requirementsData, searchQuery, countryFilter]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & CONSULAR CHECKLIST HUB BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Explore Visas</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Visa Requirements</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Consular Requirements & Document Checklist Hub</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck size={12} className="text-emerald-600" /> 100% Embassy Compliant
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Check country-specific document checklists, financial balance requirements, photo specifications, and consular verification rules.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (onNavigateApply) onNavigateApply(activeReq.country);
            }}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Plane size={16} />
            <span>Apply for {activeReq.country} Visa</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: DASHBOARD STATISTICS CARDS GRID (6 CARDS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Document Categories */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Doc Categories</p>
          <p className="text-2xl font-black text-[#4848F7] mt-1">06</p>
          <span className="text-[10px] text-[#4848F7] font-semibold">Standard checklists</span>
        </div>

        {/* Card 2: Passport Validity */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Passport Rule</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">6 Months</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 size={10} /> Min 2 blank pages
          </span>
        </div>

        {/* Card 3: Min Financial Proof */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Min Bank Balance</p>
          <p className="text-xl font-bold text-slate-900 mt-1">₹1.5L - ₹3.5L</p>
          <span className="text-[10px] text-slate-400 font-medium">Bank stamped 6 mo</span>
        </div>

        {/* Card 4: Photo Specs */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Photo Specs</p>
          <p className="text-xl font-bold text-slate-900 mt-1">35x45 mm</p>
          <span className="text-[10px] text-slate-400 font-medium">White background 80%</span>
        </div>

        {/* Card 5: ITR Requirement */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">ITR Requirement</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">3 Years</p>
          <span className="text-[10px] text-indigo-600 font-medium">Tax filing proof</span>
        </div>

        {/* Card 6: Readiness Score */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-600">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Checklist Accuracy</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">100%</p>
          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <Award size={10} /> Verified by OCR
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CONCEPTUAL WORKFLOW BANNER (CONNECTED REQUIREMENTS AUDIT FLOW) */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Document Verification Audit (Select Destination ➔ Checklist Audit ➔ AI Pre-Check ➔ Submission Ready)
            </h3>
          </div>
          <span className="text-[11px] bg-white/10 text-slate-300 font-mono px-3 py-1 rounded-full">
            AI OCR Enabled
          </span>
        </div>

        {/* Workflow Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 1</span>
            <p className="text-white">Select Destination & Traveler Profile</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 2</span>
            <p className="text-white">Audit Document Checklist & Rules</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 3</span>
            <p className="text-white">AI OCR Pre-Check & Bank Stamp Scan</p>
          </div>

          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Stage 4</span>
            <p className="font-bold">Ready for Consular Submission ✓</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl text-xs space-y-1 text-slate-300">
          <p className="font-bold text-white">Consular Document Formatting Guidelines:</p>
          <ul className="list-disc pl-4 space-y-1 leading-relaxed text-[11px]">
            <li>Bank statements must carry an original branch seal stamp and authorized signature.</li>
            <li>All non-English documents must be accompanied by a certified official translation.</li>
            <li>Photos must be taken within the last 6 months with clear facial contrast and no shadows.</li>
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
              placeholder="Search Destination, Subclass, Document Name..."
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

          {/* Traveler Type Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTravelerType("employed")}
              className={`px-3 py-1.5 rounded-lg transition ${travelerType === "employed" ? "bg-white text-[#4848F7] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
            >
              Employed
            </button>

            <button
              onClick={() => setTravelerType("business")}
              className={`px-3 py-1.5 rounded-lg transition ${travelerType === "business" ? "bg-white text-[#4848F7] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
            >
              Self-Employed / Business
            </button>

            <button
              onClick={() => setTravelerType("student")}
              className={`px-3 py-1.5 rounded-lg transition ${travelerType === "student" ? "bg-white text-[#4848F7] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
            >
              Student / Minor
            </button>
          </div>

          {/* Country Filter */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Destinations</option>
              <option value="Australia">Australia 🇦🇺</option>
              <option value="France (Schengen)">France 🇫🇷</option>
              <option value="United Kingdom">United Kingdom 🇬🇧</option>
              <option value="United States">United States 🇺🇸</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: MANDATORY DOCUMENT CATEGORIES SHOWCASE CARDS (6 CATEGORIES) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Category 1: Identity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-[#4848F7] rounded-xl">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">1. Identity & Passport Proof</h3>
              <p className="text-[10px] text-slate-400 font-medium">Mandatory primary documents</p>
            </div>
          </div>
          <ul className="text-xs space-y-1.5 text-slate-700 list-disc pl-4 leading-relaxed">
            <li>Original Passport (valid for 6 months + 2 blank pages)</li>
            <li>Color scans of current & expired passports</li>
            <li>2 Passport photographs (35x45mm white background)</li>
            <li>Government-issued National ID Card / Aadhaar</li>
          </ul>
        </div>

        {/* Category 2: Financial */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">2. Financial Solvency Proof</h3>
              <p className="text-[10px] text-slate-400 font-medium">Consular liquidity proof</p>
            </div>
          </div>
          <ul className="text-xs space-y-1.5 text-slate-700 list-disc pl-4 leading-relaxed">
            <li>Bank Statements 6 months (stamped & signed by branch)</li>
            <li>Income Tax Returns (ITR-V) for last 3 financial years</li>
            <li>Salary Slips for the last 3 to 6 months</li>
            <li>Fixed Deposit certificates & investment portfolios</li>
          </ul>
        </div>

        {/* Category 3: Itinerary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Plane size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">3. Travel Itinerary & Stay</h3>
              <p className="text-[10px] text-slate-400 font-medium">Flight & stay bookings</p>
            </div>
          </div>
          <ul className="text-xs space-y-1.5 text-slate-700 list-disc pl-4 leading-relaxed">
            <li>Round-trip confirmed air flight reservations</li>
            <li>Confirmed hotel accommodation booking vouchers</li>
            <li>Detailed day-wise travel plan & itinerary statement</li>
            <li>Applicant Cover Letter addressed to the Consulate</li>
          </ul>
        </div>

        {/* Category 4: Employment */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Briefcase size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">4. Employment & Business Proof</h3>
              <p className="text-[10px] text-slate-400 font-medium">Occupation verification</p>
            </div>
          </div>
          <ul className="text-xs space-y-1.5 text-slate-700 list-disc pl-4 leading-relaxed">
            <li>Employer Leave Sanction / NOC on company letterhead</li>
            <li>Company ID Card copy & Salary Slips</li>
            <li>GST Registration & Incorporation Cert (for business owners)</li>
            <li>Student Bonafide Certificate & Leave Sanction (for students)</li>
          </ul>
        </div>

        {/* Category 5: Sponsorship */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#EEF2FF] text-[#4848F7] rounded-xl">
              <Building size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">5. Sponsorship & Host Proof</h3>
              <p className="text-[10px] text-slate-400 font-medium">Invitation requirements</p>
            </div>
          </div>
          <ul className="text-xs space-y-1.5 text-slate-700 list-disc pl-4 leading-relaxed">
            <li>Invitation Letter from host/relative in destination country</li>
            <li>Host's Passport copy & Permanent Residence permit</li>
            <li>Host's utility bills or lease agreement proof</li>
            <li>Affidavit of Support & Host Financial Bank Statements</li>
          </ul>
        </div>

        {/* Category 6: Medical */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">6. Medical & Biometrics</h3>
              <p className="text-[10px] text-slate-400 font-medium">Insurance & health checks</p>
            </div>
          </div>
          <ul className="text-xs space-y-1.5 text-slate-700 list-disc pl-4 leading-relaxed">
            <li>Travel Medical Insurance (€30,000 / $50,000 coverage)</li>
            <li>VFS Biometrics Appointment Confirmation Slip</li>
            <li>Yellow Fever Vaccination Certificate (if applicable)</li>
            <li>Consular Health Assessment Questionnaire</li>
          </ul>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 6: COUNTRY-WISE REQUIREMENTS DIRECTORY TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet size={16} className="text-[#4848F7]" />
            <span>Country Requirements Comparison & Rules ({filteredRequirements.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Destination Country</th>
                <th className="py-3 px-4">Visa Subclass</th>
                <th className="py-3 px-4">Mandatory Docs</th>
                <th className="py-3 px-4">Min Bank Balance</th>
                <th className="py-3 px-4">ITR Required</th>
                <th className="py-3 px-4">Biometrics Mandate</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRequirements.map((r) => {
                const isSelected = r.id === selectedReqId;
                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedReqId(r.id)}
                    className={`cursor-pointer transition hover:bg-indigo-50/40 ${
                      isSelected ? "bg-indigo-50/80 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4848F7]" />}
                      <span className="text-lg">{r.flag}</span>
                      <span>{r.country}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{r.subclass}</td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">{r.mandatoryDocsCount} Documents</td>

                    <td className="py-3.5 px-4 font-black text-[#4848F7]">{r.minBankBalance}</td>

                    <td className="py-3.5 px-4 text-slate-700">{r.itrRequired}</td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        r.biometricsMandate ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}>
                        {r.biometricsMandate ? "Mandatory VFS" : "Exempt"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedReqId(r.id)}
                        className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg transition text-[11px] cursor-pointer"
                      >
                        View Checklist
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 7: SELECTED COUNTRY REQUIREMENTS INSPECTOR CARD */}
      {/* ============================================================ */}
      {activeReq && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{activeReq.flag}</span>
              <div>
                <h3 className="text-lg font-black text-slate-900">{activeReq.country} Document Checklist Inspector</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Subclass: {activeReq.subclass} &bull; Min Bank Balance: <span className="font-bold text-[#4848F7]">{activeReq.minBankBalance}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert(`Downloading checklist PDF for ${activeReq.country}...`)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-200"
              >
                <Download size={14} /> Download Checklist PDF
              </button>

              {onNavigateUpload && (
                <button
                  onClick={onNavigateUpload}
                  className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <FileCheck size={14} /> Upload Docs for Pre-Check
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Checklist Items with Checkboxes */}
            <div className="md:col-span-8 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Itemized Document Verification Checklist
              </h4>

              <div className="space-y-2">
                {activeReq.checklistItems.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" defaultChecked className="mt-1 rounded text-[#4848F7]" />
                      <div>
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.tip}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 shrink-0">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Specs & Financial Seal Advisory */}
            <div className="md:col-span-4 space-y-4">
              {/* Photo Specs Box */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Camera size={15} className="text-[#4848F7]" /> Photo Specifications
                </h5>
                <p className="text-[#4848F7] font-bold">{activeReq.photoSpecs}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Head must cover 70-80% of photo frame. Both ears must be clearly visible. No hats or sunglasses permitted.
                </p>
              </div>

              {/* Financial Seal Advisory Box */}
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2 text-xs text-emerald-950">
                <h5 className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck size={15} className="text-emerald-600" /> Bank Seal Verification
                </h5>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Consulates enforce strict bank verification. Ensure statements are printed on bank stationery with official stamp.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 8: QUICK ACTIONS BAR */}
      {/* ============================================================ */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg text-xs">
        <div>
          <h4 className="font-extrabold text-white">Need AI Verification for Your Documents Before Submission?</h4>
          <p className="text-slate-400 mt-0.5">Our Phantom AI Document OCR automatically checks bank stamps, photo sizes, and expiry dates.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onNavigateUpload && (
            <button
              onClick={onNavigateUpload}
              className="bg-[#4848F7] hover:bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} /> Run AI Pre-Check Now
            </button>
          )}

          {onNavigateSupport && (
            <button
              onClick={onNavigateSupport}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle size={14} /> Document Expert Help
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 9: VISA REQUIREMENTS FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Visa Document Requirements</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">What if I do not have 3 years of Income Tax Returns (ITR)?</p>
            <p className="text-slate-600 leading-relaxed">
              If ITR returns are unavailable, you can submit Form 16 from your employer, an affidavit of non-taxable income, or additional asset valuation certificates.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Can I submit digital bank statements downloaded from net banking?</p>
            <p className="text-slate-600 leading-relaxed">
              Most embassies require bank statements to carry an official branch seal and signature. Purely digital PDFs without stamps may lead to document rejection.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
