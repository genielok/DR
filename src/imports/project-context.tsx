Implement a React Context-based state management system to handle dynamic project data across the application, with localStorage persistence.

STEP 1: CREATE PROJECT CONTEXT

Create file: src/contexts/ProjectContext.tsx
```tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockCampaigns } from '../data/mockData';

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

interface ProjectContextType {
  projects: Campaign[];
  addProject: (project: Campaign) => void;
  updateProject: (id: string, updates: Partial<Campaign>) => void;
  deleteProject: (id: string) => void;
  addSensorToProject: (projectId: string, sensorId: string, habitat?: string) => void;
  refreshProjects: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEY = 'vale_projects';

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Campaign[]>([]);

  // Load projects from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProjects(parsed);
        console.log('✅ Loaded projects from localStorage:', parsed.length);
      } catch (error) {
        console.error('Failed to parse stored projects:', error);
        setProjects(mockCampaigns);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCampaigns));
      }
    } else {
      // First time: initialize with mock data
      console.log('🆕 Initializing with mock data');
      setProjects(mockCampaigns);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCampaigns));
    }
  }, []);

  // Save to localStorage whenever projects change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      console.log('💾 Saved projects to localStorage:', projects.length);
    }
  }, [projects]);

  const addProject = (project: Campaign) => {
    setProjects(prev => {
      const updated = [project, ...prev];
      console.log('➕ Added project:', project.name);
      return updated;
    });
  };

  const updateProject = (id: string, updates: Partial<Campaign>) => {
    setProjects(prev => {
      const updated = prev.map(p => 
        p.id === id ? { ...p, ...updates } : p
      );
      console.log('✏️ Updated project:', id, updates);
      return updated;
    });
  };

  const deleteProject = (id: string) => {
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id);
      console.log('🗑️ Deleted project:', id);
      return updated;
    });
  };

  const addSensorToProject = (projectId: string, sensorId: string, habitat?: string) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          // Check if sensor already exists
          if (p.sensors.includes(sensorId)) {
            console.warn('⚠️ Sensor already exists:', sensorId);
            return p;
          }
          console.log('📡 Added sensor to project:', projectId, sensorId);
          return {
            ...p,
            sensors: [...p.sensors, sensorId],
            // Optionally track habitat types
            habitatTypes: habitat 
              ? [...(p.habitatTypes || []), habitat]
              : p.habitatTypes,
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
        console.log('🔄 Refreshed projects from localStorage');
      } catch (error) {
        console.error('Failed to refresh projects:', error);
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
    throw new Error('useProjects must be used within ProjectProvider');
  }
  return context;
};
```

STEP 2: WRAP APP WITH PROVIDER

Update: src/App.tsx
```tsx
import { ProjectProvider } from './contexts/ProjectContext';

export default function App() {
  // ... existing state

  return (
    <ProjectProvider>
      <div className="bg-[#161921] flex gap-[6px] h-screen w-screen overflow-hidden">
        <RailNav
          onTogglePanelMenu={() => setShowPanelMenu(!showPanelMenu)}
          onTogglePanelInfo={() => setShowPanelInfo(!showPanelInfo)}
          showPanelMenu={showPanelMenu}
          showPanelInfo={showPanelInfo}
        />

        {showPanelMenu && <PanelMenu onMenuItemClick={handleMenuItemClick} />}

        {showPanelInfo && (
          <PanelInfo 
            selectedPanel={selectedPanel}
            isFullWidth={selectedPanel === "species-extinction-risk"}
          />
        )}

        {selectedPanel !== "species-extinction-risk" && <PanelBody className="flex-1" />}
      </div>
    </ProjectProvider>
  );
}
```

STEP 3: UPDATE SPECIESEXTINCTIONRISKCONTENT

Update: src/components/SpeciesExtinctionRisk.tsx
```tsx
import { useProjects } from '../contexts/ProjectContext';

export function SpeciesExtinctionRiskContent() {
  const { projects, addProject, updateProject } = useProjects();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // Form state
  const [projectName, setProjectName] = useState("");
  const [client, setClient] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<"active" | "completed" | "processing">("active");

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

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-[#161921] min-h-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-[#f5f7fa] text-2xl">Projects</h1>
          <p className="text-[#b4bac4] text-sm mt-2">
            Manage acoustic monitoring projects and field deployments
          </p>
        </div>
        <button
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Summary Bar */}
      <div className="text-sm text-[#6b7280]">
        {projects.length} Projects · Pending Review:{" "}
        {projects.filter((c) => c.status === "processing").length} · Critical Species: 2
      </div>

      {/* Campaign List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((campaign) => (
          <Link key={campaign.id} to={`/projects/${campaign.id}`}>
            {/* Campaign card content - same as before */}
          </Link>
        ))}
      </div>

      {/* Modals - same as before */}
    </div>
  );
}
```

STEP 4: UPDATE DATAIMPORT

Update: src/pages/DataImport.tsx
```tsx
import { useProjects } from '../contexts/ProjectContext';

export default function DataImport() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, updateProject, addSensorToProject } = useProjects();

  const project = projects.find((c) => c.id === projectId);

  // ... existing state

  const handleImport = () => {
    if (!isFormValid) return;
    setImportStarted(true);

    const fileIds = files.map((f) => f.id);
    let completed = 0;

    fileIds.forEach((id, index) => {
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, status: "uploading", progress: 50 } : f
          )
        );
      }, index * 400);

      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, status: "complete", progress: 100 } : f
          )
        );
        completed++;
        
        if (completed === fileIds.length) {
          // Update project after all files uploaded
          addSensorToProject(
            projectId!,
            sensorId,
            selectedHabitats.join(', ')
          );
          
          updateProject(projectId!, {
            totalRecordings: (project?.totalRecordings || 0) + files.length,
            processedRecordings: project?.processedRecordings || 0,
          });

          setTimeout(() => setImportComplete(true), 500);
        }
      }, index * 400 + 800);
    });
  };

  // ... rest of component
}
```

STEP 5: UPDATE PROJECTDETAIL

Update: src/pages/ProjectDetail.tsx
```tsx
import { useProjects } from '../contexts/ProjectContext';

export default function ProjectDetail() {
  const { id } = useParams();
  const { projects } = useProjects();
  const project = projects.find((c) => c.id === id);

  const [showCsvTooltip, setShowCsvTooltip] = useState(false);
  const [showReportTooltip, setShowReportTooltip] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  if (!project) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Project not found
      </div>
    );
  }

  const hasData = project.totalRecordings > 0 || project.speciesCount > 0;

  // ... rest of component
}
```

STEP 6: ADD TYPES FILE (OPTIONAL)

Create: src/types/campaign.ts
```tsx
export interface Campaign {
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
```

Then import this type in ProjectContext and components instead of duplicating it.

BENEFITS:
- ✅ Automatic state sync across all components
- ✅ localStorage persistence (survives page refresh)
- ✅ Single source of truth
- ✅ New projects immediately show in list
- ✅ Import updates project data in real-time
- ✅ Clean, maintainable code
- ✅ Easy to add more features later

TESTING:
1. Create a new project → Should appear in list immediately
2. Navigate to project detail → Should show correct data
3. Import data to project → Should update sensor count
4. Refresh page → Data should persist
5. Edit project → Changes should save and sync

DEBUGGING:
Check browser console for logs:
- "✅ Loaded projects from localStorage"
- "➕ Added project: [name]"
- "📡 Added sensor to project: [id]"
- "💾 Saved projects to localStorage"

RESET DATA (if needed):
Add a dev button or run in console:
```javascript
localStorage.removeItem('vale_projects');
location.reload();
```