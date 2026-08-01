import React, { useState } from "react";
import { AssignmentItem } from "./types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, FileCheck, AlertTriangle, Clock, History } from "lucide-react";
import { toast } from "sonner";

interface AssignmentModalProps {
  assignment: AssignmentItem | null;
  onClose: () => void;
  onSubmitSuccess: (id: string) => void;
}

export function AssignmentModal({ assignment, onClose, onSubmitSuccess }: AssignmentModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!assignment) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile && !notes.trim()) {
      toast.error("Please attach a document file or enter submission notes.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Assignment '${assignment.title}' submitted successfully!`);
      onSubmitSuccess(assignment.id);
      onClose();
    }, 800);
  };

  return (
    <Dialog open={!!assignment} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <UploadCloud className="h-4 w-4 text-purple-600" /> Submit Assignment: {assignment.courseCode}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Due Date: {assignment.dueDate} ({assignment.submissionType})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2 text-xs">
          {assignment.isLateSubmissionAllowed && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/20 text-amber-700 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold block">Late Submission Policy:</span>
                <span className="text-[11px]">{assignment.lateFeeDeduction}</span>
              </div>
            </div>
          )}

          {/* DRAG & DROP FILE UPLOAD BOX */}
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-purple-500 rounded-2xl p-6 text-center space-y-2 bg-slate-50/50 dark:bg-slate-800/40 transition-colors">
            <UploadCloud className="h-8 w-8 text-purple-600 mx-auto" />
            <div className="space-y-1">
              <p className="font-bold text-slate-700 dark:text-slate-200">
                {selectedFile ? selectedFile.name : "Drag and drop your file here"}
              </p>
              <p className="text-[11px] text-slate-400">
                Supports PDF, ZIP, DOCX, CPP up to 50MB
              </p>
            </div>

            <label className="inline-block">
              <input type="file" onChange={handleFileChange} className="hidden" />
              <span className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold cursor-pointer shadow-xs">
                Browse Files
              </span>
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 font-semibold">Submission Remarks / Notes</label>
            <Textarea
              placeholder="Add optional notes for faculty regarding your submission..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-20 text-xs rounded-xl"
            />
          </div>

          {/* SUBMISSION HISTORY LOG */}
          {assignment.submissionDate && (
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 font-mono">
                <History className="h-3 w-3" /> Previous Submission History
              </span>
              <p className="text-[11px] font-mono text-emerald-600 font-semibold">
                Submitted on {assignment.submissionDate}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl text-xs">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5 font-semibold"
          >
            {isSubmitting ? "Submitting..." : "Confirm & Submit Assignment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
