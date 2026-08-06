import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  CalendarCheck,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  Building2,
  BookOpen,
  UserCheck,
  UserX,
  Award,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  User,
  Check,
  X as CloseIcon,
  ChevronRight,
  BarChart3,
  Mail,
  Send,
  AlertCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { DonutChart, GroupedBarChart } from "@/components/dashboard/charts";

import {
  MOCK_STUDENT_ATTENDANCE,
  MOCK_FACULTY_SUBMISSIONS,
  MOCK_DEPARTMENT_ATTENDANCE,
  MOCK_CORRECTION_REQUESTS,
  MOCK_LEAVE_REQUESTS,
  MOCK_ALERTS,
  type StudentAttendance,
  type FacultySubmission,
  type DepartmentAttendance,
  type CorrectionRequest,
  type LeaveRequest
} from "@/data/attendance-management-mock";

export function AttendanceModuleView({ initialTab = "overview" }: { initialTab?: string } = {}) {

  // Simulated Loading/Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States for data sources
  const [studentsAttendance, setStudentsAttendance] = useState<StudentAttendance[]>(MOCK_STUDENT_ATTENDANCE);
  const [facultiesSubmission, setFacultiesSubmission] = useState<FacultySubmission[]>(MOCK_FACULTY_SUBMISSIONS);
  const [departmentsAttendance, setDepartmentsAttendance] = useState<DepartmentAttendance[]>(MOCK_DEPARTMENT_ATTENDANCE);
  const [correctionsList, setCorrectionsList] = useState<CorrectionRequest[]>(MOCK_CORRECTION_REQUESTS);
  const [leavesList, setLeavesList] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);

  // Selection states
  const [activeTab, setActiveTab] = useState<"overview" | "defaulters" | "departments" | "faculty" | "corrections" | "leaves" | "reports">("overview");
  const [selectedStudent, setSelectedStudent] = useState<StudentAttendance | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter values
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [rangeFilter, setRangeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("pct");

  const handleResetFilters = () => {
    setSearchQuery("");
    setDeptFilter("all");
    setRangeFilter("all");
    setStatusFilter("all");
    setSortBy("pct");
    toast.success("Filters reset successfully");
  };

  const triggerReload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

  // Correction approval / reject
  const handleApproveCorrection = (id: string, name: string) => {
    setCorrectionsList((prev) => prev.filter((r) => r.id !== id));
    toast.success(`Approved attendance correction request for ${name}!`);
  };

  const handleRejectCorrection = (id: string, name: string) => {
    setCorrectionsList((prev) => prev.filter((r) => r.id !== id));
    toast.warning(`Rejected attendance correction request for ${name}.`);
  };

  // Leave approval / reject
  const handleApproveLeave = (id: string, name: string) => {
    setLeavesList((prev) => prev.filter((l) => l.id !== id));
    toast.success(`Approved leave/OD credentials for ${name}!`);
  };

  const handleRejectLeave = (id: string, name: string) => {
    setLeavesList((prev) => prev.filter((l) => l.id !== id));
    toast.warning(`Rejected leave/OD credentials for ${name}.`);
  };

  // Filter student roster
  const filteredStudents = useMemo(() => {
    return studentsAttendance
      .filter((s) => {
        const matchesSearch =
          s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.studentId.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept = deptFilter === "all" || s.department === deptFilter;
        const matchesStatus = statusFilter === "all" || s.status === statusFilter;

        let matchesRange = true;
        if (rangeFilter === "above-90") matchesRange = s.attendancePercentage >= 90;
        else if (rangeFilter === "75-90") matchesRange = s.attendancePercentage >= 75 && s.attendancePercentage < 90;
        else if (rangeFilter === "below-75") matchesRange = s.attendancePercentage < 75;

        return matchesSearch && matchesDept && matchesStatus && matchesRange;
      })
      .sort((a, b) => {
        if (sortBy === "pct") return b.attendancePercentage - a.attendancePercentage;
        if (sortBy === "name") return a.studentName.localeCompare(b.studentName);
        return 0;
      });
  }, [studentsAttendance, searchQuery, deptFilter, rangeFilter, statusFilter, sortBy]);

  // Compute metrics summary
  const metrics = useMemo(() => {
    const studentCount = studentsAttendance.length;
    const avgStudentAtt = studentCount > 0
      ? Number((studentsAttendance.reduce((sum, s) => sum + s.attendancePercentage, 0) / studentCount).toFixed(1))
      : 84.5;
    
    const activeFacultySubmissions = facultiesSubmission.filter((f) => f.status === "Submitted All").length;
    const submissionRate = facultiesSubmission.length > 0
      ? Number((facultiesSubmission.reduce((sum, f) => sum + f.submissionRate, 0) / facultiesSubmission.length).toFixed(1))
      : 92.3;

    const defaultersCount = studentsAttendance.filter((s) => s.attendancePercentage < 75).length;
    const pendingCorrections = correctionsList.length;
    const pendingLeaves = leavesList.length;

    return { avgStudentAtt, submissionRate, defaultersCount, pendingCorrections, pendingLeaves };
  }, [studentsAttendance, facultiesSubmission, correctionsList, leavesList]);

  // Charts data
  const deptAverageChart = useMemo(() => {
    return departmentsAttendance.map((d) => ({
      name: d.departmentId,
      Attendance: d.averageAttendance
    }));
  }, [departmentsAttendance]);

  const studentAttDistribution = [
    { name: "Above 90% (Excellent)", value: 3 },
    { name: "75% - 90% (Good)", value: 1 },
    { name: "Below 75% (Shortage)", value: 2 }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 w-1/3 bg-muted/40 animate-pulse rounded-md" />
        <div className="grid gap-4 grid-cols-2 md:grid-cols-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-muted/40 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-muted/40 animate-pulse rounded-xl border border-border" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 text-xs leading-normal">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <CalendarCheck className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Attendance Monitoring
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Academic Management Portal
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Monitor student attendance across departments, identify defaulters, review correction logs, and approve OD leave clearances.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={triggerReload}
            className="h-9 gap-1.5 font-semibold text-xs animate-none"
          >
            <RefreshCw className="size-3.5" /> Refresh Data
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.success("Attendance analytics sync initiated across all biometric terminals.");
            }}
            className="h-9 gap-1.5 font-semibold text-xs border-primary/30 text-primary hover:bg-primary/5"
          >
            <Sparkles className="size-3.5" /> Attendance Analytics
          </Button>
          <Button
            onClick={() => {
              toast.success("Consolidated institutional attendance CSV report downloaded!");
            }}
            className="h-9 bg-brand-gradient text-white gap-1.5 font-semibold text-xs shadow-glow hover:opacity-95 cursor-pointer"
          >
            <Download className="size-3.5" /> Export Attendance
          </Button>
        </div>
      </div>

      {/* 2. SUMMARY DASHBOARD KPI CARDS */}
      <div className="grid gap-3.5 grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-8">
        <KpiCard label="Overall Attendance" value={`${metrics.avgStudentAtt}%`} icon={CalendarCheck} tone="primary" className="h-full min-w-0" />
        <KpiCard label="Faculty Submissions" value={`${metrics.submissionRate}%`} icon={UserCheck} tone="success" className="h-full min-w-0" />
        <KpiCard label="Today's Attendance" value="84.2%" icon={ShieldCheck} tone="info" className="h-full min-w-0" />
        <KpiCard label="Students Below 75%" value={String(metrics.defaultersCount)} icon={UserX} tone="critical" className="h-full min-w-0" />
        <KpiCard label="Depts Below Target" value="1 Dept" icon={Building2} tone="warning" className="h-full min-w-0" />
        <KpiCard label="Leave OD Pending" value={String(metrics.pendingLeaves)} icon={Clock} tone="info" className="h-full min-w-0" />
        <KpiCard label="Corrections Pending" value={String(metrics.pendingCorrections)} icon={AlertTriangle} tone="warning" className="h-full min-w-0" />
        <KpiCard label="Reports Generated" value="12 Reports" icon={FileText} tone="success" className="h-full min-w-0" />
      </div>

      {/* 3. MULTIPLE VIEW TABS */}
      <div className="flex justify-between items-center border-b pb-1 flex-wrap gap-3">
        <div className="flex rounded-xl bg-muted/40 p-1 border font-semibold overflow-x-auto max-w-full no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "overview" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarCheck className="size-3.5" /> Attendance Overview
          </button>
          <button
            onClick={() => setActiveTab("defaulters")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "defaulters" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserX className="size-3.5" /> Low Attendance Monitor
          </button>
          <button
            onClick={() => setActiveTab("departments")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "departments" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="size-3.5" /> Department Stats
          </button>
          <button
            onClick={() => setActiveTab("faculty")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "faculty" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserCheck className="size-3.5" /> Faculty Submission rate
          </button>
          <button
            onClick={() => setActiveTab("corrections")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "corrections" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertTriangle className="size-3.5" /> Corrections ledger ({correctionsList.length})
          </button>
          <button
            onClick={() => setActiveTab("leaves")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "leaves" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="size-3.5" /> Leave & OD requests ({leavesList.length})
          </button>
        </div>
      </div>

      {/* 4. TAB PANELS */}

      {/* TAB 1: Attendance Roster Overview */}
      {activeTab === "overview" && (
        <div className="space-y-4 border rounded-2xl bg-card p-5 shadow-sm">
          <div className="flex justify-between items-center border-b pb-3 mb-2 flex-wrap gap-2">
            <h3 className="text-base font-bold font-display text-foreground flex items-center gap-2">
              <CalendarCheck className="size-5 text-primary" /> Roster Student Attendance Directory
            </h3>
            
            {/* Roster Search Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search student..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs w-[140px]"
                />
              </div>

              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="h-8 text-xs w-[110px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Depts</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="ME">ME</SelectItem>
                </SelectContent>
              </Select>

              <Select value={rangeFilter} onValueChange={setRangeFilter}>
                <SelectTrigger className="h-8 text-xs w-[110px]">
                  <SelectValue placeholder="Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ranges</SelectItem>
                  <SelectItem value="above-90">Above 90%</SelectItem>
                  <SelectItem value="75-90">75% - 90%</SelectItem>
                  <SelectItem value="below-75">Below 75%</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="ghost" onClick={handleResetFilters} className="h-8 px-2 font-semibold">
                Reset
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-medium text-foreground min-w-[850px]">

              <thead>
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2">Student ID</th>
                  <th className="py-2">Student Name</th>
                  <th className="py-2">Department</th>
                  <th className="py-2">Semester</th>
                  <th className="py-2">Attendance %</th>
                  <th className="py-2">Classes Conducted</th>
                  <th className="py-2">Classes Attended</th>
                  <th className="py-2">Classes Missed</th>
                  <th className="py-2">Risk Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((stud) => (
                  <tr key={stud.studentId} className="border-b border-border/40 hover:bg-muted/5 transition-colors">
                    <td className="py-3 font-mono font-bold">{stud.studentId}</td>
                    <td className="py-3 font-bold text-foreground">{stud.studentName}</td>
                    <td className="py-3 font-semibold">{stud.department} &middot; {stud.section}</td>
                    <td className="py-3">{stud.semester}</td>
                    <td className="py-3 font-mono font-bold text-primary text-xs">
                      {stud.attendancePercentage}%
                    </td>
                    <td className="py-3 font-mono">{stud.conducted}</td>
                    <td className="py-3 font-mono text-emerald-600 font-bold">{stud.attended}</td>
                    <td className="py-3 font-mono text-destructive">{stud.missed}</td>
                    <td className="py-3">
                      <Badge
                        variant="outline"
                        className={`text-[9px] uppercase ${
                          stud.status === "Excellent"
                            ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                            : stud.status === "Warning"
                            ? "text-amber-500 border-amber-200 bg-amber-50"
                            : stud.status === "Critical"
                            ? "text-destructive border-destructive/20 bg-destructive/5"
                            : "text-primary border-primary/20 bg-primary/5"
                        }`}
                      >
                        {stud.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedStudent(stud);
                          setIsDetailsOpen(true);
                        }}
                        className="h-8 text-primary hover:bg-primary/5 cursor-pointer font-semibold"
                      >
                        <Eye className="size-3.5 mr-1" /> View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Low Attendance Monitor */}
      {activeTab === "defaulters" && (
        <div className="space-y-4 border rounded-2xl bg-card p-5 shadow-sm">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <UserX className="size-5 text-primary" /> Students Below 75% Attendance Threshold
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {studentsAttendance
              .filter((s) => s.attendancePercentage < 75)
              .map((stud) => (
                <div key={stud.studentId} className="p-4 border rounded-xl space-y-2.5 bg-destructive/5 border-destructive/20 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-mono font-bold text-[10px] text-destructive">{stud.studentId}</span>
                      <Badge variant="outline" className="text-[9px] uppercase text-destructive border-destructive/20">
                        {stud.riskLevel}
                      </Badge>
                    </div>
                    <p className="font-bold text-foreground text-xs mt-1.5">{stud.studentName}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{stud.department} &middot; {stud.semester}</p>
                    
                    <div className="grid grid-cols-2 gap-2 border rounded-lg p-2.5 bg-card mt-3">
                      <div>
                        <span className="text-[9px] text-muted-foreground">Attendance</span>
                        <p className="font-bold font-mono text-destructive">{stud.attendancePercentage}%</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground">Classes Needed</span>
                        <p className="font-bold font-mono text-primary">+{stud.shortage} sessions</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40 flex justify-between items-center">
                    <span className="text-[9px] text-muted-foreground italic">Shortage warning active</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        toast.success(`Official shortage alert warning sent to ${stud.studentName}!`);
                      }}
                      className="h-7 text-[10px] font-semibold text-primary hover:bg-primary/5 cursor-pointer"
                    >
                      <Mail className="size-3 mr-1" /> Alert Parent
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: Department Stats */}
      {activeTab === "departments" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Attendance Cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
                <Building2 className="size-5 text-primary" /> Department Attendance Trends Comparison
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departmentsAttendance.map((d) => (
                  <div key={d.departmentId} className="p-4 border rounded-xl space-y-3 bg-muted/10 hover:bg-muted/15 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-foreground">School of {d.departmentId}</span>
                      <Badge variant="outline" className="font-mono text-[9px] text-primary border-primary/20">
                        {d.studentsCount} Students
                      </Badge>
                    </div>

                    <div className="flex justify-between items-end border-b pb-2.5">
                      <div>
                        <span className="text-[9px] text-muted-foreground">Average Attendance</span>
                        <p className="text-xl font-bold font-mono text-primary mt-0.5">{d.averageAttendance}%</p>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-[10px] text-emerald-600">
                        <TrendingUp className="size-3.5" /> {d.trend.toUpperCase()}
                      </div>
                    </div>

                    <div className="space-y-1 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Best Section:</span>
                        <span className="font-bold text-foreground">{d.bestSection}</span>
                      </div>
                      <div className="flex justify-between mt-0.5">
                        <span className="text-muted-foreground">Lowest Section:</span>
                        <span className="font-bold text-destructive">{d.lowestSection}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department Analytics charts */}
          <div className="lg:col-span-1 border rounded-2xl bg-card p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between border-b pb-2">
              <span>Attendance Distribution</span>
              <span className="text-[10px] text-success font-mono">Brackets status</span>
            </h4>
            <DonutChart data={studentAttDistribution} centerLabel="Brackets" height={160} />
          </div>
        </div>
      )}

      {/* TAB 4: Faculty Submission log */}
      {activeTab === "faculty" && (
        <div className="space-y-4 border rounded-2xl bg-card p-5 shadow-sm">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <UserCheck className="size-5 text-primary" /> Faculty Submission Logs & Completion Checklist
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead>
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2">Faculty Member</th>
                  <th className="py-2">Department</th>
                  <th className="py-2">Assigned Classes</th>
                  <th className="py-2">Completed Classes</th>
                  <th className="py-2">Pending Overdue</th>
                  <th className="py-2">Submission Rate</th>
                  <th className="py-2 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {facultiesSubmission.map((fac) => (
                  <tr key={fac.facultyId} className="border-b border-border/40 hover:bg-muted/5 transition-colors">
                    <td className="py-3 font-bold text-foreground">{fac.facultyName}</td>
                    <td className="py-3">{fac.department}</td>
                    <td className="py-3 font-mono">{fac.assignedClasses}</td>
                    <td className="py-3 font-mono text-emerald-600 font-bold">{fac.completedClasses}</td>
                    <td className="py-3 font-mono text-destructive font-bold">{fac.pendingSubmissions}</td>
                    <td className="py-3 font-mono font-bold text-primary">{fac.submissionRate}%</td>
                    <td className="py-3 text-right">
                      {fac.pendingSubmissions > 0 ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            toast.success(`Action reminder alert sent to ${fac.facultyName}!`);
                          }}
                          className="h-8 bg-brand-gradient text-white font-semibold cursor-pointer text-[10px]"
                        >
                          <Send className="size-3 mr-1" /> Send Reminder
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-[9px] uppercase text-emerald-600 border-emerald-200 bg-emerald-50">
                          Completed
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Corrections Ledger */}
      {activeTab === "corrections" && (
        <div className="space-y-4 border rounded-2xl bg-card p-5 shadow-sm">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <AlertTriangle className="size-5 text-primary" /> Student Biometric Correction Requests
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead>
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2">Request ID</th>
                  <th className="py-2">Student Name</th>
                  <th className="py-2">Instructor / Course</th>
                  <th className="py-2">Correction Reason</th>
                  <th className="py-2">Requested Date</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {correctionsList.map((req) => (
                  <tr key={req.requestId} className="border-b border-border/40 hover:bg-muted/5 transition-colors">
                    <td className="py-3 font-mono font-bold">{req.requestId}</td>
                    <td className="py-3 font-bold text-foreground">
                      <p>{req.studentName}</p>
                      <span className="font-mono text-[9px] text-muted-foreground">{req.studentId}</span>
                    </td>
                    <td className="py-3 font-semibold">
                      <p>{req.facultyName}</p>
                      <span className="font-mono text-[9px] text-muted-foreground">{req.subjectCode} - {req.subjectName}</span>
                    </td>
                    <td className="py-3 text-muted-foreground max-w-xs truncate">{req.reason}</td>
                    <td className="py-3 font-mono">{req.requestedDate}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-[9px] uppercase">
                        {req.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApproveCorrection(req.requestId, req.studentName)}
                          className="h-8 text-[10px] font-semibold border-emerald-200 text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRejectCorrection(req.requestId, req.studentName)}
                          className="h-8 text-[10px] font-semibold text-destructive hover:bg-destructive/10 cursor-pointer"
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: Leave / OD Requests */}
      {activeTab === "leaves" && (
        <div className="space-y-4 border rounded-2xl bg-card p-5 shadow-sm">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Clock className="size-5 text-primary" /> Leave & On-Duty (OD) Clearances
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead>
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2">Request ID</th>
                  <th className="py-2">Student Name</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Reason</th>
                  <th className="py-2">Requested Date</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leavesList.map((req) => (
                  <tr key={req.requestId} className="border-b border-border/40 hover:bg-muted/5 transition-colors">
                    <td className="py-3 font-mono font-bold">{req.requestId}</td>
                    <td className="py-3 font-bold text-foreground">
                      <p>{req.studentName}</p>
                      <span className="font-mono text-[9px] text-muted-foreground">{req.studentId}</span>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-[9px] font-semibold font-mono">
                        {req.type}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground max-w-xs truncate">{req.reason}</td>
                    <td className="py-3 font-mono">{req.requestedDate}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-[9px] uppercase">
                        {req.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApproveLeave(req.requestId, req.studentName)}
                          className="h-8 text-[10px] font-semibold border-emerald-200 text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRejectLeave(req.requestId, req.studentName)}
                          className="h-8 text-[10px] font-semibold text-destructive hover:bg-destructive/10 cursor-pointer"
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. DETAIL STUDENT WORKSPACE DIALOG */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          {selectedStudent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/25 font-mono">
                    {selectedStudent.studentId}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {selectedStudent.department} &middot; {selectedStudent.section}
                  </span>
                </div>
                <DialogTitle className="text-base font-bold font-display mt-1">
                  {selectedStudent.studentName}
                </DialogTitle>
                <DialogDescription>
                  Detailed attendance metrics, course completed ratios, and recent absence logs.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2.5">
                <div className="grid grid-cols-2 gap-3.5 border rounded-xl p-3 bg-muted/20">
                  <div>
                    <span className="text-muted-foreground text-[10px]">Syllabus Semester</span>
                    <p className="font-bold mt-0.5">{selectedStudent.semester}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Attendance %</span>
                    <p className="font-bold mt-0.5 font-mono text-primary text-sm">{selectedStudent.attendancePercentage}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Classes Conducted</span>
                    <p className="font-bold mt-0.5">{selectedStudent.conducted} classes</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Risk Warning Limit</span>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-wide mt-1">
                      {selectedStudent.riskLevel}
                    </Badge>
                  </div>
                </div>

                {/* Subject Wise Cards mock placeholder */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-foreground">Course-wise Breakdown Summary</h4>
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    <div className="p-2.5 border rounded-lg flex justify-between items-center bg-card">
                      <div>
                        <p className="font-bold text-[10px]">CS501 Computer Networks</p>
                        <span className="text-[9px] text-muted-foreground">Dr. K. Sai Teja</span>
                      </div>
                      <span className="font-mono font-bold text-primary">85.5%</span>
                    </div>
                    <div className="p-2.5 border rounded-lg flex justify-between items-center bg-card">
                      <div>
                        <p className="font-bold text-[10px]">CS502 Web Technologies</p>
                        <span className="text-[9px] text-muted-foreground">Dr. S. K. Gupta</span>
                      </div>
                      <span className="font-mono font-bold text-destructive">72.0%</span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close details</Button>
                <Button
                  onClick={() => {
                    toast.success(`Shortage warning letter generated for ${selectedStudent.studentName}!`);
                  }}
                  className="bg-brand-gradient text-white font-semibold"
                >
                  Generate Letter
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
