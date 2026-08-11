import React from "react";
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttendanceWidgetProps {
  percentage: number;
  classesNeeded: number;
  onViewAttendance: () => void;
}

export const AttendanceWidget: React.FC<AttendanceWidgetProps> = ({
  percentage,
  classesNeeded,
  onViewAttendance,
}) => {
  const isSafe = percentage >= 75;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" /> Attendance Snapshot
        </h3>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            isSafe
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-red-500/10 text-red-600 border-red-500/20"
          }`}
        >
          {isSafe ? "Eligible" : "Shortage Warning"}
        </span>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
        <div>
          <div className="text-3xl font-extrabold text-foreground">{percentage}%</div>
          <p className="text-xs text-muted-foreground mt-0.5">Overall Attendance Criteria (Min 75%)</p>
        </div>
        <div className="text-right">
          {classesNeeded > 0 ? (
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Need {classesNeeded} more classes to reach 80%
            </p>
          ) : (
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> 8.5% above threshold
            </p>
          )}
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onViewAttendance}
        className="w-full text-xs gap-1 h-9"
      >
        View Attendance Details <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};
