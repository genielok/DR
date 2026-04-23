/**
 * Operation Log API
 */
import { mockDelay } from "./client";
import { mockOperationLog, type OperationLogEntry } from "./mock";
export type { OperationLogEntry };

export function getOperationLog(_campaignId: string): Promise<OperationLogEntry[]> {
  return mockDelay([...mockOperationLog]);
}
