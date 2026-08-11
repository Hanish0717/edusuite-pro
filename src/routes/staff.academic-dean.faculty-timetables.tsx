import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, Users, Clock, Building2 } from "lucide-react";

import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Input } from "@/components/ui/input";
import { getAcademicDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/academic-dean/faculty-timetables")({
  head: () => ({
    meta: [{ title: "Faculty Timetables — Academic Dean" }],
  }),
  component: FacultyTimetablesPage,
});

function FacultyTimetablesPage() {
  const data = useMemo(() => getAcademicDeanDashboardData(), []);
  const [search, setSearch] = useState("");

  const filteredFaculty = data.facultyList.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f["department"].toLowerCase().includes(search.toLowerCase()) ||
      f.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Faculty Timetable Inspector</h1>
        <p className="text-sm text-muted-foreground">
          Search and inspect weekly timetables for every faculty member across 15 departments.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Total Faculty" value={String(data.facultyList.length)} icon={Users} tone="info" />
        <KpiCard label="Departments Covered" value="15 Depts" icon={Building2} tone="purple" />
        <KpiCard label="Weekly Slots" value="480 Slots" icon={Clock} tone="success" />
      </div>

      <Panel title="Searchable Faculty Timetable Directory" description="Filter timetable schedules by Faculty Name, Department, or Subject Code.">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by Faculty, Department, or Subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Faculty ID</th>
                  <th className="p-3">Faculty Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Designation</th>
                  <th className="p-3">Assigned Subjects</th>
                  <th className="p-3 text-center">Weekly Load</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {filteredFaculty.map((f) => (
                  <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-primary">{f.facultyId}</td>
                    <td className="p-3 font-bold text-foreground">{f.name}</td>
                    <td className="p-3 font-mono font-bold">{f["department"]}</td>
                    <td className="p-3 text-muted-foreground">{f.designation}</td>
                    <td className="p-3 text-muted-foreground">{f.subjects.join(", ")}</td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-600">
                      {f.workloadHours} Hours
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
