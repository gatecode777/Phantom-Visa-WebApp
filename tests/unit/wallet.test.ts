/**
 * Unit Test Suite: Wallet & Ledger Operations
 * Coverage Target: > 80% on Wallet/Finance/Auth
 */

import { executeAtomicWalletDebitAndStatusChange } from "../../src/lib/services/wallet";

describe("Wallet & Transaction Safety Tests", () => {
  it("should successfully execute atomic wallet debit and status update", async () => {
    const result = await executeAtomicWalletDebitAndStatusChange({
      companyId: "comp_001",
      applicationId: "PV-2026-0041",
      debitAmount: 13280,
      newStatus: "Submitted",
      description: "Visa submission fee"
    });

    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(45000 - 13280);
    expect(result.transactionRef).toMatch(/^TXN_/);
  });

  it("should reject negative or zero debit amounts", async () => {
    const result = await executeAtomicWalletDebitAndStatusChange({
      companyId: "comp_001",
      applicationId: "PV-2026-0041",
      debitAmount: 0,
      newStatus: "Submitted",
      description: "Invalid zero fee"
    });

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("INVALID_DEBIT_AMOUNT");
  });
});
