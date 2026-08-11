import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Layers,
  Building2,
  Users,
  BookOpen,
  Calendar,
  Layers3,
  Award,
  AlertTriangle,
  Search,
  Plus,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  X,
  ChevronRight,
  GitBranch,
  BookmarkCheck,
  CheckCircle,
  FileText,
  Clock,
  Compass,
  LineChart,
  ArrowRight,
  PlusCircle
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { DonutChart, GroupedBarChart } from "@/components/dashboard/charts";

import {
  MOCK_PROGRAMS,
  MOCK_CURRICULUMS,
  MOCK_REGULATIONS,
  MOCK_REVISIONS,
  MOCK_CREDITS_DISTRIBUTION,
  type Program,
  type SemesterCurriculum,
  type Regulation,
  type CurriculumSubject
} from "@/data/curriculum-management-mock";

export function CurriculumManagement() {
  // Simulated Loading/Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Core datasets states
  const [programsList, setProgramsList] = useState<Program[]>(MOCK_PROGRAMS);
  const [curriculumsList, setCurriculumsList] = useState<SemesterCurriculum[]>(MOCK_CURRICULUMS);
  const [regulationsList, setRegulationsList] = useState<Regulation[]>(MOCK_REGULATIONS);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [regFilter, setRegFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Selection states
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>("prog-1"); // Default CSE selected
  const [activeTab, setActiveTab] = useState<"curriculum" | "timeline" | "regulations" | "flow" | "analytics">("curriculum");

  // Modals state
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [programFormMode, setProgramFormMode] = useState<"add" | "edit">("add");
  const [currentProgramForm, setCurrentProgramForm] = useState<any>({});

  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [currentCurriculumForm, setCurrentCurriculumForm] = useState<any>({});

  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [addSubjectSemName, setAddSubjectSemName] = useState("Semester I");
  const [subjectForm, setSubjectForm] = useState<any>({});

  // Validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Compute metrics
  const metrics = useMemo(() => {
    const totalPrograms = programsList.length;
    const activeCurriculums = curriculumsList.length;
    const totalRegulations = regulationsList.length;
    const totalSemesters = programsList.reduce((acc, p) => acc + p.totalSemesters, 0);
    const totalCourses = curriculumsList.reduce((acc, c) => acc + c.subjects.length, 0);
    const totalCredits = curriculumsList.reduce((acc, c) => acc + c.credits, 0);
    const pendingRevisions = MOCK_REVISIONS.filter((r) => r.status === "draft").length;
    const recentlyUpdated = programsList.filter((p) => p.status === "active").length;

    return { totalPrograms, activeCurriculums, totalRegulations, totalSemesters, totalCourses, totalCredits, pendingRevisions, recentlyUpdated };
  }, [programsList, curriculumsList, regulationsList]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setDeptFilter("all");
    setDegreeFilter("all");
    setRegFilter("all");
    setStatusFilter("all");
    setSortBy("name");
    toast.success("Filters reset successfully");
  };

  // Filter & Sort Programs
  const filteredPrograms = useMemo(() => {
    return programsList
      .filter((p) => {
        const matchesSearch =
          p.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.programCode.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = deptFilter === "all" || p.department === deptFilter;
        const matchesDegree = degreeFilter === "all" || p.degree === degreeFilter;
        const matchesReg = regFilter === "all" || p.regulationName === regFilter;
        const matchesStatus = statusFilter === "all" || p.status === statusFilter;

        return matchesSearch && matchesDept && matchesDegree && matchesReg && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.programName.localeCompare(b.programName);
        if (sortBy === "credits") return b.credits - a.credits;
        if (sortBy === "duration") return b.duration - a.duration;
        return 0;
      });
  }, [programsList, searchTerm, deptFilter, degreeFilter, regFilter, statusFilter, sortBy]);

  // Selected Program Details
  const activeProgram = useMemo(() => {
    if (!selectedProgramId) return null;
    return programsList.find((p) => p.id === selectedProgramId) || null;
  }, [programsList, selectedProgramId]);

  // Selected Program's Curriculums
  const activeProgramCurriculum = useMemo(() => {
    if (!selectedProgramId) return [];
    return curriculumsList.filter((c) => c.programId === selectedProgramId);
  }, [curriculumsList, selectedProgramId]);

  // Trigger reloading simulation
  const triggerReload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 700);
  };

  // Add Program handler
  const handleOpenAddProgram = () => {
    setProgramFormMode("add");
    setCurrentProgramForm({
      programName: "",
      programCode: "",
      degree: "B.Tech",
      department: "CSE",
      duration: 4,
      academicYear: "2026-27",
      credits: 160,
      regulationId: "reg-r25",
      regulationName: "R25",
      status: "active",
      totalSemesters: 8,
      subjectsCount: 0,
      facultyCount: 0,
      studentsCount: 0
    });
    setFormErrors({});
    setIsProgramModalOpen(true);
  };

  const handleOpenEditProgram = (prog: Program) => {
    setProgramFormMode("edit");
    setCurrentProgramForm(prog);
    setFormErrors({});
    setIsProgramModalOpen(true);
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!currentProgramForm.programName?.trim()) errors["programName"] = "Program Name is required.";
    if (!currentProgramForm.programCode?.trim()) errors["programCode"] = "Program Code is required.";
    if (!currentProgramForm.credits) errors["credits"] = "Total credits is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please resolve validation errors first.");
      return;
    }

    if (programFormMode === "add") {
      const newProg: Program = {
        ...(currentProgramForm as Program),
        id: `prog-${currentProgramForm.programCode?.toLowerCase()}-${Date.now()}`
      };
      setProgramsList((prev) => [...prev, newProg]);
      toast.success(`Created Program: ${newProg.programName}`);
    } else {
      setProgramsList((prev) =>
        prev.map((p) => (p.id === currentProgramForm.id ? ({ ...p, ...currentProgramForm } as Program) : p))
      );
      toast.success(`Updated Program: ${currentProgramForm.programName}`);
    }

    setIsProgramModalOpen(false);
  };

  // Create Curriculum
  const handleOpenCurriculumModal = () => {
    setCurrentCurriculumForm({
      programId: selectedProgramId || "prog-1",
      regulation: "R25",
      academicYear: "2026-27",
      semesterCount: 8,
      description: ""
    });
    setIsCurriculumModalOpen(true);
  };

  const handleSaveCurriculum = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add realistic curriculum semester skeletons
    const semCount = parseInt(currentCurriculumForm.semesterCount) || 8;
    const programId = currentCurriculumForm.programId;

    const newCurrs: SemesterCurriculum[] = [];
    for (let i = 1; i <= semCount; i++) {
      newCurrs.push({
        id: `curr-${programId}-${i}-${Date.now()}`,
        programId: programId,
        semester: `Semester ${i}`,
        subjects: [
          { code: `CORE${i}01`, name: `Foundational Course ${i}`, credits: 4, theoryHours: 4, labHours: 0, subjectType: "Core" }
        ],
        credits: 4
      });
    }

    setCurriculumsList((prev) => [...prev, ...newCurrs]);
    toast.success(`Curriculum generated with ${semCount} semesters for program.`);
    setIsCurriculumModalOpen(false);
  };

  // Add Subject to Semester Modal
  const handleOpenAddSubject = (semName: string) => {
    setAddSubjectSemName(semName);
    setSubjectForm({
      code: "",
      name: "",
      credits: 3,
      theoryHours: 3,
      labHours: 0,
      subjectType: "Core"
    });
    setIsAddSubjectModalOpen(true);
  };

  const handleSaveSubjectToSemester = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.code?.trim() || !subjectForm.name?.trim()) {
      toast.error("Please fill code and name.");
      return;
    }

    const newSub: CurriculumSubject = {
      code: subjectForm.code,
      name: subjectForm.name,
      credits: parseFloat(subjectForm.credits) || 3,
      theoryHours: parseInt(subjectForm.theoryHours) || 3,
      labHours: parseInt(subjectForm.labHours) || 0,
      subjectType: subjectForm.subjectType as any
    };

    setCurriculumsList((prev) =>
      prev.map((curr) => {
        if (curr.programId === selectedProgramId && curr.semester === addSubjectSemName) {
          return {
            ...curr,
            subjects: [...curr.subjects, newSub],
            credits: curr.credits + newSub.credits
          };
        }
        return curr;
      })
    );

    toast.success(`Added ${newSub.code} to ${addSubjectSemName}`);
    setIsAddSubjectModalOpen(false);
  };

  // Archive Program
  const handleArchiveProgram = (id: string, name: string) => {
    setProgramsList((prev) => prev.map((p) => (p.id === id ? { ...p, status: "inactive" as const } : p)));
    toast.warning(`Archived Program: ${name}`);
  };

  // Analytics Datasets
  const semCreditsChartData = useMemo(() => {
    return activeProgramCurriculum.map((curr) => ({
      name: curr.semester,
      Credits: curr.credits,
      Subjects: curr.subjects.length
    }));
  }, [activeProgramCurriculum]);

  const coreVsElectiveData = useMemo(() => {
    let coreCount = 0;
    let electiveCount = 0;
    let labCount = 0;

    activeProgramCurriculum.forEach((curr) => {
      curr.subjects.forEach((sub) => {
        if (sub.subjectType === "Core") coreCount++;
        else if (sub.subjectType === "Elective") electiveCount++;
        else if (sub.subjectType === "Laboratory") labCount++;
      });
    });

    return [
      { name: "Core Courses", value: coreCount || 20 },
      { name: "Elective Courses", value: electiveCount || 8 },
      { name: "Practicals/Labs", value: labCount || 10 }
    ];
  }, [activeProgramCurriculum]);

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
            <Layers className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Course & Curriculum Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Academic Management Portal
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Manage academic programs, curriculum structures, regulations, semesters, and credit distribution.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={triggerReload}
            className="h-9 gap-1.5 font-semibold text-xs"
          >
            <RefreshCw className="size-3.5" /> Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenCurriculumModal}
            className="h-9 gap-1.5 font-semibold text-xs"
          >
            <PlusCircle className="size-3.5" /> Create Curriculum
          </Button>
          <Button
            onClick={handleOpenAddProgram}
            className="h-9 bg-brand-gradient text-white gap-1.5 font-semibold text-xs shadow-glow hover:opacity-95 cursor-pointer"
          >
            <Plus className="size-4" /> Add Program
          </Button>
        </div>
      </div>

      {/* 2. SUMMARY DASHBOARD CARDS */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-8">
        <KpiCard label="Total Programs" value={String(metrics.totalPrograms)} icon={Layers3} tone="primary" />
        <KpiCard label="Active Curriculums" value={String(metrics.activeCurriculums)} icon={CheckCircle} tone="success" />
        <KpiCard label="Total Regs" value={String(metrics.totalRegulations)} icon={BookmarkCheck} tone="info" />
        <KpiCard label="Total Semesters" value={String(metrics.totalSemesters)} icon={Calendar} tone="primary" />
        <KpiCard label="Total Courses" value={String(metrics.totalCourses)} icon={BookOpen} tone="info" />
        <KpiCard label="Total Credits" value={String(metrics.totalCredits)} icon={Award} tone="primary" />
        <KpiCard label="Pending Revisions" value={String(metrics.pendingRevisions)} icon={AlertTriangle} tone="warning" />
        <KpiCard label="Active Programs" value={String(metrics.recentlyUpdated)} icon={Users} tone="success" />
      </div>

      {/* 3. PROGRAM SELECTOR GRID & TABS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Program List Table & Search */}
        <div className="space-y-4 lg:col-span-1 border rounded-2xl bg-card p-5 shadow-sm">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 mb-2 flex items-center gap-2">
            <Compass className="size-5 text-primary" /> Active Programs
          </h3>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                onClick={() => setSelectedProgramId(prog.id)}
                className={`p-3 border rounded-xl cursor-pointer transition-colors flex items-center justify-between hover:bg-muted/30 ${
                  selectedProgramId === prog.id ? "bg-primary/5 text-primary border-primary/30" : "bg-card"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className="font-mono text-[9px]">
                      {prog.programCode}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">{prog.regulationName}</span>
                  </div>
                  <p className="font-bold mt-1 text-xs">{prog.programName}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{prog.degree} &middot; {prog.duration} Years</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[13px] font-mono text-foreground">{prog.credits}</p>
                  <p className="text-[9px] text-muted-foreground font-mono">Credits</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Curriculum Tab console */}
        <div className="lg:col-span-2 space-y-4">
          {activeProgram ? (
            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
              
              {/* Tab Header Detail */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3.5 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-primary/25 font-mono">
                      {activeProgram.programCode}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {activeProgram.degree} &middot; {activeProgram.duration} Years
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-display text-foreground mt-1">
                    {activeProgram.programName}
                  </h3>
                </div>

                {/* Tab selector */}
                <div className="flex rounded-xl bg-muted/40 p-1 border font-semibold">
                  <button
                    onClick={() => setActiveTab("curriculum")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activeTab === "curriculum" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Curriculum
                  </button>
                  <button
                    onClick={() => setActiveTab("timeline")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activeTab === "timeline" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Revision Timeline
                  </button>
                  <button
                    onClick={() => setActiveTab("flow")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activeTab === "flow" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Roadmap Flow
                  </button>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activeTab === "analytics" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Analytics
                  </button>
                </div>
              </div>

              {/* TAB 1: Expandable Semesters Accordion */}
              {activeTab === "curriculum" && (
                <div className="space-y-4">
                  {activeProgramCurriculum.length === 0 ? (
                    <div className="text-center py-10 space-y-3">
                      <Layers className="size-8 text-muted-foreground/60 mx-auto" />
                      <p className="font-bold text-foreground">No Curriculum Baseline configured yet.</p>
                      <Button onClick={handleOpenCurriculumModal} size="sm" className="bg-brand-gradient">
                        Create Curriculum
                      </Button>
                    </div>
                  ) : (
                    <Accordion type="single" collapsible defaultValue="curr-1-1" className="space-y-3">
                      {activeProgramCurriculum.map((curr) => (
                        <AccordionItem
                          key={curr.id}
                          value={curr.id}
                          className="border rounded-xl px-4 py-1.5 bg-muted/10 hover:bg-muted/15 transition-colors"
                        >
                          <AccordionTrigger className="hover:no-underline font-bold text-foreground text-xs py-3.5">
                            <div className="flex justify-between items-center w-full pr-4">
                              <span>{curr.semester}</span>
                              <span className="font-mono text-[10px] text-primary">{curr.credits} Semester Credits</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-4 border-t divide-y divide-border/60">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-[11px] font-medium text-foreground mt-2">
                                <thead>
                                  <tr className="text-muted-foreground font-semibold">
                                    <th className="py-2">Code</th>
                                    <th className="py-2">Subject Name</th>
                                    <th className="py-2">Credits</th>
                                    <th className="py-2">L-T-P</th>
                                    <th className="py-2">Type</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {curr.subjects.map((sub, idx) => (
                                    <tr key={idx} className="border-t border-border/40">
                                      <td className="py-2.5 font-mono font-bold">{sub.code}</td>
                                      <td className="py-2.5 font-semibold">{sub.name}</td>
                                      <td className="py-2.5 font-mono text-primary font-bold">{sub.credits}</td>
                                      <td className="py-2.5 font-mono">{sub.theoryHours}-0-{sub.labHours}</td>
                                      <td className="py-2.5">
                                        <Badge variant="outline" className="text-[9px] py-0">
                                          {sub.subjectType}
                                        </Badge>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="pt-3 flex justify-end">
                              <Button
                                size="sm"
                                onClick={() => handleOpenAddSubject(curr.semester)}
                                className="h-8 gap-1 font-semibold"
                              >
                                <Plus className="size-3.5" /> Add Course Subject
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              )}

              {/* TAB 2: Revision Timeline */}
              {activeTab === "timeline" && (
                <div className="space-y-4">
                  <div className="relative border-l-2 pl-6 ml-3 space-y-6">
                    {MOCK_REVISIONS.map((rev) => (
                      <div key={rev.id} className="relative space-y-1">
                        <span className="absolute -left-[31px] top-1 size-3 rounded-full bg-primary border-4 border-card" />
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="font-mono text-[9px] uppercase tracking-wide bg-primary/10 text-primary border-primary/20">
                            {rev.version}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-mono">Commissioned: {rev.effectiveDate}</span>
                          <Badge variant="outline" className="text-[9px] py-0 font-medium">
                            {rev.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="font-bold text-foreground text-xs mt-1">Year: {rev.academicYear}</p>
                        <p className="text-muted-foreground leading-relaxed text-[11px] font-medium bg-muted/20 p-3 rounded-xl border">
                          {rev.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Visual Roadmap Prerequisites flow */}
              {activeTab === "flow" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((semNum) => (
                      <div key={semNum} className="p-3 border rounded-xl bg-muted/20 flex flex-col justify-between h-24 relative overflow-hidden">
                        <span className="text-[10px] font-mono text-primary font-bold uppercase">Sem {semNum}</span>
                        <div className="space-y-0.5">
                          <p className="font-bold text-foreground text-[10px]">CS{semNum}01 Core Course</p>
                          <p className="text-[9px] text-muted-foreground font-mono">20 Credits Baseline</p>
                        </div>
                        {semNum < 8 && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground/30 pointer-events-none">
                            <ArrowRight className="size-4 shrink-0" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-warning/10 border border-warning/20 text-warning rounded-xl flex gap-2">
                    <AlertTriangle className="size-4 shrink-0 text-warning" />
                    <p className="text-[10px] leading-relaxed">
                      **Prerequisites mapping:** Advanced subjects verify prerequisite hashes (e.g. CS801 Cryptography requires discrete mathematics CS302 checks).
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: Analytics charts */}
              {activeTab === "analytics" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Credits per Semester */}
                  <div className="space-y-3 p-4 rounded-xl border border-border/60 bg-muted/10">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                      <span>Credits per Semester</span>
                      <span className="text-[10px] text-primary lowercase font-mono">Semester breakdown</span>
                    </h4>
                    {semCreditsChartData.length > 0 ? (
                      <GroupedBarChart
                        data={semCreditsChartData as any}
                        xKey="name"
                        series={[{ key: "Credits", label: "Credits" }]}
                        height={160}
                      />
                    ) : (
                      <p className="text-center italic text-muted-foreground py-10">No data compiled.</p>
                    )}
                  </div>

                  {/* Core vs Electives */}
                  <div className="space-y-3 p-4 rounded-xl border border-border/60 bg-muted/10">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                      <span>Core vs Electives</span>
                      <span className="text-[10px] text-success font-mono">Categories distribution</span>
                    </h4>
                    <DonutChart data={coreVsElectiveData} centerLabel="Subjects" height={160} />
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-20 border rounded-2xl bg-card border-dashed">
              <Compass className="size-10 text-muted-foreground/60 mx-auto animate-pulse" />
              <p className="font-bold mt-2 text-foreground">Select a program to configure curriculum parameters.</p>
            </div>
          )}
        </div>

      </div>

      {/* 4. CREDIT DISTRIBUTION SECTION */}
      <Panel
        title="Institutional Credit Distribution Metrics"
        description="Standard credit allocation guidelines across core categories (theory, labs, projects, internships, electives)."
      >
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 font-mono text-center">
          <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
            <span className="text-[10px] font-sans text-muted-foreground">Theory Credits</span>
            <p className="text-lg font-bold text-primary mt-0.5">{MOCK_CREDITS_DISTRIBUTION.theory}</p>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
              <div className="h-full bg-primary" style={{ width: "45%" }} />
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
            <span className="text-[10px] font-sans text-muted-foreground">Laboratory Labs</span>
            <p className="text-lg font-bold text-emerald-600 mt-0.5">{MOCK_CREDITS_DISTRIBUTION.lab}</p>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
              <div className="h-full bg-emerald-500" style={{ width: "20%" }} />
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
            <span className="text-[10px] font-sans text-muted-foreground">Project Work</span>
            <p className="text-lg font-bold text-indigo-500 mt-0.5">{MOCK_CREDITS_DISTRIBUTION.project}</p>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
              <div className="h-full bg-indigo-500" style={{ width: "15%" }} />
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
            <span className="text-[10px] font-sans text-muted-foreground">Internships</span>
            <p className="text-lg font-bold text-orange-500 mt-0.5">{MOCK_CREDITS_DISTRIBUTION.internship}</p>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
              <div className="h-full bg-orange-500" style={{ width: "5%" }} />
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
            <span className="text-[10px] font-sans text-muted-foreground">Elective options</span>
            <p className="text-lg font-bold text-amber-500 mt-0.5">{MOCK_CREDITS_DISTRIBUTION.elective}</p>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
              <div className="h-full bg-amber-500" style={{ width: "15%" }} />
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
            <span className="text-[10px] font-sans text-muted-foreground">Total credits</span>
            <p className="text-lg font-bold text-foreground mt-0.5">{MOCK_CREDITS_DISTRIBUTION.total}</p>
            <Badge className="bg-primary/10 text-primary border-primary/25 text-[8px] tracking-wide mt-1">
              100% TARGET
            </Badge>
          </div>
        </div>
      </Panel>

      {/* 5. ADD PROGRAM MODAL */}
      <Dialog open={isProgramModalOpen} onOpenChange={setIsProgramModalOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display">
              {programFormMode === "add" ? "Create Academic Program" : "Modify Program Configuration"}
            </DialogTitle>
            <DialogDescription>
              Detail program degree levels, total curriculum credits, academic year, and regulation mapping.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProgram} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <Label htmlFor="prog-name">Program Name*</Label>
                <Input
                  id="prog-name"
                  value={currentProgramForm.programName || ""}
                  onChange={(e) => setCurrentProgramForm((prev: any) => ({ ...prev, programName: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="prog-code">Program Code*</Label>
                <Input
                  id="prog-code"
                  value={currentProgramForm.programCode || ""}
                  onChange={(e) => setCurrentProgramForm((prev: any) => ({ ...prev, programCode: e.target.value }))}
                  required
                  disabled={programFormMode === "edit"}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="prog-degree">Degree Type</Label>
                <Select
                  value={currentProgramForm.degree || "B.Tech"}
                  onValueChange={(val: any) => setCurrentProgramForm((prev: any) => ({ ...prev, degree: val }))}
                >
                  <SelectTrigger id="prog-degree">
                    <SelectValue placeholder="Degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B.Tech">Bachelor of Technology</SelectItem>
                    <SelectItem value="M.Tech">Master of Technology</SelectItem>
                    <SelectItem value="MBA">MBA Program</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="prog-dept">Department*</Label>
                <Input
                  id="prog-dept"
                  value={currentProgramForm.department || "CSE"}
                  onChange={(e) => setCurrentProgramForm((prev: any) => ({ ...prev, department: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="prog-duration">Duration (Years)</Label>
                <Input
                  id="prog-duration"
                  type="number"
                  value={currentProgramForm.duration || 4}
                  onChange={(e) => setCurrentProgramForm((prev: any) => ({ ...prev, duration: parseInt(e.target.value) || 4 }))}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="prog-credits">Total Credits*</Label>
                <Input
                  id="prog-credits"
                  type="number"
                  value={currentProgramForm.credits || 160}
                  onChange={(e) => setCurrentProgramForm((prev: any) => ({ ...prev, credits: parseInt(e.target.value) || 160 }))}
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsProgramModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-brand-gradient text-white font-semibold">Save Program</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. CREATE CURRICULUM MODAL */}
      <Dialog open={isCurriculumModalOpen} onOpenChange={setIsCurriculumModalOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display">Create Curriculum Baseline</DialogTitle>
            <DialogDescription>
              Create semester mapping arrays, regulation codes, and baseline structures.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveCurriculum} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1 col-span-2">
                <Label htmlFor="curr-prog">Select Program*</Label>
                <Select
                  value={currentCurriculumForm.programId || "prog-1"}
                  onValueChange={(val: any) => setCurrentCurriculumForm((prev: any) => ({ ...prev, programId: val }))}
                >
                  <SelectTrigger id="curr-prog">
                    <SelectValue placeholder="Select Program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programsList.map((prog) => (
                      <SelectItem key={prog.id} value={prog.id}>
                        {prog.programName} ({prog.regulationName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="curr-reg">Regulation*</Label>
                <Select
                  value={currentCurriculumForm.regulation || "R25"}
                  onValueChange={(val: any) => setCurrentCurriculumForm((prev: any) => ({ ...prev, regulation: val }))}
                >
                  <SelectTrigger id="curr-reg">
                    <SelectValue placeholder="Regulation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="R26">R26 Draft</SelectItem>
                    <SelectItem value="R25">R25 Active</SelectItem>
                    <SelectItem value="R22">R22 Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="curr-semcount">Semester Count*</Label>
                <Input
                  id="curr-semcount"
                  type="number"
                  value={currentCurriculumForm.semesterCount || 8}
                  onChange={(e) => setCurrentCurriculumForm((prev: any) => ({ ...prev, semesterCount: parseInt(e.target.value) || 8 }))}
                  required
                />
              </div>

              <div className="space-y-1 col-span-2">
                <Label htmlFor="curr-desc">Curriculum Description</Label>
                <Textarea
                  id="curr-desc"
                  value={currentCurriculumForm.description || ""}
                  onChange={(e) => setCurrentCurriculumForm((prev: any) => ({ ...prev, description: e.target.value }))}
                  className="min-h-[70px] text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCurriculumModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-brand-gradient text-white font-semibold">Generate Curriculum</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 7. ADD SUBJECT TO SEMESTER MODAL */}
      <Dialog open={isAddSubjectModalOpen} onOpenChange={setIsAddSubjectModalOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display">Add Subject to {addSubjectSemName}</DialogTitle>
            <DialogDescription>
              Detail subject code, syllabus credits, and weekly hours configuration.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveSubjectToSemester} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <Label htmlFor="sub-name">Subject Name*</Label>
                <Input
                  id="sub-name"
                  value={subjectForm.name || ""}
                  onChange={(e) => setSubjectForm((prev: any) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="sub-code">Subject Code* (e.g. CS504)</Label>
                <Input
                  id="sub-code"
                  value={subjectForm.code || ""}
                  onChange={(e) => setSubjectForm((prev: any) => ({ ...prev, code: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="sub-credits">Credits*</Label>
                <Input
                  id="sub-credits"
                  type="number"
                  step="0.5"
                  value={subjectForm.credits || 3}
                  onChange={(e) => setSubjectForm((prev: any) => ({ ...prev, credits: parseFloat(e.target.value) || 3 }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="sub-type">Subject Type*</Label>
                <Select
                  value={subjectForm.subjectType || "Core"}
                  onValueChange={(val: any) => setSubjectForm((prev: any) => ({ ...prev, subjectType: val }))}
                >
                  <SelectTrigger id="sub-type">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Core">Core Lecture</SelectItem>
                    <SelectItem value="Elective">Elective Option</SelectItem>
                    <SelectItem value="Laboratory">Practical Lab</SelectItem>
                    <SelectItem value="Project">Project/Seminar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="sub-theory">Theory Hours (Weekly)</Label>
                <Input
                  id="sub-theory"
                  type="number"
                  value={subjectForm.theoryHours || 3}
                  onChange={(e) => setSubjectForm((prev: any) => ({ ...prev, theoryHours: parseInt(e.target.value) || 3 }))}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="sub-lab">Laboratory Hours (Weekly)</Label>
                <Input
                  id="sub-lab"
                  type="number"
                  value={subjectForm.labHours || 0}
                  onChange={(e) => setSubjectForm((prev: any) => ({ ...prev, labHours: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddSubjectModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-brand-gradient text-white font-semibold">Add Subject</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
