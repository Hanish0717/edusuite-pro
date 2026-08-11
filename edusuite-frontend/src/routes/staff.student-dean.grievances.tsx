import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, ShieldAlert, CheckCircle2, Clock, AlertTriangle, Plus } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getStudentDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/student-dean/grievances")({
  head: () => ({
    meta: [{ title: "Student Grievances Redressal — Student Dean" }],
  }),
  component: GrievancesPage,
});

function GrievancesPage() {
  const data = useMemo(() => getStudentDeanDashboardData(), []);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              STUDENT WELFARE
            </Badge>
            <span className="text-xs text-muted-foreground">• Grievance Redressal Cell</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Student Grievances</h1>
          <p className="text-sm text-muted-foreground">Manage complaint cases, resolution timelines, and assigned committee officers.</p>
        </div>

        <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
          <Plus className="size-3.5" /> Log New Grievance
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Open Cases" value="2 Cases" icon={ShieldAlert} tone="warning" />
        <KpiCard label="In Progress" value="1 Case" icon={Clock} tone="info" />
        <KpiCard label="Resolved Cases" value="18 Cases" icon={CheckCircle2} tone="success" />
        <KpiCard label="High Priority" value="1 Case" icon={AlertTriangle} tone="purple" />
      </div>

      <Panel title="Active Student Complaints & Resolutions" description="Real-time case tracking & resolution timeline.">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search complaint category or student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Grievance Ref ID</th>
                  <th className="p-3">Complainant Student</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Assigned Officer</th>
                  <th className="p-3">Target Timeline</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {data.grievances
                  .filter((g) => g.student.toLowerCase().includes(search.toLowerCase()) || g.category.toLowerCase().includes(search.toLowerCase()))
                  .map((g) => (
                    <tr key={g.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-primary">{g.id}</td>
                      <td className="p-3 font-bold text-foreground">{g.student}</td>
                      <td className="p-3 font-mono font-bold">{g.category}</td>
                      <td className="p-3">
                        <Badge className={g.priority === "High" ? "bg-rose-500/10 text-rose-600 font-mono text-[0.65rem]" : "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]"}>
                          {g.priority}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono">{g.assignedOfficer}</td>
                      <td className="p-3 font-mono text-muted-foreground">{g.timeline}</td>
                      <td className="p-3 text-center">
                        <Badge className={g.status === "Closed" ? "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]" : "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]"}>
                          {g.status}
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
