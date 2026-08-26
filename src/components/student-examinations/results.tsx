import React, { useState } from "react";
import {
  SemesterResultItem,
  StudentExamProfile,
  ResultWorkflowStatus,
  AcademicYearOption,
} from "./types";
import { MOCK_DOWNLOAD_HISTORY } from "./mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Award,
  TrendingUp,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  History,
  ChevronRight,
  Layers,
  Eye,
  Printer,
  RefreshCw,
  BookOpen,
  GraduationCap,
  FileText,
  BarChart2,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { toast } from "sonner";

interface ResultsProps {
  profile: StudentExamProfile;
  semesterResults: SemesterResultItem[];
  resultStatus?: ResultWorkflowStatus;
  selectedYear: AcademicYearOption;
  selectedSemester: number;
  onYearChange: (year: AcademicYearOption) => void;
  onSemesterChange: (sem: number) => void;
  onOpenGradeCardModal: (result: SemesterResultItem) => void;
  onOpenRevaluationModal?: () => void;
  onApplyRevaluation?: () => void;
  onTogglePublishResults?: () => void;
}

type ResultCategory = "regular" | "supplementary" | "improvement" | "revaluation";

export function Results({
  profile,
  semesterResults,
  resultStatus,
  selectedYear,
  selectedSemester,
  onYearChange,
  onSemesterChange,
  onOpenGradeCardModal,
  onApplyRevaluation,
  onTogglePublishResults,
}: ResultsProps) {
  const [selectedCategory, setSelectedCategory] = useState<ResultCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<ResultCategory>("regular");

  const isPublished = resultStatus === "Published" || selectedSemester < 5;
  const currentResult = semesterResults.find((s) => s.semester === selectedSemester);

  const latestResult = [...semesterResults].sort((a, b) => b.semester - a.semester)[0];
  const cgpaLatest = latestResult?.cgpa ?? profile.cgpa;
  const sgpaLatest = latestResult?.sgpa ?? profile.sgpa;
  const completedSemesters = semesterResults.length;
  const totalCreditsEarned = semesterResults.reduce((s, r) => s + r.creditsEarned, 0);
  const backlogs = profile.activeBacklogs;

  const cgpaTrend = semesterResults.map((s) => ({
    sem: `Sem ${s.semester}`,
    sgpa: s.sgpa,
    cgpa: s.cgpa,
  }));

  const filteredResults = semesterResults.filter(
    (sem) =>
      `Semester ${sem.semester}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sem.academicYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sem.monthYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sem.memoNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(sem.sgpa).includes(searchTerm) ||
      String(sem.cgpa).includes(searchTerm)
  );

  const handleDownloadMemo = (sem: SemesterResultItem) => {
    const text = `EduSuite Pro Official Grade Memo\nMemo: ${sem.memoNumber}\nSemester: ${sem.semester}\nSGPA: ${sem.sgpa} | CGPA: ${sem.cgpa}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Memo_Semester_${sem.semester}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded Memo for Semester ${sem.semester}`);
  };

  const handleRedownload = (item: { title: string; type: "Memo" | "Hall Ticket"; semester: number; fileSize: string }) => {
    const isMemo = item.type === "Memo";
    const content = isMemo
      ? `EduSuite Pro — Official Marks Memo Re-Download\n====================================\nTitle: ${item.title}\nFile Size: ${item.fileSize}\nDocument Type: Grade Memo / Academic Transcript\nSemester: ${item.semester}\nController of Examinations — EduSuite Academic Board`
      : `EduSuite Pro — Official Hall Ticket Re-Download\n====================================\nTitle: ${item.title}\nFile Size: ${item.fileSize}\nDocument Type: Examination Admit Card / Hall Ticket\nSemester: ${item.semester}\nController of Examinations — EduSuite Academic Board`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.title.replace(/\s+/g, "_")}_Redownload.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Re-downloaded: ${item.title}`);
  };

  const getMemoStatusBadge = (status?: string) => {
    switch (status) {
      case "Verified":
        return <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px] font-mono border-emerald-500/20">Verified</Badge>;
      case "Declared":
        return <Badge className="bg-blue-500/10 text-blue-600 text-[10px] font-mono border-blue-500/20">Declared</Badge>;
      case "Revaluation Pending":
        return <Badge className="bg-amber-500/10 text-amber-600 text-[10px] font-mono border-amber-500/20">Reval Pending</Badge>;
      case "Withheld":
        return <Badge className="bg-rose-500/10 text-rose-600 text-[10px] font-mono border-rose-500/20">Withheld</Badge>;
      default:
        return <Badge className="bg-slate-500/10 text-slate-600 text-[10px] font-mono">—</Badge>;
    }
  };

  const downloadHistory = MOCK_DOWNLOAD_HISTORY;

  // Tab options for result types
  const tabs: { id: ResultCategory; label: string }[] = [
    { id: "regular", label: "Regular" },
    { id: "supplementary", label: "Supplementary" },
    { id: "improvement", label: "Improvement" },
    { id: "revaluation", label: "Revaluation" },
  ];

  return (
    <div className="space-y-6">

      {/* 1. TOP STATISTICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* CGPA */}
        <div className="lg:col-span-1 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">CGPA</span>
            <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">{cgpaLatest.toFixed(2)}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Cumulative GPA</span>
        </div>

        {/* SGPA */}
        <div className="lg:col-span-1 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Current SGPA</span>
            <div className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <BarChart2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">{sgpaLatest.toFixed(2)}</div>
          <span className="text-[11px] text-blue-600 font-medium">Latest Semester GPA</span>
        </div>

        {/* Completed Semesters */}
        <div className="lg:col-span-1 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed Sems</span>
            <div className="p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">{completedSemesters}</div>
          <span className="text-[11px] text-purple-600 font-medium">of 8 Total Semesters</span>
        </div>

        {/* Credits Earned */}
        <div className="lg:col-span-1 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Credits Earned</span>
            <div className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">{totalCreditsEarned}</div>
          <span className="text-[11px] text-amber-600 font-medium">of {profile.totalRequiredCredits} Required</span>
        </div>

        {/* Active Backlogs */}
        <div className="lg:col-span-1 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Backlogs</span>
            <div className={`p-1.5 rounded-xl ${backlogs > 0 ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600" : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"}`}>
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className={`text-2xl font-extrabold font-display ${backlogs > 0 ? "text-rose-600" : "text-emerald-600"}`}>{backlogs}</div>
          <span className={`text-[11px] font-medium ${backlogs > 0 ? "text-rose-500" : "text-emerald-600"}`}>
            {backlogs === 0 ? "Clean Record ✓" : "Active Backlogs"}
          </span>
        </div>
      </div>

      {/* 2. RESULT CATEGORY TABS */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-bold transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-[#0b193c] text-[#0b193c] dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="p-5 space-y-4">

          {activeTab === "regular" && (
            isPublished && currentResult ? (
              /* CURRENT SEMESTER MARKS TABLE */
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Semester {selectedSemester} — Marks & Grade Card</h4>
                    <p className="text-xs text-slate-500 font-mono">Memo: {currentResult.memoNumber} &middot; Published: {currentResult.publishedDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => window.print()} className="rounded-xl text-xs gap-1.5 cursor-pointer">
                      <Printer className="h-3.5 w-3.5" /> Print
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onApplyRevaluation?.()} className="rounded-xl text-xs gap-1.5 border-purple-300 text-purple-700 dark:text-purple-300 cursor-pointer font-bold">
                      <RefreshCw className="h-3.5 w-3.5 text-purple-600" /> Apply Revaluation
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownloadMemo(currentResult)}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5" /> Download Memo PDF
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold">
                        <th className="p-3">Code</th>
                        <th className="p-3">Subject Name</th>
                        <th className="p-3">Internal (40)</th>
                        <th className="p-3">External (60)</th>
                        <th className="p-3">Total (100)</th>
                        <th className="p-3">Grade</th>
                        <th className="p-3">Credits</th>
                        <th className="p-3">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {currentResult.subjects.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-mono font-bold text-blue-600">{sub.code}</td>
                          <td className="p-3 font-semibold text-slate-900 dark:text-white">{sub.name}</td>
                          <td className="p-3 font-mono">{sub.internal}</td>
                          <td className="p-3 font-mono">{sub.external}</td>
                          <td className="p-3 font-bold font-mono text-slate-900 dark:text-white">{sub.total}</td>
                          <td className="p-3 font-bold font-mono text-purple-600">{sub.grade}</td>
                          <td className="p-3 font-mono">{sub.credits}</td>
                          <td className="p-3">
                            <Badge className={`text-[10px] ${sub.status === "Pass" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>{sub.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="text-slate-600">Credits Earned: <strong className="text-slate-900 dark:text-white font-mono">{currentResult.creditsEarned}</strong></span>
                  <span className="text-blue-600 font-bold font-mono">SGPA: {currentResult.sgpa.toFixed(2)}</span>
                  <span className="text-emerald-600 font-bold font-mono">CGPA: {currentResult.cgpa.toFixed(2)}</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">PASSED — FIRST CLASS WITH DISTINCTION</Badge>
                </div>
              </div>
            ) : (
              /* EVALUATION IN PROGRESS STEPPER */
              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500 animate-pulse" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Semester {selectedSemester} — Evaluation In Progress</h4>
                      <p className="text-xs text-slate-500">Results will be published after valuation is complete.</p>
                    </div>
                  </div>
                  <div className="text-xs text-right">
                    <span className="text-slate-400 block">Expected Publish Date</span>
                    <strong className="text-blue-600 font-mono">Feb 28, 2025</strong>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    { label: "Answer Sheet Evaluation", status: "Completed", color: "emerald" },
                    { label: "Moderation & Scrutiny", status: "In Progress", color: "amber" },
                    { label: "Result Processing", status: "Pending", color: "slate" },
                    { label: "Publication & Memos", status: "Pending", color: "slate" },
                  ].map((step, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-xl border space-y-1 ${
                        step.color === "emerald"
                          ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40"
                          : step.color === "amber"
                          ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-70"
                      }`}
                    >
                      <span className={`text-[10px] font-bold uppercase ${step.color === "emerald" ? "text-emerald-600" : step.color === "amber" ? "text-amber-600" : "text-slate-400"}`}>Stage {i + 1}</span>
                      <div className="font-bold text-slate-900 dark:text-white">{step.label}</div>
                      <Badge className={`text-[9px] ${step.color === "emerald" ? "bg-emerald-500/20 text-emerald-700" : step.color === "amber" ? "bg-amber-500/20 text-amber-700" : "bg-slate-200 text-slate-600"}`}>{step.status}</Badge>
                    </div>
                  ))}
                </div>
                {onTogglePublishResults && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <Button onClick={onTogglePublishResults} size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm cursor-pointer">
                      <Sparkles className="h-3.5 w-3.5" /> Publish Results (Demo)
                    </Button>
                  </div>
                )}
              </div>
            )
          )}

          {activeTab === "supplementary" && (
            profile.activeBacklogs === 0 ? (
              <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Backlog Results</h3>
                <p className="text-xs text-slate-500">You have cleared all papers. No supplementary results available.</p>
              </div>
            ) : (
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="h-4 w-4 text-purple-600" /> Supplementary Exam Results
                  </h4>
                  <Button size="sm" className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold gap-1.5 cursor-pointer">
                    <Download className="h-3.5 w-3.5" /> Download Supple Memo PDF
                  </Button>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold">
                        <th className="p-3">Code</th><th className="p-3">Subject</th><th className="p-3">Month</th>
                        <th className="p-3">Internal</th><th className="p-3">External</th><th className="p-3">Total</th>
                        <th className="p-3">Grade</th><th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-purple-600">EE201</td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">Basic Electrical Engineering (Supple)</td>
                        <td className="p-3 text-slate-500 font-mono">Dec 2024</td>
                        <td className="p-3 font-mono">32</td>
                        <td className="p-3 font-mono">48</td>
                        <td className="p-3 font-bold font-mono text-slate-900 dark:text-white">80</td>
                        <td className="p-3 font-bold font-mono text-emerald-600">A</td>
                        <td className="p-3"><Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">Pass</Badge></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}

          {(activeTab === "improvement" || activeTab === "revaluation") && (
            <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center space-y-3">
              <FileText className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize">{activeTab} Results</h3>
              <p className="text-xs text-slate-500">No {activeTab} results are available at this time.</p>
              {activeTab === "revaluation" && (
                <Button size="sm" onClick={() => onApplyRevaluation?.()} className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold gap-1.5 cursor-pointer shadow-sm mt-2">
                  <RefreshCw className="h-3.5 w-3.5" /> Apply for Revaluation
                </Button>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 3. SGPA vs CGPA ACADEMIC PROGRESS CHART */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-600" /> Academic Progress — SGPA & CGPA Trend Across Semesters
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cgpaTrend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <XAxis dataKey="sem" stroke="#94A3B8" fontSize={11} />
              <YAxis domain={[7.5, 10]} stroke="#94A3B8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                  border: "1px solid #334155",
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Line type="monotone" dataKey="sgpa" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, fill: "#2563EB" }} name="SGPA" />
              <Line type="monotone" dataKey="cgpa" stroke="#10B981" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 4, fill: "#10B981" }} name="CGPA" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. PREVIOUS RESULTS ARCHIVE TABLE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="h-4 w-4 text-purple-600" /> Previous Results & Memos Archive
            </h4>
            <p className="text-xs text-slate-500">Certified academic transcripts for all completed semesters</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search sem, year, memo, SGPA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-xs rounded-xl"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold">
                <th className="p-3">Semester</th>
                <th className="p-3">Academic Year</th>
                <th className="p-3">Published Date</th>
                <th className="p-3">Memo Number</th>
                <th className="p-3">SGPA</th>
                <th className="p-3">CGPA</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Memo Status</th>
                <th className="p-3">Downloads</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-6 text-center text-slate-400 text-xs">No results match your search.</td>
                </tr>
              ) : (
                filteredResults.map((sem) => (
                  <tr key={sem.semester} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">Semester {sem.semester}</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{sem.academicYear}</td>
                    <td className="p-3 font-mono text-slate-500">{sem.publishedDate || "—"}</td>
                    <td className="p-3 font-mono text-blue-600 font-bold text-[10px]">{sem.memoNumber || "—"}</td>
                    <td className="p-3 font-bold font-mono text-blue-600">{sem.sgpa.toFixed(2)}</td>
                    <td className="p-3 font-bold font-mono text-emerald-600">{sem.cgpa.toFixed(2)}</td>
                    <td className="p-3 font-mono">{sem.creditsEarned} Cr</td>
                    <td className="p-3">{getMemoStatusBadge(sem.memoStatus)}</td>
                    <td className="p-3 font-mono text-slate-500">{sem.downloadCount ?? 0}×</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* VIEW RESULT */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onOpenGradeCardModal(sem)}
                          className="h-7 text-xs font-semibold gap-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>

                        {/* DOWNLOAD MEMO */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadMemo(sem)}
                          className="h-7 text-xs font-semibold gap-1 rounded-xl cursor-pointer border-slate-200 dark:border-slate-700"
                        >
                          <Download className="h-3.5 w-3.5 text-blue-600" /> PDF
                        </Button>

                        {/* PRINT MEMO */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { toast.info(`Printing Semester ${sem.semester} Memo...`); window.print(); }}
                          className="h-7 text-xs font-semibold gap-1 rounded-xl cursor-pointer text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Printer className="h-3.5 w-3.5" /> Print
                        </Button>

                        {/* APPLY REVALUATION */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onApplyRevaluation?.()}
                          className="h-7 text-xs font-semibold gap-1 rounded-xl cursor-pointer text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Reval
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. DOWNLOAD HISTORY */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-600" /> Recent Downloads
        </h4>

        <div className="space-y-2">
          {downloadHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${item.type === "Memo" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" : "bg-blue-50 dark:bg-blue-950/40 text-blue-600"}`}>
                  {item.type === "Memo" ? <Award className="h-4 w-4" /> : <Ticket className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{item.downloadedDate} &middot; {item.fileSize}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Badge className={`text-[10px] font-mono ${item.type === "Memo" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"}`}>
                  {item.type}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRedownload(item)}
                  className="h-7 text-xs gap-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl cursor-pointer font-bold"
                >
                  <Download className="h-3.5 w-3.5" /> Re-download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// Need this icon for download history
function Ticket({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
      <path d="M13 5v2"/>
      <path d="M13 17v2"/>
      <path d="M13 11v2"/>
    </svg>
  );
}
