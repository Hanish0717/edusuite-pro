import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  FileText,
  BarChart3,
  Calendar,
  Clock,
  Download,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Trash2,
  Share2,
  AlertCircle,
  FileCheck,
  TrendingUp,
  FileSpreadsheet,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

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
import { TrendAreaChart, GroupedBarChart } from "@/components/dashboard/charts";
import { useAcademic } from "@/context/academic-context";
import { useRole } from "@/context/role-context";
import { cn } from "@/lib/utils";

import {
  fetchReportsData,
  generateNewReport,
  deleteReportRecord,
  type ReportItem,
  type ScheduledReport,
  type ReportSummaryStats,
  type PerformanceSnapshotData,
  type ReportsResponse,
} from "./ReportsService";

// ─── 1. SKELETON LOADER ───────────────────────────────────────────────────────
export function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-muted rounded-xl w-1/3" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[300px] bg-muted rounded-2xl" />
        <div className="h-[300px] bg-muted rounded-2xl" />
      </div>
    </div>
  );
}

// ─── 2. EMPTY STATE ───────────────────────────────────────────────────────────
export function EmptyState() {
  return (
    <div className="p-12 text-center border border-dashed border-border rounded-2xl space-y-3 bg-card">
      <FileText className="size-10 text-muted-foreground/30 mx-auto" />
      <h3 className="text-sm font-bold text-foreground">No reports available</h3>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
        No records match your filters. Try adjusting the search term or select another category.
      </p>
    </div>
  );
}

// ─── 3. REPORTS HEADER ────────────────────────────────────────────────────────
interface HeaderProps {
  academicYear: string;
  semester: string;
  department: string;
}

export function ReportsHeader({ academicYear, semester, department }: HeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
          <BarChart3 className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Institutional dashboards, course files, and Board of Studies accreditation reports.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold font-mono self-start sm:self-auto flex-wrap">
        <Badge variant="outline" className="border-border">
          AY: {academicYear}
        </Badge>
        <Badge variant="outline" className="border-border">
          Sem: {semester}
        </Badge>
        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 uppercase">
          Dept: {department}
        </Badge>
      </div>
    </div>
  );
}

// ─── 4. SUMMARY CARDS ─────────────────────────────────────────────────────────
interface SummaryProps {
  stats: ReportSummaryStats;
}

export function SummaryCards({ stats }: SummaryProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
      <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
        <span className="text-[0.62rem] font-bold text-muted-foreground uppercase block">Generated</span>
        <p className="text-xl font-bold font-mono text-primary">{stats.totalGenerated}</p>
      </div>
      <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
        <span className="text-[0.62rem] font-bold text-muted-foreground uppercase block">Attendance</span>
        <p className="text-xl font-bold font-mono text-blue-600">{stats.attendanceCount}</p>
      </div>
      <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
        <span className="text-[0.62rem] font-bold text-muted-foreground uppercase block">Marks Sheets</span>
        <p className="text-xl font-bold font-mono text-emerald-600">{stats.marksCount}</p>
      </div>
      <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
        <span className="text-[0.62rem] font-bold text-muted-foreground uppercase block">Course Files</span>
        <p className="text-xl font-bold font-mono text-purple-600">{stats.courseFileCount}</p>
      </div>
      <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
        <span className="text-[0.62rem] font-bold text-muted-foreground uppercase block">Accreditation</span>
        <p className="text-xl font-bold font-mono text-indigo-600">{stats.nbaNaacCount}</p>
      </div>
      <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
        <span className="text-[0.62rem] font-bold text-muted-foreground uppercase block">Pending</span>
        <p className="text-xl font-bold font-mono text-amber-600">{stats.pendingCount}</p>
      </div>
      <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1 col-span-2 lg:col-span-1">
        <span className="text-[0.62rem] font-bold text-muted-foreground uppercase block">This Month</span>
        <p className="text-xl font-bold font-mono text-rose-600">{stats.generatedThisMonth}</p>
      </div>
    </div>
  );
}

// ─── 5. QUICK REPORT ACTIONS ──────────────────────────────────────────────────
interface QuickActionsProps {
  onGenerate: (name: string, category: ReportItem["category"]) => void;
}

