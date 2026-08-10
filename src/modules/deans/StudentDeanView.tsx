import { useMemo } from "react";
import {
  Users,
  CalendarCheck,
  ShieldAlert,
  Award,
  BedDouble,
  Calendar,
  Clock,
  UserCheck,
  UserX,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { GroupedBarChart, TrendLineChart, DonutChart } from "@/components/dashboard/charts";
import { DeanHeader } from "./components/DeanHeader";
import { getStudentDeanDashboardData } from "@/lib/deansService";

export function StudentDeanView() {
  const data = useMemo(() => getStudentDeanDashboardData(), []);

  return (
    <div className="space-y-6">
      <DeanHeader
        activeDeanId="student-dean"
        title="Student Dean Cockpit"
        subtitle="Executive Student Affairs Workspace: Welfare, Grievance Redressal, Campus Clubs, Hostel Allotment, Scholarships & Mentoring."
        badge="STUDENT DEAN"
      />

      {/* TOP KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Total Students" value={data.kpis.totalStudents.toLocaleString()} icon={Users} tone="info" />
        <KpiCard label="Active Students" value={data.kpis.activeStudents.toLocaleString()} icon={UserCheck} tone="success" />
        <KpiCard label="Inactive Students" value={data.kpis.inactiveStudents.toString()} icon={UserX} tone="warning" />
        <KpiCard label="Overall Attendance" value={data.kpis.overallAttendancePct} icon={CalendarCheck} tone="purple" />
        <KpiCard label="Active Grievances" value={data.kpis.activeGrievances.toString()} icon={ShieldAlert} tone="warning" />
        <KpiCard label="Scholarships Approved" value={data.kpis.scholarshipsApproved} icon={Award} tone="success" />
        <KpiCard label="Hostel Students" value={data.kpis.hostelStudents.toLocaleString()} icon={BedDouble} tone="info" />
        <KpiCard label="Active Clubs" value={data.kpis.activeClubs.toString()} icon={Calendar} tone="purple" />
        <KpiCard label="Events This Month" value={data.kpis.eventsThisMonth.toString()} icon={Clock} tone="warning" />
      </div>

      {/* DEPARTMENT-WISE STUDENT COUNT & ATTENDANCE TREND */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Department-wise Student Count" description="Student strength across all 10 departments.">
          <GroupedBarChart
            data={data.deptCounts as unknown as Record<string, unknown>[]}
            xKey="dept"
            series={[{ key: "count", label: "Students" }]}
            height={240}
          />
        </Panel>

        <Panel title="Attendance & Grievance Trends" description="Monthly institutional attendance trend vs grievances.">
          <TrendLineChart
            data={[
              { month: "Jan", attendance: 95.2, grievances: 12 },
              { month: "Feb", attendance: 94.1, grievances: 8 },
              { month: "Mar", attendance: 93.8, grievances: 10 },
              { month: "Apr", attendance: 94.6, grievances: 6 },
              { month: "May", attendance: 95.8, grievances: 4 },
            ] as unknown as Record<string, unknown>[]}
            xKey="month"
            series={[
              { key: "attendance", label: "Attendance %" },
              { key: "grievances", label: "Grievances" },
            ]}
            height={240}
          />
        </Panel>
      </div>

      {/* DEMOGRAPHICS & YEAR-WISE DISTRIBUTION */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Gender Ratio" description="Male vs Female student distribution.">
          <DonutChart
            data={data.genderRatio as unknown as Record<string, unknown>[]}
            categoryKey="gender"
            valueKey="percentage"
          />
        </Panel>

        <Panel title="Year-wise Student Distribution" description="Students enrolled across 1st to 4th years.">
          <GroupedBarChart
            data={data.yearDistribution as unknown as Record<string, unknown>[]}
            xKey="year"
            series={[{ key: "count", label: "Enrolled" }]}
            height={200}
          />
        </Panel>

        <Panel title="Hostel & Campus Occupancy" description="Boys vs Girls Hostel capacity.">
          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl border border-border bg-card space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>Boys Hostel</span>
                <span className="font-mono text-primary">{data.kpis.boysHostel} Students</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "92%" }} />
              </div>
            </div>

            <div className="p-3 rounded-xl border border-border bg-card space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>Girls Hostel</span>
                <span className="font-mono text-emerald-600">{data.kpis.girlsHostel} Students</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "88%" }} />
              </div>
            </div>

            <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between text-xs font-bold">
              <span>Vacant Rooms Available</span>
              <Badge variant="outline" className="font-mono text-xs">{data.kpis.vacantHostelRooms} Rooms</Badge>
            </div>
          </div>
        </Panel>
      </div>

      {/* RECENT ACTIVITIES & NOTIFICATIONS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Recent Student Grievances" description="Live status of student welfare complaints.">
          <div className="space-y-3">
            {data.grievances.map((g) => (
              <div key={g.id} className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-[0.65rem]">{g.category}</Badge>
                  <Badge className={g.status === "Closed" ? "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]" : "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]"}>
                    {g.status}
                  </Badge>
                </div>
                <h4 className="font-bold text-xs text-foreground">{g.id} - {g.student}</h4>
                <p className="text-[0.65rem] font-mono text-muted-foreground">Assigned: {g.assignedOfficer} | {g.timeline}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recognized Student Societies & Clubs" description="Active technical, cultural and sports clubs.">
          <div className="space-y-3">
            {data.clubs.map((c) => (
              <div key={c.name} className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground">{c.name}</span>
                  <Badge variant="outline" className="font-mono text-[0.65rem]">{c.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Faculty Lead: {c.facultyCoordinator} | Student Lead: {c.studentCoordinator}</p>
                <p className="text-[0.65rem] font-mono text-primary font-bold">{c.members} Active Student Members</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
