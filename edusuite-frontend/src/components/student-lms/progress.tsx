import React from "react";
import { LmsKpiMetrics, CourseItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Progress as UIProgress } from "@/components/ui/progress";
import {
  TrendingUp,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  FileCheck,
  BarChart2,
  PieChart,
  Activity,
} from "lucide-react";

interface ProgressAnalyticsProps {
  kpis: LmsKpiMetrics;
  courses: CourseItem[];
}

export function ProgressAnalytics({ kpis, courses }: ProgressAnalyticsProps) {
  const activeCourses = courses.filter((c) => c.status === "Active");

  // SVG BAR CHART DATA FOR WEEKLY STUDY HOURS
  const weeklyHours = [
    { day: "Mon", hours: 4.5 },
    { day: "Tue", hours: 6.0 },
    { day: "Wed", hours: 5.2 },
    { day: "Thu", hours: 7.8 },
    { day: "Fri", hours: 6.4 },
    { day: "Sat", hours: 8.5 },
    { day: "Sun", hours: 4.0 },
  ];

  // SVG LINE CHART DATA FOR MONTHLY QUIZ ACCURACY
  const monthlyAccuracy = [
    { month: "Jan", score: 82 },
    { month: "Feb", score: 85 },
    { month: "Mar", score: 79 },
    { month: "Apr", score: 88 },
    { month: "May", score: 91 },
    { month: "Jun", score: 89 },
    { month: "Jul", score: 94 },
  ];

  return (
    <div className="space-y-6">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Learning Analytics & Progress Dashboard
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Data-driven Insights across Courses, Quizzes, Assignments & Study Effort.
            </p>
          </div>
        </div>

        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono text-[10px]">
          Overall Mastery: {kpis.learningProgressPct}%
        </Badge>
      </div>

      {/* METRICS SUMMARY */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Overall Completion</span>
          <h4 className="text-xl font-extrabold font-mono text-emerald-600">{kpis.learningProgressPct}%</h4>
          <span className="text-[10px] text-slate-500">Semester Target Exceeded</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Quiz Score Avg</span>
          <h4 className="text-xl font-extrabold font-mono text-purple-600">{kpis.avgQuizScore}%</h4>
          <span className="text-[10px] text-slate-500">30 Quizzes Attempted</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Total Study Hours</span>
          <h4 className="text-xl font-extrabold font-mono text-blue-600">{kpis.studyHours} hrs</h4>
          <span className="text-[10px] text-slate-500">14.2 hrs / week avg</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Assignments Completed</span>
          <h4 className="text-xl font-extrabold font-mono text-amber-600">47 / 50</h4>
          <span className="text-[10px] text-slate-500">94% On-time submission</span>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BAR CHART: WEEKLY STUDY HOURS */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-mono">
              <BarChart2 className="h-4 w-4 text-purple-600" /> BAR CHART: WEEKLY STUDY HOURS
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Total: 42.4 hrs</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 pt-4 px-2">
            {weeklyHours.map((wh) => {
              const heightPct = (wh.hours / 10) * 100;
              return (
                <div key={wh.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {wh.hours}h
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl h-36 flex items-end overflow-hidden p-1">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-purple-600 to-indigo-500 group-hover:from-purple-500 group-hover:to-indigo-400 transition-all"
                    />
                  </div>
                  <span className="text-[10px] font-bold font-mono text-slate-500">{wh.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* LINE CHART: MONTHLY QUIZ PERFORMANCE */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-mono">
              <Activity className="h-4 w-4 text-emerald-600" /> LINE CHART: MONTHLY QUIZ ACCURACY %
            </h4>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">Trend: +12%</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 pt-4 px-2">
            {monthlyAccuracy.map((ma) => {
              const heightPct = (ma.score / 100) * 100;
              return (
                <div key={ma.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {ma.score}%
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl h-36 flex items-end overflow-hidden p-1">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 transition-all"
                    />
                  </div>
                  <span className="text-[10px] font-bold font-mono text-slate-500">{ma.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* COURSE-WISE PROGRESS BREAKDOWN */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-mono">
          <BookOpen className="h-4 w-4 text-blue-600" /> COURSE-WISE PROGRESS BREAKDOWN
        </h4>

        <div className="space-y-3">
          {activeCourses.map((crs) => (
            <div key={crs.id} className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-slate-900 dark:text-white">
                  {crs.code} - {crs.name}
                </span>
                <span className="font-mono text-purple-600 font-bold">{crs.completionPct}%</span>
              </div>
              <UIProgress value={crs.completionPct} className="h-2 bg-slate-100 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
