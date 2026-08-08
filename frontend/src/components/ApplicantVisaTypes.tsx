"use client";

import React, { useState, useMemo } from "react";
import { Application, formatINR } from "../context/VisaContext";
import {
  FileText,
  Briefcase,
  GraduationCap,
  Plane,
  Laptop,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Layers,
  Building,
  User,
  Download,
  HelpCircle,
  ArrowRight,
  Info,
  Globe,
  Tag,
  Zap,
  Sparkles,
  FileCheck
} from "lucide-react";

export interface VisaCategoryInfo {
  id: string;
  categoryName: string;
  subclassCode: string;
  purpose: string;
  iconName: "tourist" | "business" | "student" | "transit" | "nomad" | "work";
  feeRange: string;
  avgProcessing: string;
  validityStay: string;
  entryMode: "Single / Multiple" | "Multiple Entry" | "Single Entry" | "Transit <48h";
  biometricsNeeded: boolean;
  popularDestinations: string[];
  eligibilityCriteria: string[];
  mandatoryDocs: string[];
}

interface ApplicantVisaTypesProps {
  onNavigateApply?: (categoryName?: string) => void;
  onNavigateSupport?: () => void;
}

export default function ApplicantVisaTypes({
  onNavigateApply,
  onNavigateSupport
}: ApplicantVisaTypesProps) {
  // Dataset matching wireframe
  const [categoriesList] = useState<VisaCategoryInfo[]>([
    {
      id: "TYPE-TOURIST",
      categoryName: "Tourist & Leisure Visa",
      subclassCode: "Subclass 600 / Schengen Type C / B1-B2",
      purpose: "Holiday, Sightseeing, Family Visits & Recreation",
      iconName: "tourist",
      feeRange: "₹3,500 - ₹18,500",
      avgProcessing: "48h - 7 Days",
      validityStay: "Up to 10 Yrs (Max 90 Days/visit)",
      entryMode: "Single / Multiple",
      biometricsNeeded: true,
      popularDestinations: ["Australia 🇦🇺", "France 🇫🇷", "UK 🇬🇧", "US 🇺🇸", "UAE 🇦🇪"],
      eligibilityCriteria: [
        "Proof of sufficient funds for stay duration",
        "Confirmed round-trip flight & hotel bookings",
        "Strong ties to home country (employment/property)",
        "Valid passport with 6 months validity"
      ],
      mandatoryDocs: ["Passport Copy", "Bank Statements 6 Mo", "ITR V 3 Years", "Hotel/Flight Reservation"]
    },
    {
      id: "TYPE-[#4848F7]",
      categoryName: "Business & Conference Visa",
      subclassCode: "Subclass 600 Business / B1 / Short-Stay Business",
      purpose: "Commercial Meetings, Trade Fairs, Corporate Expos & Negotiations",
      iconName: "business",
      feeRange: "₹6,500 - ₹22,000",
      avgProcessing: "3 - 10 Days",
      validityStay: "1 - 5 Years (Max 90 Days/visit)",
      entryMode: "Multiple Entry",
      biometricsNeeded: true,
      popularDestinations: ["Germany 🇩🇪", "Singapore 🇸🇬", "Japan 🇯🇵", "US 🇺🇸", "UK 🇬🇧"],
      eligibilityCriteria: [
        "Official invitation letter from host company",
        "Employer cover letter stating business purpose",
        "Trade registration certificate (if business owner)",
        "Proof of conference or meeting registration"
      ],
      mandatoryDocs: ["Invitation Letter", "Company Cover Letter", "Incorporation Cert", "Personal & Corporate Bank Proof"]
    },
    {
      id: "TYPE-STUDENT",
      categoryName: "Student & Academic Study Visa",
      subclassCode: "Subclass 500 / F-1 Student / Tier 4",
      purpose: "Higher Education, University Courses, Research & Exchange",
      iconName: "student",
      feeRange: "₹18,000 - ₹45,000",
      avgProcessing: "15 - 30 Days",
      validityStay: "Duration of Study Course (+ 60 Days)",
      entryMode: "Multiple Entry",
      biometricsNeeded: true,
      popularDestinations: ["Canada 🇨🇦", "UK 🇬🇧", "US 🇺🇸", "Australia 🇦🇺", "Germany 🇩🇪"],
      eligibilityCriteria: [
        "Official Letter of Acceptance / CAS / I-20",
        "Proof of tuition fee payment & living expenses",
        "IELTS / TOEFL English proficiency scores",
        "Academic transcripts & degree certificates"
      ],
      mandatoryDocs: ["University Admission Offer", "Fee Payment Receipt", "Sponsorship Affidavit", "Medical & Police Clearance"]
    },
    {
      id: "TYPE-TRANSIT",
      categoryName: "Transit & Layover Visa",
      subclassCode: "Subclass 771 / C-3 Transit / Airport Layover",
      purpose: "Connecting International Flights & Layover Clearance",
      iconName: "transit",
      feeRange: "Free - ₹4,500",
      avgProcessing: "24h - 48 Hours",
      validityStay: "48 - 72 Hours max layover",
      entryMode: "Single Entry",
      biometricsNeeded: false,
      popularDestinations: ["Qatar 🇶🇦", "UAE 🇦🇪", "UK 🇬🇧", "Singapore 🇸🇬"],
      eligibilityCriteria: [
        "Confirmed onward destination flight ticket",
        "Valid visa for the final destination country",
        "Layover duration between 8 to 48 hours"
      ],
      mandatoryDocs: ["Confirmed Onward Flight Ticket", "Final Destination Visa", "Passport Copy"]
    },
    {
      id: "TYPE-NOMAD",
      categoryName: "Digital Nomad & Remote Work Visa",
      subclassCode: "DNV Remote Worker / Freelancer Permit",
      purpose: "Location-Independent Work & Long-Term Stay",
      iconName: "nomad",
      feeRange: "₹25,000 - ₹65,000",
      avgProcessing: "14 - 30 Days",
      validityStay: "1 - 2 Years (Renewable)",
      entryMode: "Multiple Entry",
      biometricsNeeded: true,
      popularDestinations: ["Portugal 🇵🇹", "Spain 🇪🇸", "Dubai 🇦🇪", "Thailand 🇹🇭", "Bali 🇮🇩"],
      eligibilityCriteria: [
        "Proof of remote employment or foreign client contracts",
        "Minimum monthly income of $2,500 - $3,500 USD",
        "Comprehensive global health insurance cover",
        "Clean criminal background check record"
      ],
      mandatoryDocs: ["Remote Work Contracts", "Bank Statement (6 Months)", "Health Insurance Policy", "Police Background Verification"]
    },
    {
      id: "TYPE-WORK",
      categoryName: "Employment & Work Permit Visa",
      subclassCode: "H-1B / Skilled Worker / Subclass 482",
      purpose: "Local Corporate Employment & Skilled Work Contracts",
      iconName: "work",
      feeRange: "₹35,000 - ₹95,000",
      avgProcessing: "30 - 60 Days",
      validityStay: "2 - 5 Years (PR Pathway)",
      entryMode: "Multiple Entry",
      biometricsNeeded: true,
      popularDestinations: ["Germany 🇩🇪", "Canada 🇨🇦", "Australia 🇦🇺", "US 🇺🇸", "UK 🇬🇧"],
      eligibilityCriteria: [
        "Approved Labor Condition Application / Sponsor Sponsorship",
        "Formal job offer letter & employment contract",
        "Relevant degree qualification & work experience",
        "Salary meeting threshold guidelines"
      ],
      mandatoryDocs: ["Sponsor Approval Certificate", "Work Contract", "Degree Equivalency Assessment", "Medical Fitness Certificate"]
    }
  ]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [selectedCatId, setSelectedCatId] = useState<string>("TYPE-TOURIST");

  const activeCategory = useMemo(() => {
    return categoriesList.find((c) => c.id === selectedCatId) || categoriesList[0];
  }, [categoriesList, selectedCatId]);

  // Metrics
  const metrics = useMemo(() => {
    const total = categoriesList.length;
    return { total, tourist: 140, business: 115, transit: 65, student: 45, nomad: 22 };
  }, [categoriesList]);

  // Filtered Categories
  const filteredCategories = useMemo(() => {
    return categoriesList.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesQ =
        c.categoryName.toLowerCase().includes(q) ||
        c.subclassCode.toLowerCase().includes(q) ||
        c.purpose.toLowerCase().includes(q);

      const matchesPurpose = purposeFilter === "all" || c.categoryName.toLowerCase().includes(purposeFilter.toLowerCase());

      return matchesQ && matchesPurpose;
    });
  }, [categoriesList, searchQuery, purposeFilter]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & VISA CLASSIFICATION BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Explore Visas</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Visa Types</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Visa Subtypes & Classification Guide</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck size={12} className="text-emerald-600" /> Consular Verified Guidelines
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Explore all visa classification categories including Tourist, Business, Student, Transit, Work, and Digital Nomad visas with eligibility criteria and fee structures.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (onNavigateApply) onNavigateApply(activeCategory.categoryName);
            }}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Plane size={16} />
            <span>Apply for {activeCategory.categoryName}</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: DASHBOARD STATISTICS CARDS GRID (6 CARDS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Categories */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Main Categories</p>
          <p className="text-2xl font-black text-[#4848F7] mt-1">08</p>
          <span className="text-[10px] text-[#4848F7] font-semibold">Global subclasses</span>
        </div>

        {/* Card 2: Tourist Visas */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Tourist Visas</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">140</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <Plane size={10} /> Countries
          </span>
        </div>

        {/* Card 3: Business Visas */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Business Visas</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">115</p>
          <span className="text-[10px] text-indigo-600 font-medium">Corporate hubs</span>
        </div>

        {/* Card 4: Transit Visas */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Transit Visas</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">65</p>
          <span className="text-[10px] text-slate-400 font-medium">Airport layovers</span>
        </div>

        {/* Card 5: Student & Work */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Study & Work</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">45</p>
          <span className="text-[10px] text-slate-400 font-medium">Long-term permits</span>
        </div>

        {/* Card 6: Digital Nomad */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Digital Nomad</p>
          <p className="text-2xl font-black text-amber-600 mt-1">22</p>
          <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
            <Laptop size={10} /> Remote work
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CONCEPTUAL WORKFLOW BANNER (CONNECTED VISA SUBTYPE SELECTION FLOW) */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Visa Subtype Selection Workflow (Purpose ➔ Subclass ➔ Eligibility ➔ Wizard Application)
            </h3>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
            Consular Rule Engine
          </span>
        </div>

        {/* Workflow Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 1</span>
            <p className="text-white">Select Primary Travel Purpose</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 2</span>
            <p className="text-white">Match Visa Subclass & Entry Mode</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 3</span>
            <p className="text-white">Verify Financials & Required Docs</p>
          </div>

          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Step 4</span>
            <p className="font-bold">Start Visa Application Wizard ✓</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl text-xs space-y-1 text-slate-300">
          <p className="font-bold text-white">Professional Classification Rules:</p>
          <ul className="list-disc pl-4 space-y-1 leading-relaxed text-[11px]">
            <li>Applying under the wrong visa category (e.g. working on a Tourist visa) results in immediate consular refusal.</li>
            <li>Business visas permit attending meetings and trade expos but strictly forbid gainful local employment.</li>
            <li>Student visa holders are generally restricted to 20 hours per week of part-time work during academic terms.</li>
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
              placeholder="Search Category, Subclass Code, Purpose..."
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

          {/* Purpose Filter */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Travel Purposes</option>
              <option value="tourist">Tourism & Holiday</option>
              <option value="business">Business & Meetings</option>
              <option value="student">Study & Academic</option>
              <option value="nomad">Digital Nomad</option>
              <option value="work">Work Employment</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: VISA TYPES SHOWCASE CARDS GRID */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((c) => {
          const isSelected = c.id === selectedCatId;
          return (
            <div
              key={c.id}
              onClick={() => setSelectedCatId(c.id)}
              className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected ? "border-[#4848F7] ring-2 ring-[#4848F7]/20" : "border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-indigo-50 text-[#4848F7] rounded-xl">
                      {c.iconName === "tourist" && <Plane size={20} />}
                      {c.iconName === "business" && <Briefcase size={20} />}
                      {c.iconName === "student" && <GraduationCap size={20} />}
                      {c.iconName === "transit" && <Globe size={20} />}
                      {c.iconName === "nomad" && <Laptop size={20} />}
                      {c.iconName === "work" && <Building size={20} />}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{c.categoryName}</h3>
                      <span className="text-[10px] text-slate-400 font-mono font-semibold">{c.subclassCode}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {c.purpose}
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Fee Range:</span>
                    <span className="font-black text-[#4848F7]">{c.feeRange}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Processing Time:</span>
                    <span className="font-semibold text-slate-800">{c.avgProcessing}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Validity & Stay:</span>
                    <span className="font-semibold text-slate-800">{c.validityStay}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCatId(c.id);
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-[#4848F7] transition"
                >
                  Inspect Requirements
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onNavigateApply) onNavigateApply(c.categoryName);
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
      {/* SECTION 6: VISA SUBCLASSES DIRECTORY TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileText size={16} className="text-[#4848F7]" />
            <span>Visa Classification & Subclass Comparison Table ({filteredCategories.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Visa Category</th>
                <th className="py-3 px-4">Subclass Code</th>
                <th className="py-3 px-4">Fee Range</th>
                <th className="py-3 px-4">Avg Processing</th>
                <th className="py-3 px-4">Validity & Stay</th>
                <th className="py-3 px-4">Entry Mode</th>
                <th className="py-3 px-4">Biometrics</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map((c) => {
                const isSelected = c.id === selectedCatId;
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCatId(c.id)}
                    className={`cursor-pointer transition hover:bg-indigo-50/40 ${
                      isSelected ? "bg-indigo-50/80 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4848F7]" />}
                      {c.categoryName}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">{c.subclassCode}</td>

                    <td className="py-3.5 px-4 font-black text-slate-900">{c.feeRange}</td>

                    <td className="py-3.5 px-4 text-slate-700">{c.avgProcessing}</td>

                    <td className="py-3.5 px-4 text-slate-600">{c.validityStay}</td>

                    <td className="py-3.5 px-4 text-slate-800 font-medium">{c.entryMode}</td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        c.biometricsNeeded ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}>
                        {c.biometricsNeeded ? "Mandatory" : "Exempt"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          if (onNavigateApply) onNavigateApply(c.categoryName);
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
      {/* SECTION 7: SELECTED VISA CATEGORY REQUIREMENTS INSPECTOR CARD */}
      {/* ============================================================ */}
      {activeCategory && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">{activeCategory.categoryName} Requirements & Checklist</h3>
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                  {activeCategory.subclassCode}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{activeCategory.purpose}</p>
            </div>

            <button
              onClick={() => {
                if (onNavigateApply) onNavigateApply(activeCategory.categoryName);
              }}
              className="bg-[#4848F7] hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Plane size={16} />
              <span>Apply for {activeCategory.categoryName}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Eligibility Criteria */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <ShieldCheck size={16} className="text-[#4848F7]" /> Key Consular Eligibility Criteria
              </h4>

              <div className="space-y-2">
                {activeCategory.eligibilityCriteria.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory Documents */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <FileCheck size={16} className="text-[#4848F7]" /> Mandatory Supporting Documents
              </h4>

              <div className="space-y-2">
                {activeCategory.mandatoryDocs.map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-700">
                    <FileText size={15} className="text-[#4848F7] shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-800">{doc}</span>
                  </div>
                ))}
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

      {/* ============================================================ */}
      {/* SECTION 9: VISA TYPES FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Visa Subtypes</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Can I convert a Tourist Visa to a Work Visa in-country?</p>
            <p className="text-slate-600 leading-relaxed">
              Most destinations require work visa applications to be lodged from your home country. Converting in-country is generally prohibited without prior consular approval.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">What documents are required for a Business Visa invitation letter?</p>
            <p className="text-slate-600 leading-relaxed">
              The invitation letter must be on official host company letterhead, specifying passport details, event dates, purpose of meeting, and financial responsibility.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
