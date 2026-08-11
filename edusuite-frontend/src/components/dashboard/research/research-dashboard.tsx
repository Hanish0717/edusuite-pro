import { BookOpen, CheckCircle, Clock, Award, Briefcase, FileText } from "lucide-react";
import type { ResearchDashboardSummary } from "./types";

interface ResearchDashboardProps {
  summary: ResearchDashboardSummary;
}

export function ResearchDashboard({ summary }: ResearchDashboardProps) {
  const items = [
    { label: "Publications This Year", value: summary.publicationsThisYear, icon: BookOpen, color: "text-blue-500 bg-blue-500/10" },
    { label: "Accepted Papers", value: summary.acceptedPapers, icon: Award, color: "text-indigo-500 bg-indigo-500/10" },
    { label: "Under Review", value: summary.underReview, icon: Clock, color: "text-amber-500 bg-amber-500/10" },
    { label: "Ongoing Projects", value: summary.ongoingProjects, icon: Briefcase, color: "text-sky-500 bg-sky-500/10" },
    { label: "Completed Projects", value: summary.completedProjects, icon: CheckCircle, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Grants Received", value: summary.grantsReceived, icon: FileText, color: "text-rose-500 bg-rose-500/10" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex items-center gap-3 p-4 rounded-2xl border border-border/40 bg-card hover:bg-muted/10 transition-colors"
          >
            <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
              <Icon className="size-5" />
            </div>
            <div>
              <p className="text-lg font-black text-foreground">{item.value}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide leading-tight mt-0.5">{item.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
