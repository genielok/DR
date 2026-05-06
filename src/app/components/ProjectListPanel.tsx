import { useState, useMemo } from "react";
import clsx from "clsx";
import {
  Plus,
  MapPin,
  Calendar,
  Edit2,
  Trash2,
  X,
  ArrowRight,
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
  speciesByStatus: Partial<Record<string, number>>;
}

const statusColors: Record<string, string> = {
  active: "#3b82f6",
  processing: "#f59e0b",
  completed: "#10b981",
};


const IUCN_CATEGORIES = [
  { key: "CR", label: "Critically Endangered", color: "#C01A0E" },
  { key: "EN", label: "Endangered", color: "#D03A1E" },
  { key: "VU", label: "Vulnerable", color: "#E6901A" },
  { key: "NT", label: "Near Threatened", color: "#CCB81E" },
  { key: "LC", label: "Least Concern", color: "#60A896" },
] as const;

function getIucnBreakdown(campaign: Campaign) {
  return IUCN_CATEGORIES.map((c) => ({
    ...c,
    count: campaign.speciesByStatus?.[c.key] ?? 0,
  }));
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}


interface ProjectListPanelProps {
  hoveredProjectId?: string | null;
  activeProjectId?: string | null;
  onCardHover?: (id: string | null) => void;
  onCardClick?: (id: string) => void;
}

