import { useState, useEffect } from "react";
import { Download, Search } from "lucide-react";
import { type Campaign } from "../../../data/mockData";
import { getOperationLog, type OperationLogEntry } from "@/api";

/* ── Design-system tokens ── */
const F = {
  bold: "'Hexagon_Akkurat:bold',sans-serif",
  regular: "'Hexagon_Akkurat:regular',sans-serif",
};

interface OperationLogTabProps {
  project: Campaign;
}


type ActionFilter =
  | "all"
  | "uploads"
  | "confirmed"
  | "rejected"
  | "system";

const actionColors: Record<string, string> = {
  "Species Confirmed": "#10b981",
  "Species Rejected": "#D03A1E",
  "Expert Review Requested": "#E6901A",
  "Audio Upload": "#778192",
  "Bulk Confirmation": "#3b82f6",
  "AI Processing": "#778192",
};

const filterChips: { id: ActionFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "uploads", label: "Uploads" },
  { id: "confirmed", label: "Confirmed" },
  { id: "rejected", label: "Rejected" },
  { id: "system", label: "System" },
];

export function OperationLogTab({
  project,
}: OperationLogTabProps) {
  const [operationLog, setOperationLog] = useState<OperationLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUser, setFilterUser] = useState("all");
  const [actionFilter, setActionFilter] =
    useState<ActionFilter>("all");

  useEffect(() => {
    getOperationLog(project.id).then(setOperationLog);
  }, [project.id]);

  const users = Array.from(
    new Set(operationLog.map((log) => log.user)),
  );

  const filterByAction = (log: OperationLogEntry) => {
    switch (actionFilter) {
      case "uploads":
        return log.action === "Audio Upload";
      case "confirmed":
        return (
          log.action === "Species Confirmed" ||
          log.action === "Bulk Confirmation"
        );
      case "rejected":
        return log.action === "Species Rejected";
      case "system":
        return (
          log.action === "AI Processing" ||
          log.user === "System"
        );
      default:
        return true;
    }
  };

  const filteredLogs = operationLog.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.action
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      log.details
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      log.species
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesUser =
      filterUser === "all" || log.user === filterUser;
    const matchesAction = filterByAction(log);
    return matchesSearch && matchesUser && matchesAction;
  });

  const handleExportLog = () => {
    const headers = [
      "Timestamp",
      "User",
      "Action",
      "Species",
      "Details",
    ];
    const rows = operationLog.map((log) => [
      log.timestamp,
      log.user,
      log.action,
      log.species,
      log.details,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell}"`).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute(
      "download",
      `operation-log-${project.id}-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-[20px] flex flex-col gap-[6px]">
      {/* ── Toolbar ── */}
      <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] px-[16px] py-[12px] flex flex-wrap items-center gap-[10px]">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={13}
            className="absolute left-[10px] top-1/2 -translate-y-1/2 text-[#778192]"
          />
          <input
            type="text"
            placeholder="Search actions, species, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[34px] pl-[32px] pr-[10px] bg-[#474f5f] text-[rgba(255,255,255,0.9)] placeholder-[#778192] outline-none border-none"
            style={{ fontFamily: F.regular, fontSize: "12px" }}
          />
        </div>

        {/* User filter */}
        <select
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="h-[34px] px-[10px] bg-[#474f5f] text-[rgba(255,255,255,0.9)] border-none outline-none cursor-pointer min-w-[160px]"
          style={{ fontFamily: F.regular, fontSize: "12px" }}
        >
          <option value="all">All Users</option>
          {users.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>

        {/* Export button */}
        <button
          onClick={handleExportLog}
          className="h-[34px] px-[14px] border border-[#4a5568] bg-transparent hover:bg-[#404856] text-[#b7b9be] hover:text-white transition-colors duration-150 inline-flex items-center gap-[6px] cursor-pointer"
        >
          <Download size={13} />
          <span
            className="text-[12px] leading-[18px]"
            style={{ fontFamily: F.regular }}
          >
            Export Log
          </span>
        </button>
      </div>

      {/* ── Action Filter Chips ── */}
      <div className="flex gap-[2px]">
        {filterChips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => setActionFilter(chip.id)}
            className="h-[32px] px-[14px] transition-colors duration-150 cursor-pointer"
            style={{
              fontFamily:
                actionFilter === chip.id ? F.bold : F.regular,
              fontSize: "12px",
              background:
                actionFilter === chip.id
                  ? "#3b82f6"
                  : "#474f5f",
              color:
                actionFilter === chip.id ? "white" : "#b7b9be",
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* ── Results Count ── */}
      <div className="px-[4px]">
        <span
          className="text-[11px] leading-[16px] text-[#778192]"
          style={{ fontFamily: F.regular }}
        >
          Showing {filteredLogs.length} of{" "}
          {operationLog.length} operations
        </span>
      </div>

      {/* ── Table ── */}
      <div className="bg-[#2b2f3f] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#474f5f]">
              {[
                "Timestamp",
                "User",
                "Action",
                "Species",
                "Details",
              ].map((h) => (
                <th
                  key={h}
                  className="px-[14px] h-[36px] text-left"
                  style={{
                    fontFamily: F.bold,
                    fontSize: "11px",
                    lineHeight: "16px",
                    color: "#778192",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, idx) => (
              <tr
                key={log.id}
                className="hover:bg-[#3a4050] transition-colors duration-150"
                style={{
                  background:
                    idx % 2 === 0 ? "#2b2f3f" : "#303546",
                }}
              >
                <td
                  className="px-[14px] h-[38px] text-[11px] text-[#778192]"
                  style={{ fontFamily: F.regular }}
                >
                  {log.timestamp}
                </td>
                <td
                  className="px-[14px] h-[38px] text-[12px] text-[rgba(255,255,255,0.9)]"
                  style={{ fontFamily: F.regular }}
                >
                  {log.user}
                </td>
                <td className="px-[14px] h-[38px]">
                  <span
                    className="text-[12px]"
                    style={{
                      fontFamily: F.bold,
                      color:
                        actionColors[log.action] || "#778192",
                    }}
                  >
                    {log.action}
                  </span>
                </td>
                <td
                  className="px-[14px] h-[38px] text-[12px] text-[rgba(255,255,255,0.9)]"
                  style={{ fontFamily: F.bold }}
                >
                  {log.species}
                </td>
                <td
                  className="px-[14px] h-[38px] text-[11px] text-[#778192]"
                  style={{ fontFamily: F.regular }}
                >
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-[40px]">
          <span
            className="text-[12px] text-[#778192]"
            style={{ fontFamily: F.regular }}
          >
            No operations found matching your search criteria
          </span>
        </div>
      )}
    </div>
  );
}