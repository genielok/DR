import clsx from "clsx";
import svgPaths from "./svg-v21cjie8qh";
type Wrapper1Props = {
  additionalClassNames?: string;
};

function Wrapper1({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <div className={clsx("absolute content-stretch flex justify-between px-[20px] py-[10px] top-0", additionalClassNames)}>
      <div className="content-stretch flex gap-[6px] items-center relative shrink-0">{children}</div>
      <Text text="Download files" />
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
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <p className="font-['Roboto:Medium',sans-serif] leading-[27px] not-italic relative shrink-0 text-[#0891d1] text-[14px] whitespace-nowrap">{text}</p>
      <div className="overflow-clip relative shrink-0 size-[34px]">
        <DownloadForOffline additionalClassNames="left-[5px] top-[5px]">
          <mask height="24" id="mask0_12003_179" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" x="0" y="0">
            <rect fill="var(--fill-0, #D9D9D9)" height="24" id="Bounding box" width="24" />
          </mask>
          <g mask="url(#mask0_12003_179)">
            <path d={svgPaths.p12bd48f0} fill="var(--fill-0, #0891D1)" id="download_for_offline_2" />
          </g>
        </DownloadForOffline>
      </div>
    </div>
  );
}
type Helper2Props = {
  text: string;
  text1: string;
};

function Helper2({ text, text1 }: Helper2Props) {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Medium',sans-serif] gap-[6px] items-start not-italic relative shrink-0 w-[192px]">
      <p className="leading-[16px] relative shrink-0 text-[14px] text-white w-full">{text}</p>
      <p className="leading-[12px] relative shrink-0 text-[#8698af] text-[10px] w-full">{text1}</p>
    </div>
  );
}
type Helper1Props = {
  additionalClassNames?: string;
};

function Helper1({ additionalClassNames = "" }: Helper1Props) {
  return (
    <div className={clsx("content-stretch flex items-center justify-center relative shrink-0 size-[34px]", additionalClassNames)}>
      <Wrapper additionalClassNames="relative shrink-0 size-[24px]">
        <g id="keyboard_arrow_down">
          <mask height="24" id="mask0_12003_183" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" x="0" y="0">
            <rect fill="var(--fill-0, #D9D9D9)" height="24" id="Bounding box" width="24" />
          </mask>
          <g mask="url(#mask0_12003_183)">
            <path d={svgPaths.p2b1b0180} fill="var(--fill-0, #7B8CA2)" id="keyboard_arrow_down_2" />
          </g>
        </g>
      </Wrapper>
    </div>
  );
}
type HelperProps = {
  text: string;
  text1: string;
  text2: string;
  additionalClassNames?: string;
};

function Helper({ text, text1, text2, additionalClassNames = "" }: HelperProps) {
  return (
    <div className={clsx("absolute content-stretch flex justify-between px-[20px] py-[10px] top-0", additionalClassNames)}>
      <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
        <Helper1 />
        <Helper2 text={text} text1={text1} />
      </div>
      <Text text={text2} />
    </div>
  );
}

export default function AuditExpanded({ className }: { className?: string }) {
  return (
    <div className={className || "bg-[#2b2f3f] h-[383px] relative w-[498px]"} data-name="audit_expanded">
      <p className="absolute font-['Roboto:SemiBold',sans-serif] font-semibold leading-[27px] left-[29px] text-[14px] text-white top-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        AUDIT
      </p>
      <DownloadForOffline additionalClassNames="left-[379px] top-[95px]">
        <mask height="24" id="mask0_12003_191" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" x="0" y="0">
          <rect fill="var(--fill-0, #D9D9D9)" height="24" id="Bounding box" width="24" />
        </mask>
        <g mask="url(#mask0_12003_191)">
          <path d={svgPaths.p21d99480} fill="var(--fill-0, #0891D1)" id="download_for_offline_2" />
        </g>
      </DownloadForOffline>
      <DownloadForOffline additionalClassNames="left-[379px] top-[199px]">
        <mask height="24" id="mask0_12003_187" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" x="0" y="0">
          <rect fill="var(--fill-0, #D9D9D9)" height="24" id="Bounding box" width="24" />
        </mask>
        <g mask="url(#mask0_12003_187)">
          <path d={svgPaths.p2bdcae00} fill="var(--fill-0, #0891D1)" id="download_for_offline_2" />
        </g>
      </DownloadForOffline>
      <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-0 top-[44px] w-[498px]">
        <div className="content-stretch flex flex-col gap-[6px] items-start py-[6px] relative shrink-0 w-full">
          <div className="h-[45px] overflow-clip relative shrink-0 w-full">
            <Helper text="Processed orthograhical maps" text1="4 Maps 2Gig" text2="Download files" additionalClassNames="items-start left-0 w-[498px]" />
          </div>
          <div className="h-[45px] overflow-clip relative shrink-0 w-full">
            <Wrapper1 additionalClassNames="items-start left-0 w-[498px]">
              <Helper1 additionalClassNames="opacity-0" />
              <Helper2 text="Segmented lidar data" text1="4 Maps 2Gig" />
            </Wrapper1>
          </div>
        </div>
        <div className="bg-[#19202c] content-stretch flex flex-col gap-[6px] items-end justify-center py-[6px] relative shrink-0">
          <div className="h-[45px] overflow-clip relative shrink-0 w-[498px]">
            <Helper text="Processed orthograhical maps" text1="4 Maps 2Gig" text2="Download files" additionalClassNames="items-center left-[25px] w-[473px]" />
          </div>
          <div className="h-[45px] overflow-clip relative shrink-0 w-[498px]">
            <Wrapper1 additionalClassNames="items-center left-[25px] w-[473px]">
              <Helper1 additionalClassNames="opacity-0" />
              <Helper2 text="Raw HSPC lidar data" text1="4 Maps 2Gig" />
            </Wrapper1>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[6px] items-start py-[6px] relative shrink-0 w-full">
          <div className="h-[45px] overflow-clip relative shrink-0 w-full">
            <Helper text="Uncorrected imagery" text1="4 Maps 2Gig" text2="Download files" additionalClassNames="items-center left-[54px] w-[444px]" />
          </div>
          <div className="h-[45px] overflow-clip relative shrink-0 w-full">
            <Wrapper1 additionalClassNames="items-center left-[54px] w-[444px]">
              <Helper1 additionalClassNames="opacity-0" />
              <Helper2 text="Unprocessed lidar data" text1="4 Maps 2Gig" />
            </Wrapper1>
          </div>
        </div>
      </div>
    </div>
  );
}