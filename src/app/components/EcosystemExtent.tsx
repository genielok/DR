import { useState, useEffect } from "react";
import clsx from "clsx";
import svgPaths from "../../imports/svg-8fy3jyzq8z";
import { ChevronDown, Search, FileText } from "lucide-react";
import type { LayerType } from "./MapViewer";
import { getEcosystemData, getPublications, type EcosystemMetrics, type Publication } from "@/api";
import { AuditSection } from "./AuditSection";

type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return (
    <div className={clsx("relative shrink-0 w-full", additionalClassNames)}>
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[20px] py-[20px] relative w-full">{children}</div>
      </div>
    </div>
  );
}

type GainDescriptionProps = {
  text: string;
  text1: string;
  additionalClassNames?: string;
};

function GainDescription({ text, text1, additionalClassNames = "" }: GainDescriptionProps) {
  return (
    <div className={clsx("content-stretch flex flex-col gap-[4px] items-start relative shrink-0", additionalClassNames)}>
      <p className="font-['Hexagon_Akkurat:bold',sans-serif] h-[27px] leading-[27px] relative shrink-0 text-[18px] w-[143px]">{text}</p>
      <p className="font-['Hexagon_Akkurat:regular',sans-serif] h-[27px] leading-[18px] relative shrink-0 text-[12px] w-full">{text1}</p>
    </div>
  );
}

const LOSS_GAIN_BY_TYPE_SUBMENU = [
  { id: "water", label: "Water", layer: "water" as LayerType },
  { id: "forest", label: "Forest", layer: "forest" as LayerType },
  { id: "forest_gain", label: "Forest Gain", layer: "forest_gain" as LayerType },
  { id: "sand", label: "Sand", layer: "sand" as LayerType },
  { id: "sand_gain", label: "Sand Gain", layer: "sand_gain" as LayerType },
  { id: "shrub", label: "Shrub", layer: "shrub" as LayerType },
  { id: "shrub_gain", label: "Shrub Gain", layer: "shrub_gain" as LayerType },
];



type EcosystemExtentProps = {
  onLayerChange?: (layer: LayerType) => void;
  onPublicationSelect?: (publicationId: string | null) => void;
};

