import { BookOpen, CalendarCheck, ClipboardList, Users } from "lucide-react";

import { ChartLegend, DonutChart } from "@/components/dashboard/charts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import {
  AiInsightsWidget,
  CalendarWidget,
  ScheduleWidget,
  TasksWidget,
  QuickActionsWidget,
} from "@/components/dashboard/widgets";
import { attendanceSplit } from "@/data/mock";

export function StaffDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="My Classes" value="6" icon={BookOpen} />
        <KpiCard label="Students" value="142" icon={Users} tone="info" />
        <KpiCard label="Attendance Today" value="92%" icon={CalendarCheck} delta="3%" tone="success" />
        <KpiCard label="Pending Tasks" value="8" icon={ClipboardList} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ScheduleWidget />
        <TasksWidget />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Attendance Overview" description="Across my subjects">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <DonutChart data={attendanceSplit} centerLabel="92%" />
            <ChartLegend items={attendanceSplit} />
          </div>
        </Panel>
        <AiInsightsWidget />
        <CalendarWidget />
      </div>

      <QuickActionsWidget
        actions={["Mark attendance", "Upload notes", "Create quiz", "Enter internal marks", "Apply leave"]}
      />
    </div>
  );
}
