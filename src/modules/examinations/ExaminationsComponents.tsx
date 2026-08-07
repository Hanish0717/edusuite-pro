import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  FileSpreadsheet,
  Plus,
  Search,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Trash2,
  Award,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Clock,
  Send,
  Sparkles,
  Building2,
  Users,
  Grid,
  Workflow,
  Info,
  BarChart3
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
import { DonutChart, GroupedBarChart } from "@/components/dashboard/charts";

import {
  MOCK_EXAMS,
  MOCK_EXAM_HALLS,
  MOCK_INVIGILATORS,
  MOCK_NOTIFICATIONS,
  type Exam,
  type ExamHall,
  type Invigilator
} from "@/data/examination-management-mock";

const EXAM_TYPES = [
  "Internal Assessment",
  "Mid Examination",
  "Practical Examination",
  "Lab Examination",
  "End Semester Examination",
  "Supplementary Examination",
  "Improvement Examination",
  "Project Viva"
];

export function ExaminationsModuleView() {
  // Simulated Loading/Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States for database entities
  const [examsList, setExamsList] = useState<Exam[]>(MOCK_EXAMS);
  const [hallsList, setHallsList] = useState<ExamHall[]>(MOCK_EXAM_HALLS);
  const [invigilatorsList, setInvigilatorsList] = useState<Invigilator[]>(MOCK_INVIGILATORS);

  // Selection states
  const [activeTab, setActiveTab] = useState<"schedules" | "halls" | "seating" | "invigilators" | "analytics">("schedules");
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [examForm, setExamForm] = useState<any>({});

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleResetFilters = () => {
    setSearchQuery("");
    setDeptFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
    setSortBy("date");
    toast.success("Filters reset successfully");
  };

  const triggerReload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

  // Filter exams
  const filteredExams = useMemo(() => {
    return examsList
      .filter((exam) => {
        const matchesSearch =
          exam.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exam.examCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exam.subject.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept = deptFilter === "all" || exam.department === deptFilter;
        const matchesType = typeFilter === "all" || exam.examType === typeFilter;
        const matchesStatus = statusFilter === "all" || exam.status === statusFilter;

        return matchesSearch && matchesDept && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "date") return a.date.localeCompare(b.date);
        if (sortBy === "students") return b.totalStudents - a.totalStudents;
        return 0;
      });
  }, [examsList, searchQuery, deptFilter, typeFilter, statusFilter, sortBy]);

  // Compute metrics summary
  const metrics = useMemo(() => {
    const total = examsList.length;
    const upcoming = examsList.filter((e) => e.status === "Published" || e.status === "Approved").length;
    const completed = examsList.filter((e) => e.status === "Completed").length;
    const pending = examsList.filter((e) => e.status === "Pending Approval" || e.status === "Draft").length;
    const allocatedHalls = hallsList.filter((h) => h.status !== "Available").length;
    const invigilatorsCount = invigilatorsList.filter((i) => i.status === "Assigned").length;
    const totalStudentsAppearing = examsList.reduce((sum, e) => sum + e.totalStudents, 0);

    return { total, upcoming, completed, pending, allocatedHalls, invigilatorsCount, totalStudentsAppearing };
  }, [examsList, hallsList, invigilatorsList]);

  // Save Add/Edit Exam
  const handleOpenAddExam = () => {
    setFormMode("add");
    setExamForm({
      examName: "",
      examCode: "",
      department: "CSE",
      program: "B.Tech",
      semester: "Semester V",
      section: "CSE-A",
      subject: "Computer Networks",
      examType: "Mid Examination",
      date: "2026-08-10",
      startTime: "09:30 AM",
      endTime: "11:30 AM",
      duration: "2 hours",
      hall: "LH-302",
      invigilator: "Dr. K. Sai Teja",
      status: "Draft",
      maxMarks: 50,
      passingMarks: 20,
      totalStudents: 60
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEditExam = (exam: Exam) => {
    setFormMode("edit");
    setExamForm(exam);
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!examForm.examName?.trim()) errors["examName"] = "Exam name is required.";
    if (!examForm.examCode?.trim()) errors["examCode"] = "Exam code is required.";
    if (!examForm.maxMarks) errors["maxMarks"] = "Max marks is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please resolve validation errors first.");
      return;
    }

    if (formMode === "add") {
      const newExam: Exam = {
        ...(examForm as Exam),
        id: `EX-${Date.now()}`
      };
      setExamsList((prev) => [newExam, ...prev]);
      toast.success(`Created Examination Schedule: ${newExam.examName}`);
    } else {
      setExamsList((prev) =>
        prev.map((e) => (e.id === examForm.id ? ({ ...e, ...examForm } as Exam) : e))
      );
      toast.success(`Updated Examination Schedule: ${examForm.examName}`);
    }

    setIsAddModalOpen(false);
  };

  // Publish all schedules
  const handlePublishAllSchedules = () => {
    setExamsList((prev) => prev.map((e) => ({ ...e, status: "Published" as const })));
    setIsPublishModalOpen(false);
    toast.success("All approved exams schedules published to student portals!");
  };

  // Archive Exam
  const handleArchiveExam = (id: string, name: string) => {
    setExamsList((prev) => prev.map((e) => (e.id === id ? { ...e, status: "Cancelled" as const } : e)));
    toast.warning(`Cancelled Examination: ${name}`);
  };

  // Analytics Utilization data
  const examCompletionDistribution = [
    { name: "Schedules Published", value: 2 },
    { name: "Schedules Draft", value: 1 },
    { name: "Schedules Completed", value: 0 }
  ];

  const examsPerSemester = [
    { name: "Semester I", Exams: 1 },
    { name: "Semester III", Exams: 3 },
    { name: "Semester V", Exams: 2 },
    { name: "Semester VII", Exams: 1 }
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
            <FileSpreadsheet className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Examination Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Academic Management Portal
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Manage examinations, schedules, halls, invigilators, seating plans, and academic assessment activities.
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
              toast.success("AI Optimizer successfully balanced examination blocks with zero overlapping halls!");
            }}
            className="h-9 gap-1.5 font-semibold text-xs border-primary/30 text-primary hover:bg-primary/5"
          >
            <Sparkles className="size-3.5" /> Allocate Halls
          </Button>
          <Button
            onClick={() => setIsPublishModalOpen(true)}
            className="h-9 bg-brand-gradient text-white gap-1.5 font-semibold text-xs shadow-glow hover:opacity-95 cursor-pointer"
          >
            <Send className="size-3.5" /> Publish Schedule
          </Button>
        </div>
      </div>

      {/* 2. SUMMARY DASHBOARD KPI CARDS */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-8">
        <KpiCard label="Total Exams" value={String(metrics.total)} icon={FileSpreadsheet} tone="primary" />
        <KpiCard label="Upcoming Exams" value={String(metrics.upcoming)} icon={Calendar} tone="primary" />
        <KpiCard label="Completed Exams" value={String(metrics.completed)} icon={CheckCircle} tone="primary" />
        <KpiCard label="Pending Schedules" value={String(metrics.pending)} icon={Clock} tone="primary" />
        <KpiCard label="Allocated Halls" value={String(metrics.allocatedHalls)} icon={Building2} tone="primary" />
        <KpiCard label="Assigned Invigilators" value={String(metrics.invigilatorsCount)} icon={Users} tone="primary" />
        <KpiCard label="Students Appearing" value={String(metrics.totalStudentsAppearing)} icon={Award} tone="primary" />
        <KpiCard label="Pending Approvals" value="1 Exam" icon={Workflow} tone="primary" />
      </div>

      {/* 3. MULTIPLE VIEW MODE TABS */}
      <div className="flex justify-between items-center border-b pb-1 flex-wrap gap-3">
        <div className="flex rounded-xl bg-muted/40 p-1 border font-semibold">
          <button
            onClick={() => setActiveTab("schedules")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "schedules" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="size-3.5" /> Schedules calendar list
          </button>
          <button
            onClick={() => setActiveTab("halls")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "halls" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="size-3.5" /> Hall Allocations
          </button>
          <button
            onClick={() => setActiveTab("seating")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "seating" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Grid className="size-3.5" /> Seating layout plans
          </button>
          <button
            onClick={() => setActiveTab("invigilators")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "invigilators" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-3.5" /> Invigilator Workloads
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "analytics" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="size-3.5" /> Evaluations Analytics
          </button>
        </div>

        <Button
          onClick={handleOpenAddExam}
          className="h-8 text-[11px] font-bold bg-brand-gradient text-white gap-1 shadow-sm"
        >
          <Plus className="size-3.5" /> Schedule Examination
        </Button>
      </div>

      {/* 4. TAB PANELS */}

      {/* TAB 1: Schedules calendar list */}
      {activeTab === "schedules" && (
        <div className="space-y-4 border rounded-2xl bg-card p-5 shadow-sm">
          <div className="flex justify-between items-center border-b pb-3 mb-2 flex-wrap gap-2">
            <h3 className="text-base font-bold font-display text-foreground flex items-center gap-2">
              <Calendar className="size-5 text-primary" /> Master Examinations Schedules
            </h3>
            
            {/* Filters Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search exam code, name..."
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
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-8 text-xs w-[110px]">
                  <SelectValue placeholder="Exam Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {EXAM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="ghost" onClick={handleResetFilters} className="h-8 px-2 font-semibold">
                Reset
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead>
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2">Exam Code</th>
                  <th className="py-2">Exam Name</th>
                  <th className="py-2">Type / Dept</th>
                  <th className="py-2">Date & Time</th>
                  <th className="py-2">Allocations</th>
                  <th className="py-2">Appearing Students</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.map((exam) => (
                  <tr key={exam.id} className="border-b border-border/40 hover:bg-muted/5 transition-colors">
                    <td className="py-3 font-mono font-bold">{exam.examCode}</td>
                    <td className="py-3 font-bold text-foreground">
                      <p>{exam.examName}</p>
                      <span className="text-[9px] text-muted-foreground font-semibold font-sans">{exam.subject}</span>
                    </td>
                    <td className="py-3 font-semibold">
                      <p>{exam.examType}</p>
                      <span className="text-[9px] text-muted-foreground font-mono">{exam.department} &middot; {exam.semester}</span>
                    </td>
                    <td className="py-3">
                      <p className="font-bold">{exam.date}</p>
                      <span className="text-[9px] text-muted-foreground font-mono">{exam.startTime} - {exam.endTime}</span>
                    </td>
                    <td className="py-3 font-semibold text-primary">
                      <p>Room: {exam.hall}</p>
                      <span className="text-[9px] text-muted-foreground font-semibold">Invigilator: {exam.invigilator}</span>
                    </td>
                    <td className="py-3 font-mono font-bold text-center">{exam.totalStudents}</td>
                    <td className="py-3">
                      <Badge
                        variant="outline"
                        className={`text-[9px] uppercase ${
                          exam.status === "Published"
                            ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                            : exam.status === "Draft"
                            ? "text-muted-foreground border-border bg-muted/20"
                            : "text-primary border-primary/20 bg-primary/5"
                        }`}
                      >
                        {exam.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedExam(exam);
                            setIsDetailsOpen(true);
                          }}
                          className="h-8 text-primary hover:bg-primary/5 cursor-pointer"
                        >
                          <Eye className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditExam(exam)}
                          className="h-8 text-muted-foreground hover:bg-muted cursor-pointer"
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArchiveExam(exam.id, exam.examName)}
                          className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
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
        </div>
      )}

      {/* TAB 2: Hall Allocation list */}
      {activeTab === "halls" && (
        <div className="space-y-4 border rounded-2xl bg-card p-5 shadow-sm">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Building2 className="size-5 text-primary" /> Examination Halls & Blocks Capacity Check
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hallsList.map((hall) => (
              <div key={hall.hallId} className="p-4 border rounded-xl space-y-2 flex flex-col justify-between bg-card hover:bg-muted/10 transition-colors">
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <span className="font-mono font-bold text-xs text-primary">{hall.hallNumber}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{hall.building}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border rounded-lg p-2.5 bg-muted/20 mt-3 font-mono">
                    <div>
                      <span className="text-[9px] font-sans text-muted-foreground">Capacity limit</span>
                      <p className="font-bold text-foreground text-xs">{hall.capacity} Seats</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-sans text-muted-foreground">Allocated</span>
                      <p className="font-bold text-primary text-xs">{hall.allocatedStudents} Students</p>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-border/40 flex justify-between items-center mt-2">
                  <Badge
                    variant="outline"
                    className={`text-[9px] uppercase ${
                      hall.status === "Full" ? "text-destructive border-destructive/20 bg-destructive/5" : "text-emerald-600 border-emerald-200 bg-emerald-50"
                    }`}
                  >
                    {hall.status}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-7 text-[10px] font-semibold text-primary cursor-pointer">
                    Manage Layout
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Seating layout plans */}
      {activeTab === "seating" && (
        <div className="space-y-4 border rounded-2xl bg-card p-5 shadow-sm">
          <div className="flex justify-between items-center border-b pb-3 mb-2 flex-wrap gap-2">
            <h3 className="text-base font-bold font-display text-foreground flex items-center gap-2">
              <Grid className="size-5 text-primary" /> Visual Seating Grid Layout: LH-302 (Capacity: 60)
            </h3>
            <Button
              size="sm"
              onClick={() => {
                toast.success("Printed physical classroom layout coordinates!");
              }}
              className="h-8 gap-1 font-semibold text-xs border border-border"
              variant="outline"
            >
              Print Layout
            </Button>
          </div>

          <div className="p-5 border rounded-xl bg-muted/10 space-y-4">
            <div className="grid grid-cols-6 gap-3 max-w-xl mx-auto">
              {[...Array(30)].map((_, idx) => {
                const seatNum = `Seat-${idx + 1}`;
                const isOccupied = idx < 20; // mock fill
                return (
                  <div
                    key={idx}
                    className={`p-2 border rounded-lg text-center transition-colors font-mono font-bold text-[9px] flex flex-col justify-between h-12 ${
                      isOccupied ? "bg-primary/10 border-primary/30 text-primary" : "bg-card text-muted-foreground/45 border-dashed"
                    }`}
                  >
                    <span>{seatNum}</span>
                    <span className="text-[8px] font-sans truncate font-medium">
                      {isOccupied ? "Rohan V." : "Available"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="p-3 bg-primary/5 border border-primary/15 text-primary rounded-xl flex gap-2 justify-center max-w-md mx-auto">
              <Info className="size-4 shrink-0 text-primary" />
              <p className="text-[10px] leading-relaxed font-sans text-center">
                **AI arrangement checklist:** Alternating rolls pattern is enabled to prevent adjacent exam duplicates.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Invigilator Workloads */}
      {activeTab === "invigilators" && (
        <div className="space-y-4 border rounded-2xl bg-card p-5 shadow-sm">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Users className="size-5 text-primary" /> Invigilator Duty Allocations & Schedules
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead>
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2">Faculty Member</th>
                  <th className="py-2">Department</th>
                  <th className="py-2">Assigned Hall</th>
                  <th className="py-2">Exam Schedule</th>
                  <th className="py-2">Assigned Date</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invigilatorsList.map((inv) => (
                  <tr key={inv.facultyId} className="border-b border-border/40 hover:bg-muted/5 transition-colors">
                    <td className="py-3 font-bold text-foreground">{inv.facultyName}</td>
                    <td className="py-3">{inv.department}</td>
                    <td className="py-3 font-mono font-bold text-primary">{inv.assignedHall}</td>
                    <td className="py-3 font-semibold">{inv.assignedExam}</td>
                    <td className="py-3 font-mono">{inv.date}</td>
                    <td className="py-3">
                      <Badge
                        variant="outline"
                        className={`text-[9px] uppercase ${
                          inv.status === "Assigned" ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-muted-foreground border-border bg-muted/20"
                        }`}
                      >
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          toast.success(`Invigilator replacement requested for ${inv.facultyName}!`);
                        }}
                        className="h-8 text-primary hover:bg-primary/5 cursor-pointer font-semibold text-[10px]"
                      >
                        Replace
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Analytics */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Semester-wise Exams */}
          <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Semester Exams Load</span>
              <span className="text-[10px] text-primary lowercase font-mono">Courses count</span>
            </h4>
            <GroupedBarChart
              data={examsPerSemester as any}
              xKey="name"
              series={[{ key: "Exams", label: "Exams count" }]}
              height={180}
            />
          </div>

          {/* Exam Completion Status */}
          <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Completion Distribution Status</span>
              <span className="text-[10px] text-success font-mono">Schedules percentage</span>
            </h4>
            <DonutChart data={examCompletionDistribution} centerLabel="Exams" height={180} />
          </div>
        </div>
      )}

      {/* 5. ADD / EDIT EXAM MODAL */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display">
              {formMode === "add" ? "Schedule New Examination" : "Modify Exam Settings"}
            </DialogTitle>
            <DialogDescription>
              Detail subject code, evaluation type, maximum scores, passing margins, and room allocations.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveExam} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1 col-span-2">
                <Label htmlFor="exam-name">Exam Name*</Label>
                <Input
                  id="exam-name"
                  value={examForm.examName || ""}
                  onChange={(e) => setExamForm((prev: any) => ({ ...prev, examName: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="exam-code">Exam Code*</Label>
                <Input
                  id="exam-code"
                  value={examForm.examCode || ""}
                  onChange={(e) => setExamForm((prev: any) => ({ ...prev, examCode: e.target.value }))}
                  required
                  disabled={formMode === "edit"}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="exam-type">Evaluation Type</Label>
                <Select
                  value={examForm.examType || "Mid Examination"}
                  onValueChange={(val: any) => setExamForm((prev: any) => ({ ...prev, examType: val }))}
                >
                  <SelectTrigger id="exam-type">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAM_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="exam-dept">Department*</Label>
                <Input
                  id="exam-dept"
                  value={examForm.department || "CSE"}
                  onChange={(e) => setExamForm((prev: any) => ({ ...prev, department: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="exam-sem">Semester*</Label>
                <Input
                  id="exam-sem"
                  value={examForm.semester || "Semester V"}
                  onChange={(e) => setExamForm((prev: any) => ({ ...prev, semester: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="exam-sub">Subject Name*</Label>
                <Input
                  id="exam-sub"
                  value={examForm.subject || ""}
                  onChange={(e) => setExamForm((prev: any) => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="exam-date">Date*</Label>
                <Input
                  id="exam-date"
                  type="date"
                  value={examForm.date || "2026-08-10"}
                  onChange={(e) => setExamForm((prev: any) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="exam-max">Max Marks*</Label>
                <Input
                  id="exam-max"
                  type="number"
                  value={examForm.maxMarks || 50}
                  onChange={(e) => setExamForm((prev: any) => ({ ...prev, maxMarks: parseInt(e.target.value) || 50 }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="exam-pass">Passing Marks*</Label>
                <Input
                  id="exam-pass"
                  type="number"
                  value={examForm.passingMarks || 20}
                  onChange={(e) => setExamForm((prev: any) => ({ ...prev, passingMarks: parseInt(e.target.value) || 20 }))}
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-brand-gradient text-white font-semibold">Save Schedule</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. PUBLISH WARNING DIALOG */}
      <Dialog open={isPublishModalOpen} onOpenChange={setIsPublishModalOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display">Publish Examination Schedules?</DialogTitle>
            <DialogDescription>
              Are you sure you want to publish the examination timetable? This will update schedules on all student rosters and invigilators dashboards instantly.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsPublishModalOpen(false)}>Cancel</Button>
            <Button onClick={handlePublishAllSchedules} className="bg-brand-gradient text-white font-semibold">Publish Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 7. EXAMINATION DETAIL DIALOG */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          {selectedExam && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/25 font-mono">
                    {selectedExam.examCode}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {selectedExam.department} &middot; {selectedExam.semester}
                  </span>
                </div>
                <DialogTitle className="text-base font-bold font-display mt-1">
                  {selectedExam.examName}
                </DialogTitle>
                <DialogDescription>
                  Review examination details, maximum Marks, allocated classroom blocks, and invigilator duties.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2.5">
                <div className="grid grid-cols-2 gap-3.5 border rounded-xl p-3 bg-muted/20 font-sans">
                  <div>
                    <span className="text-muted-foreground text-[10px]">Date & Time</span>
                    <p className="font-bold mt-0.5">{selectedExam.date}</p>
                    <span className="text-[9px] text-muted-foreground font-mono">{selectedExam.startTime} - {selectedExam.endTime}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Allocated Hall</span>
                    <p className="font-bold mt-0.5 font-mono text-primary text-sm">{selectedExam.hall}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Maximum Marks</span>
                    <p className="font-bold mt-0.5">{selectedExam.maxMarks} Marks</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Appearing Students</span>
                    <p className="font-bold mt-0.5">{selectedExam.totalStudents} Candidates</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground text-[10px]">Primary Invigilator</span>
                  <p className="font-bold text-foreground text-xs">{selectedExam.invigilator}</p>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close Details</Button>
                <Button
                  onClick={() => {
                    handleArchiveExam(selectedExam.id, selectedExam.examName);
                    setIsDetailsOpen(false);
                  }}
                  variant="destructive"
                  className="font-semibold"
                >
                  Cancel Examination
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
