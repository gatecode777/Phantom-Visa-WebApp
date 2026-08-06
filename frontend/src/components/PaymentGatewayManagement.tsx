import React, { useState } from "react";
import {
  CreditCard,
  Key,
  Lock,
  Globe,
  DollarSign,
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
  ShieldCheck,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Upload,
  Download,
  Printer,
  Copy,
  Layers,
  Sparkles,
  Smartphone,
  Building,
  Server
} from "lucide-react";

export interface GatewayRecord {
  name: string;
  status: "Active" | "Inactive" | "Sandbox";
  environment: "Live Mode" | "Test Mode";
  volume24h: string;
  successRate: string;
  lastSync: string;
}

export const GATEWAY_WORKFLOW = [
  "Gateway Selected",
  "API Credentials Entered",
  "Webhook Endpoint Set",
  "Connection Test Executed",
  "Payment Methods Enabled",
  "Settings Saved to Database"
];

export const GATEWAY_FEATURES = [
  "Multi-gateway Support",
  "Live vs Sandbox Modes",
  "Encrypted API Keys",
  "Automatic Webhook Listener",
  "Multi-currency Routing",
  "Custom Fee Passing",
  "Real-time Success Metrics",
  "Automated Refund Triggers",
  "Audit Trail Log",
  "Failover Gateway Routing"
];

const MOCK_GATEWAY_TABLE: GatewayRecord[] = [
  { name: "Razorpay", status: "Active", environment: "Live Mode", volume24h: "₹5.20 L (64% Share)", successRate: "98.6%", lastSync: "2 Mins Ago" },
  { name: "Stripe", status: "Active", environment: "Live Mode", volume24h: "₹2.10 L (25% Share)", successRate: "97.4%", lastSync: "5 Mins Ago" },
  { name: "Paytm / UPI", status: "Active", environment: "Live Mode", volume24h: "₹1.15 L (11% Share)", successRate: "99.1%", lastSync: "1 Min Ago" },
  { name: "Bank Wire (Manual)", status: "Active", environment: "Live Mode", volume24h: "₹50,000 (1% Share)", successRate: "100%", lastSync: "10 Mins Ago" }
];

