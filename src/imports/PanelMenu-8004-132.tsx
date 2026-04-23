type PanelMenuContainerTextProps = {
  text: string;
};

function PanelMenuContainerText({ text }: PanelMenuContainerTextProps) {
  return (
    <div className="h-[28px] relative shrink-0 w-full">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#f5f7fa] text-[18px] top-0 tracking-[-0.4395px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type PanelMenuProps = {
  className?: string;
  type?: "NPI" | "NPI+" | "EQI" | "NPI_report" | "NPI+ report";
};

function PanelMenu({ className, type = "NPI" }: PanelMenuProps) {
  const isEqi = type === "EQI";
  const isNpi = type === "NPI+";
  const isNpiOrEqi = ["NPI+", "EQI"].includes(type);
  const isNpiOrNpiReportOrNpi = ["NPI", "NPI+ report", "NPI+"].includes(type);
  const isNpiOrNpiReportOrNpiOrEqi = ["NPI", "NPI+ report", "NPI+", "EQI"].includes(type);
  const isNpiReport = type === "NPI_report";
  const isNpiReport1 = type === "NPI+ report";
  const isNpiReportOrNpi = ["NPI+ report", "NPI+"].includes(type);
  return (
    <div className={className || "bg-[#2b2f3f] h-[833px] relative shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] w-[240px]"}>
      <div className={`absolute w-[192px] ${isEqi ? "h-[392px] left-[18px] top-[169px]" : isNpi ? "h-[392px] left-[24px] top-[169px]" : isNpiReport1 ? "content-stretch flex flex-col gap-[10px] items-start left-[28px] top-[179px]" : isNpiReport ? "h-[162px] left-[28px] top-[179px]" : "h-[294px] left-[24px] top-[126px]"}`} data-name="Container">
        <div className={`h-[28px] ${isNpiReport1 ? "relative shrink-0 w-full" : "absolute left-0 top-0 w-[192px]"}`} data-name="MenuItem">
          {isNpiOrNpiReportOrNpiOrEqi && <p className={`absolute font-["Inter:Medium",sans-serif] font-medium leading-[28px] left-0 not-italic text-[#f5f7fa] text-[18px] top-0 tracking-[-0.4395px] ${isEqi ? "h-[39px] w-[204px]" : "whitespace-nowrap"}`}>{isEqi ? "Ecosystem Quality Index (EQI)" : isNpiReportOrNpi ? "Ecosystem extent" : "Ecosystem extent"}</p>}
        </div>
        {isNpiOrNpiReportOrNpiOrEqi && (
          <div className={`content-stretch flex flex-col h-[32px] items-start opacity-70 ${isNpiReport1 ? "relative shrink-0 w-full" : "absolute left-0 top-[72px] w-[192px]"}`} data-name="MenuItem">
            <div className="h-[28px] relative shrink-0 w-full" data-name="Container">
              <p className={`absolute font-["Inter:Medium",sans-serif] font-medium leading-[28px] left-0 not-italic text-[#f5f7fa] text-[18px] tracking-[-0.4395px] ${isEqi ? "top-[-7px] whitespace-pre" : "top-0 whitespace-nowrap"}`}>{isEqi ? "Area Habitat  Index" : isNpiReportOrNpi ? "Ecosystem condition" : "Ecosystem condition"}</p>
            </div>
          </div>
        )}
        {isNpiOrNpiReportOrNpi && (
          <>
            <div className={`content-stretch flex flex-col h-[32px] items-start opacity-70 ${isNpiReport1 ? "relative shrink-0 w-full" : "absolute left-0 top-[144px] w-[192px]"}`} data-name="MenuItem">
              <PanelMenuContainerText text="Species extinction risk" />
            </div>
            <div className={`content-stretch flex flex-col h-[32px] items-start opacity-70 ${isNpiReport1 ? "relative shrink-0 w-full" : "absolute left-0 top-[216px] w-[192px]"}`} data-name="MenuItem">
              <PanelMenuContainerText text="Species populations" />
            </div>
          </>
        )}
        {isNpiReportOrNpi && (
          <>
            <div className={`content-stretch flex flex-col h-[32px] items-start opacity-70 ${isNpi ? "absolute left-0 top-[288px] w-[192px]" : "relative shrink-0 w-full"}`} data-name="MenuItem">
              <PanelMenuContainerText text="Water impact" />
            </div>
            <div className={`content-stretch flex flex-col h-[32px] items-start opacity-70 ${isNpi ? "absolute left-0 top-[360px] w-[192px]" : "relative shrink-0 w-full"}`} data-name="MenuItem">
              <PanelMenuContainerText text="Human impact" />
            </div>
          </>
        )}
        {isNpiReport && (
          <>
            <div className="absolute content-stretch flex flex-col gap-[10px] items-start left-0 top-0 w-[192px]">
              <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#f5f7fa] text-[18px] tracking-[-0.4395px] w-full">Ecosystem extent</p>
              <div className="content-stretch flex flex-col h-[32px] items-start opacity-70 relative shrink-0 w-full" data-name="MenuItem">
                <PanelMenuContainerText text="Ecosystem condition" />
              </div>
              <div className="content-stretch flex flex-col h-[32px] items-start opacity-70 relative shrink-0 w-full" data-name="MenuItem">
                <PanelMenuContainerText text="Species extinction risk" />
              </div>
              <div className="content-stretch flex flex-col h-[32px] items-start opacity-70 relative shrink-0 w-full" data-name="MenuItem">
                <PanelMenuContainerText text="Species populations" />
              </div>
            </div>
            <div className="absolute border border-[#b8bbc2] border-solid h-[198px] left-[-8px] top-[181px] w-[200px]" />
            <div className="absolute border border-[#b8bbc2] border-solid h-[198px] left-[267px] top-[251px] w-[200px]" />
          </>
        )}
      </div>
      <div className={`absolute left-[15px] top-[26px] ${isNpiOrEqi ? "bg-[#474f5f] h-[34px] w-[209px]" : isNpiReport1 ? "contents" : isNpiReport ? "bg-[#778192] h-[85px] w-[209px]" : "bg-[#778192] h-[34px] w-[209px]"}`}>
        {isNpiReport1 && (
          <>
            <div className="absolute bg-[#474f5f] h-[34px] left-[15px] top-[26px] w-[209px]" />
            <p className="absolute font-['Hexagon_Akkurat:Regular',sans-serif] leading-[20px] left-[40px] not-italic text-[14px] text-white top-[33px] whitespace-nowrap">Nature Positive Initiative</p>
          </>
        )}
      </div>
      {isNpiOrNpiReportOrNpiOrEqi && (
        <div className={`absolute left-[15px] ${isEqi ? "bg-[#778192] h-[34px] top-[112px] w-[209px]" : isNpi ? "bg-[#474f5f] h-[34px] top-[112px] w-[209px]" : isNpiReport1 ? "contents top-[70px]" : "bg-[#474f5f] h-[34px] top-[69px] w-[209px]"}`}>
          {isNpiReport1 && (
            <>
              <div className="absolute bg-[#778192] h-[85px] left-[15px] top-[70px] w-[209px]" />
              <p className="absolute font-['Hexagon_Akkurat:Regular',sans-serif] leading-[20px] left-[40px] not-italic text-[14px] text-white top-[77px] whitespace-nowrap">Nature Positive Initiative+</p>
              <div className="absolute contents left-[70px] top-[112px]">
                <div className="absolute bg-[rgba(217,217,217,0.01)] border border-solid border-white h-[29px] left-[70px] top-[112px] w-[100px]" />
                <p className="absolute font-['Hexagon_Akkurat:Regular',sans-serif] leading-[20px] left-[93px] not-italic text-[14px] text-white top-[116px] whitespace-nowrap">REPORT</p>
              </div>
            </>
          )}
        </div>
      )}
      {["NPI", "NPI_report", "NPI+ report"].includes(type) && <p className={`absolute not-italic text-[14px] text-white ${isNpiReport1 ? 'font-["Hexagon_Akkurat:regular",sans-serif] h-[167px] leading-[18px] left-[39px] opacity-50 top-[446px] w-[161px]' : isNpiReport ? 'font-["Hexagon_Akkurat:Regular",sans-serif] leading-[20px] left-[40px] top-[33px] whitespace-nowrap' : 'font-["Hexagon_Akkurat:Regular",sans-serif] leading-[20px] left-[28px] top-[33px] whitespace-nowrap'}`}>{isNpiReport1 ? "Area (absolute and percentage) of loss, gain and net change in extent of natural ecosystems (ha, %)" : isNpiReport ? "Nature Positive Initiative" : "Nature Positive Initiative"}</p>}
      {["NPI+ report", "NPI+", "EQI"].includes(type) && <div className={`absolute left-[15px] ${isEqi ? "bg-[#474f5f] h-[34px] top-[69px] w-[209px]" : isNpi ? "bg-[#778192] h-[34px] top-[69px] w-[209px]" : "border border-[#b8bbc2] border-solid h-[198px] top-[427px] w-[200px]"}`} />}
      {isNpiOrEqi && <p className="absolute font-['Hexagon_Akkurat:Regular',sans-serif] leading-[20px] left-[28px] not-italic text-[14px] text-white top-[33px] whitespace-nowrap">Nature Positive Initiative</p>}
      {["NPI", "NPI+", "EQI"].includes(type) && <p className={`absolute font-["Hexagon_Akkurat:Regular",sans-serif] leading-[20px] left-[28px] not-italic text-[14px] text-white whitespace-nowrap ${isNpiOrEqi ? "top-[119px]" : "top-[76px]"}`}>{isNpiOrEqi ? "Area Index" : "Nature Positive Initiative +"}</p>}
      {isNpiOrEqi && <p className="absolute font-['Hexagon_Akkurat:Regular',sans-serif] leading-[20px] left-[28px] not-italic text-[14px] text-white top-[76px] whitespace-nowrap">Nature Positive Initiative +</p>}
      {isNpiReport && (
        <>
          <div className="absolute contents left-[15px] top-[119px]">
            <div className="absolute bg-[#474f5f] h-[34px] left-[15px] top-[119px] w-[209px]" />
            <p className="absolute font-['Hexagon_Akkurat:Regular',sans-serif] leading-[20px] left-[28px] not-italic text-[14px] text-white top-[126px] whitespace-nowrap">Nature Positive Initiative +</p>
          </div>
          <div className="absolute contents left-[70px] top-[68px]">
            <div className="absolute bg-[rgba(217,217,217,0.01)] border border-solid border-white h-[29px] left-[70px] top-[68px] w-[100px]" />
            <p className="absolute font-['Hexagon_Akkurat:Regular',sans-serif] leading-[20px] left-[93px] not-italic text-[14px] text-white top-[72px] whitespace-nowrap">REPORT</p>
          </div>
          <p className="absolute font-['Hexagon_Akkurat:regular',sans-serif] h-[167px] leading-[18px] left-[39px] not-italic opacity-50 text-[14px] text-white top-[376px] w-[161px]">Area (absolute and percentage) of loss, gain and net change in extent of natural ecosystems (ha, %)</p>
        </>
      )}
    </div>
  );
}

export default function PanelMenu1() {
  return <PanelMenu className="bg-[#2b2f3f] relative shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] size-full" type="NPI+ report" />;
}