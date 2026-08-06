import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');

function updatePage(filename, routePath, title, subTitle, renderTableCode) {
  const code = `import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Users, ShieldAlert, Award, CalendarCheck, CheckCircle2 } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getStudentDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("${routePath}")({
  head: () => ({
    meta: [{ title: "${title} — Student Dean" }],
  }),
  component: SubPage,
});

function SubPage() {
  const data = useMemo(() => getStudentDeanDashboardData(), []);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">${title}</h1>
        <p className="text-sm text-muted-foreground">${subTitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Enrolled Students" value={data.kpis.totalStudents.toLocaleString()} icon={Users} tone="info" />
        <KpiCard label="Average Attendance" value={data.kpis.avgAttendance} icon={CalendarCheck} tone="success" />
        <KpiCard label="Active Grievances" value={data.kpis.activeGrievances} icon={ShieldAlert} tone="warning" />
        <KpiCard label="Scholarships" value={data.kpis.scholarshipsDisbursed} icon={Award} tone="purple" />
      </div>

      <Panel title="${title} Directory" description="Searchable ERP records.">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search directory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          ${renderTableCode}
        </div>
      </Panel>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(routesDir, filename), code, 'utf8');
  console.log(`Updated ${filename}`);
}

// Students list table
const studentsTable = `
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Roll Number</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Academic Year</th>
                  <th className="p-3 text-center">Attendance %</th>
                  <th className="p-3 text-center">CGPA</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {data.students
                  .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase()))
                  .map((s) => (
                    <tr key={s.rollNo} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-primary">{s.rollNo}</td>
                      <td className="p-3 font-bold text-foreground">{s.name}</td>
                      <td className="p-3 font-mono font-bold">{s.department}</td>
                      <td className="p-3 font-mono">{s.year}</td>
                      <td className="p-3 text-center font-mono font-bold text-emerald-600">{s.attendance}%</td>
                      <td className="p-3 text-center font-mono font-bold">{s.cgpa}</td>
                      <td className="p-3 text-center">
                        <Badge className={s.status === "Active" ? "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]" : "bg-rose-500/10 text-rose-600 font-mono text-[0.65rem]"}>
                          {s.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
`;

// Grievances table
const grievancesTable = `
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Complainant Student</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 font-mono">Date Filed</th>
                  <th className="p-3 text-center">Priority</th>
                  <th className="p-3 text-center">Resolution Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {data.grievances
                  .filter((g) => g.student.toLowerCase().includes(search.toLowerCase()) || g.category.toLowerCase().includes(search.toLowerCase()))
                  .map((g) => (
                    <tr key={g.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-primary">{g.id}</td>
                      <td className="p-3 font-bold text-foreground">{g.student}</td>
                      <td className="p-3 font-mono">{g.category}</td>
                      <td className="p-3 font-mono text-muted-foreground">{g.date}</td>
                      <td className="p-3 text-center font-mono font-bold">{g.priority}</td>
                      <td className="p-3 text-center">
                        <Badge className={g.status === "Resolved" ? "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]" : "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]"}>
                          {g.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
`;

// Scholarships table
const scholarshipsTable = `
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Scholarship Scheme</th>
                  <th className="p-3">Amount per Student</th>
                  <th className="p-3 text-center">Beneficiary Count</th>
                  <th className="p-3 text-center">Disbursement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {data.scholarships.map((sc) => (
                  <tr key={sc.name} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-bold text-foreground">{sc.name}</td>
                    <td className="p-3 font-mono font-bold text-emerald-600">{sc.amount}</td>
                    <td className="p-3 text-center font-mono font-bold">{sc.recipients} Students</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{sc.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
`;

updatePage("staff.student-dean.students.tsx", "/staff/student-dean/students", "Students Directory", "Master directory of 5,420 enrolled students.", studentsTable);
updatePage("staff.student-dean.student-profiles.tsx", "/staff/student-dean/student-profiles", "Student Profiles", "Detailed academic dossiers and attendance logs.", studentsTable);
updatePage("staff.student-dean.grievances.tsx", "/staff/student-dean/grievances", "Grievance Redressal", "Student welfare complaint resolution portal.", grievancesTable);
updatePage("staff.student-dean.scholarships.tsx", "/staff/student-dean/scholarships", "Scholarships & Freeships", "State and national scholarship disbursement register.", scholarshipsTable);

console.log("Updated student dean main subroutes");
