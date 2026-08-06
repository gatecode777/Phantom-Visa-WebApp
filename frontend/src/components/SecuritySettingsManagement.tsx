import React, { useState } from "react";
import {
  ShieldCheck,
  Shield,
  Lock,
  Key,
  Smartphone,
  Eye,
  Edit3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  RotateCcw,
  RefreshCw,
  Zap,
  Sliders,
  LogOut,
  Globe,
  FileText,
  Clock,
  Sparkles,
  Download,
  AlertTriangle,
  UserCheck,
  Activity
} from "lucide-react";

export interface SessionRecord {
  sessionId: string;
  user: string;
  role: string;
  ipAddress: string;
  device: string;
  loginTime: string;
}

export const SECURITY_WORKFLOW = [
  "Security Policy Modified",
  "Admin Authentication Checked",
  "Policy Validated",
  "Saved to Encrypted Config DB",
  "Active Sessions Re-authenticated",
  "Security Audit Trail Logged"
];

export const SECURITY_FEATURES = [
  "Two-Factor Authentication (2FA)",
  "Password Policy Enforcement",
  "Granular IP Whitelisting",
  "Session Timeout Controls",
  "Brute-force Login Protection",
  "Active Session Management",
  "AES-256 Encryption",
  "Real-time Threat Alerts",
  "Comprehensive Audit Logging",
  "Automated Security Scanning"
];

const MOCK_SESSIONS: SessionRecord[] = [
  { sessionId: "SES-8801", user: "Rahul Sharma", role: "Super Admin", ipAddress: "192.168.1.100", device: "Chrome on macOS", loginTime: "10 Mins Ago" },
  { sessionId: "SES-8802", user: "Amit Verma", role: "Admin", ipAddress: "10.0.0.45", device: "Firefox on Windows", loginTime: "25 Mins Ago" },
  { sessionId: "SES-8803", user: "Priya Patel", role: "Visa Officer", ipAddress: "172.16.0.12", device: "Safari on iPhone", loginTime: "40 Mins Ago" }
];

