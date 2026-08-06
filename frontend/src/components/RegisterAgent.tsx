import React, { useState } from "react";
import { API_V1_URL } from "../config/api";
import { COUNTRY_DIAL_CODES, getCountryByCodeOrName } from "../utils/countryData";
import {
  Briefcase,
  User,
  Building,
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  Upload,
  RefreshCw,
  Save,
  ArrowRight,
  ChevronLeft,
  X,
  FileText,
  Mail,
  Phone,
  Calendar,
  Globe,
  MapPin,
  Sparkles,
  DollarSign,
  Info
} from "lucide-react";

export interface RegisterAgentProps {
  onClose?: () => void;
  onSuccessSubmit?: () => void;
}

export default function RegisterAgent({ onClose, onSuccessSubmit }: RegisterAgentProps) {
  // Wizard Step State (Step 1 to Step 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal Info & Identity
    firstName: "",
    lastName: "",
    dob: "",
    gender: "Male",
    nationality: "Indian",
    email: "",
    phone: "",
    altPhone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",

    // Step 2: Agency & Business Info
    agencyName: "",
    agencyRegNo: "",
    businessLicense: "",
    gstTaxNo: "",
    website: "",
    yearsInBusiness: "3",
    agencyType: "Travel Agency",
    employeeCount: "5-20 Employees",
    monthlyCapacity: "100",
    officeContactNumber: "",

    // Step 3: Office Address
    officeAddress: "",
    officeCity: "",
    officeState: "",
    officeCountry: "India",
    officePostalCode: "",

    // Step 5: Bank Details
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscSwiftCode: "",
    commissionType: "Percentage (%)",
    commissionValue: "15",
    accountStatus: "Pending Approval",
    adminNotes: "Self-registered via Public Agent Registration Portal"
  });

  // Country Dial Codes & Phone Selection State
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>("IN");
  const [altPhoneCountryCode, setAltPhoneCountryCode] = useState<string>("IN");
  const [phoneDialCode, setPhoneDialCode] = useState<string>("+91");
  const [altPhoneDialCode, setAltPhoneDialCode] = useState<string>("+91");

  // File Upload State (Simulated / Local Files)
  const [uploadedFiles, setUploadedFiles] = useState<{
    businessCert?: string;
    govtIdDoc?: string;
    addressProofDoc?: string;
    taxCertDoc?: string;
    agencyLogoDoc?: string;
  }>({});

  // Validation Error State per field
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Input Change Handler with validation cleanup
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Instant API check for duplicate email & phone in MongoDB
  const checkDuplicateUser = async (emailToCheck?: string, phoneToCheck?: string) => {
    try {
      const fullPhone = phoneToCheck ? `${phoneDialCode} ${phoneToCheck.trim()}` : undefined;
      const res = await fetch(`${API_V1_URL}/auth/check-duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailToCheck ? emailToCheck.trim() : undefined,
          phone: fullPhone
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        return {
          hasDuplicate: true,
          field: json.field || (json.error?.code === "DUPLICATE_EMAIL" ? "email" : "phone"),
          message: json.error?.message || "An account with these credentials already exists in MongoDB."
        };
      }
      return { hasDuplicate: false };
    } catch (err) {
      return { hasDuplicate: false };
    }
  };

  // Helper to validate phone number live against country rules
  const validateSinglePhoneField = (val: string, countryCode: string) => {
    const selectedCountry = getCountryByCodeOrName(countryCode) || COUNTRY_DIAL_CODES[0];
    const raw = val.replace(/\D/g, "");

    if (!raw) {
      return `Mobile phone number is required for ${selectedCountry.name}.`;
    }

    if (raw.length < selectedCountry.minPhoneDigits || raw.length > selectedCountry.maxPhoneDigits) {
      return `${selectedCountry.name} (${selectedCountry.dialCode}) mobile numbers must be exactly ${selectedCountry.minPhoneDigits} digits (e.g. ${selectedCountry.examplePhone}).`;
    }

    if (selectedCountry.phoneRegex && !selectedCountry.phoneRegex.test(raw)) {
      return selectedCountry.phoneErrorMsg || `Invalid ${selectedCountry.name} mobile number format (e.g. ${selectedCountry.examplePhone}).`;
    }

    return "";
  };

  // Helper to validate IFSC / SWIFT code live
  const validateIfscCode = (val: string) => {
    const code = val.trim().toUpperCase();
    if (!code) return "IFSC or SWIFT code is required.";
    if (code.length < 11) {
      return `IFSC Code must be exactly 11 characters (Current length: ${code.length}/11).`;
    }
    // Indian IFSC 5th character rule: MUST BE THE DIGIT '0'
    if (code.length >= 5 && code[4] !== "0") {
      return `Invalid IFSC Code: The 5th character must be the digit '0' (e.g. HDFC0001234 or SBIN0001234).`;
    }
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const swiftRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    if (!ifscRegex.test(code) && !swiftRegex.test(code)) {
      return "Invalid IFSC Code format. Must be 4 letters + 0 + 6 branch digits/letters (e.g. HDFC0001234).";
    }
    return "";
  };

  // Country selector change handler
  const handleCountryCodeChange = (countryCode: string, isAlt = false) => {
    const found = getCountryByCodeOrName(countryCode);
    if (found) {
      if (isAlt) {
        setAltPhoneCountryCode(found.code);
        setAltPhoneDialCode(found.dialCode);
        const truncated = formData.altPhone.replace(/\D/g, "").slice(0, found.maxPhoneDigits);
        setFormData((prev) => ({ ...prev, altPhone: truncated }));
      } else {
        setPhoneCountryCode(found.code);
        setPhoneDialCode(found.dialCode);
        const truncated = formData.phone.replace(/\D/g, "").slice(0, found.maxPhoneDigits);
        setFormData((prev) => ({ ...prev, phone: truncated }));
        const errMsg = validateSinglePhoneField(truncated, found.code);
        setErrors((prev) => ({ ...prev, phone: errMsg }));
      }
    }
  };

  // File Upload Simulation Handler
  const handleFileUpload = (docType: keyof typeof uploadedFiles, file: File | null) => {
    if (!file) return;
    setUploadedFiles((prev) => ({ ...prev, [docType]: file.name }));
    triggerToast(`Uploaded document '${file.name}' for verification.`);
  };

  // Validate Specific Steps before Next
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = "Email address is required.";
      } else if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Enter a valid email address.";
      }

      // DOB & Age 18+ check
      if (!formData.dob) {
        newErrors.dob = "Date of birth is required.";
      } else {
        const dobDate = new Date(formData.dob);
        const today = new Date();
        if (dobDate > today) {
          newErrors.dob = "Date of birth cannot be a future date.";
        } else {
          const age = today.getFullYear() - dobDate.getFullYear();
          const monthDiff = today.getMonth() - dobDate.getMonth();
          const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate()) ? age - 1 : age;
          if (actualAge < 18) {
            newErrors.dob = `Agent must be at least 18 years old (Current age: ${actualAge}).`;
          }
        }
      }

      // Phone validation based on selected country
      const phoneErr = validateSinglePhoneField(formData.phone, phoneCountryCode);
      if (phoneErr) {
        newErrors.phone = phoneErr;
      }

      // Password checks
      if (!formData.password) {
        newErrors.password = "Password is required.";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long.";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    } else if (stepNumber === 2) {
      if (!formData.agencyName.trim()) newErrors.agencyName = "Agency / Business Name is required.";
    } else if (stepNumber === 4) {
      if (!uploadedFiles.businessCert) {
        newErrors.businessCert = "Business Registration Certificate file upload is required.";
      }
      if (!uploadedFiles.govtIdDoc) {
        newErrors.govtIdDoc = "Government ID (Passport / Aadhaar) file upload is required.";
      }
    } else if (stepNumber === 5) {
      if (!formData.accountHolderName.trim()) {
        newErrors.accountHolderName = "Account holder name is required.";
      }
      if (!formData.bankName.trim()) {
        newErrors.bankName = "Bank name is required.";
      }

      // Bank Account Number check (digits only, 9 to 18 digits)
      const cleanAcc = formData.accountNumber.replace(/\D/g, "");
      if (!cleanAcc) {
        newErrors.accountNumber = "Bank account number is required.";
      } else if (cleanAcc.length < 9 || cleanAcc.length > 18) {
        newErrors.accountNumber = "Account number must be between 9 and 18 numeric digits (e.g. 50200012345678).";
      }

      // IFSC / SWIFT Code check
      const ifscErr = validateIfscCode(formData.ifscSwiftCode);
      if (ifscErr) {
        newErrors.ifscSwiftCode = ifscErr;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Next Step Action
  const handleNextStep = async () => {
    if (!validateStep(currentStep)) {
      triggerToast("Please resolve highlighted form validation errors before proceeding.");
      return;
    }

    if (currentStep === 1) {
      const dupCheck = await checkDuplicateUser(formData.email, formData.phone);
      if (dupCheck.hasDuplicate) {
        if (dupCheck.field === "email") {
          setErrors((prev) => ({ ...prev, email: dupCheck.message || "An account with this email address already exists." }));
        } else {
          setErrors((prev) => ({ ...prev, phone: dupCheck.message || "An account with this phone number already exists." }));
        }
        triggerToast(dupCheck.message || "Email or Phone number is already registered.");
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Previous Step Action
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit Final Registration Form to Backend API
  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      triggerToast("Please complete all required fields in earlier steps.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fullPhone = `${phoneDialCode} ${formData.phone.trim()}`;
      const fullAltPhone = formData.altPhone.trim() ? `${altPhoneDialCode} ${formData.altPhone.trim()}` : "";

      const payload = {
        ...formData,
        phone: fullPhone,
        altPhone: fullAltPhone,
        accountStatus: "Pending Approval"
      };

      const res = await fetch(`${API_V1_URL}/agent/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to register travel agent account.");
      }

      setIsSuccess(true);
      triggerToast("Travel Agent application submitted successfully for review!");
    } catch (err: any) {
      if (err?.message === "Failed to fetch" || err?.name === "TypeError") {
        triggerToast("Backend server on http://localhost:5000 is updating. Please try submitting again.");
      } else {
        triggerToast(err.message || "Error submitting travel agent application.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCountryInfo = getCountryByCodeOrName(phoneCountryCode) || COUNTRY_DIAL_CODES[0];

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* TOP HEADER & TITLE CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold">
              <Briefcase size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  Agent Onboarding Portal
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-outfit mt-0.5">
                Travel Agent Registration
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <X size={14} /> Close
              </button>
            )}
          </div>
        </div>

        {/* SUCCESS SCREEN STATE */}
        {isSuccess ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 size={44} />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-extrabold text-slate-900">Application Submitted!</h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Thank you for registering with Phantom Visa. Your travel agency account application has been received and assigned to our Partner Verification Team.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-lg mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-semibold">Applicant Name:</span>
                <strong className="text-slate-900">{formData.firstName} {formData.lastName}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-semibold">Agency Name:</span>
                <strong className="text-[#2563EB]">{formData.agencyName}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-semibold">Contact Email:</span>
                <strong className="text-slate-800">{formData.email}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-semibold">Application Status:</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
                  Pending Approval
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onSuccessSubmit) onSuccessSubmit();
                  else if (onClose) onClose();
                }}
                className="px-8 py-3 bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-extrabold rounded-xl shadow-lg shadow-[#2563EB]/25 transition cursor-pointer flex items-center gap-2"
              >
                <span>Return to Login Portal</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* STEP PROGRESS INDICATOR */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {[
                  { step: 1, title: "1. Identity", icon: User },
                  { step: 2, title: "2. Agency", icon: Building },
                  { step: 3, title: "3. Address", icon: MapPin },
                  { step: 4, title: "4. Documents", icon: ShieldCheck },
                  { step: 5, title: "5. Review & Submit", icon: CheckCircle2 }
                ].map((s) => {
                  const isActive = currentStep === s.step;
                  const isCompleted = currentStep > s.step;

                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => {
                        if (isCompleted || validateStep(currentStep)) {
                          setCurrentStep(s.step);
                        }
                      }}
                      className={`p-2.5 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-2 transition cursor-pointer font-bold ${
                        isActive
                          ? "bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/20"
                          : isCompleted
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-50 text-slate-400 border border-slate-200"
                      }`}
                    >
                      <s.icon size={16} />
                      <span className="hidden sm:inline text-xs">{s.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#2563EB] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* STEP FORM CONTAINER */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* STEP 1: PERSONAL INFORMATION & CREDENTIALS */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                      <User size={18} className="text-[#2563EB]" />
                      <span>Step 1: Personal Information & Credentials</span>
                    </h2>
                    <span className="text-xs font-mono font-bold text-slate-500">Step 1 of 5</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Vikram"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={`w-full bg-slate-50 border text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:bg-white transition ${
                          errors.firstName ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#2563EB]"
                        }`}
                      />
                      {errors.firstName && <p className="text-[10px] text-red-600 font-bold mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Singh"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={`w-full bg-slate-50 border text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:bg-white transition ${
                          errors.lastName ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#2563EB]"
                        }`}
                      />
                      {errors.lastName && <p className="text-[10px] text-red-600 font-bold mt-1">{errors.lastName}</p>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Date of Birth <span className="text-red-500">*</span> (Age 18+)
                      </label>
                      <input
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        value={formData.dob}
                        onChange={(e) => handleInputChange("dob", e.target.value)}
                        className={`w-full bg-slate-50 border text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:bg-white transition ${
                          errors.dob ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#2563EB]"
                        }`}
                      />
                      {errors.dob && <p className="text-[10px] text-red-600 font-bold mt-1">{errors.dob}</p>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="agent@agency.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        onBlur={async () => {
                          if (formData.email && !errors.email) {
                            const res = await checkDuplicateUser(formData.email, undefined);
                            if (res.hasDuplicate && res.field === "email") {
                              setErrors((prev) => ({ ...prev, email: res.message || "An account with this email address already exists." }));
                            }
                          }
                        }}
                        className={`w-full bg-slate-50 border text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:bg-white transition ${
                          errors.email ? "border-red-500 bg-red-50/30 ring-2 ring-red-500/20" : "border-slate-200 focus:border-[#2563EB]"
                        }`}
                      />
                      {errors.email && <p className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.email}</p>}
                    </div>

                    {/* PHONE WITH COUNTRY CODE SELECTOR */}
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Mobile Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={phoneCountryCode}
                          onChange={(e) => handleCountryCodeChange(e.target.value, false)}
                          className="w-28 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono font-bold px-2 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        >
                          {COUNTRY_DIAL_CODES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.dialCode}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          maxLength={currentCountryInfo.maxPhoneDigits}
                          placeholder={`e.g. ${currentCountryInfo.examplePhone}`}
                          value={formData.phone}
                          onChange={(e) => {
                            const clean = e.target.value.replace(/\D/g, "").slice(0, currentCountryInfo.maxPhoneDigits);
                            handleInputChange("phone", clean);
                            const errMsg = validateSinglePhoneField(clean, phoneCountryCode);
                            setErrors((prev) => ({ ...prev, phone: errMsg }));
                          }}
                          onBlur={async () => {
                            const errMsg = validateSinglePhoneField(formData.phone, phoneCountryCode);
                            if (errMsg) {
                              setErrors((prev) => ({ ...prev, phone: errMsg }));
                            } else if (formData.phone) {
                              const res = await checkDuplicateUser(undefined, formData.phone);
                              if (res.hasDuplicate && res.field === "phone") {
                                setErrors((prev) => ({ ...prev, phone: res.message || "An account with this phone number already exists." }));
                              }
                            }
                          }}
                          className={`w-full bg-slate-50 border text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:bg-white transition ${
                            errors.phone ? "border-red-500 bg-red-50/30 ring-2 ring-red-500/20" : "border-slate-200 focus:border-[#2563EB]"
                          }`}
                        />
                      </div>
                      {errors.phone && <p className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.phone}</p>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Password <span className="text-red-500">*</span> (Min 8 chars)
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`w-full bg-slate-50 border text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:bg-white transition ${
                          errors.password ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#2563EB]"
                        }`}
                      />
                      {errors.password && <p className="text-[10px] text-red-600 font-bold mt-1">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={`w-full bg-slate-50 border text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:bg-white transition ${
                          errors.confirmPassword ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#2563EB]"
                        }`}
                      />
                      {errors.confirmPassword && <p className="text-[10px] text-red-600 font-bold mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: AGENCY & BUSINESS INFORMATION */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                      <Building size={18} className="text-[#2563EB]" />
                      <span>Step 2: Agency & Business Profile</span>
                    </h2>
                    <span className="text-xs font-mono font-bold text-slate-500">Step 2 of 5</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Agency / Business Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Travel & Visas"
                        value={formData.agencyName}
                        onChange={(e) => handleInputChange("agencyName", e.target.value)}
                        className={`w-full bg-slate-50 border text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:bg-white transition ${
                          errors.agencyName ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#2563EB]"
                        }`}
                      />
                      {errors.agencyName && <p className="text-[10px] text-red-600 font-bold mt-1">{errors.agencyName}</p>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Agency Registration Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. REG-190-PV329"
                        value={formData.agencyRegNo}
                        onChange={(e) => handleInputChange("agencyRegNo", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Business License Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. LIC-DEL-89972"
                        value={formData.businessLicense}
                        onChange={(e) => handleInputChange("businessLicense", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        GST / Tax ID Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 07AAAAA0000A1Z5"
                        value={formData.gstTaxNo}
                        onChange={(e) => handleInputChange("gstTaxNo", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Official Website
                      </label>
                      <input
                        type="url"
                        placeholder="https://agency.com"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Agency Type
                      </label>
                      <select
                        value={formData.agencyType}
                        onChange={(e) => handleInputChange("agencyType", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                      >
                        <option value="Travel Agency">Travel Agency</option>
                        <option value="Sole Agent">Sole Agent</option>
                        <option value="Immigration Consultancy">Immigration Consultancy</option>
                        <option value="Corporate Partner">Corporate Partner</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: OFFICE ADDRESS & LOCATION */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                      <MapPin size={18} className="text-[#2563EB]" />
                      <span>Step 3: Office Location & Address</span>
                    </h2>
                    <span className="text-xs font-mono font-bold text-slate-500">Step 3 of 5</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Office Street Address
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Commercial Tower, Financial District"
                        value={formData.officeAddress}
                        onChange={(e) => handleInputChange("officeAddress", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Office City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. New Delhi"
                        value={formData.officeCity}
                        onChange={(e) => handleInputChange("officeCity", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Office State / Region
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Delhi"
                        value={formData.officeState}
                        onChange={(e) => handleInputChange("officeState", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Office Country
                      </label>
                      <select
                        value={formData.officeCountry}
                        onChange={(e) => handleInputChange("officeCountry", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                      >
                        {COUNTRY_DIAL_CODES.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Postal / PIN Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 110001"
                        value={formData.officePostalCode}
                        onChange={(e) => handleInputChange("officePostalCode", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: KYC VERIFICATION DOCUMENTS */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                      <ShieldCheck size={18} className="text-[#2563EB]" />
                      <span>Step 4: Verification Documents (KYC)</span>
                    </h2>
                    <span className="text-xs font-mono font-bold text-slate-500">Step 4 of 5</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {[
                      { key: "businessCert" as const, label: "Business Registration Certificate", required: true },
                      { key: "govtIdDoc" as const, label: "Government ID (Passport / Aadhaar)", required: true },
                      { key: "addressProofDoc" as const, label: "Office Address Proof", required: false },
                      { key: "taxCertDoc" as const, label: "Tax Registration Certificate", required: false },
                      { key: "agencyLogoDoc" as const, label: "Agency Official Logo", required: false }
                    ].map((doc) => (
                      <div key={doc.key} className={`p-4 bg-slate-50 border rounded-2xl space-y-2 ${errors[doc.key] ? "border-red-500 bg-red-50/20" : "border-slate-200"}`}>
                        <span className="text-xs font-bold text-slate-800 flex items-center justify-between">
                          <span>{doc.label} {doc.required && <span className="text-red-500">*</span>}</span>
                          {doc.required && <span className="text-[10px] font-mono text-red-500 font-bold uppercase">Required</span>}
                        </span>
                        <div className={`flex items-center justify-between bg-white border p-2.5 rounded-xl ${errors[doc.key] ? "border-red-400 ring-2 ring-red-500/10" : "border-slate-200"}`}>
                          <span className={`text-[11px] truncate max-w-[180px] ${uploadedFiles[doc.key] ? "text-emerald-700 font-bold" : "text-slate-500"}`}>
                            {uploadedFiles[doc.key] ? `✓ ${uploadedFiles[doc.key]}` : "No file uploaded"}
                          </span>
                          <label className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-[11px] font-bold rounded-lg cursor-pointer transition flex items-center gap-1">
                            <Upload size={12} />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              className="hidden"
                              onChange={(e) => {
                                handleFileUpload(doc.key, e.target.files?.[0] || null);
                                if (errors[doc.key]) {
                                  setErrors((prev) => {
                                    const updated = { ...prev };
                                    delete updated[doc.key];
                                    return updated;
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                        {errors[doc.key] && <p className="text-[10px] text-red-600 font-bold flex items-center gap-1"><AlertCircle size={12} /> {errors[doc.key]}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: BANK DETAILS & FINAL REVIEW */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                      <CheckCircle2 size={18} className="text-[#2563EB]" />
                      <span>Step 5: Bank Details & Application Review</span>
                    </h2>
                    <span className="text-xs font-mono font-bold text-slate-500">Step 5 of 5</span>
                  </div>

                  {/* Bank Details Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Account Holder Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Travel Services Ltd"
                        value={formData.accountHolderName}
                        onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                        className={`w-full bg-slate-50 border text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:bg-white transition ${
                          errors.accountHolderName ? "border-red-500 bg-red-50/30 ring-2 ring-red-500/20" : "border-slate-200 focus:border-[#2563EB]"
                        }`}
                      />
                      {errors.accountHolderName && <p className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.accountHolderName}</p>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Bank Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. HDFC Bank"
                        value={formData.bankName}
                        onChange={(e) => handleInputChange("bankName", e.target.value)}
                        className={`w-full bg-slate-50 border text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:bg-white transition ${
                          errors.bankName ? "border-red-500 bg-red-50/30 ring-2 ring-red-500/20" : "border-slate-200 focus:border-[#2563EB]"
                        }`}
                      />
                      {errors.bankName && <p className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.bankName}</p>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        Bank Account Number <span className="text-red-500">*</span> (9–18 Digits)
                      </label>
                      <input
                        type="text"
                        maxLength={18}
                        placeholder="e.g. 50200012345678"
                        value={formData.accountNumber}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/\D/g, "").slice(0, 18);
                          handleInputChange("accountNumber", clean);
                        }}
                        className={`w-full bg-slate-50 border text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:bg-white transition font-mono font-semibold ${
                          errors.accountNumber ? "border-red-500 bg-red-50/30 ring-2 ring-red-500/20" : "border-slate-200 focus:border-[#2563EB]"
                        }`}
                      />
                      {errors.accountNumber && <p className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.accountNumber}</p>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                        IFSC / SWIFT Code <span className="text-red-500">*</span> (11 Chars)
                      </label>
                      <input
                        type="text"
                        maxLength={11}
                        placeholder="e.g. HDFC0001234"
                        value={formData.ifscSwiftCode}
                        onChange={(e) => {
                          const clean = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11);
                          handleInputChange("ifscSwiftCode", clean);
                          const errMsg = validateIfscCode(clean);
                          setErrors((prev) => ({ ...prev, ifscSwiftCode: errMsg }));
                        }}
                        onBlur={() => {
                          const errMsg = validateIfscCode(formData.ifscSwiftCode);
                          setErrors((prev) => ({ ...prev, ifscSwiftCode: errMsg }));
                        }}
                        className={`w-full bg-slate-50 border text-slate-800 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:bg-white transition font-mono font-bold tracking-wider ${
                          errors.ifscSwiftCode ? "border-red-500 bg-red-50/30 ring-2 ring-red-500/20" : "border-slate-200 focus:border-[#2563EB]"
                        }`}
                      />
                      {errors.ifscSwiftCode && <p className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.ifscSwiftCode}</p>}
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs space-y-2">
                    <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                      <Info size={14} className="text-[#2563EB]" />
                      <span>Summary Review</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                      <div><span className="text-slate-500">Agent Name:</span> <strong>{formData.firstName} {formData.lastName}</strong></div>
                      <div><span className="text-slate-500">Agency Name:</span> <strong className="text-[#2563EB]">{formData.agencyName || "Not Specified"}</strong></div>
                      <div><span className="text-slate-500">Mobile:</span> <strong>{phoneDialCode} {formData.phone}</strong></div>
                      <div><span className="text-slate-500">Email:</span> <strong>{formData.email}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* BOTTOM NAVIGATION BUTTONS */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1 || isSubmitting}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-xl shadow-md shadow-[#2563EB]/20 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Next Step</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Submit Agent Application</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}
