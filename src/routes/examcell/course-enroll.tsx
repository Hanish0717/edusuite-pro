import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { 
  BookOpen, 
  PlusCircle, 
  Trash2, 
  Send,
  Building,
  GraduationCap,
  CheckCircle,
  BarChart2,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  Award,
  Users
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  getMockCourses, 
  saveMockCourses, 
  getMockStudents,
  MockCourseOffering 
} from "@/lib/mock-examcell-state";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  CartesianGrid 
} from "recharts";

export const Route = createFileRoute("/examcell/course-enroll")({
  head: () => ({
    meta: [{ title: "Course & Exam Enroll — EduSuite Pro" }],
  }),
  component: CourseEnrollPage,
});

const FACULTY_LIST = [
  { id: "f1", name: "Kanneganti Suresh", department: "CSE" },
  { id: "f2", name: "Dr. K. Jyothi", department: "AIML" },
  { id: "f3", name: "Dr. Suresh Babu", department: "CSE" },
  { id: "f4", name: "Dr. Clara Oswald", department: "ECE" },
  { id: "f5", name: "Dr. John Smith", department: "AIDS" }
];

const DEPARTMENTS = ["CSE", "AIML", "AIDS", "ECE", "EEE", "MECH", "CIVIL", "IT"];

function CourseEnrollPage() {
  const [activeTab, setActiveTab] = useState<"courses" | "exams">("courses");
  const [courses, setCourses] = useState<MockCourseOffering[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  // Filter states
  const [selectedDept, setSelectedDept] = useState("CSE");
  const [selectedYear, setSelectedYear] = useState("1");
  const [selectedSem, setSelectedSem] = useState("1");
  const [showAddForm, setShowAddForm] = useState(true);

  // Form states
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [credits, setCredits] = useState("4.0");
  const [courseType, setCourseType] = useState("Integrated Subject");
  const [sectionsInput, setSectionsInput] = useState<{ section: string; dept: string; mentor_id: string }[]>([
    { section: "A", dept: "CSE", mentor_id: "f1" }
  ]);

  useEffect(() => {
    setCourses(getMockCourses());
    setStudents(getMockStudents());
  }, []);

  const getSemestersForYear = (yr: string) => {
    switch (yr) {
      case "1": return [1, 2];
      case "2": return [3, 4];
      case "3": return [5, 6];
      case "4": return [7, 8];
      default: return [];
    }
  };

  const filteredCourses = courses.filter(c => 
    c.department === selectedDept && 
    c.year === Number(selectedYear) && 
    c.semester === Number(selectedSem)
  );

  const totalEnrollments = courses.reduce((acc, c) => acc + (c.status === "Approved" ? 25 : 0), 0);

  // Chart data formatting - Department-wise comparison for course registrations
  const courseChartData = DEPARTMENTS.map(dName => {
    const enrolled = courses.filter(c => c.department === dName && c.status === "Approved").length * 24;
    const offeredCount = courses.filter(c => c.department === dName).length;
    return {
      name: dName,
      "Enrolled": enrolled,
      "Offered Courses": offeredCount
    };
  });

  // Chart data formatting - Department-wise comparison for exams
  const examChartData = DEPARTMENTS.map(dName => {
    const deptStudents = students.filter(s => s.department === dName);
    
    // Exact visual fallbacks from screenshots if no dynamic students exist
    let enrolled = dName === "CSE" ? 0 : dName === "AIML" ? 9 : 0;
    let total = dName === "CSE" ? 25 : dName === "AIML" ? 24 : dName === "AIDS" ? 24 : 24;
    
    if (deptStudents.length > 0) {
      enrolled = deptStudents.filter(s => s.is_registered).length;
      total = deptStudents.length;
    }
    
    return {
      name: dName,
      "Enrolled": enrolled,
      "Total Students": total
    };
  });

  const totalStudentsCount = examChartData.reduce((acc, curr) => acc + curr["Total Students"], 0);
  const totalExamRegs = examChartData.reduce((acc, curr) => acc + curr["Enrolled"], 0);
  const avgExamRate = totalStudentsCount > 0 ? ((totalExamRegs / totalStudentsCount) * 100).toFixed(1) : "0";

  const handleAddSection = () => {
    const nextChar = String.fromCharCode(65 + sectionsInput.length); // B, C, D...
    setSectionsInput([
      ...sectionsInput, 
      { section: nextChar, dept: selectedDept, mentor_id: FACULTY_LIST.filter(f => f.department === selectedDept)[0]?.id || "f1" }
    ]);
  };

  const handleRemoveSection = (index: number) => {
    if (sectionsInput.length === 1) return;
    setSectionsInput(sectionsInput.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index: number, field: "section" | "dept" | "mentor_id", value: string) => {
    setSectionsInput(prev => prev.map((item, idx) => {
      if (idx === index) {
        const updated = { ...item, [field]: value };
        if (field === "dept") {
          const filtered = FACULTY_LIST.filter(f => f.department === value);
          updated.mentor_id = filtered[0]?.id || "f1";
        }
        return updated;
      }
      return item;
    }));
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseName.trim()) {
      toast.error("Please fill in course code and name.");
      return;
    }

    const newCourse: MockCourseOffering = {
      id: `course_${Date.now()}`,
      course_code: courseCode.trim().toUpperCase(),
      course_name: courseName.trim(),
      department: selectedDept,
      year: Number(selectedYear),
      semester: Number(selectedSem),
      credits: Number(credits),
      status: 'Pending',
      sections: sectionsInput.map(s => s.section)
    };

    const updated = [...courses, newCourse];
    setCourses(updated);
    saveMockCourses(updated);
    toast.success("New course offered successfully!");
    
    // Reset Form
    setCourseCode("");
    setCourseName("");
    setSectionsInput([{ section: "A", dept: selectedDept, mentor_id: FACULTY_LIST.filter(f => f.department === selectedDept)[0]?.id || "f1" }]);
  };

  const handleDeleteCourse = (courseId: string) => {
    const updated = courses.filter(c => c.id !== courseId);
    setCourses(updated);
    saveMockCourses(updated);
    toast.success("Subject deleted successfully!");
  };

  const handleSubmitApproval = () => {
    const updated = courses.map(c => {
      if (c.department === selectedDept && c.year === Number(selectedYear) && c.semester === Number(selectedSem)) {
        return { ...c, status: 'Pending' as const }; // Re-submit
      }
      return c;
    });
    setCourses(updated);
    saveMockCourses(updated);
    toast.success("Courses submitted to Officer successfully!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="border-b border-border pb-4">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
          Course & Exam Enroll
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
          Offer new courses, manage academic semesters, assign mentors, and review student registration statistics.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "courses"
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/10 font-black"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("courses")}
        >
          <BookOpen className="size-4" />
          Course Offerings & Enrollments
        </button>
        <button
          className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "exams"
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/10 font-black"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("exams")}
        >
          <Award className="size-4" />
          Exam Registration Analytics
        </button>
      </div>

      {activeTab === "courses" ? (
        <div className="space-y-6">
          {/* Analytics Stats */}
          <div className="grid md:grid-cols-4 gap-6 animate-fade-in">
            <Card className="p-4 border border-slate-100 bg-white shadow-xs hover:shadow-sm transition rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-black text-slate-400">Total Courses Offered</div>
                <div className="text-xl font-bold mt-2 text-indigo-650">{courses.length}</div>
              </div>
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <BookOpen className="size-5" />
              </div>
            </Card>

            <Card className="p-4 border border-slate-100 bg-white shadow-xs hover:shadow-sm transition rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-black text-slate-400">Total Student Enrollments</div>
                <div className="text-xl font-bold mt-2 text-emerald-650">{totalEnrollments}</div>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle className="size-5" />
              </div>
            </Card>

            <Card className="p-4 border border-slate-100 bg-white shadow-xs hover:shadow-sm transition rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-black text-slate-400">Offered Departments</div>
                <div className="text-xl font-bold mt-2 text-amber-650">{DEPARTMENTS.length}</div>
              </div>
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <Building className="size-5" />
              </div>
            </Card>

            <Card className="p-4 border border-slate-100 bg-white shadow-xs hover:shadow-sm transition rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-black text-slate-400">Active Semesters</div>
                <div className="text-xl font-bold mt-2 text-pink-650">8</div>
              </div>
              <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl">
                <GraduationCap className="size-5" />
              </div>
            </Card>
          </div>

          {/* Visual Charts */}
          <Card className="p-5 border border-slate-100 bg-white shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="size-5 text-indigo-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  Department wise Course Offerings & Enrollments Comparison
                </h3>
              </div>
              <Badge variant="secondary" className="text-[10px] font-bold">Branch Comparison</Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} fontStyle="bold" />
                  <YAxis stroke="#94A3B8" fontSize={10} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                  <Bar dataKey="Enrolled" name="Students Enrolled" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Offered Courses" name="Offered Course Count" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Main Cohort Selectors */}
          <Card className="p-4 bg-slate-50/50 border border-slate-200 rounded-2xl shadow-2xs">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1.5">Branch / Department</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold outline-none cursor-pointer"
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1.5">Target Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    const yr = e.target.value;
                    setSelectedYear(yr);
                    const sems = getSemestersForYear(yr);
                    if (!sems.includes(Number(selectedSem))) {
                      setSelectedSem(String(sems[0]));
                    }
                  }}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1.5">Semester</label>
                <select
                  value={selectedSem}
                  onChange={(e) => setSelectedSem(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold outline-none cursor-pointer"
                >
                  {getSemestersForYear(selectedYear).map(s => (
                    <option key={s} value={String(s)}>Sem {s}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Cohort Status Alert & Submit Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border text-xs font-bold bg-white shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-[10px] font-black uppercase">Cohort Status:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 font-black">
                Drafting (Pending Submission)
              </span>
            </div>

            <button
              onClick={handleSubmitApproval}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all cursor-pointer shadow-md font-black uppercase text-[10px] tracking-wider"
            >
              Submit Semester Subjects for Approval
            </button>
          </div>

          {/* Main Split Grid */}
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* Offered Courses Catalog */}
            <div className={showAddForm ? "lg:col-span-2" : "lg:col-span-3"}>
              <Card className="p-5 border border-slate-100 bg-white shadow-xs rounded-2xl">
                <div className="flex items-center justify-between gap-4 mb-4 border-b pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-5 text-indigo-600" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      Offered Subjects ({selectedDept} - Sem {selectedSem})
                    </h3>
                  </div>

                  <button
                    onClick={() => setShowAddForm(prev => !prev)}
                    className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="size-4" /> {showAddForm ? "Hide Form" : "Add Subject"}
                  </button>
                </div>

                {filteredCourses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-xs border border-dashed rounded-xl bg-slate-50/50 flex flex-col items-center justify-center gap-2">
                    <BookOpen className="size-8 text-slate-400" />
                    <p className="font-bold text-slate-700">No subjects offered for Sem {selectedSem} yet</p>
                    <p className="text-[10px] text-muted-foreground max-w-[280px] leading-relaxed">
                      Click the <strong>"Add Subject"</strong> button on the top right to define and offer subjects for this cohort.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-100 rounded-xl">
                    <table className="min-w-full divide-y divide-slate-100 text-xs">
                      <thead className="bg-slate-50 text-slate-650 font-black uppercase text-[9px] tracking-wider">
                        <tr>
                          <th className="px-4 py-3 text-left">Code</th>
                          <th className="px-4 py-3 text-left">Course Name</th>
                          <th className="px-4 py-3 text-left">Instructors / Section</th>
                          <th className="px-4 py-3 text-left">Type</th>
                          <th className="px-4 py-3 text-center">Credits</th>
                          <th className="px-4 py-3 text-center">Registrations</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white font-semibold text-slate-700">
                        {filteredCourses.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/50 transition">
                            <td className="px-4 py-3 font-mono font-bold text-indigo-650">{c.course_code}</td>
                            <td className="px-4 py-3 font-bold text-slate-800">{c.course_name}</td>
                            <td className="px-4 py-3 text-slate-500 font-semibold">
                              <div className="flex flex-col gap-0.5">
                                {c.sections.map(s => {
                                  const mentor = FACULTY_LIST.find(f => f.department === selectedDept);
                                  return (
                                    <div key={s} className="text-[11px]">
                                      Sec {s}: <span className="font-black text-slate-800">{mentor?.name || "Dr. Ravi Kumar"}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-400 font-semibold">{c.course_type || "Integrated Subject"}</td>
                            <td className="px-4 py-3 text-center font-bold text-slate-900">{c.credits}.0</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-100">
                                {c.status === "Approved" ? 25 : 0}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleDeleteCourse(c.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                title="Delete Subject"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>

            {/* Offer New Course Form */}
            {showAddForm && (
              <div className="lg:col-span-1">
                <Card className="p-5 border border-slate-100 bg-white shadow-xs rounded-2xl space-y-4">
                  <div className="flex items-center gap-1.5 border-b pb-2">
                    <PlusCircle className="size-4.5 text-indigo-600" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-850">Add Subject</h3>
                  </div>

                  <form onSubmit={handleSaveCourse} className="space-y-3.5 text-xs font-semibold">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Branch</label>
                        <input
                          type="text"
                          value={selectedDept}
                          disabled
                          className="w-full border border-slate-200 rounded-xl p-2 bg-slate-100 text-muted-foreground outline-none cursor-not-allowed font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Semester</label>
                        <input
                          type="text"
                          value={`Sem ${selectedSem}`}
                          disabled
                          className="w-full border border-slate-200 rounded-xl p-2 bg-slate-100 text-muted-foreground outline-none cursor-not-allowed font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subject Code</label>
                      <Input
                        placeholder="e.g. CS302"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                        className="h-9 rounded-xl font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subject Name</label>
                      <Input
                        placeholder="e.g. Theory of Computation"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        className="h-9 rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Credits</label>
                        <select
                          className="w-full text-xs border border-slate-200 rounded-xl h-9 px-2 bg-background focus:ring-1 focus:ring-indigo-500 cursor-pointer font-bold"
                          value={credits}
                          onChange={(e) => setCredits(e.target.value)}
                        >
                          <option value="1.5">Lab (1.5)</option>
                          <option value="3.0">Normal (3.0)</option>
                          <option value="4.0">Integrated (4.0)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Course Type</label>
                        <select
                          className="w-full text-xs border border-slate-200 rounded-xl h-9 px-2 bg-background focus:ring-1 focus:ring-indigo-500 cursor-pointer font-bold"
                          value={courseType}
                          onChange={(e) => setCourseType(e.target.value)}
                        >
                          <option value="Normal Subject">Theory</option>
                          <option value="Integrated Subject">Integrated</option>
                          <option value="Lab">Lab</option>
                          <option value="Open Elective">Open Elective</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between border-t pt-2 border-slate-100">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Section Mentors</label>
                        <button
                          type="button"
                          onClick={handleAddSection}
                          className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                        >
                          + Add Section
                        </button>
                      </div>

                      {sectionsInput.map((row, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="A"
                            className="w-10 text-xs border border-slate-200 rounded-xl p-1.5 bg-background focus:ring-1 focus:ring-indigo-500 text-center font-bold"
                            value={row.section}
                            onChange={(e) => handleSectionChange(idx, "section", e.target.value.toUpperCase())}
                          />
                          <select
                            className="w-16 text-xs border border-slate-200 rounded-xl p-1.5 bg-background focus:ring-1 focus:ring-indigo-500 cursor-pointer font-bold text-slate-700"
                            value={row.dept}
                            onChange={(e) => handleSectionChange(idx, "dept", e.target.value)}
                          >
                            {DEPARTMENTS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                          <select
                            className="flex-1 text-[11px] border border-slate-200 rounded-xl p-1.5 bg-background focus:ring-1 focus:ring-indigo-500 cursor-pointer font-bold text-slate-700"
                            value={row.mentor_id}
                            onChange={(e) => handleSectionChange(idx, "mentor_id", e.target.value)}
                          >
                            {FACULTY_LIST.map(f => (
                              <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                          </select>
                          {sectionsInput.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSection(idx)}
                              className="text-xs text-rose-500 hover:text-rose-700 font-bold p-1 cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-4 bg-indigo-600 text-white rounded-xl py-2.5 font-black text-xs hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer shadow-md uppercase tracking-wider"
                    >
                      Offer Subject
                    </button>
                  </form>
                </Card>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Exam Analytics Stats */}
          <div className="grid md:grid-cols-4 gap-6 animate-fade-in">
            <Card className="p-4 border border-slate-100 bg-white shadow-xs hover:shadow-sm transition rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-black text-slate-400">Total Exam Registrations</div>
                <div className="text-xl font-bold mt-2 text-indigo-650">{totalExamRegs}</div>
              </div>
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <CheckCircle className="size-5" />
              </div>
            </Card>

            <Card className="p-4 border border-slate-100 bg-white shadow-xs hover:shadow-sm transition rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-black text-slate-400">Total Student Strength</div>
                <div className="text-xl font-bold mt-2 text-slate-800">{totalStudentsCount}</div>
              </div>
              <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
                <Users className="size-5" />
              </div>
            </Card>

            <Card className="p-4 border border-slate-100 bg-white shadow-xs hover:shadow-sm transition rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-black text-slate-400">Exam Registration Rate</div>
                <div className="text-xl font-bold mt-2 text-emerald-650">{avgExamRate}%</div>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Award className="size-5" />
              </div>
            </Card>

            <Card className="p-4 border border-slate-100 bg-white shadow-xs hover:shadow-sm transition rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-black text-slate-400">Subject Syllabus Base</div>
                <div className="text-xl font-bold mt-2 text-amber-650">{courses.length}</div>
              </div>
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <BookOpen className="size-5" />
              </div>
            </Card>
          </div>

          {/* Department dual-bar chart */}
          <Card className="p-5 border border-slate-100 bg-white shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="size-5 text-indigo-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  Department Branch Wise Exam Registration Comparison
                </h3>
              </div>
              <Badge variant="secondary" className="text-[10px] font-bold">Dual Bar Metric</Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={examChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} fontStyle="bold" />
                  <YAxis stroke="#94A3B8" fontSize={10} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                  <Bar dataKey="Enrolled" name="Registered for Exam" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Total Students" name="Total Strength" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Branch-wise Detailed Analytics Table */}
          <Card className="p-5 border border-slate-100 bg-white shadow-xs rounded-2xl">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <FileSpreadsheet className="size-5 text-indigo-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Branch wise Statistics Overview
              </h3>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="min-w-full divide-y divide-slate-100 text-xs">
                <thead className="bg-slate-50 text-slate-650 font-black uppercase text-[9px] tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Branch / Department Name</th>
                    <th className="px-6 py-3 text-center">Exam Enrolled Students</th>
                    <th className="px-6 py-3 text-center">Total Strength</th>
                    <th className="px-6 py-3 text-center">Enrollment Progress Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white font-semibold text-slate-700">
                  {examChartData.map((d) => {
                    const rate = d["Total Students"] > 0 ? ((d["Enrolled"] / d["Total Students"]) * 100).toFixed(0) : "0";
                    return (
                      <tr key={d.name} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-3 font-bold text-slate-800">{d.name}</td>
                        <td className="px-6 py-3 text-center font-bold text-indigo-650">{d["Enrolled"]}</td>
                        <td className="px-6 py-3 text-center text-slate-500 font-semibold">{d["Total Students"]}</td>
                        <td className="px-6 py-3 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-24 bg-slate-150 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-indigo-600 h-full rounded-full transition-all"
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-700">{rate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
