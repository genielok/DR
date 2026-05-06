import { useParams, useNavigate } from "react-router";
import { ArrowLeft, MapPin, Calendar, Download, Upload } from "lucide-react";
import { useProjects } from "../../contexts/ProjectContext";
import { OverviewTab } from "./components/OverviewTab";

const F = {
  bold: "'Hexagon_Akkurat:bold',sans-serif",
  regular: "'Hexagon_Akkurat:regular',sans-serif",
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects } = useProjects();

  const campaign = projects.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="flex-1 flex items-center justify-center h-full w-full bg-[#161921]">
        <div className="flex flex-col items-center gap-[16px]">
          <span className="text-[16px] leading-[22px] text-[rgba(255,255,255,0.9)]" style={{ fontFamily: F.bold }}>
            Project not found
          </span>
          <button onClick={() => navigate("/")}
            className="h-[34px] px-[16px] bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors duration-150 cursor-pointer inline-flex items-center gap-[6px]">
            <ArrowLeft size={13} />
            <span className="text-[12px] leading-[18px]" style={{ fontFamily: F.regular }}>Back</span>
          </button>
        </div>
      </div>
    );
  }

  const period = `${new Date(campaign.startDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })} – ${new Date(campaign.endDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })}`;

  return (
    <div className="flex-1 flex flex-col bg-[#161921] h-full overflow-hidden">
      {/* Header */}
      <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] shrink-0">
        <div className="px-[24px] py-[16px]">
          <div className="flex items-start justify-between gap-[16px]">
            <div className="flex flex-col gap-[8px] min-w-0">
              <div className="flex items-center gap-[8px]">
                <button onClick={() => navigate("/")}
                  className="text-[#778192] hover:text-[rgba(255,255,255,0.9)] hover:bg-[#474f5f] h-[30px] w-[30px] flex items-center justify-center transition-colors duration-150 shrink-0 cursor-pointer">
                  <ArrowLeft size={14} />
                </button>
                <h1 className="text-[18px] leading-[27px] text-[rgba(255,255,255,0.9)] truncate" style={{ fontFamily: F.bold }}>
                  {campaign.name}
                </h1>
              </div>
              <div className="flex items-center gap-[8px] ml-[38px] flex-wrap">
                <span className="text-[14px] leading-[16px] text-[rgba(255,255,255,0.6)]" style={{ fontFamily: F.regular }}>{campaign.client}</span>
                <span className="text-[14px] text-[#778192]">·</span>
                <MapPin size={14} className="text-[#778192] flex-shrink-0" />
                <span className="text-[14px] leading-[16px] text-[#b7b9be] truncate" style={{ fontFamily: F.regular }}>{campaign.location}</span>
                <span className="text-[14px] text-[#778192]">·</span>
                <Calendar size={14} className="text-[#778192] flex-shrink-0" />
                <span className="text-[14px] leading-[16px] text-[#b7b9be] whitespace-nowrap" style={{ fontFamily: F.regular }}>{period}</span>
              </div>
            </div>

            {/* <div className="flex gap-[8px] flex-shrink-0">
              <button
                onClick={() => navigate(`/projects/${id}/import`)}
                className="h-[34px] px-[14px] bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors duration-150 inline-flex items-center gap-[6px] cursor-pointer">
                <Upload size={13} />
                <span className="text-[12px] leading-[18px]" style={{ fontFamily: F.regular }}>Import Data</span>
              </button>
              <button className="h-[34px] px-[14px] border border-[#4a5568] bg-transparent hover:bg-[#404856] text-[#b7b9be] hover:text-white transition-colors duration-150 inline-flex items-center gap-[6px] cursor-pointer">
                <Download size={13} />
                <span className="text-[12px] leading-[18px]" style={{ fontFamily: F.regular }}>Export CSV</span>
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <OverviewTab project={campaign as any} />
      </div>
    </div>
  );
}
