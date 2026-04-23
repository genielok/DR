import { useState, useMemo, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Edit2,
  Save,
  Search,
  ArrowUpDown,
  Play,
  Pause,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { type Campaign, type Species } from "../../../data/mockData";
import { getSpeciesByCampaign } from "@/api";
import { DetectionAudioPlayer } from "./DetectionAudioPlayer";
import { AllDetectionsModal } from "./AllDetectionsModal";

/* ── Design-system tokens ── */
const F = {
  bold: "'Hexagon_Akkurat:bold',sans-serif",
  regular: "'Hexagon_Akkurat:regular',sans-serif",
};

interface ReviewTabProps {
  project: Campaign;
}

const IUCN_COLORS: Record<string, string> = {
  "Least Concern": "#60A896",
  "Near Threatened": "#CCB81E",
  Vulnerable: "#E6901A",
  Endangered: "#D03A1E",
  "Critically Endangered": "#C01A0E",
};

const IUCN_ABBR: Record<string, string> = {
  "Least Concern": "LC",
  "Near Threatened": "NT",
  Vulnerable: "VU",
  Endangered: "EN",
  "Critically Endangered": "CR",
  "Data Deficient": "DD",
};

const IUCN_URLS: Record<string, string> = {
  "Blue-crowned Hanging Parrot":
    "https://www.iucnredlist.org/species/22685223/93058753",
  "Wallace's Hawk-eagle":
    "https://www.iucnredlist.org/species/22696116/93545726",
  "Sunda Scops Owl":
    "https://www.iucnredlist.org/species/22688617/93206654",
  "Bornean Banded Pitta":
    "https://www.iucnredlist.org/species/22698612/130113133",
  "Helmeted Hornbill":
    "https://www.iucnredlist.org/species/22682464/92906848",
  "Storm's Stork":
    "https://www.iucnredlist.org/species/22697702/126152527",
  "Sunda Whistling Thrush":
    "https://www.iucnredlist.org/species/103890675/119592097",
};

const AI_MODELS = [
  {
    name: "BirdNET",
    confidence: 0.74,
    startTime: 3.2,
    endTime: 5.8,
  },
  {
    name: "Perch",
    confidence: 0.82,
    startTime: 3.0,
    endTime: 6.1,
  },
  {
    name: "Custom Model",
    confidence: 0.68,
    startTime: 3.5,
    endTime: 5.9,
  },
];

const IUCN_PRIORITY_ORDER = [
  "Critically Endangered",
  "Endangered",
  "Vulnerable",
  "Near Threatened",
  "Least Concern",
  "Data Deficient",
];

const SAMPLE_DETECTIONS = [
  {
    sensorId: "SNR-001",
    date: "Jan 15",
    time: "14:32",
    confidence: 89,
  },
  {
    sensorId: "SNR-003",
    date: "Jan 16",
    time: "08:15",
    confidence: 92,
  },
  {
    sensorId: "SNR-002",
    date: "Jan 17",
    time: "16:48",
    confidence: 76,
  },
  {
    sensorId: "SNR-001",
    date: "Jan 18",
    time: "11:22",
    confidence: 84,
  },
  {
    sensorId: "SNR-003",
    date: "Jan 19",
    time: "19:05",
    confidence: 68,
  },
];

const getModelAgreement = () => {
  const confidences = AI_MODELS.map((m) => m.confidence * 100);
  const range =
    Math.max(...confidences) - Math.min(...confidences);
  if (range < 15)
    return { color: "#10b981", text: "Models agree" };
  if (range <= 30)
    return { color: "#f59e0b", text: "Some disagreement" };
  return { color: "#D03A1E", text: "Models disagree" };
};

/* ── Flat DS select style ── */
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
  minWidth: "140px",
  cursor: "pointer",
};

