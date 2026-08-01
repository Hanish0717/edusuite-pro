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
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  createAcademicCourse,
  createAcademicDepartment,
  createCurriculumScheme,
  updateAcademicCourse,
  deleteAcademicCourse,
  INITIAL_COURSES,
  INITIAL_DEPARTMENTS,
  INITIAL_CURRICULUM_SCHEMES,
  type AcademicCourse,
  type AcademicDepartment,
  type CurriculumScheme,
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

export function AcademicsModuleView() {
  const [courses, setCourses] = useState<AcademicCourse[]>(INITIAL_COURSES);
  const [departments, setDepartments] = useState<AcademicDepartment[]>(INITIAL_DEPARTMENTS);
  const [curriculumSchemes, setCurriculumSchemes] = useState<CurriculumScheme[]>(INITIAL_CURRICULUM_SCHEMES);

  // Active Subpart Tab state: "courses" | "departments" | "curriculum"
  const [activeSubpart, setActiveSubpart] = useState<"courses" | "departments" | "curriculum">("courses");

  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedSem, setSelectedSem] = useState("All Semesters");
  const [loading, setLoading] = useState(false);

  // Dialog States
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [isViewCourseOpen, setIsViewCourseOpen] = useState(false);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [isAddSchemeOpen, setIsAddSchemeOpen] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<AcademicCourse | null>(null);

  // Form States
  const [courseForm, setCourseForm] = useState<Partial<AcademicCourse>>({
    code: "",
    name: "",
    department: "CSE",
    semester: "Semester 5",
    credits: 3,
    type: "Core Theory",
    instructor: "Dr. K. Sai Teja",
    regulations: "R24 Regulation",
    prerequisite: "None",
    syllabusOverview: "",
  });

  const [deptForm, setDeptForm] = useState<Partial<AcademicDepartment>>({
    code: "CIVIL",
    name: "Civil & Structural Engineering",
    hodName: "Dr. N. R. Prasad",
    facultyCount: 35,
    studentCapacity: 480,
    laboratoriesCount: 7,
    accreditation: "NAAC A+",
    establishedYear: "2012",
  });

  const [schemeForm, setSchemeForm] = useState<Partial<CurriculumScheme>>({
    regulationCode: "R24 Regulation",
    programName: "B.Tech AI & Data Science",
    effectiveBatch: "2024-2028",
    totalCredits: 160,
    coreTheoryCredits: 76,
    labCredits: 34,
    electiveCredits: 30,
    projectCredits: 20,
  });

  const loadAllData = async () => {
    setLoading(true);
    const [crs, dps, cur] = await Promise.all([
      fetchAcademicCourses(),
      fetchAcademicDepartments(),
      fetchCurriculumSchemes(),
    ]);
    setCourses(crs);
    setDepartments(dps);
    setCurriculumSchemes(cur);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Filtered Courses
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDept === "All Departments" || c.department === selectedDept;
    const matchesSem = selectedSem === "All Semesters" || c.semester === selectedSem;

    return matchesSearch && matchesDept && matchesSem;
  });

  // Filtered Departments
  const filteredDepts = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.hodName.toLowerCase().includes(search.toLowerCase()),
  );

  // Filtered Schemes
  const filteredSchemes = curriculumSchemes.filter(
    (s) =>
      s.programName.toLowerCase().includes(search.toLowerCase()) ||
      s.regulationCode.toLowerCase().includes(search.toLowerCase()) ||
      s.effectiveBatch.toLowerCase().includes(search.toLowerCase()),
  );

  // Handlers for Courses
  const handleOpenAddCourse = () => {
    setCourseForm({
      code: "CS405",
      name: "Cloud Computing & Microservices Architecture",
      department: "CSE",
      semester: "Semester 7",
      credits: 4,
      type: "Core Theory",
      instructor: "Dr. S. K. Gupta",
      regulations: "R24 Regulation",
      prerequisite: "CS301: Computer Networks",
      syllabusOverview: "AWS/GCP Cloud Native Services, Docker Containerization, and Kubernetes.",
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
    toast.success(`Course ${created.code}: "${created.name}" created!`);
  };

  const handleOpenEditCourse = (c: AcademicCourse) => {
    setSelectedCourse(c);
    setCourseForm({ ...c });
    setIsEditCourseOpen(true);
  };

  const handleEditCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    await updateAcademicCourse(selectedCourse.id, courseForm);
    setCourses((prev) =>
      prev.map((c) => (c.id === selectedCourse.id ? ({ ...c, ...courseForm } as AcademicCourse) : c)),
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
      rows = filteredCourses.map((c) => [
        c.id, c.code, `"${c.name}"`, c.department, `"${c.semester}"`, c.credits, `"${c.type}"`, `"${c.instructor}"`
      ]);
    } else if (activeSubpart === "departments") {
      filename = `Academic_Departments_${new Date().toISOString().split("T")[0]}.csv`;
      headers = ["Department ID", "Code", "Department Name", "HOD", "Faculty Count", "Student Capacity", "Labs", "Accreditation"];
      rows = filteredDepts.map((d) => [
        d.id, d.code, `"${d.name}"`, `"${d.hodName}"`, d.facultyCount, d.studentCapacity, d.laboratoriesCount, `"${d.accreditation}"`
      ]);
    } else {
      filename = `Academic_Curriculum_Schemes_${new Date().toISOString().split("T")[0]}.csv`;
      headers = ["Scheme ID", "Regulation", "Program Name", "Batch", "Total Credits", "Core Credits", "Lab Credits", "Elective Credits"];
      rows = filteredSchemes.map((s) => [
        s.id, s.regulationCode, `"${s.programName}"`, s.effectiveBatch, s.totalCredits, s.coreTheoryCredits, s.labCredits, s.electiveCredits
      ]);
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

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
                Academics & Curriculum Management Module
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Academic Council Core
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Comprehensive control of Academic Departments, Course Cataloging, and Curriculum Schemes.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAllData}
            disabled={loading}
            className="h-9 gap-2 text-xs font-medium border-border hover:bg-accent"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 gap-2 text-xs font-medium border-border hover:bg-accent"
          >
            <Download className="size-3.5" /> Export {activeSubpart.toUpperCase()}
          </Button>

          {activeSubpart === "courses" && (
            <Button
              size="sm"
              onClick={handleOpenAddCourse}
              className="h-9 bg-brand-gradient text-white gap-2 font-semibold text-xs shadow-glow hover:opacity-95"
            >
              <Plus className="size-4" /> Add New Course
            </Button>
          )}

          {activeSubpart === "departments" && (
            <Button
              size="sm"
              onClick={() => setIsAddDeptOpen(true)}
              className="h-9 bg-brand-gradient text-white gap-2 font-semibold text-xs shadow-glow hover:opacity-95"
            >
              <Building2 className="size-4" /> Add Department
            </Button>
          )}

          {activeSubpart === "curriculum" && (
            <Button
              size="sm"
              onClick={() => setIsAddSchemeOpen(true)}
              className="h-9 bg-brand-gradient text-white gap-2 font-semibold text-xs shadow-glow hover:opacity-95"
            >
              <Bookmark className="size-4" /> New Scheme
            </Button>
          )}
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Academic Departments</span>
            <Building2 className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">{departments.length} Departments</p>
          <p className="text-[0.68rem] text-muted-foreground">CSE, ECE, ME, AI&DS & Biotech</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Cataloged Courses</span>
            <BookOpen className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">{courses.length} Courses</p>
          <p className="text-[0.68rem] text-muted-foreground">Theory, Labs & Electives</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Curriculum Schemes</span>
            <Bookmark className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">{curriculumSchemes.length} Schemes</p>
          <p className="text-[0.68rem] text-muted-foreground">160 Credits / B.Tech Degree</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Regulations Standard</span>
            <ShieldCheck className="size-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">R24 & R22 Active</p>
          <p className="text-[0.68rem] text-purple-600 font-medium">Outcome-Based Education (OBE)</p>
        </div>
      </div>

      {/* THREE SUBPARTS NAVIGATION TAB BAR */}
      <div className="flex items-center justify-between gap-3 p-1.5 rounded-2xl bg-muted/60 border border-border/80">
        <div className="flex items-center gap-1.5 w-full overflow-x-auto">
          <button
            onClick={() => setActiveSubpart("courses")}
            className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeSubpart === "courses"
                ? "bg-card text-primary shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="size-4" /> 1. Courses Catalog ({courses.length})
          </button>

          <button
            onClick={() => setActiveSubpart("departments")}
            className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeSubpart === "departments"
                ? "bg-card text-primary shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="size-4" /> 2. Departments ({departments.length})
          </button>

          <button
            onClick={() => setActiveSubpart("curriculum")}
            className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeSubpart === "curriculum"
                ? "bg-card text-primary shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bookmark className="size-4" /> 3. Curriculum & Regulations
          </button>
        </div>
      </div>

      {/* SUBPART 1: COURSES CATALOG VIEW */}
      {activeSubpart === "courses" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-sm">
            <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search course code, title, instructor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="h-9 w-full sm:w-[160px] text-xs">
                  <Building2 className="size-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS_LIST.map((d) => (
                    <SelectItem key={d} value={d} className="text-xs">
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSem} onValueChange={setSelectedSem}>
                <SelectTrigger className="h-9 w-full sm:w-[150px] text-xs">
                  <Filter className="size-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS_LIST.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <BookOpen className="size-4 text-primary" /> Institutional Course Catalog
                <Badge variant="secondary" className="font-mono text-xs">
                  {filteredCourses.length} Courses
                </Badge>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Course Code</th>
                    <th className="py-3 px-3">Course Title</th>
                    <th className="py-3 px-3">Dept & Sem</th>
                    <th className="py-3 px-3">Credits</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Lead Instructor</th>
                    <th className="py-3 px-3">Regulations</th>
                    <th className="py-3 px-3 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-foreground">{c.code}</td>
                      <td className="py-3 px-3 font-semibold text-foreground">{c.name}</td>
                      <td className="py-3 px-3 font-medium text-foreground">{c.department} &middot; {c.semester}</td>
                      <td className="py-3 px-3 font-mono font-bold text-primary text-sm">{c.credits} Credits</td>
                      <td className="py-3 px-3"><Badge variant="outline" className="font-mono text-[0.68rem]">{c.type}</Badge></td>
                      <td className="py-3 px-3 font-medium text-foreground">{c.instructor}</td>
                      <td className="py-3 px-3"><Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[0.68rem]">{c.regulations}</Badge></td>
                      <td className="py-3 px-3 text-right pr-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedCourse(c); setIsViewCourseOpen(true); }} className="h-7 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground">
                            <Eye className="size-3.5" /> Details
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEditCourse(c)} className="size-7 text-muted-foreground hover:text-primary">
                            <Edit className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCourse(c.id, c.code)} className="size-7 text-muted-foreground hover:text-red-600">
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
        </div>
      )}

      {/* SUBPART 2: DEPARTMENTS VIEW */}
      {activeSubpart === "departments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-card border border-border/80 shadow-sm">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search department name, HOD, code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepts.map((dept) => (
              <div key={dept.id} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-xs">
                    {dept.code}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-[0.68rem]">
                    Estd. {dept.establishedYear}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground">{dept.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">HOD: <span className="font-semibold text-foreground">{dept.hodName}</span></p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-center font-mono">
                  <div className="p-2 rounded-xl bg-muted/40">
                    <p className="text-[0.65rem] text-muted-foreground uppercase font-sans">Faculty</p>
                    <p className="text-sm font-bold text-primary">{dept.facultyCount}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/40">
                    <p className="text-[0.65rem] text-muted-foreground uppercase font-sans">Students</p>
                    <p className="text-sm font-bold text-emerald-600">{dept.studentCapacity}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/40">
                    <p className="text-[0.65rem] text-muted-foreground uppercase font-sans">Labs</p>
                    <p className="text-sm font-bold text-blue-600">{dept.laboratoriesCount}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">Accreditation:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]">
                    {dept.accreditation}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBPART 3: CURRICULUM & REGULATIONS VIEW */}
      {activeSubpart === "curriculum" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSchemes.map((scheme) => (
              <div key={scheme.id} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 font-mono text-xs mb-1">
                      {scheme.regulationCode}
                    </Badge>
                    <h3 className="text-base font-bold text-foreground">{scheme.programName}</h3>
                    <p className="text-xs text-muted-foreground">Effective Batch: <span className="font-mono font-semibold">{scheme.effectiveBatch}</span></p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs text-emerald-600 border-emerald-200">
                    {scheme.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 font-mono">
                    <span className="text-muted-foreground font-sans font-medium">Total Degree Credits:</span>
                    <span className="font-bold text-base text-primary">{scheme.totalCredits} Credits</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-center">
                    <div className="p-2 rounded-xl bg-muted/40">
                      <p className="text-[0.65rem] text-muted-foreground font-sans">Core Theory</p>
                      <p className="text-xs font-bold text-foreground">{scheme.coreTheoryCredits} C</p>
                    </div>
                    <div className="p-2 rounded-xl bg-muted/40">
                      <p className="text-[0.65rem] text-muted-foreground font-sans">Labs</p>
                      <p className="text-xs font-bold text-blue-600">{scheme.labCredits} C</p>
                    </div>
                    <div className="p-2 rounded-xl bg-muted/40">
                      <p className="text-[0.65rem] text-muted-foreground font-sans">Electives</p>
                      <p className="text-xs font-bold text-emerald-600">{scheme.electiveCredits} C</p>
                    </div>
                    <div className="p-2 rounded-xl bg-muted/40">
                      <p className="text-[0.65rem] text-muted-foreground font-sans">Projects</p>
                      <p className="text-xs font-bold text-purple-600">{scheme.projectCredits} C</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DIALOG 1: ADD COURSE MODAL */}
      <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="size-5 text-primary" /> Register New Academic Course
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCourseSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs font-semibold">Course Code *</Label><Input required placeholder="CS405" value={courseForm.code || ""} onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })} className="h-9 text-xs font-mono uppercase" /></div>
              <div className="space-y-1"><Label className="text-xs font-semibold">Course Title *</Label><Input required placeholder="Cloud Computing" value={courseForm.name || ""} onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })} className="h-9 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs font-semibold">Department</Label><Select value={courseForm.department} onValueChange={(val) => setCourseForm({ ...courseForm, department: val })}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent>{DEPARTMENTS_LIST.filter((d) => d !== "All Departments").map((d) => (<SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs font-semibold">Credits</Label><Input type="number" required value={courseForm.credits ?? 3} onChange={(e) => setCourseForm({ ...courseForm, credits: Number(e.target.value) })} className="h-9 text-xs font-mono" /></div>
            </div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Instructor</Label><Input placeholder="Dr. S. K. Gupta" value={courseForm.instructor || ""} onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })} className="h-9 text-xs" /></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setIsAddCourseOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Register Course</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: ADD DEPARTMENT MODAL */}
      <Dialog open={isAddDeptOpen} onOpenChange={setIsAddDeptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Building2 className="size-5 text-primary" /> Add New Academic Department
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDeptSubmit} className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs font-semibold">Dept Code *</Label><Input required placeholder="CIVIL" value={deptForm.code || ""} onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })} className="h-9 text-xs font-mono uppercase" /></div>
              <div className="space-y-1"><Label className="text-xs font-semibold">Faculty Count</Label><Input type="number" value={deptForm.facultyCount ?? 35} onChange={(e) => setDeptForm({ ...deptForm, facultyCount: Number(e.target.value) })} className="h-9 text-xs font-mono" /></div>
            </div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Department Full Name *</Label><Input required placeholder="Civil Engineering" value={deptForm.name || ""} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Head of Department (HOD)</Label><Input placeholder="Dr. N. R. Prasad" value={deptForm.hodName || ""} onChange={(e) => setDeptForm({ ...deptForm, hodName: e.target.value })} className="h-9 text-xs" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsAddDeptOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Create Department</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: ADD CURRICULUM SCHEME MODAL */}
      <Dialog open={isAddSchemeOpen} onOpenChange={setIsAddSchemeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Bookmark className="size-5 text-primary" /> Create Curriculum Scheme
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSchemeSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Degree Program Name *</Label><Input required placeholder="B.Tech Computer Science" value={schemeForm.programName || ""} onChange={(e) => setSchemeForm({ ...schemeForm, programName: e.target.value })} className="h-9 text-xs" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs font-semibold">Regulation Code</Label><Input placeholder="R24 Regulation" value={schemeForm.regulationCode || ""} onChange={(e) => setSchemeForm({ ...schemeForm, regulationCode: e.target.value })} className="h-9 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs font-semibold">Effective Batch</Label><Input placeholder="2024-2028" value={schemeForm.effectiveBatch || ""} onChange={(e) => setSchemeForm({ ...schemeForm, effectiveBatch: e.target.value })} className="h-9 text-xs font-mono" /></div>
            </div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsAddSchemeOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Create Scheme</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
