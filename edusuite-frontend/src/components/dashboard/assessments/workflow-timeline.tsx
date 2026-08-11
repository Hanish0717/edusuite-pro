import { CheckCircle2, Circle, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowStageItem, AssessmentTimelineEvent } from "./types";

interface WorkflowTimelineProps {
  workflow: WorkflowStageItem[];
}

export function WorkflowTimeline({ workflow }: WorkflowTimelineProps) {
  return (
    <div className="space-y-1">
      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4">Marks Approval Workflow</h4>
      <div className="relative">
        {workflow.map((step, idx) => {
          const isLast = idx === workflow.length - 1;
          return (
            <div key={step.stage} className="flex items-start gap-3">
              {/* Icon + Line */}
              <div className="flex flex-col items-center shrink-0">
                <div className={cn(
                  "size-8 rounded-full flex items-center justify-center border-2 transition-all",
                  step.status === "Completed" ? "bg-emerald-500 border-emerald-500 shadow-[0_0_10px_2px_rgba(34,197,94,0.3)]" :
                  step.status === "Active"    ? "bg-primary border-primary shadow-[0_0_10px_2px_rgba(99,102,241,0.3)] animate-pulse" :
                  "bg-muted/30 border-border"
                )}>
                  {step.status === "Completed" ? (
                    <CheckCircle2 className="size-4 text-white" />
                  ) : step.status === "Active" ? (
                    <Clock className="size-4 text-primary-foreground" />
                  ) : (
                    <Circle className="size-4 text-muted-foreground" />
                  )}
                </div>
                {!isLast && <div className={cn("w-0.5 h-8 mt-1", step.status === "Completed" ? "bg-emerald-500/50" : "bg-border/40")} />}
              </div>

              {/* Content */}
              <div className="pb-6">
                <p className={cn("text-sm font-bold leading-tight", step.status === "Pending" ? "text-muted-foreground" : "text-foreground")}>
                  {step.stage}
                </p>
                {step.status === "Completed" && step.completedAt && (
                  <p className="text-[0.65rem] text-muted-foreground mt-0.5">{step.actor} · {step.completedAt}</p>
                )}
                {step.status === "Active" && (
                  <p className="text-[0.65rem] text-primary mt-0.5 font-semibold">In Progress</p>
                )}
                {step.status === "Pending" && (
                  <p className="text-[0.65rem] text-muted-foreground/50 mt-0.5">Awaiting</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface AssessmentTimelineProps {
  timeline: AssessmentTimelineEvent[];
}

export function AssessmentTimeline({ timeline }: AssessmentTimelineProps) {
  return (
    <div>
      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4">Assessment Timeline</h4>
      <div className="space-y-2">
        {timeline.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className={cn(
              "size-2 rounded-full shrink-0",
              item.status === "Completed" ? "bg-emerald-500" : "bg-amber-400"
            )} />
            <div className="flex-1 flex items-center justify-between gap-2">
              <span className={cn("text-sm", item.status === "Completed" ? "text-foreground" : "text-muted-foreground")}>{item.event}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
