import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { RailNav } from "./RailNav";
import { PanelMenu } from "./PanelMenu";
import { PanelInfo, type ConditionLayer } from "./PanelInfo";
import { PanelBody } from "./PanelBody";
import { ReportsPanel } from "./ReportsPanel";
import { EcosystemCondition } from "./EcosystemCondition";
import { ProjectProvider } from "../contexts/ProjectContext";
import type { LayerType } from "./MapViewer";

const PANEL_IDS = [
  "ecosystem-extent",
  "ecosystem-condition",
  "species-extinction-risk",
  "species-populations",
];

export function PanelLayout() {
  const [showPanelMenu, setShowPanelMenu] = useState(false);
  const [showPanelInfo, setShowPanelInfo] = useState(true);
  const [activeLayer, setActiveLayer] = useState<LayerType>(
    "extent_loss&Gain",
  );
  const [selectedPublication, setSelectedPublication] =
    useState<string | null>(null);
  const [conditionLayers, setConditionLayers] = useState<
    ConditionLayer[]
  >([]);
  const [hoveredProjectId, setHoveredProjectId] = useState<
    string | null
  >(null);

  const location = useLocation();
  const navigate = useNavigate();

  const isProjectDetail =
    location.pathname.startsWith("/projects/");

  // Derive selectedPanel from the current URL path
  const pathSegment = location.pathname.replace(/^\//, "");
  const selectedPanel = PANEL_IDS.includes(pathSegment)
    ? pathSegment
    : "ecosystem-extent";

  const handleMenuItemClick = (panelName: string) => {
    navigate(`/${panelName}`);
    setShowPanelInfo(true);
    // Reset publication selection when changing panels
    if (panelName !== "ecosystem-extent") {
      setSelectedPublication(null);
    }
  };

  const handleProjectClick = (
    id: string,
    hasSensors: boolean,
  ) => {
    if (hasSensors) {
      navigate(`/projects/${id}/map`);
    } else {
      navigate(`/projects/${id}`);
    }
  };

  return (
    <ProjectProvider>
      <div className="bg-[#161921] flex gap-[6px] h-screen w-screen overflow-hidden">
        {/* Rail Navigation - Always visible */}
        <RailNav
          onTogglePanelMenu={() =>
            setShowPanelMenu(!showPanelMenu)
          }
          onTogglePanelInfo={() =>
            setShowPanelInfo(!showPanelInfo)
          }
          showPanelMenu={showPanelMenu}
          showPanelInfo={showPanelInfo}
        />

        {/* Panel Menu - Toggleable */}
        {showPanelMenu && (
          <PanelMenu onMenuItemClick={handleMenuItemClick} />
        )}

        {/* When on a project detail route, render it as the main content */}
        {isProjectDetail ? (
          <Outlet />
        ) : (
          <>
            {/* Panel Info - Toggleable */}
            {showPanelInfo && (
              <PanelInfo
                selectedPanel={selectedPanel}
                onLayerChange={setActiveLayer}
                onPublicationSelect={setSelectedPublication}
                onConditionLayersChange={setConditionLayers}
                hoveredProjectId={hoveredProjectId}
                onProjectHover={setHoveredProjectId}
                onProjectClick={handleProjectClick}
              />
            )}

            {/* Main content area — switches based on selected panel */}
            {selectedPanel === "ecosystem-condition" ? (
              <EcosystemCondition
                className="flex-1 h-full"
                layers={conditionLayers}

              />
            ) : (
              !selectedPublication && (
                <PanelBody
                  className="flex-1"
                  selectedPanel={selectedPanel}
                  activeLayer={activeLayer}
                  hoveredProjectId={hoveredProjectId}
                  onProjectHover={setHoveredProjectId}
                  onProjectClick={handleProjectClick}
                />
              )
            )}

            {/* Reports Panel - shown when a publication is selected */}
            {selectedPublication === "pub-9" && (
              <ReportsPanel
                className="flex-1"
                onClose={() => setSelectedPublication(null)}
              />
            )}
          </>
        )}
      </div>
    </ProjectProvider>
  );
}