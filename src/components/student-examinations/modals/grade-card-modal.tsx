import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SemesterResultItem, StudentExamProfile } from "../types";
import { Download, Printer, Award, CheckCircle2, ChevronLeft, ChevronRight, RefreshCw, QrCode } from "lucide-react";
import { toast } from "sonner";

interface GradeCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: SemesterResultItem | null;
  allResults?: SemesterResultItem[];
  profile: StudentExamProfile;
  onNavigateSemester?: (sem: number) => void;
  onApplyRevaluation?: () => void;
}

export function GradeCardModal({
  open,
  onOpenChange,
  result,
  allResults = [],
  profile,
  onNavigateSemester,
  onApplyRevaluation,
}: GradeCardModalProps) {
  if (!result) return null;

  const currentSemIndex = allResults.findIndex((r) => r.semester === result.semester);
  const prevResult = currentSemIndex > 0 ? allResults[currentSemIndex - 1] : null;
  const nextResult = currentSemIndex >= 0 && currentSemIndex < allResults.length - 1 ? allResults[currentSemIndex + 1] : null;

  const handleDownloadMemo = () => {
    const memoText = `EDUSUITE PRO COLLEGE OF ENGINEERING & TECHNOLOGY
=====================================================
OFFICIAL ACADEMIC TRANSCRIPT & MARKS MEMORANDUM
=====================================================
Memo Number: ${result.memoNumber || `MEMO-2026-SEM${result.semester}-0542`}
Published Date: ${result.publishedDate || "28 Jun 2026"}
Student Name: ${profile.name} (Adm No: ${profile.rollNumber})
Degree & Program: ${profile.degree} - ${profile.branch} (${profile.section})
Semester: ${result.semester} | Academic Year: ${result.academicYear}

SUBJECT-WISE GRADES & MARKS BREAKDOWN:
----------------------------------------------------------------------------------
Code   | Subject Title                          | Int(40) | Ext(60) | Total | Grade | Credits | Result
----------------------------------------------------------------------------------
${result.subjects
  .map(
    (s) =>
      `${s.code.padEnd(6)} | ${s.name.padEnd(38)} | ${String(s.internal).padStart(7)} | ${String(s.external).padStart(7)} | ${String(s.total).padStart(5)} | ${s.grade.padStart(5)} | ${String(s.credits).padStart(7)} | ${s.status}`
  )
  .join("\n")}
----------------------------------------------------------------------------------

SEMESTER SUMMARY METRICS:
- Credits Attempted: ${result.creditsAttempted} | Credits Earned: ${result.creditsEarned}
- Semester Grade Point Average (SGPA): ${result.sgpa.toFixed(2)}
- Cumulative Grade Point Average (CGPA): ${result.cgpa.toFixed(2)}
- Overall Result: PASSED FIRST CLASS WITH DISTINCTION

Verification QR Hash: QR-CERT-SEM${result.semester}-VERIFIED-2026
Controller of Examinations Signature — EduSuite Academic Board`;

    const blob = new Blob([memoText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Official_Memo_Semester_${result.semester}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded Official Marks Memo for Semester ${result.semester}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl">
        
        {/* HEADER WITH SEMESTER CYCLING */}
        <DialogHeader className="space-y-2 text-left border-b pb-3 border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-600/10 text-emerald-600">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  Official Grade Sheet & Marks Memo — Semester {result.semester}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 font-mono">
                  Memo No: <strong className="text-blue-600">{result.memoNumber || `MEMO-2026-SEM${result.semester}-0542`}</strong> &middot; Published: {result.publishedDate || "28 Jun 2026"}
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold text-xs px-2.5 py-1 font-mono">
                SGPA: {result.sgpa.toFixed(2)} (PASSED)
              </Badge>
            </div>
          </div>

          {/* IN-MODAL SEMESTER NAVIGATION BUTTONS */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!prevResult}
              onClick={() => prevResult && onNavigateSemester?.(prevResult.semester)}
              className="h-7 text-xs font-semibold gap-1 text-slate-700 dark:text-slate-300 cursor-pointer disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Previous Semester
            </Button>

            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px]">
              Semester {result.semester} of {allResults.length || 6}
            </span>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!nextResult}
              onClick={() => nextResult && onNavigateSemester?.(nextResult.semester)}
              className="h-7 text-xs font-semibold gap-1 text-slate-700 dark:text-slate-300 cursor-pointer disabled:opacity-40"
            >
              Next Semester <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 my-3 text-xs">
          
          {/* STUDENT METRICS ROW */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-400 block text-[10px]">Student Name</span>
              <strong className="text-slate-900 dark:text-white">{profile.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Admission Number</span>
              <strong className="font-mono text-blue-600">{profile.rollNumber}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Exam Session</span>
              <strong className="text-slate-800 dark:text-slate-200">{result.monthYear}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Cumulative CGPA</span>
              <strong className="text-emerald-600 font-mono font-bold text-xs">{result.cgpa.toFixed(2)}</strong>
            </div>
          </div>

          {/* SUBJECT MARKS TABLE */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  <th className="p-2.5">Code</th>
                  <th className="p-2.5">Subject Title</th>
                  <th className="p-2.5">Internal (40)</th>
                  <th className="p-2.5">External (60)</th>
                  <th className="p-2.5">Total (100)</th>
                  <th className="p-2.5">Grade</th>
                  <th className="p-2.5">Credits</th>
                  <th className="p-2.5">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {result.subjects.map((sub) => (
                  <tr key={sub.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-2.5 font-mono font-bold text-blue-600">{sub.code}</td>
                    <td className="p-2.5 font-semibold text-slate-900 dark:text-white">{sub.name}</td>
                    <td className="p-2.5 font-mono">{sub.internal}</td>
                    <td className="p-2.5 font-mono">{sub.external}</td>
                    <td className="p-2.5 font-bold font-mono text-slate-900 dark:text-white">{sub.total}</td>
                    <td className="p-2.5 font-bold font-mono text-purple-600">{sub.grade}</td>
                    <td className="p-2.5 font-mono">{sub.credits}</td>
                    <td className="p-2.5">
                      <Badge className="bg-emerald-500/10 text-emerald-600 text-[9px]">{sub.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* OVERALL RESULTS & QR VERIFICATION FOOTER */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 text-[11px]">
                Total Credits Earned: <strong className="text-slate-900 dark:text-white font-mono">{result.creditsEarned} Cr</strong> &middot; Overall Result: <strong className="text-emerald-600">PASSED FIRST CLASS WITH DISTINCTION</strong>
              </span>
              <p className="text-[10px] text-slate-400 font-mono">
                Memo Ref: {result.memoNumber || `MEMO-2026-SEM${result.semester}-0542`}
              </p>
            </div>

            <div className="flex items-center gap-2 border-l pl-3 border-slate-200 dark:border-slate-700 shrink-0">
              <QrCode className="h-6 w-6 text-slate-700 dark:text-slate-300" />
              <div className="text-[9px] font-mono leading-tight">
                <span className="text-emerald-600 font-bold block">QR VERIFIED</span>
                <span className="text-slate-400">Exam Branch Seal</span>
              </div>
            </div>
          </div>

        </div>

        <DialogFooter className="pt-2 flex flex-wrap justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => onApplyRevaluation?.()}
            className="rounded-xl text-xs gap-1.5 border-purple-300 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 cursor-pointer font-bold"
          >
            <RefreshCw className="h-3.5 w-3.5 text-purple-600" /> Apply Revaluation
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.print()}
              className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" /> Print
            </Button>

            <Button
              type="button"
              onClick={handleDownloadMemo}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="h-3.5 w-3.5" /> Download Memo PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
