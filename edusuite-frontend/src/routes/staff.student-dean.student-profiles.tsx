import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Users, ShieldAlert, Award, CalendarCheck, CheckCircle2 } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getStudentDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/student-dean/student-profiles")({
  head: () => ({
    meta: [{ title: "Student Profiles — Student Dean" }],
  }),
  component: SubPage,
});

function SubPage() {
  const data = useMemo(() => getStudentDeanDashboardData(), []);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Profiles</h1>
        <p className="text-sm text-muted-foreground">Detailed academic dossiers and attendance logs.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Enrolled Students" value={data.kpis.totalStudents.toLocaleString()} icon={Users} tone="info" />
        <KpiCard label="Average Attendance" value={data.kpis.overallAttendancePct} icon={CalendarCheck} tone="success" />
        <KpiCard label="Active Grievances" value={String(data.kpis.activeGrievances)} icon={ShieldAlert} tone="warning" />
        <KpiCard label="Scholarships" value={data.kpis.scholarshipsApproved} icon={Award} tone="purple" />
      </div>

      <Panel title="Student Profiles Directory" description="Searchable ERP records.">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search directory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Roll Number</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Academic Year</th>
                  <th className="p-3 text-center">Attendance %</th>
                  <th className="p-3 text-center">CGPA</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {data.students
                  .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase()))
                  .map((s) => (
                    <tr key={s.rollNo} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-primary">{s.rollNo}</td>
                      <td className="p-3 font-bold text-foreground">{s.name}</td>
                      <td className="p-3 font-mono font-bold">{s.department}</td>
                      <td className="p-3 font-mono">{s.year}</td>
                      <td className="p-3 text-center font-mono font-bold text-emerald-600">{s.attendance}%</td>
                      <td className="p-3 text-center font-mono font-bold">{s.cgpa}</td>
                      <td className="p-3 text-center">
                        <Badge className={s.status === "Active" ? "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]" : "bg-rose-500/10 text-rose-600 font-mono text-[0.65rem]"}>
                          {s.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </div>
      </Panel>
    </div>
  );
}
