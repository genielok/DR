import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Mic,
  LayoutDashboard,
  Activity,
  ZoomIn,
  ZoomOut,
  Crosshair,
  ChevronRight,
  X,
} from "lucide-react";
import { useProjects } from "../contexts/ProjectContext";
import { SensorPin } from "../components/pins/SensorPin";
import imgPlainOrtho from "@/assets/plain-ortho.png";
import { mockSensorIds } from "../data/sensors";
import { speciesData } from "../data/generateSpecies";

/* ── Design-system tokens ── */
const F = {
  bold: "'Hexagon_Akkurat:bold',sans-serif",
  regular: "'Hexagon_Akkurat:regular',sans-serif",
};

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

function getSensorRiskColor(iucn: Record<string, number> | undefined): string {
  if (!iucn) return "#10b981";
  if ((iucn.CR ?? 0) > 0) return "#C01A0E";
  if ((iucn.EN ?? 0) > 0) return "#D03A1E";
  if ((iucn.VU ?? 0) > 0) return "#E6901A";
  return "#10b981";
}

// Mock sensor positions for each project
const sensorPositions: Record<
  string,
  Record<string, { x: number; y: number }>
> = {
  "camp-001": {
    "SNR-001": { x: 30, y: 30 },
    "SNR-002": { x: 38, y: 24 },
    "SNR-003": { x: 55, y: 20 },
    "SNR-004": { x: 70, y: 28 },
    "SNR-005": { x: 82, y: 38 },
    "SNR-006": { x: 18, y: 48 },
    "SNR-007": { x: 32, y: 42 },
    "SNR-008": { x: 50, y: 38 },
    "SNR-009": { x: 66, y: 44 },
    "SNR-010": { x: 80, y: 55 },
    "SNR-011": { x: 24, y: 62 },
    "SNR-012": { x: 40, y: 58 },
    "SNR-013": { x: 56, y: 54 },
    "SNR-014": { x: 72, y: 62 },
    "SNR-015": { x: 80, y: 72 },
    "SNR-016": { x: 15, y: 76 },
    "SNR-017": { x: 36, y: 74 },
    "SNR-018": { x: 52, y: 72 },
    "SNR-019": { x: 66, y: 78 },
    "SNR-020": { x: 46, y: 46 },
  },
};

const habitatColors: Record<string, string> = {
  Forest: "#4ade80", // green
  Canopy: "#86efac", // light green
  "Dense Forest": "#22c55e", // dark green
  "Forest Edge": "#a3e635", // yellow-green
  Wetland: "#38bdf8", // sky blue
  Swamp: "#0ea5e9", // blue
  Creek: "#7dd3fc", // light blue
  "River Bank": "#60a5fa", // blue-400
  Grassland: "#fde047", // yellow
  Valley: "#facc15", // amber
  "Valley Floor": "#eab308", // amber-dark
  Ridge: "#fb923c", // orange
  Mountain: "#f97316", // orange-dark
  Plateau: "#fbbf24", // amber
  Hillside: "#f59e0b", // amber-600
  Canyon: "#f87171", // red-400
  "Cliff Face": "#ef4444", // red
  Ravine: "#e879f9", // fuchsia
  Mesa: "#c084fc", // purple
  Basin: "#94a3b8", // slate
};

function getHabitatColor(habitat: string): string {
  return habitatColors[habitat] ?? "#778192";
}

// Mock sensor habitat data
const sensorHabitats: Record<string, string> = {
  "SNR-001": "Forest",
  "SNR-002": "Canopy",
  "SNR-003": "Wetland",
  "SNR-004": "Ridge",
  "SNR-005": "Valley",
  "SNR-006": "Grassland",
  "SNR-007": "Forest Edge",
  "SNR-008": "River Bank",
  "SNR-009": "Dense Forest",
  "SNR-010": "Mountain",
  "SNR-011": "Swamp",
  "SNR-012": "Plateau",
  "SNR-013": "Canyon",
  "SNR-014": "Mesa",
  "SNR-015": "Hillside",
  "SNR-016": "Valley Floor",
  "SNR-017": "Cliff Face",
  "SNR-018": "Ravine",
  "SNR-019": "Creek",
  "SNR-020": "Basin",
};



