import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Award,
  Search,
  RefreshCw,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  BarChart3,
  Users,
  Trophy,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Send,
  Sparkles,
  Star,
  Medal,
  FileCheck,
  Bell,
  Filter,
  X,
  Info,
  ChevronRight,
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
import {
  DonutChart,
  GroupedBarChart,
  TrendLineChart,
  ChartLegend,
} from "@/components/dashboard/charts";

import {
  MOCK_STUDENT_RESULTS,
  MOCK_BACKLOG_STUDENTS,
  MOCK_MERIT_LIST,
  MOCK_SUBJECT_PERFORMANCE,
  MOCK_RESULT_NOTIFICATIONS,
  DEPT_PASS_RATE_DATA,
  SEM_PASS_RATE_DATA,
  GRADE_DISTRIBUTION_DATA,
  CGPA_DISTRIBUTION_DATA,
  type StudentResult,
} from "@/data/result-management-mock";

// ── Status / Result colour helpers ───────────────────────────
function statusBadgeClass(status: StudentResult["status"]) {
  switch (status) {
    case "Published":
      return "text-emerald-600 border-emerald-200 bg-emerald-50";
    case "Approved":
      return "text-primary border-primary/20 bg-primary/5";
    case "Pending Review":
      return "text-amber-500 border-amber-200 bg-amber-50";
    case "Draft":
    default:
      return "text-muted-foreground border-border bg-muted/20";
  }
}

function resultBadgeClass(result: StudentResult["result"]) {
  switch (result) {
    case "Distinction":
      return "text-violet-600 border-violet-200 bg-violet-50";
    case "First Class":
      return "text-emerald-600 border-emerald-200 bg-emerald-50";
    case "Second Class":
      return "text-amber-500 border-amber-200 bg-amber-50";
    case "Fail":
      return "text-destructive border-destructive/20 bg-destructive/5";
    default:
      return "text-primary border-primary/20 bg-primary/5";
  }
}

