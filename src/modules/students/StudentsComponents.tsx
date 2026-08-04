import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Mail,
  Phone,
  Eye,
  Edit2,
  Trash2,
  Plus,
  User,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export interface StudentProfileItem {
  id: string;
  code: string;
  name: string;
  initials: string;
  branch: string;
  year: number | string;
  attendancePct: number;
  cgpa: number;
  status: "Active" | "Warning" | "Inactive";
  email: string;
  phone: string;
}

const DEFAULT_STUDENTS_LIST: StudentProfileItem[] = [
  {
    id: "stu-1",
    code: "CS100001",
    name: "Student Demo",
    initials: "SD",
    branch: "Computer Science & Engineering",
    year: 3,
    attendancePct: 92.5,
    cgpa: 8.50,
    status: "Active",
    email: "student.demo@college.edu",
    phone: "+91 9876543210",
  },
];

interface StudentsModuleViewProps {
  title?: string;
  description?: string;
}

export function StudentsModuleView({
  title = "Students",
  description = "Manage student profiles, attendance and academic records.",
}: StudentsModuleViewProps) {
  const [students, setStudents] = useState<StudentProfileItem[]>(DEFAULT_STUDENTS_LIST);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("stu-1");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<StudentProfileItem | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    branch: "Computer Science & Engineering",
    year: 3,
    attendancePct: 92.5,
    cgpa: 8.50,
    status: "Active" as StudentProfileItem["status"],
    email: "",
    phone: "",
  });

  const featuredStudent =
    (students.find((s) => s.id === selectedStudentId) || students[0] || DEFAULT_STUDENTS_LIST[0])!;

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = students.filter((s) => s.status === "Active").length;
  const warningCount = students.filter((s) => s.status === "Warning").length;
  const inactiveCount = students.filter((s) => s.status === "Inactive").length;

  const avgAttendance =
    students.length > 0
      ? Math.round(students.reduce((acc, s) => acc + s.attendancePct, 0) / students.length) + "%"
      : "93%";

  const avgCgpa =
    students.length > 0
      ? (students.reduce((acc, s) => acc + s.cgpa, 0) / students.length).toFixed(2)
      : "8.50";

  // Handlers
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter student name");
      return;
    }
    const initials = formData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newStudent: StudentProfileItem = {
      id: `stu-${Date.now()}`,
      code: formData.code || `CS10000${students.length + 1}`,
      name: formData.name,
      initials: initials || "ST",
      branch: formData.branch,
      year: formData.year,
      attendancePct: Number(formData.attendancePct) || 90.0,
      cgpa: Number(formData.cgpa) || 8.0,
      status: formData.status,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, ".")}@college.edu`,
      phone: formData.phone || "+91 9876543210",
    };

    setStudents([newStudent, ...students]);
    setSelectedStudentId(newStudent.id);
    setIsAddOpen(false);
    setFormData({
      code: "",
      name: "",
      branch: "Computer Science & Engineering",
      year: 3,
      attendancePct: 92.5,
      cgpa: 8.50,
      status: "Active",
      email: "",
      phone: "",
    });
    toast.success(`Successfully added student record for "${newStudent.name}"`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    setStudents((prev) =>
      prev.map((s) =>
        s.id === activeItem.id
          ? {
              ...s,
              ...formData,
              attendancePct: Number(formData.attendancePct),
              cgpa: Number(formData.cgpa),
            }
          : s
      )
    );
    setIsEditOpen(false);
    toast.success(`Updated student details for "${formData.name}"`);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selectedStudentId === id) {
      setSelectedStudentId(students.find((s) => s.id !== id)?.id || "");
    }
    toast.success(`Deleted student record for "${name}"`);
  };

  return (
    <div className="space-y-6 animate-fade-in-soft max-w-[1400px] mx-auto p-4 md:p-6 pb-20">
      {/* 1. HEADER SECTION MATCHING USER SCREENSHOT */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            {description}
          </p>
        </div>

        {/* TOP RIGHT BUTTONS MATCHING USER SCREENSHOT */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(true)}
            className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-full h-9 px-4 shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Filter className="size-3.5" /> Filter
          </Button>

          <Button
            onClick={() => {
              toast.success(`Verified student credentials for ${featuredStudent.name} (${featuredStudent.code})`);
            }}
            className="bg-[#4f46e5] hover:bg-indigo-700 text-white font-extrabold text-xs rounded-full h-9 px-5 shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <CheckCircle2 className="size-4" /> Verify Student
          </Button>
        </div>
      </div>

      {/* 2. ROW 1: FEATURED STUDENT CARD (TOP LEFT ONLY) MATCHING USER SCREENSHOT */}
      <div className="flex items-start">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-3 flex flex-col items-center text-center w-full max-w-[280px]">
          {/* Avatar Circle */}
          <div className="size-16 rounded-2xl bg-gradient-to-tr from-[#6366f1] via-[#4f46e5] to-[#7c3aed] text-white text-xl font-black grid place-items-center shadow-md shadow-indigo-500/20">
            {featuredStudent.initials}
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
              {featuredStudent.name}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {featuredStudent.branch} · Year {featuredStudent.year}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="w-full bg-[#f8fafc] rounded-2xl p-2.5 grid grid-cols-2 gap-2 border border-slate-100/80 text-center">
            <div className="space-y-0.5">
              <div className="text-xs font-black text-slate-900">
                {featuredStudent.attendancePct}%
              </div>
              <div className="text-[0.62rem] font-semibold text-slate-400">
                Attendance
              </div>
            </div>

            <div className="space-y-0.5 border-l border-slate-200/60 pl-2">
              <div className="text-xs font-black text-slate-900">
                {featuredStudent.cgpa.toFixed(2)}
              </div>
              <div className="text-[0.62rem] font-semibold text-slate-400">
                CGPA
              </div>
            </div>
          </div>

          {/* Quick Icons */}
          <div className="flex items-center justify-center gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => toast.info(`Emailing ${featuredStudent.email}`)}
              className="size-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 grid place-items-center transition-all cursor-pointer"
              title="Email Student"
            >
              <Mail className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => toast.info(`Calling ${featuredStudent.phone}`)}
              className="size-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 grid place-items-center transition-all cursor-pointer"
              title="Call Student"
            >
              <Phone className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. ROW 2: FULL WIDTH "ALL STUDENTS" TABLE CARD MATCHING USER SCREENSHOT */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900">
            All Students
          </h3>

          {/* Search Input Box */}
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-8 h-9 rounded-full bg-slate-50/80 border-slate-200/80 text-xs text-slate-700 focus-visible:ring-indigo-500"
            />
          </div>
        </div>

        {/* TABLE CONTAINER MATCHING USER SCREENSHOT */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-white text-slate-400 font-bold uppercase text-[0.65rem] border-b border-slate-100">
              <tr>
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">NAME</th>
                <th className="py-3 px-3">BRANCH</th>
                <th className="py-3 px-3">YEAR</th>
                <th className="py-3 px-3">ATTENDANCE</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">
                    No student records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  const isSelected = stu.id === selectedStudentId;
                  return (
                    <tr
                      key={stu.id}
                      onClick={() => setSelectedStudentId(stu.id)}
                      className={`hover:bg-slate-50/80 transition-all cursor-pointer ${
                        isSelected ? "bg-indigo-50/20" : ""
                      }`}
                    >
                      <td className="py-3.5 px-3 font-mono font-medium text-slate-500">
                        {stu.code}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="size-6 rounded-full bg-[#4f46e5] text-white font-extrabold text-[0.65rem] grid place-items-center shrink-0">
                            {stu.initials}
                          </span>
                          <span className="font-bold text-slate-900">
                            {stu.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-slate-600 font-medium">
                        {stu.branch}
                      </td>

                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        {stu.year}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${Math.min(100, stu.attendancePct)}%` }}
                              className="h-full bg-[#4f46e5] rounded-full"
                            />
                          </div>
                          <span className="font-bold text-slate-800 text-[0.7rem]">
                            {stu.attendancePct}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <Badge className="bg-[#eff6ff] text-[#3b82f6] border border-[#dbeafe] font-bold text-[0.68rem] px-3 py-0.5 rounded-full">
                          {stu.status}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveItem(stu);
                              setIsViewOpen(true);
                            }}
                            className="text-[#3b82f6] hover:underline font-bold text-xs cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveItem(stu);
                              setFormData({
                                code: stu.code,
                                name: stu.name,
                                branch: stu.branch,
                                year: Number(stu.year) || 3,
                                attendancePct: stu.attendancePct,
                                cgpa: stu.cgpa,
                                status: stu.status,
                                email: stu.email,
                                phone: stu.phone,
                              });
                              setIsEditOpen(true);
                            }}
                            className="text-slate-400 hover:text-indigo-600 p-1 transition-colors cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(stu.id, stu.name)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION ROW MATCHING USER SCREENSHOT */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-400 font-medium">
          <span>Showing 1–{filteredStudents.length} of {filteredStudents.length}</span>

          <div className="flex items-center gap-2">
            <button
              disabled
              className="text-slate-300 font-semibold cursor-not-allowed text-xs px-2 py-1"
            >
              Prev
            </button>
            <span className="size-7 rounded-full bg-[#4f46e5] text-white font-bold text-xs grid place-items-center shadow-2xs">
              1
            </span>
            <button
              disabled
              className="text-slate-300 font-semibold cursor-not-allowed text-xs px-2 py-1"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 4. ROW 3: STUDENT OVERVIEW (LEFT) + REALTIME REGISTRY (RIGHT) MATCHING USER SCREENSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* BOTTOM LEFT: STUDENT OVERVIEW CARD MATCHING USER SCREENSHOT */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="size-4 text-indigo-600" /> Student Overview
            </h3>
          </div>

          {/* LIGHT BLUE TINTED STAT ROWS MATCHING USER SCREENSHOT */}
          <div className="space-y-2">
            <div className="bg-[#e6f7ff] rounded-2xl p-3 px-4 flex justify-between items-center text-xs font-semibold text-slate-600 border border-[#bae6fd]/50">
              <span>Total Students</span>
              <span className="font-extrabold text-slate-900 text-sm">{students.length}</span>
            </div>

            <div className="bg-[#e6f7ff] rounded-2xl p-3 px-4 flex justify-between items-center text-xs font-semibold text-slate-600 border border-[#bae6fd]/50">
              <span>Active</span>
              <span className="font-extrabold text-slate-900 text-sm">{activeCount}</span>
            </div>

            <div className="bg-[#e6f7ff] rounded-2xl p-3 px-4 flex justify-between items-center text-xs font-semibold text-slate-600 border border-[#bae6fd]/50">
              <span>Warning</span>
              <span className="font-extrabold text-slate-900 text-sm">{warningCount}</span>
            </div>

            <div className="bg-[#e6f7ff] rounded-2xl p-3 px-4 flex justify-between items-center text-xs font-semibold text-slate-600 border border-[#bae6fd]/50">
              <span>Inactive</span>
              <span className="font-extrabold text-slate-900 text-sm">{inactiveCount}</span>
            </div>

            <div className="bg-[#e6f7ff] rounded-2xl p-3 px-4 flex justify-between items-center text-xs font-semibold text-slate-600 border border-[#bae6fd]/50">
              <span>Average Attendance</span>
              <span className="font-extrabold text-slate-900 text-sm">{avgAttendance}</span>
            </div>

            <div className="bg-[#e6f7ff] rounded-2xl p-3 px-4 flex justify-between items-center text-xs font-semibold text-slate-600 border border-[#bae6fd]/50">
              <span>Average CGPA</span>
              <span className="font-extrabold text-slate-900 text-sm">{avgCgpa}</span>
            </div>
          </div>
        </div>

        {/* BOTTOM RIGHT: REALTIME STUDENT REGISTRY CARD MATCHING USER SCREENSHOT */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-100 shadow-2xs text-center flex flex-col items-center justify-center space-y-4 min-h-[340px]">
          <div className="size-16 rounded-full bg-[#e0e7ff] text-[#4f46e5] grid place-items-center shadow-2xs">
            <User className="size-7" />
          </div>

          <div className="space-y-1.5 max-w-md">
            <h3 className="text-xl font-black text-[#4f46e5] tracking-tight">
              Realtime Student Registry
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Manage student records from Supabase with instant create, update, delete, search, filters, profile navigation, and pagination.
            </p>
          </div>

          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-[#4f46e5] hover:bg-indigo-700 text-white font-extrabold text-xs rounded-full h-10 px-6 cursor-pointer shadow-md transition-all"
          >
            Launch Add Dialog
          </Button>
        </div>
      </div>

      {/* CREATE STUDENT DIALOG MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <User className="size-5 text-indigo-600" /> Register New Student
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Add student profile details to the central institutional registry.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Student Demo"
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Student Roll / Code</label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. CS100001"
                  className="h-10 text-xs rounded-xl font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Academic Year</label>
                <Input
                  type="number"
                  min={1}
                  max={4}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Branch / Department</label>
              <Input
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                placeholder="e.g. Computer Science & Engineering"
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Attendance %</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.attendancePct}
                  onChange={(e) => setFormData({ ...formData, attendancePct: Number(e.target.value) })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">CGPA</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                className="rounded-xl text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#4f46e5] hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Save Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* VIEW DETAILS MODAL */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Eye className="size-5 text-indigo-600" /> Student Profile Details
            </DialogTitle>
          </DialogHeader>

          {activeItem && (
            <div className="space-y-3 text-xs pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
                <p><span className="font-bold text-slate-500">Name:</span> <span className="font-extrabold text-slate-900">{activeItem.name}</span></p>
                <p><span className="font-bold text-slate-500">ID / Code:</span> <span className="font-mono font-bold text-indigo-600">{activeItem.code}</span></p>
                <p><span className="font-bold text-slate-500">Branch:</span> {activeItem.branch}</p>
                <p><span className="font-bold text-slate-500">Academic Year:</span> Year {activeItem.year}</p>
                <p><span className="font-bold text-slate-500">Attendance:</span> {activeItem.attendancePct}%</p>
                <p><span className="font-bold text-slate-500">CGPA:</span> {activeItem.cgpa.toFixed(2)}</p>
                <p><span className="font-bold text-slate-500">Email:</span> {activeItem.email}</p>
                <p><span className="font-bold text-slate-500">Phone:</span> {activeItem.phone}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)} className="rounded-xl text-xs font-bold cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT STUDENT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900">
              Edit Student Record
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Branch</label>
              <Input
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Attendance %</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.attendancePct}
                  onChange={(e) => setFormData({ ...formData, attendancePct: Number(e.target.value) })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">CGPA</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="rounded-xl text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#4f46e5] hover:bg-indigo-700 text-white font-[#ffffff] font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Update Student
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* FILTER DIALOG MODAL */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-xs rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Filter className="size-4 text-indigo-600" /> Filter Student Records
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 pt-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setIsFilterOpen(false);
                toast.info("Showing all departments & branches");
              }}
              className="w-full bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 p-3 rounded-xl font-bold text-left border border-slate-100 transition-colors"
            >
              All Branches & Years
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("Computer Science");
                setIsFilterOpen(false);
                toast.info("Filtered by Computer Science & Engineering");
              }}
              className="w-full bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 p-3 rounded-xl font-bold text-left border border-slate-100 transition-colors"
            >
              Computer Science & Engineering
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("Electronics");
                setIsFilterOpen(false);
                toast.info("Filtered by Electronics & Communication");
              }}
              className="w-full bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 p-3 rounded-xl font-bold text-left border border-slate-100 transition-colors"
            >
              Electronics & Communication
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
