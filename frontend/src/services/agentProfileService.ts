import { API_V1_URL } from "../config/api";

export interface AgentProfileData {
  agentId: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  altPhone: string;
  dob: string;
  gender: string;
  nationality: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  agencyName: string;
  agencyRegNo: string;
  businessLicense: string;
  gstTaxNo: string;
  officeAddress: string;
  officeCity: string;
  officeState: string;
  website: string;
  yearsInBusiness: string;
  employeeCount: string;
  monthlyCapacity: string;
  commissionType: string;
  commissionValue: number;
  status: string;
  avatarUrl: string | null;
  twoFactorEnabled: boolean;
  idleTimeoutMinutes: number;
  role: "Agent";
  createdAt?: string;
}

export interface AgentSecurityLogItem {
  time: string;
  device: string;
  ip: string;
  location: string;
  status: "Success" | "Failed" | "Revoked" | string;
}

/**
 * Fetch the currently authenticated agent's own profile.
 * Sends JWT Bearer token and/or agentId identifier.
 */
export async function fetchAgentProfileApi(token?: string, agentId?: string): Promise<AgentProfileData | null> {
  try {
    const url = agentId
      ? `${API_V1_URL}/agent/profile?agentId=${encodeURIComponent(agentId)}`
      : `${API_V1_URL}/agent/profile`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (agentId) {
      headers["x-agent-id"] = agentId;
    }

    const res = await fetch(url, { headers });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.agentId) {
          localStorage.setItem(`phantom_agent_profile_${json.data.agentId}`, JSON.stringify(json.data));
        }
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Could not fetch agent profile from server:", err);
  }

  // Fallback to localStorage cache if network fails
  if (agentId) {
    try {
      const cached = localStorage.getItem(`phantom_agent_profile_${agentId}`);
      if (cached) return JSON.parse(cached);
    } catch (_e) {}
  }
  return null;
}

/**
 * Update the authenticated agent's own profile fields.
 */
export async function updateAgentProfileApi(
  payload: Partial<AgentProfileData>,
  token?: string,
  agentId?: string
): Promise<{ success: boolean; message: string; data?: AgentProfileData }> {
  try {
    const effectiveAgentId = agentId || payload.agentId;
    const url = effectiveAgentId
      ? `${API_V1_URL}/agent/profile?agentId=${encodeURIComponent(effectiveAgentId)}`
      : `${API_V1_URL}/agent/profile`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (effectiveAgentId) {
      headers["x-agent-id"] = effectiveAgentId;
    }

    const res = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify({ ...payload, agentId: effectiveAgentId })
    });
    const json = await res.json();
    if (json.success) {
      if (json.data?.agentId) {
        localStorage.setItem(`phantom_agent_profile_${json.data.agentId}`, JSON.stringify(json.data));
      }
      return { success: true, message: json.message || "Profile updated.", data: json.data };
    }
    return { success: false, message: json.message || "Failed to update profile." };
  } catch (err: any) {
    return { success: false, message: err.message || "Network error." };
  }
}

/**
 * Fetch this agent's real login and security activity logs.
 */
export async function fetchAgentSecurityLogsApi(token?: string, agentId?: string): Promise<AgentSecurityLogItem[]> {
  try {
    const url = agentId
      ? `${API_V1_URL}/agent/security-logs?agentId=${encodeURIComponent(agentId)}`
      : `${API_V1_URL}/agent/security-logs`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (agentId) {
      headers["x-agent-id"] = agentId;
    }

    const res = await fetch(url, { headers });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data?.logs) {
        return json.data.logs;
      }
    }
  } catch (err) {
    console.warn("Could not fetch agent security logs:", err);
  }
  return [];
}

/**
 * Change the agent's own password.
 */
export async function changeAgentPasswordApi(
  payload: { currentPassword: string; newPassword: string; confirmPassword: string },
  token: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_V1_URL}/agent/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    return { success: res.ok && json.success, message: json.message || (res.ok ? "Password changed." : "Failed.") };
  } catch (err: any) {
    return { success: false, message: err.message || "Network error." };
  }
}

/**
 * Export security audit CSV for this agent's own logs.
 */
export function exportAgentSecurityAuditLogs(logs: AgentSecurityLogItem[], agentName: string = "Agent"): void {
  const headers = ["Timestamp", "Device / Browser", "IP Address", "Location", "Status", "Agent"];
  const rows = logs.map((log) => [
    `"${log.time}"`,
    `"${log.device}"`,
    `"${log.ip}"`,
    `"${log.location}"`,
    `"${log.status}"`,
    `"${agentName} (Agent)"`
  ]);
  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Agent_Security_Audit_${agentName.replace(/ /g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
