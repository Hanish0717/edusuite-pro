import React from "react";
import { Clock, CheckCircle2, AlertCircle, Calendar, Sparkles, BookOpen, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { SessionPlannerOverview } from "./session-planner-service";

interface OverviewCardsProps {
  overview: SessionPlannerOverview;
}

export function OverviewCards({ overview }: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
      {/* 1. Total Teaching Hours */}
      <Card className="border-border/80 shadow-sm bg-card p-3.5 space-y-1 h-full min-w-0 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
          <span>Total Hours</span>
          <Clock className="size-4 text-primary shrink-0" />
        </div>
        <p className="font-display text-2xl font-extrabold text-foreground font-mono whitespace-nowrap">
          {overview.totalTeachingHours} <span className="text-xs text-muted-foreground font-sans font-medium">Hrs</span>
        </p>
        <span className="text-[0.65rem] text-muted-foreground font-mono">Syllabus Quota</span>
      </Card>

      {/* 2. Completed Hours */}
      <Card className="border-border/80 shadow-sm bg-card p-3.5 space-y-1 h-full min-w-0 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[0.68rem] font-bold text-emerald-600 uppercase tracking-wider">
          <span>Completed</span>
          <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
        </div>
        <p className="font-display text-2xl font-extrabold text-emerald-600 font-mono whitespace-nowrap">
          {overview.completedHours} <span className="text-xs text-muted-foreground font-sans font-medium">Hrs</span>
        </p>
        <span className="text-[0.65rem] text-emerald-600 font-mono font-medium">Delivered to date</span>
      </Card>

      {/* 3. Remaining Hours */}
      <Card className="border-border/80 shadow-sm bg-card p-3.5 space-y-1 h-full min-w-0 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[0.68rem] font-bold text-amber-600 uppercase tracking-wider">
          <span>Remaining</span>
          <AlertCircle className="size-4 text-amber-500 shrink-0" />
        </div>
        <p className="font-display text-2xl font-extrabold text-amber-600 font-mono whitespace-nowrap">
          {overview.remainingHours} <span className="text-xs text-muted-foreground font-sans font-medium">Hrs</span>
        </p>
        <span className="text-[0.65rem] text-amber-600 font-mono font-medium">Pending Delivery</span>
      </Card>

      {/* 4. Syllabus Completion % */}
      <Card className="border-border/80 shadow-sm bg-card p-3.5 space-y-1 h-full min-w-0 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[0.68rem] font-bold text-indigo-600 uppercase tracking-wider">
          <span>Completion</span>
          <TrendingUp className="size-4 text-indigo-500 shrink-0" />
        </div>
        <p className="font-display text-2xl font-extrabold text-indigo-600 font-mono whitespace-nowrap">
          {overview.syllabusCompletionPercentage}%
        </p>
        <Progress value={overview.syllabusCompletionPercentage} className="h-1.5 bg-indigo-100 dark:bg-indigo-950/40" />
      </Card>

      {/* 5. Today's Planned Topic */}
      <Card className="border-border/80 shadow-sm bg-card p-3.5 space-y-1 h-full min-w-0 flex flex-col justify-between col-span-1 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between text-[0.68rem] font-bold text-blue-600 uppercase tracking-wider">
          <span>Today's Topic</span>
          <Sparkles className="size-4 text-blue-500 shrink-0" />
        </div>
        <p className="font-bold text-xs text-foreground truncate" title={overview.todaysPlannedTopic.topic}>
          {overview.todaysPlannedTopic.topic}
        </p>
        <span className="text-[0.65rem] text-muted-foreground font-mono">Hour {overview.todaysPlannedTopic.hourNumber} &middot; {overview.todaysPlannedTopic.allocatedTime}</span>
      </Card>

      {/* 6. Next Topic */}
      <Card className="border-border/80 shadow-sm bg-card p-3.5 space-y-1 h-full min-w-0 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[0.68rem] font-bold text-purple-600 uppercase tracking-wider">
          <span>Next Topic</span>
          <BookOpen className="size-4 text-purple-500 shrink-0" />
        </div>
        <p className="font-bold text-xs text-foreground truncate" title={overview.nextTopic.topic}>
          {overview.nextTopic.topic}
        </p>
        <span className="text-[0.65rem] text-muted-foreground font-mono">Est: {overview.nextTopic.estimatedDate}</span>
      </Card>

      {/* 7. Estimated Completion Date */}
      <Card className="border-border/80 shadow-sm bg-card p-3.5 space-y-1 h-full min-w-0 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
          <span>Target End</span>
          <Calendar className="size-4 text-primary shrink-0" />
        </div>
        <p className="font-bold text-xs text-foreground font-mono whitespace-nowrap">
          {overview.estimatedCompletionDate}
        </p>
        <Badge variant="outline" className="text-[0.62rem] py-0 border-emerald-500/20 text-emerald-600 bg-emerald-500/10 w-fit">
          On Schedule
        </Badge>
      </Card>
    </div>
  );
}
