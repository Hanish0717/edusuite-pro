import { BookOpen, Award, CheckCircle2, TrendingUp, ShieldAlert, Library, Briefcase, DollarSign, Eye, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResearchStats } from "./types";

interface StatisticsCardsProps {
  stats: ResearchStats;
}

export function StatisticsCards({ stats }: StatisticsCardsProps) {
  const cards = [
    {
      label: "Total Publications",
      value: stats.totalPublications,
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-500/8",
      text: "text-blue-600 dark:text-blue-400"
    },
    {
      label: "Scopus Indexed",
      value: stats.scopusIndexed,
      icon: Award,
      color: "from-indigo-500 to-indigo-600",
      bg: "bg-indigo-500/8",
      text: "text-indigo-600 dark:text-indigo-400"
    },
    {
      label: "SCI / SCIE Papers",
      value: stats.sciIndexed,
      icon: CheckCircle2,
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-500/8",
      text: "text-emerald-600 dark:text-emerald-400"
    },
    {
      label: "Conferences",
      value: stats.conferences,
      icon: TrendingUp,
      color: "from-sky-500 to-sky-600",
      bg: "bg-sky-500/8",
      text: "text-sky-600 dark:text-sky-400"
    },
    {
      label: "Patents",
      value: stats.patents,
      icon: ShieldAlert,
      color: "from-rose-500 to-rose-600",
      bg: "bg-rose-500/8",
      text: "text-rose-600 dark:text-rose-400"
    },
    {
      label: "Books Published",
      value: stats.books,
      icon: Library,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-500/8",
      text: "text-purple-600 dark:text-purple-400"
    },
    {
      label: "Projects",
      value: stats.projects,
      icon: Briefcase,
      color: "from-amber-500 to-amber-600",
      bg: "bg-amber-500/8",
      text: "text-amber-600 dark:text-amber-400"
    },
    {
      label: "Research Grants",
      value: stats.researchGrants,
      icon: DollarSign,
      color: "from-teal-500 to-teal-600",
      bg: "bg-teal-500/8",
      text: "text-teal-600 dark:text-teal-400"
    },
    {
      label: "Citations",
      value: stats.citations,
      icon: Eye,
      color: "from-orange-500 to-orange-600",
      bg: "bg-orange-500/8",
      text: "text-orange-600 dark:text-orange-400"
    },
    {
      label: "h-index (Mock)",
      value: stats.hIndex,
      icon: BarChart3,
      color: "from-fuchsia-500 to-fuchsia-600",
      bg: "bg-fuchsia-500/8",
      text: "text-fuchsia-600 dark:text-fuchsia-400"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
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
