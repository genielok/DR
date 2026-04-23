import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type Campaign } from "../data/mockData";
import { getCampaigns } from "@/api";

interface ProjectContextType {
  projects: Campaign[];
  addProject: (project: Campaign) => void;
  updateProject: (id: string, updates: Partial<Campaign>) => void;
  deleteProject: (id: string) => void;
  addSensorToProject: (
    projectId: string,
    sensorId: string,
    habitat?: string
  ) => void;
  refreshProjects: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined
);

const STORAGE_KEY = "vale_projects";

export function ProjectProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [projects, setProjects] = useState<Campaign[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load projects from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
        setInitialized(true);
      } catch {
        getCampaigns().then((data) => {
          setProjects(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          setInitialized(true);
        });
      }
    } else {
      getCampaigns().then((data) => {
        setProjects(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setInitialized(true);
      });
    }
  }, []);

  // Save to localStorage whenever projects change (after init)
  useEffect(() => {
    if (initialized && projects.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects, initialized]);

  const addProject = (project: Campaign) => {
    setProjects((prev) => [project, ...prev]);
  };

  const updateProject = (
    id: string,
    updates: Partial<Campaign>
  ) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const addSensorToProject = (
    projectId: string,
    sensorId: string,
    habitat?: string
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          if (p.sensors.includes(sensorId)) {
            return p;
          }
          return {
            ...p,
            sensors: [...p.sensors, sensorId],
          };
        }
        return p;
      })
    );
  };

  const refreshProjects = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        addSensorToProject,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error(
      "useProjects must be used within ProjectProvider"
    );
  }
  return context;
};
