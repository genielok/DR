import { useState, useRef, useCallback, useEffect } from "react";
import imgExtentLossGain1 from "@/assets/extent-loss-gain.png";
import imgForestGain1 from "@/assets/forest-gain.png";
import imgForest from "@/assets/forest.png";
import imgPlainOrtho1 from "@/assets/plain-ortho.png";
import imgSandGain from "@/assets/sand-gain.png";
import imgSand from "@/assets/sand.png";
import imgShrubGain from "@/assets/shrub-gain.png";
import imgShrub from "@/assets/shrub.png";
import imgWater from "@/assets/water.png";

export type LayerType =
  | "extent_loss&Gain"
  | "forest"
  | "forest_gain"
  | "sand"
  | "sand_gain"
  | "shrub"
  | "shrub_gain"
  | "water";

const LAYER_IMAGES: Record<LayerType, string> = {
  "extent_loss&Gain": imgExtentLossGain1,
  forest: imgForest,
  forest_gain: imgForestGain1,
  sand: imgSand,
  sand_gain: imgSandGain,
  shrub: imgShrub,
  shrub_gain: imgShrubGain,
  water: imgWater,
};

const YEARS = [
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
];

const KEY_ITEMS = [
  { id: "natural", color: "#6fbf81", label: "Natural" },
  { id: "natural_gain", color: "#1bd71d", label: "Natural gain (461ha)" },
  { id: "non_natural", color: "#e92f2e", label: "Non-natural" },
];

// Track height and handle size mirror the Figma design
const TRACK_H = 101;
const HANDLE_SIZE = 24;
const SLIDER_RANGE = TRACK_H - HANDLE_SIZE; // 77px

type MapViewerProps = {
  selectedLayer?: LayerType;
};