type SensorDetectionMap = Record<string, { species: number; detections: number; iucn: Record<string, number> }>;

function buildSensorDetections(
  sensorIds: Record<string, string[]>,
  speciesGroup: typeof speciesData,
): SensorDetectionMap {
  const speciesMap = Object.fromEntries(speciesGroup.map((s) => [s.id, s]));
  return Object.fromEntries(
    Object.entries(sensorIds).map(([sensorId, ids]) => {
      const list = ids.map((id) => speciesMap[id]).filter((s): s is (typeof speciesData)[number] => !!s);
      const iucn: Record<string, number> = {};
      let detections = 0;
      for (const sp of list) {
        const abbr = sp.iucnStatus;
        if (abbr) iucn[abbr] = (iucn[abbr] ?? 0) + 1;
        detections += sp.detectionCount ?? 0;
      }
      return [sensorId, { species: list.length, detections, iucn }];
    }),
  );
}


const sensorDetectionsPerGroup: Record<string, SensorDetectionMap> = {
  "camp-001": buildSensorDetections(mockSensorIds, speciesData),
};

export default function ProjectMapView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects } = useProjects();

  const [hoveredSensorId, setHoveredSensorId] = useState<
    string | null
  >(null);
  const [selectedSensorId, setSelectedSensorId] = useState<
    string | null
  >(null);
  const [zoom, setZoom] = useState(1);
  const [mapFocus, setMapFocus] = useState<{ originX: number; originY: number; scale: number } | null>(null);

  // Debounce timer ref
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSensorEnter = useCallback((sensorId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredSensorId(sensorId);
  }, []);

  const handleSensorLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredSensorId(null);
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const project = projects.find((p) => p.id === id);


  if (!project) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-[#161921]">
        <div className="flex flex-col items-center gap-[12px]">
          <span
            className="text-[16px] leading-[22px] text-[rgba(255,255,255,0.9)]"
            style={{ fontFamily: F.bold }}
          >
            Project not found
          </span>
          <button
            onClick={() => navigate(-1)}
            className="h-[30px] px-[14px] bg-[#474f5f] hover:bg-[#556070] text-[#b7b9be] hover:text-white transition-colors duration-150 cursor-pointer"
            style={{ fontFamily: F.regular, fontSize: "12px" }}
          >
            Go back to projects
          </button>
        </div>
      </div>
    );
  }

  const projectSensors = sensorPositions[project.id] || {};
  const sensorDetections: SensorDetectionMap =
    sensorDetectionsPerGroup[project.id] ??
    Object.fromEntries(
      project.sensors.map((sensorId) => [
        sensorId,
        sensorDetectionsPerGroup["camp-001"]?.[sensorId] ?? { species: 0, detections: 0, iucn: {} },
      ]),
    );

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#161921] gap-[6px]">
      {/* ── Left Sidebar ── */}
      <div className="w-[340px] flex-shrink-0 flex flex-col overflow-hidden py-[6px] pl-[6px]" style={{ height: "100vh" }}>
        {/* ── Header Card — fixed, never scrolls ── */}
        <div className="bg-[#2b2f3f] px-[20px] py-[14px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] shrink-0 mb-[6px]">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-[6px] h-[28px] px-[8px] -ml-[8px] mb-[10px] bg-transparent hover:bg-[#474f5f] text-[#778192] hover:text-[rgba(255,255,255,0.9)] transition-colors duration-150 cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span
              className="text-[12px] leading-[18px]"
              style={{ fontFamily: F.regular }}
            >
              Back to Projects
            </span>
          </button>

          <h1
            className="text-[18px] leading-[27px] text-[rgba(255,255,255,0.9)] truncate"
            style={{ fontFamily: F.bold }}
          >
            {project.name}
          </h1>
          <div className="flex items-center gap-[6px] mt-[4px]">
            <MapPin
              size={11}
              className="text-[#778192] flex-shrink-0"
            />
            <span
              className="text-[12px] leading-[18px] text-[#b7b9be] truncate"
              style={{ fontFamily: F.regular }}
            >
              {project.location}
            </span>
          </div>

          <button
            onClick={() => navigate(`/projects/${id}`)}
            className="w-full mt-[14px] h-[34px] bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors duration-150 inline-flex items-center justify-center gap-[6px] cursor-pointer"
          >
            <LayoutDashboard size={13} />
            <span
              className="text-[12px] leading-[18px]"
              style={{ fontFamily: F.regular }}
            >
              View Full Project Analytics
            </span>
          </button>
        </div>

        {/* ── Sensors List ── */}
        {(() => {
          const allSensors = project.sensors
            .map((sensorId) => {
              const iucn = sensorDetections[sensorId]?.iucn ?? {};
              const cr = iucn.CR ?? 0;
              const en = iucn.EN ?? 0;
              return { sensorId, cr, en, score: cr * 3 + en };
            })
            .sort((a, b) => b.score - a.score);

          return (
            <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] flex-1 flex flex-col overflow-hidden min-h-0">
              {/* Header */}
              <div className="h-[40px] px-[20px] flex items-center gap-[8px] shrink-0 border-b border-[rgba(255,255,255,0.06)]">
                <span
                  className="text-[13px] leading-[18px] text-[rgba(255,255,255,0.9)]"
                  style={{ fontFamily: F.bold }}
                >
                  Sensors List
                </span>
                <span
                  className="ml-auto text-[11px] leading-[16px] text-[#778192]"
                  style={{ fontFamily: F.regular }}
                >
                  {project.sensors.length}
                </span>
              </div>

              <div
                className="flex-1 overflow-y-auto px-[10px] py-[10px]"
                onMouseLeave={handleSensorLeave}
              >
                <div className="flex flex-col gap-[2px]">
                  {allSensors.map(({ sensorId, cr, en }, rank) => {
                    const isSelected = selectedSensorId === sensorId;
                    const isHovered = hoveredSensorId === sensorId;
                    const position = projectSensors[sensorId];
                    const riskColor = cr > 0 ? "#C01A0E" : en > 0 ? "#D03A1E" : "transparent";

                    const handleClick = () => {
                      const next = selectedSensorId === sensorId ? null : sensorId;
                      setSelectedSensorId(next);
                      if (next && position) {
                        setMapFocus({ originX: position.x, originY: position.y, scale: 1.8 });
                      } else {
                        setMapFocus(null);
                      }
                    };

                    return (
                      <div
                        key={sensorId}
                        className="flex items-center gap-[10px] px-[12px] py-[10px] cursor-pointer transition-all duration-150"
                        style={{
                          background: isSelected ? "#3a4354" : isHovered ? "#556070" : "#474f5f",
                          borderLeft: `2px solid ${isSelected ? riskColor : "transparent"}`,
                        }}
                        onMouseEnter={() => handleSensorEnter(sensorId)}
                        onClick={handleClick}
                      >
                        {/* Rank */}
                        <span
                          className="text-[11px] leading-none w-[16px] text-center flex-shrink-0"
                          style={{
                            fontFamily: F.bold,
                            color: rank === 0 ? "#C01A0E" : rank === 1 ? "#D03A1E" : rank === 2 ? "#E6901A" : "#778192",
                          }}
                        >
                          #{rank + 1}
                        </span>

                        {/* Sensor ID + habitat */}
                        <div className="flex flex-col min-w-0">
                          <span
                            className="text-[12px] leading-[16px]"
                            style={{
                              fontFamily: F.bold,
                              color: isSelected || isHovered ? "rgba(255,255,255,0.9)" : "#b7b9be",
                            }}
                          >
                            {sensorId}
                          </span>
                          <span
                            className="text-[10px] leading-[14px] truncate"
                            style={{
                              fontFamily: F.regular,
                              opacity: isSelected || isHovered ? 1 : 0.7,
                            }}
                          >
                            {sensorHabitats[sensorId] || "Unknown"}
                          </span>
                        </div>

                        {/* CR/EN labels — lightweight dot + text */}
                        <div className="ml-auto flex flex-col items-end gap-[4px] flex-shrink-0">
                          {cr > 0 && (
                            <span className="flex items-center gap-[5px]">
                              <span
                                className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                                style={{ backgroundColor: "#C01A0E" }}
                              />
                              <span
                                className="text-[10px] leading-none"
                                style={{ fontFamily: F.regular, color: "rgba(255,255,255,0.85)" }}
                              >
                                CR {cr}
                              </span>
                            </span>
                          )}
                          {en > 0 && (
                            <span className="flex items-center gap-[5px]">
                              <span
                                className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                                style={{ backgroundColor: "#D03A1E" }}
                              />
                              <span
                                className="text-[10px] leading-none"
                                style={{ fontFamily: F.regular, color: "rgba(255,255,255,0.85)" }}
                              >
                                EN {en}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── Right Panel — Map ── */}
      <div className="flex-1 relative overflow-hidden bg-[#161921]">
        {/* Base Map */}
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{
            transform: mapFocus
              ? `scale(${mapFocus.scale})`
              : `scale(${zoom})`,
            transformOrigin: mapFocus
              ? `${mapFocus.originX}% ${mapFocus.originY}%`
              : "center center",
          }}
        >
          <img
            src={imgPlainOrtho}
            alt="Project Map"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            draggable={false}
          />

          {/* Sensor Pins Layer */}
          {project.sensors.map((sensorId) => {
            const position = projectSensors[sensorId] || {
              x: 50,
              y: 50,
            };
            return (
              <SensorPin
                key={`${project.id}-${sensorId}`}
                sensorId={sensorId}
                position={position}
                status="active"
                riskColor={getSensorRiskColor(sensorDetections[sensorId]?.iucn)}
                crCount={sensorDetections[sensorId]?.iucn?.CR ?? 0}
                enCount={sensorDetections[sensorId]?.iucn?.EN ?? 0}
                isHovered={hoveredSensorId === sensorId}
                isSelected={selectedSensorId === sensorId}
                isDimmed={selectedSensorId !== null && selectedSensorId !== sensorId}
                showBadges={hoveredSensorId === sensorId || selectedSensorId === sensorId}
                onClick={() => {
                  const next = selectedSensorId === sensorId ? null : sensorId;
                  setSelectedSensorId(next);
                  if (next) {
                    setMapFocus({ originX: position.x, originY: position.y, scale: 1.8 });
                  } else {
                    setMapFocus(null);
                  }
                }}
                onMouseEnter={() => handleSensorEnter(sensorId)}
                onMouseLeave={handleSensorLeave}
              />
            );
          })}
        </div>

        {/* ── Floating Sensor Info Card (visible when zoomed in) ── */}
        {selectedSensorId && (() => {
          const selectedData = sensorDetections[selectedSensorId];
          if (!selectedData) return null;
          return (
            <div
              className="absolute bottom-[20px] left-[20px] z-30 w-[260px]"
              style={{
                background: "#2b2f3f",
                boxShadow: "0px 10px 30px rgba(0,0,0,0.5)",
                opacity: mapFocus ? 1 : 0,
                transform: mapFocus ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                pointerEvents: mapFocus ? "auto" : "none",
              }}
            >
              {/* Card header */}
              <div className="h-[40px] px-[14px] flex items-center gap-[8px] border-b border-[rgba(255,255,255,0.06)]">
                <Mic size={12} className="text-[#3b82f6] flex-shrink-0" />
                <span
                  className="text-[13px] leading-[18px] text-[rgba(255,255,255,0.9)]"
                  style={{ fontFamily: F.bold }}
                >
                  {selectedSensorId}
                </span>
                <span
                  className="text-[11px] leading-[16px] truncate"
                  style={{ fontFamily: F.regular, color: getHabitatColor(sensorHabitats[selectedSensorId] || "") }}
                >
                  · {sensorHabitats[selectedSensorId]}
                </span>
                <button
                  className="ml-auto text-[#778192] hover:text-white transition-colors cursor-pointer"
                  onClick={() => { setSelectedSensorId(null); setMapFocus(null); }}
                >
                  <X size={12} />
                </button>
              </div>

              <div className="p-[14px]">
                {/* Metrics */}
                <div className="flex items-center gap-[16px] mb-[12px]">
                  <div className="flex items-center gap-[4px]">
                    <span
                      className="text-[16px] leading-[20px] text-[rgba(255,255,255,0.9)]"
                      style={{ fontFamily: F.bold }}
                    >
                      {selectedData.species.toLocaleString()}
                    </span>
                    <span
                      className="text-[10px] leading-[16px] text-[#778192]"
                      style={{ fontFamily: F.regular }}
                    >
                      Species
                    </span>
                  </div>
                  <div className="flex items-center gap-[4px]">
                    <span
                      className="text-[16px] leading-[20px] text-[rgba(255,255,255,0.9)]"
                      style={{ fontFamily: F.bold }}
                    >
                      {selectedData.detections.toLocaleString()}
                    </span>
                    <span
                      className="text-[10px] leading-[16px] text-[#778192]"
                      style={{ fontFamily: F.regular }}
                    >
                      Detections
                    </span>
                  </div>
                </div>

                {/* Separator */}
                <div className="h-px w-full bg-[rgba(255,255,255,0.08)] mb-[10px]" />

                {/* IUCN breakdown */}
                <div className="flex flex-col gap-[6px]">
                  <span
                    className="text-[10px] leading-[14px] text-[#778192] uppercase tracking-wider"
                    style={{ fontFamily: F.bold }}
                  >
                    IUCN Status
                  </span>
                  {(["CR", "EN", "VU", "NT", "LC"] as const)
                    .filter((s) => selectedData.iucn[s] != null)
                    .map((status) => {
                      const count = selectedData.iucn[status];
                      const total = Object.values(selectedData.iucn).reduce((a, b) => a + b, 0);
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={status} className="flex items-center gap-[8px]">
                          <span
                            className="w-[8px] h-[8px] rounded-full flex-shrink-0"
                            style={{ backgroundColor: iucnColors[status] }}
                          />
                          <span
                            className="w-[22px] flex-shrink-0 text-[11px] leading-[16px]"
                            style={{ fontFamily: F.bold, color: iucnColors[status] }}
                          >
                            {status}
                          </span>
                          <span
                            className="text-[11px] leading-[16px] text-[#b7b9be] flex-1 truncate"
                            style={{ fontFamily: F.regular }}
                          >
                            {iucnLabels[status]}
                          </span>
                          <span
                            className="text-[12px] leading-[16px] text-[rgba(255,255,255,0.9)] w-[28px] text-right flex-shrink-0"
                            style={{ fontFamily: F.bold }}
                          >
                            {count}
                          </span>
                          <div className="w-[36px] h-[4px] bg-[rgba(255,255,255,0.06)] overflow-hidden flex-shrink-0">
                            <div
                              className="h-full"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: iucnColors[status],
                                opacity: 0.7,
                                transition: "width 0.4s ease",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* View Details button */}
                <button
                  onClick={() => navigate(`/projects/${project.id}/sensors/${selectedSensorId}`)}
                  className="w-full mt-[14px] h-[32px] bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors duration-150 inline-flex items-center justify-center gap-[6px] cursor-pointer"
                >
                  <ChevronRight size={13} />
                  <span className="text-[12px] leading-[18px]" style={{ fontFamily: F.regular }}>
                    View Sensor Details
                  </span>
                </button>
              </div>
            </div>
          );
        })()}

        {/* ── Map Top Bar ── */}
        <div
          className="absolute top-[10px] left-[10px] right-[10px] flex items-center justify-between z-10"
          style={{ pointerEvents: "none" }}
        >
          <div
            className="h-[36px] px-[14px] flex items-center gap-[10px]"
            style={{
              background: "#2b2f3f",
              boxShadow: "0px 10px 30px 0px rgba(0,0,0,0.25)",
              pointerEvents: "auto",
            }}
          >
            <Mic size={12} className="text-[#778192]" />
            <span
              className="text-[12px] leading-[18px] text-[rgba(255,255,255,0.9)]"
              style={{ fontFamily: F.bold }}
            >
              {project.sensors.length} Sensors
            </span>
            <span className="w-px h-[16px] bg-[#474f5f]" />
            <Activity size={12} className="text-[#778192]" />
            <span
              className="text-[11px] leading-[16px] text-[#b7b9be]"
              style={{ fontFamily: F.regular }}
            >
              {project.speciesCount.toLocaleString()} Species
            </span>
          </div>

          {/* Sensor count active */}
          {/* <div
            className="h-[36px] px-[14px] flex items-center gap-[8px]"
            style={{
              background: "#2b2f3f",
              boxShadow: "0px 10px 30px 0px rgba(0,0,0,0.25)",
              pointerEvents: "auto",
            }}
          >
            <span className="w-[6px] h-[6px] rounded-full bg-[#10b981] flex-shrink-0" />
            <span
              className="text-[11px] leading-[16px] text-[#b7b9be]"
              style={{ fontFamily: F.regular }}
            >
              All sensors active
            </span>
          </div> */}
        </div>

        {/* ── Map Controls (right side) ── */}
        {/* <div className="absolute right-[10px] top-1/2 -translate-y-1/2 flex flex-col gap-[2px] z-10">
          <MapControlBtn
            onClick={() =>
              setZoom((z) => Math.min(z + 0.15, 2))
            }
            title="Zoom in"
          >
            <ZoomIn size={14} />
          </MapControlBtn>
          <MapControlBtn
            onClick={() =>
              setZoom((z) => Math.max(z - 0.15, 0.5))
            }
            title="Zoom out"
          >
            <ZoomOut size={14} />
          </MapControlBtn>
          <div className="h-[4px]" />
          <MapControlBtn
            onClick={() => setZoom(1)}
            title="Reset view"
          >
            <Crosshair size={14} />
          </MapControlBtn>
        </div> */}

        {/* ── Scale Bar (bottom-right) ── */}
        {/* <div
          className="absolute bottom-[10px] right-[10px] z-10 flex items-center gap-[8px] h-[28px] px-[10px]"
          style={{ background: "rgba(43,47,63,0.85)" }}
        >
          <div className="flex items-center gap-[4px]">
            <div className="w-[40px] h-[2px] bg-[#778192]" />
            <span
              className="text-[9px] leading-[14px] text-[#778192]"
              style={{ fontFamily: F.regular }}
            >
              5 km
            </span>
          </div>
          <span className="w-px h-[12px] bg-[#474f5f]" />
          <span
            className="text-[9px] leading-[14px] text-[#778192]"
            style={{ fontFamily: F.regular }}
          >
            -19.9°S, -43.8°W
          </span>
        </div> */}

      </div>
    </div>
  );
}

/* ── Stat Cell ── */
function StatCell({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex-1 bg-[#474f5f] px-[14px] py-[10px] flex flex-col gap-[2px]">
      <div className="flex items-center gap-[6px]">
        {icon}
        <span
          className="text-[10px] leading-[14px] text-[#778192]"
          style={{ fontFamily: F.regular }}
        >
          {label}
        </span>
      </div>
      <span
        className="text-[16px] leading-[22px] text-[rgba(255,255,255,0.9)]"
        style={{ fontFamily: F.bold }}
      >
        {value}
      </span>
    </div>
  );
}

/* ── Map Control Button ── */
function MapControlBtn({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      className="w-[34px] h-[34px] flex items-center justify-center text-[#778192] hover:text-[rgba(255,255,255,0.9)] transition-colors duration-150 cursor-pointer"
      style={{
        background: "#2b2f3f",
        boxShadow: "0px 10px 30px 0px rgba(0,0,0,0.25)",
      }}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}