import imgReport03 from "@/assets/report-03.png";

export default function Report({ className }: { className?: string }) {
    return (
        <div className={className || "h-[1227px] relative w-[922px]"} data-name="report_03">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgReport03} />
        </div>
    );
}