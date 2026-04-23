import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent, ReactNode } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Upload,
  X,
  FileAudio,
  CheckCircle2,
  AlertCircle,
  FolderUp,
  HardDrive,
  MapPin,
  Clock,
  ChevronDown,
  ArrowLeft,
  Database,
  Globe,
  FileText,
} from "lucide-react";
import { useProjects } from "../contexts/ProjectContext";

/* ── Design-system tokens ── */
const F = {
  bold: "'Hexagon_Akkurat:bold',sans-serif",
  regular: "'Hexagon_Akkurat:regular',sans-serif",
};

interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "pending" | "uploading" | "complete" | "error";
  progress: number;
}

const sensorHabitats: Record<string, string> = {
  "SNR-001": "Forest",
  "SNR-002": "Canopy",
  "SNR-003": "Wetland",
  "SNR-004": "Ridge",
  "SNR-005": "Valley",
  "SNR-006": "Grassland",
  "SNR-007": "Riverine",
  "SNR-008": "Coastal",
  "SNR-009": "Forest",
  "SNR-010": "Canopy",
};

const statusColors: Record<string, string> = {
  active: "#3b82f6",
  processing: "#f59e0b",
  completed: "#10b981",
};

const HABITAT_OPTIONS = [
  "Forest",
  "Canopy",
  "Wetland",
  "Ridge",
  "Valley",
  "Grassland",
  "Riverine",
  "Coastal",
  "Urban Edge",
];

/* ── Shared input style ── */
const inputStyle = {
  fontFamily: F.regular,
  fontSize: "12px",
  height: "36px",
  backgroundColor: "#474f5f",
  color: "rgba(255,255,255,0.9)",
  border: "none",
  outline: "none",
  paddingLeft: "10px",
  paddingRight: "10px",
  width: "100%",
};