export default function PaymentGatewayManagement() {
  // Config States
  const [selectedGateway, setSelectedGateway] = useState("Razorpay");
  const [envMode, setEnvMode] = useState("Live Mode");
  const [razorpayKeyId, setRazorpayKeyId] = useState("rzp_live_9876543210");
  const [razorpaySecret, setRazorpaySecret] = useState("••••••••••••••••");
  const [webhookUrl, setWebhookUrl] = useState("https://phantomvisa.com/api/v1/payments/webhook");
  const [autoCapture, setAutoCapture] = useState(true);
  const [passFeeToCustomer, setPassFeeToCustomer] = useState(false);
  const [convenienceFeePct, setConvenienceFeePct] = useState("1.5%");
  const [fixedServiceCharge, setFixedServiceCharge] = useState("₹50");

  // Payment Toggles
  const [enableCards, setEnableCards] = useState(true);
  const [enableUPI, setEnableUPI] = useState(true);
  const [enableNetbanking, setEnableNetbanking] = useState(true);
  const [enableWallets, setEnableWallets] = useState(true);
  const [enableInternational, setEnableInternational] = useState(true);

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveGateway = () => {
    triggerToast("Payment Gateway credentials & configuration saved securely.");
  };

  const handleTestConnection = () => {
    triggerToast(`Testing API Connection for ${selectedGateway}... SUCCESS 200 OK.`);
  };

  const handleRotateWebhook = () => {
    triggerToast("Rotated Webhook Secret. New signing key generated.");
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
            <CreditCard size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Settings &bull; Payment Processors & API Integrations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Payment Gateway Settings
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Configure payment gateways, API credentials, currency settings, transaction fees, and checkout options.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestConnection}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-md transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <Zap size={15} /> Test Connection
          </button>
          <button
            onClick={handleSaveGateway}
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Save size={15} /> Save Gateway Settings
          </button>
        </div>
      </div>

      {/* TOP METRICS DASHBOARD (6 CARDS MATCHING WIREFRAME) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Active Gateways</span>
          <div className="text-2xl font-black text-slate-900 font-mono">4</div>
          <span className="text-[10px] text-[#2563EB] font-bold">Processors Online</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Default Gateway</span>
          <div className="text-xl font-black text-slate-900 font-mono">Razorpay</div>
          <span className="text-[10px] text-emerald-600 font-bold">Primary Processor</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">24h Volume</span>
          <div className="text-2xl font-black text-slate-900 font-mono">₹8.45 L</div>
          <span className="text-[10px] text-blue-600 font-bold">Processed Revenue</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">Success Rate</span>
          <div className="text-2xl font-black text-slate-900 font-mono">98.2%</div>
          <span className="text-[10px] text-teal-600 font-bold">API Reliability</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Active Currencies</span>
          <div className="text-xl font-black text-slate-900 font-mono">4 Types</div>
          <span className="text-[10px] text-purple-600 font-bold">INR, USD, EUR, GBP</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-indigo-600 block mb-1">Auto Refund</span>
          <div className="text-xl font-black text-slate-900 font-mono">Enabled</div>
          <span className="text-[10px] text-indigo-600 font-bold">Instant Payouts</span>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT 2 COLUMNS: CONFIGURATION FORM & GATEWAYS TABLE */}
        <div className="lg:col-span-2 space-y-6">
          {/* API CREDENTIALS FORM */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                <Key size={16} className="text-[#2563EB]" /> Gateway API Credentials & Webhook Setup
              </h3>
              <select
                value={selectedGateway}
                onChange={(e) => setSelectedGateway(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-1.5 rounded-xl font-bold"
              >
                <option value="Razorpay">Razorpay</option>
                <option value="Stripe">Stripe</option>
                <option value="Paytm / UPI">Paytm / UPI</option>
                <option value="Bank Wire">Bank Wire</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Environment Mode</label>
                <select
                  value={envMode}
                  onChange={(e) => setEnvMode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold text-emerald-700"
                >
                  <option value="Live Mode">Live Production Mode</option>
                  <option value="Test Mode">Sandbox / Test Mode</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Public API Key / Merchant ID</label>
                <input
                  type="text"
                  value={razorpayKeyId}
                  onChange={(e) => setRazorpayKeyId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Secret API Key</label>
                <input
                  type="password"
                  value={razorpaySecret}
                  onChange={(e) => setRazorpaySecret(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Webhook Endpoint URL</label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* CONFIGURED PAYMENT GATEWAYS STATUS TABLE */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <CreditCard size={16} className="text-[#2563EB]" /> Configured Payment Processors
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                    <th className="pb-2">Gateway</th>
                    <th className="pb-2 text-center">Status</th>
                    <th className="pb-2 text-center">Mode</th>
                    <th className="pb-2 text-center">24h Volume</th>
                    <th className="pb-2 text-center">Success Rate</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {MOCK_GATEWAY_TABLE.map((gw, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                        <CreditCard size={14} className="text-[#2563EB]" />
                        <span>{gw.name}</span>
                      </td>
                      <td className="py-2.5 text-center">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">🟢 {gw.status}</span>
                      </td>
                      <td className="py-2.5 text-center font-mono text-[11px] text-slate-600">{gw.environment}</td>
                      <td className="py-2.5 text-center font-mono font-bold text-slate-900">{gw.volume24h}</td>
                      <td className="py-2.5 text-center font-mono font-bold text-emerald-700">{gw.successRate}</td>
                      <td className="py-2.5 text-right space-x-1">
                        <button
                          onClick={() => triggerToast(`Configuring ${gw.name}`)}
                          className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#2563EB] rounded-lg transition"
                        >
                          <Edit3 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PAYMENT METHODS TOGGLES & ACTIONS */}
        <div className="space-y-6">
          {/* PAYMENT METHODS TOGGLES */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Smartphone size={16} className="text-emerald-600" /> Supported Payment Methods
            </h3>
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                <span>Credit / Debit Cards:</span>
                <input
                  type="checkbox"
                  checked={enableCards}
                  onChange={(e) => setEnableCards(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded"
                />
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                <span>UPI Apps (GPay, PhonePe):</span>
                <input
                  type="checkbox"
                  checked={enableUPI}
                  onChange={(e) => setEnableUPI(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded"
                />
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                <span>Netbanking (All Major Banks):</span>
                <input
                  type="checkbox"
                  checked={enableNetbanking}
                  onChange={(e) => setEnableNetbanking(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded"
                />
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                <span>Wallets (Amazon Pay, Mobikwik):</span>
                <input
                  type="checkbox"
                  checked={enableWallets}
                  onChange={(e) => setEnableWallets(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded"
                />
              </div>
            </div>
          </div>

          {/* QUICK CONTROL ACTIONS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <Zap size={16} className="text-[#2563EB]" /> Gateway Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleSaveGateway}
                className="w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Save size={14} /> Save Gateway Settings
              </button>
              <button
                onClick={handleTestConnection}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap size={14} /> Test API Connection
              </button>
              <button
                onClick={handleRotateWebhook}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Key size={14} /> Rotate Webhook Secret
              </button>
            </div>
          </div>

          {/* RECOMMENDATION BOX */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
              <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Recommendation
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              The Payment Gateway Settings page allows administrators to manage active payment processors (Razorpay, Stripe, Paytm, UPI, Bank Wire). Configure API keys, webhook signatures, transaction fee rules, checkout methods, multi-currency support, and test API connectivity before going live.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
