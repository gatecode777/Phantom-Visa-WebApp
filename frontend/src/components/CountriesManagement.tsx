import React, { useState } from "react";
import {
  Globe,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  CreditCard,
  FileText,
  Download,
  Building,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Layers,
  Sparkles,
  TrendingUp,
  MapPin
} from "lucide-react";

export interface CountryRecord {
  id: string;
  countryId: string;
  flag: string;
  countryName: string;
  countryCode: string;
  continent: string;
  capital: string;
  currency: string;
  language: string;
  timeZone: string;
  visaAvailable: boolean;
  visaTypesCount: number;
  processingTime: string;
  minProcessingDays: number;
  maxProcessingDays: number;
  startingFee: string;
  serviceCharge: string;
  status: "Active" | "Inactive";
  availableVisaTypes: string[];
  requiredDocuments: string[];
  stats: {
    received: number;
    approved: number;
    rejected: number;
    pending: number;
    revenue: string;
  };
}

const MOCK_COUNTRIES: CountryRecord[] = [
  {
    id: "1",
    countryId: "CNT-001",
    flag: "🇨🇦",
    countryName: "Canada",
    countryCode: "CAN",
    continent: "North America",
    capital: "Ottawa",
    currency: "CAD ($)",
    language: "English / French",
    timeZone: "GMT-5 (EST)",
    visaAvailable: true,
    visaTypesCount: 6,
    processingTime: "15 Days",
    minProcessingDays: 10,
    maxProcessingDays: 20,
    startingFee: "8,500",
    serviceCharge: "1,500",
    status: "Active",
    availableVisaTypes: [
      "Tourist Visa",
      "Business Visa",
      "Student Visa",
      "Work Visa",
      "Transit Visa",
      "Dependent Visa"
    ],
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "Bank Statement",
      "Travel Insurance",
      "Flight Booking",
      "Hotel Booking",
      "Employment Letter"
    ],
    stats: {
      received: 1240,
      approved: 1120,
      rejected: 45,
      pending: 75,
      revenue: "₹1,05,40,000"
    }
  },
  {
    id: "2",
    countryId: "CNT-002",
    flag: "🇦🇺",
    countryName: "Australia",
    countryCode: "AUS",
    continent: "Oceania",
    capital: "Canberra",
    currency: "AUD ($)",
    language: "English",
    timeZone: "GMT+10 (AEST)",
    visaAvailable: true,
    visaTypesCount: 5,
    processingTime: "20 Days",
    minProcessingDays: 14,
    maxProcessingDays: 25,
    startingFee: "9,200",
    serviceCharge: "1,800",
    status: "Active",
    availableVisaTypes: [
      "Tourist Visa",
      "Business Visa",
      "Student Visa",
      "Work Visa",
      "Dependent Visa"
    ],
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "Bank Statement",
      "Travel Insurance",
      "Flight Booking",
      "Invitation Letter"
    ],
    stats: {
      received: 980,
      approved: 890,
      rejected: 35,
      pending: 55,
      revenue: "₹90,16,000"
    }
  },
  {
    id: "3",
    countryId: "CNT-003",
    flag: "🇬🇧",
    countryName: "United Kingdom",
    countryCode: "GBR",
    continent: "Europe",
    capital: "London",
    currency: "GBP (£)",
    language: "English",
    timeZone: "GMT+0 (BST)",
    visaAvailable: true,
    visaTypesCount: 7,
    processingTime: "10 Days",
    minProcessingDays: 7,
    maxProcessingDays: 15,
    startingFee: "10,000",
    serviceCharge: "2,000",
    status: "Active",
    availableVisaTypes: [
      "Tourist Visa",
      "Business Visa",
      "Student Visa",
      "Work Visa",
      "Medical Visa",
      "Transit Visa",
      "Dependent Visa"
    ],
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "Bank Statement",
      "Travel Insurance",
      "Hotel Booking",
      "Employment Letter"
    ],
    stats: {
      received: 1450,
      approved: 1310,
      rejected: 60,
      pending: 80,
      revenue: "₹1,45,000,000"
    }
  },
  {
    id: "4",
    countryId: "CNT-004",
    flag: "🇺🇸",
    countryName: "United States",
    countryCode: "USA",
    continent: "North America",
    capital: "Washington, D.C.",
    currency: "USD ($)",
    language: "English",
    timeZone: "GMT-5 (EST)",
    visaAvailable: true,
    visaTypesCount: 8,
    processingTime: "25 Days",
    minProcessingDays: 15,
    maxProcessingDays: 35,
    startingFee: "12,400",
    serviceCharge: "2,500",
    status: "Active",
    availableVisaTypes: [
      "Tourist Visa",
      "Business Visa",
      "Student Visa",
      "Work Visa",
      "Medical Visa",
      "Transit Visa",
      "Dependent Visa"
    ],
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "Bank Statement",
      "Travel Insurance",
      "Invitation Letter",
      "Employment Letter"
    ],
    stats: {
      received: 1890,
      approved: 1650,
      rejected: 120,
      pending: 120,
      revenue: "₹2,34,36,000"
    }
  },
  {
    id: "5",
    countryId: "CNT-005",
    flag: "🇩🇪",
    countryName: "Germany",
    countryCode: "DEU",
    continent: "Europe",
    capital: "Berlin",
    currency: "EUR (€)",
    language: "German",
    timeZone: "GMT+1 (CET)",
    visaAvailable: false,
    visaTypesCount: 4,
    processingTime: "14 Days",
    minProcessingDays: 10,
    maxProcessingDays: 18,
    startingFee: "8,000",
    serviceCharge: "1,200",
    status: "Inactive",
    availableVisaTypes: [
      "Tourist Visa",
      "Business Visa",
      "Student Visa",
      "Work Visa"
    ],
    requiredDocuments: [
      "Passport",
      "Passport Photograph",
      "Bank Statement",
      "Travel Insurance",
      "Flight Booking"
    ],
    stats: {
      received: 420,
      approved: 380,
      rejected: 15,
      pending: 25,
      revenue: "₹33,60,000"
    }
  }
];

