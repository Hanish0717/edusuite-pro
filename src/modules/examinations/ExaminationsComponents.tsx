import React, { useEffect, useState } from "react";
import {
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Download,
  CheckCircle2,
  Calendar,
  FileCheck,
  Award,
  Send,
  UserCheck,
  XCircle,
  FileText,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

import {
  useExamStore,
  approveByExamOffice,
  rejectByExamOffice,
  ExamRegistrationRecord,
} from "@/components/student-examinations/exam-store";

export function ExaminationsModuleView() {
  const [exams, setExams] = useState<ExamSchedule[]>(INITIAL_EXAMS);
  const [results, setResults] = useState<StudentResultRecord[]>(INITIAL_RESULTS);
  const [revaluations, setRevaluations] = useState<RevaluationRequest[]>(INITIAL_REVALUATIONS);
  const [activeTab, setActiveTab] = useState<"schedules" | "results" | "revaluations" | "registrations">("schedules");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Exam store registrations
  const { examRegistrations } = useExamStore();

  // Selected Certificate Modal
  const [selectedCert, setSelectedCert] = useState<ExamRegistrationRecord | null>(null);

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

  const handleApproveRegistration = (id: string) => {
    approveByExamOffice(id);
    toast.success("Exam registration approved! Student view updated to ✓ Exam Registered.");
  };

  const handleRejectRegistration = (id: string) => {
    rejectByExamOffice(id, "NPTEL Certificate Rejected. Please upload a valid certificate.");
    toast.error("Registration rejected. Student notified to re-upload certificate.");
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
            <span>Pending Exam Approvals</span>
            <FileCheck className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-600">
            {examRegistrations.filter((r) => r.status === "Pending Verification").length} Pending
          </p>
          <p className="text-[0.68rem] text-amber-600 font-medium">Requires verification</p>
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
        <button onClick={() => setActiveTab("schedules")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "schedules" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          1. Exam Schedules & Hall Allocation ({exams.length})
        </button>
        <button onClick={() => setActiveTab("results")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "results" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          2. Master Grade Ledger & Results ({results.length})
        </button>
        <button onClick={() => setActiveTab("revaluations")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "revaluations" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          3. Revaluation Ledger ({revaluations.length})
        </button>
        <button onClick={() => setActiveTab("registrations")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "registrations" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          4. Student Registrations & NPTEL Approvals ({examRegistrations.length})
        </button>
      </div>

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
                    <td className="py-3 px-3 font-medium text-foreground">{e.hallNo}</td>
                    <td className="py-3 px-3">
                      <Badge className={e.status === "Published" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                        {e.status}
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
                  <th className="py-3 px-3">Roll Number & Student</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">SGPA</th>
                  <th className="py-3 px-3">CGPA</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground">{r.studentName}</div>
                      <div className="text-[0.68rem] text-primary font-mono">{r.rollNo}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-foreground">{r.department} ({r.semester})</td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">{r.sgpa.toFixed(2)}</td>
                    <td className="py-3 px-3 font-mono">{r.cgpa.toFixed(2)}</td>
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

      {/* TAB 4: STUDENT EXAM REGISTRATIONS & NPTEL APPROVALS */}
      {activeTab === "registrations" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <UserCheck className="size-4 text-primary" /> Pending & Submitted Student Registrations
            </h3>
            <Badge variant="outline" className="font-mono text-xs">
              {examRegistrations.length} Total Submissions
            </Badge>
          </div>

          {examRegistrations.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
              No student exam registration or NPTEL requests submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Student Details</th>
                    <th className="py-3 px-3">Course Code & Name</th>
                    <th className="py-3 px-3">Semester</th>
                    <th className="py-3 px-3">Registration Date</th>
                    <th className="py-3 px-3">NPTEL Status</th>
                    <th className="py-3 px-3">Certificate</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {examRegistrations.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-foreground">{r.studentName}</div>
                        <div className="text-[0.68rem] text-primary font-mono">{r.rollNumber} &bull; {r.department}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-foreground">
                        <span className="font-mono text-primary font-bold">{r.courseCode}</span>: {r.courseName}
                      </td>
                      <td className="py-3 px-3 font-mono font-medium">Sem {r.semester}</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">
                        {new Date(r.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className={`font-semibold text-[10px] ${
                          r.nptelStatus === "Approved"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : r.nptelStatus === "Pending Verification"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : r.nptelStatus === "Rejected"
                            ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {r.nptelStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        {r.certificate ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCert(r)}
                            className="h-7 text-xs font-semibold text-primary hover:underline gap-1 px-2"
                          >
                            <FileText className="size-3.5" /> {r.certificate.fileName}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <Badge className={
                          r.status === "Registered"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : r.status === "Pending Verification"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-rose-500/10 text-rose-600"
                        }>
                          {r.status === "Registered" ? "✓ Exam Registered" : r.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {r.status === "Pending Verification" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => handleApproveRegistration(r.id)}
                              className="h-7 px-2.5 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                            >
                              <CheckCircle2 className="size-3" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectRegistration(r.id)}
                              className="h-7 px-2.5 text-[11px] font-bold border-rose-300 text-rose-600 hover:bg-rose-50 gap-1"
                            >
                              <XCircle className="size-3" /> Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground italic font-mono">No action required</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CERTIFICATE DETAILS PREVIEW MODAL */}
      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="size-5 text-primary" /> NPTEL Certificate Details
            </DialogTitle>
          </DialogHeader>

          {selectedCert?.certificate && (
            <div className="space-y-3 text-xs pt-2">
              <div className="p-3 rounded-xl bg-muted/50 border border-border space-y-1">
                <p className="font-semibold text-foreground">Student: <span className="font-mono">{selectedCert.studentName} ({selectedCert.rollNumber})</span></p>
                <p className="font-semibold text-foreground">Course: <span className="font-mono text-primary">{selectedCert.courseCode} - {selectedCert.courseName}</span></p>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-muted-foreground">Uploaded File</Label>
                <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-primary">{selectedCert.certificate.fileName}</p>
                    <p className="text-[10px] text-muted-foreground">{selectedCert.certificate.fileSizeMb} MB &bull; {selectedCert.certificate.fileType}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-card">Validated Format ✓</Badge>
                </div>
              </div>

              {selectedCert.certificate.remarks && (
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Student Remarks</Label>
                  <p className="p-2.5 rounded-xl border border-border bg-card text-foreground font-mono text-[11px]">
                    {selectedCert.certificate.remarks}
                  </p>
                </div>
              )}

              <DialogFooter className="pt-2 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRejectRegistration(selectedCert.id)}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  Reject Certificate
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    handleApproveRegistration(selectedCert.id);
                    setSelectedCert(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Approve Registration
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
            <div className="space-y-1"><Label className="text-xs font-semibold">Student Name *</Label><Input required placeholder="Rohan Varma" value={resultForm.rollNo ? resultForm.studentName || "" : ""} onChange={(e) => setResultForm({ ...resultForm, studentName: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Semester SGPA</Label><Input type="number" step="0.01" value={resultForm.sgpa ?? 8.90} onChange={(e) => setResultForm({ ...resultForm, sgpa: Number(e.target.value) })} className="h-9 text-xs font-mono" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsPublishResultOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Publish Result</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
