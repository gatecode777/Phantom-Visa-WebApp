import React, { useState } from "react";
import {
  Mail,
  Server,
  Key,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  RotateCcw,
  RefreshCw,
  Eye,
  Edit3,
  Check,
  X,
  Zap,
  Sliders,
  Send,
  Lock,
  Globe,
  FileText,
  Clock,
  Sparkles,
  Download,
  Trash2
} from "lucide-react";

export interface EmailLogRecord {
  logId: string;
  recipient: string;
  subject: string;
  type: string;
  status: "Sent" | "Failed" | "Queued";
  sentTime: string;
}

export const EMAIL_WORKFLOW = [
  "SMTP Provider Selected",
  "Host & Port Configured",
  "Credentials Authenticated",
  "Test Email Dispatched",
  "Templates Configured",
  "Automated Trigger Active"
];

export const EMAIL_FEATURES = [
  "Multi-provider SMTP Support",
  "Automated Bounce Suppression",
  "SPF / DKIM Domain Verification",
  "Transactional Template Engine",
  "Custom Sender Profiles",
  "Real-time Delivery Logging",
  "Automated Queue Retries",
  "High-volume Hourly Throttling",
  "Multi-language Email Templates",
  "Failed Email Alert Triggers"
];

const MOCK_EMAIL_LOGS: EmailLogRecord[] = [
  { logId: "LOG-5001", recipient: "geeta.s@gmail.com", subject: "Application Submitted - APP-20261001", type: "Transactional", status: "Sent", sentTime: "2 Mins Ago" },
  { logId: "LOG-5002", recipient: "priya.v@gmail.com", subject: "Payment Receipt - TXN-9988", type: "Financial", status: "Sent", sentTime: "5 Mins Ago" },
  { logId: "LOG-5003", recipient: "rohan.s@gmail.com", subject: "Visa Approved Certificate - APP-20260950", type: "Certificate", status: "Sent", sentTime: "12 Mins Ago" }
];

