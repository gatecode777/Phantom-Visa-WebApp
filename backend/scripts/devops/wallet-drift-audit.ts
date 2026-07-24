/**
 * Nightly Wallet Balance Drift Audit Job
 * Recomputes wallet balances directly from append-only transaction history
 * and alerts on any mathematical discrepancy (drift).
 */

export interface WalletAuditResult {
  companyId: string;
  recordedBalance: number;
  computedBalanceFromHistory: number;
  drift: number;
  hasDrift: boolean;
}

export function auditTenantWalletBalance(
  companyId: string,
  recordedBalance: number,
  transactionHistory: { signedAmount: number }[]
): WalletAuditResult {
  const computedBalanceFromHistory = transactionHistory.reduce(
    (sum, tx) => sum + tx.signedAmount,
    0
  );

  const drift = Math.abs(recordedBalance - computedBalanceFromHistory);
  const hasDrift = drift > 0.001;

  if (hasDrift) {
    console.error(
      `[CRITICAL DRILL ALERT] Wallet drift detected for company ${companyId}! Recorded: ₹${recordedBalance}, Computed: ₹${computedBalanceFromHistory}, Drift: ₹${drift}`
    );
  } else {
    console.log(`[WALLET AUDIT OK] Company ${companyId} balance verified with 0 drift.`);
  }

  return {
    companyId,
    recordedBalance,
    computedBalanceFromHistory,
    drift,
    hasDrift
  };
}