export function QuickReportActions({ onGenerate }: QuickActionsProps) {
  const actions: { title: string; category: ReportItem["category"] }[] = [
    { title: "Generate Attendance Report", category: "Attendance Reports" },
    { title: "Generate Internal Marks Report", category: "Assessment Reports" },
    { title: "Generate Student Performance Report", category: "Student Reports" },
    { title: "Generate Course File", category: "Course Files" },
    { title: "Generate Lesson Plan Report", category: "Lesson Plans" },
    { title: "Generate Assignment Report", category: "Assignment Reports" },
    { title: "Generate Examination Report", category: "Assessment Reports" },
    { title: "Generate Research Report", category: "Research Reports" },
    { title: "Generate Faculty Workload Report", category: "Department Reports" },
  ];

  return (
    <Panel
      title="Quick Report Generation"
      description="Select template guidelines to generate immediate academic sheets."
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {actions.map((act) => (
          <button
            key={act.title}
            onClick={() => onGenerate(act.title.replace("Generate ", ""), act.category)}
            className="p-3 text-left rounded-xl border border-border/80 bg-card hover:border-primary/45 hover:bg-primary/5 transition-all text-xs font-semibold text-foreground cursor-pointer"
          >
            {act.title}
          </button>
        ))}
      </div>
    </Panel>
  );
}

