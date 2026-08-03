import React, { useState } from "react";
import {
  Layers,
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
  Sparkles
} from "lucide-react";

export const VISAOS_PRESET_CATEGORIES = [
  { name: "Tourist Visa", code: "TV", icon: "✈️" },
  { name: "Business Visa", code: "BV", icon: "💼" },
  { name: "Student Visa", code: "SV", icon: "🎓" },
  { name: "Work Visa", code: "WV", icon: "🏢" },
  { name: "Medical Visa", code: "MV", icon: "🏥" },
  { name: "Transit Visa", code: "TRV", icon: "🚅" },
  { name: "Family Visit Visa", code: "FVV", icon: "👨‍👩‍👧‍👦" },
  { name: "Dependent Visa", code: "DV", icon: "👶" },
  { name: "Investor Visa", code: "IV", icon: "💰" },
  { name: "Conference Visa", code: "CV", icon: "🎤" },
  { name: "Research Visa", code: "RV", icon: "🔬" },
  { name: "Training Visa", code: "TRN", icon: "📖" },
  { name: "Internship Visa", code: "INT", icon: "💼" },
  { name: "Digital Nomad Visa", code: "DNV", icon: "💻" },
  { name: "Working Holiday Visa", code: "WHV", icon: "🏖️" },
  { name: "Religious Visa", code: "REL", icon: "🕊️" },
  { name: "Sports Visa", code: "SPV", icon: "⚽" },
  { name: "Cultural Visa", code: "CUL", icon: "🎨" },
  { name: "Diplomatic Visa", code: "DIP", icon: "🏛️" },
  { name: "Official Visa", code: "OFF", icon: "🎖️" },
];

export interface VisaCategoryRecord {
  id: string;
  categoryId: string;
  categoryName: string;
  code: string;
  icon: string;
  description: string;
  displayOrder: number;
  applicableCountriesCount: number;
  processingTime: string;
  minDays: number;
  maxDays: number;
  startingFee: string;
  serviceFee: string;
  additionalCharges: string;
  tax: string;
  visaValidity: string;
  stayDuration: string;
  entryType: string[]; // ["Single Entry", "Multiple Entry"]
  status: "Active" | "Inactive";
  applicableCountries: string[];
  requiredDocuments: string[];
  stats: {
    received: number;
    approved: number;
    rejected: number;
    pending: number;
    revenue: string;
  };
}

