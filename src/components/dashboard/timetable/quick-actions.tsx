import React from "react";
import { BookOpen, CalendarCheck, ClipboardList, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

interface QuickActionsProps {
  onViewSubjectDetails?: () => void;
}

export function QuickActions({ onViewSubjectDetails }: QuickActionsProps) {
  const actions = [
    {
      label: "View Subject Details",
      icon: BookOpen,
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      onClick: onViewSubjectDetails,
    },
    {
      label: "Open Lesson Plan",
      icon: ClipboardList,
      color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
      route: "/faculty/lesson-plan",
    },
    {
      label: "View Attendance",
      icon: CalendarCheck,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      route: "/faculty/attendance",
    },
    {
      label: "View Study Materials",
      icon: FileText,
      color: "bg-violet-500/10 text-violet-600 border-violet-500/20",
      route: "/faculty/materials",
    },
    {
      label: "Open Assignment",
      icon: CheckCircle2,
      color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      route: "/faculty/assignments",
    },
  ];

  return (
    <Card className="p-4 border-border/80 rounded-2xl bg-card space-y-3 text-xs">
      <h4 className="font-display font-extrabold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border/60 pb-2">
        <ArrowRight className="size-3.5 text-primary" /> Timetable Quick Navigation Actions
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {actions.map((act, idx) => {
          if (act.route) {
            return (
              <Link
                key={idx}
                to={act.route as any}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all hover:bg-muted/30 border-border/70 group"
              >
                <span className={`grid size-7 place-items-center rounded-lg border mb-1 ${act.color}`}>
                  <act.icon className="size-3.5" />
                </span>
                <span className="font-bold text-[0.68rem] text-foreground group-hover:text-primary transition-colors truncate w-full">
                  {act.label}
                </span>
              </Link>
            );
          }

          return (
            <div
              key={idx}
              onClick={act.onClick}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all hover:bg-muted/30 border-border/70 cursor-pointer group"
            >
              <span className={`grid size-7 place-items-center rounded-lg border mb-1 ${act.color}`}>
                <act.icon className="size-3.5" />
              </span>
              <span className="font-bold text-[0.68rem] text-foreground group-hover:text-primary transition-colors truncate w-full">
                {act.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
