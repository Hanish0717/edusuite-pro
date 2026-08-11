import { CalendarCheck, FileText, ClipboardList, Award, Users, RefreshCw } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import type { ActivityTimelineItem } from "@/data/faculty-mock-data";

interface ActivityTimelineProps {
  timeline: ActivityTimelineItem[];
}

export function ActivityTimeline({ timeline }: ActivityTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "Attendance":
        return CalendarCheck;
      case "Assignment":
        return ClipboardList;
      case "Materials":
        return FileText;
      case "Grades":
        return Award;
      case "Research":
        return RefreshCw;
      default:
        return Users;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "Attendance":
        return "bg-blue-500 text-white";
      case "Assignment":
        return "bg-violet-500 text-white";
      case "Materials":
        return "bg-emerald-500 text-white";
      case "Grades":
        return "bg-amber-500 text-white";
      case "Research":
        return "bg-indigo-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Panel
      title="Recent Activity Timeline"
      description="Chronological record of operational tasks performed in ERP"
      className="border border-border bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="relative border-l-2 border-border/60 pl-5 ml-3.5 space-y-5 text-xs py-1">
        {timeline.map((act) => {
          const IconComp = getIcon(act.type);
          const iconColor = getColor(act.type);
          return (
            <div key={act.id} className="relative group">
              {/* Timeline Icon Node */}
              <div className={`absolute -left-[29px] top-0.5 grid size-6 place-items-center rounded-full border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-110 ${iconColor}`}>
                <IconComp className="size-3 shrink-0" />
              </div>
              
              <div>
                <h5 className="font-semibold text-foreground leading-snug">
                  {act.title}
                </h5>
                <div className="flex items-center gap-1.5 mt-0.5 text-[0.65rem] text-muted-foreground">
                  <span>{act.type} Module</span>
                  <span>&middot;</span>
                  <span>{act.time}</span>
                </div>
              </div>
            </div>
          );
        })}
        {timeline.length === 0 && (
          <p className="text-xs text-muted-foreground italic text-center py-4">No recent activities recorded.</p>
        )}
      </div>
    </Panel>
  );
}
