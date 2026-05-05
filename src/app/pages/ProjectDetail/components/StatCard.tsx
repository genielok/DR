import { Info } from "lucide-react";
import { F } from "../const";

export function StatCard({
  label,
  value,
  icon,
  accentColor,
  valueColor,
  subtext,
  tooltip,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accentColor: string;
  valueColor?: string;
  subtext?: string;
  tooltip?: string;
}) {
  return (
    <div
      className="flex-1 bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] px-[16px] py-[14px]"
      style={{ borderLeft: `3px solid ${accentColor}` }}
    >
      <div className="flex items-center justify-between mb-[8px]">
        <div className="flex items-center gap-[4px]">
          <span
            className="text-[12px] leading-[14px] text-[#778192] uppercase tracking-wider"
            style={{ fontFamily: F.bold }}
          >
            {label}
          </span>
          {tooltip && (
            <div className="relative group/tip flex-shrink-0">
              <Info size={13} className="text-[#778192] hover:text-white transition-colors cursor-default" />
              <div
                className="absolute top-full left-0 mt-[6px] w-[240px] px-[12px] py-[10px] text-[11px] text-[#b7b9be] leading-[16px] pointer-events-none opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 z-50"
                style={{
                  fontFamily: F.regular,
                  background: "#1e2230",
                  border: "1px solid #474f5f",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}
              >
                {tooltip}
              </div>
            </div>
          )}
        </div>
        {icon}
      </div>
      <div
        className="text-[20px] leading-[30px]"
        style={{
          fontFamily: F.bold,
          color: valueColor || "rgba(255,255,255,0.9)",
        }}
      >
        {value}
      </div>
      {subtext && (
        <div
          className="text-[10px] text-[#778192] mt-[2px] truncate"
          style={{ fontFamily: F.regular }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
}
