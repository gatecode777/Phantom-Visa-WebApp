/**
 * Dynamic Favicon Utility
 * Handles dynamic favicon updates and persistence across browser reloads
 */
export function setDynamicFavicon(iconUrl?: string | null): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  try {
    const activeFavicon =
      iconUrl ||
      localStorage.getItem("phantom_custom_favicon") ||
      "/favicon.png";

    if (!activeFavicon) return;

    // Remove all existing icon and shortcut links to force browser repaint
    const existingLinks = document.querySelectorAll(
      "link[rel*='icon'], link[rel='apple-touch-icon'], link[rel='shortcut icon']"
    );
    existingLinks.forEach((el) => el.remove());

    // Determine appropriate MIME type
    let mimeType = "image/png";
    const lowerUrl = activeFavicon.toLowerCase();
    if (lowerUrl.includes(".ico")) {
      mimeType = "image/x-icon";
    } else if (lowerUrl.includes(".svg")) {
      mimeType = "image/svg+xml";
    } else if (lowerUrl.includes(".jpg") || lowerUrl.includes(".jpeg")) {
      mimeType = "image/jpeg";
    } else if (lowerUrl.includes(".webp")) {
      mimeType = "image/webp";
    }

    // 1. Create standard icon link
    const link = document.createElement("link");
    link.type = mimeType;
    link.rel = "icon";
    link.href = activeFavicon;
    document.head.appendChild(link);

    // 2. Create shortcut icon link (Chrome / Edge legacy support)
    const shortcutLink = document.createElement("link");
    shortcutLink.type = mimeType;
    shortcutLink.rel = "shortcut icon";
    shortcutLink.href = activeFavicon;
    document.head.appendChild(shortcutLink);

    // 3. Create apple-touch-icon link
    const appleLink = document.createElement("link");
    appleLink.rel = "apple-touch-icon";
    appleLink.href = activeFavicon;
    document.head.appendChild(appleLink);
  } catch (err) {
    console.warn("Failed to set dynamic favicon:", err);
  }
}

/**
 * Initialize favicon listener for cross-component synchronization
 */
export function initFaviconSync(): () => void {
  if (typeof window === "undefined") return () => {};

  // Initial set from storage
  setDynamicFavicon();

  // Listen to custom update event
  const handler = (e: any) => {
    const newUrl = e.detail?.url;
    setDynamicFavicon(newUrl);
  };

  window.addEventListener("phantom_favicon_updated" as any, handler);

  return () => {
    window.removeEventListener("phantom_favicon_updated" as any, handler);
  };
}
