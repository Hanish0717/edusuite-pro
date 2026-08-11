import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  UserX,
  FileCheck,
  Search,
  RefreshCw,
  Download,
  Send,
  Eye,
  Check,
  X,
  ChevronRight,
  Filter,
  BarChart3,
  Trophy,
  BookOpen,
  Building2,
  Layers,
  Sparkles,
  Printer,
  Calendar,
  Zap,
  Bell,
  Star,
  Medal,
  ShieldCheck,
  ArrowRight,
  CheckCircle
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
import { DonutChart, GroupedBarChart, TrendLineChart, ChartLegend } from "@/components/dashboard/charts";

import {
  MOCK_STUDENT_PROMOTIONS,
  MOCK_BACKLOG_RECORDS,
  MOCK_GRADUATION_RECORDS,
  MOCK_TOP_PERFORMERS,
  MOCK_PROMOTION_NOTIFICATIONS,
  PROMOTION_RATE_BY_DEPT,
  GRADUATION_ELIGIBILITY_CHART,
  type StudentPromotion,
  type BacklogRecord,
  type GraduationRecord,
  type PromotionStatus,
} from "@/data/student-promotion-mock";

function promotionBadgeClass(status: PromotionStatus) {
  switch (status) {
    case "Eligible":
      return "text-emerald-600 border-emerald-200 bg-emerald-50";
    case "Pending Review":
      return "text-amber-500 border-amber-200 bg-amber-50";
    case "Detained":
      return "text-destructive border-destructive/20 bg-destructive/5";
    case "Graduated":
      return "text-primary border-primary/20 bg-primary/5";
    case "Not Eligible":
    default:
      return "text-muted-foreground border-border bg-muted/20";
  }
}

