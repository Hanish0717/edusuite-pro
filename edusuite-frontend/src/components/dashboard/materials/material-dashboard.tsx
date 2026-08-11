import { Clock, Eye, Download, Archive, UserCheck, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { StudyMaterialItem } from "@/data/faculty-mock-data";

interface MaterialDashboardProps {
  materials: StudyMaterialItem[];
}

export function MaterialDashboard({ materials }: MaterialDashboardProps) {
  const recent = materials.length > 0 ? materials[0]?.title || "None" : "None";
  const mostDownloaded = materials.length > 0
    ? [...materials].sort((a, b) => b.downloadCount - a.downloadCount)[0]?.title || "None"
    : "None";

  const draft = materials.filter((m) => m.visibilityStatus === "Faculty Only").length;
  const shared = materials.filter((m) => m.visibilityStatus === "Visible").length;
  const archived = materials.filter((m) => m.visibilityStatus === "Scheduled").length;

  const dashboards = [
    { label: "Recently Uploaded", value: recent, icon: Clock, color: "text-blue-500 bg-blue-500/10 border-blue-500/10" },
    { label: "Most Downloaded", value: mostDownloaded, icon: Star, color: "text-amber-500 bg-amber-500/10 border-amber-500/10" },
    { label: "Draft Templates", value: `${draft} Drafts`, icon: Clock, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/10" },
    { label: "Shared with Students", value: `${shared} Files`, icon: UserCheck, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/10" },
    { label: "Scheduled Release", value: `${archived} Files`, icon: Archive, color: "text-rose-500 bg-rose-500/10 border-rose-500/10" },
    { label: "New Uploads Week", value: "2 Files", icon: Eye, color: "text-violet-500 bg-violet-500/10 border-violet-500/10" },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-xs">
      {dashboards.map((card, idx) => (
        <Card
          key={idx}
          className="border border-border/60 py-0 shadow-sm rounded-2xl bg-muted/20"
        >
          <CardContent className="flex items-center gap-3 p-3.5">
            <span className={`grid size-9 shrink-0 place-items-center rounded-xl border ${card.color}`}>
              <card.icon className="size-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-[0.55rem] text-muted-foreground uppercase tracking-wider truncate">
                {card.label}
              </p>
              <p className="mt-0.5 text-[0.72rem] font-black tracking-tight text-foreground truncate">
                {card.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
