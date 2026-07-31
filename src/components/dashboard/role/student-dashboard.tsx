import { Award, CalendarCheck, IndianRupee, ListChecks } from "lucide-react";

import { ChartLegend, DonutChart, TrendLineChart } from "@/components/dashboard/charts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import {
  AiInsightsWidget,
  ScheduleWidget,
  UpcomingWidget,
  QuickActionsWidget,
} from "@/components/dashboard/widgets";
import { attendanceSplit, semesterProgress } from "@/data/mock";

export function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Attendance" value="88%" icon={CalendarCheck} delta="2%" tone="success" />
        <KpiCard label="CGPA" value="8.45" icon={Award} delta="0.08" />
        <KpiCard label="Backlogs" value="0" icon={ListChecks} tone="info" />
        <KpiCard label="Fee Due" value="Rs 0" icon={IndianRupee} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ScheduleWidget title="Today's Timetable" />
        <UpcomingWidget />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Subject Wise Attendance" description="Current semester">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <DonutChart data={attendanceSplit} centerLabel="88%" />
            <ChartLegend items={attendanceSplit} />
          </div>
        </Panel>
        <Panel title="Academic Progress" description="SGPA vs CGPA" className="lg:col-span-2">
          <TrendLineChart
            data={semesterProgress}
            xKey="term"
            series={[
              { key: "sgpa", label: "SGPA" },
              { key: "cgpa", label: "CGPA" },
            ]}
          />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AiInsightsWidget />
        <QuickActionsWidget
          actions={["Submit assignment", "Download hall ticket", "Pay fees", "Apply leave", "Library search"]}
        />
      </div>
    </div>
  );
}
