import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Info, FileText, UserCheck, Calendar, Receipt, DollarSign } from "lucide-react";
import { FineRecordItem, BorrowedBook } from "./types";

interface FineNoticeModalProps {
  open: boolean;
  onClose: () => void;
  fine?: FineRecordItem | null;
  borrowedBook?: BorrowedBook | null;
}

export function FineNoticeModal({
  open,
  onClose,
  fine,
  borrowedBook,
}: FineNoticeModalProps) {
  // Fallback defaults derived dynamically if specific fine/book selected
  const fineId = fine?.id || "FINE-8801";
  const studentName = "Rahul Sharma";
  const studentId = "STU-2026-0891";
  const bookTitle = fine?.bookTitle || borrowedBook?.title || "Database System Concepts";
  const accNumber = borrowedBook?.accNumber || "ACC-88391";
  const issueDate = borrowedBook?.issueDate || "2026-07-15";
  const dueDate = fine?.dueDate || borrowedBook?.dueDate || "2026-08-01";
  const returnDate = borrowedBook?.status === "Returned" ? "2026-08-03" : "Not Returned";
  const daysOverdue = fine?.lateDays || borrowedBook?.lateDays || 3;
  const finePerDay = fine?.ratePerDay || 5;
  const totalFine = fine?.fineAmount || borrowedBook?.fineAmount || 15.0;
  const currentStatus = fine?.status || (borrowedBook?.finePaid ? "Paid" : "Pending");
  const generatedBy = borrowedBook?.librarianName || "Dr. S. Ramanujan (Chief Librarian)";
  const generatedDate = fine?.dateIncurred || "2026-08-02";

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg p-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
        {/* MODAL HEADER */}
        <div className="p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white space-y-1">
          <div className="flex items-center justify-between">
            <Badge className="bg-rose-500/20 text-rose-200 border-rose-400/30 text-[10px] uppercase font-mono">
              Official Library Notice
            </Badge>
            <span className="text-xs font-mono text-purple-200">{fineId}</span>
          </div>
          <DialogTitle className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-400" /> Fine Notice Information
          </DialogTitle>
          <DialogDescription className="text-xs text-purple-200">
            Institutional fine assessment record issued by Central Library.
          </DialogDescription>
        </div>

        {/* MODAL BODY - READ ONLY DATA */}
        <div className="p-5 space-y-4 text-xs">
          {/* Student & Book Context */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Student Name</span>
              <strong className="text-slate-900 dark:text-white font-bold">{studentName}</strong>
              <span className="text-[10px] text-slate-500 font-mono block">ID: {studentId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Accession No.</span>
              <strong className="text-purple-600 dark:text-purple-400 font-mono font-bold">{accNumber}</strong>
            </div>
            <div className="col-span-2 border-t border-slate-200/60 dark:border-slate-800 pt-2">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Book Title</span>
              <strong className="text-slate-900 dark:text-white text-xs font-black">{bookTitle}</strong>
            </div>
          </div>

          {/* Detailed Fine Fields Table */}
          <div className="space-y-2 border-t border-b border-slate-100 dark:border-slate-800 py-3">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-500">Issue Date:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{issueDate}</span>
              </div>

              <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-500">Due Date:</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{dueDate}</span>
              </div>

              <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-500">Return Date:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{returnDate}</span>
              </div>

              <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-500">Days Overdue:</span>
                <span className="font-mono font-bold text-rose-600">{daysOverdue} Days</span>
              </div>

              <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-500">Fine Per Day:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₹{finePerDay.toFixed(2)}</span>
              </div>

              <div className="flex justify-between p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40">
                <span className="text-rose-700 dark:text-rose-300 font-bold">Total Fine:</span>
                <span className="font-mono font-black text-rose-600 text-xs">₹{totalFine.toFixed(2)}</span>
              </div>
            </div>

            {/* Additional Status & Officer */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Current Status</span>
                <Badge
                  className={`text-[9px] font-mono ${
                    currentStatus === "Pending"
                      ? "bg-rose-500 text-white font-bold"
                      : "bg-emerald-500 text-white"
                  }`}
                >
                  {currentStatus}
                </Badge>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Generated Date</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{generatedDate}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px]">
              <span className="text-[10px] text-slate-400 block font-mono">Generated By (Librarian)</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                <UserCheck className="h-3.5 w-3.5 text-purple-600" /> {generatedBy}
              </span>
            </div>
          </div>

          {/* Mandatory Payment Instructions Alert */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5 text-amber-900 dark:text-amber-200">
            <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed font-semibold">
              This fine must be paid at the Central Library Counter. Students cannot pay or modify library fines from the Student Portal.
            </p>
          </div>
        </div>

        {/* MODAL FOOTER - ONLY CLOSE BUTTON */}
        <DialogFooter className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-xl text-xs font-bold px-6 h-9"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
