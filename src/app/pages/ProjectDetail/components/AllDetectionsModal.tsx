import { useState, useMemo } from "react";
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { type Species } from "../../../data/mockData";

const F = {
  bold: "'Hexagon_Akkurat:bold',sans-serif",
  regular: "'Hexagon_Akkurat:regular',sans-serif",
};

const IUCN_ABBR: Record<string, string> = {
  "Least Concern": "LC",
  "Near Threatened": "NT",
  Vulnerable: "VU",
  Endangered: "EN",
  "Critically Endangered": "CR",
  "Data Deficient": "DD",
};

const selectStyle = {
  backgroundColor: "#474f5f",
  color: "rgba(255,255,255,0.9)",
  border: "none",
  outline: "none",
  fontFamily: F.regular,
  fontSize: "12px",
  height: "34px",
  paddingLeft: "10px",
  paddingRight: "10px",
  cursor: "pointer",
};

const ITEMS_PER_PAGE = 20;

const ALL_DETECTION_ROWS = [
  { id: "det-001", timestamp: "2026-04-18 14:32:07", sensor: "SNR-001", model: "BirdNET", conf: 0.96, dur: "0:04" },
  { id: "det-002", timestamp: "2026-04-18 08:15:42", sensor: "SNR-003", model: "Perch", conf: 0.92, dur: "0:06" },
  { id: "det-003", timestamp: "2026-04-17 21:48:11", sensor: "SNR-002", model: "Custom Model", conf: 0.87, dur: "0:03" },
  { id: "det-004", timestamp: "2026-04-17 16:22:33", sensor: "SNR-001", model: "BirdNET", conf: 0.84, dur: "0:05" },
  { id: "det-005", timestamp: "2026-04-17 11:05:58", sensor: "SNR-003", model: "Map of Life", conf: 0.78, dur: "0:04" },
  { id: "det-006", timestamp: "2026-04-16 19:37:20", sensor: "SNR-004", model: "Perch", conf: 0.73, dur: "0:07" },
  { id: "det-007", timestamp: "2026-04-16 06:12:45", sensor: "SNR-002", model: "BirdNET", conf: 0.65, dur: "0:03" },
  { id: "det-008", timestamp: "2026-04-15 23:54:09", sensor: "SNR-005", model: "Custom Model", conf: 0.58, dur: "0:05" },
];

const confDotColor = (c: number) =>
  c >= 0.9 ? "#10b981" : c >= 0.7 ? "#f59e0b" : "#D03A1E";

interface AllDetectionsModalProps {
  species: Species;
  iucnColor: string;
  onClose: () => void;
}

