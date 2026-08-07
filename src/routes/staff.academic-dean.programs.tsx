import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, BookOpen, GraduationCap, CheckCircle2 } from "lucide-react";

import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAcademicDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/academic-dean/programs")({
  head: () => ({
    meta: [{ title: "Academic Programs — Academic Dean" }],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const data = useMemo(() => getAcademicDeanDashboardData(), []);
  const [search, setSearch] = useState("");

  const filteredPrograms = data.programs.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase()) ||
      p.coordinator.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Academic Degree Programs</h1>
        <p className="text-sm text-muted-foreground">
          Directory of 38 undergraduate, postgraduate, and doctoral degree programs.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Total Degree Programs" value={data.programs.length} icon={BookOpen} tone="purple" />
        <KpiCard label="Active Enrolled Students" value={data.kpis.students.toLocaleString()} icon={GraduationCap} tone="success" />
        <KpiCard label="Program Coordinators" value={data.programs.length} icon={CheckCircle2} tone="info" />
      </div>

      <Panel title="Degree Programs Register" description="Filter programs by name, department, or coordinator.">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search program, code or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Program Code</th>
                  <th className="p-3">Program Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3 text-right">Enrolled Students</th>
                  <th className="p-3">Coordinator</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {filteredPrograms.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-primary">{p.code}</td>
                    <td className="p-3 font-bold text-foreground">{p.name}</td>
                    <td className="p-3 text-muted-foreground">{p.department}</td>
                    <td className="p-3 font-mono">{p.duration}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-600">{p.students}</td>
                    <td className="p-3 font-medium">{p.coordinator}</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{p.status}</Badge>
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