const MOCK_VISA_CATEGORIES: VisaCategoryRecord[] = [
  {
    id: "1",
    categoryId: "CAT-001",
    categoryName: "Tourist Visa",
    code: "TV",
    icon: "✈️",
    description: "Leisure travel, vacation, sightseeing, and family visits abroad.",
    displayOrder: 1,
    applicableCountriesCount: 45,
    processingTime: "5–15 Days",
    minDays: 5,
    maxDays: 15,
    startingFee: "6,500",
    serviceFee: "1,200",
    additionalCharges: "500",
    tax: "18%",
    visaValidity: "6 Months to 10 Years",
    stayDuration: "90 Days per visit",
    entryType: ["Single Entry", "Multiple Entry"],
    status: "Active",
    applicableCountries: [
      "Canada",
      "Australia",
      "United Kingdom",
      "United States",
      "Germany",
      "France",
      "Japan",
      "UAE"
    ],
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "Visa Application Form",
      "Flight Booking",
      "Hotel Booking",
      "Bank Statement",
      "Travel Insurance"
    ],
    stats: {
      received: 2450,
      approved: 2280,
      rejected: 85,
      pending: 85,
      revenue: "₹1,59,25,000"
    }
  },
  {
    id: "2",
    categoryId: "CAT-002",
    categoryName: "Business Visa",
    code: "BV",
    icon: "💼",
    description: "Corporate meetings, trade conferences, negotiations, and business trips.",
    displayOrder: 2,
    applicableCountriesCount: 32,
    processingTime: "10–20 Days",
    minDays: 10,
    maxDays: 20,
    startingFee: "10,500",
    serviceFee: "1,800",
    additionalCharges: "750",
    tax: "18%",
    visaValidity: "1 Year to 5 Years",
    stayDuration: "180 Days",
    entryType: ["Single Entry", "Double Entry", "Multiple Entry"],
    status: "Active",
    applicableCountries: [
      "Canada",
      "Australia",
      "United Kingdom",
      "United States",
      "Germany",
      "Japan"
    ],
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "Visa Application Form",
      "Bank Statement",
      "Invitation Letter",
      "Employment Letter",
      "Travel Insurance"
    ],
    stats: {
      received: 1320,
      approved: 1210,
      rejected: 45,
      pending: 65,
      revenue: "₹1,38,60,000"
    }
  },
  {
    id: "3",
    categoryId: "CAT-003",
    categoryName: "Student Visa",
    code: "SV",
    icon: "🎓",
    description: "Academic education, university study permits, and exchange programs.",
    displayOrder: 3,
    applicableCountriesCount: 28,
    processingTime: "20–30 Days",
    minDays: 20,
    maxDays: 30,
    startingFee: "12,000",
    serviceFee: "2,000",
    additionalCharges: "1,000",
    tax: "18%",
    visaValidity: "Duration of Study Course",
    stayDuration: "1 to 4 Years",
    entryType: ["Multiple Entry"],
    status: "Active",
    applicableCountries: [
      "Canada",
      "Australia",
      "United Kingdom",
      "United States",
      "Germany",
      "France"
    ],
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "University Admission Letter",
      "Bank Statement",
      "Police Clearance Certificate",
      "Medical Certificate"
    ],
    stats: {
      received: 1890,
      approved: 1720,
      rejected: 90,
      pending: 80,
      revenue: "₹2,26,80,000"
    }
  },
  {
    id: "4",
    categoryId: "CAT-004",
    categoryName: "Work Visa",
    code: "WV",
    icon: "🏢",
    description: "Employment permits, temporary worker visas, and intra-company transfers.",
    displayOrder: 4,
    applicableCountriesCount: 24,
    processingTime: "25–45 Days",
    minDays: 25,
    maxDays: 45,
    startingFee: "15,000",
    serviceFee: "2,500",
    additionalCharges: "1,200",
    tax: "18%",
    visaValidity: "1 Year to 3 Years",
    stayDuration: "Up to Contract Validity",
    entryType: ["Multiple Entry"],
    status: "Active",
    applicableCountries: [
      "Canada",
      "Australia",
      "United Kingdom",
      "United States",
      "Germany",
      "UAE"
    ],
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "Employment Letter",
      "Bank Statement",
      "Police Clearance Certificate",
      "Medical Certificate"
    ],
    stats: {
      received: 1150,
      approved: 990,
      rejected: 80,
      pending: 80,
      revenue: "₹1,72,50,000"
    }
  },
  {
    id: "5",
    categoryId: "CAT-005",
    categoryName: "Medical Visa",
    code: "MV",
    icon: "🏥",
    description: "Medical treatment, specialized surgery, and healthcare consultations.",
    displayOrder: 5,
    applicableCountriesCount: 18,
    processingTime: "5–10 Days",
    minDays: 5,
    maxDays: 10,
    startingFee: "7,500",
    serviceFee: "1,000",
    additionalCharges: "500",
    tax: "18%",
    visaValidity: "6 Months",
    stayDuration: "60 Days",
    entryType: ["Single Entry", "Double Entry"],
    status: "Inactive",
    applicableCountries: [
      "United Kingdom",
      "United States",
      "Germany",
      "India",
      "UAE"
    ],
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "Medical Certificate",
      "Invitation Letter",
      "Bank Statement"
    ],
    stats: {
      received: 340,
      approved: 310,
      rejected: 15,
      pending: 15,
      revenue: "₹25,50,000"
    }
  }
];

