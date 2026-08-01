import React from "react";
import { IssuedBookItem } from "./types";
import { BookOpen, RefreshCw, AlertCircle, Clock, Calendar, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface IssuedTabProps {
  issuedBooks: IssuedBookItem[];
  onOpenRenewModal: (book: IssuedBookItem) => void;
  onOpenBookDetails: (bookId: string) => void;
}

export function IssuedTab({ issuedBooks, onOpenRenewModal, onOpenBookDetails }: IssuedTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" /> Currently Issued Books ({issuedBooks.length})
          </h3>
          <p className="text-xs text-slate-500">
            Active borrowed items associated with your student ID pass.
          </p>
        </div>
      </div>

      {issuedBooks.length > 0 ? (
        <div className="space-y-3">
          {issuedBooks.map((book) => (
            <div
              key={book.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-16 h-22 object-cover rounded-xl shadow-md border border-slate-200 dark:border-slate-700 shrink-0"
                />

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[10px] text-purple-600 border-purple-200">
                      Acc: {book.accNumber}
                    </Badge>
                    {book.daysRemaining < 0 && (
                      <Badge className="bg-rose-500 text-white font-mono text-[9px]">OVERDUE</Badge>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{book.title}</h4>
                  <p className="text-xs text-slate-500">{book.author} • ISBN: {book.isbn}</p>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-400 pt-1">
                    <span>Issue Date: <strong>{book.issueDate}</strong></span>
                    <span>Due Date: <strong className={book.daysRemaining < 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>{book.dueDate}</strong></span>
                    <span>Renewals: <strong>{book.renewalsCount} / {book.maxRenewals}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                <Button
                  onClick={() => onOpenRenewModal(book)}
                  variant="outline"
                  className="rounded-xl text-xs font-semibold h-9 gap-1.5"
                >
                  <RefreshCw className="h-4 w-4 text-purple-600" /> Renew Loan
                </Button>
                <Button
                  onClick={() => {
                    toast.info(`Return request initiated for ${book.title}. Drop off at Desk 1.`);
                  }}
                  className="rounded-xl text-xs font-semibold h-9 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800"
                >
                  Return Request
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
          <BookOpen className="h-10 w-10 text-slate-400 mx-auto" />
          <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">No books currently issued.</h4>
          <p className="text-xs text-slate-500">Visit the Catalog tab to search and check out books.</p>
        </div>
      )}
    </div>
  );
}
