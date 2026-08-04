import { FileText, Calendar, CheckCircle2, AlertTriangle, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExamStats } from "./types";

interface StatisticsCardsProps {
  stats: ExamStats;
}

export function StatisticsCards({ stats }: StatisticsCardsProps) {
  const cards = [
    {
      label: "Total Exams",
      value: stats.totalExams,
      icon: FileText,
      color: "from-blue-500 to-indigo-600",
      bg: "bg-blue-500/8",
      text: "text-blue-600 dark:text-blue-400"
    },
    {
      label: "Upcoming Exams",
      value: stats.upcomingExams,
      icon: Calendar,
      color: "from-sky-500 to-blue-600",
      bg: "bg-sky-500/8",
      text: "text-sky-600 dark:text-sky-400"
    },
    {
      label: "Completed Exams",
      value: stats.completedExams,
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-500/8",
      text: "text-emerald-600 dark:text-emerald-400"
    },
    {
      label: "Pending Evaluations",
      value: stats.pendingEvaluations,
      icon: Clock,
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-500/8",
      text: "text-amber-600 dark:text-amber-400"
    },
    {
      label: "Invigilation Duties",
      value: stats.invigilationDuties,
      icon: Shield,
      color: "from-purple-500 to-indigo-600",
      bg: "bg-purple-500/8",
      text: "text-purple-600 dark:text-purple-400"
    },
    {
      label: "Marks Pending",
      value: stats.marksPending,
      icon: AlertTriangle,
      color: "from-rose-500 to-red-600",
      bg: "bg-rose-500/8",
      text: "text-rose-600 dark:text-rose-400"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={cn(
              "relative overflow-hidden rounded-2xl border border-border/40 bg-card p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-default",
              card.bg
            )}
          >
            <div className={cn("size-8 rounded-xl flex items-center justify-center bg-gradient-to-br", card.color)}>
              <Icon className="size-4 text-white" />
            </div>
            <p className={cn("text-2xl font-extrabold tabular-nums", card.text)}>{card.value}</p>
            <p className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wide leading-tight">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}
