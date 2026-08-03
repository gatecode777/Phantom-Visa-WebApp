import React, { useState } from "react";
import {
  FileCode,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  PlusCircle,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Globe,
  FileText,
  Download,
  Check,
  X,
  CreditCard,
  Building,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Award
} from "lucide-react";

export interface VisaTypeRecord {
  id: string;
  visaTypeId: string;
  visaTypeName: string;
  code: string;
  category: string;
  country: string;
  entryType: "Single Entry" | "Double Entry" | "Multiple Entry";
  processingTime: string;
  minProcessingDays: number;
  maxProcessingDays: number;
  validity: string;
  stayDuration: string;
  visaFee: string;
  serviceCharge: string;
  tax: string;
  processingFee: string;
  governmentFee: string;
  status: "Active" | "Inactive";
  description: string;
  displayOrder: number;
  requiredDocuments: string[];
  eligibility: {
    minAge: number;
    maxAge: number;
    nationalityRestrictions: string;
    financialRequirement: string;
    minBankBalance: string;
    travelHistoryRequired: boolean;
    specialRequirements: string;
  };
  stats: {
    received: number;
    approved: number;
    rejected: number;
    pending: number;
    revenue: string;
  };
}

export const PRESET_VISA_TYPES = [
  "Canada 10-Year Visit",
  "UK Short Term",
  "US B1/B2 Visitor",
  "Schengen Short Stay",
  "Australia Visitor",
  "Dubai Tourist",
  "Japan Short Term",
  "Singapore Tourist",
  "Thailand Tourist",
  "Malaysia Tourist",
  "Turkey E-Visa",
  "Vietnam E-Visa",
  "Indonesia E-Visa",
  "Egypt Tourist",
  "Sri Lanka ETA"
];