// ─── 6. REPORT CATEGORIES ─────────────────────────────────────────────────────
interface CategoryProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export function ReportCategoryCards({ activeCategory, onSelectCategory }: CategoryProps) {
  const categories = [
    "All Categories",
    "Attendance Reports",
    "Student Reports",
    "Assessment Reports",
    "Assignment Reports",
    "Course Files",
    "Lesson Plans",
    "Research Reports",
    "NBA Reports",
    "NAAC Reports",
    "Department Reports",
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Report Directories</h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap cursor-pointer shrink-0 transition-all",
                isActive
                  ? "bg-primary text-white border-primary"
                  : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── 7. RECENT REPORTS ────────────────────────────────────────────────────────
interface RecentProps {
  reports: ReportItem[];
  onDownload: (id: string, name: string) => void;
}

export function RecentReports({ reports, onDownload }: RecentProps) {
  return (
    <Panel
      title="Recent Generated Reports"
      description="Quick access to latest generated reports from past 48 hours."
    >
      <div className="grid gap-3.5 sm:grid-cols-2">
        {reports.slice(0, 4).map((rep) => (
          <div key={rep.id} className="p-3.5 rounded-xl border border-border/80 bg-card space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="outline" className="font-mono text-[0.62rem] truncate">
                {rep.category}
              </Badge>
              <span className="text-[0.68rem] text-muted-foreground font-mono shrink-0">{rep.id}</span>
            </div>
            <h4 className="font-bold text-xs text-foreground line-clamp-1">{rep.name}</h4>
            <div className="flex items-center justify-between text-[0.65rem] text-muted-foreground pt-1 border-t">
              <span>{rep.generatedDate} &middot; {rep.fileFormat}</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => onDownload(rep.id, rep.name)}
                  className="text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <Download className="size-3" /> Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ─── 8. SCHEDULED REPORTS ──────────────────────────────────────────────────────
interface ScheduledProps {
  scheduled: ScheduledReport[];
}

export function ScheduledReports({ scheduled }: ScheduledProps) {
  return (
    <Panel
      title="Scheduled Reports"
      description="Automated reports scheduled for recurring delivery."
    >
      <div className="space-y-2">
        {scheduled.map((sch) => (
          <div key={sch.id} className="p-3 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-bold text-foreground">{sch.name}</p>
              <p className="text-[0.68rem] text-muted-foreground font-mono">
                Freq: {sch.frequency} &middot; Next: {sch.nextGenDate}
              </p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.62rem] font-mono">
              {sch.status}
            </Badge>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ─── 9. DOWNLOAD CENTER ──────────────────────────────────────────────────────
interface DownloadCenterProps {
  reports: ReportItem[];
  onDownload: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function DownloadCenter({ reports, onDownload, onDelete }: DownloadCenterProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return reports.slice(start, start + pageSize);
  }, [reports, currentPage]);

  const totalPages = Math.ceil(reports.length / pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [reports]);

  return (
    <Panel
      title="Download Center"
      description="List of all generated reports with batch actions and file deletion options."
    >
      {reports.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.65rem]">
                <tr>
                  <th className="p-3">Report Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Format & Size</th>
                  <th className="p-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginated.map((rep) => (
                  <tr key={rep.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-foreground">{rep.name}</div>
                      <div className="text-[0.68rem] text-muted-foreground font-mono">{rep.id}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="font-mono text-[0.62rem]">
                        {rep.category}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground font-mono">{rep.generatedDate}</td>
                    <td className="p-3 font-mono text-muted-foreground">
                      {rep.fileFormat} ({rep.size})
                    </td>
                    <td className="p-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownload(rep.id, rep.name)}
                          className="h-7 text-xs text-primary hover:bg-primary/5"
                        >
                          <Download className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(rep.id)}
                          className="h-7 text-xs text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 px-1">
            <span className="text-muted-foreground">
              Showing page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
              <span className="font-semibold text-foreground">{totalPages || 1}</span>
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="h-8 text-xs"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="h-8 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}

// ─── 10. ACADEMIC & INSIGHTS CHARTS ───────────────────────────────────────────
interface AnalyticsProps {
  analytics: ReportsResponse["analytics"];
}

export function AcademicAnalytics({ analytics }: AnalyticsProps) {
  return (
    <Panel
      title="Academic Analytics & Insights"
      description="Comparison of class attendance trends and student GPA statistics."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attendance Performance Rate</h4>
          <TrendAreaChart
            data={analytics.attendanceTrend as any}
            xKey="name"
            series={[{ key: "value", label: "Attendance %" }]}
            height={180}
          />
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Average Semester CGPA</h4>
          <GroupedBarChart
            data={analytics.studentPerformance as any}
            xKey="name"
            series={[{ key: "value", label: "CGPA" }]}
            height={180}
          />
        </div>
      </div>
    </Panel>
  );
}

// ─── 11. FACULTY PERFORMANCE SNAPSHOT ──────────────────────────────────────────
interface SnapshotProps {
  performance: PerformanceSnapshotData;
}

export function FacultyPerformanceSnapshot({ performance }: SnapshotProps) {
  return (
    <Panel
      title="Faculty Academic Performance Snapshot"
      description="Summary of teaching loads, attendance registers, and research profiles."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-9 gap-3 text-center font-mono">
        <div className="p-3 rounded-xl bg-muted/40 border border-border">
          <p className="text-[0.62rem] font-sans text-muted-foreground uppercase">Assigned</p>
          <p className="text-sm font-bold mt-1">{performance.assignedSubjects} Subjects</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border">
          <p className="text-[0.62rem] font-sans text-muted-foreground uppercase">Conducted</p>
          <p className="text-sm font-bold mt-1 text-primary">{performance.classesConducted} Lectures</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border">
          <p className="text-[0.62rem] font-sans text-muted-foreground uppercase">Attendance</p>
          <p className="text-sm font-bold mt-1 text-emerald-600">{performance.attendanceSubmitted} Logs</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border">
          <p className="text-[0.62rem] font-sans text-muted-foreground uppercase">Syllabus</p>
          <p className="text-sm font-bold mt-1 text-indigo-600">{performance.lessonPlansCompleted} Done</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border">
          <p className="text-[0.62rem] font-sans text-muted-foreground uppercase">Assignments</p>
          <p className="text-sm font-bold mt-1 text-purple-600">{performance.assignmentsPublished} Files</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border">
          <p className="text-[0.62rem] font-sans text-muted-foreground uppercase">Marks Sync</p>
          <p className="text-sm font-bold mt-1">{performance.internalMarksSubmitted} Mapped</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border">
          <p className="text-[0.62rem] font-sans text-muted-foreground uppercase">Research</p>
          <p className="text-sm font-bold mt-1 text-emerald-600">{performance.researchPublications} Papers</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border">
          <p className="text-[0.62rem] font-sans text-muted-foreground uppercase">Leaves</p>
          <p className="text-xs font-bold mt-1 text-amber-600 truncate" title={performance.leaveUtilization}>{performance.leaveUtilization.split(" ")[0]} Days</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border col-span-2 xl:col-span-1">
          <p className="text-[0.62rem] font-sans text-muted-foreground uppercase">Payroll</p>
          <p className="text-xs font-bold mt-1 text-primary truncate" title={performance.payrollStatus}>Disbursed</p>
        </div>
      </div>
    </Panel>
  );
}

// ─── MAIN MODULE VIEW CONTAINER ──────────────────────────────────────────────
export function ReportsModuleView() {
  const { selectedDepartment } = useAcademic();
  const { profile } = useRole();

  const [reportsData, setReportsData] = useState<ReportsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const deptCode = useMemo(() => {
    return profile.department || selectedDepartment || "CSE";
  }, [profile, selectedDepartment]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchReportsData(deptCode);
      setReportsData(data);
    } catch {
      toast.error("Failed to load reports repository.");
    } finally {
      setLoading(false);
    }
>>>>>>> origin/feature/subject-allocation-modules
  };

  useEffect(() => {
    loadData();
<<<<<<< HEAD
  }, []);

  const filtered = reports.filter(
    (r) =>
      r.reportName.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = (name: string, format: string) => {
    toast.success(`Downloading ${name} (${format})...`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <BarChart3 className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Institutional Reports & BI Analytics
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Executive Intelligence
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Automated reporting for Academic Performance, NAAC AQAR Compliance, Financial Ledgers, and NIRF Audit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={() => toast.success("Generating Custom BI Report...")} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
            <FileSpreadsheet className="size-4" /> Generate BI Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Available Reports</p>
          <p className="text-2xl font-bold font-mono text-primary">24 Ready</p>
          <p className="text-[0.68rem] text-muted-foreground">Automated Daily Sync</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Scheduled Syncs</p>
          <p className="text-2xl font-bold font-mono text-emerald-600">12 Active</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">Auto Email Broadcasts</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">NAAC Compliance</p>
          <p className="text-2xl font-bold font-mono text-purple-600">100% AQAR Ready</p>
          <p className="text-[0.68rem] text-muted-foreground">Grade A++ Standards</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Total Downloads</p>
          <p className="text-2xl font-bold font-mono text-amber-600">616 Exports</p>
          <p className="text-[0.68rem] text-muted-foreground">This Academic Term</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search reports by title or category..."
=======
  }, [deptCode]);

  const handleGenerateReport = async (name: string, category: ReportItem["category"]) => {
    try {
      toast.loading(`Compiling ${name}...`, { id: "gen-rep" });
      const created = await generateNewReport(deptCode, name, category, "PDF");
      loadData();
      toast.success(`Report compiled: "${created.id}" is ready for download!`, { id: "gen-rep" });
    } catch {
      toast.error("Failed to compile report.", { id: "gen-rep" });
    }
  };

  const handleDownload = (id: string, name: string) => {
    toast.success(`Initiated file download: "${name}" (${id})`);
  };

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete report record ${id}?`)) {
      try {
        await deleteReportRecord(deptCode, id);
        loadData();
        toast.success(`Report ${id} successfully deleted from index.`);
      } catch {
        toast.error("Failed to delete report record.");
      }
    }
  };

  const filteredReports = useMemo(() => {
    if (!reportsData) return [];
    return reportsData.reports.filter((r) => {
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === "All Categories" || r.category === activeCategory;
      const matchesStatus = selectedStatus === "All" || r.status === selectedStatus;
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [reportsData, search, activeCategory, selectedStatus]);

  if (loading || !reportsData) {
    return <SkeletonLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <ReportsHeader
        academicYear={reportsData.reports[0]?.academicYear || "2025-26"}
        semester={reportsData.reports[0]?.semester || "Semester 5"}
        department={deptCode}
      />

      {/* Summary Cards */}
      <SummaryCards stats={reportsData.stats} />

      {/* Quick Report Generation Panel */}
      <QuickReportActions onGenerate={handleGenerateReport} />

      {/* Academic Analytics charts */}
      <AcademicAnalytics analytics={reportsData.analytics} />

      {/* Search and Filters bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search reports by ID or title..."
>>>>>>> origin/feature/subject-allocation-modules
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
<<<<<<< HEAD
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Report ID</th>
                <th className="py-3 px-3">Report Title</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Generated Date</th>
                <th className="py-3 px-3">Format</th>
                <th className="py-3 px-3">Total Downloads</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-foreground">{r.id}</td>
                  <td className="py-3 px-3 font-bold text-foreground">{r.reportName}</td>
                  <td className="py-3 px-3"><Badge variant="outline" className="font-mono text-xs">{r.category}</Badge></td>
                  <td className="py-3 px-3 font-mono text-muted-foreground">{r.generatedDate}</td>
                  <td className="py-3 px-3 font-mono font-bold text-primary">{r.format}</td>
                  <td className="py-3 px-3 font-mono">{r.downloads}</td>
                  <td className="py-3 px-3">
                    <Button size="sm" variant="ghost" onClick={() => handleDownload(r.reportName, r.format)} className="h-7 text-xs text-primary gap-1">
                      <Download className="size-3.5" /> Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
=======

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-9 w-full sm:w-[130px] text-xs">
              <Filter className="size-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="text-xs">All Status</SelectItem>
              <SelectItem value="Completed" className="text-xs">Completed</SelectItem>
              <SelectItem value="Pending" className="text-xs">Pending</SelectItem>
              <SelectItem value="Failed" className="text-xs">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Folders */}
      <ReportCategoryCards
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Download Center Table */}
          <DownloadCenter
            reports={filteredReports}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        </div>

        <div className="space-y-6">
          {/* Recent Reports checklist */}
          <RecentReports
            reports={filteredReports}
            onDownload={handleDownload}
          />

          {/* Scheduled Reports ledger */}
          <ScheduledReports scheduled={reportsData.scheduled} />
        </div>
      </div>

      {/* Personal Snapshot ledger */}
      <FacultyPerformanceSnapshot performance={reportsData.performance} />
>>>>>>> origin/feature/subject-allocation-modules
    </div>
  );
}
