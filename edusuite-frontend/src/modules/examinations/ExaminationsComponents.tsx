import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts";
import {
  FileSpreadsheet,
  Plus,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  Award,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Calendar,
  Clock,
  Send,
  Sparkles,
  ArrowRight,
  Users,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  fetchExamSchedules,
  fetchStudentResults,
  fetchRevaluations,
  createExamSchedule,
  publishResultRecord,
  INITIAL_EXAMS,
  INITIAL_RESULTS,
  INITIAL_REVALUATIONS,
  type ExamSchedule,
  type StudentResultRecord,
  type RevaluationRequest,
} from "./ExaminationsService";

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
  { id: 1, text: "Dr. Sarah published internal marks for CS401.", time: "2 hours ago", icon: FileCheck },
  { id: 2, text: "Admin generated 420 Hall Tickets for CSE Dept.", time: "4 hours ago", icon: Award },
  { id: 3, text: "New Exam Schedule added for Spring 2026.", time: "1 day ago", icon: Calendar },
];

export function ExaminationsModuleView() {
  const [exams, setExams] = useState<ExamSchedule[]>(INITIAL_EXAMS);
  const [results, setResults] = useState<StudentResultRecord[]>(INITIAL_RESULTS);
  const [revaluations, setRevaluations] = useState<RevaluationRequest[]>(INITIAL_REVALUATIONS);
  const [activeTab, setActiveTab] = useState<"overview" | "schedules" | "results" | "revaluations">("overview");

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
    if (!examForm.subjectCode || !examForm.subjectName) {
      toast.error("Enter subject code and name");
      return;
    }
    const created = await createExamSchedule(examForm as any);
    setExams((prev) => [created, ...prev]);
    setIsAddExamOpen(false);
    toast.success(`Exam schedule for ${created.subjectCode} created!`);
  };

  const handlePublishResultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultForm.rollNo || !resultForm.studentName) {
      toast.error("Enter student roll number and name");
      return;
    }
    const created = await publishResultRecord(resultForm as any);
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <FileSpreadsheet className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Examinations & Controller of Evaluation
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Examination & Grading Core
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Semester schedules, hall ticket generation, valuation ledgers, SGPA/CGPA result publication.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Export Grade Sheet
          </Button>
          <Button size="sm" onClick={() => setIsPublishResultOpen(true)} variant="outline" className="h-9 border-primary/30 text-primary gap-2 text-xs font-semibold">
            <Send className="size-4" /> Publish Results
          </Button>
          <Button size="sm" onClick={() => setIsAddExamOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
            <Plus className="size-4" /> Schedule Exam
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Scheduled Exams</span>
            <Calendar className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">{exams.length} Conducted</p>
          <p className="text-[0.68rem] text-muted-foreground">Spring 2026 Regular/Supply</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Hall Tickets Generated</span>
            <FileCheck className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">4,250 Tickets</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">Verified barcode barcodes</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Published Results Rate</span>
            <CheckCircle2 className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">98.4% Published</p>
          <p className="text-[0.68rem] text-muted-foreground">UGC Credit System Compliant</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Institutional CGPA</span>
            <Award className="size-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">8.42 CGPA Avg</p>
          <p className="text-[0.68rem] text-purple-600 font-medium">Academic Year 2025-26</p>
        </div>
      </div>

      {/* SUBPARTS TAB SWITCHER */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80 flex-wrap">
        <button onClick={() => setActiveTab("overview")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "overview" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          📊 Dashboard Overview
        </button>
        <button onClick={() => setActiveTab("schedules")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "schedules" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          📅 Exam Schedules ({exams.length})
        </button>
        <button onClick={() => setActiveTab("results")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "results" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          🏆 Master Grade Ledger ({results.length})
        </button>
        <button onClick={() => setActiveTab("revaluations")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "revaluations" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          📝 Revaluation Ledger ({revaluations.length})
        </button>
      </div>

      {/* TAB 0: OVERVIEW */}
      {activeTab === "overview" && (
        <>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Chart */}
            <div className="lg:col-span-2 rounded-2xl bg-card border border-border shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Performance Trends</h3>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    />
                    <Line type="monotone" dataKey="passRate" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Pass Rate (%)" />
                    <Line type="monotone" dataKey="avgMarks" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} name="Avg Marks" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl bg-card border border-border shadow-sm p-5 flex flex-col">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Quick Actions</h3>
              <div className="flex-1 space-y-2">
                <Link to="/examinations/schedule" className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Calendar className="size-4" /></div>
                    <span className="text-sm font-semibold">Schedule Exam</span>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
                <Link to="/examinations/hall-tickets" className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500"><Users className="size-4" /></div>
                    <span className="text-sm font-semibold">Generate Hall Tickets</span>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
                <Link to="/examinations/internal-marks" className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><CheckCircle className="size-4" /></div>
                    <span className="text-sm font-semibold">Enter Internal Marks</span>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
                <Link to="/results" className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><Award className="size-4" /></div>
                    <span className="text-sm font-semibold">Publish Results</span>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              </div>
            </div>
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

            {/* Recent Activity */}
            <div className="rounded-2xl bg-card border border-border shadow-sm p-5">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map(act => (
                  <div key={act.id} className="flex gap-3">
                    <div className="relative mt-1">
                      <div className="p-1.5 rounded-full bg-primary/10 text-primary z-10 relative">
                        <act.icon className="size-3.5" />
                      </div>
                      <div className="absolute top-6 bottom-[-16px] left-1/2 w-px bg-border -translate-x-1/2 last:hidden" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">{act.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB 1: SCHEDULES */}
      {activeTab === "schedules" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Subject Code & Name</th>
                  <th className="py-3 px-3">Department & Sem</th>
                  <th className="py-3 px-3">Exam Date & Session</th>
                  <th className="py-3 px-3">Hall Location</th>
                  <th className="py-3 px-3">Valuation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredExams.map((e) => (
                  <tr key={e.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground">{e.subjectCode}: {e.subjectName}</div>
                      <div className="text-[0.68rem] text-primary font-mono">{e.examCode}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-foreground">{e.department} ({e.semester})</td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{e.examDate} &middot; {e.session}</td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">{e.hallNo}</td>
                    <td className="py-3 px-3"><Badge className="bg-emerald-500/10 text-emerald-600">{e.status}</Badge></td>
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

      {/* TAB 3: REVALUATION */}
      {activeTab === "revaluations" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Request ID</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Original Grade</th>
                  <th className="py-3 px-3">Revised Grade</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {revaluations.map((rv) => (
                  <tr key={rv.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{rv.requestId}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{rv.studentName} ({rv.rollNo})</td>
                    <td className="py-3 px-3 font-medium text-foreground">{rv.subjectCode}: {rv.subjectName}</td>
                    <td className="py-3 px-3 font-mono">{rv.originalGrade}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600">{rv.revisedGrade || "N/A"}</td>
                    <td className="py-3 px-3"><Badge className="bg-emerald-500/10 text-emerald-600">{rv.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DIALOG 1: ADD EXAM */}
      <Dialog open={isAddExamOpen} onOpenChange={setIsAddExamOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Schedule Semester Exam</DialogTitle></DialogHeader>
          <form onSubmit={handleAddExamSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Subject Code *</Label><Input required placeholder="CS405" value={examForm.subjectCode || ""} onChange={(e) => setExamForm({ ...examForm, subjectCode: e.target.value })} className="h-9 text-xs font-mono uppercase" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Subject Title *</Label><Input required placeholder="Cloud Computing & Microservices" value={examForm.subjectName || ""} onChange={(e) => setExamForm({ ...examForm, subjectName: e.target.value })} className="h-9 text-xs" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsAddExamOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Schedule Exam</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: PUBLISH RESULT */}
      <Dialog open={isPublishResultOpen} onOpenChange={setIsPublishResultOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Publish Student Result</DialogTitle></DialogHeader>
          <form onSubmit={handlePublishResultSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Student Roll No *</Label><Input required placeholder="23AIDS012" value={resultForm.rollNo || ""} onChange={(e) => setResultForm({ ...resultForm, rollNo: e.target.value })} className="h-9 text-xs font-mono uppercase" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Student Name *</Label><Input required placeholder="Rohan Varma" value={resultForm.studentName || ""} onChange={(e) => setResultForm({ ...resultForm, studentName: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Semester SGPA</Label><Input type="number" step="0.01" value={resultForm.sgpa ?? 8.90} onChange={(e) => setResultForm({ ...resultForm, sgpa: Number(e.target.value) })} className="h-9 text-xs font-mono" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsPublishResultOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Publish Result</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
