/**
 * Audit Section API
 */
import { mockDelay } from "./client";
import { mockAuditData, type AuditItem } from "./mock";
export type { AuditItem };

export function getAuditData(): Promise<AuditItem[]> {
  return mockDelay([...mockAuditData]);
}
