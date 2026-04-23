/**
 * Ecosystem Extent API
 */
import { mockDelay } from "./client";
import { mockEcosystemData, mockPublications, type EcosystemMetrics, type Publication } from "./mock";
export type { EcosystemMetrics, Publication };

export function getEcosystemData(): Promise<Record<string, EcosystemMetrics>> {
  return mockDelay({ ...mockEcosystemData });
}

export function getPublications(): Promise<Publication[]> {
  return mockDelay([...mockPublications]);
}
