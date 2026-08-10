import { useMemo } from "react";
import { Users, Calendar, CheckCircle2, Ticket, Clock, UserCheck, Upload, CheckSquare, Award, RefreshCw, AlertTriangle } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { GroupedBarChart, DonutChart } from "@/components/dashboard/charts";
import { DeanHeader } from "./components/DeanHeader";

export function ExaminationDeanView() {
  return (
    <div className="space-y-6">
      <DeanHeader
        activeDeanId="examination-dean"
        title="Examination Dean Cockpit"
        subtitle="Controller of Examinations Operations, Exam Schedules, Hall Ticket Generation, Question Paper Security, Valuation & Results."
        badge="EXAM DEAN"
      />

      {/* TOP KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total Students Appearing" value="5,420 Students" icon={Users} tone="purple" />
        <KpiCard label="Upcoming Exams" value="184 Exams" icon={Calendar} tone="info" />
        <KpiCard label="Exams Completed" value="142 Exams" icon={CheckCircle2} tone="success" />
        <KpiCard label="Hall Tickets Generated" value="4,850 Generated" icon={Ticket} tone="success" />
        <KpiCard label="Pending Hall Tickets" value="570 Pending" icon={Clock} tone="warning" />
        <KpiCard label="Invigilators Assigned" value="245 Faculty" icon={UserCheck} tone="info" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Question Papers Uploaded" value="184 Papers (100%)" icon={Upload} tone="purple" />
        <KpiCard label="Valuation Completed" value="88.5% Scripts" icon={CheckSquare} tone="success" />
        <KpiCard label="Results Published" value="92.6% Pass Rate" icon={Award} tone="purple" />
        <KpiCard label="Revaluation Requests" value="14 Requests" icon={RefreshCw} tone="warning" />
        <KpiCard label="Malpractice Cases" value="2 Cases" icon={AlertTriangle} tone="warning" />
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Department-wise Examination Statistics" description="Total enrolled students appearing for end-semester exams by department.">
          <GroupedBarChart
            data={[
              { dept: "CSE Dept", students: 1240, passed: 1160 },
              { dept: "ECE Dept", students: 980, passed: 910 },
              { dept: "ME Dept", students: 750, passed: 690 },
              { dept: "EEE Dept", students: 620, passed: 570 },
              { dept: "Civil Dept", students: 540, passed: 490 },
              { dept: "MBA Dept", students: 480, passed: 450 },
              { dept: "AI & DS Dept", students: 810, passed: 760 },
            ] as unknown as Record<string, unknown>[]}
            xKey="dept"
            series={[
              { key: "students", label: "Appearing Students" },
              { key: "passed", label: "Passed Students" },
            ]}
            height={220}
          />
        </Panel>

        <Panel title="Grade Distribution & Result Performance" description="Breakdown of student letter grades for Autumn Semester 2026.">
          <DonutChart
            data={[
              { category: "O Grade (Outstanding - CGPA 10)", percentage: 14.5 },
              { category: "A+ Grade (Excellent - CGPA 9)", percentage: 28.2 },
              { category: "A Grade (Very Good - CGPA 8)", percentage: 32.8 },
              { category: "B+ Grade (Good - CGPA 7)", percentage: 17.1 },
              { category: "Re-appear / Supplementary", percentage: 7.4 },
            ] as unknown as Record<string, unknown>[]}
            categoryKey="category"
            valueKey="percentage"
          />
        </Panel>
      </div>

      {/* MASTER EXAMINATION SCHEDULE LEDGER */}
      <Panel title="Master End-Semester Examination Schedule" description="Controller of Examinations verified master exam timetable, halls, and invigilators.">
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Course Code</th>
                <th className="p-3">Subject Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">Exam Date</th>
                <th className="p-3 font-mono">Session Slot</th>
                <th className="p-3">Exam Hall</th>
                <th className="p-3 font-mono text-right">Appearing Students</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-mono font-bold text-primary">CS501</td>
                <td className="p-3 font-bold text-foreground">Advanced Software Engineering</td>
                <td className="p-3 font-mono font-bold">CSE</td>
                <td className="p-3 font-mono text-muted-foreground">2026-08-18</td>
                <td className="p-3 font-mono">Morning (09:30 AM)</td>
                <td className="p-3 font-mono">Block A - Hall 101</td>
                <td className="p-3 text-right font-mono font-bold text-emerald-600">420 Students</td>
                <td className="p-3 text-center">
                  <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">Scheduled</Badge>
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-mono font-bold text-primary">EC304</td>
                <td className="p-3 font-bold text-foreground">VLSI Design & System Architecture</td>
                <td className="p-3 font-mono font-bold">ECE</td>
                <td className="p-3 font-mono text-muted-foreground">2026-08-19</td>
                <td className="p-3 font-mono">Afternoon (02:00 PM)</td>
                <td className="p-3 font-mono">Block B - Hall 204</td>
                <td className="p-3 text-right font-mono font-bold text-emerald-600">340 Students</td>
                <td className="p-3 text-center">
                  <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">Scheduled</Badge>
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-mono font-bold text-primary">AI502</td>
                <td className="p-3 font-bold text-foreground">Deep Learning & Neural Networks</td>
                <td className="p-3 font-mono font-bold">AI & DS</td>
                <td className="p-3 font-mono text-muted-foreground">2026-08-20</td>
                <td className="p-3 font-mono">Morning (09:30 AM)</td>
                <td className="p-3 font-mono">Block A - Hall 302</td>
                <td className="p-3 text-right font-mono font-bold text-emerald-600">280 Students</td>
                <td className="p-3 text-center">
                  <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">Scheduled</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
