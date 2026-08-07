import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');

function saveRoute(filename, content) {
  fs.writeFileSync(path.join(routesDir, filename), content, 'utf8');
  console.log(`Successfully generated dedicated route file: ${filename}`);
}

// 1. ATTENDANCE PAGE (src/routes/staff.student-dean.attendance.tsx)
const attendancePageCode = `import { createFileRoute } from "@tanstack/react-router";
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
`;

saveRoute("staff.student-dean.attendance.tsx", attendancePageCode);

// 2. GRIEVANCES PAGE (src/routes/staff.student-dean.grievances.tsx)
const grievancesPageCode = `import { createFileRoute } from "@tanstack/react-router";
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
`;

saveRoute("staff.student-dean.grievances.tsx", grievancesPageCode);

// 3. SCHOLARSHIPS PAGE (src/routes/staff.student-dean.scholarships.tsx)
const scholarshipsPageCode = `import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Award, CheckCircle2, Clock, DollarSign, Download } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getStudentDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/student-dean/scholarships")({
  head: () => ({
    meta: [{ title: "Scholarships & Financial Aid — Student Dean" }],
  }),
  component: ScholarshipsPage,
});

function ScholarshipsPage() {
  const data = useMemo(() => getStudentDeanDashboardData(), []);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              FINANCIAL AID
            </Badge>
            <span className="text-xs text-muted-foreground">• Scholarship Approvals & Disbursement</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Scholarships & Freeships</h1>
          <p className="text-sm text-muted-foreground">State government fee reimbursements, merit scholarships, and SC/ST/BC welfare funds.</p>
        </div>

        <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
          <Download className="size-3.5" /> Export Audit Ledger
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Approved Amount" value={data.kpis.scholarshipsApproved} icon={Award} tone="success" />
        <KpiCard label="Approved Applications" value="1,420 Students" icon={CheckCircle2} tone="info" />
        <KpiCard label="Pending Applications" value="84 Applications" icon={Clock} tone="warning" />
        <KpiCard label="Govt Reimbursement" value="₹1.45 Cr" icon={DollarSign} tone="purple" />
      </div>

      <Panel title="Scholarship Applications Ledger" description="Filter by Category: Government, Merit, Minority, SC/ST, BC, EWS.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search student or scholarship scheme..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9 w-[160px] text-xs">
                <SelectValue placeholder="Category Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schemes</SelectItem>
                <SelectItem value="BC">BC Welfare</SelectItem>
                <SelectItem value="SC/ST">SC/ST Fund</SelectItem>
                <SelectItem value="Merit">Merit Scholarship</SelectItem>
                <SelectItem value="EWS">EWS Scheme</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Application Ref</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Scholarship Scheme</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-center">Sanctioned Amount</th>
                  <th className="p-3 font-mono">Applied Date</th>
                  <th className="p-3 text-center">Approval Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {data.scholarships
                  .filter((s) => (categoryFilter === "all" || s.category === categoryFilter) && (s.student.toLowerCase().includes(search.toLowerCase()) || s.scheme.toLowerCase().includes(search.toLowerCase())))
                  .map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-primary">{s.id}</td>
                      <td className="p-3 font-bold text-foreground">{s.student}</td>
                      <td className="p-3 font-bold">{s.scheme}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="font-mono text-[0.65rem]">{s.category}</Badge>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-emerald-600">{s.amount}</td>
                      <td className="p-3 font-mono text-muted-foreground">{s.appliedDate}</td>
                      <td className="p-3 text-center">
                        <Badge className={s.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]" : "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]"}>
                          {s.status}
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
`;

saveRoute("staff.student-dean.scholarships.tsx", scholarshipsPageCode);

// 4. HOSTEL MANAGEMENT PAGE (src/routes/staff.student-dean.hostel.tsx)
const hostelPageCode = `import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, BedDouble, Users, ShieldCheck, Wrench, Home } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getStudentDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/student-dean/hostel")({
  head: () => ({
    meta: [{ title: "Hostel & Mess Management — Student Dean" }],
  }),
  component: HostelManagementPage,
});

function HostelManagementPage() {
  const data = useMemo(() => getStudentDeanDashboardData(), []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              CAMPUS LIFE
            </Badge>
            <span className="text-xs text-muted-foreground">• Residence & Mess Management</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Hostel Management</h1>
          <p className="text-sm text-muted-foreground">Boys & Girls hostel occupancy, wardens roster, room allocations, and maintenance complaints.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Hostel Residents" value={data.kpis.hostelStudents.toLocaleString()} icon={BedDouble} tone="info" />
        <KpiCard label="Boys Hostel Block" value={data.kpis.boysHostel.toLocaleString()} icon={Users} tone="success" />
        <KpiCard label="Girls Hostel Block" value={data.kpis.girlsHostel.toLocaleString()} icon={Users} tone="purple" />
        <KpiCard label="Vacant Rooms" value={data.kpis.vacantHostelRooms.toString()} icon={Home} tone="warning" />
      </div>

      <Panel title="Hostel Blocks & Chief Wardens Roster" description="Master campus residential blocks.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 border border-border rounded-xl bg-card space-y-2">
            <h4 className="font-bold text-sm text-foreground">Boys Hostel Block A</h4>
            <p className="text-xs text-muted-foreground">Chief Warden: Col. R. S. Rathore</p>
            <div className="flex items-center justify-between text-xs font-mono">
              <span>Occupancy: 600 / 620</span>
              <Badge className="bg-emerald-500/10 text-emerald-600">96.7% Full</Badge>
            </div>
          </div>

          <div className="p-4 border border-border rounded-xl bg-card space-y-2">
            <h4 className="font-bold text-sm text-foreground">Boys Hostel Block B</h4>
            <p className="text-xs text-muted-foreground">Warden: Dr. M. N. Swamy</p>
            <div className="flex items-center justify-between text-xs font-mono">
              <span>Occupancy: 500 / 525</span>
              <Badge className="bg-emerald-500/10 text-emerald-600">95.2% Full</Badge>
            </div>
          </div>

          <div className="p-4 border border-border rounded-xl bg-card space-y-2">
            <h4 className="font-bold text-sm text-foreground">Girls Hostel Block C</h4>
            <p className="text-xs text-muted-foreground">Chief Warden: Mrs. G. Sujatha</p>
            <div className="flex items-center justify-between text-xs font-mono">
              <span>Occupancy: 750 / 780</span>
              <Badge className="bg-emerald-500/10 text-emerald-600">96.1% Full</Badge>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Hostel Maintenance & Mess Complaints" description="Live complaints log & warden resolutions.">
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Complaint Ref</th>
                <th className="p-3">Hostel Block</th>
                <th className="p-3">Issue Category</th>
                <th className="p-3">Assigned Warden</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {data.hostelComplaints.map((h) => (
                <tr key={h.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono font-bold text-primary">{h.id}</td>
                  <td className="p-3 font-bold text-foreground">{h.hostelBlock}</td>
                  <td className="p-3 font-bold">{h.issue}</td>
                  <td className="p-3 font-mono text-muted-foreground">{h.warden}</td>
                  <td className="p-3 text-center">
                    <Badge className={h.status === "Resolved" ? "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]" : "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]"}>
                      {h.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
`;

saveRoute("staff.student-dean.hostel.tsx", hostelPageCode);

console.log("All custom dedicated Student Dean pages generated.");
