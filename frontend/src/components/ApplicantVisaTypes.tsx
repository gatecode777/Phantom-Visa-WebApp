"use client";

import React, { useState, useEffect, useMemo } from "react";
import { formatINR } from "../context/VisaContext";
import { API_V1_URL } from "../config/api";
import {
  FileText,
  Briefcase,
  GraduationCap,
  Plane,
  CheckCircle2,
  ShieldCheck,
  Search,
  Layers,
  Building,
  HelpCircle,
  ArrowRight,
  Globe,
  RefreshCw,
  FileCheck,
  Clock
} from "lucide-react";

// ─── Types mirroring real backend models ──────────────────────────────────────
interface VisaCategoryRecord {
  _id: string;
  name: string;
  code: string;
  description?: string;
  status: string;
}

interface VisaTypeRecord {
  _id: string;
  name: string;
  code: string;
  categoryName: string;
  entryType: string;
  validityMonths: number;
  maxStayDays: number;
  processingTimeDays: number;
  status: string;
}

interface CountryRecord {
  _id: string;
  name: string;
  startingFee: number;
  availableCategories: string[];
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

interface ApplicantVisaTypesProps {
  onNavigateApply?: (categoryName?: string) => void;
  onNavigateSupport?: () => void;
}

// Icon per category name
function categoryIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("tourist") || n.includes("leisure")) return <Plane size={20} />;
  if (n.includes("business") || n.includes("conference")) return <Briefcase size={20} />;
  if (n.includes("student") || n.includes("study")) return <GraduationCap size={20} />;
  if (n.includes("transit") || n.includes("airport")) return <Globe size={20} />;
  if (n.includes("work") || n.includes("employ") || n.includes("permit")) return <Building size={20} />;
  return <FileText size={20} />;
}

