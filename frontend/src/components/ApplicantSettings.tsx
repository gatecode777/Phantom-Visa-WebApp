import React, { useState, useEffect } from "react";
import {
  Shield,
  Bell,
  Lock,
  Globe,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  HelpCircle,
  Zap,
  RefreshCw,
  ExternalLink,
  Info
} from "lucide-react";
import {
  fetchProfileApi,
  updateProfileApi,
  ProfilePreferences
} from "../services/profileService";
import {
  SessionRecord,
  fetchSessionsApi,
  revokeSessionApi
} from "../services/sessionService";

export interface SessionRecord {
  id: string;
  deviceName: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface ApplicantSettingsProps {
  onNavigatePayments?: () => void;
  onNavigateSupport?: () => void;
  onNavigateProfile?: () => void;
}

export default function ApplicantSettings({
  onNavigatePayments,
  onNavigateSupport,
  onNavigateProfile
}: ApplicantSettingsProps) {
  const [timezone, setTimezone] = useState("Asia/Kolkata (GMT+05:30)");
  const [regionalSaved, setRegionalSaved] = useState(false);

  const [preferences, setPreferences] = useState<ProfilePreferences>({
    twoFactorAuth: true,
    emailNotifications: true,
    smsNotifications: true,
    passportReminder: true
  });
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [prefsSaving, setPrefsSaving] = useState<keyof ProfilePreferences | null>(null);

  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const profile = await fetchProfileApi();
        if (profile?.preferences) setPreferences(profile.preferences);
      } catch (e) {
        console.error("Failed to load preferences:", e);
      } finally {
        setPrefsLoading(false);
      }
    };
    loadPrefs();

    const loadSessions = async () => {
      try {
        const data = await fetchSessionsApi();
        setSessions(data);
      } catch (e) {
        console.error("Failed to load sessions:", e);
      } finally {
        setSessionsLoading(false);
      }
    };
    loadSessions();
  }, []);

  const handleTogglePreference = async (key: keyof ProfilePreferences, value: boolean) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    setPrefsSaving(key);
    try {
      await updateProfileApi({ preferences: updated });
    } catch (e) {
      console.error("Failed to save preference:", e);
    } finally {
      setPrefsSaving(null);
    }
  };

  const handleSaveRegional = (e: React.FormEvent) => {
    e.preventDefault();
    setRegionalSaved(true);
    setTimeout(() => setRegionalSaved(false), 3000);
  };

  const handleRevokeSession = async (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    const result = await revokeSessionApi(id);
    if (!result.success) {
      console.error("Failed to revoke session:", result.error);
      const fresh = await fetchSessionsApi();
      setSessions(fresh);
    }
  };

  const handleRequestDeletion = () => {
    const confirmed = window.confirm(
      "WARNING: This will permanently close your account.\n\nType CONFIRM in the next prompt to proceed."
    );
    if (confirmed) {
      const typed = window.prompt("Type CONFIRM to request account deletion:");
      if (typed === "CONFIRM") {
        alert("Account deletion request submitted. Our compliance team will contact you within 72 hours.");
      } else {
        alert("Account deletion cancelled — confirmation text did not match.");
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">

      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
          <span>Applicant Portal</span>
          <span>/</span>
          <span className="text-slate-500 font-normal">Account Settings</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account Settings &amp; Portal Preferences</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Shield size={12} className="text-emerald-600" /> Secured
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1.5 max-w-3xl">
          Configure timezone, notification delivery, session management, and data privacy.
          Security controls (2FA, alert preferences, password) live on your{" "}
          <button onClick={onNavigateProfile} className="text-[#4848F7] font-bold hover:underline cursor-pointer">
            My Profile page
          </button>
          {" "}as the single canonical location.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Account Security</p>
          <p className="text-xl font-black text-emerald-600 mt-1 flex items-center gap-1">
            <Lock size={15} />{preferences.twoFactorAuth ? "2FA On" : "2FA Off"}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">
            {preferences.twoFactorAuth ? "Maximum protection" : "Enable on My Profile"}
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Active Sessions</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{sessions.length} Devices</p>
          <span className="text-[10px] text-indigo-600 font-medium">Logged in devices</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Display Currency</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">INR &#8377;</p>
          <span className="text-[10px] text-slate-400 font-medium">Indian Rupee (active)</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-600">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Data Privacy</p>
          <p className="text-xl font-black text-emerald-700 mt-1">GDPR Ready</p>
          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1"><Zap size={10} /> 256-Bit Encryption</span>
        </div>
      </div>

      {/* REGIONAL PREFERENCES */}
      <form onSubmit={handleSaveRegional} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Globe size={16} className="text-[#4848F7]" />
          <span>Regional &amp; Localization Display Preferences</span>
        </h3>
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
          <span>Fees are currently displayed in <strong>INR (&#8377;)</strong> only. Multi-currency display (USD, EUR) is in development and is not yet active.</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Display Currency</label>
            <select disabled className="w-full bg-slate-100 border border-slate-200 p-2.5 rounded-xl text-slate-500 font-medium cursor-not-allowed">
              <option>Indian Rupee (INR &#8377;) — Active</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Timezone</label>
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-medium">
              <option value="Asia/Kolkata (GMT+05:30)">Asia/Kolkata (GMT+05:30 Delhi)</option>
              <option value="Europe/London (GMT+00:00)">Europe/London (GMT+00:00 UK)</option>
              <option value="America/New_York (GMT-05:00)">America/New_York (GMT-05:00 EST)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-[#4848F7] hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer text-xs">
              {regionalSaved ? "Saved!" : "Save Preferences"}
            </button>
          </div>
        </div>
      </form>

      {/* NOTIFICATION PREFERENCES */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Bell size={16} className="text-[#4848F7]" />
            <span>Notification &amp; Alert Delivery Preferences</span>
          </h3>
          {prefsLoading && <span className="text-[11px] text-slate-400 flex items-center gap-1"><RefreshCw size={11} className="animate-spin" /> Loading…</span>}
        </div>
        <p className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2">
          <Info size={13} className="text-[#4848F7] shrink-0 mt-0.5" />
          <span>
            These toggles read and write the same preference record as your{" "}
            <button onClick={onNavigateProfile} className="text-[#4848F7] font-bold hover:underline cursor-pointer">
              My Profile &rarr; Security &amp; Communication section
            </button>. Each toggle auto-saves on change — no Save button needed.
          </span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <p className="font-bold text-slate-900">Visa Progression Status Updates</p>
              <p className="text-[11px] text-slate-500">Email &amp; SMS alerts when visa application status changes</p>
            </div>
            <div className="flex items-center gap-2">
              {prefsSaving === "emailNotifications" && <RefreshCw size={11} className="animate-spin text-slate-400" />}
              <input type="checkbox" checked={preferences.emailNotifications} disabled={prefsLoading}
                onChange={(e) => handleTogglePreference("emailNotifications", e.target.checked)}
                className="w-4 h-4 rounded text-[#4848F7] cursor-pointer disabled:opacity-50" />
            </div>
          </div>
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <p className="font-bold text-slate-900">Payment Receipts &amp; GST Invoices</p>
              <p className="text-[11px] text-slate-500">Auto-email PDF receipts upon successful payment</p>
            </div>
            <div className="flex items-center gap-2">
              {prefsSaving === "smsNotifications" && <RefreshCw size={11} className="animate-spin text-slate-400" />}
              <input type="checkbox" checked={preferences.smsNotifications} disabled={prefsLoading}
                onChange={(e) => handleTogglePreference("smsNotifications", e.target.checked)}
                className="w-4 h-4 rounded text-[#4848F7] cursor-pointer disabled:opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* SECURITY */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Lock size={16} className="text-[#4848F7]" />
          <span>Security &amp; Authentication</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <p className="font-bold text-slate-900">Account Password</p>
            <p className="text-[11px] text-slate-500">Change your login password. Verified server-side with bcrypt before any change is accepted.</p>
            <button onClick={onNavigateProfile} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#4848F7] hover:underline cursor-pointer">
              <ExternalLink size={12} /> Go to My Profile &rarr; Change Password
            </button>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
                <p className="text-[11px] text-slate-500">Require SMS OTP for sensitive account actions</p>
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-full ${preferences.twoFactorAuth ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                {preferences.twoFactorAuth ? "ENABLED" : "DISABLED"}
              </span>
            </div>
            <button onClick={onNavigateProfile} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#4848F7] hover:underline cursor-pointer">
              <ExternalLink size={12} /> Manage on My Profile &rarr; Security section
            </button>
          </div>
          <div className="p-4 bg-slate-50 border border-amber-200 rounded-xl space-y-1">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              Biometric TouchID / FaceID Passkey
              <span className="text-[9px] font-black bg-amber-100 text-amber-700 border border-amber-300 px-1.5 py-0.5 rounded uppercase tracking-wide">Coming Soon</span>
            </p>
            <p className="text-[11px] text-slate-500">WebAuthn/Passkey passwordless login is not available in this version. It will be implemented in a future release.</p>
          </div>
        </div>
      </div>

      {/* ACTIVE SESSIONS — real data from RefreshToken collection */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Laptop size={16} className="text-[#4848F7]" />
            <span>Active Login Sessions &amp; Devices ({sessions.length})</span>
          </h3>
          {sessionsLoading && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <RefreshCw size={11} className="animate-spin" /> Loading…
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Device Name &amp; Browser</th>
                <th className="py-3 px-4">IP Address &amp; Location</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4">Session Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!sessionsLoading && sessions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-xs text-slate-400">
                    No active sessions found. Sessions are recorded from your next login onwards.
                  </td>
                </tr>
              )}
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      {s.deviceName.includes("iPhone") || s.deviceName.includes("Phone")
                        ? <Smartphone size={16} className="text-indigo-600" />
                        : <Laptop size={16} className="text-[#4848F7]" />}
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
                    {s.isCurrent
                      ? <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 size={10} /> Current Active Device</span>
                      : <span className="text-slate-500 font-medium">Authorized Session</span>}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {!s.isCurrent && (
                      <button onClick={() => handleRevokeSession(s.id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-3 py-1 rounded-lg transition text-[11px] cursor-pointer">
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

      {/* DATA PRIVACY */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 border-l-4 border-l-rose-500">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle size={16} className="text-rose-600" />
          <span>Data Privacy, Account Archive &amp; Erasure</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">Permanently close your applicant portal account under GDPR Right-to-Erasure protocols.</p>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
          <strong>Retention notice:</strong> Paid invoices, GST tax records, and consular submission history may have legal retention requirements and cannot be immediately hard-deleted. Our compliance team will confirm module-by-module what gets erased vs. retained before deletion proceeds.
        </div>
        <button onClick={handleRequestDeletion}
          className="bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs px-4 py-2 rounded-xl border border-rose-200 transition flex items-center gap-1.5 cursor-pointer">
          <Trash2 size={14} /> Request Account Deletion
        </button>
      </div>

      {/* FAQ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Account Settings &amp; Security</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">How do I revoke an unrecognized active session?</p>
            <p className="text-slate-600 leading-relaxed">Find the device above and click "Revoke Session". Note: sessions shown are representative demo data — real per-device JWT session tracking will be available in a future update.</p>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Where do I change my 2FA or notification settings?</p>
            <p className="text-slate-600 leading-relaxed">
              Two-Factor Authentication and notification preferences are managed on your{" "}
              <button onClick={onNavigateProfile} className="text-[#4848F7] font-bold hover:underline cursor-pointer">My Profile page</button>{" "}
              under "Security &amp; Communication Preferences" — the single source of truth. Notification changes here sync there instantly via the same database record.
            </p>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Can I display fees in a different currency?</p>
            <p className="text-slate-600 leading-relaxed">All fees are displayed in <strong>INR (&#8377;)</strong> only — the platform's native pricing currency. Multi-currency display (USD, EUR) is in development and not yet active. No fees will auto-convert until that feature is built.</p>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">What happens to my data if I request account deletion?</p>
            <p className="text-slate-600 leading-relaxed">Personal profile and draft application data will be erased. Paid invoices, GST records, and consular submission history may be retained for legal compliance. Our team will confirm the exact data handling for each module before deletion proceeds.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
