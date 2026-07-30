"use client";

import React, { useState } from "react";
import { Application, VisaStatus } from "../context/VisaContext";
import worldCountriesData from "./worldCountriesSvg.json";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  CheckCircle2,
  Clock,
  FileText,
  CreditCard,
  Calendar,
  AlertCircle,
  ExternalLink,
  Download,
  Upload,
  User,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Sparkles
} from "lucide-react";

// Flag emoji helper for country names
const COUNTRY_FLAGS: Record<string, string> = {
  Canada: "🇨🇦",
  "United States of America": "🇺🇸",
  "United States": "🇺🇸",
  France: "🇫🇷",
  Germany: "🇩🇪",
  "United Kingdom": "🇬🇧",
  Japan: "🇯🇵",
  Australia: "🇦🇺",
  India: "🇮🇳",
  "United Arab Emirates": "🇦🇪",
  Singapore: "🇸🇬",
  Italy: "🇮🇹",
  Spain: "🇪🇸",
  Sweden: "🇸🇪",
  Brazil: "🇧🇷",
  "South Africa": "🇿🇦",
  Nigeria: "🇳🇬",
  China: "🇨🇳",
  Russia: "🇷🇺",
  Mexico: "🇲🇽",
  Argentina: "🇦🇷",
  Egypt: "🇪🇬",
  Turkey: "🇹🇷",
  "Saudi Arabia": "🇸🇦",
  Thailand: "🇹🇭",
  Indonesia: "🇮🇩",
  "South Korea": "🇰🇷",
  "New Zealand": "🇳🇿",
  Switzerland: "🇨🇭",
  Netherlands: "🇳🇱"
};

// Helper for Color Coding based on Visa Status
export const getStatusColor = (status: VisaStatus | string) => {
  switch (status) {
    case "Draft":
      return {
        hex: "#EAB308",
        bg: "bg-amber-500",
        lightBg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-300",
        label: "Draft"
      };
    case "Submitted":
      return {
        hex: "#4848F7",
        bg: "bg-[#4848F7]",
        lightBg: "bg-[#EEF2FF]",
        text: "text-[#4848F7]",
        border: "border-[#4848F7]/30",
        label: "Applied"
      };
    case "Docs Pending":
      return {
        hex: "#EAB308",
        bg: "bg-amber-500",
        lightBg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-300",
        label: "Docs Pending"
      };
    case "Embassy Processing":
    case "Under Review":
      return {
        hex: "#F97316",
        bg: "bg-orange-500",
        lightBg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-300",
        label: "Under Review"
      };
    case "Approved":
      return {
        hex: "#22C55E",
        bg: "bg-emerald-500",
        lightBg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-300",
        label: "Approved"
      };
    case "Rejected":
      return {
        hex: "#EF4444",
        bg: "bg-red-500",
        lightBg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-300",
        label: "Rejected"
      };
    default:
      return {
        hex: "#4848F7",
        bg: "bg-[#4848F7]",
        lightBg: "bg-[#EEF2FF]",
        text: "text-[#4848F7]",
        border: "border-[#4848F7]/30",
        label: "In Review"
      };
  }
};

interface InteractiveWorldMapProps {
  applications: Application[];
  onSelectApplication?: (appId: string) => void;
}

