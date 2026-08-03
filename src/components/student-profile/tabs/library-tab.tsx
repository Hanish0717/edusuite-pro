import React from "react";
import { StudentProfileData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Library, BookOpen, Clock, CheckCircle2, Search, RotateCcw } from "lucide-react";

interface LibraryTabProps {
  student: StudentProfileData;
  onSearchBook: () => void;
}

export function LibraryTab({ student, onSearchBook }: LibraryTabProps) {
  const lib = student.librarySummary;

  return (
    <div className="space-y-6">
      
      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Books Issued</span>
          <div className="text-xl font-bold font-display text-blue-600">{lib.booksIssuedCount} Books</div>
          <span className="text-[10px] text-slate-400">Max limit: 5 books</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Overdue Books</span>
          <div className="text-xl font-bold font-display text-emerald-600">{lib.dueBooksCount} Overdue</div>
          <span className="text-[10px] text-emerald-600">Zero Overdue Penalty</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Fine Balance</span>
          <div className="text-xl font-bold font-display text-slate-900 dark:text-white">₹ {lib.totalFine}</div>
          <span className="text-[10px] text-slate-400">No pending library fines</span>
        </div>

        <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/20 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-purple-600">Digital Portal Usage</span>
          <div className="text-xl font-bold font-display text-purple-600">{lib.digitalUsageHours} Hours</div>
          <span className="text-[10px] text-purple-600">IEEE & ScienceDirect Access</span>
        </div>
      </div>

      {/* ISSUED BOOKS TABLE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Library className="h-4 w-4 text-purple-600" /> Currently Issued Library Books
            </h4>
            <p className="text-xs text-slate-500">RFID catalog track and renewal dates</p>
          </div>

          <Button onClick={onSearchBook} size="sm" variant="outline" className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-700">
            <Search className="h-3.5 w-3.5 text-purple-600" /> Search Online Catalog
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/50">
                <th className="p-3 rounded-l-xl">Book Title & Author</th>
                <th className="p-3">ISBN Number</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Renewed</th>
                <th className="p-3 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {lib.issuedBooks.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="font-bold text-slate-900 dark:text-white">{book.title}</div>
                    <div className="text-[11px] text-slate-500">{book.author}</div>
                  </td>
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{book.isbn}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{book.issueDate}</td>
                  <td className="p-3 font-mono font-bold text-blue-600">{book.dueDate}</td>
                  <td className="p-3 font-mono">{book.renewCount} times</td>
                  <td className="p-3">
                    <Button size="sm" variant="outline" className="h-7 text-xs rounded-lg gap-1" onClick={() => alert(`Renewed ${book.title} for 30 more days!`)}>
                      <RotateCcw className="h-3 w-3 text-purple-600" /> Renew
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
