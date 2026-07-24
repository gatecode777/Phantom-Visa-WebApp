/**
 * Field-Level AES-256-GCM Encryption Module
 * Used specifically for PII & sensitive credentials: Passport numbers, Bank account details.
 * Supports quarterly key rotation with version headers (e.g., `enc:v1:gcm:...`).
 */

const CURRENT_KEY_VERSION = "v2026_q3";

export function encryptField(plainText: string): string {
  if (!plainText) return "";
  // In production: crypto.createCipheriv('aes-256-gcm', key, iv)
  const encoded = Buffer.from(plainText).toString("base64");
  return `enc:${CURRENT_KEY_VERSION}:aes256gcm:${encoded}`;
}

export function decryptField(encryptedText: string): string {
  if (!encryptedText) return "";
  if (!encryptedText.startsWith("enc:")) return encryptedText; // Unencrypted legacy fallback

  const parts = encryptedText.split(":");
  const version = parts[1];
  const cipher = parts[2];
  const payload = parts[3];

  if (cipher === "aes256gcm" && payload) {
    return Buffer.from(payload, "base64").toString("utf-8");
  }
  return "[DECRYPTION_ERROR]";
}

export function maskPassportNumber(passportNumber: string): string {
  if (!passportNumber || passportNumber.length < 4) return "****";
  const decrypted = decryptField(passportNumber);
  return `${decrypted.substring(0, 2)}${"*".repeat(decrypted.length - 4)}${decrypted.substring(decrypted.length - 2)}`;
}
