import { F } from "../const";

export function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const color =
    pct >= 70 ? "#60A896" : pct >= 50 ? "#E6901A" : "#D03A1E";
  const label = pct >= 70 ? "High" : pct >= 50 ? "Med" : "Low";
  return (
    <div className="flex items-center gap-[5px]">
      <span
        className="text-[11px]"
        style={{ fontFamily: F.bold, color }}
      >
        {pct}%
      </span>
      <span
        className="text-[11px] px-[4px] py-[1px] uppercase tracking-wider"
        style={{
          fontFamily: F.bold,
          color,
          background: `${color}22`,
          border: `1px solid ${color}55`,
        }}
      >
        {label}
      </span>
    </div>
  );
}
