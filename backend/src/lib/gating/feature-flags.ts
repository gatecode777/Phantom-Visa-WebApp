/**
 * Percentage-Based Feature Flag Rollout Engine
 * Evaluates feature activation based on target company_id hash and rollout percentage (0% to 100%).
 */

export interface FeatureFlag {
  key: string;
  description: string;
  rolloutPercentage: number; // 0 to 100
  isActive: boolean;
}

export function isFeatureFlagEnabled(flag: FeatureFlag, companyId: string): boolean {
  if (!flag.isActive) return false;
  if (flag.rolloutPercentage >= 100) return true;
  if (flag.rolloutPercentage <= 0) return false;

  // Hash companyId to produce deterministic 0-99 bucket
  let hash = 0;
  for (let i = 0; i < companyId.length; i++) {
    hash = (hash << 5) - hash + companyId.charCodeAt(i);
    hash |= 0;
  }
  const bucket = Math.abs(hash) % 100;
  return bucket < flag.rolloutPercentage;
}
