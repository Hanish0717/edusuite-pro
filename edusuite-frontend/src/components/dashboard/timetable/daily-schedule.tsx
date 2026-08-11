import React from "react";
import { Clock, MapPin, User, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SectionTimetableSlot } from "@/services/section-timetable-service";

interface DailyScheduleProps {
  slots: SectionTimetableSlot[];
  activeDay?: string;
  onSelectSlot: (slot: SectionTimetableSlot) => void;
}

export function DailySchedule({ slots, activeDay = "Wednesday", onSelectSlot }: DailyScheduleProps) {
  const daySlots = slots.filter((s) => s.day.toLowerCase() === activeDay.toLowerCase());

  return (
    <Card className="p-4 border-border/80 rounded-2xl bg-card space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <h4 className="font-display font-extrabold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Clock className="size-3.5 text-primary" /> Today's Complete Schedule ({activeDay})
        </h4>
        <Badge variant="outline" className="font-mono text-xs">
          {daySlots.length} Periods Scheduled
        </Badge>
      </div>

      <div className="space-y-2">
        {daySlots.length === 0 ? (
          <p className="text-center text-muted-foreground py-4 text-xs font-mono">
            No classes scheduled for {activeDay}.
          </p>
        ) : (
          daySlots.map((slot) => (
            <div
              key={slot.id}
              onClick={() => onSelectSlot(slot)}
              className="p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/30 hover:border-primary/40 transition-all cursor-pointer flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg shrink-0">
                  {slot.timeSlot.split(" - ")[0]}
                </span>
                <div className="min-w-0">
                  <h5 className="font-bold text-foreground truncate">{slot.subject}</h5>
                  <p className="text-[0.65rem] text-muted-foreground font-mono truncate">
                    {slot.faculty} &middot; Room {slot.room}
                  </p>
                </div>
              </div>

              <Badge variant="outline" className="text-[0.6rem] font-mono shrink-0">
                {slot.type}
              </Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
