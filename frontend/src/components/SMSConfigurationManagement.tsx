import React, { useState } from "react";
import {
  Smartphone,
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
  CreditCard,
  Building
} from "lucide-react";

export interface SMSLogRecord {
  smsId: string;
  recipient: string;
  templateName: string;
  dltId: string;
  status: "Delivered" | "Failed" | "Queued";
  sentTime: string;
}

export const SMS_WORKFLOW = [
  "SMS Provider Selected",
  "API Keys & Auth Token Entered",
  "DLT Entity & Header ID Configured",
  "Connection Test Executed",
  "DLT Templates Approved",
  "Automated SMS Trigger Active"
];

export const SMS_FEATURES = [
  "Multi-gateway SMS Integration",
  "TRAI DLT Compliance Enforcement",
  "Dynamic Template Variables",
  "Real-time Delivery Callbacks",
  "Automated Credit Balance Warning",
  "Low Balance Alerts",
  "Country Code Formatting",
  "Failed SMS Retries",
  "Instant OTP Dispatch Engine",
  "Detailed Delivery Logging"
];

const MOCK_SMS_LOGS: SMSLogRecord[] = [
  { smsId: "SMS-9001", recipient: "+91 98765 11111", templateName: "OTP Authentication", dltId: "1407...210", status: "Delivered", sentTime: "1 Min Ago" },
  { smsId: "SMS-9002", recipient: "+91 98765 22222", templateName: "Application Submission", dltId: "1407...211", status: "Delivered", sentTime: "4 Mins Ago" },
  { smsId: "SMS-9003", recipient: "+91 98765 33333", templateName: "Appointment Reminder", dltId: "1407...213", status: "Failed", sentTime: "10 Mins Ago" }
];

