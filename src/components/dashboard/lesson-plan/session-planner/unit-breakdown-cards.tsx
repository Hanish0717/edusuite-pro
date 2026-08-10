import React from "react";
import { BookOpen, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { UnitBreakdownItem } from "./session-planner-service";

interface UnitBreakdownCardsProps {
  units: UnitBreakdownItem[];
}

export function UnitBreakdownCards({ units }: UnitBreakdownCardsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
          <BookOpen className="size-4 text-primary" /> Syllabus Unit Breakdown & Hourly Allocation
        </h3>
        <Badge variant="outline" className="font-mono text-xs">
          {units.length} Units Total
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {units.map((unit) => (
          <Card
            key={unit.unitNumber}
            className="border-border/80 shadow-sm bg-card p-4 space-y-3 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <Badge variant="secondary" className="font-mono text-[0.65rem] uppercase mb-1">
                  Unit {unit.unitNumber}
                </Badge>
                <h4 className="font-bold text-xs text-foreground leading-snug break-words" title={unit.title}>
                  {unit.title}
                </h4>
              </div>
              <span className="font-mono font-extrabold text-sm text-primary shrink-0">
                {unit.progressPercentage}%
              </span>
            </div>

            <Progress value={unit.progressPercentage} className="h-1.5" />

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/50 text-center font-mono">
              <div className="p-1.5 rounded-lg bg-muted/40">
                <span className="text-[0.62rem] text-muted-foreground block uppercase font-sans">Allocated</span>
                <span className="font-bold text-xs text-foreground">{unit.allocatedHours}h</span>
              </div>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                <span className="text-[0.62rem] text-emerald-600 block uppercase font-sans">Completed</span>
                <span className="font-bold text-xs">{unit.completedHours}h</span>
              </div>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">
                <span className="text-[0.62rem] text-amber-600 block uppercase font-sans">Remaining</span>
                <span className="font-bold text-xs">{unit.remainingHours}h</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
