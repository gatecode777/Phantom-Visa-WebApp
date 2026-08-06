import React, { useState } from "react";
import {
  Building,
  MapPin,
  Mail,
  Phone,
  Globe,
  FileText,
  ShieldCheck,
  Save,
  RotateCcw,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Upload,
  User,
  CreditCard,
  Briefcase,
  Share2,
  Paperclip,
  Check,
  Sparkles,
  ExternalLink,
  Award
} from "lucide-react";

export const COMPANY_PROFILE_WORKFLOW = [
  "Admin Edits Company Profile",
  "Legal Documents Verified",
  "GST & PAN Validation Checked",
  "Changes Saved to DB",
  "Corporate Record Updated",
  "Official Kit Generated"
];

export const COMPANY_PROFILE_FEATURES = [
  "Corporate Identity Control",
  "Legal Registration Tracking",
  "Tax Identification Records",
  "Registered Office Mapping",
  "Official Representative Profile",
  "Verified Bank Details",
  "Corporate Document Repository",
  "Multi-channel Social Handles",
  "Verified Compliance Badge",
  "Exportable Corporate Profile"
];

export default function CompanyProfileManagement() {
  // Basic Info
  const [companyName, setCompanyName] = useState("Phantom Visa Private Limited");
  const [tradeName, setTradeName] = useState("Phantom Visa");
  const [businessType, setBusinessType] = useState("Private Limited");
  const [regDate, setRegDate] = useState("15/01/2020");
  const [tagline, setTagline] = useState("Your Trusted Passport & Visa Partner");
  const [description, setDescription] = useState("Leading tech-enabled visa processing platform providing seamless international visa processing, agent management, and embassy appointment coordination.");

  // Address
  const [streetAddress, setStreetAddress] = useState("101 Visa Tower, Cyber City, Phase 2");
  const [buildingSuite, setBuildingSuite] = useState("Tower A, 5th Floor");
  const [city, setCity] = useState("Gurugram");
  const [state, setState] = useState("Haryana");
  const [postalCode, setPostalCode] = useState("122002");
  const [country, setCountry] = useState("India");

  // Contact Info
  const [officialEmail, setOfficialEmail] = useState("contact@phantomvisa.com");
  const [supportEmail, setSupportEmail] = useState("support@phantomvisa.com");
  const [tollFree, setTollFree] = useState("1800-123-4567");
  const [directPhone, setDirectPhone] = useState("+91 124 456 7890");
  const [whatsappPhone, setWhatsappPhone] = useState("+91 98765 43210");

  // Legal & Tax
  const [cinNumber, setCinNumber] = useState("U74999HR2020PTC084512");
  const [gstinNumber, setGstinNumber] = useState("06AABCP1234H1Z5");
  const [panNumber, setPanNumber] = useState("AABCP1234H");
  const [tanNumber, setTanNumber] = useState("DELP12345F");
  const [msmeNumber, setMsmeNumber] = useState("UDYAM-HR-05-0012345");
  const [iecCode, setIecCode] = useState("0512345678");

  // Officer Profile
  const [officerName, setOfficerName] = useState("Rahul Sharma");
  const [designation, setDesignation] = useState("Managing Director & CEO");
  const [officerEmail, setOfficerEmail] = useState("rahul.sharma@phantomvisa.com");
  const [officerPhone, setOfficerPhone] = useState("+91 98765 00000");
  const [dinNumber, setDinNumber] = useState("087654321");

  // Bank Info
  const [bankName, setBankName] = useState("HDFC Bank");
  const [accountName, setAccountName] = useState("PHANTOM VISA PRIVATE LIMITED");
  const [accountNumber, setAccountNumber] = useState("50200012345678");
  const [ifscCode, setIfscCode] = useState("HDFC0000123");

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveProfile = () => {
    triggerToast("Company Profile and Legal Tax Records updated successfully.");
  };

  const handleDownloadKit = () => {
    triggerToast("Downloading official corporate identity kit (PDF).");
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
            <Building size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Settings &bull; Corporate Entity & Legal Registration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Company Profile
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Manage official company details, legal information, contact records, tax numbers, and corporate identity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadKit}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-md transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <Download size={15} /> Download Corporate Kit
          </button>
          <button
            onClick={handleSaveProfile}
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT 2 COLUMNS: FORM PANELS */}
        <div className="lg:col-span-2 space-y-6">
          {/* BASIC COMPANY INFORMATION */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building size={16} className="text-[#2563EB]" /> Basic Company Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Company Registered Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Trade / Brand Name</label>
                <input
                  type="text"
                  value={tradeName}
                  onChange={(e) => setTradeName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Business Type</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-medium"
                >
                  <option value="Private Limited">Private Limited (Pvt Ltd)</option>
                  <option value="Public Limited">Public Limited</option>
                  <option value="Partnership">Partnership Firm</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Registration Date</label>
                <input
                  type="text"
                  value={regDate}
                  onChange={(e) => setRegDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Corporate Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Company Summary Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs p-3 rounded-xl focus:outline-none focus:border-[#2563EB] font-medium"
                />
              </div>
            </div>
          </div>

          {/* REGISTERED OFFICE ADDRESS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin size={16} className="text-emerald-600" /> Registered Office Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Building / Suite</label>
                <input
                  type="text"
                  value={buildingSuite}
                  onChange={(e) => setBuildingSuite(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">State / Province</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>

          {/* LEGAL & TAX IDENTIFICATION */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText size={16} className="text-purple-600" /> Legal & Tax Identifiers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1 font-sans">Corporate ID (CIN)</label>
                <input
                  type="text"
                  value={cinNumber}
                  onChange={(e) => setCinNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3 py-2 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1 font-sans">GSTIN Number</label>
                <input
                  type="text"
                  value={gstinNumber}
                  onChange={(e) => setGstinNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3 py-2 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1 font-sans">PAN Number</label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3 py-2 rounded-xl font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: OFFICER & CORPORATE STATS */}
        <div className="space-y-6">
          {/* PRIMARY OFFICER CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <User size={16} className="text-[#2563EB]" /> Primary Officer / Director
            </h3>
            <div className="space-y-2 text-xs font-semibold">
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Managing Director & CEO</span>
                <strong className="text-slate-900 font-bold">{officerName}</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Official Email</span>
                <span className="text-slate-800 font-mono text-[11px]">{officerEmail}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Director Identification (DIN)</span>
                <span className="text-slate-800 font-mono text-[11px] font-bold">{dinNumber}</span>
              </div>
            </div>
          </div>

          {/* BANK ACCOUNT DETAILS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <CreditCard size={16} className="text-emerald-600" /> Primary Settlement Bank
            </h3>
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between items-center bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                <span>Bank Name:</span>
                <span className="font-bold text-emerald-800">{bankName}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                <span>Account Number:</span>
                <span className="font-mono text-slate-900 font-bold">{accountNumber}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                <span>IFSC Code:</span>
                <span className="font-mono text-slate-900 font-bold">{ifscCode}</span>
              </div>
            </div>
          </div>

          {/* RECOMMENDATION BOX */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
              <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Recommendation
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              The Company Profile page manages official corporate details, legal registrations, GST/PAN numbers, registered office addresses, representative contacts, bank accounts, and compliance documents. Ensure all legal records are kept up to date for embassy and financial audits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
