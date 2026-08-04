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
import { FileText, CheckCircle2, Clock, ShieldAlert, Receipt, UserCheck, Info } from "lucide-react";
import { FineRecordItem } from "./types";

interface FineRecordModalProps {
  open: boolean;
  onClose: () => void;
  fine?: FineRecordItem | null;
}

export function FineRecordModal({ open, onClose, fine }: FineRecordModalProps) {
  if (!fine) return null;

  const isPaid = fine.status === "Paid";
  const isbn = "978-0078022159";
  const issueDate = "2026-07-15";
  const librarianRemarks =
    fine.status === "Paid"
      ? "Fine cleared at Counter 2. Receipt generated and verified."
      : "Overdue fine assessed as per Central Library Regulation 4B for late book return.";
  const lastUpdated = "2026-08-04 09:30 AM";
  const receiptNumber = isPaid ? (fine.transactionId || "RCP-2026-9901") : "N/A (Pending)";
  const paymentDate = isPaid ? fine.currentDate : "N/A";
  const verifiedBy = isPaid ? "Prof. Ananya Sharma (Accounts Desk)" : "N/A";

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg p-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
        {/* HEADER */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white space-y-1">
          <div className="flex items-center justify-between">
            <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30 text-[10px] uppercase font-mono">
              Audit Record Ledger
            </Badge>
            <span className="text-xs font-mono text-slate-300">{fine.id}</span>
          </div>
          <DialogTitle className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-400" /> Fine Transaction Record
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-300">
            Read-only fine statement and transaction history log.
          </DialogDescription>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4 text-xs">
          {/* Main Book Title & Fine Overview */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Book Name</span>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">{fine.bookTitle}</h4>
                <span className="text-[11px] text-slate-500 font-mono">ISBN: {isbn}</span>
              </div>
              <Badge
                className={`text-[10px] font-mono ${
                  isPaid ? "bg-emerald-500 text-white" : "bg-rose-500 text-white font-bold"
                }`}
              >
                {fine.status}
              </Badge>
            </div>
          </div>

          {/* Transaction Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] block uppercase font-sans">Issue Date</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{issueDate}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] block uppercase font-sans">Due Date</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{fine.dueDate}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] block uppercase font-sans">Days Late</span>
              <span className="font-bold text-rose-600">{fine.lateDays} Days</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] block uppercase font-sans">Fine Amount</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs">₹{fine.fineAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Unpaid / Paid Conditional Banner & Details */}
          {!isPaid ? (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-900 dark:text-rose-200">
              <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-xs">Status: Pending</span>
                <p className="text-[11px] font-medium leading-relaxed mt-0.5">
                  Pending payment at Library Accounts Section.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-2 text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-xs">Payment Cleared & Verified</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 border-t border-emerald-200/60 dark:border-emerald-900/60">
                <div>
                  <span className="text-slate-500 block">Payment Date</span>
                  <span className="font-bold">{paymentDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Receipt Number</span>
                  <span className="font-bold">{receiptNumber}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block">Verified By</span>
                  <span className="font-bold flex items-center gap-1">
                    <UserCheck className="h-3 w-3 text-emerald-600" /> {verifiedBy}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Librarian Remarks & Audit Timestamps */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Librarian Remarks</span>
              <p className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                {librarianRemarks}
              </p>
            </div>

            <div className="flex justify-between items-center text-slate-400 text-[10px] font-mono pt-1">
              <span>Receipt Number: <strong>{receiptNumber}</strong></span>
              <span>Last Updated: <strong>{lastUpdated}</strong></span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
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
