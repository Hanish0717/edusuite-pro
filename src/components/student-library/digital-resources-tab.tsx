import React from "react";
import { DigitalVisitLog } from "./types";
import {
  Monitor,
  Armchair,
  Calendar,
  Clock,
  Timer,
  MapPin,
  Laptop,
  CheckCircle2,
  Activity,
  ShieldCheck,
  Lock,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DigitalLibraryTabProps {
  visits: DigitalVisitLog[];
}

export function DigitalLibraryTab({ visits }: DigitalLibraryTabProps) {
  return (
    <div className="space-y-6">
      {/* SECTION HEADER BANNER */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-black tracking-tight flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-300" /> Digital Library Usage History
          </h3>
          <p className="text-xs text-blue-200">
            Read-only record of Central Digital Library terminal logins, seat allocations, and lab session durations.
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-400/30 font-mono text-xs font-bold text-blue-200 flex items-center gap-2">
          <Monitor className="h-4 w-4 text-blue-300" /> Total Visits: {visits.length}
        </div>
      </div>

      {/* VISITS GRID LAYOUT (3 DESKTOP, 2 TABLET, 1 MOBILE) */}
      {visits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visits.map((visit) => {
            const isActive = visit.status === "Active";

            return (
              <div
                key={visit.id}
                className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between space-y-4 transition-all ${
                  isActive
                    ? "border-blue-400 dark:border-blue-700 bg-blue-50/20 ring-2 ring-blue-500/20"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                {/* CARD HEADER */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Monitor className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Digital Library Visit
                  </span>

                  {isActive ? (
                    <Badge className="bg-emerald-500 text-white font-bold text-[10px] gap-1 animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" /> Currently Active
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-500 text-white text-[10px]">Completed</Badge>
                  )}
                </div>

                {/* CARD BODY CONTENT */}
                <div className="space-y-3 text-xs">
                  {/* COMPUTER & SEAT HIGHLIGHT BOX */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 font-mono">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0">
                        <Monitor className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="text-slate-400 text-[9px] block uppercase font-sans">Computer</span>
                        <strong className="text-blue-900 dark:text-blue-200 font-bold text-xs">
                          {visit.computerNumber}
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-indigo-600 text-white shrink-0">
                        <Armchair className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="text-slate-400 text-[9px] block uppercase font-sans">Seat Number</span>
                        <strong className="text-indigo-900 dark:text-indigo-200 font-bold text-xs">
                          {visit.seatNumber}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* TIMINGS GRID */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 text-[9px] block uppercase font-sans flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-blue-500" /> Date
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{visit.date}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 text-[9px] block uppercase font-sans flex items-center gap-1">
                        <Clock className="h-3 w-3 text-blue-500" /> Login Time
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{visit.loginTime}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 text-[9px] block uppercase font-sans flex items-center gap-1">
                        <Clock className="h-3 w-3 text-blue-500" /> Logout Time
                      </span>
                      <span className={`font-bold ${isActive ? "text-emerald-600" : "text-slate-800 dark:text-slate-200"}`}>
                        {isActive ? "--" : visit.logoutTime}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 text-[9px] block uppercase font-sans flex items-center gap-1">
                        <Timer className="h-3 w-3 text-blue-500" /> Duration
                      </span>
                      <span className={`font-bold ${isActive ? "text-emerald-600 animate-pulse" : "text-slate-800 dark:text-slate-200"}`}>
                        {isActive ? "Live Timer" : visit.duration}
                      </span>
                    </div>
                  </div>

                  {/* LAB, ACTIVITY & SYSTEM METADATA */}
                  <div className="space-y-1.5 pt-1 text-[11px]">
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" /> Lab:
                      </span>
                      <strong className="text-slate-800 dark:text-slate-200 font-semibold">{visit.lab}</strong>
                    </div>

                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Activity className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> Activity:
                      </span>
                      <strong className="text-slate-800 dark:text-slate-200 font-semibold">{visit.activity}</strong>
                    </div>

                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Laptop className="h-3.5 w-3.5 text-slate-400 shrink-0" /> System:
                      </span>
                      <strong className="text-slate-700 dark:text-slate-300 font-mono text-[10px]">{visit.system}</strong>
                    </div>
                  </div>
                </div>

                {/* CARD FOOTER - READ ONLY & SYSTEM VERIFIED */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified by Library System
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Lock className="h-3 w-3" /> Read Only
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* CENTERED EMPTY-STATE CARD */
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 max-w-lg mx-auto">
          <Monitor className="h-10 w-10 text-blue-400 mx-auto" />
          <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">No Digital Library visits found.</h4>
          <p className="text-xs text-slate-500 font-medium">
            Your Digital Library terminal log history will appear here automatically when you log into a lab workstation.
          </p>
        </div>
      )}
    </div>
  );
}
