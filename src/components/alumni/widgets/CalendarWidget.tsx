import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard } from "../cards/GlassCard";
import { Button } from "@/components/ui/button";

export const CalendarWidget: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState("August 2026");

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const eventDays = [8, 15, 22];

  return (
    <GlassCard className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2 font-sans">
          <CalendarIcon className="size-4 text-primary" /> Events &amp; Sessions Calendar
        </h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-7">
            <ChevronLeft className="size-3.5" />
          </Button>
          <span className="text-xs font-mono font-bold text-foreground">{currentMonth}</span>
          <Button variant="ghost" size="icon" className="size-7">
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[0.68rem] font-bold text-muted-foreground pb-1">
        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
        {days.map((day) => {
          const isEvent = eventDays.includes(day);
          return (
            <div
              key={day}
              className={`h-8 rounded-xl grid place-items-center cursor-pointer transition-colors ${
                isEvent
                  ? "bg-primary text-primary-foreground font-extrabold shadow-2xs"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
