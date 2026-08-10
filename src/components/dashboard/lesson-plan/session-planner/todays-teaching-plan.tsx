import React from "react";
import { Calendar, Clock, BookOpen, Layers, CheckCircle2, Sparkles, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SessionPlannerOverview } from "./session-planner-service";

interface TodaysTeachingPlanProps {
  todaysTopic: SessionPlannerOverview["todaysPlannedTopic"];
  subjectName: string;
  onMarkCompleted: () => void;
}

export function TodaysTeachingPlan({ todaysTopic, subjectName, onMarkCompleted }: TodaysTeachingPlanProps) {
  return (
    <Card className="border-primary/30 bg-primary/5 p-4 sm:p-5 rounded-2xl space-y-4 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-primary/15 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary text-primary-foreground shrink-0">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-sm text-foreground">Today's Teaching Schedule</h3>
            <p className="text-[0.68rem] text-muted-foreground font-mono">Subject: {subjectName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary bg-primary/10">
            <Clock className="size-3 mr-1" /> {todaysTopic.allocatedTime}
          </Badge>
          <Badge
            className={
              todaysTopic.status === "Completed"
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                : todaysTopic.status === "In Progress"
                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                : "bg-blue-500/10 text-blue-600 border-blue-500/20"
            }
          >
            {todaysTopic.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Topic & Subtopics */}
        <div className="md:col-span-2 space-y-2">
          <span className="text-[0.65rem] uppercase font-bold text-muted-foreground font-mono block">Hour {todaysTopic.hourNumber} Topic</span>
          <h4 className="font-bold text-base text-foreground leading-snug">{todaysTopic.topic}</h4>
          
          <div className="space-y-1 pt-1">
            <span className="text-[0.65rem] font-bold text-muted-foreground uppercase block">Subtopics to Cover:</span>
            <div className="flex flex-wrap gap-1.5">
              {todaysTopic.subtopics.map((sub, i) => (
                <Badge key={i} variant="secondary" className="text-[0.68rem] font-normal">
                  • {sub}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Teaching Method & Resources */}
        <div className="space-y-3 bg-card/60 p-3.5 rounded-xl border border-border/60">
          <div>
            <span className="text-[0.65rem] uppercase font-bold text-muted-foreground block">Methodology</span>
            <span className="font-semibold text-xs text-primary">{todaysTopic.teachingMethod}</span>
          </div>

          <div>
            <span className="text-[0.65rem] uppercase font-bold text-muted-foreground block">Resources Required</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {todaysTopic.resourcesRequired.map((res, i) => (
                <span key={i} className="text-[0.62rem] px-2 py-0.5 rounded bg-muted font-medium text-foreground">
                  {res}
                </span>
              ))}
            </div>
          </div>

          {todaysTopic.status !== "Completed" && (
            <Button
              size="sm"
              onClick={onMarkCompleted}
              className="w-full h-8 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
            >
              <CheckCircle2 className="size-3.5 mr-1" /> Mark Session Completed
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
