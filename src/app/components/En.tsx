import svgPaths from "../../imports/svg-7vt33vcn5p";

type EnProps = {
  className?: string;
  type?: "en" | "pr_br" | "es" | "gu";
};

export function En({ className, type = "en" }: EnProps) {
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
