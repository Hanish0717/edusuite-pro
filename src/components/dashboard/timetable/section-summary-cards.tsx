import React from "react";
import { BookOpen, FlaskConical, Clock, Coffee, Sparkles, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SectionSummaryCardsProps {
  summary: {
    totalSubjects: number;
    theoryClasses: number;
    labSessions: number;
    freePeriods: number;
    todaysClassesCount: number;
    upcomingClass: string;
  };
}

export function SectionSummaryCards({ summary }: SectionSummaryCardsProps) {
  const cards = [
    { label: "Total Subjects", value: `${summary.totalSubjects}`, sub: "Registered Courses", icon: BookOpen, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { label: "Theory Classes", value: `${summary.theoryClasses}`, sub: "Weekly Lectures", icon: BookOpen, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
    { label: "Lab Sessions", value: `${summary.labSessions}`, sub: "Practical Work", icon: FlaskConical, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    { label: "Free Periods", value: `${summary.freePeriods}`, sub: "Study / Mentoring", icon: Coffee, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    { label: "Today's Classes", value: `${summary.todaysClassesCount}`, sub: "Active Schedule", icon: CalendarDays, color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
    { label: "Upcoming Class", value: summary.upcomingClass.split(" (")[0] || "Operating Systems", sub: summary.upcomingClass.split(" (")[1] ? `(${summary.upcomingClass.split(" (")[1]}` : "A-302 @ 09:00", icon: Sparkles, color: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
      {cards.map((c, idx) => (
        <Card key={idx} className="border border-border/70 py-0 shadow-xs hover:shadow-card transition-all">
          <CardContent className="p-3 flex flex-col justify-between h-full space-y-1.5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[0.6rem] font-bold text-muted-foreground uppercase leading-snug truncate" title={c.label}>
                {c.label}
              </span>
              <span className={`grid size-6 place-items-center rounded-lg border ${c.color}`}>
                <c.icon className="size-3" />
              </span>
            </div>
            <div>
              <p className="font-mono text-base font-extrabold text-foreground truncate" title={c.value}>
                {c.value}
              </p>
              <p className="text-[0.6rem] text-muted-foreground truncate">{c.sub}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
