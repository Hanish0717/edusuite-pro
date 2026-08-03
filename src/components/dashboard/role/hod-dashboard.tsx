import { useMemo, useState } from "react";
import { CheckCircle2, GraduationCap, UserCog, Users, Search, Filter } from "lucide-react";

import { TrendLineChart } from "@/components/dashboard/charts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import {
  ActivityWidget,
  AiInsightsWidget,
  QuickActionsWidget,
} from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRole } from "@/context/role-context";
import {
  fetchHodDepartmentStats,
  fetchDepartmentPerformanceTrend,
  fetchTopSubjects,
  fetchHodStudents,
  fetchHodPendingApprovals,
} from "@/lib/hodService";

export function HodDashboard() {
  const { department } = useRole();
  const activeDept = department || "CSE";

  // Filter States
  const [studentSearch, setStudentSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  // Dynamic Datasets driven by active department & services
  const deptStats = useMemo(() => fetchHodDepartmentStats(activeDept), [activeDept]);
  const performanceTrend = useMemo(() => fetchDepartmentPerformanceTrend(activeDept), [activeDept]);
  const topSubjectsList = useMemo(() => fetchTopSubjects(activeDept), [activeDept]);
  const pendingApprovalsList = useMemo(() => fetchHodPendingApprovals(activeDept), [activeDept]);

  // Filtered Students List
  const studentsList = useMemo(() => {
    return fetchHodStudents(activeDept, studentSearch, statusFilter);
  }, [activeDept, studentSearch, statusFilter]);

  return (
    <div className="space-y-6">
      {/* DYNAMIC KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Students" value={String(deptStats.studentsCount)} icon={Users} delta={deptStats.deltaStudents} />
        <KpiCard label="Faculty" value={String(deptStats.facultyCount)} icon={UserCog} tone="info" />
        <KpiCard
          label={`Attendance (${activeDept})`}
          value={deptStats.attendancePercentage}
          icon={GraduationCap}
          delta={deptStats.deltaAttendance}
          tone="success"
        />
        <KpiCard
          label="Pending Approvals"
          value={String(deptStats.pendingApprovalsCount)}
          icon={CheckCircle2}
          tone="warning"
        />
      </div>

      {/* DYNAMIC CHARTS & SUBJECT PERFORMANCE */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title={`${activeDept} Department Performance`}
          description="Attendance, results and placement trend"
          className="lg:col-span-2"
        >
          <TrendLineChart
            data={performanceTrend}
            xKey="month"
            series={[
              { key: "attendance", label: "Attendance" },
              { key: "results", label: "Results" },
              { key: "placement", label: "Placement" },
            ]}
            height={280}
          />
        </Panel>

        <Panel title="Top Subjects Performance" description="Average scores">
          <ul className="space-y-4">
            {topSubjectsList.map((subject) => (
              <li key={subject.subject}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate">{subject.subject}</span>
                  <span className="shrink-0 font-semibold">{subject.score}%</span>
                </div>
                <Progress value={subject.score} className="mt-2 h-2" />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* DYNAMIC DEPARTMENT STUDENTS TABLE */}
      <Panel title={`Department Students (${activeDept})`} description="Attendance and academic standing">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students by name, roll, or dept..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Statuses">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="At Risk">At Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Dept</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>CGPA</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsList.length > 0 ? (
                  studentsList.map((student) => (
                    <TableRow key={student.roll}>
                      <TableCell className="font-mono text-xs">{student.roll}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.dept}</TableCell>
                      <TableCell>{student.year}</TableCell>
                      <TableCell>{student.attendance}</TableCell>
                      <TableCell>{student.cgpa}</TableCell>
                      <TableCell>
                        <Badge variant={student.status === "At Risk" ? "destructive" : "secondary"}>
                          {student.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No students found matching current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Panel>

      {/* DYNAMIC PENDING APPROVALS & WIDGETS */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Pending Approvals" description="Waiting on your action">
          <ul className="space-y-3">
            {pendingApprovalsList.map((item) => (
              <li key={item.title} className="flex items-center justify-between gap-3">
                <span className="truncate text-sm">{item.title}</span>
                <Badge variant="secondary" className="shrink-0">
                  {item.count}
                </Badge>
              </li>
            ))}
          </ul>
        </Panel>
        <AiInsightsWidget />
        <ActivityWidget />
      </div>

      <QuickActionsWidget
        actions={[
          "Approve leave",
          "Allocate faculty",
          "Publish results",
          "Schedule test",
          "Department report",
        ]}
      />
    </div>
  );
}
