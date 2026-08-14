"use client";

import React, { useState, useEffect, useMemo } from "react";
import { formatINR } from "../context/VisaContext";
import { API_V1_URL } from "../config/api";
import {
  Globe,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Search,
  Layers,
  FileText,
  HelpCircle,
  ArrowRight,
  Plane,
  FileCheck,
  RefreshCw
} from "lucide-react";

// ─── Types that mirror the real backend models ────────────────────────────────
interface CountryRecord {
  _id: string;
  name: string;
  code: string;
  flag: string;
  continent: string;
  capital?: string;
  processingTime: string;
  startingFee: number;
  availableCategories: string[];
  availableVisaTypes: string[];
  requiredDocuments: string[];
  status: string;
  visaAvailable: boolean;
}

interface VisaRequirementRecord {
  _id: string;
  title: string;
  visaTypeName: string;
  isMandatory: boolean;
  status: string;
}

interface ApplicantExploreCountriesProps {
  onSelectCountryToApply?: (countryName: string) => void;
  onNavigateSupport?: () => void;
}

// Map continent name from backend to display label
function continentLabel(c: string): string {
  if (c === "Oceania") return "Asia-Pacific";
  if (c === "Europe") return "Europe";
  if (c === "North America" || c === "Americas") return "Americas";
  if (c === "Asia") return "Asia-Pacific";
  return c;
}

// Icon colour per continent
function continentColor(c: string): string {
  if (c === "Oceania" || c === "Asia") return "text-emerald-600";
  if (c === "Europe") return "text-indigo-600";
  if (c === "North America" || c === "Americas") return "text-blue-600";
  return "text-slate-600";
}

