import { Target } from "lucide-react";

interface ProjectPinProps {
  sensorCount: number;
  status: "active" | "completed" | "processing";
  position: { x: number; y: number }; // Position in percentage (0-100)
  isHovered?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const statusColors: Record<string, string> = {
  active: "#3b82f6",
  processing: "#f59e0b",
  completed: "#10b981",
};

export function ProjectPin({
  sensorCount,
  status,
  position,
  isHovered = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: ProjectPinProps) {
  const borderColor = statusColors[status];

  return (
    <div
      className="absolute cursor-pointer transition-all duration-200"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -100%) scale(${isHovered ? 1.2 : 1})`,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Pin Circle */}
      <div
        className="w-12 h-12 rounded-full bg-[#1e2230] border-2 flex flex-col items-center justify-center relative"
        style={{
          borderColor,
          boxShadow: isHovered
            ? `0 0 20px ${borderColor}80`
            : "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <Target className="w-4 h-4 text-white mb-0.5" />
        <span className="text-white text-xs font-medium">{sensorCount}</span>
      </div>

      {/* Pin Stem */}
      <div
        className="w-0.5 h-3 mx-auto"
        style={{ backgroundColor: borderColor }}
      />
    </div>
  );
}
