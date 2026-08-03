import React from "react";
import { PlacementSnapshot } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Briefcase, ChevronRight } from "lucide-react";

interface PlacementWidgetProps {
  placement: PlacementSnapshot;
  onNavigate: (route: string) => void;
}

export function PlacementWidget({ placement, onNavigate }: PlacementWidgetProps) {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              SECTION 13: CAREER & PLACEMENT SNAPSHOT
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Campus Hiring & Resume Status
            </p>
          </div>
        </div>

        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-mono">
          Resume {placement.resumeStatus}
        </Badge>
      </div>

      <div className="space-y-3 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between font-semibold">
            <span className="text-slate-500">Placement Profile Readiness</span>
            <span className="font-mono text-blue-600">{placement.profileCompletionPct}%</span>
          </div>
          <Progress value={placement.profileCompletionPct} className="h-2 bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-400 block">Eligible Firms</span>
            <strong className="font-mono font-bold text-slate-900 dark:text-white">{placement.eligibleCompaniesCount}</strong>
          </div>
          <div className="p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-400 block">Upcoming Drives</span>
            <strong className="font-mono font-bold text-blue-600">{placement.upcomingDrivesCount}</strong>
          </div>
          <div className="p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-400 block">Applications</span>
            <strong className="font-mono font-bold text-purple-600">{placement.applicationsSubmittedCount}</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Button
          onClick={() => (window.location.href = "/exam/take?id=AST-GGL-01")}
          className="h-9 text-xs rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
        >
          ⚡ Attempt TPO Assessment
        </Button>

        <Button
          onClick={() => onNavigate("/student/placements")}
          variant="outline"
          className="h-9 text-xs rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold gap-1"
        >
          View Placement Portal <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

