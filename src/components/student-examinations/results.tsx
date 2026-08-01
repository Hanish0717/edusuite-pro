import React, { useState } from "react";
import {
  SemesterResultItem,
  StudentExamProfile,
  ResultWorkflowStatus,
  AcademicYearOption,
  YEAR_TO_SEMESTERS_MAP,
  ResultCategory,
} from "./types";
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
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { toast } from "sonner";

interface ResultsProps {
  profile: StudentExamProfile;
  semesterResults: SemesterResultItem[];
  resultStatus: ResultWorkflowStatus;
  selectedYear: AcademicYearOption;
  selectedSemester: number;
  onYearChange: (year: AcademicYearOption) => void;
  onSemesterChange: (sem: number) => void;
  onOpenGradeCardModal: (result: SemesterResultItem) => void;
  onApplyRevaluation?: () => void;
  onTogglePublishResults?: () => void;
}

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
  // State: Category selection ("regular" | "supplementary")
  const [selectedCategory, setSelectedCategory] = useState<ResultCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const isPublished = resultStatus === "Published" || selectedSemester < 5;
  const currentResult = semesterResults.find((s) => s.semester === selectedSemester);

  const cgpaTrend = semesterResults.map((s) => ({
    sem: `Sem ${s.semester}`,
    sgpa: s.sgpa,
    cgpa: s.cgpa,
  }));

  const filteredPreviousResults = semesterResults.filter(
    (sem) =>
      `Semester ${sem.semester}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sem.academicYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sem.monthYear.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Supplementary Results mock dataset
  const supplementaryResultData = [
    { code: "EE201", name: "Basic Electrical Engineering (Supple)", internal: 32, external: 48, total: 80, grade: "A", credits: 3, status: "Pass", monthYear: "Dec 2024" },
  ];

  const handleCardClick = (cat: ResultCategory) => {
    setSelectedCategory(cat);
    if (cat === "supplementary" && profile.activeBacklogs === 0) {
      toast.info("No Active Backlogs — You do not have any backlog results for this semester.");
    } else {
      toast.success(`Showing ${cat === "regular" ? "Regular" : "Supplementary"} Semester Results`);
    }
  };

  const handleDownloadMemoPDF = (semTitle: string, sgpa?: number) => {
    toast.success(`Downloading Official Grade Memo PDF (${semTitle})...`);
    const element = document.createElement("a");
    const file = new Blob([`EduSuite Pro Official Grade Memo Transcripts: ${semTitle} - SGPA: ${sgpa || 8.5}`], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Result_Memo_${semTitle.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8">

      {/* 1. CATEGORY SELECTION CARDS (REGULAR & SUPPLEMENTARY) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" /> Select Result Category
            </h3>
            <p className="text-xs text-slate-500">Select a category below to view and download your official grade memo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: Regular Results */}
          <div
            onClick={() => handleCardClick("regular")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              selectedCategory === "regular"
                ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20"
                : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-slate-700 shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-600">
                <Award className="h-5 w-5" />
              </div>
              <Badge className={selectedCategory === "regular" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}>
                {selectedCategory === "regular" ? "Active View" : "End-Sem"}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Regular Results</h4>
              <p className="text-xs text-slate-500 mt-0.5">Semester Main Theory & Practical Grade Cards & Memos</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick("regular");
              }}
              className="text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:underline text-left"
            >
              Click to view result <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 2: Supplementary Results */}
          <div
            onClick={() => handleCardClick("supplementary")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              selectedCategory === "supplementary"
                ? "border-purple-600 bg-purple-50/40 dark:bg-purple-950/30 shadow-md ring-2 ring-purple-500/20"
                : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-slate-700 shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-purple-600/10 text-purple-600">
                <Layers className="h-5 w-5" />
              </div>
              <Badge className={selectedCategory === "supplementary" ? "bg-purple-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}>
                {selectedCategory === "supplementary" ? "Active View" : profile.activeBacklogs > 0 ? "Backlog Required" : "No Backlogs"}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Supplementary Results</h4>
              <p className="text-xs text-slate-500 mt-0.5">Cleared Backlog Papers & Re-evaluation Ledger</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick("supplementary");
              }}
              className="text-[11px] font-bold text-purple-600 flex items-center gap-1 hover:underline text-left"
            >
              Click to view result <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* 2. INLINE PAGE RESULT DISPLAY AREA */}
      {!selectedCategory ? (
        /* INITIAL EMPTY PLACEHOLDER */
        <div className="p-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4 shadow-sm animate-in fade-in duration-300">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600">
            <Award className="h-8 w-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Select a Result Category
            </h3>
            <p className="text-xs text-slate-500">
              Select a Result Category above to view and download your grade memo for Semester {selectedSemester}.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Button
              onClick={() => handleCardClick("regular")}
              size="sm"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm"
            >
              <Award className="h-3.5 w-3.5" /> Regular Results
            </Button>
            <Button
              onClick={() => handleCardClick("supplementary")}
              size="sm"
              variant="outline"
              className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-700"
            >
              <Layers className="h-3.5 w-3.5 text-purple-600" /> Supplementary
            </Button>
          </div>
        </div>
      ) : selectedCategory === "supplementary" && profile.activeBacklogs === 0 ? (
        /* NO BACKLOGS STATE FOR SUPPLEMENTARY RESULTS */
        <div className="p-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3 shadow-sm animate-in fade-in duration-300">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Backlog Results
            </h3>
            <p className="text-xs text-slate-500">
              You do not have any backlog results for Semester {selectedSemester}. All regular papers cleared successfully.
            </p>
          </div>
          <Button
            onClick={() => handleCardClick("regular")}
            size="sm"
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm mt-2"
          >
            <Award className="h-3.5 w-3.5" /> View Regular Results
          </Button>
        </div>
      ) : selectedCategory === "regular" ? (
        /* REGULAR RESULTS PREVIEW */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {!isPublished ? (
            /* EVALUATION IN PROGRESS REAL ERP STEPS */
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500 animate-pulse" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Semester {selectedSemester} Evaluation In Progress
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    Controller of Examinations is processing end-semester valuation marks.
                  </p>
                </div>

                <div className="text-xs text-right">
                  <span className="text-slate-400 block">Expected Publish Date</span>
                  <strong className="text-blue-600 font-mono">Feb 28, 2025</strong>
                </div>
              </div>

              {/* REAL ERP STEPS STEPPER */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Stage 1</span>
                  <div className="font-bold text-slate-900 dark:text-white">Answer Sheet Evaluation</div>
                  <Badge className="bg-emerald-500/20 text-emerald-700 text-[9px]">Completed</Badge>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1">
                  <span className="text-[10px] font-bold text-amber-600 uppercase">Stage 2</span>
                  <div className="font-bold text-slate-900 dark:text-white">Moderation & Scrutiny</div>
                  <Badge className="bg-amber-500/20 text-amber-700 text-[9px]">In Progress</Badge>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1 opacity-70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Stage 3</span>
                  <div className="font-bold text-slate-900 dark:text-white">Result Processing</div>
                  <Badge className="bg-slate-200 text-slate-600 text-[9px]">Pending</Badge>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1 opacity-70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Stage 4</span>
                  <div className="font-bold text-slate-900 dark:text-white">Publication & Memos</div>
                  <Badge className="bg-slate-200 text-slate-600 text-[9px]">Pending</Badge>
                </div>
              </div>

              {onTogglePublishResults && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Button
                    onClick={onTogglePublishResults}
                    size="sm"
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Publish Results Demo
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* REGULAR RESULTS CARD WITH ONLY DOWNLOAD BUTTON */
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Semester {selectedSemester} Result & Grade Card
                  </h4>
                  <p className="text-xs text-slate-500">Official Exam Branch Transcripts</p>
                </div>

                {/* DEDICATED CLEAN DOWNLOAD BUTTON */}
                <Button
                  onClick={() => handleDownloadMemoPDF(`Semester ${selectedSemester}`, currentResult?.sgpa)}
                  size="sm"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-2 px-4 shadow-sm shadow-blue-500/20"
                >
                  <Download className="h-4 w-4" /> Download Memo (PDF)
                </Button>
              </div>

              {currentResult && (
                <div className="overflow-x-auto">
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
                        <th className="p-3">Status</th>
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
                            <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">{sub.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* SUPPLEMENTARY RESULTS PREVIEW */
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-600" /> Supplementary & Backlog Examination Results
              </h4>
              <p className="text-xs text-slate-500">Official cleared backlog grades certified by Exam Branch</p>
            </div>
            <Button
              onClick={() => handleDownloadMemoPDF(`Supplementary Sem ${selectedSemester}`)}
              size="sm"
              className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold gap-2 px-4 shadow-sm shadow-purple-500/20"
            >
              <Download className="h-4 w-4" /> Download Supple Memo (PDF)
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold">
                  <th className="p-3">Subject Code</th>
                  <th className="p-3">Subject Name</th>
                  <th className="p-3">Exam Month</th>
                  <th className="p-3">Internal</th>
                  <th className="p-3">External</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {supplementaryResultData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-purple-600">{item.code}</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{item.name}</td>
                    <td className="p-3 text-slate-500 font-mono">{item.monthYear}</td>
                    <td className="p-3 font-mono">{item.internal}</td>
                    <td className="p-3 font-mono">{item.external}</td>
                    <td className="p-3 font-bold font-mono text-slate-900 dark:text-white">{item.total}</td>
                    <td className="p-3 font-bold font-mono text-emerald-600">{item.grade}</td>
                    <td className="p-3">
                      <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">{item.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PREVIOUS YEAR RESULTS ARCHIVE TABLE WITH DOWNLOAD BUTTON */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="h-4 w-4 text-purple-600" /> Previous Year Results & Memos Archive
            </h4>
            <p className="text-xs text-slate-500">Certified academic transcripts for all completed semesters</p>
          </div>

          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search semester or academic year..."
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
                <th className="p-3">SGPA</th>
                <th className="p-3">CGPA</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Rank</th>
                <th className="p-3">Result</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPreviousResults.map((sem) => (
                <tr key={sem.semester} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Semester {sem.semester}</td>
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{sem.academicYear}</td>
                  <td className="p-3 font-bold font-mono text-blue-600">{sem.sgpa.toFixed(2)}</td>
                  <td className="p-3 font-bold font-mono text-emerald-600">{sem.cgpa.toFixed(2)}</td>
                  <td className="p-3 font-mono">{sem.creditsEarned} Cr</td>
                  <td className="p-3 font-mono text-purple-600 font-bold">#{sem.rank}</td>
                  <td className="p-3">
                    <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">{sem.resultStatus}</Badge>
                  </td>
                  <td className="p-3">
                    {/* DEDICATED CLEAN DOWNLOAD BUTTON FOR PREVIOUS RESULTS */}
                    <Button
                      size="sm"
                      onClick={() => handleDownloadMemoPDF(`Semester ${sem.semester} (${sem.academicYear})`, sem.sgpa)}
                      className="h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 dark:border-blue-900/60 text-xs font-semibold gap-1.5 transition-all shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5" /> Download PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PERFORMANCE ANALYTICS PROGRESSION CHART */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-600" /> SGPA vs CGPA Growth Progression Across Semesters
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cgpaTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="sem" stroke="#94A3B8" fontSize={11} />
              <YAxis domain={[7.5, 10]} stroke="#94A3B8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
              <Line type="monotone" dataKey="sgpa" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} name="SGPA" />
              <Line type="monotone" dataKey="cgpa" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4 }} name="CGPA" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
