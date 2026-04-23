export interface AuditItem {
  id: string;
  title: string;
  subtitle: string;
  level: number;
  children?: AuditItem[];
}

export const mockAuditData: AuditItem[] = [
  {
    id: "processed-maps-1",
    title: "Processed orthographical maps",
    subtitle: "4 Maps 2Gig",
    level: 0,
    children: [
      { id: "segmented-lidar", title: "Segmented lidar data", subtitle: "4 Maps 2Gig", level: 1 },
    ],
  },
  {
    id: "processed-maps-2",
    title: "Processed orthographical maps",
    subtitle: "4 Maps 2Gig",
    level: 1,
    children: [
      { id: "raw-hspc", title: "Raw HSPC lidar data", subtitle: "4 Maps 2Gig", level: 2 },
    ],
  },
  {
    id: "uncorrected-imagery",
    title: "Uncorrected imagery",
    subtitle: "4 Maps 2Gig",
    level: 2,
    children: [
      { id: "unprocessed-lidar", title: "Unprocessed lidar data", subtitle: "4 Maps 2Gig", level: 3 },
    ],
  },
];
