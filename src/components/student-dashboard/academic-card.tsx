import React from "react";
import { AcademicSnapshot } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, GraduationCap, TrendingUp, ChevronRight } from "lucide-react";

interface AcademicCardProps {
  academic: AcademicSnapshot;
  onNavigate: (route: string) => void;
}

export function StudentAcademicCard({ academic, onNavigate }: AcademicCardProps) {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 flex flex-col justify-between">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Academic Performance Snapshot
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Grade Point Standing & Rank
            </p>
          </div>
        </div>

        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px] font-mono">
          {academic.performanceStatus}
        </Badge>
      </div>

      {/* METRICS DISPLAY */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-0.5">
            <span className="text-[10px] font-semibold text-slate-400 block">Overall CGPA</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
              {academic.cgpa}
            </span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-0.5">
            <span className="text-[10px] font-semibold text-slate-400 block">Current SGPA</span>
            <span className="text-2xl font-extrabold text-blue-600 font-mono tracking-tight">
              {academic.sgpa}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-400 block">Class Rank</span>
            <strong className="font-mono font-bold text-slate-900 dark:text-white">
              #{academic.semesterRank} / {academic.totalStudents}
            </strong>
          </div>
          <div className="p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-400 block">Completed</span>
            <strong className="font-mono font-bold text-slate-900 dark:text-white">
              {academic.creditsCompleted} Cr
            </strong>
          </div>
          <div className="p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-400 block">Backlogs</span>
            <strong className="font-mono font-bold text-emerald-600">
              {academic.backlogs}
            </strong>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <Button
        onClick={() => onNavigate("/student/examinations")}
        className="w-full h-9 text-xs rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5 shadow-xs"
      >
        View Examination Module <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
