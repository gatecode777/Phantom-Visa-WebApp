import { API_V1_URL } from "../config/api";

export interface SessionRecord {
  id: string;
  deviceName: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

/**
 * Fetch all active sessions for the currently logged-in user.
 * Calls GET /api/v1/auth/sessions
 * The "current" session is identified server-side by matching the refresh-token cookie.
 */
export async function fetchSessionsApi(token?: string): Promise<SessionRecord[]> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_V1_URL}/auth/sessions`, {
      headers,
      credentials: "include" // sends the refreshToken cookie so the server can mark isCurrent
    });

    if (!res.ok) {
      console.warn("fetchSessionsApi non-200:", res.status);
      return [];
    }

    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("fetchSessionsApi error:", err);
    return [];
  }
}

/**
 * Revoke a specific session by its RefreshToken document _id.
 * Calls DELETE /api/v1/auth/sessions/:id
 */
export async function revokeSessionApi(
  sessionId: string,
  token?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_V1_URL}/auth/sessions/${sessionId}`, {
      method: "DELETE",
      headers,
      credentials: "include"
    });

    const json = await res.json();
    return { success: res.ok, error: json.error?.message };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
