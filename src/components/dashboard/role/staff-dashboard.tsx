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
  Plus,
  FileText,
  Activity,
  Bell,
  Clock,
} from "lucide-react";

import { ChartLegend, DonutChart, GroupedBarChart } from "@/components/dashboard/charts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
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
  DEPARTMENT_NAMES,
  FACULTY_DASHBOARD_DATA_BY_DEPT,
  type FacultyDashboardData,
} from "@/data/faculty-mock-data";
import { toast } from "sonner";
import { FacultyModuleView } from "@/modules/faculty";

export function StaffDashboard() {
  const { hasFlag, profile } = useRole();
  const deptCode = profile.department || "CSE";
  const deptName = DEPARTMENT_NAMES[deptCode] || "Computer Science & Engineering";
  
  // Dynamic department-aware data
  const dashboardData = (FACULTY_DASHBOARD_DATA_BY_DEPT[deptCode] || FACULTY_DASHBOARD_DATA_BY_DEPT["CSE"]) as FacultyDashboardData;
  
  const handleQuickAction = (action: string) => {
    toast.success(`Quick Action triggered: ${action}`, {
      description: "Frontend mock interaction active.",
    });
  };

  // Standard attendance split format for the DonutChart
  const attendanceDonutData = [
    { name: "Present", value: dashboardData.attendance.present },
    { name: "Absent", value: dashboardData.attendance.absent },
    { name: "Pending", value: dashboardData.attendance.pending },
  ];

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good Morning";
    if (hr < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto min-w-0">
      {/* 1. WELCOME SECTION HERO CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 p-6 md:p-8 text-white shadow-lg shadow-indigo-500/10">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 size-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
              <Activity className="size-3.5 animate-pulse" /> Active Session
            </span>
            <div>
              <h2 className="font-display text-2xl font-extrabold md:text-3xl tracking-tight leading-tight break-words">
                {getGreeting()}, {profile.personaName || dashboardData.facultyName}
              </h2>
              <p className="mt-1 text-sm text-white/80 font-medium break-words">
                {deptName} &middot; ID: {dashboardData.employeeId}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge className="bg-white/15 hover:bg-white/20 text-white border-0 py-1 px-3 rounded-xl font-bold whitespace-nowrap">
                {dashboardData.designation}
              </Badge>
              <Badge className="bg-white/15 hover:bg-white/20 text-white border-0 py-1 px-3 rounded-xl font-bold whitespace-nowrap">
                Semester {dashboardData.semester}
              </Badge>
              <Badge className="bg-white/15 hover:bg-white/20 text-white border-0 py-1 px-3 rounded-xl font-bold whitespace-nowrap">
                AY {dashboardData.academicYear}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3.5 shrink-0 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-4">
            <div className="size-12 rounded-xl bg-white/10 text-white font-black text-lg grid place-items-center shrink-0">
              {profile.initials || "FC"}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-white/60 truncate">Logged In As</h4>
              <p className="text-sm font-black truncate">{profile.label || "Faculty"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC COMPOSABLE SECTIONS FOR ADMINISTRATIVE OVERLAYS */}
      {(hasFlag("isSuperAdmin") || profile.role === "super-admin" || profile.role === "super_admin") && (
        <div className="space-y-4 border-b border-border/60 pb-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary flex items-center gap-2">
              <UserCog className="size-4" /> Super Admin Faculty Governance Portal
            </h3>
            <Badge variant="secondary">Super Admin Privileges</Badge>
          </div>
          <FacultyModuleView initialTab="faculty-status" />
        </div>
      )}

      {hasFlag("isHod") && (
        <div className="space-y-4 border-b border-border/60 pb-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary flex items-center gap-2">
              <UserCog className="size-4" /> HOD Dashboard Overlay - {deptCode} Department
            </h3>
            <Badge variant="secondary">HOD Privileges</Badge>
          </div>
          <div className="grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard label="Dept. Students" value="512" icon={Users} tone="info" className="min-w-0 h-full" />
            <KpiCard label="Dept. Faculty" value="28" icon={UserCog} className="min-w-0 h-full" />
            <KpiCard label="Pending Approvals" value="7" icon={CheckCircle2} tone="warning" className="min-w-0 h-full" />
          </div>
        </div>
      )}

      {hasFlag("isDean") && (
        <div className="space-y-4 border-b border-border/60 pb-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary flex items-center gap-2">
              <GraduationCap className="size-4" /> Dean Academic Workspace
            </h3>
            <Badge variant="secondary">Dean Privileges</Badge>
          </div>
          <div className="grid gap-3.5 sm:gap-4 grid-cols-1 lg:grid-cols-2">
            <Panel title="Curriculum & Board of Studies (BoS)" description="Curriculum approval pipeline">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b">
                  <span>B.Tech CSE - 2026 Scheme</span>
                  <Badge variant="secondary">Approved</Badge>
                </div>
                <div className="flex justify-between items-center py-1 border-b">
                  <span>M.Tech Data Science - Rev.</span>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">In Review</Badge>
                </div>
              </div>
            </Panel>
            <Panel title="Accreditation Metrics" description="NAAC/NBA Readiness index">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Criterion 1: Curricular Aspects</span>
                  <span className="font-bold">92%</span>
                </div>
                <Progress value={92} className="h-1.5" />
              </div>
            </Panel>
          </div>
        </div>
      )}

      {hasFlag("isExamController") && (
        <div className="space-y-4 border-b border-border/60 pb-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary flex items-center gap-2">
              <FileSpreadsheet className="size-4" /> Exam Controller Dashboard Overlay
            </h3>
            <Badge variant="secondary">Controller Privileges</Badge>
          </div>
        </div>
      )}

      {/* 3. DYNAMIC METRIC CARDS REGISTRY */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
          <span>Performance Overview</span>
        </h3>
        
        <div className="grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
          <KpiCard
            label="Today's Classes"
            value={String(dashboardData.stats.todaysClasses)}
            icon={CalendarCheck}
            tone="info"
            className="hover:-translate-y-1 transition-all duration-300 min-w-0 h-full"
          />
          <KpiCard
            label="Total Students"
            value={String(dashboardData.stats.totalStudents)}
            icon={Users}
            className="hover:-translate-y-1 transition-all duration-300 min-w-0 h-full"
          />
          <KpiCard
            label="Pending Homework"
            value={String(dashboardData.stats.pendingAssignments)}
            icon={ClipboardList}
            tone="warning"
            className="hover:-translate-y-1 transition-all duration-300 min-w-0 h-full"
          />
          <KpiCard
            label="Attendance Status"
            value={dashboardData.stats.attendancePending}
            icon={CheckCircle2}
            className="hover:-translate-y-1 transition-all duration-300 text-xs min-w-0 h-full"
          />
          <KpiCard
            label="Upcoming Exams"
            value={String(dashboardData.stats.upcomingExams)}
            icon={GraduationCap}
            tone="success"
            className="hover:-translate-y-1 transition-all duration-300 min-w-0 h-full"
          />
          <KpiCard
            label="Research Publications"
            value={String(dashboardData.stats.researchPublications)}
            icon={TrendingUp}
            className="hover:-translate-y-1 transition-all duration-300 min-w-0 h-full"
          />
        </div>
      </div>


      {/* 4. MAIN DASHBOARD CONTENT GRID */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 items-start min-w-0">
        {/* Left Side (Spans 2 columns on desktop) */}
        <div className="lg:col-span-2 space-y-6 min-w-0">
          
          {/* Today's Timetable Card */}
          <Panel
            title="Today's Timetable"
            description={`Scheduled periods for ${deptName}`}
            action={<Badge variant="secondary">Period Status</Badge>}
          >
            <div className="overflow-x-auto rounded-xl border border-border/60 min-w-0">
              <Table className="w-full text-left text-xs min-w-[550px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Time</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="w-[80px]">Section</TableHead>
                    <TableHead className="w-[80px]">Room</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.timetable.map((slot, index) => (
                    <TableRow key={index} className="hover:bg-muted/40">
                      <TableCell className="font-mono text-xs font-semibold flex items-center gap-1.5 text-muted-foreground whitespace-nowrap">
                        <Clock className="size-3 shrink-0" /> {slot.time}
                      </TableCell>
                      <TableCell className="text-xs font-semibold">{slot.subject}</TableCell>
                      <TableCell className="text-xs whitespace-nowrap">{slot.section}</TableCell>
                      <TableCell className="font-mono text-xs whitespace-nowrap">{slot.room}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            slot.status === "Completed"
                              ? "secondary"
                              : slot.status === "Ongoing"
                                ? "outline"
                                : "default"
                          }
                          className={
                            slot.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 whitespace-nowrap"
                              : slot.status === "Ongoing"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20 whitespace-nowrap"
                                : "bg-blue-500/10 text-blue-600 border-blue-500/20 whitespace-nowrap"
                          }
                        >
                          {slot.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {dashboardData.timetable.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-6">
                        No classes scheduled for today.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Panel>

          {/* Student Performance Snapshot Card */}
          <Panel
            title="Student Performance Snapshot"
            description="Average metrics across department sections"
          >
            <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-muted/40 text-center">
              <div className="min-w-0">
                <p className="text-[0.65rem] uppercase font-extrabold tracking-wider text-muted-foreground truncate">Avg Attendance</p>
                <p className="text-lg font-black mt-0.5 text-indigo-600">{dashboardData.performance.averageAttendance}%</p>
              </div>
              <div className="min-w-0">
                <p className="text-[0.65rem] uppercase font-extrabold tracking-wider text-muted-foreground truncate">Average Marks</p>
                <p className="text-lg font-black mt-0.5 text-emerald-600">{dashboardData.performance.averageMarks}%</p>
              </div>
              <div className="min-w-0">
                <p className="text-[0.65rem] uppercase font-extrabold tracking-wider text-muted-foreground truncate">Assignments</p>
                <p className="text-lg font-black mt-0.5 text-blue-600">{dashboardData.performance.assignmentsSubmitted}%</p>
              </div>
              <div className="min-w-0">
                <p className="text-[0.65rem] uppercase font-extrabold tracking-wider text-muted-foreground truncate">At Risk Students</p>
                <p className="text-lg font-black mt-0.5 text-rose-600">{dashboardData.performance.studentsAtRisk}</p>
              </div>
            </div>
            
            <GroupedBarChart
              data={dashboardData.performance.chartData}
              xKey="name"
              series={[
                { key: "attendance", label: "Attendance (%)" },
                { key: "marks", label: "Avg Marks (%)" },
                { key: "submissions", label: "Submissions (%)" },
              ]}
              height={220}
            />
          </Panel>

          {/* Assignment Status Card */}
          <Panel
            title="Assignment Evaluation Status"
            description="Tracking task submissions and scoring progress"
          >
            <div className="grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 min-w-0 flex flex-col justify-between h-full space-y-3">
                <span className="text-[0.7rem] uppercase font-extrabold tracking-wider text-amber-600 leading-snug break-words block">Pending Evaluation</span>
                <div className="flex justify-between items-baseline gap-1">
                  <span className="text-2xl font-black whitespace-nowrap">{dashboardData.assignments.pendingEvaluation}</span>
                  <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Tasks</span>
                </div>
                <Progress value={25} className="h-1 bg-amber-500/10 [&>div]:bg-amber-500 mt-auto" />
              </div>
              
              <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 min-w-0 flex flex-col justify-between h-full space-y-3">
                <span className="text-[0.7rem] uppercase font-extrabold tracking-wider text-emerald-600 leading-snug break-words block">Completed</span>
                <div className="flex justify-between items-baseline gap-1">
                  <span className="text-2xl font-black whitespace-nowrap">{dashboardData.assignments.completed}</span>
                  <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Passed</span>
                </div>
                <Progress value={90} className="h-1 bg-emerald-500/10 [&>div]:bg-emerald-500 mt-auto" />
              </div>
              
              <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 min-w-0 flex flex-col justify-between h-full space-y-3">
                <span className="text-[0.7rem] uppercase font-extrabold tracking-wider text-rose-600 leading-snug break-words block">Overdue</span>
                <div className="flex justify-between items-baseline gap-1">
                  <span className="text-2xl font-black whitespace-nowrap">{dashboardData.assignments.overdue}</span>
                  <span className="text-xs font-semibold text-rose-500 whitespace-nowrap">Missed</span>
                </div>
                <Progress value={10} className="h-1 bg-rose-500/10 [&>div]:bg-rose-500 mt-auto" />
              </div>
              
              <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 min-w-0 flex flex-col justify-between h-full space-y-3">
                <span className="text-[0.7rem] uppercase font-extrabold tracking-wider text-blue-600 leading-snug break-words block">Submitted Today</span>
                <div className="flex justify-between items-baseline gap-1">
                  <span className="text-2xl font-black whitespace-nowrap">{dashboardData.assignments.submittedToday}</span>
                  <span className="text-xs font-semibold text-blue-600 whitespace-nowrap">Fresh</span>
                </div>
                <Progress value={45} className="h-1 bg-blue-500/10 [&>div]:bg-blue-500 mt-auto" />
              </div>
            </div>

          </Panel>

        </div>

        {/* Right Side (Spans 1 column on desktop) */}
        <div className="space-y-6 min-w-0">
          
          {/* Attendance Summary Card */}
          <Panel title="Attendance Summary" description={`Current month stats for ${deptCode}`}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <DonutChart data={attendanceDonutData} centerLabel={`${dashboardData.performance.averageAttendance}%`} />
              <ChartLegend items={attendanceDonutData} />
            </div>
          </Panel>

          {/* Quick Actions Panel */}
          <Panel title="Quick Action Cockpit" description="Primary operational buttons">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3">
              {[
                { label: "Take Attendance", icon: CalendarCheck, color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/15 border-blue-500/20" },
                { label: "Upload Materials", icon: FileText, color: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 border-emerald-500/20" },
                { label: "Create Assignment", icon: Plus, color: "bg-violet-500/10 text-violet-600 hover:bg-violet-500/15 border-violet-500/20" },
                { label: "Enter Marks", icon: FileSpreadsheet, color: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 border-amber-500/20" },
                { label: "View Timetable", icon: Clock, color: "bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/15 border-indigo-500/20" },
                { label: "Student List", icon: Users, color: "bg-teal-500/10 text-teal-600 hover:bg-teal-500/15 border-teal-500/20" },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(btn.label)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-300 cursor-pointer min-w-0 ${btn.color}`}
                  title={btn.label}
                >
                  <btn.icon className="size-5 mb-1.5 shrink-0" />
                  <span className="text-[0.7rem] font-bold leading-tight truncate w-full">{btn.label}</span>
                </button>
              ))}
            </div>
          </Panel>

          {/* Recent Announcements Card */}
          <Panel
            title="Recent Announcements"
            description="Latest updates from your department"
            action={<Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">Official</Badge>}
          >
            <div className="relative border-l-2 border-indigo-600/25 pl-4 ml-2 space-y-4 py-1.5">
              {dashboardData.announcements.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-[21px] top-1 size-2 rounded-full border-2 border-white bg-indigo-600 group-hover:scale-125 transition-transform duration-300" />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold leading-snug break-words">{item.title}</h5>
                    <p className="text-[0.65rem] text-muted-foreground mt-0.5 break-words">{item.meta}</p>
                  </div>
                </div>
              ))}
              {dashboardData.announcements.length === 0 && (
                <p className="text-xs text-muted-foreground py-2 italic">No announcements posted recently.</p>
              )}
            </div>
          </Panel>

          {/* Upcoming Events Card */}
          <Panel title="Upcoming Events" description="Important deadlines & timeline">
            <div className="relative border-l-2 border-emerald-500/25 pl-4 ml-2 space-y-4 py-1.5">
              {dashboardData.events.map((event) => (
                <div key={event.id} className="relative group">
                  <div className="absolute -left-[21px] top-1 size-2 rounded-full border-2 border-white bg-emerald-500 group-hover:scale-125 transition-transform duration-300" />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold leading-snug break-words">{event.title}</h5>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[0.65rem] text-muted-foreground">
                      <span className="whitespace-nowrap">{event.time}</span>
                      <span>&middot;</span>
                      <span className="font-semibold text-emerald-600 break-words">{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
              {dashboardData.events.length === 0 && (
                <p className="text-xs text-muted-foreground py-2 italic">No upcoming events scheduled.</p>
              )}

            </div>
          </Panel>

          {/* Notifications Panel */}
          <Panel
            title="Notifications Panel"
            description="System alerts and requests"
            action={
              dashboardData.notifications.some(n => n.unread) && (
                <Badge variant="destructive" className="animate-pulse">New</Badge>
              )
            }
          >
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {dashboardData.notifications.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-3 p-3 rounded-xl border transition-all duration-300 text-xs ${
                    item.unread
                      ? "bg-primary/5 border-primary/20"
                      : "bg-card border-border"
                  }`}
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                    <Bell className="size-3.5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`leading-snug ${item.unread ? "font-bold" : "text-muted-foreground"}`}>
                      {item.title}
                    </p>
                    <div className="flex justify-between items-center mt-1 text-[0.65rem] text-muted-foreground">
                      <span>{item.category}</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              {dashboardData.notifications.length === 0 && (
                <p className="text-xs text-muted-foreground py-2 italic text-center">No notifications found.</p>
              )}
            </div>
          </Panel>

        </div>
      </div>
    </div>
  );
}
