import React from "react";
import { Clock, MapPin, User, BookOpen, FlaskConical, MessageSquare, FolderGit2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SectionTimetableSlot } from "@/services/section-timetable-service";

interface WeeklySectionTimetableProps {
  slots: SectionTimetableSlot[];
  highlightedSlotId?: string;
  highlightedSubject?: string;
  highlightedDay?: string;
  highlightedTimeSlot?: string;
  onSelectSlot: (slot: SectionTimetableSlot) => void;
}

const TYPE_BADGE: Record<string, { bg: string; text: string }> = {
  Theory: { bg: "bg-blue-500/10 border-blue-500/20 text-blue-600", text: "Theory" },
  Lab: { bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600", text: "Lab" },
  Tutorial: { bg: "bg-violet-500/10 border-violet-500/20 text-violet-600", text: "Tutorial" },
  Project: { bg: "bg-amber-500/10 border-amber-500/20 text-amber-600", text: "Project" },
  Seminar: { bg: "bg-rose-500/10 border-rose-500/20 text-rose-600", text: "Seminar" },
  Mentoring: { bg: "bg-teal-500/10 border-teal-500/20 text-teal-600", text: "Mentoring" },
};

export function WeeklySectionTimetable({
  slots,
  highlightedSlotId,
  highlightedSubject,
  highlightedDay,
  highlightedTimeSlot,
  onSelectSlot,
}: WeeklySectionTimetableProps) {
  const days: SectionTimetableSlot["day"][] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const uniqueTimeSlots = Array.from(new Set(slots.map((s) => s.timeSlot)));

  return (
    <Card className="p-4 border-border/80 rounded-2xl bg-card space-y-3 text-xs overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5 flex-wrap gap-2">
        <h4 className="font-display font-extrabold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <BookOpen className="size-3.5 text-primary" /> Master Weekly Section Schedule
        </h4>
        <span className="text-[0.65rem] text-muted-foreground font-mono">
          Click any class card to view subject & faculty details
        </span>
      </div>

      <div className="overflow-x-auto select-none">
        <div className="min-w-[700px] space-y-1.5">
          {/* Header Row */}
          <div
            className="grid gap-1 mb-1 font-mono text-[0.62rem] font-extrabold"
            style={{ gridTemplateColumns: "80px repeat(6, minmax(100px, 1fr))" }}
          >
            <div className="p-1.5 text-center text-muted-foreground">TIME</div>
            {days.map((day) => (
              <div
                key={day}
                className={cn(
                  "p-1.5 text-center rounded-xl uppercase tracking-wider transition-colors",
                  highlightedDay && day.toLowerCase() === highlightedDay.toLowerCase()
                    ? "bg-primary text-primary-foreground font-extrabold shadow-sm"
                    : "bg-muted/40 text-muted-foreground"
                )}
              >
                {day.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Time Rows */}
          {uniqueTimeSlots.map((ts) => (
            <div
              key={ts}
              className="grid gap-1"
              style={{ gridTemplateColumns: "80px repeat(6, minmax(100px, 1fr))" }}
            >
              <div className="flex items-center justify-center p-1 font-mono text-[0.58rem] font-bold text-muted-foreground bg-muted/20 rounded-xl">
                {ts.split(" - ")[0]}
              </div>

              {days.map((day) => {
                const slot = slots.find((s) => s.day === day && s.timeSlot === ts);

                if (!slot) {
                  return (
                    <div key={day} className="h-20 rounded-xl bg-muted/10 border border-dashed border-border/40 p-2 flex items-center justify-center text-[0.6rem] text-muted-foreground/40 font-mono">
                      Free
                    </div>
                  );
                }

                const isHighlighted =
                  (highlightedSlotId && slot.id === highlightedSlotId) ||
                  (highlightedSubject &&
                    slot.subject.toLowerCase() === highlightedSubject.toLowerCase() &&
                    highlightedDay &&
                    slot.day.toLowerCase() === highlightedDay.toLowerCase());

                const badgeConfig = TYPE_BADGE[slot.type] || TYPE_BADGE.Theory;

                return (
                  <div
                    key={day}
                    onClick={() => onSelectSlot(slot)}
                    className={cn(
                      "h-20 rounded-xl p-2 cursor-pointer transition-all duration-300 border flex flex-col justify-between group",
                      isHighlighted
                        ? "bg-primary/15 border-primary ring-2 ring-primary/40 shadow-sm"
                        : "bg-card hover:bg-muted/30 border-border/70"
                    )}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <Badge
                        variant="outline"
                        className={cn("px-1 py-0 text-[0.52rem] font-bold rounded", badgeConfig.bg)}
                      >
                        {slot.type}
                      </Badge>
                      <span className="text-[0.52rem] font-mono font-bold text-muted-foreground truncate">
                        {slot.code}
                      </span>
                    </div>

                    <h5 className="font-bold text-[0.65rem] leading-snug group-hover:text-primary transition-colors line-clamp-2 text-foreground">
                      {slot.subject}
                    </h5>

                    <div className="flex items-center justify-between text-[0.55rem] text-muted-foreground font-mono border-t border-border/40 pt-0.5">
                      <span className="flex items-center gap-0.5 truncate max-w-[55%]">
                        <User className="size-2.5 text-primary shrink-0" />
                        {slot.faculty.split(" ")[1] || slot.faculty}
                      </span>
                      <span className="flex items-center gap-0.5 truncate shrink-0">
                        <MapPin className="size-2.5 text-primary shrink-0" />
                        {slot.room}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