export default function EmailConfigurationManagement() {
  // Config States
  const [smtpProvider, setSmtpProvider] = useState("SendGrid");
  const [smtpHost, setSmtpHost] = useState("smtp.sendgrid.net");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUsername, setSmtpUsername] = useState("apikey");
  const [smtpPassword, setSmtpPassword] = useState("••••••••••••••••");
  const [encryption, setEncryption] = useState("TLS");
  const [testEmailRecipient, setTestEmailRecipient] = useState("test@phantomvisa.com");

  // Sender Profiles
  const [fromName, setFromName] = useState("Phantom Visa Notifications");
  const [fromEmail, setFromEmail] = useState("no-reply@phantomvisa.com");
  const [replyToEmail, setReplyToEmail] = useState("support@phantomvisa.com");
  const [billingEmail, setBillingEmail] = useState("billing@phantomvisa.com");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveSmtp = () => {
    triggerToast("SMTP Server configuration and Sender Profiles saved successfully.");
  };

  const handleSendTestEmail = () => {
    triggerToast(`Dispatched test email to ${testEmailRecipient} (200 OK).`);
  };

  const handleFlushQueue = () => {
    triggerToast("Flushed pending email queue.");
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
            <Mail size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Settings &bull; SMTP & Transactional Email Delivery
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Email Configuration
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Configure SMTP servers, transactional email templates, sender profiles, and email delivery settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSendTestEmail}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-md transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <Send size={15} /> Send Test Email
          </button>
          <button
            onClick={handleSaveSmtp}
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Save size={15} /> Save SMTP Settings
          </button>
        </div>
      </div>

      {/* TOP METRICS DASHBOARD (6 CARDS MATCHING WIREFRAME) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Sent Today</span>
          <div className="text-2xl font-black text-slate-900 font-mono">1,240</div>
          <span className="text-[10px] text-[#2563EB] font-bold">Emails Dispatched</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Delivery Rate</span>
          <div className="text-2xl font-black text-slate-900 font-mono">99.4%</div>
          <span className="text-[10px] text-emerald-600 font-bold">High Deliverability</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Bounced Emails</span>
          <div className="text-2xl font-black text-slate-900 font-mono">8</div>
          <span className="text-[10px] text-red-600 font-bold">Suppressed</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Open Rate</span>
          <div className="text-2xl font-black text-slate-900 font-mono">78.2%</div>
          <span className="text-[10px] text-blue-600 font-bold">User Engagement</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Active Templates</span>
          <div className="text-2xl font-black text-slate-900 font-mono">18</div>
          <span className="text-[10px] text-purple-600 font-bold">Configured Notifications</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">SMTP Gateway</span>
          <div className="text-xl font-black text-slate-900 font-mono">Connected 🟢</div>
          <span className="text-[10px] text-emerald-600 font-bold">SendGrid Active</span>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT 2 COLUMNS: CONFIGURATION FORM & LOGS TABLE */}
        <div className="lg:col-span-2 space-y-6">
          {/* SMTP SERVER FORM */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <Server size={16} className="text-[#2563EB]" /> SMTP Gateway Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">SMTP Provider</label>
                <select
                  value={smtpProvider}
                  onChange={(e) => setSmtpProvider(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                >
                  <option value="SendGrid">SendGrid</option>
                  <option value="Amazon SES">Amazon SES</option>
                  <option value="Mailgun">Mailgun</option>
                  <option value="Custom SMTP">Custom SMTP Server</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">SMTP Host</label>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">SMTP Port</label>
                <input
                  type="text"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Encryption Protocol</label>
                <select
                  value={encryption}
                  onChange={(e) => setEncryption(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                >
                  <option value="TLS">TLS (Port 587)</option>
                  <option value="SSL">SSL (Port 465)</option>
                  <option value="None">None</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">SMTP Username</label>
                <input
                  type="text"
                  value={smtpUsername}
                  onChange={(e) => setSmtpUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">SMTP Password</label>
                <input
                  type="password"
                  value={smtpPassword}
                  onChange={(e) => setSmtpPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>

          {/* SENDER PROFILES */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <Mail size={16} className="text-emerald-600" /> System Sender Identities & Addresses
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Default From Name</label>
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Default From Email</label>
                <input
                  type="email"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Support Reply-To Email</label>
                <input
                  type="email"
                  value={replyToEmail}
                  onChange={(e) => setReplyToEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Billing Email Address</label>
                <input
                  type="email"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>

          {/* EMAIL QUEUE & LOGS TABLE */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock size={16} className="text-[#2563EB]" /> Live Email Queue & Log Stream
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                    <th className="pb-2">Log ID</th>
                    <th className="pb-2">Recipient</th>
                    <th className="pb-2">Subject</th>
                    <th className="pb-2 text-center">Type</th>
                    <th className="pb-2 text-center">Status</th>
                    <th className="pb-2 text-right">Sent Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {MOCK_EMAIL_LOGS.map((log) => (
                    <tr key={log.logId} className="hover:bg-slate-50">
                      <td className="py-2 font-mono font-bold text-slate-900">{log.logId}</td>
                      <td className="py-2 font-mono text-[11px] text-slate-700">{log.recipient}</td>
                      <td className="py-2 font-bold text-slate-900">{log.subject}</td>
                      <td className="py-2 text-center">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                          {log.type}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">🟢 {log.status}</span>
                      </td>
                      <td className="py-2 text-right font-mono text-[11px] text-slate-500">{log.sentTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DOMAIN SECURITY & ACTIONS */}
        <div className="space-y-6">
          {/* DKIM & SPF DOMAIN VERIFICATION CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" /> Domain Authentication (DKIM/SPF)
            </h3>
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between items-center bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                <span>SPF Record:</span>
                <span className="font-bold text-emerald-800">Verified 🟢</span>
              </div>
              <div className="flex justify-between items-center bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                <span>DKIM Status:</span>
                <span className="font-bold text-emerald-800">Verified 🟢</span>
              </div>
              <div className="flex justify-between items-center bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                <span>DMARC Policy:</span>
                <span className="font-bold text-emerald-800">Configured 🟢</span>
              </div>
            </div>
          </div>

          {/* QUICK CONTROL ACTIONS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Zap size={16} className="text-[#2563EB]" /> Email Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleSendTestEmail}
                className="w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Send size={14} /> Dispatch Test Email
              </button>
              <button
                onClick={handleSaveSmtp}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Save size={14} /> Save SMTP Settings
              </button>
              <button
                onClick={handleFlushQueue}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} /> Flush Email Queue
              </button>
            </div>
          </div>

          {/* RECOMMENDATION BOX */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
              <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Recommendation
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              The Email Configuration page manages SMTP integration, sender identities, email delivery queues, DKIM/SPF domain authentication, transactional template triggers, and live email delivery logs. Ensure SMTP credentials and DKIM records are verified to maintain high email deliverability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
