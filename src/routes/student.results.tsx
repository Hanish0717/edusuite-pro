import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/student/results")({
  head: () => ({
    meta: [{ title: "My Results & Grade Card — EduSuite Pro" }],
  }),
  component: StudentResultsPage,
});

interface SubjectGrade {
  code: string;
  name: string;
  credits: number;
  grade: "O" | "A+" | "A" | "B+" | "B";
  gradePoint: number;
  status: "Pass" | "Fail";
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
}

const MOCK_GRADES_SEM4: SubjectGrade[] = [
  { code: "CS401", name: "Advanced Distributed Systems", credits: 4, grade: "A+", gradePoint: 9, status: "Pass", internalMarks: 38, externalMarks: 54, totalMarks: 92 },
  { code: "CS402", name: "Deep Learning & Neural Networks", credits: 4, grade: "O", gradePoint: 10, status: "Pass", internalMarks: 40, externalMarks: 56, totalMarks: 96 },
  { code: "CS403", name: "Compiler Design & Code Optimization", credits: 3, grade: "A", gradePoint: 8, status: "Pass", internalMarks: 34, externalMarks: 48, totalMarks: 82 },
  { code: "CS404", name: "Cloud Native Microservices", credits: 3, grade: "O", gradePoint: 10, status: "Pass", internalMarks: 39, externalMarks: 58, totalMarks: 97 },
  { code: "CS405", name: "Distributed Systems Lab", credits: 2, grade: "O", gradePoint: 10, status: "Pass", internalMarks: 48, externalMarks: 50, totalMarks: 98 },
];

function StudentResultsPage() {
  const [selectedSem, setSelectedSem] = useState<number>(4);
  const [revalModalOpen, setRevalModalOpen] = useState(false);
  const [revalSubject, setRevalSubject] = useState("CS403");
  const [revalReason, setRevalReason] = useState("");

  const handleApplyReval = () => {
    if (!revalReason.trim()) {
      toast.error("Please enter a reason for revaluation.");
      return;
    }
    setRevalModalOpen(false);
    setRevalReason("");
    toast.success(`Revaluation application submitted for ${revalSubject}! Reference ID: REV-${Date.now()}`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-6 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-md">
            <Award className="size-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">Academic Results & Grade Card</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Adm No: 22CS101 • B.Tech Computer Science & Engineering
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setRevalModalOpen(true)}
            variant="outline"
            className="h-9 text-xs font-bold rounded-xl border-slate-200 dark:border-slate-700"
          >
            <RotateCcw className="size-3.5 mr-1 text-slate-500" /> Revaluation
          </Button>
          <Button
            onClick={() => toast.success("Downloading official Grade Transcript PDF...")}
            className="h-9 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            <Download className="size-3.5 mr-1" /> Download Transcript PDF
          </Button>
        </div>
      </div>

      {/* CGPA OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Cumulative CGPA</span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">9.12 / 10.0</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Semester 4 SGPA</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">9.30</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Total Backlogs</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">0</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Credits Cleared</span>
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 block">114 / 160</span>
        </div>
      </div>

      {/* SEMESTER SELECTOR CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[1, 2, 3, 4].map((sem) => (
          <button
            key={sem}
            onClick={() => setSelectedSem(sem)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSem === sem
                ? "bg-[#091024] text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
            }`}
          >
            Semester {sem} Results
          </button>
        ))}
      </div>

      {/* GRADE TABLE */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold">Semester {selectedSem} Subject Performance Breakdown</h2>
          <Badge className="bg-emerald-500/10 text-emerald-600 font-mono font-bold text-[10px]">
            <CheckCircle2 className="size-3 mr-1" /> PASSED ALL SUBJECTS
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Subject Code</th>
                <th className="py-3 px-3">Subject Name</th>
                <th className="py-3 px-3">Credits</th>
                <th className="py-3 px-3 text-center">Internal (50)</th>
                <th className="py-3 px-3 text-center">External (60)</th>
                <th className="py-3 px-3 text-center">Total (100)</th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {MOCK_GRADES_SEM4.map((sub) => (
                <tr key={sub.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-indigo-600">{sub.code}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{sub.name}</td>
                  <td className="py-3 px-3">{sub.credits}</td>
                  <td className="py-3 px-3 text-center font-mono">{sub.internalMarks}</td>
                  <td className="py-3 px-3 text-center font-mono">{sub.externalMarks}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 dark:text-white">{sub.totalMarks}</td>
                  <td className="py-3 px-3 text-center font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-mono">
                      {sub.grade} ({sub.gradePoint})
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REVALUATION MODAL */}
      <Dialog open={revalModalOpen} onOpenChange={setRevalModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900">
          <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <RotateCcw className="size-4 text-indigo-600" /> Apply for Answer Script Revaluation
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Submit subject revaluation request for Semester 4 evaluation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-2 text-xs">
            <div className="space-y-1">
              <label className="text-slate-500 font-semibold">Select Subject</label>
              <select
                value={revalSubject}
                onChange={(e) => setRevalSubject(e.target.value)}
                className="w-full h-9 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 font-bold"
              >
                {MOCK_GRADES_SEM4.map((s) => (
                  <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-semibold">Reason for Revaluation</label>
              <Input
                placeholder="e.g. Unevaluated answer in Question 4(b)..."
                value={revalReason}
                onChange={(e) => setRevalReason(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRevalModalOpen(false)} className="rounded-xl text-xs">
              Cancel
            </Button>
            <Button
              onClick={handleApplyReval}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
            >
              Submit Application (Fee ₹500)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
