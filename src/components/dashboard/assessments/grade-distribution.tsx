import type { GradeDistItem, PerformanceSummary } from "./types";
import { cn } from "@/lib/utils";

interface GradeDistributionProps {
  distribution: GradeDistItem[];
  performance: PerformanceSummary;
  maxMarks: number;
}

export function GradeDistribution({ distribution, performance, maxMarks }: GradeDistributionProps) {
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Grade bar chart */}
      <div>
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Grade Distribution</h4>
        <div className="flex items-end gap-3 h-32">
          {distribution.map((d) => {
            const height = Math.round((d.count / maxCount) * 100);
            return (
              <div key={d.grade} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <span className="text-[0.6rem] font-bold text-foreground">{d.count}</span>
                <div className="w-full flex items-end justify-center" style={{ height: "80px" }}>
                  <div
                    className="w-full rounded-t-lg transition-all duration-700"
                    style={{ height: `${height}%`, backgroundColor: d.color, minHeight: d.count > 0 ? "8px" : "0" }}
                  />
                </div>
                <span className="text-[0.65rem] font-extrabold" style={{ color: d.color }}>{d.grade}</span>
                <span className="text-[0.55rem] text-muted-foreground">{d.percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donut-style pass/fail */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{performance.passPercentage}%</p>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">Pass Rate</p>
        </div>
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-center">
          <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">{performance.failPercentage}%</p>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">Fail Rate</p>
        </div>
      </div>

      {/* Pass/Fail progress bar */}
      <div>
        <div className="flex items-center justify-between text-[0.65rem] text-muted-foreground mb-1">
          <span>Pass {performance.passPercentage}%</span>
          <span>Fail {performance.failPercentage}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-500 transition-all duration-700"
            style={{ width: `${performance.passPercentage}%` }}
          />
          <div className="bg-rose-500 flex-1" />
        </div>
      </div>
    </div>
  );
}

interface PerformanceAnalyticsProps {
  performance: PerformanceSummary;
  maxMarks: number;
}

export function PerformanceAnalytics({ performance, maxMarks }: PerformanceAnalyticsProps) {
  const metrics = [
    { label: "Highest",  value: performance.highest,  color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Lowest",   value: performance.lowest,   color: "text-rose-600 dark:text-rose-400",     bg: "bg-rose-500/10" },
    { label: "Average",  value: performance.average,  color: "text-blue-600 dark:text-blue-400",      bg: "bg-blue-500/10" },
    { label: "Median",   value: performance.median,   color: "text-violet-600 dark:text-violet-400",  bg: "bg-violet-500/10" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className={cn("rounded-xl p-3 text-center border border-border/30", m.bg)}>
            <p className={cn("text-xl font-extrabold tabular-nums", m.color)}>{m.value}<span className="text-xs text-muted-foreground font-normal">/{maxMarks}</span></p>
            <p className="text-[0.6rem] text-muted-foreground font-semibold uppercase tracking-wide mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border/40 p-4">
          <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">🏆 Top Performers</h5>
          {performance.topPerformers.length > 0 ? (
            <ul className="space-y-1">
              {performance.topPerformers.map((name) => (
                <li key={name} className="text-sm font-medium text-foreground flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-500" /> {name}
                </li>
              ))}
            </ul>
          ) : <p className="text-xs text-muted-foreground italic">None in this range</p>}
        </div>

        <div className="rounded-xl border border-border/40 p-4">
          <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">⚠️ Needs Improvement</h5>
          {performance.needsImprovement.length > 0 ? (
            <ul className="space-y-1">
              {performance.needsImprovement.map((name) => (
                <li key={name} className="text-sm font-medium text-foreground flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-rose-500" /> {name}
                </li>
              ))}
            </ul>
          ) : <p className="text-xs text-muted-foreground italic">None in this range</p>}
        </div>
      </div>
    </div>
  );
}
