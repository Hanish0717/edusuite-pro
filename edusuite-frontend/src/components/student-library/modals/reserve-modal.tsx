import React, { useState } from "react";
import { BookItem } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookmarkCheck, Users, Calendar, Info } from "lucide-react";
import { toast } from "sonner";

interface ReserveModalProps {
  book: BookItem | null;
  onClose: () => void;
  onConfirmReserve: (book: BookItem) => void;
}

export function ReserveModal({ book, onClose, onConfirmReserve }: ReserveModalProps) {
  const [loading, setLoading] = useState(false);

  if (!book) return null;

  const handleReserve = () => {
    setLoading(true);
    setTimeout(() => {
      onConfirmReserve(book);
      setLoading(false);
      toast.success(`Reservation placed for "${book.title}". You are #3 in queue.`);
      onClose();
    }, 600);
  };

  return (
    <Dialog open={!!book} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader className="text-left border-b pb-3 border-slate-100 dark:border-slate-800">
          <DialogTitle className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookmarkCheck className="h-5 w-5 text-purple-600" /> Reserve Book / Hold Queue
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Place your reservation to be notified when this book becomes available.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-2 text-xs">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{book.title}</h4>
            <p className="text-slate-500 font-mono text-[11px] mt-0.5">Author: {book.author}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px]">Queue Position</span>
              <strong className="text-purple-600 dark:text-purple-400 text-xs">Position #3</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px]">Est. Availability</span>
              <strong className="text-slate-900 dark:text-white text-xs">Aug 08, 2026</strong>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-blue-700 dark:text-blue-400 flex items-start gap-2 text-[11px]">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Once available, you will have 48 hours to collect the book from the central issue desk before the hold expires.
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2 border-t pt-3 border-slate-100 dark:border-slate-800">
          <Button onClick={onClose} variant="outline" className="rounded-xl text-xs">
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={handleReserve}
            className="rounded-xl text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold gap-1.5"
          >
            {loading ? "Placing Hold..." : "Confirm Reservation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
