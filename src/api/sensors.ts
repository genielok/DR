/**
 * Sensor API
 */
import { mockDelay } from "./client";
import { mockSensorHabitats, mockSensorMeta, type SensorMeta } from "./mock";
export type { SensorMeta };

export function getSensorHabitat(sensorId: string): Promise<string> {
  return mockDelay(mockSensorHabitats[sensorId] ?? "Unknown");
}

export function getSensorMeta(sensorId: string): Promise<SensorMeta | undefined> {
  return mockDelay(mockSensorMeta[sensorId]);
}

export function getAllSensorMeta(): Promise<typeof mockSensorMeta> {
  return mockDelay({ ...mockSensorMeta });
}
