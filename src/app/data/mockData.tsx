export type IUCNStatus =
  | "LC"
  | "NT"
  | "VU"
  | "EN"
  | "CR"
  | "EX"
  | "DD";

export const IUCNStatusText = {
  LC: "Least Concern",
  NT: "Near Threatened",
  VU: "Vulnerable",
  EN: "Endangered",
  CR: "Critically Endangered",
  EX: "Extinct in the Wild",
  DD: "Data Deficient",
};

export interface Species {
  id: string;
  scientificName: string;
  commonName: string;
  iucnStatus: IUCNStatus;
  imageUrl: string;
  sampleAudioUrl: string;
  detectionCount: number;
  confidence: number;
  maxConfidence: number;
  lastDetected: string;
  attribution?: string;
  detectionInfo?: {
    BirdNET: number;
    Perch: number;
    CustomModel: number;
    max: number;
  };
  sensorInfo: {
    date: string;
    model: string;
    sensorId: string;
    confidence: number;
    fileName: string;
    observationId: string;
  }[];
}

export interface Campaign {
  id: string;
  name: string;
  client: string;
  location: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "processing";
  totalRecordings: number;
  processedRecordings: number;
  speciesCount: number;
  sensors: string[];
  speciesByStatus: Partial<Record<IUCNStatus, number>>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  campaignId: string;
  dataChanged?: any;
}

export interface ProcessingResult {
  id: string;
  campaignId: string;
  fileName: string;
  uploadDate: string;
  processingDate: string;
  model: "BirdNET" | "Perch" | "Custom Model" | "Map of Life";
  modelVersion: string;
  detections: number;
  status: "pending" | "processing" | "completed" | "failed";
}
