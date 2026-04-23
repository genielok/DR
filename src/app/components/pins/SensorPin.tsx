import { Mic } from "lucide-react";

interface SensorPinProps {
  sensorId: string;
  position: { x: number; y: number };
  status?: "active" | "processing" | "inactive";
  riskColor?: string;
  crCount?: number;
  enCount?: number;
  isHovered?: boolean;
  isSelected?: boolean;
  isDimmed?: boolean;
  showBadges?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const statusColors: Record<string, string> = {
  active: "#10b981",
  processing: "#f59e0b",
  inactive: "#778192",
};

export function SensorPin({
  sensorId,
  position,
  status = "active",
  riskColor,
  crCount = 0,
  enCount = 0,
  isHovered = false,
  isSelected = false,
  isDimmed = false,
  showBadges = true,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: SensorPinProps) {
  const ringColor = riskColor ?? statusColors[status];
  const sensorNumber = sensorId.split("-")[1] || "001";

  // 1. Size encoding — scale up based on high-risk species count
  const riskScore = crCount * 3 + enCount;
  const sizeScale = 1 + Math.min(riskScore * 0.06, 0.55);
  const baseSize = Math.round(38 * sizeScale);

  // 2. Pulse animation — only for sensors with CR or EN
  const hasPulse = crCount > 0 || enCount > 0;

  // 3. Halo glow — radius and opacity based on risk
  const glowRadius = crCount > 0 ? 28 : enCount > 0 ? 18 : 0;
  const glowOpacity = crCount > 0 ? 0.25 : enCount > 0 ? 0.18 : 0;

  const interactiveScale = isHovered || isSelected ? 1.2 : 1;

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) scale(${interactiveScale})`,
        transition: "transform 0.2s ease, opacity 0.3s ease",
        zIndex: isHovered || isSelected ? 20 : 10,
        opacity: isDimmed ? 0.2 : 1,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 3. Heatmap halo */}
      {glowRadius > 0 && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${baseSize + glowRadius * 2}px`,
            height: `${baseSize + glowRadius * 2}px`,
            top: `${-glowRadius}px`,
            left: `${-glowRadius}px`,
            background: `radial-gradient(circle, ${ringColor}${Math.round(glowOpacity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* 4. Pulse ring animation */}
      {hasPulse && (
        <div
          className="absolute rounded-none pointer-events-none animate-ping"
          style={{
            width: `${baseSize}px`,
            height: `${baseSize}px`,
            top: 0,
            left: 0,
            border: `2px solid ${ringColor}`,
            opacity: 0.5,
            animationDuration: crCount > 0 ? "1.2s" : "2s",
          }}
        />
      )}

      {/* Pin body */}
      <div
        className="relative flex flex-col items-center justify-center bg-[#2b2f3f]"
        style={{
          width: `${baseSize}px`,
          height: `${baseSize}px`,
          border: `2px solid ${ringColor}`,
          boxShadow:
            isHovered || isSelected
              ? `0 0 20px ${ringColor}80`
              : `0 0 8px ${ringColor}40, 0px 10px 30px 0px rgba(0,0,0,0.25)`,
        }}
      >
        <Mic
          size={Math.round(13 * sizeScale)}
          className="text-white"
          style={{ marginBottom: "2px" }}
        />
        <span
          className="text-white leading-none"
          style={{
            fontFamily: "'Hexagon_Akkurat:bold',sans-serif",
            fontSize: `${Math.round(9 * sizeScale)}px`,
          }}
        >
          {sensorNumber}
        </span>

        {/* 2. CR/EN badges — top-right corner */}
        {showBadges && (crCount > 0 || enCount > 0) && (
          <div
            className="absolute flex flex-col gap-[2px]"
            style={{ top: "-8px", right: "-8px" }}
          >
            {crCount > 0 && (
              <span
                className="leading-none px-[4px] py-[2px]"
                style={{
                  fontFamily: "'Hexagon_Akkurat:bold',sans-serif",
                  fontSize: "9px",
                  color: "#fff",
                  background: "#C01A0E",
                  whiteSpace: "nowrap",
                }}
              >
                CR {crCount}
              </span>
            )}
            {enCount > 0 && (
              <span
                className="leading-none px-[4px] py-[2px]"
                style={{
                  fontFamily: "'Hexagon_Akkurat:bold',sans-serif",
                  fontSize: "9px",
                  color: "#fff",
                  background: "#D03A1E",
                  whiteSpace: "nowrap",
                }}
              >
                EN {enCount}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
