type BtnLableActionProps = {
  className?: string;
  state?: "enabled" | "rollOver" | "onClick";
};

function BtnLableAction({ className, state = "enabled" }: BtnLableActionProps) {
  const isOnClick = state === "onClick";
  const isRollOver = state === "rollOver";
  return (
    <div className={className || `h-[29px] relative rounded-[4px] w-[100px] ${isOnClick ? "bg-[#2b2f3f]" : isRollOver ? "bg-[#474f5f]" : ""}`}>
      <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[4px] ${isOnClick ? "border-[rgba(255,255,255,0.4)]" : isRollOver ? "border-[rgba(255,255,255,0.5)]" : "border-white"}`} />
      <p className={`absolute font-["Hexagon_Akkurat:Regular",sans-serif] inset-[13.79%_23%_17.24%_23%] leading-[20px] not-italic text-[14px] whitespace-nowrap ${isOnClick ? "text-[rgba(255,255,255,0.4)]" : "text-white"}`}>REPORT</p>
    </div>
  );
}
type MainMenuBtnProps = {
  className?: string;
  state?: "focus" | "enabled";
};

function MainMenuBtn({ className, state = "focus" }: MainMenuBtnProps) {
  const isEnabled = state === "enabled";
  return (
    <div className={className || `relative w-[209px] ${isEnabled ? "bg-[#474f5f] h-[43px]" : "bg-[#778192] h-[85px]"}`}>
      <div className="flex flex-col items-center justify-center size-full">
        <div className={`content-stretch flex flex-col items-center justify-center relative size-full ${isEnabled ? "" : "gap-[10px]"}`}>
          <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="btn label">
            <p className="font-['Hexagon_Akkurat:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white w-full">Nature Positive Initiative</p>
          </div>
          {state === "focus" && <BtnLableAction className="h-[29px] relative rounded-[4px] shrink-0 w-[100px]" />}
        </div>
      </div>
    </div>
  );
}

export default function MainMenuBtn1() {
  return <MainMenuBtn className="bg-[#778192] relative size-full" />;
}