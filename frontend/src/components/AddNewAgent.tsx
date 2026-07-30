import React, { useState } from "react";
import {
  UserPlus,
  User,
  Building,
  Briefcase,
  ShieldCheck,
  CreditCard,
  Lock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Upload,
  RefreshCw,
  Save,
  ArrowRight,
  X,
  FileText,
  Mail,
  Phone,
  Calendar,
  Globe,
  MapPin,
  HelpCircle,
  Sparkles,
  Info
} from "lucide-react";

export default function AddNewAgent() {
  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    firstName: "",
    lastName: "",
    dob: "",
    gender: "Male",
    nationality: "Indian",
    email: "",
    phone: "",
    altPhone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",

    // Step 2: Agency Information
    agencyName: "",
    agencyRegNo: "",
    businessLicense: "",
    gstTaxNo: "",
    officeAddress: "",
    officeCity: "",
    officeState: "",
    officeCountry: "India",
    officePostalCode: "",
    website: "",
    yearsInBusiness: "3",

    // Step 3: Business Details
    agencyTypes: ["Travel Agency"],
    employeeCount: "10-50",
    monthlyCapacity: "100",
    officePhone: "",

    // Step 4: KYC Verification (Files simulated)
    kycFiles: {
      businessReg: null as string | null,
      govtId: null as string | null,
      addressProof: null as string | null,
      taxCert: null as string | null,
      verificationDocs: null as string | null,
      agencyLogo: null as string | null
    },

    // Step 5: Bank Details
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscSwiftCode: "",
    branchName: "",

    // Step 6: Permissions
    permissions: {
      viewApps: true,
      processApps: true,
      approveDocs: true,
      rejectApps: false,
      managePayments: true,
      bookAppointments: true,
      viewReports: true,
      manageSubAgents: false,
      manageMessages: true
    },

    // Step 7: Commission Details
    commissionType: "Percentage",
    commissionValue: "15",
    paymentMethod: "Bank Transfer (NEFT/RTGS)",
    paymentFrequency: "Monthly",

    // Step 8: Account Status
    accountStatus: "Pending Approval",

    // Step 9: Notes
    adminNotes: ""
  });

  // UI Feedback States
  const [isSuccess, setIsSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxToggle = (category: "agencyTypes" | "permissions", item: string) => {
    if (category === "agencyTypes") {
      setFormData((prev) => {
        const exists = prev.agencyTypes.includes(item);
        return {
          ...prev,
          agencyTypes: exists
            ? prev.agencyTypes.filter((i) => i !== item)
            : [...prev.agencyTypes, item]
        };
      });
    } else if (category === "permissions") {
      setFormData((prev) => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [item]: !prev.permissions[item as keyof typeof prev.permissions]
        }
      }));
    }
  };

  const handleFileUpload = (docKey: string, fileName: string) => {
    setFormData((prev) => ({
      ...prev,
      kycFiles: {
        ...prev.kycFiles,
        [docKey]: fileName
      }
    }));
    triggerToast(`File attached: ${fileName}`);
  };

  const handleSave = (andContinue = false) => {
    // Validation check
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.agencyName) {
      triggerToast("Please fill in all mandatory fields marked with (*)");
      return;
    }

    setIsSuccess(true);
    triggerToast("Agent account registered successfully!");

    if (andContinue) {
      setTimeout(() => {
        setIsSuccess(false);
        handleReset();
      }, 2500);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      dob: "",
      gender: "Male",
      nationality: "Indian",
      email: "",
      phone: "",
      altPhone: "",
      password: "",
      confirmPassword: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",
      agencyName: "",
      agencyRegNo: "",
      businessLicense: "",
      gstTaxNo: "",
      officeAddress: "",
      officeCity: "",
      officeState: "",
      officeCountry: "India",
      officePostalCode: "",
      website: "",
      yearsInBusiness: "3",
      agencyTypes: ["Travel Agency"],
      employeeCount: "10-50",
      monthlyCapacity: "100",
      officePhone: "",
      kycFiles: {
        businessReg: null,
        govtId: null,
        addressProof: null,
        taxCert: null,
        verificationDocs: null,
        agencyLogo: null
      },
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifscSwiftCode: "",
      branchName: "",
      permissions: {
        viewApps: true,
        processApps: true,
        approveDocs: true,
        rejectApps: false,
        managePayments: true,
        bookAppointments: true,
        viewReports: true,
        manageSubAgents: false,
        manageMessages: true
      },
      commissionType: "Percentage",
      commissionValue: "15",
      paymentMethod: "Bank Transfer (NEFT/RTGS)",
      paymentFrequency: "Monthly",
      accountStatus: "Pending Approval",
      adminNotes: ""
    });
    setIsSuccess(false);
    triggerToast("Form reset to default clean state.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-800 pb-12">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0E1A2C] border border-[#2563EB]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#2563EB] mb-1">
            <UserPlus size={14} />
            <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 font-bold">
              Add New Agent
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Add New Agent</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Create a new agent account by entering personal, agency, and verification details.
          </p>
        </div>

        {/* Top Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw size={14} /> Reset Form
          </button>
          <button
            onClick={() => handleSave(false)}
            className="px-5 py-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-bold rounded-xl shadow-md shadow-[#2563EB]/20 transition cursor-pointer flex items-center gap-1.5"
          >
            <Save size={14} /> Save Agent
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT: TWO COLUMNS (LEFT 9-STEP FORM, RIGHT VALIDATION & SUCCESS SIDEBAR) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT COLUMN: 9 STEP FORM PANELS */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: PERSONAL INFORMATION */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                <User size={16} className="text-[#2563EB]" />
                <span>Step 1: Personal Information</span>
              </h3>
              <span className="text-[10px] font-mono font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Primary Identity
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vikram"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Singh"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="agent@agency.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Alternative Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="+91 9812345678"
                  value={formData.altPhone}
                  onChange={(e) => handleInputChange("altPhone", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  placeholder="Street Address, Apartment/Suite"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  City
                </label>
                <input
                  type="text"
                  placeholder="New Delhi"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
                >
                  <option value="India">🇮🇳 India</option>
                  <option value="USA">🇺🇸 USA</option>
                  <option value="Canada">🇨🇦 Canada</option>
                  <option value="Australia">🇦🇺 Australia</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 2: AGENCY INFORMATION */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                <Building size={16} className="text-[#2563EB]" />
                <span>Step 2: Agency Information</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Agency Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Travel & Visas"
                  value={formData.agencyName}
                  onChange={(e) => handleInputChange("agencyName", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Agency Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="REG-IND-99120"
                  value={formData.agencyRegNo}
                  onChange={(e) => handleInputChange("agencyRegNo", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Business License Number
                </label>
                <input
                  type="text"
                  placeholder="LIC-DEL-88912"
                  value={formData.businessLicense}
                  onChange={(e) => handleInputChange("businessLicense", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  GST / Tax Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="07AAAAA0000A1Z5"
                  value={formData.gstTaxNo}
                  onChange={(e) => handleInputChange("gstTaxNo", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Office Address
                </label>
                <input
                  type="text"
                  placeholder="Commercial Tower, Financial District"
                  value={formData.officeAddress}
                  onChange={(e) => handleInputChange("officeAddress", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Official Website
                </label>
                <input
                  type="url"
                  placeholder="https://agency.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Years of Business
                </label>
                <input
                  type="number"
                  placeholder="5"
                  value={formData.yearsInBusiness}
                  onChange={(e) => handleInputChange("yearsInBusiness", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* STEP 3: BUSINESS DETAILS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                <Briefcase size={16} className="text-[#2563EB]" />
                <span>Step 3: Business Details</span>
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-2">
                  Agency Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    "Solo Agent",
                    "Travel Agency",
                    "Immigration Consultancy",
                    "Corporate Partner"
                  ].map((type) => {
                    const checked = formData.agencyTypes.includes(type);

                    return (
                      <label
                        key={type}
                        className={`p-3 rounded-xl border flex items-center gap-2 font-bold cursor-pointer transition ${
                          checked
                            ? "bg-blue-50 border-[#2563EB] text-[#2563EB]"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleCheckboxToggle("agencyTypes", type)}
                          className="rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                        />
                        <span>{type}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Number of Employees
                  </label>
                  <select
                    value={formData.employeeCount}
                    onChange={(e) => handleInputChange("employeeCount", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
                  >
                    <option value="1-5">1 - 5 Employees</option>
                    <option value="5-10">5 - 10 Employees</option>
                    <option value="10-50">10 - 50 Employees</option>
                    <option value="50+">50+ Employees</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Monthly Application Capacity
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    value={formData.monthlyCapacity}
                    onChange={(e) => handleInputChange("monthlyCapacity", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Office Contact Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 11 40998800"
                    value={formData.officePhone}
                    onChange={(e) => handleInputChange("officePhone", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: KYC VERIFICATION (FILE UPLOADS) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                <ShieldCheck size={16} className="text-[#2563EB]" />
                <span>Step 4: KYC Verification Documents</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {[
                { key: "businessReg", label: "Business Registration Certificate" },
                { key: "govtId", label: "Government ID (Passport / Aadhaar)" },
                { key: "addressProof", label: "Office Address Proof" },
                { key: "taxCert", label: "Tax Registration Certificate" },
                { key: "verificationDocs", label: "Additional Verification Docs" },
                { key: "agencyLogo", label: "Agency Official Logo" }
              ].map((doc) => {
                const attached = formData.kycFiles[doc.key as keyof typeof formData.kycFiles];

                return (
                  <div
                    key={doc.key}
                    className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-extrabold text-slate-800 block mb-0.5">{doc.label}</span>
                      {attached ? (
                        <span className="text-[11px] text-emerald-600 font-mono font-bold flex items-center gap-1">
                          <CheckCircle2 size={12} /> {attached}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">PDF, PNG, JPG (Max 10MB)</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleFileUpload(doc.key, `${doc.key}_document.pdf`)}
                      className="px-3 py-1.5 bg-white hover:bg-blue-50 text-[#2563EB] border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-2xs"
                    >
                      <Upload size={13} /> Upload
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 5: BANK DETAILS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                <CreditCard size={16} className="text-[#2563EB]" />
                <span>Step 5: Bank Details</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  placeholder="Global Visa Services Pvt Ltd"
                  value={formData.accountHolderName}
                  onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  placeholder="HDFC Bank"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange("bankName", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  placeholder="50200012345678"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  IFSC / SWIFT Code
                </label>
                <input
                  type="text"
                  placeholder="HDFC0001234"
                  value={formData.ifscSwiftCode}
                  onChange={(e) => handleInputChange("ifscSwiftCode", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-mono uppercase"
                />
              </div>
            </div>
          </div>

          {/* STEP 6: PERMISSIONS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                <Lock size={16} className="text-[#2563EB]" />
                <span>Step 6: Permissions Management</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {[
                { key: "viewApps", label: "View Applications" },
                { key: "processApps", label: "Process Applications" },
                { key: "approveDocs", label: "Approve Documents" },
                { key: "rejectApps", label: "Reject Applications" },
                { key: "managePayments", label: "Manage Payments" },
                { key: "bookAppointments", label: "Book Appointments" },
                { key: "viewReports", label: "View Reports" },
                { key: "manageSubAgents", label: "Manage Sub-Agents" },
                { key: "manageMessages", label: "Manage Messages" }
              ].map((perm) => {
                const isChecked =
                  formData.permissions[perm.key as keyof typeof formData.permissions];

                return (
                  <label
                    key={perm.key}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 font-bold cursor-pointer transition ${
                      isChecked
                        ? "bg-blue-50 border-[#2563EB] text-[#2563EB]"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxToggle("permissions", perm.key)}
                      className="rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                    />
                    <span>{perm.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* STEP 7: COMMISSION DETAILS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                <DollarSign size={16} className="text-[#2563EB]" />
                <span>Step 7: Commission Details</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-2">
                  Commission Type
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="commissionType"
                      value="Percentage"
                      checked={formData.commissionType === "Percentage"}
                      onChange={(e) => handleInputChange("commissionType", e.target.value)}
                      className="text-[#2563EB] focus:ring-0 cursor-pointer"
                    />
                    <span>Percentage (%)</span>
                  </label>
                  <label className="flex items-center gap-2 font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="commissionType"
                      value="Fixed"
                      checked={formData.commissionType === "Fixed"}
                      onChange={(e) => handleInputChange("commissionType", e.target.value)}
                      className="text-[#2563EB] focus:ring-0 cursor-pointer"
                    />
                    <span>Fixed Amount (₹)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Commission Value
                </label>
                <input
                  type="number"
                  placeholder="15"
                  value={formData.commissionValue}
                  onChange={(e) => handleInputChange("commissionValue", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Payment Frequency
                </label>
                <select
                  value={formData.paymentFrequency}
                  onChange={(e) => handleInputChange("paymentFrequency", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-semibold"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Bi-Weekly">Bi-Weekly</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 8: ACCOUNT STATUS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                <CheckCircle2 size={16} className="text-[#2563EB]" />
                <span>Step 8: Account Status</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { status: "Active", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
                { status: "Pending Approval", color: "bg-amber-50 text-amber-800 border-amber-200" },
                { status: "Inactive", color: "bg-slate-100 text-slate-800 border-slate-200" },
                { status: "Blocked", color: "bg-red-50 text-red-800 border-red-200" }
              ].map((item) => (
                <label
                  key={item.status}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 font-bold cursor-pointer transition ${item.color}`}
                >
                  <input
                    type="radio"
                    name="accountStatus"
                    value={item.status}
                    checked={formData.accountStatus === item.status}
                    onChange={(e) => handleInputChange("accountStatus", e.target.value)}
                    className="text-[#2563EB] focus:ring-0 cursor-pointer"
                  />
                  <span>{item.status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* STEP 9: NOTES */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
                <FileText size={16} className="text-[#2563EB]" />
                <span>Step 9: Internal Admin Notes</span>
              </h3>
            </div>

            <div>
              <textarea
                rows={3}
                placeholder="Enter internal verification remarks, references, or audit notes for this agent registration..."
                value={formData.adminNotes}
                onChange={(e) => handleInputChange("adminNotes", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs p-3 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
              />
            </div>
          </div>

          {/* ACTION BUTTONS AT BOTTOM */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Reset Form
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#2563EB] border border-blue-200 font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <Save size={14} /> Save & Continue
              </button>
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="px-6 py-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white font-bold rounded-xl shadow-md shadow-[#2563EB]/20 transition cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} /> Save Agent
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: VALIDATION RULES & SUCCESS MESSAGE PREVIEW */}
        <div className="space-y-6 lg:sticky lg:top-6">
          {/* VALIDATION RULES CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit border-b border-slate-100 pb-3">
              <Info size={16} className="text-[#2563EB]" />
              <span>Validation Rules</span>
            </h3>

            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-[#2563EB] font-bold">•</span>
                <span>
                  First and Last Name are <strong>mandatory *</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2563EB] font-bold">•</span>
                <span>Email address must follow valid format.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2563EB] font-bold">•</span>
                <span>Mobile number must be at least 10 digits.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2563EB] font-bold">•</span>
                <span>Password requires 8+ characters & symbols.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2563EB] font-bold">•</span>
                <span>Agency Registration Number checked for duplicates.</span>
              </li>
            </ul>
          </div>

          {/* SUCCESS MESSAGE PREVIEW CARD */}
          {isSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-md space-y-3 animate-in zoom-in-95">
              <div className="flex items-center gap-2.5 text-emerald-800 font-extrabold text-sm">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <span>Agent Account Created</span>
              </div>
              <p className="text-xs text-emerald-900 font-semibold leading-relaxed">
                Agent account successfully created and registered on VisaOS.
              </p>
              <div className="bg-white/80 p-3 rounded-xl border border-emerald-200 text-xs font-mono space-y-1">
                <div>
                  <span className="text-slate-500">Agent ID:</span>{" "}
                  <strong className="text-[#2563EB]">AGT-1006</strong>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>{" "}
                  <strong className="text-amber-600">{formData.accountStatus}</strong>
                </div>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium">
                ✉ A welcome email with credentials has been sent to {formData.email || "agent@agency.com"}.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#2563EB]">
                <Sparkles size={16} />
                <span>Live Account Summary</span>
              </div>
              <div className="text-xs space-y-2 text-slate-700">
                <div className="flex justify-between py-1 border-b border-blue-100">
                  <span className="text-slate-500">Full Name:</span>
                  <strong className="text-slate-900">
                    {formData.firstName || "Not Specified"} {formData.lastName}
                  </strong>
                </div>
                <div className="flex justify-between py-1 border-b border-blue-100">
                  <span className="text-slate-500">Agency:</span>
                  <strong className="text-[#2563EB]">
                    {formData.agencyName || "Not Specified"}
                  </strong>
                </div>
                <div className="flex justify-between py-1 border-b border-blue-100">
                  <span className="text-slate-500">Status:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
                    {formData.accountStatus}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Commission:</span>
                  <strong className="font-mono text-slate-900">
                    {formData.commissionValue}% ({formData.commissionType})
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