const MOCK_VISA_TYPES: VisaTypeRecord[] = [
  {
    id: "1",
    visaTypeId: "VT-001",
    visaTypeName: "Tourist E-Visa",
    code: "TEV",
    category: "Tourist Visa",
    country: "Canada",
    entryType: "Single Entry",
    processingTime: "5 Days",
    minProcessingDays: 3,
    maxProcessingDays: 7,
    validity: "90 Days",
    stayDuration: "30 Days",
    visaFee: "6,500",
    serviceCharge: "1,200",
    tax: "350",
    processingFee: "250",
    governmentFee: "5,000",
    status: "Active",
    description: "Short-term electronic tourist entry visa for leisure travel.",
    displayOrder: 1,
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "Visa Application Form",
      "Flight Booking",
      "Hotel Booking",
      "Bank Statement",
      "Travel Insurance"
    ],
    eligibility: {
      minAge: 18,
      maxAge: 75,
      nationalityRestrictions: "None",
      financialRequirement: "Bank Proof",
      minBankBalance: "₹1,50,000",
      travelHistoryRequired: false,
      specialRequirements: "Valid passport with 6 months validity"
    },
    stats: {
      received: 1250,
      approved: 1180,
      rejected: 40,
      pending: 30,
      revenue: "₹96,25,000"
    }
  },
  {
    id: "2",
    visaTypeId: "VT-002",
    visaTypeName: "Business Express Visa",
    code: "BEV",
    category: "Business Visa",
    country: "Australia",
    entryType: "Multiple Entry",
    processingTime: "10 Days",
    minProcessingDays: 7,
    maxProcessingDays: 14,
    validity: "1 Year",
    stayDuration: "90 Days per visit",
    visaFee: "10,500",
    serviceCharge: "1,800",
    tax: "650",
    processingFee: "500",
    governmentFee: "8,000",
    status: "Active",
    description: "Fast-track multiple entry visa for corporate representatives.",
    displayOrder: 2,
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "Visa Application Form",
      "Invitation Letter",
      "Bank Statement",
      "Employment Letter"
    ],
    eligibility: {
      minAge: 21,
      maxAge: 65,
      nationalityRestrictions: "None",
      financialRequirement: "Company Sponsor Letter",
      minBankBalance: "₹3,00,000",
      travelHistoryRequired: true,
      specialRequirements: "Official invitation from registered host entity"
    },
    stats: {
      received: 890,
      approved: 840,
      rejected: 25,
      pending: 25,
      revenue: "₹1,19,70,000"
    }
  },
  {
    id: "3",
    visaTypeId: "VT-003",
    visaTypeName: "Student Long Stay Visa",
    code: "SLSV",
    category: "Student Visa",
    country: "United Kingdom",
    entryType: "Multiple Entry",
    processingTime: "20 Days",
    minProcessingDays: 15,
    maxProcessingDays: 30,
    validity: "365 Days",
    stayDuration: "Duration of Course",
    visaFee: "14,000",
    serviceCharge: "2,200",
    tax: "850",
    processingFee: "600",
    governmentFee: "11,000",
    status: "Active",
    description: "Permit for enrolled international higher education students.",
    displayOrder: 3,
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "University Admission Letter",
      "Bank Statement",
      "Police Clearance Certificate",
      "Medical Certificate"
    ],
    eligibility: {
      minAge: 16,
      maxAge: 45,
      nationalityRestrictions: "None",
      financialRequirement: "Proof of Tuition & Living Funds",
      minBankBalance: "₹8,00,000",
      travelHistoryRequired: false,
      specialRequirements: "Valid CAS / Acceptance Letter"
    },
    stats: {
      received: 1420,
      approved: 1320,
      rejected: 50,
      pending: 50,
      revenue: "₹2,36,42,000"
    }
  },
  {
    id: "4",
    visaTypeId: "VT-004",
    visaTypeName: "Professional Work Visa",
    code: "PWV",
    category: "Work Visa",
    country: "United States",
    entryType: "Multiple Entry",
    processingTime: "30 Days",
    minProcessingDays: 20,
    maxProcessingDays: 45,
    validity: "3 Years",
    stayDuration: "Up to Contract End",
    visaFee: "18,000",
    serviceCharge: "3,000",
    tax: "1,200",
    processingFee: "800",
    governmentFee: "14,000",
    status: "Inactive",
    description: "Skilled employment visa sponsored by authorized employer.",
    displayOrder: 4,
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "Employment Letter",
      "Bank Statement",
      "Police Clearance Certificate",
      "Medical Certificate"
    ],
    eligibility: {
      minAge: 21,
      maxAge: 60,
      nationalityRestrictions: "Subject to Sanctions List",
      financialRequirement: "Job Offer Contract",
      minBankBalance: "₹2,50,000",
      travelHistoryRequired: true,
      specialRequirements: "Labor petition clearance"
    },
    stats: {
      received: 650,
      approved: 560,
      rejected: 50,
      pending: 40,
      revenue: "₹1,49,50,000"
    }
  }
];

