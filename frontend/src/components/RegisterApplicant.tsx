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
  Info,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  MapPin
} from "lucide-react";

export interface RegisterApplicantProps {
  onClose?: () => void;
  onSuccessSubmit?: (applicantData: any) => void;
}

// Static Indian Postal Code Lookup Dictionary for Instant Auto-Fill
const PIN_CODE_MAP: Record<string, { city: string; state: string }> = {
  "110001": { city: "New Delhi", state: "Delhi" },
  "110002": { city: "Central Delhi", state: "Delhi" },
  "110016": { city: "South Delhi", state: "Delhi" },
  "110085": { city: "North West Delhi", state: "Delhi" },
  "201301": { city: "Noida", state: "Uttar Pradesh" },
  "122001": { city: "Gurugram", state: "Haryana" },
  "121001": { city: "Faridabad", state: "Haryana" },
  "400001": { city: "Mumbai", state: "Maharashtra" },
  "400050": { city: "Bandra, Mumbai", state: "Maharashtra" },
  "411001": { city: "Pune", state: "Maharashtra" },
  "440001": { city: "Nagpur", state: "Maharashtra" },
  "560001": { city: "Bengaluru", state: "Karnataka" },
  "560038": { city: "Indiranagar, Bengaluru", state: "Karnataka" },
  "570001": { city: "Mysuru", state: "Karnataka" },
  "700001": { city: "Kolkata", state: "West Bengal" },
  "700091": { city: "Salt Lake, Kolkata", state: "West Bengal" },
  "600001": { city: "Chennai", state: "Tamil Nadu" },
  "641001": { city: "Coimbatore", state: "Tamil Nadu" },
  "500001": { city: "Hyderabad", state: "Telangana" },
  "530001": { city: "Visakhapatnam", state: "Andhra Pradesh" },
  "380001": { city: "Ahmedabad", state: "Gujarat" },
  "395001": { city: "Surat", state: "Gujarat" },
  "302001": { city: "Jaipur", state: "Rajasthan" },
  "342001": { city: "Jodhpur", state: "Rajasthan" },
  "248001": { city: "Dehradun", state: "Uttarakhand" },
  "226001": { city: "Lucknow", state: "Uttar Pradesh" },
  "208001": { city: "Kanpur", state: "Uttar Pradesh" },
  "160017": { city: "Chandigarh", state: "Chandigarh" },
  "143001": { city: "Amritsar", state: "Punjab" },
  "682001": { city: "Kochi", state: "Kerala" },
  "695001": { city: "Thiruvananthapuram", state: "Kerala" },
  "751001": { city: "Bhubaneswar", state: "Odisha" },
  "462001": { city: "Bhopal", state: "Madhya Pradesh" },
  "452001": { city: "Indore", state: "Madhya Pradesh" },
  "800001": { city: "Patna", state: "Bihar" }
};

// Comprehensive World Destination Countries List
const WORLD_COUNTRIES = [
  "Canada",
  "United States",
  "United Kingdom",
  "Australia",
  "Schengen Area (Europe)",
  "United Arab Emirates (Dubai)",
  "Japan",
  "Singapore",
  "New Zealand",
  "Saudi Arabia",
  "Qatar",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Switzerland",
  "Netherlands",
  "Austria",
  "Belgium",
  "Brazil",
  "China",
  "Czech Republic",
  "Denmark",
  "Egypt",
  "Finland",
  "Georgia",
  "Greece",
  "Hong Kong",
  "Hungary",
  "Indonesia",
  "Ireland",
  "Israel",
  "Jordan",
  "Kenya",
  "Kuwait",
  "Malaysia",
  "Maldives",
  "Mauritius",
  "Mexico",
  "Morocco",
  "Nepal",
  "Norway",
  "Oman",
  "Philippines",
  "Poland",
  "Portugal",
  "Russia",
  "South Africa",
  "South Korea",
  "Sri Lanka",
  "Sweden",
  "Taiwan",
  "Thailand",
  "Turkey",
  "Vietnam"
];

