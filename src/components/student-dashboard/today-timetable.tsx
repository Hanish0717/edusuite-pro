import React from "react";
import { TimetableSlot } from "./types";
import { Clock, MapPin, User, ArrowRight, CheckCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TodayTimetableProps {
  slots: TimetableSlot[];
  onViewFullTimetable: () => void;
}

export const TodayTimetable: React.FC<TodayTimetableProps> = ({ slots, onViewFullTimetable }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Today's Timetable
          </h3>
          <p className="text-xs text-muted-foreground">Schedule for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewFullTimetable}
          className="text-xs gap-1 h-8"
        >
          View Full Timetable <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="space-y-3">
        {slots.map((slot) => {
          const isCurrent = slot.status === "current";
          const isCompleted = slot.status === "completed";

          return (
            <div
              key={slot.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isCurrent
                  ? "border-primary bg-primary/10 shadow-sm"
                  : isCompleted
                  ? "border-border/60 bg-muted/20 opacity-70"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg text-xs font-bold ${
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : isCompleted
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {isCurrent ? <PlayCircle className="h-4 w-4 animate-pulse" /> : <Clock className="h-4 w-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">{slot.subject}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-mono">{slot.code}</span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                        NOW
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {slot.faculty}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary" /> {slot.room}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right sm:text-right shrink-0">
                <span className="text-xs font-semibold text-foreground font-mono">{slot.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
