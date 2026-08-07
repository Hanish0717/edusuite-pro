import { BookOpen, Briefcase, DollarSign, ShieldAlert, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResearchStats } from "./types";

interface ExtendedResearchStats extends Partial<ResearchStats> {
  totalPublications: number;
  ongoingProjects?: number;
  projects?: number;
  researchGrants: number;
  patents: number;
  publicationsThisYear?: number;
}

interface StatisticsCardsProps {
  stats: ExtendedResearchStats;
}

export function StatisticsCards({ stats }: StatisticsCardsProps) {
  const cards = [
    {
      label: "Total Publications",
      value: stats.totalPublications,
      icon: BookOpen,
    },
    {
      label: "Ongoing Projects",
      value: stats.ongoingProjects ?? stats.projects ?? 0,
      icon: Briefcase,
    },
    {
      label: "Research Grants",
      value: stats.researchGrants,
      icon: DollarSign,
    },
    {
      label: "Patents",
      value: stats.patents,
      icon: ShieldAlert,
    },
    {
      label: "Publications This Year",
      value: stats.publicationsThisYear ?? 0,
      icon: Calendar,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={cn(
              "relative overflow-hidden rounded-2xl border border-blue-500/20 dark:border-blue-500/30 bg-blue-500/8 p-4 flex flex-col gap-2 shadow-sm hover:shadow-md hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 cursor-default"
            )}
          >
            <div className="size-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
              <Icon className="size-4 text-white" />
            </div>
            <p className="text-2xl font-extrabold tabular-nums text-blue-600 dark:text-blue-400">{card.value}</p>
            <p className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wide leading-tight">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}
