import React from "react";
import { LmsSnapshot } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, BookOpen, Clock, ChevronRight } from "lucide-react";

interface LmsCardProps {
  lms: LmsSnapshot;
  onNavigate: (route: string) => void;
}

export function StudentLmsCard({ lms, onNavigate }: LmsCardProps) {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 flex flex-col justify-between">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Learning Management System
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Course Content & Submissions
            </p>
          </div>
        </div>

        <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px] font-mono">
          {lms.registeredCourses} Active Subjects
        </Badge>
      </div>

      {/* METRICS DISPLAY */}
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-500">Syllabus Completion Progress</span>
            <span className="font-mono text-purple-600">{lms.learningProgressPercentage}%</span>
          </div>
          <Progress value={lms.learningProgressPercentage} className="h-2 bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-400 block">Pending Homework</span>
            <strong className="font-mono font-bold text-amber-600">
              {lms.pendingAssignments}
            </strong>
          </div>
          <div className="p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-400 block">Upcoming Quiz</span>
            <strong className="font-mono font-bold text-rose-600">
              {lms.upcomingQuizzes}
            </strong>
          </div>
          <div className="p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-400 block">Passed Subjects</span>
            <strong className="font-mono font-bold text-emerald-600">
              {lms.completedCourses}
            </strong>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <Button
        onClick={() => onNavigate("/student/lms")}
        className="w-full h-9 text-xs rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold gap-1.5 shadow-xs"
      >
        Open LMS Portal <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
