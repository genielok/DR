// ── Acoustic files ───────────────────────────────────────────

export interface AcousticFile {
  name: string;
  sensorId: string;
  timestamp: string;
  size: string;
}

export const mockAcousticFiles: AcousticFile[] = [
  { name: "SNR-001_20260415_063000.wav", sensorId: "SNR-001", timestamp: "2026-04-15 06:30:00", size: "127.4 MB" },
  { name: "SNR-001_20260415_073000.wav", sensorId: "SNR-001", timestamp: "2026-04-15 07:30:00", size: "127.4 MB" },
  { name: "SNR-002_20260415_063000.wav", sensorId: "SNR-002", timestamp: "2026-04-15 06:30:00", size: "127.4 MB" },
  { name: "SNR-003_20260415_063000.wav", sensorId: "SNR-003", timestamp: "2026-04-15 06:30:00", size: "127.4 MB" },
  { name: "SNR-003_20260415_073000.wav", sensorId: "SNR-003", timestamp: "2026-04-15 07:30:00", size: "127.4 MB" },
  { name: "SNR-004_20260415_063000.wav", sensorId: "SNR-004", timestamp: "2026-04-15 06:30:00", size: "127.4 MB" },
];

// ── Provenance tree ──────────────────────────────────────────

export interface ProvenanceRow {
  id: string;
  label: string;
  details: string;
  actionLabel: string;
  actionType: "link" | "download" | "jump" | "expand";
  actionTarget?: string;
  depth: number;
  children?: ProvenanceRow[];
}

export const mockProvenanceData: ProvenanceRow[] = [
  {
    id: "star",
    label: "STAR Score",
    details: "Biodiversity Impact: 0.87",
    actionLabel: "How is this calculated?",
    actionType: "link",
    actionTarget: "https://www.iucnredlist.org/assessment/star",
    depth: 0,
    children: [
      {
        id: "abundance",
        label: "Species Abundance Summary",
        details: "127 species detected, 3 endangered",
        actionLabel: "View species list in Review",
        actionType: "jump",
        depth: 1,
        children: [
          {
            id: "iucn",
            label: "IUCN Match Detail",
            details: "Matched against IUCN Red List v2026.1",
            actionLabel: "View IUCN Red List",
            actionType: "link",
            actionTarget: "https://www.iucnredlist.org/",
            depth: 2,
            children: [
              {
                id: "ai",
                label: "AI Raw Output",
                details: "BirdNET v2.4 · Perch v1.2 · Custom Model V1.0",
                actionLabel: "Download CSV",
                actionType: "download",
                depth: 3,
                children: [
                  {
                    id: "files",
                    label: "Raw Acoustic Files",
                    details: "1,248 WAV files · 156.3 GB total",
                    actionLabel: "View files",
                    actionType: "expand",
                    depth: 4,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
