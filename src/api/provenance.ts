/**
 * Data Provenance API
 */
import { mockDelay } from "./client";
import { mockAcousticFiles, mockProvenanceData, type AcousticFile, type ProvenanceRow } from "./mock";
export type { AcousticFile, ProvenanceRow };

export function getAcousticFiles(_campaignId: string): Promise<AcousticFile[]> {
  return mockDelay([...mockAcousticFiles]);
}

export function getProvenanceData(_campaignId: string): Promise<ProvenanceRow[]> {
  return mockDelay([...mockProvenanceData]);
}
