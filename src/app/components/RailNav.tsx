import clsx from "clsx";
import svgPaths from "../../imports/svg-7vt33vcn5p";
import svgPathsMenu from "../../imports/svg-tlbsreuf9b";
import svgPathsInfo from "../../imports/svg-r9ycmzvnwb";
import imgC982Db932D21Fec3B4F807Dd1C44Dff91 from "@/assets/nav-logo.png";
import { En } from "./En";

type RailNavProps = {
  onTogglePanelMenu: () => void;
  onTogglePanelInfo: () => void;
  showPanelMenu: boolean;
  showPanelInfo: boolean;
};

export function RailNav({ onTogglePanelMenu, onTogglePanelInfo, showPanelMenu, showPanelInfo }: RailNavProps) {
  return (
    <div className="bg-[#2b2f3f] flex flex-col h-full items-center justify-between px-[12px] py-[24px] relative shrink-0 w-[72px]">
      <div className="content-stretch flex flex-col items-center" data-name="Top content">
        {/* Branding */}
        <div className="content-stretch flex flex-col gap-[3px] items-center pb-[32px]" data-name="Branding">
          <div className="content-stretch flex flex-col h-[70px] items-center justify-between overflow-clip w-[56px]" data-name="logo">
            <div className="h-[40px] relative w-[31px]" data-name="logo-image">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img alt="Logo" className="absolute h-[100.4%] left-0 max-w-none top-[-0.2%] w-[192.31%]" src={imgC982Db932D21Fec3B4F807Dd1C44Dff91} />
              </div>
            </div>
            <div className="relative w-[56px]">
              <div className="flex flex-row items-center justify-center size-full">
                <div className="content-stretch flex items-center justify-center relative w-full">
                  <div className="flex flex-[1_0_0] flex-col font-['Hexagon_Akkurat:regular',sans-serif] justify-center leading-[0] not-italic text-[#f5f7fa] text-[16px] text-center">
                    <p className="leading-[24px]">Vale</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="content-stretch flex flex-col gap-[10px] items-center justify-center" data-name="Menu items">
          {/* Home button */}
          <NavButton active={false}>
            <div className="absolute inset-[15.02%_18.75%_14.58%_18.75%]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 16.8943">
                <path d={svgPaths.p222a2d00} fill="var(--fill-0, #B4BAC4)" />
              </svg>
            </div>
          </NavButton>

          {/* Divider */}
          <div className="h-px relative shrink-0 w-full">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56 1">
              <path clipRule="evenodd" d="M56 1H0V0H56V1Z" fill="#474F5F" fillRule="evenodd" />
            </svg>
          </div>

          {/* Panel Menu Toggle */}
          <NavButton active={showPanelMenu} onClick={onTogglePanelMenu}>
            <div className="absolute inset-[14.58%]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.0312 17.0312">
                <path d={svgPathsMenu.p3c3a8600} fill={showPanelMenu ? "#F5F7FA" : "var(--fill-0, #B4BAC4)"} />
              </svg>
            </div>
          </NavButton>

          {/* Panel Info Toggle */}
          <NavButton active={showPanelInfo} onClick={onTogglePanelInfo}>
            <div className="absolute inset-[14.58%]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.0312 17.0312">
                <path d={svgPathsInfo.p46e6200} fill={showPanelInfo ? "#F5F7FA" : "var(--fill-0, #B4BAC4)"} />
              </svg>
            </div>
          </NavButton>

          {/* Additional button */}
          <NavButton active={false}>
            <div className="absolute inset-[10.42%]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
                <path d={svgPaths.p23e72630} fill="var(--fill-0, #B4BAC4)" />
              </svg>
            </div>
          </NavButton>
        </div>
      </div>

      {/* Bottom content */}
      <div className="content-stretch flex flex-col gap-[24px] items-center" data-name="Bottom content">
        {/* Settings button */}
        <NavButton active={false}>
          <div className="absolute inset-[10.42%_10.85%]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.792 19">
              <path d={svgPaths.p11ef0160} fill="var(--fill-0, #B4BAC4)" />
            </svg>
          </div>
        </NavButton>

        {/* Language selector */}
        <En className="overflow-clip relative shrink-0 size-[24px]" />

        {/* Avatar */}
        <div className="bg-[#b4bac4] max-h-[32px] max-w-[32px] min-h-[32px] min-w-[32px] relative rounded-[999px] shrink-0 size-[32px]">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex items-center justify-center relative rounded-[999px] shrink-0 size-[32px]">
              <div className="flex flex-[1_0_0] flex-col font-['Hexagon_Akkurat:regular',sans-serif] justify-center not-italic text-[#121623] text-[14px] text-center">
                <p className="leading-[19px]">AK</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right divider */}
      <div className="absolute bottom-0 right-0 top-0 w-px">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 824">
          <path clipRule="evenodd" d="M1 824H0V0H1V824Z" fill="var(--fill-0, #474F5F)" fillRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

type NavButtonProps = {
  active: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

function NavButton({ active, onClick, children }: NavButtonProps) {
  return (
    <div className="relative shrink-0 w-[56px]">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center relative w-full">
          <div
            className={clsx(
              "content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 w-full cursor-pointer transition-colors",
              active ? "bg-[#3d4252]" : "bg-[#2b2f3f] hover:bg-[#33374a]"
            )}
            onClick={onClick}
          >
            <div className="content-stretch flex flex-col h-[56px] items-center justify-center py-[8px] relative rounded-[8px] shrink-0 w-full">
              <div className="overflow-clip relative shrink-0 size-[24px]">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}