export default function VisaTypesManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [entryTypeFilter, setEntryTypeFilter] = useState("All");

  // Records State
  const [visaTypes, setVisaTypes] = useState<VisaTypeRecord[]>(MOCK_VISA_TYPES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Popup Details Modal State
  const [activeModalType, setActiveModalType] = useState<VisaTypeRecord | null>(null);
  const [modalTab, setModalTab] = useState<"general" | "processing" | "docs" | "eligibility" | "stats">("general");

  // Add / Edit Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingType, setEditingType] = useState<VisaTypeRecord | null>(null);

  const [formData, setFormData] = useState({
    visaTypeName: "",
    code: "",
    category: "Tourist Visa",
    country: "Canada",
    description: "",
    displayOrder: 1,
    entryType: "Single Entry" as "Single Entry" | "Double Entry" | "Multiple Entry",
    validity: "90 Days",
    stayDuration: "30 Days",
    processingTime: "5 Days",
    minProcessingDays: 3,
    maxProcessingDays: 7,
    visaFee: "6,500",
    serviceCharge: "1,200",
    tax: "350",
    processingFee: "250",
    governmentFee: "5,000",
    status: "Active" as "Active" | "Inactive",
    selectedDocs: [
      "Passport",
      "Passport Photograph",
      "Visa Application Form",
      "Flight Booking",
      "Hotel Booking",
      "Bank Statement",
      "Travel Insurance"
    ],
    minAge: 18,
    maxAge: 75,
    nationalityRestrictions: "None",
    financialRequirement: "Bank Statement Proof",
    minBankBalance: "₹1,50,000",
    travelHistoryRequired: false,
    specialRequirements: "Valid passport with 6 months validity"
  });

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredTypes = visaTypes.filter((vt) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      vt.visaTypeName.toLowerCase().includes(q) ||
      vt.code.toLowerCase().includes(q) ||
      vt.category.toLowerCase().includes(q) ||
      vt.country.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "All" || vt.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || vt.category === categoryFilter;
    const matchesCountry = countryFilter === "All" || vt.country === countryFilter;
    const matchesEntry = entryTypeFilter === "All" || vt.entryType === entryTypeFilter;

    return matchesQuery && matchesStatus && matchesCategory && matchesCountry && matchesEntry;
  });

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredTypes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTypes.map((v) => v.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleToggleStatus = (record: VisaTypeRecord) => {
    const newStatus = record.status === "Active" ? "Inactive" : "Active";
    setVisaTypes((prev) =>
      prev.map((v) => (v.id === record.id ? { ...v, status: newStatus } : v))
    );
    triggerToast(`Visa Type ${record.visaTypeName} updated to ${newStatus}.`);
  };

  const handleDeleteRecord = (record: VisaTypeRecord) => {
    setVisaTypes((prev) => prev.filter((v) => v.id !== record.id));
    triggerToast(`Visa Type ${record.visaTypeName} deleted.`);
    if (activeModalType?.id === record.id) setActiveModalType(null);
  };

  const handleBulkActivate = () => {
    setVisaTypes((prev) =>
      prev.map((v) => (selectedIds.includes(v.id) ? { ...v, status: "Active" } : v))
    );
    triggerToast(`${selectedIds.length} visa types activated.`);
    setSelectedIds([]);
  };

  const handleBulkDeactivate = () => {
    setVisaTypes((prev) =>
      prev.map((v) => (selectedIds.includes(v.id) ? { ...v, status: "Inactive" } : v))
    );
    triggerToast(`${selectedIds.length} visa types deactivated.`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setVisaTypes((prev) => prev.filter((v) => !selectedIds.includes(v.id)));
    triggerToast(`${selectedIds.length} visa types deleted.`);
    setSelectedIds([]);
  };

  const openEditForm = (record: VisaTypeRecord) => {
    setEditingType(record);
    setFormData({
      visaTypeName: record.visaTypeName,
      code: record.code,
      category: record.category,
      country: record.country,
      description: record.description,
      displayOrder: record.displayOrder,
      entryType: record.entryType,
      validity: record.validity,
      stayDuration: record.stayDuration,
      processingTime: record.processingTime,
      minProcessingDays: record.minProcessingDays,
      maxProcessingDays: record.maxProcessingDays,
      visaFee: record.visaFee,
      serviceCharge: record.serviceCharge,
      tax: record.tax,
      processingFee: record.processingFee,
      governmentFee: record.governmentFee,
      status: record.status,
      selectedDocs: record.requiredDocuments,
      minAge: record.eligibility.minAge,
      maxAge: record.eligibility.maxAge,
      nationalityRestrictions: record.eligibility.nationalityRestrictions,
      financialRequirement: record.eligibility.financialRequirement,
      minBankBalance: record.eligibility.minBankBalance,
      travelHistoryRequired: record.eligibility.travelHistoryRequired,
      specialRequirements: record.eligibility.specialRequirements
    });
    setShowAddModal(true);
  };

  const handleSaveType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.visaTypeName || !formData.code) {
      triggerToast("Please provide Visa Type Name and Code.");
      return;
    }

    if (editingType) {
      setVisaTypes((prev) =>
        prev.map((v) =>
          v.id === editingType.id
            ? {
                ...v,
                visaTypeName: formData.visaTypeName,
                code: formData.code.toUpperCase(),
                category: formData.category,
                country: formData.country,
                description: formData.description,
                displayOrder: formData.displayOrder,
                entryType: formData.entryType,
                validity: formData.validity,
                stayDuration: formData.stayDuration,
                processingTime: formData.processingTime,
                minProcessingDays: formData.minProcessingDays,
                maxProcessingDays: formData.maxProcessingDays,
                visaFee: formData.visaFee,
                serviceCharge: formData.serviceCharge,
                tax: formData.tax,
                processingFee: formData.processingFee,
                governmentFee: formData.governmentFee,
                status: formData.status,
                requiredDocuments: formData.selectedDocs,
                eligibility: {
                  minAge: formData.minAge,
                  maxAge: formData.maxAge,
                  nationalityRestrictions: formData.nationalityRestrictions,
                  financialRequirement: formData.financialRequirement,
                  minBankBalance: formData.minBankBalance,
                  travelHistoryRequired: formData.travelHistoryRequired,
                  specialRequirements: formData.specialRequirements
                }
              }
            : v
        )
      );
      triggerToast(`Visa Type ${formData.visaTypeName} updated successfully.`);
    } else {
      const newRecord: VisaTypeRecord = {
        id: Date.now().toString(),
        visaTypeId: `VT-00${visaTypes.length + 1}`,
        visaTypeName: formData.visaTypeName,
        code: formData.code.toUpperCase(),
        category: formData.category,
        country: formData.country,
        description: formData.description,
        displayOrder: formData.displayOrder,
        entryType: formData.entryType,
        validity: formData.validity,
        stayDuration: formData.stayDuration,
        processingTime: formData.processingTime,
        minProcessingDays: formData.minProcessingDays,
        maxProcessingDays: formData.maxProcessingDays,
        visaFee: formData.visaFee,
        serviceCharge: formData.serviceCharge,
        tax: formData.tax,
        processingFee: formData.processingFee,
        governmentFee: formData.governmentFee,
        status: formData.status,
        requiredDocuments: formData.selectedDocs,
        eligibility: {
          minAge: formData.minAge,
          maxAge: formData.maxAge,
          nationalityRestrictions: formData.nationalityRestrictions,
          financialRequirement: formData.financialRequirement,
          minBankBalance: formData.minBankBalance,
          travelHistoryRequired: formData.travelHistoryRequired,
          specialRequirements: formData.specialRequirements
        },
        stats: {
          received: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
          revenue: "₹0"
        }
      };
      setVisaTypes((prev) => [newRecord, ...prev]);
      triggerToast(`New Visa Type ${formData.visaTypeName} added successfully.`);
    }

    setShowAddModal(false);
    setEditingType(null);
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
            <FileCode size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Specific Visa Type Definitions
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Visa Types
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Create, update, and manage all specific visa types available under visa categories for each country.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingType(null);
              setFormData({
                visaTypeName: "",
                code: "",
                category: "Tourist Visa",
                country: "Canada",
                description: "",
                displayOrder: visaTypes.length + 1,
                entryType: "Single Entry",
                validity: "90 Days",
                stayDuration: "30 Days",
                processingTime: "5 Days",
                minProcessingDays: 3,
                maxProcessingDays: 7,
                visaFee: "6,500",
                serviceCharge: "1,200",
                tax: "350",
                processingFee: "250",
                governmentFee: "5,000",
                status: "Active",
                selectedDocs: ["Passport", "Passport Photograph", "Visa Application Form", "Bank Statement"],
                minAge: 18,
                maxAge: 75,
                nationalityRestrictions: "None",
                financialRequirement: "Bank Proof",
                minBankBalance: "₹1,50,000",
                travelHistoryRequired: false,
                specialRequirements: "Valid passport with 6 months validity"
              });
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-white text-[#2563EB] hover:bg-blue-50 text-xs font-black rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle size={16} /> Add New Visa Type
          </button>
        </div>
      </div>

      {/* TOP STATISTICS CARDS & PRESET LIST (AS IN WIREFRAME) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* LEFT CARDS: 4 METRICS */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
                Total Visa Types
              </span>
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                <FileCode size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">28</div>
            <span className="text-[11px] text-[#2563EB] font-semibold mt-1 inline-block">
              Defined Visa Permits
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
                Active Visa Types
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">24</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
              Currently Open for Processing
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
                Inactive Visa Types
              </span>
              <div className="w-9 h-9 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <XCircle size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">4</div>
            <span className="text-[11px] text-red-600 font-semibold mt-1 inline-block">
              Paused / Discontinued
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
                Countries Covered
              </span>
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Globe size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">65</div>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">
              Destination Countries
            </span>
          </div>
        </div>

        {/* RIGHT CARD: VISA TYPES FOR VISAOS (PRESET LIST FROM WIREFRAME) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={16} className="text-[#2563EB]" /> Visa Types for VisaOS
            </h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-600 font-medium max-h-48 overflow-y-auto [scrollbar-width:thin]">
              {PRESET_VISA_TYPES.map((type, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="text-[#2563EB] font-mono font-bold">{idx + 1}.</span>
                  <span className="truncate">{type}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3 text-[10px] text-slate-400">
            Standardized VisaOS Visa Taxonomy Catalog
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & Multi-Criteria Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredTypes.length} of {visaTypes.length} Visa Types
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* SEARCH BY KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search By (Name, Code, Country)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tourist, TEV, Canada..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition"
              />
            </div>
          </div>

          {/* STATUS FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* CATEGORY FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Visa Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Categories</option>
              <option value="Tourist Visa">Tourist Visa</option>
              <option value="Business Visa">Business Visa</option>
              <option value="Student Visa">Student Visa</option>
              <option value="Work Visa">Work Visa</option>
              <option value="Medical Visa">Medical Visa</option>
            </select>
          </div>

          {/* COUNTRY FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Country
            </label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Countries</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
            </select>
          </div>

          {/* ENTRY TYPE FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Entry Type
            </label>
            <select
              value={entryTypeFilter}
              onChange={(e) => setEntryTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Entry Types</option>
              <option value="Single Entry">Single Entry</option>
              <option value="Double Entry">Double Entry</option>
              <option value="Multiple Entry">Multiple Entry</option>
            </select>
          </div>
        </div>
      </div>

      {/* CONTEXTUAL BULK ACTIONS TOOLBAR */}
      {selectedIds.length > 0 && (
        <div className="bg-[#0E1A2C] border border-[#2563EB]/40 text-white p-3.5 rounded-2xl shadow-xl mb-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-6 h-6 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-mono font-bold text-xs">
              {selectedIds.length}
            </span>
            <span>Visa Types Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkActivate}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 size={14} /> Activate Selected
            </button>
            <button
              onClick={handleBulkDeactivate}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <XCircle size={14} /> Deactivate Selected
            </button>
            <button
              onClick={() => triggerToast(`Exporting data for ${selectedIds.length} visa types.`)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Visa Types
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Trash2 size={14} /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* VISA TYPES TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredTypes.length && filteredTypes.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Visa Type ID</th>
                <th className="py-3.5 px-4">Visa Type</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Entry Type</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Processing Time</th>
                <th className="py-3.5 px-4 font-mono">Validity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredTypes.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <FileCode size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No visa types found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredTypes.map((vt) => (
                  <tr key={vt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(vt.id)}
                        onChange={() => handleToggleSelect(vt.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {vt.visaTypeId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {vt.visaTypeName}
                      <span className="block text-[10px] text-slate-400 font-normal">{vt.code}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {vt.category}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {vt.entryType}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {vt.country}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {vt.processingTime}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {vt.validity}
                    </td>
                    <td className="py-3.5 px-4">
                      {vt.status === "Active" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setActiveModalType(vt);
                            setModalTab("general");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openEditForm(vt)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title="Edit Visa Type"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(vt)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            vt.status === "Active"
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-amber-600 hover:bg-amber-50"
                          }`}
                          title={vt.status === "Active" ? "Deactivate" : "Activate"}
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(vt)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Visa Type"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>Showing 1–10 of 28 Visa Types</div>
          <div className="flex items-center gap-1 font-mono font-bold">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#2563EB] text-white rounded-lg">1</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">2</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">3</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CENTERED POPUP DETAILS MODAL (5 TABS AS IN WIREFRAME) */}
      {activeModalType && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white">
                  <FileCode size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalType.visaTypeName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
                      {activeModalType.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activeModalType.category} &bull; Destination: {activeModalType.country}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalType(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {[
                { id: "general", label: "General Information", icon: FileCode },
                { id: "processing", label: "Processing Information", icon: Clock },
                { id: "docs", label: "Required Documents", icon: FileText },
                { id: "eligibility", label: "Eligibility Rules", icon: ShieldCheck },
                { id: "stats", label: "Statistics", icon: TrendingUp }
              ].map((tab) => {
                const IconComp = tab.icon;
                const active = modalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      active
                        ? "bg-[#2563EB] text-white shadow-sm"
                        : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                    }`}
                  >
                    <IconComp size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {/* TAB 1: GENERAL INFORMATION */}
              {modalTab === "general" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Visa Type Definition Overview
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Visa Type</span>
                      <strong className="text-slate-900 font-bold">{activeModalType.visaTypeName}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Category</span>
                      <strong className="text-[#2563EB] font-bold">{activeModalType.category}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Destination Country</span>
                      <strong className="text-slate-900 font-bold">{activeModalType.country}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Entry Type</span>
                      <strong className="text-slate-900 font-mono font-bold">{activeModalType.entryType}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Status</span>
                      <strong className="text-emerald-600 font-bold">{activeModalType.status}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROCESSING INFORMATION */}
              {modalTab === "processing" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Turnaround Speed & Financial Schedule
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Processing Time</span>
                      <strong className="text-slate-900 font-mono font-bold text-sm">{activeModalType.processingTime}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Visa Validity</span>
                      <strong className="text-[#2563EB] font-mono font-bold text-xs">{activeModalType.validity}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Stay Duration</span>
                      <strong className="text-slate-900 font-mono font-bold text-xs">{activeModalType.stayDuration}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Service Fee</span>
                      <strong className="text-slate-900 font-mono font-bold text-xs">₹{activeModalType.serviceCharge}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: REQUIRED DOCUMENTS */}
              {modalTab === "docs" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Required Documents Checklist
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeModalType.requiredDocuments.map((doc, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <span className="font-bold text-slate-800">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ELIGIBILITY RULES */}
              {modalTab === "eligibility" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Applicant Eligibility Criteria
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Age Requirement</span>
                      <strong className="text-slate-900 font-mono">{activeModalType.eligibility.minAge} to {activeModalType.eligibility.maxAge} Years</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Nationality Restrictions</span>
                      <strong className="text-slate-900 font-bold">{activeModalType.eligibility.nationalityRestrictions}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Min Bank Balance</span>
                      <strong className="text-emerald-700 font-mono font-bold">{activeModalType.eligibility.minBankBalance}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Travel History Required</span>
                      <strong className="text-slate-900 font-bold">{activeModalType.eligibility.travelHistoryRequired ? "Yes" : "No"}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: STATISTICS */}
              {modalTab === "stats" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Application Volumes & Revenue Performance
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Received</span>
                      <strong className="text-slate-900 text-lg font-mono font-black">{activeModalType.stats.received}</strong>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-700 font-extrabold uppercase block">Approved</span>
                      <strong className="text-emerald-800 text-lg font-mono font-black">{activeModalType.stats.approved}</strong>
                    </div>
                    <div className="bg-red-50 p-3 rounded-2xl border border-red-200">
                      <span className="text-[10px] text-red-700 font-extrabold uppercase block">Rejected</span>
                      <strong className="text-red-800 text-lg font-mono font-black">{activeModalType.stats.rejected}</strong>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                      <span className="text-[10px] text-amber-700 font-extrabold uppercase block">Pending</span>
                      <strong className="text-amber-800 text-lg font-mono font-black">{activeModalType.stats.pending}</strong>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200 sm:col-span-1 col-span-2">
                      <span className="text-[10px] text-[#2563EB] font-extrabold uppercase block">Revenue</span>
                      <strong className="text-[#2563EB] text-sm font-mono font-black">{activeModalType.stats.revenue}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(activeModalType)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  activeModalType.status === "Active"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {activeModalType.status === "Active" ? "Deactivate Visa Type" : "Activate Visa Type"}
              </button>

              <button
                onClick={() => openEditForm(activeModalType)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 size={14} /> Edit Visa Type
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT NEW VISA TYPE FORM MODAL (EXACT WIREFRAME FORM) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-black font-outfit flex items-center gap-2">
                <FileCode size={18} />
                <span>{editingType ? `Edit Visa Type: ${editingType.visaTypeName}` : "Add New Visa Type"}</span>
              </h3>

              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingType(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* MODAL FORM BODY */}
            <form onSubmit={handleSaveType} className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE]">
              {/* SECTION 1: BASIC INFORMATION */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Visa Type Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.visaTypeName}
                      onChange={(e) => {
                        const selectedVal = e.target.value;
                        setFormData({
                          ...formData,
                          visaTypeName: selectedVal,
                          code: selectedVal.split(" ").map((w) => w[0]).join("").toUpperCase()
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-bold"
                    >
                      <option value="">Select Visa Type Preset...</option>
                      {PRESET_VISA_TYPES.map((preset, idx) => (
                        <option key={idx} value={preset}>
                          {preset}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Visa Type Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TEV"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Visa Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                    >
                      <option value="Tourist Visa">Tourist Visa</option>
                      <option value="Business Visa">Business Visa</option>
                      <option value="Student Visa">Student Visa</option>
                      <option value="Work Visa">Work Visa</option>
                      <option value="Medical Visa">Medical Visa</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                    >
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="Short-term electronic tourist entry visa..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: VISA DETAILS */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Visa Processing & Entry Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Entry Type
                    </label>
                    <select
                      value={formData.entryType}
                      onChange={(e) => setFormData({ ...formData, entryType: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                    >
                      <option value="Single Entry">Single Entry</option>
                      <option value="Double Entry">Double Entry</option>
                      <option value="Multiple Entry">Multiple Entry</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Visa Validity
                    </label>
                    <input
                      type="text"
                      placeholder="90 Days"
                      value={formData.validity}
                      onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Stay Duration
                    </label>
                    <input
                      type="text"
                      placeholder="30 Days"
                      value={formData.stayDuration}
                      onChange={(e) => setFormData({ ...formData, stayDuration: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Processing Time
                    </label>
                    <input
                      type="text"
                      placeholder="5 Days"
                      value={formData.processingTime}
                      onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: FEES & FINANCIAL BREAKDOWN */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Fees & Financial Schedule
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Visa Fee (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="6,500"
                      value={formData.visaFee}
                      onChange={(e) => setFormData({ ...formData, visaFee: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Service Charge (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="1,200"
                      value={formData.serviceCharge}
                      onChange={(e) => setFormData({ ...formData, serviceCharge: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Tax (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="350"
                      value={formData.tax}
                      onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Payment Fee (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="250"
                      value={formData.processingFee}
                      onChange={(e) => setFormData({ ...formData, processingFee: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Govt Fee (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="5,000"
                      value={formData.governmentFee}
                      onChange={(e) => setFormData({ ...formData, governmentFee: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: REQUIRED DOCUMENTS (CHECKBOXES) */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Required Documents Checklist
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    "Passport",
                    "Passport Photograph",
                    "Visa Application Form",
                    "Flight Booking",
                    "Hotel Booking",
                    "Travel Insurance",
                    "Bank Statement",
                    "Invitation Letter",
                    "Employment Letter",
                    "University Admission Letter",
                    "Medical Certificate",
                    "Police Clearance Certificate",
                    "Cover Letter"
                  ].map((doc) => {
                    const checked = formData.selectedDocs.includes(doc);
                    return (
                      <label
                        key={doc}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition text-xs font-semibold ${
                          checked
                            ? "bg-[#2563EB]/10 border-blue-300 text-[#2563EB]"
                            : "bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                selectedDocs: formData.selectedDocs.filter((d) => d !== doc)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selectedDocs: [...formData.selectedDocs, doc]
                              });
                            }
                          }}
                          className="rounded border-slate-300 text-[#2563EB]"
                        />
                        <span>{doc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-[#2563EB]/25"
                >
                  {editingType ? "Save Visa Type Changes" : "Create Visa Type"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
