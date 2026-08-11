import React from "react";
import { BookItem } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, MapPin, Layers, Hash, Calendar, Star, BookmarkCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface BookModalProps {
  book: BookItem | null;
  onClose: () => void;
  onReserve?: (book: BookItem) => void;
}

export function BookDetailsModal({ book, onClose, onReserve }: BookModalProps) {
  if (!book) return null;

  return (
    <Dialog open={!!book} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-xl rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-mono text-[10px] text-purple-600 border-purple-200">
              {book.category}
            </Badge>
            <Badge
              className={`text-[9px] font-mono px-2 py-0.5 ${
                book.status === "Available"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : book.status === "Reserved"
                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  : "bg-rose-500/10 text-rose-600 border-rose-500/20"
              }`}
            >
              {book.status}
            </Badge>
          </div>
          <DialogTitle className="text-lg font-black text-slate-900 dark:text-white pt-2 leading-snug">
            {book.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-purple-600 dark:text-purple-400 font-medium">
            By {book.author} • {book.publisher} ({book.publicationYear})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2 max-h-[65vh] overflow-y-auto pr-1">
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-28 h-36 object-cover rounded-xl shadow-md border border-slate-200 dark:border-slate-700 shrink-0 mx-auto sm:mx-0"
            />

            <div className="space-y-2 flex-1 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block">ISBN-13</span>
                  <strong className="text-slate-900 dark:text-white text-[11px]">{book.isbn}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Location Rack</span>
                  <strong className="text-purple-600 dark:text-purple-400 text-[11px] flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {book.rackNumber}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Edition</span>
                  <span className="text-slate-800 dark:text-slate-200">{book.edition}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Copies Status</span>
                  <span className="font-bold text-emerald-600">
                    {book.availableCopies} available / {book.totalCopies} total
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px] pt-1">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> {book.rating || 4.5} Rating
                </span>
                <span>Language: {book.language}</span>
                <span>Semester: {book.semester || "All"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Book Abstract & Description</h5>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed p-3 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800">
              {book.description}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 border-t pt-3 border-slate-100 dark:border-slate-800">
          <Button onClick={onClose} variant="outline" className="rounded-xl text-xs font-semibold">
            Close
          </Button>
          {book.availableCopies > 0 ? (
            <Button
              onClick={() => {
                toast.success(`Book checkout requested for ${book.title}. Present your ID card at Counter 2.`);
                onClose();
              }}
              className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" /> Request Borrowing
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (onReserve) onReserve(book);
              }}
              className="rounded-xl text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold gap-1.5"
            >
              <BookmarkCheck className="h-4 w-4" /> Reserve Book
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