export default function InteractiveWorldMap({
  applications,
  onSelectApplication
}: InteractiveWorldMapProps) {
  // Zoom & Pan State
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Hover & Selection State (Applies to ALL 258 Countries)
  const [hoveredCountry, setHoveredCountry] = useState<any | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.35, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.35, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Click Country Handler (Any of 258 countries)
  const handleCountryClick = (country: any) => {
    setSelectedCountry(country);
    const matchedApp = applications.find(
      (a) =>
        a.destination.toLowerCase() === country.name.toLowerCase() ||
        (country.name === "United States of America" && a.destination === "USA") ||
        (country.name === "United Kingdom" && a.destination === "UK")
    );
    setSelectedApp(matchedApp || null);
    if (matchedApp && onSelectApplication) {
      onSelectApplication(matchedApp.id);
    }
  };

  const activeCountry = selectedCountry || hoveredCountry;

  return (
    <div className="relative w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs select-none">
      
      {/* MAP HEADER BAR */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white z-10">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>Global Visa Interactive Map</span>
            <span className="text-[10px] font-bold bg-[#EEF2FF] text-[#4848F7] px-2.5 py-0.5 rounded-full border border-[#4848F7]/20 flex items-center gap-1">
              <Sparkles size={11} /> 258 Countries Hover-Ready
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            {activeCountry ? (
              <span>
                Active Selection: <strong className="text-[#4848F7]">{activeCountry.name}</strong> &bull; Hover or click any country for glowing outline
              </span>
            ) : (
              "Hover over any country on the map to display smooth glowing border outlines & details"
            )}
          </p>
        </div>

        {/* COLOR CODING LEGEND */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Draft
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4848F7]" /> Applied
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> In Review
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Approved
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Rejected
          </span>
        </div>
      </div>

      {/* INTERACTIVE MAP CONTAINER */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full h-[380px] sm:h-[450px] bg-[#FAFAFC] overflow-hidden cursor-${
          zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default"
        }`}
      >
        {/* ZOOM & PAN WRAPPER */}
        <div
          className="relative w-full h-full transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
            transformOrigin: "center center"
          }}
        >
          {/* ALL 258 WORLD COUNTRIES SVG VECTOR LAYER */}
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full object-contain p-4"
          >
            <defs>
              {/* NEON GLOW FILTER FOR HOVERED / SELECTED COUNTRY OUTLINE */}
              <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g>
              {worldCountriesData.map((country: any, idx: number) => {
                const isSelected = selectedCountry?.name === country.name;
                const isHovered = hoveredCountry?.name === country.name;
                const active = isSelected || isHovered;

                // Match with application if exists
                const matchedApp = applications.find(
                  (a) =>
                    a.destination.toLowerCase() === country.name.toLowerCase() ||
                    (country.name === "United States of America" && a.destination === "USA") ||
                    (country.name === "United Kingdom" && a.destination === "UK")
                );

                const statusColor = matchedApp
                  ? getStatusColor(matchedApp.status).hex
                  : "#4848F7";

                return (
                  <path
                    key={country.iso || country.name || idx}
                    d={country.d}
                    onMouseEnter={() => setHoveredCountry(country)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onClick={() => handleCountryClick(country)}
                    className={`transition-all duration-300 cursor-pointer ${
                      active ? "animate-pulse" : ""
                    }`}
                    style={{
                      fill: active
                        ? `${statusColor}25` // 20% transparent tint
                        : activeCountry
                        ? "#D1D5DB" // faded contrast when another is active
                        : "#E2E8F0", // default clean light grey continent fill
                      stroke: active
                        ? statusColor
                        : activeCountry
                        ? "#FFFFFF"
                        : "#FFFFFF",
                      strokeWidth: isSelected ? 3.5 : isHovered ? 2.5 : 0.75,
                      filter: active ? "url(#neon-glow)" : "none",
                      opacity: active ? 1 : activeCountry ? 0.45 : 0.95
                    }}
                  />
                );
              })}
            </g>
          </svg>

          {/* GLOWING PULSING MARKER DOTS FOR APPLIED COUNTRIES */}
          {applications.map((app) => {
            const countryMatch = worldCountriesData.find(
              (c: any) =>
                c.name.toLowerCase() === app.destination.toLowerCase() ||
                (c.name === "United States of America" && app.destination === "USA") ||
                (c.name === "United Kingdom" && app.destination === "UK")
            );

            if (!countryMatch) return null;

            const isSelected = selectedCountry?.name === countryMatch.name;
            const isHovered = hoveredCountry?.name === countryMatch.name;
            const active = isSelected || isHovered;
            const statusStyle = getStatusColor(app.status);

            return (
              <div
                key={app.id}
                style={{
                  left: `${(countryMatch.cx / 1000) * 100}%`,
                  top: `${(countryMatch.cy / 500) * 100}%`
                }}
                onMouseEnter={() => setHoveredCountry(countryMatch)}
                onMouseLeave={() => setHoveredCountry(null)}
                onClick={() => handleCountryClick(countryMatch)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
              >
                {/* 2-3s PULSING GLOW HALO */}
                <span
                  className={`animate-ping absolute inline-flex rounded-full opacity-75 ${
                    active ? "h-9 w-9 -top-2.5 -left-2.5" : "h-7 w-7 -top-1.5 -left-1.5"
                  }`}
                  style={{ backgroundColor: statusStyle.hex }}
                />

                {/* MAIN GLOWING CIRCULAR DOT */}
                <span
                  className={`relative inline-flex items-center justify-center rounded-full border-2 border-white shadow-md transition-all duration-300 ${
                    active
                      ? "h-5 w-5 scale-130 shadow-xl ring-4 ring-[#4848F7]/30"
                      : "h-4 w-4 hover:scale-125"
                  }`}
                  style={{
                    backgroundColor: statusStyle.hex,
                    boxShadow: active
                      ? `0 0 18px ${statusStyle.hex}`
                      : `0 0 8px ${statusStyle.hex}`
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-90" />
                </span>
              </div>
            );
          })}

          {/* GLASSMORPHISM HOVER TOOLTIP (FOR ANY HOVERED COUNTRY) */}
          {hoveredCountry && (() => {
            const cy = hoveredCountry.cy ?? 250;
            const cx = hoveredCountry.cx ?? 500;
            const isTopRegion = cy < 180;
            const isLeftEdge = cx < 200;
            const isRightEdge = cx > 800;

            let posClasses = isTopRegion ? "translate-y-4" : "-translate-y-full -mt-4";
            if (isLeftEdge) {
              posClasses += " translate-x-0";
            } else if (isRightEdge) {
              posClasses += " -translate-x-full";
            } else {
              posClasses += " -translate-x-1/2";
            }

            return (
              <div
                style={{
                  left: `${(cx / 1000) * 100}%`,
                  top: `${(cy / 500) * 100}%`
                }}
                className={`absolute pointer-events-none z-40 transition-all duration-200 animate-in fade-in zoom-in-95 ${posClasses}`}
              >
                <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xl rounded-2xl p-3.5 text-xs w-60 space-y-2">
                  {/* Country & Flag Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {COUNTRY_FLAGS[hoveredCountry.name] || "🌐"}
                      </span>
                      <span className="font-bold text-slate-800 truncate max-w-[130px]">
                        {hoveredCountry.name}
                      </span>
                    </div>

                    {(() => {
                      const matchedApp = applications.find(
                        (a) =>
                          a.destination.toLowerCase() === hoveredCountry.name.toLowerCase() ||
                          (hoveredCountry.name === "United States of America" && a.destination === "USA") ||
                          (hoveredCountry.name === "United Kingdom" && a.destination === "UK")
                      );
                      if (matchedApp) {
                        const st = getStatusColor(matchedApp.status);
                        return (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${st.lightBg} ${st.text} ${st.border}`}>
                            {st.label}
                          </span>
                        );
                      }
                      return (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          Hovered
                        </span>
                      );
                    })()}
                  </div>

                  {/* Details Content */}
                  {(() => {
                    const matchedApp = applications.find(
                      (a) =>
                        a.destination.toLowerCase() === hoveredCountry.name.toLowerCase() ||
                        (hoveredCountry.name === "United States of America" && a.destination === "USA") ||
                        (hoveredCountry.name === "United Kingdom" && a.destination === "UK")
                    );

                    if (matchedApp) {
                      return (
                        <div className="space-y-1 text-[11px] text-slate-600">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Application ID:</span>
                            <span className="font-mono font-bold text-slate-800">{matchedApp.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Visa Type:</span>
                            <span className="font-semibold text-slate-800">{matchedApp.visaType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Applied On:</span>
                            <span className="font-medium text-slate-700">{matchedApp.submissionDate}</span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <p className="text-[11px] text-slate-500 italic">
                        Click to start a new visa application for {hoveredCountry.name}.
                      </p>
                    );
                  })()}

                  {/* Click Hint */}
                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#4848F7] font-bold">
                    <span>Click for glowing outline & details</span>
                    <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ZOOM & PAN CONTROL WIDGET (Bottom Right) */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-md p-1.5 rounded-xl z-20">
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-600 hover:text-[#4848F7] hover:bg-slate-100 rounded-lg transition"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-600 hover:text-[#4848F7] hover:bg-slate-100 rounded-lg transition"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 text-slate-600 hover:text-[#4848F7] hover:bg-slate-100 rounded-lg transition"
            title="Reset Map"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* ZOOM LEVEL INDICATOR (Bottom Left) */}
        <div className="absolute bottom-4 left-4 text-[10px] font-mono text-slate-500 bg-white/90 backdrop-blur-md border border-slate-200 px-2.5 py-1 rounded-lg shadow-xs">
          Zoom: {Math.round(zoomLevel * 100)}%
        </div>
      </div>

      {/* ============================================================ */}
      {/* SLEEK SIDE PANEL DRAWER FOR SELECTED COUNTRY / VISA DETAILS */}
      {/* ============================================================ */}
      {selectedCountry && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {COUNTRY_FLAGS[selectedCountry.name] || "🌐"}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {selectedCountry.name}
                  </h3>
                  <p className="text-xs font-mono text-[#4848F7] font-semibold">
                    {selectedApp ? `${selectedApp.id} • ${selectedApp.visaType}` : "Consular Destination Node"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCountry(null);
                  setSelectedApp(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              
              {selectedApp ? (
                <>
                  {/* Status Badge Banner */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${getStatusColor(selectedApp.status).lightBg} ${getStatusColor(selectedApp.status).border}`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${getStatusColor(selectedApp.status).bg}`} />
                      <div>
                        <p className={`text-xs font-bold ${getStatusColor(selectedApp.status).text}`}>
                          Status: {getStatusColor(selectedApp.status).label}
                        </p>
                        <p className="text-[11px] text-slate-500">Submitted on {selectedApp.submissionDate}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-700">₹{selectedApp.fees.toLocaleString()}</span>
                  </div>

                  {/* Applicant Details */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
                    <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider text-slate-400">
                      Applicant Credentials
                    </h4>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Traveler Name:</span>
                      <span className="font-bold text-slate-800">{selectedApp.travelerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Passport Number:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedApp.passportNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Planned Travel Dates:</span>
                      <span className="font-semibold text-slate-800">{selectedApp.travelDates}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-[#EEF2FF] border border-[#4848F7]/20 rounded-xl space-y-3 text-xs">
                  <h4 className="font-bold text-[#4848F7] text-sm">
                    Apply for {selectedCountry.name} Visa
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Start a new visa application for {selectedCountry.name}. Upload passport scans, complete AI verification, and submit to consular pipeline.
                  </p>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2">
              <button
                onClick={() => {
                  setSelectedCountry(null);
                  setSelectedApp(null);
                }}
                className="w-full bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm text-center"
              >
                Close Side Panel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
