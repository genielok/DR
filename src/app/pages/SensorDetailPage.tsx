import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Database,
  Download,
  Calendar,
} from "lucide-react";
import { useProjects } from "../contexts/ProjectContext";
import { getSensorMeta, getSensorHabitat, type SensorMeta } from "@/api";
import { OverviewTab } from "./ProjectDetail/components/OverviewTab";

/* ── Design-system tokens ── */
const F = {
  bold: "'Hexagon_Akkurat:bold',sans-serif",
  regular: "'Hexagon_Akkurat:regular',sans-serif",
};


const tabs = [
  { id: "overview", label: "Overview" },
  // { id: "review", label: "Review" },
  // { id: "operation-log", label: "Operation Log" },
  // { id: "data-provenance", label: "Data Provenance" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function SensorDashboard() {
  const { projectId, sensorId } = useParams<{
    projectId: string;
    sensorId: string;
  }>();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showCsvTooltip, setShowCsvTooltip] = useState(false);
  const [meta, setMeta] = useState<SensorMeta | null>(null);
  const [habitat, setHabitat] = useState("Unknown");

  useEffect(() => {
    if (!sensorId) return;
    getSensorMeta(sensorId).then((m) => setMeta(m ?? null));
    getSensorHabitat(sensorId).then(setHabitat);
  }, [sensorId]);

  const project = projects.find((p) => p.id === projectId);

  if (!project || !sensorId) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-[#161921]">
        <div className="flex flex-col items-center gap-[16px]">
          <div className="w-[64px] h-[64px] bg-[#2b2f3f] flex items-center justify-center">
            <Database size={28} className="text-[#778192]" />
          </div>
          <span
            className="text-[16px] leading-[22px] text-[rgba(255,255,255,0.9)]"
            style={{ fontFamily: F.bold }}
          >
            Sensor not found
          </span>
          <button
            onClick={() => navigate(-1)}
            className="h-[34px] px-[16px] bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors duration-150 cursor-pointer inline-flex items-center gap-[6px]"
          >
            <ArrowLeft size={13} />
            <span
              className="text-[12px] leading-[18px]"
              style={{ fontFamily: F.regular }}
            >
              Back to Projects
            </span>
          </button>
        </div>
      </div>
    );
  }

  const deployedDate = meta
    ? new Date(meta.deploymentDate).toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    )
    : "N/A";

  const sensorInfo = meta
    ? {
      sensorId,
      habitat,
      batteryLevel: meta.batteryLevel,
      coordinates: meta.coordinates,
      elevation: meta.elevation,
    }
    : undefined;

  console.log({ project })
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            project={project}
            sensorInfo={sensorInfo}
            sensorId={sensorId}
          />
        );
      // case "review":
      //   return <ReviewTab project={project} />;
      // case "operation-log":
      //   return <OperationLogTab project={project} />;
      // case "data-provenance":
      //   return <DataProvenanceTab project={project} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#161921] h-full overflow-hidden">
      {/* ── Header ── */}
      <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] shrink-0">
        <div className="px-[24px] py-[16px]">
          <div className="flex items-start justify-between gap-[16px]">
            {/* Left: back + sensor title + meta */}
            <div className="flex flex-col gap-[8px] min-w-0">
              {/* Row 1: back + sensor ID */}
              <div className="flex items-center gap-[8px]">
                <button
                  onClick={() => navigate(-1)}
                  className="text-[#778192] hover:text-[rgba(255,255,255,0.9)] hover:bg-[#474f5f] h-[30px] w-[30px] flex items-center justify-center transition-colors duration-150 shrink-0 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                </button>
                <Database
                  size={16}
                  className="text-[#3b82f6] flex-shrink-0"
                />
                <h1
                  className="text-[18px] leading-[27px] text-[rgba(255,255,255,0.9)] truncate"
                  style={{ fontFamily: F.bold }}
                >
                  {sensorId}
                </h1>
                {/* Active badge */}
                <span
                  className="inline-flex items-center gap-[4px] px-[7px] py-[1px] border border-solid flex-shrink-0"
                  style={{
                    fontFamily: F.regular,
                    fontSize: "10px",
                    lineHeight: "15px",
                    backgroundColor: "rgba(16,185,129,0.12)",
                    borderColor: "rgba(16,185,129,0.25)",
                    color: "#10b981",
                  }}
                >
                  <span className="w-[5px] h-[5px] rounded-full flex-shrink-0 bg-[#10b981]" />
                  Active
                </span>
              </div>

              {/* Row 2: metadata */}
              <div className="flex items-center gap-[8px] ml-[38px] flex-wrap">
                {/* Project name */}
                <span
                  className="text-[11px] leading-[16px] text-[#b7b9be] truncate"
                  style={{ fontFamily: F.regular }}
                >
                  {project.name}
                </span>
                <span className="text-[11px] text-[#778192]">
                  ·
                </span>

                {/* Habitat */}
                <span
                  className="px-[7px] py-[1px] text-[10px] leading-[15px] text-[#b7b9be] bg-[#474f5f] flex-shrink-0"
                  style={{ fontFamily: F.regular }}
                >
                  {habitat}
                </span>

                <span className="text-[11px] text-[#778192]">
                  ·
                </span>

                {/* Deployed date */}
                <Calendar
                  size={10}
                  className="text-[#778192] flex-shrink-0"
                />
                <span
                  className="text-[11px] leading-[16px] text-[#b7b9be] whitespace-nowrap"
                  style={{ fontFamily: F.regular }}
                >
                  Deployed {deployedDate}
                </span>
              </div>
            </div>

            {/* Right: action buttons */}
            <div className="flex gap-[8px] flex-shrink-0">
              {/* Export CSV */}
              <div className="relative">
                <button
                  className="h-[34px] px-[14px] border border-[#4a5568] bg-transparent hover:bg-[#404856] text-[#b7b9be] hover:text-white transition-colors duration-150 inline-flex items-center gap-[6px] cursor-pointer"
                  onMouseEnter={() => setShowCsvTooltip(true)}
                  onMouseLeave={() => setShowCsvTooltip(false)}
                >
                  <Download size={13} />
                  <span
                    className="text-[12px] leading-[18px]"
                    style={{ fontFamily: F.regular }}
                  >
                    Export CSV
                  </span>
                </button>
                {showCsvTooltip && (
                  <div
                    className="absolute top-full mt-[6px] right-0 z-10 w-[240px] px-[12px] py-[8px]"
                    style={{
                      background: "#2b2f3f",
                      boxShadow:
                        "0px 10px 30px 0px rgba(0,0,0,0.25)",
                      fontFamily: F.regular,
                      fontSize: "11px",
                      lineHeight: "16px",
                      color: "#b7b9be",
                    }}
                  >
                    Download species list with IUCN status,
                    detection counts and sensor metadata
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Sensor Stats Row ── */}

        {/* ── Tab Bar ── */}
        <div className="flex px-[24px] mt-[6px]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative h-[40px] px-[16px] flex items-center transition-colors duration-150 cursor-pointer"
              style={{
                fontFamily:
                  activeTab === tab.id ? F.bold : F.regular,
                fontSize: "12px",
                lineHeight: "18px",
                color:
                  activeTab === tab.id
                    ? "rgba(255,255,255,0.9)"
                    : "#778192",
                background:
                  activeTab === tab.id
                    ? "#474f5f"
                    : "transparent",
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3b82f6]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="flex-1 overflow-auto">
        {renderTabContent()}
      </div>
    </div>
  );
}

