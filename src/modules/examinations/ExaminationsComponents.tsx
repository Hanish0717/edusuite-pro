import React from "react";
import { Link } from "@tanstack/react-router";
import {
  FileSpreadsheet,
  TrendingUp,
  Award,
  Users,
  CalendarCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  FileCheck2,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const data = [
  { name: "Sem 1", passRate: 85, avgMarks: 72 },
  { name: "Sem 2", passRate: 88, avgMarks: 75 },
  { name: "Sem 3", passRate: 82, avgMarks: 68 },
  { name: "Sem 4", passRate: 90, avgMarks: 78 },
  { name: "Sem 5", passRate: 95, avgMarks: 82 },
  { name: "Sem 6", passRate: 92, avgMarks: 80 },
];

const upcomingExams = [
  { id: 1, subject: "CS401: Advanced AI", date: "Aug 10, 2026", time: "09:30 AM", hall: "LH-301" },
  { id: 2, subject: "EC304: VLSI Design", date: "Aug 12, 2026", time: "09:30 AM", hall: "LH-204" },
  { id: 3, subject: "ME308: CAD", date: "Aug 14, 2026", time: "02:00 PM", hall: "LH-105" },
];

const recentActivities = [
  { id: 1, text: "Dr. Sarah published internal marks for CS401.", time: "2 hours ago", icon: FileCheck2 },
  { id: 2, text: "Admin generated 420 Hall Tickets for CSE Dept.", time: "4 hours ago", icon: Award },
  { id: 3, text: "New Exam Schedule added for Spring 2026.", time: "1 day ago", icon: CalendarIcon },
];

import { useLocation, useNavigate } from "@tanstack/react-router";

export function ExaminationsModuleView() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tabFromUrl = searchParams.get("tab");

  const [exams, setExams] = useState<ExamSchedule[]>(INITIAL_EXAMS);
  const [results, setResults] = useState<StudentResultRecord[]>(INITIAL_RESULTS);
  const [revaluations, setRevaluations] = useState<RevaluationRequest[]>(INITIAL_REVALUATIONS);
  const [activeTab, setActiveTab] = useState<"schedules" | "hall-tickets" | "marks" | "results" | "revaluations">("schedules");

  useEffect(() => {
    if (tabFromUrl === "schedule" || tabFromUrl === "schedules") setActiveTab("schedules");
    else if (tabFromUrl === "hall-tickets") setActiveTab("hall-tickets");
    else if (tabFromUrl === "marks") setActiveTab("marks");
    else if (tabFromUrl === "results") setActiveTab("results");
    else if (tabFromUrl === "revaluations") setActiveTab("revaluations");
  }, [tabFromUrl]);

  const handleTabChange = (newTab: "schedules" | "hall-tickets" | "marks" | "results" | "revaluations") => {
    setActiveTab(newTab);
    const param = newTab === "schedules" ? "schedule" : newTab;
    navigate({ to: "/examinations", search: { tab: param } });
  };

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Dialog States
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  const [isPublishResultOpen, setIsPublishResultOpen] = useState(false);

  // Forms
  const [examForm, setExamForm] = useState<Partial<ExamSchedule>>({
    examCode: "REG-APR-2026",
    subjectCode: "CS405",
    subjectName: "Cloud Computing & Microservices",
    department: "CSE",
    semester: "Semester 7",
    examDate: "2026-08-20",
    session: "Forenoon (09:30 AM - 12:30 PM)",
    hallNo: "LH-305",
  });

  const [resultForm, setResultForm] = useState<Partial<StudentResultRecord>>({
    rollNo: "23AIDS012",
    studentName: "Rohan Varma",
    department: "AI&DS",
    semester: "Semester 6",
    sgpa: 8.90,
    cgpa: 8.82,
    resultStatus: "Passed (Distinction)",
  });

  const loadData = async () => {
    setLoading(true);
    const [ex, res, rev] = await Promise.all([
      fetchExamSchedules(),
      fetchStudentResults(),
      fetchRevaluations(),
    ]);
    setExams(ex);
    setResults(res);
    setRevaluations(rev);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredExams = exams.filter((e) => {
    return (
      e.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
      e.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.hallNo.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAddExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.subjectCode || !examForm.subjectName) return toast.error("Enter subject code and name");
    const created = await createExamSchedule(examForm);
    setExams((prev) => [created, ...prev]);
    setIsAddExamOpen(false);
    toast.success(`Exam schedule for ${created.subjectCode} created!`);
  };

  const handlePublishResultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultForm.rollNo || !resultForm.studentName) return toast.error("Enter student roll number and name");
    const created = await publishResultRecord(resultForm);
    setResults((prev) => [created, ...prev]);
    setIsPublishResultOpen(false);
    toast.success(`Exam result published for ${created.studentName} (${created.rollNo}): SGPA ${created.sgpa}!`);
  };

  const handleExportCSV = () => {
    const headers = ["Roll No", "Student Name", "Department", "Semester", "SGPA", "CGPA", "Credits", "Result Status", "Backlogs", "Published Date"];
    const rows = results.map((r) => [r.rollNo, `"${r.studentName}"`, r.department, `"${r.semester}"`, r.sgpa, r.cgpa, r.totalCredits, `"${r.resultStatus}"`, r.backlogCount, r.publishedDate]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Master_Grade_Sheet_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported master grade sheet to CSV!");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <FileSpreadsheet className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Examinations Dashboard
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Live Overview
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Monitor examination schedules, results, and evaluation metrics.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" className="h-9 bg-brand-gradient text-white shadow-glow text-xs">
            <Link to="/examinations/schedule">Manage Schedules</Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Exams</span>
            <CalendarCheck className="size-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-blue-600 font-mono">14</div>
            <div className="text-xs text-muted-foreground mt-1">Scheduled for this month</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Hall Tickets</span>
            <Users className="size-4 text-indigo-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-indigo-600 font-mono">1,240</div>
            <div className="text-xs text-muted-foreground mt-1">Generated successfully</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Pass Rate</span>
            <TrendingUp className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-emerald-600 font-mono">92.4%</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">+2.1% from last sem</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Revaluations</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-amber-600 font-mono">42</div>
            <div className="text-xs text-amber-600 font-medium mt-1">Pending approvals</div>
          </div>
        </div>
      </div>

      {/* SUBPARTS TAB SWITCHER */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-muted/60 border border-border/80 overflow-x-auto">
        <button onClick={() => handleTabChange("schedules")} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "schedules" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
          1. Exam Schedules ({exams.length})
        </button>
        <button onClick={() => handleTabChange("hall-tickets")} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "hall-tickets" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
          2. Hall Tickets (4,250)
        </button>
        <button onClick={() => handleTabChange("marks")} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "marks" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
          3. Internal Marks (12 Courses)
        </button>
        <button onClick={() => handleTabChange("results")} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "results" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
          4. Results & Grades ({results.length})
        </button>
        <button onClick={() => handleTabChange("revaluations")} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "revaluations" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
          5. Reevaluations ({revaluations.length})
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <div className="rounded-2xl bg-card border border-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Upcoming Exams</h3>
            <Link to="/examinations/schedule" className="text-xs text-primary font-semibold hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {upcomingExams.map(exam => (
              <div key={exam.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20">
                <div>
                  <p className="font-semibold text-sm">{exam.subject}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{exam.date} • {exam.time}</p>
                </div>
                <Badge variant="outline" className="font-mono text-xs bg-card">{exam.hall}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 2: HALL TICKETS */}
      {activeTab === "hall-tickets" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground">Hall Tickets & Admit Cards Verification</h3>
              <p className="text-xs text-muted-foreground">Barcode verification, hall allocation, and student exam permit downloads</p>
            </div>
            <Button size="sm" onClick={() => toast.success("Hall tickets generated for 4,250 registered candidates!")} className="h-8 text-xs font-semibold bg-brand-gradient text-white">
              Release Hall Tickets
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Roll No & Student Name</th>
                  <th className="py-3 px-3">Branch & Semester</th>
                  <th className="py-3 px-3">Hall Ticket No</th>
                  <th className="py-3 px-3">Exam Center</th>
                  <th className="py-3 px-3">Clearance Status</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {[
                  { roll: "22CS101", name: "Aarav Sharma", dept: "CSE", sem: "Semester 6", htNo: "HT-2026-CSE-101", center: "Block B - LH-205", status: "Verified & Issued" },
                  { roll: "22CS102", name: "Ananya Rao", dept: "CSE", sem: "Semester 6", htNo: "HT-2026-CSE-102", center: "Block B - LH-205", status: "Verified & Issued" },
                  { roll: "22EC045", name: "Vikram Reddy", dept: "ECE", sem: "Semester 6", htNo: "HT-2026-ECE-045", center: "Block C - LH-102", status: "Verified & Issued" },
                  { roll: "22ME089", name: "Priya Nair", dept: "ME", sem: "Semester 6", htNo: "HT-2026-ME-089", center: "Engg Block - LH-301", status: "Pending Dues Clearance" },
                ].map((ht) => (
                  <tr key={ht.roll} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground">{ht.name}</div>
                      <div className="text-[0.68rem] text-muted-foreground font-mono">{ht.roll}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-foreground">{ht.dept} ({ht.sem})</td>
                    <td className="py-3 px-3 font-mono text-primary font-bold">{ht.htNo}</td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{ht.center}</td>
                    <td className="py-3 px-3">
                      <Badge className={ht.status.includes("Verified") ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                        {ht.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <Button size="sm" variant="outline" onClick={() => toast.success(`Downloading Hall Ticket for ${ht.name}`)} className="h-7 text-[0.7rem] gap-1 border-primary/30 text-primary">
                        <Download className="size-3" /> Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INTERNAL MARKS */}
      {activeTab === "marks" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground">Internal Assessment & Continuous Evaluation (CIE)</h3>
              <p className="text-xs text-muted-foreground">Mid-term exams, quizzes, assignments, and practical continuous assessment breakdown</p>
            </div>
            <Button size="sm" onClick={() => toast.success("Internal marks locked and frozen for Controller of Exams audit!")} className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
              Lock & Freeze Marks
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Student Name & Roll No</th>
                  <th className="py-3 px-3">Subject Code & Name</th>
                  <th className="py-3 px-3">Mid Test 1 (30)</th>
                  <th className="py-3 px-3">Mid Test 2 (30)</th>
                  <th className="py-3 px-3">Assignments (10)</th>
                  <th className="py-3 px-3">CIE Total (40)</th>
                  <th className="py-3 px-3">Audit Lock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {[
                  { roll: "22CS101", name: "Aarav Sharma", code: "CS501", sub: "Machine Learning & Neural Nets", m1: 28, m2: 27, assign: 10, total: 38, status: "Locked" },
                  { roll: "22CS102", name: "Ananya Rao", code: "CS502", sub: "Compiler Design & Lexical Parsing", m1: 26, m2: 29, assign: 9, total: 37, status: "Locked" },
                  { roll: "22EC045", name: "Vikram Reddy", code: "EC501", sub: "VLSI System Design", m1: 24, m2: 25, assign: 8, total: 33, status: "Pending Audit" },
                  { roll: "22ME089", name: "Priya Nair", code: "ME501", sub: "Thermal Engineering", m1: 29, m2: 28, assign: 10, total: 39, status: "Locked" },
                ].map((im) => (
                  <tr key={im.roll} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground">{im.name}</div>
                      <div className="text-[0.68rem] text-muted-foreground font-mono">{im.roll}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-foreground">{im.code}: {im.sub}</td>
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{im.m1}/30</td>
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{im.m2}/30</td>
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{im.assign}/10</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600 text-sm">{im.total}/40</td>
                    <td className="py-3 px-3">
                      <Badge className={im.status === "Locked" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                        {im.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RESULTS */}
      {activeTab === "results" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Roll No</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">SGPA</th>
                  <th className="py-3 px-3">CGPA</th>
                  <th className="py-3 px-3">Result Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{r.rollNo}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{r.studentName}</td>
                    <td className="py-3 px-3">{r.department} ({r.semester})</td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">{r.sgpa}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600">{r.cgpa}</td>
                    <td className="py-3 px-3">
                      <Badge className={r.resultStatus.includes("Distinction") ? "bg-purple-500/10 text-purple-600" : r.resultStatus.includes("Passed") ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}>
                        {r.resultStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
