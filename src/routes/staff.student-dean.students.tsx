import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, Download, Plus, Users, UserCheck, ShieldCheck, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getStudentDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/student-dean/students")({
  head: () => ({
    meta: [{ title: "Students Directory — Student Dean" }],
  }),
  component: StudentsPage,
});

function StudentsPage() {
  const data = useMemo(() => getStudentDeanDashboardData(), []);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [quotaFilter, setQuotaFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredStudents = useMemo(() => {
    return data.students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
        s["department"].toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === "all" || s["department"] === deptFilter;
      const matchQuota = quotaFilter === "all" || s.admissionQuota === quotaFilter;
      return matchSearch && matchDept && matchQuota;
    });
  }, [data.students, search, deptFilter, quotaFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              STUDENT MANAGEMENT
            </Badge>
            <span className="text-xs text-muted-foreground">• Master Student Directory</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Students Register</h1>
          <p className="text-sm text-muted-foreground">Enrolled student master ledger, department distribution, and admission quotas.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> Export Student List
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
            <Plus className="size-3.5" /> Register Student
          </Button>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Enrolled Students" value={data.kpis.totalStudents.toLocaleString()} icon={Users} tone="info" />
        <KpiCard label="Active Students" value={data.kpis.activeStudents.toLocaleString()} icon={UserCheck} tone="success" />
        <KpiCard label="Hostel Students" value={data.kpis.hostelStudents.toLocaleString()} icon={ShieldCheck} tone="purple" />
        <KpiCard label="Overall Attendance" value={data.kpis.overallAttendancePct} icon={CheckCircle2} tone="warning" />
      </div>

      {/* DEPARTMENT STATS SUMMARY */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
        {data.deptCounts.slice(0, 5).map((d) => (
          <div key={d.dept} className="p-3 rounded-xl border border-border bg-card space-y-1">
            <span className="text-xs font-bold text-muted-foreground">{d.dept} Department</span>
            <p className="font-mono text-lg font-extrabold text-foreground">{d.count} Students</p>
          </div>
        ))}
      </div>

      {/* MAIN SEARCH & TABLE */}
      <Panel title="Enrolled Student Directory" description="Search by Name, Roll No, or Department.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search student name (e.g. Rahul Sharma, K. Sai Teja)..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <Select value={deptFilter} onValueChange={(v) => { setDeptFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 w-[130px] text-xs">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Depts</SelectItem>
                  {["CSE", "ECE", "EEE", "Civil", "Mechanical", "AI & DS"].map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={quotaFilter} onValueChange={(v) => { setQuotaFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 w-[130px] text-xs">
                  <SelectValue placeholder="Quota" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quotas</SelectItem>
                  <SelectItem value="Convenor">Convenor</SelectItem>
                  <SelectItem value="Merit">Merit</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Roll Number</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Academic Year</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Admission Quota</th>
                  <th className="p-3 text-center">Attendance %</th>
                  <th className="p-3 text-center">CGPA</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {paginatedStudents.map((s) => (
                  <tr key={s.rollNo} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-primary">{s.rollNo}</td>
                    <td className="p-3 font-bold text-foreground">{s.name}</td>
                    <td className="p-3 font-mono font-bold">{s["department"]}</td>
                    <td className="p-3 font-mono">{s.year} ({s.section})</td>
                    <td className="p-3 font-mono text-muted-foreground">{s.gender}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="font-mono text-[0.65rem]">{s.admissionQuota}</Badge>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-600">{s.attendance}%</td>
                    <td className="p-3 text-center font-mono font-bold">{s.cgpa}</td>
                    <td className="p-3 text-center">
                      <Badge className={s["status"] === "Active" ? "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]" : "bg-rose-500/10 text-rose-600 font-mono text-[0.65rem]"}>
                        {s["status"]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION BAR */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
            <span className="text-xs text-muted-foreground font-mono">
              Showing {filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} entries
            </span>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 cursor-pointer" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                <ChevronLeft className="size-3.5" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button key={i} variant={currentPage === i + 1 ? "default" : "outline"} size="sm" className="h-7 w-7 p-0 text-xs font-mono cursor-pointer" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 cursor-pointer" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
