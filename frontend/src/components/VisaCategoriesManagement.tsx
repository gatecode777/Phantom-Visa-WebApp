import React, { useState, useEffect } from "react";
import {
  Layers,
  Search,
  PlusCircle,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit3,
  RefreshCw,
  X,
  Plus
} from "lucide-react";
import { API_V1_URL } from "../config/api";

interface Category {
  _id: string;
  name: string;
  code: string;
  description: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export default function VisaCategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Toast message
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    status: "Active" as "Active" | "Inactive"
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Categories from Backend API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_V1_URL}/visa/categories`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCategories(json.data);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      status: "Active"
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      code: cat.code,
      description: cat.description || "",
      status: cat.status
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Form Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Category name is required.";
    if (!formData.code.trim()) {
      errors.code = "Category code is required (e.g. CAT-TV-01).";
    } else if (formData.code.trim().length < 3) {
      errors.code = "Category code must be at least 3 characters.";
    }
    if (!formData.description.trim()) errors.description = "Category description is required.";

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
        description: formData.description.trim(),
        status: formData.status
      };

      const url = editingCategory
        ? `${API_V1_URL}/visa/categories/${editingCategory._id}`
        : `${API_V1_URL}/visa/categories`;

      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        triggerToast(json.error?.message || "Failed to save category.");
      } else {
        triggerToast(editingCategory ? "Visa category updated successfully!" : "New visa category created!");
        setIsAddModalOpen(false);
        fetchCategories();
      }
    } catch (err) {
      triggerToast("Error communicating with server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Category
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_V1_URL}/visa/categories/${id}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.success) {
        triggerToast("Visa category deleted successfully.");
        setDeleteConfirmId(null);
        fetchCategories();
      } else {
        triggerToast(json.error?.message || "Failed to delete category.");
      }
    } catch (err) {
      triggerToast("Failed to delete category.");
    }
  };

  // Filter Categories
  const filtered = categories.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = categories.filter((c) => c.status === "Active").length;
  const inactiveCount = categories.filter((c) => c.status === "Inactive").length;

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
      <div className="bg-gradient-to-r from-[#2563EB] to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-blue-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-200 font-mono tracking-wider uppercase mb-1">
            <Layers size={14} />
            <span>Global Visa Taxonomy Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit">Visa Categories</h1>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            Create, manage, and update global visa classification taxonomies available across applications.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-white text-[#2563EB] hover:bg-blue-50 font-bold text-xs px-4 py-3 rounded-2xl flex items-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer shrink-0"
        >
          <PlusCircle size={16} />
          <span>Add New Visa Category</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Categories</p>
            <h3 className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">{categories.length}</h3>
            <span className="text-[10px] text-slate-500">Configured Taxonomies</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
            <Layers size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Active Categories</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 font-outfit mt-1">{activeCount}</h3>
            <span className="text-[10px] text-emerald-600 font-bold">Live in System</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Inactive Categories</p>
            <h3 className="text-2xl font-extrabold text-amber-600 font-outfit mt-1">{inactiveCount}</h3>
            <span className="text-[10px] text-amber-600 font-bold">Disabled Taxonomies</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <XCircle size={20} />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by category name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>

          <button
            onClick={fetchCategories}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition"
            title="Refresh list"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <RefreshCw size={24} className="animate-spin mx-auto text-[#2563EB]" />
            <p className="text-xs font-semibold">Loading Visa Categories from MongoDB...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <AlertCircle size={28} className="mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No Visa Categories Found</p>
            <p className="text-xs text-slate-500">Try adjusting search query or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Category Code</th>
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filtered.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                      {cat.code}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {cat.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-sm truncate">
                      {cat.description || "N/A"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          cat.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {cat.status === "Active" ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        {cat.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-lg transition"
                          title="Edit Category"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(cat._id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                          title="Delete Category"
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

      {/* Add / Edit Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 font-outfit">
                {editingCategory ? "Edit Visa Category" : "Add New Visa Category"}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tourist Visa"
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
                  Category Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. CAT-TV-01"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className={`w-full bg-slate-50 border text-slate-800 font-mono font-bold px-3 py-2.5 rounded-xl focus:outline-none ${
                    formErrors.code ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#2563EB]"
                  }`}
                />
                {formErrors.code && <p className="text-[10px] text-red-600 font-bold mt-1">{formErrors.code}</p>}
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter detailed scope and usage of this visa category..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className={`w-full bg-slate-50 border text-slate-800 px-3 py-2.5 rounded-xl focus:outline-none ${
                    formErrors.description ? "border-red-500 bg-red-50/20" : "border-slate-200 focus:border-[#2563EB]"
                  }`}
                />
                {formErrors.description && <p className="text-[10px] text-red-600 font-bold mt-1">{formErrors.description}</p>}
              </div>

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

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <span>{editingCategory ? "Update Category" : "Save Category"}</span>
                  )}
                </button>
              </div>
            </form>
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
              <h3 className="text-base font-extrabold text-slate-900 font-outfit">Delete Visa Category?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this category from MongoDB? This action cannot be undone.
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
