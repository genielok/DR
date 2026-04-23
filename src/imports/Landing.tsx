import clsx from "clsx";
import svgPaths from "./svg-7vt33vcn5p";
import imgC982Db932D21Fec3B4F807Dd1C44Dff91 from "@/assets/nav-logo.png";

function StateLayer1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="content-stretch flex flex-col h-[56px] items-center justify-center py-[8px] relative rounded-[8px] shrink-0 w-full">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="filled=false">
        {children}
      </div>
    </div>
  );
}
type Wrapper2Props = {
  additionalClassNames?: string;
};

function Wrapper2({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper2Props>) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
        {children}
      </svg>
    </div>
  );
}

function StateLayer({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="content-stretch flex flex-col h-[56px] items-center justify-center py-[8px] relative rounded-[8px] shrink-0 w-full">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="filled=true">
        {children}
      </div>
    </div>
  );
}

function Wrapper1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute inset-[14.58%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
          {children}
        </svg>
      </div>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 w-[56px]">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center relative w-full">{children}</div>
      </div>
    </div>
  );
}
type EnProps = {
  className?: string;
  type?: "en" | "pr_br" | "es" | "gu";
};

function En({ className, type = "en" }: EnProps) {
  const isEs = type === "es";
  const isGu = type === "gu";
  return (
    <div className={className || "relative size-[64px]"}>
      {["pr_br", "es", "gu"].includes(type) && (
        <div className="absolute aspect-[512/512] left-0 overflow-clip right-0 top-0" data-name="pr_br">
          {["es", "gu"].includes(type) && (
            <div className="absolute aspect-[512/512] left-0 overflow-clip right-0 top-0" data-name="es">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
                <g id={isGu ? "gu" : "Vector"}>
                  {isEs && (
                    <>
                      <path d={svgPaths.p14c01140} fill="#FFDA44" />
                      <path d={svgPaths.p133acff0} fill="var(--fill-0, #D80027)" />
                      <path d={svgPaths.p184b5600} fill="var(--fill-0, #D80027)" />
                    </>
                  )}
                  {isGu && (
                    <g id="Vector">
                      <path d={svgPaths.p34a63200} fill="#F0F0F0" />
                      <path d={svgPaths.p35ea0200} fill="#338AF3" />
                      <path d={svgPaths.p3dca0700} fill="#338AF3" />
                      <path d={svgPaths.p28557d00} fill="#ACABB1" />
                      <path d={svgPaths.p3d92a8c0} fill="var(--fill-0, #6DA544)" />
                    </g>
                  )}
                </g>
              </svg>
            </div>
          )}
          {type === "pr_br" && (
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
              <g id="Vector">
                <path d={svgPaths.p34a63200} fill="#6DA544" />
                <path d={svgPaths.pe381c00} fill="#FFDA44" />
                <path d={svgPaths.pde42280} fill="#F0F0F0" />
                <path d={svgPaths.p2b5fc000} fill="var(--fill-0, #0052B4)" />
                <path d={svgPaths.p30734500} fill="var(--fill-0, #0052B4)" />
              </g>
            </svg>
          )}
        </div>
      )}
      {type === "en" && (
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
          <g id="Vector">
            <path d={svgPaths.p34a63200} fill="#F0F0F0" />
            <path d={svgPaths.p2195d600} fill="#0052B4" />
            <path d={svgPaths.p1742c600} fill="#0052B4" />
            <path d={svgPaths.p3d8f9680} fill="#0052B4" />
            <path d={svgPaths.p3d6ca900} fill="#0052B4" />
            <path d={svgPaths.p14153200} fill="#0052B4" />
            <path d={svgPaths.p2311c400} fill="#0052B4" />
            <path d={svgPaths.p238ae380} fill="#0052B4" />
            <path d={svgPaths.p70aa400} fill="#0052B4" />
            <path d={svgPaths.p31d3d600} fill="var(--fill-0, #D80027)" />
            <path d={svgPaths.p9756880} fill="var(--fill-0, #D80027)" />
            <path d={svgPaths.p27a08f2} fill="var(--fill-0, #D80027)" />
            <path d={svgPaths.p2572b700} fill="var(--fill-0, #D80027)" />
            <path d={svgPaths.p33c55bf0} fill="var(--fill-0, #D80027)" />
          </g>
        </svg>
      )}
    </div>
  );
}
type DividerProps = {
  className?: string;
  direction?: "horizontal" | "vertical";
};

