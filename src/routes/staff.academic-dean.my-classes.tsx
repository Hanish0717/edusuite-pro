import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Clock, Users, CheckCircle2, UserCheck } from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAcademicDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/academic-dean/my-classes")({
  head: () => ({
    meta: [{ title: "My Classes — Academic Dean" }],
  }),
  component: MyClassesPage,
});

function MyClassesPage() {
  const data = useMemo(() => getAcademicDeanDashboardData(), []);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // Generate 60 students dynamically for the selected class
  const students = useMemo(() => {
    return Array.from({ length: 60 }).map((_, idx) => {
      const isAbsent = idx % 9 === 0;
      const isLate = idx % 14 === 0 && !isAbsent;
      return {
        rollNo: `22CS${101 + idx}`,
        name: `Student Name ${idx + 1}`,
        status: isAbsent ? "Absent" : isLate ? "Late" : "Present",
      };
    });
  }, []);

  const presentCount = students.filter((s) => s["status"] === "Present").length;
  const absentCount = students.filter((s) => s["status"] === "Absent").length;
  const attendancePct = Math.round((presentCount / students.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Today's Scheduled Classes</h1>
        <p className="text-sm text-muted-foreground">
          Open attendance register for scheduled teaching sessions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Scheduled Sessions" value={String(data.myTimetable.todaysClasses.length)} icon={Clock} tone="info" />
        <KpiCard label="Enrolled Students / Class" value="60 Students" icon={Users} tone="purple" />
        <KpiCard label="Average Attendance %" value={`${attendancePct}%`} icon={CheckCircle2} tone="success" />
        <KpiCard label="Pending Attendance" value="1 Session" icon={UserCheck} tone="warning" />
      </div>

      <Panel title="Today's Active Classes" description="Click on any class session to open the live student attendance register.">
        <div className="grid gap-4 sm:grid-cols-2">
          {data.myTimetable.todaysClasses.map((cls, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-[0.65rem]">{cls.timeSlot}</Badge>
                <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{cls.room}</Badge>
              </div>
              <h4 className="font-bold text-sm text-foreground">{cls.subjectCode} - {cls.subjectName}</h4>
              <p className="text-xs text-muted-foreground">Class: {cls.branch} Sem {cls.semester} - {cls.section}</p>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedClass(`${cls.subjectCode} (${cls.section})`);
                  toast.info(`Opening attendance register for ${cls.subjectCode}`);
                }}
                className="w-full bg-brand-gradient text-xs cursor-pointer gap-1"
              >
                <UserCheck className="size-3.5" /> Open Attendance Register (60 Students)
              </Button>
            </div>
          ))}
        </div>
      </Panel>

      {selectedClass && (
        <Panel title={`Attendance Register — ${selectedClass}`} description={`Attendance Summary: ${presentCount} Present, ${absentCount} Absent (${attendancePct}% Attendance)`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-600 font-bold">Present: {presentCount}</span>
              <span className="text-rose-600 font-bold">Absent: {absentCount}</span>
              <span className="text-primary font-bold">Total: 60 Students</span>
            </div>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3">Roll Number</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3 text-center">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {students.map((st) => (
                    <tr key={st.rollNo} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-primary">{st.rollNo}</td>
                      <td className="p-3 font-bold text-foreground">{st.name}</td>
                      <td className="p-3 text-center">
                        <Badge className={st["status"] === "Present" ? "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]" : st["status"] === "Absent" ? "bg-rose-500/10 text-rose-600 font-mono text-[0.65rem]" : "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]"}>
                          {st["status"]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                size="sm"
                onClick={() => {
                  toast.success(`Attendance submitted and saved successfully for ${selectedClass}!`);
                  setSelectedClass(null);
                }}
                className="bg-brand-gradient text-xs cursor-pointer gap-1"
              >
                Save & Submit Attendance
              </Button>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