export function ProjectListPanel({
  hoveredProjectId,
  activeProjectId,
  onCardHover,
  onCardClick,
}: ProjectListPanelProps) {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [projectName, setProjectName] = useState("");
  const [client, setClient] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<"active" | "completed" | "processing">("active");

  const resetForm = () => {
    setProjectName(""); setClient(""); setLocation("");
    setStartDate(""); setEndDate(""); setStatus("active");
  };

  const handleCreateProject = () => {
    if (!projectName.trim()) return;
    addProject({
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
      speciesByStatus: {},
    });
    resetForm();
    setIsModalOpen(false);
  };

  const handleEditProject = (campaign: Campaign, e: React.MouseEvent) => {
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
      status,
    });
    resetForm();
    setIsEditModalOpen(false);
    setEditingCampaign(null);
  };

  return (
    <div className="flex flex-col gap-y-[10px] size-full border-r border-[rgba(255,255,255,0.08)]" data-name="Species Extinction Risk">
      {/* Header */}
      <div className="bg-[#2b2f3f] flex items-center h-[54px] overflow-clip px-[20px] py-[10px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] shrink-0 w-full">
        <p className="font-['Hexagon_Akkurat:bold',sans-serif] leading-[27px] text-[18px] text-[rgba(255,255,255,0.9)] whitespace-nowrap">
          Species Extinction Risk
        </p>
      </div>

      {/* Create New Project */}
      {/* <button
        className="bg-[#474f5f] hover:bg-[#556070] text-[rgba(255,255,255,0.9)] h-[38px] w-full flex items-center justify-center gap-[8px] transition-colors duration-200 shrink-0"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus size={14} />
        <span className="font-['Hexagon_Akkurat:regular',sans-serif] text-[13px]">Create New Project</span>
      </button> */}

      {/* Projects List */}
      <div className="flex flex-col gap-[6px] items-start w-full shrink-0">
        {projects.map((campaign) => {
          const isHovered = hoveredProjectId === campaign.id;
          const isActive = activeProjectId === campaign.id;
          return (
            <ProjectCard
              key={campaign.id}
              campaign={campaign as Campaign}
              isHovered={isHovered}
              isActive={isActive}
              onMouseEnter={() => onCardHover?.(campaign.id)}
              onMouseLeave={() => onCardHover?.(null)}
              onClick={() => onCardClick?.(campaign.id)}
              onEdit={(e) => handleEditProject(campaign as Campaign, e)}
              onDelete={(e) => { e.stopPropagation(); deleteProject(campaign.id); }}
              onOpenProject={() => onCardClick?.(campaign.id)}
            />
          );
        })}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <ModalOverlay onClose={() => { setIsModalOpen(false); resetForm(); }}>
          <div className="bg-[#2b2f3f] w-full max-w-[600px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between px-[20px] py-[14px]">
              <p className="font-['Hexagon_Akkurat:bold',sans-serif] text-[18px] text-[rgba(255,255,255,0.9)] leading-[27px]">
                Create New Project
              </p>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="text-[#778192] hover:text-white h-[30px] w-[30px] flex items-center justify-center transition-colors duration-150">
                <X size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-[10px] px-[20px] pb-[14px]">
              <FormField label="Project Name" required>
                <input className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] placeholder-[#5a6070] outline-none leading-[20px] border-none"
                  placeholder="e.g. Spring Biodiversity Survey 2026"
                  value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              </FormField>
              <FormField label="Client / Organisation">
                <input className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] placeholder-[#5a6070] outline-none leading-[20px] border-none"
                  placeholder="e.g. Hexagon R-Evolution"
                  value={client} onChange={(e) => setClient(e.target.value)} />
              </FormField>
              <FormField label="Location">
                <input className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] placeholder-[#5a6070] outline-none leading-[20px] border-none"
                  placeholder="e.g. Pilbara Region, WA"
                  value={location} onChange={(e) => setLocation(e.target.value)} />
              </FormField>
              <div className="grid grid-cols-2 gap-[10px]">
                <FormField label="Start Date">
                  <input type="date" className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] outline-none leading-[20px] border-none [color-scheme:dark]"
                    value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </FormField>
                <FormField label="End Date">
                  <input type="date" className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] outline-none leading-[20px] border-none [color-scheme:dark]"
                    value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </FormField>
              </div>
            </div>
            <div className="flex justify-end gap-[8px] px-[20px] py-[12px] border-t border-[#3a4050]">
              <button onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="bg-[#474f5f] hover:bg-[#556070] text-[#b7b9be] hover:text-white px-[16px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] leading-[20px] transition-colors duration-150">
                Cancel
              </button>
              <button onClick={handleCreateProject} disabled={!projectName.trim()}
                className="bg-[#778192] hover:bg-[#8a93a3] disabled:opacity-40 disabled:cursor-not-allowed text-white px-[16px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] leading-[20px] transition-colors duration-150">
                Create Project
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <ModalOverlay onClose={() => { setIsEditModalOpen(false); setEditingCampaign(null); resetForm(); }}>
          <div className="bg-[#2b2f3f] w-full max-w-[600px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between px-[20px] py-[14px]">
              <p className="font-['Hexagon_Akkurat:bold',sans-serif] text-[18px] text-[rgba(255,255,255,0.9)] leading-[27px]">
                Edit Project
              </p>
              <button onClick={() => { setIsEditModalOpen(false); setEditingCampaign(null); resetForm(); }}
                className="text-[#778192] hover:text-white h-[30px] w-[30px] flex items-center justify-center transition-colors duration-150">
                <X size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-[10px] px-[20px] pb-[14px]">
              <FormField label="Project Name" required>
                <input className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] placeholder-[#5a6070] outline-none leading-[20px] border-none"
                  value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              </FormField>
              <FormField label="Client / Organisation">
                <input className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] placeholder-[#5a6070] outline-none leading-[20px] border-none"
                  value={client} onChange={(e) => setClient(e.target.value)} />
              </FormField>
              <FormField label="Location">
                <input className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] placeholder-[#5a6070] outline-none leading-[20px] border-none"
                  value={location} onChange={(e) => setLocation(e.target.value)} />
              </FormField>
              <div className="grid grid-cols-2 gap-[10px]">
                <FormField label="Start Date">
                  <input type="date" className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] outline-none leading-[20px] border-none [color-scheme:dark]"
                    value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </FormField>
                <FormField label="End Date">
                  <input type="date" className="w-full bg-[#3a4050] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[#b7b9be] outline-none leading-[20px] border-none [color-scheme:dark]"
                    value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </FormField>
              </div>
              <FormField label="Project Status" required>
                <div className="flex gap-[2px]">
                  {(["active", "processing", "completed"] as const).map((s) => (
                    <button key={s} onClick={() => setStatus(s)}
                      className={clsx(
                        "flex items-center gap-[8px] px-[12px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] leading-[20px] transition-colors duration-150 capitalize",
                        status === s ? "bg-[#778192] text-white" : "bg-[#3a4050] text-[#b7b9be] hover:bg-[#4a5264] hover:text-white",
                      )}>
                      <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: statusColors[s] }} />
                      {s}
                    </button>
                  ))}
                </div>
              </FormField>
            </div>
            <div className="flex justify-end gap-[8px] px-[20px] py-[12px] border-t border-[#3a4050]">
              <button onClick={() => { setIsEditModalOpen(false); setEditingCampaign(null); resetForm(); }}
                className="bg-[#474f5f] hover:bg-[#556070] text-[#b7b9be] hover:text-white px-[16px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] leading-[20px] transition-colors duration-150">
                Cancel
              </button>
              <button onClick={handleSaveEdit} disabled={!projectName.trim()}
                className="bg-[#778192] hover:bg-[#8a93a3] disabled:opacity-40 disabled:cursor-not-allowed text-white px-[16px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] leading-[20px] transition-colors duration-150">
                Save Changes
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

