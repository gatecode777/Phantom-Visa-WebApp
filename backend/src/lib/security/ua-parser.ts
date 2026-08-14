/**
 * Minimal User-Agent parser — no external dependency needed.
 * Extracts a human-readable device name and browser label from the raw UA string.
 */

export interface ParsedUA {
  deviceName: string;
  browser: string;
}

export function parseUserAgent(ua: string = ""): ParsedUA {
  // ── Browser ────────────────────────────────────────────────────────────────
  let browser = "Unknown Browser";

  if (/Edg\/[\d.]+/.test(ua)) {
    const v = ua.match(/Edg\/([\d.]+)/)?.[1]?.split(".")[0];
    browser = `Edge ${v}`;
  } else if (/OPR\/[\d.]+/.test(ua)) {
    const v = ua.match(/OPR\/([\d.]+)/)?.[1]?.split(".")[0];
    browser = `Opera ${v}`;
  } else if (/Chrome\/[\d.]+/.test(ua) && !/Chromium/.test(ua)) {
    const v = ua.match(/Chrome\/([\d.]+)/)?.[1]?.split(".")[0];
    browser = `Chrome v${v}`;
  } else if (/Firefox\/[\d.]+/.test(ua)) {
    const v = ua.match(/Firefox\/([\d.]+)/)?.[1]?.split(".")[0];
    browser = `Firefox v${v}`;
  } else if (/Version\/[\d.]+ Safari/.test(ua) && /Mobile/.test(ua)) {
    browser = "Mobile Safari";
  } else if (/Version\/[\d.]+ Safari/.test(ua)) {
    browser = "Safari";
  } else if (/MSIE |Trident\//.test(ua)) {
    browser = "Internet Explorer";
  }

  // ── Device / OS ───────────────────────────────────────────────────────────
  let deviceName = "Unknown Device";

  if (/iPhone/.test(ua)) {
    deviceName = "Apple iPhone";
  } else if (/iPad/.test(ua)) {
    deviceName = "Apple iPad";
  } else if (/Android/.test(ua) && /Mobile/.test(ua)) {
    // Try to extract Android device model
    const model = ua.match(/;\s([^;)]+)\sBuild\//)?.[1]?.trim();
    deviceName = model ? model : "Android Phone";
  } else if (/Android/.test(ua)) {
    deviceName = "Android Tablet";
  } else if (/Macintosh|Mac OS X/.test(ua)) {
    deviceName = "Apple Mac";
  } else if (/Windows NT 10/.test(ua)) {
    deviceName = "Windows 11 PC";
  } else if (/Windows NT 6\.[23]/.test(ua)) {
    deviceName = "Windows 8 PC";
  } else if (/Windows NT 6\.1/.test(ua)) {
    deviceName = "Windows 7 PC";
  } else if (/Windows/.test(ua)) {
    deviceName = "Windows PC";
  } else if (/Linux/.test(ua)) {
    deviceName = "Linux Machine";
  } else if (/CrOS/.test(ua)) {
    deviceName = "Chromebook";
  }

  return { deviceName, browser };
}

/**
 * Formats a date into a human-readable "last active" string.
 */
export function formatLastSeen(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffMin < 2) return "Active Now";
  if (diffMin < 60) return `${diffMin} Minutes Ago`;
  if (diffHr < 24) return `${diffHr} Hour${diffHr > 1 ? "s" : ""} Ago`;
  return `${diffDays} Day${diffDays > 1 ? "s" : ""} Ago`;
}
