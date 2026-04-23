import { useState } from "react";

type PanelMenuProps = {
  onMenuItemClick: (panelName: string) => void;
};

type InitiativeType = "NPI" | "NPI+";

type MenuItem = {
  id: string;
  title: string;
  description: string;
};

const NPI_MENU_ITEMS: MenuItem[] = [
  {
    id: "ecosystem-extent",
    title: "Ecosystem extent",
    description: "Area (absolute and percentage) of loss, gain and net change in extent of natural ecosystems (ha, %)",
  },
  {
    id: "ecosystem-condition",
    title: "Ecosystem condition",
    description: "Area and change by condition class (ha, %)",
  },
  {
    id: "species-extinction-risk",
    title: "Species extinction risk",
    description: "Species extinction risk measurement showing the contributions of the site to global extinction risk.",
  },
  {
    id: "species-populations",
    title: "Species populations",
    description: "Number and proportion of priority species with populations that are 1) declining, 2) slowing in decline, 3) stable, and 4) increasing.",
  },
];

const NPI_PLUS_MENU_ITEMS: MenuItem[] = [
  ...NPI_MENU_ITEMS,
  {
    id: "water-impact",
    title: "Water impact",
    description: "Area (absolute and percentage) of loss, gain of natural water tables, flow volume, rate and condition.",
  },
  {
    id: "human-impact",
    title: "Human impact",
    description: "Human impact positive and negative in relation to wealth, community and standard of living impact",
  },
];

export function PanelMenu({ onMenuItemClick }: PanelMenuProps) {
  const [selectedInitiative, setSelectedInitiative] = useState<InitiativeType>("NPI");
  const [expandedItemId, setExpandedItemId] = useState<string | null>("ecosystem-extent");
  const [reportButtonState, setReportButtonState] = useState<"enabled" | "rollOver" | "onClick">("enabled");

  const menuItems = selectedInitiative === "NPI" ? NPI_MENU_ITEMS : NPI_PLUS_MENU_ITEMS;

  const handleMenuItemClick = (itemId: string) => {
    // Toggle expansion
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
    // Notify parent
    onMenuItemClick(itemId);
  };

  const handleReportClick = (e: React.MouseEvent, initiative: InitiativeType) => {
    e.stopPropagation();
    if (selectedInitiative === initiative) {
      setReportButtonState("onClick");
      console.log(`Report clicked for ${initiative}`);
      // Add your report action here
      setTimeout(() => {
        setReportButtonState("enabled");
      }, 200);
    }
  };

  const expandedItem = menuItems.find((item) => item.id === expandedItemId);

  return (
    <div className="bg-[#2b2f3f] flex flex-col h-full overflow-auto shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] shrink-0 w-[240px]">
      {/* Initiative Selectors */}
      <div className="px-[15px] pt-[26px] pb-[14px] flex flex-col gap-[10px]">
        {/* Nature Positive Initiative */}
        <div
          onClick={() => setSelectedInitiative("NPI")}
          className={`relative w-full transition-all cursor-pointer ${
            selectedInitiative === "NPI" 
              ? "bg-[#778192] h-[85px]" 
              : "bg-[#474f5f] h-[43px]"
          }`}
        >
          <div className="flex flex-col items-center justify-center size-full">
            <div className={`content-stretch flex flex-col items-center justify-center relative size-full ${
              selectedInitiative === "NPI" ? "gap-[10px]" : ""
            }`}>
              <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
                <p className="font-['Hexagon_Akkurat',sans-serif] leading-[20px] text-[14px] text-center text-white w-full">
                  Nature Positive Initiative
                </p>
              </div>
              {selectedInitiative === "NPI" && (
                <ReportButton
                  state={selectedInitiative === "NPI" ? reportButtonState : "enabled"}
                  onClick={(e) => handleReportClick(e, "NPI")}
                  onMouseEnter={() => setReportButtonState("rollOver")}
                  onMouseLeave={() => setReportButtonState("enabled")}
                />
              )}
            </div>
          </div>
        </div>

        {/* Nature Positive Initiative+ */}
        <div
          onClick={() => setSelectedInitiative("NPI+")}
          className={`relative w-full transition-all cursor-pointer ${
            selectedInitiative === "NPI+" 
              ? "bg-[#778192] h-[85px]" 
              : "bg-[#474f5f] h-[43px]"
          }`}
        >
          <div className="flex flex-col items-center justify-center size-full">
            <div className={`content-stretch flex flex-col items-center justify-center relative size-full ${
              selectedInitiative === "NPI+" ? "gap-[10px]" : ""
            }`}>
              <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
                <p className="font-['Hexagon_Akkurat',sans-serif] leading-[20px] text-[14px] text-center text-white w-full">
                  Nature Positive Initiative+
                </p>
              </div>
              {selectedInitiative === "NPI+" && (
                <ReportButton
                  state={selectedInitiative === "NPI+" ? reportButtonState : "enabled"}
                  onClick={(e) => handleReportClick(e, "NPI+")}
                  onMouseEnter={() => setReportButtonState("rollOver")}
                  onMouseLeave={() => setReportButtonState("enabled")}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-[28px] pt-[24px] pb-[24px] flex flex-col gap-[10px]">
        {menuItems.map((item) => (
          <MenuItemComponent
            key={item.id}
            item={item}
            isExpanded={expandedItemId === item.id}
            onClick={() => handleMenuItemClick(item.id)}
          />
        ))}
      </div>

      {/* Description Box - Below all menu items */}
      {expandedItem && (
        <div className="px-[28px] pb-[24px]">
          <div className="border border-[#b8bbc2] border-solid p-[12px]">
            <p className="font-['Hexagon_Akkurat',sans-serif] font-normal leading-[16px] text-[12px] text-white opacity-50">
              {expandedItem.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ReportButton({
  state,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  state: "enabled" | "rollOver" | "onClick";
  onClick: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const isOnClick = state === "onClick";
  const isRollOver = state === "rollOver";

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`h-[29px] relative rounded-[4px] shrink-0 w-[100px] transition-all ${
        isOnClick ? "bg-[#2b2f3f]" : isRollOver ? "bg-[#474f5f]" : ""
      }`}
    >
      <div
        aria-hidden="true"
        className={`absolute border border-solid inset-0 pointer-events-none rounded-[4px] ${
          isOnClick
            ? "border-[rgba(255,255,255,0.4)]"
            : isRollOver
            ? "border-[rgba(255,255,255,0.5)]"
            : "border-white"
        }`}
      />
      <p
        className={`absolute font-['Hexagon_Akkurat',sans-serif] inset-[13.79%_23%_17.24%_23%] leading-[20px] text-[14px] whitespace-nowrap ${
          isOnClick ? "text-[rgba(255,255,255,0.4)]" : "text-white"
        }`}
      >
        REPORT
      </p>
    </button>
  );
}

function MenuItemComponent({
  item,
  isExpanded,
  onClick,
}: {
  item: MenuItem;
  isExpanded: boolean;
  onClick: () => void;
  opacity?: number;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left transition-all hover:opacity-100"
      style={{ opacity: isExpanded ? 1 : 0.5 }}
    >
      <p className={`font-['Inter',sans-serif] font-medium leading-[28px] text-[18px] tracking-[-0.4395px] ${
        isExpanded ? "text-white" : "text-[#f5f7fa]"
      }`}>
        {item.title}
      </p>
    </button>
  );
}