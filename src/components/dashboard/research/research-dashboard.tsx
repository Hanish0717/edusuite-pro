import { BookOpen, CheckCircle, Clock, Award, Briefcase, FileText } from "lucide-react";
import type { ResearchDashboardSummary } from "./types";

interface ResearchDashboardProps {
  summary: ResearchDashboardSummary;
}

export function ResearchDashboard({ summary }: ResearchDashboardProps) {
  const items = [
    { label: "Publications This Year", value: summary.publicationsThisYear, icon: BookOpen },
    { label: "Accepted Papers", value: summary.acceptedPapers, icon: Award },
    { label: "Under Review", value: summary.underReview, icon: Clock },
    { label: "Ongoing Projects", value: summary.ongoingProjects, icon: Briefcase },
    { label: "Completed Projects", value: summary.completedProjects, icon: CheckCircle },
    { label: "Grants Received", value: summary.grantsReceived, icon: FileText }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="relative overflow-hidden flex items-center gap-3 p-4 rounded-2xl border border-blue-500/20 dark:border-blue-500/30 bg-blue-500/8 hover:shadow-md hover:shadow-blue-500/10 hover:border-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 cursor-default"
          >
            <div className="size-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600">
              <Icon className="size-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-extrabold tabular-nums text-blue-600 dark:text-blue-400">{item.value}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide leading-tight mt-0.5">{item.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
