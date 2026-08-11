import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";

import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAcademicDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/academic-dean/course-allocation")({
  head: () => ({
    meta: [{ title: "Course Allocation — Academic Dean" }],
  }),
  component: CourseAllocationPage,
});

function CourseAllocationPage() {
  const data = useMemo(() => getAcademicDeanDashboardData(), []);
  const [search, setSearch] = useState("");

  const filteredAllocations = data.courseAllocations.filter(
    (c) =>
      c.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
      c.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      c["facultyName"].toLowerCase().includes(search.toLowerCase()) ||
      c["department"].toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Course Allocation</h1>
        <p className="text-sm text-muted-foreground">
          Subject and faculty course mapping for Autumn 2026 semester across sections and branches.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Total Allocated Courses" value={String(data.courseAllocations.length)} icon={BookOpen} tone="purple" />
        <KpiCard label="Allocated Courses" value={String(data.courseAllocations.filter((c) => c["status"] === "Allocated").length)} icon={CheckCircle2} tone="success" />
        <KpiCard label="Pending Sign-offs" value={String(data.courseAllocations.filter((c) => c["status"] === "Pending").length)} icon={AlertCircle} tone="warning" />
      </div>

      <Panel title="Semester Course Mapping Ledger" description="View subject code, faculty, department, semester, section, credits, and allocation status.">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by Code, Subject, Faculty or Department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Subject Code</th>
                  <th className="p-3">Subject Name</th>
                  <th className="p-3">Assigned Faculty</th>
                  <th className="p-3">Department</th>
                  <th className="p-3 text-center">Semester</th>
                  <th className="p-3 text-center">Section</th>
                  <th className="p-3 text-center">Credits</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {filteredAllocations.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-primary">{c.subjectCode}</td>
                    <td className="p-3 font-bold text-foreground">{c.subjectName}</td>
                    <td className="p-3 font-medium">{c["facultyName"]}</td>
                    <td className="p-3 font-mono font-bold">{c["department"]}</td>
                    <td className="p-3 text-center font-mono">Sem {c.semester}</td>
                    <td className="p-3 text-center font-mono">{c.section}</td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-600">{c.credits} Credits</td>
                    <td className="p-3 text-center">
                      <Badge className={c["status"] === "Allocated" ? "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]" : "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]"}>
                        {c["status"]}
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
