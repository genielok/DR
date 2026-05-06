import { useState, useMemo, useRef, useEffect } from "react";
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

function extractDuration(fileName: string): number {
  const match = fileName.match(/_(\d+(?:\.\d+))_(\d+(?:\.\d+))\.mp3$/);
  if (match) return Math.round(parseFloat(match[2]) - parseFloat(match[1]));
  return 10;
}

function extractBaseName(fileName: string): string {
  return fileName.split("/").pop() ?? fileName;
}

function formatTimestamp(isoDate: string): string {
  return isoDate.slice(0, 16).replace("T", " ");
}

// Generates a short synthetic bird-like tone using Web Audio API
function playMockAudio(durationSec: number, onEnd: () => void): () => void {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  // Warble between two frequencies to mimic a bird call
  osc.type = "sine";
  osc.frequency.setValueAtTime(2800, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(3400, ctx.currentTime + durationSec * 0.3);
  osc.frequency.linearRampToValueAtTime(2600, ctx.currentTime + durationSec * 0.6);
  osc.frequency.linearRampToValueAtTime(3100, ctx.currentTime + durationSec);
  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + durationSec);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + durationSec);
  osc.onended = () => { ctx.close(); onEnd(); };
  return () => { ctx.close(); onEnd(); };
}

const confDotColor = (c: number) =>
  c > 0.7 ? "#10b981" : c > 0.5 ? "#f59e0b" : "#D03A1E";

interface AllRegistersModalProps {
  species: Species;
  iucnColor: string;
  onClose: () => void;
}

export function AllRegistersModal({
  species,
  iucnColor,
  onClose,
}: AllRegistersModalProps) {
  const [page, setPage] = useState(1);
  const [sensorFilter, setSensorFilter] = useState("all");
  const [confidenceFilter, setConfidenceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("confidence-desc");
  const [playingRowId, setPlayingRowId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const stopAudioRef = useRef<(() => void) | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      stopAudioRef.current?.();
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  function handlePlay(rowId: string, dur: number) {
    if (playingRowId === rowId) {
      stopAudioRef.current?.();
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      setPlayingRowId(null);
      setProgress(0);
      return;
    }
    stopAudioRef.current?.();
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setProgress(0);
    setPlayingRowId(rowId);
    const stop = playMockAudio(dur, () => {
      setPlayingRowId(null);
      setProgress(0);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    });
    stopAudioRef.current = stop;
    const startTime = Date.now();
    progressTimerRef.current = setInterval(() => {
      setProgress(Math.min(((Date.now() - startTime) / (dur * 1000)) * 100, 100));
    }, 50);
  }

  const allRows = useMemo(() =>
    species.sensorInfo.map((s, i) => ({
      id: `${s.observationId}-${i}`,
      timestamp: s.date,
      sensor: s.sensorId,
      model: s.model,
      conf: s.confidence,
      dur: extractDuration(s.fileName),
      fileName: extractBaseName(s.fileName),
    })),
    [species.sensorInfo]
  );

  const uniqueSensors = useMemo(() =>
    [...new Set(allRows.map((r) => r.sensor))].sort(),
    [allRows]
  );

  const filteredRows = useMemo(() => {
    let rows = [...allRows];
    if (sensorFilter !== "all")
      rows = rows.filter((r) => r.sensor === sensorFilter);
    if (confidenceFilter === "high")
      rows = rows.filter((r) => r.conf > 0.7);
    else if (confidenceFilter === "moderate")
      rows = rows.filter((r) => r.conf > 0.5 && r.conf <= 0.7);
    else if (confidenceFilter === "low")
      rows = rows.filter((r) => r.conf <= 0.5);

    if (sortOrder === "confidence-desc")
      rows.sort((a, b) => b.conf - a.conf);
    else if (sortOrder === "confidence-asc")
      rows.sort((a, b) => a.conf - b.conf);

    return rows;
  }, [allRows, sensorFilter, confidenceFilter, sortOrder]);

  const totalRegisters = filteredRows.length;
  const totalPages = Math.ceil(totalRegisters / ITEMS_PER_PAGE);

  const showingStart = totalRegisters === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const showingEnd = Math.min(page * ITEMS_PER_PAGE, totalRegisters);

  const pagedRows = filteredRows.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-[1080px] max-h-[90vh] flex flex-col bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)]"
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
            {uniqueSensors.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={confidenceFilter}
            onChange={(e) => { setConfidenceFilter(e.target.value); setPage(1); }}
            style={{ ...selectStyle, minWidth: "180px" }}
          >
            <option value="all">All Confidence Levels</option>
            <option value="high">High &gt;70%</option>
            <option value="moderate">Moderate 50–70%</option>
            <option value="low">Low ≤50%</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{ ...selectStyle, minWidth: "220px" }}
          >
            {/* <option value="timestamp-desc">Sort by: Timestamp (newest)</option> */}
            {/* <option value="timestamp-asc">Sort by: Timestamp (oldest)</option> */}
            <option value="confidence-desc">Sort by: Confidence (high)</option>
            <option value="confidence-asc">Sort by: Confidence (low)</option>
          </select>
        </div>

        {/* ── Table ── */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#474f5f]">
                {["#", "Timestamp", "Sensor ID", "Model", "Confidence", "File Name", "Audio"].map((h) => (
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
              {pagedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-[120px] text-center">
                    <span className="text-[12px] text-[#778192]" style={{ fontFamily: F.regular }}>
                      No data
                    </span>
                  </td>
                </tr>
              ) : pagedRows.map((row, idx) => {
                const rowBg = idx % 2 === 0 ? "#2b2f3f" : "#303546";
                const rowNum = (page - 1) * ITEMS_PER_PAGE + idx + 1;
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
                      <span className="text-[11px] text-[#b7b9be]" style={{ fontFamily: F.regular }}>
                        {formatTimestamp(row.timestamp)}
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
                      <span className="text-[11px] text-[#778192]" style={{ fontFamily: F.regular }}>
                        {row.fileName}
                      </span>
                    </td>
                    <td className="px-[14px] h-[42px]">
                      {(() => {
                        const isPlaying = playingRowId === row.id;
                        const rowProgress = isPlaying ? progress : 0;
                        const durMins = Math.floor(row.dur / 60);
                        const durSecs = row.dur % 60;
                        const durLabel = `${durMins}:${String(durSecs).padStart(2, "0")}`;

                        return (
                          <div className="flex items-center gap-[8px]">
                            <button
                              onClick={() => handlePlay(row.id, row.dur)}
                              className="w-[24px] h-[24px] rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
                              style={{ background: isPlaying ? "#3b82f6" : "#474f5f", color: "white" }}
                            >
                              {isPlaying ? <Pause size={10} /> : <Play size={10} className="ml-[1px]" />}
                            </button>
                            <div className="w-[60px] h-[3px] bg-[#474f5f] flex-shrink-0">
                              <div
                                className="h-full bg-[#3b82f6] transition-all duration-75"
                                style={{ width: `${rowProgress}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-[#778192] flex-shrink-0" style={{ fontFamily: F.regular }}>
                              {durLabel}
                            </span>
                          </div>
                        );
                      })()}
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
            Showing {showingStart}–{showingEnd} of {totalRegisters.toLocaleString()} registers
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
