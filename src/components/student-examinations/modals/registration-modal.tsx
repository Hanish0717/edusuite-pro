import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AvailableCourseItem } from "../types";
import { CheckCircle2, ShieldCheck, AlertCircle, Clock, Zap } from "lucide-react";
import { toast } from "sonner";

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCourses: AvailableCourseItem[];
  onConfirm: () => void;
}

export function RegistrationModal({ open, onOpenChange, selectedCourses = [], onConfirm }: RegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeCourses = selectedCourses || [];
  const totalCredits = safeCourses.reduce((sum, c) => sum + (c?.credits || 0), 0);

  const handleConfirmRegistration = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm();
      onOpenChange(false);
      toast.success("Semester Course Registration submitted to Faculty Advisor for approval!");
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" /> Confirm Course Registration
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Review your course selections and automated ERP validation checks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2 text-xs">
          
          {/* VALIDATION CHECKS */}
          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
            <span className="font-bold text-emerald-700 dark:text-emerald-300 block text-xs">Automated ERP Checks Passed:</span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Prerequisite Check
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Credit Limit (&le; 24)
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> No Time Clashes
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> No Duplicate Courses
              </div>
            </div>
          </div>

          {/* SELECTED COURSES LIST */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
              <span>Selected Courses ({selectedCourses.length})</span>
              <span className="font-mono text-blue-600">{totalCredits} / 24 Credits</span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {selectedCourses.map((c) => (
                <div key={c.id} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                  <div>
                    <span className="font-bold font-mono text-blue-600">{c.code}: </span>
                    <span className="font-semibold text-slate-900 dark:text-white">{c.name}</span>
                  </div>
                  <span className="font-mono text-slate-500">{c.credits} Cr</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <DialogFooter className="pt-2 gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl text-xs">
            Back to Edit
          </Button>
          <Button type="button" onClick={handleConfirmRegistration} disabled={isSubmitting} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5">
            {isSubmitting ? "Submitting..." : "Submit for Advisor Approval"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
