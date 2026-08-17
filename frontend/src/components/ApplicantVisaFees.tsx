"use client";

import React, { useState, useMemo } from "react";
import { Application, formatINR } from "../context/VisaContext";
import { API_V1_URL } from "../config/api";
import {
  DollarSign,
  CreditCard,
  Receipt,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Layers,
  Building,
  User,
  Download,
  HelpCircle,
  ArrowRight,
  Plane,
  FileText,
  Info,
  Calculator,
  Percent,
  Lock,
  Sparkles,
  Users
} from "lucide-react";

export interface CountryFeeRecord {
  id: string;
  country: string;
  flag: string;
  subclass: string;
  govtFeeINR: number;
  serviceChargeINR: number;
  gstRatePercent: number; // e.g. 18
  expressAddonINR: number;
  doorstepCourierINR: number;
  insuranceINR: number;
}

interface ApplicantVisaFeesProps {
  onNavigateApply?: (countryName?: string) => void;
  onNavigateCheckout?: () => void;
  onNavigateSupport?: () => void;
}

export default function ApplicantVisaFees({
  onNavigateApply,
  onNavigateCheckout,
  onNavigateSupport
}: ApplicantVisaFeesProps) {
  const [feesData, setFeesData] = useState<CountryFeeRecord[]>([]);
  const [selectedFeeId, setSelectedFeeId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState<"INR" | "USD" | "EUR">("INR");
  const [regionFilter, setRegionFilter] = useState("all");

  // Dynamic fetch from API
  React.useEffect(() => {
    fetch(`${API_V1_URL}/countries`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          const mapped: CountryFeeRecord[] = json.data.map((c: any) => ({
            id: c.countryCode || c._id || c.name,
            country: c.name,
            flag: c.flagEmoji || "🌐",
            subclass: c.visaTypes?.[0]?.name || "Standard Tourist / Visitor",
            govtFeeINR: c.visaTypes?.[0]?.govtFee || c.govtFee || 0,
            serviceChargeINR: c.visaTypes?.[0]?.serviceFee || c.serviceFee || 0,
            gstRatePercent: 18,
            expressAddonINR: c.expressFee || 0,
            doorstepCourierINR: 450,
            insuranceINR: 1200
          }));
          setFeesData(mapped);
          if (mapped.length > 0) {
            setSelectedFeeId(mapped[0].id);
          }
        } else {
          setFeesData([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch country fee data:", err);
        setFeesData([]);
      });
  }, []);

  // Calculator State
  const [calcAdults, setCalcAdults] = useState<number>(1);
  const [calcChildren, setCalcChildren] = useState<number>(0);
  const [includeExpress, setIncludeExpress] = useState<boolean>(true);
  const [includeCourier, setIncludeCourier] = useState<boolean>(true);
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);

  const activeFeeRecord = useMemo(() => {
    return feesData.find((f) => f.id === selectedFeeId) || feesData[0];
  }, [feesData, selectedFeeId]);

  // Currency multiplier
  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";
  const currencyRate = currency === "INR" ? 1 : currency === "USD" ? 0.012 : 0.011;

  const formatPrice = (inrAmount: number) => {
    const val = inrAmount * currencyRate;
    if (currency === "INR") return `₹${formatINR(Math.round(val))}`;
    return `${currencySymbol}${val.toFixed(2)}`;
  };

  // Detailed Calculator Calculations
  const totalTravelers = calcAdults + calcChildren;
  const baseGovtTotal = activeFeeRecord.govtFeeINR * totalTravelers;
  const baseServiceTotal = activeFeeRecord.serviceChargeINR * totalTravelers;
  const expressTotal = includeExpress ? activeFeeRecord.expressAddonINR * totalTravelers : 0;
  const courierTotal = includeCourier ? activeFeeRecord.doorstepCourierINR : 0;
  const insuranceTotal = includeInsurance ? activeFeeRecord.insuranceINR * totalTravelers : 0;

  const subtotalBeforeTax = baseGovtTotal + baseServiceTotal + expressTotal + courierTotal + insuranceTotal;
  const gstAmount = Math.round(baseServiceTotal * 0.18); // 18% GST on service charges
  const grandTotalINR = subtotalBeforeTax + gstAmount;

  // Filtered List
  const filteredFees = useMemo(() => {
    return feesData.filter((f) => {
      const q = searchQuery.toLowerCase();
      const matchesQ =
        f.country.toLowerCase().includes(q) ||
        f.subclass.toLowerCase().includes(q) ||
        f.govtFeeINR.toString().includes(q);

      return matchesQ;
    });
  }, [feesData, searchQuery]);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & CONSULAR FEES TARIFF BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Explore Visas</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Visa Fees</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Global Consular Fees & Service Tariff Guide</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck size={12} className="text-emerald-600" /> 100% Guaranteed Zero Hidden Costs
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Transparent breakdown of official government consular fees, VFS Global service charges, GST tax rates, and express fast-track add-ons.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (onNavigateApply) onNavigateApply(activeFeeRecord.country);
            }}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Plane size={16} />
            <span>Apply for {activeFeeRecord.country} Visa</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: DASHBOARD STATISTICS CARDS GRID (6 CARDS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Lowest eVisa Fee */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Lowest eVisa Fee</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{formatPrice(2200)}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <DollarSign size={10} /> Singapore, Oman, UAE
          </span>
        </div>

        {/* Card 2: Avg Consular Fee */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Avg Consular Fee</p>
          <p className="text-2xl font-black text-[#4848F7] mt-1">{formatPrice(10500)}</p>
          <span className="text-[10px] text-[#4848F7] font-semibold">Standard embassy fee</span>
        </div>

        {/* Card 3: VFS Service Charge */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">VFS Service Fee</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{formatPrice(1850)}</p>
          <span className="text-[10px] text-slate-400 font-medium">Logistics & biometrics</span>
        </div>

        {/* Card 4: GST Tax Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">GST Tax Rate</p>
          <p className="text-2xl font-black text-slate-900 mt-1">18% GST</p>
          <span className="text-[10px] text-slate-400 font-medium">9% CGST + 9% SGST</span>
        </div>

        {/* Card 5: Transparency Score */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Transparency</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">100%</p>
          <span className="text-[10px] text-indigo-600 font-medium">Itemized GST Invoices</span>
        </div>

        {/* Card 6: Payment Protection */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-600">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Protection</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">Insured</p>
          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <Lock size={10} /> 256-Bit SSL Checkout
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CONCEPTUAL WORKFLOW BANNER (CONNECTED FEE TRANSPARENCY PIPELINE) */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Fee Transparency Pipeline (Select Destination ➔ Itemized Estimate ➔ Secure Gateway ➔ Official GST Invoice Issued)
            </h3>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
            Zero Hidden Surcharges
          </span>
        </div>

        {/* Pipeline Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 1</span>
            <p className="text-white">Select Destination & Subclass</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 2</span>
            <p className="text-white">Itemized Fee & Tax Estimate</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 3</span>
            <p className="text-white">Secure Payment via UPI/Card</p>
          </div>

          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Step 4</span>
            <p className="font-bold">Official GST Invoice Issued ✓</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl text-xs space-y-1 text-slate-300">
          <p className="font-bold text-white">Consular Fee Non-Refundability Policy Notice:</p>
          <ul className="list-disc pl-4 space-y-1 leading-relaxed text-[11px]">
            <li>Official embassy consular fees are retained by the government authority and are strictly non-refundable once an application is lodged.</li>
            <li>Phantom service charges cover pre-audit verification and are eligible for our Visa Refusal Guarantee Insurance.</li>
            <li>All transactions generate an instant downloadable GST tax invoice with full CGST & SGST breakdowns.</li>
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
              placeholder="Search Destination, Subclass, Fee Amount..."
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

          {/* Currency Converter Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setCurrency("INR")}
              className={`px-3 py-1.5 rounded-lg transition ${currency === "INR" ? "bg-white text-[#4848F7] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
            >
              INR (₹)
            </button>

            <button
              onClick={() => setCurrency("USD")}
              className={`px-3 py-1.5 rounded-lg transition ${currency === "USD" ? "bg-white text-[#4848F7] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
            >
              USD ($)
            </button>

            <button
              onClick={() => setCurrency("EUR")}
              className={`px-3 py-1.5 rounded-lg transition ${currency === "EUR" ? "bg-white text-[#4848F7] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
            >
              EUR (€)
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: FEE COMPONENTS BREAKDOWN SHOWCASE CARDS (4 CARDS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Component 1: Govt Consular Fee */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 border-t-4 border-t-[#4848F7]">
          <div className="flex items-center gap-2 text-[#4848F7]">
            <Building size={18} />
            <h3 className="font-extrabold text-slate-900 text-sm">Govt Consular Fee</h3>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatPrice(10500)}</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Official mandatory fee mandated directly by the foreign ministry or embassy. Non-refundable upon submission.
          </p>
        </div>

        {/* Component 2: VFS Service Fee */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 border-t-4 border-t-indigo-500">
          <div className="flex items-center gap-2 text-indigo-600">
            <User size={18} />
            <h3 className="font-extrabold text-slate-900 text-sm">VFS Logistics Fee</h3>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatPrice(1850)}</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Application center handling fee for biometric appointment scheduling, document scanning, and physical counter verification.
          </p>
        </div>

        {/* Component 3: Phantom Concierge Fee */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-2 text-emerald-600">
            <Sparkles size={18} />
            <h3 className="font-extrabold text-slate-900 text-sm">Phantom Concierge</h3>
          </div>
          <p className="text-2xl font-black text-emerald-600">{formatPrice(1500)}</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Includes AI document OCR verification, professional cover letter generation, day-wise itinerary formatting, and dedicated support.
          </p>
        </div>

        {/* Component 4: GST Tax Rate */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 border-t-4 border-t-amber-500">
          <div className="flex items-center gap-2 text-amber-600">
            <Percent size={18} />
            <h3 className="font-extrabold text-slate-900 text-sm">Government GST (18%)</h3>
          </div>
          <p className="text-2xl font-black text-slate-900">18% GST</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Standard statutory Goods and Services Tax (9% CGST + 9% SGST) applied strictly to service charges.
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 6: COUNTRY-WISE VISA FEES COMPARISON TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Receipt size={16} className="text-[#4848F7]" />
            <span>Country Consular Tariff & Package Breakdown Table ({filteredFees.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Destination Country</th>
                <th className="py-3 px-4">Subclass</th>
                <th className="py-3 px-4">Govt Fee</th>
                <th className="py-3 px-4">Service Fee</th>
                <th className="py-3 px-4">GST (18%)</th>
                <th className="py-3 px-4">Total Package Fee</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    No country visa fees found.
                  </td>
                </tr>
              ) : (
                filteredFees.map((f) => {
                const isSelected = f.id === selectedFeeId;
                const gst = Math.round(f.serviceChargeINR * 0.18);
                const total = f.govtFeeINR + f.serviceChargeINR + gst;

                return (
                  <tr
                    key={f.id}
                    onClick={() => setSelectedFeeId(f.id)}
                    className={`cursor-pointer transition hover:bg-indigo-50/40 ${
                      isSelected ? "bg-indigo-50/80 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4848F7]" />}
                      <span className="text-lg">{f.flag}</span>
                      <span>{f.country}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{f.subclass}</td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">{formatPrice(f.govtFeeINR)}</td>

                    <td className="py-3.5 px-4 text-slate-700">{formatPrice(f.serviceChargeINR)}</td>

                    <td className="py-3.5 px-4 text-slate-600">{formatPrice(gst)}</td>

                    <td className="py-3.5 px-4 font-black text-[#4848F7]">{formatPrice(total)}</td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setSelectedFeeId(f.id);
                          if (onNavigateCheckout) onNavigateCheckout();
                        }}
                        className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg transition text-[11px] cursor-pointer"
                      >
                        Checkout
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
      {/* SECTION 7: INTERACTIVE VISA FEE CALCULATOR CARD */}
      {/* ============================================================ */}
      {activeFeeRecord && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{activeFeeRecord.flag}</span>
              <div>
                <h3 className="text-lg font-black text-slate-900">{activeFeeRecord.country} Visa Fee Estimator & Price Lock</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Subclass: {activeFeeRecord.subclass}</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (onNavigateCheckout) onNavigateCheckout();
              }}
              className="bg-[#4848F7] hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <CreditCard size={16} />
              <span>Proceed to Checkout ({formatPrice(grandTotalINR)})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Interactive Controls */}
            <div className="md:col-span-6 space-y-4 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Users size={16} className="text-[#4848F7]" /> Select Number of Travelers & Add-on Services
              </h4>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Adult Applicants</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={calcAdults}
                    onChange={(e) => setCalcAdults(parseInt(e.target.value) || 1)}
                    className="w-full bg-white border border-slate-200 p-2 rounded-lg font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Child Applicants (&lt;12 yrs)</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={calcChildren}
                    onChange={(e) => setCalcChildren(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 p-2 rounded-lg font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Add-on Toggles */}
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-bold text-slate-900">Express Fast-Track Processing</p>
                    <p className="text-[11px] text-slate-500">Priority consular queue dispatch (+{formatPrice(activeFeeRecord.expressAddonINR)}/person)</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeExpress}
                    onChange={(e) => setIncludeExpress(e.target.checked)}
                    className="rounded text-[#4848F7] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-bold text-slate-900">Doorstep Passport Courier Delivery</p>
                    <p className="text-[11px] text-slate-500">Insured blue-dart passport delivery (+{formatPrice(activeFeeRecord.doorstepCourierINR)})</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeCourier}
                    onChange={(e) => setIncludeCourier(e.target.checked)}
                    className="rounded text-[#4848F7] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-bold text-slate-900">Refusal Insurance Cover</p>
                    <p className="text-[11px] text-slate-500">Full service charge refund if visa is refused (+{formatPrice(activeFeeRecord.insuranceINR)}/person)</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeInsurance}
                    onChange={(e) => setIncludeInsurance(e.target.checked)}
                    className="rounded text-[#4848F7] w-4 h-4"
                  />
                </label>
              </div>
            </div>

            {/* Itemized Amount Statement */}
            <div className="md:col-span-6 bg-slate-900 text-white rounded-2xl p-5 space-y-4 flex flex-col justify-between text-xs shadow-lg">
              <div>
                <h4 className="font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                  <Receipt size={16} className="text-[#4848F7]" /> Itemized Cost Statement ({totalTravelers} Traveler{totalTravelers > 1 ? "s" : ""})
                </h4>

                <div className="mt-3 space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span>Government Consular Fee ({totalTravelers}x):</span>
                    <span className="font-bold text-white">{formatPrice(baseGovtTotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>VFS Logistics & Concierge Fee ({totalTravelers}x):</span>
                    <span className="font-bold text-white">{formatPrice(baseServiceTotal)}</span>
                  </div>

                  {includeExpress && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Express Fast-Track Add-on:</span>
                      <span className="font-bold">{formatPrice(expressTotal)}</span>
                    </div>
                  )}

                  {includeCourier && (
                    <div className="flex justify-between">
                      <span>Doorstep Passport Courier:</span>
                      <span className="font-bold text-white">{formatPrice(courierTotal)}</span>
                    </div>
                  )}

                  {includeInsurance && (
                    <div className="flex justify-between text-indigo-300">
                      <span>Refusal Insurance Cover:</span>
                      <span className="font-bold">{formatPrice(insuranceTotal)}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-white/10 pt-2 text-slate-400">
                    <span>Statutory GST (18% on service charges):</span>
                    <span className="font-bold text-white">{formatPrice(gstAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total Amount Payable</span>
                  <span className="text-2xl font-black text-emerald-400">{formatPrice(grandTotalINR)}</span>
                </div>

                <button
                  onClick={() => {
                    if (onNavigateCheckout) onNavigateCheckout();
                  }}
                  className="bg-[#4848F7] hover:bg-indigo-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Pay Now</span> <ArrowRight size={14} />
                </button>
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
          <h4 className="font-extrabold text-white">Need a Corporate Tax Invoice with GSTIN for Your Company?</h4>
          <p className="text-slate-400 mt-0.5">Input your corporate GSTIN during checkout to claim 100% input tax credit (ITC).</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onNavigateSupport && (
            <button
              onClick={onNavigateSupport}
              className="bg-[#4848F7] hover:bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle size={14} /> Corporate Billing Help
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 9: VISA FEES FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Consular Fees & Charges</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Are embassy consular fees refundable if my visa is refused?</p>
            <p className="text-slate-600 leading-relaxed">
              Official government consular fees are non-refundable once lodged with the embassy. However, if you opt for our Refusal Insurance, Phantom service charges will be refunded.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Why do visa fees fluctuate with currency exchange rates?</p>
            <p className="text-slate-600 leading-relaxed">
              Embassies fix their fees in foreign currencies (EUR, USD, GBP, AUD). Local INR prices are updated dynamically based on weekly consular foreign exchange rates.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
