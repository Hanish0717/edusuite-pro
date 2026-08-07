import React from "react";
import { Calendar, User, Radio, CheckCircle2, Award, Clock, Users } from "lucide-react";
import { WebinarTab } from "./types";

interface WebinarStatsProps {
  onTabClick: (tab: WebinarTab) => void;
}

export function WebinarStatsCards({ onTabClick }: WebinarStatsProps) {
  const cards = [
    {
      id: "upcoming",
      title: "Upcoming Webinars",
      value: "08",
      subtext: "View all upcoming",
      icon: Calendar,
      tab: "upcoming" as const,
    },
    {
      id: "registered",
      title: "Registered Webinars",
      value: "05",
      subtext: "View your registrations",
      icon: User,
      tab: "registered" as const,
    },
    {
      id: "live",
      title: "Live Sessions",
      value: "01",
      subtext: "Join live now",
      icon: Radio,
      tab: "live" as const,
    },
    {
      id: "completed",
      title: "Completed Sessions",
      value: "12",
      subtext: "View completed",
      icon: CheckCircle2,
      tab: "completed" as const,
    },
    {
      id: "certificates",
      title: "Certificates Earned",
      value: "06",
      subtext: "View certificates",
      icon: Award,
      tab: "certificates" as const,
    },
    {
      id: "hours",
      title: "Learning Hours",
      value: "28 hrs",
      subtext: "Total time spent",
      icon: Clock,
      tab: "upcoming" as const,
    },
    {
      id: "speakers",
      title: "Expert Speakers",
      value: "14",
      subtext: "Learn from experts",
      icon: Users,
      tab: "upcoming" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onTabClick(card.tab)}
            className="flex flex-col justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer min-h-[110px]"
          >
            {/* Top row: Icon on left, Number on right */}
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                <IconComponent className="size-4" />
              </div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {card.value}
              </span>
            </div>

            {/* Bottom info: Title & Subtext */}
            <div className="mt-2">
              <h3 className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 leading-tight">
                {card.title}
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium truncate">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