// ─────────────────────────────────────────────────────────────
export function ResultsModuleView() {
  // ── State ─────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<StudentResult[]>(MOCK_STUDENT_RESULTS);

  const [activeTab, setActiveTab] = useState<
    "results" | "backlogs" | "merit" | "subjects" | "analytics" | "notifications"
  >("results");

  const [selectedResult, setSelectedResult] = useState<StudentResult | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPublishConfirmOpen, setIsPublishConfirmOpen] = useState(false);
  const [pendingPublishId, setPendingPublishId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [semFilter, setSemFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const [sortBy, setSortBy] = useState("cgpa");

  const handleResetFilters = () => {
    setSearchQuery("");
    setDeptFilter("all");
    setSemFilter("all");
    setStatusFilter("all");
    setResultFilter("all");
    setSortBy("cgpa");
    toast.success("Filters reset.");
  };

  const triggerReload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

  // ── Actions ───────────────────────────────────────────────
  const handleApprove = (id: string, name: string) => {
    setResults((prev) =>
      prev.map((r) =>
        r.studentId === id ? { ...r, status: "Approved" as const } : r
      )
    );
    toast.success(`Result for ${name} approved!`);
  };

  const handlePublish = (id: string, name: string) => {
    setPendingPublishId(id);
    setIsPublishConfirmOpen(true);
  };

  const confirmPublish = () => {
    if (!pendingPublishId) return;
    const target = results.find((r) => r.studentId === pendingPublishId);
    setResults((prev) =>
      prev.map((r) =>
        r.studentId === pendingPublishId ? { ...r, status: "Published" as const } : r
      )
    );
    setIsPublishConfirmOpen(false);
    setPendingPublishId(null);
    toast.success(`Result for ${target?.studentName} published to student portal!`);
  };

  // ── Derived data ─────────────────────────────────────────
  const filteredResults = useMemo(() => {
    return results
      .filter((r) => {
        const matchSearch =
          r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.studentId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchDept = deptFilter === "all" || r.department === deptFilter;
        const matchSem = semFilter === "all" || r.semester === semFilter;
        const matchStatus = statusFilter === "all" || r.status === statusFilter;
        const matchResult = resultFilter === "all" || r.result === resultFilter;
        return matchSearch && matchDept && matchSem && matchStatus && matchResult;
      })
      .sort((a, b) => {
        if (sortBy === "cgpa") return b.cgpa - a.cgpa;
        if (sortBy === "percentage") return b.percentage - a.percentage;
        if (sortBy === "name") return a.studentName.localeCompare(b.studentName);
        return 0;
      });
  }, [results, searchQuery, deptFilter, semFilter, statusFilter, resultFilter, sortBy]);

  const metrics = useMemo(() => {
    const total = results.length;
    const published = results.filter((r) => r.status === "Published").length;
    const pending = results.filter((r) => r.status === "Pending Review" || r.status === "Draft").length;
    const backlogs = results.filter((r) => r.backlogs > 0).length;
    const avgCgpa = results.length
      ? (results.reduce((s, r) => s + r.cgpa, 0) / results.length).toFixed(2)
      : "0.00";
    const passCount = results.filter((r) => r.result !== "Fail").length;
    const passPercent = total ? Math.round((passCount / total) * 100) : 0;
    return { total, published, pending, backlogs, avgCgpa, passPercent };
  }, [results]);

  // ── Loading skeleton ─────────────────────────────────────
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

      {/* ── 1. PAGE HEADER ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b pb-5 border-border">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
            <Award className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Result Management & Analytics
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Academic Management Portal
              </Badge>
            </div>
            <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
              <span>Academic Management</span>
              <ChevronRight className="size-3" />
              <span className="text-foreground font-semibold">Results</span>
            </nav>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Review, approve, publish, and analyze academic results across the institution.
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
            onClick={() => { setStatusFilter("Pending Review"); setActiveTab("results"); toast.info("Filtered to pending review results."); }}
            className="h-9 gap-1.5 font-semibold text-xs border-amber-300 text-amber-600 hover:bg-amber-50"
          >
            <FileCheck className="size-3.5" /> Review Results
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Batch approval workflow initiated for all pending results.")}
            className="h-9 gap-1.5 font-semibold text-xs border-primary/30 text-primary hover:bg-primary/5"
          >
            <CheckCircle className="size-3.5" /> Approve Results
          </Button>
          <Button
            onClick={() => toast.success("Consolidated results report generated and ready for download.")}
            className="h-9 bg-brand-gradient text-white gap-1.5 font-semibold text-xs shadow-glow hover:opacity-95"
          >
            <Download className="size-3.5" /> Export Results
          </Button>
        </div>
      </div>

      {/* ── 2. KPI SUMMARY CARDS ───────────────────────────── */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        <KpiCard label="Total Results" value={String(metrics.total)} icon={FileText} tone="primary" delta="+5 this sem" trend="up" />
        <KpiCard label="Published" value={String(metrics.published)} icon={CheckCircle} tone="success" delta="2 today" trend="up" />
        <KpiCard label="Pending Approval" value={String(metrics.pending)} icon={Clock} tone="warning" />
        <KpiCard label="Depts Completed" value="3 / 5" icon={Trophy} tone="info" />
        <KpiCard label="Overall Pass %" value={`${metrics.passPercent}%`} icon={TrendingUp} tone="success" delta="+2% vs last sem" trend="up" />
        <KpiCard label="Average CGPA" value={metrics.avgCgpa} icon={Star} tone="primary" delta="+0.12" trend="up" />
        <KpiCard label="Students w/ Backlogs" value={String(metrics.backlogs)} icon={AlertTriangle} tone="destructive" />
        <KpiCard label="Top Dept" value="CSE (94%)" icon={Medal} tone="success" />
      </div>

      {/* ── 3. TAB NAVIGATION ──────────────────────────────── */}
      <div className="flex items-center justify-between border-b pb-1 flex-wrap gap-3">
        <div className="flex rounded-xl bg-muted/40 p-1 border font-semibold overflow-x-auto">
          {(
            [
              { id: "results", label: "Results Table", icon: Award },
              { id: "backlogs", label: "Backlogs", icon: AlertTriangle },
              { id: "merit", label: "Merit List", icon: Trophy },
              { id: "subjects", label: "Subject Performance", icon: BookOpen },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
              { id: "notifications", label: `Notifications (${MOCK_RESULT_NOTIFICATIONS.length})`, icon: Bell },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
          onClick={() => toast.info("Generating consolidated semester result report...")}
          className="h-8 text-[11px] font-bold bg-brand-gradient text-white gap-1 shadow-sm"
        >
          <Sparkles className="size-3.5" /> Generate Reports
        </Button>
      </div>

      {/* ── 4. TAB PANELS ─────────────────────────────────── */}

      {/* TAB 1: Results Table */}
      {activeTab === "results" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          {/* Filters */}
          <div className="flex justify-between items-center flex-wrap gap-3 border-b pb-3">
            <h3 className="text-base font-bold font-display flex items-center gap-2">
              <Award className="size-5 text-primary" />
              Student Results Directory
            </h3>
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
                <SelectTrigger className="h-8 text-xs w-[100px]"><SelectValue placeholder="Dept" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Depts</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="ME">ME</SelectItem>
                  <SelectItem value="AI&DS">AI&DS</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-xs w-[120px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Pending Review">Pending Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
              <Select value={resultFilter} onValueChange={setResultFilter}>
                <SelectTrigger className="h-8 text-xs w-[110px]"><SelectValue placeholder="Result" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="Distinction">Distinction</SelectItem>
                  <SelectItem value="First Class">First Class</SelectItem>
                  <SelectItem value="Second Class">Second Class</SelectItem>
                  <SelectItem value="Fail">Fail</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-8 text-xs w-[100px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cgpa">By CGPA</SelectItem>
                  <SelectItem value="percentage">By %</SelectItem>
                  <SelectItem value="name">By Name</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-8 px-2 font-semibold text-xs">
                <X className="size-3" /> Reset
              </Button>
            </div>
          </div>

          {filteredResults.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Award className="size-10 text-muted-foreground/30 mx-auto" />
              <p className="font-bold text-muted-foreground">No Results Available</p>
              <p className="text-[11px] text-muted-foreground">Try adjusting your filters or refresh the data.</p>
              <Button onClick={handleResetFilters} variant="outline" size="sm" className="font-semibold">Refresh Results</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-medium text-foreground">
                <thead>
                  <tr className="text-muted-foreground font-semibold border-b">
                    <th className="py-2">Student ID</th>
                    <th className="py-2">Student Name</th>
                    <th className="py-2">Dept / Sem</th>
                    <th className="py-2">Exam Type</th>
                    <th className="py-2 text-center">CGPA</th>
                    <th className="py-2 text-center">Percentage</th>
                    <th className="py-2 text-center">Backlogs</th>
                    <th className="py-2">Result</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((res) => (
                    <tr key={res.studentId} className="border-b border-border/40 hover:bg-muted/5 transition-colors">
                      <td className="py-3 font-mono font-bold">{res.studentId}</td>
                      <td className="py-3 font-bold text-foreground">
                        {res.studentName}
                        {res.rank && <span className="ml-1 text-[9px] font-mono text-amber-500">#{res.rank}</span>}
                      </td>
                      <td className="py-3">
                        <p className="font-bold">{res.department}</p>
                        <span className="text-[9px] text-muted-foreground font-mono">{res.semester}</span>
                      </td>
                      <td className="py-3 text-muted-foreground">{res.examType}</td>
                      <td className="py-3 font-mono font-bold text-primary text-center">{res.cgpa}</td>
                      <td className="py-3 font-mono font-bold text-center">{res.percentage}%</td>
                      <td className="py-3 text-center font-mono font-bold text-destructive">{res.backlogs}</td>
                      <td className="py-3">
                        <Badge variant="outline" className={`text-[9px] uppercase ${resultBadgeClass(res.result)}`}>
                          {res.result}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant="outline" className={`text-[9px] uppercase ${statusBadgeClass(res.status)}`}>
                          {res.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedResult(res); setIsDetailsOpen(true); }} className="h-7 text-primary hover:bg-primary/5 cursor-pointer text-[10px]">
                            <Eye className="size-3 mr-1" /> View
                          </Button>
                          {res.status === "Pending Review" && (
                            <Button variant="ghost" size="sm" onClick={() => handleApprove(res.studentId, res.studentName)} className="h-7 text-emerald-600 hover:bg-emerald-50 cursor-pointer text-[10px]">
                              Approve
                            </Button>
                          )}
                          {res.status === "Approved" && (
                            <Button variant="ghost" size="sm" onClick={() => handlePublish(res.studentId, res.studentName)} className="h-7 text-primary hover:bg-primary/5 cursor-pointer text-[10px]">
                              Publish
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => toast.success(`Downloading result for ${res.studentName}...`)} className="h-7 text-muted-foreground hover:bg-muted cursor-pointer text-[10px]">
                            <Download className="size-3" />
                          </Button>
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

      {/* TAB 2: Backlogs */}
      {activeTab === "backlogs" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display flex items-center gap-2 border-b pb-2">
            <AlertTriangle className="size-5 text-primary" /> Backlog Student Monitor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_BACKLOG_STUDENTS.map((bl) => (
              <div key={bl.studentId} className="p-4 border rounded-xl space-y-3 bg-destructive/5 border-destructive/20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-xs text-foreground">{bl.studentName}</p>
                    <span className="font-mono text-[9px] text-muted-foreground">{bl.studentId}</span>
                  </div>
                  <Badge variant="outline" className={`text-[9px] uppercase ${bl.supplementaryEligible ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-destructive border-destructive/20 bg-destructive/5"}`}>
                    {bl.supplementaryEligible ? "Supp. Eligible" : "Not Eligible"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 border rounded-lg p-2.5 bg-card">
                  <div>
                    <span className="text-[9px] text-muted-foreground">Department</span>
                    <p className="font-bold text-xs">{bl.department}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground">Backlogs</span>
                    <p className="font-bold text-xs text-destructive">{bl.backlogCount} subject{bl.backlogCount > 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground">Failed Subjects</span>
                  {bl.subjectsFailed.map((s) => (
                    <p key={s} className="text-[10px] font-semibold text-destructive">{s}</p>
                  ))}
                </div>
                <div className="pt-2 border-t border-border/40 flex justify-end">
                  <Button size="sm" variant="ghost" onClick={() => toast.success(`Supplementary exam eligibility letter sent for ${bl.studentName}!`)} className="h-7 text-[10px] font-semibold text-primary hover:bg-primary/5 cursor-pointer">
                    <Send className="size-3 mr-1" /> Send Notice
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Merit List */}
      {activeTab === "merit" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display flex items-center gap-2 border-b pb-2">
            <Trophy className="size-5 text-amber-500" /> Institution Merit List — Top Performers
          </h3>
          <div className="space-y-3">
            {MOCK_MERIT_LIST.map((entry) => (
              <div key={entry.rank} className={`p-4 border rounded-xl flex items-center gap-4 transition-colors hover:bg-muted/10 ${entry.rank === 1 ? "border-amber-200 bg-amber-50/40" : entry.rank === 2 ? "border-slate-200 bg-slate-50/40" : entry.rank === 3 ? "border-orange-200 bg-orange-50/40" : "bg-card"}`}>
                <div className={`size-10 shrink-0 rounded-full flex items-center justify-center font-bold font-mono text-sm ${entry.rank === 1 ? "bg-amber-500 text-white" : entry.rank === 2 ? "bg-slate-400 text-white" : entry.rank === 3 ? "bg-orange-400 text-white" : "bg-muted text-muted-foreground"}`}>
                  {entry.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-foreground">{entry.studentName}</p>
                  <span className="text-[9px] text-muted-foreground font-mono">{entry.studentId} · {entry.department}</span>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold font-mono text-primary">{entry.cgpa} CGPA</p>
                  <span className="text-[10px] text-muted-foreground">{entry.percentage}%</span>
                </div>
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {entry.achievements.map((ach) => (
                    <Badge key={ach} variant="outline" className="text-[9px] font-semibold text-primary border-primary/25 bg-primary/5">
                      {ach}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Subject Performance */}
      {activeTab === "subjects" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display flex items-center gap-2 border-b pb-2">
            <BookOpen className="size-5 text-primary" /> Subject-wise Pass / Fail Performance Analytics
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead>
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2">Subject</th>
                  <th className="py-2">Department</th>
                  <th className="py-2">Faculty</th>
                  <th className="py-2 text-center">Pass %</th>
                  <th className="py-2 text-center">Fail %</th>
                  <th className="py-2 text-center">Highest</th>
                  <th className="py-2 text-center">Lowest</th>
                  <th className="py-2 text-center">Average</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_SUBJECT_PERFORMANCE.map((sub) => (
                  <tr key={sub.subjectCode} className="border-b border-border/40 hover:bg-muted/5 transition-colors">
                    <td className="py-3">
                      <p className="font-bold">{sub.subjectName}</p>
                      <span className="font-mono text-[9px] text-muted-foreground">{sub.subjectCode}</span>
                    </td>
                    <td className="py-3">{sub.department}</td>
                    <td className="py-3 text-muted-foreground">{sub.faculty}</td>
                    <td className="py-3 text-center font-mono font-bold text-emerald-600">{sub.passPercent}%</td>
                    <td className="py-3 text-center font-mono font-bold text-destructive">{sub.failPercent}%</td>
                    <td className="py-3 text-center font-mono">{sub.highestMarks}</td>
                    <td className="py-3 text-center font-mono">{sub.lowestMarks}</td>
                    <td className="py-3 text-center font-mono font-bold text-primary">{sub.averageMarks}</td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => { setActiveTab("analytics"); }} className="h-7 text-primary hover:bg-primary/5 cursor-pointer font-semibold text-[10px]">
                        View Analytics
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Analytics Dashboard */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Performance KPIs */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
            <KpiCard label="Highest CGPA" value="9.38" icon={Star} tone="success" />
            <KpiCard label="Lowest CGPA" value="5.80" icon={TrendingDown} tone="destructive" />
            <KpiCard label="Avg Percentage" value="77.2%" icon={BarChart3} tone="primary" />
            <KpiCard label="Distinction" value="3 Students" icon={Trophy} tone="success" />
            <KpiCard label="First Class" value="1 Student" icon={Medal} tone="info" />
            <KpiCard label="Pass" value="4 Students" icon={CheckCircle} tone="success" />
            <KpiCard label="Fail" value="0 Students" icon={AlertTriangle} tone="destructive" />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Dept-wise Pass Rate</h4>
              <GroupedBarChart
                data={DEPT_PASS_RATE_DATA as any}
                xKey="name"
                series={[{ key: "PassRate", label: "Pass %" }]}
                height={180}
              />
            </div>
            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Semester-wise Pass Rate</h4>
              <TrendLineChart
                data={SEM_PASS_RATE_DATA as any}
                xKey="name"
                series={[{ key: "PassRate", label: "Pass %" }]}
                height={180}
              />
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Grade Distribution</h4>
              <DonutChart data={GRADE_DISTRIBUTION_DATA} height={180} centerLabel="Grades" />
              <ChartLegend items={GRADE_DISTRIBUTION_DATA} />
            </div>
            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">CGPA Distribution</h4>
              <DonutChart data={CGPA_DISTRIBUTION_DATA} height={180} centerLabel="CGPA" />
              <ChartLegend items={CGPA_DISTRIBUTION_DATA} />
            </div>
          </div>

          {/* Reports Panel */}
          <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-display flex items-center gap-2 border-b pb-2">
              <FileText className="size-5 text-primary" /> Quick Result Reports
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                "Department Result Report",
                "Semester Result Report",
                "Student Result Report",
                "Merit List",
                "Backlog Report",
                "Subject Analysis Report",
              ].map((report) => (
                <div key={report} className="p-3.5 border rounded-xl flex items-center justify-between bg-muted/10 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                      <FileText className="size-3.5" />
                    </div>
                    <span className="font-semibold text-xs text-foreground">{report}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="ghost" onClick={() => toast.info(`Preview: ${report}`)} className="h-7 text-[10px] font-semibold text-primary hover:bg-primary/5 cursor-pointer">
                      Preview
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toast.success(`${report} downloaded!`)} className="h-7 text-[10px] font-semibold cursor-pointer">
                      <Download className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Notifications */}
      {activeTab === "notifications" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display flex items-center gap-2 border-b pb-2">
            <Bell className="size-5 text-primary" /> Result Activity Notifications
          </h3>
          <div className="space-y-3">
            {MOCK_RESULT_NOTIFICATIONS.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 border rounded-xl flex items-start gap-3 ${
                  notif.type === "warning" ? "border-amber-200 bg-amber-50/50" :
                  notif.type === "success" ? "border-emerald-200 bg-emerald-50/50" :
                  "border-border bg-muted/10"
                }`}
              >
                <div className={`mt-0.5 size-4 shrink-0 rounded-full flex items-center justify-center ${notif.type === "warning" ? "text-amber-500" : notif.type === "success" ? "text-emerald-600" : "text-primary"}`}>
                  {notif.type === "warning" ? <AlertTriangle className="size-4" /> : notif.type === "success" ? <CheckCircle className="size-4" /> : <Info className="size-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">{notif.message}</p>
                  <span className="text-[10px] text-muted-foreground font-mono">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 5. STUDENT RESULT DETAILS DIALOG ──────────────── */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl text-xs leading-normal max-h-[90vh] overflow-y-auto">
          {selectedResult && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-primary/10 text-primary border-primary/25 font-mono">{selectedResult.studentId}</Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">{selectedResult.department} · {selectedResult.semester}</span>
                  <Badge variant="outline" className={`text-[9px] uppercase ${resultBadgeClass(selectedResult.result)}`}>{selectedResult.result}</Badge>
                </div>
                <DialogTitle className="text-base font-bold font-display mt-1">{selectedResult.studentName}</DialogTitle>
                <DialogDescription>
                  {selectedResult.program} · {selectedResult.academicYear} · {selectedResult.examType}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
                  {[
                    { label: "Total Credits", value: String(selectedResult.totalCredits) },
                    { label: "Earned Credits", value: String(selectedResult.earnedCredits) },
                    { label: "SGPA", value: String(selectedResult.sgpa) },
                    { label: "CGPA", value: String(selectedResult.cgpa) },
                    { label: "Percentage", value: `${selectedResult.percentage}%` },
                    { label: "Backlogs", value: String(selectedResult.backlogs) },
                  ].map((item) => (
                    <div key={item.label} className="border rounded-lg p-2.5 bg-muted/20 text-center">
                      <span className="text-[9px] text-muted-foreground">{item.label}</span>
                      <p className="font-bold font-mono text-primary text-sm mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Subject-wise marks table */}
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-left text-[10px]">
                    <thead className="bg-muted/30">
                      <tr className="text-muted-foreground font-semibold">
                        <th className="py-2 px-3">Code</th>
                        <th className="py-2 px-3">Subject</th>
                        <th className="py-2 px-3 text-center">Internal</th>
                        <th className="py-2 px-3 text-center">External</th>
                        <th className="py-2 px-3 text-center">Total</th>
                        <th className="py-2 px-3 text-center">Credits</th>
                        <th className="py-2 px-3 text-center">Grade</th>
                        <th className="py-2 px-3 text-center">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedResult.subjects.map((sub) => (
                        <tr key={sub.subjectCode} className="border-t border-border/40 hover:bg-muted/5">
                          <td className="py-2 px-3 font-mono font-bold">{sub.subjectCode}</td>
                          <td className="py-2 px-3 font-semibold">{sub.subjectName}</td>
                          <td className="py-2 px-3 text-center font-mono">{sub.internalMarks}</td>
                          <td className="py-2 px-3 text-center font-mono">{sub.externalMarks}</td>
                          <td className="py-2 px-3 text-center font-mono font-bold">{sub.totalMarks}/{sub.maxMarks}</td>
                          <td className="py-2 px-3 text-center font-mono">{sub.credits}</td>
                          <td className="py-2 px-3 text-center font-bold text-primary">{sub.grade}</td>
                          <td className="py-2 px-3 text-center">
                            <Badge variant="outline" className={`text-[8px] uppercase ${sub.result === "Pass" ? "text-emerald-600 border-emerald-200" : "text-destructive border-destructive/20"}`}>
                              {sub.result}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
                <Button onClick={() => { toast.success(`Downloading mark memo for ${selectedResult.studentName}...`); }} variant="outline" className="border-primary/30 text-primary">
                  <Download className="size-3.5 mr-1" /> Download Memo
                </Button>
                {selectedResult.status === "Pending Review" && (
                  <Button onClick={() => { handleApprove(selectedResult.studentId, selectedResult.studentName); setIsDetailsOpen(false); }} className="bg-brand-gradient text-white font-semibold">
                    Approve Result
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── 6. PUBLISH CONFIRMATION DIALOG ────────────────── */}
      <Dialog open={isPublishConfirmOpen} onOpenChange={setIsPublishConfirmOpen}>
        <DialogContent className="max-w-sm text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display">Publish Result?</DialogTitle>
            <DialogDescription>
              This will make the result visible to the student on their portal. This action can be withdrawn later if needed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsPublishConfirmOpen(false)}>Cancel</Button>
            <Button onClick={confirmPublish} className="bg-brand-gradient text-white font-semibold">Publish Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
