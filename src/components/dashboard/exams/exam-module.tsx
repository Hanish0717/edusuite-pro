import { useState, useMemo, useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { FileSpreadsheet, RefreshCw, Download, Search, Filter, ChevronDown } from "lucide-react";
import type { ExamModuleData, ExamItem, ExamStudentMark, EvaluationProgressInfo } from "./types";
import { StatisticsCards } from "./statistics-cards";
import { UpcomingExams } from "./upcoming-exams";
import { ExamTimetable } from "./exam-timetable";
import { InvigilationPanel } from "./invigilation-panel";
import { QuestionPaperPanel } from "./question-paper-panel";
import { HallAllocation } from "./hall-allocation";
import { SeatingPlan } from "./seating-plan";
import { MarksEntry } from "./marks-entry";
import { EvaluationProgress } from "./evaluation-progress";
import { AnalyticsDashboard } from "./analytics-dashboard";
import { QuickActions } from "./quick-actions";
import { EmptyState } from "./empty-state";
import { SkeletonLoader } from "./skeleton-loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ExamModuleProps {
  data: ExamModuleData;
  facultyName: string;
  academicYear: string;
  semester: string;
}

export function ExamModule({ data, facultyName, academicYear, semester }: ExamModuleProps) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabFromUrl = searchParams.get("tab");

  // Tabs navigation control state
  const [activeTab, setActiveTab] = useState("timetable");

  useEffect(() => {
    if (tabFromUrl === "schedule" || tabFromUrl === "schedules" || tabFromUrl === "timetable") {
      setActiveTab("timetable");
    } else if (tabFromUrl === "hall-tickets" || tabFromUrl === "hall-allocation") {
      setActiveTab("hall-allocation");
    } else if (tabFromUrl === "marks" || tabFromUrl === "marks-entry") {
      setActiveTab("marks-entry");
    }
  }, [tabFromUrl]);

  // Local state for interactive updates
  const [marksMap, setMarksMap] = useState<Record<string, ExamStudentMark[]>>(data.marksSubmissionList);
  const [progressMap, setProgressMap] = useState<Record<string, EvaluationProgressInfo>>(data.evaluationProgressList);

  const [loading, setLoading] = useState(false);

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("ALL");
  const [selectedSection, setSelectedSection] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");

  // Get unique subjects, sections, types from mock exams
  const subjects = useMemo(() => Array.from(new Set(data.exams.map((e) => e.subject))), [data.exams]);
  const sections = useMemo(() => Array.from(new Set(data.exams.map((e) => e.section))), [data.exams]);
  const types = useMemo(() => Array.from(new Set(data.exams.map((e) => e.type))), [data.exams]);

  // Handle Marks update
  const handleSaveMarks = (examId: string, updatedMarks: ExamStudentMark[]) => {
    // Update marks map
    setMarksMap((prev) => ({
      ...prev,
      [examId]: updatedMarks
    }));

    // Recalculate evaluation progress progress bar values
    const totalCount = updatedMarks.length;
    const evaluatedCount = updatedMarks.filter((m) => m.marksObtained !== undefined).length;
    const isSubmitted = updatedMarks.every((m) => m.submissionStatus === "Submitted");

    setProgressMap((prev) => ({
      ...prev,
      [examId]: {
        totalScripts: totalCount,
        evaluatedScripts: evaluatedCount,
        marksSubmitted: isSubmitted
      }
    }));
  };

  const handleRefresh = () => {
    setLoading(true);
    toast.success("Synchronizing examination schedules...", {
      description: "Fetching latest registrar allocations."
    });
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleExport = () => {
    toast.success("Downloading examination reports archive.", {
      description: "Generated exam records sheet file."
    });
  };

  const handleActionSelect = (actionId: string) => {
    if (actionId === "timetable") {
      setActiveTab("timetable");
    } else if (actionId === "question-papers") {
      setActiveTab("question-papers");
    } else if (actionId === "marks-entry") {
      setActiveTab("marks-entry");
    } else if (actionId === "evaluation") {
      setActiveTab("evaluation");
    } else if (actionId === "analytics") {
      setActiveTab("analytics");
    } else if (actionId === "reports") {
      handleExport();
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedSubject("ALL");
    setSelectedSection("ALL");
    setSelectedType("ALL");
  };

  // Filter exams list locally
  const filteredExams = useMemo(() => {
    return data.exams.filter((exam) => {
      const matchesSearch =
        exam.name.toLowerCase().includes(search.toLowerCase()) ||
        exam.code.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = selectedSubject === "ALL" || exam.subject === selectedSubject;
      const matchesSection = selectedSection === "ALL" || exam.section === selectedSection;
      const matchesType = selectedType === "ALL" || exam.type === selectedType;

      return matchesSearch && matchesSubject && matchesSection && matchesType;
    });
  }, [data.exams, search, selectedSubject, selectedSection, selectedType]);

  // Recalculate stats dynamically based on local edits
  const dynamicStats = useMemo(() => {
    const exams = data.exams;
    const completed = exams.filter((e) => e.status === "Completed");
    const upcoming = exams.filter((e) => e.status === "Upcoming" || e.status === "Ongoing");

    const pendingEval = completed.filter((e) => {
      const prog = progressMap[e.id];
      return prog ? prog.evaluatedScripts < prog.totalScripts : true;
    }).length;

    const pendingMarks = exams.reduce((s, e) => {
      const marks = marksMap[e.id];
      if (!marks) return s;
      return s + marks.filter((m) => m.submissionStatus !== "Submitted").length;
    }, 0);

    return {
      totalExams: exams.length,
      upcomingExams: upcoming.length,
      completedExams: completed.length,
      pendingEvaluations: pendingEval,
      invigilationDuties: data.invigilations.length,
      marksPending: pendingMarks
    };
  }, [data.exams, data.invigilations, marksMap, progressMap]);

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <FileSpreadsheet className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-foreground leading-tight">
              Examination Management
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {facultyName} · AY {academicYear} · Semester {semester}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-bold" onClick={handleRefresh}>
            <RefreshCw className="size-3.5" /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-bold" onClick={handleExport}>
            <Download className="size-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* ── Statistics Cards ─────────────────────────────────────── */}
      <StatisticsCards stats={dynamicStats} />

      {/* ── Quick ActionsCockpit ──────────────────────────────────── */}
      <QuickActions onActionSelect={handleActionSelect} />

      {/* ── Search Toolbar Filters ───────────────────────────────── */}
      <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium bg-muted/40 px-3 py-1.5 rounded-xl border border-border/40">
            <span>AY {academicYear}</span>
            <span className="text-border">|</span>
            <span>Sem {semester}</span>
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search exam name or subject code..."
              className="pl-9 h-8 text-xs bg-muted/20 border-border/40"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Filter className="size-3.5 text-muted-foreground shrink-0" />
          
          {/* Subject Filter Selector */}
          <div className="relative">
            <select
              className="appearance-none h-7 pl-2 pr-7 text-xs rounded-lg border border-border/50 bg-muted/30 text-foreground font-bold cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="ALL">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          </div>

          {/* Section Filter Selector */}
          <div className="relative">
            <select
              className="appearance-none h-7 pl-2 pr-7 text-xs rounded-lg border border-border/50 bg-muted/30 text-foreground font-bold cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="ALL">All Sections</option>
              {sections.map((sec) => (
                <option key={sec} value={sec}>Section {sec}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          </div>

          {/* Exam Type Filter Selector */}
          <div className="relative">
            <select
              className="appearance-none h-7 pl-2 pr-7 text-xs rounded-lg border border-border/50 bg-muted/30 text-foreground font-bold cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="ALL">All Exam Types</option>
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* ── Tabs Content Layout ──────────────────────────────────── */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap h-auto p-1 bg-muted rounded-xl">
            <TabsTrigger value="timetable" className="rounded-lg text-xs py-1.5 font-bold">Timetable & Schedule</TabsTrigger>
            <TabsTrigger value="invigilations" className="rounded-lg text-xs py-1.5 font-bold">Invigilation & Halls</TabsTrigger>
            <TabsTrigger value="question-papers" className="rounded-lg text-xs py-1.5 font-bold">Question Papers</TabsTrigger>
            <TabsTrigger value="marks-entry" className="rounded-lg text-xs py-1.5 font-bold">Marks Submission</TabsTrigger>
            <TabsTrigger value="evaluation" className="rounded-lg text-xs py-1.5 font-bold">Evaluation Progress</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg text-xs py-1.5 font-bold">Exam Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="timetable" className="mt-4 space-y-6">
            <div className="space-y-4">
              <h2 className="text-sm font-black text-foreground uppercase tracking-wider">Upcoming Examinations</h2>
              <UpcomingExams exams={filteredExams} />
            </div>
            <div className="space-y-4">
              <h2 className="text-sm font-black text-foreground uppercase tracking-wider">Exam Timetable</h2>
              {filteredExams.length === 0 ? (
                <EmptyState onResetFilters={handleResetFilters} />
              ) : (
                <ExamTimetable exams={filteredExams} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="invigilations" className="mt-4 space-y-6">
            <div className="space-y-4">
              <h2 className="text-sm font-black text-foreground uppercase tracking-wider">Invigilation Duties</h2>
              <InvigilationPanel duties={data.invigilations} />
            </div>
            <div className="space-y-4">
              <h2 className="text-sm font-black text-foreground uppercase tracking-wider">Hall Allocation</h2>
              <HallAllocation allocations={data.hallAllocations} />
            </div>
            <div className="space-y-4">
              <h2 className="text-sm font-black text-foreground uppercase tracking-wider">Seating Arrangement Grid</h2>
              <SeatingPlan arrangements={data.seatingArrangements} />
            </div>
          </TabsContent>

          <TabsContent value="question-papers" className="mt-4">
            <QuestionPaperPanel papers={data.questionPapers} />
          </TabsContent>

          <TabsContent value="marks-entry" className="mt-4">
            <MarksEntry
              exams={data.exams}
              marksMap={marksMap}
              onSaveMarks={handleSaveMarks}
            />
          </TabsContent>

          <TabsContent value="evaluation" className="mt-4">
            <EvaluationProgress exams={data.exams} progressMap={progressMap} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <AnalyticsDashboard analytics={data.analytics} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
