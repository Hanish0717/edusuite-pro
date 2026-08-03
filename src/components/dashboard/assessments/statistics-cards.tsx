import { FileText, BarChart2, Users, Clock, TrendingUp, Award, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssessmentStats } from "./types";

interface StatisticsCardsProps {
  stats: AssessmentStats;
}

const STAT_CARDS = (s: AssessmentStats) => [
  { label: "Total Assessments",   value: s.total,              icon: FileText,     color: "from-blue-500 to-blue-600",   bg: "bg-blue-500/8",    text: "text-blue-600 dark:text-blue-400" },
  { label: "Published",           value: s.published,          icon: CheckCircle2, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-500/8", text: "text-emerald-600 dark:text-emerald-400" },
  { label: "Draft",               value: s.draft,              icon: Clock,        color: "from-amber-500 to-amber-600",  bg: "bg-amber-500/8",   text: "text-amber-600 dark:text-amber-400" },
  { label: "Marks Pending",       value: s.marksPending,       icon: AlertTriangle,color: "from-rose-500 to-rose-600",    bg: "bg-rose-500/8",    text: "text-rose-600 dark:text-rose-400" },
  { label: "Average Score",       value: `${s.averageScore}%`, icon: TrendingUp,   color: "from-violet-500 to-violet-600",bg: "bg-violet-500/8",  text: "text-violet-600 dark:text-violet-400" },
  { label: "Highest Score",       value: `${s.highestScore}%`, icon: Award,        color: "from-indigo-500 to-indigo-600",bg: "bg-indigo-500/8",  text: "text-indigo-600 dark:text-indigo-400" },
  { label: "Lowest Score",        value: `${s.lowestScore}%`,  icon: BarChart2,    color: "from-orange-500 to-orange-600",bg: "bg-orange-500/8",  text: "text-orange-600 dark:text-orange-400" },
  { label: "Students Evaluated",  value: s.studentsEvaluated,  icon: Users,        color: "from-teal-500 to-teal-600",   bg: "bg-teal-500/8",    text: "text-teal-600 dark:text-teal-400" },
];

export function StatisticsCards({ stats }: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
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
