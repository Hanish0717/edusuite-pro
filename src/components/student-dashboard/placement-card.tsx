import React from "react";
import { PlacementSnapshot } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Briefcase, Building2, Calendar, FileText, ChevronRight } from "lucide-react";

interface PlacementCardProps {
  placement: PlacementSnapshot;
  onNavigate: (route: string) => void;
}

export function StudentPlacementCard({ placement, onNavigate }: PlacementCardProps) {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 flex flex-col justify-between">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Career & Placement Cell
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Campus Drives & Interview Schedule
            </p>
          </div>
        </div>

        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-mono">
          Resume {placement.resumeStatus}
        </Badge>
      </div>

      {/* METRICS DISPLAY */}
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-500">Placement Profile Readiness</span>
            <span className="font-mono text-blue-600">{placement.profileCompletionPct}%</span>
          </div>
          <Progress value={placement.profileCompletionPct} className="h-2 bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-400 block">Eligible Companies</span>
            <strong className="font-mono font-bold text-slate-900 dark:text-white">
              {placement.eligibleCompaniesCount} Firms
            </strong>
          </div>
          <div className="p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-400 block">Drives Applied</span>
            <strong className="font-mono font-bold text-blue-600">
              {placement.appliedDrivesCount} Drives
            </strong>
          </div>
          <div className="p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-400 block">Interviews Lineup</span>
            <strong className="font-mono font-bold text-purple-600">
              {placement.upcomingInterviewsCount} Rounds
            </strong>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <Button
        onClick={() => onNavigate("/student/placements")}
        className="w-full h-9 text-xs rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5 shadow-xs"
      >
        View Placement Portal <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
