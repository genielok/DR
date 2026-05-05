import { memo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { type Species } from "../../../data/mockData";
import { DetectionAudioPlayer } from "./DetectionAudioPlayer";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { F } from "../const";

export const SpeciesItem = memo(
  ({
    species,
    color,
    isExpanded,
    playingAudioKey,
    onToggleExpand,
    onSetPlayingAudio,
    onImageClick,
    onOpenDetections,
  }: {
    species: Species;
    color: string;
    abb: string;
    isExpanded: boolean;
    playingAudioKey: string | null;
    onToggleExpand: () => void;
    onSetPlayingAudio: (id: string | null) => void;
    onImageClick: (
      url: string,
      commonName: string,
      scientificName: string,
    ) => void;
    onOpenDetections: (species: Species) => void;
  }) => {
    const [imgLoaded, setImgLoaded] = useState(false);

    return (
      <div className="bg-[#3a4050]">
        <div
          className="flex items-center gap-[10px] px-[12px] h-[54px] hover:bg-[#474f5f] cursor-pointer transition-colors duration-150"
          onClick={onToggleExpand}
        >
          <div
            className="w-[2px] h-[28px] flex-shrink-0"
            style={{ background: color }}
          />
          <div className="flex-1 min-w-0">
            <div
              className="text-[15px] leading-[21px] truncate"
              style={{ fontFamily: species.commonName ? F.bold : F.regular, color: species.commonName ? "white" : "#778192", fontStyle: species.commonName ? "normal" : "italic" }}
            >
              {species.commonName || "Common name unknown"}
            </div>
            <div className="flex items-center gap-[5px] min-w-0">
              <div
                className="text-[12px] leading-[16px] italic text-[#a0aab8] truncate"
                style={{ fontFamily: F.regular }}
              >
                {species.scientificName}
              </div>
              <a
                href={`https://www.iucnredlist.org/search?query=${encodeURIComponent(species.scientificName)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-shrink-0 flex items-center gap-[2px] text-[10px] text-[#778192] hover:text-white transition-colors"
                style={{ fontFamily: F.regular }}
              >
                <ExternalLink size={9} />
                <span>IUCN</span>
              </a>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp
              size={13}
              className="text-[#a0aab8] flex-shrink-0"
            />
          ) : (
            <ChevronDown
              size={13}
              className="text-[#a0aab8] flex-shrink-0"
            />
          )}
        </div>

        {isExpanded && (
          <div className="flex bg-[#252936] min-h-[210px]">
            {/* Left: image (100×200) */}
            <button
              className="group relative w-[130px] self-stretch flex-shrink-0 overflow-hidden cursor-zoom-in"
              onClick={(e) => {
                e.stopPropagation();
                onImageClick(
                  species.imageUrl,
                  species.commonName,
                  species.scientificName,
                );
              }}
            >
              <div className="absolute inset-0 bg-[#1a1d28]" />
              {!imgLoaded && (
                <div className="absolute inset-0 bg-[#2a2f3f] animate-pulse" />
              )}
              <img
                src={species.imageUrl}
                alt={species.commonName}
                loading="lazy"
                decoding="async"
                onLoad={() => setImgLoaded(true)}
                className="absolute inset-0 w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
                style={{ opacity: imgLoaded ? 1 : 0 }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-200">
                <svg
                  className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.5" y1="16.5" x2="22" y2="22" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
            </button>

            {/* Right: metadata + audio + IUCN */}
            <div className="flex-1 flex flex-col px-[12px] py-[10px] gap-[6px] min-w-0 overflow-hidden">
              {/* 2×2 meta grid */}
              <div className="grid grid-cols-2 gap-x-[12px] gap-y-[6px]">
                <div>
                  <div
                    className="text-[10px] text-[#778192] uppercase tracking-wider mb-[2px]"
                    style={{ fontFamily: F.bold }}
                  >
                    Sensor
                  </div>
                  <div
                    className="text-[12px] text-[rgba(255,255,255,0.9)] truncate"
                    style={{ fontFamily: F.bold }}
                  >
                    {species.sensorInfo.length > 0
                      ? [...new Set(species.sensorInfo.map((s) => s.sensorId))].join(" · ")
                      : "2MM07194"}
                  </div>
                </div>
                <div>
                  <div
                    className="text-[10px] text-[#778192] uppercase tracking-wider mb-[2px]"
                    style={{ fontFamily: F.bold }}
                  >
                    Date Range
                  </div>
                  <div
                    className="text-[12px] text-[rgba(255,255,255,0.9)]"
                    style={{ fontFamily: F.bold }}
                  >
                    {(() => {
                      if (species.sensorInfo.length === 0) return "31 Mar – 31 Apr 2025";
                      const dates = species.sensorInfo.map((s) => s.date).sort();
                      const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                      const first = fmt(dates[0]);
                      const last = fmt(dates[dates.length - 1]);
                      return first === last ? first : `${first} – ${last}`;
                    })()}
                  </div>
                </div>
                <div>
                  <div
                    className="text-[10px] text-[#778192] uppercase tracking-wider mb-[2px]"
                    style={{ fontFamily: F.bold }}
                  >
                    Registers
                  </div>
                  <div className="flex items-center gap-[5px]">
                    <span
                      className="text-[12px] text-[rgba(255,255,255,0.9)]"
                      style={{ fontFamily: F.bold }}
                    >
                      {(() => {
                        const total = species.detectionInfo
                          ? species.detectionInfo.BirdNET + species.detectionInfo.Perch + species.detectionInfo.CustomModel
                          : 0;
                        return total > 0 ? `${total} detections` : "—";
                      })()}
                    </span>
                  </div>
                </div>
                <div>
                  <div
                    className="text-[10px] text-[#778192] uppercase tracking-wider mb-[3px]"
                    style={{ fontFamily: F.bold }}
                  >
                    Max AI Confidence
                  </div>
                  {species.sensorInfo.length > 0
                    ? <ConfidenceBadge confidence={Math.max(...species.sensorInfo.map((s) => s.confidence))} />
                    : <span className="text-[12px] text-[#778192]">—</span>
                  }
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#474f5f]" />

              {/* Audio Sample */}
              <div>
                <div
                  className="text-[9px] text-[#778192] uppercase tracking-wider mb-[4px]"
                  style={{ fontFamily: F.bold }}
                >
                  Audio Sample
                </div>
                <DetectionAudioPlayer
                  sampleKey={species.id}
                  sensorId="SNR-001"
                  date="Jan 15"
                  time="14:32"
                  isActive={playingAudioKey === species.id}
                  onToggle={(key) => {
                    onSetPlayingAudio(
                      playingAudioKey === key ? null : key,
                    );
                  }}
                />
              </div>

              {/* View All Detections */}
              <div className="border-t border-[#474f5f] pt-[8px]">
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenDetections(species); }}
                  className="w-full h-[30px] flex items-center justify-center gap-[6px] bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors duration-150 cursor-pointer"
                >
                  <span style={{ fontFamily: F.regular, fontSize: "11px" }}>View All Detections</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

SpeciesItem.displayName = "SpeciesItem";
