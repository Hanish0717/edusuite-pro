import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Building2, Users, GraduationCap, BookOpen, Clock, ShieldCheck, CheckCircle2, TrendingUp, AlertCircle, Award } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { GroupedBarChart, DonutChart } from "@/components/dashboard/charts";
import { DeanHeader } from "./components/DeanHeader";

export function AcademicDeanView() {
  return (
    <div className="space-y-6">
      <DeanHeader
        activeDeanId="academic-dean"
        title="Academic Dean Cockpit"
        subtitle="Executive management of Academic Departments, Degree Programs, Curriculum Audits, Workload, and Course Allocations."
        badge="ACADEMIC DEAN"
      />

      {/* TOP KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Link to="/staff/academic-dean/departments" className="block cursor-pointer transition-transform hover:scale-[1.02]">
          <KpiCard label="Total Departments" value="9 Departments" icon={Building2} tone="purple" />
        </Link>
        <Link to="/staff/academic-dean/faculty-management" className="block cursor-pointer transition-transform hover:scale-[1.02]">
          <KpiCard label="Total Faculty" value="345 Faculty" icon={Users} tone="info" />
        </Link>
        <Link to="/staff/academic-dean/class-monitoring" className="block cursor-pointer transition-transform hover:scale-[1.02]">
          <KpiCard label="Total Students" value="5,820 Students" icon={GraduationCap} tone="success" />
        </Link>
        <Link to="/staff/academic-dean/course-management" className="block cursor-pointer transition-transform hover:scale-[1.02]">
          <KpiCard label="Courses Offered" value="42 Programs" icon={BookOpen} tone="purple" />
        </Link>
        <Link to="/staff/academic-dean/subject-allocation" className="block cursor-pointer transition-transform hover:scale-[1.02]">
          <KpiCard label="Subjects Running" value="248 Subjects" icon={Clock} tone="info" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Link to="/staff/academic-dean/dept-workload" className="block cursor-pointer transition-transform hover:scale-[1.02]">
          <KpiCard label="Faculty Availability" value="96.5% On-Time" icon={CheckCircle2} tone="success" />
        </Link>
        <Link to="/staff/academic-dean/attendance-monitoring" className="block cursor-pointer transition-transform hover:scale-[1.02]">
          <KpiCard label="Average Attendance" value="91.2% Overall" icon={TrendingUp} tone="purple" />
        </Link>
        <Link to="/staff/academic-dean/academic-performance" className="block cursor-pointer transition-transform hover:scale-[1.02]">
          <KpiCard label="Average Pass Percentage" value="92.6% Pass Rate" icon={Award} tone="success" />
        </Link>
        <Link to="/staff/academic-dean/class-monitoring" className="block cursor-pointer transition-transform hover:scale-[1.02]">
          <KpiCard label="Active Live Classes" value="148 Live Classes" icon={Clock} tone="info" />
        </Link>
        <Link to="/staff/academic-dean/approvals" className="block cursor-pointer transition-transform hover:scale-[1.02]">
          <KpiCard label="Pending Approvals" value="6 Approvals" icon={ShieldCheck} tone="warning" />
        </Link>
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Department-wise Student Strength & Faculty Allocation" description="Enrolled students and full-time faculty distribution across academic departments.">
          <GroupedBarChart
            data={[
              { dept: "CSE Dept", students: 1240, faculty: 64 },
              { dept: "ECE Dept", students: 980, faculty: 52 },
              { dept: "ME Dept", students: 750, faculty: 42 },
              { dept: "EEE Dept", students: 620, faculty: 38 },
              { dept: "Civil Dept", students: 540, faculty: 32 },
              { dept: "AI & DS", students: 810, faculty: 44 },
              { dept: "MBA Dept", students: 480, faculty: 28 },
            ] as unknown as Record<string, unknown>[]}
            xKey="dept"
            series={[
              { key: "students", label: "Students Strength" },
              { key: "faculty", label: "Faculty Count" },
            ]}
            height={220}
          />
        </Panel>

        <Panel title="Academic Quality & Grade Performance Distribution" description="Overall student academic performance breakdown for current semester.">
          <DonutChart
            data={[
              { category: "Outstanding (CGPA 9.0+)", percentage: 22.4 },
              { category: "First Class with Distinction (8.0-8.9)", percentage: 38.6 },
              { category: "First Class (7.0-7.9)", percentage: 25.5 },
              { category: "Second Class (6.0-6.9)", percentage: 8.5 },
              { category: "Slow Learners / Remedial (<6.0)", percentage: 5.0 },
            ] as unknown as Record<string, unknown>[]}
            categoryKey="category"
            valueKey="percentage"
          />
        </Panel>
      </div>

      {/* ACADEMIC DEPARTMENTS MASTER LEDGER */}
      <Panel title="Master Academic Departments Ledger" description="Centralized directory of academic departments, HODs, faculty count, and accreditation.">
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Dept Code</th>
                <th className="p-3">Department Name</th>
                <th className="p-3">Head of Department (HOD)</th>
                <th className="p-3 text-center">Faculty Count</th>
                <th className="p-3 text-center font-mono">Student Strength</th>
                <th className="p-3 text-center">Programs Offered</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-mono font-bold text-primary">DEPT-CSE</td>
                <td className="p-3 font-bold text-foreground">Computer Science & Engineering</td>
                <td className="p-3 text-muted-foreground">Dr. Srinivas Rao</td>
                <td className="p-3 text-center font-mono font-bold">64 Faculty</td>
                <td className="p-3 text-center font-mono font-bold text-emerald-600">1,240 Students</td>
                <td className="p-3 text-center font-mono">B.Tech, M.Tech, PhD</td>
                <td className="p-3 text-center">
                  <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">NBA Accredited</Badge>
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-mono font-bold text-primary">DEPT-ECE</td>
                <td className="p-3 font-bold text-foreground">Electronics & Communication</td>
                <td className="p-3 text-muted-foreground">Dr. Priya Sharma</td>
                <td className="p-3 text-center font-mono font-bold">52 Faculty</td>
                <td className="p-3 text-center font-mono font-bold text-emerald-600">980 Students</td>
                <td className="p-3 text-center font-mono">B.Tech, M.Tech, PhD</td>
                <td className="p-3 text-center">
                  <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">NBA Accredited</Badge>
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-mono font-bold text-primary">DEPT-AIDS</td>
                <td className="p-3 font-bold text-foreground">Artificial Intelligence & Data Science</td>
                <td className="p-3 text-muted-foreground">Dr. Ravi Kumar</td>
                <td className="p-3 text-center font-mono font-bold">44 Faculty</td>
                <td className="p-3 text-center font-mono font-bold text-emerald-600">810 Students</td>
                <td className="p-3 text-center font-mono">B.Tech, M.Tech</td>
                <td className="p-3 text-center">
                  <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">Active</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
