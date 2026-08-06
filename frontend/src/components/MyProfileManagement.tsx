import React, { useState } from "react";
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
  X
} from "lucide-react";

export interface LoginActivityRecord {
  time: string;
  device: string;
  ip: string;
  location: string;
  status: "Success" | "Failed";
}

export const PROFILE_WORKFLOW = [
  "Admin Details Input",
  "Contact Info Updated",
  "Security 2FA Configured",
  "Role Scope Assigned",
  "Activity Audit Verified",
  "Profile Saved & Active"
];

export const PROFILE_FEATURES = [
  "Admin Profile Management",
  "Personal & Work Details",
  "Encrypted Password Reset",
  "Two-Factor Auth (2FA) Security",
  "Session Timeout Control",
  "Login Audit Trail Logging",
  "Role & Access Scope Verification",
  "Multi-device Session Tracking",
  "Customized Notification Alerts",
  "Avatar & Identity Customization"
];

export const LAYOUT_CATALOG = [
  "My Profile",
  "Profile Overview",
  "Personal Information",
  "Contact Information",
  "Professional Info",
  "Security Settings",
  "Login Activity",
  "Quick Actions"
];

const MOCK_LOGIN_ACTIVITY: LoginActivityRecord[] = [
  { time: "Today, 02:45 PM", device: "Chrome / Windows 11", ip: "192.168.1.100", location: "New Delhi, IN", status: "Success" },
  { time: "Yesterday, 09:15 AM", device: "Firefox / macOS", ip: "192.168.1.100", location: "New Delhi, IN", status: "Success" },
  { time: "04 Aug, 06:30 PM", device: "Mobile App / iOS 17", ip: "10.0.4.15", location: "Mumbai, IN", status: "Success" }
];

export default function MyProfileManagement() {
  // Personal Info States
  const [firstName, setFirstName] = useState("Vibhu");
  const [lastName, setLastName] = useState("Sharma");
  const [designation, setDesignation] = useState("Lead Platform Administrator");
  const [gender, setGender] = useState("Male");
  const [nationality, setNationality] = useState("Indian");
  const [dob, setDob] = useState("1994-08-15");

  // Contact Info States
  const [email, setEmail] = useState("admin@phantomvisa.com");
  const [mobile, setMobile] = useState("+91 98765 43210");
  const [altPhone, setAltPhone] = useState("+91 98765 00000");
  const [city, setCity] = useState("New Delhi, Delhi");
  const [address, setAddress] = useState("Suite 402, Visa OS Tower, Connaught Place, New Delhi 110001");

  // Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Preferences
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [desktopNotif, setDesktopNotif] = useState(true);

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveProfile = () => {
    triggerToast("Profile information updated successfully.");
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      triggerToast("New passwords do not match!");
      return;
    }
    triggerToast("Password changed successfully.");
    setShowPasswordModal(false);
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
  };

  const handleToggle2FA = () => {
    triggerToast("Two-Factor Authentication (2FA) settings updated.");
  };

  const handleDownloadAudit = () => {
    triggerToast("Downloading profile security audit logs...");
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-6 rounded-3xl shadow-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-700">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-2xl font-black font-outfit shadow-inner">
              VS
            </div>
            <button
              onClick={() => triggerToast("Avatar photo uploader triggered.")}
              className="absolute -bottom-1 -right-1 p-1 bg-white text-[#2563EB] rounded-full shadow hover:bg-blue-50 transition"
            >
              <Camera size={12} />
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
            <p className="text-xs text-blue-100 font-medium mt-0.5">
              {designation} &bull; <strong className="text-white">Super Admin</strong>
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
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>

      {/* TOP METRICS DASHBOARD (6 CARDS MATCHING WIREFRAME) */}
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
          <div className="text-xl font-black text-slate-900 font-mono">Today 02:45 PM</div>
          <span className="text-[10px] text-indigo-600 font-bold">IP 192.168.1.100</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Security Score</span>
          <div className="text-2xl font-black text-slate-900 font-mono">98%</div>
          <span className="text-[10px] text-emerald-600 font-bold">Protected with 2FA</span>
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
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
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
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Mobile Phone Number</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Alternative Contact</label>
                <input
                  type="text"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
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
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Office / Residential Address</label>
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
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Two-Factor Auth (2FA)</span>
                <div className="flex justify-between items-center">
                  <strong className="text-emerald-700 font-bold">Enabled (Google Authenticator) 🟢</strong>
                  <button onClick={handleToggle2FA} className="text-[10px] text-[#2563EB] hover:underline font-bold">
                    Configure
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Session Timeout</span>
                <strong className="text-slate-900 font-bold">15 Minutes Idle Logout</strong>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Access Scope</span>
                <strong className="text-blue-700 font-bold">Full Platform Root Privileges</strong>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Employee ID</span>
                <strong className="text-slate-900 font-mono font-bold">EMP-2025-001</strong>
              </div>
            </div>
          </div>

          {/* RECENT LOGIN ACTIVITY TABLE */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <Activity size={16} className="text-purple-600" /> Recent Security & Login Activity
            </h3>
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
                  {MOCK_LOGIN_ACTIVITY.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
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

        {/* RIGHT COLUMN: ACTIONS, CATALOG & WORKFLOW */}
        <div className="space-y-6">
          {/* QUICK CONTROL ACTIONS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Zap size={16} className="text-[#2563EB]" /> Profile Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleSaveProfile}
                className="w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Save size={14} /> Save Profile Changes
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Key size={14} /> Change Security Password
              </button>
              <button
                onClick={handleToggle2FA}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck size={14} /> Manage 2FA Security
              </button>
              <button
                onClick={handleDownloadAudit}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Download size={14} /> Download Security Audit
              </button>
            </div>
          </div>

          {/* DASHBOARD LAYOUT CATALOG */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Layers size={16} className="text-[#2563EB]" /> Dashboard Layout Catalog
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {LAYOUT_CATALOG.map((item, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* PROFILE WORKFLOW */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Clock size={16} className="text-emerald-600" /> Profile Setup Workflow
            </h3>
            <div className="space-y-2">
              {PROFILE_WORKFLOW.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PROFESSIONAL FEATURES CATALOG */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-purple-600" /> Professional Features Catalog
            </h3>
            <div className="space-y-1.5 text-xs">
              {PROFILE_FEATURES.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
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

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 font-outfit flex items-center gap-2">
                <Key size={16} className="text-[#2563EB]" /> Change Password
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">New Password</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                  required
                />
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
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition shadow-md"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