export function EcosystemExtent({ onLayerChange, onPublicationSelect }: EcosystemExtentProps) {
  const [ecosystemData, setEcosystemData] = useState<Record<string, EcosystemMetrics>>({});
  const [publications, setPublications] = useState<Publication[]>([]);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const [publicationsOpen, setPublicationsOpen] = useState(false);
  const [activePublication, setActivePublication] = useState<string | null>(null);
  const [pubSearch, setPubSearch] = useState("");
  // Track which top-level item is active ("net-change" or a sub-item id)
  const [activeTopLevel, setActiveTopLevel] = useState<string>("net-change");

  useEffect(() => {
    getEcosystemData().then(setEcosystemData);
    getPublications().then(setPublications);
  }, []);

  const filteredPublications = publications.filter((pub) =>
    pub.title.toLowerCase().includes(pubSearch.toLowerCase())
  );

  const handleNetChangeClick = () => {
    setActiveTopLevel("net-change");
    setActiveSubItem(null);
    onLayerChange?.("extent_loss&Gain");
  };

  const handleSubItemClick = (item: (typeof LOSS_GAIN_BY_TYPE_SUBMENU)[0]) => {
    const nextId = activeSubItem === item.id ? null : item.id;
    setActiveSubItem(nextId);
    setActiveTopLevel(nextId ? item.id : "net-change");
    onLayerChange?.(nextId ? item.layer : "extent_loss&Gain");
  };
  if (!ecosystemData?.[activeTopLevel]) {
    return
  }

  return (
    <div className="flex flex-col gap-y-[10px] size-full" data-name="Ecosystem Extent">
      {/* Card Menu */}
      <div className="bg-[#2b2f3f] content-stretch flex flex-col h-[54px] items-start overflow-clip px-[20px] py-[10px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Card Menu">
        <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Menu Items">
          <div className="h-[37px] relative shrink-0" data-name="Headers">
            <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex h-full items-center p-[5px] relative">
                <p className="font-['Hexagon_Akkurat:bold',sans-serif] h-full leading-[27px] not-italic relative shrink-0 text-[18px] text-[rgba(255,255,255,0.9)] whitespace-nowrap">Ecosystem Extent</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card-subMenu */}
      <div
        className="bg-[#2b2f3f] content-stretch flex flex-col items-start overflow-clip p-[10px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] shrink-0 w-full transition-all duration-300"
        data-name="Card-subMenu"
      >
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Submenu items">
          {/* Area of loss, gain and net change */}
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="menu-submenu">
            <button
              className={clsx(
                "w-full text-left px-[20px] py-[10px] transition-colors duration-200",
                activeTopLevel === "net-change" ? "bg-[#778192]" : "bg-[#474f5f] hover:bg-[#556070]"
              )}
              onClick={handleNetChangeClick}
            >
              <span className="font-['Hexagon_Akkurat:regular',sans-serif] text-[14px] text-white leading-[20px]">
                Area of loss, gain and net change
              </span>
            </button>
          </div>

          {/* Area of loss, gain by type — accordion trigger */}
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="menu-submenu">
            <button
              className="bg-[#474f5f] w-full text-left flex items-center justify-between px-[20px] py-[10px] hover:bg-[#556070] transition-colors duration-200 group"
              onClick={() => setAccordionOpen(!accordionOpen)}
            >
              <span className="font-['Hexagon_Akkurat:regular',sans-serif] text-[14px] text-[#b7b9be] group-hover:text-white transition-colors duration-200 leading-[20px]">
                Area of loss, gain by type
              </span>
              <ChevronDown
                size={14}
                className={clsx(
                  "text-[#b7b9be] group-hover:text-white transition-all duration-300 flex-shrink-0",
                  accordionOpen ? "rotate-180" : "rotate-0"
                )}
              />
            </button>

            {/* Accordion submenu */}
            <div
              className={clsx(
                "w-full overflow-hidden transition-all duration-300 ease-in-out",
                accordionOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="flex flex-col gap-[2px] pt-[2px]">
                {LOSS_GAIN_BY_TYPE_SUBMENU.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSubItemClick(item)}
                    className={clsx(
                      "w-full text-left px-[32px] py-[8px] font-['Hexagon_Akkurat:regular',sans-serif] text-[13px] leading-[20px] transition-colors duration-150",
                      activeSubItem === item.id
                        ? "bg-[#778192] text-white"
                        : "bg-[#3a4050] text-[#b7b9be] hover:bg-[#4a5264] hover:text-white"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Publications — accordion trigger */}
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="menu-submenu">
            <button
              className="bg-[#474f5f] w-full text-left flex items-center justify-between px-[20px] py-[10px] hover:bg-[#556070] transition-colors duration-200 group"
              onClick={() => setPublicationsOpen(!publicationsOpen)}
            >
              <span className="font-['Hexagon_Akkurat:regular',sans-serif] text-[14px] text-[#b7b9be] group-hover:text-white transition-colors duration-200 leading-[20px]">
                Publications
              </span>
              <ChevronDown
                size={14}
                className={clsx(
                  "text-[#b7b9be] group-hover:text-white transition-all duration-300 flex-shrink-0",
                  publicationsOpen ? "rotate-180" : "rotate-0"
                )}
              />
            </button>

            {/* Publications accordion panel */}
            <div
              className={clsx(
                "w-full overflow-hidden transition-all duration-300 ease-in-out",
                publicationsOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              {/* Search bar */}
              <div className="bg-[#3a4050] px-[12px] py-[8px] flex items-center gap-[8px] border-b border-[#2b2f3f]">
                <Search size={13} className="text-[#778192] flex-shrink-0" />
                <input
                  type="text"
                  value={pubSearch}
                  onChange={(e) => setPubSearch(e.target.value)}
                  placeholder="Search publications..."
                  className="bg-transparent w-full font-['Hexagon_Akkurat:regular',sans-serif] text-[12px] text-[#b7b9be] placeholder-[#5a6070] outline-none leading-[20px]"
                />
                {pubSearch && (
                  <button
                    onClick={() => setPubSearch("")}
                    className="text-[#778192] hover:text-white transition-colors duration-150 flex-shrink-0 text-[10px]"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Publication list */}
              <div className="flex flex-col gap-[2px] pt-[2px] max-h-[380px] overflow-y-auto scrollbar-thin">
                {filteredPublications.length === 0 ? (
                  <div className="bg-[#3a4050] px-[20px] py-[10px] text-[#778192] font-['Hexagon_Akkurat:regular',sans-serif] text-[12px] leading-[18px]">
                    No publications found.
                  </div>
                ) : (
                  filteredPublications.map((pub) => (
                    <button
                      key={pub.id}
                      onClick={() => {
                        const nextPub = activePublication === pub.id ? null : pub.id;
                        setActivePublication(nextPub);
                        // If clicking on pub-9, notify parent to show reports panel
                        if (pub.id === "pub-9" && nextPub === pub.id) {
                          onPublicationSelect?.(pub.id);
                        } else if (nextPub === null) {
                          onPublicationSelect?.(null);
                        }
                      }}
                      className={clsx(
                        "w-full text-left px-[16px] py-[9px] flex items-start gap-[8px] transition-colors duration-150",
                        activePublication === pub.id
                          ? "bg-[#778192]"
                          : "bg-[#3a4050] hover:bg-[#4a5264]"
                      )}
                    >
                      <FileText
                        size={12}
                        className={clsx(
                          "flex-shrink-0 mt-[3px]",
                          activePublication === pub.id ? "text-white" : "text-[#778192]"
                        )}
                      />
                      <span
                        className={clsx(
                          "font-['Hexagon_Akkurat:regular',sans-serif] text-[12px] leading-[18px] text-left",
                          activePublication === pub.id ? "text-white" : "text-[#b7b9be]"
                        )}
                      >
                        {pub.title}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Output Card */}
      <div className="bg-[#2b2f3f] relative h-[395px] overflow-clip shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Key Output Card">
        <div className="absolute h-[244px] left-0 top-0 w-[646px]" data-name="Metric Frame 1" />
        <div className="absolute h-[234px] left-[10px] top-[10px] w-[742px]" data-name="Metric Frame 2" />
        <div className="absolute contents left-[10px] top-0" data-name="Metrics Group">
          <div className="absolute contents left-[10px] top-0" data-name="Metric Container 1">
            <div className="absolute h-[86px] left-[10px] shadow-[4px_4px_15px_0px_rgba(0,0,0,0.25)] top-0 w-[400px]" data-name="Gain Container" />
            <div className="absolute content-stretch flex h-[74px] items-start justify-between left-[10px] not-italic pt-[10px] px-[20px] text-[rgba(255,255,255,0.9)] top-px w-[400px]" data-name="Gain info">
              <GainDescription text="Area of loss, gain" text1="Semi-natural and natural sum increase from 2024-2025" additionalClassNames="w-[224px]" />
              <p className="font-['Hexagon_Akkurat:regular',sans-serif] leading-[40px] relative shrink-0 text-[32px] whitespace-nowrap">{ecosystemData[activeTopLevel]?.gain ?? "—"}</p>
            </div>
          </div>
          <div className="absolute contents left-[10px] top-[100px]" data-name="metric-container">
            <div className="absolute h-[87px] left-[10px] shadow-[4px_4px_15px_0px_rgba(0,0,0,0.25)] top-[100px] w-[400px]" data-name="Gain container" />
            <div className="absolute content-stretch flex h-[62.505px] items-start justify-between left-[10px] not-italic pt-[10px] px-[20px] text-[rgba(255,255,255,0.9)] top-[100.84px] w-[400px]" data-name="Gain info">
              <GainDescription text="Net Change" text1="Semi-natural and natural sum % increase from 2024-2025" additionalClassNames="w-[231px]" />
              <p className="font-['Hexagon_Akkurat:regular',sans-serif] leading-[40px] relative shrink-0 text-[32px] whitespace-nowrap">{ecosystemData[activeTopLevel]?.netChange ?? "—"}</p>
            </div>
          </div>
        </div>
        <div className="absolute h-[200px] left-[10px] overflow-clip top-[206px] w-[396px]" data-name="Chart container">
          <div className="absolute contents left-[23px] top-[10px]" data-name="pie_chart">
            <div className="absolute left-[23px] size-[150px] top-[10px]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 150 150">
                <circle cx="75" cy="75" fill="var(--fill-0, #6FBF81)" id="Ellipse 89" r="75" />
              </svg>
            </div>
            <div className="absolute left-[23px] size-[150px] top-[10px]">
              <div className="absolute bottom-1/2 left-[7.38%] right-1/2 top-[0.49%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 63.9251 74.2723">
                  <path d={svgPaths.p1c0d2800} fill="var(--fill-0, #E92F2E)" id="Ellipse 87" />
                </svg>
              </div>
            </div>
            <p className="absolute font-['Hexagon_Akkurat:regular',sans-serif] leading-[18px] left-[101px] not-italic text-[12px] text-white top-[103px] whitespace-nowrap">{ecosystemData[activeTopLevel]?.naturalPercent ?? "—"}%</p>
            <p className="absolute font-['Hexagon_Akkurat:regular',sans-serif] leading-[18px] left-[54px] not-italic text-[12px] text-white top-[37px] whitespace-nowrap">{ecosystemData[activeTopLevel]?.nonNaturalPercent ?? "—"}%</p>
          </div>
          <div className="absolute contents left-[213px] top-[122px]">
            <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[213px] top-[123px] w-[9px]">
              <div className="bg-[#6fbf81] h-[9px] shrink-0 w-full" />
              <div className="bg-[#e92f2e] h-[9px] shrink-0 w-full" />
            </div>
            <div className="absolute content-stretch flex flex-col font-['Roboto:Regular',sans-serif] gap-[10px] items-start leading-[14px] left-[235px] not-italic text-[14px] text-white top-[122px] w-[79px]">
              <p className="relative shrink-0 w-full">Natural</p>
              <p className="relative shrink-0 w-full">Non-natural</p>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Section */}
      <AuditSection />
    </div>
  );
}