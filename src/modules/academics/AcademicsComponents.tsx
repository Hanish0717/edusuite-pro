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
  createAcademicCourse,
  updateAcademicCourse,
  deleteAcademicCourse,
  INITIAL_COURSES,
  type AcademicCourse,
} from "./AcademicsService";

const DEPARTMENTS = [
  "All Departments",
  "CSE",
  "ECE",
  "ME",
  "AI&DS",
  "Biotech",
];

const SEMESTERS = [
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
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedSem, setSelectedSem] = useState("All Semesters");
  const [activeTab, setActiveTab] = useState<"catalog" | "regulations" | "syllabus">("catalog");
  const [loading, setLoading] = useState(false);

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<AcademicCourse | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<AcademicCourse>>({
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

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAcademicCourses();
    setCourses(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Courses
  const filtered = courses.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase()) ||
      (c.prerequisite && c.prerequisite.toLowerCase().includes(search.toLowerCase()));

    const matchesDept = selectedDept === "All Departments" || c.department === selectedDept;
    const matchesSem = selectedSem === "All Semesters" || c.semester === selectedSem;

    return matchesSearch && matchesDept && matchesSem;
  });

  // KPI Metrics
  const totalCourses = courses.length;
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  // Handlers
  const handleOpenAdd = () => {
    setFormData({
      code: "CS405",
      name: "Cloud Computing & Microservices Architecture",
      department: "CSE",
      semester: "Semester 7",
      credits: 4,
      type: "Core Theory",
      instructor: "Dr. S. K. Gupta",
      regulations: "R24 Regulation",
      prerequisite: "CS301: Computer Networks",
      syllabusOverview: "AWS/GCP Cloud Native Services, Docker Containerization, Kubernetes Orchestration, and Serverless.",
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (course: AcademicCourse) => {
    setSelectedCourse(course);
    setFormData({ ...course });
    setIsEditOpen(true);
  };

  const handleOpenView = (course: AcademicCourse) => {
    setSelectedCourse(course);
    setIsViewOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast.error("Please enter course code and course title.");
      return;
    }

    const created = await createAcademicCourse(formData);
    setCourses((prev) => [created, ...prev]);
    setIsAddOpen(false);
    toast.success(`Course ${created.code}: "${created.name}" created successfully!`);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    await updateAcademicCourse(selectedCourse.id, formData);
    setCourses((prev) =>
      prev.map((c) => (c.id === selectedCourse.id ? ({ ...c, ...formData } as AcademicCourse) : c)),
    );
    setIsEditOpen(false);
    toast.success(`Course ${formData.code} updated successfully!`);
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete course ${code}?`)) {
      await deleteAcademicCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      toast.success(`Course ${code} deleted from academic catalog.`);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Course ID",
      "Course Code",
      "Course Title",
      "Department",
      "Semester",
      "Credits",
      "Course Type",
      "Lead Instructor",
      "Regulations",
      "Prerequisites",
    ];
    const rows = filtered.map((c) => [
      c.id,
      c.code,
      `"${c.name}"`,
      c.department,
      `"${c.semester}"`,
      c.credits,
      `"${c.type}"`,
      `"${c.instructor}"`,
      c.regulations,
      `"${c.prerequisite || "None"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Academic_Course_Catalog_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filtered.length} courses to CSV!`);
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
              Degree programs, course cataloging, credit allocations, syllabus structure, and R24 regulations.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
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
            <Download className="size-3.5" /> Export Catalog
          </Button>

          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="h-9 bg-brand-gradient text-white gap-2 font-semibold text-xs shadow-glow hover:opacity-95"
          >
            <Plus className="size-4" /> Add New Course
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Degree Programs</span>
            <GraduationCap className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">14 Programs</p>
          <p className="text-[0.68rem] text-muted-foreground">UG & PG Degree Streams</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Cataloged Courses</span>
            <BookOpen className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">{totalCourses} Active Courses</p>
          <p className="text-[0.68rem] text-muted-foreground">Theory, Labs & Electives</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Total Catalog Credits</span>
            <Award className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">{totalCredits} Credits</p>
          <p className="text-[0.68rem] text-muted-foreground">160 Credits / B.Tech Degree</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Regulations Framework</span>
            <Bookmark className="size-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">R24 & R22 Active</p>
          <p className="text-[0.68rem] text-purple-600 font-medium">Outcome-Based Education (OBE)</p>
        </div>
      </div>

      {/* Control Bar & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search course code, title, instructor, prerequisite..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Department Filter */}
          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="h-9 w-full sm:w-[160px] text-xs" aria-label="Department Filter">
              <Building2 className="size-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d} className="text-xs">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Semester Filter */}
          <Select value={selectedSem} onValueChange={setSelectedSem}>
            <SelectTrigger className="h-9 w-full sm:w-[150px] text-xs" aria-label="Semester Filter">
              <Filter className="size-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              {SEMESTERS.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Courses Catalog Table */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <BookOpen className="size-4 text-primary" /> Institutional Course Catalog
            <Badge variant="secondary" className="font-mono text-xs">
              {filtered.length} Courses
            </Badge>
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <RefreshCw className="size-5 animate-spin text-primary" />
            Loading course catalog...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl space-y-2">
            <BookOpen className="size-7 text-muted-foreground mx-auto" />
            <p className="text-xs text-muted-foreground font-medium">No courses found matching criteria.</p>
          </div>
        ) : (
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
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{c.code}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-foreground">{c.name}</div>
                      {c.prerequisite && (
                        <div className="text-[0.68rem] text-muted-foreground">
                          Prereq: <span className="font-mono text-primary">{c.prerequisite}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground">{c.department}</div>
                      <div className="text-[0.68rem] text-muted-foreground">{c.semester}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-primary text-sm">
                      {c.credits} Credits
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="font-mono text-[0.68rem]">
                        {c.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-medium text-foreground">{c.instructor}</td>
                    <td className="py-3 px-3">
                      <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[0.68rem]">
                        {c.regulations}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenView(c)}
                          className="h-7 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
                          title="View Syllabus"
                        >
                          <Eye className="size-3.5" /> Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(c)}
                          className="size-7 text-muted-foreground hover:text-primary"
                          title="Edit Course"
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(c.id, c.code)}
                          className="size-7 text-muted-foreground hover:text-red-600"
                          title="Delete Course"
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
        )}
      </div>

      {/* DIALOG 1: ADD NEW COURSE MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="size-5 text-primary" /> Register New Academic Course
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a new course to the institutional curriculum catalog under R24 Regulations.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Course Code *</Label>
                <Input
                  required
                  placeholder="e.g. CS405"
                  value={formData.code || ""}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="h-9 text-xs font-mono uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Course Title *</Label>
                <Input
                  required
                  placeholder="e.g. Cloud Computing & Microservices"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(val) => setFormData({ ...formData, department: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.filter((d) => d !== "All Departments").map((d) => (
                      <SelectItem key={d} value={d} className="text-xs">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Semester</Label>
                <Select
                  value={formData.semester}
                  onValueChange={(val) => setFormData({ ...formData, semester: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.filter((s) => s !== "All Semesters").map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Credits</Label>
                <Input
                  type="number"
                  min="1"
                  max="6"
                  required
                  value={formData.credits || 3}
                  onChange={(e) =>
                    setFormData({ ...formData, credits: Number(e.target.value) })
                  }
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Course Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val: any) => setFormData({ ...formData, type: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Course Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Core Theory" className="text-xs">
                      Core Theory
                    </SelectItem>
                    <SelectItem value="Lab Practical" className="text-xs">
                      Lab Practical
                    </SelectItem>
                    <SelectItem value="Professional Elective" className="text-xs">
                      Professional Elective
                    </SelectItem>
                    <SelectItem value="Project Work" className="text-xs">
                      Project Work
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Lead Instructor / Professor</Label>
              <Input
                placeholder="e.g. Dr. S. K. Gupta"
                value={formData.instructor || ""}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Prerequisite Course</Label>
              <Input
                placeholder="e.g. CS301: Computer Networks"
                value={formData.prerequisite || ""}
                onChange={(e) => setFormData({ ...formData, prerequisite: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Syllabus Overview & Modules</Label>
              <Textarea
                placeholder="Outline unit 1-5 course outcomes, textbook references, and lab experiments..."
                value={formData.syllabusOverview || ""}
                onChange={(e) => setFormData({ ...formData, syllabusOverview: e.target.value })}
                className="text-xs min-h-[70px]"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">
                Register Course
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: EDIT COURSE MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Edit className="size-5 text-primary" /> Edit Course ({selectedCourse?.code})
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Course Code</Label>
                <Input
                  required
                  value={formData.code || ""}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="h-9 text-xs font-mono uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Course Title</Label>
                <Input
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Credits</Label>
                <Input
                  type="number"
                  required
                  value={formData.credits ?? 3}
                  onChange={(e) =>
                    setFormData({ ...formData, credits: Number(e.target.value) })
                  }
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Instructor</Label>
                <Input
                  value={formData.instructor || ""}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: VIEW SYLLABUS DOSSIER MODAL */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="size-5 text-primary" /> Course Syllabus & Regulations
            </DialogTitle>
          </DialogHeader>

          {selectedCourse && (
            <div className="space-y-4 pt-1">
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {selectedCourse.code}
                  </Badge>
                  <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                    {selectedCourse.regulations}
                  </Badge>
                </div>
                <h2 className="text-base font-bold text-foreground">{selectedCourse.name}</h2>
                <p className="text-xs text-primary font-medium">
                  {selectedCourse.department} &middot; {selectedCourse.semester}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60 font-mono">
                  <span className="text-muted-foreground font-sans">Credits Allocation:</span>
                  <span className="font-bold text-base text-primary">
                    {selectedCourse.credits} Credits ({selectedCourse.type})
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground">Lead Instructor:</span>
                  <span className="font-semibold text-foreground">{selectedCourse.instructor}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground">Prerequisites:</span>
                  <span className="font-mono text-foreground">
                    {selectedCourse.prerequisite || "None"}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-card border border-border/60 space-y-1">
                  <span className="text-muted-foreground font-semibold">Syllabus Overview:</span>
                  <p className="text-xs text-foreground font-medium">
                    {selectedCourse.syllabusOverview || "Full unit 1-5 syllabus cataloged in LMS."}
                  </p>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsViewOpen(false)}
                  className="w-full text-xs"
                >
                  Close Dossier
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
