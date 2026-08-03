import React from "react";
import { LibrarySnapshot } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Library, BookOpen, Clock, RefreshCw, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface LibraryCardProps {
  library: LibrarySnapshot;
  onNavigate: (route: string) => void;
}

export function StudentLibraryCard({ library, onNavigate }: LibraryCardProps) {
  const handleRenewBook = () => {
    toast.success("Successfully renewed 'Clean Code' for 14 additional days!");
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 flex flex-col justify-between">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Library className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Library & E-Resources
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Physical Circulation & IEEE Access
            </p>
          </div>
        </div>

        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-mono">
          {library.booksIssued} Active Books
        </Badge>
      </div>

      {/* METRICS DISPLAY */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-[10px] font-semibold text-slate-400 block">Books Issued</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
              {library.booksIssued} Copies
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-[10px] font-semibold text-slate-400 block">Overdue Books</span>
            <span className="text-xl font-extrabold text-emerald-600 font-mono">
              {library.dueBooks} Books
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs p-2 rounded-xl border border-slate-100 dark:border-slate-800">
          <span className="text-slate-500">Next Return Due: <strong className="font-mono text-slate-900 dark:text-white">{library.nextDueDate}</strong></span>
          <span className="text-slate-500">E-Reading: <strong className="font-mono text-blue-600">{library.digitalUsageHours}h</strong></span>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={handleRenewBook}
          variant="outline"
          className="h-9 text-xs rounded-xl border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-50 gap-1"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Renew Book
        </Button>
        <Button
          onClick={() => onNavigate("/student/library")}
          className="h-9 text-xs rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-1"
        >
          Library Portal <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
