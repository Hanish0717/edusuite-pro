import { useMemo } from "react";
import { Activity, Sparkles } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";
import { useRole } from "@/context/role-context";
import { fetchActivities, fetchAiInsightsForRole } from "@/lib/dashboardService";

const ACTION_ROUTE_MAP: Record<string, { to: string; search?: Record<string, string> }> = {
  // Staff / Faculty Quick Actions
  "Mark attendance": { to: "/attendance" },
  "Upload syllabus": { to: "/academics", search: { tab: "curriculum" } },
  "Create assignment": { to: "/lms" },
  "Post announcement": { to: "/communication" },
  "Enter internal marks": { to: "/faculty/examinations", search: { tab: "Internal Marks" } },

  // HOD Quick Actions
  "Approve leave": { to: "/leave" },
  "Allocate faculty": { to: "/academics", search: { tab: "courses" } },
  "Publish results": { to: "/faculty/results" },
  "Schedule test": { to: "/faculty/examinations", search: { tab: "Exam Schedule" } },
  "Department report": { to: "/reports" },

  // Student Quick Actions
  "View timetable": { to: "/timetable" },
  "Download hall ticket": { to: "/faculty/examinations", search: { tab: "Hall Tickets" } },
  "Pay semester fee": { to: "/finance" },
  "Apply leave": { to: "/leave" },
  "Browse library": { to: "/library" },

  // Parent Quick Actions
  "Pay pending fees": { to: "/finance" },
  "Download report card": { to: "/faculty/results" },
  "Contact mentor": { to: "/communication" },
  "Apply leave for ward": { to: "/leave" },
  "View hostel status": { to: "/hostel" },
};

export function AiInsightsWidget() {
  const { role } = useRole();
  const insights = useMemo(() => fetchAiInsightsForRole(role), [role]);

  return (
    <Panel
      title="AI Academic Insights"
      description="Automated recommendations based on live metrics"
      action={<Sparkles className="size-4 text-primary animate-pulse" />}
    >
      <ul className="space-y-3">
        {insights.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs"
          >
            <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span className="leading-relaxed text-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function ActivityWidget() {
  const activities = useMemo(() => fetchActivities(), []);

  return (
    <Panel
      title="Recent Activity"
      description="System-wide real-time audit log"
      action={<Activity className="size-4 text-muted-foreground" />}
    >
      <ul className="space-y-3">
        {activities.map((act) => (
          <li key={act.id} className="flex items-start justify-between gap-3 text-xs">
            <span className="truncate font-medium text-foreground">{act.title}</span>
            <span className="shrink-0 font-mono text-[0.7rem] text-muted-foreground">
              {act.meta}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function QuickActionsWidget({ actions }: { actions: string[] }) {
  const navigate = useNavigate();

  const handleActionClick = (action: string) => {
    const target = ACTION_ROUTE_MAP[action];
    if (target) {
      toast.success(`Opening ${action}...`);
      navigate({ to: target.to, search: target.search as any });
    } else {
      toast.info(`Triggered operational action: ${action}`);
    }
  };

  return (
    <Panel title="Quick Actions" description="Frequently used operational shortcuts">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action}
            variant="outline"
            size="sm"
            onClick={() => handleActionClick(action)}
            className="text-xs cursor-pointer hover:border-primary/40 hover:bg-primary/5"
          >
            {action}
          </Button>
        ))}
      </div>
    </Panel>
  );
}
