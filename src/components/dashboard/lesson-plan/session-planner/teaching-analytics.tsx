import React from "react";
import { TrendingUp, PieChart, BarChart3, Clock, CheckCircle2, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { GroupedBarChart } from "@/components/dashboard/charts";
import type { SessionPlannerFullData } from "./session-planner-service";

interface TeachingAnalyticsProps {
  analytics: SessionPlannerFullData["analytics"];
}

export function TeachingAnalytics({ analytics }: TeachingAnalyticsProps) {
  const chartData = analytics.unitCompletionRates.map((u) => ({
    name: u.unit,
    completion: u.percentage,
    target: 100
  }));

  return (
    <Card className="p-4 sm:p-5 border-border/80 rounded-2xl bg-card shadow-sm space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <BarChart3 className="size-4" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-sm text-foreground">Syllabus Progress Analytics</h3>
            <p className="text-[0.68rem] text-muted-foreground">Expected vs Actual Pace & Unit Completion Index</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono">
            Expected Pace: {analytics.expectedProgress}%
          </Badge>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono">
            Actual: {analytics.actualProgress}%
          </Badge>
        </div>
      </div>

      {/* Numerical Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-center">
        <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
          <span className="text-[0.62rem] text-muted-foreground uppercase font-sans font-bold block">Total Hours</span>
          <span className="text-xl font-extrabold text-foreground">{analytics.totalHours} Hours</span>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-[0.62rem] text-emerald-600 uppercase font-sans font-bold block">Delivered Hours</span>
          <span className="text-xl font-extrabold text-emerald-600">{analytics.hoursCompleted} Hours</span>
        </div>
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-[0.62rem] text-amber-600 uppercase font-sans font-bold block">Remaining Quota</span>
          <span className="text-xl font-extrabold text-amber-600">{analytics.hoursRemaining} Hours</span>
        </div>
      </div>

      {/* Progress Bars Comparison */}
      <div className="space-y-3 pt-2">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Syllabus Delivery vs Semester Timeline</span>
            <span className="text-emerald-600 font-mono font-bold">{analytics.actualProgress}% / 100%</span>
          </div>
          <Progress value={analytics.actualProgress} className="h-2.5" />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground">
            <span>Expected Benchmark Pace</span>
            <span className="font-mono">{analytics.expectedProgress}%</span>
          </div>
          <Progress value={analytics.expectedProgress} className="h-1.5 bg-muted [&>div]:bg-muted-foreground/40" />
        </div>
      </div>

      {/* Unit Completion Rates Chart */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Unit Completion Rates (%)
        </h4>
        <GroupedBarChart
          data={chartData}
          xKey="name"
          series={[
            { key: "completion", label: "Actual Completion (%)" },
            { key: "target", label: "Target (100%)" }
          ]}
          height={200}
        />
      </div>
    </Card>
  );
}
