import { Sparkles } from "lucide-react";

import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRole } from "@/context/role-context";
import {
  aiInsightsByRole,
  pendingTasks,
  recentActivities,
  todaysSchedule,
  upcomingEvents,
} from "@/data/mock";
import { cn } from "@/lib/utils";

const toneBar = {
  primary: "bg-primary",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
};

export function ScheduleWidget({ title = "Today's Schedule" }: { title?: string }) {
  return (
    <Panel title={title} description="Classes and sessions for today">
      <ul className="space-y-3">
        {todaysSchedule.map((slot) => (
          <li key={slot.title} className="flex gap-3 rounded-xl bg-muted/60 p-3">
            <span className={cn("w-1 shrink-0 rounded-full", toneBar[slot.tone])} />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">{slot.time}</p>
              <p className="truncate text-sm font-semibold">{slot.title}</p>
            </div>
            <Badge variant="secondary" className="h-fit shrink-0">
              {slot.room}
            </Badge>
          </li>
        ))}
      </ul>
      <Button variant="link" className="mt-2 h-auto px-0">
        View full timetable
      </Button>
    </Panel>
  );
}

export function TasksWidget() {
  return (
    <Panel title="My Tasks" description="Pending actions assigned to you">
      <ul className="space-y-3">
        {pendingTasks.map((task) => (
          <li key={task.title} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{task.title}</p>
              <p className="text-xs text-muted-foreground">{task.due}</p>
            </div>
            <Badge
              variant={task.status === "Urgent" ? "destructive" : "secondary"}
              className="shrink-0"
            >
              {task.status}
            </Badge>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function UpcomingWidget() {
  return (
    <Panel title="Upcoming" description="Deadlines and campus events">
      <ul className="space-y-3">
        {upcomingEvents.map((event) => (
          <li key={event.title} className="flex items-start justify-between gap-3">
            <p className="truncate text-sm font-medium">{event.title}</p>
            <span className="shrink-0 text-xs text-muted-foreground">{event.meta}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function ActivityWidget() {
  return (
    <Panel title="Recent Activities" description="Latest actions across your scope">
      <ul className="space-y-3">
        {recentActivities.map((item) => (
          <li key={item.title} className="border-l-2 border-primary/40 pl-3">
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.meta}</p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function AiInsightsWidget() {
  const { role } = useRole();
  const insights = aiInsightsByRole[role] ?? [];

  return (
    <Panel
      title="AI Insights"
      description="Generated from your live campus data"
      action={
        <span className="grid size-9 place-items-center rounded-xl bg-brand-gradient text-primary-foreground">
          <Sparkles className="size-4" />
        </span>
      }
    >
      <ul className="space-y-2.5">
        {insights.map((insight) => (
          <li key={insight} className="rounded-xl bg-muted/70 px-3 py-2 text-sm leading-relaxed">
            {insight}
          </li>
        ))}
      </ul>
      <Button className="mt-4 w-full bg-brand-gradient shadow-glow">View AI Insights</Button>
    </Panel>
  );
}

export function QuickActionsWidget({ actions }: { actions: string[] }) {
  return (
    <Panel title="Quick Actions" description="One-click shortcuts">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button key={action} variant="outline" size="sm" className="rounded-full">
            {action}
          </Button>
        ))}
      </div>
    </Panel>
  );
}

export function CalendarWidget() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const marked = [5, 12, 18, 25, 27];

  return (
    <Panel title="Academic Calendar" description="May 2024">
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={`${d}-${i}`} className="py-1 font-semibold text-muted-foreground">
            {d}
          </span>
        ))}
        {days.map((day) => (
          <span
            key={day}
            className={cn(
              "grid aspect-square place-items-center rounded-lg transition-colors",
              marked.includes(day)
                ? "bg-primary font-semibold text-primary-foreground"
                : "hover:bg-muted",
            )}
          >
            {day}
          </span>
        ))}
      </div>
    </Panel>
  );
}

export function LoadingWidget() {
  return (
    <Panel title="Loading">
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    </Panel>
  );
}
