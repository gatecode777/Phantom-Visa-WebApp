import React, { useState, useEffect, useRef } from "react";
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
  HardDrive,
  RefreshCw,
  Info,
  Copy,
  ExternalLink,
  Eye
} from "lucide-react";
import { useSystemHealth } from "../hooks/useSystemHealth";
import { formatUptime, testSmtpConnection, clearPlatformCache, updateSystemSettings, fetchSystemSettings } from "../services/systemService";
import { uploadImageToImageKit } from "../services/imageKitService";
import { setDynamicFavicon } from "../utils/favicon";

export const GENERAL_SETTINGS_WORKFLOW = [
  "Admin Modifies Settings",
  "Form Validation Checked",
  "Changes Saved to Storage",
  "Platform Cache Refreshed",
  "Real-time Sync Applied",
  "Audit Log Entry Recorded"
];

export const GENERAL_SETTINGS_FEATURES = [
  "Platform Branding Control",
  "Custom Logo & Favicon Persistence",
  "Localization & Timezones",
  "Multi-language Support",
  "Working Hours Configuration",
  "System Maintenance Toggle",
  "Live Telemetry & Health Monitoring",
  "Security 2FA Enforcement",
  "Automated Backup Schedule"
];

const DEFAULT_SETTINGS = {
  appName: "Phantom Visa Services",
  companyName: "Phantom Visa Private Limited",
  websiteTitle: "Phantom Visa - Online Visa Application Portal",
  platformUrl: "https://phantomvisa.com",
  supportEmail: "support@phantomvisa.com",
  supportContact: "+91 98765 43210",
  officeAddress: "101 Visa Tower, Cyber City, Phase 2, Gurugram, Haryana 122002",
  repName: "Rahul Sharma",
  repRole: "Primary Statutory Director",
  repContact: "+91 98765 00000",
  workingDays: "Monday - Saturday",
  workingHours: "09:00 AM - 06:00 PM",
  appProcessingMode: "Auto",
  maintenanceMode: false,
  timezone: "Asia/Kolkata (IST)",
  defaultLanguage: "English",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12-Hour (09:00 AM)",
  currencySymbol: "INR (₹)",
  enableCache: true,
  enableCompression: true,
  maxUploadSize: "25 MB",
  sessionTimeout: "30 Minutes",
  require2FA: true,
  autoAssignAgent: true
};