export default function SecuritySettingsManagement() {
  // Config States
  const [twoFactorMode, setTwoFactorMode] = useState("Mandatory for All Admins");
  const [authMethod, setAuthMethod] = useState("TOTP Authenticator App");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
  const [lockoutDuration, setLockoutDuration] = useState("30 Minutes");
  const [sessionTimeout, setSessionTimeout] = useState("15 Minutes");
  const [ipBinding, setIpBinding] = useState(true);

  // Password Rules
  const [minPassLength, setMinPassLength] = useState("12");
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSpecialChar, setRequireSpecialChar] = useState(true);
  const [passExpiry, setPassExpiry] = useState("90 Days");

  // IP Whitelisting
  const [enableIpWhitelist, setEnableIpWhitelist] = useState(true);
  const [allowedIps, setAllowedIps] = useState("192.168.1.1, 10.0.0.45");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveSecurity = () => {
    triggerToast("Security policies and authentication rules updated.");
  };

  const handleRunSecurityScan = () => {
    triggerToast("System security scan complete. No critical vulnerabilities found.");
  };

  const handleRevokeAllSessions = () => {
    triggerToast("Revoked all active admin sessions.");
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
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-200 mb-1">
            <ShieldCheck size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Settings &bull; Authentication & Threat Prevention
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Security Settings
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Configure system security policies, authentication controls, password rules, session limits, and threat protection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunSecurityScan}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-md transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <Shield size={15} /> Run Security Scan
          </button>
          <button
            onClick={handleSaveSecurity}
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Save size={15} /> Save Security Policies
          </button>
        </div>
      </div>

      {/* TOP METRICS DASHBOARD (6 CARDS MATCHING WIREFRAME) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">System Status</span>
          <div className="text-xl font-black text-slate-900 font-mono">Protected 🛡️</div>
          <span className="text-[10px] text-emerald-600 font-bold">Zero Threats</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">2FA Enforcement</span>
          <div className="text-xl font-black text-slate-900 font-mono">Active 🟢</div>
          <span className="text-[10px] text-blue-600 font-bold">Mandatory Admin</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-amber-600 block mb-1">Failed Logins (24h)</span>
          <div className="text-2xl font-black text-slate-900 font-mono">14</div>
          <span className="text-[10px] text-amber-600 font-bold">Blocked Attempts</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-indigo-600 block mb-1">Active Sessions</span>
          <div className="text-2xl font-black text-slate-900 font-mono">6</div>
          <span className="text-[10px] text-indigo-600 font-bold">Admin Sessions</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Blocked IPs</span>
          <div className="text-2xl font-black text-slate-900 font-mono">18</div>
          <span className="text-[10px] text-red-600 font-bold">Blacklisted</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">SSL Certificate</span>
          <div className="text-xl font-black text-slate-900 font-mono">Valid (340d)</div>
          <span className="text-[10px] text-teal-600 font-bold">TLS 1.3 Active</span>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT 2 COLUMNS: CONFIGURATION FORMS & SESSIONS TABLE */}
        <div className="lg:col-span-2 space-y-6">
          {/* AUTHENTICATION CONTROL FORM */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <Lock size={16} className="text-[#2563EB]" /> Authentication & 2FA Rules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Two-Factor Authentication (2FA)</label>
                <select
                  value={twoFactorMode}
                  onChange={(e) => setTwoFactorMode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold text-emerald-700"
                >
                  <option value="Mandatory for All Admins">Mandatory for All Admins</option>
                  <option value="Optional for Users">Optional for Users</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">2FA Method</label>
                <select
                  value={authMethod}
                  onChange={(e) => setAuthMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                >
                  <option value="TOTP Authenticator App">TOTP Authenticator App (Google/Authy)</option>
                  <option value="SMS OTP">SMS OTP</option>
                  <option value="Email Verification">Email Verification Code</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Max Login Attempts</label>
                <input
                  type="text"
                  value={maxLoginAttempts}
                  onChange={(e) => setMaxLoginAttempts(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Session Idle Timeout</label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                >
                  <option value="15 Minutes">15 Minutes</option>
                  <option value="30 Minutes">30 Minutes</option>
                  <option value="1 Hour">1 Hour</option>
                </select>
              </div>
            </div>
          </div>

          {/* PASSWORD POLICY RULES */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <Key size={16} className="text-purple-600" /> Password Complexity Rules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Min Length</label>
                <input
                  type="text"
                  value={minPassLength}
                  onChange={(e) => setMinPassLength(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Password Expiry</label>
                <select
                  value={passExpiry}
                  onChange={(e) => setPassExpiry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                >
                  <option value="90 Days">90 Days</option>
                  <option value="180 Days">180 Days</option>
                  <option value="Never Expire">Never Expire</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">IP Whitelisting</label>
                <select
                  value={enableIpWhitelist ? "Active" : "Disabled"}
                  onChange={(e) => setEnableIpWhitelist(e.target.value === "Active")}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold text-emerald-700"
                >
                  <option value="Active">Active 🟢</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
            </div>
          </div>

          {/* ACTIVE SESSIONS TABLE */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <UserCheck size={16} className="text-[#2563EB]" /> Configured Active Security Sessions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                    <th className="pb-2">Session ID</th>
                    <th className="pb-2">User</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2 text-center">IP Address</th>
                    <th className="pb-2 text-center">Device</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {MOCK_SESSIONS.map((ses) => (
                    <tr key={ses.sessionId} className="hover:bg-slate-50">
                      <td className="py-2 font-mono font-bold text-slate-900">{ses.sessionId}</td>
                      <td className="py-2 font-bold text-slate-900">{ses.user}</td>
                      <td className="py-2 font-semibold text-blue-700">{ses.role}</td>
                      <td className="py-2 text-center font-mono text-[11px] text-slate-600">{ses.ipAddress}</td>
                      <td className="py-2 text-center text-slate-600">{ses.device}</td>
                      <td className="py-2 text-right">
                        <button
                          onClick={() => triggerToast(`Revoked session ${ses.sessionId}`)}
                          className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ml-auto"
                        >
                          <LogOut size={12} /> Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: QUICK ACTIONS & AUDIT */}
        <div className="space-y-6">
          {/* QUICK CONTROL ACTIONS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Zap size={16} className="text-[#2563EB]" /> Security Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleSaveSecurity}
                className="w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Save size={14} /> Save Security Policies
              </button>
              <button
                onClick={handleRunSecurityScan}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Shield size={14} /> Run Security Diagnostics
              </button>
              <button
                onClick={handleRevokeAllSessions}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut size={14} /> Revoke All Admin Sessions
              </button>
            </div>
          </div>

          {/* RECOMMENDATION BOX */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
              <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Recommendation
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              The Security Settings page manages platform-wide security policies, two-factor authentication (2FA), password complexity rules, IP access control, session timeouts, threat protection, and real-time security audit trails. Ensure 2FA and IP whitelisting are strictly enforced for administrative accounts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