// Comprehensive World Nationalities List
const NATIONALITIES = [
  "Indian",
  "American",
  "British",
  "Canadian",
  "Australian",
  "Emirati",
  "German",
  "French",
  "Japanese",
  "Singaporean",
  "Saudi",
  "Qatari",
  "Kuwaiti",
  "Omani",
  "Bahraini",
  "Malaysian",
  "Indonesian",
  "Thai",
  "Vietnamese",
  "Filipino",
  "South Korean",
  "Chinese",
  "New Zealander",
  "South African",
  "Brazilian",
  "Mexican",
  "Spanish",
  "Italian",
  "Swiss",
  "Dutch",
  "Swedish",
  "Norwegian",
  "Danish",
  "Irish",
  "Russian",
  "Egyptian",
  "Sri Lankan",
  "Nepalese",
  "Other"
];

// International Country Dial Codes
const COUNTRY_DIAL_CODES = [
  { code: "IN", dialCode: "+91", name: "India" },
  { code: "US", dialCode: "+1", name: "United States" },
  { code: "CA", dialCode: "+1", name: "Canada" },
  { code: "GB", dialCode: "+44", name: "United Kingdom" },
  { code: "AE", dialCode: "+971", name: "United Arab Emirates" },
  { code: "AU", dialCode: "+61", name: "Australia" },
  { code: "SG", dialCode: "+65", name: "Singapore" },
  { code: "DE", dialCode: "+49", name: "Germany" },
  { code: "FR", dialCode: "+33", name: "France" },
  { code: "JP", dialCode: "+81", name: "Japan" },
  { code: "SA", dialCode: "+966", name: "Saudi Arabia" },
  { code: "QA", dialCode: "+974", name: "Qatar" },
  { code: "KW", dialCode: "+965", name: "Kuwait" },
  { code: "OM", dialCode: "+968", name: "Oman" },
  { code: "BH", dialCode: "+973", name: "Bahrain" },
  { code: "MY", dialCode: "+60", name: "Malaysia" },
  { code: "ID", dialCode: "+62", name: "Indonesia" },
  { code: "TH", dialCode: "+66", name: "Thailand" },
  { code: "VN", dialCode: "+84", name: "Vietnam" },
  { code: "PH", dialCode: "+63", name: "Philippines" },
  { code: "KR", dialCode: "+82", name: "South Korea" },
  { code: "CN", dialCode: "+86", name: "China" },
  { code: "HK", dialCode: "+852", name: "Hong Kong" },
  { code: "TW", dialCode: "+886", name: "Taiwan" },
  { code: "NZ", dialCode: "+64", name: "New Zealand" },
  { code: "ZA", dialCode: "+27", name: "South Africa" },
  { code: "BR", dialCode: "+55", name: "Brazil" },
  { code: "MX", dialCode: "+52", name: "Mexico" },
  { code: "ES", dialCode: "+34", name: "Spain" },
  { code: "IT", dialCode: "+39", name: "Italy" },
  { code: "CH", dialCode: "+41", name: "Switzerland" },
  { code: "NL", dialCode: "+31", name: "Netherlands" },
  { code: "SE", dialCode: "+46", name: "Sweden" },
  { code: "NO", dialCode: "+47", name: "Norway" },
  { code: "DK", dialCode: "+45", name: "Denmark" },
  { code: "IE", dialCode: "+353", name: "Ireland" },
  { code: "RU", dialCode: "+7", name: "Russia" },
  { code: "EG", dialCode: "+20", name: "Egypt" },
  { code: "LK", dialCode: "+94", name: "Sri Lanka" },
  { code: "NP", dialCode: "+977", name: "Nepal" }
];