function ProjectCard({
  campaign, isHovered, isActive,
  onMouseEnter, onMouseLeave, onClick, onEdit, onDelete, onOpenProject,
}: {
  campaign: Campaign;
  isHovered: boolean;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onOpenProject: () => void;
}) {
  const iucnData = useMemo(() => getIucnBreakdown(campaign), [campaign]);
  const barTotal = iucnData.reduce((s, d) => s + d.count, 0);

  return (
    <div
      className={clsx(
        "group relative w-full cursor-pointer transition-all duration-200 p-[16px]",
        isActive
          ? "bg-[#1e2a3e]"
          : isHovered
            ? "bg-[#3a4354] shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
            : "bg-[#252a38] hover:bg-[#2d3345]",
      )}
      style={{
        borderLeft: isActive
          ? "2px solid rgba(59,130,246,0.9)"
          : isHovered
            ? "2px solid rgba(59,130,246,0.6)"
            : "2px solid rgba(255,255,255,0.06)",
        borderTop: isActive ? "1px solid rgba(59,130,246,0.2)" : "1px solid rgba(255,255,255,0.06)",
        borderRight: isActive ? "1px solid rgba(59,130,246,0.2)" : "1px solid rgba(255,255,255,0.06)",
        borderBottom: isActive ? "1px solid rgba(59,130,246,0.2)" : "1px solid rgba(255,255,255,0.06)",
      }}
      onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick}
    >
      {/* Row 1: Title + Edit + Arrow */}
      <div className="flex items-center justify-between gap-[8px]">
        <span className="font-['Hexagon_Akkurat:bold',sans-serif] text-[16px] leading-[22px] truncate text-[rgba(255,255,255,0.9)]">
          {campaign.name}
        </span>
        {/* <div className="flex items-center gap-[6px] flex-shrink-0">
          <div
            className="h-[26px] w-[26px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150 text-white   hover:text-[#f87171] hover:bg-[rgba(248,113,113,0.1)]"
            onClick={onDelete}>
            <Trash2 size={11} />
          </div>
          <div
            className={clsx(
              "h-[26px] w-[26px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150",
              isHovered ? "text-white hover:bg-[rgba(255,255,255,0.12)]" : "text-[#778192] hover:text-white hover:bg-[rgba(255,255,255,0.08)]",
            )}
            onClick={onEdit}>
            <Edit2 size={11} />
          </div>
        </div> */}
      </div>

      {/* Row 2: Location + Date */}
      <div className="flex items-center gap-[6px] mt-[6px] flex-wrap">
        <MapPin size={10} className={clsx("flex-shrink-0", isHovered ? "text-[rgba(255,255,255,0.5)]" : "text-[#778192]")} />
        <span className={clsx("font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] leading-[16px] truncate", isHovered ? "text-[rgba(255,255,255,0.7)]" : "text-[#b7b9be]")}>
          {campaign.location}
        </span>
        <span className={clsx("text-[13px]", isHovered ? "text-[rgba(255,255,255,0.3)]" : "text-[#778192]")}>·</span>
        <Calendar size={10} className={clsx("flex-shrink-0", isHovered ? "text-[rgba(255,255,255,0.5)]" : "text-[#778192]")} />
        <span className={clsx("font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] leading-[16px] whitespace-nowrap", isHovered ? "text-[rgba(255,255,255,0.7)]" : "text-[#b7b9be]")}>
          {new Date(campaign.startDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
        </span>
      </div>

      {/* Row 3: Key metrics */}
      <div className="flex items-center gap-[6px] mt-[10px]">
        <span className="font-['Hexagon_Akkurat:bold',sans-serif] text-[13px] text-[rgba(255,255,255,0.9)] leading-[18px]">{campaign.speciesCount.toLocaleString()}</span>
        <span className={clsx("font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] leading-[18px]", isHovered ? "text-[rgba(255,255,255,0.6)]" : "text-[#b7b9be]")}>Species</span>
        <span className={clsx("text-[13px]", isHovered ? "text-[rgba(255,255,255,0.3)]" : "text-[#778192]")}>·</span>
        <span className="font-['Hexagon_Akkurat:bold',sans-serif] text-[13px] text-[rgba(255,255,255,0.9)] leading-[18px]">{formatCount(campaign.totalRecordings)}</span>
        <span className={clsx("font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] leading-[18px]", isHovered ? "text-[rgba(255,255,255,0.6)]" : "text-[#b7b9be]")}>Registers</span>
        <span className={clsx("text-[13px]", isHovered ? "text-[rgba(255,255,255,0.3)]" : "text-[#778192]")}>·</span>
        <span className="font-['Hexagon_Akkurat:bold',sans-serif] text-[13px] text-[rgba(255,255,255,0.9)] leading-[18px]">{campaign.sensors.length}</span>
        <span className={clsx("font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] leading-[18px]", isHovered ? "text-[rgba(255,255,255,0.6)]" : "text-[#b7b9be]")}>Sensors</span>
      </div>

      {/* Row 4: IUCN stacked bar — always visible */}
      {barTotal > 0 && (
        <>
          <div className="w-full h-[6px] flex mt-[10px] overflow-hidden">
            {iucnData.filter((d) => d.count > 0).map((d) => (
              <div
                key={d.key}
                style={{ width: `${(d.count / barTotal) * 100}%`, backgroundColor: d.color }}
              />
            ))}
          </div>
          <div className="flex items-center gap-[10px] mt-[6px] flex-wrap">
            {iucnData.filter((d) => d.count > 0).map((d) => (
              <div key={d.key} className="flex items-center gap-[3px]">
                <span className="w-[8px] h-[8px] flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="font-['Hexagon_Akkurat:bold',sans-serif] text-[12px]" style={{ color: d.color }}>{d.key}</span>
                <span className="font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] text-[rgba(255,255,255,0.6)]">{d.count}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Open Project button — hover only */}
      <div className={clsx(
        "overflow-hidden transition-all duration-200",
        isHovered ? "max-h-[44px] opacity-100 mt-[10px]" : "max-h-0 opacity-0",
      )}>
        <button
          className="w-full h-[30px] flex items-center justify-center gap-[6px] bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors duration-150 cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onOpenProject(); }}>
          <ArrowRight size={12} />
          <span className="font-['Hexagon_Akkurat:regular',sans-serif] text-[12px] leading-[18px]">Open Project</span>
        </button>
      </div>
    </div>
  );
}

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <label className="font-['Hexagon_Akkurat:regular',sans-serif] text-[12px] text-[#b7b9be] leading-[18px]">
        {label}{required && <span className="text-[#e92f2e] ml-[4px]">*</span>}
      </label>
      {children}
    </div>
  );
}
