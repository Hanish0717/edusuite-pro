import { Panel } from "@/components/dashboard/panel";

export function Legend() {
  const legendItems = [
    { label: "Theory Lecture", color: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
    { label: "Laboratory Practice", color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
    { label: "Seminar / Presentation", color: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
    { label: "Project Guidance", color: "bg-purple-500/10 text-purple-700 border-purple-500/20" },
    { label: "Holiday / Leave", color: "bg-muted text-muted-foreground border-border/40" },
  ];

  return (
    <Panel
      title="Color Codes Legend"
      description="Explanation of grid cell types"
      className="border border-border bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="flex flex-wrap gap-2.5 text-xs">
        {legendItems.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 py-1.5 px-3 rounded-xl border font-semibold text-[0.65rem] ${item.color}`}
          >
            <span className="size-2 rounded-full bg-current" />
            {item.label}
          </div>
        ))}
      </div>
    </Panel>
  );
}
