import { useState, useEffect } from "react";
import clsx from "clsx";
import { getAuditData, type AuditItem } from "@/api";
import svgPaths from "../../imports/svg-p0qz7rpd5h";


type DownloadButtonProps = {
  onClick?: () => void;
};

function DownloadButton({ onClick }: DownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      className="content-stretch flex gap-[6px] items-center relative shrink-0 hover:opacity-80 transition-opacity"
    >
      <p className="font-['Roboto:Medium',sans-serif] leading-[27px] not-italic relative shrink-0 text-[#0891d1] text-[14px] whitespace-nowrap">
        Download files
      </p>
      <div className="overflow-clip relative shrink-0 size-[34px]">
        <div className="absolute size-[24px] left-[5px] top-[5px]">
          <svg
            className="absolute block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 24 24"
          >
            <g id="download_for_offline">
              <mask
                height="24"
                id="mask0_download"
                maskUnits="userSpaceOnUse"
                style={{ maskType: "alpha" }}
                width="24"
                x="0"
                y="0"
              >
                <rect fill="#D9D9D9" height="24" width="24" />
              </mask>
              <g mask="url(#mask0_download)">
                <path d={svgPaths.p12bd48f0} fill="#0891D1" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}

type ChevronButtonProps = {
  isExpanded: boolean;
  onClick: () => void;
};

function ChevronButton({ isExpanded, onClick }: ChevronButtonProps) {
  return (
    <button
      onClick={onClick}
      className="content-stretch flex items-center justify-center relative shrink-0 size-[34px] hover:bg-white/5 rounded transition-colors"
    >
      <div className="relative shrink-0 size-[24px]">
        <svg
          className="absolute block size-full transition-transform duration-200"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 24 24"
          style={{ transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)" }}
        >
          <g id="keyboard_arrow_down">
            <mask
              height="24"
              id="mask0_chevron"
              maskUnits="userSpaceOnUse"
              style={{ maskType: "alpha" }}
              width="24"
              x="0"
              y="0"
            >
              <rect fill="#D9D9D9" height="24" width="24" />
            </mask>
            <g mask="url(#mask0_chevron)">
              <path d={svgPaths.p2b1b0180} fill="#7B8CA2" />
            </g>
          </g>
        </svg>
      </div>
    </button>
  );
}

type AuditItemRowProps = {
  item: AuditItem;
  isExpanded: boolean;
  onToggle: () => void;
  hasChildren: boolean;
};

function AuditItemRow({
  item,
  isExpanded,
  onToggle,
  hasChildren,
}: AuditItemRowProps) {
  // Calculate left padding based on level: 0px, 25px, 54px
  const leftPaddings = [0, 25, 54];
  const leftPadding = leftPaddings[item.level] || 0;

  return (
    <div
      className={clsx(
        "h-[45px] overflow-clip relative shrink-0 w-full",
        item.level === 1 && "bg-[#19202c]"
      )}
    >
      <div
        className="absolute content-stretch flex justify-between px-[20px] py-[10px] top-0 items-center w-full"
        style={{ paddingLeft: `${20 + leftPadding}px` }}
      >
        <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
          {hasChildren ? (
            <ChevronButton isExpanded={isExpanded} onClick={onToggle} />
          ) : (
            <div className="size-[34px] shrink-0 opacity-0" />
          )}
          <div className="content-stretch flex flex-col font-['Roboto:Medium',sans-serif] gap-[6px] items-start not-italic relative shrink-0 w-[192px]">
            <p className="leading-[16px] relative shrink-0 text-[14px] text-white w-full">
              {item.title}
            </p>
            <p className="leading-[12px] relative shrink-0 text-[#8698af] text-[10px] w-full">
              {item.subtitle}
            </p>
          </div>
        </div>
        <DownloadButton onClick={() => console.log(`Download ${item.id}`)} />
      </div>
    </div>
  );
}

export function AuditSection() {
  const [auditData, setAuditData] = useState<AuditItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    getAuditData().then(setAuditData);
  }, []);

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderItem = (item: AuditItem): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div
        key={item.id}
        className={clsx(
          "content-stretch flex flex-col items-start w-full",
          item.level === 1 && "bg-[#19202c]"
        )}
      >
        <AuditItemRow
          item={item}
          isExpanded={isExpanded}
          onToggle={() => toggleItem(item.id)}
          hasChildren={hasChildren}
        />
        {hasChildren && isExpanded && (
          <div className="w-full">
            {item.children!.map((child) => renderItem(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#2b2f3f] relative w-full shrink-0" data-name="Audit Section">
      <p
        className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[27px] px-[20px] pt-[12px] pb-[8px] text-[14px] text-white"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        AUDIT
      </p>
      <div className="content-stretch flex flex-col items-start w-full pb-[6px] gap-[4px]">
        {auditData.map((item) => renderItem(item))}
      </div>
    </div>
  );
}