export default function ApplicantVisaTypes({
  onNavigateApply,
  onNavigateSupport
}: ApplicantVisaTypesProps) {

  // ─── Data from backend ─────────────────────────────────────────────────────
  const [categories, setCategories] = useState<VisaCategoryRecord[]>([]);
  const [visaTypes, setVisaTypes] = useState<VisaTypeRecord[]>([]);
  const [countries, setCountries] = useState<CountryRecord[]>([]);
  const [requirements, setRequirements] = useState<VisaRequirementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const [catRes, vtRes, cRes, reqRes] = await Promise.all([
          fetch(`${API_V1_URL}/visa/categories`),
          fetch(`${API_V1_URL}/visa/types`),
          fetch(`${API_V1_URL}/countries`),
          fetch(`${API_V1_URL}/visa/requirements`)
        ]);
        const catJson = await catRes.json();
        const vtJson = await vtRes.json();
        const cJson = await cRes.json();
        const reqJson = await reqRes.json();

        const activeCats: VisaCategoryRecord[] = (catJson.data || []).filter(
          (c: VisaCategoryRecord) => c.status === "Active"
        );
        const activeVts: VisaTypeRecord[] = (vtJson.data || []).filter(
          (v: VisaTypeRecord) => v.status === "Active"
        );
        const activeCountries: CountryRecord[] = (cJson.data || []).filter(
          (c: CountryRecord) => c.status === "Active" && c.visaAvailable !== false
        );
        const activeReqs: VisaRequirementRecord[] = (reqJson.data || []).filter(
          (r: VisaRequirementRecord) => r.status === "Active" && r.isMandatory
        );

        setCategories(activeCats);
        setVisaTypes(activeVts);
        setCountries(activeCountries);
        setRequirements(activeReqs);
        if (activeCats.length > 0) setSelectedCatId(activeCats[0]._id);
      } catch (err) {
        console.error("Failed to load visa categories from API:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ─── Filter State ───────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCatId, setSelectedCatId] = useState<string>("");

  const activeCategory = useMemo(
    () => categories.find((c) => c._id === selectedCatId) || categories[0],
    [categories, selectedCatId]
  );

  // Visa types for the selected category
  const activeCategoryTypes = useMemo(() => {
    if (!activeCategory) return [];
    return visaTypes.filter(
      (vt) =>
        vt.categoryName.trim().toLowerCase() ===
        activeCategory.name.trim().toLowerCase()
    );
  }, [activeCategory, visaTypes]);

  // Requirements for the selected category's visa types
  const activeCategoryDocs = useMemo(() => {
    const vtNames = activeCategoryTypes.map((vt) => vt.name.trim().toLowerCase());
    const matched = requirements.filter((r) =>
      vtNames.some(
        (n) =>
          r.visaTypeName.trim().toLowerCase().includes(n) ||
          n.includes(r.visaTypeName.trim().toLowerCase())
      )
    );
    return matched.map((r) => r.title);
  }, [activeCategoryTypes, requirements]);

  // Filtered categories for the search/filter bar
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
      );
    });
  }, [categories, searchQuery]);

  // ─── Stat computations — all from real data ─────────────────────────────────
  const stats = useMemo(() => {
    // Countries offering this category (real join: countries.availableCategories)
    const countForCategory = (catName: string) =>
      countries.filter((c) =>
        c.availableCategories.some(
          (a) => a.trim().toLowerCase() === catName.trim().toLowerCase()
        )
      ).length;

    // Max validity from real VisaType.validityMonths under this category
    const validityForCategory = (catName: string): string => {
      const types = visaTypes.filter(
        (vt) => vt.categoryName.trim().toLowerCase() === catName.trim().toLowerCase()
      );
      if (types.length === 0) return "—";
      const maxStay = Math.max(...types.map((vt) => vt.maxStayDays || 0));
      const maxValidity = Math.max(...types.map((vt) => vt.validityMonths || 0));
      if (maxValidity >= 12) return `Up to ${maxValidity / 12} Year${maxValidity >= 24 ? "s" : ""}`;
      if (maxValidity > 0) return `Up to ${maxValidity} Month${maxValidity !== 1 ? "s" : ""}`;
      return maxStay > 0 ? `${maxStay} Days` : "—";
    };

    // Entry mode from real VisaType.entryType under this category
    const entryModeForCategory = (catName: string): string => {
      const types = visaTypes.filter(
        (vt) => vt.categoryName.trim().toLowerCase() === catName.trim().toLowerCase()
      );
      if (types.length === 0) return "—";
      const modes = [...new Set(types.map((vt) => vt.entryType))];
      return modes.join(" / ");
    };

    // Visa types count for this category
    const typesCountForCategory = (catName: string): number =>
      visaTypes.filter(
        (vt) => vt.categoryName.trim().toLowerCase() === catName.trim().toLowerCase()
      ).length;

    return { countForCategory, validityForCategory, entryModeForCategory, typesCountForCategory };
  }, [categories, countries, visaTypes]);

  // ─── Loading / Error States ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
        <RefreshCw size={32} className="animate-spin text-[#4848F7]" />
        <p className="text-sm font-semibold">Loading visa categories from admin configuration…</p>
      </div>
    );
  }

  if (error || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
        <FileText size={40} className="text-slate-300" />
        <p className="text-sm font-semibold text-slate-500">
          No active visa categories found. Please configure categories in the admin Visa Categories module first.
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
            <span className="text-slate-500 font-normal">Visa Types</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Visa Types &amp; Classification Guide</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck size={12} className="text-emerald-600" /> Consular Verified Guidelines
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Explore all visa categories configured in the admin system — only categories and types that are currently Active.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (onNavigateApply && activeCategory) onNavigateApply(activeCategory.name);
            }}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Plane size={16} />
            <span>Apply for {activeCategory?.name}</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: STATS CARDS — ALL COMPUTED FROM REAL DATA */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Categories */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Main Categories</p>
          <p className="text-2xl font-black text-[#4848F7] mt-1">{String(categories.length).padStart(2, "0")}</p>
          <span className="text-[10px] text-[#4848F7] font-semibold">Active in system</span>
        </div>

        {/* Remaining cards: one per category, limited to 5 */}
        {categories.slice(0, 5).map((cat, idx) => {
          const colors = [
            "border-l-emerald-500 text-emerald-600",
            "border-l-indigo-500 text-indigo-600",
            "border-l-amber-500 text-amber-600",
            "border-l-rose-500 text-rose-600",
            "border-l-purple-500 text-purple-600"
          ];
          const [borderColor, textColor] = colors[idx % colors.length].split(" ");
          const countryCount = stats.countForCategory(cat.name);
          return (
            <div key={cat._id} className={`bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 ${borderColor}`}>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide truncate">{cat.name.split(" ")[0]}</p>
              <p className={`text-2xl font-black mt-1 ${textColor}`}>{countryCount}</p>
              <span className={`text-[10px] font-semibold ${textColor} flex items-center gap-1`}>
                <Globe size={10} /> Countr{countryCount !== 1 ? "ies" : "y"}
              </span>
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: WORKFLOW BANNER */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Visa Subtype Selection Workflow (Purpose → Category → Eligibility → Wizard Application)
            </h3>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
            Consular Rule Engine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 1</span>
            <p className="text-white">Select Primary Travel Purpose</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 2</span>
            <p className="text-white">Match Visa Category &amp; Entry Mode</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 3</span>
            <p className="text-white">Verify Financials &amp; Required Docs</p>
          </div>
          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Step 4</span>
            <p className="font-bold">Start Visa Application Wizard ✓</p>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* SECTION 4: SEARCH BAR */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search Category, Code, Description…"
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
          <p className="text-xs text-slate-400 font-medium">
            Showing {filteredCategories.length} of {categories.length} active visa categories
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: CATEGORY CARDS — REAL DATA ONLY */}
      {/* ============================================================ */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-sm text-slate-400">
          No categories match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((c) => {
            const isSelected = c._id === selectedCatId;
            const countryCount = stats.countForCategory(c.name);
            const validity = stats.validityForCategory(c.name);
            const typesCount = stats.typesCountForCategory(c.name);

            return (
              <div
                key={c._id}
                onClick={() => setSelectedCatId(c._id)}
                className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected ? "border-[#4848F7] ring-2 ring-[#4848F7]/20" : "border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-indigo-50 text-[#4848F7] rounded-xl shrink-0">
                      {categoryIcon(c.name)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{c.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono font-semibold">{c.code}</span>
                    </div>
                  </div>

                  {c.description && (
                    <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  )}

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Visa Types Configured:</span>
                      <span className="font-black text-[#4848F7]">{typesCount > 0 ? typesCount : "—"}</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Max Validity:</span>
                      <span className="font-semibold text-slate-800">{validity}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Countries Offering:</span>
                      <span className="font-semibold text-slate-800">{countryCount > 0 ? countryCount : "—"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCatId(c._id);
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-[#4848F7] transition"
                  >
                    Inspect Requirements
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onNavigateApply) onNavigateApply(c.name);
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
      {/* SECTION 6: VISA CLASSIFICATION COMPARISON TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileText size={16} className="text-[#4848F7]" />
            <span>Visa Classification &amp; Category Comparison Table ({filteredCategories.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Visa Category</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Visa Types</th>
                <th className="py-3 px-4">Max Validity</th>
                <th className="py-3 px-4">Entry Mode</th>
                <th className="py-3 px-4">Countries</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map((c) => {
                const isSelected = c._id === selectedCatId;
                return (
                  <tr
                    key={c._id}
                    onClick={() => setSelectedCatId(c._id)}
                    className={`cursor-pointer transition hover:bg-indigo-50/40 ${
                      isSelected ? "bg-indigo-50/80 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4848F7]" />}
                        {c.name}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">{c.code}</td>
                    <td className="py-3.5 px-4 font-black text-[#4848F7]">{stats.typesCountForCategory(c.name) || "—"}</td>
                    <td className="py-3.5 px-4 text-slate-600">{stats.validityForCategory(c.name)}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">{stats.entryModeForCategory(c.name) || "—"}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">{stats.countForCategory(c.name) || "—"}</td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          if (onNavigateApply) onNavigateApply(c.name);
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
      {/* SECTION 7: SELECTED CATEGORY REQUIREMENTS INSPECTOR */}
      {/* ============================================================ */}
      {activeCategory && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">{activeCategory.name} Requirements &amp; Checklist</h3>
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                  {activeCategory.code}
                </span>
              </div>
              {activeCategory.description && (
                <p className="text-xs text-slate-500 font-medium mt-0.5">{activeCategory.description}</p>
              )}
            </div>

            <button
              onClick={() => {
                if (onNavigateApply) onNavigateApply(activeCategory.name);
              }}
              className="bg-[#4848F7] hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Plane size={16} />
              <span>Apply for {activeCategory.name}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visa Types under this category */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <Clock size={16} className="text-[#4848F7]" /> Configured Visa Types ({activeCategoryTypes.length})
              </h4>
              {activeCategoryTypes.length > 0 ? (
                <div className="space-y-2">
                  {activeCategoryTypes.map((vt) => (
                    <div key={vt._id} className="flex items-start gap-2 text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-800 block">{vt.name}</span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          {vt.entryType} &bull; {vt.maxStayDays} days &bull; {vt.processingTimeDays} day processing
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic">No visa types configured under this category yet.</p>
              )}
            </div>

            {/* Mandatory Documents from real VisaRequirements */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <FileCheck size={16} className="text-[#4848F7]" /> Mandatory Supporting Documents
              </h4>
              {activeCategoryDocs.length > 0 ? (
                <div className="space-y-2">
                  {activeCategoryDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700">
                      <FileText size={15} className="text-[#4848F7] shrink-0 mt-0.5" />
                      <span className="font-semibold text-slate-800">{doc}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic">
                  No mandatory requirements configured yet. Add Visa Requirements for the visa types under this category in the admin panel.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 8: QUICK ACTIONS BAR */}
      {/* ============================================================ */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg text-xs">
        <div>
          <h4 className="font-extrabold text-white">Unsure Which Visa Category Matches Your Travel Plan?</h4>
          <p className="text-slate-400 mt-0.5">Use our automated AI Visa Matcher or speak with a licensed migration officer.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onNavigateSupport && (
            <button
              onClick={onNavigateSupport}
              className="bg-[#4848F7] hover:bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle size={14} /> Visa Category Consultation
            </button>
          )}
        </div>
      </div>



    </div>
  );
}
