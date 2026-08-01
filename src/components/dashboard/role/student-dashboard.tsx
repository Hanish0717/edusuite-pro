import { useMemo } from "react";
import { Award, BookOpen, Calendar, GraduationCap } from "lucide-react";

import { GroupedBarChart, TrendAreaChart } from "@/components/dashboard/charts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import {
  ActivityWidget,
  AiInsightsWidget,
  QuickActionsWidget,
} from "@/components/dashboard/widgets";

import {
  fetchStudentStats,
  fetchSemesterProgress,
  fetchMonthlyAttendance,
  fetchUpcomingEvents,
} from "@/lib/studentService";

export function StudentDashboard() {
  const stats = useMemo(() => fetchStudentStats(), []);
  const semesterProgress = useMemo(() => fetchSemesterProgress(), []);
  const monthlyAttendance = useMemo(() => fetchMonthlyAttendance(), []);
  const upcomingEvents = useMemo(() => fetchUpcomingEvents(), []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="CGPA" value={stats.cgpa} icon={Award} tone="success" delta="0.08" />
        <KpiCard label="Attendance" value={stats.attendance} icon={GraduationCap} delta="2.1%" />
        <KpiCard label="Enrolled Courses" value={stats.enrolledCourses} icon={BookOpen} tone="info" />
        <KpiCard label="Credits Earned" value={stats.creditsEarned} icon={Calendar} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Academic Progress" description="SGPA and CGPA trend by semester">
          <TrendAreaChart
            data={semesterProgress as unknown as Record<string, unknown>[]}
            xKey="term"
            series={[
              { key: "sgpa", label: "SGPA" },
              { key: "cgpa", label: "CGPA" },
            ]}
            height={260}
          />
        </Panel>

        <Panel title="Monthly Attendance Breakdown" description="Present, absent and leave split">
          <GroupedBarChart
            data={monthlyAttendance as unknown as Record<string, unknown>[]}
            xKey="month"
            series={[
              { key: "present", label: "Present" },
              { key: "absent", label: "Absent" },
              { key: "leave", label: "Leave" },
            ]}
            height={260}
          />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AiInsightsWidget />
        <Panel title="Upcoming Deadlines & Events" description="Action required">
          <ul className="space-y-3 text-xs">
            {upcomingEvents.map((item) => (
              <li
                key={item.title}
                className="flex items-center justify-between rounded-lg border border-border/70 bg-card p-2.5"
              >
                <span className="font-medium">{item.title}</span>
                <span className="font-mono text-muted-foreground">{item.meta}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <ActivityWidget />
      </div>

      <QuickActionsWidget
        actions={[
          "View timetable",
          "Download hall ticket",
          "Pay semester fee",
          "Apply leave",
          "Browse library",
        ]}
      />
    </div>
  );
}
