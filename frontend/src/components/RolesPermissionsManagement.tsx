import React, { useState } from "react";
import {
  ShieldCheck,
  Shield,
  PlusCircle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Check,
  X,
  Lock,
  Unlock,
  Users,
  Layers,
  Sparkles,
  FileSpreadsheet,
  Download,
  Printer,
  Copy,
  Zap,
  Key,
  Award,
  FileText
} from "lucide-react";

export interface RoleRecord {
  roleId: string;
  roleName: string;
  usersAssigned: number;
  permissionsCount: number;
  status: string;
  lastUpdated: string;
  isSystem: boolean;
}

export interface PermissionMatrixRow {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
  export: boolean;
}

export const ROLE_WORKFLOW = [
  "Role Created",
  "Module Access Selected",
  "Permissions Assigned",
  "Role Saved to Database",
  "Users Assigned to Role",
  "Access Matrix Applied"
];

export const ROLE_FEATURES = [
  "Role-based Access Control (RBAC)",
  "Custom Role Creation",
  "Granular Module Access",
  "Full Permission Audit Trail",
  "Access Control Enforcement",
  "User Role Assignment",
  "Dynamic Permission Matrix",
  "Access Control Exporting"
];

const MOCK_ROLES: RoleRecord[] = [
  { roleId: "ROLE-01", roleName: "Super Admin", usersAssigned: 2, permissionsCount: 112, status: "Active", lastUpdated: "12/05/2026", isSystem: true },
  { roleId: "ROLE-02", roleName: "Admin", usersAssigned: 12, permissionsCount: 96, status: "Active", lastUpdated: "10/05/2026", isSystem: true },
  { roleId: "ROLE-03", roleName: "Visa Officer", usersAssigned: 45, permissionsCount: 48, status: "Active", lastUpdated: "08/05/2026", isSystem: true },
  { roleId: "ROLE-04", roleName: "Agent", usersAssigned: 420, permissionsCount: 28, status: "Active", lastUpdated: "12/05/2026", isSystem: true },
  { roleId: "ROLE-05", roleName: "Applicant", usersAssigned: 18450, permissionsCount: 12, status: "Active", lastUpdated: "01/01/2026", isSystem: true }
];

const MOCK_MATRIX: PermissionMatrixRow[] = [
  { module: "Applications", view: true, create: true, edit: true, delete: true, approve: true, export: true },
  { module: "Payments", view: true, create: false, edit: true, delete: false, approve: true, export: true },
  { module: "Agents", view: true, create: true, edit: true, delete: false, approve: true, export: true },
  { module: "Reports & Analytics", view: true, create: false, edit: false, delete: false, approve: false, export: true },
  { module: "Settings", view: true, create: false, edit: true, delete: false, approve: false, export: false }
];

