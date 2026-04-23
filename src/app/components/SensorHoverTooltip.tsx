interface SensorHoverTooltipProps {
  sensorId: string;
  habitat: string;
  species: number;
  detections: number;
  iucn: Record<string, number>;
  position: { x: number; y: number };
  progress?: number;
}

const iucnColors: Record<string, string> = {
  CR: "#C01A0E",
  EN: "#D03A1E",
  VU: "#E6901A",
  NT: "#CCB81E",
  LC: "#60A896",
};

const iucnLabels: Record<string, string> = {
  CR: "Critically Endangered",
  EN: "Endangered",
  VU: "Vulnerable",
  NT: "Near Threatened",
  LC: "Least Concern",
};

export function SensorHoverTooltip({
  sensorId,
  habitat,
  species,
  detections,
  iucn,
  position,
  progress = 100,
}: SensorHoverTooltipProps) {
  // Calculate percentages for pie chart
  const total = Object.values(iucn).reduce((a, b) => a + b, 0);
  const percentages = Object.entries(iucn).reduce(
    (acc, [key, val]) => {
      acc[key] = total > 0 ? (val / total) * 100 : 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Generate SVG donut chart
  const radius = 45;
  const innerRadius = 30;
  const centerX = 60;
  const centerY = 60;

  // Calculate arc paths
  let currentAngle = -90; // Start at top
  const IUCN_ORDER = ["CR", "EN", "VU", "NT", "LC"];
  const arcs = IUCN_ORDER.filter((s) => iucn[s] != null).map((status) => {
    const percentage = percentages[status];
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const x3 = centerX + innerRadius * Math.cos(endRad);
    const y3 = centerY + innerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(startRad);
    const y4 = centerY + innerRadius * Math.sin(startRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const path = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;

    currentAngle = endAngle;

    return {
      status,
      path,
      color: iucnColors[status],
      percentage,
    };
  });

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, calc(-100% - 20px))",
      }}
    >
      {/* Tooltip Container */}
      <div className="bg-[#2b2f3f] backdrop-blur-sm shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] p-4 min-w-[280px]">
        {/* Header */}
        <div
          className="flex items-center gap-2 mb-4 pb-3"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span
            className="text-[rgba(255,255,255,0.9)] text-sm"
            style={{
              fontFamily: "'Hexagon_Akkurat:bold',sans-serif",
            }}
          >
            Sensor: {sensorId}
          </span>
          <span className="text-[#778192]">·</span>
          <span
            className="text-[#b7b9be] text-sm"
            style={{
              fontFamily:
                "'Hexagon_Akkurat:regular',sans-serif",
            }}
          >
            {habitat}
          </span>
        </div>

        <div className="flex gap-4">
          {/* Donut Chart */}
          <div className="flex-shrink-0">
            <svg width="120" height="120" viewBox="0 0 120 120">
              {arcs.map((arc) => (
                <path
                  key={arc.status}
                  d={arc.path}
                  fill={arc.color}
                  opacity={0.9}
                />
              ))}
            </svg>
            {/* Center stats */}
          </div>

          {/* Legend and Stats */}
          <div className="flex-1 space-y-2">
            {/* IUCN Breakdown */}
            {IUCN_ORDER.filter((s) => iucn[s] != null).map((status) => (
              <div
                key={status}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2"
                    style={{
                      backgroundColor: iucnColors[status],
                    }}
                  />
                  <span
                    className="text-[#b7b9be]"
                    style={{
                      fontFamily:
                        "'Hexagon_Akkurat:regular',sans-serif",
                    }}
                  >
                    {status}
                  </span>
                </div>
                <span
                  className="text-[rgba(255,255,255,0.9)]"
                  style={{
                    fontFamily:
                      "'Hexagon_Akkurat:bold',sans-serif",
                  }}
                >
                  {Math.round(percentages[status])}%
                </span>
              </div>
            ))}

            {/* Species Count */}
            <div
              className="pt-2 mt-2"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center justify-between text-xs">
                <span
                  className="text-[#b7b9be]"
                  style={{
                    fontFamily:
                      "'Hexagon_Akkurat:regular',sans-serif",
                  }}
                >
                  Species
                </span>
                <span
                  className="text-[rgba(255,255,255,0.9)] text-base"
                  style={{
                    fontFamily:
                      "'Hexagon_Akkurat:bold',sans-serif",
                  }}
                >
                  {species}
                </span>
              </div>
            </div>

            {/* Processing Progress */}
            {/* <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#b4bac4]">
                  Processing Progress
                </span>
                <span className="text-[#f5f7fa] font-medium">
                  {progress}%
                </span>
              </div>
              <div className="h-1.5 bg-[#121623] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10b981] rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Arrow pointer */}
      <div
        className="absolute left-1/2 -bottom-2 -translate-x-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: "8px solid #2b2f3f",
        }}
      />
    </div>
  );
}