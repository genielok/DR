import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
  Search,
  ListFilter,
} from "lucide-react";
import { IUCNStatusText, type Species } from "../../../data/mockData";
import { F, IUCN_COLORS, IUCN_TEXT, IUCN_ABB, STATUS_ORDER } from "../const";
import { SpeciesItem } from "./SpeciesItem";

interface SpeciesListProps {
  species: Species[];
  totalSpecies: number;
  playingAudio: string | null;
  onSetPlayingAudio: (id: string | null) => void;
  onImageClick: (url: string, commonName: string, scientificName: string) => void;
  onOpenRegisters: (species: Species) => void;
}

export interface SpeciesListHandle {
  scrollToStatus: (status: string) => void;
}

export const SpeciesList = forwardRef<SpeciesListHandle, SpeciesListProps>(
  function SpeciesList(
    { species, totalSpecies, playingAudio, onSetPlayingAudio, onImageClick, onOpenRegisters },
    ref,
  ) {
    const [searchQuery, setSearchQuery] = useState("");
    const [iucnFilter, setIucnFilter] = useState<Set<string>>(new Set());
    const [iucnDropdownOpen, setIucnDropdownOpen] = useState(false);
    const iucnDropdownRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const groupRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const [expandedSpecies, setExpandedSpecies] = useState<string | null>(null);
    const [collapsedGroups, setCollapsedGroups] = useState<string[]>(STATUS_ORDER);

    useImperativeHandle(ref, () => ({
      scrollToStatus(status: string) {
        setCollapsedGroups((p) => p.filter((s) => s !== status));
        setTimeout(() => {
          const container = scrollContainerRef.current;
          const el = groupRefs.current[status];
          if (!container || !el) return;
          const containerRect = container.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          container.scrollTo({
            top: container.scrollTop + (elRect.top - containerRect.top),
            behavior: "smooth",
          });
        }, 50);
      },
    }));

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (iucnDropdownRef.current && !iucnDropdownRef.current.contains(e.target as Node))
          setIucnDropdownOpen(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Auto-expand all groups while filtering so results are visible
    useEffect(() => {
      if (searchQuery.trim() || iucnFilter.size > 0) setCollapsedGroups([]);
    }, [searchQuery, iucnFilter]);

    const filteredSpecies = species.filter((s) => {
      const matchesSearch =
        !searchQuery.trim() ||
        s.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIucn =
        iucnFilter.size === 0 || iucnFilter.has(s.iucnStatus);
      return matchesSearch && matchesIucn;
    });

    const groupedSpecies = filteredSpecies.reduce(
      (acc, s) => {
        if (!acc[s.iucnStatus]) acc[s.iucnStatus] = [];
        acc[s.iucnStatus].push(s);
        return acc;
      },
      {} as Record<string, typeof species>,
    );

    return (
      <div className="col-span-8">
        <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] h-full flex flex-col">
          <div className="px-[20px] pt-[12px] pb-[8px] flex flex-col gap-[8px]">
            <div className="flex items-center justify-between">
              <span
                className="text-[16px] leading-[18px] text-[rgba(255,255,255,0.9)] bold"
                style={{ fontFamily: F.bold }}
              >
                Species Registered
              </span>
              <span
                className="text-[12px] px-[6px] py-[2px] bg-[#474f5f] text-[#778192]"
                style={{ fontFamily: F.bold }}
              >
                {(searchQuery || iucnFilter.size > 0)
                  ? `${filteredSpecies.length}/${totalSpecies}`
                  : totalSpecies}
              </span>
            </div>
            {/* Search + IUCN filter row */}
            <div className="flex gap-[6px]">
              <div className="relative flex-1">
                <Search
                  size={12}
                  className="absolute left-[8px] top-1/2 -translate-y-1/2 text-[#778192] pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search species…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-[28px] bg-[#1e2230] border border-[#474f5f] pl-[26px] pr-[8px] text-[14px] text-[rgba(255,255,255,0.9)] placeholder-[#778192] outline-none focus:border-[#778192] transition-colors"
                  style={{ fontFamily: F.regular }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-[6px] top-1/2 -translate-y-1/2 text-[#778192] hover:text-white transition-colors"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
              <div className="relative flex-shrink-0" ref={iucnDropdownRef}>
                {/* Trigger button */}
                <button
                  onClick={() => setIucnDropdownOpen((p) => !p)}
                  className="flex items-center gap-[5px] h-[28px] px-[8px] bg-[#1e2230] border border-[#474f5f] hover:border-[#778192] transition-colors cursor-pointer"
                  style={{
                    fontFamily: F.regular,
                    fontSize: "11px",
                    color: iucnFilter.size === 0 ? "#778192" : "rgba(255,255,255,0.9)",
                  }}
                >
                  <ListFilter
                    size={11}
                    style={{ color: iucnFilter.size > 0 ? "rgba(255,255,255,0.9)" : "#778192", flexShrink: 0 }}
                  />
                  {iucnFilter.size === 0 ? (
                    <span>All IUCN</span>
                  ) : (
                    <div className="flex items-center gap-[3px]">
                      {STATUS_ORDER.filter((s) => iucnFilter.has(s)).map((s) => (
                        <span
                          key={s}
                          className="text-[12px] px-[3px] py-[0px]"
                          style={{ fontFamily: F.bold, background: IUCN_COLORS[s], color: IUCN_TEXT[s] }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-150 ${iucnDropdownOpen ? "rotate-180" : ""}`}
                    style={{ color: "#778192", flexShrink: 0 }}
                  />
                </button>

                {/* Dropdown panel */}
                {iucnDropdownOpen && (
                  <div
                    className="absolute top-full right-0 mt-[4px] z-50 py-[4px]"
                    style={{
                      background: "#1e2230",
                      border: "1px solid #474f5f",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                      minWidth: "160px",
                    }}
                  >
                    {/* Clear all */}
                    {iucnFilter.size > 0 && (
                      <button
                        onClick={() => setIucnFilter(new Set())}
                        className="w-full text-left px-[12px] py-[5px] text-[12px] text-[#778192] hover:text-white transition-colors"
                        style={{ fontFamily: F.regular }}
                      >
                        Clear filter
                      </button>
                    )}
                    {STATUS_ORDER.map((status) => {
                      const checked = iucnFilter.has(status);
                      const color = IUCN_COLORS[status];
                      return (
                        <button
                          key={status}
                          onClick={() => {
                            setIucnFilter((prev) => {
                              const next = new Set(prev);
                              if (next.has(status)) next.delete(status);
                              else next.add(status);
                              return next;
                            });
                          }}
                          className="w-full flex items-center gap-[8px] px-[12px] py-[6px] hover:bg-[#2b2f3f] transition-colors"
                        >
                          <div
                            className="w-[14px] h-[14px] flex-shrink-0 flex items-center justify-center border transition-colors"
                            style={{
                              borderColor: checked ? color : "#474f5f",
                              background: checked ? color : "transparent",
                            }}
                          >
                            {checked && (
                              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <span
                            className="text-[12px] px-[4px] py-[1px] flex-shrink-0"
                            style={{ fontFamily: F.bold, background: color, color: IUCN_TEXT[status] }}
                          >
                            {status}
                          </span>
                          <span
                            className="text-[12px] flex-1 text-left truncate"
                            style={{ fontFamily: F.regular, color: checked ? "rgba(255,255,255,0.9)" : "#a0aab8" }}
                          >
                            {IUCNStatusText[status]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex flex-col gap-[2px] flex-1 min-h-0 overflow-y-auto px-[10px] pb-[10px]"
          >
            {STATUS_ORDER.map((status) => {
              const group = groupedSpecies[status] || [];
              if (!group.length) return null;
              const isCollapsed = collapsedGroups.includes(status);
              const abb = IUCN_ABB[status];
              const color = IUCN_COLORS[status];

              return (
                <div key={status}>
                  <button
                    ref={(el) => { groupRefs.current[status] = el; }}
                    onClick={() =>
                      setCollapsedGroups((p) =>
                        p.includes(status)
                          ? p.filter((s) => s !== status)
                          : [...p, status],
                      )
                    }
                    className="sticky top-0 z-10 w-full flex items-center justify-between px-[12px] h-[40px] transition-colors hover:bg-[#556070] cursor-pointer"
                    style={{
                      background: `${color}18`,
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <div className="flex items-center gap-[10px]">
                      <span
                        className="text-[12px] px-[5px] py-[2px] flex-shrink-0"
                        style={{
                          fontFamily: F.bold,
                          background: color,
                          color: IUCN_TEXT[status],
                        }}
                      >
                        {status}
                      </span>
                      <span
                        className="text-[14px] text-[rgba(255,255,255,0.9)]"
                        style={{ fontFamily: F.bold }}
                      >
                        {IUCNStatusText[status]}
                      </span>
                      <span
                        className="text-[12px] px-[5px] py-[1px] bg-[#474f5f] text-[#bec6d5]"
                        style={{ fontFamily: F.regular }}
                      >
                        {group.length}
                      </span>
                    </div>
                    {isCollapsed ? (
                      <ChevronDown size={13} className="text-[#778192]" />
                    ) : (
                      <ChevronUp size={13} className="text-[#778192]" />
                    )}
                  </button>

                  {!isCollapsed && (
                    <div className="flex flex-col gap-[1px]">
                      {group.map((s) => (
                        <SpeciesItem
                          key={s.id}
                          species={s}
                          color={color}
                          abb={abb}
                          isExpanded={expandedSpecies === s.id}
                          playingAudioKey={playingAudio}
                          onToggleExpand={() =>
                            setExpandedSpecies((p) => p === s.id ? null : s.id)
                          }
                          onSetPlayingAudio={onSetPlayingAudio}
                          onImageClick={(url, commonName, scientificName) =>
                            onImageClick(url, commonName, scientificName)
                          }
                          onOpenRegisters={onOpenRegisters}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);
