import { FileText, CheckCircle2, AlertTriangle, Layers } from "lucide-react";
import type { ExamItem, EvaluationProgressInfo } from "./types";
import { Progress } from "@/components/ui/progress";

interface EvaluationProgressProps {
  exams: ExamItem[];
  progressMap: Record<string, EvaluationProgressInfo>;
}

export function EvaluationProgress({ exams, progressMap }: EvaluationProgressProps) {
  const completedExams = exams.filter((e) => e.status === "Completed");

  if (completedExams.length === 0) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-6 text-center text-muted-foreground text-sm">
        No completed exams available to show evaluation progress.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {completedExams.map((exam) => {
        const progress = progressMap[exam.id] ?? {
          totalScripts: 6,
          evaluatedScripts: 0,
          marksSubmitted: false
        };

        const pct = Math.round((progress.evaluatedScripts / progress.totalScripts) * 100);
        const remaining = progress.totalScripts - progress.evaluatedScripts;

        return (
          <div
            key={exam.id}
            className="flex flex-col gap-4 p-5 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all duration-200"
          >
            {/* Exam title row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                  <FileText className="size-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{exam.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Code: {exam.code} · Section: {exam.section}</p>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-muted px-2.5 py-1 rounded-lg text-muted-foreground">
                {progress.evaluatedScripts}/{progress.totalScripts} Evaluated
              </span>
            </div>

            {/* Progress indicator */}
            <div className="space-y-1.5 pt-1 border-t border-border/30">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">Evaluated Progress:</span>
                <span className="font-bold text-primary">{pct}% Complete</span>
              </div>
              <Progress value={pct} className="h-2" />
            </div>

            {/* Detailed stats grids */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/30">
                <Layers className="size-3.5" />
                <span>Scripts Remaining: <strong className="text-foreground">{remaining}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/30">
                {progress.marksSubmitted ? (
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="size-3.5 text-amber-500" />
                )}
                <span>
                  Submission:{" "}
                  <strong className={progress.marksSubmitted ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
                    {progress.marksSubmitted ? "Submitted" : "Pending"}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
