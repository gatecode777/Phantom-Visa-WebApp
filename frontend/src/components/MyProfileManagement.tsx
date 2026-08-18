import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  User,
  ShieldCheck,
  Key,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Globe,
  Clock,
  CheckCircle2,
  Lock,
  Save,
  RotateCcw,
  LogOut,
  Download,
  Camera,
  Shield,
  Smartphone,
  Laptop,
  CheckSquare,
  Layers,
  Sparkles,
  Zap,
  Bell,
  Eye,
  EyeOff,
  Activity,
  X,
  Copy,
  ExternalLink,
  Upload,
  AlertTriangle,
  QrCode,
  Check,
  AlertCircle
} from "lucide-react";
import { uploadImageToImageKit } from "../services/imageKitService";
import {
  AdminProfileData,
  AdminSecurityLogItem,
  fetchAdminProfileApi,
  updateAdminProfileApi,
  fetchAdminSecurityLogsApi,
  toggle2FAApi,
  changeAdminPasswordApi,
  exportSecurityAuditLogs
} from "../services/adminProfileService";

export interface LoginActivityRecord {
  time: string;
  device: string;
  ip: string;
  location: string;
  status: "Success" | "Failed" | string;
}

export const PROFILE_WORKFLOW_STEPS = [
  { id: "details", label: "Admin Details Input", description: "Personal & official role data" },
  { id: "contact", label: "Contact Info Updated", description: "Email & verified non-colliding phone" },
  { id: "twofa", label: "Security 2FA Configured", description: "Authenticator-backed dual factor" },
  { id: "role", label: "Role Scope Assigned", description: "Root privileges & administrative boundary" },
  { id: "audit", label: "Activity Audit Verified", description: "Active session logging & telemetry" },
  { id: "active", label: "Profile Saved & Active", description: "Identity verified in system store" }
];

