import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SemesterResultItem } from "../types";
import { FileCheck, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface RevaluationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semesterResults: SemesterResultItem[];
  defaultSemester?: number;
  onSubmitRevaluation?: (data: {
    semester: number;
    subjectCode: string;
    subjectName: string;
    type: "Paper Revaluation" | "Recounting" | "Script Copy";
    reason: string;
    comments: string;
  }) => void;
}

export function RevaluationModal({
  open,
  onOpenChange,
  semesterResults = [],
  defaultSemester = 5,
  onSubmitRevaluation,
}: RevaluationModalProps) {
  const safeSemesterResults = semesterResults || [];
  const [selectedSem, setSelectedSem] = useState<number>(defaultSemester);
  const currentResult = safeSemesterResults.find((r) => r?.semester === selectedSem) || safeSemesterResults[0];

  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(
    currentResult?.subjects?.[0]?.code || ""
  );
  const [revalType, setRevalType] = useState<"Paper Revaluation" | "Recounting" | "Script Copy">("Paper Revaluation");
  const [reason, setReason] = useState("Internal valuation discrepancy in section B theory answer evaluation.");
  const [comments, setComments] = useState("Requesting paper recounting and answer script digital copy.");

  const availableSubjects = currentResult?.subjects || [];
  const selectedSubject = availableSubjects.find((s) => s?.code === selectedSubjectCode) || availableSubjects[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) {
      toast.error("Please select a valid subject for revaluation.");
      return;
    }

    const refId = `REV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    if (onSubmitRevaluation) {
      onSubmitRevaluation({
        semester: selectedSem,
        subjectCode: selectedSubject.code,
        subjectName: selectedSubject.name,
        type: revalType,
        reason,
        comments,
      });
    }

    toast.success(`Request Submitted Successfully! Ref ID: ${refId}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl">
        <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-purple-600" /> Apply for Revaluation / Recounting
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Submit answer script re-evaluation application to Controller of Examinations
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-2 text-xs">
          
          {/* SEMESTER SELECT */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Semester</label>
            <select
              value={selectedSem}
              onChange={(e) => {
                const sem = Number(e.target.value);
                setSelectedSem(sem);
                const res = safeSemesterResults.find((r) => r?.semester === sem);
                if (res && res.subjects.length > 0) {
                  setSelectedSubjectCode(res.subjects[0].code);
                }
              }}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-semibold text-xs"
            >
              {semesterResults.map((r) => (
                <option key={r.semester} value={r.semester}>
                  Semester {r.semester} ({r.academicYear})
                </option>
              ))}
            </select>
          </div>

          {/* SUBJECT SELECT */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Select Subject</label>
            <select
              value={selectedSubjectCode}
              onChange={(e) => setSelectedSubjectCode(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-semibold text-xs"
            >
              {availableSubjects.map((sub) => (
                <option key={sub.code} value={sub.code}>
                  {sub.code} - {sub.name} (Grade: {sub.grade}, Total: {sub.total})
                </option>
              ))}
            </select>
          </div>

          {/* REVALUATION TYPE */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Revaluation Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(["Paper Revaluation", "Recounting", "Script Copy"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRevalType(type)}
                  className={`p-2 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer ${
                    revalType === type
                      ? "border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-600"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* REASON */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Reason for Request</label>
            <Input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain discrepancy in valuation..."
              className="rounded-xl h-9 text-xs"
            />
          </div>

          {/* COMMENTS */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Additional Comments</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Additional notes for valuation committee..."
              rows={2}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          {/* FEE SUMMARY BOX */}
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-center justify-between text-[11px] text-purple-900 dark:text-purple-200 font-mono font-bold">
            <span>Revaluation Processing Fee:</span>
            <span>₹500 / $30 per paper</span>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold gap-1.5 cursor-pointer shadow-sm"
            >
              <FileCheck className="h-4 w-4" /> Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
