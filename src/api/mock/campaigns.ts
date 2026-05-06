import type { Campaign, AuditLog, ProcessingResult } from "../../app/data/mockData";

export const mockCampaigns: Campaign[] = [
  {
    id: "camp-001",
    name: "Cópia de",
    client: "R-evolution",
    location: "Cópia de, Brazil",
    startDate: "2025-03-31",
    endDate: "2025-04-31",
    status: "completed",
    totalRecordings: 24888,
    processedRecordings: 0,
    speciesCount: 251,
    speciesByStatus: {
      "LC": 239,
      "NT": 7,
      "VU": 4,
      "EN": 1,
      "CR": 0,
    },
    sensors: [
      "2MM06956", "2MM07194"
    ],
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: "audit-001",
    timestamp: "2026-04-15T10:30:00Z",
    action: "Species Verified",
    user: "Dr. Sarah Chen",
    details: "Verified California Condor register",
    campaignId: "camp-001",
    dataChanged: { speciesId: "sp-004", verified: true },
  },
  {
    id: "audit-002",
    timestamp: "2026-04-15T09:15:00Z",
    action: "Data Uploaded",
    user: "John Martinez",
    details: "Uploaded 124 audio files from Sensor SNR-003",
    campaignId: "camp-001",
  },
  {
    id: "audit-003",
    timestamp: "2026-04-14T16:22:00Z",
    action: "Processing Completed",
    user: "System",
    details: "BirdNET v2.4 processing completed for batch BN-20260414",
    campaignId: "camp-001",
  },
  {
    id: "audit-004",
    timestamp: "2026-04-14T14:10:00Z",
    action: "IUCN Data Updated",
    user: "System",
    details: "Updated IUCN status from API v2026.1",
    campaignId: "camp-001",
  },
];

export const mockProcessingResults: ProcessingResult[] = [
  {
    id: "proc-001",
    campaignId: "camp-001",
    fileName: "SNR-001_20260401_060000.wav",
    uploadDate: "2026-04-15T08:00:00Z",
    processingDate: "2026-04-15T08:30:00Z",
    model: "BirdNET",
    modelVersion: "v2.4",
    registers: 12,
    status: "completed",
  },
  {
    id: "proc-002",
    campaignId: "camp-001",
    fileName: "SNR-002_20260401_060000.wav",
    uploadDate: "2026-04-15T08:05:00Z",
    processingDate: "2026-04-15T08:35:00Z",
    model: "Perch",
    modelVersion: "v1.2",
    registers: 8,
    status: "completed",
  },
];

// ── Sensor metadata ─────────────────────────────────────────

export type SensorHabitat = Record<string, string>;

export const mockSensorHabitats: SensorHabitat = {
  "SNR-001": "Forest",
  "SNR-002": "Canopy",
  "SNR-003": "Wetland",
  "SNR-004": "Ridge",
  "SNR-005": "Valley",
};

export interface SensorMeta {
  deploymentDate: string;
  batteryLevel: number;
  coordinates: string;
  elevation: string;
}

export const mockSensorMeta: Record<string, SensorMeta> = {
  "SNR-001": { deploymentDate: "2026-01-15", batteryLevel: 87, coordinates: "-23.4532, -46.5891", elevation: "842m" },
  "SNR-002": { deploymentDate: "2026-01-16", batteryLevel: 92, coordinates: "-23.4589, -46.5923", elevation: "856m" },
  "SNR-003": { deploymentDate: "2026-01-17", batteryLevel: 78, coordinates: "-23.4612, -46.5847", elevation: "798m" },
  "SNR-004": { deploymentDate: "2026-01-18", batteryLevel: 85, coordinates: "-23.4478, -46.5912", elevation: "889m" },
  "SNR-005": { deploymentDate: "2026-01-19", batteryLevel: 90, coordinates: "-23.4545, -46.5867", elevation: "823m" },
  "SNR-006": { deploymentDate: "2026-01-20", batteryLevel: 74, coordinates: "-23.4601, -46.5834", elevation: "765m" },
  "SNR-007": { deploymentDate: "2026-01-21", batteryLevel: 88, coordinates: "-23.4523, -46.5878", elevation: "901m" },
  "SNR-008": { deploymentDate: "2026-01-22", batteryLevel: 65, coordinates: "-23.4567, -46.5956", elevation: "734m" },
  "SNR-009": { deploymentDate: "2026-01-23", batteryLevel: 95, coordinates: "-23.4490, -46.5802", elevation: "978m" },
  "SNR-010": { deploymentDate: "2026-01-24", batteryLevel: 71, coordinates: "-23.4634, -46.5871", elevation: "1024m" },
  "SNR-011": { deploymentDate: "2026-01-25", batteryLevel: 83, coordinates: "-23.4512, -46.5940", elevation: "812m" },
  "SNR-012": { deploymentDate: "2026-01-26", batteryLevel: 59, coordinates: "-23.4578, -46.5813", elevation: "693m" },
  "SNR-013": { deploymentDate: "2026-01-27", batteryLevel: 96, coordinates: "-23.4455, -46.5887", elevation: "947m" },
  "SNR-014": { deploymentDate: "2026-01-28", batteryLevel: 82, coordinates: "-23.4620, -46.5902", elevation: "856m" },
  "SNR-015": { deploymentDate: "2026-01-29", batteryLevel: 77, coordinates: "-23.4503, -46.5849", elevation: "789m" },
  "SNR-016": { deploymentDate: "2026-01-30", batteryLevel: 68, coordinates: "-23.4558, -46.5931", elevation: "712m" },
  "SNR-017": { deploymentDate: "2026-01-31", batteryLevel: 91, coordinates: "-23.4487, -46.5864", elevation: "1103m" },
  "SNR-018": { deploymentDate: "2026-02-01", batteryLevel: 80, coordinates: "-23.4641, -46.5819", elevation: "876m" },
  "SNR-019": { deploymentDate: "2026-02-02", batteryLevel: 73, coordinates: "-23.4529, -46.5898", elevation: "831m" },
  "SNR-020": { deploymentDate: "2026-02-03", batteryLevel: 86, coordinates: "-23.4595, -46.5861", elevation: "918m" },
};
