import React from "react";
import { Calendar as CalendarIcon, Circle } from "lucide-react";

export const CalendarWidget: React.FC = () => {
  const currentMonth = "August 2026";
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Marked dates
  const examDays = [18, 19, 20, 21, 22];
  const assignmentDays = [10, 14, 25];
  const eventDays = [5, 12, 30];
  const holidayDays = [15, 27];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" /> Academic Calendar ({currentMonth})
        </h3>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[11px]">
        <span className="flex items-center gap-1"><Circle className="h-2.5 w-2.5 fill-red-500 text-red-500" /> Exams</span>
        <span className="flex items-center gap-1"><Circle className="h-2.5 w-2.5 fill-amber-500 text-amber-500" /> Assignments</span>
        <span className="flex items-center gap-1"><Circle className="h-2.5 w-2.5 fill-purple-500 text-purple-500" /> Events</span>
        <span className="flex items-center gap-1"><Circle className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" /> Holidays</span>
      </div>

      {/* Calendar Grid Header */}
      <div className="grid grid-cols-7 text-center text-xs font-bold text-muted-foreground pb-2 border-b border-border">
        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 text-center gap-1 text-xs">
        {/* Empty slots for starting day */}
        <span className="py-1"></span>
        <span className="py-1"></span>
        <span className="py-1"></span>
        <span className="py-1"></span>
        <span className="py-1"></span>

        {daysInMonth.map((day) => {
          const isExam = examDays.includes(day);
          const isAssignment = assignmentDays.includes(day);
          const isEvent = eventDays.includes(day);
          const isHoliday = holidayDays.includes(day);
          const isToday = day === 1;

          return (
            <div
              key={day}
              className={`py-1.5 rounded-lg text-xs font-semibold relative flex flex-col items-center justify-center transition-all ${
                isToday
                  ? "bg-primary text-primary-foreground font-extrabold shadow-sm"
                  : "hover:bg-muted/50 text-foreground"
              }`}
            >
              <span>{day}</span>
              <div className="flex items-center gap-0.5 mt-0.5">
                {isExam && <span className="h-1 w-1 rounded-full bg-red-500" />}
                {isAssignment && <span className="h-1 w-1 rounded-full bg-amber-500" />}
                {isEvent && <span className="h-1 w-1 rounded-full bg-purple-500" />}
                {isHoliday && <span className="h-1 w-1 rounded-full bg-emerald-500" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
