import type { ExamAnalyticsInfo } from "./types";
import { cn } from "@/lib/utils";

interface AnalyticsDashboardProps {
  analytics: ExamAnalyticsInfo;
}

export function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
  const maxGradeCount = Math.max(...analytics.gradeDistribution.map((d) => d.count), 1);
  const maxDeptAvg = Math.max(...analytics.deptComparison.map((d) => d.avg), 1);

  return (
    <div className="space-y-6">
      {/* Upper score metric blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Highest Marks", value: `${analytics.highestMarks}/100`, textClass: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
          { label: "Lowest Marks", value: `${analytics.lowestMarks}/100`, textClass: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
          { label: "Average Marks", value: `${analytics.averageMarks}/100`, textClass: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
          { label: "Pass Rate", value: `${analytics.passPercentage}%`, textClass: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" }
        ].map((item) => (
          <div key={item.label} className={cn("p-4 rounded-2xl border text-center", item.bg)}>
            <p className={cn("text-2xl font-black tabular-nums", item.textClass)}>{item.value}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grade Distribution Grid */}
        <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Grade Distribution Chart</h4>
          <div className="flex items-end gap-3 h-40 pt-4 px-2">
            {analytics.gradeDistribution.map((item) => {
              const height = Math.round((item.count / maxGradeCount) * 100);
              return (
                <div key={item.grade} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-extrabold text-foreground">{item.count}</span>
                  <div className="w-full flex items-end justify-center h-24">
                    <div
                      className="w-full rounded-t-lg transition-all duration-700 hover:opacity-85 cursor-pointer"
                      style={{ height: `${height}%`, backgroundColor: item.color, minHeight: item.count > 0 ? "8px" : "2px" }}
                    />
                  </div>
                  <span className="text-[11px] font-extrabold text-foreground">{item.grade}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Comparison Bar Grid */}
        <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Department Average Comparison</h4>
          <div className="space-y-3">
            {analytics.deptComparison.map((item) => {
              const barWidth = Math.round((item.avg / maxDeptAvg) * 100);
              const isCSE = item.dept === "CSE";

              return (
                <div key={item.dept} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-foreground">
                    <span>{item.dept} Department</span>
                    <span className="tabular-nums">{item.avg}/100</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden flex">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        isCSE
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_10px_2px_rgba(99,102,241,0.2)]"
                          : "bg-muted-foreground/30"
                      )}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
