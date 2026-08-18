import { API_V1_URL } from "../config/api";

export interface SystemHealthData {
  status: string;
  serverOnline: boolean;
  platformVersion: string;
  nodeVersion: string;
  databaseDriver: string;
  dbStatus: string;
  dbStatusCode: number;
  memory: {
    heapUsedMb: number;
    heapTotalMb: number;
    rssMb: number;
    hostTotalGb: number;
    hostUsedGb: number;
    hostFreeGb: number;
    hostUsedPercent: number;
  };
  uptimeSeconds: number;
  osInfo: {
    type: string;
    platform: string;
    release: string;
    arch: string;
    cpuCores: number;
  };
  timestamp: string;
}

/**
 * Format uptime seconds to human readable string (e.g. "1h 45m 12s" or "2d 4h")
 */
export function formatUptime(seconds: number): string {
  if (!seconds || seconds <= 0) return "0s";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

/**
 * Fetch real system health telemetry from backend
 */
export async function fetchSystemHealth(): Promise<SystemHealthData> {
  try {
    const res = await fetch(`${API_V1_URL}/system/health`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn("Failed to fetch system telemetry:", err);
  }

  // Graceful fallback showing disconnected backend state
  return {
    status: "Degraded / Backend Offline",
    serverOnline: false,
    platformVersion: "v4.2.1-stable",
    nodeVersion: "v18.16.0 (Client Offline)",
    databaseDriver: "MongoDB (Disconnected)",
    dbStatus: "Disconnected",
    dbStatusCode: 0,
    memory: {
      heapUsedMb: 42,
      heapTotalMb: 128,
      rssMb: 85,
      hostTotalGb: 16.0,
      hostUsedGb: 8.2,
      hostFreeGb: 7.8,
      hostUsedPercent: 51
    },
    uptimeSeconds: 0,
    osInfo: {
      type: "Windows_NT",
      platform: "win32",
      release: "10.0.22631",
      arch: "x64",
      cpuCores: 8
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Trigger genuine SMTP connectivity test
 */
export async function testSmtpConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_V1_URL}/system/test-smtp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to reach server SMTP diagnostic endpoint."
    };
  }
}

/**
 * Clear platform cache
 */
export async function clearPlatformCache(): Promise<{ success: boolean; message: string }> {
  // Clear non-auth local storage caches
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.includes("auth") && !key.includes("token") && !key.includes("session")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {}

  try {
    const res = await fetch(`${API_V1_URL}/system/clear-cache`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: true,
      message: "Client cache cleared successfully. Server backend offline."
    };
  }
}

/**
 * Fetch global system settings & branding from backend
 */
export async function fetchSystemSettings(): Promise<any> {
  try {
    const res = await fetch(`${API_V1_URL}/system/settings`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.logoUrl) {
          localStorage.setItem("phantom_custom_logo", json.data.logoUrl);
          window.dispatchEvent(new CustomEvent("phantom_logo_updated", { detail: { url: json.data.logoUrl } }));
        }
        if (json.data.faviconUrl) {
          localStorage.setItem("phantom_custom_favicon", json.data.faviconUrl);
          window.dispatchEvent(new CustomEvent("phantom_favicon_updated", { detail: { url: json.data.faviconUrl } }));
        }
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Could not fetch server system settings:", err);
  }
  return null;
}

/**
 * Update global system settings & branding on backend
 */
export async function updateSystemSettings(payload: any): Promise<any> {
  try {
    const res = await fetch(`${API_V1_URL}/system/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success && json.data) {
      if (json.data.logoUrl) {
        localStorage.setItem("phantom_custom_logo", json.data.logoUrl);
        window.dispatchEvent(new CustomEvent("phantom_logo_updated", { detail: { url: json.data.logoUrl } }));
      }
      if (json.data.faviconUrl) {
        localStorage.setItem("phantom_custom_favicon", json.data.faviconUrl);
        window.dispatchEvent(new CustomEvent("phantom_favicon_updated", { detail: { url: json.data.faviconUrl } }));
      }
      return json;
    }
  } catch (err) {
    console.warn("Could not update server system settings:", err);
  }
  return null;
}

/**
 * Fetch statutory company profile & tax details from backend MongoDB
 */
export async function fetchCompanyProfile(): Promise<any> {
  try {
    const res = await fetch(`${API_V1_URL}/system/company-profile`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        localStorage.setItem("phantom_company_profile", JSON.stringify(json.data));
        window.dispatchEvent(new CustomEvent("phantom_company_profile_updated", { detail: json.data }));
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Could not fetch server company profile:", err);
  }
  return null;
}

/**
 * Update statutory company profile & tax details in backend MongoDB
 */
export async function updateCompanyProfile(payload: any): Promise<any> {
  try {
    const res = await fetch(`${API_V1_URL}/system/company-profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success && json.data) {
      localStorage.setItem("phantom_company_profile", JSON.stringify(json.data));
      window.dispatchEvent(new CustomEvent("phantom_company_profile_updated", { detail: json.data }));
      return json;
    }
  } catch (err) {
    console.warn("Could not update server company profile:", err);
  }
  return null;
}
