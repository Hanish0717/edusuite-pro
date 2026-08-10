import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  Building2,
  Users,
  GraduationCap,
  Layers,
  Award,
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
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
  BookmarkCheck,
  UserCheck,
  Briefcase,
  Sliders,
  Settings,
  HelpCircle,
  ArrowRight
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
import { DonutChart, TrendAreaChart, GroupedBarChart } from "@/components/dashboard/charts";

import {
  MOCK_SUBJECTS,
  MOCK_PROGRAMS,
  MOCK_REGULATIONS,
  MOCK_SEMESTERS,
  MOCK_FACULTY_POOL_FOR_ASSIGN,
  type Subject
} from "@/data/subject-management-mock";

export function SubjectManagement() {
  // Simulated Loading/Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjectsList, setSubjectsList] = useState<Subject[]>(MOCK_SUBJECTS);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [regulationFilter, setRegulationFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [creditsFilter, setCreditsFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Selection states for Modals
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [currentFormSubject, setCurrentFormSubject] = useState<any>({});

  // Faculty Assignment state
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [selectedPrimaryFaculty, setSelectedPrimaryFaculty] = useState<string>("");
  const [selectedSecondaryFaculty, setSelectedSecondaryFaculty] = useState<string>("");
  const [assignmentDate, setAssignmentDate] = useState<string>("");
  const [facultySearch, setFacultySearch] = useState("");

  // Edit Course Outcomes state
  const [isCOEditing, setIsCOEditing] = useState(false);
  const [tempCOs, setTempCOs] = useState<string[]>([]);

  // Validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Metrics computation
  const metrics = useMemo(() => {
    const total = subjectsList.length;
    const core = subjectsList.filter((s) => s.subjectType === "Core").length;
    const elective = subjectsList.filter((s) => s.subjectType === "Elective").length;
    const active = subjectsList.filter((s) => s.status === "active").length;
    const noFaculty = subjectsList.filter((s) => s.facultyName === "Vacant" || !s.facultyName).length;
    // Assume semester 5 is active current semester
    const offeredThisSem = subjectsList.filter((s) => s.semester === "Semester 5").length;

    return { total, core, elective, active, noFaculty, offeredThisSem };
  }, [subjectsList]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setDeptFilter("all");
    setProgramFilter("all");
    setRegulationFilter("all");
    setSemesterFilter("all");
    setTypeFilter("all");
    setCreditsFilter("all");
    setStatusFilter("all");
    setSortBy("name");
    toast.success("Filters reset successfully");
  };

  // Filter & Sort subjects
  const filteredSubjects = useMemo(() => {
    return subjectsList
      .filter((sub) => {
        const matchesSearch =
          sub.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.facultyName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = deptFilter === "all" || sub.department === deptFilter;
        const matchesProgram = programFilter === "all" || sub.program === programFilter;
        const matchesReg = regulationFilter === "all" || sub.regulation === regulationFilter;
        const matchesSem = semesterFilter === "all" || sub.semester === semesterFilter;
        const matchesType = typeFilter === "all" || sub.subjectType === typeFilter;
        const matchesCredits =
          creditsFilter === "all" || sub.credits === parseInt(creditsFilter);
        const matchesStatus = statusFilter === "all" || sub.status === statusFilter;

        return matchesSearch && matchesDept && matchesProgram && matchesReg && matchesSem && matchesType && matchesCredits && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.subjectName.localeCompare(b.subjectName);
        if (sortBy === "code") return a.subjectCode.localeCompare(b.subjectCode);
        if (sortBy === "semester") return a.semester.localeCompare(b.semester);
        if (sortBy === "credits") return b.credits - a.credits;
        if (sortBy === "recentlyAdded") return b.createdAt.localeCompare(a.createdAt);
        return 0;
      });
  }, [subjectsList, searchTerm, deptFilter, programFilter, regulationFilter, semesterFilter, typeFilter, creditsFilter, statusFilter, sortBy]);

  // Active Subject Detail Selector
  const activeSubject = useMemo(() => {
    if (!selectedSubjectId) return null;
    return subjectsList.find((s) => s.id === selectedSubjectId) || null;
  }, [subjectsList, selectedSubjectId]);

  // Trigger reloading simulation
  const triggerReload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 700);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Subject Code", "Name", "Department", "Program", "Semester", "Credits", "Type", "Primary Faculty", "Status"];
    const rows = filteredSubjects.map((s) => [
      s.subjectCode,
      s.subjectName,
      s.department,
      s.program,
      s.semester,
      s.credits,
      s.subjectType,
      s.facultyName,
      s.status
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subjects_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${rows.length} subject records to CSV!`);
  };

  // Add / Edit Handlers
  const handleOpenAddModal = () => {
    setFormMode("add");
    setCurrentFormSubject({
      subjectCode: "",
      subjectName: "",
      description: "",
      department: "CSE",
      program: "B.Tech",
      regulation: "R25",
      semester: "Semester 5",
      credits: 3,
      theoryHours: 3,
      labHours: 0,
      subjectType: "Core",
      facultyId: "Vacant",
      facultyName: "Vacant",
      courseOutcomes: [
        "CO1: Recall core terminology and basic models.",
        "CO2: Illustrate mathematical or logical concepts.",
        "CO3: Apply computational or design models to standard tasks.",
        "CO4: Analyze complex loops, systems, or parameters.",
        "CO5: Evaluate tradeoffs across alternative architectures.",
        "CO6: Formulate solutions for advanced integrated domains."
      ],
      prerequisites: [],
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (sub: Subject) => {
    setFormMode("edit");
    setCurrentFormSubject(sub);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!currentFormSubject.subjectName?.trim()) errors["subjectName"] = "Subject Name is required.";
    if (!currentFormSubject.subjectCode?.trim()) errors["subjectCode"] = "Subject Code is required.";
    if (!currentFormSubject.description?.trim()) errors["description"] = "Description is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please resolve validation errors first.");
      return;
    }

    if (formMode === "add") {
      const newSub: Subject = {
        ...(currentFormSubject as Subject),
        id: `sub-${currentFormSubject.subjectCode?.toLowerCase()}-${Date.now()}`
      };
      setSubjectsList((prev) => [...prev, newSub]);
      toast.success(`Created Course Subject: ${newSub.subjectName}`);
    } else {
      setSubjectsList((prev) =>
        prev.map((s) => (s.id === currentFormSubject.id ? ({ ...s, ...currentFormSubject, updatedAt: new Date().toISOString().split("T")[0] || "" } as Subject) : s))
      );
      toast.success(`Updated Subject Profile: ${currentFormSubject.subjectName}`);
    }

    setIsFormModalOpen(false);
  };

  // Faculty Assignment Handlers
  const handleOpenFacultyModal = (sub: Subject) => {
    setSelectedSubjectId(sub.id);
    setSelectedPrimaryFaculty(sub.facultyId || "");
    setSelectedSecondaryFaculty(sub.alternateFacultyId || "none");
    setAssignmentDate(new Date().toISOString().split("T")[0] || "");
    setFacultySearch("");
    setIsFacultyModalOpen(true);
  };

  const handleSaveFacultyAssignment = () => {
    if (!selectedSubjectId) return;

    if (selectedPrimaryFaculty === selectedSecondaryFaculty && selectedPrimaryFaculty !== "Vacant" && selectedPrimaryFaculty) {
      toast.error("Primary and Alternate Faculty cannot be the same person.");
      return;
    }

    const primaryFac = MOCK_FACULTY_POOL_FOR_ASSIGN.find((f) => f.id === selectedPrimaryFaculty);
    const secondaryFac = MOCK_FACULTY_POOL_FOR_ASSIGN.find((f) => f.id === selectedSecondaryFaculty);

    setSubjectsList((prev) =>
      prev.map((s) =>
        s.id === selectedSubjectId
          ? ({
              ...s,
              facultyId: selectedPrimaryFaculty || "Vacant",
              facultyName: primaryFac ? primaryFac.name : "Vacant",
              alternateFacultyId: selectedSecondaryFaculty === "none" ? undefined : selectedSecondaryFaculty,
              alternateFacultyName: secondaryFac ? secondaryFac.name : undefined,
              updatedAt: new Date().toISOString().split("T")[0] || ""
            } as any as Subject)
          : s
      )
    );

    toast.success(`Faculty allocations updated successfully!`);
    setIsFacultyModalOpen(false);
  };

  // Archive Subject
  const handleArchiveSubject = (id: string, name: string) => {
    setSubjectsList((prev) => prev.map((s) => (s.id === id ? { ...s, status: "inactive" as const } : s)));
    toast.warning(`Archived Subject: ${name} (marked as inactive)`);
  };

  // Course Outcomes edit helpers
  const handleStartCOEditing = () => {
    if (!activeSubject) return;
    setTempCOs([...activeSubject.courseOutcomes]);
    setIsCOEditing(true);
  };

  const handleSaveCOs = () => {
    if (!selectedSubjectId) return;
    setSubjectsList((prev) =>
      prev.map((s) => (s.id === selectedSubjectId ? { ...s, courseOutcomes: tempCOs } : s))
    );
    toast.success("Course Outcomes updated successfully!");
    setIsCOEditing(false);
  };

  // Filtered faculty pool for assignment dialog
  const filteredFacultyPool = useMemo(() => {
    return MOCK_FACULTY_POOL_FOR_ASSIGN.filter((f) =>
      f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.department.toLowerCase().includes(facultySearch.toLowerCase())
    );
  }, [facultySearch]);

  // Analytics datasets
  const deptDistData = useMemo(() => {
    const depts = ["CSE", "ECE", "EEE", "ME", "Civil", "MBA", "H&S"];
    return depts.map((d) => ({
      name: d,
      value: subjectsList.filter((s) => s.department === d).length
    }));
  }, [subjectsList]);

  const typeDistData = useMemo(() => {
    const types = ["Core", "Elective", "Laboratory"];
    return types.map((t) => ({
      label: t,
      value: subjectsList.filter((s) => s.subjectType === t).length
    }));
  }, [subjectsList]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <BookOpen className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Subject Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Curriculum Registry Portal
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Manage all academic subjects, faculty allocation, semester mapping, and curriculum.
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
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
            onClick={handleExportCSV}
            className="h-9 gap-1.5 font-semibold text-xs"
          >
            <Download className="size-3.5" /> Export Subjects
          </Button>
          <Button
            onClick={handleOpenAddModal}
            className="h-9 bg-brand-gradient text-white gap-1.5 font-semibold text-xs shadow-glow hover:opacity-95 cursor-pointer"
          >
            <Plus className="size-4" /> Add Subject
          </Button>
        </div>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-6">
        <KpiCard label="Total Subjects" value={String(metrics.total)} icon={BookOpen} tone="primary" />
        <KpiCard label="Core Subjects" value={String(metrics.core)} icon={Layers} tone="info" />
        <KpiCard label="Electives" value={String(metrics.elective)} icon={Award} tone="warning" />
        <KpiCard label="Active Subjects" value={String(metrics.active)} icon={CheckCircle} tone="success" />
        <KpiCard
          label="Unassigned"
          value={String(metrics.noFaculty)}
          icon={AlertTriangle}
          tone={metrics.noFaculty > 0 ? "warning" : "success"}
          delta={metrics.noFaculty > 0 ? "Needs Faculty Appt" : "All staffed"}
          trend={metrics.noFaculty > 0 ? "down" : "up"}
        />
        <KpiCard label="Active This Sem" value={String(metrics.offeredThisSem)} icon={Calendar} tone="primary" />
      </div>

      {/* 3. SEARCH & FILTERS TOOLBAR */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3.5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          
          {/* Search bar */}
          <div className="relative col-span-1 sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search subject code, name, faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Department Filter */}
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="ECE">ECE</SelectItem>
              <SelectItem value="EEE">EEE</SelectItem>
              <SelectItem value="ME">ME</SelectItem>
              <SelectItem value="Civil">Civil</SelectItem>
              <SelectItem value="MBA">MBA</SelectItem>
              <SelectItem value="H&S">H&S</SelectItem>
            </SelectContent>
          </Select>

          {/* Program Filter */}
          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {MOCK_PROGRAMS.map((prog) => (
                <SelectItem key={prog} value={prog}>
                  {prog}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Regulation */}
          <Select value={regulationFilter} onValueChange={setRegulationFilter}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Regulation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regulations</SelectItem>
              {MOCK_REGULATIONS.map((reg) => (
                <SelectItem key={reg} value={reg}>
                  {reg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Semester */}
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {MOCK_SEMESTERS.map((sem) => (
                <SelectItem key={sem} value={sem}>
                  {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Subject Type */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Subject Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Core">Core Lecture</SelectItem>
              <SelectItem value="Elective">Elective Option</SelectItem>
              <SelectItem value="Laboratory">Practical Lab</SelectItem>
            </SelectContent>
          </Select>

        </div>

        <div className="flex items-center justify-between border-t pt-3 flex-wrap gap-2">
          {/* Sorting */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-mono">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 w-[150px] text-xs">
                <SelectValue placeholder="Sort Parameters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Subject Name</SelectItem>
                <SelectItem value="code">Subject Code</SelectItem>
                <SelectItem value="semester">Semester</SelectItem>
                <SelectItem value="credits">Credits</SelectItem>
                <SelectItem value="recentlyAdded">Recently Added</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleResetFilters}
            variant="outline"
            size="sm"
            className="h-8 font-semibold"
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* 4. SUBJECT DATA TABLE */}
      {filteredSubjects.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 bg-card p-6 text-center space-y-3">
          <BookOpen className="size-10 text-muted-foreground/60 animate-pulse" />
          <h3 className="text-base font-bold text-foreground font-display">No Subjects Available</h3>
          <p className="max-w-xs text-xs text-muted-foreground">
            Clear your filtering conditions or register a new subject entry in the curriculum.
          </p>
          <Button onClick={handleOpenAddModal} size="sm" className="bg-brand-gradient text-white font-semibold">
            Add Subject
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Subject Code</th>
                  <th className="py-3 px-3">Subject Name</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Program</th>
                  <th className="py-3 px-3">Semester</th>
                  <th className="py-3 px-3">Credits</th>
                  <th className="py-3 px-3">Subject Type</th>
                  <th className="py-3 px-3">Assigned Faculty</th>
                  <th className="py-3 px-3">Weekly Hours</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredSubjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{sub.subjectCode}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{sub.subjectName}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{sub.department}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{sub.program} ({sub.regulation})</td>
                    <td className="py-3 px-3 font-medium text-foreground">{sub.semester}</td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">{sub.credits} Credits</td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="text-[9px] bg-muted/30">
                        {sub.subjectType}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-medium text-foreground">
                      {sub.facultyName === "Vacant" ? (
                        <span className="text-red-500 font-bold text-[10px]">Vacant</span>
                      ) : (
                        sub.facultyName
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-foreground">
                      {sub.theoryHours + sub.labHours} hrs/wk
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant="outline"
                        className={
                          sub.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {sub.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedSubjectId(sub.id);
                            setIsDetailsOpen(true);
                          }}
                          className="h-7 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="size-3.5" /> View
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditModal(sub)}
                          className="size-7 text-muted-foreground hover:text-primary"
                          title="Edit Profile"
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenFacultyModal(sub)}
                          className="size-7 text-muted-foreground hover:text-info"
                          title="Assign Faculty"
                        >
                          <UserCheck className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleArchiveSubject(sub.id, sub.subjectName)}
                          className="size-7 text-muted-foreground hover:text-red-600"
                          title="Archive Subject"
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

      {/* 5. SUBJECT DETAILS DRAWER/DIALOG */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl text-xs leading-normal">
          {activeSubject && (
            <>
              <DialogHeader className="border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 font-mono font-bold text-sm">
                    {activeSubject.subjectCode}
                  </div>
                  <div>
                    <DialogTitle className="text-base font-bold font-display text-foreground flex items-center gap-2">
                      {activeSubject.subjectName}
                    </DialogTitle>
                    <p className="text-[10px] text-muted-foreground font-medium font-mono">
                      {activeSubject.program} &middot; {activeSubject.regulation} Regulation &middot; {activeSubject.semester}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 overflow-y-auto max-h-[50vh] pr-1">
                
                {/* Basic Information */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wider font-mono border-b pb-1">
                    Basic Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-muted-foreground font-mono">Department / Division:</span>
                      <p className="font-bold text-foreground text-xs mt-0.5">{activeSubject.department}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">Curriculum Syllabus Description:</span>
                      <p className="text-foreground leading-relaxed bg-muted/20 p-3 rounded-xl border mt-1">
                        {activeSubject.description}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <span className="text-muted-foreground font-mono">Syllabus Credits:</span>
                        <p className="font-bold text-primary mt-0.5">{activeSubject.credits} Credits</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-mono">Weekly Hours:</span>
                        <p className="font-bold text-foreground mt-0.5">{activeSubject.theoryHours}h Lecture &middot; {activeSubject.labHours}h Lab</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Staff Assignment & Prerequisites */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wider font-mono border-b pb-1">
                      Faculty Assignments
                    </h4>
                    <div className="space-y-1.5 font-medium">
                      <p className="flex justify-between items-center bg-muted/20 p-2 border rounded-xl">
                        <span>Primary Faculty Lecturer:</span>
                        <span className="font-bold text-primary">{activeSubject.facultyName}</span>
                      </p>
                      {activeSubject.alternateFacultyName && (
                        <p className="flex justify-between items-center bg-muted/20 p-2 border rounded-xl">
                          <span>Alternate Faculty:</span>
                          <span className="font-bold text-foreground">{activeSubject.alternateFacultyName}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wider font-mono border-b pb-1">
                      Syllabus Prerequisites
                    </h4>
                    {activeSubject.prerequisites.length === 0 ? (
                      <p className="italic text-muted-foreground">No prerequisites required.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {activeSubject.prerequisites.map((prereq, idx) => (
                          <Badge key={idx} variant="outline" className="text-[9px] bg-muted/40 font-mono">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Outcomes (CO1 to CO6) */}
                <div className="col-span-1 md:col-span-2 space-y-3">
                  <div className="flex items-center justify-between border-b pb-1">
                    <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wider font-mono">
                      Course Outcomes (CO1 - CO6)
                    </h4>
                    {!isCOEditing ? (
                      <Button variant="ghost" size="sm" onClick={handleStartCOEditing} className="text-primary h-6 font-semibold">
                        Edit Outcomes
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Button variant="ghost" size="sm" onClick={() => setIsCOEditing(false)} className="h-6 font-semibold">
                          Cancel
                        </Button>
                        <Button variant="default" onClick={handleSaveCOs} className="bg-primary text-white h-6 font-semibold">
                          Save
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {!isCOEditing ? (
                      activeSubject.courseOutcomes.map((co, idx) => (
                        <p key={idx} className="p-2 bg-muted/20 rounded-xl border border-border/80 text-foreground font-medium">
                          {co}
                        </p>
                      ))
                    ) : (
                      tempCOs.map((co, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <span className="font-mono font-bold text-primary shrink-0">CO{idx+1}:</span>
                          <Input
                            value={co.replace(`CO${idx+1}: `, "")}
                            onChange={(e) => {
                              const updated = [...tempCOs];
                              updated[idx] = `CO${idx+1}: ${e.target.value}`;
                              setTempCOs(updated);
                            }}
                            className="h-8 text-xs"
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              <DialogFooter className="border-t pt-3">
                <Button onClick={() => setIsDetailsOpen(false)}>Close Course Profile</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 6. ADD / EDIT SUBJECT MODAL */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="max-w-lg text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display">
              {formMode === "add" ? "Register Curriculum Course" : "Modify Course Syllabus"}
            </DialogTitle>
            <DialogDescription>
              Detail subject codes, academic semesters, catalog credits, and syllabus parameters.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <Label htmlFor="sub-name">Subject Name*</Label>
                <Input
                  id="sub-name"
                  value={currentFormSubject.subjectName || ""}
                  onChange={(e) => setCurrentFormSubject((prev: any) => ({ ...prev, subjectName: e.target.value }))}
                  required
                />
                {formErrors["subjectName"] && (
                  <p className="text-[10px] text-destructive font-semibold">{formErrors["subjectName"]}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="sub-code">Subject Code* (e.g. CS801)</Label>
                <Input
                  id="sub-code"
                  value={currentFormSubject.subjectCode || ""}
                  onChange={(e) => setCurrentFormSubject((prev: any) => ({ ...prev, subjectCode: e.target.value }))}
                  required
                  disabled={formMode === "edit"}
                />
                {formErrors["subjectCode"] && (
                  <p className="text-[10px] text-destructive font-semibold">{formErrors["subjectCode"]}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="sub-dept">Academic Department*</Label>
                <Select
                  value={currentFormSubject.department || "CSE"}
                  onValueChange={(val: any) => setCurrentFormSubject((prev: any) => ({ ...prev, department: val }))}
                >
                  <SelectTrigger id="sub-dept">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="EEE">EEE</SelectItem>
                    <SelectItem value="ME">ME</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                    <SelectItem value="MBA">MBA</SelectItem>
                    <SelectItem value="H&S">H&S</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="sub-prog">Program Major*</Label>
                <Select
                  value={currentFormSubject.program || "B.Tech"}
                  onValueChange={(val: any) => setCurrentFormSubject((prev: any) => ({ ...prev, program: val }))}
                >
                  <SelectTrigger id="sub-prog">
                    <SelectValue placeholder="Program" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_PROGRAMS.map((prog) => (
                      <SelectItem key={prog} value={prog}>
                        {prog}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="sub-reg">Regulation*</Label>
                <Select
                  value={currentFormSubject.regulation || "R25"}
                  onValueChange={(val: any) => setCurrentFormSubject((prev: any) => ({ ...prev, regulation: val }))}
                >
                  <SelectTrigger id="sub-reg">
                    <SelectValue placeholder="Regulation" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_REGULATIONS.map((reg) => (
                      <SelectItem key={reg} value={reg}>
                        {reg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="sub-sem">Syllabus Semester*</Label>
                <Select
                  value={currentFormSubject.semester || "Semester 5"}
                  onValueChange={(val: any) => setCurrentFormSubject((prev: any) => ({ ...prev, semester: val }))}
                >
                  <SelectTrigger id="sub-sem">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_SEMESTERS.map((sem) => (
                      <SelectItem key={sem} value={sem}>
                        {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="sub-credits">Syllabus Credits*</Label>
                <Input
                  id="sub-credits"
                  type="number"
                  value={currentFormSubject.credits || 3}
                  onChange={(e) => setCurrentFormSubject((prev: any) => ({ ...prev, credits: parseInt(e.target.value) || 3 }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="sub-type">Subject Type*</Label>
                <Select
                  value={currentFormSubject.subjectType || "Core"}
                  onValueChange={(val: any) => setCurrentFormSubject((prev: any) => ({ ...prev, subjectType: val }))}
                >
                  <SelectTrigger id="sub-type">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Core">Core Lecture</SelectItem>
                    <SelectItem value="Elective">Elective Option</SelectItem>
                    <SelectItem value="Laboratory">Practical Lab</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="sub-theory">Theory Hours (Weekly)</Label>
                <Input
                  id="sub-theory"
                  type="number"
                  value={currentFormSubject.theoryHours || 3}
                  onChange={(e) => setCurrentFormSubject((prev: any) => ({ ...prev, theoryHours: parseInt(e.target.value) || 3 }))}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="sub-lab">Laboratory Hours (Weekly)</Label>
                <Input
                  id="sub-lab"
                  type="number"
                  value={currentFormSubject.labHours || 0}
                  onChange={(e) => setCurrentFormSubject((prev: any) => ({ ...prev, labHours: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-1 col-span-2">
                <Label htmlFor="sub-desc">Subject Description*</Label>
                <Textarea
                  id="sub-desc"
                  value={currentFormSubject.description || ""}
                  onChange={(e) => setCurrentFormSubject((prev: any) => ({ ...prev, description: e.target.value }))}
                  className="min-h-[70px] text-xs"
                  required
                />
                {formErrors["description"] && (
                  <p className="text-[10px] text-destructive font-semibold">{formErrors["description"]}</p>
                )}
              </div>

              <div className="space-y-1 col-span-2">
                <Label htmlFor="sub-status">Status</Label>
                <Select
                  value={currentFormSubject.status || "active"}
                  onValueChange={(val: any) => setCurrentFormSubject((prev: any) => ({ ...prev, status: val }))}
                >
                  <SelectTrigger id="sub-status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsFormModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient text-white font-semibold">
                {formMode === "add" ? "Save Subject" : "Update Subject"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 7. FACULTY ASSIGNMENT MODAL */}
      <Dialog open={isFacultyModalOpen} onOpenChange={setIsFacultyModalOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display">Assign Faculty Appointee</DialogTitle>
            <DialogDescription>
              Select primary lecturing professors and alternate instructors for this course.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            
            {/* Faculty Search */}
            <div className="space-y-1.5">
              <Label>Search Faculty Pool</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search faculty name or dept..."
                  value={facultySearch}
                  onChange={(e) => setFacultySearch(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
            </div>

            {/* Select Primary Faculty */}
            <div className="space-y-1">
              <Label>Choose Primary Faculty Lecturer*</Label>
              <div className="border rounded-xl max-h-[140px] overflow-y-auto pr-1">
                {filteredFacultyPool.map((fac) => (
                  <div
                    key={fac.id}
                    onClick={() => setSelectedPrimaryFaculty(fac.id)}
                    className={`p-2 border-b last:border-b-0 cursor-pointer flex items-center justify-between hover:bg-muted/30 transition-colors ${
                      selectedPrimaryFaculty === fac.id ? "bg-primary/5 text-primary font-bold" : ""
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-xs leading-none">{fac.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {fac.designation} &middot; {fac.department} &middot; <span className={fac.workload >= 18 ? "text-red-500 font-bold" : "font-bold"}>{fac.workload} hrs weekly workload</span>
                      </p>
                    </div>
                    {selectedPrimaryFaculty === fac.id && (
                      <CheckCircle className="size-4 text-primary shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Select Secondary/Alternate Faculty */}
            <div className="space-y-1">
              <Label>Choose Alternate Faculty (Optional)</Label>
              <Select value={selectedSecondaryFaculty} onValueChange={setSelectedSecondaryFaculty}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Alternate Faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Alternate</SelectItem>
                  {MOCK_FACULTY_POOL_FOR_ASSIGN.map((fac) => (
                    <SelectItem key={fac.id} value={fac.id}>
                      {fac.name} ({fac.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Effective Assignment Date */}
            <div className="space-y-1">
              <Label htmlFor="effective-date">Effective Date of Assignment</Label>
              <Input
                id="effective-date"
                type="date"
                value={assignmentDate}
                onChange={(e) => setAssignmentDate(e.target.value)}
              />
            </div>

            {/* Alert if Primary Faculty is Overloaded */}
            {(() => {
              const selectedFacObj = MOCK_FACULTY_POOL_FOR_ASSIGN.find((f) => f.id === selectedPrimaryFaculty);
              if (selectedFacObj && selectedFacObj.workload >= 18) {
                return (
                  <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/25 text-red-600 rounded-xl">
                    <AlertTriangle className="size-4 shrink-0 text-red-500" />
                    <p className="text-[10px] leading-relaxed">
                      **Warning:** {selectedFacObj.name} is currently overloaded at {selectedFacObj.workload} hours weekly. Assigning another subject might require schedule adjustments.
                    </p>
                  </div>
                );
              }
              return null;
            })()}

            <DialogFooter className="pt-2">
              <Button variant="outline" onClick={() => setIsFacultyModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveFacultyAssignment} className="bg-brand-gradient text-white font-semibold">
                Approve Faculty Assignment
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* 8. SUBJECT DEMOGRAPHICS ANALYTICS PANEL */}
      <Panel
        title="Curriculum Demographics & Syllabus Analytics"
        description="Visual charts of course distribution, core vs elective ratios, and credits weighting across departments."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Subjects per Department */}
          <div className="space-y-3.5 p-4 rounded-xl border border-border/60 bg-muted/15">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Department representation</span>
              <span className="text-[10px] text-primary lowercase font-mono">Curricular Courses</span>
            </h4>
            <DonutChart data={deptDistData} centerLabel={String(metrics.total)} height={180} />
          </div>

          {/* Chart 2: Core vs Elective Distribution */}
          <div className="space-y-3.5 p-4 rounded-xl border border-border/60 bg-muted/15 lg:col-span-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Curriculum Category distribution</span>
              <span className="text-[10px] text-success font-mono">Active counts</span>
            </h4>
            <GroupedBarChart
              data={typeDistData as any}
              xKey="label"
              series={[{ key: "value", label: "Subject Count" }]}
              height={180}
            />
          </div>
        </div>
      </Panel>

    </div>
  );
}
