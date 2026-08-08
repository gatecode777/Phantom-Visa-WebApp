"use client";

import React, { useState, useMemo } from "react";
import { Application, formatINR } from "../context/VisaContext";
import {
  Globe,
  Compass,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Search,
  Filter,
  Layers,
  Building,
  User,
  FileText,
  Download,
  HelpCircle,
  ArrowRight,
  Plane,
  FileCheck,
  Info,
  DollarSign,
  Briefcase,
  GraduationCap,
  Sparkles,
  MapPin
} from "lucide-react";

export interface CountryVisaInfo {
  id: string;
  country: string;
  flag: string;
  capital: string;
  region: "Europe" | "Asia-Pacific" | "Americas" | "Middle East & Africa";
  visaType: string;
  entryType: "e-Visa" | "Sticker Visa" | "Visa on Arrival" | "Visa Free";
  fee: number;
  processingTime: string;
  validity: string;
  maxStay: string;
  approvalRate: string;
  minBankBalance: string;
  biometricsRequired: boolean;
  popular: boolean;
  requiredDocs: string[];
}

interface ApplicantExploreCountriesProps {
  onSelectCountryToApply?: (countryName: string) => void;
  onNavigateSupport?: () => void;
}

export default function ApplicantExploreCountries({
  onSelectCountryToApply,
  onNavigateSupport
}: ApplicantExploreCountriesProps) {
  // Comprehensive Global Countries Dataset matching wireframe
  const [countriesList] = useState<CountryVisaInfo[]>([
    {
      id: "DEST-AU",
      country: "Australia",
      flag: "🇦🇺",
      capital: "Canberra",
      region: "Asia-Pacific",
      visaType: "Visitor Subclass 600",
      entryType: "e-Visa",
      fee: 12500,
      processingTime: "5-7 Days",
      validity: "1 Year Multiple Entry",
      maxStay: "90 Days per visit",
      approvalRate: "99.2%",
      minBankBalance: "₹1.5 Lakhs",
      biometricsRequired: true,
      popular: true,
      requiredDocs: ["Original Passport", "Bank Balance Certificate", "Employment ID / ITR", "Hotel & Flight Itinerary"]
    },
    {
      id: "DEST-FR",
      country: "France (Schengen)",
      flag: "🇫🇷",
      capital: "Paris",
      region: "Europe",
      visaType: "Short-Stay Schengen Type C",
      entryType: "Sticker Visa",
      fee: 18000,
      processingTime: "3-5 Days (Express)",
      validity: "6 Months Multiple Entry",
      maxStay: "90 Days in 180-day window",
      approvalRate: "98.8%",
      minBankBalance: "₹2.0 Lakhs",
      biometricsRequired: true,
      popular: true,
      requiredDocs: ["Passport (6 mo validity)", "3 Years ITR", "Schengen Travel Insurance", "Cover Letter & Leave Sanction"]
    },
    {
      id: "DEST-UK",
      country: "United Kingdom",
      flag: "🇬🇧",
      capital: "London",
      region: "Europe",
      visaType: "Standard Visitor Visa",
      entryType: "Sticker Visa",
      fee: 14500,
      processingTime: "10-12 Days",
      validity: "6 Months / 2 Years",
      maxStay: "180 Days per visit",
      approvalRate: "97.5%",
      minBankBalance: "₹2.5 Lakhs",
      biometricsRequired: true,
      popular: true,
      requiredDocs: ["Current Passport", "Bank Statements 6 Months", "Proof of Assets/Property", "Sponsorship Letter (if any)"]
    },
    {
      id: "DEST-US",
      country: "United States",
      flag: "🇺🇸",
      capital: "Washington D.C.",
      region: "Americas",
      visaType: "B1/B2 Tourist & Business",
      entryType: "Sticker Visa",
      fee: 18500,
      processingTime: "Interview Appointment Dependent",
      validity: "10 Years Multiple Entry",
      maxStay: "6 Months per visit",
      approvalRate: "96.4%",
      minBankBalance: "₹3.0 Lakhs",
      biometricsRequired: true,
      popular: true,
      requiredDocs: ["DS-160 Confirmation", "Appointment Letter", "Passport", "Financial Ties & Property Proof"]
    },
    {
      id: "DEST-SG",
      country: "Singapore",
      flag: "🇸🇬",
      capital: "Singapore",
      region: "Asia-Pacific",
      visaType: "Tourist e-Visa",
      entryType: "e-Visa",
      fee: 8500,
      processingTime: "48 Hours",
      validity: "90 Days Multiple Entry",
      maxStay: "30 Days per visit",
      approvalRate: "99.8%",
      minBankBalance: "₹1.0 Lakh",
      biometricsRequired: false,
      popular: true,
      requiredDocs: ["Passport Scan", "Passport Photo (35x45mm)", "Confirmed Air Tickets", "Form 14A"]
    },
    {
      id: "DEST-AE",
      country: "United Arab Emirates",
      flag: "🇦🇪",
      capital: "Abu Dhabi",
      region: "Middle East & Africa",
      visaType: "30-Day Express Tourist eVisa",
      entryType: "e-Visa",
      fee: 9500,
      processingTime: "24 Hours (Express)",
      validity: "60 Days Single Entry",
      maxStay: "30 Days",
      approvalRate: "99.9%",
      minBankBalance: "No minimum required",
      biometricsRequired: false,
      popular: true,
      requiredDocs: ["Passport Front & Back Scan", "Passport Photo", "Return Flight Booking"]
    },
    {
      id: "DEST-JP",
      country: "Japan",
      flag: "🇯🇵",
      capital: "Tokyo",
      region: "Asia-Pacific",
      visaType: "Short-Term Tourist eVisa",
      entryType: "e-Visa",
      fee: 11000,
      processingTime: "4-5 Days",
      validity: "90 Days Single Entry",
      maxStay: "15 Days",
      approvalRate: "99.1%",
      minBankBalance: "₹1.5 Lakhs",
      biometricsRequired: false,
      popular: true,
      requiredDocs: ["Passport Scan", "Schedule of Stay / Itinerary", "ITR V", "Bank Statements"]
    },
    {
      id: "DEST-CA",
      country: "Canada",
      flag: "🇨🇦",
      capital: "Ottawa",
      region: "Americas",
      visaType: "Visitor Visa V-1",
      entryType: "Sticker Visa",
      fee: 16500,
      processingTime: "15-20 Days",
      validity: "Up to Passport Expiry (Max 10 Yrs)",
      maxStay: "6 Months per visit",
      approvalRate: "95.2%",
      minBankBalance: "₹3.5 Lakhs",
      biometricsRequired: true,
      popular: false,
      requiredDocs: ["IMM 5257 Application", "Family Information Form", "Proof of Financial Support", "Purpose of Travel"]
    }
  ]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [entryTypeFilter, setEntryTypeFilter] = useState("all");
  const [categoryTab, setCategoryTab] = useState<"all" | "tourist" | "business" | "evisa">("all");
  const [sortBy, setSortBy] = useState<"popularity" | "fee" | "speed">("popularity");

  // Selected Country for Requirements Inspector
  const [selectedCountryId, setSelectedCountryId] = useState<string>("DEST-AU");

  const activeCountry = useMemo(() => {
    return countriesList.find((c) => c.id === selectedCountryId) || countriesList[0];
  }, [countriesList, selectedCountryId]);

  // Filtered List
  const filteredCountries = useMemo(() => {
    return countriesList
      .filter((c) => {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          c.country.toLowerCase().includes(q) ||
          c.capital.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q) ||
          c.visaType.toLowerCase().includes(q);

        const matchesRegion = regionFilter === "all" || c.region === regionFilter;
        const matchesEntry = entryTypeFilter === "all" || c.entryType === entryTypeFilter;

        let matchesTab = true;
        if (categoryTab === "evisa") matchesTab = c.entryType === "e-Visa";
        if (categoryTab === "tourist") matchesTab = c.visaType.toLowerCase().includes("tourist") || c.visaType.toLowerCase().includes("visitor");
        if (categoryTab === "business") matchesTab = c.visaType.toLowerCase().includes("business");

        return matchesQ && matchesRegion && matchesEntry && matchesTab;
      })
      .sort((a, b) => {
        if (sortBy === "fee") return a.fee - b.fee;
        if (sortBy === "speed") return a.processingTime.localeCompare(b.processingTime);
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      });
  }, [countriesList, searchQuery, regionFilter, entryTypeFilter, categoryTab, sortBy]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & GLOBAL DESTINATIONS BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Explore Visas</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Global Destinations</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Explore Global Visa Destinations</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Globe size={12} className="text-emerald-600" /> 185+ Destinations Covered
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Discover visa requirements, processing times, consular fees, e-Visa eligibility, and application guidelines for 180+ global travel destinations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (onSelectCountryToApply) onSelectCountryToApply(activeCountry.country);
            }}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Plane size={16} />
            <span>Apply for {activeCountry.country} Visa</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: DASHBOARD STATISTICS CARDS GRID (6 CARDS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Supported Destinations */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Destinations</p>
          <p className="text-2xl font-black text-[#4848F7] mt-1">185</p>
          <span className="text-[10px] text-[#4848F7] font-semibold flex items-center gap-1">
            <Globe size={10} /> Worldwide coverage
          </span>
        </div>

        {/* Card 2: Instant e-Visa Eligible */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">e-Visa Eligible</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">42</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <Zap size={10} /> Fast digital approval
          </span>
        </div>

        {/* Card 3: Visa on Arrival */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Visa on Arrival</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">28</p>
          <span className="text-[10px] text-slate-400 font-medium">Airport clearance</span>
        </div>

        {/* Card 4: Schengen Area */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Schengen Area</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">27</p>
          <span className="text-[10px] text-slate-400 font-medium">European nations</span>
        </div>

        {/* Card 5: Avg Processing Speed */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Avg Speed</p>
          <p className="text-xl font-bold text-slate-900 mt-1">3-5 Days</p>
          <span className="text-[10px] text-slate-400 font-medium">Consular dispatch</span>
        </div>

        {/* Card 6: Approval Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Approval Rate</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">99.4%</p>
          <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
            <CheckCircle2 size={10} /> Expert verified
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CONCEPTUAL WORKFLOW BANNER (CONNECTED GLOBAL APPLICATION FLOW) */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Global Application Workflow (Select ➔ Scanned Docs ➔ Consular Processing ➔ Digital Delivery)
            </h3>
          </div>
          <span className="text-[11px] bg-white/10 text-slate-300 font-mono px-3 py-1 rounded-full">
            Direct Embassy Sync
          </span>
        </div>

        {/* Workflow Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 1</span>
            <p className="text-white">Select Destination & Visa Mechanism</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 2</span>
            <p className="text-white">Upload Passport & Scanned Docs</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 3</span>
            <p className="text-white">Consular Verification & Biometrics</p>
          </div>

          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Step 4</span>
            <p className="font-bold">Visa Delivered to Vault & Email ✓</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl text-xs space-y-1 text-slate-300">
          <p className="font-bold text-white">Professional Recommendation & Application Advisory:</p>
          <ul className="list-disc pl-4 space-y-1 leading-relaxed text-[11px]">
            <li>Ensure your passport has at least 6 months validity from your intended departure date.</li>
            <li>For Schengen countries, your application must be submitted to the embassy of your primary stay duration.</li>
            <li>Digital e-Visas are automatically linked to your passport number upon issuance.</li>
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
              placeholder="Search Country, Capital, Region..."
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

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setCategoryTab("all")}
              className={`px-3 py-1.5 rounded-lg transition ${categoryTab === "all" ? "bg-white text-[#4848F7] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
            >
              All Visas
            </button>

            <button
              onClick={() => setCategoryTab("tourist")}
              className={`px-3 py-1.5 rounded-lg transition ${categoryTab === "tourist" ? "bg-white text-[#4848F7] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
            >
              Tourist
            </button>

            <button
              onClick={() => setCategoryTab("evisa")}
              className={`px-3 py-1.5 rounded-lg transition ${categoryTab === "evisa" ? "bg-white text-[#4848F7] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
            >
              e-Visa Digital
            </button>
          </div>

          {/* Region & Entry Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Regions</option>
              <option value="Europe">Europe / Schengen</option>
              <option value="Asia-Pacific">Asia-Pacific</option>
              <option value="Americas">Americas</option>
              <option value="Middle East & Africa">Middle East & Africa</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="popularity">Sort: Popularity</option>
              <option value="fee">Sort: Consular Fee</option>
              <option value="speed">Sort: Processing Speed</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: FEATURED DESTINATIONS CARDS GRID */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCountries.slice(0, 6).map((c) => {
          const isSelected = c.id === selectedCountryId;
          return (
            <div
              key={c.id}
              onClick={() => setSelectedCountryId(c.id)}
              className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected ? "border-[#4848F7] ring-2 ring-[#4848F7]/20" : "border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{c.flag}</span>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{c.country}</h3>
                      <span className="text-[10px] text-slate-400 font-semibold">{c.capital} &bull; {c.region}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    c.entryType === "e-Visa" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-indigo-50 text-indigo-700 border-indigo-200"
                  }`}>
                    {c.entryType}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Visa Subclass:</span>
                    <span className="font-bold text-slate-800">{c.visaType}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Consular Fee:</span>
                    <span className="font-black text-[#4848F7]">₹{formatINR(c.fee)}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Processing Time:</span>
                    <span className="font-semibold text-slate-800">{c.processingTime}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Validity & Stay:</span>
                    <span className="font-semibold text-slate-800">{c.maxStay}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCountryId(c.id);
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-[#4848F7] transition"
                >
                  View Details
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectCountryToApply) onSelectCountryToApply(c.country);
                  }}
                  className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Apply Now</span> <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* SECTION 6: COUNTRIES DIRECTORY TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Globe size={16} className="text-[#4848F7]" />
            <span>Global Destinations Directory & Requirements ({filteredCountries.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Country & Flag</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Visa Mechanism</th>
                <th className="py-3 px-4">Consular Fee</th>
                <th className="py-3 px-4">Processing Time</th>
                <th className="py-3 px-4">Max Stay</th>
                <th className="py-3 px-4">Approval Rate</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCountries.map((c) => {
                const isSelected = c.id === selectedCountryId;
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCountryId(c.id)}
                    className={`cursor-pointer transition hover:bg-indigo-50/40 ${
                      isSelected ? "bg-indigo-50/80 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span className="text-lg">{c.flag}</span>
                      <span>{c.country}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">{c.region}</td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{c.entryType}</span>
                    </td>

                    <td className="py-3.5 px-4 font-black text-slate-900">₹{formatINR(c.fee)}</td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">{c.processingTime}</td>

                    <td className="py-3.5 px-4 text-slate-600">{c.maxStay}</td>

                    <td className="py-3.5 px-4 font-bold text-emerald-600">{c.approvalRate}</td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          if (onSelectCountryToApply) onSelectCountryToApply(c.country);
                        }}
                        className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg transition text-[11px] cursor-pointer"
                      >
                        Apply Now
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
      {activeCountry && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{activeCountry.flag}</span>
              <div>
                <h3 className="text-lg font-black text-slate-900">{activeCountry.country} Visa Requirements & Document Checklist</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Subclass: {activeCountry.visaType} &bull; Processing Time: {activeCountry.processingTime}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (onSelectCountryToApply) onSelectCountryToApply(activeCountry.country);
              }}
              className="bg-[#4848F7] hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Plane size={16} />
              <span>Start Application for {activeCountry.country}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Required Documents Checklist */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs md:col-span-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <FileCheck size={16} className="text-[#4848F7]" /> Mandatory Documents Checklist
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeCountry.requiredDocs.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200 font-medium text-slate-800">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials & Biometrics Advisory */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <ShieldCheck size={16} className="text-[#4848F7]" /> Consular Advisory
              </h4>

              <div className="space-y-2">
                <div>
                  <span className="text-slate-500 block">Minimum Recommended Bank Balance:</span>
                  <span className="font-bold text-slate-900">{activeCountry.minBankBalance}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Biometric Collection Requirement:</span>
                  <span className={`font-bold ${activeCountry.biometricsRequired ? "text-amber-700" : "text-emerald-700"}`}>
                    {activeCountry.biometricsRequired ? "Mandatory VFS Appointment" : "Exempt / Fully Digital"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Historical Approval Guarantee:</span>
                  <span className="font-bold text-emerald-600">{activeCountry.approvalRate} success rate</span>
                </div>
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
          <h4 className="font-extrabold text-white">Need Customized Visa Advice for Your Travel Plan?</h4>
          <p className="text-slate-400 mt-0.5">Consult with our AI Visa Officer or schedule a 1-on-1 consular specialist call.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onNavigateSupport && (
            <button
              onClick={onNavigateSupport}
              className="bg-[#4848F7] hover:bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle size={14} /> Consular Support Desk
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 9: EXPLORE COUNTRIES FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Destinations & Visas</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Can I apply for a Schengen Visa for multiple European countries?</p>
            <p className="text-slate-600 leading-relaxed">
              Yes, a single Schengen visa allows travel across 27 countries. You must submit your application to the embassy of the country where you will spend the maximum number of nights.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">What is the difference between an e-Visa and a Sticker Visa?</p>
            <p className="text-slate-600 leading-relaxed">
              e-Visas are processed digitally without physical passport submission. Sticker visas require sending your physical passport to the embassy for visa stamping.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
