import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileDown,
  Info,
} from "lucide-react";
import { type Campaign } from "../../../data/mockData";
import {
  getAcousticFiles,
  getProvenanceData,
  type AcousticFile,
  type ProvenanceRow,
} from "@/api";

/* ── Design-system tokens ── */
const F = {
  bold: "'Hexagon_Akkurat:bold',sans-serif",
  regular: "'Hexagon_Akkurat:regular',sans-serif",
};

interface DataProvenanceTabProps {
  project: Campaign;
}


function ProvenanceRowComponent({
  row,
  onJumpToReview,
  acousticFiles,
}: {
  row: ProvenanceRow;
  onJumpToReview: () => void;
  acousticFiles: AcousticFile[];
}) {
  const [isExpanded, setIsExpanded] = useState(row.depth === 0);
  const [showFiles, setShowFiles] = useState(false);

  const handleAction = () => {
    if (row.actionType === "link" && row.actionTarget) {
      window.open(row.actionTarget, "_blank");
    } else if (row.actionType === "download") {
      alert("AI raw output CSV download would start here");
    } else if (row.actionType === "jump") {
      onJumpToReview();
    } else if (row.actionType === "expand") {
      setShowFiles(!showFiles);
    }
  };

  const hasChildren = row.children && row.children.length > 0;

  return (
    <>
      <div
        className="flex items-center gap-[12px] px-[14px] h-[48px] hover:bg-[#3a4050] transition-colors duration-150"
        style={{
          paddingLeft: `${row.depth * 24 + 14}px`,
          background:
            row.depth % 2 === 0 ? "#2b2f3f" : "#303546",
        }}
      >
        {/* Chevron */}
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 text-[#778192] hover:text-[rgba(255,255,255,0.9)] transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
        ) : (
          <div className="w-[14px] flex-shrink-0" />
        )}

        {/* Label + details */}
        <div className="flex-1 min-w-0 flex items-center gap-[10px]">
          <span
            className="text-[12px] leading-[18px] text-[rgba(255,255,255,0.9)] flex-shrink-0"
            style={{ fontFamily: F.bold }}
          >
            {row.label}
          </span>
          <span
            className="text-[11px] leading-[16px] text-[#778192] truncate"
            style={{ fontFamily: F.regular }}
          >
            {row.details}
          </span>
        </div>

        {/* Action */}
        <button
          onClick={handleAction}
          className="flex-shrink-0 text-[#3b82f6] hover:text-[#60a5fa] transition-colors inline-flex items-center gap-[4px] cursor-pointer"
          style={{ fontFamily: F.regular, fontSize: "11px" }}
        >
          {row.actionLabel}
          {row.actionType === "link" && (
            <ExternalLink size={10} />
          )}
          {row.actionType === "download" && (
            <FileDown size={10} />
          )}
        </button>
      </div>

      {/* Expanded Files List */}
      {row.actionType === "expand" && showFiles && (
        <div
          className="bg-[#474f5f]"
          style={{ marginLeft: `${row.depth * 24 + 14}px` }}
        >
          {/* File table header */}
          <div className="grid grid-cols-4 gap-[8px] px-[14px] h-[30px] items-center bg-[#556070]">
            {[
              "Filename",
              "Sensor ID",
              "Timestamp",
              "File Size",
            ].map((h) => (
              <span
                key={h}
                className="text-[10px] text-[#778192] uppercase tracking-wider"
                style={{ fontFamily: F.bold }}
              >
                {h}
              </span>
            ))}
          </div>
          {acousticFiles.map((file, idx) => (
            <div
              key={idx}
              className="grid grid-cols-4 gap-[8px] px-[14px] h-[32px] items-center hover:bg-[#556070] transition-colors duration-150"
              style={{
                background:
                  idx % 2 === 0 ? "#474f5f" : "#4d5567",
              }}
            >
              <span
                className="text-[11px] text-[rgba(255,255,255,0.9)] truncate"
                style={{ fontFamily: F.regular }}
              >
                {file.name}
              </span>
              <span
                className="text-[11px] text-[#778192]"
                style={{ fontFamily: F.regular }}
              >
                {file.sensorId}
              </span>
              <span
                className="text-[11px] text-[#778192]"
                style={{ fontFamily: F.regular }}
              >
                {file.timestamp}
              </span>
              <span
                className="text-[11px] text-[#778192]"
                style={{ fontFamily: F.regular }}
              >
                {file.size}
              </span>
            </div>
          ))}
          <div className="px-[14px] h-[28px] flex items-center">
            <span
              className="text-[10px] text-[#778192]"
              style={{ fontFamily: F.regular }}
            >
              Showing 6 of 1,248 files
            </span>
          </div>
        </div>
      )}

      {/* Children Rows */}
      {isExpanded &&
        row.children?.map((child) => (
          <ProvenanceRowComponent
            key={child.id}
            row={child}
            onJumpToReview={onJumpToReview}
            acousticFiles={acousticFiles}
          />
        ))}
    </>
  );
}

