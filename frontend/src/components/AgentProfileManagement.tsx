import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  User, ShieldCheck, Key, Mail, Save, Camera, Shield, Layers, Sparkles,
  Eye, EyeOff, Activity, X, Copy, ExternalLink, Upload, AlertTriangle,
  CheckCircle2, Check, Building, Lock
} from "lucide-react";
import { uploadImageToImageKit } from "../services/imageKitService";
import {
  AgentProfileData, AgentSecurityLogItem,
  fetchAgentProfileApi, updateAgentProfileApi,
  fetchAgentSecurityLogsApi, changeAgentPasswordApi,
  exportAgentSecurityAuditLogs
} from "../services/agentProfileService";

interface AgentProfileManagementProps {
  /** JWT access token from the agent's current session */
  token: string;
  agentId?: string;
}

const WORKFLOW_STEPS = [
  { id: "details", label: "Personal Details", description: "Name, DOB, gender and nationality" },
  { id: "contact", label: "Contact Info", description: "Email, phone and address" },
  { id: "agency", label: "Agency Details", description: "Agency name and registration" },
  { id: "security", label: "Security Configured", description: "Password and 2FA settings" },
  { id: "audit", label: "Activity Verified", description: "Session logging active" },
  { id: "active", label: "Profile Active", description: "Identity verified in system" }
];

