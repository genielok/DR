import imgReport01 from "@/assets/report-01.png";

export default function Report({ className }: { className?: string }) {
    return (
        <div className={className || "h-[1230px] relative w-[922px]"} data-name="report_01">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgReport01} />
        </div>
    );
}