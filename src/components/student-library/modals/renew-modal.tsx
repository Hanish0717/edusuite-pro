import React from "react";
import { BorrowedBook } from "../types";
import { RefreshCw, Calendar, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RenewModalProps {
  book: BorrowedBook | null;
  onClose: () => void;
  onConfirmRenew: (borrowedId: string) => void;
}

export function RenewModal({ book, onClose, onConfirmRenew }: RenewModalProps) {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden space-y-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-purple-300" />
              <h3 className="font-black text-base">Renew Library Book Loan</h3>
            </div>
            <p className="text-xs text-purple-200">Extend due date by 14 additional days</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Details */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 space-y-1">
            <h4 className="font-black text-sm text-purple-900 dark:text-purple-200">{book.title}</h4>
            <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">Author: {book.author}</p>
            <p className="text-[11px] font-mono text-purple-500">Acc No: {book.accNumber}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-sans">Current Due Date</span>
              <strong className="text-slate-700 dark:text-slate-300">{book.dueDate}</strong>
            </div>
            <div>
              <span className="text-[10px] text-purple-500 block uppercase font-sans">New Extended Due Date</span>
              <strong className="text-emerald-600 font-bold">2026-08-19</strong>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            Renewal Count: <strong className="font-mono text-slate-900 dark:text-white">{book.renewalsCount + 1} / {book.maxRenewals}</strong> maximum allowed extensions.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
          <Button onClick={onClose} variant="outline" className="rounded-xl text-xs font-semibold h-9">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirmRenew(book.id);
              onClose();
              toast.success(`Loan extended 14 days for "${book.title}". New due date: 19 Aug 2026.`);
            }}
            className="rounded-xl text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold h-9 gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" /> Confirm 14-Day Extension
          </Button>
        </div>
      </div>
    </div>
  );
}
