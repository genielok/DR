import clsx from "clsx";
import svgPaths from "./svg-8fy3jyzq8z";
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

export default function EcosystemExtent() {
  return (
    <div className="relative size-full" data-name="Ecosystem Extent">
      <div className="absolute bg-[#2b2f3f] h-[56px] left-[2px] top-[707px] w-[417px]" data-name="Header" />
      <div className="absolute bg-[#2b2f3f] content-stretch flex flex-col h-[54px] items-start left-0 overflow-clip px-[20px] py-[10px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] top-[8px] w-[420px]" data-name="Card Menu">
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
      <div className="absolute bg-[#2b2f3f] h-[395px] left-0 overflow-clip shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] top-[301px] w-[420px]" data-name="Key Output Card">
        <div className="absolute h-[244px] left-0 top-0 w-[646px]" data-name="Metric Frame 1" />
        <div className="absolute h-[234px] left-[10px] top-[10px] w-[742px]" data-name="Metric Frame 2" />
        <div className="absolute contents left-[10px] top-0" data-name="Metrics Group">
          <div className="absolute contents left-[10px] top-0" data-name="Metric Container 1">
            <div className="absolute h-[86px] left-[10px] shadow-[4px_4px_15px_0px_rgba(0,0,0,0.25)] top-0 w-[400px]" data-name="Gain Container" />
            <div className="absolute content-stretch flex h-[74px] items-start justify-between left-[10px] not-italic pt-[10px] px-[20px] text-[rgba(255,255,255,0.9)] top-px w-[400px]" data-name="Gain info">
              <GainDescription text="Area of loss, gain" text1="Semi-natural and natural sum increase from 2024-2025" additionalClassNames="w-[224px]" />
              <p className="font-['Hexagon_Akkurat:regular',sans-serif] leading-[40px] relative shrink-0 text-[32px] whitespace-nowrap">+451ha</p>
            </div>
          </div>
          <div className="absolute contents left-[10px] top-[100px]" data-name="metric-container">
            <div className="absolute h-[87px] left-[10px] shadow-[4px_4px_15px_0px_rgba(0,0,0,0.25)] top-[100px] w-[400px]" data-name="Gain container" />
            <div className="absolute content-stretch flex h-[62.505px] items-start justify-between left-[10px] not-italic pt-[10px] px-[20px] text-[rgba(255,255,255,0.9)] top-[100.84px] w-[400px]" data-name="Gain info">
              <GainDescription text="Net Change" text1="Semi-natural and natural sum % increase from 2024-2025" additionalClassNames="w-[231px]" />
              <p className="font-['Hexagon_Akkurat:regular',sans-serif] leading-[40px] relative shrink-0 text-[32px] whitespace-nowrap">+5.3%</p>
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
            <p className="absolute font-['Hexagon_Akkurat:regular',sans-serif] leading-[18px] left-[101px] not-italic text-[12px] text-white top-[103px] whitespace-nowrap">86.5%</p>
            <p className="absolute font-['Hexagon_Akkurat:regular',sans-serif] leading-[18px] left-[54px] not-italic text-[12px] text-white top-[37px] whitespace-nowrap">13.5%</p>
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
      <div className="absolute contents left-[172px] top-[724px]">
        <div className="absolute flex flex-col font-['Hexagon_Akkurat:Regular',sans-serif] inset-[94.04%_42.38%_3.37%_41.9%] justify-center leading-[0] not-italic text-[14px] text-center text-shadow-[0px_1px_2px_black] text-white">
          <p className="leading-[20px]">Audit</p>
        </div>
        <div className="absolute border border-[#fcfcfc] border-solid h-[23px] left-[172px] top-[724px] w-[72px]" />
      </div>
      <div className="absolute bg-[#2b2f3f] content-stretch flex flex-col h-[220px] items-start left-0 overflow-clip p-[10px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] top-[72px] w-[420px]" data-name="Card-subMenu">
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="Submenu items">
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="menu-submenu">
            <Wrapper additionalClassNames="bg-[#778192]">
              <div className="flex flex-col font-['Hexagon_Akkurat:regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white w-[433px]">
                <p className="leading-[20px]">Area of loss, gain and net change</p>
              </div>
            </Wrapper>
          </div>
          <div className="bg-[#474f5f] content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="menu-submenu">
            <Wrapper>
              <div className="flex flex-col font-['Hexagon_Akkurat:regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#b7b9be] text-[14px] whitespace-nowrap">
                <p className="leading-[20px]">Area of loss, gain by type</p>
              </div>
            </Wrapper>
          </div>
          <div className="bg-[#474f5f] content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="menu-submenu">
            <Wrapper>
              <div className="flex flex-col font-['Hexagon_Akkurat:regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(183,185,190,0.9)] whitespace-nowrap">
                <p className="leading-[20px]">Publications</p>
              </div>
            </Wrapper>
          </div>
        </div>
      </div>
    </div>
  );
}