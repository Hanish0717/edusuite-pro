import React, { useEffect, useState } from "react";
import {
  GraduationCap,
  Plus,
  BookOpen,
  Layers,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  FileText,
  Award,
  Clock,
  CheckCircle,
  Building2,
  Bookmark,
  Sparkles,
  Users,
  FlaskConical,
  ShieldCheck,
  Calendar,
  PieChart,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Check,
  UserCheck,
  UserX,
  Play,
  RotateCcw,
  BarChart2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { Label } from "@/components/ui/label";

import {
  fetchAcademicCourses,
  fetchAcademicDepartments,
  fetchCurriculumSchemes,
  fetchLiveFacultyStatus,
  fetchClassStudents,
  submitAttendanceMark,
  fetchSyllabusProgress,
  updateSyllabusUnitStatus,
  createAcademicCourse,
  createAcademicDepartment,
  createCurriculumScheme,
  updateAcademicCourse,
  deleteAcademicCourse,
  INITIAL_COURSES,
  INITIAL_DEPARTMENTS,
  INITIAL_CURRICULUM_SCHEMES,
  INITIAL_FACULTY_STATUS,
  INITIAL_CLASS_STUDENTS,
  INITIAL_SYLLABUS_PROGRESS,
  type AcademicCourse,
  type AcademicDepartment,
  type CurriculumScheme,
  type LiveFacultyStatus,
  type ClassStudentAttendance,
  type SyllabusProgress,
  type SyllabusUnit,
} from "./AcademicsService";

const DEPARTMENTS_LIST = [
  "All Departments",
  "CSE",
  "ECE",
  "ME",
  "AI&DS",
  "Biotech",
];

const SEMESTERS_LIST = [
  "All Semesters",
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

export type AcademicsSubpart =
  | "courses"
  | "departments"
  | "curriculum"
  | "faculty-status"
  | "attendance-mark"
  | "syllabus-tracker";

export function AcademicsModuleView({ initialTab }: { initialTab?: AcademicsSubpart }) {
  const [courses, setCourses] = useState<AcademicCourse[]>(INITIAL_COURSES);
  const [departments, setDepartments] = useState<AcademicDepartment[]>(INITIAL_DEPARTMENTS);
  const [curriculumSchemes, setCurriculumSchemes] = useState<CurriculumScheme[]>(INITIAL_CURRICULUM_SCHEMES);

  // Feature State 1: Faculty Live Status Matrix
  const [facultyStatuses, setFacultyStatuses] = useState<LiveFacultyStatus[]>(INITIAL_FACULTY_STATUS);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(2);

  // Feature State 2: Attendance Marking Portal
  const [studentRoster, setStudentRoster] = useState<ClassStudentAttendance[]>(INITIAL_CLASS_STUDENTS);
  const [selectedClass, setSelectedClass] = useState<string>("CSE-3A");
  const [submittingAttendance, setSubmittingAttendance] = useState<boolean>(false);

  // Feature State 3: Syllabus Tracker
  const [syllabusList, setSyllabusList] = useState<SyllabusProgress[]>(INITIAL_SYLLABUS_PROGRESS);

  // Active Subpart Tab
  const [activeSubpart, setActiveSubpart] = useState<AcademicsSubpart>(initialTab || "departments");

  // Filters & Loading
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("All Departments");
  const [selectedSemFilter, setSelectedSemFilter] = useState("All Semesters");
  const [loading, setLoading] = useState(false);

  // Dialog States
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [isAddSchemeOpen, setIsAddSchemeOpen] = useState(false);

  // Forms
  const [courseForm, setCourseForm] = useState<Partial<AcademicCourse>>({
    code: "",
    name: "",
    department: "CSE",
    semester: "Semester 5",
    credits: 3,
    type: "Core Theory",
    instructor: "",
    regulations: "R24 Regulation",
    prerequisite: "",
    syllabusOverview: "",
  });

  const [deptForm, setDeptForm] = useState<Partial<AcademicDepartment>>({
    code: "",
    name: "",
    hodName: "",
    facultyCount: 30,
    studentCapacity: 480,
    laboratoriesCount: 6,
    accreditation: "NAAC A+",
    establishedYear: "2026",
  });

  const [schemeForm, setSchemeForm] = useState<Partial<CurriculumScheme>>({
    regulationCode: "R24 Regulation",
    programName: "",
    effectiveBatch: "2024-2028",
    totalCredits: 160,
    coreTheoryCredits: 80,
    labCredits: 32,
    electiveCredits: 28,
    projectCredits: 20,
  });

  useEffect(() => {
    if (initialTab) {
      setActiveSubpart(initialTab);
    }
  }, [initialTab]);

  const loadAllData = async () => {
    setLoading(true);
    const [crs, dpt, sch, fSt, stR, syl] = await Promise.all([
      fetchAcademicCourses(),
      fetchAcademicDepartments(),
      fetchCurriculumSchemes(),
      fetchLiveFacultyStatus(selectedPeriod),
      fetchClassStudents(selectedClass),
      fetchSyllabusProgress(),
    ]);
    setCourses(crs);
    setDepartments(dpt);
    setCurriculumSchemes(sch);
    setFacultyStatuses(fSt);
    setStudentRoster(stR);
    setSyllabusList(syl);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, [selectedPeriod, selectedClass]);

  // Filtered lists
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDeptFilter === "All Departments" || c.department === selectedDeptFilter;
    const matchesSem = selectedSemFilter === "All Semesters" || c.semester === selectedSemFilter;
    return matchesSearch && matchesDept && matchesSem;
  });

  const filteredDepts = departments.filter((d) => {
    return (
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hodName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredSchemes = curriculumSchemes.filter((s) => {
    return (
      s.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.regulationCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredFacultyStatus = facultyStatuses.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDeptFilter === "All Departments" || f.department === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  // Handlers for Attendance Portal
  const handleToggleAttendance = (studentId: string, status: "Present" | "Absent" | "Late") => {
    setStudentRoster((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  };

  const handleMarkAllPresent = () => {
    setStudentRoster((prev) => prev.map((s) => ({ ...s, status: "Present" })));
    toast.success("All students marked as Present!");
  };

  const handleSubmitAttendance = async () => {
    setSubmittingAttendance(true);
    const result = await submitAttendanceMark({
      classId: selectedClass,
      subjectId: "CS302",
      date: new Date().toISOString().split("T")[0],
      period: selectedPeriod,
      records: studentRoster.map((s) => ({ studentId: s.id, status: s.status })),
    });
    setSubmittingAttendance(false);
    toast.success(result.message);
  };

  // Handlers for Syllabus Tracker
  const handleUpdateUnit = async (progressId: string, unitId: string, currentStatus: "Completed" | "In Progress" | "Remaining") => {
    const nextStatus = currentStatus === "Remaining" ? "In Progress" : currentStatus === "In Progress" ? "Completed" : "Remaining";
    const nextPct = nextStatus === "Completed" ? 100 : nextStatus === "In Progress" ? 60 : 0;

    setSyllabusList((prev) =>
      prev.map((syl) => {
        if (syl.id === progressId) {
          const nextUnits = syl.units.map((u) => (u.id === unitId ? { ...u, status: nextStatus, completionPct: nextPct } : u));
          const totalPct = Math.round(nextUnits.reduce((acc, u) => acc + u.completionPct, 0) / nextUnits.length);
          return { ...syl, units: nextUnits, overallProgressPct: totalPct };
        }
        return syl;
      })
    );
    await updateSyllabusUnitStatus(progressId, unitId, nextStatus, nextPct);
    toast.success(`Unit status updated to "${nextStatus}" (${nextPct}%)!`);
  };

  // Handlers for Courses
  const handleOpenAddCourse = () => {
    setCourseForm({
      code: "",
      name: "",
      department: "CSE",
      semester: "Semester 5",
      credits: 3,
      type: "Core Theory",
      instructor: "",
      regulations: "R24 Regulation",
      prerequisite: "",
      syllabusOverview: "",
    });
    setIsAddCourseOpen(true);
  };

  const handleAddCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.code || !courseForm.name) {
      toast.error("Please enter course code and title.");
      return;
    }
    const created = await createAcademicCourse(courseForm);
    setCourses((prev) => [created, ...prev]);
    setIsAddCourseOpen(false);
    toast.success(`Course ${created.code}: ${created.name} added successfully!`);
  };

  const handleOpenEditCourse = (course: AcademicCourse) => {
    setCourseForm(course);
    setIsEditCourseOpen(true);
  };

  const handleEditCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.id) return;
    await updateAcademicCourse(courseForm.id, courseForm);
    setCourses((prev) =>
      prev.map((c) => (c.id === courseForm.id ? ({ ...c, ...courseForm } as AcademicCourse) : c))
    );
    setIsEditCourseOpen(false);
    toast.success(`Course ${courseForm.code} updated!`);
  };

  const handleDeleteCourse = async (id: string, code: string) => {
    if (confirm(`Delete course ${code}?`)) {
      await deleteAcademicCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      toast.success(`Course ${code} deleted.`);
    }
  };

  // Handlers for Departments
  const handleAddDeptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.code || !deptForm.name) {
      toast.error("Please enter department code and name.");
      return;
    }
    const created = await createAcademicDepartment(deptForm);
    setDepartments((prev) => [created, ...prev]);
    setIsAddDeptOpen(false);
    toast.success(`Department ${created.name} (${created.code}) created successfully!`);
  };

  // Handlers for Curriculum
  const handleAddSchemeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeForm.programName) {
      toast.error("Please enter degree program name.");
      return;
    }
    const created = await createCurriculumScheme(schemeForm);
    setCurriculumSchemes((prev) => [created, ...prev]);
    setIsAddSchemeOpen(false);
    toast.success(`Curriculum scheme for ${created.programName} added!`);
  };

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = "";

    if (activeSubpart === "courses") {
      filename = `Academic_Course_Catalog_${new Date().toISOString().split("T")[0]}.csv`;
      headers = ["Course ID", "Code", "Title", "Department", "Semester", "Credits", "Type", "Instructor"];
      rows = filteredCourses.map((c) => [c.id, c.code, `"${c.name}"`, c.department, `"${c.semester}"`, c.credits, `"${c.type}"`, `"${c.instructor}"`]);
    } else if (activeSubpart === "departments") {
      filename = `Academic_Departments_${new Date().toISOString().split("T")[0]}.csv`;
      headers = ["Department ID", "Code", "Department Name", "HOD", "Faculty Count", "Student Capacity", "Labs", "Accreditation"];
      rows = filteredDepts.map((d) => [d.id, d.code, `"${d.name}"`, `"${d.hodName}"`, d.facultyCount, d.studentCapacity, d.laboratoriesCount, `"${d.accreditation}"`]);
    } else if (activeSubpart === "faculty-status") {
      filename = `Faculty_Live_Status_Period_${selectedPeriod}_${new Date().toISOString().split("T")[0]}.csv`;
      headers = ["Faculty Name", "Department", "Live Status", "Assigned Class", "Subject", "Room No", "Time Slot"];
      rows = filteredFacultyStatus.map((f) => [f.name, f.department, f.status, f.currentClass || "N/A", f.subject || "N/A", f.roomNo || "N/A", f.timeSlot || "N/A"]);
    } else {
      filename = `Academic_Curriculum_Schemes_${new Date().toISOString().split("T")[0]}.csv`;
      headers = ["Scheme ID", "Regulation", "Program Name", "Batch", "Total Credits", "Core Credits", "Lab Credits", "Elective Credits"];
      rows = filteredSchemes.map((s) => [s.id, s.regulationCode, `"${s.programName}"`, s.effectiveBatch, s.totalCredits, s.coreTheoryCredits, s.labCredits, s.electiveCredits]);
    }

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${rows.length} ${activeSubpart} records to CSV!`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <BookOpen className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Academics & Faculty Management Portal
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Academic Council Core
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Live Faculty Status Matrix, Period Attendance Marking, Syllabus Tracker & Academic Governance.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={loadAllData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>

          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Export Data
          </Button>

          {activeSubpart === "courses" && (
            <Button size="sm" onClick={handleOpenAddCourse} className="h-9 bg-brand-gradient text-white gap-2 font-semibold text-xs shadow-glow">
              <Plus className="size-4" /> Add New Course
            </Button>
          )}

          {activeSubpart === "departments" && (
            <Button size="sm" onClick={() => setIsAddDeptOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 font-semibold text-xs shadow-glow">
              <Building2 className="size-4" /> Add Department
            </Button>
          )}
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Faculty Live Status</span>
            <Users className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">
            {facultyStatuses.filter((f) => f.status === "FREE").length} Free / {facultyStatuses.length}
          </p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">Period {selectedPeriod} Active Schedule</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Syllabus Completion</span>
            <BarChart2 className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">71% Overall</p>
          <p className="text-[0.68rem] text-muted-foreground">32 / 45 Classes Completed</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Academic Departments</span>
            <Building2 className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">{departments.length} Depts</p>
          <p className="text-[0.68rem] text-muted-foreground">CSE, ECE, ME, AI&DS</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Cataloged Courses</span>
            <BookOpen className="size-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">{courses.length} Courses</p>
          <p className="text-[0.68rem] text-purple-600 font-medium">R24 & R22 Regulations</p>
        </div>
      </div>

      {/* SIX SUBPARTS NAVIGATION TAB BAR */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-muted/60 border border-border/80 overflow-x-auto">
        <button
          onClick={() => setActiveSubpart("faculty-status")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeSubpart === "faculty-status" ? "bg-card text-primary shadow-sm border border-border/80" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="size-3.5" /> 🟢 Real-Time Faculty Status Matrix
        </button>

        <button
          onClick={() => setActiveSubpart("attendance-mark")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeSubpart === "attendance-mark" ? "bg-card text-primary shadow-sm border border-border/80" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCheck className="size-3.5" /> 📝 Faculty Attendance Portal
        </button>

        <button
          onClick={() => setActiveSubpart("syllabus-tracker")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeSubpart === "syllabus-tracker" ? "bg-card text-primary shadow-sm border border-border/80" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart2 className="size-3.5" /> 📊 Academic Calendar & Syllabus
        </button>

        <button
          onClick={() => setActiveSubpart("departments")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeSubpart === "departments" ? "bg-card text-primary shadow-sm border border-border/80" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="size-3.5" /> Departments ({departments.length})
        </button>

        <button
          onClick={() => setActiveSubpart("courses")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeSubpart === "courses" ? "bg-card text-primary shadow-sm border border-border/80" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="size-3.5" /> Courses Catalog ({courses.length})
        </button>

        <button
          onClick={() => setActiveSubpart("curriculum")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeSubpart === "curriculum" ? "bg-card text-primary shadow-sm border border-border/80" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bookmark className="size-3.5" /> Curriculum Schemes
        </button>
      </div>

      {/* FEATURE 1: REAL-TIME FACULTY STATUS MATRIX */}
      {activeSubpart === "faculty-status" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-muted-foreground uppercase shrink-0">Current Period:</span>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedPeriod === p ? "bg-primary text-white shadow-sm" : "bg-muted/40 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Period {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Select value={selectedDeptFilter} onValueChange={setSelectedDeptFilter}>
                <SelectTrigger className="h-9 text-xs w-[160px] rounded-xl"><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS_LIST.map((d) => (<SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>))}
                </SelectContent>
              </Select>
              <div className="relative flex-1 min-w-[150px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input placeholder="Search faculty..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 h-9 text-xs rounded-xl" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFacultyStatus.map((f) => (
              <div key={f.id} className="p-4 rounded-2xl border border-border/80 bg-card space-y-3 shadow-sm hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{f.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{f.department} Department</p>
                  </div>
                  {f.status === "FREE" && (
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 font-bold">
                      🟢 FREE
                    </Badge>
                  )}
                  {f.status === "IN CLASS / WORKING" && (
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 font-bold">
                      🔵 IN CLASS
                    </Badge>
                  )}
                  {f.status === "ON LEAVE" && (
                    <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 font-bold">
                      🔴 ON LEAVE
                    </Badge>
                  )}
                </div>

                {f.status === "IN CLASS / WORKING" && (
                  <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30 text-xs space-y-1">
                    <p className="font-bold text-blue-900 dark:text-blue-300">{f.subject}</p>
                    <div className="flex items-center justify-between text-muted-foreground font-mono text-[0.7rem] pt-1">
                      <span>Class: <strong className="text-foreground">{f.currentClass}</strong></span>
                      <span>Room: <strong className="text-foreground">{f.roomNo}</strong></span>
                    </div>
                    <p className="text-[0.68rem] font-mono text-blue-600 dark:text-blue-400">Slot: {f.timeSlot}</p>
                  </div>
                )}

                {f.status === "FREE" && (
                  <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 text-xs">
                    <p className="text-emerald-700 dark:text-emerald-300 font-medium">Unassigned in Period {selectedPeriod}</p>
                    <p className="text-[0.68rem] text-muted-foreground">Available for proxy / substitution</p>
                  </div>
                )}

                {f.status === "ON LEAVE" && (
                  <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 text-xs">
                    <p className="text-rose-700 dark:text-rose-300 font-semibold">{f.leaveReason || "Approved Leave"}</p>
                    <p className="text-[0.68rem] text-muted-foreground">Substitute assigned by HOD</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEATURE 2: FACULTY ATTENDANCE MARKING PORTAL */}
      {activeSubpart === "attendance-mark" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <UserCheck className="size-4 text-primary" /> Period Attendance Marking Access
              </h2>
              <p className="text-xs text-muted-foreground">
                Class: <strong className="text-foreground">{selectedClass}</strong> • Data Structures & Algorithms • Date: {new Date().toLocaleDateString()} (Period 2)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleMarkAllPresent} className="h-9 gap-1.5 text-xs font-semibold border-emerald-500/40 text-emerald-600 hover:bg-emerald-50">
                <CheckCircle2 className="size-3.5 text-emerald-500" /> Mark All Present
              </Button>
              <Button size="sm" onClick={handleSubmitAttendance} disabled={submittingAttendance} className="h-9 bg-brand-gradient text-white gap-1.5 text-xs font-semibold shadow-glow">
                {submittingAttendance ? <RefreshCw className="size-3.5 animate-spin" /> : <Check className="size-3.5" />} Submit Attendance
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-muted/30 border border-border/60">
            <div className="flex items-center gap-4 font-semibold">
              <span className="text-emerald-600">Present: {studentRoster.filter((s) => s.status === "Present").length}</span>
              <span className="text-rose-600">Absent: {studentRoster.filter((s) => s.status === "Absent").length}</span>
              <span className="text-amber-600">Late: {studentRoster.filter((s) => s.status === "Late").length}</span>
            </div>
            <span className="font-mono text-muted-foreground">Total Enrolled: {studentRoster.length} Students</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Roll Number</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3 text-center">Attendance Status Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {studentRoster.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{s.rollNo}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{s.name}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60">
                        <button
                          onClick={() => handleToggleAttendance(s.id, "Present")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            s.status === "Present" ? "bg-emerald-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          P (Present)
                        </button>
                        <button
                          onClick={() => handleToggleAttendance(s.id, "Absent")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            s.status === "Absent" ? "bg-rose-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          A (Absent)
                        </button>
                        <button
                          onClick={() => handleToggleAttendance(s.id, "Late")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            s.status === "Late" ? "bg-amber-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          L (Late)
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FEATURE 3: FACULTY ACADEMIC CALENDAR & SYLLABUS TRACKER */}
      {activeSubpart === "syllabus-tracker" && (
        <div className="space-y-6">
          {syllabusList.map((syl) => (
            <div key={syl.id} className="rounded-2xl border border-border/80 bg-card p-5 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">{syl.courseCode}</Badge>
                    <h2 className="text-base font-bold text-foreground">{syl.courseName}</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Faculty: {syl.facultyName} • Dept: {syl.department}</p>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold">
                    {syl.classesCompleted} / {syl.totalClassesScheduled} Classes Completed
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary font-bold">
                    {syl.overallProgressPct}% Syllabus Progress
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Overall Course Completion Rate</span>
                  <span className="font-mono font-bold text-primary">{syl.overallProgressPct}%</span>
                </div>
                <Progress value={syl.overallProgressPct} className="h-2.5 rounded-full" />
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Unit-by-Unit Syllabus Breakdown</h3>
                <div className="grid gap-3">
                  {syl.units.map((unit) => (
                    <div key={unit.id} className="p-3.5 rounded-xl border border-border/70 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-foreground">{unit.unitTitle}</span>
                          {unit.status === "Completed" && <Badge className="bg-emerald-500/10 text-emerald-600">✅ Completed</Badge>}
                          {unit.status === "In Progress" && <Badge className="bg-blue-500/10 text-blue-600">🟡 In Progress</Badge>}
                          {unit.status === "Remaining" && <Badge variant="outline" className="text-muted-foreground">⏳ Remaining</Badge>}
                        </div>
                        <Progress value={unit.completionPct} className="h-1.5 w-full max-w-md mt-1" />
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateUnit(syl.id, unit.id, unit.status)}
                        className="h-8 text-xs font-semibold rounded-xl self-start sm:self-auto"
                      >
                        Update Progress ({unit.completionPct}%)
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EXISTING SUBPART: DEPARTMENTS VIEW */}
      {activeSubpart === "departments" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepts.map((d) => (
              <div key={d.id} className="p-5 rounded-2xl border border-border/80 bg-card space-y-3 shadow-sm hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-primary">{d.code}</span>
                    <h3 className="font-bold text-sm text-foreground">{d.name}</h3>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">{d.accreditation}</Badge>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p><span className="font-semibold text-foreground">HOD:</span> {d.hodName}</p>
                  <p><span className="font-semibold text-foreground">Faculty Members:</span> {d.facultyCount} Professors</p>
                  <p><span className="font-semibold text-foreground">Student Capacity:</span> {d.studentCapacity} Seats</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXISTING SUBPART: COURSES CATALOG VIEW */}
      {activeSubpart === "courses" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Course Code</th>
                  <th className="py-3 px-3">Course Title</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Semester</th>
                  <th className="py-3 px-3">Credits</th>
                  <th className="py-3 px-3">Instructor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{c.code}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{c.name}</td>
                    <td className="py-3 px-3">{c.department}</td>
                    <td className="py-3 px-3">{c.semester}</td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">{c.credits} Credits</td>
                    <td className="py-3 px-3 text-muted-foreground">{c.instructor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EXISTING SUBPART: CURRICULUM SCHEMES */}
      {activeSubpart === "curriculum" && (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredSchemes.map((s) => (
            <div key={s.id} className="p-5 rounded-2xl border border-border/80 bg-card space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <Badge variant="outline" className="font-mono text-xs text-primary">{s.regulationCode}</Badge>
                  <h3 className="font-bold text-sm text-foreground mt-1">{s.programName}</h3>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600">{s.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono">Total Credits: {s.totalCredits} (Core: {s.coreTheoryCredits}, Lab: {s.labCredits}, Electives: {s.electiveCredits})</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
