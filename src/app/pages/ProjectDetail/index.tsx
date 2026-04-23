import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Download,
  FileText,
  Upload,
} from "lucide-react";
import { useProjects } from "../../contexts/ProjectContext";
import { OverviewTab } from "./components/OverviewTab";
import { ReviewTab } from "./components/ReviewTab";
import { OperationLogTab } from "./components/OperationLogTab";
import { DataProvenanceTab } from "./components/DataProvenanceTab";

/* ── Design-system tokens ── */
const F = {
  bold: "'Hexagon_Akkurat:bold',sans-serif",
  regular: "'Hexagon_Akkurat:regular',sans-serif",
};

const statusBadgeBg: Record<string, string> = {
  active: "rgba(59,130,246,0.12)",
  processing: "rgba(245,158,11,0.12)",
  completed: "rgba(16,185,129,0.12)",
};
const statusBadgeBorder: Record<string, string> = {
  active: "rgba(59,130,246,0.25)",
  processing: "rgba(245,158,11,0.25)",
  completed: "rgba(16,185,129,0.25)",
};
const statusDotColor: Record<string, string> = {
  active: "#3b82f6",
  processing: "#f59e0b",
  completed: "#10b981",
};
const statusLabels: Record<string, string> = {
  active: "Active",
  processing: "Processing",
  completed: "Completed",
};

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "review", label: "Review" },
  { id: "operation-log", label: "Operation Log" },
  { id: "data-provenance", label: "Data Provenance" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showCsvTooltip, setShowCsvTooltip] = useState(false);
  const [showReportTooltip, setShowReportTooltip] =
    useState(false);

  const campaign = projects.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="flex-1 flex items-center justify-center h-full w-full bg-[#161921]">
        <div className="flex flex-col items-center gap-[16px]">
          <div className="w-[64px] h-[64px] bg-[#2b2f3f] flex items-center justify-center">
            <Upload size={28} className="text-[#778192]" />
          </div>
          <span
            className="text-[16px] leading-[22px] text-[rgba(255,255,255,0.9)]"
            style={{ fontFamily: F.bold }}
          >
            Project not found
          </span>
          <span
            className="text-[12px] leading-[18px] text-[#778192]"
            style={{ fontFamily: F.regular }}
          >
            This project may have been removed or doesn't exist
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

  const period = `${new Date(campaign.startDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })} – ${new Date(campaign.endDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })}`;

  const hasData =
    !campaign ||
    campaign.totalRecordings > 0 ||
    campaign.speciesCount > 0;

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab project={campaign} />;
      case "review":
        return <ReviewTab project={campaign} />;
      case "operation-log":
        return <OperationLogTab project={campaign} />;
      case "data-provenance":
        return <DataProvenanceTab project={campaign} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#161921] h-full overflow-hidden">
      {/* ── Header ── */}
      <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] shrink-0">
        <div className="px-[24px] py-[16px]">
          <div className="flex items-start justify-between gap-[16px]">
            {/* Left: back + title + meta */}
            <div className="flex flex-col gap-[8px] min-w-0">
              {/* Row 1: back + title */}
              <div className="flex items-center gap-[8px]">
                <button
                  onClick={() => navigate(-1)}
                  className="text-[#778192] hover:text-[rgba(255,255,255,0.9)] hover:bg-[#474f5f] h-[30px] w-[30px] flex items-center justify-center transition-colors duration-150 shrink-0 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                </button>
                <h1
                  className="text-[18px] leading-[27px] text-[rgba(255,255,255,0.9)] truncate"
                  style={{ fontFamily: F.bold }}
                >
                  {campaign.name}
                </h1>
              </div>

              {/* Row 2: metadata badges */}
              <div className="flex items-center gap-[8px] ml-[38px] flex-wrap">
                {/* Status badge */}
                <span
                  className="inline-flex items-center gap-[4px] px-[7px] py-[1px] border border-solid flex-shrink-0"
                  style={{
                    fontFamily: F.regular,
                    fontSize: "10px",
                    lineHeight: "15px",
                    backgroundColor:
                      statusBadgeBg[campaign.status],
                    borderColor:
                      statusBadgeBorder[campaign.status],
                    color: statusDotColor[campaign.status],
                  }}
                >
                  <span
                    className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        statusDotColor[campaign.status],
                    }}
                  />
                  {statusLabels[campaign.status]}
                </span>

                {/* Location */}
                <MapPin
                  size={10}
                  className="text-[#778192] flex-shrink-0"
                />
                <span
                  className="text-[11px] leading-[16px] text-[#b7b9be] truncate"
                  style={{ fontFamily: F.regular }}
                >
                  {campaign.location}
                </span>

                <span className="text-[11px] text-[#778192]">
                  ·
                </span>

                {/* Date */}
                <Calendar
                  size={10}
                  className="text-[#778192] flex-shrink-0"
                />
                <span
                  className="text-[11px] leading-[16px] text-[#b7b9be] whitespace-nowrap"
                  style={{ fontFamily: F.regular }}
                >
                  {period}
                </span>
              </div>
            </div>

            {/* Right: action buttons */}
            {hasData && (
              <div className="flex gap-[8px] flex-shrink-0">
                {/* Import Data */}
                <button
                  onClick={() =>
                    navigate(`/projects/${id}/import`)
                  }
                  className="h-[34px] px-[14px] bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors duration-150 inline-flex items-center gap-[6px] cursor-pointer"
                >
                  <Upload size={13} />
                  <span
                    className="text-[12px] leading-[18px]"
                    style={{ fontFamily: F.regular }}
                  >
                    Import Data
                  </span>
                </button>

                {/* Export CSV */}
                <div className="relative">
                  <button
                    className="h-[34px] px-[14px] border border-[#4a5568] bg-transparent hover:bg-[#404856] text-[#b7b9be] hover:text-white transition-colors duration-150 inline-flex items-center gap-[6px] cursor-pointer"
                    onMouseEnter={() => setShowCsvTooltip(true)}
                    onMouseLeave={() =>
                      setShowCsvTooltip(false)
                    }
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

                {/* Download Report */}
                <div className="relative">
                  {/* <button
                    className="h-[34px] px-[14px] border border-[#4a5568] bg-transparent hover:bg-[#404856] text-[#b7b9be] hover:text-white transition-colors duration-150 inline-flex items-center gap-[6px] cursor-pointer"
                    onMouseEnter={() =>
                      setShowReportTooltip(true)
                    }
                    onMouseLeave={() =>
                      setShowReportTooltip(false)
                    }
                  >
                    <FileText size={13} />
                    <span
                      className="text-[12px] leading-[18px]"
                      style={{ fontFamily: F.regular }}
                    >
                      Download Report
                    </span>
                  </button> */}
                  {showReportTooltip && (
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
                      Generate comprehensive biodiversity report
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Tab Bar ── */}
        {/* TODO: no include in thesis, but develop future */}
        {/* {hasData && (
          <div className="flex px-[24px]">
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
        )} */}
      </div>

      {/* ── Content Area ── */}
      <div className="flex-1 overflow-auto">
        {!hasData ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-[16px]">
              <div className="w-[64px] h-[64px] bg-[#2b2f3f] flex items-center justify-center">
                <Upload size={28} className="text-[#778192]" />
              </div>
              <span
                className="text-[16px] leading-[22px] text-[rgba(255,255,255,0.9)]"
                style={{ fontFamily: F.bold }}
              >
                No Data Yet
              </span>
              <span
                className="text-[12px] leading-[18px] text-[#778192] text-center max-w-[280px]"
                style={{ fontFamily: F.regular }}
              >
                Import sensor data to start analyzing this
                project
              </span>
              <button
                onClick={() =>
                  navigate(`/projects/${id}/import`)
                }
                className="h-[34px] px-[16px] bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors duration-150 cursor-pointer inline-flex items-center gap-[6px]"
              >
                <Upload size={13} />
                <span
                  className="text-[12px] leading-[18px]"
                  style={{ fontFamily: F.regular }}
                >
                  Import Data
                </span>
              </button>
            </div>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
}