export default function RolesPermissionsManagement() {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Create Role Modal / Form State
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // UI Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    triggerToast(`Role '${newRoleName}' created successfully.`);
    setNewRoleName("");
    setNewRoleDesc("");
    setShowCreateModal(false);
  };

  const handleExportMatrix = () => {
    triggerToast("Exported system permission matrix to Excel.");
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
            <ShieldCheck size={15} />
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
              Settings &bull; Access Control & RBAC Matrix
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
            Roles & Permissions
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Configure system user roles, access control levels, and granular permissions for staff and administrators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportMatrix}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-md transition cursor-pointer flex items-center gap-1.5 border border-white/20"
          >
            <Download size={15} /> Export Matrix
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <PlusCircle size={15} /> Create New Role
          </button>
        </div>
      </div>

      {/* TOP METRICS DASHBOARD (6 CARDS MATCHING WIREFRAME) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Total Roles</span>
          <div className="text-2xl font-black text-slate-900 font-mono">8</div>
          <span className="text-[10px] text-[#2563EB] font-bold">System & Custom</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">Active Users</span>
          <div className="text-2xl font-black text-slate-900 font-mono">18,929</div>
          <span className="text-[10px] text-emerald-600 font-bold">Assigned Roles</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-purple-600 block mb-1">Custom Roles</span>
          <div className="text-2xl font-black text-slate-900 font-mono">3</div>
          <span className="text-[10px] text-purple-600 font-bold">User Defined</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-blue-600 block mb-1">System Roles</span>
          <div className="text-2xl font-black text-slate-900 font-mono">5</div>
          <span className="text-[10px] text-blue-600 font-bold">Core Access</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">System Modules</span>
          <div className="text-2xl font-black text-slate-900 font-mono">14</div>
          <span className="text-[10px] text-teal-600 font-bold">Secured Modules</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs hover:shadow-md transition">
          <span className="text-[10px] font-extrabold uppercase text-indigo-600 block mb-1">Total Permissions</span>
          <div className="text-2xl font-black text-slate-900 font-mono">112</div>
          <span className="text-[10px] text-indigo-600 font-bold">Defined Privileges</span>
        </div>
      </div>

      {/* ROLES TABLE & PERMISSION MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* ROLES TABLE */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-outfit">
              <Shield size={16} className="text-[#2563EB]" /> Configured System & Custom Roles
            </h3>
            <div className="relative w-48">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                  <th className="pb-2">Role Name</th>
                  <th className="pb-2 text-center">Users Assigned</th>
                  <th className="pb-2 text-center">Permissions</th>
                  <th className="pb-2 text-center">Status</th>
                  <th className="pb-2 text-center">Last Updated</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {MOCK_ROLES.map((r) => (
                  <tr key={r.roleId} className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                      <Shield size={14} className="text-[#2563EB]" />
                      <span>{r.roleName}</span>
                    </td>
                    <td className="py-2.5 text-center font-mono font-bold text-slate-900">{r.usersAssigned.toLocaleString()}</td>
                    <td className="py-2.5 text-center font-mono font-bold text-blue-700">{r.permissionsCount} Rights</td>
                    <td className="py-2.5 text-center">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">🟢 {r.status}</span>
                    </td>
                    <td className="py-2.5 text-center font-mono text-[11px] text-slate-500">{r.lastUpdated}</td>
                    <td className="py-2.5 text-right space-x-1">
                      <button
                        onClick={() => triggerToast(`Viewing details for ${r.roleName}`)}
                        className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#2563EB] rounded-lg transition"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => triggerToast(`Editing permissions for ${r.roleName}`)}
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

        {/* PERMISSION MATRIX SNAPSHOT */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2 flex items-center gap-2">
            <Key size={16} className="text-purple-600" /> Admin Permission Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-[9px] text-slate-400 font-bold uppercase border-b border-slate-100">
                  <th className="pb-2">Module</th>
                  <th className="pb-2 text-center">View</th>
                  <th className="pb-2 text-center">Edit</th>
                  <th className="pb-2 text-center">Approve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {MOCK_MATRIX.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 font-bold text-slate-800">{m.module}</td>
                    <td className="py-2 text-center text-emerald-600 font-bold">{m.view ? "✓" : "✗"}</td>
                    <td className="py-2 text-center text-emerald-600 font-bold">{m.edit ? "✓" : "✗"}</td>
                    <td className="py-2 text-center text-emerald-600 font-bold">{m.approve ? "✓" : "✗"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RECOMMENDATION BOX */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-5 space-y-2 mb-6">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-outfit flex items-center gap-2 border-b border-blue-100 pb-2">
          <ShieldCheck size={16} className="text-[#2563EB]" /> Professional Recommendation
        </h3>
        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
          The Roles & Permissions page manages Role-Based Access Control (RBAC) across the visa platform. Define custom staff roles, restrict module access (Applications, Payments, Settings), assign granular permissions (View, Edit, Delete, Approve, Export), and maintain a strict audit log of security changes.
        </p>
      </div>

      {/* CREATE ROLE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 font-outfit flex items-center gap-2">
                <PlusCircle size={16} className="text-[#2563EB]" /> Create Custom System Role
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateRoleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Role Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Finance Auditor"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Role Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe responsibility and access scope..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs p-3 rounded-xl focus:outline-none focus:border-[#2563EB] font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition shadow-md"
                >
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