export function DataProvenanceTab({
  project,
}: DataProvenanceTabProps) {
  const [acousticFiles, setAcousticFiles] = useState<AcousticFile[]>([]);
  const [provenanceData, setProvenanceData] = useState<ProvenanceRow[]>([]);

  useEffect(() => {
    getAcousticFiles(project.id).then(setAcousticFiles);
    getProvenanceData(project.id).then(setProvenanceData);
  }, [project.id]);

  const handleJumpToReview = () => {
    alert(
      "Would navigate to Review tab with current session/dataset filters applied",
    );
  };

  return (
    <div className="p-[20px] flex flex-col gap-[6px]">
      {/* ── Header ── */}
      <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] px-[20px] py-[16px]">
        <span
          className="text-[16px] leading-[22px] text-[rgba(255,255,255,0.9)]"
          style={{ fontFamily: F.bold }}
        >
          Data Provenance
        </span>
        <p
          className="text-[12px] leading-[18px] text-[#778192] mt-[4px]"
          style={{ fontFamily: F.regular }}
        >
          Complete scientific pipeline — full audit trail from
          raw acoustic recordings to biodiversity impact metrics
        </p>
      </div>

      {/* ── AI Model Versions ── */}
      <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)]">
        <div className="h-[40px] px-[20px] flex items-center">
          <span
            className="text-[13px] leading-[18px] text-[rgba(255,255,255,0.9)]"
            style={{ fontFamily: F.bold }}
          >
            AI Model Versions
          </span>
        </div>
        <div className="flex gap-[2px] px-[10px] pb-[10px]">
          {[
            { name: "BirdNET", version: "v2.4" },
            { name: "Perch", version: "v1.2" },
            { name: "Custom Model", version: "V1.0" },
          ].map((model) => (
            <div
              key={model.name}
              className="flex-1 bg-[#474f5f] px-[14px] py-[10px] flex items-center justify-between"
            >
              <div className="flex items-center gap-[8px]">
                <span
                  className="text-[12px] text-[rgba(255,255,255,0.9)]"
                  style={{ fontFamily: F.bold }}
                >
                  {model.name}
                </span>
                <span
                  className="text-[11px] text-[#778192]"
                  style={{ fontFamily: F.regular }}
                >
                  {model.version}
                </span>
              </div>
              <span
                className="inline-flex items-center gap-[4px] px-[7px] py-[1px] border border-solid flex-shrink-0"
                style={{
                  fontFamily: F.regular,
                  fontSize: "10px",
                  lineHeight: "15px",
                  backgroundColor: "rgba(16,185,129,0.12)",
                  borderColor: "rgba(16,185,129,0.25)",
                  color: "#10b981",
                }}
              >
                <span className="w-[5px] h-[5px] rounded-full flex-shrink-0 bg-[#10b981]" />
                Active
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Provenance Tree ── */}
      <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] overflow-hidden">
        <div className="h-[40px] px-[20px] flex items-center">
          <span
            className="text-[13px] leading-[18px] text-[rgba(255,255,255,0.9)]"
            style={{ fontFamily: F.bold }}
          >
            Provenance Chain
          </span>
        </div>
        {provenanceData.map((row) => (
          <ProvenanceRowComponent
            key={row.id}
            row={row}
            onJumpToReview={handleJumpToReview}
            acousticFiles={acousticFiles}
          />
        ))}
      </div>

      {/* ── Info Footer ── */}
      <div
        className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] px-[20px] py-[14px] flex items-start gap-[12px]"
        style={{ borderLeft: "3px solid #3b82f6" }}
      >
        <Info
          size={16}
          className="text-[#3b82f6] flex-shrink-0 mt-[2px]"
        />
        <div>
          <span
            className="text-[12px] leading-[18px] text-[rgba(255,255,255,0.9)]"
            style={{ fontFamily: F.bold }}
          >
            Reproducibility Guarantee
          </span>
          <p
            className="text-[11px] leading-[16px] text-[#778192] mt-[4px]"
            style={{ fontFamily: F.regular }}
          >
            All AI model versions, processing timestamps, and
            source files are tracked to ensure this analysis can
            be independently verified and reproduced for
            third-party audits (e.g., KPMG).
          </p>
        </div>
      </div>
    </div>
  );
}