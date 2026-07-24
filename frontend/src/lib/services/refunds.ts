/**
 * Refund Maker-Checker Workflow Engine
 * Money-Safety Rule: Refunds above threshold ($500) require a second approver.
 * One role/user cannot both approve and execute a refund request.
 */

export interface RefundRequest {
  id: string;
  companyId: string;
  applicationId: string;
  amount: number;
  initiatedByUserId: string;
  initiatedByUserRole: string;
  approvedByUserId?: string;
  approvedByUserRole?: string;
  status: "pending_approval" | "approved" | "executed" | "rejected";
  reason: string;
  requiresMakerChecker: boolean;
}

const MAKER_CHECKER_THRESHOLD = 500; // Configurable threshold ($500 / INR 500)

export function createRefundRequest(params: {
  companyId: string;
  applicationId: string;
  amount: number;
  initiatedByUserId: string;
  initiatedByUserRole: string;
  reason: string;
}): RefundRequest {
  const requiresMakerChecker = params.amount > MAKER_CHECKER_THRESHOLD;

  return {
    id: `REF-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    companyId: params.companyId,
    applicationId: params.applicationId,
    amount: params.amount,
    initiatedByUserId: params.initiatedByUserId,
    initiatedByUserRole: params.initiatedByUserRole,
    status: requiresMakerChecker ? "pending_approval" : "approved",
    reason: params.reason,
    requiresMakerChecker
  };
}

export function approveRefundRequest(
  request: RefundRequest,
  approverUserId: string,
  approverUserRole: string
): { success: boolean; updatedRequest?: RefundRequest; error?: string } {
  if (request.status !== "pending_approval") {
    return { success: false, error: `Refund request is already in ${request.status} status.` };
  }

  // Maker-Checker Enforcer: Approver MUST NOT be the initiator
  if (request.initiatedByUserId === approverUserId) {
    return {
      success: false,
      error: "MAKER_CHECKER_VIOLATION: The same user cannot initiate and approve a high-value refund."
    };
  }

  // Approver must have Supervisor or Admin authority
  if (approverUserRole !== "Super Admin" && approverUserRole !== "Staff" && approverUserRole !== "Company Admin") {
    return {
      success: false,
      error: "INSUFFICIENT_PERMISSIONS: Approver role must be Company Admin, Staff, or Super Admin."
    };
  }

  const updatedRequest: RefundRequest = {
    ...request,
    approvedByUserId: approverUserId,
    approvedByUserRole: approverUserRole,
    status: "approved"
  };

  return { success: true, updatedRequest };
}
