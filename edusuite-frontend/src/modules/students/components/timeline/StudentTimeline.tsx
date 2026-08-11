import React from "react";
import { Calendar, User, Clock } from "lucide-react";
import type { StudentTimelineEvent } from "../../types";

interface StudentTimelineProps {
  events: StudentTimelineEvent[];
}

export function StudentTimeline({ events }: StudentTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-muted-foreground">
        No lifecycle timeline events recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l border-border space-y-6 my-2">
      {events.map((evt) => (
        <div key={evt.id} className="relative">
          {/* Timeline Dot */}
          <span className="absolute -left-[31px] top-1.5 size-4 rounded-full border-2 border-background bg-primary flex items-center justify-center shadow-sm">
            <span className="size-1.5 rounded-full bg-white" />
          </span>

          <div className="space-y-1 bg-muted/20 border border-border/40 p-3 rounded-xl">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h4 className="font-semibold text-xs text-foreground">{evt.title}</h4>
              <div className="flex items-center gap-1 text-[0.68rem] text-muted-foreground font-mono">
                <Clock className="size-3" />
                {new Date(evt.timestamp).toLocaleDateString()}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{evt.description}</p>
            <div className="flex items-center gap-1.5 pt-1.5 border-t border-border/40 mt-1">
              <span className="text-[0.62rem] uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
                {evt.type}
              </span>
              <span className="text-[0.68rem] text-muted-foreground flex items-center gap-1 font-medium">
                <User className="size-3" />
                By: {evt.actor}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