export default function VisaCategoriesManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [visaTypeFilter, setVisaTypeFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");

  // Records State
  const [categories, setCategories] = useState<VisaCategoryRecord[]>(MOCK_VISA_CATEGORIES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Modal Details State
  const [activeModalCategory, setActiveModalCategory] = useState<VisaCategoryRecord | null>(null);
  const [modalTab, setModalTab] = useState<"general" | "processing" | "countries" | "docs" | "stats">("general");

  // Add / Edit Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<VisaCategoryRecord | null>(null);

  const [formData, setFormData] = useState({
    categoryName: "",
    categoryCode: "",
    icon: "🛂",
    description: "",
    displayOrder: 1,
    processingTime: "5–15 Days",
    minDays: 5,
    maxDays: 15,
    visaValidity: "6 Months",
    stayDuration: "90 Days",
    entryTypes: ["Single Entry", "Multiple Entry"],
    startingFee: "6,500",
    serviceFee: "1,200",
    additionalCharges: "500",
    tax: "18%",
    status: "Active" as "Active" | "Inactive",
    selectedCountries: ["Canada", "Australia", "United Kingdom", "United States"],
    selectedDocs: [
      "Passport",
      "Passport Photograph",
      "Visa Application Form",
      "Flight Booking",
      "Hotel Booking",
      "Bank Statement",
      "Travel Insurance"
    ]
  });

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      cat.categoryName.toLowerCase().includes(q) ||
      cat.code.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "All" || cat.status === statusFilter;
    const matchesType = visaTypeFilter === "All" || cat.categoryName.toLowerCase().includes(visaTypeFilter.toLowerCase());

    return matchesQuery && matchesStatus && matchesType;
  });

  // Select Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredCategories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCategories.map((c) => c.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleToggleStatus = (category: VisaCategoryRecord) => {
    const newStatus = category.status === "Active" ? "Inactive" : "Active";
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? { ...c, status: newStatus } : c))
    );
    triggerToast(`Category ${category.categoryName} updated to ${newStatus}.`);
  };

  const handleDeleteCategory = (category: VisaCategoryRecord) => {
    setCategories((prev) => prev.filter((c) => c.id !== category.id));
    triggerToast(`Category ${category.categoryName} deleted successfully.`);
    if (activeModalCategory?.id === category.id) setActiveModalCategory(null);
  };

  const handleBulkActivate = () => {
    setCategories((prev) =>
      prev.map((c) => (selectedIds.includes(c.id) ? { ...c, status: "Active" } : c))
    );
    triggerToast(`${selectedIds.length} categories activated.`);
    setSelectedIds([]);
  };

  const handleBulkDeactivate = () => {
    setCategories((prev) =>
      prev.map((c) => (selectedIds.includes(c.id) ? { ...c, status: "Inactive" } : c))
    );
    triggerToast(`${selectedIds.length} categories deactivated.`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setCategories((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    triggerToast(`${selectedIds.length} categories deleted.`);
    setSelectedIds([]);
  };

  const openEditForm = (category: VisaCategoryRecord) => {
    setEditingCategory(category);
    setFormData({
      categoryName: category.categoryName,
      categoryCode: category.code,
      icon: category.icon,
      description: category.description,
      displayOrder: category.displayOrder,
      processingTime: category.processingTime,
      minDays: category.minDays,
      maxDays: category.maxDays,
      visaValidity: category.visaValidity,
      stayDuration: category.stayDuration,
      entryTypes: category.entryType,
      startingFee: category.startingFee,
      serviceFee: category.serviceFee,
      additionalCharges: category.additionalCharges,
      tax: category.tax,
      status: category.status,
      selectedCountries: category.applicableCountries,
      selectedDocs: category.requiredDocuments
    });
    setShowAddModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryName || !formData.categoryCode) {
      triggerToast("Please provide Category Name and Category Code.");
      return;
    }

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                categoryName: formData.categoryName,
                code: formData.categoryCode.toUpperCase(),
                icon: formData.icon,
                description: formData.description,
                displayOrder: formData.displayOrder,
                processingTime: formData.processingTime,
                minDays: formData.minDays,
                maxDays: formData.maxDays,
                visaValidity: formData.visaValidity,
                stayDuration: formData.stayDuration,
                entryType: formData.entryTypes,
                startingFee: formData.startingFee,
                serviceFee: formData.serviceFee,
                additionalCharges: formData.additionalCharges,
                tax: formData.tax,
                status: formData.status,
                applicableCountries: formData.selectedCountries,
                requiredDocuments: formData.selectedDocs,
                applicableCountriesCount: formData.selectedCountries.length
              }
            : c
        )
      );
      triggerToast(`Category ${formData.categoryName} updated successfully.`);
    } else {
      const newCategory: VisaCategoryRecord = {
        id: Date.now().toString(),
        categoryId: `CAT-00${categories.length + 1}`,
        categoryName: formData.categoryName,
        code: formData.categoryCode.toUpperCase(),
        icon: formData.icon || "🛂",
        description: formData.description,
        displayOrder: formData.displayOrder,
        applicableCountriesCount: formData.selectedCountries.length,
        processingTime: formData.processingTime,
        minDays: formData.minDays,
        maxDays: formData.maxDays,
        startingFee: formData.startingFee,
        serviceFee: formData.serviceFee,
        additionalCharges: formData.additionalCharges,
        tax: formData.tax,
        visaValidity: formData.visaValidity,
        stayDuration: formData.stayDuration,
        entryType: formData.entryTypes,
        status: formData.status,
        applicableCountries: formData.selectedCountries,
        requiredDocuments: formData.selectedDocs,
        stats: {
          received: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
          revenue: "₹0"
        }
      };
      setCategories((prev) => [newCategory, ...prev]);
      triggerToast(`New Visa Category ${formData.categoryName} added successfully.`);
    }

    setShowAddModal(false);
    setEditingCategory(null);
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
            <Layers size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Global Visa Taxonomy Architecture
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Visa Categories
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Create, update, and manage all visa categories available for different countries and application types.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingCategory(null);
              setFormData({
                categoryName: "",
                categoryCode: "",
                icon: "🛂",
                description: "",
                displayOrder: categories.length + 1,
                processingTime: "5–15 Days",
                minDays: 5,
                maxDays: 15,
                visaValidity: "6 Months",
                stayDuration: "90 Days",
                entryTypes: ["Single Entry", "Multiple Entry"],
                startingFee: "6,500",
                serviceFee: "1,200",
                additionalCharges: "500",
                tax: "18%",
                status: "Active",
                selectedCountries: ["Canada", "Australia", "United Kingdom", "United States"],
                selectedDocs: ["Passport", "Passport Photograph", "Visa Application Form", "Bank Statement"]
              });
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-white text-[#2563EB] hover:bg-blue-50 text-xs font-black rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle size={16} /> Add New Visa Category
          </button>
        </div>
      </div>

      {/* TOP STATISTICS CARDS (4 CARDS AS IN WIREFRAME) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
              Total Visa Categories
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
              <Layers size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">12</div>
          <span className="text-[11px] text-[#2563EB] font-semibold mt-1 inline-block">
            Global Visa Taxonomies
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
              Active Categories
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">10</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            Available for Application Submissions
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
              Inactive Categories
            </span>
            <div className="w-9 h-9 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <XCircle size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">2</div>
          <span className="text-[11px] text-red-600 font-semibold mt-1 inline-block">
            Temporarily Disabled
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
              New Categories This Month
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">3</div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">
            Recently Onboarded
          </span>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
            <Filter size={16} className="text-[#2563EB]" /> Search & Multi-Criteria Filters
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredCategories.length} of {categories.length} Categories
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {/* SEARCH BY KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search By (Name, Code)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tourist, TV, Business..."
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

          {/* VISA TYPE FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Visa Type
            </label>
            <select
              value={visaTypeFilter}
              onChange={(e) => setVisaTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Visa Types</option>
              {VISAOS_PRESET_CATEGORIES.map((preset, idx) => (
                <option key={idx} value={preset.name}>
                  {preset.icon} {preset.name}
                </option>
              ))}
            </select>
          </div>

          {/* COUNTRY FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Applicable Country
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
        </div>
      </div>

      {/* CONTEXTUAL BULK ACTIONS TOOLBAR */}
      {selectedIds.length > 0 && (
        <div className="bg-[#0E1A2C] border border-[#2563EB]/40 text-white p-3.5 rounded-2xl shadow-xl mb-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-6 h-6 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-mono font-bold text-xs">
              {selectedIds.length}
            </span>
            <span>Visa Categories Selected</span>
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
              onClick={() => triggerToast(`Exporting data for ${selectedIds.length} categories.`)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Categories
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

      {/* VISA CATEGORIES TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredCategories.length && filteredCategories.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Category ID</th>
                <th className="py-3.5 px-4">Category Name</th>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4 text-center">Applicable Countries</th>
                <th className="py-3.5 px-4">Processing Time</th>
                <th className="py-3.5 px-4 font-mono">Starting Fee</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Layers size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No visa categories found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(cat.id)}
                        onChange={() => handleToggleSelect(cat.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {cat.categoryId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span className="text-base">{cat.icon}</span>
                      <div>
                        <span>{cat.categoryName}</span>
                        <span className="block text-[10px] text-slate-400 font-normal">{cat.description}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {cat.code}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                      {cat.applicableCountriesCount} Countries
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {cat.processingTime}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ₹{cat.startingFee}
                    </td>
                    <td className="py-3.5 px-4">
                      {cat.status === "Active" ? (
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
                            setActiveModalCategory(cat);
                            setModalTab("general");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openEditForm(cat)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(cat)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            cat.status === "Active"
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-amber-600 hover:bg-amber-50"
                          }`}
                          title={cat.status === "Active" ? "Deactivate" : "Activate"}
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Category"
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
          <div>Showing 1–10 of 12 Visa Categories</div>
          <div className="flex items-center gap-1 font-mono font-bold">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#2563EB] text-white rounded-lg">1</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">2</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CENTERED POPUP VIEW MODAL: VISA CATEGORY DETAILS (5 TABS AS IN WIREFRAME) */}
      {activeModalCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{activeModalCategory.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalCategory.categoryName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
                      {activeModalCategory.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activeModalCategory.description}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalCategory(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {[
                { id: "general", label: "General Information", icon: Layers },
                { id: "processing", label: "Processing Details", icon: Clock },
                { id: "countries", label: "Applicable Countries", icon: Globe },
                { id: "docs", label: "Required Documents", icon: FileText },
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
                    Category Overview
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Category Name</span>
                      <strong className="text-slate-900 font-bold">{activeModalCategory.categoryName}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Category Code</span>
                      <strong className="text-[#2563EB] font-mono font-bold">{activeModalCategory.code}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Display Order</span>
                      <strong className="text-slate-900 font-mono font-bold">{activeModalCategory.displayOrder}</strong>
                    </div>
                    <div className="sm:col-span-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Description</span>
                      <strong className="text-slate-900 font-medium">{activeModalCategory.description}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROCESSING DETAILS */}
              {modalTab === "processing" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Processing Speed & Validity Parameters
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Processing Time</span>
                      <strong className="text-slate-900 font-mono font-bold text-sm">{activeModalCategory.processingTime}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Visa Validity</span>
                      <strong className="text-[#2563EB] font-mono font-bold text-xs">{activeModalCategory.visaValidity}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Stay Duration</span>
                      <strong className="text-slate-900 font-mono font-bold text-xs">{activeModalCategory.stayDuration}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Entry Type</span>
                      <div className="flex flex-wrap gap-1 justify-center mt-1">
                        {activeModalCategory.entryType.map((et, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-50 text-[#2563EB] font-bold text-[10px] rounded">
                            {et}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: APPLICABLE COUNTRIES */}
              {modalTab === "countries" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Countries Supporting This Category ({activeModalCategory.applicableCountriesCount})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeModalCategory.applicableCountries.map((c, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        <Globe size={13} className="text-[#2563EB]" /> {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: REQUIRED DOCUMENTS */}
              {modalTab === "docs" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Mandatory & Supporting Document Checklist
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeModalCategory.requiredDocuments.map((doc, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <span className="font-bold text-slate-800">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: STATISTICS */}
              {modalTab === "stats" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Performance Metrics & Fee Revenue
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Received</span>
                      <strong className="text-slate-900 text-lg font-mono font-black">{activeModalCategory.stats.received}</strong>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-700 font-extrabold uppercase block">Approved</span>
                      <strong className="text-emerald-800 text-lg font-mono font-black">{activeModalCategory.stats.approved}</strong>
                    </div>
                    <div className="bg-red-50 p-3 rounded-2xl border border-red-200">
                      <span className="text-[10px] text-red-700 font-extrabold uppercase block">Rejected</span>
                      <strong className="text-red-800 text-lg font-mono font-black">{activeModalCategory.stats.rejected}</strong>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                      <span className="text-[10px] text-amber-700 font-extrabold uppercase block">Pending</span>
                      <strong className="text-amber-800 text-lg font-mono font-black">{activeModalCategory.stats.pending}</strong>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200 sm:col-span-1 col-span-2">
                      <span className="text-[10px] text-[#2563EB] font-extrabold uppercase block">Revenue</span>
                      <strong className="text-[#2563EB] text-sm font-mono font-black">{activeModalCategory.stats.revenue}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(activeModalCategory)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  activeModalCategory.status === "Active"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {activeModalCategory.status === "Active" ? "Deactivate Category" : "Activate Category"}
              </button>

              <button
                onClick={() => openEditForm(activeModalCategory)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 size={14} /> Edit Category Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT NEW VISA CATEGORY MODAL (EXACT FORM FROM WIREFRAME) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-black font-outfit flex items-center gap-2">
                <Layers size={18} />
                <span>{editingCategory ? `Edit Category: ${editingCategory.categoryName}` : "Add New Visa Category"}</span>
              </h3>

              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCategory(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* MODAL FORM BODY */}
            <form onSubmit={handleSaveCategory} className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE]">
              {/* SECTION 1: BASIC INFORMATION */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.categoryName}
                      onChange={(e) => {
                        const selectedVal = e.target.value;
                        const matchedPreset = VISAOS_PRESET_CATEGORIES.find((p) => p.name === selectedVal);
                        setFormData({
                          ...formData,
                          categoryName: selectedVal,
                          categoryCode: matchedPreset ? matchedPreset.code : formData.categoryCode,
                          icon: matchedPreset ? matchedPreset.icon : formData.icon
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-bold"
                    >
                      <option value="">Select Category Name...</option>
                      {VISAOS_PRESET_CATEGORIES.map((preset, idx) => (
                        <option key={idx} value={preset.name}>
                          {preset.icon} {preset.name} ({preset.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Category Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TV"
                      value={formData.categoryCode}
                      onChange={(e) => setFormData({ ...formData, categoryCode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono uppercase"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="Leisure travel, vacation, sightseeing..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: VISA DETAILS */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Visa Processing & Entry Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Processing Time
                    </label>
                    <input
                      type="text"
                      placeholder="5–15 Days"
                      value={formData.processingTime}
                      onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Visa Validity
                    </label>
                    <input
                      type="text"
                      placeholder="6 Months"
                      value={formData.visaValidity}
                      onChange={(e) => setFormData({ ...formData, visaValidity: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Stay Duration
                    </label>
                    <input
                      type="text"
                      placeholder="90 Days"
                      value={formData.stayDuration}
                      onChange={(e) => setFormData({ ...formData, stayDuration: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Entry Type Allowed
                    </label>
                    <div className="space-y-1 pt-1">
                      {["Single Entry", "Double Entry", "Multiple Entry"].map((et) => (
                        <label key={et} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={formData.entryTypes.includes(et)}
                            onChange={() => {
                              if (formData.entryTypes.includes(et)) {
                                setFormData({ ...formData, entryTypes: formData.entryTypes.filter((t) => t !== et) });
                              } else {
                                setFormData({ ...formData, entryTypes: [...formData.entryTypes, et] });
                              }
                            }}
                            className="rounded border-slate-300 text-[#2563EB]"
                          />
                          <span>{et}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: APPLICABLE COUNTRIES (CHECKBOXES) */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Applicable Countries
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Canada", "Australia", "United Kingdom", "United States", "Germany", "France", "Japan", "UAE"].map((cnt) => {
                    const checked = formData.selectedCountries.includes(cnt);
                    return (
                      <label
                        key={cnt}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition text-xs font-semibold ${
                          checked
                            ? "bg-blue-50/80 border-blue-300 text-[#2563EB]"
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
                                selectedCountries: formData.selectedCountries.filter((c) => c !== cnt)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selectedCountries: [...formData.selectedCountries, cnt]
                              });
                            }
                          }}
                          className="rounded border-slate-300 text-[#2563EB]"
                        />
                        <span>{cnt}</span>
                      </label>
                    );
                  })}
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
                    "Bank Statement",
                    "Travel Insurance",
                    "Invitation Letter",
                    "Employment Letter",
                    "University Admission Letter",
                    "Medical Certificate",
                    "Police Clearance Certificate",
                    "Other Documents"
                  ].map((doc) => {
                    const checked = formData.selectedDocs.includes(doc);
                    return (
                      <label
                        key={doc}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition text-xs font-semibold ${
                          checked
                            ? "bg-emerald-50/80 border-emerald-300 text-emerald-800"
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
                          className="rounded border-slate-300 text-emerald-600"
                        />
                        <span>{doc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 5: FEE DETAILS */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Fee Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Visa Fee (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="6,500"
                      value={formData.startingFee}
                      onChange={(e) => setFormData({ ...formData, startingFee: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Service Fee (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="1,200"
                      value={formData.serviceFee}
                      onChange={(e) => setFormData({ ...formData, serviceFee: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Additional Charges (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="500"
                      value={formData.additionalCharges}
                      onChange={(e) => setFormData({ ...formData, additionalCharges: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Tax (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="18%"
                      value={formData.tax}
                      onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                    />
                  </div>
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
                  {editingCategory ? "Save Category Changes" : "Create Visa Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