/** Renders a flag safely: ImageKit URL → <img>, emoji → <span> */
function FlagDisplay({ flag, size = "text-3xl" }: { flag?: string; size?: string }) {
  if (flag && (flag.startsWith("http://") || flag.startsWith("https://"))) {
    const px = size === "text-4xl" ? 40 : size === "text-lg" ? 24 : 32;
    return (
      <img
        src={flag}
        alt="flag"
        width={px}
        height={px}
        className="rounded object-cover shrink-0"
        style={{ width: px, height: px }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
      />
    );
  }
  return <span className={size}>{flag || "🌐"}</span>;
}

export default function ApplicantExploreCountries({
  onSelectCountryToApply,
  onNavigateSupport
}: ApplicantExploreCountriesProps) {

  // ─── Data from backend ─────────────────────────────────────────────────────
  const [countries, setCountries] = useState<CountryRecord[]>([]);
  const [requirements, setRequirements] = useState<VisaRequirementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const [cRes, reqRes] = await Promise.all([
          fetch(`${API_V1_URL}/countries`),
          fetch(`${API_V1_URL}/visa/requirements`)
        ]);
        const cJson = await cRes.json();
        const reqJson = await reqRes.json();

        const activeCountries: CountryRecord[] = (cJson.data || []).filter(
          (c: CountryRecord) => c.status === "Active" && c.visaAvailable !== false
        );
        const activeReqs: VisaRequirementRecord[] = (reqJson.data || []).filter(
          (r: VisaRequirementRecord) => r.status === "Active" && r.isMandatory
        );

        setCountries(activeCountries);
        setRequirements(activeReqs);
        if (activeCountries.length > 0) setSelectedCountryId(activeCountries[0]._id);
      } catch (err) {
        console.error("Failed to load countries from API:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ─── Filter / Sort State ────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [categoryTab, setCategoryTab] = useState<"all" | "tourist" | "business">("all");
  const [sortBy, setSortBy] = useState<"fee" | "speed" | "name">("name");
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");

  const activeCountry = useMemo(
    () => countries.find((c) => c._id === selectedCountryId) || countries[0],
    [countries, selectedCountryId]
  );

  // Regions available in the real dataset (derived dynamically)
  const availableRegions = useMemo(() => {
    const set = new Set(countries.map((c) => continentLabel(c.continent)));
    return Array.from(set).sort();
  }, [countries]);

  // Filtered + sorted list
  const filteredCountries = useMemo(() => {
    return countries
      .filter((c) => {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          c.name.toLowerCase().includes(q) ||
          (c.capital || "").toLowerCase().includes(q) ||
          continentLabel(c.continent).toLowerCase().includes(q);

        const matchesRegion =
          regionFilter === "all" || continentLabel(c.continent) === regionFilter;

        let matchesTab = true;
        if (categoryTab === "tourist")
          matchesTab = c.availableCategories.some((a) =>
            a.toLowerCase().includes("tourist")
          );
        if (categoryTab === "business")
          matchesTab = c.availableCategories.some((a) =>
            a.toLowerCase().includes("business")
          );

        return matchesQ && matchesRegion && matchesTab;
      })
      .sort((a, b) => {
        if (sortBy === "fee") return a.startingFee - b.startingFee;
        if (sortBy === "speed") return a.processingTime.localeCompare(b.processingTime);
        return a.name.localeCompare(b.name);
      });
  }, [countries, searchQuery, regionFilter, categoryTab, sortBy]);

  // Requirements for the selected country's visa types
  const activeCountryDocs = useMemo(() => {
    if (!activeCountry) return [];
    // First try real VisaRequirements matched by visa type names
    const vtNames = activeCountry.availableVisaTypes || [];
    const matched = requirements.filter((r) =>
      vtNames.some(
        (vt) =>
          r.visaTypeName.trim().toLowerCase().includes(vt.trim().toLowerCase()) ||
          vt.trim().toLowerCase().includes(r.visaTypeName.trim().toLowerCase())
      )
    );
    if (matched.length > 0) return matched.map((r) => r.title);
    // Fall back to the requiredDocuments string array on the country record itself
    return activeCountry.requiredDocuments || [];
  }, [activeCountry, requirements]);

  // Stat cards computed from real data
  const stats = useMemo(() => {
    const fees = countries.map((c) => c.startingFee);
    const minFee = fees.length ? Math.min(...fees) : 0;
    const maxFee = fees.length ? Math.max(...fees) : 0;
    const europeCount = countries.filter(
      (c) => c.continent === "Europe"
    ).length;
    return { total: countries.length, minFee, maxFee, europeCount };
  }, [countries]);

  // ─── Loading / Error States ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
        <RefreshCw size={32} className="animate-spin text-[#4848F7]" />
        <p className="text-sm font-semibold">Loading destination countries from admin configuration…</p>
      </div>
    );
  }

  if (error || countries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
        <Globe size={40} className="text-slate-300" />
        <p className="text-sm font-semibold text-slate-500">
          No active countries found. Please configure countries in the admin Countries module first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 text-slate-800">

      {/* ============================================================ */}
      {/* SECTION 1: HEADER BANNER */}
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
              <Globe size={12} className="text-emerald-600" /> {stats.total} Destination{stats.total !== 1 ? "s" : ""} Configured
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Discover visa requirements, processing times, and consular fees for all admin-configured travel destinations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (onSelectCountryToApply && activeCountry) onSelectCountryToApply(activeCountry.name);
            }}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Plane size={16} />
            <span>Apply for {activeCountry?.name} Visa</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: STATS CARDS — ALL COMPUTED FROM REAL DATA */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Card 1: Total Destinations */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Destinations</p>
          <p className="text-2xl font-black text-[#4848F7] mt-1">{stats.total}</p>
          <span className="text-[10px] text-[#4848F7] font-semibold flex items-center gap-1">
            <Globe size={10} /> Active countries
          </span>
        </div>

        {/* Card 2: Fee Range */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Fee Range</p>
          <p className="text-lg font-black text-emerald-600 mt-1">₹{formatINR(stats.minFee)}+</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <Zap size={10} /> Starting consular fee
          </span>
        </div>

        {/* Card 3: Europe Destinations */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Europe</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.europeCount}</p>
          <span className="text-[10px] text-slate-400 font-medium">European nations</span>
        </div>

        {/* Card 4: Avg Processing */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Avg Processing</p>
          <p className="text-lg font-bold text-slate-900 mt-1">
            {countries.length > 0
              ? countries[Math.floor(countries.length / 2)].processingTime
              : "—"}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Typical dispatch</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: WORKFLOW BANNER */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Global Application Workflow (Select → Upload Docs → Consular Processing → Digital Delivery)
            </h3>
          </div>
          <span className="text-[11px] bg-white/10 text-slate-300 font-mono px-3 py-1 rounded-full">
            Direct Embassy Sync
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 1</span>
            <p className="text-white">Select Destination &amp; Visa Category</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 2</span>
            <p className="text-white">Upload Passport &amp; Scanned Docs</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 3</span>
            <p className="text-white">Consular Verification &amp; Review</p>
          </div>
          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Step 4</span>
            <p className="font-bold">Visa Delivered to Vault &amp; Email ✓</p>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* SECTION 4: SEARCH & FILTER BAR */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search Country, Capital, Region…"
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

          {/* Category Quick Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(["all", "tourist", "business"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setCategoryTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition capitalize ${categoryTab === tab ? "bg-white text-[#4848F7] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
              >
                {tab === "all" ? "All Visas" : tab === "tourist" ? "Tourist" : "Business"}
              </button>
            ))}
          </div>

          {/* Region & Sort Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Regions</option>
              {availableRegions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="name">Sort: Name</option>
              <option value="fee">Sort: Consular Fee</option>
              <option value="speed">Sort: Processing Speed</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: COUNTRY CARDS GRID — REAL DATA ONLY */}
      {/* ============================================================ */}
      {filteredCountries.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-sm text-slate-400">
          No countries match your current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCountries.map((c) => {
            const isSelected = c._id === selectedCountryId;
            return (
              <div
                key={c._id}
                onClick={() => setSelectedCountryId(c._id)}
                className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected ? "border-[#4848F7] ring-2 ring-[#4848F7]/20" : "border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FlagDisplay flag={c.flag} size="text-3xl" />
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">{c.name}</h3>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {c.capital ? `${c.capital} • ` : ""}{continentLabel(c.continent)}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-50 text-slate-700 border-slate-200`}>
                      {c.code}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Visa Categories:</span>
                      <span className="font-bold text-slate-800 text-right max-w-[55%] truncate">
                        {c.availableCategories.length} available
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Starting Fee:</span>
                      <span className="font-black text-[#4848F7]">₹{formatINR(c.startingFee)}</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Processing Time:</span>
                      <span className="font-semibold text-slate-800">{c.processingTime}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Categories:</span>
                      <span className="font-semibold text-slate-700 text-right max-w-[60%] text-[10px] leading-relaxed">
                        {c.availableCategories.slice(0, 2).join(", ")}
                        {c.availableCategories.length > 2 ? ` +${c.availableCategories.length - 2}` : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCountryId(c._id);
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-[#4848F7] transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectCountryToApply) onSelectCountryToApply(c.name);
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
      )}

      {/* ============================================================ */}
      {/* SECTION 6: GLOBAL DESTINATIONS DIRECTORY TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Globe size={16} className="text-[#4848F7]" />
            <span>Global Destinations Directory &amp; Requirements ({filteredCountries.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Country &amp; Flag</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Starting Fee</th>
                <th className="py-3 px-4">Processing Time</th>
                <th className="py-3 px-4">Visa Types</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCountries.map((c) => {
                const isSelected = c._id === selectedCountryId;
                return (
                  <tr
                    key={c._id}
                    onClick={() => setSelectedCountryId(c._id)}
                    className={`cursor-pointer transition hover:bg-indigo-50/40 ${
                      isSelected ? "bg-indigo-50/80 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <FlagDisplay flag={c.flag} size="text-lg" />
                        <span>{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{continentLabel(c.continent)}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">₹{formatINR(c.startingFee)}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{c.processingTime}</td>
                    <td className="py-3.5 px-4 text-slate-600">{c.availableVisaTypes.length} type{c.availableVisaTypes.length !== 1 ? "s" : ""}</td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          if (onSelectCountryToApply) onSelectCountryToApply(c.name);
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
      {/* SECTION 7: SELECTED COUNTRY REQUIREMENTS INSPECTOR */}
      {/* ============================================================ */}
      {activeCountry && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <FlagDisplay flag={activeCountry.flag} size="text-4xl" />
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {activeCountry.name} Visa Requirements &amp; Document Checklist
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Processing Time: {activeCountry.processingTime} &bull; Starting Fee: ₹{formatINR(activeCountry.startingFee)}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (onSelectCountryToApply) onSelectCountryToApply(activeCountry.name);
              }}
              className="bg-[#4848F7] hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Plane size={16} />
              <span>Start Application for {activeCountry.name}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mandatory Documents Checklist — real data */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs md:col-span-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <FileCheck size={16} className="text-[#4848F7]" /> Mandatory Documents Checklist
              </h4>

              {activeCountryDocs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeCountryDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200 font-medium text-slate-800">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-xs italic">
                  No documents configured yet. Add Visa Requirements for this country's visa types in the admin panel.
                </p>
              )}
            </div>

            {/* Consular Advisory — only fields with real sources */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <ShieldCheck size={16} className="text-[#4848F7]" /> Consular Advisory
              </h4>

              <div className="space-y-2.5">
                <div>
                  <span className="text-slate-500 block">Consular Fee (Starting):</span>
                  <span className="font-bold text-[#4848F7]">₹{formatINR(activeCountry.startingFee)}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Typical Processing:</span>
                  <span className="font-bold text-slate-900">{activeCountry.processingTime}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Available Categories:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeCountry.availableCategories.slice(0, 3).map((cat) => (
                      <span key={cat} className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                        {cat}
                      </span>
                    ))}
                    {activeCountry.availableCategories.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-medium self-center">
                        +{activeCountry.availableCategories.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block">Country Code:</span>
                  <span className="font-bold text-slate-900">{activeCountry.code}</span>
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



    </div>
  );
}
