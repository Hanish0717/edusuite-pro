import { CheckCircle2, GraduationCap, UserCog, Users } from "lucide-react";

import { TrendLineChart } from "@/components/dashboard/charts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import {
  ActivityWidget,
  AiInsightsWidget,
  QuickActionsWidget,
} from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { departmentPerformance, pendingApprovals, studentsTable, topSubjects } from "@/data/mock";

export function HodDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Students" value="512" icon={Users} delta="3.1%" />
        <KpiCard label="Faculty" value="28" icon={UserCog} tone="info" />
        <KpiCard
          label="Attendance (Dept.)"
          value="91%"
          icon={GraduationCap}
          delta="2.4%"
          tone="success"
        />
        <KpiCard label="Pending Approvals" value="7" icon={CheckCircle2} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Department Performance"
          description="Attendance, results and placement trend"
          className="lg:col-span-2"
        >
          <TrendLineChart
            data={departmentPerformance}
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
            {topSubjects.map((subject) => (
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

      <Panel title="Department Students" description="Attendance and academic standing">
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
              {studentsTable.map((student) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Pending Approvals" description="Waiting on your action">
          <ul className="space-y-3">
            {pendingApprovals.map((item) => (
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
