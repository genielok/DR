import { useState, useEffect, useRef, useMemo } from "react";
import clsx from "clsx";
import {
  Plus,
  MapPin,
  Calendar,
  Edit2,
  X,
  ArrowRight,
  Map,
} from "lucide-react";
import { useProjects } from "../contexts/ProjectContext";

interface Campaign {
  id: string;
  name: string;
  client: string;
  location: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "processing";
  speciesCount: number;
  totalRecordings: number;
  processedRecordings: number;
  sensors: string[];
  habitatTypes?: string[];
}

const statusColors: Record<string, string> = {
  active: "#3b82f6",
  processing: "#f59e0b",
  completed: "#10b981",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  processing: "Processing",
  completed: "Completed",
};

const statusBadgeBg: Record<string, string> = {
  active: "rgba(59, 130, 246, 0.12)",
  processing: "rgba(245, 158, 11, 0.12)",
  completed: "rgba(16, 185, 129, 0.12)",
};

const statusBadgeBgHover: Record<string, string> = {
  active: "rgba(59, 130, 246, 0.28)",
  processing: "rgba(245, 158, 11, 0.28)",
  completed: "rgba(16, 185, 129, 0.28)",
};

const statusBadgeBorder: Record<string, string> = {
  active: "rgba(59, 130, 246, 0.35)",
  processing: "rgba(245, 158, 11, 0.35)",
  completed: "rgba(16, 185, 129, 0.35)",
};

const statusBadgeBorderHover: Record<string, string> = {
  active: "rgba(59, 130, 246, 0.6)",
  processing: "rgba(245, 158, 11, 0.6)",
  completed: "rgba(16, 185, 129, 0.6)",
};

/* ── IUCN Colors (matching OverviewTab) ── */
const IUCN_CATEGORIES = [
  {
    key: "CR",
    label: "Critically Endangered",
    color: "#C01A0E",
  },
  { key: "EN", label: "Endangered", color: "#D03A1E" },
  { key: "VU", label: "Vulnerable", color: "#E6901A" },
  { key: "NT", label: "Near Threatened", color: "#CCB81E" },
  { key: "LC", label: "Least Concern", color: "#60A896" },
] as const;

