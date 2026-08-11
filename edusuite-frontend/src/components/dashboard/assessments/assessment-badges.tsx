import { cn } from "@/lib/utils";
import type { AssessmentStatus, AssessmentType } from "./types";

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<AssessmentStatus, string> = {
  Published: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
  Draft:     "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25",
  Closed:    "bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/25",
};

export function StatusBadge({ status }: { status: AssessmentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.68rem] font-bold border",
        STATUS_STYLES[status]
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", {
          "bg-emerald-500": status === "Published",
          "bg-amber-500":   status === "Draft",
          "bg-slate-500":   status === "Closed",
        })}
      />
      {status}
    </span>
  );
}

// ─── Assessment type badge ────────────────────────────────────────────────────
const TYPE_COLORS: Record<AssessmentType, string> = {
  "Internal 1":        "bg-blue-500/12 text-blue-700 dark:text-blue-300 border-blue-500/20",
  "Internal 2":        "bg-indigo-500/12 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
  "Quiz":              "bg-sky-500/12 text-sky-700 dark:text-sky-300 border-sky-500/20",
  "Assignment":        "bg-blue-600/12 text-blue-800 dark:text-blue-400 border-blue-600/20",
  "Lab Assessment":    "bg-indigo-600/12 text-indigo-800 dark:text-indigo-400 border-indigo-600/20",
  "Viva":              "bg-sky-600/12 text-sky-800 dark:text-sky-400 border-sky-600/20",
  "Seminar":           "bg-blue-700/12 text-blue-900 dark:text-blue-300 border-blue-700/20",
  "Project Evaluation":"bg-indigo-700/12 text-indigo-900 dark:text-indigo-300 border-indigo-700/20",
};

export function TypeBadge({ type }: { type: AssessmentType }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-lg text-[0.65rem] font-bold border",
        TYPE_COLORS[type] ?? "bg-muted text-muted-foreground border-border"
      )}
    >
      {type}
    </span>
  );
}

// ─── Grade badge ──────────────────────────────────────────────────────────────
const GRADE_COLORS: Record<string, string> = {
  O:    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "A+": "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  A:    "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  "B+": "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  B:    "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  C:    "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  D:    "bg-red-500/15 text-red-700 dark:text-red-300",
  F:    "bg-rose-900/20 text-rose-700 dark:text-rose-400",
};

export function GradeBadge({ grade }: { grade: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-8 h-6 rounded-md text-[0.65rem] font-extrabold",
        GRADE_COLORS[grade] ?? "bg-muted text-muted-foreground"
      )}
    >
      {grade}
    </span>
  );
}
