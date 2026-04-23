import clsx from "clsx";
import svgPaths from "./svg-sfi5ksw5mq";
type Wrapper1Props = {
  additionalClassNames?: string;
};

function Wrapper1({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <div className={clsx("absolute content-stretch flex justify-between left-0 px-[20px] py-[10px] top-0 w-[498px]", additionalClassNames)}>
      <div className="content-stretch flex gap-[6px] items-center relative shrink-0">{children}</div>
      <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
        <p className="font-['Roboto:Medium',sans-serif] leading-[27px] not-italic relative shrink-0 text-[#0891d1] text-[14px] whitespace-nowrap">{"Download files"}</p>
        <div className="overflow-clip relative shrink-0 size-[34px]">
          <DownloadForOffline additionalClassNames="left-[5px] top-[5px]">
            <mask height="24" id="mask0_12003_199" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" x="0" y="0">
              <rect fill="var(--fill-0, #D9D9D9)" height="24" id="Bounding box" width="24" />
            </mask>
            <g mask="url(#mask0_12003_199)">
              <path d={svgPaths.p12bd48f0} fill="var(--fill-0, #0891D1)" id="download_for_offline_2" />
            </g>
          </DownloadForOffline>
        </div>
      </div>
    </div>
  );
}
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return (
    <div className={additionalClassNames}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        {children}
      </svg>
    </div>
  );
}
type DownloadForOfflineProps = {
  additionalClassNames?: string;
};

function DownloadForOffline({ children, additionalClassNames = "" }: React.PropsWithChildren<DownloadForOfflineProps>) {
  return (
    <Wrapper additionalClassNames={clsx("absolute size-[24px]", additionalClassNames)}>
      <g id="download_for_offline">{children}</g>
    </Wrapper>
  );
}
type AuditDefautHelper1Props = {
  text: string;
  text1: string;
};

function AuditDefautHelper1({ text, text1 }: AuditDefautHelper1Props) {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Medium',sans-serif] gap-[6px] items-start not-italic relative shrink-0 w-[192px]">
      <p className="leading-[16px] relative shrink-0 text-[14px] text-white w-full">{text}</p>
      <p className="leading-[12px] relative shrink-0 text-[#8698af] text-[10px] w-full">{text1}</p>
    </div>
  );
}
type AuditDefautHelperProps = {
  additionalClassNames?: string;
};

function AuditDefautHelper({ additionalClassNames = "" }: AuditDefautHelperProps) {
  return (
    <div className={clsx("content-stretch flex items-center justify-center relative size-[34px]", additionalClassNames)}>
      <Wrapper additionalClassNames="relative shrink-0 size-[24px]">
        <g id="keyboard_arrow_down">
          <mask height="24" id="mask0_12003_195" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" x="0" y="0">
            <rect fill="var(--fill-0, #D9D9D9)" height="24" id="Bounding box" width="24" />
          </mask>
          <g mask="url(#mask0_12003_195)">
            <path d={svgPaths.p2b1b0180} fill="var(--fill-0, #7B8CA2)" id="keyboard_arrow_down_2" />
          </g>
        </g>
      </Wrapper>
    </div>
  );
}

export default function AuditDefaut({ className }: { className?: string }) {
  return (
    <div className={className || "bg-[#2b2f3f] h-[161px] relative w-[498px]"} data-name="Audit_defaut">
      <p className="absolute font-['Roboto:SemiBold',sans-serif] font-semibold leading-[27px] left-[29px] text-[14px] text-white top-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        AUDIT
      </p>
      <DownloadForOffline additionalClassNames="left-[379px] top-[95px]">
        <mask height="24" id="mask0_12003_203" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" x="0" y="0">
          <rect fill="var(--fill-0, #D9D9D9)" height="24" id="Bounding box" width="24" />
        </mask>
        <g mask="url(#mask0_12003_203)">
          <path d={svgPaths.p21d99480} fill="var(--fill-0, #0891D1)" id="download_for_offline_2" />
        </g>
      </DownloadForOffline>
      <DownloadForOffline additionalClassNames="left-[379px] top-[199px]">
        <mask height="24" id="mask0_12003_207" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" x="0" y="0">
          <rect fill="var(--fill-0, #D9D9D9)" height="24" id="Bounding box" width="24" />
        </mask>
        <g mask="url(#mask0_12003_207)">
          <path d={svgPaths.pff92480} fill="var(--fill-0, #0891D1)" id="download_for_offline_2" />
        </g>
      </DownloadForOffline>
      <div className="absolute content-stretch flex flex-col items-start left-0 top-[44px] w-[498px]">
        <div className="content-stretch flex flex-col gap-[6px] items-start py-[6px] relative shrink-0 w-full">
          <div className="h-[45px] overflow-clip relative shrink-0 w-full">
            <Wrapper1 additionalClassNames="items-center">
              <div className="flex items-center justify-center relative shrink-0 size-[34px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18" } as React.CSSProperties}>
                <div className="-rotate-90 flex-none">
                  <AuditDefautHelper />
                </div>
              </div>
              <AuditDefautHelper1 text="Processed orthograhical maps" text1="4 Maps 2Gig" />
            </Wrapper1>
          </div>
          <div className="h-[45px] overflow-clip relative shrink-0 w-full">
            <Wrapper1 additionalClassNames="items-start">
              <AuditDefautHelper additionalClassNames="opacity-0 shrink-0" />
              <AuditDefautHelper1 text="Segmented lidar data" text1="4 Maps 2Gig" />
            </Wrapper1>
          </div>
        </div>
      </div>
    </div>
  );
}