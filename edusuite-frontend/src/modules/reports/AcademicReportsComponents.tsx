import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  BarChart3,
  Search,
  RefreshCw,
  Download,
  FileText,
  Printer,
  Sparkles,
  Users,
  UserCheck,
  CalendarCheck,
  TrendingUp,
  Award,
  Briefcase,
  Building2,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Filter,
  X,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Zap,
  Bell,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Layers,
  GraduationCap,
  PieChart as PieChartIcon,
  RotateCcw,
  FileCode,
  CheckCircle,
  HelpCircle,
  FileCheck
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import {
  DonutChart,
  GroupedBarChart,
  TrendAreaChart,
  TrendLineChart,
  ChartLegend,
} from "@/components/dashboard/charts";

import {
  EXECUTIVE_KPIS,
  REPORT_CATEGORIES,
  DEPARTMENT_ANALYTICS,
  FACULTY_ANALYTICS,
  SUBJECT_ANALYTICS,
  STUDENT_ANALYTICS,
  INSTITUTIONAL_TARGETS,
  OVERALL_ATTENDANCE_TREND,
  PASS_PERCENTAGE_TREND,
  DEPT_COMPARISON_CHART,
  CGPA_DISTRIBUTION_CHART,
  BACKLOG_TREND_CHART,
  REPORT_HISTORY_DATA,
  INSIGHT_CARDS_DATA,
  NOTIFICATIONS_DATA,
  type ReportCategoryItem,
  type DepartmentAnalytic,
  type FacultyAnalytic,
  type SubjectAnalytic,
  type StudentAnalytic,
} from "@/data/academic-reports-mock";

// Icon lookup helper for KPIs
function getKpiIcon(iconName: string) {
  switch (iconName) {
    case "Users": return Users;
    case "UserCheck": return UserCheck;
    case "CalendarCheck": return CalendarCheck;
    case "TrendingUp": return TrendingUp;
    case "Award": return Award;
    case "Briefcase": return Briefcase;
    case "Building2": return Building2;
    case "Clock": default: return Clock;
  }
}

