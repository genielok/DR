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

export default function BtnLableAction1() {
  return <BtnLableAction className="relative rounded-[4px] size-full" />;
}