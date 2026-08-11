import React from "react";
import { RecentActivityItem } from "./types";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  CreditCard,
  CalendarCheck,
  FileCheck,
  BookOpen,
  FileSpreadsheet,
  CalendarPlus,
  Award,
  Clock,
} from "lucide-react";

interface ActivityWidgetProps {
  activities: RecentActivityItem[];
}

export function ActivityWidget({ activities }: ActivityWidgetProps) {
  const getIcon = (type: RecentActivityItem["type"]) => {
    switch (type) {
      case "Fee":
        return <CreditCard className="h-3.5 w-3.5 text-emerald-600" />;
      case "Attendance":
        return <CalendarCheck className="h-3.5 w-3.5 text-blue-600" />;
      case "Assignment":
        return <FileCheck className="h-3.5 w-3.5 text-purple-600" />;
      case "Library":
        return <BookOpen className="h-3.5 w-3.5 text-amber-600" />;
      case "Hall Ticket":
        return <FileSpreadsheet className="h-3.5 w-3.5 text-rose-600" />;
      case "Leave":
        return <CalendarPlus className="h-3.5 w-3.5 text-indigo-600" />;
      case "Result":
        return <Award className="h-3.5 w-3.5 text-cyan-600" />;
      default:
        return <Activity className="h-3.5 w-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              SECTION 15: RECENT SYSTEM ACTIVITY LOG
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Real-time audit log of student portal actions
            </p>
          </div>
        </div>

        <Badge variant="outline" className="text-[10px] font-mono text-slate-500">
          Live Audit
        </Badge>
      </div>

      <div className="space-y-2">
        {activities.map((act) => (
          <div
            key={act.id}
            className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
                {getIcon(act.type)}
              </div>
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  {act.title}
                </span>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {act.timestamp}
                </span>
              </div>
            </div>

            <Badge
              className={`text-[9px] px-2 py-0.5 font-mono ${
                act.status === "Completed" || act.status === "Published"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : act.status === "Submitted" || act.status === "Issued"
                  ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
              }`}
            >
              {act.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
