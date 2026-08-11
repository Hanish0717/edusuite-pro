import React from "react";
import { StudentProfileData } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, ShieldCheck, Copy, Check } from "lucide-react";
import { useState } from "react";

interface QrModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentProfileData;
}

export function QrModal({ open, onOpenChange, student }: QrModalProps) {
  const [copied, setCopied] = useState(false);
  const verifyUrl = `https://edusuite.edu.in/verify/student/${student.rollNumber}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl text-center">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-bold flex items-center justify-center gap-2 text-slate-900 dark:text-white">
            <ShieldCheck className="h-5 w-5 text-blue-600" /> Student Verification QR
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Scan this encrypted QR code to verify student identity, registration & active enrollment.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="p-3 bg-white rounded-xl shadow-md border border-slate-100">
            <QrCode className="h-40 w-40 text-slate-900" />
          </div>
          
          <div className="mt-3 space-y-1">
            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800">
              {student.rollNumber}
            </span>
            <p className="text-[11px] text-slate-500 font-medium">{student.name} ({student.department})</p>
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs font-mono">
          <span className="truncate text-slate-600 dark:text-slate-300 max-w-[220px]">{verifyUrl}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={copyUrl}
            className="h-7 w-7 p-0 text-slate-600 dark:text-slate-300 hover:text-blue-600"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>

        <DialogFooter className="mt-4">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
