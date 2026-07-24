/**
 * Application Lifecycle State Machine & SLA Escalation Module
 * Explicit State Machine:
 *   draft -> submitted -> under_review -> additional_docs_required -> approved | rejected -> completed
 * Controls:
 * - Server-side transition validation
 * - Optimistic concurrency control (version column)
 * - SLA escalation flags (80% warning threshold, 100% breach threshold)
 * - Bulk staff actions (bulk-assign, bulk-status-update)
 */

export type ApplicationState =
  | "draft"
  | "submitted"
  | "under_review"
  | "additional_docs_required"
  | "approved"
  | "rejected"
  | "completed";

const VALID_TRANSITIONS: Record<ApplicationState, ApplicationState[]> = {
  draft: ["submitted"],
  submitted: ["under_review", "additional_docs_required", "rejected"],
  under_review: ["additional_docs_required", "approved", "rejected"],
  additional_docs_required: ["submitted", "under_review", "rejected"],
  approved: ["completed"],
  rejected: [],
  completed: []
};

export interface ApplicationRecord {
  id: string;
  companyId: string;
  status: ApplicationState;
  version: number; // Optimistic locking
  submittedAt: string;
  slaTargetHours: number;
}

export function validateStateTransition(current: ApplicationState, next: ApplicationState): { allowed: boolean; reason?: string } {
  if (current === next) return { allowed: true };
  const allowedNextStates = VALID_TRANSITIONS[current] || [];
  if (!allowedNextStates.includes(next)) {
    return {
      allowed: false,
      reason: `INVALID_STATE_TRANSITION: Cannot transition application state from '${current}' to '${next}'. Allowed next states: [${allowedNextStates.join(", ")}].`
    };
  }
  return { allowed: true };
}

export function checkOptimisticLock(record: ApplicationRecord, expectedVersion: number): { valid: boolean; error?: string } {
  if (record.version !== expectedVersion) {
    return {
      valid: false,
      error: `OPTIMISTIC_LOCK_CONFLICT: Record version mismatch. Current DB version is ${record.version}, but request specified ${expectedVersion}. Another staff member edited this application concurrently.`
    };
  }
  return { valid: true };
}

export function evaluateSlaEscalation(submittedAt: string, targetHours: number = 72): {
  elapsedPercent: number;
  status: "NORMAL" | "SLA_WARNING_80" | "SLA_BREACH_100";
} {
  const elapsedMs = Date.now() - new Date(submittedAt).getTime();
  const targetMs = targetHours * 60 * 60 * 1000;
  const elapsedPercent = Math.min(100, Math.round((elapsedMs / targetMs) * 100));

  if (elapsedPercent >= 100) {
    return { elapsedPercent, status: "SLA_BREACH_100" };
  } else if (elapsedPercent >= 80) {
    return { elapsedPercent, status: "SLA_WARNING_80" };
  }
  return { elapsedPercent, status: "NORMAL" };
}

export function executeBulkStatusUpdate(
  applications: ApplicationRecord[],
  targetStatus: ApplicationState,
  expectedVersions: Record<string, number>
): { updatedCount: number; errors: { id: string; error: string }[] } {
  const errors: { id: string; error: string }[] = [];
  let updatedCount = 0;

  for (const app of applications) {
    const lockCheck = checkOptimisticLock(app, expectedVersions[app.id] ?? app.version);
    if (!lockCheck.valid) {
      errors.push({ id: app.id, error: lockCheck.error! });
      continue;
    }

    const transitionCheck = validateStateTransition(app.status, targetStatus);
    if (!transitionCheck.allowed) {
      errors.push({ id: app.id, error: transitionCheck.reason! });
      continue;
    }

    updatedCount++;
  }

  return { updatedCount, errors };
}
