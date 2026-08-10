import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Clock, BookOpen, User, CheckCircle2 } from "lucide-react";

import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { getAcademicDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/academic-dean/my-timetable")({
  head: () => ({
    meta: [{ title: "My Timetable — Academic Dean" }],
  }),
  component: MyTimetablePage,
});

function MyTimetablePage() {
  const data = useMemo(() => getAcademicDeanDashboardData(), []);
  const myTimetable = data.myTimetable;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Teaching Timetable</h1>
        <p className="text-sm text-muted-foreground">
          Teaching schedule for Prof. Anand Kumar (Academic Dean & Senior Professor).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Today's Classes" value={myTimetable.todaysClasses.length} icon={Clock} tone="info" />
        <KpiCard label="Assigned Subjects" value={myTimetable.assignedSubjects.length} icon={BookOpen} tone="purple" />
        <KpiCard label="Assigned Sections" value={myTimetable.sections.length} icon={User} tone="success" />
        <KpiCard label="Pending Attendance" value={myTimetable.pendingAttendanceCount} icon={CheckCircle2} tone="warning" />
      </div>

      <Panel title="Today's Scheduled Teaching Sessions" description="Live schedule of classes for today.">
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Time Slot</th>
                <th className="p-3">Subject Code</th>
                <th className="p-3">Subject Name</th>
                <th className="p-3">Room / Venue</th>
                <th className="p-3 text-center">Class / Section</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {myTimetable.todaysClasses.map((c, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono font-bold text-primary">{c.timeSlot}</td>
                  <td className="p-3 font-mono font-bold">{c.subjectCode}</td>
                  <td className="p-3 font-bold text-foreground">{c.subjectName}</td>
                  <td className="p-3 font-mono text-emerald-600 font-bold">{c.room}</td>
                  <td className="p-3 text-center font-mono">
                    {c.branch} Sem {c.semester} - {c.section}
                  </td>
                  <td className="p-3 text-center">
                    <Badge className={idx === 0 ? "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]" : "bg-muted text-muted-foreground font-mono text-[0.65rem]"}>
                      {idx === 0 ? "Completed" : "Upcoming"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
