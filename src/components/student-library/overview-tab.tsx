import React from "react";
import { IssuedBookItem, ReservedBookItem, FineRecordItem, BookItem } from "./types";
import { 
  BookOpen, 
  Clock, 
  BookmarkCheck, 
  AlertCircle, 
  RefreshCw, 
  ChevronRight, 
  ArrowUpRight, 
  ShieldCheck, 
  CreditCard 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OverviewTabProps {
  issuedBooks: IssuedBookItem[];
  reservedBooks: ReservedBookItem[];
  pendingFines: FineRecordItem[];
  onOpenRenewModal: (book: IssuedBookItem) => void;
  onOpenBookDetails: (bookId: string) => void;
  onOpenFineModal: (fine: FineRecordItem) => void;
  onSwitchTab: (tab: string) => void;
}

export function OverviewTab({
  issuedBooks,
  reservedBooks,
  pendingFines,
  onOpenRenewModal,
  onOpenBookDetails,
  onOpenFineModal,
  onSwitchTab,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* SECTION 1: CURRENTLY ISSUED BOOKS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Currently Issued Books ({issuedBooks.length})
            </h3>
          </div>
          <Button
            onClick={() => onSwitchTab("issued")}
            variant="ghost"
            size="sm"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 gap-1"
          >
            View All Issued <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {issuedBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {issuedBooks.map((book) => (
              <div
                key={book.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="flex gap-3">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 shrink-0"
                  />

                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-purple-600 transition-colors">
                      {book.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">{book.author}</p>
                    <p className="text-[10px] font-mono text-purple-600 font-bold">Acc: {book.accNumber}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Due Date</span>
                    <strong className={book.daysRemaining < 0 ? "text-rose-600 font-bold" : "text-slate-800 dark:text-slate-200"}>
                      {book.dueDate}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Remaining</span>
                    <strong className={book.daysRemaining < 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
                      {book.daysRemaining < 0 ? `${Math.abs(book.daysRemaining)} Days Late` : `${book.daysRemaining} Days`}
                    </strong>
                  </div>
                </div>

                <div className="flex gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    onClick={() => onOpenRenewModal(book)}
                    size="sm"
                    variant="outline"
                    className="flex-1 rounded-xl text-[11px] font-semibold h-8 gap-1"
                  >
                    <RefreshCw className="h-3 w-3 text-purple-600" /> Renew
                  </Button>
                  <Button
                    onClick={() => onOpenBookDetails(book.bookId)}
                    size="sm"
                    className="flex-1 rounded-xl text-[11px] font-semibold h-8 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800"
                  >
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2 bg-slate-50/50 dark:bg-slate-900/50">
            <BookOpen className="h-10 w-10 text-slate-400 mx-auto" />
            <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">No books currently issued.</h4>
            <p className="text-xs text-slate-500">Explore the OPAC catalog to request and borrow books.</p>
          </div>
        )}
      </div>

      {/* SECTION 3 & 4: RESERVATIONS & FINES SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* HOLDS & RESERVATIONS */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="h-5 w-5 text-blue-600" />
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                Holds & Reservations ({reservedBooks.length})
              </h4>
            </div>
            <Button
              onClick={() => onSwitchTab("reservations")}
              variant="ghost"
              size="sm"
              className="text-xs font-bold text-blue-600 h-7"
            >
              Manage
            </Button>
          </div>

          <div className="space-y-3">
            {reservedBooks.slice(0, 3).map((res) => (
              <div
                key={res.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between text-xs"
              >
                <div className="min-w-0 pr-2">
                  <h5 className="font-bold text-slate-900 dark:text-white truncate">{res.title}</h5>
                  <p className="text-[11px] text-slate-500 font-mono">Reserved: {res.reservedDate}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    className={`text-[9px] font-mono ${
                      res.status === "Ready for Pickup"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    }`}
                  >
                    Queue #{res.queuePosition}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PENDING FINES */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-rose-600" />
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                Pending Library Fines ({pendingFines.length})
              </h4>
            </div>
            <Button
              onClick={() => onSwitchTab("fines")}
              variant="ghost"
              size="sm"
              className="text-xs font-bold text-rose-600 h-7"
            >
              Fine Details
            </Button>
          </div>

          {pendingFines.length > 0 ? (
            <div className="space-y-3">
              {pendingFines.map((fine) => (
                <div
                  key={fine.id}
                  className="p-3 rounded-xl border border-rose-100 dark:border-rose-950/40 bg-rose-50/40 dark:bg-rose-950/20 flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{fine.bookTitle}</h5>
                    <p className="text-[11px] text-rose-600 font-medium">{fine.reason}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black font-mono text-slate-900 dark:text-white text-sm">₹{fine.amount.toFixed(2)}</span>
                    <Button
                      onClick={() => onOpenFineModal(fine)}
                      size="sm"
                      className="rounded-xl text-[11px] bg-rose-600 hover:bg-rose-700 text-white font-bold h-8"
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 font-medium">
              ✨ No outstanding fines. Your library account is in good standing!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