export default function DataImport() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, updateProject, addSensorToProject } =
    useProjects();

  const project = projects.find((c) => c.id === projectId);

  const [sensorId, setSensorId] = useState("");
  const [selectedHabitats, setSelectedHabitats] = useState<
    string[]
  >([]);
  const [habitatDropdownOpen, setHabitatDropdownOpen] =
    useState(false);
  const [deploymentDate, setDeploymentDate] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [importStarted, setImportStarted] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Not Found ── */
  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#161921] h-full">
        <div className="flex flex-col items-center gap-[16px]">
          <div className="w-[64px] h-[64px] bg-[#2b2f3f] flex items-center justify-center">
            <Database size={28} className="text-[#778192]" />
          </div>
          <span
            className="text-[16px] leading-[22px] text-[rgba(255,255,255,0.9)]"
            style={{ fontFamily: F.bold }}
          >
            Project not found
          </span>
          <button
            onClick={() => navigate("/")}
            className="h-[34px] px-[16px] bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors duration-150 cursor-pointer inline-flex items-center gap-[6px]"
            style={{ fontFamily: F.regular, fontSize: "12px" }}
          >
            <ArrowLeft size={13} />
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const isFormValid =
    sensorId.trim() !== "" && files.length > 0;

  const handleCancel = () => navigate(`/projects/${projectId}`);

  const handleFileDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileSelect = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
  };

  const addFiles = (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      type: f.type,
      status: "pending" as const,
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...uploadFiles]);
  };

  const removeFile = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const toggleHabitat = (habitat: string) => {
    setSelectedHabitats((prev) =>
      prev.includes(habitat)
        ? prev.filter((h) => h !== habitat)
        : [...prev, habitat],
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024)
      return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleImport = () => {
    if (!isFormValid) return;
    setImportStarted(true);
    const fileIds = files.map((f) => f.id);
    let completed = 0;
    fileIds.forEach((id, index) => {
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                ...f,
                status: "uploading" as const,
                progress: 50,
              }
              : f,
          ),
        );
      }, index * 400);
      setTimeout(
        () => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? {
                  ...f,
                  status: "complete" as const,
                  progress: 100,
                }
                : f,
            ),
          );
          completed++;
          if (completed === fileIds.length) {
            addSensorToProject(
              projectId!,
              sensorId,
              selectedHabitats.join(", "),
            );
            updateProject(projectId!, {
              totalRecordings:
                (project?.totalRecordings || 0) + files.length,
              processedRecordings:
                project?.processedRecordings || 0,
            });
            setTimeout(() => setImportComplete(true), 500);
          }
        },
        index * 400 + 800,
      );
    });
  };

  const handleReset = () => {
    setSensorId("");
    setSelectedHabitats([]);
    setDeploymentDate("");
    setLongitude("");
    setLatitude("");
    setNotes("");
    setFiles([]);
    setImportStarted(false);
    setImportComplete(false);
  };

  /* ═══════════════════════════════════════
     Success State
     ═══════════════════════════════════════ */
  if (importComplete) {
    return (
      <div className="flex-1 flex flex-col bg-[#161921] h-full overflow-hidden">
        {/* Header */}
        <PageHeader project={project} onBack={handleCancel} />

        {/* Success body */}
        <div className="flex-1 flex items-center justify-center p-[32px]">
          <div className="flex flex-col items-center gap-[16px] max-w-[400px] text-center">
            <div className="w-[72px] h-[72px] bg-[rgba(16,185,129,0.12)] flex items-center justify-center">
              <CheckCircle2
                size={36}
                className="text-[#10b981]"
              />
            </div>
            <span
              className="text-[18px] leading-[27px] text-[rgba(255,255,255,0.9)]"
              style={{ fontFamily: F.bold }}
            >
              Import Complete
            </span>
            <span
              className="text-[13px] leading-[20px] text-[#778192]"
              style={{ fontFamily: F.regular }}
            >
              {files.length} file{files.length !== 1 ? "s" : ""}{" "}
              successfully imported to{" "}
              <span
                className="text-[rgba(255,255,255,0.9)]"
                style={{ fontFamily: F.bold }}
              >
                {project.name}
              </span>
            </span>
            <div className="flex gap-[8px] mt-[8px]">
              <button
                onClick={handleReset}
                className="h-[36px] px-[16px] border border-[#4a5568] bg-transparent text-[#b7b9be] hover:bg-[#404856] hover:text-white transition-colors duration-150 cursor-pointer"
                style={{
                  fontFamily: F.regular,
                  fontSize: "12px",
                }}
              >
                Import More Data
              </button>
              <button
                onClick={() =>
                  navigate(`/projects/${projectId}`)
                }
                className="h-[36px] px-[16px] bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors duration-150 cursor-pointer"
                style={{ fontFamily: F.bold, fontSize: "12px" }}
              >
                Back to Project
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     Main Form
     ═══════════════════════════════════════ */
  return (
    <div className="flex-1 flex flex-col bg-[#161921] h-full overflow-hidden">
      {/* Header */}
      <PageHeader project={project} onBack={handleCancel} />

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-[960px] mx-auto p-[20px] flex flex-col gap-[6px]">
          {/* ── Project Context Card ── */}
          <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] px-[20px] py-[16px]">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className="text-[11px] text-[#778192]"
                  style={{ fontFamily: F.regular }}
                >
                  Project
                </span>
                <div
                  className="text-[16px] leading-[24px] text-[rgba(255,255,255,0.9)] mt-[2px]"
                  style={{ fontFamily: F.bold }}
                >
                  {project.name}
                </div>
                <div
                  className="text-[12px] text-[#778192] mt-[2px]"
                  style={{ fontFamily: F.regular }}
                >
                  {project.location}
                </div>
                <div className="flex items-center gap-[8px] mt-[6px]">
                  <span
                    className="text-[11px] text-[#778192]"
                    style={{ fontFamily: F.regular }}
                  >
                    {new Date(
                      project.startDate,
                    ).toLocaleDateString()}{" "}
                    –{" "}
                    {new Date(
                      project.endDate,
                    ).toLocaleDateString()}
                  </span>
                  <span className="text-[#474f5f]">·</span>
                  <span
                    className="text-[10px] px-[6px] py-[1px] inline-flex items-center"
                    style={{
                      fontFamily: F.bold,
                      backgroundColor:
                        (statusColors[project.status] ||
                          "#778192") + "20",
                      color:
                        statusColors[project.status] ||
                        "#778192",
                    }}
                  >
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                  </span>
                </div>
              </div>
              {project.sensors.length > 0 && (
                <div className="text-right">
                  <span
                    className="text-[11px] text-[#778192]"
                    style={{ fontFamily: F.regular }}
                  >
                    Existing Sensors
                  </span>
                  <div
                    className="text-[24px] leading-[32px] text-[rgba(255,255,255,0.9)]"
                    style={{ fontFamily: F.bold }}
                  >
                    {project.sensors.length}
                  </div>
                </div>
              )}
            </div>

            {/* Existing sensors */}
            {project.sensors.length > 0 && (
              <div
                className="mt-[12px] pt-[12px]"
                style={{ borderTop: "1px solid #474f5f" }}
              >
                <span
                  className="text-[11px] text-[#778192] block mb-[8px]"
                  style={{ fontFamily: F.regular }}
                >
                  Current sensors in this project:
                </span>
                <div className="flex flex-wrap gap-[4px]">
                  {project.sensors.map((sensor) => (
                    <span
                      key={sensor}
                      className="bg-[#474f5f] px-[10px] h-[28px] inline-flex items-center gap-[6px]"
                      style={{
                        fontFamily: F.regular,
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      <Database
                        size={11}
                        className="text-[#778192]"
                      />
                      {sensor}
                      {sensorHabitats[sensor] && (
                        <>
                          <span className="text-[#778192]">
                            ·
                          </span>
                          <span className="text-[#778192]">
                            {sensorHabitats[sensor]}
                          </span>
                        </>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sensor Deployment ── */}
          <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] px-[20px] py-[16px]">
            <div className="mb-[14px]">
              <div
                className="text-[14px] leading-[20px] text-[rgba(255,255,255,0.9)]"
                style={{ fontFamily: F.bold }}
              >
                Sensor Deployment
              </div>
              <div
                className="text-[11px] text-[#778192] mt-[2px]"
                style={{ fontFamily: F.regular }}
              >
                Configure the new sensor and its deployment
                details
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
              {/* Sensor ID */}
              <FormField
                icon={
                  <HardDrive
                    size={12}
                    className="text-[#778192]"
                  />
                }
                label="Sensor ID"
                required
              >
                <input
                  type="text"
                  placeholder="e.g. SNR-012"
                  value={sensorId}
                  onChange={(e) => setSensorId(e.target.value)}
                  disabled={importStarted}
                  className="placeholder-[#778192] disabled:opacity-50"
                  style={inputStyle}
                />
              </FormField>

              {/* Deployment Date */}
              <FormField
                icon={
                  <Clock size={12} className="text-[#778192]" />
                }
                label="Deployment Date"
              >
                <input
                  type="date"
                  value={deploymentDate}
                  onChange={(e) =>
                    setDeploymentDate(e.target.value)
                  }
                  disabled={importStarted}
                  className="disabled:opacity-50"
                  style={{ ...inputStyle, colorScheme: "dark" }}
                />
              </FormField>



              {/* Longitude & Latitude */}
              <FormField
                icon={
                  <Globe
                    size={12}
                    className="text-[#778192]"
                  />
                }
                label="Longitude / Latitude"
              >
                <div className="flex gap-[8px]">
                  <input
                    type="text"
                    placeholder="e.g. -122.4194"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    disabled={importStarted}
                    className="placeholder-[#778192] disabled:opacity-50 flex-1"
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="e.g. 37.7749"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    disabled={importStarted}
                    className="placeholder-[#778192] disabled:opacity-50 flex-1"
                    style={inputStyle}
                  />
                </div>
              </FormField>
              {/* Habitat Type */}
              <FormField
                icon={
                  <MapPin
                    size={12}
                    className="text-[#778192]"
                  />
                }
                label="Habitat Type"
              >
                <div className="relative">
                  <button
                    onClick={() =>
                      !importStarted &&
                      setHabitatDropdownOpen(
                        !habitatDropdownOpen,
                      )
                    }
                    disabled={importStarted}
                    className="flex items-center justify-between w-full disabled:opacity-50 cursor-pointer"
                    style={{
                      ...inputStyle,
                      display: "flex",
                      color:
                        selectedHabitats.length > 0
                          ? "rgba(255,255,255,0.9)"
                          : "#778192",
                    }}
                  >
                    <span className="truncate">
                      {selectedHabitats.length > 0
                        ? selectedHabitats.join(", ")
                        : "Select habitats..."}
                    </span>
                    <ChevronDown
                      size={13}
                      className="text-[#778192] flex-shrink-0"
                    />
                  </button>
                  {habitatDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-[2px] z-10 max-h-[200px] overflow-y-auto bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)]">
                      {HABITAT_OPTIONS.map((habitat) => (
                        <button
                          key={habitat}
                          onClick={() => toggleHabitat(habitat)}
                          className="w-full h-[34px] px-[10px] flex items-center gap-[8px] hover:bg-[#474f5f] transition-colors duration-150 cursor-pointer"
                          style={{
                            fontFamily: F.regular,
                            fontSize: "12px",
                            color: selectedHabitats.includes(
                              habitat,
                            )
                              ? "#3b82f6"
                              : "rgba(255,255,255,0.9)",
                          }}
                        >
                          <span
                            className="w-[14px] h-[14px] flex items-center justify-center flex-shrink-0"
                            style={{
                              border: selectedHabitats.includes(
                                habitat,
                              )
                                ? "1px solid #3b82f6"
                                : "1px solid #4a5568",
                              background:
                                selectedHabitats.includes(
                                  habitat,
                                )
                                  ? "#3b82f6"
                                  : "transparent",
                            }}
                          >
                            {selectedHabitats.includes(
                              habitat,
                            ) && (
                                <CheckCircle2
                                  size={10}
                                  className="text-white"
                                />
                              )}
                          </span>
                          {habitat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </FormField>
            </div>

            {/* Notes */}
            <div className="mt-[12px]">
              <span
                className="text-[11px] text-[#778192] block mb-[4px]"
                style={{ fontFamily: F.bold }}
              >
                <FileText size={12} className="inline mr-[4px] text-[#778192]" />
                Notes (optional)
              </span>
              <textarea
                placeholder="Additional deployment notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={importStarted}
                rows={3}
                className="w-full px-[10px] py-[8px] bg-[#474f5f] text-[rgba(255,255,255,0.9)] placeholder-[#778192] outline-none border-none resize-none disabled:opacity-50"
                style={{
                  fontFamily: F.regular,
                  fontSize: "12px",
                }}
              />
            </div>
          </div>

          {/* ── Upload Audio Files ── */}
          <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] px-[20px] py-[16px]">
            <div
              className="text-[14px] leading-[20px] text-[rgba(255,255,255,0.9)] mb-[12px]"
              style={{ fontFamily: F.bold }}
            >
              Upload Audio Files{" "}
              <span className="text-[#D03A1E]">*</span>
            </div>

            {/* Drop Zone */}
            {!importStarted && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-[2px] border-dashed p-[32px] text-center cursor-pointer transition-colors duration-150"
                style={{
                  borderColor: isDragging
                    ? "#3b82f6"
                    : "#4a5568",
                  backgroundColor: isDragging
                    ? "rgba(59,130,246,0.06)"
                    : "transparent",
                }}
              >
                <FolderUp
                  size={36}
                  className="mx-auto mb-[10px]"
                  style={{
                    color: isDragging ? "#3b82f6" : "#778192",
                  }}
                />
                <div
                  className="text-[13px] leading-[20px] text-[rgba(255,255,255,0.9)] mb-[4px]"
                  style={{ fontFamily: F.bold }}
                >
                  Drop audio files here or click to browse
                </div>
                <div
                  className="text-[11px] text-[#778192]"
                  style={{ fontFamily: F.regular }}
                >
                  Supports WAV, FLAC, MP3, OGG — Max 500MB per
                  file
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".wav,.flac,.mp3,.ogg"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-[12px]">
                <div className="flex items-center justify-between mb-[6px]">
                  <span
                    className="text-[11px] text-[#778192]"
                    style={{ fontFamily: F.regular }}
                  >
                    {files.length} file
                    {files.length !== 1 ? "s" : ""} selected
                    {importStarted && (
                      <span className="ml-[6px]">
                        (
                        {
                          files.filter(
                            (f) => f.status === "complete",
                          ).length
                        }{" "}
                        / {files.length} complete)
                      </span>
                    )}
                  </span>
                  {!importStarted && (
                    <button
                      onClick={() => setFiles([])}
                      className="text-[10px] text-[#778192] hover:text-white transition-colors duration-150 cursor-pointer"
                      style={{ fontFamily: F.regular }}
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="max-h-[256px] overflow-y-auto flex flex-col gap-[2px]">
                  {files.map((file, idx) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-[10px] px-[10px] h-[38px]"
                      style={{
                        backgroundColor:
                          idx % 2 === 0 ? "#474f5f" : "#3a4050",
                      }}
                    >
                      <FileAudio
                        size={13}
                        className="text-[#778192] flex-shrink-0"
                      />
                      <span
                        className="text-[12px] text-[rgba(255,255,255,0.9)] flex-1 truncate"
                        style={{ fontFamily: F.regular }}
                      >
                        {file.name}
                      </span>
                      <span
                        className="text-[10px] text-[#778192] flex-shrink-0"
                        style={{ fontFamily: F.regular }}
                      >
                        {formatFileSize(file.size)}
                      </span>

                      {file.status === "uploading" && (
                        <div className="w-[60px] h-[4px] bg-[#2b2f3f] flex-shrink-0">
                          <div
                            className="h-full bg-[#3b82f6] transition-all duration-300"
                            style={{
                              width: `${file.progress}%`,
                            }}
                          />
                        </div>
                      )}
                      {file.status === "complete" && (
                        <CheckCircle2
                          size={14}
                          className="text-[#10b981] flex-shrink-0"
                        />
                      )}
                      {file.status === "error" && (
                        <AlertCircle
                          size={14}
                          className="text-[#D03A1E] flex-shrink-0"
                        />
                      )}
                      {file.status === "pending" &&
                        !importStarted && (
                          <button
                            onClick={() => removeFile(file.id)}
                            className="text-[#778192] hover:text-white transition-colors duration-150 flex-shrink-0 cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Footer Actions ── */}
          {!importStarted && (
            <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] px-[20px] py-[12px] flex items-center justify-between">
              <button
                onClick={handleCancel}
                className="h-[36px] px-[14px] bg-transparent text-[#778192] hover:text-white hover:bg-[#474f5f] transition-colors duration-150 cursor-pointer"
                style={{
                  fontFamily: F.regular,
                  fontSize: "12px",
                }}
              >
                Cancel
              </button>

              <div className="flex items-center gap-[10px]">
                {files.length > 0 && (
                  <span
                    className="text-[11px] text-[#778192]"
                    style={{ fontFamily: F.regular }}
                  >
                    {
                      files.filter(
                        (f) => f.status === "complete",
                      ).length
                    }{" "}
                    / {files.length} files ready
                  </span>
                )}
                <button
                  disabled={!isFormValid}
                  onClick={handleImport}
                  className="h-[36px] px-[16px] bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors duration-150 cursor-pointer inline-flex items-center gap-[6px] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: F.bold,
                    fontSize: "12px",
                  }}
                >
                  <Upload size={13} />
                  Import to {project.name}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   Sub-components
   ════════════════════════════════════════ */

/* Page Header */
function PageHeader({
  project,
  onBack,
}: {
  project: { name: string };
  onBack: () => void;
}) {
  return (
    <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] shrink-0 px-[20px] py-[14px]">
      <button
        onClick={onBack}
        className="flex items-center gap-[6px] h-[28px] px-[8px] -ml-[8px] mb-[6px] bg-transparent hover:bg-[#474f5f] text-[#778192] hover:text-[rgba(255,255,255,0.9)] transition-colors duration-150 cursor-pointer"
      >
        <ArrowLeft size={13} />
        <span
          className="text-[12px] leading-[18px]"
          style={{ fontFamily: F.regular }}
        >
          Back to Project
        </span>
      </button>
      <div
        className="text-[18px] leading-[27px] text-[rgba(255,255,255,0.9)]"
        style={{ fontFamily: F.bold }}
      >
        Import Data
      </div>
      <div
        className="text-[12px] leading-[18px] text-[#778192] mt-[2px]"
        style={{ fontFamily: F.regular }}
      >
        Upload sensor data for {project.name}
      </div>
    </div>
  );
}

/* Form Field Wrapper */
function FormField({
  icon,
  label,
  required,
  children,
}: {
  icon: ReactNode;
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-[4px] mb-[4px]">
        {icon}
        <span
          className="text-[11px] text-[#778192]"
          style={{ fontFamily: F.bold }}
        >
          {label}
        </span>
        {required && (
          <span className="text-[#D03A1E] text-[11px]">*</span>
        )}
      </div>
      {children}
    </div>
  );
}
