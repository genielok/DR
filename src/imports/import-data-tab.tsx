Modify the DataImport component to work as an embedded tab within ProjectDetail page:

CHANGES NEEDED:

1. **Remove Project Selection:**
   - Remove the project selector dropdown
   - Accept project as a prop instead
   - Auto-populate project context from props

2. **Simplified Component Interface:**
```tsx
interface ImportDataTabProps {
  project: Campaign;
}

export function ImportDataTab({ project }: ImportDataTabProps) {
  // Remove selectedProject state - use project prop directly
  const [sensorId, setSensorId] = useState('');
  const [selectedHabitats, setSelectedHabitats] = useState<string[]>([]);
  // ... rest of state
  
  return (
    <div className="p-6 lg:p-8 space-y-6 bg-background">
      {/* Project Context Banner - Read-only */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Importing data for</p>
            <h3 className="text-foreground font-medium">{project.name}</h3>
            <p className="text-muted-foreground text-sm">{project.location}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm">Current sensors</p>
            <p className="text-foreground font-medium">{project.sensors.length}</p>
          </div>
        </div>
      </div>

      {/* Rest of the form without project selector */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Sensor Deployment section */}
        </CardContent>
      </Card>

      {/* Upload section */}
      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Upload UI */}
        </CardContent>
      </Card>

      {/* Footer buttons */}
      <div className="flex justify-end gap-3">
        <Button 
          variant="ghost"
          onClick={() => onCancel?.()}
        >
          Cancel
        </Button>
        <Button
          disabled={!isFormValid}
          onClick={handleImport}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          Import to {project.name}
        </Button>
      </div>
    </div>
  );
}
```

3. **Update Form Validation:**
```tsx
const isFormValid = sensorId.trim() !== '' && files.length > 0;
// No need to check selectedProject anymore
```

4. **Update ProjectDetail Integration:**
```tsx
// In ProjectDetail.tsx
import { ImportDataTab } from '../components/project/ImportDataTab';

// In the tab content section:
{activeTab === "import-data" && <ImportDataTab project={project} />}
```

5. **Change Empty State Button:**

From:
```tsx
<button
  onClick={() => setActiveTab('import-data')}
  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg"
>
  <Upload className="w-5 h-5" />
  Import Data
</button>
```

To:
```tsx
<button
  onClick={() => setActiveTab('import-data')}
  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg text-base font-medium inline-flex items-center gap-2 transition-colors"
>
  <Upload className="w-5 h-5" />
  Import Data
</button>
```
(Keep as is - just switches tabs, no redirect)

6. **Change Top Bar Import Button:**

From redirect to tab switch:
```tsx
<button
  onClick={() => setActiveTab('import-data')}
  className="gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white inline-flex items-center text-sm font-medium transition-colors"
>
  <Upload className="w-4 h-4" />
  Import Data
</button>
```

7. **File Structure:**