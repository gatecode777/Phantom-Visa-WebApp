import React, { useState, useEffect } from "react";
import {
  Globe,
  Search,
  PlusCircle,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit3,
  RefreshCw,
  X,
  Eye,
  Sparkles,
  Layers,
  FileText,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { API_V1_URL } from "../config/api";

interface CountryRecord {
  _id: string;
  countryId: string;
  name: string;
  code: string;
  flag: string;
  continent: string;
  capital?: string;
  currency?: string;
  timeZone?: string;
  visaAvailable: boolean;
  processingTime: string;
  startingFee: number;
  availableCategories: string[];
  availableVisaTypes: string[];
  requiredDocuments: string[];
  status: "Active" | "Inactive";
  createdAt: string;
}

interface VisaTypeObject {
  _id: string;
  name: string;
  categoryName: string;
}

export default function CountriesManagement() {
  const [countries, setCountries] = useState<CountryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("All");
  const [continentFilter, setContinentFilter] = useState<string>("All");

  // ImageKit Upload state
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  // Dynamic lists fetched from backend API for modal checkboxes
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
  const [visaTypeObjects, setVisaTypeObjects] = useState<VisaTypeObject[]>([]);
  const [dynamicDocs, setDynamicDocs] = useState<string[]>([]);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewCountry, setViewCountry] = useState<CountryRecord | null>(null);
  const [editingCountry, setEditingCountry] = useState<CountryRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    flag: "🌐",
    continent: "Asia",
    capital: "",
    currency: "USD ($)",
    timeZone: "GMT+0",
    visaAvailable: true,
    processingTime: "15 Days",
    startingFee: 8500,
    selectedCategories: [] as string[],
    selectedVisaTypes: [] as string[],
    selectedDocs: [] as string[],
    status: "Active" as "Active" | "Inactive"
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Image Upload directly to ImageKit via Backend API
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch(`${API_V1_URL}/countries/upload-flag`, {
        method: "POST",
        body: data
      });

      const json = await res.json();
      if (res.ok && json.success && json.data?.url) {
        setFormData((prev) => ({ ...prev, flag: json.data.url }));
        triggerToast("Image uploaded to ImageKit successfully!");
      } else {
        triggerToast(json.error?.message || "Failed to upload image to ImageKit.");
      }
    } catch (err) {
      triggerToast("Error uploading image to ImageKit.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Fetch Countries & Dynamic Checkbox Options from Backend APIs
  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, catRes, vtRes, vrRes] = await Promise.all([
        fetch(`${API_V1_URL}/countries`),
        fetch(`${API_V1_URL}/visa/categories`),
        fetch(`${API_V1_URL}/visa/types`),
        fetch(`${API_V1_URL}/visa/requirements`)
      ]);

      const cJson = await cRes.json();
      const catJson = await catRes.json();
      const vtJson = await vtRes.json();
      const vrJson = await vrRes.json();

      if (cJson.success && Array.isArray(cJson.data)) {
        setCountries(cJson.data);
      }

      // Populate dynamic Visa Categories
      if (catJson.success && Array.isArray(catJson.data)) {
        const catNames: string[] = Array.from(new Set(catJson.data.map((c: any) => String(c.name))));
        if (catNames.length > 0) setDynamicCategories(catNames);
        else setDynamicCategories(["Tourist Visa", "Business Visa", "Student & Study Visa", "Work & Employment Permit", "Transit & Airport Transfer"]);
      } else {
        setDynamicCategories(["Tourist Visa", "Business Visa", "Student & Study Visa", "Work & Employment Permit", "Transit & Airport Transfer"]);
      }

      // Populate dynamic Visa Type Objects with parent category tracking
      if (vtJson.success && Array.isArray(vtJson.data)) {
        const parsedObjects: VisaTypeObject[] = vtJson.data.map((t: any) => ({
          _id: String(t._id),
          name: String(t.name),
          categoryName: String(t.categoryName || "")
        }));
        setVisaTypeObjects(parsedObjects);
      } else {
        setVisaTypeObjects([
          { _id: "1", name: "Schengen Tourist (Multiple Entry)", categoryName: "Tourist Visa" },
          { _id: "2", name: "US B1/B2 Tourist & Business", categoryName: "Tourist Visa" },
          { _id: "3", name: "UK Standard Visitor Visa", categoryName: "Tourist Visa" },
          { _id: "4", name: "France Business Fast-Track", categoryName: "Business Visa" }
        ]);
      }

      // Populate dynamic Requirement Documents
      if (vrJson.success && Array.isArray(vrJson.data)) {
        const docTitles: string[] = Array.from(new Set(vrJson.data.map((r: any) => String(r.title))));
        if (docTitles.length > 0) setDynamicDocs(docTitles);
        else setDynamicDocs(["Passport", "Passport Photograph", "Bank Statement", "Travel Insurance", "Flight Booking", "Hotel Booking", "Invitation Letter", "Employment Letter", "Other Documents"]);
      } else {
        setDynamicDocs(["Passport", "Passport Photograph", "Bank Statement", "Travel Insurance", "Flight Booking", "Hotel Booking", "Invitation Letter", "Employment Letter", "Other Documents"]);
      }
    } catch (err) {
      console.error("Failed to load country data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const defaultCategoryList = dynamicCategories.length > 0
    ? dynamicCategories
    : ["Tourist Visa", "Business Visa", "Student & Study Visa", "Work & Employment Permit", "Transit & Airport Transfer"];

  const defaultDocList = dynamicDocs.length > 0
    ? dynamicDocs
    : ["Passport", "Passport Photograph", "Bank Statement", "Travel Insurance", "Flight Booking", "Hotel Booking", "Invitation Letter", "Employment Letter", "Other Documents"];

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingCountry(null);
    const initialCategories = ["Tourist Visa", "Business Visa"];
    setFormData({
      name: "",
      code: "",
      flag: "🌐",
      continent: "Asia",
      capital: "",
      currency: "USD ($)",
      timeZone: "GMT+0",
      visaAvailable: true,
      processingTime: "15 Days",
      startingFee: 8500,
      selectedCategories: initialCategories,
      selectedVisaTypes: ["Schengen Tourist (Multiple Entry)", "US B1/B2 Tourist & Business"],
      selectedDocs: ["Passport", "Passport Photograph", "Bank Statement", "Travel Insurance"],
      status: "Active"
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (c: CountryRecord) => {
    setEditingCountry(c);
    setFormData({
      name: c.name,
      code: c.code,
      flag: c.flag || "🌐",
      continent: c.continent || "Asia",
      capital: c.capital || "",
      currency: c.currency || "USD ($)",
      timeZone: c.timeZone || "GMT+0",
      visaAvailable: c.visaAvailable,
      processingTime: c.processingTime || "15 Days",
      startingFee: c.startingFee || 8500,
      selectedCategories: c.availableCategories || [],
      selectedVisaTypes: c.availableVisaTypes || [],
      selectedDocs: c.requiredDocuments || [],
      status: c.status
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Toggle Category Checkbox Selection & Cascade Filter Visa Types
  const toggleCategory = (catName: string) => {
    setFormData((prev) => {
      const exists = prev.selectedCategories.includes(catName);
      const updatedCategories = exists
        ? prev.selectedCategories.filter((c) => c !== catName)
        : [...prev.selectedCategories, catName];

      const updatedVisaTypes = prev.selectedVisaTypes.filter((typeTitle) => {
        const typeObj = visaTypeObjects.find((vt) => vt.name === typeTitle);
        if (typeObj && typeObj.categoryName) {
          return updatedCategories.includes(typeObj.categoryName);
        }
        return true;
      });

      return {
        ...prev,
        selectedCategories: updatedCategories,
        selectedVisaTypes: updatedVisaTypes
      };
    });
  };

  // Toggle Visa Type Checkbox Selection
  const toggleVisaType = (typeName: string) => {
    setFormData((prev) => {
      const exists = prev.selectedVisaTypes.includes(typeName);
      const updated = exists
        ? prev.selectedVisaTypes.filter((t) => t !== typeName)
        : [...prev.selectedVisaTypes, typeName];
      return { ...prev, selectedVisaTypes: updated };
    });
  };

  // Toggle Document Checkbox Selection
  const toggleDoc = (docName: string) => {
    setFormData((prev) => {
      const exists = prev.selectedDocs.includes(docName);
      const updated = exists
        ? prev.selectedDocs.filter((d) => d !== docName)
        : [...prev.selectedDocs, docName];
      return { ...prev, selectedDocs: updated };
    });
  };

  // Validate Form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Country name is required.";
    if (!formData.code.trim()) {
      errors.code = "Country Code (e.g. CAN, AUS, DEU) is required.";
    } else if (formData.code.trim().length < 2 || formData.code.trim().length > 3) {
      errors.code = "Country Code must be 2 or 3 letters (e.g. CA or CAN).";
    }

    if (!formData.startingFee || Number(formData.startingFee) < 0) {
      errors.startingFee = "Starting visa fee must be a valid positive amount.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Form (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        flag: formData.flag.trim() || "🌐",
        continent: formData.continent,
        capital: formData.capital.trim(),
        currency: formData.currency,
        timeZone: formData.timeZone,
        visaAvailable: formData.visaAvailable,
        processingTime: formData.processingTime.trim(),
        startingFee: Number(formData.startingFee),
        availableCategories: formData.selectedCategories,
        availableVisaTypes: formData.selectedVisaTypes,
        requiredDocuments: formData.selectedDocs,
        status: formData.status
      };

      const url = editingCountry
        ? `${API_V1_URL}/countries/${editingCountry._id}`
        : `${API_V1_URL}/countries`;

      const method = editingCountry ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        triggerToast(json.error?.message || "Failed to save country.");
      } else {
        triggerToast(editingCountry ? "Country updated successfully!" : "New destination country added!");
        setIsAddModalOpen(false);
        fetchData();
      }
    } catch (err) {
      triggerToast("Error communicating with server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Country
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_V1_URL}/countries/${id}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.success) {
        triggerToast("Destination country deleted successfully.");
        setDeleteConfirmId(null);
        fetchData();
      } else {
        triggerToast(json.error?.message || "Failed to delete country.");
      }
    } catch (err) {
      triggerToast("Failed to delete country.");
    }
  };

  // Filtered List
  const filtered = countries.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.continent && c.continent.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "All" || c.status === statusFilter;

    const matchesAvailability =
      availabilityFilter === "All" ||
      (availabilityFilter === "Available" && c.visaAvailable) ||
      (availabilityFilter === "Unavailable" && !c.visaAvailable);

    const matchesContinent = continentFilter === "All" || c.continent === continentFilter;

    return matchesSearch && matchesStatus && matchesAvailability && matchesContinent;
  });

  const activeCount = countries.filter((c) => c.status === "Active").length;
  const inactiveCount = countries.filter((c) => c.status === "Inactive").length;

  // Filter available visa types dynamically based on selectedCategories
  const filteredVisaTypeObjects = visaTypeObjects.filter((vt) =>
    formData.selectedCategories.includes(vt.categoryName)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-3">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-blue-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-200 font-mono tracking-wider uppercase mb-1">
            <Globe size={14} />
            <span>Destination Country Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit">Countries</h1>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            Manage destination countries, visa categories, visa types, and application status.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-white text-[#2563EB] hover:bg-blue-50 font-bold text-xs px-4 py-3 rounded-2xl flex items-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer shrink-0"
        >
          <PlusCircle size={16} />
          <span>Add New Country</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Countries</p>
            <h3 className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">{countries.length}</h3>
            <span className="text-[10px] text-blue-600 font-bold">Global Destinations Portfolio</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
            <Globe size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Active Countries</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 font-outfit mt-1">{activeCount}</h3>
            <span className="text-[10px] text-emerald-600 font-bold">Open for Visa Applications</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Inactive Countries</p>
            <h3 className="text-2xl font-extrabold text-red-600 font-outfit mt-1">{inactiveCount}</h3>
            <span className="text-[10px] text-red-600 font-bold">Temporarily Paused Processing</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <XCircle size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">New Countries Added</p>
            <h3 className="text-2xl font-extrabold text-amber-600 font-outfit mt-1">{countries.length > 5 ? 5 : countries.length}</h3>
            <span className="text-[10px] text-amber-600 font-bold">Added This Quarter</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles size={20} />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
            <Search size={14} className="text-[#2563EB]" /> Search & Multi-Criteria Filters
          </h3>
          <span className="text-slate-400 text-[11px] font-mono">Showing {filtered.length} of {countries.length} Countries</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by (Name, Code, Continent)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>

          <div>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
            >
              <option value="All">All Availability</option>
              <option value="Available">Yes (Available)</option>
              <option value="Unavailable">No (Unavailable)</option>
            </select>
          </div>

          <div>
            <select
              value={continentFilter}
              onChange={(e) => setContinentFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
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

      {/* Countries Data Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <RefreshCw size={24} className="animate-spin mx-auto text-[#2563EB]" />
            <p className="text-xs font-semibold">Loading Destination Countries from MongoDB...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <AlertCircle size={28} className="mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No Countries Found</p>
            <p className="text-xs text-slate-500">Try adjusting your filters or click "+ Add New Country".</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Country ID</th>
                  <th className="py-3.5 px-4">Flag / Image</th>
                  <th className="py-3.5 px-4">Country Name</th>
                  <th className="py-3.5 px-4">Country Code</th>
                  <th className="py-3.5 px-4">Visa Categories</th>
                  <th className="py-3.5 px-4">Visa Types</th>
                  <th className="py-3.5 px-4">Processing Time</th>
                  <th className="py-3.5 px-4">Starting Fee</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {c.countryId}
                    </td>
                    <td className="py-3.5 px-4">
                      {c.flag && (c.flag.startsWith("http://") || c.flag.startsWith("https://")) ? (
                        <img
                          src={c.flag}
                          alt={c.name}
                          className="w-8 h-6 object-cover rounded shadow-xs border border-slate-200"
                        />
                      ) : (
                        <span className="text-lg">{c.flag || "🌐"}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-extrabold text-slate-900">{c.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{c.continent}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {c.code}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      <span className="px-2 py-1 bg-[#2563EB]/10 text-[#2563EB] rounded-lg font-mono text-[11px] font-extrabold">
                        {c.availableCategories ? c.availableCategories.length : 0} Categories
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-mono text-[11px] font-bold">
                        {c.availableVisaTypes ? c.availableVisaTypes.length : 0} Types
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">
                      {c.processingTime || "15 Days"}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">
                      ₹{(c.startingFee || 8500).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          c.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewCountry(c)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-lg transition"
                          title="Edit Country"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(c._id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                          title="Delete Country"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Country Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Header Banner */}
            <div className="bg-[#2563EB] text-white -mx-6 -mt-6 p-5 rounded-t-3xl flex items-center justify-between">
              <div className="flex items-center gap-2 font-outfit">
                <Globe size={20} />
                <h3 className="text-base font-extrabold">
                  {editingCountry ? `Edit Country: ${editingCountry.name}` : "Add New Country"}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* SECTION 1: BASIC INFORMATION */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-800 text-xs border-b border-slate-100 pb-1.5 uppercase tracking-wider text-[10px]">
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
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className={`w-full bg-slate-50 border text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none ${
                        formErrors.name ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#2563EB]"
                      }`}
                    />
                    {formErrors.name && <p className="text-[10px] text-red-600 font-bold mt-1">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Country Code <span className="text-red-500">*</span> (e.g. CAN)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CAN"
                      maxLength={3}
                      value={formData.code}
                      onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      className={`w-full bg-slate-50 border text-slate-800 font-mono font-bold px-3 py-2.5 rounded-xl focus:outline-none ${
                        formErrors.code ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#2563EB]"
                      }`}
                    />
                    {formErrors.code && <p className="text-[10px] text-red-600 font-bold mt-1">{formErrors.code}</p>}
                  </div>

                  {/* ImageKit Upload Field */}
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Flag / Image (ImageKit)
                    </label>
                    <div className="flex items-center gap-2">
                      {formData.flag && (formData.flag.startsWith("http://") || formData.flag.startsWith("https://")) ? (
                        <div className="relative shrink-0 group">
                          <img
                            src={formData.flag}
                            alt="Flag Preview"
                            className="w-10 h-8 object-cover rounded-lg border border-slate-300 shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, flag: "🌐" }))}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 text-[9px] hover:bg-red-600"
                            title="Remove image"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ) : (
                        <input
                          type="text"
                          placeholder="🇨🇦 or Emoji"
                          value={formData.flag}
                          onChange={(e) => setFormData((prev) => ({ ...prev, flag: e.target.value }))}
                          className="w-16 bg-slate-50 border border-slate-200 text-slate-800 text-center text-sm py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      )}

                      <label className="flex-1 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-[#2563EB] font-bold text-xs px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition">
                        {isUploadingImage ? (
                          <>
                            <RefreshCw size={14} className="animate-spin text-[#2563EB]" />
                            <span className="text-[11px]">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={14} />
                            <span className="text-[11px]">Upload ImageKit</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingImage}
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Continent <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.continent}
                      onChange={(e) => setFormData((prev) => ({ ...prev, continent: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                    >
                      <option value="Asia">Asia</option>
                      <option value="Europe">Europe</option>
                      <option value="North America">North America</option>
                      <option value="South America">South America</option>
                      <option value="Africa">Africa</option>
                      <option value="Oceania">Oceania</option>
                      <option value="Antarctica">Antarctica</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Currency
                    </label>
                    <input
                      type="text"
                      placeholder="USD ($)"
                      value={formData.currency}
                      onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Time Zone
                    </label>
                    <input
                      type="text"
                      placeholder="GMT+0"
                      value={formData.timeZone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, timeZone: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: VISA INFORMATION */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-800 text-xs border-b border-slate-100 pb-1.5 uppercase tracking-wider text-[10px]">
                  Visa Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Visa Available <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.visaAvailable ? "Yes" : "No"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, visaAvailable: e.target.value === "Yes" }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-bold"
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
                      onChange={(e) => setFormData((prev) => ({ ...prev, processingTime: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Starting Visa Fee (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="8500"
                      value={formData.startingFee}
                      onChange={(e) => setFormData((prev) => ({ ...prev, startingFee: Number(e.target.value) }))}
                      className={`w-full bg-slate-50 border text-slate-800 font-mono font-bold px-3 py-2.5 rounded-xl focus:outline-none ${
                        formErrors.startingFee ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#2563EB]"
                      }`}
                    />
                    {formErrors.startingFee && <p className="text-[10px] text-red-600 font-bold mt-1">{formErrors.startingFee}</p>}
                  </div>
                </div>
              </div>

              {/* SECTION 3: AVAILABLE VISA CATEGORIES (DYNAMIC CHECKBOXES) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <h4 className="font-extrabold text-[#2563EB] text-xs uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Layers size={12} /> Step 1: Available Visa Categories
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">Select categories supported for this country</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {defaultCategoryList.map((cat) => {
                    const isChecked = formData.selectedCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-2 transition cursor-pointer ${
                          isChecked
                            ? "bg-blue-50/80 border-[#2563EB] text-[#2563EB] font-extrabold ring-1 ring-[#2563EB]/20"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#2563EB] rounded accent-[#2563EB]"
                        />
                        <span className="truncate">{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 4: AVAILABLE VISA TYPES (DEPENDENT ON SELECTED CATEGORIES) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <h4 className="font-extrabold text-indigo-700 text-xs uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <FileText size={12} /> Step 2: Available Visa Types
                  </h4>
                  <span className="text-[10px] text-indigo-500 font-mono">
                    {formData.selectedCategories.length > 0
                      ? `Filtered by (${formData.selectedCategories.length}) selected category(ies)`
                      : "Select a Category above first"}
                  </span>
                </div>

                {formData.selectedCategories.length === 0 ? (
                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-amber-800 text-xs flex items-center gap-2.5 animate-in fade-in">
                    <AlertCircle size={16} className="text-amber-600 shrink-0" />
                    <span>Please select at least one <strong>Visa Category</strong> above to reveal available Visa Types.</span>
                  </div>
                ) : filteredVisaTypeObjects.length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-xs flex items-center gap-2.5 animate-in fade-in">
                    <AlertCircle size={16} className="text-slate-400 shrink-0" />
                    <span>No specific Visa Types configured under the selected category(ies). You can create new Visa Types in Visa Management menu.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 animate-in fade-in">
                    {filteredVisaTypeObjects.map((vt) => {
                      const isChecked = formData.selectedVisaTypes.includes(vt.name);
                      return (
                        <button
                          type="button"
                          key={vt._id || vt.name}
                          onClick={() => toggleVisaType(vt.name)}
                          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                            isChecked
                              ? "bg-indigo-50/80 border-indigo-600 text-indigo-700 font-extrabold ring-1 ring-indigo-600/20"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                          }`}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="w-4 h-4 text-indigo-600 rounded accent-indigo-600 shrink-0"
                            />
                            <span className="truncate text-xs font-extrabold">{vt.name}</span>
                          </div>
                          {vt.categoryName && (
                            <span className="text-[9px] font-mono text-indigo-500/80 pl-6 mt-0.5 truncate">
                              {vt.categoryName}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION 5: REQUIRED DOCUMENTS (DYNAMIC CHECKBOXES) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <h4 className="font-extrabold text-emerald-700 text-xs uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <CheckCircle2 size={12} /> Required Documents
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">Select mandatory documentation</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {defaultDocList.map((doc) => {
                    const isChecked = formData.selectedDocs.includes(doc);
                    return (
                      <button
                        type="button"
                        key={doc}
                        onClick={() => toggleDoc(doc)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-2 transition cursor-pointer ${
                          isChecked
                            ? "bg-emerald-50/80 border-emerald-500 text-emerald-700 font-extrabold ring-1 ring-emerald-500/20"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-emerald-600 rounded accent-emerald-600"
                        />
                        <span className="truncate">{doc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 6: STATUS */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as "Active" | "Inactive" }))}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#2563EB] font-bold"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <span>{editingCountry ? "Update Country" : "Create New Country"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Country Details Modal */}
      {viewCountry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                {viewCountry.flag && (viewCountry.flag.startsWith("http://") || viewCountry.flag.startsWith("https://")) ? (
                  <img src={viewCountry.flag} alt={viewCountry.name} className="w-9 h-7 object-cover rounded border border-slate-200" />
                ) : (
                  <span className="text-2xl">{viewCountry.flag}</span>
                )}
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-outfit">{viewCountry.name}</h3>
                  <span className="text-xs font-mono text-[#2563EB] font-bold">{viewCountry.code} | {viewCountry.continent}</span>
                </div>
              </div>
              <button
                onClick={() => setViewCountry(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                <div><span className="text-slate-400">Processing Time:</span> <strong>{viewCountry.processingTime}</strong></div>
                <div><span className="text-slate-400">Starting Fee:</span> <strong>₹{(viewCountry.startingFee || 8500).toLocaleString("en-IN")}</strong></div>
                <div><span className="text-slate-400">Currency:</span> <strong>{viewCountry.currency || "USD ($)"}</strong></div>
                <div><span className="text-slate-400">Time Zone:</span> <strong>{viewCountry.timeZone || "GMT+0"}</strong></div>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-1">Available Visa Categories:</p>
                <div className="flex flex-wrap gap-1">
                  {viewCountry.availableCategories && viewCountry.availableCategories.length > 0 ? (
                    viewCountry.availableCategories.map((cat) => (
                      <span key={cat} className="px-2.5 py-1 bg-[#2563EB]/10 text-[#2563EB] rounded-lg font-extrabold text-[11px]">
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">None selected</span>
                  )}
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-1">Available Visa Types:</p>
                <div className="flex flex-wrap gap-1">
                  {viewCountry.availableVisaTypes && viewCountry.availableVisaTypes.length > 0 ? (
                    viewCountry.availableVisaTypes.map((t) => (
                      <span key={t} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-semibold text-[11px]">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">None selected</span>
                  )}
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-1">Required Documents:</p>
                <div className="flex flex-wrap gap-1">
                  {viewCountry.requiredDocuments && viewCountry.requiredDocuments.length > 0 ? (
                    viewCountry.requiredDocuments.map((d) => (
                      <span key={d} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-semibold text-[11px]">
                        ✓ {d}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">None selected</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setViewCountry(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-outfit">Delete Country?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this destination country from MongoDB? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
