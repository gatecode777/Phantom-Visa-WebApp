/**
 * Unit Test Suite: Finance & Maker-Checker Refund Controls
 */

import { createRefundRequest, approveRefundRequest } from "../../src/lib/services/refunds";

describe("Maker-Checker Refund Security Tests", () => {
  it("should mark refunds above $500 as requiring dual approval", () => {
    const refund = createRefundRequest({
      companyId: "comp_001",
      applicationId: "PV-2026-0041",
      amount: 750,
      initiatedByUserId: "agent_usr_01",
      initiatedByUserRole: "Agent",
      reason: "Travel date changed"
    });

    expect(refund.requiresMakerChecker).toBe(true);
    expect(refund.status).toBe("pending_approval");
  });

  it("should prevent the same user from initiating and approving a high-value refund", () => {
    const refund = createRefundRequest({
      companyId: "comp_001",
      applicationId: "PV-2026-0041",
      amount: 750,
      initiatedByUserId: "agent_usr_01",
      initiatedByUserRole: "Agent",
      reason: "Travel date changed"
    });

    const approval = approveRefundRequest(refund, "agent_usr_01", "Staff");
    expect(approval.success).toBe(false);
    expect(approval.error).toContain("MAKER_CHECKER_VIOLATION");
  });

  it("should allow a distinct staff/admin user to approve the refund", () => {
    const refund = createRefundRequest({
      companyId: "comp_001",
      applicationId: "PV-2026-0041",
      amount: 750,
      initiatedByUserId: "agent_usr_01",
      initiatedByUserRole: "Agent",
      reason: "Travel date changed"
    });

    const approval = approveRefundRequest(refund, "supervisor_usr_99", "Staff");
    expect(approval.success).toBe(true);
    expect(approval.updatedRequest?.status).toBe("approved");
    expect(approval.updatedRequest?.approvedByUserId).toBe("supervisor_usr_99");
  });
});
