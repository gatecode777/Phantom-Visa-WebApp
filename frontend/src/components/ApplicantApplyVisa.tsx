"use client";

import React, { useState } from "react";
import { Application, formatINR } from "../context/VisaContext";
import {
  FilePlus,
  Plane,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  Upload,
  CreditCard,
  Check,
  Plus,
  Trash2,
  HelpCircle,
  Info,
  Layers,
  ArrowRight,
  Save,
  Lock,
  Zap,
  Calendar,
  Building,
  FileText,
  UserPlus
} from "lucide-react";

interface CoTraveler {
  id: string;
  name: string;
  relation: string;
  passportNo: string;
  age: number;
}

interface ApplicantApplyVisaProps {
  onAddApplication?: (app: Partial<Application>) => void;
  onNavigateDrafts?: () => void;
  onNavigatePayment?: () => void;
}

export default function ApplicantApplyVisa({
  onAddApplication,
  onNavigateDrafts,
  onNavigatePayment
}: ApplicantApplyVisaProps) {
  // Wizard active step (1 to 10)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Destination & Visa Category
  const [destination, setDestination] = useState("Australia");
  const [visaCategory, setVisaCategory] = useState("Tourist");
  const [visaSubclass, setVisaSubclass] = useState("Subclass 600 Tourist Visa");

  // Step 2: Processing Speed & Entry Type
  const [processingSpeed, setProcessingSpeed] = useState<"standard" | "express" | "vip">("express");
  const [entryType, setEntryType] = useState("Single Entry");
  const [stayValidity, setStayValidity] = useState("60 Days");

  // Step 3: Primary Applicant Details
  const [givenName, setGivenName] = useState("Geeta");
  const [surname, setSurname] = useState("Sharma");
  const [dob, setDob] = useState("1995-06-12");
  const [gender, setGender] = useState("Female");
  const [nationality, setNationality] = useState("Indian");
  const [maritalStatus, setMaritalStatus] = useState("Single");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("geeta.sharma@gmail.com");

  // Step 4: Passport & Travel Information
  const [passportType, setPassportType] = useState("Ordinary / Regular");
  const [passportNo, setPassportNo] = useState("Z9817264");
  const [issuePlace, setIssuePlace] = useState("New Delhi");
  const [issueDate, setIssueDate] = useState("2023-12-21");
  const [expiryDate, setExpiryDate] = useState("2033-12-20");
  const [travelDate, setTravelDate] = useState("2026-10-15");
  const [returnDate, setReturnDate] = useState("2026-11-15");
  const [portOfEntry, setPortOfEntry] = useState("Sydney International Airport (SYD)");

  // Step 5: Employment & Financial Information
  const [employmentStatus, setEmploymentStatus] = useState("Employed");
  const [employerName, setEmployerName] = useState("TechCorp Solutions Pvt Ltd");
  const [jobTitle, setJobTitle] = useState("Senior Product Designer");
  const [monthlyIncome, setMonthlyIncome] = useState("₹1,25,000");
  const [bankBalance, setBankBalance] = useState("₹4,50,000");
  const [itrFiled, setItrFiled] = useState("Yes");

  // Step 6: Host / Hotel Details
  const [stayType, setStayType] = useState("Hotel Booking");
  const [hostName, setHostName] = useState("Shangri-La Sydney");
  const [hostAddress, setHostAddress] = useState("176 Cumberland St, The Rocks");
  const [hostCity, setHostCity] = useState("Sydney, NSW 2000");
  const [hostPhone, setHostPhone] = useState("+61 2 9250 6000");

  // Step 7: Document Upload Status (Simulated slots)
  const [docsUploaded, setDocsUploaded] = useState({
    passportBio: true,
    passportBack: true,
    photo: true,
    bankStatement: true,
    nocLetter: true,
    flightHotel: true
  });

  // Step 8: Additional Travelers
  const [coTravelers, setCoTravelers] = useState<CoTraveler[]>([
    { id: "ct-1", name: "Rohan Sharma", relation: "Spouse", passportNo: "Z9817265", age: 32 }
  ]);
  const [newCoName, setNewCoName] = useState("");
  const [newCoRelation, setNewCoRelation] = useState("Spouse");

  // Step 9 & 10: Fee & Declaration
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [savedDraft, setSavedDraft] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Pricing calculations
  const consularFee = 12500;
  const platformFee = 2500;
  const expressSurcharge = processingSpeed === "express" ? 2000 : processingSpeed === "vip" ? 4000 : 0;
  const discount = 1000;
  const totalAmount = consularFee + platformFee + expressSurcharge - discount;

  // Add Co-Traveler
  const handleAddCoTraveler = () => {
    if (!newCoName) return;
    setCoTravelers([
      ...coTravelers,
      {
        id: `ct-${Date.now()}`,
        name: newCoName,
        relation: newCoRelation,
        passportNo: `Z${Math.floor(1000000 + Math.random() * 9000000)}`,
        age: 30
      }
    ]);
    setNewCoName("");
  };

  // Remove Co-Traveler
  const handleRemoveCoTraveler = (id: string) => {
    setCoTravelers(coTravelers.filter((c) => c.id !== id));
  };

  // Save Draft
  const handleSaveDraft = () => {
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 2000);
    if (onNavigateDrafts) onNavigateDrafts();
  };

  // Final Submit
  const handleSubmitVisaApp = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onAddApplication) {
      onAddApplication({
        id: `VO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        travelerName: `${givenName} ${surname}`,
        dob: dob || "1995-06-12",
        passportNumber: passportNo,
        passportExpiry: expiryDate || "2033-12-20",
        nationality: nationality || "Indian",
        destination,
        visaType: visaSubclass,
        travelDates: `${travelDate} to ${returnDate}`,
        status: "Submitted",
        fees: totalAmount,
        verifiedDocs: {
          passport: "verified",
          photo: "verified",
          nocLetter: "needs_review"
        },
        documentsSubmitted: true,
        kycCompleted: true
      });
    }
    if (onNavigatePayment) onNavigatePayment();
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & PROGRESS STEPPER OVERVIEW */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Home</span>
            <span>/</span>
            <span>Visa Application</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">New Application</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Apply for Visa Online</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-[#4848F7] border border-indigo-200">
              Step {currentStep} of 10 &bull; {Math.round((currentStep / 10) * 100)}% Completed
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Complete your multi-step online visa application form, upload required travel credentials, select consular processing speed, and submit for agent review.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleSaveDraft}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition flex items-center gap-2 cursor-pointer"
          >
            <Save size={16} />
            <span>{savedDraft ? "Draft Saved!" : "Save Draft"}</span>
          </button>
        </div>
      </div>

      {/* Stepper Pipeline (1 to 10) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs overflow-x-auto">
        <div className="flex items-center min-w-[700px] justify-between text-xs font-bold">
          {[
            "1. Destination",
            "2. Speed",
            "3. Applicant",
            "4. Passport",
            "5. Employment",
            "6. Hotel/Host",
            "7. Documents",
            "8. Co-Travelers",
            "9. Pricing",
            "10. Submit"
          ].map((title, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === currentStep;
            const isDone = stepNum < currentStep;
            return (
              <button
                key={stepNum}
                onClick={() => setCurrentStep(stepNum)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  isActive
                    ? "bg-[#4848F7] text-white shadow-xs"
                    : isDone
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {isDone ? <CheckCircle2 size={13} /> : <span className="font-mono">{stepNum}</span>}
                <span className="truncate max-w-[90px]">{title.split(". ")[1]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: CONCEPTUAL WORKFLOW BANNER (CONNECTED 3-PARTY WORKFLOW FROM WIREFRAME) */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Workflow (Applicant ➔ Agent ➔ Admin)
            </h3>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
            100% Consular Approval Rate
          </span>
        </div>

        {/* Workflow Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 1</span>
            <p className="text-white">Applicant Fills & Submits</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 2</span>
            <p className="text-white">Agent AI & OCR Inspection</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Stage 3</span>
            <p className="text-white">Embassy Consular Submission</p>
          </div>

          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Stage 4</span>
            <p className="font-bold">Visa Decision Granted ✓</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl text-xs space-y-1 text-slate-300">
          <p className="font-bold text-white">Professional Recommendation & Tips for Fast Approval:</p>
          <ul className="list-disc pl-4 space-y-1 leading-relaxed text-[11px]">
            <li>Ensure passport is valid for at least 6 months beyond intended travel return date.</li>
            <li>Bank statement must show sufficient balance to cover stay duration (&gt; ₹3,50,000).</li>
            <li>Uploaded photographs must strictly follow 35x45mm biometric specifications with white background.</li>
          </ul>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: WIZARD FORM CONTAINER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        
        {/* STEP 1: DESTINATION & VISA CATEGORY */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Plane size={18} className="text-[#4848F7]" />
              <span>Step 1: Select Destination & Visa Category</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Destination Country</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-bold focus:outline-none focus:border-[#4848F7]"
                >
                  <option value="Australia">Australia 🇦🇺</option>
                  <option value="United Arab Emirates">United Arab Emirates 🇦🇪</option>
                  <option value="Schengen / France">Schengen / France 🇫🇷</option>
                  <option value="United States">United States 🇺🇸</option>
                  <option value="United Kingdom">United Kingdom 🇬🇧</option>
                  <option value="Singapore">Singapore 🇸🇬</option>
                  <option value="Japan">Japan 🇯🇵</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Visa Category</label>
                <select
                  value={visaCategory}
                  onChange={(e) => setVisaCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-bold focus:outline-none focus:border-[#4848F7]"
                >
                  <option value="Tourist">Tourist / Visitor</option>
                  <option value="Business">Business / Conference</option>
                  <option value="Student">Student / Academic</option>
                  <option value="Transit">Airport Transit</option>
                  <option value="Dependent">Family Dependent</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Visa Subclass / Type</label>
                <input
                  type="text"
                  value={visaSubclass}
                  onChange={(e) => setVisaSubclass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PROCESSING SPEED & ENTRY TYPE */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Clock size={18} className="text-[#4848F7]" />
              <span>Step 2: Select Processing Speed & Entry Type</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <button
                type="button"
                onClick={() => setProcessingSpeed("standard")}
                className={`p-4 rounded-2xl border text-left space-y-1 transition cursor-pointer ${
                  processingSpeed === "standard"
                    ? "bg-indigo-50 border-[#4848F7] text-slate-900"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <span className="font-extrabold block text-sm">Standard Processing</span>
                <p className="text-slate-500">5 - 7 Business Days</p>
                <p className="font-mono text-indigo-700 font-bold">Consular Fee + ₹0 Surcharge</p>
              </button>

              <button
                type="button"
                onClick={() => setProcessingSpeed("express")}
                className={`p-4 rounded-2xl border text-left space-y-1 transition cursor-pointer ${
                  processingSpeed === "express"
                    ? "bg-indigo-50 border-[#4848F7] text-slate-900"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <span className="font-extrabold block text-sm flex items-center gap-1">
                  Express Processing <Zap size={14} className="text-amber-500" />
                </span>
                <p className="text-slate-500">48 Hours Fast Track</p>
                <p className="font-mono text-indigo-700 font-bold">+ ₹2,000 Express Fee</p>
              </button>

              <button
                type="button"
                onClick={() => setProcessingSpeed("vip")}
                className={`p-4 rounded-2xl border text-left space-y-1 transition cursor-pointer ${
                  processingSpeed === "vip"
                    ? "bg-indigo-50 border-[#4848F7] text-slate-900"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <span className="font-extrabold block text-sm flex items-center gap-1">
                  VIP Super Fast <Zap size={14} className="text-indigo-600" />
                </span>
                <p className="text-slate-500">24 Hours Guaranteed</p>
                <p className="font-mono text-indigo-700 font-bold">+ ₹4,000 VIP Fee</p>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Entry Type</label>
                <select
                  value={entryType}
                  onChange={(e) => setEntryType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-semibold"
                >
                  <option value="Single Entry">Single Entry</option>
                  <option value="Double Entry">Double Entry</option>
                  <option value="Multiple Entry">Multiple Entry (1 Year / 3 Years)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Allowed Stay Duration</label>
                <select
                  value={stayValidity}
                  onChange={(e) => setStayValidity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-semibold"
                >
                  <option value="30 Days">30 Days</option>
                  <option value="60 Days">60 Days</option>
                  <option value="90 Days">90 Days</option>
                  <option value="180 Days">180 Days</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PRIMARY APPLICANT INFORMATION */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <User size={18} className="text-[#4848F7]" />
              <span>Step 3: Primary Applicant Personal Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Given / First Name</label>
                <input
                  type="text"
                  value={givenName}
                  onChange={(e) => setGivenName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Surname / Last Name</label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Nationality</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Marital Status</label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PASSPORT & TRAVEL DETAILS */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileText size={18} className="text-[#4848F7]" />
              <span>Step 4: Passport Credentials & Travel Dates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Passport Type</label>
                <select
                  value={passportType}
                  onChange={(e) => setPassportType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
                >
                  <option value="Ordinary / Regular">Ordinary / Regular</option>
                  <option value="Diplomatic">Diplomatic</option>
                  <option value="Official">Official</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Passport Number</label>
                <input
                  type="text"
                  value={passportNo}
                  onChange={(e) => setPassportNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Place of Issue</label>
                <input
                  type="text"
                  value={issuePlace}
                  onChange={(e) => setIssuePlace(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Date of Expiry</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Intended Departure Date</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Intended Return Date</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: EMPLOYMENT & FINANCIAL INFO */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Building size={18} className="text-[#4848F7]" />
              <span>Step 5: Employment & Financial Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Employment Status</label>
                <select
                  value={employmentStatus}
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
                >
                  <option value="Employed">Employed</option>
                  <option value="Self-Employed">Self-Employed / Business Owner</option>
                  <option value="Student">Student</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Employer / Company Name</label>
                <input
                  type="text"
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Job Title / Designation</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Bank Balance (INR)</label>
                <input
                  type="text"
                  value={bankBalance}
                  onChange={(e) => setBankBalance(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: HOST / HOTEL DETAILS */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Building size={18} className="text-[#4848F7]" />
              <span>Step 6: Hotel & Accommodation Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Stay Type</label>
                <select
                  value={stayType}
                  onChange={(e) => setStayType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
                >
                  <option value="Hotel Booking">Hotel Booking</option>
                  <option value="Host Residence">Host Residence / Friend</option>
                  <option value="Company Sponsor">Company Sponsor</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Hotel / Host Name</label>
                <input
                  type="text"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Street Address</label>
                <input
                  type="text"
                  value={hostAddress}
                  onChange={(e) => setHostAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: REQUIRED DOCUMENTS */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Upload size={18} className="text-[#4848F7]" />
              <span>Step 7: Required Documents Check & Instant Upload</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">Passport Bio Page</p>
                  <p className="text-[11px] text-slate-500">Mandatory 300 DPI scan</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Uploaded ✓
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">Recent Photo (35x45mm)</p>
                  <p className="text-[11px] text-slate-500">Biometrics photo</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Uploaded ✓
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">6-Month Bank Statement</p>
                  <p className="text-[11px] text-slate-500">Financial proof</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Uploaded ✓
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">Flight & Hotel Itinerary</p>
                  <p className="text-[11px] text-slate-500">Travel voucher</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Uploaded ✓
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: ADDITIONAL TRAVELERS */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <UserPlus size={18} className="text-[#4848F7]" />
              <span>Step 8: Co-Travelers (Family / Group Application)</span>
            </h3>

            <div className="flex gap-2 text-xs">
              <input
                type="text"
                value={newCoName}
                onChange={(e) => setNewCoName(e.target.value)}
                placeholder="Co-Traveler Full Name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
              />
              <select
                value={newCoRelation}
                onChange={(e) => setNewCoRelation(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
              >
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
              </select>
              <button
                type="button"
                onClick={handleAddCoTraveler}
                className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl shrink-0 cursor-pointer"
              >
                Add Co-Traveler
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {coTravelers.map((c) => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900">{c.name}</span> &bull; <span className="text-slate-500">{c.relation}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveCoTraveler(c.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 9: FEE REVIEW */}
        {currentStep === 9 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <CreditCard size={18} className="text-[#4848F7]" />
              <span>Step 9: Fee Review & Pricing Summary</span>
            </h3>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Embassy Consular Fee:</span>
                <span className="font-bold">₹{formatINR(consularFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Processing Fee:</span>
                <span className="font-bold">₹{formatINR(platformFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Speed Surcharge:</span>
                <span className="font-bold">₹{formatINR(expressSurcharge)}</span>
              </div>
              <div className="flex justify-between text-indigo-600 font-bold">
                <span>Promo Discount (WELCOME10):</span>
                <span>-₹{formatINR(discount)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
                <span>Total Payable Amount:</span>
                <span className="text-[#4848F7]">₹{formatINR(totalAmount)}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 10: DECLARATION & SUBMIT */}
        {currentStep === 10 && (
          <form onSubmit={handleSubmitVisaApp} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>Step 10: Final Declaration & Submission</span>
            </h3>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
              <label className="flex items-start gap-2 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  I hereby declare that all information provided in this application is true, accurate, and verified against official documents.
                </span>
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={!termsAgreed}
                className="bg-[#4848F7] hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Lock size={16} />
                <span>Submit & Proceed to Payment (₹{formatINR(totalAmount)})</span>
              </button>
            </div>
          </form>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between border-t border-slate-100 pt-4 text-xs font-bold">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(currentStep - 1)}
            className="bg-slate-100 hover:bg-slate-200 disabled:opacity-30 px-4 py-2 rounded-xl text-slate-700 transition"
          >
            ← Previous Step
          </button>

          {currentStep < 10 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-[#4848F7] hover:bg-indigo-700 text-white px-5 py-2 rounded-xl transition flex items-center gap-1"
            >
              <span>Next Step →</span>
            </button>
          )}
        </div>

      </div>

      {/* ============================================================ */}
      {/* SECTION 4: APPLY FOR VISA FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Visa Application</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Can I save my application and finish later?</p>
            <p className="text-slate-600 leading-relaxed">
              Yes, click "Save Draft" at any point. Your progress will be saved in your Drafts section.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">How long does processing take?</p>
            <p className="text-slate-600 leading-relaxed">
              Standard processing takes 5-7 days. Express processing completes in 48 hours.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
