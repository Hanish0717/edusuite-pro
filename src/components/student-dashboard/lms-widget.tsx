import React from "react";
import { BookOpen, FileCheck, HelpCircle, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LMSWidgetProps {
  onOpenLMS: () => void;
}

export const LMSWidget: React.FC<LMSWidgetProps> = ({ onOpenLMS }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" /> LMS Learning Snapshot
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
          78% Progress
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <BookOpen className="h-3 w-3 text-primary" /> Registered Courses
          </span>
          <div className="text-sm font-bold text-foreground">6 Active Courses</div>
        </div>

        <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <FileCheck className="h-3 w-3 text-amber-500" /> Pending Tasks
          </span>
          <div className="text-sm font-bold text-foreground">3 Assignments</div>
        </div>

        <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <HelpCircle className="h-3 w-3 text-purple-500" /> Upcoming Quiz
          </span>
          <div className="text-sm font-bold text-foreground">AI & ML Quiz (Aug 10)</div>
        </div>

        <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" /> Syllabus Completed
          </span>
          <div className="text-sm font-bold text-foreground">14 of 18 Modules</div>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onOpenLMS}
        className="w-full text-xs gap-1 h-9"
      >
        Open Learning Management System <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};
