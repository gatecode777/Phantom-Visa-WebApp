"use client";

import React, { useState } from "react";
import {
  Settings,
  Shield,
  Bell,
  Lock,
  Globe,
  CreditCard,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Download,
  Trash2,
  Key,
  Layers,
  Moon,
  Sun,
  HelpCircle,
  Plus,
  RefreshCw,
  Zap,
  DollarSign
} from "lucide-react";

export interface SessionRecord {
  id: string;
  deviceName: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SavedPaymentMethod {
  id: string;
  type: "Card" | "UPI" | "NetBanking";
  name: string;
  lastFour?: string;
  upiId?: string;
  expiry?: string;
  isDefault: boolean;
}

interface ApplicantSettingsProps {
  onNavigatePayments?: () => void;
  onNavigateSupport?: () => void;
}

export default function ApplicantSettings({
  onNavigatePayments,
  onNavigateSupport
}: ApplicantSettingsProps) {
  // Portal Preferences State
  const [currency, setCurrency] = useState<"INR" | "USD" | "EUR">("INR");
  const [timezone, setTimezone] = useState("Asia/Kolkata (GMT+05:30)");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [language, setLanguage] = useState("English (US)");
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">("light");

  // Notifications State
  const [visaProgressAlerts, setVisaProgressAlerts] = useState(true);
  const [docRequestWhatsapp, setDocRequestWhatsapp] = useState(true);
  const [paymentReceiptsEmail, setPaymentReceiptsEmail] = useState(true);
  const [vfsAppointmentReminders, setVfsAppointmentReminders] = useState(true);
  const [promotionalDeals, setPromotionalDeals] = useState(false);

  // Password Update Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // 2FA & Security Toggles
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [passkeyBiometric, setPasskeyBiometric] = useState(true);

  // Active Sessions State
  const [sessions, setSessions] = useState<SessionRecord[]>([
    {
      id: "SESS-101",
      deviceName: "Windows 11 PC",
      browser: "Chrome v126.0",
      ipAddress: "103.21.124.88",
      location: "New Delhi, India",
      lastActive: "Active Now",
      isCurrent: true
    },
    {
      id: "SESS-102",
      deviceName: "Apple iPhone 15 Pro",
      browser: "Mobile Safari",
      ipAddress: "49.36.192.14",
      location: "Gurugram, India",
      lastActive: "3 Hours Ago",
      isCurrent: false
    }
  ]);

  // Saved Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([
    {
      id: "PM-1",
      type: "Card",
      name: "HDFC Bank Regalia Visa Credit Card",
      lastFour: "8892",
      expiry: "09/28",
      isDefault: true
    },
    {
      id: "PM-2",
      type: "UPI",
      name: "ICICI Bank Instant UPI Handle",
      upiId: "vibhu@icici",
      isDefault: false
    }
  ]);

  // Handle Save Preferences
  const [settingsSavedAlert, setSettingsSavedAlert] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSavedAlert(true);
    setTimeout(() => setSettingsSavedAlert(false), 3000);
  };

  // Handle Revoke Session
  const handleRevokeSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  // Handle Password Submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    setPasswordSuccess(true);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & STATUS BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Applicant Portal</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Account Settings</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Applicant Account Settings & Portal Preferences</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Shield size={12} className="text-emerald-600" /> High Security Protection
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Configure your portal display preferences, notification channels, security & authentication protocols, payment methods, active session management, and data privacy controls.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleSavePreferences}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={15} /> Save Settings
          </button>
        </div>
      </div>

      {/* Settings Saved Notification Banner */}
      {settingsSavedAlert && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Settings and preferences successfully updated and saved!</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: DASHBOARD STATISTICS CARDS GRID (6 CARDS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Account Security */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Account Security</p>
          <p className="text-xl font-black text-emerald-600 mt-1 flex items-center gap-1">
            <Lock size={15} /> 2FA Enabled
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">Maximum protection</span>
        </div>

        {/* Card 2: Notification Channels */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Alert Channels</p>
          <p className="text-2xl font-black text-[#4848F7] mt-1">3 Active</p>
          <span className="text-[10px] text-[#4848F7] font-semibold">Email, SMS, WhatsApp</span>
        </div>

        {/* Card 3: Active Sessions */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Active Sessions</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{sessions.length} Devices</p>
          <span className="text-[10px] text-indigo-600 font-medium">Logged in devices</span>
        </div>

        {/* Card 4: Default Currency */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Default Currency</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{currency} ({currency === "INR" ? "₹" : currency === "USD" ? "$" : "€"})</p>
          <span className="text-[10px] text-slate-400 font-medium">Tariff display currency</span>
        </div>

        {/* Card 5: Portal Theme */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Portal Theme</p>
          <p className="text-xl font-black text-amber-600 mt-1 flex items-center gap-1 capitalize">
            <Sun size={15} /> {themeMode} Mode
          </p>
          <span className="text-[10px] text-amber-600 font-medium">Interface style</span>
        </div>

        {/* Card 6: Data Privacy */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-600">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Data Privacy</p>
          <p className="text-xl font-black text-emerald-700 mt-1">GDPR Ready</p>
          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <Zap size={10} /> 256-Bit Encryption
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CONCEPTUAL WORKFLOW BANNER (CONNECTED SECURITY & GOVERNANCE) */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Security & Portal Governance Flow (Configure Settings ➔ Encrypted Storage ➔ Session Security ➔ Automated Alerts Active)
            </h3>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
            Zero-Trust Protocol Active
          </span>
        </div>

        {/* Pipeline Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 1</span>
            <p className="text-white">Configure Preferences</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 2</span>
            <p className="text-white">256-Bit Encrypted Storage</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 3</span>
            <p className="text-white">Session & Device Audit</p>
          </div>

          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Step 4</span>
            <p className="font-bold">Automated Alerts Active ✓</p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 4: PORTAL PREFERENCES SUBFORM */}
      {/* ============================================================ */}
      <form onSubmit={handleSavePreferences} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Globe size={16} className="text-[#4848F7]" />
          <span>Regional & Localization Display Preferences</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Primary Display Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            >
              <option value="INR">Indian Rupee (INR ₹)</option>
              <option value="USD">US Dollar (USD $)</option>
              <option value="EUR">Euro (EUR €)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            >
              <option value="Asia/Kolkata (GMT+05:30)">Asia/Kolkata (GMT+05:30 Delhi)</option>
              <option value="Europe/London (GMT+00:00)">Europe/London (GMT+00:00 UK)</option>
              <option value="America/New_York (GMT-05:00)">America/New_York (GMT-05:00 EST)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Date Display Format</label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 14/08/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 08/14/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Portal Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            >
              <option value="English (US)">English (US / UK)</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="French">French (Français)</option>
              <option value="Spanish">Spanish (Español)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Interface Appearance Mode</label>
            <select
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            >
              <option value="light">Light Mode (Clean Default)</option>
              <option value="dark">Dark Mode (High Contrast)</option>
              <option value="system">Sync with System Preference</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-[#4848F7] hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </form>

      {/* ============================================================ */}
      {/* SECTION 5: NOTIFICATION & ALERT PREFERENCES PANEL */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Bell size={16} className="text-[#4848F7]" />
          <span>Notification & Multi-Channel Alert Controls</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <p className="font-bold text-slate-900">Visa Progression Status Updates</p>
              <p className="text-[11px] text-slate-500">Email & SMS alerts when visa application moves stage</p>
            </div>
            <input
              type="checkbox"
              checked={visaProgressAlerts}
              onChange={(e) => setVisaProgressAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-[#4848F7]"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <p className="font-bold text-slate-900">Instant WhatsApp Document Requests</p>
              <p className="text-[11px] text-slate-500">Receive consular officer requests directly on WhatsApp</p>
            </div>
            <input
              type="checkbox"
              checked={docRequestWhatsapp}
              onChange={(e) => setDocRequestWhatsapp(e.target.checked)}
              className="w-4 h-4 rounded text-[#4848F7]"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <p className="font-bold text-slate-900">Payment Receipts & GST Invoices</p>
              <p className="text-[11px] text-slate-500">Auto-email PDF receipts upon successful payment</p>
            </div>
            <input
              type="checkbox"
              checked={paymentReceiptsEmail}
              onChange={(e) => setPaymentReceiptsEmail(e.target.checked)}
              className="w-4 h-4 rounded text-[#4848F7]"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <p className="font-bold text-slate-900">VFS Biometric Appointment Reminders</p>
              <p className="text-[11px] text-slate-500">Get SMS reminders 24 hours prior to appointment</p>
            </div>
            <input
              type="checkbox"
              checked={vfsAppointmentReminders}
              onChange={(e) => setVfsAppointmentReminders(e.target.checked)}
              className="w-4 h-4 rounded text-[#4848F7]"
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 6: SECURITY & AUTHENTICATION CONTROL VAULT */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Lock size={16} className="text-[#4848F7]" />
          <span>Security & Password Credentials Control</span>
        </h3>

        {passwordSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Your account password has been updated securely!</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              required
              placeholder="Min 8 chars, 1 symbol"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              placeholder="Repeat new password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2 rounded-xl transition cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>

        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <p className="font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
              <p className="text-[11px] text-slate-500">Require SMS OTP for sensitive account actions</p>
            </div>
            <input
              type="checkbox"
              checked={twoFactorAuth}
              onChange={(e) => setTwoFactorAuth(e.target.checked)}
              className="w-4 h-4 rounded text-[#4848F7]"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <p className="font-bold text-slate-900">Biometric TouchID / FaceID Passkey</p>
              <p className="text-[11px] text-slate-500">Instant passwordless login on recognized devices</p>
            </div>
            <input
              type="checkbox"
              checked={passkeyBiometric}
              onChange={(e) => setPasskeyBiometric(e.target.checked)}
              className="w-4 h-4 rounded text-[#4848F7]"
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 7: ACTIVE LOGIN SESSIONS DIRECTORY TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Laptop size={16} className="text-[#4848F7]" />
            <span>Active Login Sessions & Devices ({sessions.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Device Name & Browser</th>
                <th className="py-3 px-4">IP Address & Location</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4">Session Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      {s.deviceName.includes("Phone") ? <Smartphone size={16} className="text-indigo-600" /> : <Laptop size={16} className="text-[#4848F7]" />}
                      <div>
                        <p>{s.deviceName}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{s.browser}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 font-mono">
                    <p>{s.ipAddress}</p>
                    <p className="text-[10px] text-slate-400 font-sans">{s.location}</p>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">{s.lastActive}</td>

                  <td className="py-3.5 px-4">
                    {s.isCurrent ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={10} /> Current Active Device
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">Authorized Session</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {!s.isCurrent && (
                      <button
                        onClick={() => handleRevokeSession(s.id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-3 py-1 rounded-lg transition text-[11px] cursor-pointer"
                      >
                        Revoke Session
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 8: SAVED PAYMENT METHODS VAULT */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <CreditCard size={16} className="text-[#4848F7]" />
            <span>Saved Payment Methods Vault ({paymentMethods.length})</span>
          </h3>

          <button
            onClick={() => {
              if (onNavigatePayments) onNavigatePayments();
              else alert("Redirecting to Payment checkout...");
            }}
            className="bg-[#4848F7] hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
          >
            <Plus size={14} /> Add Payment Method
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {paymentMethods.map((pm) => (
            <div key={pm.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard size={16} className="text-indigo-600" /> {pm.name}
                </span>
                {pm.isDefault && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                    Default Method
                  </span>
                )}
              </div>

              {pm.type === "Card" ? (
                <p className="font-mono text-slate-600">•••• •••• •••• {pm.lastFour} (Exp: {pm.expiry})</p>
              ) : (
                <p className="font-mono text-slate-600">UPI ID: {pm.upiId}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 9: DATA PRIVACY & ACCOUNT DEACTIVATION PANEL */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 border-l-4 border-l-rose-500">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle size={16} className="text-rose-600" />
          <span>Data Privacy, Account Archive & Erasure</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Request an encrypted download archive of your complete visa applications history or permanently close your applicant portal account under GDPR Right-to-Erasure.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => alert("Downloading encrypted JSON data archive...")}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2 rounded-xl border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} /> Download Data Archive (.zip)
          </button>

          <button
            onClick={() => alert("Opening account deletion inquiry window...")}
            className="bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs px-4 py-2 rounded-xl border border-rose-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 size={14} /> Request Account Deletion
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 10: SETTINGS FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Account Settings & Security</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">How do I revoke an unrecognized active session?</p>
            <p className="text-slate-600 leading-relaxed">
              Find the device in the Active Login Sessions directory table above and click "Revoke Session". This immediately invalidates the security token on that device.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Can I change my default currency for consular fee calculations?</p>
            <p className="text-slate-600 leading-relaxed">
              Yes, select your preferred currency (INR, USD, or EUR) under Regional Display Preferences to auto-convert all fee estimates across the portal.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
