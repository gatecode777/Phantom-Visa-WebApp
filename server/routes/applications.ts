import { Router, Request, Response } from "express";
import { formatErrorEnvelope, getRateLimitHeaders, paginateArrayWithCursor } from "../../src/lib/middleware/api-standards.js";
import { validateStateTransition, ApplicationState, evaluateSlaEscalation } from "../../src/lib/lifecycle/application-state.js";
import { publishDomainEvent } from "../../src/lib/events/kafka.js";

const router = Router();

const mockApplications = [
  {
    id: "PV-2026-0041",
    companyId: "comp_001",
    travelerName: "Sophia Martinez",
    passportNumber: "US8829102",
    destination: "Germany",
    status: "approved" as ApplicationState,
    version: 3,
    submittedAt: "2026-07-15T08:00:00Z"
  },
  {
    id: "PV-2026-0042",
    companyId: "comp_001",
    travelerName: "Liam Johnson",
    passportNumber: "US9918231",
    destination: "France",
    status: "submitted" as ApplicationState,
    version: 1,
    submittedAt: "2026-07-22T10:30:00Z"
  }
];

router.get("/", (req: Request, res: Response) => {
  const headers = getRateLimitHeaders("Growth");
  res.set(headers);
  const cursor = (req.query.cursor as string) || undefined;
  const limit = parseInt((req.query.limit as string) || "10", 10);

  const paginated = paginateArrayWithCursor(mockApplications, cursor, limit);
  return res.status(200).json(paginated);
});

router.post("/", (req: Request, res: Response) => {
  const headers = getRateLimitHeaders("Growth");
  res.set(headers);
  try {
    const { travelerName, passportNumber, destination, visaType } = req.body;

    if (!travelerName || !passportNumber) {
      return res.status(400).json(
        formatErrorEnvelope("VALIDATION_ERROR", "travelerName and passportNumber are required fields.")
      );
    }

    const newApp = {
      id: `PV-2026-00${Math.floor(10 + Math.random() * 90)}`,
      companyId: "comp_001",
      travelerName,
      passportNumber,
      destination: destination || "Germany",
      visaType: visaType || "Schengen Tourist",
      status: "draft" as ApplicationState,
      version: 1,
      submittedAt: new Date().toISOString()
    };

    publishDomainEvent("application.created", "comp_001", { applicationId: newApp.id });

    return res.status(201).json({ success: true, application: newApp });
  } catch (error: any) {
    return res.status(500).json(
      formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "Failed to create application")
    );
  }
});

router.patch("/", (req: Request, res: Response) => {
  const headers = getRateLimitHeaders("Growth");
  res.set(headers);
  try {
    const { id, currentStatus, targetStatus } = req.body;

    const transitionCheck = validateStateTransition(currentStatus, targetStatus);
    if (!transitionCheck.allowed) {
      return res.status(422).json(
        formatErrorEnvelope("INVALID_STATE_TRANSITION", transitionCheck.reason!)
      );
    }

    publishDomainEvent("application.status_changed", "comp_001", {
      applicationId: id,
      from: currentStatus,
      to: targetStatus
    });

    const sla = evaluateSlaEscalation("2026-07-20T00:00:00Z");

    return res.status(200).json({
      success: true,
      message: `Application status updated to '${targetStatus}'`,
      applicationId: id,
      newStatus: targetStatus,
      slaStatus: sla.status
    });
  } catch (error: any) {
    return res.status(500).json(
      formatErrorEnvelope("INTERNAL_SERVER_ERROR", error.message || "State transition failed")
    );
  }
});

export default router;
