import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  GraduationCap,
  BookOpen,
  Award,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  Search,
  Filter,
  Check,
  X,
  FileText,
  Download,
  Users,
  UserCog,
  Calendar,
  Building2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ClipboardList,
} from "lucide-react";

import { TrendAreaChart, DonutChart } from "@/components/dashboard/charts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
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
import { useAcademic } from "@/context/academic-context";
import { getDeanDashboard, type DeanDashboardData } from "@/services/deanDashboardService";

export function DeanDashboard() {
  const { selectedDepartment } = useAcademic();
  const [dashboardData, setDashboardData] = useState<DeanDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Search States
  const [currSearch, setCurrSearch] = useState("");
  const [facSearch, setFacSearch] = useState("");

  // Fetch Dean Dashboard data when selected department changes
  useEffect(() => {
    let active = true;
    setLoading(true);
    getDeanDashboard(selectedDepartment)
      .then((data) => {
        if (active) {
          setDashboardData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          toast.error("Failed to load Dean dashboard data.");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedDepartment]);

  // BOS Stateful pending approvals
  const [bosApprovals, setBosApprovals] = useState<DeanDashboardData["curriculum"]["pendingApprovals"]>([]);

  useEffect(() => {
    if (dashboardData) {
      setBosApprovals(dashboardData.curriculum.pendingApprovals);
    }
  }, [dashboardData]);

  const handleApprovalAction = (id: string, action: "Approved" | "Rejected") => {
    setBosApprovals((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: action } as any : t))
    );

    const ticket = bosApprovals.find((t) => t.id === id);
    if (action === "Approved") {
      toast.success(`Board of Studies Sign-off granted: "${ticket?.title}"`);
    } else {
      toast.error(`Board of Studies Approval rejected: "${ticket?.title}"`);
    }
  };

  // Filtered lists
  const filteredCurriculumUpdates = useMemo(() => {
    if (!dashboardData) return [];
    return dashboardData.curriculum.recentUpdates.filter((u) =>
      u.title.toLowerCase().includes(currSearch.toLowerCase())
    );
  }, [dashboardData, currSearch]);

  const filteredFacultyMembers = useMemo(() => {
    if (!dashboardData) return [];
    return dashboardData.faculty.workloadList.filter((f) =>
      f.name.toLowerCase().includes(facSearch.toLowerCase())
    );
  }, [dashboardData, facSearch]);

  const genderChartData = useMemo(() => {
    if (!dashboardData) return [];
    return dashboardData.students.genderDistribution;
  }, [dashboardData]);

  if (loading || !dashboardData) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-xs text-muted-foreground font-mono">Synchronizing Academic Cockpit...</p>
        </div>
      </div>
    );
  }

  const { hero, stats, curriculum, accreditation, performance, attendance, examinations, faculty, students, timeline } = dashboardData;

  return (
    <div className="space-y-6">
      {/* 1. HERO SECTION */}
      <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                Welcome back, {hero.deanName}
              </h2>
              <Badge className="bg-brand-gradient text-white w-fit font-mono text-[0.65rem] tracking-wider uppercase">
                Academic Dean Scope
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Dean of <span className="font-bold text-foreground">{hero.departmentName}</span> &middot; Academic Year: <span className="font-mono text-foreground font-semibold">{hero.academicYear}</span>
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department Status</span>
            <Badge variant="outline" className="font-mono mt-1 text-primary border-primary/30 bg-primary/5">
              {hero.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground border-t border-primary/10 pt-3 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-primary" />
            Current Semester: <span className="font-semibold text-foreground">{hero.currentSemester}</span>
          </span>
          <span>&middot;</span>
          <span className="flex items-center gap-1.5">
            <Building2 className="size-3.5 text-primary" />
            Accreditation Readiness: <span className="font-semibold text-foreground">{accreditation.readinessScore}%</span>
          </span>
        </div>
      </div>

      {/* 2. DEPARTMENT OVERVIEW KPI CARDS */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <KpiCard label="Total Students" value={stats.totalStudents} icon={Users} />
        <KpiCard label="Total Faculty" value={stats.totalFaculty} icon={UserCog} tone="info" />
        <KpiCard label="Total Subjects" value={stats.totalSubjects} icon={BookOpen} tone="success" />
        <KpiCard label="Active Programs" value={`${stats.activePrograms} Degrees`} icon={GraduationCap} tone="warning" />
        <KpiCard label="Overall Attendance" value={`${stats.overallAttendance}%`} icon={TrendingUp} tone="success" />
        <KpiCard label="Pass Percentage" value={`${stats.passPercentage}%`} icon={Award} />
        <KpiCard label="Research Papers" value={stats.researchPublications} icon={FileSpreadsheet} tone="info" />
        <KpiCard label="Current Semesters" value={hero.currentSemester.split(" ")[0]} icon={Calendar} tone="warning" />
      </div>

      {/* MAIN TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN - MAIN ADMIN PANELS */}
        <div className="lg:col-span-2 space-y-6">

          {/* 5 & 6. ACADEMIC PERFORMANCE & ATTENDANCE ANALYTICS */}
          <Panel
            title="Academic Performance & Attendance Analytics"
            description="Overview of department grades, backlogs, student attendance rates, and alert logs."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                    <p className="text-[0.65rem] font-sans text-muted-foreground">AVG CGPA</p>
                    <p className="text-lg font-bold text-primary mt-1">{performance.avgCgpa}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                    <p className="text-[0.65rem] font-sans text-muted-foreground">BACKLOGS</p>
                    <p className="text-lg font-bold text-red-600 mt-1">{performance.backlogStudents} Students</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                    <p className="text-[0.65rem] font-sans text-muted-foreground">TOP PERFORMING</p>
                    <p className="text-xs font-bold text-foreground mt-1 truncate" title={performance.topSemester}>{performance.topSemester.split(" ")[0]}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                    <p className="text-[0.65rem] font-sans text-muted-foreground">PLACEMENT ELIGIBLE</p>
                    <p className="text-lg font-bold text-emerald-600 mt-1">{performance.placementEligible}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                  <span>Low Attendance Alerts (<span className="text-red-500 font-bold">{attendance.lowAttendanceStudents.length}</span>)</span>
                  <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-[0.65rem]">Urgent</Badge>
                </h4>
                <div className="space-y-2 max-h-[160px] overflow-y-auto">
                  {attendance.lowAttendanceStudents.map((student) => (
                    <div key={student.id} className="p-2.5 rounded-xl border border-border/80 bg-card flex items-center justify-between text-xs hover:border-red-200 transition-colors">
                      <div>
                        <p className="font-bold text-foreground">{student.name}</p>
                        <p className="text-[0.68rem] text-muted-foreground">{student.id} &middot; {student.semester}</p>
                      </div>
                      <Badge className="bg-red-500/10 text-red-600 border-red-200 font-mono text-xs">
                        {student.percentage}% Attendance
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Overall Attendance Monthly Trend</h4>
              <TrendAreaChart
                data={attendance.trend as any}
                xKey="month"
                series={[{ key: "attendance", label: "Attendance %" }]}
                height={200}
              />
            </div>
          </Panel>

          {/* 8 & 9. FACULTY & STUDENT DIRECTORY OVERVIEWS */}
          <Panel
            title="Faculty Workloads & Student Demographics"
            description="Overview of teaching hours allocation, semester distribution, and student intake logs."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Faculty Teaching Load</h4>
                  <div className="relative max-w-[160px]">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                    <Input
                      placeholder="Search faculty..."
                      value={facSearch}
                      onChange={(e) => setFacSearch(e.target.value)}
                      className="pl-7 h-7 text-[0.68rem]"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto border border-border rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold text-[0.65rem] uppercase tracking-wider">
                      <tr>
                        <th className="p-2.5">Faculty</th>
                        <th className="p-2.5 text-center">Courses</th>
                        <th className="p-2.5 text-right">Hours/Wk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredFacultyMembers.map((fac) => (
                        <tr key={fac.name} className="hover:bg-muted/20 transition-colors font-medium">
                          <td className="p-2.5 font-bold text-foreground">{fac.name}</td>
                          <td className="p-2.5 text-center font-mono">{fac.coursesCount}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-primary">{fac.hoursPerWeek} hrs</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pt-1 px-1">
                  <span>Assigned Subjects: <span className="text-foreground">{faculty.subjectsAssigned}</span></span>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.65rem]">
                    {faculty.pendingAllocationCount} Unallocated
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gender Distribution</h4>
                <div className="flex items-center justify-center">
                  <div className="w-[180px] shrink-0">
                    <DonutChart
                      data={genderChartData}
                      height={140}
                      centerLabel={`${students.studentStrength}`}
                    />
                  </div>
                  <div className="space-y-2 text-xs font-medium pl-4">
                    {genderChartData.map((gender, i) => (
                      <div key={gender.name} className="flex items-center gap-2">
                        <span
                          className="size-2.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: i === 0 ? "var(--chart-1)" : "var(--chart-2)",
                          }}
                        />
                        <span className="text-muted-foreground">{gender.name}:</span>
                        <span className="font-bold text-foreground">{gender.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <h5 className="text-[0.68rem] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Semester Intake Statistics</h5>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
                      <p className="text-[0.62rem] font-sans text-muted-foreground">STUDENTS INTAKE</p>
                      <p className="text-sm font-bold text-foreground mt-0.5">{students.intakeCount}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
                      <p className="text-[0.62rem] font-sans text-muted-foreground">TOTAL ENROLLED</p>
                      <p className="text-sm font-bold text-emerald-600 mt-0.5">{students.studentStrength}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          {/* 3 & 4. CURRICULUM BOARD & ACCREDITATION PROGRESS */}
          <Panel
            title="Curriculum Governance & Accreditation Audits"
            description="Details of Board of Studies (BOS) syllabus updates and criteria checklist for NAAC/NBA."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Board of Studies curriculum items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Syllabus Updates & Approvals</h4>
                  <div className="relative max-w-[150px]">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                    <Input
                      placeholder="Search course..."
                      value={currSearch}
                      onChange={(e) => setCurrSearch(e.target.value)}
                      className="pl-7 h-7 text-[0.68rem]"
                    />
                  </div>
                </div>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {bosApprovals.map((app) => (
                    <div key={app.id} className="p-3 rounded-xl border border-border/80 bg-card space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-purple-500/10 text-purple-600 border-purple-200 text-[0.62rem] font-mono">
                          {app.category}
                        </Badge>
                        <span className="text-[0.65rem] text-muted-foreground font-mono">{app.id}</span>
                      </div>
                      <p className="font-bold text-foreground">{app.title}</p>
                      <p className="text-[0.68rem] text-muted-foreground">Submitted by: {app.submittedBy}</p>

                      {app.status === "Pending" ? (
                        <div className="flex gap-2 pt-1">
                          <Button
                            size="sm"
                            onClick={() => handleApprovalAction(app.id, "Approved")}
                            className="bg-brand-gradient text-[0.68rem] px-2.5 h-7 gap-1"
                          >
                            <Check className="size-3" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprovalAction(app.id, "Rejected")}
                            className="text-[0.68rem] px-2.5 h-7 gap-1 border-border"
                          >
                            <X className="size-3" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <Badge
                          className={
                            app.status === "Approved"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem] font-mono"
                              : "bg-rose-500/10 text-rose-600 border-rose-500/20 text-[0.68rem] font-mono"
                          }
                        >
                          {app.status}
                        </Badge>
                      )}
                    </div>
                  ))}

                  {filteredCurriculumUpdates.map((upd) => (
                    <div key={upd.id} className="p-3 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-foreground truncate max-w-[200px]">{upd.title}</p>
                        <p className="text-[0.68rem] text-muted-foreground">Updated: {upd.date}</p>
                      </div>
                      <Badge variant="outline" className="font-mono text-[0.62rem]">
                        BOS Updated
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accreditation statistics */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Accreditation Readiness Dashboard</h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between font-mono mb-1 font-semibold">
                      <span>NAAC AUDIT RATIO</span>
                      <span className="text-primary">{accreditation.naacProgress}%</span>
                    </div>
                    <Progress value={accreditation.naacProgress} className="h-2 bg-muted" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between font-mono mb-1 font-semibold">
                      <span>NBA CRITERION ALIGNMENT</span>
                      <span className="text-emerald-600">{accreditation.nbaProgress}%</span>
                    </div>
                    <Progress value={accreditation.nbaProgress} className="h-2 bg-muted" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between font-mono mb-1 font-semibold">
                      <span>DOCUMENTATION METRICS</span>
                      <span className="text-indigo-600">{accreditation.documentationComplete}%</span>
                    </div>
                    <Progress value={accreditation.documentationComplete} className="h-2 bg-muted" />
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 space-y-2">
                  <h5 className="text-[0.68rem] font-semibold text-muted-foreground uppercase tracking-wider">Criteria-wise Progress Checklist</h5>
                  <div className="grid grid-cols-2 gap-2 text-[0.68rem] font-medium text-foreground">
                    {accreditation.criteriaProgress.map((crit) => (
                      <div key={crit.criterion} className="p-2 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between">
                        <span className="truncate mr-1">{crit.criterion.split(" ")[1]}</span>
                        <span className="font-bold text-primary shrink-0">{crit.progress}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Panel>

        </div>

        {/* RIGHT COLUMN - SIDEBAR WIDGETS & TIMELINE */}
        <div className="space-y-6">

          {/* 11. QUICK ACTIONS */}
          <Panel
            title="Dean Quick Action Center"
            description="Administrative shortcuts for department governance."
          >
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { title: "Manage Curriculum", desc: "Update R24 schema", action: "curriculum" },
                { title: "Manage Subjects", desc: "View course logs", action: "subjects" },
                { title: "Assign Faculty", desc: "Map course teachers", action: "faculty" },
                { title: "Publish Timetable", desc: "Audit conflicts", action: "timetable" },
                { title: "View Attendance", desc: "Daily monitoring", action: "attendance" },
                { title: "Schedule Exams", desc: "Datesheets & rooms", action: "exams" },
                { title: "Publish Results", desc: "BOS approvals", action: "results" },
                { title: "Generate Reports", desc: "Download PDF ledger", action: "reports" },
              ].map((act) => (
                <button
                  key={act.title}
                  onClick={() => toast.success(`Initiated: "${act.title}" administrative workflow`)}
                  className="p-3 text-left rounded-xl border border-border/80 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-xs space-y-1 cursor-pointer group"
                >
                  <p className="font-bold text-foreground group-hover:text-primary transition-colors">{act.title}</p>
                  <p className="text-[0.65rem] text-muted-foreground">{act.desc}</p>
                </button>
              ))}
            </div>
          </Panel>

          {/* 7. EXAMINATION OVERVIEW */}
          <Panel
            title="Examination Overview"
            description="Status of evaluation and upcoming department assessments."
          >
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
                  <p className="text-[0.62rem] font-sans text-muted-foreground">COMPLETED</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{examinations.completedExams}</p>
                </div>
                <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
                  <p className="text-[0.62rem] font-sans text-muted-foreground">PENDING</p>
                  <p className="text-sm font-bold text-red-600 mt-0.5">{examinations.pendingResults}</p>
                </div>
                <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
                  <p className="text-[0.62rem] font-sans text-muted-foreground">VALUATION</p>
                  <p className="text-[0.68rem] font-bold text-emerald-600 mt-0.5 truncate">{examinations.evaluationStatus.split(" ")[0]}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[0.68rem] font-semibold text-muted-foreground uppercase tracking-wider">Upcoming Assessments</p>
                {examinations.upcomingExams.map((exam) => (
                  <div key={exam.subjectCode} className="p-2.5 rounded-xl border border-border/80 bg-card flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foreground font-mono">{exam.subjectCode}</p>
                      <p className="text-[0.68rem] text-muted-foreground truncate max-w-[150px]">{exam.subjectName}</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-[0.65rem] border-primary/20 text-primary">
                      {exam.date}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          {/* 10. RECENT ACTIVITIES */}
          <Panel
            title="Dean Activity Tracker"
            description="Chronological log of administrative and curriculum changes."
          >
            <div className="relative pl-4 space-y-4 border-l border-border mt-2">
              {timeline.map((item) => (
                <div key={item.id} className="relative text-xs">
                  {/* Timeline dot */}
                  <span className="absolute -left-[20.5px] top-1 size-2.5 rounded-full border-2 border-background bg-primary" />
                  
                  <div className="space-y-0.5">
                    <p className="font-bold text-foreground">{item.title}</p>
                    <div className="flex items-center gap-2 text-[0.68rem] text-muted-foreground">
                      <span className="capitalize">{item.type}</span>
                      <span>&middot;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-muted-foreground" />
                        {item.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

        </div>

      </div>

    </div>
  );
}
