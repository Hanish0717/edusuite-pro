import React from "react";
import { Clock, UserCheck, Mail, Phone, MapPin, Sparkles, BookOpen, ShieldCheck, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RightSidebarProps {
  onOpenLibraryCard: () => void;
  onSelectQuickAction: (action: string) => void;
}

export function LibraryRightSidebar({ onOpenLibraryCard, onSelectQuickAction }: RightSidebarProps) {
  return (
    <div className="space-y-4">
      {/* QUICK NAVIGATION PANEL */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs tracking-wider uppercase text-purple-200">Quick Navigation</h4>
          <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30 text-[10px]">Student OPAC</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => onSelectQuickAction("catalog")}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 font-medium text-left transition-colors flex flex-col gap-1"
          >
            <Sparkles className="h-4 w-4 text-purple-300" />
            <span>Search Catalog</span>
          </button>

          <button
            onClick={() => onSelectQuickAction("borrowed")}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 font-medium text-left transition-colors flex flex-col gap-1"
          >
            <BookOpen className="h-4 w-4 text-purple-300" />
            <span>My Issued Books</span>
          </button>

          <button
            onClick={() => onSelectQuickAction("digital")}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 font-medium text-left transition-colors flex flex-col gap-1"
          >
            <Globe className="h-4 w-4 text-purple-300" />
            <span>Lab Visits</span>
          </button>

          <button
            onClick={() => onSelectQuickAction("fines")}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 font-medium text-left transition-colors flex flex-col gap-1"
          >
            <ShieldCheck className="h-4 w-4 text-purple-300" />
            <span>Fine Statement</span>
          </button>
        </div>
      </div>

      {/* CENTRAL LIBRARY HOURS */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2 border-slate-100 dark:border-slate-800">
          <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Central Library Hours</h4>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
            <span>Monday – Friday</span>
            <strong className="font-mono text-slate-900 dark:text-white">8:00 AM – 9:00 PM</strong>
          </div>
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
            <span>Saturday</span>
            <strong className="font-mono text-slate-900 dark:text-white">9:00 AM – 5:00 PM</strong>
          </div>
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
            <span>Sunday</span>
            <strong className="font-mono text-slate-900 dark:text-white">10:00 AM – 4:00 PM</strong>
          </div>
        </div>
      </div>

      {/* LIBRARIAN HELPDESK */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2 border-slate-100 dark:border-slate-800">
          <UserCheck className="h-4 w-4 text-purple-600" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Librarian Helpdesk</h4>
        </div>

        <div className="space-y-2 text-xs">
          <h5 className="font-bold text-slate-900 dark:text-white">Dr. Rajesh V. Sharma</h5>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Head Librarian & Systems Manager</p>

          <div className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px] font-mono pt-1">
            <p className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" /> library@edusuite.edu.in
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-400" /> +91 (020) 2765-8890
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400" /> Central Library, Ground Floor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
