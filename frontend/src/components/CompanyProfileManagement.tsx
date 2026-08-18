import React, { useState, useEffect } from "react";
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
  Award,
  Info
} from "lucide-react";
import { fetchCompanyProfile, updateCompanyProfile } from "../services/systemService";

export const COMPANY_PROFILE_WORKFLOW = [
  "Admin Edits Company Profile",
  "Legal Documents Verified",
  "GST & PAN Validation Checked",
  "Changes Saved to Configuration Store",
  "Invoice Generator Syncs Records",
  "Official Corporate Kit Generated"
];

export const COMPANY_PROFILE_FEATURES = [
  "Corporate Identity Control",
  "Legal Registration Tracking",
  "Tax Identification (GSTIN / PAN / CIN)",
  "Registered Office Mapping",
  "Official Representative Profile",
  "Verified Bank Details",
  "Single Source of Truth for Invoices",
  "Exportable Corporate Kit"
];

const DEFAULT_COMPANY_PROFILE = {
  companyName: "Phantom Visa Private Limited",
  tradeName: "Phantom Visa",
  businessType: "Private Limited",
  regDate: "15/01/2020",
  tagline: "Your Trusted Passport & Visa Partner",
  description: "Leading tech-enabled visa processing platform providing seamless international visa processing, agent management, and embassy appointment coordination.",
  streetAddress: "101 Visa Tower, Cyber City, Phase 2",
  buildingSuite: "Tower A, 5th Floor",
  city: "Gurugram",
  state: "Haryana",
  postalCode: "122002",
  country: "India",
  officialEmail: "contact@phantomvisa.com",
  supportEmail: "support@phantomvisa.com",
  tollFree: "1800-123-4567",
  directPhone: "+91 124 456 7890",
  whatsappPhone: "+91 98765 43210",
  cinNumber: "U74999HR2020PTC084512",
  gstinNumber: "06AABCP1234H1Z5",
  panNumber: "AABCP1234H",
  tanNumber: "DELP12345F",
  msmeNumber: "UDYAM-HR-05-0012345",
  iecCode: "0512345678",
  officerName: "Rahul Sharma",
  designation: "Managing Director & CEO",
  officerEmail: "rahul.sharma@phantomvisa.com",
  officerPhone: "+91 98765 00000",
  dinNumber: "087654321",
  bankName: "HDFC Bank",
  accountName: "PHANTOM VISA PRIVATE LIMITED",
  accountNumber: "50200012345678",
  ifscCode: "HDFC0000123"
};

