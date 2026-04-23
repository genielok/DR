/**
 * Campaign API
 * Swap mock calls for real fetch() once the backend is ready:
 *   return fetch(`${BASE_URL}/campaigns`).then(r => r.json())
 */
import { mockDelay } from "./client";
import {
  mockCampaigns,
  mockAuditLogs,
  mockProcessingResults,
} from "./mock";
import type { Campaign, AuditLog, ProcessingResult } from "../app/data/mockData";

export function getCampaigns(): Promise<Campaign[]> {
  return mockDelay([...mockCampaigns]);
}

export function getCampaignById(id: string): Promise<Campaign | undefined> {
  return mockDelay(mockCampaigns.find((c) => c.id === id));
}

export function createCampaign(campaign: Campaign): Promise<Campaign> {
  mockCampaigns.unshift(campaign);
  return mockDelay(campaign);
}

export function updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined> {
  const idx = mockCampaigns.findIndex((c) => c.id === id);
  if (idx !== -1) mockCampaigns[idx] = { ...mockCampaigns[idx], ...updates };
  return mockDelay(mockCampaigns[idx]);
}

export function deleteCampaign(id: string): Promise<void> {
  const idx = mockCampaigns.findIndex((c) => c.id === id);
  if (idx !== -1) mockCampaigns.splice(idx, 1);
  return mockDelay(undefined);
}

export function getAuditLogs(campaignId: string): Promise<AuditLog[]> {
  return mockDelay(mockAuditLogs.filter((l) => l.campaignId === campaignId));
}

export function getProcessingResults(campaignId: string): Promise<ProcessingResult[]> {
  return mockDelay(mockProcessingResults.filter((r) => r.campaignId === campaignId));
}
