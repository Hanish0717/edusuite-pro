import {
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Users,
  CheckCircle2,
  GraduationCap,
  UserCog,
  Award,
  Briefcase,
  FileSpreadsheet,
  TrendingUp,
  Activity,
} from "lucide-react";

import { ChartLegend, DonutChart, TrendLineChart } from "@/components/dashboard/charts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import {
  AiInsightsWidget,
  CalendarWidget,
  ScheduleWidget,
  TasksWidget,
  QuickActionsWidget,
  ActivityWidget,
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
import { useRole } from "@/context/role-context";
import {
  attendanceSplit,
  departmentPerformance,
  pendingApprovals,
  studentsTable,
  topSubjects,
} from "@/data/mock";

export function StaffDashboard() {
  const { hasFlag, profile } = useRole();
  const dept = profile.department || "CSE";

  return (
    <div className="space-y-6">
      {/* 1. BASE STAFF KPI CARDS */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3">
          Faculty Workspace
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="My Classes" value="6" icon={BookOpen} />
          <KpiCard label="Students" value="142" icon={Users} tone="info" />
          <KpiCard
            label="Attendance Today"
            value="92%"
            icon={CalendarCheck}
            delta="3%"
            tone="success"
          />
          <KpiCard label="Pending Tasks" value="8" icon={ClipboardList} tone="warning" />
        </div>
      </div>

      {/* 2. DYNAMIC COMPOSABLE SECTIONS BASED ON FLAGS */}

      {/* A. HOD SECTION */}
      {hasFlag("isHod") && (
        <div className="space-y-4 border-t border-border/60 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary flex items-center gap-2">
              <UserCog className="size-4" /> HOD Dashboard - {dept} Department
            </h3>
            <Badge variant="secondary">Admin Privilege</Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard label="Dept. Students" value="512" icon={Users} tone="info" />
            <KpiCard label="Dept. Faculty" value="28" icon={UserCog} />
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
                height={220}
              />
            </Panel>

            <Panel title="Pending Approvals" description="Requires HOD action">
              <ul className="space-y-3">
                {pendingApprovals.map((item) => (
                  <li key={item.title} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate">{item.title}</span>
                    <Badge variant="secondary" className="shrink-0">
                      {item.count}
                    </Badge>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel title="Department Students" description="Academic standing summary">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>CGPA</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsTable.slice(0, 3).map((student) => (
                    <TableRow key={student.roll}>
                      <TableCell className="font-mono text-xs">{student.roll}</TableCell>
                      <TableCell className="font-medium text-xs">{student.name}</TableCell>
                      <TableCell className="text-xs">{student.year}</TableCell>
                      <TableCell className="text-xs">{student.attendance}</TableCell>
                      <TableCell className="text-xs">{student.cgpa}</TableCell>
                      <TableCell>
                        <Badge
                          variant={student.status === "At Risk" ? "destructive" : "secondary"}
                          className="text-[0.65rem] px-1.5 py-0"
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Panel>
        </div>
      )}

      {/* B. DEAN SECTION */}
      {hasFlag("isDean") && (
        <div className="space-y-4 border-t border-border/60 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary flex items-center gap-2">
              <GraduationCap className="size-4" /> Dean Workspace (Academic Affairs)
            </h3>
            <Badge variant="secondary">School Privilege</Badge>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel
              title="Curriculum & Board of Studies (BoS)"
              description="Curriculum approval pipeline"
            >
              <div className="space-y-3">
                {[
                  { course: "B.Tech CSE - 2026 Scheme", status: "Approved by BoS", date: "Jul 20" },
                  {
                    course: "M.Tech Data Science - Syllabus Revision",
                    status: "Pending Dean Signature",
                    date: "In Review",
                  },
                  {
                    course: "B.Tech ECE - New Electives Proposal",
                    status: "Returned for modifications",
                    date: "Jul 15",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-xs border-b border-border/40 pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <h4 className="font-semibold">{item.course}</h4>
                      <p className="text-[0.65rem] text-muted-foreground">Status: {item.status}</p>
                    </div>
                    <Badge variant={item.date === "In Review" ? "warning" : "secondary"}>
                      {item.date}
                    </Badge>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Accreditation Metrics" description="NAAC/NBA Readiness index">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Criterion 1: Curricular Aspects</span>
                    <span className="font-bold">92%</span>
                  </div>
                  <Progress value={92} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Criterion 2: Teaching & Evaluation</span>
                    <span className="font-bold">85%</span>
                  </div>
                  <Progress value={85} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Criterion 3: Research & Innovations</span>
                    <span className="font-bold">74%</span>
                  </div>
                  <Progress value={74} className="h-1.5" />
                </div>
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* C. EXAM CONTROLLER SECTION */}
      {hasFlag("isExamController") && (
        <div className="space-y-4 border-t border-border/60 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary flex items-center gap-2">
              <FileSpreadsheet className="size-4" /> Exam Controller Dashboard
            </h3>
            <Badge variant="secondary">Controller Privilege</Badge>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Panel
              title="Upcoming Examinations"
              description="Schedules and hall ticket dispatch status"
              className="lg:col-span-2"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Name</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Hall Tickets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "End Semester Exams (Regular)",
                      date: "Nov 10 - Nov 25",
                      count: "2,450",
                      tickets: "Generated",
                    },
                    {
                      name: "Supplementary Exams (July/Aug)",
                      date: "Aug 08 - Aug 18",
                      count: "340",
                      tickets: "Dispatched",
                    },
                  ].map((exam, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold text-xs">{exam.name}</TableCell>
                      <TableCell className="text-xs">{exam.date}</TableCell>
                      <TableCell className="text-xs">{exam.count}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[0.65rem] px-1.5 py-0">
                          {exam.tickets}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Panel>

            <Panel title="Valuation Status" description="Results compiling progress">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span>CSE Papers Graded</span>
                  <Badge className="bg-emerald-550">100%</Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>ECE Papers Graded</span>
                  <Badge variant="warning">75%</Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>ME Papers Graded</span>
                  <Badge variant="secondary">30%</Badge>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* D. PLACEMENT OFFICER SECTION */}
      {hasFlag("isPlacementOfficer") && (
        <div className="space-y-4 border-t border-border/60 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary flex items-center gap-2">
              <Briefcase className="size-4" /> Training & Placement Portal
            </h3>
            <Badge variant="secondary">Placement Privilege</Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard
              label="Recruiter Registrations"
              value="42 Companies"
              icon={Briefcase}
              tone="info"
            />
            <KpiCard label="Eligible Candidates" value="384 Students" icon={Users} />
            <KpiCard label="Offers Dispatched" value="128 Offers" icon={Award} tone="success" />
          </div>
        </div>
      )}

      {/* 3. BASE STAFF SCHEDULER & DETAILS */}
      <div className="space-y-4 border-t border-border/60 pt-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          My Classes & Tasks
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <ScheduleWidget />
          <TasksWidget />
        </div>
      </div>

      {/* 4. BASE STAFF CHARTS & CALENDAR */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Attendance Overview" description="Across my subjects">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <DonutChart data={attendanceSplit} centerLabel="92%" />
            <ChartLegend items={attendanceSplit} />
          </div>
        </Panel>
        <AiInsightsWidget />
        <CalendarWidget />
      </div>

      {/* 5. ACTION COCKPIT */}
      <QuickActionsWidget
        actions={[
          "Mark attendance",
          "Upload syllabus notes",
          "Create assignment",
          "Enter internal marks",
          hasFlag("isHod") ? "Approve Leave Requests" : "Apply for leave",
          hasFlag("isExamController") ? "Publish Draft Timetable" : "",
        ].filter(Boolean)}
      />
    </div>
  );
}
