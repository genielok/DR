import { useState, useMemo, memo, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import {
  ChevronDown,
  ChevronUp,
  X,
  Leaf,
  AlertTriangle,
  RadioTower,
  MapPin,
  Search,
  Activity,
  Info,
  ListFilter,
  ExternalLink,
} from "lucide-react";
import { IUCNStatusText, type Campaign, type Species } from "../../../data/mockData";
import { getSpeciesByCampaign, getSpeciesBySensor } from "@/api";
import { DetectionAudioPlayer } from "./DetectionAudioPlayer";
import { AllDetectionsModal } from "./AllDetectionsModal";

/* ── Design-system tokens ── */
const F = {
  bold: "'Hexagon_Akkurat:bold',sans-serif",
  regular: "'Hexagon_Akkurat:regular',sans-serif",
};

export interface SensorInfo {
  sensorId: string;
  habitat: string;
  batteryLevel: number;
  coordinates: string;
  elevation: string;
}

interface OverviewTabProps {
  project: Campaign;
  sensorInfo?: SensorInfo;
  sensorId?: string;
}

const IUCN_COLORS: Record<string, string> = {
  "LC": "#60A896",
  "NT": "#CCB81E",
  "VU": "#E6901A",
  "EN": "#D03A1E",
  "CR": "#C01A0E",
};
const IUCN_TEXT: Record<string, string> = {
  "LC": "#FFFFFF",
  "NT": "#1A1A1A",
  "VU": "#FFFFFF",
  "EN": "#FFFFFF",
  "CR": "#FFFFFF",
};
const IUCN_ABB: Record<string, string> = {
  "LC": "Least Concern",
  "NT": "Near Threatened",
  "VU": "Vulnerable",
  "EN": "Endangered",
  "CR": "Critically Endangered",
};
const STATUS_ORDER = [
  "CR",
  "EN",
  "VU",
  "NT",
  "LC",
];


export function OverviewTab({
  project,
  sensorInfo,
  sensorId,
}: OverviewTabProps) {
  const [species, setSpecies] = useState<Species[]>([]);
  useEffect(() => {
    if (sensorId) {
      getSpeciesBySensor(sensorId).then(setSpecies);
    } else {
      getSpeciesByCampaign(project.id).then(setSpecies);
    }
  }, [project.id, sensorId]);

  const [searchQuery, setSearchQuery] = useState("");
  const [iucnFilter, setIucnFilter] = useState<Set<string>>(new Set());
  const [iucnDropdownOpen, setIucnDropdownOpen] = useState(false);
  const iucnDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (iucnDropdownRef.current && !iucnDropdownRef.current.contains(e.target as Node))
        setIucnDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const [expandedSpecies, setExpandedSpecies] = useState<
    string | null
  >(null);
  const [collapsedGroups, setCollapsedGroups] = useState<
    string[]
  >(["Least Concern"]);
  const [activeIndex, setActiveIndex] = useState<number | null>(
    null,
  );
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    commonName: string;
    scientificName: string;
  } | null>(null);
  const [detectionsModal, setDetectionsModal] =
    useState<Species | null>(null);
  const [playingAudio, setPlayingAudio] = useState<
    string | null
  >(null);
  const [hiddenLegends, setHiddenLegends] = useState<
    Set<string>
  >(new Set());

  const speciesData = species.reduce(
    (acc, s) => {
      acc[s.iucnStatus] = (acc[s.iucnStatus] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const chartData = STATUS_ORDER.filter(
    (s) => speciesData[s],
  ).map((name) => ({
    name,
    value: speciesData[name],
    color: IUCN_COLORS[name] || "#778192",
  }));

  const totalSpecies = chartData.reduce(
    (s, d) => s + d.value,
    0,
  );

  const AtRiskCount = (speciesData["EN"] ?? 0) + (speciesData["CR"] ?? 0) + (speciesData["VU"] ?? 0);

  const totalDetections = species.reduce(
    (sum, s) => sum + s.detectionCount,
    0,
  );

  // Auto-expand all groups while filtering so results are visible
  useEffect(() => {
    if (searchQuery.trim() || iucnFilter.size > 0) setCollapsedGroups([]);
  }, [searchQuery, iucnFilter]);

  const filteredSpecies = species.filter((s) => {
    const matchesSearch =
      !searchQuery.trim() ||
      s.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIucn =
      iucnFilter.size === 0 || iucnFilter.has(s.iucnStatus);
    return matchesSearch && matchesIucn;
  });

  const groupedSpecies = filteredSpecies.reduce(
    (acc, s) => {
      if (!acc[s.iucnStatus]) acc[s.iucnStatus] = [];
      acc[s.iucnStatus].push(s);
      return acc;
    },
    {} as Record<string, typeof species>,
  );

  const handleLegendHover = (index: number | null) =>
    setActiveIndex(index);

  const handleLegendClick = (name: string) => {
    setHiddenLegends((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const visibleChartData = chartData.filter(
    (item) => !hiddenLegends.has(item.name),
  );
  const visibleTotalSpecies = visibleChartData.reduce(
    (s, d) => s + d.value,
    0,
  );

  const chartOption: EChartsOption = useMemo(
    () => ({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "#2b2f3f",
        borderColor: "#474f5f",
        borderWidth: 1,
        textStyle: {
          color: "rgba(255,255,255,0.9)",
          fontSize: 11,
          fontFamily: F.regular,
        },
        formatter: (params: any) => {
          const percent = (
            (params.value / visibleTotalSpecies) *
            100
          ).toFixed(1);
          return `<div style="padding:4px;font-family:${F.regular}">
            <div style="font-family:${F.bold};margin-bottom:4px">${params.name}</div>
            <div style="color:#b7b9be">${params.value} species (${percent}%)</div>
          </div>`;
        },
      },
      series: [
        {
          type: "pie",
          radius: ["45%", "75%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0,
            borderColor: "#161921",
            borderWidth: 2,
          },
          label: { show: false },
          emphasis: {
            scale: true,
            scaleSize: 8,
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: "rgba(0,0,0,0.5)",
            },
          },
          data: visibleChartData.map((item) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
              color: item.color,
              opacity:
                activeIndex === null ||
                  activeIndex ===
                  chartData.findIndex(
                    (d) => d.name === item.name,
                  )
                  ? 1
                  : 0.35,
            },
          })),
        },
      ],
    }),
    [
      visibleChartData,
      visibleTotalSpecies,
      activeIndex,
      chartData,
    ],
  );

  const onChartEvents = {
    mouseover: (params: any) => {
      if (params.dataIndex !== undefined)
        setActiveIndex(params.dataIndex);
    },
    mouseout: () => setActiveIndex(null),
  };

  return (
    <div className="p-[20px] flex flex-col gap-[6px] h-full">
      {/* ── Stat Cards ── */}
      <div className="flex gap-[2px]">
        <StatCard
          label="Total Species"
          value={String(totalSpecies)}
          icon={<Leaf size={16} className="text-[#60A896]" />}
          accentColor="#60A896"
        />
        <StatCard
          label="At Risk"
          value={String(AtRiskCount)}
          icon={
            <AlertTriangle
              size={16}
              className="text-[#D03A1E]"
            />
          }
          accentColor="#D03A1E"
          valueColor="#D03A1E"
          tooltip="Species classified as Endangered (EN) or Critically Endangered (CR) on the IUCN Red List. Vulnerable (VU) and Near Threatened (NT) are excluded."
        />
        <StatCard
          label="Total Detections"
          value={totalDetections.toLocaleString()}
          icon={<Activity size={16} className="text-[#778192]" />}
          accentColor="#778192"
        />
        {sensorInfo ? (
          <StatCard
            label="Location"
            value={sensorInfo.coordinates}
            icon={
              <MapPin size={16} className="text-[#778192]" />
            }
            accentColor="#778192"
            subtext={`${sensorInfo.elevation} · ${sensorInfo.habitat}`}
          />
        ) : (
          <StatCard
            label="Sensors"
            value={String(project.sensors.length)}
            icon={
              <RadioTower
                size={16}
                className="text-[#778192]"
              />
            }
            accentColor="#778192"
          />
        )}
      </div>

      {/* ── Chart + Species List ── */}
      <div className="grid grid-cols-12 grid-rows-1 gap-[6px] flex-1 min-h-0">
        {/* Left: Donut Chart + Legend */}
        <div className="col-span-5">
          <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] h-full flex flex-col">
            <div className="h-[40px] px-[20px] flex items-center">
              <span
                className="text-[13px] leading-[18px] text-[rgba(255,255,255,0.9)]"
                style={{ fontFamily: F.bold }}
              >
                Species by IUCN Status
              </span>
            </div>

            <div className="flex flex-col items-center gap-[16px] flex-1 justify-center px-[20px] pb-[20px]">
              <div
                className="relative flex-shrink-0"
                style={{ width: 260, height: 260 }}
              >
                <ReactECharts
                  option={chartOption}
                  style={{ height: "260px", width: "260px" }}
                  onEvents={onChartEvents}
                  opts={{ renderer: "canvas" }}
                />
              </div>

              {/* Legend */}
              <div className="w-full grid grid-cols-2 gap-x-[12px] gap-y-[2px]">
                {chartData.map((item, i) => {
                  const isHovered = activeIndex === i;
                  const isHidden = hiddenLegends.has(item.name);
                  return (
                    <div
                      key={item.name}
                      className="flex items-center gap-[8px] cursor-pointer px-[8px] py-[6px] transition-all duration-150"
                      style={{
                        background: isHovered
                          ? `${item.color}18`
                          : "transparent",
                        opacity: isHidden ? 0.4 : 1,
                      }}
                      onMouseEnter={() => handleLegendHover(i)}
                      onMouseLeave={() =>
                        handleLegendHover(null)
                      }
                      onClick={() =>
                        handleLegendClick(item.name)
                      }
                    >
                      <span
                        className="text-[10px] px-[5px] py-[1px] flex-shrink-0"
                        style={{
                          fontFamily: F.bold,
                          background: item.color,
                          color: IUCN_TEXT[item.name],
                          textDecoration: isHidden
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {item.name}
                      </span>
                      <span
                        className="text-[11px] text-[#778192] flex-1 truncate"
                        style={{
                          fontFamily: F.regular,
                          textDecoration: isHidden
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {IUCN_ABB[item.name]}
                      </span>
                      <span
                        className="text-[12px] text-[rgba(255,255,255,0.9)]"
                        style={{
                          fontFamily: F.bold,
                          textDecoration: isHidden
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Species List */}
        <div className="col-span-7">
          <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] h-full flex flex-col">
            <div className="px-[20px] pt-[12px] pb-[8px] flex flex-col gap-[8px]">
              <div className="flex items-center justify-between">
                <span
                  className="text-[13px] leading-[18px] text-[rgba(255,255,255,0.9)]"
                  style={{ fontFamily: F.bold }}
                >
                  Species Detected
                </span>
                <span
                  className="text-[11px] px-[6px] py-[2px] bg-[#474f5f] text-[#778192]"
                  style={{ fontFamily: F.bold }}
                >
                  {(searchQuery || iucnFilter.size > 0)
                    ? `${filteredSpecies.length}/${totalSpecies}`
                    : totalSpecies}
                </span>
              </div>
              {/* Search + IUCN filter row */}
              <div className="flex gap-[6px]">
                <div className="relative flex-1">
                  <Search
                    size={12}
                    className="absolute left-[8px] top-1/2 -translate-y-1/2 text-[#778192] pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Search species…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-[28px] bg-[#1e2230] border border-[#474f5f] pl-[26px] pr-[8px] text-[11px] text-[rgba(255,255,255,0.9)] placeholder-[#778192] outline-none focus:border-[#778192] transition-colors"
                    style={{ fontFamily: F.regular }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-[6px] top-1/2 -translate-y-1/2 text-[#778192] hover:text-white transition-colors"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
                <div className="relative flex-shrink-0" ref={iucnDropdownRef}>
                  {/* Trigger button */}
                  <button
                    onClick={() => setIucnDropdownOpen((p) => !p)}
                    className="flex items-center gap-[5px] h-[28px] px-[8px] bg-[#1e2230] border border-[#474f5f] hover:border-[#778192] transition-colors cursor-pointer"
                    style={{
                      fontFamily: F.regular,
                      fontSize: "11px",
                      color: iucnFilter.size === 0 ? "#778192" : "rgba(255,255,255,0.9)",
                    }}
                  >
                    <ListFilter
                      size={11}
                      style={{ color: iucnFilter.size > 0 ? "rgba(255,255,255,0.9)" : "#778192", flexShrink: 0 }}
                    />
                    <span>
                      {iucnFilter.size === 0
                        ? "All IUCN"
                        : iucnFilter.size === 1
                          ? IUCN_ABB[[...iucnFilter][0]]
                          : `${iucnFilter.size} selected`}
                    </span>
                    <ChevronDown
                      size={10}
                      className={`transition-transform duration-150 ${iucnDropdownOpen ? "rotate-180" : ""}`}
                      style={{ color: "#778192", flexShrink: 0 }}
                    />
                  </button>

                  {/* Dropdown panel */}
                  {iucnDropdownOpen && (
                    <div
                      className="absolute top-full right-0 mt-[4px] z-50 py-[4px]"
                      style={{
                        background: "#1e2230",
                        border: "1px solid #474f5f",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                        minWidth: "160px",
                      }}
                    >
                      {/* Clear all */}
                      {iucnFilter.size > 0 && (
                        <button
                          onClick={() => setIucnFilter(new Set())}
                          className="w-full text-left px-[12px] py-[5px] text-[10px] text-[#778192] hover:text-white transition-colors"
                          style={{ fontFamily: F.regular }}
                        >
                          Clear filter
                        </button>
                      )}
                      {STATUS_ORDER.map((status) => {
                        const checked = iucnFilter.has(status);
                        const color = IUCN_COLORS[status];
                        return (
                          <button
                            key={status}
                            onClick={() => {
                              setIucnFilter((prev) => {
                                const next = new Set(prev);
                                if (next.has(status)) next.delete(status);
                                else next.add(status);
                                return next;
                              });
                            }}
                            className="w-full flex items-center gap-[8px] px-[12px] py-[6px] hover:bg-[#2b2f3f] transition-colors"
                          >
                            <div
                              className="w-[14px] h-[14px] flex-shrink-0 flex items-center justify-center border transition-colors"
                              style={{
                                borderColor: checked ? color : "#474f5f",
                                background: checked ? color : "transparent",
                              }}
                            >
                              {checked && (
                                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                  <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span
                              className="text-[10px] px-[4px] py-[1px] flex-shrink-0"
                              style={{ fontFamily: F.bold, background: color, color: IUCN_TEXT[status] }}
                            >
                              {status}
                            </span>
                            <span
                              className="text-[11px] flex-1 text-left truncate"
                              style={{ fontFamily: F.regular, color: checked ? "rgba(255,255,255,0.9)" : "#a0aab8" }}
                            >
                              {IUCNStatusText[status]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[2px] flex-1 min-h-0 overflow-y-auto px-[10px] pb-[10px]">
              {STATUS_ORDER.map((status) => {
                const group = groupedSpecies[status] || [];
                if (!group.length) return null;
                const isCollapsed =
                  collapsedGroups.includes(status);
                const abb = IUCN_ABB[status];
                const color = IUCN_COLORS[status];

                return (
                  <div key={status}>
                    <button
                      onClick={() =>
                        setCollapsedGroups((p) =>
                          p.includes(status)
                            ? p.filter((s) => s !== status)
                            : [...p, status],
                        )
                      }
                      className="sticky top-0 z-10 w-full flex items-center justify-between px-[12px] h-[36px] transition-colors hover:bg-[#556070] cursor-pointer"
                      style={{
                        background: `${color}18`,
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <div className="flex items-center gap-[8px]">
                        <span
                          className="text-[10px] px-[5px] py-[1px] flex-shrink-0"
                          style={{
                            fontFamily: F.bold,
                            background: color,
                            color: IUCN_TEXT[status],
                          }}
                        >
                          {status}
                        </span>
                        <span
                          className="text-[12px] text-[rgba(255,255,255,0.9)]"
                          style={{ fontFamily: F.bold }}
                        >
                          {IUCNStatusText[status]}
                        </span>
                        <span
                          className="text-[10px] px-[5px] py-[1px] bg-[#474f5f] text-[#778192]"
                          style={{ fontFamily: F.regular }}
                        >
                          {group.length}
                        </span>
                      </div>
                      {isCollapsed ? (
                        <ChevronDown
                          size={13}
                          className="text-[#778192]"
                        />
                      ) : (
                        <ChevronUp
                          size={13}
                          className="text-[#778192]"
                        />
                      )}
                    </button>

                    {!isCollapsed && (
                      <div className="flex flex-col gap-[1px]">
                        {group.map((species) => (
                          <SpeciesItem
                            key={species.id}
                            species={species}
                            color={color}
                            abb={abb}
                            isExpanded={
                              expandedSpecies === species.id
                            }
                            playingAudioKey={playingAudio}
                            onToggleExpand={() =>
                              setExpandedSpecies((p) =>
                                p === species.id
                                  ? null
                                  : species.id,
                              )
                            }
                            onSetPlayingAudio={setPlayingAudio}
                            onImageClick={(
                              url,
                              commonName,
                              scientificName,
                            ) =>
                              setLightboxImage({
                                url,
                                commonName,
                                scientificName,
                              })
                            }
                            onOpenDetections={setDetectionsModal}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detections Modal */}
      {detectionsModal && (
        <AllDetectionsModal
          species={detectionsModal}
          iucnColor={IUCN_COLORS[detectionsModal.iucnStatus] ?? "#778192"}
          onClose={() => setDetectionsModal(null)}
        />
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-[32px]"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-[40px] right-0 text-[rgba(255,255,255,0.9)] hover:text-[#778192] transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <img
              src={lightboxImage.url}
              alt={lightboxImage.commonName}
              loading="lazy"
              decoding="async"
              className="w-full"
            />
            <div className="mt-[12px] text-center">
              <div
                className="text-[16px] text-[rgba(255,255,255,0.9)]"
                style={{ fontFamily: F.bold }}
              >
                {lightboxImage.commonName || (
                  <span className="italic text-[#778192]" style={{ fontFamily: F.regular }}>
                    Common name unknown
                  </span>
                )}
              </div>
              <div
                className="text-[12px] italic text-[#778192] mt-[4px]"
                style={{ fontFamily: F.regular }}
              >
                {lightboxImage.scientificName}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({
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

/* ── Confidence Badge ── */
function ConfidenceBadge({ confidence }: { confidence: number }) {
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

/* ── Species Item ── */
const SpeciesItem = memo(
  ({
    species,
    color,
    isExpanded,
    playingAudioKey,
    onToggleExpand,
    onSetPlayingAudio,
    onImageClick,
    onOpenDetections,
  }: {
    species: Species;
    color: string;
    abb: string;
    isExpanded: boolean;
    playingAudioKey: string | null;
    onToggleExpand: () => void;
    onSetPlayingAudio: (id: string | null) => void;
    onImageClick: (
      url: string,
      commonName: string,
      scientificName: string,
    ) => void;
    onOpenDetections: (species: Species) => void;
  }) => {
    return (
      <div className="bg-[#3a4050]">
        <div
          className="flex items-center gap-[10px] px-[12px] h-[54px] hover:bg-[#474f5f] cursor-pointer transition-colors duration-150"
          onClick={onToggleExpand}
        >
          <div
            className="w-[2px] h-[28px] flex-shrink-0"
            style={{ background: color }}
          />
          <div className="flex-1 min-w-0">
            <div
              className="text-[15px] leading-[21px] truncate"
              style={{ fontFamily: species.commonName ? F.bold : F.regular, color: species.commonName ? "white" : "#778192", fontStyle: species.commonName ? "normal" : "italic" }}
            >
              {species.commonName || "Common name unknown"}
            </div>
            <div className="flex items-center gap-[5px] min-w-0">
              <div
                className="text-[12px] leading-[16px] italic text-[#a0aab8] truncate"
                style={{ fontFamily: F.regular }}
              >
                {species.scientificName}
              </div>
              <a
                href={`https://www.iucnredlist.org/search?query=${encodeURIComponent(species.scientificName)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-shrink-0 flex items-center gap-[2px] text-[10px] text-[#778192] hover:text-white transition-colors"
                style={{ fontFamily: F.regular }}
              >
                <ExternalLink size={9} />
                <span>IUCN</span>
              </a>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp
              size={13}
              className="text-[#a0aab8] flex-shrink-0"
            />
          ) : (
            <ChevronDown
              size={13}
              className="text-[#a0aab8] flex-shrink-0"
            />
          )}
        </div>

        {isExpanded && (
          <div className="flex h-[160px] bg-[#252936]">
            {/* Left: image (100×200) */}
            <button
              className="group relative w-[130px] h-full flex-shrink-0 overflow-hidden cursor-zoom-in"
              onClick={(e) => {
                e.stopPropagation();
                onImageClick(
                  species.imageUrl,
                  species.commonName,
                  species.scientificName,
                );
              }}
            >
              <img
                src={species.imageUrl}
                alt={species.commonName}
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-200">
                <svg
                  className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.5" y1="16.5" x2="22" y2="22" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
            </button>

            {/* Right: metadata + audio + IUCN */}
            <div className="flex-1 flex flex-col px-[12px] py-[10px] gap-[6px] min-w-0 overflow-hidden">
              {/* 2×2 meta grid */}
              <div className="grid grid-cols-2 gap-x-[12px] gap-y-[6px]">
                <div>
                  <div
                    className="text-[10px] text-[#778192] uppercase tracking-wider mb-[2px]"
                    style={{ fontFamily: F.bold }}
                  >
                    Sensor
                  </div>
                  <div
                    className="text-[12px] text-[rgba(255,255,255,0.9)] truncate"
                    style={{ fontFamily: F.bold }}
                  >
                    SNR-001 · Forest
                  </div>
                </div>
                <div>
                  <div
                    className="text-[10px] text-[#778192] uppercase tracking-wider mb-[2px]"
                    style={{ fontFamily: F.bold }}
                  >
                    Date Range
                  </div>
                  <div
                    className="text-[12px] text-[rgba(255,255,255,0.9)]"
                    style={{ fontFamily: F.bold }}
                  >
                    Jan 15 – Feb 28
                  </div>
                </div>
                <div>
                  <div
                    className="text-[10px] text-[#778192] uppercase tracking-wider mb-[2px]"
                    style={{ fontFamily: F.bold }}
                  >
                    Registers
                  </div>
                  <div className="flex items-center gap-[5px]">
                    <span
                      className="text-[12px] text-[rgba(255,255,255,0.9)]"
                      style={{ fontFamily: F.bold }}
                    >
                      {species.detectionCount} detections
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onOpenDetections(species); }}
                      className="text-[10px] text-[#778192] hover:text-white transition-colors"
                      style={{ fontFamily: F.bold }}
                    >
                      View all ↗
                    </button>
                  </div>
                </div>
                <div>
                  <div
                    className="text-[10px] text-[#778192] uppercase tracking-wider mb-[3px]"
                    style={{ fontFamily: F.bold }}
                  >
                    AI Confidence
                  </div>
                  <ConfidenceBadge confidence={species.confidence} />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#474f5f]" />

              {/* Audio Sample */}
              <div>
                <div
                  className="text-[9px] text-[#778192] uppercase tracking-wider mb-[4px]"
                  style={{ fontFamily: F.bold }}
                >
                  Audio Sample
                </div>
                <DetectionAudioPlayer
                  sampleKey={species.id}
                  sensorId="SNR-001"
                  date="Jan 15"
                  time="14:32"
                  confidence={Math.round(species.confidence * 100)}
                  isActive={playingAudioKey === species.id}
                  onToggle={(key) => {
                    onSetPlayingAudio(
                      playingAudioKey === key ? null : key,
                    );
                  }}
                />
              </div>

            </div>
          </div>
        )}
      </div>
    );
  },
);

SpeciesItem.displayName = "SpeciesItem";

