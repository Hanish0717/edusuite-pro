import { Badge } from "@/components/ui/badge";
import type { ExamType, ExamStatus, QuestionPaperStatus, InvigilationStatus } from "./types";

interface TypeBadgeProps {
  type: ExamType;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const styles: Record<ExamType, string> = {
    "Semester End": "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
    "Mid Term 1": "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20",
    "Mid Term 2": "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/20",
    "Practical": "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/20",
    "Supplementary": "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
  };

  const currentClass = styles[type] ?? "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20";

  return (
    <Badge variant="outline" className={currentClass}>
      {type}
    </Badge>
  );
}

interface StatusBadgeProps {
  status: ExamStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<ExamStatus, string> = {
    "Upcoming": "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20",
    "Completed": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    "Ongoing": "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/20 animate-pulse",
    "Cancelled": "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20",
  };

  const currentClass = styles[status] ?? "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20";

  return (
    <Badge variant="outline" className={currentClass}>
      {status}
    </Badge>
  );
}

interface PaperStatusBadgeProps {
  status: QuestionPaperStatus;
}

export function PaperStatusBadge({ status }: PaperStatusBadgeProps) {
  const styles: Record<QuestionPaperStatus, string> = {
    "Draft": "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20",
    "Submitted": "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20",
    "Approved": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    "Rejected": "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20",
  };

  const currentClass = styles[status] ?? "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20";

  return (
    <Badge variant="outline" className={currentClass}>
      {status}
    </Badge>
  );
}

interface InvigilationStatusBadgeProps {
  status: InvigilationStatus;
}

export function InvigilationStatusBadge({ status }: InvigilationStatusBadgeProps) {
  const styles: Record<InvigilationStatus, string> = {
    "Assigned": "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20",
    "Completed": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    "Pending": "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
  };

  const currentClass = styles[status] ?? "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20";

  return (
    <Badge variant="outline" className={currentClass}>
      {status}
    </Badge>
  );
}
