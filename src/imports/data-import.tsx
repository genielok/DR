Create a standalone Import Data page that is navigated to from ProjectDetail, with project context passed via URL params.

IMPLEMENTATION:

1. **Create Route for Import Data Page:**
```tsx
// In App.tsx or router config
<Route path="/projects/:projectId/import" element={<DataImport />} />
```

2. **Update DataImport Page to Get Project from URL:**
```tsx
// src/pages/DataImport.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function DataImport() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  // Find project by ID
  const project = mockCampaigns.find(c => c.id === projectId);
  
  const [sensorId, setSensorId] = useState('');
  const [selectedHabitats, setSelectedHabitats] = useState<string[]>([]);
  const [files, setFiles] = useState<FileUpload[]>([]);
  // ... rest of state

  if (!project) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Project not found</p>
        <Button onClick={() => navigate('/projects')} className="mt-4">
          Back to Projects
        </Button>
      </div>
    );
  }

  const handleImport = async () => {
    // Import logic here
    // After successful import:
    navigate(`/projects/${projectId}`);
  };

  const handleCancel = () => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-foreground text-xl font-semibold">Import Data</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Upload sensor data for {project.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Project Context Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Project</p>
                <h3 className="text-foreground text-lg font-medium">{project.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{project.location}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-muted-foreground text-sm">
                    {project.startDate} - {project.endDate}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span 
                    className="text-sm px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: statusColors[project.status] + '20',
                      color: statusColors[project.status]
                    }}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
              
              {project.sensors.length > 0 && (
                <div className="text-right">
                  <p className="text-muted-foreground text-sm">Existing Sensors</p>
                  <p className="text-foreground text-2xl font-semibold">{project.sensors.length}</p>
                </div>
              )}
            </div>

            {/* Show existing sensors */}
            {project.sensors.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-muted-foreground text-sm mb-3">Current sensors in this project:</p>
                <div className="flex flex-wrap gap-2">
                  {project.sensors.map(sensor => (
                    <span 
                      key={sensor}
                      className="bg-secondary border border-border px-3 py-1.5 rounded-md text-sm text-foreground inline-flex items-center gap-2"
                    >
                      <Database className="w-3 h-3" />
                      {sensor}
                      {sensorHabitats[sensor] && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{sensorHabitats[sensor]}</span>
                        </>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sensor Deployment Section */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <Label className="text-base text-foreground">Sensor Deployment</Label>
              <p className="text-muted-foreground text-sm mt-1">
                Configure the new sensor and its deployment details
              </p>
            </div>
            
            {/* Rest of sensor form fields... */}
          </CardContent>
        </Card>

        {/* Upload Audio Files Section */}
        <Card>
          <CardContent className="p-6 space-y-4">
            {/* Upload UI from your existing code */}
          </CardContent>
        </Card>

        {/* Action Buttons - Sticky Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border py-4 -mx-6 px-6 lg:-mx-8 lg:px-8">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Button 
              variant="ghost"
              onClick={handleCancel}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            
            <div className="flex items-center gap-3">
              {files.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {files.filter(f => f.status === 'completed').length} / {files.length} files ready
                </div>
              )}
              <Button
                disabled={!isFormValid || isUploading}
                onClick={handleImport}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    Import to {project.name}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

3. **Update ProjectDetail Navigation:**

Remove Import Data tab, add navigation buttons instead:
```tsx
// In ProjectDetail.tsx - Empty state button
<button
  onClick={() => navigate(`/projects/${project.id}/import`)}
  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg text-base font-medium inline-flex items-center gap-2 transition-colors"
>
  <Upload className="w-5 h-5" />
  Import Data
</button>

// In ProjectDetail.tsx - Top bar button (when has data)
<button
  onClick={() => navigate(`/projects/${project.id}/import`)}
  className="gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white inline-flex items-center text-sm font-medium transition-colors"
>
  <Upload className="w-4 h-4" />
  Import Data
</button>
```

4. **Update Tabs in ProjectDetail:**
Remove "Import Data" from tabs array:
```tsx
const tabs = [
  { value: "overview", label: "Overview" },
  { value: "review", label: "Review" },
  { value: "operation-log", label: "Operation Log" },
  { value: "data-provenance", label: "Data Provenance" },
  // Remove import-data tab
];
```

5. **Add Navigation to DataImport:**
```tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
```

6. **Import Required Icons:**
```tsx
import { ArrowLeft, Upload, Database, Loader2 } from 'lucide-react';
```

7. **File Structure:**