export function AcademicReportsModuleView() {
  // ── Loading & Error States ──────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Tab State ───────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<
    "reports" | "departments" | "faculty" | "subjects" | "students" | "analytics" | "comparison" | "builder" | "history"
  >("reports");

  // ── Filters State ───────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // ── Custom Report Builder Modal State ──────────────────────
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderForm, setBuilderForm] = useState({
    department: "All",
    program: "B.Tech",
    semester: "Semester VI",
    subjects: "All Subjects",
    dateRange: "2025-2026",
    reportType: "Attendance & Performance",
    outputFormat: "PDF",
  });

  // ── Comparison View State ───────────────────────────────────
  const [compMode, setCompMode] = useState<"dept" | "sem" | "year" | "prog">("dept");
  const [compEntityA, setCompEntityA] = useState("CSE");
  const [compEntityB, setCompEntityB] = useState("ECE");

  // ── Preview Modal State ─────────────────────────────────────
  const [previewReport, setPreviewReport] = useState<ReportCategoryItem | null>(null);

  const handleResetFilters = () => {
    setSearchQuery("");
    setYearFilter("all");
    setDeptFilter("all");
    setCategoryFilter("all");
    setSortBy("newest");
    toast.success("Filters reset successfully.");
  };

  const triggerReload = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => setLoading(false), 600);
  };

  // Filter report categories
  const filteredReports = useMemo(() => {
    return REPORT_CATEGORIES.filter((rep) => {
      const matchSearch =
        rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === "all" || rep.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, categoryFilter]);

  // Filter department analytics
  const filteredDepts = useMemo(() => {
    return DEPARTMENT_ANALYTICS.filter((d) => {
      return deptFilter === "all" || d.departmentId === deptFilter;
    });
  }, [deptFilter]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
        <div className="h-16 w-1/3 bg-muted/40 animate-pulse rounded-md" />
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-muted/40 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-muted/40 animate-pulse rounded-xl border border-border" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 border rounded-2xl bg-card text-center space-y-4 shadow-sm">
        <AlertTriangle className="size-10 text-destructive mx-auto" />
        <h3 className="text-base font-bold text-foreground">Failed to load academic reports</h3>
        <p className="text-xs text-muted-foreground">{error}</p>
        <Button onClick={triggerReload} className="bg-brand-gradient text-white font-semibold">
          <RefreshCw className="size-3.5 mr-1.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 text-xs leading-normal">
      
      {/* ── 1. PAGE HEADER ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b pb-5 border-border">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
            <BarChart3 className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Academic Reports & Analytics
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Academic Management Portal
              </Badge>
            </div>
            <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
              <span>Academic Management</span>
              <ChevronRight className="size-3" />
              <span className="text-foreground font-semibold">Reports & Analytics</span>
            </nav>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Analyze institutional academic performance, generate reports, monitor KPIs, and compare departments.
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button variant="outline" size="sm" onClick={triggerReload} className="h-9 gap-1.5 font-semibold text-xs">
            <RefreshCw className="size-3.5" /> Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.print();
              toast.info("Preparing print layout...");
            }}
            className="h-9 gap-1.5 font-semibold text-xs border-border"
          >
            <Printer className="size-3.5" /> Print Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Exporting institutional executive report to Excel...")}
            className="h-9 gap-1.5 font-semibold text-xs border-emerald-300 text-emerald-600 hover:bg-emerald-50"
          >
            <FileSpreadsheet className="size-3.5" /> Export Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Exporting executive summary to PDF...")}
            className="h-9 gap-1.5 font-semibold text-xs border-primary/30 text-primary hover:bg-primary/5"
          >
            <Download className="size-3.5" /> Export PDF
          </Button>
          <Button
            onClick={() => setIsBuilderOpen(true)}
            className="h-9 bg-brand-gradient text-white gap-1.5 font-semibold text-xs shadow-glow hover:opacity-95 cursor-pointer"
          >
            <Sparkles className="size-3.5" /> Generate Report
          </Button>
        </div>
      </div>

      {/* ── 2. EXECUTIVE KPI DASHBOARD ─────────────────────── */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        {EXECUTIVE_KPIS.map((kpi) => {
          const IconComp = getKpiIcon(kpi.iconName);
          return (
            <KpiCard
              key={kpi.id}
              label={kpi.label}
              value={kpi.value}
              icon={IconComp}
              delta={kpi.comparison}
              trend={kpi.trend}
              tone={kpi.tone}
            />
          );
        })}
      </div>

      {/* ── 3. AI RECENT INSIGHT CARDS ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {INSIGHT_CARDS_DATA.map((ins) => (
          <div
            key={ins.id}
            className={`p-3 border rounded-xl space-y-1.5 transition-all hover:shadow-card ${
              ins.type === "positive"
                ? "bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-200"
                : ins.type === "warning"
                ? "bg-amber-50/50 dark:bg-amber-500/5 border-amber-200"
                : "bg-primary/5 border-primary/20"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-[11px] text-foreground flex items-center gap-1">
                <Zap className="size-3 text-amber-500" /> {ins.title}
              </span>
              <Badge variant="outline" className="text-[9px] font-mono font-bold">
                {ins.metric}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {ins.description}
            </p>
            <span className="text-[9px] text-muted-foreground/70 font-mono block">{ins.timestamp}</span>
          </div>
        ))}
      </div>

      {/* ── 4. TAB NAVIGATION ──────────────────────────────── */}
      <div className="flex items-center justify-between border-b pb-1 flex-wrap gap-3">
        <div className="flex rounded-xl bg-muted/40 p-1 border font-semibold overflow-x-auto">
          {[
            { id: "reports", label: "Report Library (15)", icon: FileText },
            { id: "departments", label: "Department Analytics", icon: Building2 },
            { id: "faculty", label: "Faculty Analytics", icon: UserCheck },
            { id: "subjects", label: "Subject Analytics", icon: BookOpen },
            { id: "students", label: "Student Analytics", icon: Users },
            { id: "analytics", label: "Analytics Dashboard", icon: BarChart3 },
            { id: "comparison", label: "Comparison Tool", icon: SlidersHorizontal },
            { id: "history", label: "Report History", icon: Clock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="size-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <Button
          size="sm"
          onClick={() => setIsBuilderOpen(true)}
          className="h-8 text-[11px] font-bold bg-brand-gradient text-white gap-1 shadow-sm"
        >
          <Sparkles className="size-3.5" /> Report Builder
        </Button>
      </div>

      {/* ── 5. SEARCH & FILTERS TOOLBAR ───────────────────── */}
      <div className="flex items-center justify-between border rounded-2xl bg-card p-3 shadow-sm flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search reports or metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs w-[180px]"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-8 text-xs w-[120px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Academic">Academic</SelectItem>
              <SelectItem value="Performance">Performance</SelectItem>
              <SelectItem value="Compliance">Compliance</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
            </SelectContent>
          </Select>

          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="h-8 text-xs w-[110px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Depts</SelectItem>
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="ECE">ECE</SelectItem>
              <SelectItem value="ME">ME</SelectItem>
              <SelectItem value="AI&DS">AI&DS</SelectItem>
              <SelectItem value="CIVIL">CIVIL</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-8 px-2 font-semibold text-xs">
            <X className="size-3 mr-1" /> Reset
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">Academic Year: 2025-2026</span>
          <Badge variant="outline" className="font-mono text-[9px] text-emerald-600 border-emerald-200 bg-emerald-50">
            Active Semester VI
          </Badge>
        </div>
      </div>

      {/* ── 6. TAB PANELS ─────────────────────────────────── */}

      {/* TAB 1: 15 Report Category Cards */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-base font-bold font-display text-foreground flex items-center gap-2">
              <FileText className="size-5 text-primary" /> Comprehensive Academic Report Catalog (15 Modules)
            </h3>
            <span className="text-muted-foreground font-mono text-[10px]">Showing {filteredReports.length} reports</span>
          </div>

          {filteredReports.length === 0 ? (
            <div className="p-12 text-center border border-dashed rounded-2xl bg-card space-y-3">
              <FileText className="size-10 text-muted-foreground/30 mx-auto" />
              <h3 className="text-sm font-bold text-foreground">No reports found</h3>
              <p className="text-xs text-muted-foreground">Adjust your search term or category filters.</p>
              <Button onClick={handleResetFilters} variant="outline" size="sm">Reset Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((rep) => (
                <div key={rep.id} className="p-4 border rounded-2xl bg-card hover:border-primary/40 hover:shadow-card transition-all flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                        <FileText className="size-4 text-primary shrink-0" />
                        {rep.title}
                      </h4>
                      <Badge variant="outline" className="text-[9px] uppercase font-mono shrink-0">
                        {rep.category}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                      {rep.description}
                    </p>
                  </div>

                  <div className="space-y-2 border-t pt-3">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-muted-foreground">Last Generated:</span>
                      <span className="font-mono text-foreground font-semibold">{rep.lastGenerated}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <Badge variant="outline" className="text-[9px] text-emerald-600 border-emerald-200 bg-emerald-50">
                        <CheckCircle className="size-3 mr-1" /> {rep.status}
                      </Badge>
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPreviewReport(rep)}
                          className="h-7 text-[10px] font-semibold text-primary hover:bg-primary/5 cursor-pointer"
                        >
                          <Eye className="size-3 mr-1" /> Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toast.success(`Downloading ${rep.title} (${rep.format})...`)}
                          className="h-7 text-[10px] font-semibold cursor-pointer"
                        >
                          <Download className="size-3 mr-1" /> {rep.format}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Department Analytics */}
      {activeTab === "departments" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Building2 className="size-5 text-primary" /> Institutional Department Academic Performance Matrix
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {filteredDepts.map((dept) => (
              <div key={dept.departmentId} className="p-4 border rounded-xl bg-muted/10 hover:bg-muted/20 transition-colors space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-foreground">#{dept.rank} &middot; {dept.departmentName}</span>
                  <Badge variant="outline" className="font-mono text-[9px] text-primary border-primary/20">
                    Score: {dept.performanceScore}/100
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 border rounded-lg p-2.5 bg-card text-[10px]">
                  <div>
                    <span className="text-muted-foreground">Faculty / Students</span>
                    <p className="font-bold font-mono text-foreground mt-0.5">{dept.facultyCount} / {dept.studentCount}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg Attendance</span>
                    <p className="font-bold font-mono text-emerald-600 mt-0.5">{dept.avgAttendance}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pass %</span>
                    <p className="font-bold font-mono text-primary mt-0.5">{dept.passPercentage}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg CGPA</span>
                    <p className="font-bold font-mono text-foreground mt-0.5">{dept.avgCgpa}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead className="bg-muted/30">
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-center">Faculty</th>
                  <th className="py-2.5 px-3 text-center">Students</th>
                  <th className="py-2.5 px-3 text-center">Attendance %</th>
                  <th className="py-2.5 px-3 text-center">Pass %</th>
                  <th className="py-2.5 px-3 text-center">Avg CGPA</th>
                  <th className="py-2.5 px-3 text-center">Backlogs</th>
                  <th className="py-2.5 px-3 text-center">Performance Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepts.map((d) => (
                  <tr key={d.departmentId} className="border-b border-border/40 hover:bg-muted/5">
                    <td className="py-3 px-3 font-mono font-bold text-amber-500">#{d.rank}</td>
                    <td className="py-3 px-3 font-bold">{d.departmentName} ({d.departmentId})</td>
                    <td className="py-3 px-3 text-center font-mono">{d.facultyCount}</td>
                    <td className="py-3 px-3 text-center font-mono">{d.studentCount}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">{d.avgAttendance}%</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-primary">{d.passPercentage}%</td>
                    <td className="py-3 px-3 text-center font-mono font-bold">{d.avgCgpa}</td>
                    <td className="py-3 px-3 text-center font-mono text-destructive">{d.backlogs}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-violet-600">{d.performanceScore} / 100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Faculty Analytics */}
      {activeTab === "faculty" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <UserCheck className="size-5 text-primary" /> Faculty Academic Workload & Performance Ledger
          </h3>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead className="bg-muted/30">
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2.5 px-3">Faculty ID</th>
                  <th className="py-2.5 px-3">Faculty Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-center">Subjects</th>
                  <th className="py-2.5 px-3 text-center">Classes Conducted</th>
                  <th className="py-2.5 px-3 text-center">Student Attendance %</th>
                  <th className="py-2.5 px-3 text-center">Result Pass %</th>
                  <th className="py-2.5 px-3 text-center">Workload (hrs/wk)</th>
                  <th className="py-2.5 px-3 text-center">Feedback Rating</th>
                </tr>
              </thead>
              <tbody>
                {FACULTY_ANALYTICS.map((fac) => (
                  <tr key={fac.facultyId} className="border-b border-border/40 hover:bg-muted/5">
                    <td className="py-3 px-3 font-mono font-bold">{fac.facultyId}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{fac.facultyName}</td>
                    <td className="py-3 px-3">{fac.department}</td>
                    <td className="py-3 px-3 text-center font-mono">{fac.subjectsHandled}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold">{fac.classesConducted}</td>
                    <td className="py-3 px-3 text-center font-mono text-emerald-600 font-bold">{fac.avgStudentAttendance}%</td>
                    <td className="py-3 px-3 text-center font-mono text-primary font-bold">{fac.resultPerformance}%</td>
                    <td className="py-3 px-3 text-center font-mono">{fac.workloadHours} hrs</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-amber-500">★ {fac.feedbackScore} / 5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Subject Analytics */}
      {activeTab === "subjects" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <BookOpen className="size-5 text-primary" /> Subject Pass Ratios & Difficulty Index Analytics
          </h3>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead className="bg-muted/30">
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2.5 px-3">Subject Code</th>
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Primary Instructor</th>
                  <th className="py-2.5 px-3 text-center">Pass %</th>
                  <th className="py-2.5 px-3 text-center">Fail %</th>
                  <th className="py-2.5 px-3 text-center">Average Marks</th>
                  <th className="py-2.5 px-3 text-center">Attendance %</th>
                  <th className="py-2.5 px-3 text-center">Difficulty Index</th>
                </tr>
              </thead>
              <tbody>
                {SUBJECT_ANALYTICS.map((sub) => (
                  <tr key={sub.subjectCode} className="border-b border-border/40 hover:bg-muted/5">
                    <td className="py-3 px-3 font-mono font-bold">{sub.subjectCode}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{sub.subjectName}</td>
                    <td className="py-3 px-3">{sub.department}</td>
                    <td className="py-3 px-3 text-muted-foreground">{sub.facultyName}</td>
                    <td className="py-3 px-3 text-center font-mono text-emerald-600 font-bold">{sub.passPercent}%</td>
                    <td className="py-3 px-3 text-center font-mono text-destructive font-bold">{sub.failPercent}%</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-primary">{sub.avgMarks} / 100</td>
                    <td className="py-3 px-3 text-center font-mono">{sub.attendancePercent}%</td>
                    <td className="py-3 px-3 text-center">
                      <Badge
                        variant="outline"
                        className={`text-[9px] uppercase ${
                          sub.difficultyIndex === "High" ? "text-destructive border-destructive/20 bg-destructive/5" : "text-emerald-600 border-emerald-200 bg-emerald-50"
                        }`}
                      >
                        {sub.difficultyIndex}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Student Analytics */}
      {activeTab === "students" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Users className="size-5 text-primary" /> Student Academic Risk & Credit Progression Ledger
          </h3>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead className="bg-muted/30">
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-center">Attendance %</th>
                  <th className="py-2.5 px-3 text-center">Avg Marks</th>
                  <th className="py-2.5 px-3 text-center">SGPA</th>
                  <th className="py-2.5 px-3 text-center">CGPA</th>
                  <th className="py-2.5 px-3 text-center">Credits Earned</th>
                  <th className="py-2.5 px-3 text-center">Backlogs</th>
                  <th className="py-2.5 px-3 text-center">Trend</th>
                  <th className="py-2.5 px-3 text-center">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {STUDENT_ANALYTICS.map((st) => (
                  <tr key={st.studentId} className="border-b border-border/40 hover:bg-muted/5">
                    <td className="py-3 px-3 font-mono font-bold">{st.studentId}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{st.studentName}</td>
                    <td className="py-3 px-3">{st.department}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">{st.attendance}%</td>
                    <td className="py-3 px-3 text-center font-mono">{st.avgMarks}%</td>
                    <td className="py-3 px-3 text-center font-mono font-bold">{st.sgpa}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-primary">{st.cgpa}</td>
                    <td className="py-3 px-3 text-center font-mono">{st.creditsEarned}</td>
                    <td className="py-3 px-3 text-center font-mono text-destructive">{st.backlogs}</td>
                    <td className="py-3 px-3 text-center font-semibold text-emerald-600">{st.trend}</td>
                    <td className="py-3 px-3 text-center">
                      <Badge
                        variant="outline"
                        className={`text-[9px] uppercase ${
                          st.riskCategory === "High" ? "text-destructive border-destructive/20 bg-destructive/5" : "text-emerald-600 border-emerald-200 bg-emerald-50"
                        }`}
                      >
                        {st.riskCategory} Risk
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: Interactive Analytics Dashboard */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Institutional Progress Targets */}
          <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold font-display text-foreground border-b pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-emerald-600" /> Institutional Target Progress Metrics</span>
              <span className="text-[10px] text-muted-foreground font-mono">Academic Year 2025-26</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
              {INSTITUTIONAL_TARGETS.map((tgt) => (
                <div key={tgt.title} className="p-3 border rounded-xl bg-muted/10 space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-semibold text-foreground">{tgt.title}</span>
                    <Badge variant="outline" className="text-[8px] text-emerald-600 border-emerald-200 bg-emerald-50">
                      {tgt.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-baseline font-mono">
                    <span className="text-lg font-bold text-primary">{tgt.achieved}{tgt.unit}</span>
                    <span className="text-[9px] text-muted-foreground">Target: {tgt.target}{tgt.unit}</span>
                  </div>
                  <Progress value={Math.min((tgt.achieved / tgt.target) * 100, 100)} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Charts Grid 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between">
                <span>Overall Attendance Trend</span>
                <span className="text-[10px] text-emerald-600 lowercase font-mono">monthly avg %</span>
              </h4>
              <TrendAreaChart
                data={OVERALL_ATTENDANCE_TREND as any}
                xKey="name"
                series={[{ key: "Attendance", label: "Attendance %" }]}
                height={180}
              />
            </div>

            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between">
                <span>Pass Percentage Progression</span>
                <span className="text-[10px] text-primary lowercase font-mono">semester progression</span>
              </h4>
              <TrendLineChart
                data={PASS_PERCENTAGE_TREND as any}
                xKey="name"
                series={[{ key: "PassRate", label: "Pass Rate %" }]}
                height={180}
              />
            </div>
          </div>

          {/* Charts Grid 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2 col-span-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between">
                <span>Department Comparison (Pass Rate vs Attendance)</span>
                <span className="text-[10px] text-primary lowercase font-mono">by department</span>
              </h4>
              <GroupedBarChart
                data={DEPT_COMPARISON_CHART as any}
                xKey="name"
                series={[
                  { key: "PassRate", label: "Pass Rate %" },
                  { key: "Attendance", label: "Attendance %" },
                ]}
                height={200}
              />
            </div>

            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2 col-span-1">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">CGPA Distribution</h4>
              <DonutChart data={CGPA_DISTRIBUTION_CHART} height={180} centerLabel="CGPA" />
              <ChartLegend items={CGPA_DISTRIBUTION_CHART} />
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: Side-by-Side Comparison Tool */}
      {activeTab === "comparison" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
            <h3 className="text-base font-bold font-display text-foreground flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-primary" /> Side-by-Side Entity Academic Comparison Tool
            </h3>
            <div className="flex items-center gap-2">
              <Select value={compMode} onValueChange={(val: any) => setCompMode(val)}>
                <SelectTrigger className="h-8 text-xs w-[140px]">
                  <SelectValue placeholder="Compare Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dept">Dept vs Dept</SelectItem>
                  <SelectItem value="sem">Sem vs Sem</SelectItem>
                  <SelectItem value="year">Year vs Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Entity A */}
            <div className="p-4 border rounded-xl bg-muted/10 space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-bold text-xs text-primary">Entity A: School of CSE</span>
                <Badge variant="outline" className="text-[9px] font-mono">Rank #1</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                <div className="p-2 border rounded-lg bg-card">
                  <span className="text-[9px] font-sans text-muted-foreground">Pass Percentage</span>
                  <p className="font-bold text-emerald-600 text-sm mt-0.5">94.2%</p>
                </div>
                <div className="p-2 border rounded-lg bg-card">
                  <span className="text-[9px] font-sans text-muted-foreground">Average CGPA</span>
                  <p className="font-bold text-primary text-sm mt-0.5">8.24</p>
                </div>
                <div className="p-2 border rounded-lg bg-card">
                  <span className="text-[9px] font-sans text-muted-foreground">Avg Attendance</span>
                  <p className="font-bold text-foreground text-sm mt-0.5">89.2%</p>
                </div>
                <div className="p-2 border rounded-lg bg-card">
                  <span className="text-[9px] font-sans text-muted-foreground">Backlogs Count</span>
                  <p className="font-bold text-destructive text-sm mt-0.5">18 Backlogs</p>
                </div>
              </div>
            </div>

            {/* Entity B */}
            <div className="p-4 border rounded-xl bg-muted/10 space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-bold text-xs text-primary">Entity B: School of ECE</span>
                <Badge variant="outline" className="text-[9px] font-mono">Rank #2</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                <div className="p-2 border rounded-lg bg-card">
                  <span className="text-[9px] font-sans text-muted-foreground">Pass Percentage</span>
                  <p className="font-bold text-emerald-600 text-sm mt-0.5">90.8%</p>
                </div>
                <div className="p-2 border rounded-lg bg-card">
                  <span className="text-[9px] font-sans text-muted-foreground">Average CGPA</span>
                  <p className="font-bold text-primary text-sm mt-0.5">7.95</p>
                </div>
                <div className="p-2 border rounded-lg bg-card">
                  <span className="text-[9px] font-sans text-muted-foreground">Avg Attendance</span>
                  <p className="font-bold text-foreground text-sm mt-0.5">87.5%</p>
                </div>
                <div className="p-2 border rounded-lg bg-card">
                  <span className="text-[9px] font-sans text-muted-foreground">Backlogs Count</span>
                  <p className="font-bold text-destructive text-sm mt-0.5">24 Backlogs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: Report History */}
      {activeTab === "history" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Clock className="size-5 text-primary" /> Generated Report History & Archive Ledger
          </h3>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead className="bg-muted/30">
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2.5 px-3">Report ID</th>
                  <th className="py-2.5 px-3">Report Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Generated By</th>
                  <th className="py-2.5 px-3">Generated On</th>
                  <th className="py-2.5 px-3 text-center">Format</th>
                  <th className="py-2.5 px-3 text-center">File Size</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {REPORT_HISTORY_DATA.map((h) => (
                  <tr key={h.id} className="border-b border-border/40 hover:bg-muted/5">
                    <td className="py-3 px-3 font-mono font-bold">{h.id}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{h.reportName}</td>
                    <td className="py-3 px-3 font-semibold">{h.category}</td>
                    <td className="py-3 px-3 text-muted-foreground">{h.generatedBy}</td>
                    <td className="py-3 px-3 font-mono">{h.generatedOn}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-primary">{h.format}</td>
                    <td className="py-3 px-3 text-center font-mono">{h.size}</td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success(`Downloading ${h.reportName}...`)}
                        className="h-7 text-[10px] font-semibold cursor-pointer"
                      >
                        <Download className="size-3 mr-1" /> Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 7. CUSTOM REPORT BUILDER MODAL ────────────────── */}
      <Dialog open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display flex items-center gap-2">
              <Sparkles className="size-4 text-primary" /> Custom Academic Report Generator
            </DialogTitle>
            <DialogDescription>
              Configure specific departments, parameters, and formats to build an automated report.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="b-dept">Target Department</Label>
                <Select value={builderForm.department} onValueChange={(v) => setBuilderForm((p) => ({ ...p, department: v }))}>
                  <SelectTrigger id="b-dept"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Departments</SelectItem>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="ME">ME</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="b-sem">Semester</Label>
                <Select value={builderForm.semester} onValueChange={(v) => setBuilderForm((p) => ({ ...p, semester: v }))}>
                  <SelectTrigger id="b-sem"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semester VI">Semester VI</SelectItem>
                    <SelectItem value="Semester IV">Semester IV</SelectItem>
                    <SelectItem value="Semester II">Semester II</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 col-span-2">
                <Label htmlFor="b-type">Report Type Category</Label>
                <Select value={builderForm.reportType} onValueChange={(v) => setBuilderForm((p) => ({ ...p, reportType: v }))}>
                  <SelectTrigger id="b-type"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Attendance & Performance">Attendance & Performance</SelectItem>
                    <SelectItem value="Examination & Result Breakdown">Examination & Result Breakdown</SelectItem>
                    <SelectItem value="NAAC & Accreditation Criteria">NAAC & Accreditation Criteria</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="b-fmt">Output Format</Label>
                <Select value={builderForm.outputFormat} onValueChange={(v) => setBuilderForm((p) => ({ ...p, outputFormat: v }))}>
                  <SelectTrigger id="b-fmt"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF Document</SelectItem>
                    <SelectItem value="Excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="CSV">CSV Raw Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="b-range">Academic Range</Label>
                <Input id="b-range" value={builderForm.dateRange} onChange={(e) => setBuilderForm((p) => ({ ...p, dateRange: e.target.value }))} />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsBuilderOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                setIsBuilderOpen(false);
                toast.success(`Generated ${builderForm.reportType} report in ${builderForm.outputFormat} format!`);
              }}
              className="bg-brand-gradient text-white font-semibold"
            >
              Generate & Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── 8. REPORT PREVIEW MODAL ───────────────────────── */}
      <Dialog open={!!previewReport} onOpenChange={() => setPreviewReport(null)}>
        <DialogContent className="max-w-lg text-xs leading-normal">
          {previewReport && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/25 font-mono">{previewReport.category}</Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">Format: {previewReport.format}</span>
                </div>
                <DialogTitle className="text-base font-bold font-display mt-1">{previewReport.title}</DialogTitle>
                <DialogDescription>{previewReport.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-3 pt-2">
                <div className="p-4 border rounded-xl bg-muted/20 space-y-2">
                  <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <FileCheck className="size-4 text-emerald-600" /> Report Content Preview
                  </h4>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    Includes aggregated statistics for 2,450 students across 5 departments. Full breakdowns of semester VI pass rates, attendance metrics, and faculty teaching hours.
                  </p>
                  <div className="pt-2 flex justify-between text-[10px] font-mono text-muted-foreground">
                    <span>Last Generated: {previewReport.lastGenerated}</span>
                    <span className="text-emerald-600 font-bold">Status: {previewReport.status}</span>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setPreviewReport(null)}>Close Preview</Button>
                <Button
                  onClick={() => {
                    toast.success(`Downloaded ${previewReport.title} (${previewReport.format})`);
                    setPreviewReport(null);
                  }}
                  className="bg-brand-gradient text-white font-semibold"
                >
                  Download {previewReport.format}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
