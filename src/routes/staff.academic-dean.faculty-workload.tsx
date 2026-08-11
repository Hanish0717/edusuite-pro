import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, Clock, ShieldCheck, AlertCircle } from "lucide-react";

import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAcademicDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/academic-dean/faculty-workload")({
  head: () => ({
    meta: [{ title: "Faculty Workload — Academic Dean" }],
  }),
  component: FacultyWorkloadPage,
});

function FacultyWorkloadPage() {
  const data = useMemo(() => getAcademicDeanDashboardData(), []);
  const [search, setSearch] = useState("");

  const filteredFaculty = data.facultyList.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f["department"].toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Faculty Teaching Workload</h1>
        <p className="text-sm text-muted-foreground">
          Audit weekly assigned teaching hours, remaining hours, and semester load distribution.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Average Workload" value="16.4 Hrs/Wk" icon={Clock} tone="info" />
        <KpiCard label="Compliant Faculty" value={`${data.facultyList.length - 2} / ${data.facultyList.length}`} icon={ShieldCheck} tone="success" />
        <KpiCard label="Workload Threshold Alerts" value="2 Alerts" icon={AlertCircle} tone="warning" />
      </div>

      <Panel title="Weekly Workload Audit Ledger" description="Inspect assigned subjects, weekly hours, remaining capacity, and current semester.">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search faculty name or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Faculty Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Assigned Subjects</th>
                  <th className="p-3 text-center">Weekly Hours</th>
                  <th className="p-3 text-center">Remaining Capacity</th>
                  <th className="p-3 text-center">Semester</th>
                  <th className="p-3 text-center">Workload Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {filteredFaculty.map((f) => {
                  const remaining = f.maxWorkloadHours - f.workloadHours;
                  const isHigh = f.workloadHours >= 18;
                  return (
                    <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-bold text-foreground">{f.name}</td>
                      <td className="p-3 font-mono font-bold text-primary">{f["department"]}</td>
                      <td className="p-3 text-muted-foreground">{f.subjects.join(", ")}</td>
                      <td className="p-3 text-center font-mono font-bold text-emerald-600">{f.workloadHours} Hrs</td>
                      <td className="p-3 text-center font-mono">{remaining} Hrs</td>
                      <td className="p-3 text-center font-mono">Autumn 2026</td>
                      <td className="p-3 text-center">
                        <Badge className={isHigh ? "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]" : "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]"}>
                          {isHigh ? "High Load" : "Optimal"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  );
}
