/**
 * Subscription Plan Feature Gating Engine
 * Tiers: Starter, Growth, Enterprise
 * Feature Gating Matrix:
 * - Starter: Core Visa Processing, basic CRM
 * - Growth: Advanced CRM, White-Label BYO Integrations
 * - Enterprise: Full White-Label, API Marketplace Access, HR & Payroll Engine
 */

export type SubscriptionTier = "Starter" | "Growth" | "Enterprise";

export interface FeatureGateMatrix {
  whiteLabel: boolean;
  apiMarketplace: boolean;
  hrModule: boolean;
  customDomain: boolean;
  bulkProcessing: boolean;
  dedicatedSla: boolean;
}

export const TIER_GATES: Record<SubscriptionTier, FeatureGateMatrix> = {
  Starter: {
    whiteLabel: false,
    apiMarketplace: false,
    hrModule: false,
    customDomain: false,
    bulkProcessing: false,
    dedicatedSla: false
  },
  Growth: {
    whiteLabel: true,
    apiMarketplace: false,
    hrModule: false,
    customDomain: true,
    bulkProcessing: true,
    dedicatedSla: false
  },
  Enterprise: {
    whiteLabel: true,
    apiMarketplace: true,
    hrModule: true,
    customDomain: true,
    bulkProcessing: true,
    dedicatedSla: true
  }
};

export function isFeatureAllowed(tier: SubscriptionTier, feature: keyof FeatureGateMatrix): boolean {
  return TIER_GATES[tier]?.[feature] ?? false;
}
