import React from "react";
import { AttendanceSnapshot } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarCheck, ShieldCheck, AlertTriangle, ChevronRight, ArrowUpRight } from "lucide-react";

interface AttendanceCardProps {
  attendance: AttendanceSnapshot;
  onNavigate: (route: string) => void;
}

export function StudentAttendanceCard({ attendance, onNavigate }: AttendanceCardProps) {
  const isSafe = attendance.riskStatus === "Safe";

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 flex flex-col justify-between">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CalendarCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Attendance Snapshot
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Mandatory Minimum: 75% | Target: 85%
            </p>
          </div>
        </div>

        <Badge
          className={`text-[10px] font-mono px-2 py-0.5 ${
            isSafe
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-600 border-rose-500/20"
          }`}
        >
          {isSafe ? "● SAFE ELIGIBILITY" : "⚠️ AT RISK"}
        </Badge>
      </div>

      {/* METRICS DISPLAY */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
            {attendance.overallPercentage}%
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {attendance.totalClassesAttended} / {attendance.totalClassesConducted} Classes Attended
          </span>
        </div>

        <Progress value={attendance.overallPercentage} className="h-2 bg-slate-100 dark:bg-slate-800" />

        <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
          <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-[10px] text-slate-400 font-semibold block">Subject Shortages</span>
            <strong className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              {attendance.shortageCount} Subject
            </strong>
          </div>
          <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-[10px] text-slate-400 font-semibold block">Classes Needed (85%)</span>
            <strong className="text-sm font-bold text-emerald-600 font-mono">
              {attendance.classesNeededFor85} Classes
            </strong>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <Button
        onClick={() => onNavigate("/student/attendance")}
        className="w-full h-9 text-xs rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white font-semibold gap-1.5 shadow-xs"
      >
        View Attendance Module <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
