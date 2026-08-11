import React from "react";
import { User, Mail, MapPin, Clock, Building, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SectionTimetableSlot } from "@/services/section-timetable-service";

interface FacultyDetailsCardProps {
  slot: SectionTimetableSlot;
}

export function FacultyDetailsCard({ slot }: FacultyDetailsCardProps) {
  return (
    <Card className="p-4 border-border/80 rounded-2xl bg-card space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center font-bold font-mono">
            {slot.faculty.split(" ")[1]?.[0] || "F"}
          </div>
          <div>
            <h4 className="font-display font-extrabold text-xs text-foreground">
              {slot.faculty}
            </h4>
            <p className="text-[0.65rem] text-muted-foreground font-mono">
              {slot.facultyDesignation} &middot; Faculty Instructor
            </p>
          </div>
        </div>

        <Badge variant="secondary" className="font-mono text-[0.65rem]">
          Assigned Faculty
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[0.68rem] text-muted-foreground">
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-muted/20 border border-border/50">
          <Mail className="size-3.5 text-primary shrink-0" />
          <span className="truncate">{slot.facultyEmail}</span>
        </div>
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-muted/20 border border-border/50">
          <MapPin className="size-3.5 text-primary shrink-0" />
          <span className="truncate">{slot.facultyCabin}</span>
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between text-[0.68rem] font-mono">
        <span className="flex items-center gap-1.5 font-bold text-foreground">
          <Clock className="size-3.5 text-primary" /> Consultation Hours:
        </span>
        <span className="text-primary font-bold">{slot.consultationHours}</span>
      </div>
    </Card>
  );
}
