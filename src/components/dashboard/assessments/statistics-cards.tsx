import { FileText, Users, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssessmentStats } from "./types";

interface StatisticsCardsProps {
  stats: AssessmentStats;
}

const STAT_CARDS = (s: AssessmentStats) => [
  { label: "Total Assessments",  value: s.total,             icon: FileText,     color: "from-blue-500 to-blue-600",   bg: "bg-blue-500/8",    text: "text-blue-600 dark:text-blue-400" },
  { label: "Published",          value: s.published,         icon: CheckCircle2, color: "from-indigo-500 to-indigo-600", bg: "bg-indigo-500/8", text: "text-indigo-600 dark:text-indigo-400" },
  { label: "Draft",              value: s.draft,             icon: Clock,        color: "from-sky-500 to-sky-600",     bg: "bg-sky-500/8",      text: "text-sky-600 dark:text-sky-400" },
  { label: "Marks Pending",      value: s.marksPending,      icon: AlertTriangle,color: "from-blue-600 to-indigo-600",   bg: "bg-blue-600/8",    text: "text-blue-700 dark:text-blue-400" },
  { label: "Students Evaluated", value: s.studentsEvaluated, icon: Users,        color: "from-indigo-700 to-blue-700",  bg: "bg-indigo-700/8",  text: "text-indigo-800 dark:text-indigo-400" },
];

export function StatisticsCards({ stats }: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {STAT_CARDS(stats).map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={cn(
              "relative overflow-hidden rounded-2xl border border-border/40 bg-card p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-default",
              card.bg
            )}
          >
            <div className={cn("size-8 rounded-xl flex items-center justify-center", `bg-gradient-to-br ${card.color}`)}>
              <Icon className="size-4 text-white" />
            </div>
            <p className={cn("text-2xl font-extrabold tabular-nums", card.text)}>{card.value}</p>
            <p className="text-[0.6rem] font-semibold text-muted-foreground uppercase tracking-wide leading-tight">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}
