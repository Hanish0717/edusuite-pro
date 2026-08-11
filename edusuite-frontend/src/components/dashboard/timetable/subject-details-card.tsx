import React from "react";
import { BookOpen, Clock, Award, CheckCircle2, ChevronRight, MapPin, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { SectionTimetableSlot } from "@/services/section-timetable-service";

interface SubjectDetailsCardProps {
  slot: SectionTimetableSlot;
}

export function SubjectDetailsCard({ slot }: SubjectDetailsCardProps) {
  return (
    <Card className="p-4 border-border/80 rounded-2xl bg-card space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <BookOpen className="size-4" />
          </div>
          <div>
            <h4 className="font-display font-extrabold text-xs text-foreground">
              {slot.subject} ({slot.code})
            </h4>
            <p className="text-[0.65rem] text-muted-foreground font-mono">
              Academic Course Curriculum & Topic Syllabus Progress
            </p>
          </div>
        </div>

        <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary bg-primary/10">
          {slot.credits} Credits &middot; {slot.weeklyHours} Hrs/Wk
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
          <span className="text-[0.62rem] font-bold text-muted-foreground uppercase font-mono block">
            Active Unit
          </span>
          <p className="font-extrabold text-foreground text-xs">{slot.unitInProgress}</p>
        </div>

        <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
          <span className="text-[0.62rem] font-bold text-muted-foreground uppercase font-mono block">
            Room Allocation
          </span>
          <p className="font-extrabold text-foreground text-xs flex items-center gap-1">
            <MapPin className="size-3 text-primary" /> {slot.room} ({slot.building})
          </p>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[0.65rem]">
            <span className="font-bold text-muted-foreground uppercase font-mono">Current Topic In Progress</span>
            <span className="font-mono font-bold text-emerald-600">{slot.completionPercentage}% Completed</span>
          </div>
          <p className="font-bold text-xs text-foreground bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl">
            {slot.currentTopic}
          </p>
          <Progress value={slot.completionPercentage} className="h-1.5 rounded-full" />
        </div>

        <div className="space-y-1 pt-1">
          <span className="font-bold text-muted-foreground uppercase font-mono text-[0.65rem]">Upcoming Next Topic</span>
          <p className="font-semibold text-[0.72rem] text-muted-foreground bg-muted/30 p-2 rounded-xl border border-border/50">
            {slot.nextTopic}
          </p>
        </div>
      </div>
    </Card>
  );
}