export default function AgentProfileManagement({ token, agentId }: AgentProfileManagementProps) {
  const [profile, setProfile] = useState<AgentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");
  const [nationality, setNationality] = useState("Indian");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [gstTaxNo, setGstTaxNo] = useState("");
  const [idleTimeoutMinutes, setIdleTimeoutMinutes] = useState(30);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [securityLogs, setSecurityLogs] = useState<AgentSecurityLogItem[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const triggerToast = (text: string, isError = false) => {
    setToastMsg({ text, isError });
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    let isMounted = true;
    const effectiveToken = token || localStorage.getItem("token") || "";
    const effectiveAgentId = agentId;

    (async () => {
      setLoading(true);
      const data = await fetchAgentProfileApi(effectiveToken, effectiveAgentId);
      if (data && isMounted) {
        setProfile(data);

        // Derive firstName/lastName from fullName as client-side fallback
        const fullNameParts = (data.fullName || "").trim().split(/\s+/);
        const derivedFirst = fullNameParts[0] || "";
        const derivedLast  = fullNameParts.slice(1).join(" ") || "";

        setFirstName((data.firstName || derivedFirst || "").trim());
        setLastName((data.lastName   || derivedLast || "").trim());
        setDob(data.dob || "");
        setGender(data.gender || "Male");
        setNationality(data.nationality || "Indian");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setAltPhone(data.altPhone || "");
        setCity(data.city || "");
        setAddress(data.address || data.officeAddress || "");
        setWebsite(data.website || "");
        setGstTaxNo(data.gstTaxNo || "");
        setIdleTimeoutMinutes(data.idleTimeoutMinutes || 30);
        setTwoFactorEnabled(data.twoFactorEnabled || false);
        setAvatarUrl(data.avatarUrl || null);
      }
      if (isMounted) setLoading(false);
    })();

    (async () => {
      setLogsLoading(true);
      const logs = await fetchAgentSecurityLogsApi(effectiveToken, effectiveAgentId);
      if (isMounted) {
        setSecurityLogs(logs);
        setLogsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token, agentId]);

  const securityScore = useMemo(() => {
    let s = 0;
    if (twoFactorEnabled) s += 30;
    s += 25;
    s += idleTimeoutMinutes <= 15 ? 20 : idleTimeoutMinutes <= 30 ? 15 : idleTimeoutMinutes <= 60 ? 10 : 5;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && phone.replace(/\D/g, "").length >= 10) s += 15;
    if (securityLogs.length > 0 && !securityLogs.some(l => l.status === "Failed")) s += 10;
    return Math.min(100, s);
  }, [twoFactorEnabled, idleTimeoutMinutes, email, phone, securityLogs]);

  const workflowStatus = useMemo(() => ({
    details: Boolean(firstName.trim() && lastName.trim() && dob && gender),
    contact: Boolean(email.trim() && phone.trim()),
    agency: Boolean(profile?.agencyName),
    security: true,
    audit: securityLogs.length > 0,
    active: Boolean(firstName.trim() && email.trim() && profile?.agencyName)
  }), [firstName, lastName, dob, gender, email, phone, profile, securityLogs]);

  const completedSteps = Object.values(workflowStatus).filter(Boolean).length;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const res = await uploadImageToImageKit(file, "/PHANTOM-VISA/agent-avatars/");
      setAvatarUrl(res.url);
      await updateAgentProfileApi({ avatarUrl: res.url }, token);
      triggerToast("Avatar uploaded to ImageKit CDN successfully!");
    } catch (err: any) {
      triggerToast(err.message || "Failed to upload avatar.", true);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) { triggerToast("First and Last name are required.", true); return; }
    setIsSaving(true);
    try {
      const res = await updateAgentProfileApi(
        { firstName, lastName, dob, gender, nationality, address, city, altPhone, website, gstTaxNo, idleTimeoutMinutes, avatarUrl },
        token
      );
      if (res.success) { if (res.data) setProfile(res.data as any); triggerToast(res.message); }
      else triggerToast(res.message, true);
    } catch { triggerToast("Failed to save changes.", true); }
    finally { setIsSaving(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 8) { triggerToast("New password must be at least 8 characters.", true); return; }
    if (newPass !== confirmPass) { triggerToast("Passwords do not match.", true); return; }
    setIsChangingPass(true);
    try {
      const res = await changeAgentPasswordApi({ currentPassword: currentPass, newPassword: newPass, confirmPassword: confirmPass }, token);
      if (res.success) { triggerToast(res.message); setShowPasswordModal(false); setCurrentPass(""); setNewPass(""); setConfirmPass(""); }
      else triggerToast(res.message, true);
    } catch { triggerToast("Failed to update password.", true); }
    finally { setIsChangingPass(false); }
  };

  const displayAgentId = profile?.agentId || agentId || "—";
  const createdAt = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm font-semibold">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8">
      <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} accept="image/png,image/jpeg,image/webp" className="hidden" />

      {toastMsg && (
        <div className={`fixed top-5 right-5 z-[9999] ${toastMsg.isError ? "bg-[#7F1D1D] border-red-500" : "bg-[#0E1A2C] border-indigo-500/40"} border text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3`}>
          <div className={`w-8 h-8 rounded-lg ${toastMsg.isError ? "bg-red-500/20 text-red-300" : "bg-indigo-500/20 text-indigo-300"} flex items-center justify-center`}>
            {toastMsg.isError ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          </div>
          <span className="text-xs font-semibold">{toastMsg.text}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-6 rounded-3xl shadow-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-700">
        <div className="flex items-center gap-4">
          <div className="relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Agent Avatar" className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-inner" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-2xl font-black shadow-inner">
                {firstName[0] || "A"}{lastName[0] || "G"}
              </div>
            )}
            <button onClick={() => avatarInputRef.current?.click()} disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 p-1.5 bg-white text-indigo-600 rounded-full shadow hover:bg-blue-50 transition cursor-pointer disabled:opacity-50">
              <Camera size={13} className={uploadingAvatar ? "animate-spin" : ""} />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-200 mb-1">
              <User size={15} />
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">Agent Profile & Preferences</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{firstName} {lastName}</h1>
            <p className="text-xs text-blue-100 font-medium mt-0.5 flex items-center gap-2 flex-wrap">
              <span>{profile?.agencyName || "Travel Agency"} &bull; <strong className="text-white">Visa Agent ({displayAgentId})</strong></span>
              {avatarUrl && <span className="text-[10px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full">ImageKit Photo ✓</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-md transition cursor-pointer flex items-center gap-1.5 border border-white/20">
            <Key size={15} /> Change Password
          </button>
          <button onClick={handleSaveProfile} disabled={isSaving} className="px-4 py-2.5 bg-white text-indigo-600 hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2 disabled:opacity-75">
            <Save size={15} className={isSaving ? "animate-spin" : ""} />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
        {[
          { label: "Profile Status", value: profile?.status === "Active" ? "Active 🟢" : (profile?.status || "Active 🟢"), sub: "Identity Verified", color: "text-emerald-600" },
          { label: "System Role", value: "Agent", sub: "Visa Processing", color: "text-blue-600" },
          { label: "Agent ID", value: displayAgentId, sub: "Unique Identifier", color: "text-purple-600" },
          { label: "Member Since", value: createdAt, sub: "Account Created", color: "text-teal-600" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
            <span className={`text-[10px] font-extrabold uppercase ${color} block mb-1`}>{label}</span>
            <div className="text-xl font-black text-slate-900 font-mono truncate">{value}</div>
            <span className={`text-[10px] ${color} font-bold`}>{sub}</span>
          </div>
        ))}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-indigo-600 block mb-1">Last Login</span>
          <div className="text-sm font-black text-slate-900 font-mono truncate">{securityLogs[0]?.time || (logsLoading ? "Loading..." : "No sessions")}</div>
          <span className="text-[10px] text-indigo-600 font-bold font-mono">{securityLogs[0]?.ip || "—"}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Security Score</span>
            <span className={`text-[9px] px-1.5 rounded font-bold ${securityScore >= 80 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{securityScore >= 80 ? "High" : "Moderate"}</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{securityScore}%</div>
          <span className="text-[10px] text-emerald-600 font-bold">{twoFactorEnabled ? "2FA Active ✓" : "Enable 2FA ⚠️"}</span>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">

          {/* PERSONAL INFO */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <User size={16} className="text-indigo-600" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">First Name</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Last Name</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Date of Birth</label>
                <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Nationality</label>
                <input type="text" value={nationality} onChange={e => setNationality(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Agency Name</label>
                <input type="text" value={profile?.agencyName || ""} readOnly className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-xs px-3 py-2 rounded-xl cursor-not-allowed" />
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-extrabold uppercase text-slate-500 block">Profile Avatar (ImageKit CDN)</label>
                  <button type="button" onClick={() => avatarInputRef.current?.click()} disabled={uploadingAvatar} className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 cursor-pointer">
                    <Upload size={12} className={uploadingAvatar ? "animate-spin" : ""} />
                    <span>{uploadingAvatar ? "Uploading..." : "Upload New Photo"}</span>
                  </button>
                </div>
                {avatarUrl ? (
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
                    <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                    <input type="text" readOnly value={avatarUrl} className="flex-1 bg-transparent text-[10px] font-mono text-slate-700 select-all outline-none" />
                    <button type="button" onClick={() => { navigator.clipboard.writeText(avatarUrl!); triggerToast("URL copied!"); }} className="p-1 hover:bg-slate-200 text-slate-600 rounded cursor-pointer"><Copy size={13} /></button>
                    <a href={avatarUrl} target="_blank" rel="noreferrer" className="p-1 hover:bg-slate-200 text-slate-600 rounded cursor-pointer"><ExternalLink size={13} /></a>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">No custom avatar uploaded. Default initials are displayed.</p>
                )}
              </div>
            </div>
          </div>

          {/* CONTACT */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <Mail size={16} className="text-indigo-600" /> Contact & Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Email Address</label>
                <input type="email" value={email} readOnly title="Contact support to change email" className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-xs px-3 py-2 rounded-xl font-mono cursor-not-allowed" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Primary Phone</label>
                <input type="text" value={phone} readOnly title="Contact support to change phone" className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-xs px-3 py-2 rounded-xl font-mono cursor-not-allowed" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Alternative Phone</label>
                <input type="text" value={altPhone} onChange={e => setAltPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">City / Region</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Office / Residential Address</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Website</label>
                <input type="text" value={website} onChange={e => setWebsite(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">GST / Tax No.</label>
                <input type="text" value={gstTaxNo} onChange={e => setGstTaxNo(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono" />
              </div>
            </div>
          </div>

          {/* SECURITY */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" /> Account Security
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Two-Factor Auth (2FA)</span>
                <div className="flex justify-between items-center">
                  <strong className={`font-bold text-xs ${twoFactorEnabled ? "text-emerald-700" : "text-amber-700"}`}>{twoFactorEnabled ? "Enabled 🟢" : "Disabled ⚠️"}</strong>
                  <span className="text-[10px] text-slate-500">Contact admin</span>
                </div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Session Idle Timeout</span>
                <div className="flex items-center justify-between">
                  <select value={idleTimeoutMinutes} onChange={e => setIdleTimeoutMinutes(Number(e.target.value))} className="bg-transparent text-slate-800 text-xs font-bold outline-none cursor-pointer">
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={60}>60 Minutes</option>
                    <option value={120}>2 Hours</option>
                  </select>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><Check size={11} /> Enforced</span>
                </div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Commission Rate</span>
                <strong className="font-black text-slate-900 text-sm font-mono">{profile?.commissionValue ?? "—"}% ({profile?.commissionType ?? "Percentage"})</strong>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Agency Reg. No.</span>
                <strong className="font-bold text-slate-800 text-xs font-mono">{profile?.agencyRegNo || "Not provided"}</strong>
              </div>
            </div>
          </div>

          {/* ACTIVITY LOGS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Activity size={16} className="text-indigo-600" /> Recent Security & Login Activity
              </h3>
              <button onClick={() => exportAgentSecurityAuditLogs(securityLogs, `${firstName} ${lastName}`)} className="text-[11px] text-indigo-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer">
                <Shield size={12} /> Export CSV Audit
              </button>
            </div>
            {logsLoading ? (
              <div className="text-center text-slate-400 text-xs py-6">Loading activity logs...</div>
            ) : securityLogs.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-6">No login activity recorded yet.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {securityLogs.map((log, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2.5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${log.status === "Success" ? "bg-emerald-500" : log.status === "Revoked" ? "bg-amber-500" : "bg-red-500"}`} />
                      <div>
                        <div className="font-semibold text-slate-800">{log.device}</div>
                        <div className="text-slate-400 font-mono text-[10px]">{log.ip} · {log.location}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-500 font-medium">{log.time}</div>
                      <span className={`text-[10px] font-bold ${log.status === "Success" ? "text-emerald-600" : log.status === "Revoked" ? "text-amber-600" : "text-red-600"}`}>{log.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2"><Layers size={15} className="text-indigo-600" /> Profile Setup</h3>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">{completedSteps} of {WORKFLOW_STEPS.length}</span>
            </div>
            <div className="space-y-2">
              {WORKFLOW_STEPS.map((step) => {
                const done = workflowStatus[step.id as keyof typeof workflowStatus];
                return (
                  <div key={step.id} className={`flex items-start gap-2.5 p-2 rounded-xl ${done ? "bg-emerald-50 border border-emerald-100" : "bg-slate-50 border border-slate-100"}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0 ${done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                      {done ? <Check size={11} /> : <span className="text-[8px] font-black">{WORKFLOW_STEPS.indexOf(step) + 1}</span>}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${done ? "text-emerald-700" : "text-slate-600"}`}>{step.label}</div>
                      <div className="text-[10px] text-slate-400">{step.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2"><Building size={15} className="text-indigo-600" /> Agency Details</h3>
            <div className="space-y-2 text-xs">
              {[
                ["Agency", profile?.agencyName],
                ["Reg. No.", profile?.agencyRegNo || "—"],
                ["GST No.", profile?.gstTaxNo || "—"],
                ["License", profile?.businessLicense || "—"],
                ["Years Active", profile?.yearsInBusiness || "—"],
                ["Staff", profile?.employeeCount || "—"],
                ["Monthly Cap.", profile?.monthlyCapacity || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                  <span className="text-slate-500 font-semibold">{label}</span>
                  <span className="font-bold text-slate-800 text-[11px] font-mono max-w-[60%] truncate text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2"><Sparkles size={15} className="text-amber-500" /> Quick Actions</h3>
            <button onClick={() => setShowPasswordModal(true)} className="w-full bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 font-bold text-xs rounded-xl py-2.5 flex items-center gap-2 px-3 transition cursor-pointer">
              <Key size={14} className="text-indigo-500" /> Change Password
            </button>
            <button onClick={handleSaveProfile} disabled={isSaving} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl py-2.5 flex items-center gap-2 px-3 transition cursor-pointer disabled:opacity-75">
              <Save size={14} /> {isSaving ? "Saving..." : "Save Profile Changes"}
            </button>
            <button onClick={() => exportAgentSecurityAuditLogs(securityLogs, `${firstName} ${lastName}`)} className="w-full bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 hover:text-emerald-700 font-bold text-xs rounded-xl py-2.5 flex items-center gap-2 px-3 transition cursor-pointer">
              <Shield size={14} className="text-emerald-500" /> Download Security Audit
            </button>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2"><Lock size={18} className="text-indigo-600" /> Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Current Password</label>
                <div className="relative">
                  <input type={showCurrentPass ? "text" : "password"} value={currentPass} onChange={e => setCurrentPass(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-indigo-500 pr-10" />
                  <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">{showCurrentPass ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">New Password (min 8 chars)</label>
                <div className="relative">
                  <input type={showNewPass ? "text" : "password"} value={newPass} onChange={e => setNewPass(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-indigo-500 pr-10" />
                  <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">{showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Confirm New Password</label>
                <input type={showNewPass ? "text" : "password"} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-indigo-500" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-semibold text-sm cursor-pointer">Cancel</button>
                <button type="submit" disabled={isChangingPass} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-sm cursor-pointer disabled:opacity-75">{isChangingPass ? "Updating..." : "Update Password"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