export function StudentPromotionModuleView() {
  // ── States ──────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [promotions, setPromotions] = useState<StudentPromotion[]>(MOCK_STUDENT_PROMOTIONS);
  const [backlogsList] = useState<BacklogRecord[]>(MOCK_BACKLOG_RECORDS);
  const [graduationsList, setGraduationsList] = useState<GraduationRecord[]>(MOCK_GRADUATION_RECORDS);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    "promotions" | "backlogs" | "graduation" | "performers" | "analytics" | "reports" | "notifications"
  >("promotions");

  // Selection & Details Drawer State
  const [selectedStudent, setSelectedStudent] = useState<StudentPromotion | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Certificate Modal State
  const [selectedGrad, setSelectedGrad] = useState<GraduationRecord | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gradFilter, setGradFilter] = useState("all");
  const [sortBy, setSortBy] = useState("cgpa");

  const handleResetFilters = () => {
    setSearchQuery("");
    setDeptFilter("all");
    setProgramFilter("all");
    setSemesterFilter("all");
    setStatusFilter("all");
    setGradFilter("all");
    setSortBy("cgpa");
    toast.success("Filters reset successfully.");
  };

  const triggerReload = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => setLoading(false), 600);
  };

  // ── Filter Computation ──────────────────────────────────────
  const filteredPromotions = useMemo(() => {
    return promotions
      .filter((st) => {
        const matchesSearch =
          st.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          st.studentId.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept = deptFilter === "all" || st.department === deptFilter;
        const matchesProg = programFilter === "all" || st.program === programFilter;
        const matchesSem = semesterFilter === "all" || st.semester === semesterFilter;
        const matchesStatus = statusFilter === "all" || st.promotionStatus === statusFilter;
        const matchesGrad = gradFilter === "all" || st.graduationStatus === gradFilter;

        return matchesSearch && matchesDept && matchesProg && matchesSem && matchesStatus && matchesGrad;
      })
      .sort((a, b) => {
        if (sortBy === "cgpa") return b.cgpa - a.cgpa;
        if (sortBy === "credits") return b.creditsEarned - a.creditsEarned;
        if (sortBy === "name") return a.studentName.localeCompare(b.studentName);
        if (sortBy === "status") return a.promotionStatus.localeCompare(b.promotionStatus);
        return 0;
      });
  }, [promotions, searchQuery, deptFilter, programFilter, semesterFilter, statusFilter, gradFilter, sortBy]);

  // ── Metrics Computation ─────────────────────────────────────
  const metrics = useMemo(() => {
    const totalStudents = promotions.length;
    const eligibleCount = promotions.filter((p) => p.promotionStatus === "Eligible").length;
    const pendingReview = promotions.filter((p) => p.promotionStatus === "Pending Review").length;
    const withBacklogs = promotions.filter((p) => p.backlogs > 0).length;
    const gradEligible = promotions.filter((p) => p.graduationStatus === "Eligible" || p.graduationStatus === "Graduated").length;
    const detained = promotions.filter((p) => p.promotionStatus === "Detained").length;
    const promotionRequests = pendingReview;
    const completedGraduations = graduationsList.filter((g) => g.certificateStatus === "Issued" || g.certificateStatus === "Generated").length;

    return { totalStudents, eligibleCount, pendingReview, withBacklogs, gradEligible, detained, promotionRequests, completedGraduations };
  }, [promotions, graduationsList]);

  // ── Handlers ────────────────────────────────────────────────
  const handleApprovePromotion = (id: string, name: string) => {
    setPromotions((prev) =>
      prev.map((p) => (p.studentId === id ? ({ ...p, promotionStatus: "Eligible" as const } as StudentPromotion) : p))
    );
    toast.success(`Approved promotion for ${name}!`);
  };

  const handleHoldPromotion = (id: string, name: string) => {
    setPromotions((prev) =>
      prev.map((p) => (p.studentId === id ? ({ ...p, promotionStatus: "Pending Review" as const } as StudentPromotion) : p))
    );
    toast.info(`Placed promotion hold for ${name}.`);
  };

  const handleRunPromotionCheck = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Automated promotion eligibility check completed for 2,450 students!");
    }, 800);
  };

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
        <h3 className="text-base font-bold text-foreground">Failed to load promotion data</h3>
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
            <GraduationCap className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Student Promotion & Graduation Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Academic Management Portal
              </Badge>
            </div>
            <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
              <span>Academic Management</span>
              <ChevronRight className="size-3" />
              <span className="text-foreground font-semibold">Promotion & Graduation</span>
            </nav>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Review academic eligibility, manage semester promotions, graduation status, and degree completion.
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
            onClick={handleRunPromotionCheck}
            className="h-9 gap-1.5 font-semibold text-xs border-amber-300 text-amber-600 hover:bg-amber-50"
          >
            <Sparkles className="size-3.5" /> Run Promotion Check
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Batch promotion list generated for Class of 2026.")}
            className="h-9 gap-1.5 font-semibold text-xs border-primary/30 text-primary hover:bg-primary/5"
          >
            <FileCheck className="size-3.5" /> Generate Graduation List
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Promotion list published to student portals!")}
            className="h-9 gap-1.5 font-semibold text-xs border-emerald-300 text-emerald-600 hover:bg-emerald-50"
          >
            <Send className="size-3.5" /> Publish Promotion List
          </Button>
          <Button
            onClick={() => toast.success("Promoted 480 eligible students to next semester!")}
            className="h-9 bg-brand-gradient text-white gap-1.5 font-semibold text-xs shadow-glow hover:opacity-95 cursor-pointer"
          >
            <GraduationCap className="size-3.5" /> Promote Students
          </Button>
        </div>
      </div>

      {/* ── 2. SUMMARY DASHBOARD KPI CARDS ─────────────────── */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        <KpiCard label="Total Students" value={String(metrics.totalStudents)} icon={Users} tone="primary" />
        <KpiCard label="Eligible Promotion" value={String(metrics.eligibleCount)} icon={CheckCircle2} tone="success" delta="89% rate" trend="up" />
        <KpiCard label="Pending Review" value={String(metrics.pendingReview)} icon={Clock} tone="warning" />
        <KpiCard label="With Backlogs" value={String(metrics.withBacklogs)} icon={AlertTriangle} tone="destructive" />
        <KpiCard label="Graduation Eligible" value={String(metrics.gradEligible)} icon={GraduationCap} tone="success" />
        <KpiCard label="Detained Students" value={String(metrics.detained)} icon={UserX} tone="destructive" />
        <KpiCard label="Promotion Requests" value={String(metrics.promotionRequests)} icon={FileCheck} tone="info" />
        <KpiCard label="Graduations Done" value={String(metrics.completedGraduations)} icon={Award} tone="success" />
      </div>

      {/* ── 3. STAGE PROMOTION WORKFLOW TIMELINE ───────────── */}
      <div className="border rounded-2xl bg-card p-4 shadow-sm space-y-2">
        <h4 className="text-xs font-bold font-display text-muted-foreground uppercase tracking-wider flex items-center justify-between">
          <span>Institutional Promotion Workflow Stages</span>
          <span className="text-[10px] text-primary font-mono lowercase">semester VI validation</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1">
          {[
            { step: "Stage 1", title: "Academic Review", time: "Completed (Aug 1)", status: "done" },
            { step: "Stage 2", title: "Eligibility Check", time: "Completed (Aug 2)", status: "done" },
            { step: "Stage 3", title: "Promotion Approval", time: "Active Sign-off", status: "active" },
            { step: "Stage 4", title: "Semester Update", time: "Scheduled (Aug 10)", status: "pending" },
            { step: "Stage 5", title: "Promotion Published", time: "Scheduled (Aug 15)", status: "pending" },
          ].map((st) => (
            <div
              key={st.step}
              className={`p-3 border rounded-xl space-y-1 ${
                st.status === "done" ? "bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-200" :
                st.status === "active" ? "bg-primary/5 border-primary/30 ring-2 ring-primary/20" :
                "bg-muted/10 border-border"
              }`}
            >
              <div className="flex justify-between items-center text-[9px] font-mono">
                <span className="text-muted-foreground font-bold">{st.step}</span>
                {st.status === "done" && <CheckCircle className="size-3 text-emerald-600" />}
              </div>
              <p className="font-bold text-xs text-foreground">{st.title}</p>
              <span className="text-[9px] text-muted-foreground font-mono block">{st.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. MAIN TAB NAVIGATION ─────────────────────────── */}
      <div className="flex items-center justify-between border-b pb-1 flex-wrap gap-3">
        <div className="flex rounded-xl bg-muted/40 p-1 border font-semibold overflow-x-auto">
          {[
            { id: "promotions", label: "Promotion Roster", icon: GraduationCap },
            { id: "backlogs", label: "Backlog Monitor", icon: AlertTriangle },
            { id: "graduation", label: "Graduation Management", icon: Award },
            { id: "performers", label: "Top Performers", icon: Trophy },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "reports", label: "Reports", icon: Printer },
            { id: "notifications", label: `Notifications (${MOCK_PROMOTION_NOTIFICATIONS.length})`, icon: Bell },
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
          onClick={handleRunPromotionCheck}
          className="h-8 text-[11px] font-bold bg-brand-gradient text-white gap-1 shadow-sm"
        >
          <Sparkles className="size-3.5" /> Run Eligibility Check
        </Button>
      </div>

      {/* ── 5. SEARCH & FILTERS TOOLBAR ───────────────────── */}
      <div className="flex items-center justify-between border rounded-2xl bg-card p-3 shadow-sm flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search student ID, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs w-[160px]"
            />
          </div>

          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="h-8 text-xs w-[100px]">
              <SelectValue placeholder="Dept" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Depts</SelectItem>
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="ECE">ECE</SelectItem>
              <SelectItem value="ME">ME</SelectItem>
              <SelectItem value="AI&DS">AI&DS</SelectItem>
            </SelectContent>
          </Select>

          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="h-8 text-xs w-[100px]">
              <SelectValue placeholder="Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              <SelectItem value="B.Tech">B.Tech</SelectItem>
              <SelectItem value="M.Tech">M.Tech</SelectItem>
              <SelectItem value="MBA">MBA</SelectItem>
            </SelectContent>
          </Select>

          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="h-8 text-xs w-[110px]">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              <SelectItem value="Semester VI">Semester VI</SelectItem>
              <SelectItem value="Semester V">Semester V</SelectItem>
              <SelectItem value="Semester IV">Semester IV</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 text-xs w-[120px]">
              <SelectValue placeholder="Promotion Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Eligible">Eligible</SelectItem>
              <SelectItem value="Pending Review">Pending Review</SelectItem>
              <SelectItem value="Detained">Detained</SelectItem>
              <SelectItem value="Graduated">Graduated</SelectItem>
              <SelectItem value="Not Eligible">Not Eligible</SelectItem>
            </SelectContent>
          </Select>

          <Select value={gradFilter} onValueChange={setGradFilter}>
            <SelectTrigger className="h-8 text-xs w-[120px]">
              <SelectValue placeholder="Grad Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grad Status</SelectItem>
              <SelectItem value="Eligible">Eligible</SelectItem>
              <SelectItem value="Graduated">Graduated</SelectItem>
              <SelectItem value="Pending Credits">Pending Credits</SelectItem>
              <SelectItem value="Ineligible">Ineligible</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-8 text-xs w-[95px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cgpa">By CGPA</SelectItem>
              <SelectItem value="credits">By Credits</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
              <SelectItem value="status">By Status</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-8 px-2 font-semibold text-xs">
            <X className="size-3 mr-1" /> Reset
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[9px] text-primary border-primary/20">
            {filteredPromotions.length} Students Listed
          </Badge>
        </div>
      </div>

      {/* ── 6. TAB PANELS ─────────────────────────────────── */}

      {/* TAB 1: Promotion Roster Table */}
      {activeTab === "promotions" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <GraduationCap className="size-5 text-primary" /> Master Institutional Promotion & Eligibility Roster
          </h3>

          {filteredPromotions.length === 0 ? (
            <div className="py-16 text-center space-y-3 border border-dashed rounded-xl">
              <GraduationCap className="size-10 text-muted-foreground/30 mx-auto" />
              <p className="font-bold text-muted-foreground">No Promotion Data Available</p>
              <p className="text-[11px] text-muted-foreground">Try adjusting your filters or run an automated eligibility check.</p>
              <Button onClick={handleRunPromotionCheck} variant="outline" size="sm" className="font-semibold">Run Promotion Check</Button>
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-[11px] font-medium text-foreground">
                <thead className="bg-muted/30">
                  <tr className="text-muted-foreground font-semibold border-b">
                    <th className="py-2.5 px-3">Student ID</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Program / Sem</th>
                    <th className="py-2.5 px-3 text-center">Credits Earned</th>
                    <th className="py-2.5 px-3 text-center">Attendance %</th>
                    <th className="py-2.5 px-3 text-center">Backlogs</th>
                    <th className="py-2.5 px-3 text-center">CGPA</th>
                    <th className="py-2.5 px-3">Promotion Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPromotions.map((st) => (
                    <tr key={st.studentId} className="border-b border-border/40 hover:bg-muted/5">
                      <td className="py-3 px-3 font-mono font-bold">{st.studentId}</td>
                      <td className="py-3 px-3 font-bold text-foreground">{st.studentName}</td>
                      <td className="py-3 px-3">{st.department}</td>
                      <td className="py-3 px-3">
                        <p className="font-semibold">{st.program}</p>
                        <span className="text-[9px] text-muted-foreground font-mono">{st.semester}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold">{st.creditsEarned} / {st.totalCredits}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">{st.attendance}%</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-destructive">{st.backlogs}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-primary">{st.cgpa}</td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className={`text-[9px] uppercase ${promotionBadgeClass(st.promotionStatus)}`}>
                          {st.promotionStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedStudent(st); setIsDetailsOpen(true); }} className="h-7 text-primary hover:bg-primary/5 cursor-pointer font-semibold">
                            <Eye className="size-3.5 mr-1" /> Profile
                          </Button>
                          {st.promotionStatus === "Pending Review" && (
                            <Button variant="ghost" size="sm" onClick={() => handleApprovePromotion(st.studentId, st.studentName)} className="h-7 text-emerald-600 hover:bg-emerald-50 cursor-pointer">
                              Approve
                            </Button>
                          )}
                          {st.promotionStatus === "Eligible" && (
                            <Button variant="ghost" size="sm" onClick={() => handleHoldPromotion(st.studentId, st.studentName)} className="h-7 text-amber-500 hover:bg-amber-50 cursor-pointer">
                              Hold
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Backlog Management */}
      {activeTab === "backlogs" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <AlertTriangle className="size-5 text-primary" /> Active Backlog & Supplementary Eligibility Monitor
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {backlogsList.map((bl) => (
              <div key={bl.studentId} className="p-4 border rounded-xl space-y-3 bg-destructive/5 border-destructive/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs text-foreground">{bl.studentName}</h4>
                    <span className="text-[9px] font-mono text-muted-foreground">{bl.studentId} &middot; {bl.department} &middot; {bl.semester}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase text-destructive border-destructive/20">
                    {bl.backlogCount} Active Backlog{bl.backlogCount > 1 ? "s" : ""}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">Failed Subjects</span>
                  {bl.subjectsFailed.map((sub) => (
                    <p key={sub} className="text-[10px] font-semibold text-destructive">{sub}</p>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 border rounded-lg p-2 bg-card text-[10px]">
                  <div>
                    <span className="text-muted-foreground">Supplementary Eligible</span>
                    <p className="font-bold text-emerald-600">{bl.supplementaryEligible ? "Yes Eligible" : "No"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Max Attempts</span>
                    <p className="font-bold font-mono">{bl.maxAttempts} Attempts</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Graduation Management */}
      {activeTab === "graduation" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Award className="size-5 text-primary" /> Class of 2026 Graduation & Degree Audit Ledger
          </h3>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead className="bg-muted/30">
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Program</th>
                  <th className="py-2.5 px-3 text-center">Credits Earned</th>
                  <th className="py-2.5 px-3 text-center">CGPA</th>
                  <th className="py-2.5 px-3">Degree Status</th>
                  <th className="py-2.5 px-3 text-center">Convocation</th>
                  <th className="py-2.5 px-3 text-center">Certificate Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {graduationsList.map((g) => (
                  <tr key={g.studentId} className="border-b border-border/40 hover:bg-muted/5">
                    <td className="py-3 px-3 font-mono font-bold">{g.studentId}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{g.studentName}</td>
                    <td className="py-3 px-3">{g.program} ({g.department})</td>
                    <td className="py-3 px-3 text-center font-mono font-bold">{g.creditsEarned} / {g.totalCredits}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-primary">{g.cgpa}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-600">{g.degreeStatus}</td>
                    <td className="py-3 px-3 text-center font-mono">{g.convocationStatus}</td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant="outline" className="text-[9px] uppercase text-emerald-600 border-emerald-200 bg-emerald-50">
                        {g.certificateStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setSelectedGrad(g); setIsCertModalOpen(true); }}
                        className="h-7 text-[10px] font-semibold cursor-pointer"
                      >
                        Degree Certificate
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Top Performers Leaderboard */}
      {activeTab === "performers" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Trophy className="size-5 text-amber-500" /> Academic Gold Medalists & Department Rank Holders
          </h3>

          <div className="space-y-3">
            {MOCK_TOP_PERFORMERS.map((tp) => (
              <div key={tp.rank} className="p-4 border rounded-xl flex items-center gap-4 bg-amber-50/30 border-amber-200 dark:bg-amber-500/5">
                <div className="size-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  #{tp.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-foreground">{tp.studentName}</h4>
                  <span className="text-[9px] text-muted-foreground font-mono">{tp.studentId} &middot; {tp.department}</span>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold font-mono text-primary text-sm">{tp.cgpa} CGPA</p>
                  <Badge variant="outline" className="text-[9px] font-semibold text-amber-600 border-amber-300 bg-amber-50">
                    {tp.achievement}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Analytics */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Department-wise Promotion Rate</h4>
            <GroupedBarChart
              data={PROMOTION_RATE_BY_DEPT as any}
              xKey="name"
              series={[{ key: "Eligible", label: "Eligible %" }]}
              height={180}
            />
          </div>

          <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Graduation Eligibility Distribution</h4>
            <DonutChart data={GRADUATION_ELIGIBILITY_CHART} height={180} centerLabel="Graduates" />
            <ChartLegend items={GRADUATION_ELIGIBILITY_CHART} />
          </div>
        </div>
      )}

      {/* TAB 6: Reports */}
      {activeTab === "reports" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Printer className="size-5 text-primary" /> Promotion & Graduation Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              "Promotion Eligibility Report",
              "Graduation Candidate List",
              "Backlog Summary Report",
              "Detained Students List",
              "Credits Completion Audit",
              "Department Promotion Summary",
            ].map((rep) => (
              <div key={rep} className="p-3.5 border rounded-xl flex items-center justify-between bg-muted/10">
                <span className="font-semibold text-xs text-foreground">{rep}</span>
                <Button size="sm" variant="outline" onClick={() => toast.success(`Downloaded ${rep}...`)} className="h-7 text-[10px]">
                  <Download className="size-3 mr-1" /> PDF
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: Notifications */}
      {activeTab === "notifications" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Bell className="size-5 text-primary" /> Promotion & Graduation System Notifications
          </h3>
          <div className="space-y-3">
            {MOCK_PROMOTION_NOTIFICATIONS.map((n) => (
              <div key={n.id} className="p-3.5 border rounded-xl flex items-start gap-3 bg-muted/10">
                <div className={`mt-0.5 size-4 shrink-0 rounded-full flex items-center justify-center ${n.type === "warning" ? "text-amber-500" : "text-emerald-600"}`}>
                  {n.type === "warning" ? <AlertTriangle className="size-4" /> : <CheckCircle className="size-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">{n.message}</p>
                  <span className="text-[10px] text-muted-foreground font-mono">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 7. STUDENT ELIGIBILITY PROFILE DRAWER / DIALOG ─── */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-xl text-xs leading-normal max-h-[90vh] overflow-y-auto">
          {selectedStudent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/25 font-mono">{selectedStudent.studentId}</Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">{selectedStudent.department} &middot; {selectedStudent.semester}</span>
                  <Badge variant="outline" className={`text-[9px] uppercase ${promotionBadgeClass(selectedStudent.promotionStatus)}`}>
                    {selectedStudent.promotionStatus}
                  </Badge>
                </div>
                <DialogTitle className="text-base font-bold font-display mt-1">{selectedStudent.studentName}</DialogTitle>
                <DialogDescription>{selectedStudent.program} &middot; Degree Status: {selectedStudent.degreeStatus}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                {/* Summary Metrics */}
                <div className="grid grid-cols-4 gap-2.5 text-center">
                  <div className="p-2 border rounded-lg bg-muted/20">
                    <span className="text-[9px] text-muted-foreground">Credits Earned</span>
                    <p className="font-bold font-mono text-primary text-sm mt-0.5">{selectedStudent.creditsEarned} / {selectedStudent.totalCredits}</p>
                  </div>
                  <div className="p-2 border rounded-lg bg-muted/20">
                    <span className="text-[9px] text-muted-foreground">Attendance %</span>
                    <p className="font-bold font-mono text-emerald-600 text-sm mt-0.5">{selectedStudent.attendance}%</p>
                  </div>
                  <div className="p-2 border rounded-lg bg-muted/20">
                    <span className="text-[9px] text-muted-foreground">CGPA</span>
                    <p className="font-bold font-mono text-primary text-sm mt-0.5">{selectedStudent.cgpa}</p>
                  </div>
                  <div className="p-2 border rounded-lg bg-muted/20">
                    <span className="text-[9px] text-muted-foreground">Backlogs</span>
                    <p className="font-bold font-mono text-destructive text-sm mt-0.5">{selectedStudent.backlogs}</p>
                  </div>
                </div>

                {/* SGPA Progression History */}
                <div className="border rounded-xl p-3 space-y-2 bg-card">
                  <h4 className="font-bold text-xs text-foreground flex items-center justify-between">
                    <span>Semester SGPA History Progression</span>
                    <span className="text-[10px] text-primary font-mono">5 Semesters</span>
                  </h4>
                  <div className="flex gap-2 text-center">
                    {selectedStudent.sgpaHistory.map((h) => (
                      <div key={h.sem} className="flex-1 p-2 border rounded-lg bg-muted/10 font-mono">
                        <span className="text-[9px] text-muted-foreground block">{h.sem}</span>
                        <span className="font-bold text-primary text-xs">{h.sgpa}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Eligibility Checklist */}
                <div className="border rounded-xl p-3.5 space-y-2 bg-muted/10">
                  <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-600" /> Promotion Eligibility Verification Checklist
                  </h4>
                  <div className="space-y-2 pt-1">
                    {selectedStudent.eligibilityChecklist.map((item) => (
                      <div key={item.item} className="flex justify-between items-center p-2 border rounded-lg bg-card text-[10px]">
                        <div className="flex items-center gap-2">
                          {item.passed ? <CheckCircle className="size-3.5 text-emerald-600" /> : <X className="size-3.5 text-destructive" />}
                          <span className="font-semibold text-foreground">{item.item}</span>
                        </div>
                        <span className="font-mono text-muted-foreground">{item.details}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
                {selectedStudent.promotionStatus === "Pending Review" && (
                  <Button onClick={() => { handleApprovePromotion(selectedStudent.studentId, selectedStudent.studentName); setIsDetailsOpen(false); }} className="bg-brand-gradient text-white font-semibold">
                    Approve Promotion
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── 8. DEGREE CERTIFICATE PREVIEW MODAL ───────────── */}
      <Dialog open={isCertModalOpen} onOpenChange={setIsCertModalOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          {selectedGrad && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-bold font-display flex items-center gap-2">
                  <Award className="size-5 text-amber-500" /> Provisional Degree Certificate Placeholder
                </DialogTitle>
                <DialogDescription>EduSuite Pro Institutional Degree Generation System</DialogDescription>
              </DialogHeader>

              <div className="p-6 border-2 border-dashed border-amber-300 rounded-2xl bg-amber-50/40 text-center space-y-3 dark:bg-amber-500/5">
                <GraduationCap className="size-12 text-amber-500 mx-auto" />
                <h3 className="font-display font-extrabold text-base text-foreground uppercase tracking-wide">
                  Degree of Bachelor of Technology
                </h3>
                <p className="text-xs text-muted-foreground">This is to certify that</p>
                <p className="font-bold text-sm text-foreground">{selectedGrad.studentName}</p>
                <p className="text-xs text-muted-foreground">having fulfilled all academic requirements with CGPA {selectedGrad.cgpa} is awarded the degree in</p>
                <p className="font-bold text-xs text-primary">{selectedGrad.program} ({selectedGrad.department})</p>
                <Badge variant="outline" className="text-[9px] font-mono text-emerald-600 border-emerald-300 bg-emerald-50">
                  {selectedGrad.degreeStatus}
                </Badge>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsCertModalOpen(false)}>Close</Button>
                <Button onClick={() => { toast.success(`Exported degree certificate for ${selectedGrad.studentName}!`); setIsCertModalOpen(false); }} className="bg-brand-gradient text-white font-semibold">
                  <Download className="size-3.5 mr-1" /> Export Degree PDF
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