export function AllDetectionsModal({
  species,
  iucnColor,
  onClose,
}: AllDetectionsModalProps) {
  const [page, setPage] = useState(1);
  const [sensorFilter, setSensorFilter] = useState("all");
  const [confidenceFilter, setConfidenceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("timestamp-desc");
  const [playingRowId, setPlayingRowId] = useState<string | null>(null);

  const totalDetections = species.detectionCount;
  const totalPages = Math.ceil(totalDetections / ITEMS_PER_PAGE);

  const filteredRows = useMemo(() => {
    let rows = [...ALL_DETECTION_ROWS];
    if (sensorFilter !== "all")
      rows = rows.filter((r) => r.sensor === sensorFilter);
    if (confidenceFilter === "high")
      rows = rows.filter((r) => r.conf >= 0.9);
    else if (confidenceFilter === "moderate")
      rows = rows.filter((r) => r.conf >= 0.7 && r.conf < 0.9);
    else if (confidenceFilter === "low")
      rows = rows.filter((r) => r.conf < 0.7);

    if (sortOrder === "timestamp-desc")
      rows.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    else if (sortOrder === "timestamp-asc")
      rows.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    else if (sortOrder === "confidence-desc")
      rows.sort((a, b) => b.conf - a.conf);
    else if (sortOrder === "confidence-asc")
      rows.sort((a, b) => a.conf - b.conf);

    return rows;
  }, [sensorFilter, confidenceFilter, sortOrder]);

  const showingStart = (page - 1) * ITEMS_PER_PAGE + 1;
  const showingEnd = Math.min(page * ITEMS_PER_PAGE, totalDetections);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-[880px] max-h-[90vh] flex flex-col bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top Bar ── */}
        <div
          className="px-[20px] py-[14px] flex items-center justify-between shrink-0"
          style={{ borderBottom: "1px solid #474f5f" }}
        >
          <div className="flex items-center gap-[10px]">
            <span
              className="text-[15px] text-[rgba(255,255,255,0.9)]"
              style={{ fontFamily: F.bold }}
            >
              {species.commonName}
            </span>
            <span
              className="text-[12px] italic text-[#778192]"
              style={{ fontFamily: F.regular }}
            >
              {species.scientificName}
            </span>
            <span
              className="inline-flex items-center px-[6px] py-[1px]"
              style={{
                fontFamily: F.bold,
                fontSize: "10px",
                background: `${iucnColor}20`,
                color: iucnColor,
                border: `1px solid ${iucnColor}40`,
              }}
            >
              {IUCN_ABBR[species.iucnStatus] ?? species.iucnStatus}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-[28px] h-[28px] flex items-center justify-center text-[#778192] hover:text-white hover:bg-[#474f5f] transition-colors duration-150 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Filter Row ── */}
        <div
          className="px-[20px] py-[10px] flex items-center gap-[8px] shrink-0"
          style={{ borderBottom: "1px solid #474f5f" }}
        >
          <select
            value={sensorFilter}
            onChange={(e) => { setSensorFilter(e.target.value); setPage(1); }}
            style={{ ...selectStyle, minWidth: "130px" }}
          >
            <option value="all">All Sensors</option>
            <option value="SNR-001">SNR-001</option>
            <option value="SNR-002">SNR-002</option>
            <option value="SNR-003">SNR-003</option>
            <option value="SNR-004">SNR-004</option>
            <option value="SNR-005">SNR-005</option>
          </select>
          <select
            value={confidenceFilter}
            onChange={(e) => { setConfidenceFilter(e.target.value); setPage(1); }}
            style={{ ...selectStyle, minWidth: "180px" }}
          >
            <option value="all">All Confidence Levels</option>
            <option value="high">High ≥90%</option>
            <option value="moderate">Moderate 70–89%</option>
            <option value="low">Low &lt;70%</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{ ...selectStyle, minWidth: "220px" }}
          >
            <option value="timestamp-desc">Sort by: Timestamp (newest)</option>
            <option value="timestamp-asc">Sort by: Timestamp (oldest)</option>
            <option value="confidence-desc">Sort by: Confidence (high)</option>
            <option value="confidence-asc">Sort by: Confidence (low)</option>
          </select>
        </div>

        {/* ── Table ── */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#474f5f]">
                {["#", "Timestamp", "Sensor ID", "Model", "Confidence", "Audio"].map((h) => (
                  <th
                    key={h}
                    className="px-[14px] h-[36px] text-left"
                    style={{
                      fontFamily: F.bold,
                      fontSize: "11px",
                      lineHeight: "16px",
                      color: "#778192",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, idx) => {
                const rowBg = idx % 2 === 0 ? "#2b2f3f" : "#303546";
                const rowNum = (page - 1) * ITEMS_PER_PAGE + idx + 1;
                const isPlaying = playingRowId === row.id;
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-[#3a4050] transition-colors duration-150"
                    style={{ background: rowBg }}
                  >
                    <td className="px-[14px] h-[42px]">
                      <span className="text-[11px] text-[#778192]" style={{ fontFamily: F.regular }}>
                        {rowNum}
                      </span>
                    </td>
                    <td className="px-[14px] h-[42px]">
                      <span className="text-[12px] text-[#b7b9be]" style={{ fontFamily: F.regular }}>
                        {row.timestamp}
                      </span>
                    </td>
                    <td className="px-[14px] h-[42px]">
                      <span className="text-[12px] text-[rgba(255,255,255,0.9)]" style={{ fontFamily: F.bold }}>
                        {row.sensor}
                      </span>
                    </td>
                    <td className="px-[14px] h-[42px]">
                      <span className="text-[11px] text-[#b7b9be]" style={{ fontFamily: F.regular }}>
                        {row.model}
                      </span>
                    </td>
                    <td className="px-[14px] h-[42px]">
                      <span className="inline-flex items-center gap-[5px]">
                        <span
                          className="w-[6px] h-[6px] rounded-full inline-block flex-shrink-0"
                          style={{ background: confDotColor(row.conf) }}
                        />
                        <span
                          className="text-[12px]"
                          style={{ fontFamily: F.bold, color: confDotColor(row.conf) }}
                        >
                          {Math.round(row.conf * 100)}%
                        </span>
                      </span>
                    </td>
                    <td className="px-[14px] h-[42px]">
                      <div className="flex items-center gap-[8px]">
                        <button
                          onClick={() => setPlayingRowId(isPlaying ? null : row.id)}
                          className="w-[24px] h-[24px] rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
                          style={{ background: isPlaying ? "#3b82f6" : "#474f5f", color: "white" }}
                        >
                          {isPlaying ? <Pause size={10} /> : <Play size={10} className="ml-[1px]" />}
                        </button>
                        <div className="w-[80px] h-[4px] bg-[#474f5f] flex-shrink-0">
                          <div
                            className="h-full bg-[#3b82f6] transition-all duration-300"
                            style={{ width: isPlaying ? "45%" : "0%" }}
                          />
                        </div>
                        <span className="text-[10px] text-[#778192] flex-shrink-0" style={{ fontFamily: F.regular }}>
                          {row.dur}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Bar ── */}
        <div
          className="px-[20px] py-[10px] flex items-center justify-between shrink-0"
          style={{ borderTop: "1px solid #474f5f" }}
        >
          <span className="text-[11px] text-[#778192]" style={{ fontFamily: F.regular }}>
            Showing {showingStart}–{showingEnd} of {totalDetections.toLocaleString()} detections
          </span>
          <div className="flex gap-[4px]">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-[30px] w-[30px] flex items-center justify-center border border-[#4a5568] bg-transparent transition-colors duration-150 cursor-pointer"
              style={{ color: page === 1 ? "#474f5f" : "#b7b9be" }}
            >
              <ChevronLeft size={13} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) pageNum = i + 1;
              else if (page <= 3) pageNum = i + 1;
              else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = page - 2 + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className="h-[30px] w-[30px] flex items-center justify-center transition-colors duration-150 cursor-pointer"
                  style={{
                    fontFamily: page === pageNum ? F.bold : F.regular,
                    fontSize: "11px",
                    background: page === pageNum ? "#3b82f6" : "#474f5f",
                    color: page === pageNum ? "white" : "#b7b9be",
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-[30px] w-[30px] flex items-center justify-center border border-[#4a5568] bg-transparent transition-colors duration-150 cursor-pointer"
              style={{ color: page === totalPages ? "#474f5f" : "#b7b9be" }}
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