function Divider({ className, direction = "horizontal" }: DividerProps) {
  const isVertical = direction === "vertical";
  return (
    <div className={className || `relative ${isVertical ? "h-[360px] w-px" : "h-px w-[360px]"}`}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox={isVertical ? "0 0 1 360" : "0 0 360 1"}>
        <path clipRule="evenodd" d={isVertical ? "M1 360H0V0H1V360Z" : "M360 1H0V0H360V1Z"} fill="var(--fill-0, #E6EAF0)" fillRule="evenodd" id="Divider" />
      </svg>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="bg-[#161921] content-stretch flex items-start relative size-full" data-name="landing">
      <div className="bg-[#8c8c8c] h-full overflow-clip relative shrink-0 w-[1273px]" data-name="panel- quick-links">
        <div className="absolute left-[662px] top-[733px] w-[587px]" data-name="Base-nav">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex items-center justify-between relative w-full">
              <div className="bg-[#121623] content-stretch flex h-[70px] items-center p-[6px] relative rounded-[10px] shrink-0" data-name="Base-nav">
                <Wrapper>
                  <div className="bg-[#2b2f3f] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 w-full" data-name="Container">
                    <StateLayer>
                      <div className="absolute inset-[10.42%_6.25%_10.42%_6.29%]" data-name="Vector">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.9902 19">
                          <path d={svgPaths.pf74af40} fill="var(--fill-0, #B4BAC4)" id="Vector" />
                        </svg>
                      </div>
                    </StateLayer>
                  </div>
                </Wrapper>
              </div>
              <div className="bg-[#121623] content-stretch flex gap-[6px] h-[70px] items-center p-[6px] relative rounded-[10px] shrink-0" data-name="Base-nav">
                <div className="bg-[#2b2f3f] content-stretch flex h-[56px] items-center px-[10px] py-[15px] relative rounded-[5px] shrink-0" data-name="text-field-ai">
                  <div aria-hidden="true" className="absolute border border-[rgba(245,247,250,0.1)] border-solid inset-0 pointer-events-none rounded-[5px]" />
                  <div className="relative shrink-0 size-[36px]" data-name="icons">
                    <div className="absolute h-[37px] left-0 top-[-1px] w-[36px]" data-name="mineCraft_icon 1" />
                    <Wrapper2 additionalClassNames="left-[8px] size-[19px] top-[10px]">
                      <g id="Group 1010105554">
                        <path d={svgPaths.p10399800} fill="var(--fill-0, #F5F7FA)" id="Star 3 (Stroke)" />
                        <path d={svgPaths.pf21cf80} fill="var(--fill-0, #F5F7FA)" id="Star 2 (Stroke)" />
                        <path d={svgPaths.pdf714c0} fill="var(--fill-0, #F5F7FA)" id="Ellipse 3744" />
                        <path d={svgPaths.pfa98700} fill="var(--fill-0, #F5F7FA)" id="Ellipse 3745" />
                      </g>
                    </Wrapper2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bg-[#121623] h-[824px] left-[220px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] top-0 w-[420px]" data-name="panel-info" />
        <div className="absolute bg-[#121623] content-stretch flex flex-col h-[824px] items-start left-0 overflow-clip px-[2px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] top-0 w-[220px]" data-name="panel-nav">
          <div className="content-stretch flex flex-col h-[824px] items-start relative shrink-0 w-[72px]" data-name="Nova-Navigation drawer">
            <div className="bg-[#2b2f3f] flex-[1_0_0] max-w-[80px] min-h-px min-w-[72px] relative w-[72px]" data-name="Navigation Rail">
              <div className="flex flex-col items-center max-w-[inherit] min-w-[inherit] size-full">
                <div className="content-stretch flex flex-col items-center justify-between max-w-[inherit] min-w-[inherit] px-[12px] py-[24px] relative size-full">
                  <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Top content">
                    <div className="content-stretch flex flex-col gap-[3px] items-center pb-[32px] relative shrink-0" data-name="Branding">
                      <div className="content-stretch flex flex-col h-[70px] items-center justify-between overflow-clip relative shrink-0 w-[56px]" data-name="logo">
                        <div className="h-[40px] relative shrink-0 w-[31px]" data-name="c982db932d21fec3b4f807dd1c44dff9 1">
                          <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <img alt="" className="absolute h-[100.4%] left-0 max-w-none top-[-0.2%] w-[192.31%]" src={imgC982Db932D21Fec3B4F807Dd1C44Dff91} />
                          </div>
                        </div>
                        <div className="relative shrink-0 w-[56px]" data-name="Replaceable content slot">
                          <div className="flex flex-row items-center justify-center size-full">
                            <div className="content-stretch flex items-center justify-center relative w-full">
                              <div className="flex flex-[1_0_0] flex-col font-['Hexagon_Akkurat:regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#f5f7fa] text-[16px] text-center">
                                <p className="leading-[24px]">Vale</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col gap-[10px] items-center justify-center relative shrink-0" data-name="Menu items">
                      <Wrapper>
                        <div className="bg-[#2b2f3f] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 w-full" data-name="Container">
                          <StateLayer>
                            <div className="absolute inset-[15.02%_18.75%_14.58%_18.75%]" data-name="Vector">
                              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 16.8943">
                                <path d={svgPaths.p222a2d00} fill="var(--fill-0, #B4BAC4)" id="Vector" />
                              </svg>
                            </div>
                          </StateLayer>
                        </div>
                      </Wrapper>
                      <Divider className="h-px relative shrink-0 w-full" />
                      <Wrapper>
                        <div className="bg-[#2b2f3f] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 w-full" data-name="Container">
                          <div className="content-stretch flex flex-col h-[56px] items-center justify-center py-[8px] relative rounded-[8px] shrink-0 w-full" data-name="state-layer">
                            <Wrapper1>
                              <path d={svgPaths.p12ad0780} fill="var(--fill-0, #B4BAC4)" id="Vector" />
                            </Wrapper1>
                          </div>
                        </div>
                      </Wrapper>
                      <Wrapper>
                        <div className="bg-[#2b2f3f] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 w-full" data-name="Container">
                          <div className="content-stretch flex flex-col h-[56px] items-center justify-center py-[8px] relative rounded-[8px] shrink-0 w-full" data-name="state-layer">
                            <Wrapper1>
                              <path d={svgPaths.p1010b400} fill="var(--fill-0, #B4BAC4)" id="Vector" />
                            </Wrapper1>
                          </div>
                        </div>
                      </Wrapper>
                      <Wrapper>
                        <div className="bg-[#2b2f3f] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 w-full" data-name="Container">
                          <StateLayer1>
                            <Wrapper2 additionalClassNames="inset-[10.42%]">
                              <path d={svgPaths.p23e72630} fill="var(--fill-0, #B4BAC4)" id="Vector" />
                            </Wrapper2>
                          </StateLayer1>
                        </div>
                      </Wrapper>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0" data-name="Bottom content">
                    <Wrapper>
                      <div className="bg-[#2b2f3f] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 w-full" data-name="Container">
                        <StateLayer1>
                          <div className="absolute inset-[10.42%_10.85%]" data-name="Vector">
                            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.792 19">
                              <path d={svgPaths.p11ef0160} fill="var(--fill-0, #B4BAC4)" id="Vector" />
                            </svg>
                          </div>
                        </StateLayer1>
                      </div>
                    </Wrapper>
                    <En className="overflow-clip relative shrink-0 size-[24px]" />
                    <div className="bg-[#b4bac4] max-h-[32px] max-w-[32px] min-h-[32px] min-w-[32px] relative rounded-[999px] shrink-0 size-[32px]" data-name="Avatar">
                      <div className="flex flex-row items-center max-h-[inherit] max-w-[inherit] min-h-[inherit] min-w-[inherit] size-full">
                        <div className="content-stretch flex items-center justify-between max-h-[inherit] max-w-[inherit] min-h-[inherit] min-w-[inherit] relative size-full">
                          <div className="content-stretch flex items-center justify-center relative rounded-[999px] shrink-0 size-[32px]" data-name="state-layer">
                            <div className="flex flex-[1_0_0] flex-col font-['Hexagon_Akkurat:regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#121623] text-[14px] text-center">
                              <p className="leading-[19px]">AK</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 top-0 w-px" data-name="Divider">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 824">
                      <path clipRule="evenodd" d="M1 824H0V0H1V824Z" fill="var(--fill-0, #474F5F)" fillRule="evenodd" id="Divider" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}