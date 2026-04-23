import { ProjectPin } from "./pins/ProjectPin";
import { useProjects } from "../contexts/ProjectContext";
import imgPlainOrtho from "@/assets/plain-ortho.png";

// Mock positions for project pins on the map
const projectPositions: Record<
  string,
  { x: number; y: number }
> = {
  "camp-001": { x: 50, y: 55 },
};

interface ProjectMapProps {
  hoveredProjectId?: string | null;
  onPinHover?: (id: string | null) => void;
  onPinClick?: (id: string, hasSensors: boolean) => void;
}

export function ProjectMap({
  hoveredProjectId,
  onPinHover,
  onPinClick,
}: ProjectMapProps) {
  const { projects } = useProjects();

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{ background: "#161921" }}
    >
      {/* Base Map */}
      <img
        src={imgPlainOrtho}
        alt="Map"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        draggable={false}
      />

      {/* Project Pins Layer */}
      {projects.map((project) => {
        const position = projectPositions[project.id] || {
          x: 50,
          y: 50,
        };
        return (
          <ProjectPin
            key={project.id}
            sensorCount={project.sensors.length}
            status={project.status}
            position={position}
            isHovered={hoveredProjectId === project.id}
            onClick={() =>
              onPinClick?.(
                project.id,
                project.sensors.length > 0,
              )
            }
            onMouseEnter={() => onPinHover?.(project.id)}
            onMouseLeave={() => onPinHover?.(null)}
          />
        );
      })}
    </div>
  );
}