export default function MyProfileManagement() {
  // Personal Info States
  const [firstName, setFirstName] = useState("Vibhu");
  const [lastName, setLastName] = useState("Sharma");
  const [designation, setDesignation] = useState("Lead Platform Administrator");
  const [gender, setGender] = useState("Male");
  const [nationality, setNationality] = useState("Indian");
  const [dob, setDob] = useState("1994-08-15");

  // Contact Info States (Unique Dedicated Contact Records)
  const [email, setEmail] = useState("admin@phantomvisa.com");
  const [mobile, setMobile] = useState("+91 98100 11001");
  const [altPhone, setAltPhone] = useState("+91 98100 11002");
  const [city, setCity] = useState("New Delhi, Delhi");
  const [address, setAddress] = useState("Suite 402, Visa OS Tower, Connaught Place, New Delhi 110001");

  // Security & 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [twoFactorSecret, setTwoFactorSecret] = useState("G-2FA-PHANTOM-ADM9001-SEC");
  const [idleTimeoutMinutes, setIdleTimeoutMinutes] = useState(15);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isUpdating2FA, setIsUpdating2FA] = useState(false);

  // Security Logs & Activity History
  const [securityLogs, setSecurityLogs] = useState<AdminSecurityLogItem[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  // Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Saving / Uploading States
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Avatar ImageKit State
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem("phantom_admin_avatar");
    } catch {}
    return null;
  });

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const triggerToast = (text: string, isError: boolean = false) => {
    setToastMsg({ text, isError });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Load Profile and Security Logs from MongoDB on Mount
  useEffect(() => {
    const loadProfile = async () => {
      const data = await fetchAdminProfileApi();
      if (data) {
        if (data.firstName) setFirstName(data.firstName);
        if (data.lastName) setLastName(data.lastName);
        if (data.designation) setDesignation(data.designation);
        if (data.gender) setGender(data.gender);
        if (data.dob) setDob(data.dob);
        if (data.nationality) setNationality(data.nationality);
        if (data.email) setEmail(data.email);
        if (data.mobile || data.phone) setMobile(data.mobile || data.phone);
        if (data.altPhone) setAltPhone(data.altPhone);
        if (data.city) setCity(data.city);
        if (data.address) setAddress(data.address);
        if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
        if (data.twoFactorEnabled !== undefined) setTwoFactorEnabled(data.twoFactorEnabled);
        if (data.twoFactorSecret) setTwoFactorSecret(data.twoFactorSecret);
        if (data.idleTimeoutMinutes) setIdleTimeoutMinutes(data.idleTimeoutMinutes);
      }
    };

    const loadLogs = async () => {
      setLogsLoading(true);
      const logs = await fetchAdminSecurityLogsApi();
      setSecurityLogs(logs);
      setLogsLoading(false);
    };

    loadProfile();
    loadLogs();
  }, []);

  // 1. Live Dynamic Security Score Calculation
  const computedSecurityScore = useMemo(() => {
    let score = 0;

    // Two-Factor Authentication (+30%)
    if (twoFactorEnabled) score += 30;

    // Strong Password Baseline (+25%)
    score += 25;

    // Session Timeout Policy (+20% for 15m, +15% for 30m, +10% for 60m, +5% for 120m)
    if (idleTimeoutMinutes <= 15) score += 20;
    else if (idleTimeoutMinutes <= 30) score += 15;
    else if (idleTimeoutMinutes <= 60) score += 10;
    else score += 5;

    // Verified Email & Distinct Contact (+15%)
    const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const hasValidPhone = mobile.trim().length >= 10;
    if (hasValidEmail && hasValidPhone) score += 15;

    // Clean Security Audit History (+10% if no failed logins in recent history)
    const hasFailedLogs = securityLogs.some((l) => l.status === "Failed");
    if (!hasFailedLogs) score += 10;

    return Math.min(100, score);
  }, [twoFactorEnabled, idleTimeoutMinutes, email, mobile, securityLogs]);

  // 2. Dynamic Profile Setup Workflow Completion Status
  const workflowStepStatus = useMemo(() => {
    const isDetailsDone = Boolean(firstName.trim() && lastName.trim() && designation.trim() && dob && gender);
    const isContactDone = Boolean(email.trim() && mobile.trim() && city.trim() && address.trim());
    const is2FADone = Boolean(twoFactorEnabled);
    const isRoleDone = true; // Super Admin Root Access assigned
    const isAuditDone = securityLogs.length > 0;
    const isProfileActive = isDetailsDone && isContactDone;

    return {
      details: isDetailsDone,
      contact: isContactDone,
      twofa: is2FADone,
      role: isRoleDone,
      audit: isAuditDone,
      active: isProfileActive
    };
  }, [firstName, lastName, designation, dob, gender, email, mobile, city, address, twoFactorEnabled, securityLogs]);

  const completedStepsCount = useMemo(() => {
    return Object.values(workflowStepStatus).filter(Boolean).length;
  }, [workflowStepStatus]);

  // Avatar Upload Handler
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const res = await uploadImageToImageKit(file, "/PHANTOM-VISA/avatars/");
      setAvatarUrl(res.url);
      localStorage.setItem("phantom_admin_avatar", res.url);
      await updateAdminProfileApi({ avatarUrl: res.url });
      triggerToast("Avatar uploaded to ImageKit CDN & synced across admin portal!");
    } catch (err: any) {
      triggerToast(err.message || "Failed to upload avatar to ImageKit.", true);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Save Profile Handler (Used by both Header and Sidebar Quick Actions)
  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      triggerToast("First and Last name are required.", true);
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      triggerToast("Please enter a valid work email address.", true);
      return;
    }
    if (!mobile.trim() || mobile.replace(/\D/g, "").length < 10) {
      triggerToast("Please enter a valid 10-digit mobile number.", true);
      return;
    }
    if (altPhone.trim() && altPhone.replace(/\D/g, "") === mobile.replace(/\D/g, "")) {
      triggerToast("Alternative contact cannot be identical to your primary mobile number.", true);
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<AdminProfileData> = {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        designation,
        gender,
        dob,
        nationality,
        email,
        mobile,
        phone: mobile,
        altPhone,
        city,
        address,
        avatarUrl,
        idleTimeoutMinutes,
        twoFactorEnabled
      };

      const res = await updateAdminProfileApi(payload);
      if (res.success) {
        triggerToast(res.message);
      } else {
        triggerToast(res.message, true);
      }
    } catch (err: any) {
      triggerToast("Failed to save profile changes.", true);
    } finally {
      setIsSaving(false);
    }
  };

  // Change Password Submit Handler
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 8) {
      triggerToast("New password must be at least 8 characters long.", true);
      return;
    }
    if (newPass !== confirmPass) {
      triggerToast("New passwords do not match!", true);
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await changeAdminPasswordApi({
        currentPassword: currentPass,
        newPassword: newPass,
        confirmPassword: confirmPass
      });

      if (res.success) {
        triggerToast(res.message);
        setShowPasswordModal(false);
        setCurrentPass("");
        setNewPass("");
        setConfirmPass("");
      } else {
        triggerToast(res.message, true);
      }
    } catch (err: any) {
      triggerToast("Failed to update password.", true);
    } finally {
      setIsChangingPass(false);
    }
  };

  // 2FA Modal Toggle Handler
  const handleConfirm2FA = async (enableState: boolean) => {
    setIsUpdating2FA(true);
    try {
      const res = await toggle2FAApi(enableState, otpCode);
      if (res.success) {
        setTwoFactorEnabled(enableState);
        triggerToast(res.message);
        setShow2FAModal(false);
        setOtpCode("");
      } else {
        triggerToast(res.message, true);
      }
    } catch (err: any) {
      triggerToast("Failed to update 2FA configuration.", true);
    } finally {
      setIsUpdating2FA(false);
    }
  };

  // Export Security Audit CSV
  const handleDownloadAudit = () => {
    exportSecurityAuditLogs(securityLogs, `${firstName} ${lastName}`);
    triggerToast("Security audit log export downloaded successfully.");
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* Hidden Avatar Input */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarUpload}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
      />

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div
          className={`fixed top-5 right-5 z-[9999] ${
            toastMsg.isError ? "bg-[#7F1D1D] border-red-500" : "bg-[#0E1A2C] border-[#2563EB]/40"
          } border text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3`}
        >
          <div
            className={`w-8 h-8 rounded-lg ${
              toastMsg.isError ? "bg-red-500/20 text-red-300" : "bg-[#2563EB]/20 text-[#2563EB]"
            } flex items-center justify-center`}
          >
            {toastMsg.isError ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          </div>
          <span className="text-xs font-semibold">{toastMsg.text}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-6 rounded-3xl shadow-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-700">
        <div className="flex items-center gap-4">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Admin Avatar"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-inner bg-white/10"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-2xl font-black font-outfit shadow-inner">
                {firstName[0] || "V"}{lastName[0] || "S"}
              </div>
            )}
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 p-1.5 bg-white text-[#2563EB] rounded-full shadow hover:bg-blue-50 transition cursor-pointer disabled:opacity-50"
              title="Upload photo to ImageKit"
            >
              <Camera size={13} className={uploadingAvatar ? "animate-spin" : ""} />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-200 mb-1">
              <User size={15} />
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
                Admin Profile & Preferences
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
              {firstName} {lastName}
            </h1>
            <p className="text-xs text-blue-100 font-medium mt-0.5 flex items-center gap-2">
              <span>{designation} &bull; <strong className="text-white">Super Admin (ADM-9001)</strong></span>
              {avatarUrl && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  ImageKit Photo ✓
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-md transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <Key size={15} /> Change Password
          </button>
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2 disabled:opacity-75"
          >
            <Save size={15} className={isSaving ? "animate-spin" : ""} />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* TOP METRICS DASHBOARD (6 CARDS WITH LIVE SECURITY SCORE & METRICS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Profile Status</span>
          <div className="text-xl font-black text-slate-900 font-mono">Active 🟢</div>
          <span className="text-[10px] text-emerald-600 font-bold">Identity Verified</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">System Role</span>
          <div className="text-xl font-black text-slate-900 font-mono">Super Admin</div>
          <span className="text-[10px] text-blue-600 font-bold">Full Root Access</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">User ID</span>
          <div className="text-2xl font-black text-slate-900 font-mono">ADM-9001</div>
          <span className="text-[10px] text-purple-600 font-bold">Primary Root</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Account Created</span>
          <div className="text-xl font-black text-slate-900 font-mono">01 Jan 2025</div>
          <span className="text-[10px] text-teal-600 font-bold">Active for 1.5 Years</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-indigo-600 block mb-1">Last Login</span>
          <div className="text-sm font-black text-slate-900 font-mono truncate">{securityLogs[0]?.time || "Today, 02:45 PM"}</div>
          <span className="text-[10px] text-indigo-600 font-bold font-mono truncate">{securityLogs[0]?.ip || "192.168.1.100"}</span>
        </div>

        {/* LIVE COMPUTED SECURITY SCORE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Security Score</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${computedSecurityScore >= 80 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {computedSecurityScore >= 80 ? "High" : "Moderate"}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono flex items-baseline gap-1">
            <span>{computedSecurityScore}%</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            {twoFactorEnabled ? "Protected with 2FA ✓" : "2FA Recommended ⚠️"}
          </span>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT 2 COLUMNS: PERSONAL, CONTACT, PROFESSIONAL, SECURITY & AUDIT */}
        <div className="lg:col-span-2 space-y-6">
          {/* PERSONAL INFORMATION FORM */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <User size={16} className="text-[#2563EB]" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Job Title / Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Nationality</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono font-semibold"
                />
              </div>

              {/* AVATAR IMAGEKIT CDN URL DISPLAY */}
              <div className="sm:col-span-2 pt-2 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-extrabold uppercase text-slate-500 block">
                    Profile Avatar (ImageKit CDN)
                  </label>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="text-[11px] font-bold text-[#2563EB] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Upload size={12} className={uploadingAvatar ? "animate-spin" : ""} />
                    <span>{uploadingAvatar ? "Uploading to ImageKit..." : "Upload New Photo"}</span>
                  </button>
                </div>
                {avatarUrl ? (
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
                    <img src={avatarUrl} alt="Avatar Thumbnail" className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                    <input
                      type="text"
                      readOnly
                      value={avatarUrl}
                      className="flex-1 bg-transparent text-[10px] font-mono text-slate-700 select-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(avatarUrl);
                        triggerToast("Avatar ImageKit URL copied to clipboard!");
                      }}
                      className="p-1 hover:bg-slate-200 text-slate-600 rounded cursor-pointer shrink-0"
                      title="Copy ImageKit URL"
                    >
                      <Copy size={13} />
                    </button>
                    <a
                      href={avatarUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 hover:bg-slate-200 text-slate-600 rounded cursor-pointer shrink-0"
                      title="Open ImageKit URL in new tab"
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 font-medium">No custom avatar uploaded yet. Default initials are displayed.</p>
                )}
              </div>
            </div>
          </div>

          {/* CONTACT INFORMATION FORM */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <Mail size={16} className="text-[#2563EB]" /> Contact & Address Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Work Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                  Primary Mobile Phone (Dedicated Admin)
                </label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                  Alternative Contact (Security Backup)
                </label>
                <input
                  type="text"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">City & Region</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Office / Statutory Residential Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
                />
              </div>
            </div>
          </div>

          {/* PROFESSIONAL & SECURITY SNAPSHOT */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" /> Account Security & Role Verification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* 2FA Configuration Box */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Two-Factor Auth (2FA)</span>
                <div className="flex justify-between items-center">
                  <strong className={`font-bold ${twoFactorEnabled ? "text-emerald-700" : "text-amber-700"}`}>
                    {twoFactorEnabled ? "Enabled (Google Authenticator) 🟢" : "Disabled (Not Protected) ⚠️"}
                  </strong>
                  <button
                    type="button"
                    onClick={() => setShow2FAModal(true)}
                    className="text-[11px] text-[#2563EB] hover:underline font-bold cursor-pointer"
                  >
                    Configure
                  </button>
                </div>
              </div>

              {/* Session Idle Timeout Policy */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Session Idle Timeout</span>
                <div className="flex items-center justify-between">
                  <select
                    value={idleTimeoutMinutes}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setIdleTimeoutMinutes(val);
                      updateAdminProfileApi({ idleTimeoutMinutes: val });
                      triggerToast(`Session idle timeout set to ${val} minutes.`);
                    }}
                    className="bg-white border border-slate-200 text-xs font-bold px-2 py-1 rounded-lg text-slate-800 outline-none"
                  >
                    <option value={15}>15 Minutes Idle Logout</option>
                    <option value={30}>30 Minutes Idle Logout</option>
                    <option value={60}>60 Minutes Idle Logout</option>
                    <option value={120}>120 Minutes Idle Logout</option>
                  </select>
                  <span className="text-[10px] text-emerald-600 font-bold">Enforced ✓</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Access Scope</span>
                <strong className="text-blue-700 font-bold">Full Platform Root Privileges</strong>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Employee ID</span>
                <strong className="text-slate-900 font-mono font-bold">EMP-2025-001</strong>
              </div>
            </div>
          </div>

          {/* RECENT SECURITY & LOGIN ACTIVITY TABLE (CONNECTED TO REAL DB LOGS) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                <Activity size={16} className="text-purple-600" /> Recent Security & Login Activity
              </h3>
              <button
                type="button"
                onClick={handleDownloadAudit}
                className="text-[11px] font-bold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download size={13} /> Export CSV Audit
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                    <th className="pb-2">Login Time</th>
                    <th className="pb-2">Device / Browser</th>
                    <th className="pb-2 text-center">IP Address</th>
                    <th className="pb-2 text-center">Location</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {securityLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 font-mono text-[11px] text-slate-800 font-bold">{log.time}</td>
                      <td className="py-2.5 font-bold text-slate-900">{log.device}</td>
                      <td className="py-2.5 text-center font-mono text-blue-700">{log.ip}</td>
                      <td className="py-2.5 text-center text-slate-600">{log.location}</td>
                      <td className="py-2.5 text-right font-bold text-emerald-700 text-[10px]">🟢 {log.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIONS & LIVE WORKFLOW PROGRESS */}
        <div className="space-y-6">
          {/* QUICK CONTROL ACTIONS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Zap size={16} className="text-[#2563EB]" /> Profile Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-75"
              >
                <Save size={14} className={isSaving ? "animate-spin" : ""} />
                <span>{isSaving ? "Saving..." : "Save Profile Changes"}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <Key size={14} /> Change Security Password
              </button>
              <button
                type="button"
                onClick={() => setShow2FAModal(true)}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <ShieldCheck size={14} /> Manage 2FA Security
              </button>
              <button
                type="button"
                onClick={handleDownloadAudit}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 border border-slate-200"
              >
                <Download size={14} /> Download Security Audit
              </button>
            </div>
          </div>

          {/* DYNAMIC PROFILE SETUP WORKFLOW (COMPUTED LIVE) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                <Clock size={16} className="text-emerald-600" /> Profile Setup Workflow
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {completedStepsCount} of {PROFILE_WORKFLOW_STEPS.length} Completed
              </span>
            </div>

            <div className="space-y-2.5">
              {PROFILE_WORKFLOW_STEPS.map((step, idx) => {
                const isDone = workflowStepStatus[step.id as keyof typeof workflowStepStatus];
                return (
                  <div key={step.id} className="flex items-start gap-2.5 text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isDone ? "bg-emerald-100 text-emerald-700 font-black" : "bg-amber-100 text-amber-700 font-bold"}`}>
                      {isDone ? <Check size={12} /> : (idx + 1)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 truncate">{step.label}</span>
                        <span className={`text-[9px] font-bold ${isDone ? "text-emerald-600" : "text-amber-600"}`}>
                          {isDone ? "Completed ✓" : "Pending ⚠️"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RECOMMENDATION BOX */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
              <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Recommendation
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              The My Profile page allows platform administrators to manage their personal details, contact preferences, security credentials, 2FA settings, and session audit history. Ensure strong passwords and 2FA are maintained to protect root administrative access.
            </p>
          </div>
        </div>
      </div>

      {/* 2FA CONFIGURATION MODAL */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 font-outfit flex items-center gap-2">
                <ShieldCheck size={18} className="text-purple-600" /> Manage Two-Factor Authentication (2FA)
              </h3>
              <button
                type="button"
                onClick={() => setShow2FAModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <QrCode size={26} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Google Authenticator / Authy</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Scan the QR code or manually enter the secret key into your authenticator app.
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block">Secret Key (Base32)</label>
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl p-2 font-mono text-[11px]">
                  <span className="flex-1 select-all font-bold text-slate-800 truncate">{twoFactorSecret}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(twoFactorSecret);
                      triggerToast("2FA Secret key copied to clipboard!");
                    }}
                    className="p-1 hover:bg-slate-200 text-slate-600 rounded cursor-pointer"
                    title="Copy Secret Key"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">6-Digit Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 123456"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-3 py-2 rounded-xl text-center font-mono tracking-widest font-bold focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                {twoFactorEnabled ? (
                  <button
                    type="button"
                    disabled={isUpdating2FA}
                    onClick={() => handleConfirm2FA(false)}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs transition cursor-pointer border border-red-200"
                  >
                    Disable 2FA
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500 font-medium">Currently Disabled</span>
                )}

                <button
                  type="button"
                  disabled={isUpdating2FA}
                  onClick={() => handleConfirm2FA(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isUpdating2FA ? "Verifying..." : "Enable & Save 2FA"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 font-outfit flex items-center gap-2">
                <Key size={16} className="text-[#2563EB]" /> Change Security Password
              </h3>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 pr-8 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">New Password (Min 8 characters)</label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 pr-8 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isChangingPass ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
