import imgReport02 from "@/assets/report-02.png";

export default function Report({ className }: { className?: string }) {
    return (
        <div className={className || "h-[1227px] relative w-[920px]"} data-name="report_02">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgReport02} />
        </div>
    );
}