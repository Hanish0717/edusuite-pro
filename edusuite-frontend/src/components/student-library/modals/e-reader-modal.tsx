import React, { useState } from "react";
import { BookItem } from "../types";
import { BookOpen, Download, BookmarkCheck, Heart, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface EBookReaderModalProps {
  book: BookItem | null;
  onClose: () => void;
  onDownload: (book: BookItem) => void;
}

export function EBookReaderModal({ book, onClose, onDownload }: EBookReaderModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = book?.pages || 450;

  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Reader Topbar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white line-clamp-1">{book.title}</h3>
              <p className="text-xs text-indigo-300 font-medium">{book.author}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => onDownload(book)}
              size="sm"
              className="rounded-xl text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-8 gap-1.5"
            >
              <Download className="h-3.5 w-3.5" /> Download PDF
            </Button>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Reader Document View */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-6 overflow-y-auto flex flex-col items-center">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 space-y-6 text-slate-800 dark:text-slate-200 font-serif leading-relaxed text-sm">
            <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800 font-sans text-xs text-slate-400">
              <span>{book.title}</span>
              <span>Chapter 1: Principles & Foundational Models</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>

            <h2 className="text-xl font-bold font-sans text-slate-900 dark:text-white">
              Chapter 1. Introduction & Institutional Concepts
            </h2>

            <p>
              Academic digital resource management requires robust data indexing, real-time availability sync, and unified access control across physical and e-repository modules.
            </p>

            <p className="italic text-slate-500">
              "{book.description}"
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 font-mono text-xs text-slate-600 dark:text-slate-400">
              ● Reading Progress Tracked: {Math.round((currentPage / totalPages) * 100)}%
            </div>
          </div>
        </div>

        {/* Reader Bottom Navigation Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-t border-slate-800 text-xs">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            size="sm"
            variant="outline"
            className="rounded-xl font-bold h-8 text-white border-slate-700 hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous Page
          </Button>

          <span className="font-mono text-slate-400 font-bold">
            Page {currentPage} / {totalPages}
          </span>

          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            size="sm"
            variant="outline"
            className="rounded-xl font-bold h-8 text-white border-slate-700 hover:bg-slate-800"
          >
            Next Page <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
