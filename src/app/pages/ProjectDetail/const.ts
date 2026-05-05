/* ── Design-system tokens ── */
export const F = {
  bold: "'Hexagon_Akkurat:bold',sans-serif",
  regular: "'Hexagon_Akkurat:regular',sans-serif",
};

export const IUCN_COLORS: Record<string, string> = {
  "LC": "#60A896",
  "NT": "#CCB81E",
  "VU": "#E6901A",
  "EN": "#D03A1E",
  "CR": "#C01A0E",
};

export const IUCN_TEXT: Record<string, string> = {
  "LC": "#FFFFFF",
  "NT": "#1A1A1A",
  "VU": "#FFFFFF",
  "EN": "#FFFFFF",
  "CR": "#FFFFFF",
};

export const IUCN_ABB: Record<string, string> = {
  "LC": "Least Concern",
  "NT": "Near Threatened",
  "VU": "Vulnerable",
  "EN": "Endangered",
  "CR": "Critically Endangered",
};

export const STATUS_ORDER = [
  "CR",
  "EN",
  "VU",
  "NT",
  "LC",
];
