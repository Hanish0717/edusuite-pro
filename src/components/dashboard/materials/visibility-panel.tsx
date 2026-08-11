import React from "react";
import { Eye, Clock, EyeOff, FileEdit, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StudyMaterialItem } from "@/data/faculty-mock-data";

interface VisibilityPanelProps {
  materials: StudyMaterialItem[];
}

export function VisibilityPanel({ materials }: VisibilityPanelProps) {
  const visibleCount = materials.filter((m) => m.visibilityStatus === "Visible").length;
  const scheduledCount = materials.filter((m) => m.visibilityStatus === "Scheduled").length;
  const hiddenCount = materials.filter((m) => m.visibilityStatus === "Faculty Only" || m.visibilityStatus === "Hidden").length;
  const draftCount = materials.filter((m) => m.visibilityStatus === "Draft").length;

  return (
    <Card className="p-4 sm:p-5 border-border/80 rounded-2xl bg-card shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" /> Student Visibility & Access Status Governance
        </h3>
        <Badge variant="outline" className="font-mono text-xs">
          Access Policy
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Visible to Students */}
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider text-[0.65rem]">
              Visible to Students
            </span>
            <Eye className="size-4 text-emerald-600 shrink-0" />
          </div>
          <p className="font-mono text-2xl font-extrabold text-emerald-600">{visibleCount}</p>
          <p className="text-[0.65rem] text-emerald-700/80 dark:text-emerald-300/80 font-medium">
            Published and accessible on Student LMS
          </p>
        </div>

        {/* Scheduled Release */}
        <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/10 space-y-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-blue-700 dark:text-blue-300 uppercase tracking-wider text-[0.65rem]">
              Scheduled Release
            </span>
            <Clock className="size-4 text-blue-600 shrink-0" />
          </div>
          <p className="font-mono text-2xl font-extrabold text-blue-600">{scheduledCount}</p>
          <p className="text-[0.65rem] text-blue-700/80 dark:text-blue-300/80 font-medium">
            Automated timer publication pending
          </p>
        </div>

        {/* Hidden / Faculty Only */}
        <div className="p-3.5 rounded-xl border border-slate-500/30 bg-slate-500/10 space-y-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[0.65rem]">
              Hidden / Restricted
            </span>
            <EyeOff className="size-4 text-slate-600 shrink-0" />
          </div>
          <p className="font-mono text-2xl font-extrabold text-slate-600 dark:text-slate-400">{hiddenCount}</p>
          <p className="text-[0.65rem] text-slate-700/80 dark:text-slate-300/80 font-medium">
            Restricted to faculty members only
          </p>
        </div>

        {/* Hidden Draft */}
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-amber-700 dark:text-amber-300 uppercase tracking-wider text-[0.65rem]">
              Drafts
            </span>
            <FileEdit className="size-4 text-amber-600 shrink-0" />
          </div>
          <p className="font-mono text-2xl font-extrabold text-amber-600">{draftCount}</p>
          <p className="text-[0.65rem] text-amber-700/80 dark:text-amber-300/80 font-medium">
            Unpublished work in progress drafts
          </p>
        </div>
      </div>
    </Card>
  );
}