/** Deterministic mock IUCN breakdown from a campaign's species count */
function getIucnBreakdown(campaign: Campaign) {
  const total = campaign.speciesCount || 0;
  if (total === 0)
    return IUCN_CATEGORIES.map((c) => ({ ...c, count: 0 }));
  // Use a simple seed from the campaign id hash
  let seed = 0;
  for (let i = 0; i < campaign.id.length; i++)
    seed += campaign.id.charCodeAt(i);
  const ratios = [0.03, 0.07, 0.12, 0.18, 0.6]; // CR, EN, VU, NT, LC
  // Shuffle slightly using seed
  const jitter = (i: number) =>
    ratios[i] + (((seed * (i + 1)) % 17) - 8) * 0.005;
  const raw = ratios.map((_, i) => Math.max(0.01, jitter(i)));
  const sum = raw.reduce((a, b) => a + b, 0);
  const counts = raw.map((r) => Math.round((r / sum) * total));
  // Fix rounding
  const diff = total - counts.reduce((a, b) => a + b, 0);
  counts[4] += diff;
  return IUCN_CATEGORIES.map((c, i) => ({
    ...c,
    count: counts[i],
  }));
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

/* ── Donut Chart SVG ── */
function IucnDonut({
  data,
  size = 130,
}: {
  data: { key: string; color: string; count: number }[];
  size?: number;
}) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0) return null;
  const r = size / 2;
  const strokeWidth = size * 0.15; // ~15% of diameter
  const innerR = r - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerR;
  let offset = 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="flex-shrink-0"
      style={{
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.35))",
      }}
    >
      {/* Background ring */}
      <circle
        cx={r}
        cy={r}
        r={innerR}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={strokeWidth}
      />
      {data.map((d) => {
        const pct = d.count / total;
        const dashLen = pct * circumference;
        const dashOffset = -offset * circumference;
        offset += pct;
        if (pct === 0) return null;
        return (
          <circle
            key={d.key}
            cx={r}
            cy={r}
            r={innerR}
            fill="none"
            stroke={d.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${r} ${r})`}
            style={{ transition: "stroke-dasharray 0.4s ease" }}
          />
        );
      })}
      {/* Center text */}
      <text
        x={r}
        y={r - 5}
        textAnchor="middle"
        dominantBaseline="central"
        fill="rgba(255,255,255,0.9)"
        style={{
          fontSize: "20px",
          fontFamily: "'Hexagon_Akkurat:bold',sans-serif",
        }}
      >
        {total}
      </text>
      <text
        x={r}
        y={r + 14}
        textAnchor="middle"
        dominantBaseline="central"
        fill="rgba(255,255,255,0.4)"
        style={{
          fontSize: "10px",
          fontFamily: "'Hexagon_Akkurat:regular',sans-serif",
        }}
      >
        species
      </text>
    </svg>
  );
}

interface ProjectListProps {
  hoveredProjectId?: string | null;
  onCardHover?: (id: string | null) => void;
  onCardClick?: (id: string, hasSensors: boolean) => void;
}

export function ProjectList({
  hoveredProjectId,
  onCardHover,
  onCardClick,
}: ProjectListProps) {
  const { projects, addProject, updateProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] =
    useState<Campaign | null>(null);
  // Delayed hover state for IUCN expansion (200ms delay)
  const [expandedCardId, setExpandedCardId] = useState<
    string | null
  >(null);
  const hoverTimerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    if (hoveredProjectId) {
      hoverTimerRef.current = setTimeout(() => {
        setExpandedCardId(hoveredProjectId);
      }, 200);
    } else {
      if (hoverTimerRef.current)
        clearTimeout(hoverTimerRef.current);
      setExpandedCardId(null);
    }
    return () => {
      if (hoverTimerRef.current)
        clearTimeout(hoverTimerRef.current);
    };
  }, [hoveredProjectId]);

  // Form state
  const [projectName, setProjectName] = useState("");
  const [client, setClient] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<
    "active" | "completed" | "processing"
  >("active");

  const handleCreateProject = () => {
    if (!projectName.trim()) return;

    const newCampaign: Campaign = {
      id: `campaign-${Date.now()}`,
      name: projectName,
      client: client || "Unnamed Client",
      location: location || "Not specified",
      startDate: startDate || new Date().toISOString(),
      endDate: endDate || new Date().toISOString(),
      status: "active",
      speciesCount: 0,
      totalRecordings: 0,
      processedRecordings: 0,
      sensors: [],
    };

    addProject(newCampaign);
    resetForm();
    setIsModalOpen(false);
  };

  const handleEditProject = (
    campaign: Campaign,
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setEditingCampaign(campaign);
    setProjectName(campaign.name);
    setClient(campaign.client);
    setLocation(campaign.location);
    setStartDate(campaign.startDate.split("T")[0]);
    setEndDate(campaign.endDate.split("T")[0]);
    setStatus(campaign.status);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!projectName.trim() || !editingCampaign) return;

    updateProject(editingCampaign.id, {
      name: projectName,
      client: client || "Unnamed Client",
      location: location || "Not specified",
      startDate: startDate || editingCampaign.startDate,
      endDate: endDate || editingCampaign.endDate,
      status: status,
    });

    resetForm();
    setIsEditModalOpen(false);
    setEditingCampaign(null);
  };

  const resetForm = () => {
    setProjectName("");
    setClient("");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setStatus("active");
  };

  const progressPercent = (campaign: Campaign) =>
    Math.round(
      (campaign.processedRecordings /
        campaign.totalRecordings) *
        100,
    ) || 0;

  return (
    <div
      className="flex flex-col gap-y-[10px] size-full"
      data-name="Species Extinction Risk"
    >
      {/* Header Card */}
      <div
        className="bg-[#2b2f3f] content-stretch flex items-center justify-between h-[54px] overflow-clip px-[20px] py-[10px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] shrink-0 w-full"
        data-name="Card Menu"
      >
        <p className="font-['Hexagon_Akkurat:bold',sans-serif] leading-[27px] text-[18px] text-[rgba(255,255,255,0.9)] whitespace-nowrap">
          Species Extinction Risk
        </p>
        <button
          className="bg-[#474f5f] hover:bg-[#556070] text-[rgba(255,255,255,0.9)] h-[30px] w-[30px] flex items-center justify-center transition-colors duration-200"
          onClick={() => setIsModalOpen(true)}
          title="New project"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Projects List */}
      <div
        className="bg-[#2b2f3f] content-stretch flex flex-col items-start overflow-clip p-[10px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] shrink-0 w-full"
        data-name="Card-subMenu"
      >
        <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full">
          {projects.map((campaign) => {
            const isHovered = hoveredProjectId === campaign.id;
            const isExpanded = expandedCardId === campaign.id;
            const hasSensors = campaign.sensors.length > 0;
            const pct = progressPercent(campaign);

            return (
              <ProjectCard
                key={campaign.id}
                campaign={campaign}
                isHovered={isHovered}
                isExpanded={isExpanded}
                hasSensors={hasSensors}
                pct={pct}
                onMouseEnter={() => onCardHover?.(campaign.id)}
                onMouseLeave={() => onCardHover?.(null)}
                onClick={() =>
                  onCardClick?.(campaign.id, hasSensors)
                }
                onEdit={(e) => handleEditProject(campaign, e)}
                onViewMap={() =>
                  onCardClick?.(campaign.id, true)
                }
                onOpenProject={() =>
                  onCardClick?.(campaign.id, false)
                }
              />
            );
          })}
        </div>
      </div>

      {/* Key Metrics Card */}
      <div
        className="bg-[#2b2f3f] content-stretch flex flex-col overflow-clip shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] shrink-0 w-full"
        data-name="Key Output Card"
      >
        {/* Status breakdown */}
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <ModalOverlay
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
        >
          <div className="bg-[#2b2f3f] w-full max-w-[600px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between px-[20px] py-[14px]">
              <p className="font-['Hexagon_Akkurat:bold',sans-serif] text-[18px] text-[rgba(255,255,255,0.9)] leading-[27px]">
                Create New Project
              </p>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-[#778192] hover:text-white h-[30px] w-[30px] flex items-center justify-center transition-colors duration-150"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-[10px] px-[20px] pb-[14px]">
              <FormField label="Project Name" required>
                <input
                  className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] placeholder-[#5a6070] outline-none leading-[20px] border-none"
                  placeholder="e.g. Spring Biodiversity Survey 2026"
                  value={projectName}
                  onChange={(e) =>
                    setProjectName(e.target.value)
                  }
                />
              </FormField>

              <FormField label="Client / Organisation">
                <input
                  className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] placeholder-[#5a6070] outline-none leading-[20px] border-none"
                  placeholder="e.g. Hexagon R-Evolution"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                />
              </FormField>

              <FormField label="Location">
                <input
                  className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] placeholder-[#5a6070] outline-none leading-[20px] border-none"
                  placeholder="e.g. Pilbara Region, WA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-[10px]">
                <FormField label="Start Date">
                  <input
                    type="date"
                    className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] outline-none leading-[20px] border-none [color-scheme:dark]"
                    value={startDate}
                    onChange={(e) =>
                      setStartDate(e.target.value)
                    }
                  />
                </FormField>
                <FormField label="End Date">
                  <input
                    type="date"
                    className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] outline-none leading-[20px] border-none [color-scheme:dark]"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </FormField>
              </div>
            </div>

            <div className="flex justify-end gap-[8px] px-[20px] py-[12px] border-t border-[#3a4050]">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="bg-[#474f5f] hover:bg-[#556070] text-[#b7b9be] hover:text-white px-[16px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] leading-[20px] transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!projectName.trim()}
                className="bg-[#778192] hover:bg-[#8a93a3] disabled:opacity-40 disabled:cursor-not-allowed text-white px-[16px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] leading-[20px] transition-colors duration-150"
              >
                Create Project
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && (
        <ModalOverlay
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingCampaign(null);
            resetForm();
          }}
        >
          <div className="bg-[#2b2f3f] w-full max-w-[600px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between px-[20px] py-[14px]">
              <p className="font-['Hexagon_Akkurat:bold',sans-serif] text-[18px] text-[rgba(255,255,255,0.9)] leading-[27px]">
                Edit Project
              </p>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingCampaign(null);
                  resetForm();
                }}
                className="text-[#778192] hover:text-white h-[30px] w-[30px] flex items-center justify-center transition-colors duration-150"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-[10px] px-[20px] pb-[14px]">
              <FormField label="Project Name" required>
                <input
                  className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] placeholder-[#5a6070] outline-none leading-[20px] border-none"
                  placeholder="e.g. Spring Biodiversity Survey 2026"
                  value={projectName}
                  onChange={(e) =>
                    setProjectName(e.target.value)
                  }
                />
              </FormField>

              <FormField label="Client / Organisation">
                <input
                  className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] placeholder-[#5a6070] outline-none leading-[20px] border-none"
                  placeholder="e.g. Hexagon R-Evolution"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                />
              </FormField>

              <FormField label="Location">
                <input
                  className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] placeholder-[#5a6070] outline-none leading-[20px] border-none"
                  placeholder="e.g. Pilbara Region, WA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-[10px]">
                <FormField label="Start Date">
                  <input
                    type="date"
                    className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] outline-none leading-[20px] border-none [color-scheme:dark]"
                    value={startDate}
                    onChange={(e) =>
                      setStartDate(e.target.value)
                    }
                  />
                </FormField>
                <FormField label="End Date">
                  <input
                    type="date"
                    className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] outline-none leading-[20px] border-none [color-scheme:dark]"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </FormField>
              </div>

              {/* Status selector */}
              <FormField label="Project Status" required>
                <div className="flex gap-[2px]">
                  {(
                    [
                      "active",
                      "processing",
                      "completed",
                    ] as const
                  ).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={clsx(
                        "flex items-center gap-[8px] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] leading-[20px] transition-colors duration-150 capitalize",
                        status === s
                          ? "bg-[#778192] text-white"
                          : "bg-[#3a4050] text-[#b7b9be] hover:bg-[#4a5264] hover:text-white",
                      )}
                    >
                      <div
                        className="w-[8px] h-[8px] rounded-full"
                        style={{
                          backgroundColor: statusColors[s],
                        }}
                      />
                      {s}
                    </button>
                  ))}
                </div>
              </FormField>
            </div>

            <div className="flex justify-end gap-[8px] px-[20px] py-[12px] border-t border-[#3a4050]">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingCampaign(null);
                  resetForm();
                }}
                className="bg-[#474f5f] hover:bg-[#556070] text-[#b7b9be] hover:text-white px-[16px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] leading-[20px] transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!projectName.trim()}
                className="bg-[#778192] hover:bg-[#8a93a3] disabled:opacity-40 disabled:cursor-not-allowed text-white px-[16px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] leading-[20px] transition-colors duration-150"
              >
                Save Changes
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

/* ── Project Card Component ── */

function ProjectCard({
  campaign,
  isHovered,
  isExpanded,
  hasSensors,
  pct,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onEdit,
  onViewMap,
  onOpenProject,
}: {
  campaign: Campaign;
  isHovered: boolean;
  isExpanded: boolean;
  hasSensors: boolean;
  pct: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onViewMap: () => void;
  onOpenProject: () => void;
}) {
  const iucnData = useMemo(
    () => getIucnBreakdown(campaign),
    [campaign],
  );

  return (
    <div
      className={clsx(
        "group relative w-full cursor-pointer transition-all duration-200",
        isHovered
          ? "bg-[#3a4354] shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
          : "bg-[#2d3748] hover:bg-[#343d4f]",
        isExpanded ? "p-[18px]" : "p-[16px]",
      )}
      style={{
        borderLeft: isHovered
          ? "2px solid rgba(59,130,246,0.5)"
          : "2px solid transparent",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* Row 1: Title + Arrow */}
      <div className="flex items-center justify-between gap-[8px]">
        <span className="font-['Hexagon_Akkurat:bold',sans-serif] text-[16px] leading-[22px] truncate text-[rgba(255,255,255,0.9)]">
          {campaign.name}
        </span>
        <div className="flex items-center gap-[6px] flex-shrink-0">
          <div
            className={clsx(
              "h-[22px] w-[22px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150",
              isHovered
                ? "text-white hover:bg-[rgba(255,255,255,0.12)]"
                : "text-[#778192] hover:text-white hover:bg-[rgba(255,255,255,0.08)]",
            )}
            onClick={onEdit}
          >
            <Edit2 size={11} />
          </div>
          <ArrowRight
            size={14}
            className={clsx(
              "transition-colors duration-150 flex-shrink-0",
              isHovered
                ? "text-white"
                : "text-[#778192] group-hover:text-white",
            )}
          />
        </div>
      </div>

      {/* Row 2: Status badge + Location + Date */}
      <div className="flex items-center gap-[6px] mt-[6px] flex-wrap">
        <span
          className="inline-flex items-center gap-[4px] rounded-full px-[7px] py-[1px] flex-shrink-0 border border-solid font-['Hexagon_Akkurat:regular',sans-serif] text-[10px] leading-[15px] whitespace-nowrap transition-colors duration-200"
          style={{
            backgroundColor: isHovered
              ? statusBadgeBgHover[campaign.status]
              : statusBadgeBg[campaign.status],
            borderColor: isHovered
              ? statusBadgeBorderHover[campaign.status]
              : statusBadgeBorder[campaign.status],
            color: statusColors[campaign.status],
          }}
        >
          <span
            className="w-[5px] h-[5px] rounded-full flex-shrink-0"
            style={{
              backgroundColor: statusColors[campaign.status],
            }}
          />
          {statusLabels[campaign.status]}
        </span>
        <MapPin
          size={10}
          className={clsx(
            "flex-shrink-0",
            isHovered
              ? "text-[rgba(255,255,255,0.5)]"
              : "text-[#778192]",
          )}
        />
        <span
          className={clsx(
            "font-['Hexagon_Akkurat:regular',sans-serif] text-[11px] leading-[16px] truncate",
            isHovered
              ? "text-[rgba(255,255,255,0.7)]"
              : "text-[#b7b9be]",
          )}
        >
          {campaign.location}
        </span>
        <span
          className={clsx(
            "text-[11px]",
            isHovered
              ? "text-[rgba(255,255,255,0.3)]"
              : "text-[#778192]",
          )}
        >
          ·
        </span>
        <Calendar
          size={10}
          className={clsx(
            "flex-shrink-0",
            isHovered
              ? "text-[rgba(255,255,255,0.5)]"
              : "text-[#778192]",
          )}
        />
        <span
          className={clsx(
            "font-['Hexagon_Akkurat:regular',sans-serif] text-[11px] leading-[16px] whitespace-nowrap",
            isHovered
              ? "text-[rgba(255,255,255,0.7)]"
              : "text-[#b7b9be]",
          )}
        >
          {new Date(campaign.startDate).toLocaleDateString(
            undefined,
            {
              month: "short",
              year: "numeric",
            },
          )}
        </span>
      </div>

      {/* Row 3: Key metrics inline */}
      <div className="flex items-center gap-[6px] mt-[10px]">
        <span className="font-['Hexagon_Akkurat:bold',sans-serif] text-[13px] text-[rgba(255,255,255,0.9)] leading-[18px]">
          {campaign.speciesCount.toLocaleString()}
        </span>
        <span
          className={clsx(
            "font-['Hexagon_Akkurat:regular',sans-serif] text-[11px] leading-[18px]",
            isHovered
              ? "text-[rgba(255,255,255,0.6)]"
              : "text-[#b7b9be]",
          )}
        >
          Species
        </span>
        <span
          className={clsx(
            "text-[11px]",
            isHovered
              ? "text-[rgba(255,255,255,0.3)]"
              : "text-[#778192]",
          )}
        >
          ·
        </span>
        <span className="font-['Hexagon_Akkurat:bold',sans-serif] text-[13px] text-[rgba(255,255,255,0.9)] leading-[18px]">
          {formatCount(campaign.totalRecordings)}
        </span>
        <span
          className={clsx(
            "font-['Hexagon_Akkurat:regular',sans-serif] text-[11px] leading-[18px]",
            isHovered
              ? "text-[rgba(255,255,255,0.6)]"
              : "text-[#b7b9be]",
          )}
        >
          Registers
        </span>
        <span
          className={clsx(
            "text-[11px]",
            isHovered
              ? "text-[rgba(255,255,255,0.3)]"
              : "text-[#778192]",
          )}
        >
          ·
        </span>
        <span className="font-['Hexagon_Akkurat:bold',sans-serif] text-[13px] text-[rgba(255,255,255,0.9)] leading-[18px]">
          {campaign.sensors.length}
        </span>
        <span
          className={clsx(
            "font-['Hexagon_Akkurat:regular',sans-serif] text-[11px] leading-[18px]",
            isHovered
              ? "text-[rgba(255,255,255,0.6)]"
              : "text-[#b7b9be]",
          )}
        >
          Sensors
        </span>
      </div>

      {/* Row 4: Progress bar */}
      <div className="mt-[10px]">
        <div className="flex items-center justify-between mb-[4px]">
          <span
            className={clsx(
              "font-['Hexagon_Akkurat:regular',sans-serif] text-[10px] leading-[14px]",
              isHovered
                ? "text-[rgba(255,255,255,0.5)]"
                : "text-[#778192]",
            )}
          >
            Processing
          </span>
          <span
            className={clsx(
              "font-['Hexagon_Akkurat:regular',sans-serif] text-[10px] leading-[14px]",
              isHovered
                ? "text-[rgba(255,255,255,0.7)]"
                : "text-[#b7b9be]",
            )}
          >
            {pct}%
          </span>
        </div>
        <div
          className={clsx(
            "h-[3px] w-full overflow-hidden",
            isHovered
              ? "bg-[rgba(255,255,255,0.15)]"
              : "bg-[#3a4050]",
          )}
        >
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: "#6fbf81",
            }}
          />
        </div>
      </div>

      {/* ── Expanded section: IUCN donut + breakdown + action buttons ── */}
      <div
        className={clsx(
          "overflow-hidden transition-all duration-300 ease-out",
          isExpanded
            ? "max-h-[260px] opacity-100 mt-[14px]"
            : "max-h-0 opacity-0",
        )}
      >
        {/* Separator */}
        <div className="h-px w-full mb-[14px] bg-[rgba(255,255,255,0.08)]" />

        {/* Donut + IUCN legend */}
        <div className="flex items-center gap-[20px]">
          {/* Donut chart */}
          <IucnDonut data={iucnData} size={130} />

          {/* IUCN breakdown legend */}
          <div className="flex flex-col gap-[5px] flex-1 min-w-0">
            {iucnData.map((cat) => {
              const total = campaign.speciesCount || 1;
              const pctCat = Math.round(
                (cat.count / total) * 100,
              );
              return (
                <div
                  key={cat.key}
                  className="flex items-center gap-[8px]"
                >
                  <span
                    className="w-[8px] h-[8px] rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span
                    className="font-['Hexagon_Akkurat:bold',sans-serif] text-[11px] leading-[16px] w-[22px] flex-shrink-0"
                    style={{ color: cat.color }}
                  >
                    {cat.key}
                  </span>
                  <span className="font-['Hexagon_Akkurat:bold',sans-serif] text-[12px] text-[rgba(255,255,255,0.9)] leading-[16px] w-[36px] flex-shrink-0 text-right">
                    {cat.count}
                  </span>
                  {/* Mini bar */}
                  <div className="flex-1 h-[4px] bg-[rgba(255,255,255,0.06)] overflow-hidden min-w-[20px]">
                    <div
                      className="h-full"
                      style={{
                        width: `${pctCat}%`,
                        backgroundColor: cat.color,
                        opacity: 0.7,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                  <span className="font-['Hexagon_Akkurat:regular',sans-serif] text-[10px] text-[rgba(255,255,255,0.4)] leading-[16px] w-[30px] text-right flex-shrink-0">
                    {pctCat}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-[8px] mt-[14px]">
          {hasSensors && (
            <button
              className="flex-1 h-[34px] flex items-center justify-center gap-[6px] border border-[#4a5568] bg-transparent hover:bg-[#404856] text-[#b7b9be] hover:text-white transition-colors duration-150 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onViewMap();
              }}
            >
              <Map size={12} />
              <span className="font-['Hexagon_Akkurat:regular',sans-serif] text-[12px] leading-[18px]">
                View Map
              </span>
            </button>
          )}
          <button
            className={clsx(
              "h-[34px] flex items-center justify-center gap-[6px] bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors duration-150 cursor-pointer",
              hasSensors ? "flex-1" : "w-full",
            )}
            onClick={(e) => {
              e.stopPropagation();
              onOpenProject();
            }}
          >
            <ArrowRight size={12} />
            <span className="font-['Hexagon_Akkurat:regular',sans-serif] text-[12px] leading-[18px]">
              Open Project
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Helper Components ── */

function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[4px]">
      <label className="font-['Hexagon_Akkurat:regular',sans-serif] text-[12px] text-[#b7b9be] leading-[18px]">
        {label}
        {required && (
          <span className="text-[#e92f2e] ml-[4px]">*</span>
        )}
      </label>
      {children}
    </div>
  );
}