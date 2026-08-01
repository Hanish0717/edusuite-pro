import React, { useState } from "react";
import { IssuedBookItem } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface RenewModalProps {
  book: IssuedBookItem | null;
  onClose: () => void;
  onConfirmRenew: (bookId: string) => void;
}

export function RenewModal({ book, onClose, onConfirmRenew }: RenewModalProps) {
  const [loading, setLoading] = useState(false);

  if (!book) return null;

  const isRenewalAllowed = book.renewalsCount < book.maxRenewals && book.daysRemaining >= 0;

  const handleRenew = () => {
    setLoading(true);
    setTimeout(() => {
      onConfirmRenew(book.id);
      setLoading(false);
      toast.success(`Successfully renewed "${book.title}". New due date is 14 days from today.`);
      onClose();
    }, 600);
  };

  return (
    <Dialog open={!!book} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader className="text-left border-b pb-3 border-slate-100 dark:border-slate-800">
          <DialogTitle className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-purple-600" /> Renew Book Loan
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Extend your borrowing period by 14 additional calendar days.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-2 text-xs">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{book.title}</h4>
            <p className="text-slate-500 font-mono text-[11px]">Acc No: {book.accNumber} • Author: {book.author}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px]">Current Due Date</span>
              <span className="font-bold text-slate-900 dark:text-white">{book.dueDate}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-emerald-600 block text-[10px]">New Due Date</span>
              <span className="font-bold text-emerald-600">2026-08-19 (+14 days)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Renewals Used:</span>
              <strong className="font-mono">{book.renewalsCount} / {book.maxRenewals}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fine Outstanding:</span>
              <strong className="font-mono text-emerald-600">₹{book.fineAmount.toFixed(2)}</strong>
            </div>
          </div>

          {!isRenewalAllowed && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-400 flex items-start gap-2 text-[11px]">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                {book.daysRemaining < 0 
                  ? "Book is overdue. Please clear fine and return at counter." 
                  : "Maximum renewal limit reached for this book."}
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 border-t pt-3 border-slate-100 dark:border-slate-800">
          <Button onClick={onClose} variant="outline" className="rounded-xl text-xs">
            Cancel
          </Button>
          <Button
            disabled={!isRenewalAllowed || loading}
            onClick={handleRenew}
            className="rounded-xl text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold gap-1.5"
          >
            {loading ? "Processing..." : "Confirm Renewal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
