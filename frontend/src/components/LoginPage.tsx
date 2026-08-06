import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CountryCode } from "libphonenumber-js";
import {
  validatePhoneNumber,
  requestOtp,
  verifyOtp,
  AuthSession,
  Role,
  getDashboardPath
} from "../lib/authService";
import { API_V1_URL } from "../config/api";
import { Logo } from "./Logo";
import {
  Smartphone,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  Info,
  UserCheck,
  UserPlus,
  Briefcase
} from "lucide-react";
import RegisterApplicant from "./RegisterApplicant";

interface CountryOption {
  code: CountryCode;
  dialCode: string;
  name: string;
  flag: string;
}

const COUNTRIES: CountryOption[] = [
  { code: "IN", dialCode: "+91", name: "India", flag: "🇮🇳" },
  { code: "US", dialCode: "+1", name: "United States", flag: "🇺🇸" },
  { code: "CA", dialCode: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "GB", dialCode: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AE", dialCode: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "AU", dialCode: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "SG", dialCode: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "DE", dialCode: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "FR", dialCode: "+33", name: "France", flag: "🇫🇷" },
  { code: "JP", dialCode: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "SA", dialCode: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "QA", dialCode: "+974", name: "Qatar", flag: "🇶🇦" },
  { code: "KW", dialCode: "+965", name: "Kuwait", flag: "🇰🇼" },
  { code: "OM", dialCode: "+968", name: "Oman", flag: "🇴🇲" },
  { code: "BH", dialCode: "+973", name: "Bahrain", flag: "🇧🇭" },
  { code: "MY", dialCode: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "ID", dialCode: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "TH", dialCode: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "VN", dialCode: "+84", name: "Vietnam", flag: "🇻🇳" },
  { code: "PH", dialCode: "+63", name: "Philippines", flag: "🇵🇭" },
  { code: "KR", dialCode: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "CN", dialCode: "+86", name: "China", flag: "🇨🇳" },
  { code: "HK", dialCode: "+852", name: "Hong Kong", flag: "🇭🇰" },
  { code: "TW", dialCode: "+886", name: "Taiwan", flag: "🇹🇼" },
  { code: "NZ", dialCode: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "ZA", dialCode: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "BR", dialCode: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", dialCode: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "ES", dialCode: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "IT", dialCode: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "CH", dialCode: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "NL", dialCode: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "SE", dialCode: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", dialCode: "+47", name: "Norway", flag: "🇳🇴" },
  { code: "DK", dialCode: "+45", name: "Denmark", flag: "🇩🇰" },
  { code: "IE", dialCode: "+353", name: "Ireland", flag: "🇮🇪" },
  { code: "RU", dialCode: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "EG", dialCode: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "LK", dialCode: "+94", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "NP", dialCode: "+977", name: "Nepal", flag: "🇳🇵" }
];

const PRESETS = [
  { label: "Admin", phone: "+919876543210", role: "Admin", badge: "Super Admin" },
  { label: "Agent", phone: "+919876543212", role: "Agent", badge: "Visa Partner" },
  { label: "Staff", phone: "+919876543211", role: "Staff", badge: "Consular Reviewer" },
  { label: "Applicant", phone: "+919876543213", role: "Applicant", badge: "Self-Serve User" }
];

interface LoginPageProps {
  onSuccess: (session: AuthSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  // Toggle for full Applicant Registration Page
  const [showRegisterApplicant, setShowRegisterApplicant] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("Applicant");

  // Screen Step: 1 = Phone Input, 2 = OTP Verification
  const [step, setStep] = useState<1 | 2>(1);

  // Phone Form State
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [e164Phone, setE164Phone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // OTP Form State
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccessMsg, setOtpSuccessMsg] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);

  // Timers & Security Limits
  const [resendTimer, setResendTimer] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Digit Input Refs
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Resend OTP Countdown Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Lockout Countdown Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (lockoutTimer > 0) {
      interval = setInterval(() => setLockoutTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  // WebOTP API Listener for automatic SMS OTP fill on mobile browsers
  useEffect(() => {
    if (step === 2 && "OTPCredential" in window) {
      const ac = new AbortController();
      (navigator.credentials as any)
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal
        })
        .then((otp: any) => {
          if (otp && otp.code) {
            const codeArr = otp.code.slice(0, 6).split("");
            setOtpDigits(codeArr);
            handleVerifyOtp(otp.code);
          }
        })
        .catch(() => {
          // Ignore WebOTP abort errors
        });

      return () => ac.abort();
    }
  }, [step]);

  // Live E.164 Phone Format Validation
  const handlePhoneChange = (val: string, country = selectedCountry) => {
    // Cap max digits based on selected country (e.g. 10 digits for India IN)
    const maxDigits = country.code === "IN" || country.code === "US" || country.code === "GB" || country.code === "CA" || country.code === "AU" ? 10 : 15;
    const cleanDigits = val.replace(/\D/g, "").slice(0, maxDigits);
    setPhoneNumber(cleanDigits);
    setPhoneError("");

    if (!cleanDigits) {
      setE164Phone("");
      return;
    }

    const fullVal = `${country.dialCode}${cleanDigits}`;
    const validation = validatePhoneNumber(fullVal, country.code);

    if (validation.isValid && validation.e164Format) {
      setE164Phone(validation.e164Format);
      setPhoneError("");
    } else {
      setE164Phone("");
    }
  };

  // Preset Selection Helper
  const handlePresetSelect = (phone: string) => {
    const rawNumber = phone.replace("+91", "");
    setPhoneNumber(rawNumber);
    setE164Phone(phone);
    setPhoneError("");
  };

  // Send OTP Action - Checks MongoDB Database First & Strict libphonenumber-js Validation
  const handleSendOtp = async () => {
    setPhoneError("");
    const cleanDigits = phoneNumber.replace(/\D/g, "");

    if (!cleanDigits) {
      setPhoneError("Please enter a mobile phone number.");
      return;
    }

    const fullVal = `${selectedCountry.dialCode}${cleanDigits}`;
    const validation = validatePhoneNumber(fullVal, selectedCountry.code);

    if (!validation.isValid || !validation.e164Format) {
      setPhoneError(validation.error || `Please enter a valid mobile number for ${selectedCountry.name}.`);
      return;
    }

    const targetE164 = validation.e164Format;
    setE164Phone(targetE164);
    setIsSendingOtp(true);

    try {
      // Query backend to verify if account exists in MongoDB
      const checkRes = await fetch(`${API_V1_URL}/auth/verify-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: targetE164, role: selectedRole })
      });

      const checkJson = await checkRes.json();

      if (!checkRes.ok || !checkJson.success) {
        setIsSendingOtp(false);
        setPhoneError(checkJson.error?.message || "No account registered with this phone number. Please register first as an applicant.");
        return;
      }

      // Account verified in MongoDB -> Send OTP
      const res = requestOtp(targetE164);
      setIsSendingOtp(false);

      if (!res.success) {
        setPhoneError(res.message);
        if (res.cooldownSeconds) {
          setLockoutTimer(res.cooldownSeconds);
        }
        return;
      }

      setDemoCode(res.demoOtp || "123456");
      setOtpSuccessMsg(`OTP sent to ${targetE164}`);
      setStep(2);
      setResendTimer(45);
      setOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    } catch (err: any) {
      setIsSendingOtp(false);
      setPhoneError("Failed to connect to authentication server. Please verify backend service.");
    }
  };

  // OTP Digit Change Handler
  const handleDigitChange = (index: number, value: string) => {
    if (lockoutTimer > 0) return;

    // Handle single character input or paste
    const cleanValue = value.replace(/\D/g, "");

    if (cleanValue.length > 1) {
      // User pasted full OTP
      const pasted = cleanValue.slice(0, 6).split("");
      const newDigits = ["", "", "", "", "", ""];
      pasted.forEach((char, i) => {
        newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      if (pasted.length === 6) {
        handleVerifyOtp(pasted.join(""));
      } else {
        inputRefs[Math.min(pasted.length, 5)].current?.focus();
      }
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleanValue;
    setOtpDigits(newDigits);
    setOtpError("");

    // Auto-advance to next box
    if (cleanValue && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-submit on 6th digit
    if (index === 5 && cleanValue) {
      const fullOtp = [...newDigits.slice(0, 5), cleanValue].join("");
      if (fullOtp.length === 6) {
        handleVerifyOtp(fullOtp);
      }
    }
  };

  // Keydown Backspace Handler
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Resend OTP Handler
  const handleResendOtp = () => {
    if (resendTimer > 0 || lockoutTimer > 0 || !e164Phone) return;

    setIsSendingOtp(true);
    setOtpError("");
    setOtpSuccessMsg("");

    setTimeout(() => {
      const res = requestOtp(e164Phone);
      setIsSendingOtp(false);

      if (!res.success) {
        setOtpError(res.message);
        if (res.cooldownSeconds) {
          setLockoutTimer(res.cooldownSeconds);
        }
        return;
      }

      setDemoCode(res.demoOtp || "123456");
      setOtpSuccessMsg("New OTP code sent via SMS!");
      setResendTimer(45);
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs[0].current?.focus();
    }, 500);
  };

  // Verify OTP or Backend Password Action
  const handleVerifyOtp = async (fullOtp?: string) => {
    const codeToVerify = fullOtp || otpDigits.join("");
    if (codeToVerify.length < 6) {
      setOtpError("Please enter all 6 digits of the OTP code.");
      return;
    }

    setIsVerifying(true);
    setOtpError("");

    try {
      // Attempt backend OTP authentication against MongoDB database
      const res = await fetch(`${API_V1_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: e164Phone || phoneNumber, otp: codeToVerify, role: selectedRole })
      });
      const json = await res.json();

      if (res.ok && json.success && json.data) {
        setIsVerifying(false);
        onSuccess({
          token: json.data.accessToken,
          user: {
            id: json.data.user.id,
            phone: json.data.user.phone,
            role: json.data.user.role,
            name: json.data.user.name
          },
          expiresAt: Date.now() + 15 * 60 * 1000
        });
        return;
      }

      if (json.error?.message) {
        setIsVerifying(false);
        setOtpError(json.error.message);
        return;
      }
    } catch (err) {
      // Fallback to local verifyOtp service if backend call fails
    }

    setTimeout(() => {
      const res = verifyOtp(e164Phone, codeToVerify);
      setIsVerifying(false);

      if (!res.success) {
        setOtpError(res.message);
        if (res.lockoutSeconds) {
          setLockoutTimer(res.lockoutSeconds);
        }
        return;
      }

      if (res.session) {
        onSuccess(res.session);
      }
    }, 600);
  };

  if (showRegisterApplicant) {
    return (
      <RegisterApplicant
        onClose={() => setShowRegisterApplicant(false)}
        onSuccessSubmit={(data) => {
          setShowRegisterApplicant(false);
          if (data?.phone) {
            setPhoneNumber(data.phone);
          }
          setOtpSuccessMsg(
            `Registration complete for ${data?.name || "Applicant"} (${data?.applicantId || "APP-Success"})! Please log in below.`
          );
        }}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FAFAFC] text-slate-800 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none font-sans">
      
      {/* BACKGROUND DECORATIVE GLOW HALOS */}
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[#4848F7]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER WORDMARK */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl w-full mx-auto pb-4 border-b border-slate-200/80">
        <Logo variant="full" size="md" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/register")}
            className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-extrabold rounded-full shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <UserPlus size={14} />
            <span>Register as Applicant</span>
          </button>
          <button
            onClick={() => navigate("/register-agent")}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-full shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <Briefcase size={14} />
            <span>Register as Agent</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#4848F7] bg-[#EEF2FF] px-3.5 py-1.5 rounded-full border border-[#4848F7]/20 font-bold shadow-xs">
            <ShieldCheck size={14} className="text-[#4848F7]" />
            <span>PHANTOM_AUTH_OS v4.8</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 my-auto flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-200/60 space-y-6">
          
          {/* TITLE & DESCRIPTION */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#EEF2FF] text-[#4848F7] border border-[#4848F7]/20">
              <Lock size={12} /> Passwordless Security Node
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {step === 1 ? "Sign in to Phantom OS" : "Verify Phone Number"}
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              {step === 1
                ? "Enter your mobile number to receive a 6-digit OTP code for role-authenticated session login."
                : `Enter the 6-digit verification code sent via SMS to ${e164Phone || phoneNumber}.`}
            </p>
          </div>

          {/* ============================================================ */}
          {/* SCREEN 1: PHONE ENTRY */}
          {/* ============================================================ */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              
              {/* ROLE SELECTOR TOGGLE TABS */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Sign In As</span>
                  <span className="text-[10px] text-[#2563EB] font-mono font-bold">Select Role</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200">
                  {[
                    { role: "Applicant" as Role, label: "Applicant", icon: UserCheck },
                    { role: "Agent" as Role, label: "Agent", icon: Sparkles },
                    { role: "Admin" as Role, label: "Admin", icon: Lock }
                  ].map((item) => (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => setSelectedRole(item.role)}
                      className={`py-2 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        selectedRole === item.role
                          ? "bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/20"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                      }`}
                    >
                      <item.icon size={13} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Input Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Mobile Phone Number</span>
                  <span className="text-[10px] text-[#4848F7] font-mono font-bold">E.164 Standard</span>
                </label>

                <div className="flex gap-2.5 items-center">
                  {/* Selectable International Country Code Dropdown (Fixed compact width w-32) */}
                  <div className="shrink-0 w-32">
                    <select
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const found = COUNTRIES.find((c) => c.code === e.target.value);
                        if (found) {
                          setSelectedCountry(found);
                          handlePhoneChange(phoneNumber, found);
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-extrabold font-mono py-3.5 px-3 rounded-xl cursor-pointer focus:outline-none focus:border-[#4848F7] truncate shadow-2xs"
                      title={selectedCountry.name}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} ({c.dialCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Number Input Field (Flexible flex-1 min-w-0 width) */}
                  <div className="relative flex-1 min-w-0">
                    <input
                      type="tel"
                      maxLength={15}
                      placeholder="Mobile number"
                      value={phoneNumber}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                      className={`w-full bg-slate-50 border text-sm font-mono font-bold py-3.5 pl-3.5 pr-9 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none transition tracking-wide ${
                        e164Phone
                          ? "border-emerald-500 ring-2 ring-emerald-500/20"
                          : phoneError
                          ? "border-red-500 ring-2 ring-red-500/20"
                          : "border-slate-200 focus:border-[#4848F7] focus:ring-2 focus:ring-[#4848F7]/20"
                      }`}
                    />
                    {e164Phone && (
                      <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 shrink-0 pointer-events-none" />
                    )}
                  </div>
                </div>

                {/* Live Validation & Error Messages */}
                {phoneError && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1.5 pt-1">
                    <AlertCircle size={14} /> {phoneError}
                  </p>
                )}

                {e164Phone && !phoneError && (
                  <p className="text-[11px] text-emerald-600 font-mono font-semibold flex items-center gap-1 pt-0.5">
                    ✓ E.164 Validated: {e164Phone}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={handleSendOtp}
                disabled={isSendingOtp || lockoutTimer > 0}
                className="w-full bg-[#4848F7] hover:bg-[#3838D6] disabled:opacity-50 text-white font-bold text-sm py-3.5 rounded-xl transition shadow-lg shadow-[#4848F7]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSendingOtp ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Dispatching OTP Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP Verification</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* REGISTER PROMPT BOX (APPLICANT & AGENT) */}
              <div className="pt-3 border-t border-slate-100 text-center space-y-2.5">
                <span className="text-xs text-slate-500 font-medium block">
                  New to VisaOS? Choose your registration path:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] border border-blue-200 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <UserPlus size={15} />
                    <span>Register as Applicant</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/register-agent")}
                    className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Briefcase size={15} />
                    <span>Register as Agent</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* SCREEN 2: 6-DIGIT OTP ENTRY */}
          {/* ============================================================ */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Notification Banner */}
              {otpSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-700 font-medium">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                  <span>{otpSuccessMsg}</span>
                </div>
              )}

              {/* Lockout / Error Banner */}
              {otpError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-600 font-medium">
                  <AlertCircle size={16} className="shrink-0 text-red-500" />
                  <span>{otpError}</span>
                </div>
              )}

              {/* Lockout Timer Warning */}
              {lockoutTimer > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-700 font-mono">
                  <Lock size={14} className="text-amber-600" />
                  <span>Account Temporarily Locked. Cooldown: {lockoutTimer}s</span>
                </div>
              )}

              {/* 6-DIGIT INPUT BOXES */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block text-center">
                  Enter 6-Digit Verification Code
                </label>

                <div className="flex justify-between gap-1.5 sm:gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={inputRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      disabled={isVerifying || lockoutTimer > 0}
                      className={`w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-mono font-bold bg-slate-50 border rounded-xl text-[#4848F7] focus:outline-none transition ${
                        digit
                          ? "border-[#4848F7] shadow-md shadow-[#4848F7]/10 ring-2 ring-[#4848F7]/20"
                          : "border-slate-200 focus:border-[#4848F7] focus:ring-2 focus:ring-[#4848F7]/20"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* DEMO CODE DISPLAY BADGE (FOR EASY LOCAL TESTING) */}
              {demoCode && (
                <div className="p-2.5 bg-[#EEF2FF] border border-[#4848F7]/20 rounded-xl flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600 flex items-center gap-1.5 font-sans">
                    <Info size={14} className="text-[#4848F7]" /> Demo OTP Code:
                  </span>
                  <span className="font-bold text-[#4848F7] text-sm tracking-widest bg-white px-2.5 py-0.5 rounded border border-[#4848F7]/30 shadow-2xs">
                    {demoCode}
                  </span>
                </div>
              )}

              {/* VERIFY BUTTON */}
              <button
                onClick={() => handleVerifyOtp()}
                disabled={isVerifying || lockoutTimer > 0 || otpDigits.join("").length < 6}
                className="w-full bg-[#4848F7] hover:bg-[#3838D6] disabled:opacity-40 text-white font-bold text-sm py-3.5 rounded-xl transition shadow-lg shadow-[#4848F7]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Verifying Session Claims...</span>
                  </>
                ) : (
                  <>
                    <UserCheck size={18} />
                    <span>Verify & Authenticate</span>
                  </>
                )}
              </button>

              {/* FOOTER ACTIONS: RESEND & CHANGE NUMBER */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <button
                  onClick={() => {
                    setStep(1);
                    setOtpError("");
                  }}
                  className="flex items-center gap-1 hover:text-slate-800 transition font-medium cursor-pointer"
                >
                  <ArrowLeft size={14} /> Change Number
                </button>

                <button
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || lockoutTimer > 0}
                  className="font-mono text-[#4848F7] font-semibold hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer"
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend OTP"}
                </button>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* FOOTER AUDIT NOTICE */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
        <div>Phantom Visa OS &bull; Passwordless Identity Node</div>
        <div>All login attempts are logged & audit-trailed per immigration compliance.</div>
      </footer>

    </div>
  );
};

export default LoginPage;

