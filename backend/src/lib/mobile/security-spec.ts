/**
 * Mobile Performance & Security Specifications Module
 * Specifications:
 * - Cold start: < 2 seconds target
 * - App binary size budget: < 60MB per platform
 * - SSL Certificate Pinning: Enforced on all *.phantomvisa.com API calls
 * - Root / Jailbreak Detection: Soft warning indicator (non-blocking for UX continuity)
 * - Biometric Login: Device-local Secure Enclave / Android Keystore only (never transmitted)
 */

export interface MobileDeviceInfo {
  platform: "iOS" | "Android";
  appVersion: string;
  bundleSizeBytes: number; // Must be < 60MB (62,914,560 bytes)
  coldStartLatencyMs: number; // Must be < 2000ms
  isJailbrokenOrRooted: boolean;
  certificatePinningActive: boolean;
  biometricsAvailable: boolean;
}

export function validateMobileCompliance(device: MobileDeviceInfo): {
  compliant: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  const MAX_BUNDLE_BYTES = 60 * 1024 * 1024;
  if (device.bundleSizeBytes > MAX_BUNDLE_BYTES) {
    errors.push(`BUNDLE_SIZE_EXCEEDED: App binary size (${(device.bundleSizeBytes / 1024 / 1024).toFixed(1)}MB) exceeds 60MB limit.`);
  }

  if (device.coldStartLatencyMs > 2000) {
    warnings.push(`COLD_START_LATENCY_HIGH: Cold start time (${device.coldStartLatencyMs}ms) exceeds 2000ms SLA.`);
  }

  if (device.isJailbrokenOrRooted) {
    // Soft warning rule per Requirement 16
    warnings.push("JAILBREAK_ROOT_DETECTED: Soft warning — Device environment shows root access. Biometric encryption restricted.");
  }

  if (!device.certificatePinningActive) {
    errors.push("CERT_PINNING_DISABLED: SSL Certificate Pinning must be active on all API network request channels.");
  }

  return {
    compliant: errors.length === 0,
    warnings,
    errors
  };
}

export function authenticateWithSecureEnclave(): Promise<{ success: boolean; token?: string }> {
  // Device-local Hardware Key Store simulation
  return Promise.resolve({
    success: true,
    token: `secure_enclave_key_${Math.random().toString(36).substring(2, 10)}`
  });
}
