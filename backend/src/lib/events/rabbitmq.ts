/**
 * RabbitMQ Task Queue Client
 * Imperative Task Queues (separated from Kafka Broadcast Domain Events):
 * - send_notification (Email/SMS/WhatsApp)
 * - run_ocr_processing
 * - generate_report_pdf
 * - calculate_monthly_payroll
 */

export type ImperativeTaskQueue =
  | "task.send_notification"
  | "task.run_ocr_job"
  | "task.generate_pdf_report"
  | "task.recompute_wallet_drift";

export interface TaskMessage {
  taskId: string;
  queue: ImperativeTaskQueue;
  companyId: string;
  retryCount: number;
  maxRetries: number;
  payload: Record<string, any>;
  createdAt: string;
}

export function enqueueTask(queue: ImperativeTaskQueue, companyId: string, payload: Record<string, any>): TaskMessage {
  const task: TaskMessage = {
    taskId: `task_${Math.random().toString(36).substring(2, 11)}`,
    queue,
    companyId,
    retryCount: 0,
    maxRetries: 3,
    payload,
    createdAt: new Date().toISOString()
  };

  // In production: channel.publish('task_exchange', queue, Buffer.from(JSON.stringify(task)), { persistent: true })
  console.log(`[RABBITMQ TASK ENQUEUED] Queue: ${queue} | TaskID: ${task.taskId}`);
  return task;
}
