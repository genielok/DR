import imgReport04 from "@/assets/report-04.png";

export default function Report({ className }: { className?: string }) {
    return (
        <div className={className || "h-[1229px] relative w-[921px]"} data-name="report_04">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgReport04} />
        </div>
    );
}