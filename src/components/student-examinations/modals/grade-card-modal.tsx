import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SemesterResultItem, StudentExamProfile } from "../types";
import { Download, Printer, Award, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface GradeCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: SemesterResultItem | null;
  profile: StudentExamProfile;
}

export function GradeCardModal({ open, onOpenChange, result, profile }: GradeCardModalProps) {
  if (!result) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl">
        <DialogHeader className="space-y-1 text-left border-b pb-3 border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="h-7 w-7 text-emerald-600" />
              <div>
                <DialogTitle className="text-base font-bold">
                  Official Grade Sheet & Transcript &mdash; Semester {result.semester}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Issued by Examination Branch, EduSuite Pro Autonomous College
                </DialogDescription>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">
              PASSED (SGPA: {result.sgpa})
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 my-3 text-xs">
          
          {/* STUDENT METRICS */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-400 block text-[10px]">Student Name</span>
              <strong className="text-slate-900 dark:text-white">{profile.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Roll Number</span>
              <strong className="font-mono text-blue-600">{profile.rollNumber}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Exam Month</span>
              <strong className="text-slate-800 dark:text-slate-200">{result.monthYear}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Cumulative CGPA</span>
              <strong className="text-emerald-600 font-mono font-bold">{result.cgpa}</strong>
            </div>
          </div>

          {/* SUBJECT MARKS TABLE */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  <th className="p-2.5">Code</th>
                  <th className="p-2.5">Subject Description</th>
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

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 text-[11px]">
            <span>Total Credits Earned: <strong>{result.creditsEarned}</strong></span>
            <span>SGPA Score: <strong className="text-blue-600 font-mono font-bold text-xs">{result.sgpa}</strong></span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> University Seal Verified
            </span>
          </div>

        </div>

        <DialogFooter className="pt-2 flex gap-2">
          <Button type="button" variant="outline" onClick={() => window.print()} className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-700">
            <Printer className="h-3.5 w-3.5" /> Print Memo
          </Button>
          <Button type="button" onClick={() => toast.success(`Downloading Semester ${result.semester} Grade Card PDF...`)} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5">
            <Download className="h-3.5 w-3.5" /> Download Transcript PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
