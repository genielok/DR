export interface OperationLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  species: string;
}

export const mockOperationLog: OperationLogEntry[] = [
  { id: "1",  timestamp: "2026-04-15 14:32", user: "Sarah Chen",          action: "Audio Upload",            details: "124 files from SNR-003",                          species: "-" },
  { id: "2",  timestamp: "2026-04-16 11:45", user: "Dr. Sarah Chen",      action: "Species Confirmed",       details: "Verified from audio spectrogram",                  species: "Blue-crowned Hanging Parrot" },
  { id: "3",  timestamp: "2026-04-16 12:00", user: "Dr. James Liu",       action: "Species Rejected",        details: "Misidentified - background noise",                 species: "Ivory-billed Woodpecker" },
  { id: "4",  timestamp: "2026-04-17 08:23", user: "Sarah Chen",          action: "Expert Review Requested", details: "High-risk species requires external validation",    species: "Helmeted Hornbill" },
  { id: "5",  timestamp: "2026-04-17 15:50", user: "Dr. Emily Rodriguez", action: "Species Confirmed",       details: "Matched with reference database",                  species: "Northern Spotted Owl" },
  { id: "6",  timestamp: "2026-04-18 09:15", user: "Prof. Maria Garcia",  action: "Species Confirmed",       details: "Expert validation complete",                       species: "Wallace's Hawk-eagle" },
  { id: "7",  timestamp: "2026-04-18 10:30", user: "Dr. Sarah Chen",      action: "Bulk Confirmation",       details: "15 high-confidence species confirmed",             species: "Multiple" },
  { id: "8",  timestamp: "2026-04-18 14:22", user: "Dr. John Smith",      action: "Species Rejected",        details: "False positive - wind interference",               species: "Sumatran Ground Cuckoo" },
  { id: "9",  timestamp: "2026-04-19 08:45", user: "System",              action: "Model Run",               details: "BirdNET v2.4 batch processing completed",          species: "-" },
  { id: "10", timestamp: "2026-04-19 11:00", user: "Dr. Sarah Chen",      action: "Report Generated",        details: "Q1 2026 biodiversity report exported",             species: "-" },
];
