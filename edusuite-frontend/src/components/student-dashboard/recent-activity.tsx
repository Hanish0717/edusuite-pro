import React from "react";
import { ActivityItem } from "./types";
import { History, CheckCircle2, FileCheck, CreditCard, BookOpen, Bell, Ticket } from "lucide-react";

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivityTimeline: React.FC<RecentActivityProps> = ({ activities }) => {
  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "attendance":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
      case "assignment":
        return <FileCheck className="h-3.5 w-3.5 text-amber-500" />;
      case "fee":
        return <CreditCard className="h-3.5 w-3.5 text-rose-500" />;
      case "library":
        return <BookOpen className="h-3.5 w-3.5 text-cyan-500" />;
      case "notice":
        return <Bell className="h-3.5 w-3.5 text-indigo-500" />;
      case "exam":
        return <Ticket className="h-3.5 w-3.5 text-purple-500" />;
      default:
        return <History className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <History className="h-4 w-4 text-primary" /> Recent Activity Log
        </h3>
        <span className="text-xs text-muted-foreground font-medium">Realtime Timeline</span>
      </div>

      <div className="relative pl-4 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
        {activities.map((act) => (
          <div key={act.id} className="relative flex items-start justify-between gap-3 text-xs">
            <div className="absolute -left-4 top-1.5 p-0.5 rounded-full bg-card border border-border">
              {getIcon(act.type)}
            </div>
            <div>
              <p className="font-semibold text-foreground">{act.title}</p>
              <span className="text-[11px] text-muted-foreground">{act.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
