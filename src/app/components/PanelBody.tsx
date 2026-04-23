import svgPaths from "../../imports/svg-7vt33vcn5p";
import { MapViewer } from "./MapViewer";
import type { LayerType } from "./MapViewer";
import { ProjectMap } from "./ProjectMap";

type PanelBodyProps = {
  selectedPanel?: string | null;
  className?: string;
  activeLayer?: LayerType;
  hoveredProjectId?: string | null;
  onProjectHover?: (id: string | null) => void;
  onProjectClick?: (id: string, hasSensors: boolean) => void;
};

export function PanelBody({
  selectedPanel,
  className,
  activeLayer,
  hoveredProjectId,
  onProjectHover,
  onProjectClick,
}: PanelBodyProps) {
  const renderContent = () => {
    console.log({ selectedPanel });

    switch (selectedPanel) {
      case "species-extinction-risk":
        return (
          <ProjectMap
            hoveredProjectId={hoveredProjectId}
            onPinHover={onProjectHover}
            onPinClick={onProjectClick}
          />
        );
      default:
        return <MapViewer selectedLayer={activeLayer} />;
    }
  };

  return (
    <div
      className={`bg-[#161921] flex flex-col flex-1 h-full overflow-hidden relative ${className || ""}`}
    >
      {/* Main content area — full bleed for the map viewer */}
      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>
      {/* Floating navigation buttons over the map */}
      <FloatingNav />
    </div>
  );
}

function FloatingNav() {
  return (
    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-between px-3 z-40 pointer-events-none">
      <div className="flex gap-2 pointer-events-auto">
        <NavButton>
          <div className="absolute inset-[10.42%_6.25%_10.42%_6.29%]">
            <svg
              className="absolute block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 20.9902 19"
            >
              <path
                d={svgPaths.pf74af40}
                fill="var(--fill-0, #B4BAC4)"
              />
            </svg>
          </div>
        </NavButton>
      </div>
      <div className="flex gap-2 pointer-events-auto">
        <AIButton />
      </div>
    </div>
  );
}

function NavButton({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-[#2b2f3f] hover:bg-[#33374a] content-stretch flex h-[56px] items-center justify-center rounded-[8px] shrink-0 w-[56px] cursor-pointer transition-colors border-none outline-none">
      <div className="overflow-clip relative shrink-0 size-[24px]">
        {children}
      </div>
    </div>
  );
}

function AIButton() {
  return (
    <div className="bg-[#2b2f3f] hover:bg-[#33374a] content-stretch flex h-[56px] items-center px-[10px] py-[15px] rounded-[5px] shrink-0 cursor-pointer transition-colors relative">
      <div className="relative shrink-0 size-[36px]">
        <div className="absolute left-[8px] size-[19px] top-[10px]">
          <svg
            className="absolute block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 19 19"
          >
            <g>
              <path
                d={svgPaths.p10399800}
                fill="var(--fill-0, #F5F7FA)"
              />
              <path
                d={svgPaths.pf21cf80}
                fill="var(--fill-0, #F5F7FA)"
              />
              <path
                d={svgPaths.pdf714c0}
                fill="var(--fill-0, #F5F7FA)"
              />
              <path
                d={svgPaths.pfa98700}
                fill="var(--fill-0, #F5F7FA)"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}