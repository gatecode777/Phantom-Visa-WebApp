import { API_V1_URL } from "../config/api";

export interface AdminProfileData {
  id?: string;
  adminId: string;
  name: string;
  firstName: string;
  lastName: string;
  designation: string;
  gender: string;
  dob: string;
  nationality: string;
  email: string;
  phone: string;
  mobile: string;
  altPhone: string;
  city: string;
  address: string;
  avatarUrl: string | null;
  twoFactorEnabled: boolean;
  twoFactorSecret: string;
  idleTimeoutMinutes: number;
  role: string;
  employeeId: string;
  createdAt?: string;
}

export interface AdminSecurityLogItem {
  time: string;
  device: string;
  ip: string;
  location: string;
  status: "Success" | "Failed" | string;
}

/**
 * Fetch Super Admin profile details
 */
export async function fetchAdminProfileApi(): Promise<AdminProfileData | null> {
  try {
    const res = await fetch(`${API_V1_URL}/admin/profile`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        localStorage.setItem("phantom_admin_profile", JSON.stringify(json.data));
        if (json.data.avatarUrl) {
          localStorage.setItem("phantom_admin_avatar", json.data.avatarUrl);
        }
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Could not fetch server admin profile:", err);
  }

  // Graceful local storage fallback
  try {
    const saved = localStorage.getItem("phantom_admin_profile");
    if (saved) return JSON.parse(saved);
  } catch {}

  return null;
}

/**
 * Update Super Admin profile details with server persistence
 */
export async function updateAdminProfileApi(payload: Partial<AdminProfileData>): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const res = await fetch(`${API_V1_URL}/admin/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success && json.data) {
      localStorage.setItem("phantom_admin_profile", JSON.stringify(json.data));
      if (json.data.avatarUrl) {
        localStorage.setItem("phantom_admin_avatar", json.data.avatarUrl);
      }
      window.dispatchEvent(new CustomEvent("phantom_admin_profile_updated", { detail: json.data }));
      return { success: true, message: json.message || "Profile updated successfully.", data: json.data };
    }
    return { success: false, message: json.message || "Failed to update profile." };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to reach server endpoint." };
  }
}

/**
 * Fetch genuine authentication & security logs for the Super Admin
 */
export async function fetchAdminSecurityLogsApi(): Promise<AdminSecurityLogItem[]> {
  try {
    const res = await fetch(`${API_V1_URL}/admin/security-logs`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data?.logs) {
        return json.data.logs;
      }
    }
  } catch (err) {
    console.warn("Could not fetch server security logs:", err);
  }

  return [];
}

/**
 * Toggle 2FA security configuration
 */
export async function toggle2FAApi(enabled: boolean, code?: string): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const res = await fetch(`${API_V1_URL}/admin/toggle-2fa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled, code })
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to update 2FA configuration." };
  }
}

/**
 * Change Super Admin password
 */
export async function changeAdminPasswordApi(payload: { currentPassword?: string; newPassword: string; confirmPassword: string }): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_V1_URL}/admin/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to update password." };
  }
}

/**
 * Export structured CSV audit trail of security logs
 */
export function exportSecurityAuditLogs(logs: AdminSecurityLogItem[], adminName: string = "Admin"): void {
  const headers = ["Timestamp", "Device / Browser", "IP Address", "Location", "Status", "Admin User"];
  const rows = logs.map((log) => [
    `"${log.time}"`,
    `"${log.device}"`,
    `"${log.ip}"`,
    `"${log.location}"`,
    `"${log.status}"`,
    `"${adminName} (Super Admin)"`
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Security_Audit_ADM9001_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