export default function CountriesManagement() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [visaAvailabilityFilter, setVisaAvailabilityFilter] = useState("All");
  const [continentFilter, setContinentFilter] = useState("All");

  // Country Records State
  const [countries, setCountries] = useState<CountryRecord[]>(MOCK_COUNTRIES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Centered Modal View State
  const [activeModalCountry, setActiveModalCountry] = useState<CountryRecord | null>(null);
  const [modalTab, setModalTab] = useState<"general" | "summary" | "stats">("general");

  // Add / Edit Country Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState<CountryRecord | null>(null);

  const [formData, setFormData] = useState({
    countryName: "",
    countryCode: "",
    flag: "🌐",
    continent: "Asia",
    currency: "USD ($)",
    timeZone: "GMT+0",
    officialLanguage: "English",
    visaAvailable: true,
    processingTime: "15 Days",
    minProcessingDays: 10,
    maxProcessingDays: 20,
    startingFee: "8,500",
    serviceCharge: "1,500",
    status: "Active" as "Active" | "Inactive",
    selectedVisaTypes: [
      "Tourist Visa",
      "Business Visa",
      "Student Visa",
      "Work Visa"
    ],
    selectedRequiredDocs: [
      "Passport",
      "Passport Photograph",
      "Bank Statement",
      "Travel Insurance",
      "Flight Booking"
    ]
  });

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Logic
  const filteredCountries = countries.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      c.countryName.toLowerCase().includes(q) ||
      c.countryCode.toLowerCase().includes(q) ||
      c.continent.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesVisaAvail =
      visaAvailabilityFilter === "All" ||
      (visaAvailabilityFilter === "Available" ? c.visaAvailable : !c.visaAvailable);
    const matchesContinent = continentFilter === "All" || c.continent === continentFilter;

    return matchesQuery && matchesStatus && matchesVisaAvail && matchesContinent;
  });

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredCountries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCountries.map((c) => c.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handleToggleStatus = (country: CountryRecord) => {
    const newStatus = country.status === "Active" ? "Inactive" : "Active";
    setCountries((prev) =>
      prev.map((c) => (c.id === country.id ? { ...c, status: newStatus } : c))
    );
    triggerToast(`Country ${country.countryName} updated to ${newStatus}.`);
  };

  const handleDeleteCountry = (country: CountryRecord) => {
    setCountries((prev) => prev.filter((c) => c.id !== country.id));
    triggerToast(`Country ${country.countryName} deleted successfully.`);
    if (activeModalCountry?.id === country.id) setActiveModalCountry(null);
  };

  const handleBulkActivate = () => {
    setCountries((prev) =>
      prev.map((c) => (selectedIds.includes(c.id) ? { ...c, status: "Active" } : c))
    );
    triggerToast(`${selectedIds.length} countries activated.`);
    setSelectedIds([]);
  };

  const handleBulkDeactivate = () => {
    setCountries((prev) =>
      prev.map((c) => (selectedIds.includes(c.id) ? { ...c, status: "Inactive" } : c))
    );
    triggerToast(`${selectedIds.length} countries deactivated.`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setCountries((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    triggerToast(`${selectedIds.length} countries deleted.`);
    setSelectedIds([]);
  };

  // Open Edit Form
  const openEditForm = (country: CountryRecord) => {
    setEditingCountry(country);
    setFormData({
      countryName: country.countryName,
      countryCode: country.countryCode,
      flag: country.flag,
      continent: country.continent,
      currency: country.currency,
      timeZone: country.timeZone,
      officialLanguage: country.language,
      visaAvailable: country.visaAvailable,
      processingTime: country.processingTime,
      minProcessingDays: country.minProcessingDays,
      maxProcessingDays: country.maxProcessingDays,
      startingFee: country.startingFee,
      serviceCharge: country.serviceCharge,
      status: country.status,
      selectedVisaTypes: country.availableVisaTypes,
      selectedRequiredDocs: country.requiredDocuments
    });
    setShowAddModal(true);
  };

  // Save Country (Add or Edit)
  const handleSaveCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.countryName || !formData.countryCode) {
      triggerToast("Please provide Country Name and Country Code.");
      return;
    }

    if (editingCountry) {
      setCountries((prev) =>
        prev.map((c) =>
          c.id === editingCountry.id
            ? {
                ...c,
                countryName: formData.countryName,
                countryCode: formData.countryCode.toUpperCase(),
                flag: formData.flag,
                continent: formData.continent,
                currency: formData.currency,
                timeZone: formData.timeZone,
                language: formData.officialLanguage,
                visaAvailable: formData.visaAvailable,
                processingTime: formData.processingTime,
                minProcessingDays: formData.minProcessingDays,
                maxProcessingDays: formData.maxProcessingDays,
                startingFee: formData.startingFee,
                serviceCharge: formData.serviceCharge,
                status: formData.status,
                availableVisaTypes: formData.selectedVisaTypes,
                requiredDocuments: formData.selectedRequiredDocs,
                visaTypesCount: formData.selectedVisaTypes.length
              }
            : c
        )
      );
      triggerToast(`Country ${formData.countryName} updated successfully.`);
    } else {
      const newCountry: CountryRecord = {
        id: Date.now().toString(),
        countryId: `CNT-00${countries.length + 1}`,
        flag: formData.flag || "🌐",
        countryName: formData.countryName,
        countryCode: formData.countryCode.toUpperCase(),
        continent: formData.continent,
        capital: "Capital City",
        currency: formData.currency,
        language: formData.officialLanguage,
        timeZone: formData.timeZone,
        visaAvailable: formData.visaAvailable,
        visaTypesCount: formData.selectedVisaTypes.length,
        processingTime: formData.processingTime,
        minProcessingDays: formData.minProcessingDays,
        maxProcessingDays: formData.maxProcessingDays,
        startingFee: formData.startingFee,
        serviceCharge: formData.serviceCharge,
        status: formData.status,
        availableVisaTypes: formData.selectedVisaTypes,
        requiredDocuments: formData.selectedRequiredDocs,
        stats: {
          received: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
          revenue: "₹0"
        }
      };
      setCountries((prev) => [newCountry, ...prev]);
      triggerToast(`New Country ${formData.countryName} added successfully.`);
    }

    setShowAddModal(false);
    setEditingCountry(null);
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
            <Globe size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Global Visa Destination Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Countries
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Manage destination countries, visa availability, processing details, and application status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingCountry(null);
              setFormData({
                countryName: "",
                countryCode: "",
                flag: "🌐",
                continent: "Asia",
                currency: "USD ($)",
                timeZone: "GMT+0",
                officialLanguage: "English",
                visaAvailable: true,
                processingTime: "15 Days",
                minProcessingDays: 10,
                maxProcessingDays: 20,
                startingFee: "8,500",
                serviceCharge: "1,500",
                status: "Active",
                selectedVisaTypes: ["Tourist Visa", "Business Visa", "Student Visa", "Work Visa"],
                selectedRequiredDocs: ["Passport", "Passport Photograph", "Bank Statement", "Travel Insurance"]
              });
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-white text-[#2563EB] hover:bg-blue-50 text-xs font-black rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle size={16} /> Add New Country
          </button>
        </div>
      </div>

      {/* TOP STATISTICS CARDS (4 CARDS AS IN WIREFRAME) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
              Total Countries
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
              <Globe size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">65</div>
          <span className="text-[11px] text-[#2563EB] font-semibold mt-1 inline-block">
            Global Destinations Portfolio
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
              Active Countries
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">58</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            Open for Visa Applications
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
              Inactive Countries
            </span>
            <div className="w-9 h-9 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <XCircle size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">7</div>
          <span className="text-[11px] text-red-600 font-semibold mt-1 inline-block">
            Temporarily Paused Processing
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider font-outfit">
              New Countries Added
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">5</div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">
            Added This Quarter
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
            Showing {filteredCountries.length} of {countries.length} Countries
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {/* SEARCH BY KEYWORD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Search By (Name, Code, Continent)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Canada, CAN, Europe..."
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

          {/* VISA AVAILABILITY FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Visa Availability
            </label>
            <select
              value={visaAvailabilityFilter}
              onChange={(e) => setVisaAvailabilityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Availability</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          {/* CONTINENT FILTER */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
              Continent
            </label>
            <select
              value={continentFilter}
              onChange={(e) => setContinentFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] transition font-semibold"
            >
              <option value="All">All Continents</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="North America">North America</option>
              <option value="South America">South America</option>
              <option value="Africa">Africa</option>
              <option value="Oceania">Oceania</option>
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
            <span>Countries Selected</span>
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
              onClick={() => triggerToast(`Exporting data for ${selectedIds.length} countries.`)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Download size={14} /> Export Countries
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

      {/* COUNTRIES TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold font-outfit uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredCountries.length && filteredCountries.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Country ID</th>
                <th className="py-3.5 px-4 text-center">Flag</th>
                <th className="py-3.5 px-4">Country Name</th>
                <th className="py-3.5 px-4">Country Code</th>
                <th className="py-3.5 px-4 text-center">Visa Types</th>
                <th className="py-3.5 px-4">Processing Time</th>
                <th className="py-3.5 px-4 font-mono">Starting Fee</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredCountries.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Globe size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-slate-600">No countries found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredCountries.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c.id)}
                        onChange={() => handleToggleSelect(c.id)}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {c.countryId}
                    </td>
                    <td className="py-3.5 px-4 text-center text-xl">
                      {c.flag}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {c.countryName}
                      <span className="block text-[10px] text-slate-400 font-normal">{c.continent}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {c.countryCode}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                      {c.visaTypesCount} Types
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {c.processingTime}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ₹{c.startingFee}
                    </td>
                    <td className="py-3.5 px-4">
                      {c.status === "Active" ? (
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
                            setActiveModalCountry(c);
                            setModalTab("general");
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openEditForm(c)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title="Edit Country"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(c)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            c.status === "Active"
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-amber-600 hover:bg-amber-50"
                          }`}
                          title={c.status === "Active" ? "Deactivate" : "Activate"}
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteCountry(c)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Country"
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
          <div>Showing 1–10 of 65 Countries</div>
          <div className="flex items-center gap-1 font-mono font-bold">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-40">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#2563EB] text-white rounded-lg">1</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">2</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">3</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">4</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CENTERED POPUP VIEW MODAL: COUNTRY DETAILS (3 TABS) */}
      {activeModalCountry && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{activeModalCountry.flag}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-outfit text-white">
                      {activeModalCountry.countryName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700">
                      {activeModalCountry.countryCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activeModalCountry.continent} &bull; Capital: {activeModalCountry.capital}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalCountry(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB BAR WITH LIGHT-BLUE SLIM SCROLLBAR */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-100">
              {[
                { id: "general", label: "General Information", icon: Globe },
                { id: "summary", label: "Visa Summary", icon: FileText },
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
                    Country Metadata & Locale
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Country Name</span>
                      <strong className="text-slate-900 font-bold">{activeModalCountry.countryName}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Country Code (ISO)</span>
                      <strong className="text-[#2563EB] font-mono font-bold">{activeModalCountry.countryCode}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Continent</span>
                      <strong className="text-slate-900 font-bold">{activeModalCountry.continent}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Capital City</span>
                      <strong className="text-slate-900 font-bold">{activeModalCountry.capital}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Currency</span>
                      <strong className="text-slate-900 font-mono font-bold">{activeModalCountry.currency}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-0.5">Time Zone</span>
                      <strong className="text-slate-900 font-mono">{activeModalCountry.timeZone}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VISA SUMMARY */}
              {modalTab === "summary" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Visa Availability & Requirements Summary
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Available Visa Types</span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeModalCountry.availableVisaTypes.map((vt, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 text-[11px]">
                            {vt}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Required Documents</span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeModalCountry.requiredDocuments.map((doc, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-blue-50 text-[#2563EB] border border-blue-200 rounded-lg font-bold text-[11px]">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Avg Processing</span>
                      <strong className="text-slate-900 font-mono font-bold text-sm">{activeModalCountry.processingTime}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Starting Fee</span>
                      <strong className="text-slate-900 font-mono font-bold text-sm">₹{activeModalCountry.startingFee}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Service Charge</span>
                      <strong className="text-slate-900 font-mono font-bold text-sm">₹{activeModalCountry.serviceCharge}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: STATISTICS */}
              {modalTab === "stats" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                    Application Metrics & Revenue
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Received</span>
                      <strong className="text-slate-900 text-lg font-mono font-black">{activeModalCountry.stats.received}</strong>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-700 font-extrabold uppercase block">Approved</span>
                      <strong className="text-emerald-800 text-lg font-mono font-black">{activeModalCountry.stats.approved}</strong>
                    </div>
                    <div className="bg-red-50 p-3 rounded-2xl border border-red-200">
                      <span className="text-[10px] text-red-700 font-extrabold uppercase block">Rejected</span>
                      <strong className="text-red-800 text-lg font-mono font-black">{activeModalCountry.stats.rejected}</strong>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                      <span className="text-[10px] text-amber-700 font-extrabold uppercase block">Pending</span>
                      <strong className="text-amber-800 text-lg font-mono font-black">{activeModalCountry.stats.pending}</strong>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200 sm:col-span-1 col-span-2">
                      <span className="text-[10px] text-[#2563EB] font-extrabold uppercase block">Revenue</span>
                      <strong className="text-[#2563EB] text-sm font-mono font-black">{activeModalCountry.stats.revenue}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(activeModalCountry)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  activeModalCountry.status === "Active"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {activeModalCountry.status === "Active" ? "Deactivate Country" : "Activate Country"}
              </button>

              <button
                onClick={() => openEditForm(activeModalCountry)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 size={14} /> Edit Country Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT NEW COUNTRY MODAL (EXACT FORM FROM WIREFRAME) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-black font-outfit flex items-center gap-2">
                <Globe size={18} />
                <span>{editingCountry ? `Edit Country: ${editingCountry.countryName}` : "Add New Country"}</span>
              </h3>

              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCountry(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* MODAL FORM BODY */}
            <form onSubmit={handleSaveCountry} className="p-6 overflow-y-auto flex-1 text-xs space-y-6 [scrollbar-width:thin] [scrollbar-color:#3B82F6_#DBEAFE]">
              {/* SECTION 1: BASIC INFORMATION */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Country Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Canada"
                      value={formData.countryName}
                      onChange={(e) => setFormData({ ...formData, countryName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Country Code (ISO) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CAN"
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Country Flag (Emoji / Symbol)
                    </label>
                    <input
                      type="text"
                      placeholder="🇨🇦"
                      value={formData.flag}
                      onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Continent
                    </label>
                    <select
                      value={formData.continent}
                      onChange={(e) => setFormData({ ...formData, continent: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                    >
                      <option value="Asia">Asia</option>
                      <option value="Europe">Europe</option>
                      <option value="North America">North America</option>
                      <option value="South America">South America</option>
                      <option value="Africa">Africa</option>
                      <option value="Oceania">Oceania</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Currency
                    </label>
                    <input
                      type="text"
                      placeholder="CAD ($)"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Time Zone
                    </label>
                    <input
                      type="text"
                      placeholder="GMT-5 (EST)"
                      value={formData.timeZone}
                      onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: VISA INFORMATION */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Visa Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Visa Available
                    </label>
                    <select
                      value={formData.visaAvailable ? "Yes" : "No"}
                      onChange={(e) => setFormData({ ...formData, visaAvailable: e.target.value === "Yes" })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl font-bold"
                    >
                      <option value="Yes">Yes (Available)</option>
                      <option value="No">No (Unavailable)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Processing Time
                    </label>
                    <input
                      type="text"
                      placeholder="15 Days"
                      value={formData.processingTime}
                      onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Starting Visa Fee (₹)
                    </label>
                    <input
                      type="text"
                      placeholder="8,500"
                      value={formData.startingFee}
                      onChange={(e) => setFormData({ ...formData, startingFee: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: AVAILABLE VISA TYPES (CHECKBOXES) */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Available Visa Types
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    "Tourist Visa",
                    "Business Visa",
                    "Student Visa",
                    "Work Visa",
                    "Medical Visa",
                    "Transit Visa",
                    "Dependent Visa"
                  ].map((vType) => {
                    const checked = formData.selectedVisaTypes.includes(vType);
                    return (
                      <label
                        key={vType}
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
                                selectedVisaTypes: formData.selectedVisaTypes.filter((t) => t !== vType)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selectedVisaTypes: [...formData.selectedVisaTypes, vType]
                              });
                            }
                          }}
                          className="rounded border-slate-300 text-[#2563EB]"
                        />
                        <span>{vType}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 4: REQUIRED DOCUMENTS (CHECKBOXES) */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
                  Required Documents
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    "Passport",
                    "Passport Photograph",
                    "Bank Statement",
                    "Travel Insurance",
                    "Flight Booking",
                    "Hotel Booking",
                    "Invitation Letter",
                    "Employment Letter",
                    "Other Documents"
                  ].map((doc) => {
                    const checked = formData.selectedRequiredDocs.includes(doc);
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
                                selectedRequiredDocs: formData.selectedRequiredDocs.filter((d) => d !== doc)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selectedRequiredDocs: [...formData.selectedRequiredDocs, doc]
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
                  {editingCountry ? "Save Country Changes" : "Create New Country"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
