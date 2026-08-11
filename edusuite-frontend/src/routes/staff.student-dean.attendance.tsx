import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, Download, CalendarCheck, AlertTriangle, UserX, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GroupedBarChart, DonutChart } from "@/components/dashboard/charts";
import { getStudentDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/student-dean/attendance")({
  head: () => ({
    meta: [{ title: "Attendance Register & Analytics — Student Dean" }],
  }),
  component: AttendancePage,
});

function AttendancePage() {
  const data = useMemo(() => getStudentDeanDashboardData(), []);
  const [search, setSearch] = useState("");
  const [thresholdFilter, setThresholdFilter] = useState("all");

  const lowAttendanceStudents = useMemo(() => {
    return data.students.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase());
      if (thresholdFilter === "below75") return matchSearch && s.attendance < 75;
      if (thresholdFilter === "below65") return matchSearch && s.attendance < 65;
      if (thresholdFilter === "below50") return matchSearch && s.attendance < 50;
      return matchSearch;
    });
  }, [data.students, search, thresholdFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              ATTENDANCE MONITORING
            </Badge>
            <span className="text-xs text-muted-foreground">• Institutional Attendance Analytics</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Student Attendance</h1>
          <p className="text-sm text-muted-foreground">Department-wise, semester-wise attendance metrics and low-attendance shortage alerts.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> Export Shortage List
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Overall Attendance" value={data.kpis.overallAttendancePct} icon={CalendarCheck} tone="info" />
        <KpiCard label="Students Below 75%" value="142 Students" icon={AlertTriangle} tone="warning" />
        <KpiCard label="Students Below 65%" value="38 Students" icon={UserX} tone="warning" />
        <KpiCard label="Critical Below 50%" value="12 Students" icon={AlertTriangle} tone="purple" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Department-wise Attendance Averages" description="Average attendance percentage across departments.">
          <GroupedBarChart
            data={[
              { dept: "CSE", avg: 94.2 },
              { dept: "ECE", avg: 92.8 },
              { dept: "EEE", avg: 91.5 },
              { dept: "Civil", avg: 89.4 },
              { dept: "Mechanical", avg: 90.2 },
              { dept: "AI & DS", avg: 93.6 },
            ] as unknown as Record<string, unknown>[]}
            xKey="dept"
            series={[{ key: "avg", label: "Attendance %" }]}
            height={220}
          />
        </Panel>

        <Panel title="Attendance Distribution Categories" description="Percentage of students in attendance brackets.">
          <DonutChart
            data={[
              { category: "Above 85%", percentage: 68 },
              { category: "75% - 85%", percentage: 24 },
              { category: "65% - 75%", percentage: 6 },
              { category: "Below 65%", percentage: 2 },
            ] as unknown as Record<string, unknown>[]}
            categoryKey="category"
            valueKey="percentage"
          />
        </Panel>
      </div>

      <Panel title="Attendance Shortage & Deficit Roster" description="Filter students by shortage threshold level.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search student name or roll number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <Select value={thresholdFilter} onValueChange={setThresholdFilter}>
              <SelectTrigger className="h-9 w-[180px] text-xs">
                <SelectValue placeholder="Threshold Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Registered Students</SelectItem>
                <SelectItem value="below75">Below 75% (Condonation)</SelectItem>
                <SelectItem value="below65">Below 65% (Detained Risk)</SelectItem>
                <SelectItem value="below50">Below 50% (Critical)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Roll Number</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Year / Sec</th>
                  <th className="p-3 text-center">Attendance %</th>
                  <th className="p-3 text-center">Shortage Category</th>
                  <th className="p-3 text-center">Action Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {lowAttendanceStudents.map((s) => (
                  <tr key={s.rollNo} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-primary">{s.rollNo}</td>
                    <td className="p-3 font-bold text-foreground">{s.name}</td>
                    <td className="p-3 font-mono font-bold">{s.department}</td>
                    <td className="p-3 font-mono">{s.year} ({s.section})</td>
                    <td className="p-3 text-center font-mono font-bold text-rose-600">{s.attendance}%</td>
                    <td className="p-3 text-center">
                      <Badge className={s.attendance < 65 ? "bg-rose-500/10 text-rose-600 font-mono text-[0.65rem]" : "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]"}>
                        {s.attendance < 65 ? "Detain Warning" : "Condonation Required"}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Button size="sm" variant="outline" className="h-6 text-[0.65rem] font-bold cursor-pointer">
                        Issue Parent Notice
                      </Button>
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
