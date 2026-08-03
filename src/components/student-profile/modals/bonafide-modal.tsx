import React from "react";
import { StudentProfileData } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, ShieldCheck, Award } from "lucide-react";
import { brand } from "@/config/branding";

interface BonafideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentProfileData;
}

export function BonafideModal({ open, onOpenChange, student }: BonafideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl">
        <DialogHeader className="space-y-1 text-left border-b pb-3 border-slate-200 dark:border-slate-800">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" /> Official Bonafide Study Certificate
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            System-generated authentic conduct certificate for Passport, Bank Loan, or Internship submissions.
          </DialogDescription>
        </DialogHeader>

        {/* CERTIFICATE CANVAS */}
        <div className="my-3 p-8 border-4 border-double border-blue-900/30 dark:border-blue-500/30 rounded-2xl bg-gradient-to-b from-slate-50 to-blue-50/20 dark:from-slate-850 dark:to-slate-900 space-y-6 text-center font-serif text-slate-800 dark:text-slate-200 shadow-inner">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-display uppercase tracking-wider text-blue-900 dark:text-blue-400">
              {brand.name} University
            </h2>
            <p className="text-xs font-sans text-slate-500 uppercase tracking-widest">
              Accredited NAAC A++ Grade &middot; Autonomous Institute
            </p>
            <div className="text-[10px] font-sans text-slate-400">Ref: EDU/BONAFIDE/2025/CS-0912</div>
          </div>

          <div className="text-sm font-bold uppercase tracking-widest underline decoration-blue-500 font-sans py-2 text-slate-900 dark:text-white">
            BONAFIDE CERTIFICATE
          </div>

          <div className="text-xs leading-relaxed text-justify space-y-3 font-sans max-w-lg mx-auto">
            <p>
              This is to certify that <strong>Mr. {student.name}</strong>, Son of <strong>Mr. {student.parent.father.name}</strong>, bearing Roll Number <strong className="font-mono text-blue-600">{student.rollNumber}</strong> is a bonafide student of this institution.
            </p>
            <p>
              He is currently pursuing <strong>{student.program} ({student.degree})</strong> in the department of <strong>{student.department}</strong> during the Academic Year <strong>{student.academicYear}</strong> (Semester V).
            </p>
            <p>
              During his study in our institute, his conduct and character have been found to be <strong>EXCELLENT</strong>.
            </p>
          </div>

          <div className="pt-6 flex items-center justify-between font-sans text-[11px] border-t border-slate-300 dark:border-slate-700">
            <div className="text-left">
              <div className="text-slate-400 text-[10px]">Date of Issue</div>
              <div className="font-bold">{new Date().toLocaleDateString()}</div>
            </div>
            <div className="text-center">
              <ShieldCheck className="h-8 w-8 text-blue-600 mx-auto" />
              <span className="text-[9px] text-slate-400 uppercase tracking-widest block mt-0.5">ERP Digital Seal</span>
            </div>
            <div className="text-right">
              <div className="font-serif italic font-bold text-blue-700 dark:text-blue-400 text-xs">Dr. S. K. Mukherjee</div>
              <div className="text-slate-500 font-semibold text-[10px]">Dean of Academic Affairs</div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl text-xs">
            Close
          </Button>
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="rounded-xl text-xs gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>
          <Button
            onClick={() => alert("Downloading signed Bonafide PDF...")}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Download Signed PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
