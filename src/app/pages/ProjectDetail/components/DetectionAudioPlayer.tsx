import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause } from "lucide-react";

interface DetectionAudioPlayerProps {
  sampleKey: string;
  sensorId: string;
  date: string;
  time: string;
  confidence: number;
  isActive: boolean;
  onToggle: (key: string) => void;
}

const DURATION = 12;

const confColor = (c: number) =>
  c >= 90 ? "#10b981" : c >= 70 ? "#f59e0b" : "#ef4444";

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;

const F = {
  bold: "'Hexagon_Akkurat:bold',sans-serif",
  regular: "'Hexagon_Akkurat:regular',sans-serif",
  mono: "ui-monospace,monospace",
};

export function DetectionAudioPlayer({
  sampleKey,
  sensorId,
  date,
  time,
  confidence,
  isActive,
  onToggle,
}: DetectionAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const progress = (current / DURATION) * 100;

  useEffect(() => {
    if (isPlaying && isActive && !isDragging) {
      intervalRef.current = setInterval(() => {
        setCurrent((p) => {
          if (p + 0.1 >= DURATION) { setIsPlaying(false); return 0; }
          return p + 0.1;
        });
      }, 100);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, isActive, isDragging]);

  useEffect(() => {
    if (!isActive) { setIsPlaying(false); setCurrent(0); }
  }, [isActive]);

  useEffect(() => {
    if (isActive) setIsPlaying(true);
  }, [isActive]);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    setCurrent(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * DURATION);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    seek(e as React.MouseEvent<HTMLDivElement>);
  }, [seek]);

  useEffect(() => {
    if (!isDragging) return;
    const move = (e: MouseEvent) => {
      if (!progressRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      setCurrent(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * DURATION);
    };
    const up = () => setIsDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, [isDragging]);

  const color = confColor(confidence);

  return (
    <div
      className="flex items-center gap-[8px] px-[10px] h-[38px] transition-colors"
      style={{ background: isActive ? "#2b2f3f" : "#1e2230", border: "1px solid #474f5f" }}
    >
      {/* Play/Pause */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isActive) setIsPlaying((p) => !p);
          else onToggle(sampleKey);
        }}
        className="flex-shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center transition-colors"
        style={{ background: isActive ? "#3b82f6" : "#474f5f", color: "white" }}
      >
        {isActive && isPlaying
          ? <Pause size={9} />
          : <Play size={9} className="ml-[1px]" />
        }
      </button>

      {/* Sensor · date · time */}
      <span
        className="text-[10px] text-[#778192] flex-shrink-0 truncate"
        style={{ fontFamily: F.regular, maxWidth: "90px" }}
      >
        {sensorId} · {date}
      </span>

      {/* Current time */}
      <span
        className="text-[10px] text-[#778192] flex-shrink-0 w-[26px] text-right"
        style={{ fontFamily: F.mono }}
      >
        {fmt(current)}
      </span>

      {/* Progress bar */}
      <div
        ref={progressRef}
        className="flex-1 relative group cursor-pointer py-[6px]"
        onClick={seek}
        onMouseDown={onMouseDown}
      >
        <div className="h-[3px] bg-[#474f5f] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-75"
            style={{ width: `${progress}%`, background: isActive ? "#3b82f6" : "#474f5f" }}
          />
        </div>
        {isActive && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow"
            style={{ left: `calc(${progress}% - 4px)` }}
          />
        )}
      </div>

      {/* Total duration */}
      <span
        className="text-[10px] text-[#778192] flex-shrink-0 w-[26px]"
        style={{ fontFamily: F.mono }}
      >
        {fmt(DURATION)}
      </span>

      {/* Confidence */}
      <span
        className="text-[10px] flex-shrink-0 px-[5px] py-[1px]"
        style={{ fontFamily: F.bold, color, background: `${color}20`, border: `1px solid ${color}40` }}
      >
        {confidence}%
      </span>
    </div>
  );
}
