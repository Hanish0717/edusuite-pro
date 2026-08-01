import React from "react";
import { SummaryMetrics } from "./types";
import { 
  Calendar, 
  Clock, 
  PlayCircle, 
  BookOpen, 
  FlaskConical, 
  CheckCircle2, 
  Coffee, 
  Video 
} from "lucide-react";

interface SummaryCardsProps {
  metrics: SummaryMetrics;
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  const cards = [
    {
      title: "Today's Classes",
      value: `${metrics.todaysClasses} Scheduled`,
      subtitle: "Full Day Active Schedule",
      icon: Calendar,
      gradient: "from-blue-600 to-indigo-600",
      lightBg: "bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Current Class",
      value: metrics.currentClass.split("•")[0] || "No Active Class",
      subtitle: metrics.currentClass.split("•")[1] || "Free Hour",
      icon: PlayCircle,
      gradient: "from-emerald-600 to-teal-600",
      lightBg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40",
      textColor: "text-emerald-600 dark:text-emerald-400",
      pulse: true,
    },
    {
      title: "Next Class",
      value: metrics.nextClass.split("•")[0] || "Day Complete",
      subtitle: metrics.nextClass.split("•")[1] || "11:15 AM",
      icon: Clock,
      gradient: "from-amber-500 to-orange-600",
      lightBg: "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Total Weekly Classes",
      value: `${metrics.totalWeeklyClasses} Lectures`,
      subtitle: "Semester 6 Schedule",
      icon: BookOpen,
      gradient: "from-purple-600 to-violet-600",
      lightBg: "bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/40",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Lab Sessions",
      value: `${metrics.labSessions} Practical Labs`,
      subtitle: "Hands-on Workstations",
      icon: FlaskConical,
      gradient: "from-rose-600 to-pink-600",
      lightBg: "bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/40",
      textColor: "text-rose-600 dark:text-rose-400",
    },
    {
      title: "Attendance This Week",
      value: `${metrics.attendanceThisWeek}%`,
      subtitle: "Target >= 85% Met",
      icon: CheckCircle2,
      gradient: "from-teal-600 to-emerald-600",
      lightBg: "bg-teal-50 dark:bg-teal-950/40 border-teal-100 dark:border-teal-900/40",
      textColor: "text-teal-600 dark:text-teal-400",
    },
    {
      title: "Free Periods",
      value: `${metrics.freePeriods} Slots`,
      subtitle: "Self-Study & Library",
      icon: Coffee,
      gradient: "from-sky-600 to-cyan-600",
      lightBg: "bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900/40",
      textColor: "text-sky-600 dark:text-sky-400",
    },
    {
      title: "Online Classes",
      value: `${metrics.onlineClasses} Virtual Rooms`,
      subtitle: "Interactive HD Video",
      icon: Video,
      gradient: "from-indigo-600 to-purple-600",
      lightBg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl border ${card.lightBg} bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md transition-all flex items-start justify-between relative overflow-hidden group`}
          >
            <div className="space-y-1 z-10 min-w-0 pr-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block truncate">
                {card.title}
              </span>
              <h3 className={`text-base font-extrabold truncate ${card.textColor}`}>
                {card.value}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {card.subtitle}
              </p>
            </div>

            <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${card.gradient} text-white shadow-xs shrink-0 relative ${card.pulse ? "animate-pulse" : ""}`}>
              <Icon className="h-5 w-5" />
            </div>

            {/* Decorative subtle background gradient blob */}
            <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-gradient-to-tr ${card.gradient} opacity-5 group-hover:opacity-10 transition-opacity blur-xl pointer-events-none`} />
          </div>
        );
      })}
    </div>
  );
}
