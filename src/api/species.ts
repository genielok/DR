/**
 * Species API
 */
import { mockDelay } from "./client";
import { speciesData } from "../app/data/generateSpecies";
import { mockSensorIds } from "../app/data/sensors";
import type { Species } from "../app/data/mockData";

// camp-001 uses Group A; all other campaigns use Group B
function speciesForCampaign(campaignId: string): Species[] {
  return campaignId === "camp-001" ? speciesData : [];
}

// Use the same sensor→species mapping as the map view
function speciesForSensor(sensorId: string): Species[] {
  const ids = mockSensorIds[sensorId];
  if (!ids) return [];
  const idSet = new Set(ids);
  return speciesData.filter((s) => idSet.has(s.id));
}

export function getSpecies(): Promise<Species[]> {
  return mockDelay([...speciesData]);
}

export function getSpeciesByCampaign(campaignId: string): Promise<Species[]> {
  return mockDelay([...speciesForCampaign(campaignId)]);
}

export function getSpeciesBySensor(sensorId: string): Promise<Species[]> {
  return mockDelay([...speciesForSensor(sensorId)]);
}

export function getSpeciesById(id: string): Promise<Species | undefined> {
  const all = [...speciesData];
  return mockDelay(all.find((s) => s.id === id));
}

export function updateSpeciesVerification(
  id: string,
  verified: boolean | null,
): Promise<Species | undefined> {
  const all = [...speciesData];
  const sp = all.find((s) => s.id === id);
  return mockDelay(sp);
}
