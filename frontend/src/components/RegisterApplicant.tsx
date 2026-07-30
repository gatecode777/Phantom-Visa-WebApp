import React, { useState } from "react";
import {
  UserPlus,
  User,
  FileText,
  Globe,
  ShieldCheck,
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info
} from "lucide-react";

export interface RegisterApplicantProps {
  onClose?: () => void;
  onSuccessSubmit?: (applicantData: any) => void;
}

export default function RegisterApplicant({ onClose, onSuccessSubmit }: RegisterApplicantProps) {
  // Current Step state (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State containing kept applicant registration sections
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    applicantId: "APP-1030",
    fullName: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "Male",
    nationality: "Indian",
    phone: "",
    email: "",
    emergencyPhone: "",
    passportNo: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",

    // Step 2: Passport Information
    passportType: "Regular",
    passportIssueDate: "",
    passportExpiryDate: "",
    passportPlaceOfIssue: "",
    passportIssuingCountry: "India",

    // Step 3: Visa Information
    destinationCountry: "Canada",
    visaCategory: "Tourist Visa",
    visaType: "Subclass 600 / Express Tourist",
    purposeOfVisit: "Tourism & Vacation",
    entryType: "Multiple Entry",
    durationOfStay: "90 Days",
    expectedTravelDate: "",
    preferredEmbassy: "VFS Global New Delhi",

    // Step 4: KYC Details
    govtIdType: "Aadhaar / National ID",
    govtIdNumber: "",
    aadhaarNumber: "",
    panCardNumber: "",
    kycStatus: "Pending Audit",
    faceBiometricVerified: false,
    addressProofVerified: false,

    // Step 5: Document Files
    documents: {
      passportScan: null as string | null,
      photo: null as string | null,
      nationalId: null as string | null,
      bankStatement: null as string | null,
      addressProof: null as string | null,
      employerLetter: null as string | null,
      coverLetter: null as string | null,
      supportingDocs: null as string | null
    }
  });

  // Step Meta Configuration (Streamlined 6 Steps)
  const stepsConfig = [
    { num: 1, title: "Personal Information", icon: User },
    { num: 2, title: "Passport Details", icon: FileText },
    { num: 3, title: "Visa Information", icon: Globe },
    { num: 4, title: "KYC Verification", icon: ShieldCheck },
    { num: 5, title: "Document Uploads", icon: Upload },
    { num: 6, title: "Timeline & Review", icon: CheckCircle2 }
  ];

  // UI Toast State
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (docKey: string, fileName: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docKey]: fileName
      }
    }));
    triggerToast(`Document attached: ${fileName}`);
  };

  const handleNextStep = () => {
    // Validation for Step 1
    if (currentStep === 1) {
      if (!formData.firstName || !formData.email || !formData.phone || !formData.passportNo) {
        triggerToast("Please fill in mandatory fields: First Name, Email, Phone, Passport No.");
        return;
      }
    }

    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    triggerToast("Registration completed! Applicant dossier registered successfully.");

    if (onSuccessSubmit) {
      onSuccessSubmit(formData);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200 overflow-y-auto pb-24">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* HEADER BAR & STEP TRACKER */}
      <div className="space-y-4 mb-6">
        {/* HEADER BAR */}
        <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-5 sm:p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-700">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-200 mb-1">
              <UserPlus size={15} />
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
                Applicant Registration Wizard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
              Register as an Applicant
            </h1>
            <p className="text-xs text-blue-100 font-medium mt-1">
              Fill in your personal details, passport info, visa requirements, KYC, and document uploads.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <X size={15} /> Close Form
              </button>
            )}
          </div>
        </div>

        {/* 6-STEP VISUAL PROGRESS TRACKER BAR */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
              <Sparkles size={16} className="text-[#2563EB]" />
              <span>Step {currentStep} of 6: {stepsConfig[currentStep - 1].title}</span>
            </span>
            <span className="font-mono font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {Math.round((currentStep / 6) * 100)}% Completed
            </span>
          </div>

          {/* Progress Bar Line */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>

          {/* Step Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-2 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-50">
            {stepsConfig.map((st) => {
              const IconC = st.icon;
              const isCurrent = currentStep === st.num;
              const isCompleted = currentStep > st.num;

              return (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => setCurrentStep(st.num)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
                    isCurrent
                      ? "bg-[#2563EB] text-white shadow-md"
                      : isCompleted
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                      : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={14} className="text-emerald-600" />
                  ) : (
                    <IconC size={14} className={isCurrent ? "text-white" : "text-slate-400"} />
                  )}
                  <span>Step {st.num}: {st.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* STEP CONTENT CONTAINER (NATURAL DOCUMENT FLOW WITHOUT INNER SCROLLBAR) */}
      <div className="space-y-6 mb-6">
        {/* STEP 1: PERSONAL INFORMATION */}
        {currentStep === 1 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                <User size={18} className="text-[#2563EB]" />
                <span>Section 1: Personal Information</span>
              </h3>
              <span className="text-[10px] font-mono font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                ID: {formData.applicantId}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Geeta"
                  value={formData.firstName}
                  onChange={(e) => {
                    handleInputChange("firstName", e.target.value);
                    handleInputChange("fullName", `${e.target.value} ${formData.lastName}`.trim());
                  }}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bisht"
                  value={formData.lastName}
                  onChange={(e) => {
                    handleInputChange("lastName", e.target.value);
                    handleInputChange("fullName", `${formData.firstName} ${e.target.value}`.trim());
                  }}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Nationality <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Indian"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange("nationality", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="applicant@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Phone / Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Emergency Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="+91 9812345678"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Passport Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="P12345678"
                  value={formData.passportNo}
                  onChange={(e) => handleInputChange("passportNo", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono uppercase font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  placeholder="House No, Street Name, Landmark"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  City / State / Postal Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-1/3 bg-slate-50 border border-slate-200 text-slate-800 text-xs px-2.5 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="w-1/3 bg-slate-50 border border-slate-200 text-slate-800 text-xs px-2.5 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                  />
                  <input
                    type="text"
                    placeholder="Zip"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    className="w-1/3 bg-slate-50 border border-slate-200 text-slate-800 text-xs px-2.5 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PASSPORT INFORMATION */}
        {currentStep === 2 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                <FileText size={18} className="text-[#2563EB]" />
                <span>Section 2: Passport Information</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Passport Type
                </label>
                <select
                  value={formData.passportType}
                  onChange={(e) => handleInputChange("passportType", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                >
                  <option value="Regular">Regular (36 / 60 Pages)</option>
                  <option value="Diplomatic">Diplomatic Passport</option>
                  <option value="Official">Official / Service</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Place of Issue
                </label>
                <input
                  type="text"
                  placeholder="e.g. Regional Passport Office Delhi"
                  value={formData.passportPlaceOfIssue}
                  onChange={(e) => handleInputChange("passportPlaceOfIssue", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={formData.passportIssueDate}
                  onChange={(e) => handleInputChange("passportIssueDate", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.passportExpiryDate}
                  onChange={(e) => handleInputChange("passportExpiryDate", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: VISA INFORMATION */}
        {currentStep === 3 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                <Globe size={18} className="text-[#2563EB]" />
                <span>Section 3: Visa Information</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Destination Country
                </label>
                <select
                  value={formData.destinationCountry}
                  onChange={(e) => handleInputChange("destinationCountry", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                >
                  <option value="Canada">🇨🇦 Canada</option>
                  <option value="Australia">🇦🇺 Australia</option>
                  <option value="USA">🇺🇸 United States</option>
                  <option value="UK">🇬🇧 United Kingdom</option>
                  <option value="Schengen Area">🇪🇺 Schengen Area</option>
                  <option value="UAE">🇦🇪 UAE Dubai</option>
                  <option value="Japan">🇯🇵 Japan</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Visa Category
                </label>
                <select
                  value={formData.visaCategory}
                  onChange={(e) => handleInputChange("visaCategory", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                >
                  <option value="Tourist Visa">Tourist / Visitor Visa</option>
                  <option value="Student Visa">Student Study Permit</option>
                  <option value="Business Visa">Business Visitor Visa</option>
                  <option value="Work Permit">Work Permit Visa</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Entry Type & Duration
                </label>
                <input
                  type="text"
                  placeholder="Multiple Entry / 90 Days"
                  value={`${formData.entryType} - ${formData.durationOfStay}`}
                  onChange={(e) => handleInputChange("durationOfStay", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Expected Travel Date
                </label>
                <input
                  type="date"
                  value={formData.expectedTravelDate}
                  onChange={(e) => handleInputChange("expectedTravelDate", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: KYC DETAILS */}
        {currentStep === 4 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                <ShieldCheck size={18} className="text-[#2563EB]" />
                <span>Section 4: KYC Details</span>
              </h3>
              <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {formData.kycStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Aadhaar / Government National ID
                </label>
                <input
                  type="text"
                  placeholder="XXXX-XXXX-XXXX"
                  value={formData.aadhaarNumber}
                  onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  PAN Card Number
                </label>
                <input
                  type="text"
                  placeholder="ABCDE1234F"
                  value={formData.panCardNumber}
                  onChange={(e) => handleInputChange("panCardNumber", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono uppercase"
                />
              </div>

              <div className="sm:col-span-2 p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Biometric Live Selfie Match:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Residential Address Proof:</span>
                  <span className="text-[#2563EB] font-bold">Document Uploaded</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: DOCUMENTS UPLOAD SECTION */}
        {currentStep === 5 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                <Upload size={18} className="text-[#2563EB]" />
                <span>Section 5: Documents Upload Section</span>
              </h3>
              <span className="text-[10px] font-mono font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                PDF, JPG, PNG (Max 10MB)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
              {[
                { key: "passportScan", label: "Passport Bio Page Scan" },
                { key: "photo", label: "Passport Photo (Studio White BG)" },
                { key: "nationalId", label: "Aadhaar / National ID" },
                { key: "bankStatement", label: "Financial Proof (Bank Statement)" },
                { key: "addressProof", label: "Address Proof" },
                { key: "employerLetter", label: "Employer Offer / NOC Letter" },
                { key: "coverLetter", label: "Cover Letter / Travel Plan" },
                { key: "supportingDocs", label: "Supporting Documents Bundle" }
              ].map((doc) => {
                const attached = formData.documents[doc.key as keyof typeof formData.documents];

                return (
                  <div
                    key={doc.key}
                    className="p-3.5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-between"
                  >
                    <div className="overflow-hidden">
                      <span className="font-extrabold text-slate-800 block text-xs truncate">
                        {doc.label}
                      </span>
                      {attached ? (
                        <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 size={11} /> {attached}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">Not Uploaded</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleFileUpload(doc.key, `${doc.key}_file.pdf`)}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 text-[#2563EB] border border-blue-200 rounded-lg text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition shadow-2xs"
                    >
                      <Upload size={12} /> Upload
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: APPLICATION WORKFLOW TIMELINE & FINAL REVIEW */}
        {currentStep === 6 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                <CheckCircle2 size={18} className="text-[#2563EB]" />
                <span>Section 6: Workflow Timeline & Final Dossier Review</span>
              </h3>
            </div>

            {/* Dossier Summary Review Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between font-bold border-b border-slate-200 pb-2">
                <span>Applicant Dossier Summary</span>
                <span className="text-[#2563EB] font-mono">ID: {formData.applicantId}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700 font-medium">
                <div>Full Name: <strong className="text-slate-900">{formData.fullName || "Geeta Bisht"}</strong></div>
                <div>Email: <strong className="text-[#2563EB] font-mono">{formData.email || "applicant@email.com"}</strong></div>
                <div>Passport: <strong className="text-slate-900 font-mono">{formData.passportNo || "P12345678"}</strong></div>
                <div>Destination: <strong className="text-slate-900">{formData.destinationCountry}</strong></div>
                <div>Visa Category: <strong className="text-slate-900">{formData.visaCategory}</strong></div>
                <div>Nationality: <strong className="text-slate-900">{formData.nationality}</strong></div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs text-center">
              {[
                { step: "1. Account Created", done: true },
                { step: "2. Form Submitted", done: true },
                { step: "3. Fee Payment", done: false },
                { step: "4. Document Verification", done: false },
                { step: "5. VFS Appointment", done: false },
                { step: "6. Visa Stamped", done: false }
              ].map((st, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border font-bold ${
                    st.done
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider font-mono mb-1">Step {idx + 1}</div>
                  <div className="text-xs leading-tight">{st.step}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM WIZARD NAVIGATION BAR (PREVIOUS / NEXT / SUBMIT - SHRINK-0 NON-OVERLAPPING AREA) */}
      <div className="shrink-0 bg-white border border-slate-200 p-4 shadow-xl flex items-center justify-between w-full max-w-6xl mx-auto rounded-2xl mt-4">
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-extrabold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft size={15} /> Previous Step
        </button>

        <div className="text-xs font-mono font-extrabold text-slate-500">
          Step <span className="text-[#2563EB]">{currentStep}</span> of 6
        </div>

        {currentStep < 6 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-extrabold shadow-md shadow-[#2563EB]/25 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Next Step</span>
            <ArrowRight size={15} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/25 transition flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 size={16} /> Complete & Save Applicant Account
          </button>
        )}
      </div>
    </div>
  );
}
