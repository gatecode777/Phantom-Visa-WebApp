"use client";

import React, { useState, useMemo } from "react";
import { Application, formatINR } from "../context/VisaContext";
import { API_V1_URL } from "../config/api";
import {
  Clock,
  Zap,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Layers,
  Building,
  User,
  Download,
  HelpCircle,
  ArrowRight,
  Plane,
  ShieldCheck,
  FileText,
  Info,
  TrendingUp,
  Activity,
  Send,
  Timer
} from "lucide-react";

export interface CountryProcessingRecord {
  id: string;
  country: string;
  flag: string;
  subclass: string;
  standardDays: string;
  expressDays: string;
  peakSeasonAdvisory: string;
  consularQueueLevel: "Low Queue" | "Moderate Volume" | "High Summer Peak";
  expressAvailable: boolean;
  timelineStages: { stage: string; days: number; description: string }[];
}

interface ApplicantVisaProcessingTimeProps {
  onNavigateApply?: (countryName?: string) => void;
  onNavigateSupport?: () => void;
}

export default function ApplicantVisaProcessingTime({
  onNavigateApply,
  onNavigateSupport
}: ApplicantVisaProcessingTimeProps) {
  const [processingData, setProcessingData] = useState<CountryProcessingRecord[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [speedFilter, setSpeedFilter] = useState("all");
  const [queueFilter, setQueueFilter] = useState("all");

  // Interactive Estimator Calculator State
  const [calcSubmissionDate, setCalcSubmissionDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [calcSpeedMode, setCalcSpeedMode] = useState<"standard" | "express">("express");

  const activeRecord = useMemo(() => {
    return processingData.find((p) => p.id === selectedCountryId) || processingData[0];
  }, [processingData, selectedCountryId]);

  // Calculated Estimated Delivery Date
  const estimatedDeliveryDate = useMemo(() => {
    const baseDays = calcSpeedMode === "express" ? 2 : 7;
    const dateObj = new Date(calcSubmissionDate || Date.now());
    dateObj.setDate(dateObj.getDate() + baseDays);
    return dateObj.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  }, [calcSubmissionDate, calcSpeedMode]);

  // Filtered List
  const filteredData = useMemo(() => {
    return processingData.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesQ =
        p.country.toLowerCase().includes(q) ||
        p.subclass.toLowerCase().includes(q) ||
        p.standardDays.toLowerCase().includes(q);

      const matchesSpeed = speedFilter === "all" || (speedFilter === "express" && p.expressAvailable);
      const matchesQueue = queueFilter === "all" || p.consularQueueLevel === queueFilter;

      return matchesQ && matchesSpeed && matchesQueue;
    });
  }, [processingData, searchQuery, speedFilter, queueFilter]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & PROCESSING SPEED BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Explore Visas</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Processing Time</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Consular Processing Speed & Turnaround Hub</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Activity size={12} className="text-emerald-600 animate-pulse" /> Live Consular Queue Tracking
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Track standard turnaround times, express processing options, seasonal delay advisories, and estimated dispatch dates across 180+ global consulates.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (onNavigateApply && activeRecord) onNavigateApply(activeRecord.country);
            }}
            disabled={!activeRecord}
            className="bg-[#4848F7] hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Plane size={16} />
            <span>Apply for {activeRecord ? activeRecord.country : ""} Visa</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: DASHBOARD STATISTICS CARDS GRID (6 CARDS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Fastest e-Visa Speed */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Fastest e-Visa</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">24 Hours</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <Zap size={10} /> UAE, Singapore, Oman
          </span>
        </div>

        {/* Card 2: Avg Standard Turnaround */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Avg Standard</p>
          <p className="text-2xl font-black text-[#4848F7] mt-1">3-5 Days</p>
          <span className="text-[10px] text-[#4848F7] font-semibold">Standard consular speed</span>
        </div>

        {/* Card 3: Schengen Lead Time */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Schengen Area</p>
          <p className="text-xl font-bold text-slate-900 mt-1">10-15 Days</p>
          <span className="text-[10px] text-slate-400 font-medium">VFS appointment queue</span>
        </div>

        {/* Card 4: Express Service Available */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Express Service</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">55 Destinations</p>
          <span className="text-[10px] text-indigo-600 font-medium">Fast-track dispatch</span>
        </div>

        {/* Card 5: Peak Season Delay Alert */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Summer Peak Alert</p>
          <p className="text-xl font-bold text-amber-700 mt-1">+3 to +5 Days</p>
          <span className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
            <AlertTriangle size={10} /> High queue volume
          </span>
        </div>

        {/* Card 6: Turnaround Accuracy */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Accuracy Rate</p>
          <p className="text-2xl font-black text-slate-900 mt-1">98.9%</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 size={10} /> On-time delivery
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CONCEPTUAL WORKFLOW BANNER (CONNECTED PROCESSING AUDIT PIPELINE) */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Consular Processing Audit Pipeline (Lodged ➔ Consular Desk ➔ Security Verification ➔ Stamped Dispatch)
            </h3>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
            Live Queue Tracker
          </span>
        </div>

        {/* Pipeline Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 1</span>
            <p className="text-white">Application & Fees Lodged</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 2</span>
            <p className="text-white">Consular Desk / VFS Entry</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 3</span>
            <p className="text-white">Background & VIS Security Scan</p>
          </div>

          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Stage 4</span>
            <p className="font-bold">Visa Stamped & Courier Dispatched ✓</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl text-xs space-y-1 text-slate-300">
          <p className="font-bold text-white">Consular Processing Turnaround Advisory:</p>
          <ul className="list-disc pl-4 space-y-1 leading-relaxed text-[11px]">
            <li>Processing times start strictly AFTER biometrics collection and physical passport receipt at the consular desk.</li>
            <li>Consular holidays and embassy closures add non-working days to total turnaround time.</li>
            <li>Express fast-track fees are non-refundable regardless of consular outcome.</li>
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
              placeholder="Search Destination, Subclass, Speed..."
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

          {/* Speed & Queue Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
            <select
              value={speedFilter}
              onChange={(e) => setSpeedFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Service Speeds</option>
              <option value="express">Express Fast-Track Available</option>
            </select>

            <select
              value={queueFilter}
              onChange={(e) => setQueueFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#4848F7]"
            >
              <option value="all">All Queue Volumes</option>
              <option value="Low Queue">Low Queue</option>
              <option value="Moderate Volume">Moderate Volume</option>
              <option value="High Summer Peak">High Summer Peak</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: PROCESSING SERVICE TIERS SHOWCASE CARDS (4 TIERS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tier 1: Super Express e-Visa */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-2 text-emerald-600">
            <Zap size={18} />
            <h3 className="font-extrabold text-slate-900 text-sm">Super Express e-Visa</h3>
          </div>
          <p className="text-2xl font-black text-emerald-600">24-48 Hours</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fully digital processing without physical passport submission. Instant PDF delivery to email and document vault.
          </p>
          <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-700">
            Destinations: UAE 🇦🇪, Singapore 🇸🇬, Oman 🇴🇲, Vietnam 🇻🇳
          </div>
        </div>

        {/* Tier 2: Express Consular Dispatch */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 border-t-4 border-t-[#4848F7]">
          <div className="flex items-center gap-2 text-[#4848F7]">
            <Timer size={18} />
            <h3 className="font-extrabold text-slate-900 text-sm">Express Fast-Track</h3>
          </div>
          <p className="text-2xl font-black text-[#4848F7]">3 - 5 Days</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Priority queue processing at the consulate with expedited biometric slot scheduling and fast-track courier return.
          </p>
          <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-700">
            Destinations: France 🇫🇷, Australia 🇦🇺, Japan 🇯🇵, UK 🇬🇧
          </div>
        </div>

        {/* Tier 3: Standard Consular Processing */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 border-t-4 border-t-indigo-500">
          <div className="flex items-center gap-2 text-indigo-600">
            <Clock size={18} />
            <h3 className="font-extrabold text-slate-900 text-sm">Standard Consular</h3>
          </div>
          <p className="text-2xl font-black text-indigo-600">7 - 15 Days</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Regular consular processing queue for sticker visas requiring physical passport stamping and biometric verification.
          </p>
          <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-700">
            Destinations: UK 🇬🇧, USA 🇺🇸, Schengen Area 🇪🇺, Canada 🇨🇦
          </div>
        </div>

        {/* Tier 4: Long-Term Work & Study Permits */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 border-t-4 border-t-amber-500">
          <div className="flex items-center gap-2 text-amber-600">
            <Building size={18} />
            <h3 className="font-extrabold text-slate-900 text-sm">Long-Term Permits</h3>
          </div>
          <p className="text-2xl font-black text-amber-700">30 - 60 Days</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            In-depth security, academic background, and labor market clearance for long-term work, residence, and student permits.
          </p>
          <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-700">
            Destinations: Australia 🇦🇺, Canada 🇨🇦, Germany 🇩🇪, USA 🇺🇸
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 6: COUNTRY PROCESSING SPEEDS DIRECTORY TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Clock size={16} className="text-[#4848F7]" />
            <span>Country Processing Speeds & Consular Queue Directory ({filteredData.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Destination Country</th>
                <th className="py-3 px-4">Subclass</th>
                <th className="py-3 px-4">Standard Turnaround</th>
                <th className="py-3 px-4">Express Option</th>
                <th className="py-3 px-4">Peak Season Advisory</th>
                <th className="py-3 px-4">Queue Level</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    No country processing records found in database.
                  </td>
                </tr>
              ) : (
                filteredData.map((p) => {
                const isSelected = p.id === selectedCountryId;
                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedCountryId(p.id)}
                    className={`cursor-pointer transition hover:bg-indigo-50/40 ${
                      isSelected ? "bg-indigo-50/80 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4848F7]" />}
                      <span className="text-lg">{p.flag}</span>
                      <span>{p.country}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{p.subclass}</td>

                    <td className="py-3.5 px-4 font-black text-slate-900">{p.standardDays}</td>

                    <td className="py-3.5 px-4 font-bold text-emerald-600">{p.expressDays}</td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">{p.peakSeasonAdvisory}</td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        p.consularQueueLevel === "Low Queue"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : p.consularQueueLevel === "Moderate Volume"
                          ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}>
                        {p.consularQueueLevel}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedCountryId(p.id)}
                        className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg transition text-[11px] cursor-pointer"
                      >
                        Calculate Timeline
                      </button>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 7: INTERACTIVE TURNAROUND ESTIMATOR & TIMELINE CALCULATOR */}
      {/* ============================================================ */}
      {activeRecord && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{activeRecord.flag}</span>
              <div>
                <h3 className="text-lg font-black text-slate-900">{activeRecord.country} Consular Processing Timeline Estimator</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Subclass: {activeRecord.subclass} &bull; Standard: {activeRecord.standardDays} &bull; Express: {activeRecord.expressDays}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (onNavigateApply) onNavigateApply(activeRecord.country);
                }}
                className="bg-[#4848F7] hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <Plane size={16} />
                <span>Apply for {activeRecord.country} Visa</span>
              </button>
            </div>
          </div>

          {/* Interactive Calculator Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Submission Date</label>
              <input
                type="date"
                value={calcSubmissionDate}
                onChange={(e) => setCalcSubmissionDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Service Speed Tier</label>
              <select
                value={calcSpeedMode}
                onChange={(e) => setCalcSpeedMode(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-800"
              >
                <option value="express">Express Fast-Track ({activeRecord.expressDays})</option>
                <option value="standard">Standard Processing ({activeRecord.standardDays})</option>
              </select>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex flex-col justify-center items-center text-center">
              <span className="text-[10px] text-emerald-700 font-bold uppercase">Estimated Visa Dispatch</span>
              <p className="text-base font-black text-emerald-800 mt-0.5">{estimatedDeliveryDate}</p>
            </div>
          </div>

          {/* Visual Timeline Stages Breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Layers size={16} className="text-[#4848F7]" /> Sequential Consular Stage Breakdown
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              {activeRecord.timelineStages.map((stage, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1 relative">
                  <div className="flex items-center justify-between text-[10px] font-bold text-indigo-700">
                    <span>STAGE {idx + 1}</span>
                    <span>+{stage.days} DAY(S)</span>
                  </div>
                  <p className="font-bold text-slate-900">{stage.stage}</p>
                  <p className="text-[11px] text-slate-500">{stage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 8: QUICK ACTIONS BAR */}
      {/* ============================================================ */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg text-xs">
        <div>
          <h4 className="font-extrabold text-white">Have an Urgent Travel Date for Work or Emergency?</h4>
          <p className="text-slate-400 mt-0.5">Contact our expedited consular desk for priority appointment booking and fast-track processing.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onNavigateSupport && (
            <button
              onClick={onNavigateSupport}
              className="bg-[#4848F7] hover:bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle size={14} /> Request Priority Dispatch
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 9: VISA PROCESSING TIME FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Processing Speed</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Can I pay extra to speed up a pending application?</p>
            <p className="text-slate-600 leading-relaxed">
              Express fast-track fees must generally be selected prior to biometric submission. Once an application is under consular review, speed upgrades depend on embassy policy.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Why do processing times increase during summer months?</p>
            <p className="text-slate-600 leading-relaxed">
              Summer months (May to August) experience a massive surge in holiday tourist and student visa applications, causing extended queues at VFS biometrics centers and consular desks.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
