import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { ProjectProvider } from "../contexts/ProjectContext";
import { ProjectListPanel } from "./ProjectListPanel";
import { RailNav } from "./RailNav";

export function AppLayout() {
  const [showPanel, setShowPanel] = useState(true);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isProjectDetail = location.pathname.startsWith("/projects/");
  const activeProjectId = isProjectDetail
    ? location.pathname.split("/projects/")[1].split("/")[0]
    : null;

  const handleProjectClick = (id: string) => {
    navigate(`/projects/${id}`);
  };

  return (
    <ProjectProvider>
      <div className="bg-[#161921] flex h-screen w-screen overflow-hidden">
        {/* Rail Navigation */}
        <RailNav
          onTogglePanelMenu={() => setShowPanel((v) => !v)}
          onTogglePanelInfo={() => { }}
          showPanelMenu={showPanel}
          showPanelInfo={false}
        />

        {/* Left panel */}
        {showPanel && (
          <div className="w-[400px] shrink-0 h-full overflow-auto px-[5px] bg-[#161921]">
            <ProjectListPanel
              hoveredProjectId={hoveredProjectId}
              activeProjectId={activeProjectId}
              onCardHover={setHoveredProjectId}
              onCardClick={handleProjectClick}
            />
          </div>
        )}

        {/* Right content area */}
        <div className="flex-1 h-full overflow-hidden">
          {isProjectDetail ? (
            <Outlet />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span
                className="text-[15px] leading-[22px] text-[rgba(255,255,255,0.4)]"
                style={{ fontFamily: "'Hexagon_Akkurat:regular',sans-serif" }}
              >
                Select a project to view details
              </span>
            </div>
          )}
        </div>
      </div>
    </ProjectProvider>
  );
}