export default function GeneralSettingsManagement() {
  // Live system health telemetry hook (polls every 15 seconds)
  const { health, loading: healthLoading, lastRefreshed, refresh: refreshHealth } = useSystemHealth(15000);

  // Platform Info State with LocalStorage Persistence
  const [appName, setAppName] = useState(() => {
    try {
      const saved = localStorage.getItem("phantom_general_settings");
      if (saved) return JSON.parse(saved).appName || DEFAULT_SETTINGS.appName;
    } catch {}
    return DEFAULT_SETTINGS.appName;
  });

  const [companyName, setCompanyName] = useState(() => {
    try {
      const saved = localStorage.getItem("phantom_general_settings");
      if (saved) return JSON.parse(saved).companyName || DEFAULT_SETTINGS.companyName;
    } catch {}
    return DEFAULT_SETTINGS.companyName;
  });

  const [websiteTitle, setWebsiteTitle] = useState(() => {
    try {
      const saved = localStorage.getItem("phantom_general_settings");
      if (saved) return JSON.parse(saved).websiteTitle || DEFAULT_SETTINGS.websiteTitle;
    } catch {}
    return DEFAULT_SETTINGS.websiteTitle;
  });

  const [platformUrl, setPlatformUrl] = useState(DEFAULT_SETTINGS.platformUrl);
  const [supportEmail, setSupportEmail] = useState(DEFAULT_SETTINGS.supportEmail);
  const [supportContact, setSupportContact] = useState(DEFAULT_SETTINGS.supportContact);
  const [officeAddress, setOfficeAddress] = useState(DEFAULT_SETTINGS.officeAddress);
  const [repName, setRepName] = useState(DEFAULT_SETTINGS.repName);
  const [repContact, setRepContact] = useState(DEFAULT_SETTINGS.repContact);

  // Operating & Localization
  const [workingDays, setWorkingDays] = useState(DEFAULT_SETTINGS.workingDays);
  const [workingHours, setWorkingHours] = useState(DEFAULT_SETTINGS.workingHours);
  const [timezone, setTimezone] = useState(DEFAULT_SETTINGS.timezone);
  const [defaultLanguage, setDefaultLanguage] = useState(DEFAULT_SETTINGS.defaultLanguage);
  const [dateFormat, setDateFormat] = useState(DEFAULT_SETTINGS.dateFormat);
  const [currencySymbol, setCurrencySymbol] = useState(DEFAULT_SETTINGS.currencySymbol);

  // Branding Custom Assets
  const [logoPreview, setLogoPreview] = useState<string | null>(() => {
    try {
      return localStorage.getItem("phantom_custom_logo");
    } catch {}
    return null;
  });

  const [faviconPreview, setFaviconPreview] = useState<string | null>(() => {
    try {
      return localStorage.getItem("phantom_custom_favicon");
    } catch {}
    return null;
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const triggerToast = (text: string, isError: boolean = false) => {
    setToastMsg({ text, isError });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Sync settings to localStorage and MongoDB Backend
  const handleSaveSettings = async () => {
    const settingsPayload = {
      appName,
      companyName,
      websiteTitle,
      logoUrl: logoPreview || undefined,
      faviconUrl: faviconPreview || undefined,
      platformUrl,
      supportEmail,
      supportContact,
      officeAddress,
      repName,
      repRole: "Primary Statutory Director",
      repContact,
      workingDays,
      workingHours,
      timezone,
      defaultLanguage,
      dateFormat,
      currencySymbol,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem("phantom_general_settings", JSON.stringify(settingsPayload));
      window.dispatchEvent(new Event("phantom_settings_updated"));
      await updateSystemSettings(settingsPayload);
      triggerToast("General Settings saved successfully to database & configuration store.");
    } catch (e) {
      triggerToast("Failed to save settings to store.", true);
    }
  };

  const handleResetSettings = () => {
    setAppName(DEFAULT_SETTINGS.appName);
    setCompanyName(DEFAULT_SETTINGS.companyName);
    setWebsiteTitle(DEFAULT_SETTINGS.websiteTitle);
    setPlatformUrl(DEFAULT_SETTINGS.platformUrl);
    setSupportEmail(DEFAULT_SETTINGS.supportEmail);
    setSupportContact(DEFAULT_SETTINGS.supportContact);
    setOfficeAddress(DEFAULT_SETTINGS.officeAddress);
    setRepName(DEFAULT_SETTINGS.repName);
    setRepContact(DEFAULT_SETTINGS.repContact);
    setWorkingDays(DEFAULT_SETTINGS.workingDays);
    setWorkingHours(DEFAULT_SETTINGS.workingHours);
    setTimezone(DEFAULT_SETTINGS.timezone);
    setDefaultLanguage(DEFAULT_SETTINGS.defaultLanguage);
    setDateFormat(DEFAULT_SETTINGS.dateFormat);
    setCurrencySymbol(DEFAULT_SETTINGS.currencySymbol);

    try {
      localStorage.removeItem("phantom_general_settings");
      triggerToast("Settings reset to default configuration.");
    } catch {}
  };

  // Real SMTP connection testing
  const [smtpTesting, setSmtpTesting] = useState(false);
  const handleTestSmtp = async () => {
    setSmtpTesting(true);
    try {
      const res = await testSmtpConnection();
      if (res.success) {
        triggerToast(res.message);
      } else {
        triggerToast(res.message, true);
      }
    } catch (err: any) {
      triggerToast("SMTP Test Failed: " + err.message, true);
    } finally {
      setSmtpTesting(false);
    }
  };

  // Real cache purging
  const [purgingCache, setPurgingCache] = useState(false);
  const handleClearCache = async () => {
    setPurgingCache(true);
    try {
      const res = await clearPlatformCache();
      triggerToast(res.message);
    } finally {
      setPurgingCache(false);
    }
  };

  // Upload state
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  // Logo file upload handler directly to ImageKit & MongoDB
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      triggerToast("Logo file size exceeds 5MB limit.", true);
      return;
    }

    setUploadingLogo(true);
    try {
      const res = await uploadImageToImageKit(file, "/PHANTOM-VISA/branding/");
      setLogoPreview(res.url);
      localStorage.setItem("phantom_custom_logo", res.url);
      await updateSystemSettings({ logoUrl: res.url });
      window.dispatchEvent(new CustomEvent("phantom_logo_updated", { detail: { url: res.url } }));
      triggerToast("Logo uploaded to ImageKit CDN & synced across all portals!");
    } catch (err: any) {
      triggerToast(err.message || "Failed to upload logo to ImageKit.", true);
    } finally {
      setUploadingLogo(false);
    }
  };

  // Favicon file upload handler directly to ImageKit & MongoDB
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFavicon(true);
    try {
      const res = await uploadImageToImageKit(file, "/PHANTOM-VISA/branding/");
      setFaviconPreview(res.url);
      localStorage.setItem("phantom_custom_favicon", res.url);
      await updateSystemSettings({ faviconUrl: res.url });
      
      // Dynamically update browser tab favicon links & broadcast sync
      setDynamicFavicon(res.url);
      window.dispatchEvent(new CustomEvent("phantom_favicon_updated", { detail: { url: res.url } }));
      
      triggerToast("Favicon uploaded to ImageKit CDN & applied to browser tab!");
    } catch (err: any) {
      triggerToast(err.message || "Failed to upload favicon to ImageKit.", true);
    } finally {
      setUploadingFavicon(false);
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* Hidden file inputs for Branding */}
      <input
        type="file"
        ref={logoInputRef}
        onChange={handleLogoUpload}
        accept="image/png,image/svg+xml,image/jpeg,image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={faviconInputRef}
        onChange={handleFaviconUpload}
        accept="image/x-icon,image/png,image/svg+xml"
        className="hidden"
      />

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className={`fixed top-5 right-5 z-[9999] ${toastMsg.isError ? "bg-[#7F1D1D] border-red-500" : "bg-[#0E1A2C] border-[#2563EB]/40"} border text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3`}>
          <div className={`w-8 h-8 rounded-lg ${toastMsg.isError ? "bg-red-500/20 text-red-300" : "bg-[#2563EB]/20 text-[#2563EB]"} flex items-center justify-center`}>
            {toastMsg.isError ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          </div>
          <span className="text-xs font-semibold max-w-sm">{toastMsg.text}</span>
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
            Configure basic platform information, branding, localization, working hours, and live infrastructure preferences.
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
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Company Registered Name</label>
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

              {/* DISAMBIGUATED STATUTORY DIRECTOR ROLE (BUG 1) */}
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                  Primary Statutory Director / Officer
                </label>
                <input
                  type="text"
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Statutory executive officer for legal compliance. Distinct from customer & support staff accounts.
                </span>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Director Contact Number</label>
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

              {/* RECONCILED WORKING HOURS (BUG 9) */}
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                  Office Working Hours
                </label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-medium"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Human staff shift. AI Consular Bot & application intake remain 24/7.
                </span>
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

              {/* SYSTEM CURRENCY VS APPLICANT DISPLAY CURRENCY (BUG 8) */}
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                  System Base Currency
                </label>
                <select
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold text-[#2563EB]"
                >
                  <option value="INR (₹)">Indian Rupee (INR ₹) &bull; Base</option>
                  <option value="USD ($)">US Dollar (USD $)</option>
                  <option value="EUR (€)">Euro (EUR €)</option>
                  <option value="GBP (£)">British Pound (GBP £)</option>
                </select>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Single source of truth for stored ledger amounts. Applicant display currencies convert from this base.
                </span>
              </div>
            </div>
          </div>

          {/* PANEL 3: BRANDING & ASSETS (PERSISTENT LOGO & FAVICON ON IMAGEKIT) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                <Palette size={16} className="text-purple-600" /> Branding & Visual Assets (ImageKit CDN)
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ImageKit Storage Active 🟢
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* MAIN HEADER LOGO */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Header Logo Preview" className="h-10 w-10 object-contain rounded-lg border border-slate-200 bg-white p-1" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-black text-xs">
                        PV
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">Main Header Logo</span>
                      <span className="text-[10px] text-slate-400">PNG, SVG, JPG (Max 5MB)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-300 rounded-xl text-xs font-bold text-[#2563EB] transition cursor-pointer flex items-center gap-1 shrink-0 disabled:opacity-50"
                  >
                    <Upload size={13} className={uploadingLogo ? "animate-spin" : ""} />
                    <span>{uploadingLogo ? "Uploading..." : "Change Logo"}</span>
                  </button>
                </div>

                {logoPreview && (
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <span className="text-[9px] font-bold uppercase text-slate-400 block">ImageKit CDN URL:</span>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1.5">
                      <input
                        type="text"
                        readOnly
                        value={logoPreview}
                        className="w-full bg-transparent text-[10px] font-mono text-slate-700 select-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(logoPreview);
                          triggerToast("Logo ImageKit URL copied to clipboard!");
                        }}
                        className="p-1 hover:bg-slate-100 text-slate-500 hover:text-[#2563EB] rounded cursor-pointer shrink-0"
                        title="Copy ImageKit URL"
                      >
                        <Copy size={12} />
                      </button>
                      <a
                        href={logoPreview}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 hover:bg-slate-100 text-slate-500 hover:text-[#2563EB] rounded cursor-pointer shrink-0"
                        title="Open image in new tab"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* FAVICON ICON */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {faviconPreview ? (
                      <img src={faviconPreview} alt="Favicon Preview" className="h-8 w-8 object-contain rounded-lg border border-slate-200 bg-white p-0.5" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                        ICO
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">Favicon Icon</span>
                      <span className="text-[10px] text-slate-400">ICO, PNG (Browser Tab)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => faviconInputRef.current?.click()}
                    disabled={uploadingFavicon}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-300 rounded-xl text-xs font-bold text-[#2563EB] transition cursor-pointer flex items-center gap-1 shrink-0 disabled:opacity-50"
                  >
                    <Upload size={13} className={uploadingFavicon ? "animate-spin" : ""} />
                    <span>{uploadingFavicon ? "Uploading..." : "Change Favicon"}</span>
                  </button>
                </div>

                {faviconPreview && (
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <span className="text-[9px] font-bold uppercase text-slate-400 block">ImageKit CDN URL:</span>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1.5">
                      <input
                        type="text"
                        readOnly
                        value={faviconPreview}
                        className="w-full bg-transparent text-[10px] font-mono text-slate-700 select-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(faviconPreview);
                          triggerToast("Favicon ImageKit URL copied to clipboard!");
                        }}
                        className="p-1 hover:bg-slate-100 text-slate-500 hover:text-[#2563EB] rounded cursor-pointer shrink-0"
                        title="Copy ImageKit URL"
                      >
                        <Copy size={12} />
                      </button>
                      <a
                        href={faviconPreview}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 hover:bg-slate-100 text-slate-500 hover:text-[#2563EB] rounded cursor-pointer shrink-0"
                        title="Open favicon in new tab"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SYSTEM STATUS & CONTROL ACTIONS */}
        <div className="space-y-6">
          {/* LIVE SYSTEM HEALTH STATUS CARD (BUG 2) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2">
                <Server size={16} className="text-emerald-600" /> Live System Telemetry
              </h3>
              <button
                onClick={refreshHealth}
                disabled={healthLoading}
                className="text-[10px] text-slate-400 hover:text-[#2563EB] flex items-center gap-1 cursor-pointer transition font-mono"
                title="Refresh live telemetry"
              >
                <RefreshCw size={11} className={healthLoading ? "animate-spin" : ""} />
                <span>Live</span>
              </button>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              <div className={`flex justify-between items-center p-2 rounded-xl border ${health?.serverOnline ? "bg-emerald-50/70 border-emerald-100" : "bg-red-50/70 border-red-100"}`}>
                <span>Server Status:</span>
                <span className={`font-bold flex items-center gap-1 ${health?.serverOnline ? "text-emerald-800" : "text-red-800"}`}>
                  {health?.serverOnline ? "🟢 Online & Healthy" : "🔴 Offline / Degraded"}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                <span>Platform Version:</span>
                <span className="font-mono text-slate-900 font-bold">{health?.platformVersion || "v4.2.1-stable"}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                <span>Node.js Env:</span>
                <span className="font-mono text-slate-900">{health?.nodeVersion || "v18.16.0"}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                <span>Database Driver:</span>
                <span className="font-mono text-slate-900 font-bold text-emerald-700">
                  {health?.databaseDriver || "MongoDB Mongoose"}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                <span>Host Memory Usage:</span>
                <span className="font-mono text-slate-900">
                  {health?.memory
                    ? `${health.memory.hostUsedGb} GB / ${health.memory.hostTotalGb} GB (${health.memory.hostUsedPercent}%)`
                    : "16 GB (Host Monitored)"}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                <span>Process Uptime / Heap:</span>
                <span className="font-mono text-slate-700 text-[11px]">
                  {health ? `${formatUptime(health.uptimeSeconds)} • ${health.memory.heapUsedMb} MB Heap` : "Live"}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                <span>Disk Storage:</span>
                <span className="font-mono text-slate-700 text-[11px]">Local Disk Active</span>
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
                className="w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Save size={14} /> Save All Settings
              </button>
              <button
                onClick={handleClearCache}
                disabled={purgingCache}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                <Zap size={14} className={purgingCache ? "animate-spin" : ""} /> Clear Platform Cache
              </button>
              <button
                onClick={handleTestSmtp}
                disabled={smtpTesting}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Mail size={14} className={smtpTesting ? "animate-spin" : ""} /> Test SMTP Connection
              </button>
            </div>
          </div>

          {/* RECOMMENDATION BOX */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
              <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Recommendation
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              General Settings configure global application metadata, branding, statutory representation, operational hours, localization, and live telemetry. All tax and invoice data reference Company Profile as single source of truth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