export default function CompanyProfileManagement() {
  // Load initial state from localStorage if available
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("phantom_company_profile");
      if (saved) {
        return { ...DEFAULT_COMPANY_PROFILE, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_COMPANY_PROFILE;
  });

  // Fetch company profile from MongoDB on mount
  useEffect(() => {
    const loadProfile = async () => {
      const data = await fetchCompanyProfile();
      if (data) {
        setProfile((prev: any) => ({ ...prev, ...data }));
      }
    };
    loadProfile();
  }, []);

  const updateField = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Save to MongoDB & localStorage as single source of truth for Invoices and Billing
  const handleSaveProfile = async () => {
    try {
      localStorage.setItem("phantom_company_profile", JSON.stringify(profile));
      window.dispatchEvent(new Event("phantom_company_profile_updated"));
      await updateCompanyProfile(profile);
      triggerToast("Company Profile & Legal Tax Records saved to database. Invoice generator synced.");
    } catch (e) {
      triggerToast("Error saving company profile to database.");
    }
  };

  // Real download of corporate identity file
  const handleDownloadKit = () => {
    const kitText = `=====================================================
PHANTOM VISA OS - OFFICIAL CORPORATE IDENTITY KIT
=====================================================
Generated: ${new Date().toLocaleString()}

1. COMPANY REGISTRATION
Company Legal Name: ${profile.companyName}
Trade / Brand Name: ${profile.tradeName}
Business Entity: ${profile.businessType}
Registration Date: ${profile.regDate}
Corporate Identification (CIN): ${profile.cinNumber}

2. TAX & COMPLIANCE IDENTIFIERS (GST INVOICING)
GSTIN Number: ${profile.gstinNumber}
Permanent Account Number (PAN): ${profile.panNumber}
Tax Deduction Account (TAN): ${profile.tanNumber}
MSME / Udyam Reg: ${profile.msmeNumber}
Import Export Code (IEC): ${profile.iecCode}

3. REGISTERED STATUTORY OFFICE
Address: ${profile.streetAddress}, ${profile.buildingSuite}
City/State/Postal: ${profile.city}, ${profile.state} - ${profile.postalCode}, ${profile.country}

4. STATUTORY EXECUTIVE OFFICER (MCA RECORDS)
Name: ${profile.officerName}
Designation: ${profile.designation}
Director Identification (DIN): ${profile.dinNumber}
Official Email: ${profile.officerEmail}
Contact Phone: ${profile.officerPhone}

5. PRIMARY SETTLEMENT BANK ACCOUNT
Bank Name: ${profile.bankName}
Beneficiary Name: ${profile.accountName}
Account Number: ${profile.accountNumber}
IFSC Code: ${profile.ifscCode}

6. OFFICIAL CONTACT DESK
Official Email: ${profile.officialEmail}
Support Email: ${profile.supportEmail}
Direct Contact: ${profile.directPhone}
=====================================================`;

    const blob = new Blob([kitText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Phantom_Visa_Corporate_Profile_${profile.cinNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerToast("Corporate Identity Kit downloaded successfully.");
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 font-sans min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
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
            Single source of truth for company legal identity, registered office, statutory officer, and GST tax invoice generation.
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

      {/* INVOICE SOURCE OF TRUTH ALERT BANNER (BUG 7) */}
      <div className="mb-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start gap-3 text-xs text-indigo-900 shadow-2xs">
        <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
          <FileText size={16} />
        </div>
        <div className="space-y-1">
          <strong className="font-bold text-indigo-950 block text-xs">
            Tax & Legal Invoice Single Source of Truth
          </strong>
          <p className="text-indigo-800 text-[11px] leading-relaxed">
            The GSTIN (<strong>{profile.gstinNumber}</strong>), PAN (<strong>{profile.panNumber}</strong>), registered corporate name, and office address configured here are directly propagated to all GST Tax Invoices and Agent B2B billing records generated by the Payments module.
          </p>
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
                  value={profile.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Trade / Brand Name</label>
                <input
                  type="text"
                  value={profile.tradeName}
                  onChange={(e) => updateField("tradeName", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Business Type</label>
                <select
                  value={profile.businessType}
                  onChange={(e) => updateField("businessType", e.target.value)}
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
                  value={profile.regDate}
                  onChange={(e) => updateField("regDate", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Corporate Tagline</label>
                <input
                  type="text"
                  value={profile.tagline}
                  onChange={(e) => updateField("tagline", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Company Summary Description</label>
                <textarea
                  rows={3}
                  value={profile.description}
                  onChange={(e) => updateField("description", e.target.value)}
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
                  value={profile.streetAddress}
                  onChange={(e) => updateField("streetAddress", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Building / Suite</label>
                <input
                  type="text"
                  value={profile.buildingSuite}
                  onChange={(e) => updateField("buildingSuite", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">City</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">State / Province</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Postal Code</label>
                <input
                  type="text"
                  value={profile.postalCode}
                  onChange={(e) => updateField("postalCode", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>

          {/* LEGAL & TAX IDENTIFICATION (PROPAGATED TO INVOICES) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText size={16} className="text-purple-600" /> Legal & Tax Identifiers (Used in Tax Invoices)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1 font-sans">Corporate ID (CIN)</label>
                <input
                  type="text"
                  value={profile.cinNumber}
                  onChange={(e) => updateField("cinNumber", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3 py-2 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1 font-sans">GSTIN Number (Tax Invoices)</label>
                <input
                  type="text"
                  value={profile.gstinNumber}
                  onChange={(e) => updateField("gstinNumber", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3 py-2 rounded-xl font-bold text-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1 font-sans">PAN Number</label>
                <input
                  type="text"
                  value={profile.panNumber}
                  onChange={(e) => updateField("panNumber", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3 py-2 rounded-xl font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: OFFICER & CORPORATE STATS */}
        <div className="space-y-6">
          {/* PRIMARY STATUTORY OFFICER CARD (DISAMBIGUATED - BUG 1) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <User size={16} className="text-[#2563EB]" /> Primary Statutory Director (MCA Records)
            </h3>
            <div className="space-y-2 text-xs font-semibold">
              <div className="bg-slate-50 p-2.5 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Director Name & Designation</span>
                <input
                  type="text"
                  value={profile.officerName}
                  onChange={(e) => updateField("officerName", e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 text-xs px-2.5 py-1.5 rounded-lg font-bold"
                />
                <input
                  type="text"
                  value={profile.designation}
                  onChange={(e) => updateField("designation", e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg font-medium"
                />
                <span className="text-[10px] text-slate-400 block pt-1">
                  Registered statutory director. Distinct from customer applicants and support staff.
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Official Executive Email</span>
                <input
                  type="email"
                  value={profile.officerEmail}
                  onChange={(e) => updateField("officerEmail", e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 text-xs px-2.5 py-1.5 rounded-lg font-mono"
                />
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Director Identification Number (DIN)</span>
                <input
                  type="text"
                  value={profile.dinNumber}
                  onChange={(e) => updateField("dinNumber", e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 text-xs px-2.5 py-1.5 rounded-lg font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* BANK ACCOUNT DETAILS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
              <CreditCard size={16} className="text-emerald-600" /> Primary Settlement Bank
            </h3>
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between items-center bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                <span>Bank Name:</span>
                <span className="font-bold text-emerald-800">{profile.bankName}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                <span>Account Number:</span>
                <span className="font-mono text-slate-900 font-bold">{profile.accountNumber}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                <span>IFSC Code:</span>
                <span className="font-mono text-slate-900 font-bold">{profile.ifscCode}</span>
              </div>
            </div>
          </div>

          {/* RECOMMENDATION BOX */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
              <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Recommendation
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Updating your GSTIN, registered name, or office address here immediately updates all future GST invoices and corporate documents across the platform without requiring code modifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