export default function SMSConfigurationManagement() {
  // Config States
  const [smsProvider, setSmsProvider] = useState("Twilio");
  const [accountSid, setAccountSid] = useState("AC9876543210fedcba");
  const [authToken, setAuthToken] = useState("••••••••••••••••");
  const [senderId, setSenderId] = useState("PHTMVS");
  const [entityId, setEntityId] = useState("1201159876543210");
  const [headerId, setHeaderId] = useState("1302159876543210");
  const [testPhoneNumber, setTestPhoneNumber] = useState("+91 98765 43210");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveSms = () => {
    triggerToast("SMS Gateway credentials & DLT IDs saved successfully.");
  };

  const handleSendTestSms = () => {
    triggerToast(`Dispatched test SMS to ${testPhoneNumber} (200 OK).`);
  };

  const handleCheckBalance = () => {
    triggerToast("SMS Credit Balance: ₹18,450.00 (Sufficient).");
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
            <Smartphone size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Settings &bull; SMS Gateway & DLT Compliance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            SMS Configuration
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Configure SMS gateways, Twilio / MSG91 API keys, DLT registrations, sender IDs, and SMS templates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSendTestSms}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-md transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <Send size={15} /> Send Test SMS
          </button>
          <button
            onClick={handleSaveSms}
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Save size={15} /> Save SMS Settings
          </button>
        </div>
      </div>

      {/* TOP METRICS DASHBOARD (6 CARDS MATCHING WIREFRAME) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">SMS Sent Today</span>
          <div className="text-2xl font-black text-slate-900 font-mono">2,840</div>
          <span className="text-[10px] text-[#2563EB] font-bold">Dispatched SMS</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Delivery Rate</span>
          <div className="text-2xl font-black text-slate-900 font-mono">98.9%</div>
          <span className="text-[10px] text-emerald-600 font-bold">High Deliverability</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-1">Failed SMS</span>
          <div className="text-2xl font-black text-slate-900 font-mono">32</div>
          <span className="text-[10px] text-red-600 font-bold">Undelivered</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Active Templates</span>
          <div className="text-2xl font-black text-slate-900 font-mono">12</div>
          <span className="text-[10px] text-purple-600 font-bold">DLT Approved</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">Credit Balance</span>
          <div className="text-xl font-black text-slate-900 font-mono">₹18,450</div>
          <span className="text-[10px] text-blue-600 font-bold">Sufficient Credit</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">SMS Gateway</span>
          <div className="text-xl font-black text-slate-900 font-mono">Connected 🟢</div>
          <span className="text-[10px] text-emerald-600 font-bold">Twilio Active</span>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT 2 COLUMNS: CONFIGURATION FORM & LOGS TABLE */}
        <div className="lg:col-span-2 space-y-6">
          {/* GATEWAY FORM */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <Smartphone size={16} className="text-[#2563EB]" /> SMS Gateway Provider & DLT Identifiers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">SMS Provider</label>
                <select
                  value={smsProvider}
                  onChange={(e) => setSmsProvider(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                >
                  <option value="Twilio">Twilio</option>
                  <option value="MSG91">MSG91</option>
                  <option value="Fast2SMS">Fast2SMS</option>
                  <option value="Textlocal">Textlocal</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Account SID / Key ID</label>
                <input
                  type="text"
                  value={accountSid}
                  onChange={(e) => setAccountSid(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Auth Token / Secret</label>
                <input
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Approved DLT Sender ID</label>
                <input
                  type="text"
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">DLT Entity ID</label>
                <input
                  type="text"
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">DLT Header ID</label>
                <input
                  type="text"
                  value={headerId}
                  onChange={(e) => setHeaderId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>

          {/* SMS LOGS TABLE */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock size={16} className="text-[#2563EB]" /> Live SMS Delivery Logs
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                    <th className="pb-2">SMS ID</th>
                    <th className="pb-2">Recipient</th>
                    <th className="pb-2">Template</th>
                    <th className="pb-2 text-center">DLT ID</th>
                    <th className="pb-2 text-center">Status</th>
                    <th className="pb-2 text-right">Sent Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {MOCK_SMS_LOGS.map((log) => (
                    <tr key={log.smsId} className="hover:bg-slate-50">
                      <td className="py-2 font-mono font-bold text-slate-900">{log.smsId}</td>
                      <td className="py-2 font-mono text-[11px] text-slate-700">{log.recipient}</td>
                      <td className="py-2 font-bold text-slate-900">{log.templateName}</td>
                      <td className="py-2 text-center font-mono text-[10px] text-slate-500">{log.dltId}</td>
                      <td className="py-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === "Delivered" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                        }`}>
                          {log.status === "Delivered" ? "🟢 Delivered" : "🔴 Failed"}
                        </span>
                      </td>
                      <td className="py-2 text-right font-mono text-[11px] text-slate-500">{log.sentTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DLT STATUS & ACTIONS */}
        <div className="space-y-6">
          {/* TRAI DLT COMPLIANCE STATUS CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" /> DLT Compliance Verification
            </h3>
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between items-center bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                <span>DLT Entity Reg:</span>
                <span className="font-bold text-emerald-800">Verified 🟢</span>
              </div>
              <div className="flex justify-between items-center bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                <span>Sender ID Status:</span>
                <span className="font-bold text-emerald-800">Active 🟢</span>
              </div>
              <div className="flex justify-between items-center bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                <span>DLT Templates:</span>
                <span className="font-bold text-emerald-800">12 Approved 🟢</span>
              </div>
            </div>
          </div>

          {/* QUICK CONTROL ACTIONS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Zap size={16} className="text-[#2563EB]" /> SMS Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleSendTestSms}
                className="w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Send size={14} /> Dispatch Test SMS
              </button>
              <button
                onClick={handleSaveSms}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Save size={14} /> Save SMS Settings
              </button>
              <button
                onClick={handleCheckBalance}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <CreditCard size={14} /> Check Credit Balance
              </button>
            </div>
          </div>

          {/* RECOMMENDATION BOX */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
              <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Recommendation
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              The SMS Configuration page manages SMS gateway providers (Twilio, MSG91, Fast2SMS), DLT registration headers, approved templates, TRAI compliance, sender IDs, credit balance monitoring, and real-time delivery logs. Ensure DLT Entity and Header IDs are accurately configured for Indian telecom compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