export function ReviewTab({ project }: ReviewTabProps) {
  const [species, setSpecies] = useState<Species[]>([]);
  useEffect(() => {
    getSpeciesByCampaign(project.id).then(setSpecies);
  }, [project.id]);

  const [expandedId, setExpandedId] = useState<string | null>(
    null,
  );
  const [iucnFilter, setIucnFilter] = useState<string>("all");
  const [reviewStatusFilter, setReviewStatusFilter] =
    useState<string>("all");
  const [detectionFilter, setDetectionFilter] =
    useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(
    null,
  );
  const [verificationStatus, setVerificationStatus] = useState<
    Record<string, boolean | null>
  >({});
  const [verifiedBy, setVerifiedBy] = useState<
    Record<string, string>
  >({});
  const [updateTime, setUpdateTime] = useState<
    Record<string, string>
  >({});
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(),
  );
  const [sortBy, setSortBy] = useState<
    | "iucn"
    | "confidence"
    | "detections-desc"
    | "detections-asc"
    | "default"
  >("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [playingSampleId, setPlayingSampleId] = useState<
    string | null
  >(null);

  const reviewed = species.filter(
    (s) =>
      verificationStatus[s.id] !== undefined ||
      s.verified !== null,
  ).length;
  const total = species.length;
  const progress = (reviewed / total) * 100;

  const processedSpecies = useMemo(() => {
    let result = [...species];

    if (iucnFilter !== "all")
      result = result.filter(
        (s) => s.iucnStatus === iucnFilter,
      );

    if (reviewStatusFilter !== "all") {
      result = result.filter((s) => {
        const cs =
          verificationStatus[s.id] !== undefined
            ? verificationStatus[s.id]
            : s.verified;
        if (reviewStatusFilter === "pending")
          return cs === null || cs === undefined;
        if (reviewStatusFilter === "confirmed")
          return cs === true;
        if (reviewStatusFilter === "rejected")
          return cs === false;
        return true;
      });
    }

    if (detectionFilter !== "all") {
      result = result.filter((s) => {
        if (detectionFilter === "healthy")
          return s.detectionCount >= 500;
        if (detectionFilter === "moderate")
          return (
            s.detectionCount >= 100 && s.detectionCount <= 499
          );
        if (detectionFilter === "low")
          return (
            s.detectionCount >= 10 && s.detectionCount <= 99
          );
        if (detectionFilter === "verylow")
          return s.detectionCount < 10;
        return true;
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.commonName.toLowerCase().includes(q) ||
          s.scientificName.toLowerCase().includes(q),
      );
    }

    if (sortBy === "iucn")
      result.sort(
        (a, b) =>
          IUCN_PRIORITY_ORDER.indexOf(a.iucnStatus) -
          IUCN_PRIORITY_ORDER.indexOf(b.iucnStatus),
      );
    else if (sortBy === "confidence")
      result.sort((a, b) => a.confidence - b.confidence);
    else if (sortBy === "detections-desc")
      result.sort(
        (a, b) => b.detectionCount - a.detectionCount,
      );
    else if (sortBy === "detections-asc")
      result.sort(
        (a, b) => a.detectionCount - b.detectionCount,
      );

    return result;
  }, [
    iucnFilter,
    reviewStatusFilter,
    detectionFilter,
    searchQuery,
    sortBy,
    verificationStatus,
    species,
  ]);

  const totalPages = Math.ceil(
    processedSpecies.length / itemsPerPage,
  );
  const paginatedSpecies = processedSpecies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const iucnStatuses = Array.from(
    new Set(species.map((s) => s.iucnStatus)),
  );

  const expertNames = [
    "Dr. Sarah Chen",
    "Dr. James Liu",
    "Prof. Maria Garcia",
    "Dr. John Smith",
  ];
  const getRandomExpert = () =>
    expertNames[Math.floor(Math.random() * expertNames.length)];
  const getCurrentTimestamp = () => {
    const now = new Date();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  };

  const handleConfirm = (id: string) => {
    setVerificationStatus({
      ...verificationStatus,
      [id]: true,
    });
    setVerifiedBy({ ...verifiedBy, [id]: getRandomExpert() });
    setUpdateTime({
      ...updateTime,
      [id]: getCurrentTimestamp(),
    });
    setEditingId(null);
    moveToNextPending(id);
  };

  const handleReject = (id: string) => {
    setVerificationStatus({
      ...verificationStatus,
      [id]: false,
    });
    setVerifiedBy({ ...verifiedBy, [id]: getRandomExpert() });
    setUpdateTime({
      ...updateTime,
      [id]: getCurrentTimestamp(),
    });
    setEditingId(null);
    moveToNextPending(id);
  };

  const handleSaveEdit = (id: string) => {
    setUpdateTime({
      ...updateTime,
      [id]: getCurrentTimestamp(),
    });
    setEditingId(null);
    moveToNextPending(id);
  };

  const moveToNextPending = (currentId: string) => {
    const ci = processedSpecies.findIndex(
      (s) => s.id === currentId,
    );
    const next = processedSpecies
      .slice(ci + 1)
      .find(
        (s) =>
          verificationStatus[s.id] === undefined &&
          s.verified === null,
      );
    if (next) {
      setExpandedId(next.id);
      const ni = processedSpecies.indexOf(next);
      const np = Math.ceil((ni + 1) / itemsPerPage);
      if (np !== currentPage) setCurrentPage(np);
    } else {
      setExpandedId(null);
    }
  };

  const handleSelectAll = () => {
    const hc = paginatedSpecies.filter(
      (s) =>
        s.confidence >= 0.9 &&
        verificationStatus[s.id] === undefined &&
        s.verified === null,
    );
    setSelectedIds(new Set(hc.map((s) => s.id)));
  };

  const handleBulkConfirm = () => {
    const ns = { ...verificationStatus };
    selectedIds.forEach((id) => {
      ns[id] = true;
    });
    setVerificationStatus(ns);
    setSelectedIds(new Set());
    setBulkMode(false);
  };

  const toggleSelect = (id: string) => {
    const ns = new Set(selectedIds);
    if (ns.has(id)) ns.delete(id);
    else ns.add(id);
    setSelectedIds(ns);
  };

  const getIucnUrl = (name: string): string =>
    IUCN_URLS[name] || "https://www.iucnredlist.org/search";

  return (
    <div className="p-[20px] flex flex-col gap-[6px]">
      {/* ── Progress Header ── */}
      <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] px-[20px] py-[14px]">
        <div className="flex items-center justify-between mb-[8px]">
          <span
            className="text-[12px] text-[#778192]"
            style={{ fontFamily: F.regular }}
          >
            Review Progress
          </span>
          <span
            className="text-[13px] text-[rgba(255,255,255,0.9)]"
            style={{ fontFamily: F.bold }}
          >
            {reviewed} / {total} reviewed
          </span>
        </div>
        {/* Flat progress bar */}
        <div className="w-full h-[6px] bg-[#474f5f]">
          <div
            className="h-full bg-[#3b82f6] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] px-[16px] py-[12px] flex flex-col gap-[10px]">
        {/* Row 1: Search */}
        <div className="relative max-w-[560px]">
          <Search
            size={13}
            className="absolute left-[10px] top-1/2 -translate-y-1/2 text-[#778192]"
          />
          <input
            type="text"
            placeholder="Search species by common or scientific name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-[34px] pl-[32px] pr-[10px] bg-[#474f5f] text-[rgba(255,255,255,0.9)] placeholder-[#778192] outline-none border-none"
            style={{ fontFamily: F.regular, fontSize: "12px" }}
          />
        </div>

        {/* Row 2: Filters + Sort + Bulk */}
        <div className="flex flex-wrap items-center justify-between gap-[10px]">
          <div className="flex flex-wrap items-center gap-[6px]">
            <span
              className="text-[11px] text-[#778192]"
              style={{ fontFamily: F.bold }}
            >
              Filters:
            </span>
            <select
              value={iucnFilter}
              onChange={(e) => {
                setIucnFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={selectStyle}
            >
              <option value="all">All IUCN Status</option>
              {iucnStatuses.map((s) => (
                <option key={s} value={s}>
                  {IUCN_ABBR[s]} - {s}
                </option>
              ))}
            </select>
            <select
              value={reviewStatusFilter}
              onChange={(e) => {
                setReviewStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={selectStyle}
            >
              <option value="all">All Reviews</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={detectionFilter}
              onChange={(e) => {
                setDetectionFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                ...selectStyle,
                backgroundColor:
                  detectionFilter !== "all"
                    ? "#3b82f6"
                    : "#474f5f",
                color:
                  detectionFilter !== "all"
                    ? "white"
                    : "rgba(255,255,255,0.9)",
                fontFamily:
                  detectionFilter !== "all"
                    ? F.bold
                    : F.regular,
                minWidth: "160px",
              }}
            >
              <option value="all">Registers</option>
              <option value="healthy">Healthy (500+)</option>
              <option value="moderate">
                Moderate (100–499)
              </option>
              <option value="low">Low (10–99)</option>
              <option value="verylow">Very Low (&lt;10)</option>
            </select>
          </div>

          <div className="flex items-center gap-[6px]">
            <span
              className="text-[11px] text-[#778192]"
              style={{ fontFamily: F.bold }}
            >
              Sort:
            </span>
            <ArrowUpDown size={13} className="text-[#778192]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{ ...selectStyle, minWidth: "180px" }}
            >
              <option value="default">Default Order</option>
              <option value="iucn">
                IUCN Priority (High Risk First)
              </option>
              <option value="confidence">
                Confidence (Low First)
              </option>
              <option value="detections-desc">
                Detections (High First)
              </option>
              <option value="detections-asc">
                Detections (Low First)
              </option>
            </select>

            <div className="w-[1px] h-[24px] bg-[#474f5f] mx-[4px]" />

            <button
              onClick={() => setBulkMode(!bulkMode)}
              className="h-[34px] px-[14px] transition-colors duration-150 cursor-pointer inline-flex items-center gap-[6px]"
              style={{
                fontFamily: bulkMode ? F.bold : F.regular,
                fontSize: "12px",
                background: bulkMode
                  ? "#3b82f6"
                  : "transparent",
                color: bulkMode ? "white" : "#b7b9be",
                border: bulkMode ? "none" : "1px solid #4a5568",
              }}
            >
              Bulk Actions
            </button>
          </div>
        </div>
      </div>

      {/* ── Bulk Action Bar ── */}
      {bulkMode && (
        <div className="bg-[#474f5f] px-[16px] py-[10px] flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <span
              className="text-[12px] text-[#778192]"
              style={{ fontFamily: F.regular }}
            >
              {selectedIds.size} selected
            </span>
            <button
              onClick={handleSelectAll}
              className="h-[30px] px-[10px] border border-[#4a5568] bg-transparent text-[#3b82f6] hover:bg-[#404856] transition-colors duration-150 cursor-pointer"
              style={{
                fontFamily: F.regular,
                fontSize: "11px",
              }}
            >
              Select All High Confidence (&gt;90%)
            </button>
          </div>
          <div className="flex gap-[6px]">
            <button
              onClick={handleBulkConfirm}
              disabled={selectedIds.size === 0}
              className="h-[30px] px-[12px] inline-flex items-center gap-[4px] transition-colors duration-150 cursor-pointer"
              style={{
                fontFamily: F.regular,
                fontSize: "11px",
                background:
                  selectedIds.size === 0
                    ? "#474f5f"
                    : "#10b981",
                color: "white",
                opacity: selectedIds.size === 0 ? 0.5 : 1,
              }}
            >
              <Check size={12} /> Bulk Confirm (
              {selectedIds.size})
            </button>
            <button
              onClick={() => {
                setSelectedIds(new Set());
                setBulkMode(false);
              }}
              className="h-[30px] px-[12px] border border-[#4a5568] bg-transparent text-[#b7b9be] hover:bg-[#404856] transition-colors duration-150 cursor-pointer"
              style={{
                fontFamily: F.regular,
                fontSize: "11px",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#474f5f]">
              {bulkMode && (
                <th
                  className="px-[14px] h-[36px] text-left"
                  style={{ width: "40px" }}
                />
              )}
              {[
                "Species",
                "IUCN",
                "Registers",
                "AI Confidence",
                "Review Status",
                "Verified By",
                "Update Time",
                "",
              ].map((h) => (
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
            {paginatedSpecies.map((species, idx) => {
              const isExpanded = expandedId === species.id;
              const currentStatus =
                verificationStatus[species.id] !== undefined
                  ? verificationStatus[species.id]
                  : species.verified;
              const isReviewed =
                currentStatus !== null &&
                currentStatus !== undefined;
              const isEditing = editingId === species.id;
              const isSelected = selectedIds.has(species.id);

              return (
                <SpeciesRow
                  key={species.id}
                  species={species}
                  idx={idx}
                  isExpanded={isExpanded}
                  currentStatus={currentStatus}
                  isReviewed={isReviewed}
                  isEditing={isEditing}
                  isSelected={isSelected}
                  bulkMode={bulkMode}
                  playingSampleId={playingSampleId}
                  onToggleExpand={() =>
                    setExpandedId(
                      isExpanded ? null : species.id,
                    )
                  }
                  onToggleSelect={() =>
                    toggleSelect(species.id)
                  }
                  onConfirm={() => handleConfirm(species.id)}
                  onReject={() => handleReject(species.id)}
                  onSaveEdit={() => handleSaveEdit(species.id)}
                  onStartEditing={() =>
                    setEditingId(species.id)
                  }
                  onCancelEditing={() => setEditingId(null)}
                  onSetVerificationStatus={(val: boolean) =>
                    setVerificationStatus({
                      ...verificationStatus,
                      [species.id]: val,
                    })
                  }
                  onPlaySample={(key: string) => {
                    if (playingSampleId === key)
                      setPlayingSampleId(null);
                    else setPlayingSampleId(key);
                  }}
                  getIucnUrl={getIucnUrl}
                  verifiedByName={verifiedBy[species.id]}
                  updateTimeStr={updateTime[species.id]}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] px-[16px] py-[10px] flex items-center justify-between">
          <span
            className="text-[11px] text-[#778192]"
            style={{ fontFamily: F.regular }}
          >
            Showing {(currentPage - 1) * itemsPerPage + 1} –{" "}
            {Math.min(
              currentPage * itemsPerPage,
              processedSpecies.length,
            )}{" "}
            of {processedSpecies.length} species
          </span>
          <div className="flex gap-[4px]">
            <button
              onClick={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
              disabled={currentPage === 1}
              className="h-[30px] px-[10px] border border-[#4a5568] bg-transparent transition-colors duration-150 cursor-pointer"
              style={{
                fontFamily: F.regular,
                fontSize: "11px",
                color:
                  currentPage === 1 ? "#474f5f" : "#b7b9be",
              }}
            >
              Previous
            </button>
            {Array.from(
              { length: Math.min(5, totalPages) },
              (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2)
                  pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className="h-[30px] w-[30px] flex items-center justify-center transition-colors duration-150 cursor-pointer"
                    style={{
                      fontFamily:
                        currentPage === pageNum
                          ? F.bold
                          : F.regular,
                      fontSize: "11px",
                      background:
                        currentPage === pageNum
                          ? "#3b82f6"
                          : "#474f5f",
                      color:
                        currentPage === pageNum
                          ? "white"
                          : "#b7b9be",
                    }}
                  >
                    {pageNum}
                  </button>
                );
              },
            )}
            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(totalPages, p + 1),
                )
              }
              disabled={currentPage === totalPages}
              className="h-[30px] px-[10px] border border-[#4a5568] bg-transparent transition-colors duration-150 cursor-pointer"
              style={{
                fontFamily: F.regular,
                fontSize: "11px",
                color:
                  currentPage === totalPages
                    ? "#474f5f"
                    : "#b7b9be",
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   Species Row (expanded inline detail)
   ════════════════════════════════════════════ */

function SpeciesRow({
  species,
  idx,
  isExpanded,
  currentStatus,
  isReviewed,
  isEditing,
  isSelected,
  bulkMode,
  playingSampleId,
  onToggleExpand,
  onToggleSelect,
  onConfirm,
  onReject,
  onSaveEdit,
  onStartEditing,
  onCancelEditing,
  onSetVerificationStatus,
  onPlaySample,
  getIucnUrl,
  verifiedByName,
  updateTimeStr,
}: any) {
  const rowBg = idx % 2 === 0 ? "#2b2f3f" : "#303546";
  const iucnColor =
    IUCN_COLORS[
    species.iucnStatus as keyof typeof IUCN_COLORS
    ] || "#778192";
  const confidenceColor =
    species.confidence >= 0.9
      ? "#10b981"
      : species.confidence >= 0.7
        ? "#f59e0b"
        : "#D03A1E";

  const [showDetectionsModal, setShowDetectionsModal] =
    useState(false);

  return (
    <>
      <tr
        className="hover:bg-[#3a4050] transition-colors duration-150"
        style={{ background: rowBg }}
      >
        {/* Checkbox */}
        {bulkMode && (
          <td className="px-[14px] h-[42px]">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              disabled={isReviewed}
              className="w-[14px] h-[14px] cursor-pointer accent-[#3b82f6]"
            />
          </td>
        )}

        {/* Species name */}
        <td className="px-[14px] h-[42px]">
          <div
            className="text-[12px] text-[rgba(255,255,255,0.9)] leading-[18px]"
            style={{ fontFamily: F.bold }}
          >
            {species.commonName}
          </div>
          <div
            className="text-[10px] italic text-[#778192] leading-[14px]"
            style={{ fontFamily: F.regular }}
          >
            {species.scientificName}
          </div>
        </td>

        {/* IUCN badge */}
        <td className="px-[14px] h-[42px]">
          <a
            href={getIucnUrl(species.scientificName)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center px-[6px] py-[2px] hover:opacity-80 transition-opacity"
            style={{
              fontFamily: F.bold,
              fontSize: "10px",
              background: `${iucnColor}20`,
              color: iucnColor,
              border: `1px solid ${iucnColor}40`,
            }}
            title="Click to view on IUCN Red List"
          >
            {
              IUCN_ABBR[
              species.iucnStatus as keyof typeof IUCN_ABBR
              ]
            }
          </a>
        </td>

        {/* Registers */}
        <td className="px-[14px] h-[42px]">
          <span
            className="text-[12px] text-[#b7b9be]"
            style={{ fontFamily: F.regular }}
          >
            {species.detectionCount}
          </span>
        </td>

        {/* AI Confidence */}
        <td className="px-[14px] h-[42px]">
          <span
            className="text-[12px]"
            style={{
              fontFamily: F.bold,
              color: confidenceColor,
            }}
          >
            {Math.round(species.confidence * 100)}%
          </span>
        </td>

        {/* Review Status */}
        <td className="px-[14px] h-[42px]">
          {isReviewed ? (
            <span
              className="inline-flex items-center px-[7px] py-[1px] border border-solid"
              style={{
                fontFamily: F.bold,
                fontSize: "10px",
                backgroundColor: currentStatus
                  ? "rgba(16,185,129,0.12)"
                  : "rgba(208,58,30,0.12)",
                borderColor: currentStatus
                  ? "rgba(16,185,129,0.25)"
                  : "rgba(208,58,30,0.25)",
                color: currentStatus ? "#10b981" : "#D03A1E",
              }}
            >
              {currentStatus ? "Confirmed" : "Rejected"}
            </span>
          ) : (
            <span
              className="inline-flex items-center px-[7px] py-[1px] border border-solid"
              style={{
                fontFamily: F.bold,
                fontSize: "10px",
                backgroundColor: "rgba(245,158,11,0.12)",
                borderColor: "rgba(245,158,11,0.25)",
                color: "#f59e0b",
              }}
            >
              Pending
            </span>
          )}
        </td>

        {/* Verified By */}
        <td className="px-[14px] h-[42px]">
          <span
            className="text-[11px] text-[#778192]"
            style={{ fontFamily: F.regular }}
          >
            {isReviewed && verifiedByName
              ? verifiedByName
              : "-"}
          </span>
        </td>

        {/* Update Time */}
        <td className="px-[14px] h-[42px]">
          <span
            className="text-[10px] text-[#778192]"
            style={{ fontFamily: F.regular }}
          >
            {updateTimeStr || "-"}
          </span>
        </td>

        {/* Expand / Review button */}
        <td className="px-[14px] h-[42px]">
          <button
            onClick={onToggleExpand}
            className="h-[28px] px-[10px] inline-flex items-center gap-[4px] text-[#3b82f6] hover:bg-[#474f5f] transition-colors duration-150 cursor-pointer"
            style={{ fontFamily: F.regular, fontSize: "11px" }}
          >
            {isExpanded ? (
              <>
                <ChevronUp size={12} /> Collapse
              </>
            ) : (
              <>
                <ChevronDown size={12} /> Review
              </>
            )}
          </button>
        </td>
      </tr>

      {/* ── Expanded Detail Row ── */}
      {isExpanded && (
        <tr style={{ background: "#3a4050" }}>
          <td
            colSpan={bulkMode ? 9 : 8}
            className="px-[20px] py-[20px]"
          >
            {/* Detection Summary Bar */}
            <div className="bg-[#474f5f] px-[14px] h-[38px] flex items-center gap-[12px] flex-wrap mb-[16px]">
              <SummaryItem
                label="detections"
                value={String(species.detectionCount)}
              />
              <span className="text-[#778192]">·</span>
              <SummaryItem label="sensors" value="3" />
              <span className="text-[#778192]">·</span>
              <SummaryItem label="days" value="45" />
              <span className="text-[#778192]">·</span>
              <span
                className="text-[11px] text-[#778192]"
                style={{ fontFamily: F.regular }}
              >
                Avg confidence:{" "}
                <span
                  style={{
                    fontFamily: F.bold,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  {Math.round(species.confidence * 100)}%
                </span>
              </span>
              <span className="text-[#778192]">·</span>
              <span className="flex items-center gap-[6px]">
                <span
                  className="w-[6px] h-[6px] rounded-full"
                  style={{
                    backgroundColor: getModelAgreement().color,
                  }}
                />
                <span
                  className="text-[11px] text-[#778192]"
                  style={{ fontFamily: F.regular }}
                >
                  {getModelAgreement().text}
                </span>
              </span>
            </div>

            {/* Two-Column Layout */}
            <div className="flex gap-0 mb-[16px]">
              {/* LEFT: Random Samples (60%) */}
              <div
                style={{
                  width: "60%",
                  borderRight: "1px solid #474f5f",
                  paddingRight: "20px",
                }}
              >
                <div className="mb-[10px]">
                  <div
                    className="text-[13px] text-[rgba(255,255,255,0.9)] mb-[2px]"
                    style={{ fontFamily: F.bold }}
                  >
                    Random Sample
                  </div>
                  <div
                    className="text-[11px] text-[#778192]"
                    style={{ fontFamily: F.regular }}
                  >
                    Showing{" "}
                    {Math.min(5, species.detectionCount)} of{" "}
                    {species.detectionCount} detections
                  </div>
                </div>
                <div className="mb-[12px] max-h-[320px] overflow-y-auto flex flex-col gap-[4px]">
                  {SAMPLE_DETECTIONS.map((sample, sIdx) => {
                    const sampleKey = `${species.id}-${sIdx}`;
                    return (
                      <DetectionAudioPlayer
                        key={sIdx}
                        sampleKey={sampleKey}
                        sensorId={sample.sensorId}
                        date={sample.date}
                        time={sample.time}
                        confidence={sample.confidence}
                        isActive={playingSampleId === sampleKey}
                        onToggle={(key: string) => {
                          onPlaySample(
                            playingSampleId === key
                              ? null
                              : key,
                          );
                        }}
                      />
                    );
                  })}
                </div>
                <button
                  className="w-full h-[34px] border border-[#4a5568] bg-transparent hover:bg-[#474f5f] text-[#b7b9be] hover:text-white transition-colors duration-150 inline-flex items-center justify-center gap-[6px] cursor-pointer"
                  style={{
                    fontFamily: F.regular,
                    fontSize: "12px",
                  }}
                >
                  <RefreshCw size={13} /> Load different samples
                </button>
                {/* View all detections link */}
                <div className="mt-[10px]">
                  <button
                    onClick={() => setShowDetectionsModal(true)}
                    className="bg-transparent border-none text-[#3b82f6] hover:text-[#60a5fa] transition-colors duration-150 cursor-pointer inline-flex items-center gap-[4px]"
                    style={{
                      fontFamily: F.regular,
                      fontSize: "12px",
                    }}
                  >
                    View all{" "}
                    {species.detectionCount.toLocaleString()}{" "}
                    detections →
                  </button>
                </div>
              </div>

              {/* RIGHT: Confidence Distribution (40%) */}
              <div
                style={{ width: "40%", paddingLeft: "20px" }}
              >
                <div
                  className="text-[13px] text-[rgba(255,255,255,0.9)] mb-[14px]"
                  style={{ fontFamily: F.bold }}
                >
                  Confidence Distribution
                </div>

                <div className="flex flex-col gap-[12px]">
                  {[
                    {
                      range: "90–100%",
                      count: 42,
                      pct: 49,
                      color: "#10b981",
                    },
                    {
                      range: "70–89%",
                      count: 31,
                      pct: 36,
                      color: "#f59e0b",
                    },
                    {
                      range: "50–69%",
                      count: 12,
                      pct: 14,
                      color: "#D03A1E",
                    },
                  ].map((band) => (
                    <div key={band.range}>
                      <div className="flex items-center justify-between mb-[4px]">
                        <span
                          className="text-[11px] text-[#778192]"
                          style={{ fontFamily: F.regular }}
                        >
                          {band.range}
                        </span>
                        <span
                          className="text-[11px] text-[#778192]"
                          style={{ fontFamily: F.regular }}
                        >
                          <span
                            style={{
                              fontFamily: F.bold,
                              color: "rgba(255,255,255,0.9)",
                            }}
                          >
                            {band.count}
                          </span>{" "}
                          · {band.pct}%
                        </span>
                      </div>
                      <div className="h-[4px] bg-[#474f5f] w-full">
                        <div
                          className="h-full"
                          style={{
                            backgroundColor: band.color,
                            width: `${band.pct}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-[12px] pt-[10px]"
                  style={{ borderTop: "1px solid #474f5f" }}
                >
                  <span
                    className="text-[10px] text-[#778192]"
                    style={{ fontFamily: F.regular }}
                  >
                    85 total detections analysed
                  </span>
                </div>

                <div
                  className="mt-[14px] pt-[14px]"
                  style={{ borderTop: "1px solid #474f5f" }}
                >
                  <div
                    className="text-[9px] text-[#778192] uppercase tracking-wider mb-[10px]"
                    style={{ fontFamily: F.bold }}
                  >
                    Reference Call
                  </div>
                  <div
                    className="flex items-center gap-[10px] h-[42px] px-[10px] mb-[8px]"
                    style={{
                      borderLeft: "2px solid #3b82f6",
                      background: "rgba(59,130,246,0.08)",
                    }}
                  >
                    <button
                      onClick={() =>
                        onPlaySample(`${species.id}-reference`)
                      }
                      className="w-[26px] h-[26px] rounded-full bg-[#3b82f6] flex items-center justify-center text-white flex-shrink-0 cursor-pointer hover:bg-[#2563eb] transition-colors"
                    >
                      {playingSampleId ===
                        `${species.id}-reference` ? (
                        <Pause size={12} />
                      ) : (
                        <Play size={12} className="ml-[1px]" />
                      )}
                    </button>
                    <span
                      className="text-[11px] text-[#b7b9be] flex-1"
                      style={{ fontFamily: F.regular }}
                    >
                      IUCN Audio Library
                    </span>
                    <span
                      className="text-[10px] px-[6px] py-[1px]"
                      style={{
                        fontFamily: F.bold,
                        background: "rgba(59,130,246,0.15)",
                        color: "#3b82f6",
                      }}
                    >
                      REF
                    </span>
                  </div>
                  <a
                    href={`https://www.iucnredlist.org/search?query=${encodeURIComponent(species.scientificName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#3b82f6] hover:text-[#60a5fa] inline-flex items-center gap-[4px] transition-colors"
                    style={{ fontFamily: F.regular }}
                  >
                    View species profile on IUCN Red List
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>

            {/* Expert Decision Footer */}
            <div
              className="pt-[14px]"
              style={{ borderTop: "1px solid #474f5f" }}
            >
              {!isReviewed ? (
                <>
                  <div className="flex justify-end gap-[8px] mb-[6px]">
                    <button
                      onClick={onConfirm}
                      className="h-[36px] px-[16px] bg-[#3b82f6] hover:bg-[#2563eb] text-white inline-flex items-center gap-[6px] transition-colors duration-150 cursor-pointer"
                      style={{
                        fontFamily: F.regular,
                        fontSize: "12px",
                      }}
                    >
                      <Check size={14} /> Confirm Species
                    </button>
                    <button
                      onClick={onReject}
                      className="h-[36px] px-[16px] inline-flex items-center gap-[6px] transition-colors duration-150 cursor-pointer"
                      style={{
                        fontFamily: F.regular,
                        fontSize: "12px",
                        background: "rgba(208,58,30,0.12)",
                        border: "1px solid rgba(208,58,30,0.3)",
                        color: "#D03A1E",
                      }}
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                  <div className="text-right">
                    <span
                      className="text-[10px] text-[#778192]"
                      style={{ fontFamily: F.regular }}
                    >
                      Decision will be logged with your name and
                      timestamp
                    </span>
                  </div>
                </>
              ) : isEditing ? (
                <div className="flex flex-col gap-[8px]">
                  <div className="flex justify-end gap-[8px]">
                    <button
                      onClick={onSaveEdit}
                      className="h-[36px] px-[16px] bg-[#3b82f6] hover:bg-[#2563eb] text-white inline-flex items-center gap-[6px] transition-colors duration-150 cursor-pointer"
                      style={{
                        fontFamily: F.regular,
                        fontSize: "12px",
                      }}
                    >
                      <Save size={14} /> Save Changes
                    </button>
                    <button
                      onClick={onCancelEditing}
                      className="h-[36px] px-[16px] border border-[#4a5568] bg-transparent text-[#b7b9be] hover:bg-[#404856] transition-colors duration-150 cursor-pointer"
                      style={{
                        fontFamily: F.regular,
                        fontSize: "12px",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="flex justify-end gap-[8px]">
                    <button
                      onClick={() =>
                        onSetVerificationStatus(true)
                      }
                      disabled={currentStatus === true}
                      className="h-[36px] px-[16px] inline-flex items-center gap-[6px] transition-colors duration-150 cursor-pointer"
                      style={{
                        fontFamily: F.regular,
                        fontSize: "12px",
                        background:
                          currentStatus === true
                            ? "#474f5f"
                            : "transparent",
                        border: "1px solid #10b981",
                        color: "#10b981",
                      }}
                    >
                      <Check size={14} />
                      {currentStatus === true
                        ? "Currently Confirmed"
                        : "Change to Confirmed"}
                    </button>
                    <button
                      onClick={() =>
                        onSetVerificationStatus(false)
                      }
                      disabled={currentStatus === false}
                      className="h-[36px] px-[16px] inline-flex items-center gap-[6px] transition-colors duration-150 cursor-pointer"
                      style={{
                        fontFamily: F.regular,
                        fontSize: "12px",
                        background:
                          currentStatus === false
                            ? "#474f5f"
                            : "transparent",
                        border: "1px solid #D03A1E",
                        color: "#D03A1E",
                      }}
                    >
                      <X size={14} />
                      {currentStatus === false
                        ? "Currently Rejected"
                        : "Change to Rejected"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[8px]">
                    <span
                      className="inline-flex items-center px-[7px] py-[1px] border border-solid"
                      style={{
                        fontFamily: F.bold,
                        fontSize: "10px",
                        backgroundColor: currentStatus
                          ? "rgba(16,185,129,0.12)"
                          : "rgba(208,58,30,0.12)",
                        borderColor: currentStatus
                          ? "rgba(16,185,129,0.25)"
                          : "rgba(208,58,30,0.25)",
                        color: currentStatus
                          ? "#10b981"
                          : "#D03A1E",
                      }}
                    >
                      {currentStatus ? "Confirmed" : "Rejected"}
                    </span>
                    <span
                      className="text-[10px] text-[#778192]"
                      style={{ fontFamily: F.regular }}
                    >
                      {currentStatus ? "Confirmed" : "Rejected"}{" "}
                      by {verifiedByName} · {updateTimeStr}
                    </span>
                  </div>
                  <button
                    onClick={onStartEditing}
                    className="h-[28px] px-[10px] inline-flex items-center gap-[4px] text-[#3b82f6] hover:bg-[#474f5f] transition-colors duration-150 cursor-pointer"
                    style={{
                      fontFamily: F.regular,
                      fontSize: "11px",
                    }}
                  >
                    <Edit2 size={12} /> Edit Decision
                  </button>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}

      {/* All Detections Modal */}
      {showDetectionsModal && (
        <tr style={{ display: "contents" }}>
          <td style={{ display: "contents" }}>
            <AllDetectionsModal
              species={species}
              iucnColor={iucnColor}
              onClose={() => setShowDetectionsModal(false)}
            />
          </td>
        </tr>
      )}
    </>
  );
}

/* ── Summary Item (for detection bar) ── */
function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <span
      className="text-[11px] text-[#778192]"
      style={{ fontFamily: F.regular }}
    >
      <span
        style={{
          fontFamily: F.bold,
          color: "rgba(255,255,255,0.9)",
        }}
      >
        {value}
      </span>{" "}
      {label}
    </span>
  );
}

