import { useState, useRef, useEffect } from "react";
import { Download } from "lucide-react";
import clsx from "clsx";
import Report01 from "../../imports/Report01";
import Report02 from "../../imports/Report02";
import Report03 from "../../imports/Report03";
import Report04 from "../../imports/Report04";

const REPORT_PAGES = [
  { id: 1, Component: Report01 },
  { id: 2, Component: Report02 },
  { id: 3, Component: Report03 },
  { id: 4, Component: Report04 },
];

type ReportsPanelProps = {
  className?: string;
  onClose?: () => void;
};

export function ReportsPanel({ className, onClose }: ReportsPanelProps) {
  const [activePage, setActivePage] = useState(1);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Scroll to page when thumbnail is clicked
  const scrollToPage = (pageId: number) => {
    const pageElement = pageRefs.current[pageId];
    if (pageElement && mainScrollRef.current) {
      const offset = pageElement.offsetTop - mainScrollRef.current.offsetTop;
      mainScrollRef.current.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  // Update active page based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!mainScrollRef.current) return;

      const scrollTop = mainScrollRef.current.scrollTop;
      const containerTop = mainScrollRef.current.offsetTop;

      // Find which page is currently in view
      for (let i = REPORT_PAGES.length - 1; i >= 0; i--) {
        const pageElement = pageRefs.current[REPORT_PAGES[i].id];
        if (pageElement) {
          const pageTop = pageElement.offsetTop - containerTop;
          if (scrollTop >= pageTop - 100) {
            setActivePage(REPORT_PAGES[i].id);
            break;
          }
        }
      }
    };

    const scrollContainer = mainScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleDownload = () => {
    console.log("Download report");
    // In a real app, this would trigger a download of the PDF
  };

  return (
    <div className={clsx("bg-[#161921] flex h-full relative", className)}>
      {/* Thumbnail Sidebar */}
      <div className="bg-[#1a1d28] flex flex-col w-[180px] border-r border-[#474F5F] overflow-y-auto shrink-0">
        <div className="p-4">
          <h3 className="font-['Roboto:SemiBold',sans-serif] text-[12px] text-[#8698af] mb-3 uppercase tracking-wide">
            Pages
          </h3>
          <div className="flex flex-col gap-2">
            {REPORT_PAGES.map((page) => (
              <button
                key={page.id}
                onClick={() => scrollToPage(page.id)}
                className={clsx(
                  "relative border-2 transition-all duration-200 rounded overflow-hidden group",
                  activePage === page.id
                    ? "border-[#0891d1] shadow-[0_0_8px_rgba(8,145,209,0.3)]"
                    : "border-transparent hover:border-[#474F5F]"
                )}
              >
                <div className="aspect-[922/1230] bg-[#2b2f3f] relative overflow-hidden">
                  <div className="w-[922px] h-[1230px] scale-[0.175] origin-top-left pointer-events-none">
                    <page.Component />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="absolute bottom-1 right-1 bg-[#1a1d28]/90 px-2 py-0.5 rounded text-[10px] text-white font-['Roboto:Medium',sans-serif]">
                  {page.id}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header with Download Button */}
        <div className="bg-[#2b2f3f] h-[60px] flex items-center justify-between px-6 border-b border-[#474F5F] shrink-0">
          <div>
            <h2 className="font-['Roboto:SemiBold',sans-serif] text-[16px] text-white">
              Mineralogy and trace-element geochemistry
            </h2>
            <p className="font-['Roboto:Regular',sans-serif] text-[12px] text-[#8698af] mt-0.5">
              Águas Claras Mine - Quadrilátero Ferrífero, Brazil
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-[#0891d1] hover:bg-[#0a7bb8] text-white rounded transition-colors duration-200 font-['Roboto:Medium',sans-serif] text-[14px]"
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>

        {/* Scrollable Pages */}
        <div
          ref={mainScrollRef}
          className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0f1116]"
        >
          <div className="flex flex-col items-center py-8 gap-6">
            {REPORT_PAGES.map((page) => (
              <div
                key={page.id}
                ref={(el) => (pageRefs.current[page.id] = el)}
                className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative"
              >
                <page.Component />
              </div>
            ))}
          </div>
        </div>

        {/* Page Counter */}
        <div className="absolute bottom-6 right-6 bg-[#2b2f3f]/95 backdrop-blur-sm px-4 py-2 rounded shadow-lg border border-[#474F5F]">
          <p className="font-['Roboto:Medium',sans-serif] text-[14px] text-white">
            Page {activePage} of {REPORT_PAGES.length}
          </p>
        </div>
      </div>
    </div>
  );
}