export default function RegisterApplicant({ onClose, onSuccessSubmit }: RegisterApplicantProps) {
  // Current Step state (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isAutoFillingPin, setIsAutoFillingPin] = useState<boolean>(false);

  // Yesterday date string for DOB max limit
  const maxDobDate = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Dynamic completion percentage calculator (starts at 0% when no fields filled)
  const getProgressPercentage = () => {
    const step1Required = ["firstName", "lastName", "email", "phone", "password", "confirmPassword", "dob"];
    const step1Filled = step1Required.filter((f) => !!formData[f as keyof typeof formData]).length;

    if (currentStep === 1) {
      return Math.round((step1Filled / step1Required.length) * 16);
    }

    const baseProgress = ((currentStep - 1) / 6) * 100;
    return Math.min(100, Math.round(baseProgress));
  };

  // Form State containing all 6 steps of data
  const [formData, setFormData] = useState({
    // Step 1: Personal Information & Credentials
    applicantId: "APP-AutoGenerated",
    fullName: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "Male",
    nationality: "Indian",
    phoneCountryCode: "+91",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    emergencyPhoneCountryCode: "+91",
    emergencyPhone: "",
    passportNo: "",
    address: "",
    postalCode: "",
    city: "",
    state: "",
    country: "India",

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
    addressProofVerified: false
  });

  // Validation Errors and Touched Fields State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Real File attachments state
  const [attachedFiles, setAttachedFiles] = useState<Record<string, File>>({});

  // Step Meta Configuration
  const stepsConfig = [
    { num: 1, title: "Personal Info & Credentials", icon: User },
    { num: 2, title: "Passport Details", icon: FileText },
    { num: 3, title: "Visa Information", icon: Globe },
    { num: 4, title: "KYC Verification", icon: ShieldCheck },
    { num: 5, title: "Document Uploads", icon: Upload },
    { num: 6, title: "Timeline & Review", icon: CheckCircle2 }
  ];

  // UI Toast State
  const [toastConfig, setToastConfig] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);

  const triggerToast = (title: string, description?: string, type: "success" | "error" = "error") => {
    setToastConfig({ title, description, type });
    setTimeout(() => setToastConfig(null), 5000);
  };

  // Field validation rules logic
  const validateFieldRule = (field: string, value: any, currentData = formData): string => {
    switch (field) {
      case "firstName": {
        if (!value || !value.trim()) return "First name is required.";
        const nameVal = value.trim();
        if (!/^[A-Za-z\s]+$/.test(nameVal)) return "First name must contain letters only (no numbers or symbols).";
        if (nameVal.length < 2) return "First name must be at least 2 characters.";
        return "";
      }

      case "lastName": {
        if (!value || !value.trim()) return "Last name is required.";
        const nameVal = value.trim();
        if (!/^[A-Za-z\s]+$/.test(nameVal)) return "Last name must contain letters only (no numbers or symbols).";
        if (nameVal.length < 2) return "Last name must be at least 2 characters.";
        return "";
      }

      case "email": {
        if (!value || !value.trim()) return "Email address is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return "Please enter a valid email address (e.g. name@domain.com).";
        return "";
      }

      case "phone": {
        if (!value || !value.trim()) return "Phone / Mobile number is required.";
        const cleanPhone = value.replace(/\D/g, "");
        if (cleanPhone.length < 7 || cleanPhone.length > 15) {
          return "Phone number must be a valid 7 to 15-digit international mobile number.";
        }
        return "";
      }

      case "emergencyPhone": {
        if (value && value.trim()) {
          const cleanEmergency = value.replace(/\D/g, "");
          if (cleanEmergency.length < 7 || cleanEmergency.length > 15) {
            return "Emergency mobile number must be a valid 7 to 15-digit international number.";
          }
        }
        return "";
      }

      case "password": {
        if (!value) return "Account password is required.";
        if (value.length < 6) return "Password must be at least 6 characters long.";
        return "";
      }

      case "confirmPassword": {
        if (!value) return "Please confirm your password.";
        if (value !== currentData.password) return "Passwords do not match.";
        return "";
      }

      case "dob": {
        if (!value) return "Date of birth is required.";
        const birthDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (isNaN(birthDate.getTime()) || birthDate >= today) return "Date of birth cannot be today or a future date.";
        return "";
      }

      case "passportNo": {
        if (!value || !value.trim()) return "Passport number is required.";
        const passUpper = value.trim().toUpperCase();
        if (!/^[A-Z][0-9]{7}$/.test(passUpper) && !/^[A-Z0-9]{8}$/.test(passUpper)) {
          return "Passport number must be 1 letter followed by 7 digits (e.g. Z9817264).";
        }
        return "";
      }

      case "passportExpiryDate": {
        if (!value) return "Passport expiry date is required.";
        const expiry = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (isNaN(expiry.getTime()) || expiry <= today) return "Passport expiry date must be in the future.";
        return "";
      }

      case "destinationCountry": {
        if (!value) return "Destination country is required.";
        return "";
      }

      case "expectedTravelDate": {
        if (!value) return "Expected travel date is required.";
        const travel = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (isNaN(travel.getTime()) || travel <= today) return "Travel date must be in the future.";
        return "";
      }

      case "postalCode": {
        if (value && value.trim()) {
          const cleanZip = value.replace(/\D/g, "");
          if (cleanZip.length !== 6) return "Postal PIN Code must be exactly 6 digits.";
        }
        return "";
      }

      case "aadhaarNumber": {
        if (value && value.trim()) {
          const cleanAadhaar = value.replace(/[\s-]/g, "");
          if (!/^\d{12}$/.test(cleanAadhaar)) return "Aadhaar number must be exactly 12 digits.";
        }
        return "";
      }

      case "panCardNumber": {
        if (value && value.trim()) {
          if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(value.trim())) return "Invalid PAN format (e.g. ABCDE1234F).";
        }
        return "";
      }

      default:
        return "";
    }
  };

  // Automated Postal Code PIN Auto-Fill Lookup
  const lookupPostalCode = async (pin: string) => {
    const cleanPin = pin.replace(/\D/g, "");
    if (cleanPin.length === 6) {
      if (PIN_CODE_MAP[cleanPin]) {
        const { city, state } = PIN_CODE_MAP[cleanPin];
        setFormData((prev) => ({ ...prev, city, state }));
        triggerToast("Location Found", `Auto-filled City: ${city}, State: ${state}`, "success");
        return;
      }

      setIsAutoFillingPin(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.[0]) {
          const po = data[0].PostOffice[0];
          const foundCity = po.District || po.Block || po.Name;
          const foundState = po.State;
          setFormData((prev) => ({ ...prev, city: foundCity, state: foundState }));
          triggerToast("Location Found", `Auto-filled City: ${foundCity}, State: ${foundState}`, "success");
        }
      } catch (err) {
        // Fallback
      } finally {
        setIsAutoFillingPin(false);
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const nextState = { ...prev, [field]: value };
      if (field === "firstName" || field === "lastName") {
        const fn = field === "firstName" ? value : prev.firstName;
        const ln = field === "lastName" ? value : prev.lastName;
        nextState.fullName = `${fn} ${ln}`.trim();
      }
      return nextState;
    });

    if (field === "postalCode") {
      lookupPostalCode(value);
    }

    // Validate in real time if touched
    if (touched[field]) {
      setErrors((prev) => {
        const currentData = { ...formData, [field]: value };
        const errorMsg = validateFieldRule(field, value, currentData);
        return { ...prev, [field]: errorMsg };
      });
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateFieldRule(field, formData[field as keyof typeof formData]);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleFileSelection = (docKey: string, file: File | null) => {
    if (!file) return;
    setAttachedFiles((prev) => ({ ...prev, [docKey]: file }));
    triggerToast("Document Attached", `Attached file: ${file.name}`, "success");
  };

  // Comprehensive Step Validation Function
  const validateStep = (stepNum: number): boolean => {
    const stepErrors: Record<string, string> = {};
    const stepTouched: Record<string, boolean> = {};

    let fieldsToValidate: string[] = [];

    if (stepNum === 1) {
      fieldsToValidate = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "password",
        "confirmPassword",
        "dob",
        "passportNo"
      ];
    } else if (stepNum === 2) {
      fieldsToValidate = ["passportExpiryDate"];
    } else if (stepNum === 3) {
      fieldsToValidate = ["destinationCountry", "expectedTravelDate"];
    } else if (stepNum === 4) {
      if (!formData.aadhaarNumber.trim() && !formData.govtIdNumber.trim() && !formData.panCardNumber.trim()) {
        stepErrors.aadhaarNumber = "Please provide at least one Government ID (Aadhaar or PAN).";
      }
      fieldsToValidate = ["aadhaarNumber", "panCardNumber"];
    }

    fieldsToValidate.forEach((field) => {
      stepTouched[field] = true;
      const errorMsg = validateFieldRule(field, formData[field as keyof typeof formData]);
      if (errorMsg) {
        stepErrors[field] = errorMsg;
      }
    });

    setTouched((prev) => ({ ...prev, ...stepTouched }));
    setErrors((prev) => ({ ...prev, ...stepErrors }));

    const errorCount = Object.keys(stepErrors).filter((k) => !!stepErrors[k]).length;

    if (errorCount > 0) {
      triggerToast(
        `Validation Warning on Step ${stepNum}`,
        `Please fix the ${errorCount} highlighted field error${errorCount > 1 ? "s" : ""} below before proceeding.`,
        "error"
      );
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 6) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      const cleanPhone = formData.phone.replace(/\D/g, "");
      const fullPhone = cleanPhone ? `${formData.phoneCountryCode || "+91"}${cleanPhone}` : "";

      const cleanEmergency = formData.emergencyPhone.replace(/\D/g, "");
      const fullEmergency = cleanEmergency ? `${formData.emergencyPhoneCountryCode || "+91"}${cleanEmergency}` : "";

      const textData = {
        ...formData,
        phone: fullPhone,
        emergencyPhone: fullEmergency,
        fullName: `${formData.firstName} ${formData.lastName}`.trim()
      };

      payload.append("formData", JSON.stringify(textData));

      Object.keys(attachedFiles).forEach((key) => {
        payload.append(key, attachedFiles[key]);
      });

      const res = await fetch("http://localhost:5000/api/v1/auth/register-applicant", {
        method: "POST",
        body: payload
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || json.message || "Registration failed.");
      }

      triggerToast(
        "Registration Complete!",
        `Applicant ID ${json.data.applicantId} saved to MongoDB. Redirecting to login...`,
        "success"
      );

      setTimeout(() => {
        if (onSuccessSubmit) {
          onSuccessSubmit(json.data);
        }
      }, 1500);
    } catch (err: any) {
      triggerToast("Submission Error", err.message || "Failed to register applicant.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for dynamic input classes
  const getInputClassName = (field: string, extraClasses: string = "") => {
    const hasError = !!errors[field];
    const isValid = touched[field] && !hasError && !!formData[field as keyof typeof formData];

    return `w-full text-xs px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 focus:outline-none ${
      hasError
        ? "bg-rose-50/70 border-2 border-rose-400 text-rose-900 focus:border-rose-600 focus:ring-4 focus:ring-rose-500/15 shadow-xs shadow-rose-100 placeholder:text-rose-300"
        : isValid
        ? "bg-slate-50 border border-emerald-400/80 text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        : "bg-slate-50 border border-slate-200 text-slate-800 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
    } ${extraClasses}`;
  };

  // Helper for inline error message
  const renderFieldError = (field: string) => {
    if (!errors[field]) return null;
    return (
      <p className="mt-1.5 text-[11px] font-semibold text-rose-600 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
        <AlertCircle size={13} className="shrink-0 text-rose-500" />
        <span>{errors[field]}</span>
      </p>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200 overflow-y-auto pb-24">
      
      {/* ELEGANT LIGHT THEMED TOAST NOTIFICATION CARD */}
      {toastConfig && (
        <div
          className={`fixed top-6 right-6 z-50 max-w-md px-5 py-4 rounded-2xl shadow-2xl bg-white border border-slate-200/90 flex items-start gap-3.5 animate-in slide-in-from-top-4 duration-300 ${
            toastConfig.type === "error"
              ? "border-l-4 border-l-rose-500 shadow-rose-900/10"
              : "border-l-4 border-l-[#2563EB] shadow-blue-900/10"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
              toastConfig.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-600"
                : "bg-blue-50 border-blue-200 text-[#2563EB]"
            }`}
          >
            {toastConfig.type === "error" ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          </div>

          <div className="flex-1 pr-2">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black tracking-tight text-slate-900 font-outfit">{toastConfig.title}</h4>
              <span
                className={`text-[9px] font-extrabold uppercase font-mono px-2.5 py-0.5 rounded-full border ${
                  toastConfig.type === "error"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-blue-50 text-[#2563EB] border-blue-200"
                }`}
              >
                {toastConfig.type === "error" ? "Action Required" : "Success"}
              </span>
            </div>
            {toastConfig.description && (
              <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                {toastConfig.description}
              </p>
            )}
          </div>

          <button
            onClick={() => setToastConfig(null)}
            className="text-slate-400 hover:text-slate-700 transition p-1 cursor-pointer"
          >
            <X size={15} />
          </button>
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
              {getProgressPercentage()}% Completed
            </span>
          </div>

          {/* Progress Bar Line */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] h-full transition-all duration-300 rounded-full"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>

          {/* Step Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-2 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE]">
            {stepsConfig.map((st) => {
              const IconC = st.icon;
              const isCurrent = currentStep === st.num;
              const isCompleted = currentStep > st.num;

              return (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => {
                    if (st.num < currentStep || validateStep(currentStep)) {
                      setCurrentStep(st.num);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
                    isCurrent
                      ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
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

      {/* STEP CONTENT CONTAINER */}
      <div className="space-y-6 mb-6">
        {/* STEP 1: PERSONAL INFORMATION & CREDENTIALS */}
        {currentStep === 1 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                <User size={18} className="text-[#2563EB]" />
                <span>Section 1: Personal Information & Credentials</span>
              </h3>
              <span className="text-[10px] font-mono font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Auto-Assigned ID on Submission
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* FIRST NAME */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Animesh"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    onBlur={() => handleFieldBlur("firstName")}
                    className={getInputClassName("firstName")}
                  />
                  {touched.firstName && !errors.firstName && formData.firstName && (
                    <Check size={14} className="absolute right-3 top-3 text-emerald-500 pointer-events-none" />
                  )}
                </div>
                {renderFieldError("firstName")}
              </div>

              {/* LAST NAME */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Jain"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    onBlur={() => handleFieldBlur("lastName")}
                    className={getInputClassName("lastName")}
                  />
                  {touched.lastName && !errors.lastName && formData.lastName && (
                    <Check size={14} className="absolute right-3 top-3 text-emerald-500 pointer-events-none" />
                  )}
                </div>
                {renderFieldError("lastName")}
              </div>

              {/* EMAIL ADDRESS */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="animesh@gmail.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => handleFieldBlur("email")}
                    className={getInputClassName("email")}
                  />
                  {touched.email && !errors.email && formData.email && (
                    <Check size={14} className="absolute right-3 top-3 text-emerald-500 pointer-events-none" />
                  )}
                </div>
                {renderFieldError("email")}
              </div>

              {/* PHONE NUMBER */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Phone / Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2 items-center">
                  <select
                    value={formData.phoneCountryCode || "+91"}
                    onChange={(e) => handleInputChange("phoneCountryCode", e.target.value)}
                    className="w-28 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold font-mono py-2.5 px-2 rounded-xl focus:outline-none focus:border-[#2563EB] shrink-0 truncate shadow-2xs cursor-pointer"
                  >
                    {COUNTRY_DIAL_CODES.map((c) => (
                      <option key={c.code + c.dialCode} value={c.dialCode}>
                        {c.code} ({c.dialCode})
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1 min-w-0">
                    <input
                      type="text"
                      maxLength={15}
                      placeholder="Mobile number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, ""))}
                      onBlur={() => handleFieldBlur("phone")}
                      className={getInputClassName("phone", "font-mono")}
                    />
                    {touched.phone && !errors.phone && formData.phone && (
                      <Check size={14} className="absolute right-3 top-3 text-emerald-500 pointer-events-none" />
                    )}
                  </div>
                </div>
                {renderFieldError("phone")}
              </div>

              {/* ACCOUNT PASSWORD */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Account Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    onBlur={() => handleFieldBlur("password")}
                    className={getInputClassName("password", "pr-9")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {renderFieldError("password")}
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    onBlur={() => handleFieldBlur("confirmPassword")}
                    className={getInputClassName("confirmPassword")}
                  />
                  {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                    <Check size={14} className="absolute right-3 top-3 text-emerald-500 pointer-events-none" />
                  )}
                </div>
                {renderFieldError("confirmPassword")}
              </div>

              {/* DATE OF BIRTH */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  max={maxDobDate}
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  onBlur={() => handleFieldBlur("dob")}
                  className={getInputClassName("dob")}
                />
                {renderFieldError("dob")}
              </div>

              {/* GENDER */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* NATIONALITY */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Nationality <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.nationality}
                  onChange={(e) => handleInputChange("nationality", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                >
                  {NATIONALITIES.map((nat) => (
                    <option key={nat} value={nat}>
                      {nat}
                    </option>
                  ))}
                </select>
              </div>

              {/* PASSPORT NUMBER */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Passport Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={8}
                    placeholder="e.g. Z9817264"
                    value={formData.passportNo}
                    onChange={(e) => handleInputChange("passportNo", e.target.value.toUpperCase())}
                    onBlur={() => handleFieldBlur("passportNo")}
                    className={getInputClassName("passportNo", "font-mono uppercase font-bold")}
                  />
                  {touched.passportNo && !errors.passportNo && formData.passportNo && (
                    <Check size={14} className="absolute right-3 top-3 text-emerald-500 pointer-events-none" />
                  )}
                </div>
                {renderFieldError("passportNo")}
              </div>

              {/* EMERGENCY MOBILE NUMBER */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Emergency Mobile Number
                </label>
                <div className="flex gap-2 items-center">
                  <select
                    value={formData.emergencyPhoneCountryCode || "+91"}
                    onChange={(e) => handleInputChange("emergencyPhoneCountryCode", e.target.value)}
                    className="w-28 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold font-mono py-2.5 px-2 rounded-xl focus:outline-none focus:border-[#2563EB] shrink-0 truncate shadow-2xs cursor-pointer"
                  >
                    {COUNTRY_DIAL_CODES.map((c) => (
                      <option key={c.code + c.dialCode} value={c.dialCode}>
                        {c.code} ({c.dialCode})
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1 min-w-0">
                    <input
                      type="text"
                      maxLength={15}
                      placeholder="Emergency mobile number"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange("emergencyPhone", e.target.value.replace(/\D/g, ""))}
                      onBlur={() => handleFieldBlur("emergencyPhone")}
                      className={getInputClassName("emergencyPhone", "font-mono")}
                    />
                    {touched.emergencyPhone && !errors.emergencyPhone && formData.emergencyPhone && (
                      <Check size={14} className="absolute right-3 top-3 text-emerald-500 pointer-events-none" />
                    )}
                  </div>
                </div>
                {renderFieldError("emergencyPhone")}
              </div>

              {/* RESIDENTIAL ADDRESS */}
              <div className="sm:col-span-4">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  placeholder="House No, Street Name, Landmark"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* POSTAL PIN CODE (BEFORE CITY & STATE WITH AUTO-FILL) */}
              <div className="sm:col-span-4 bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 font-outfit">
                    <MapPin size={15} className="text-[#2563EB]" />
                    <span>PIN Code Location Auto-Fill</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Type 6-digit PIN code to auto-fill City & State
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Postal PIN Code (6 Digits)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 110001"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange("postalCode", e.target.value.replace(/\D/g, ""))}
                        onBlur={() => handleFieldBlur("postalCode")}
                        className={getInputClassName("postalCode", "font-mono font-bold")}
                      />
                      {isAutoFillingPin && (
                        <span className="absolute right-3 top-3 text-[10px] text-[#2563EB] animate-spin font-bold">
                          ⌛
                        </span>
                      )}
                    </div>
                    {renderFieldError("postalCode")}
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      City / District (Auto-Filled)
                    </label>
                    <input
                      type="text"
                      placeholder="Auto-filled from PIN"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      State (Auto-Filled)
                    </label>
                    <input
                      type="text"
                      placeholder="Auto-filled from PIN"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                    />
                  </div>
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
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
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
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  max={maxDobDate}
                  value={formData.passportIssueDate}
                  onChange={(e) => handleInputChange("passportIssueDate", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Expiry Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.passportExpiryDate}
                  onChange={(e) => handleInputChange("passportExpiryDate", e.target.value)}
                  onBlur={() => handleFieldBlur("passportExpiryDate")}
                  className={getInputClassName("passportExpiryDate")}
                />
                {renderFieldError("passportExpiryDate")}
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
                  Destination Country <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.destinationCountry}
                  onChange={(e) => handleInputChange("destinationCountry", e.target.value)}
                  onBlur={() => handleFieldBlur("destinationCountry")}
                  className={getInputClassName("destinationCountry", "font-semibold")}
                >
                  {WORLD_COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {renderFieldError("destinationCountry")}
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Visa Category
                </label>
                <select
                  value={formData.visaCategory}
                  onChange={(e) => handleInputChange("visaCategory", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                >
                  <option value="Tourist Visa">Tourist / Visitor Visa</option>
                  <option value="Student Visa">Student Study Permit</option>
                  <option value="Business Visa">Business Visitor Visa</option>
                  <option value="Work Permit">Work Permit Visa</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Entry Type
                </label>
                <select
                  value={formData.entryType}
                  onChange={(e) => handleInputChange("entryType", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                >
                  <option value="Multiple Entry">Multiple Entry</option>
                  <option value="Single Entry">Single Entry</option>
                  <option value="Double Entry">Double Entry</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Duration of Stay
                </label>
                <select
                  value={formData.durationOfStay}
                  onChange={(e) => handleInputChange("durationOfStay", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                >
                  <option value="90 Days">90 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="60 Days">60 Days</option>
                  <option value="180 Days">180 Days</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="5 Years">5 Years</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Expected Travel Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.expectedTravelDate}
                  onChange={(e) => handleInputChange("expectedTravelDate", e.target.value)}
                  onBlur={() => handleFieldBlur("expectedTravelDate")}
                  className={getInputClassName("expectedTravelDate")}
                />
                {renderFieldError("expectedTravelDate")}
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
              <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {formData.kycStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Aadhaar / Government National ID (12 Digits)
                </label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="XXXX XXXX XXXX"
                  value={formData.aadhaarNumber}
                  onChange={(e) => handleInputChange("aadhaarNumber", e.target.value.replace(/\D/g, ""))}
                  onBlur={() => handleFieldBlur("aadhaarNumber")}
                  className={getInputClassName("aadhaarNumber", "font-mono")}
                />
                {renderFieldError("aadhaarNumber")}
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  PAN Card Number (e.g. ABCDE1234F)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="ABCDE1234F"
                  value={formData.panCardNumber}
                  onChange={(e) => handleInputChange("panCardNumber", e.target.value.toUpperCase())}
                  onBlur={() => handleFieldBlur("panCardNumber")}
                  className={getInputClassName("panCardNumber", "font-mono uppercase")}
                />
                {renderFieldError("panCardNumber")}
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
                  <span className="text-[#2563EB] font-bold">Document Ready</span>
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
                { key: "passportScan", label: "Passport Bio Page Scan", required: true },
                { key: "photo", label: "Passport Photo (White BG)", required: true },
                { key: "nationalId", label: "Aadhaar / National ID", required: false },
                { key: "bankStatement", label: "Bank Statement Proof", required: false },
                { key: "addressProof", label: "Address Proof Document", required: false },
                { key: "employerLetter", label: "Employer Offer / NOC Letter", required: false },
                { key: "coverLetter", label: "Cover Letter / Travel Plan", required: false },
                { key: "supportingDocs", label: "Supporting Docs Bundle", required: false }
              ].map((doc) => {
                const attachedFile = attachedFiles[doc.key];

                return (
                  <div
                    key={doc.key}
                    className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-2 ${
                      attachedFile
                        ? "border-emerald-300 bg-emerald-50/40"
                        : doc.required
                        ? "border-amber-200 bg-amber-50/20"
                        : "border-dashed border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <span className="font-extrabold text-slate-800 block text-xs truncate">
                        {doc.label} {doc.required && <span className="text-rose-500">*</span>}
                      </span>
                      {attachedFile ? (
                        <span className="text-[10px] text-emerald-700 font-mono font-bold flex items-center gap-1 mt-0.5 truncate">
                          <CheckCircle2 size={11} className="shrink-0" /> {attachedFile.name}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {doc.required ? "Required" : "Optional"}
                        </span>
                      )}
                    </div>

                    <label className="px-2.5 py-1.5 bg-white hover:bg-blue-50 text-[#2563EB] border border-blue-200 rounded-xl text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition shadow-2xs">
                      <Upload size={12} /> {attachedFile ? "Change" : "Upload"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileSelection(doc.key, e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: TIMELINE & FINAL REVIEW */}
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
                <span className="text-[#2563EB] font-mono">Sequential ID will be generated</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700 font-medium">
                <div>Full Name: <strong className="text-slate-900">{`${formData.firstName} ${formData.lastName}`}</strong></div>
                <div>Email: <strong className="text-[#2563EB] font-mono">{formData.email}</strong></div>
                <div>Phone: <strong className="text-slate-900 font-mono">{formData.phone}</strong></div>
                <div>Passport: <strong className="text-slate-900 font-mono">{formData.passportNo}</strong></div>
                <div>Destination: <strong className="text-slate-900">{formData.destinationCountry}</strong></div>
                <div>Visa Category: <strong className="text-slate-900">{formData.visaCategory}</strong></div>
                <div>Nationality: <strong className="text-slate-900">{formData.nationality}</strong></div>
                <div>Documents Attached: <strong className="text-emerald-700 font-mono">{Object.keys(attachedFiles).length} Files</strong></div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs text-center">
              {[
                { step: "1. Account Creation", done: true },
                { step: "2. Form Submission", done: true },
                { step: "3. Document Upload", done: Object.keys(attachedFiles).length > 0 },
                { step: "4. Document Verification", done: false },
                { step: "5. Embassy Processing", done: false },
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

      {/* BOTTOM WIZARD NAVIGATION BAR */}
      <div className="shrink-0 bg-white border border-slate-200 p-4 shadow-xl flex items-center justify-between w-full max-w-6xl mx-auto rounded-2xl mt-4">
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={currentStep === 1 || isSubmitting}
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
            disabled={isSubmitting}
            className="px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/25 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>Registering Applicant in MongoDB...</>
            ) : (
              <>
                <CheckCircle2 size={16} /> Complete & Save Applicant Account
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
