import { useMemo } from "react";
import { BookOpen, Calendar, CheckCircle2, GraduationCap, Users } from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import {
  ActivityWidget,
  AiInsightsWidget,
  QuickActionsWidget,
} from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/badge";

import {
  fetchStaffStats,
  fetchStaffSchedule,
  fetchStaffPendingTasks,
} from "@/lib/staffService";

export function StaffDashboard() {
  const stats = useMemo(() => fetchStaffStats(), []);
  const schedule = useMemo(() => fetchStaffSchedule(), []);
  const pendingTasks = useMemo(() => fetchStaffPendingTasks(), []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Students Taught" value={stats.students} icon={Users} />
        <KpiCard label="Classes Today" value={stats.classesToday} icon={Calendar} tone="info" />
        <KpiCard label="Attendance Avg" value={stats.attendanceAvg} icon={GraduationCap} tone="success" />
        <KpiCard label="Pending Evaluations" value={stats.pendingEvaluations} icon={CheckCircle2} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Today's Schedule" description="Your assigned lectures & labs" className="lg:col-span-2">
          <div className="space-y-3">
            {schedule.map((item) => (
              <div
                key={item.time}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-card p-3.5"
              >
                <div>
                  <h4 className="font-display text-sm font-bold">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.room}</p>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  {item.time}
                </Badge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Pending Tasks" description="Reminders & deadlines">
          <ul className="space-y-3">
            {pendingTasks.map((task) => (
              <li key={task.title} className="rounded-xl border border-border/70 bg-card p-3 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span>{task.title}</span>
                  <Badge variant={task.status === "Urgent" ? "destructive" : "secondary"}>
                    {task.status}
                  </Badge>
                </div>
                <span className="text-muted-foreground mt-1 block font-mono text-[0.7rem]">
                  {task.due}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AiInsightsWidget />
        <ActivityWidget />
        <Panel title="Recent Materials" description="Uploaded courseware">
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-2 font-medium">
              <BookOpen className="size-4 text-primary" />
              <span>DBMS Unit 2 Slides.pdf</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-2 font-medium">
              <BookOpen className="size-4 text-primary" />
              <span>DS Lab Manual v3.pdf</span>
            </div>
          </div>
        </Panel>
      </div>

      <QuickActionsWidget
        actions={[
          "Mark attendance",
          "Upload syllabus",
          "Create assignment",
          "Post announcement",
          "Enter internal marks",
        ]}
      />
    </div>
  );
}
