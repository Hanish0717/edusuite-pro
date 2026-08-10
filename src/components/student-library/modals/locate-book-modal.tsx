import React from "react";
import { BookItem } from "../types";
import { MapPin, Building2, Navigation, Layers, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LocateBookModalProps {
  book: BookItem | null;
  onClose: () => void;
}

export function LocateBookModal({ book, onClose }: LocateBookModalProps) {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden space-y-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-300" />
              <h3 className="font-black text-base">Physical Library Location Map</h3>
            </div>
            <p className="text-xs text-purple-200">
              Locate physical hard-copy shelf position in Central Library
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Location Instructions */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 space-y-2">
            <h4 className="font-black text-sm text-purple-900 dark:text-purple-200">{book.title}</h4>
            <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">Author: {book.author}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Building Wing</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white">Central Library Wing-B</strong>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Department Section</span>
              <strong className="text-sm font-black text-purple-600 dark:text-purple-400">{book.department}</strong>
            </div>

            <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/20">
              <span className="text-[10px] text-purple-500 uppercase block font-sans">Rack Number</span>
              <strong className="text-base font-black text-purple-700 dark:text-purple-300">{book.rackNumber}</strong>
            </div>

            <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/20">
              <span className="text-[10px] text-purple-500 uppercase block font-sans">Shelf Number</span>
              <strong className="text-base font-black text-purple-700 dark:text-purple-300">{book.shelfNumber}</strong>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Library Protocol:</span>
              Visit Counter 2 with your Student ID card. Present Rack <strong>{book.rackNumber}</strong> for assistance.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button onClick={onClose} className="rounded-xl text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold h-9">
            Got It
          </Button>
        </div>
      </div>
    </div>
  );
}
