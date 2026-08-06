import React, { useState } from "react";
import {
  Settings,
  Building,
  Globe,
  Clock,
  Mail,
  Phone,
  MapPin,
  User,
  ShieldCheck,
  Save,
  RotateCcw,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Lock,
  Cpu,
  Database,
  Server,
  Zap,
  Sparkles,
  Key,
  Shield,
  Bell,
  Sliders,
  DollarSign,
  Palette,
  HardDrive
} from "lucide-react";

export const GENERAL_SETTINGS_WORKFLOW = [
  "Admin Modifies Settings",
  "Form Validation Checked",
  "Changes Saved to DB",
  "System Configuration Cache Cleared",
  "Real-time Sync Applied",
  "Audit Log Entry Recorded"
];

export const GENERAL_SETTINGS_FEATURES = [
  "Platform Branding Control",
  "Custom Logo & Favicon",
  "Localization & Timezones",
  "Multi-language Support",
  "Working Hours Configuration",
  "System Maintenance Toggle",
  "Email Communication SMTP",
  "Security 2FA Enforcement",
  "Automated Backup Schedule",
  "System Health Diagnostics"
];

export default function GeneralSettingsManagement() {
  // Platform Info State
  const [appName, setAppName] = useState("Phantom Visa Services");
  const [companyName, setCompanyName] = useState("Phantom Visa Private Limited");
  const [websiteTitle, setWebsiteTitle] = useState("Phantom Visa - Online Visa Application Portal");
  const [platformUrl, setPlatformUrl] = useState("https://phantomvisa.com");
  const [supportEmail, setSupportEmail] = useState("support@phantomvisa.com");
  const [supportContact, setSupportContact] = useState("+91 98765 43210");
  const [officeAddress, setOfficeAddress] = useState("101 Visa Tower, Cyber City, Gurugram, Haryana");
  const [repName, setRepName] = useState("Rahul Sharma");
  const [repContact, setRepContact] = useState("+91 98765 00000");

  // Operating & Localization
  const [workingDays, setWorkingDays] = useState("Monday - Saturday");
  const [workingHours, setWorkingHours] = useState("09:00 AM - 06:00 PM");
  const [appProcessingMode, setAppProcessingMode] = useState("Auto");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [defaultLanguage, setDefaultLanguage] = useState("English");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState("12-Hour (09:00 AM)");
  const [currencySymbol, setCurrencySymbol] = useState("INR (₹)");

  // Performance & Security Toggles
  const [enableCache, setEnableCache] = useState(true);
  const [enableCompression, setEnableCompression] = useState(true);
  const [maxUploadSize, setMaxUploadSize] = useState("25 MB");
  const [sessionTimeout, setSessionTimeout] = useState("30 Minutes");
  const [require2FA, setRequire2FA] = useState(true);
  const [autoAssignAgent, setAutoAssignAgent] = useState(true);

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveSettings = () => {
    triggerToast("General Settings saved successfully to the system database.");
  };

  const handleResetSettings = () => {
    triggerToast("Settings reset to default configuration.");
  };

  const handleTestSmtp = () => {
    triggerToast("Test email sent to support@phantomvisa.com (SMTP OK).");
  };

  const handlePurgeCache = () => {
    triggerToast("Platform redis cache purged successfully.");
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
            <Settings size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Settings &bull; Core Platform Configuration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            General Settings
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Configure basic platform information, branding, localization, working hours, and operational preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetSettings}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-md transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <RotateCcw size={15} /> Reset Defaults
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Save size={15} /> Save All Settings
          </button>
        </div>
      </div>

      {/* MAIN SETTINGS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT 2 COLUMNS: FORM PANELS */}
        <div className="lg:col-span-2 space-y-6">
          {/* PANEL 1: PLATFORM INFORMATION */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building size={16} className="text-[#2563EB]" /> Platform & Company Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Application Name</label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Website Title</label>
                <input
                  type="text"
                  value={websiteTitle}
                  onChange={(e) => setWebsiteTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Platform URL</label>
                <input
                  type="text"
                  value={platformUrl}
                  onChange={(e) => setPlatformUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Support Contact Number</label>
                <input
                  type="text"
                  value={supportContact}
                  onChange={(e) => setSupportContact(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Office Address</label>
                <input
                  type="text"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Authorized Representative</label>
                <input
                  type="text"
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Representative Contact</label>
                <input
                  type="text"
                  value={repContact}
                  onChange={(e) => setRepContact(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-medium"
                />
              </div>
            </div>
          </div>

          {/* PANEL 2: OPERATING & LOCALIZATION SETTINGS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock size={16} className="text-emerald-600" /> Operating Schedules & Localization
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Working Days</label>
                <input
                  type="text"
                  value={workingDays}
                  onChange={(e) => setWorkingDays(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Working Hours</label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Primary Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-medium"
                >
                  <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Default Language</label>
                <select
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-medium"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Punjabi">Punjabi</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Date Format</label>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">System Currency</label>
                <select
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                >
                  <option value="INR (₹)">Indian Rupee (INR ₹)</option>
                  <option value="USD ($)">US Dollar (USD $)</option>
                  <option value="EUR (€)">Euro (EUR €)</option>
                  <option value="GBP (£)">British Pound (GBP £)</option>
                </select>
              </div>
            </div>
          </div>

          {/* PANEL 3: BRANDING & ASSETS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <Palette size={16} className="text-purple-600" /> Branding & Visual Assets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 border border-dashed border-slate-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block text-xs">Main Header Logo</span>
                  <span className="text-[10px] text-slate-400">PNG, SVG (Max 2MB)</span>
                </div>
                <button
                  onClick={() => triggerToast("Opened logo file picker.")}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-[#2563EB] transition cursor-pointer flex items-center gap-1"
                >
                  <Upload size={13} /> Change Logo
                </button>
              </div>

              <div className="bg-slate-50 border border-dashed border-slate-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block text-xs">Favicon Icon</span>
                  <span className="text-[10px] text-slate-400">ICO, PNG (32x32)</span>
                </div>
                <button
                  onClick={() => triggerToast("Opened favicon picker.")}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-[#2563EB] transition cursor-pointer flex items-center gap-1"
                >
                  <Upload size={13} /> Change Favicon
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SYSTEM STATUS & CONTROL ACTIONS */}
        <div className="space-y-6">
          {/* SYSTEM HEALTH STATUS CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Server size={16} className="text-emerald-600" /> System Information & Health
            </h3>
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between items-center bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                <span>Server Status:</span>
                <span className="font-bold text-emerald-800 flex items-center gap-1">🟢 Online & Healthy</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                <span>Platform Version:</span>
                <span className="font-mono text-slate-900">v4.2.1-stable</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                <span>Node.js Env:</span>
                <span className="font-mono text-slate-900">v18.16.0 Prod</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                <span>Database Driver:</span>
                <span className="font-mono text-slate-900">MongoDB 6.0</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                <span>System Memory:</span>
                <span className="font-mono text-slate-900">64 GB (24% Used)</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                <span>Disk Storage:</span>
                <span className="font-mono text-slate-900">450 GB Free / 1 TB</span>
              </div>
            </div>
          </div>

          {/* QUICK CONTROL ACTIONS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Zap size={16} className="text-[#2563EB]" /> Quick Admin Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleSaveSettings}
                className="w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Save size={14} /> Save All Settings
              </button>
              <button
                onClick={handlePurgeCache}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap size={14} /> Purge Redis Cache
              </button>
              <button
                onClick={handleTestSmtp}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Mail size={14} /> Test SMTP Connection
              </button>
            </div>
          </div>

          {/* RECOMMENDATION BOX */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
              <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Recommendation
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              The General Settings page allows administrators to configure global platform behavior, company metadata, branding assets, operational schedules, localization rules, security protocols, system thresholds, and performance limits. Ensure changes are tested before saving.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
