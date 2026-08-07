import React from "react";
import { mockLibraryTimings, mockLibraryRules } from "./mock-data";
import { 
  Clock, 
  UserCheck, 
  Mail, 
  Phone, 
  MapPin, 
  AlertCircle, 
  Sparkles, 
  TrendingUp, 
  Download, 
  ShieldCheck, 
  Globe, 
  ExternalLink 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RightSidebarProps {
  onOpenLibraryCard: () => void;
  onSelectQuickAction: (action: string) => void;
}

export function LibraryRightSidebar({ onOpenLibraryCard, onSelectQuickAction }: RightSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Quick Actions Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs tracking-wider uppercase text-purple-200">Quick Actions</h4>
          <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30 text-[10px]">Student OPAC</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => onSelectQuickAction("search")}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 font-medium text-left transition-colors flex flex-col gap-1"
          >
            <Sparkles className="h-4 w-4 text-purple-300" />
            <span>Search Catalog</span>
          </button>

          <button
            onClick={onOpenLibraryCard}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 font-medium text-left transition-colors flex flex-col gap-1"
          >
            <Download className="h-4 w-4 text-purple-300" />
            <span>Library Pass</span>
          </button>

          <button
            onClick={() => onSelectQuickAction("fines")}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 font-medium text-left transition-colors flex flex-col gap-1"
          >
            <ShieldCheck className="h-4 w-4 text-purple-300" />
            <span>Pay Fine</span>
          </button>

          <button
            onClick={() => onSelectQuickAction("digital")}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 font-medium text-left transition-colors flex flex-col gap-1"
          >
            <Globe className="h-4 w-4 text-purple-300" />
            <span>Digital Library</span>
          </button>
        </div>
      </div>

      {/* Library Timings */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2 border-slate-100 dark:border-slate-800">
          <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Central Library Hours</h4>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
            <span>Monday – Friday</span>
            <strong className="font-mono text-slate-900 dark:text-white">{mockLibraryTimings.weekday}</strong>
          </div>
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
            <span>Saturday</span>
            <strong className="font-mono text-slate-900 dark:text-white">{mockLibraryTimings.saturday}</strong>
          </div>
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
            <span>Sunday</span>
            <strong className="font-mono text-slate-900 dark:text-white">{mockLibraryTimings.sunday}</strong>
          </div>
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 font-mono text-[10px] text-center font-bold">
            ⚡ E-Repository Active 24 Hours / 7 Days
          </div>
        </div>
      </div>

      {/* Books Due Today Widget */}
      <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <h4 className="font-bold text-xs text-amber-900 dark:text-amber-300 uppercase tracking-wider">Books Due Notice</h4>
        </div>
        <p className="text-xs text-amber-800 dark:text-amber-400">
          You have <strong className="font-bold text-rose-600">1 book due today</strong> (Database System Concepts). Renew or return before 8:00 PM to avoid additional fine.
        </p>
      </div>

      {/* Librarian Contact */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2 border-slate-100 dark:border-slate-800">
          <UserCheck className="h-4 w-4 text-purple-600" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Librarian Helpdesk</h4>
        </div>

        <div className="space-y-2 text-xs">
          <h5 className="font-bold text-slate-900 dark:text-white">{mockLibraryTimings.librarianContact.name}</h5>
          <p className="text-[11px] text-purple-600 dark:text-purple-400">{mockLibraryTimings.librarianContact.title}</p>
          
          <div className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px] font-mono pt-1">
            <p className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" /> {mockLibraryTimings.librarianContact.email}
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-400" /> {mockLibraryTimings.librarianContact.phone}
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400" /> {mockLibraryTimings.librarianContact.office}
            </p>
          </div>
        </div>
      </div>

      {/* Most Borrowed Books & Latest Arrivals */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2 border-slate-100 dark:border-slate-800">
          <TrendingUp className="h-4 w-4 text-purple-600" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Top Borrowed Books</h4>
        </div>

        <div className="space-y-2 text-xs">
          {[
            { title: "Introduction to Algorithms", count: "142 borrows" },
            { title: "Deep Learning with Python", count: "118 borrows" },
            { title: "Operating System Concepts", count: "98 borrows" },
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/30">
              <span className="font-medium truncate max-w-[170px] text-slate-800 dark:text-slate-200">{item.title}</span>
              <Badge variant="outline" className="text-[9px] font-mono text-purple-600 border-purple-200">
                {item.count}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