export function MapViewer({ selectedLayer: externalLayer }: MapViewerProps) {
  const [activeLayer, setActiveLayer] = useState<LayerType>(
    externalLayer || "extent_loss&Gain"
  );
  // opacity: 0 = fully transparent, 1 = fully opaque (default 30%)
  const [opacity, setOpacity] = useState(0.3);
  // divider position as % of container width (default ~55%)
  const [dividerPercent, setDividerPercent] = useState(55);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [activeKeys, setActiveKeys] = useState<string[]>([
    "natural",
    "natural_gain",
    "non_natural",
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const isDraggingDivider = useRef(false);
  const isDraggingSlider = useRef(false);

  // Sync external layer prop
  useEffect(() => {
    if (externalLayer) setActiveLayer(externalLayer);
  }, [externalLayer]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingDivider.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
      setDividerPercent(pct);
    }
    if (isDraggingSlider.current && sliderTrackRef.current) {
      const rect = sliderTrackRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const newOpacity = Math.max(0, Math.min(1, y / rect.height));
      setOpacity(newOpacity);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingDivider.current = false;
    isDraggingSlider.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const toggleKey = (key: string) => {
    setActiveKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Handle position in pixels within the slider track
  const handleTopPx = opacity * SLIDER_RANGE;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none p-[40px]"
      style={{ background: "#161921" }}
    >
      {/* ─── BASE LAYER: plain ortho, always fully visible ─── */}
      <img
        src={imgPlainOrtho1}
        alt="Plain ortho base imagery"
        className="absolute inset-[40px] w-[calc(100%-80px)] h-[calc(100%-80px)] object-contain pointer-events-none"
        draggable={false}
      />

      {/* ─── OVERLAY LAYER: clipped to left of divider ─── */}
      <div
        className="absolute inset-[40px] pointer-events-none"
        style={{
          clipPath: `inset(0 ${100 - dividerPercent}% 0 0)`,
        }}
      >
        <img
          src={LAYER_IMAGES[activeLayer]}
          alt="Analysis overlay layer"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ opacity }}
          draggable={false}
        />
      </div>

      {/* ─── DRAGGABLE DIVIDER LINE ─── */}
      <div
        className="absolute z-20 flex items-center justify-center cursor-col-resize"
        style={{
          left: `${dividerPercent}%`,
          transform: "translateX(-50%)",
          width: "24px",
          top: "40px",
          bottom: "40px",
        }}
        onMouseDown={(e) => {
          isDraggingDivider.current = true;
          e.preventDefault();
        }}
      >
        {/* Cyan vertical line */}
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{ backgroundColor: "#70D6EF", left: "50%" }}
        />
        {/* Drag handle pill */}
        <div
          className="relative z-10 flex items-center justify-center rounded-full"
          style={{
            width: "22px",
            height: "36px",
            backgroundColor: "rgba(22, 25, 33, 0.75)",
            border: "1px solid #70D6EF",
          }}
        >
          {/* Double-arrow icon */}
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path
              d="M4 5H10M4 5L6 3M4 5L6 7M10 5L8 3M10 5L8 7"
              stroke="#70D6EF"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* ─── KEY LEGEND (top-left, above slider) ─── */}
      <div className="absolute top-[110px] left-[120px] z-30 flex flex-col gap-[10px]">
        {KEY_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleKey(item.id)}
            className="flex items-center gap-[10px] transition-opacity duration-200"
            style={{ opacity: activeKeys.includes(item.id) ? 1 : 0.3 }}
          >
            <div
              className="flex-shrink-0"
              style={{
                width: "9px",
                height: "9px",
                backgroundColor: item.color,
              }}
            />
            <span
              className="text-white"
              style={{ fontFamily: "Roboto, sans-serif", fontSize: "14px", lineHeight: "14px" }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* ─── VERTICAL OPACITY SLIDER (left edge) ─── */}
      <div className="absolute z-30" style={{ left: "76px", top: "111px" }}>
        {/* Track */}
        <div
          ref={sliderTrackRef}
          className="relative rounded-[50px] border cursor-pointer"
          style={{
            width: "28px",
            height: `${TRACK_H}px`,
            borderColor: "#778192",
            background:
              "linear-gradient(to bottom, rgba(119,129,146,0) 20.792%, #778192 88.119%)",
          }}
          onMouseDown={(e) => {
            isDraggingSlider.current = true;
            const rect = e.currentTarget.getBoundingClientRect();
            const y = e.clientY - rect.top;
            setOpacity(Math.max(0, Math.min(1, y / rect.height)));
            e.preventDefault();
          }}
        >
          {/* Handle knob */}
          <div
            className="absolute flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing"
            style={{
              left: "2px",
              top: `${handleTopPx}px`,
              width: `${HANDLE_SIZE}px`,
              height: `${HANDLE_SIZE}px`,
              backgroundColor: "#D9D9D9",
              border: "1px solid #778192",
              transition: isDraggingSlider.current ? "none" : "top 0.05s",
            }}
            onMouseDown={(e) => {
              isDraggingSlider.current = true;
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <span
              className="select-none"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "7px",
                color: "#474f5f",
                lineHeight: "1",
              }}
            >
              {Math.round(opacity * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* ─── YEAR TIMELINE (right edge) ─── */}
      <div
        className="absolute z-30"
        style={{ right: "64px", top: "111px" }}
      >
        {/* Cyan accent: dot + descending line */}
        <div className="absolute flex flex-col items-center" style={{ left: "-14px", top: "0" }}>
          {/* Dot */}
          <div
            className="rounded-full"
            style={{ width: "5px", height: "5px", backgroundColor: "#70D6EF", marginBottom: "2px" }}
          />
          {/* Line */}
          <div
            style={{ width: "1px", height: "144px", backgroundColor: "#70D6EF" }}
          />
        </div>

        <div className="flex flex-col items-start" style={{ gap: "24px" }}>
          {YEARS.map((year) => {
            const isCurrent = year === selectedYear;
            return (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className="text-white whitespace-nowrap transition-all duration-150"
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: isCurrent ? "18px" : "8px",
                  fontWeight: isCurrent ? 600 : 400,
                  opacity: isCurrent ? 0.9 : 0.7,
                  lineHeight: "8px",
                }}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}