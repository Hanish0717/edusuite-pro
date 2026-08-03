import React, { useState } from "react";
import { CalendarEventItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Clock, Info } from "lucide-react";

interface CalendarProps {
  events: CalendarEventItem[];
}

export function MonthlyCalendar({ events }: CalendarProps) {
  const [selectedDayEvents, setSelectedDayEvents] = useState<{ date: string; items: CalendarEventItem[] } | null>(null);

  // August 2026 Grid (Starts on Saturday, 31 days)
  const totalDays = 31;
  const startDayOffset = 6; // Aug 1 2026 is Saturday

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Class": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Lab": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "Exam": return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      case "Holiday": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Event": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Leave": return "bg-cyan-500/10 text-cyan-600 border-cyan-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const getEventsForDay = (dayNum: number) => {
    const formattedDate = `2026-08-${dayNum < 10 ? `0${dayNum}` : dayNum}`;
    return events.filter((ev) => ev.date === formattedDate);
  };

  return (
    <div className="space-y-4">
      {/* HEADER & LEGEND */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">August 2026 Academic Calendar</h3>
            <p className="text-xs text-slate-500">Interactive schedule calendar highlighting lectures, labs, exams & holidays.</p>
          </div>
        </div>

        {/* LEGEND BADGES */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Class</Badge>
          <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">Lab</Badge>
          <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20">Exam</Badge>
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Holiday</Badge>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Event</Badge>
          <Badge className="bg-cyan-500/10 text-cyan-600 border-cyan-500/20">Leave</Badge>
        </div>
      </div>

      {/* CALENDAR GRID */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden">
        {/* DAYS OF WEEK HEADER */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-center text-xs font-mono font-bold text-slate-600 dark:text-slate-400 py-2.5">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* DAYS CELLS */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {/* Offset blank cells for Aug 2026 */}
          {Array.from({ length: startDayOffset }).map((_, idx) => (
            <div key={`blank-${idx}`} className="h-28 bg-slate-50/20 dark:bg-slate-950/20 p-2" />
          ))}

          {/* Actual Month Days */}
          {Array.from({ length: totalDays }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayEvents = getEventsForDay(dayNum);
            const isToday = dayNum === 1;

            return (
              <div
                key={dayNum}
                onClick={() => {
                  if (dayEvents.length > 0) {
                    setSelectedDayEvents({
                      date: `August ${dayNum}, 2026`,
                      items: dayEvents,
                    });
                  }
                }}
                className={`h-28 p-2 transition-colors relative space-y-1 flex flex-col justify-between cursor-pointer group ${
                  isToday
                    ? "bg-purple-500/5 dark:bg-purple-950/20 font-bold"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`h-6 w-6 rounded-full flex items-center justify-center font-mono text-xs ${
                      isToday
                        ? "bg-purple-600 text-white font-bold shadow-xs"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[9px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                      {dayEvents.length} Event{dayEvents.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {/* EVENTS PREVIEW IN DAY CELL */}
                <div className="space-y-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-medium truncate ${getTypeBadge(
                        ev.type
                      )}`}
                    >
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="text-[9px] text-slate-400 font-mono block pl-1">
                      +{dayEvents.length - 2} more...
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DAY EVENTS DIALOG */}
      {selectedDayEvents && (
        <Dialog open={!!selectedDayEvents} onOpenChange={() => setSelectedDayEvents(null)}>
          <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-purple-600" /> Schedule for {selectedDayEvents.date}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Detailed events, classes, exams & academic notifications for this date.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 my-2 max-h-80 overflow-y-auto pr-1">
              {selectedDayEvents.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <Badge className={`text-[9px] px-2 py-0.5 font-mono ${getTypeBadge(item.type)}`}>
                      {item.type}
                    </Badge>
                    {item.timeSlot && (
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {item.timeSlot}
                      </span>
                    )}
                  </div>

                  <h5 className="font-bold text-slate-900 dark:text-white pt-1">{item.title}</h5>
                  <p className="text-xs text-slate-500">{item.description}</p>
                  {item.location && (
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-mono flex items-center gap-1 pt-1">
                      <MapPin className="h-3 w-3" /> {item.location}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button onClick={() => setSelectedDayEvents(null)} className="w-full rounded-xl text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                Close Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
