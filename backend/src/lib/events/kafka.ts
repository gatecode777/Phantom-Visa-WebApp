/**
 * Kafka Domain Event Backbone Producer
 * Handles broadcast domain events partitioned by company_id hash:
 * - application.created
 * - application.status_changed
 * - document.uploaded
 * - payment.completed
 * - wallet.debited
 * - commission.calculated
 */

export type DomainTopic =
  | "application.created"
  | "application.status_changed"
  | "document.uploaded"
  | "payment.completed"
  | "wallet.debited"
  | "commission.calculated";

export interface KafkaDomainEvent {
  eventId: string;
  topic: DomainTopic;
  companyId: string;
  timestamp: string;
  payload: Record<string, any>;
}

export function computeCompanyIdHashPartition(companyId: string, partitionCount: number = 12): number {
  let hash = 0;
  for (let i = 0; i < companyId.length; i++) {
    hash = (hash << 5) - hash + companyId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % partitionCount;
}

export function publishDomainEvent(topic: DomainTopic, companyId: string, payload: Record<string, any>): KafkaDomainEvent {
  const partition = computeCompanyIdHashPartition(companyId);
  const event: KafkaDomainEvent = {
    eventId: `evt_${Math.random().toString(36).substring(2, 11)}`,
    topic,
    companyId,
    timestamp: new Date().toISOString(),
    payload: {
      ...payload,
      _partition: partition
    }
  };

  // In production: kafkaProducer.send({ topic, messages: [{ key: companyId, value: JSON.stringify(event), partition }] })
  console.log(`[KAFKA EVENT PRODUCED] Topic: ${topic} | Company: ${companyId} (Partition ${partition})`, event.eventId);
  return event;
}
