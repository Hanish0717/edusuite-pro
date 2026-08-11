import React, { useState } from "react";
import { BorrowedBook, FineRecordItem } from "./types";
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Building2,
  Info,
  UserCheck,
  MapPin,
  Barcode,
  CreditCard,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calculateOverdueFine } from "./library-store";
import { FineNoticeModal } from "./fine-notice-modal";
import { FineRecordModal } from "./fine-record-modal";

interface BorrowedTabProps {
  borrowedBooks: BorrowedBook[];
}

export function BorrowedTab({ borrowedBooks }: BorrowedTabProps) {
  const currentDateStr = "2026-08-04"; // Institutional System Reference Date

  const [selectedNoticeBook, setSelectedNoticeBook] = useState<BorrowedBook | null>(null);
  const [selectedRecordFine, setSelectedRecordFine] = useState<FineRecordItem | null>(null);

  const activeLoans = borrowedBooks.filter((b) => b.status !== "Returned");
  const totalFineAmount = activeLoans.reduce((sum, b) => {
    const { fineAmount } = calculateOverdueFine(b.dueDate, currentDateStr);
    return sum + fineAmount;
  }, 0);

  return (
    <div className="space-y-6">
      {/* SUMMARY BANNER - READ ONLY */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-black tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-300" /> My Issued Books ({borrowedBooks.length})
          </h3>
          <p className="text-xs text-purple-200">
            Live read-only circulation records, due dates, and automated fine statements.
          </p>
        </div>

        {totalFineAmount > 0 && (
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/30">
              <span className="text-[10px] text-rose-200 uppercase font-mono block">Automated Fine Recorded</span>
              <span className="text-lg font-black text-rose-300 font-mono">₹{totalFineAmount.toFixed(2)}</span>
            </div>
            <Button
              onClick={() => setSelectedNoticeBook(activeLoans.find((b) => calculateOverdueFine(b.dueDate, currentDateStr).lateDays > 0) || activeLoans[0] || null)}
              className="rounded-xl text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold h-10 gap-1.5 shadow-xs"
            >
              <CreditCard className="h-4 w-4" /> Fine Notice Info
            </Button>
          </div>
        )}
      </div>

      {/* INSTITUTIONAL CIRCULATION INSTRUCTIONS CARDS - READ ONLY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Return Instructions Card */}
        <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 flex items-start gap-3 text-xs">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">Book Return Policy</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Books must be returned at the Central Library. Please visit the circulation counter during library working hours.
            </p>
          </div>
        </div>

        {/* Renewal Instructions Card */}
        <div className="p-4 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 flex items-start gap-3 text-xs">
          <div className="p-2 rounded-xl bg-purple-600 text-white shrink-0 mt-0.5">
            <Info className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">Renewal Policy</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Renewal requests are handled only by the Librarian based on availability.
            </p>
          </div>
        </div>
      </div>

      {/* ISSUED BOOKS LIST - 100% READ ONLY */}
      {borrowedBooks.length > 0 ? (
        <div className="space-y-4">
          {borrowedBooks.map((loan) => {
            const { lateDays, fineAmount } = calculateOverdueFine(loan.dueDate, currentDateStr);
            const isOverdue = lateDays > 0 && loan.status !== "Returned";
            const isReturned = loan.status === "Returned";

            // Status Badge formatting
            let statusLabel = "Active Loan";
            let statusBadgeStyle = "bg-emerald-500 text-white";
            if (isOverdue) {
              statusLabel = `Overdue (${lateDays} Days)`;
              statusBadgeStyle = "bg-rose-500 text-white font-bold";
            } else if (isReturned) {
              statusLabel = "Returned";
              statusBadgeStyle = "bg-slate-500 text-white";
            }

            const librarian = loan.librarianName || "Dr. S. Ramanujan (Chief Librarian)";
            const counter = loan.issueCounter || "Counter #02 - Main Circulation";

            return (
              <div
                key={loan.id}
                className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-2xs space-y-4 transition-all ${
                  isOverdue
                    ? "border-rose-300 dark:border-rose-900/60 bg-rose-50/20"
                    : isReturned
                    ? "border-slate-200 dark:border-slate-800 opacity-80"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                {/* TOP CARDS MAIN METADATA */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {/* Book Cover & Basic Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={loan.coverImage}
                      alt={loan.title}
                      className="w-16 h-22 rounded-xl object-cover shadow-sm bg-slate-100 shrink-0"
                    />
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={`text-[9px] font-mono ${statusBadgeStyle}`}>
                          {statusLabel}
                        </Badge>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
                          <Barcode className="h-3 w-3 text-slate-400" /> Acc: {loan.accNumber}
                        </span>
                      </div>

                      <h4 className="font-black text-base text-slate-900 dark:text-white">
                        {loan.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">Author: {loan.author}</p>
                      <p className="text-[11px] text-slate-400 font-mono">ISBN: {loan.isbn}</p>
                    </div>
                  </div>

                  {/* Circulation Metadata & Dates */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                    {/* Dates Card */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono min-w-[280px]">
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-sans">Issue Date</span>
                        <span className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" /> {loan.issueDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-sans">Due Date</span>
                        <span
                          className={`font-bold flex items-center gap-1 ${
                            isOverdue ? "text-rose-600 dark:text-rose-400" : "text-emerald-600"
                          }`}
                        >
                          <Clock className="h-3 w-3" /> {loan.dueDate}
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-slate-400 text-[10px] block uppercase font-sans">Duration</span>
                        <span className="text-slate-700 dark:text-slate-300 font-bold">
                          {isOverdue ? `${lateDays} days late` : isReturned ? "Returned" : `${loan.daysRemaining} days left`}
                        </span>
                      </div>
                    </div>

                    {/* Librarian & Counter Details */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1 text-xs min-w-[200px]">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-[11px] font-semibold truncate">
                        <UserCheck className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                        <span className="truncate">{librarian}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono truncate">
                        <MapPin className="h-3 w-3 text-indigo-500 shrink-0" />
                        <span className="truncate">{counter}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* READ ONLY FINE / STATUS STATEMENT PANEL & BUTTONS */}
                <div
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-semibold ${
                    isOverdue
                      ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300"
                      : "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isOverdue ? (
                      <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    )}

                    <span>
                      {isOverdue ? (
                        <>
                          <strong className="text-rose-700 dark:text-rose-400 font-mono font-bold mr-2">
                            Current Fine: ₹{fineAmount.toFixed(2)}
                          </strong>
                          — Please return this book to the library.
                        </>
                      ) : (
                        <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                          No Pending Fine
                        </strong>
                      )}
                    </span>
                  </div>

                  {/* ACTION BUTTONS: FINE NOTICE INFO & RECORD */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {isOverdue && (
                      <Button
                        onClick={() => setSelectedNoticeBook(loan)}
                        size="sm"
                        className="rounded-xl text-[11px] bg-rose-600 hover:bg-rose-700 text-white font-bold h-8 gap-1"
                      >
                        <CreditCard className="h-3.5 w-3.5" /> Fine Notice Info
                      </Button>
                    )}
                    <Button
                      onClick={() =>
                        setSelectedRecordFine({
                          id: `FINE-${loan.accNumber}`,
                          bookId: loan.bookId,
                          bookTitle: loan.title,
                          dueDate: loan.dueDate,
                          currentDate: currentDateStr,
                          lateDays: lateDays,
                          ratePerDay: 5,
                          fineAmount: fineAmount,
                          status: isOverdue ? "Pending" : loan.finePaid ? "Paid" : "Pending",
                          dateIncurred: loan.issueDate,
                        })
                      }
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-[11px] font-semibold h-8 gap-1 border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                    >
                      <FileText className="h-3.5 w-3.5" /> Record
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
          <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">
            No issued books
          </h4>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
            You currently have zero issued books recorded in the Central Library database.
          </p>
        </div>
      )}

      {/* DYNAMIC READ-ONLY MODALS */}
      <FineNoticeModal
        open={!!selectedNoticeBook}
        onClose={() => setSelectedNoticeBook(null)}
        borrowedBook={selectedNoticeBook}
      />

      <FineRecordModal
        open={!!selectedRecordFine}
        onClose={() => setSelectedRecordFine(null)}
        fine={selectedRecordFine}
      />
    </div>
  );
}
