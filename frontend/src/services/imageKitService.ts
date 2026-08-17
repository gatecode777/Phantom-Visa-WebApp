import { API_V1_URL } from "../config/api";

export interface ImageKitUploadResult {
  url: string;
  fileId: string;
  fileName: string;
  thumbnailUrl: string;
  size?: number;
  mimetype?: string;
}

/**
 * Universal ImageKit upload helper
 * Uploads any image/media file directly to ImageKit via backend endpoint
 * Returns the permanent ImageKit HTTPS URL
 */
export async function uploadImageToImageKit(
  file: File,
  folder: string = "/PHANTOM-VISA/general/"
): Promise<ImageKitUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch(`${API_V1_URL}/system/upload-image`, {
    method: "POST",
    body: formData
  });

  const json = await response.json();

  if (!response.ok || !json.success || !json.data?.url) {
    throw new Error(json.message || "Failed to upload image to ImageKit.");
  }

  return json.data as ImageKitUploadResult;
}
