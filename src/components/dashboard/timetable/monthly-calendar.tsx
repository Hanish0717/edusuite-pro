import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, AlertCircle } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import type { CalendarEvent } from "@/data/faculty-mock-data";

interface MonthlyCalendarProps {
  events: CalendarEvent[];
}

export function MonthlyCalendar({ events }: MonthlyCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  // Focus calendar on August 2026
  const monthName = "August 2026";
  const daysInMonth = 31;
  const startDayOffset = 6; // August 1, 2026 is a Saturday, so offset is 6 (Sun=0, Mon=1, ..., Sat=6)

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper to format date string to check events
  const getEventForDay = (dayNum: number): CalendarEvent | undefined => {
    const dateStr = `2026-08-${String(dayNum).padStart(2, "0")}`;
    return events.find((e) => e.date === dateStr);
  };

  const handleDayClick = (dayNum: number) => {
    setSelectedDay(dayNum);
    setSidePanelOpen(true);
  };

  const getDayStyle = (dayNum: number) => {
    const ev = getEventForDay(dayNum);
    if (!ev) return "bg-background hover:bg-muted/50 border border-border/40 text-foreground";

    switch (ev.type) {
      case "Holiday":
        return "bg-muted/40 hover:bg-muted/65 text-muted-foreground border border-border/50";
      case "Exam":
        return "bg-rose-500/10 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25 font-bold";
      case "Leave":
        return "bg-amber-500/10 hover:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 font-bold";
      case "Workshop":
        return "bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 font-bold";
      default: // Event
        return "bg-blue-500/10 hover:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25 font-bold";
    }
  };

  // Generate blank grids before day 1
  const gridCells = [];
  for (let i = 0; i < startDayOffset; i++) {
    gridCells.push(<div key={`blank-${i}`} className="h-10 sm:h-12 bg-muted/5 border border-border/10 rounded-lg opacity-30" />);
  }

  // Generate days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const ev = getEventForDay(day);
    gridCells.push(
      <button
        key={`day-${day}`}
        onClick={() => handleDayClick(day)}
        className={`h-10 sm:h-12 relative flex flex-col justify-between p-1.5 sm:p-2 text-[0.65rem] sm:text-xs rounded-xl transition-all duration-300 cursor-pointer shadow-sm select-none ${getDayStyle(day)}`}
      >
        <span className="font-extrabold">{day}</span>
        {ev && (
          <span className="w-1.5 h-1.5 rounded-full bg-current self-end absolute bottom-1.5 right-1.5" />
        )}
      </button>
    );
  }

  const getSelectedDayDetails = () => {
    if (!selectedDay) return null;
    return getEventForDay(selectedDay);
  };

  const selectedEvent = getSelectedDayDetails();

  return (
    <Panel
      title="Monthly Calendar View"
      description="View working sessions, exam schedules, holidays, and workshops"
      className="border border-border bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="space-y-4 text-xs">
        {/* Calendar Nav */}
        <div className="flex justify-between items-center bg-muted/40 p-2.5 rounded-xl border border-border/40">
          <Button variant="ghost" size="icon" className="size-7 rounded-lg cursor-pointer">
            <ChevronLeft className="size-4" />
          </Button>
          <span className="font-display font-extrabold text-sm flex items-center gap-1.5 text-foreground">
            <Calendar className="size-4 text-primary" /> {monthName}
          </span>
          <Button variant="ghost" size="icon" className="size-7 rounded-lg cursor-pointer">
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* Days Column Headings */}
        <div className="grid grid-cols-7 gap-1.5 text-center font-extrabold text-muted-foreground text-[0.6rem] uppercase tracking-wider">
          {weekdays.map((wd) => (
            <div key={wd}>{wd}</div>
          ))}
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {gridCells}
        </div>
      </div>

      {/* DETAIL SHIELD OVERLAY (Sheet/Drawer) */}
      <Sheet open={sidePanelOpen} onOpenChange={setSidePanelOpen}>
        <SheetContent className="sm:max-w-[400px] rounded-l-3xl">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="flex items-center gap-2 text-base">
              <Calendar className="size-5 text-primary" /> Schedule Details
            </SheetTitle>
            <SheetDescription>
              Detailed classes and campus events scheduled for August {selectedDay}, 2026.
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6 space-y-5 text-xs">
            {/* Event Header Card if any */}
            {selectedEvent ? (
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold uppercase text-[0.65rem] text-primary">Scheduled Event</span>
                  <Badge className="bg-primary/10 text-primary border-0 rounded-xl font-bold py-0 px-2">{selectedEvent.type}</Badge>
                </div>
                <h4 className="font-extrabold text-sm leading-snug">{selectedEvent.title}</h4>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-muted/40 border text-muted-foreground flex items-center gap-2">
                <AlertCircle className="size-4.5" /> No specific institutional events scheduled.
              </div>
            )}

            {/* Simulated schedule timeline */}
            <div className="space-y-4">
              <h5 className="font-extrabold uppercase tracking-wider text-muted-foreground text-[0.65rem]">
                Period Timeline
              </h5>
              
              {selectedEvent?.type === "Holiday" ? (
                <div className="text-center py-6 text-muted-foreground italic border border-dashed rounded-2xl bg-muted/10">
                  Campus Closed (Holiday). No classes scheduled.
                </div>
              ) : (
                <div className="relative border-l-2 border-border/60 pl-4 ml-2 space-y-4">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 size-2 rounded-full border-2 border-white bg-primary" />
                    <div>
                      <span className="font-mono text-muted-foreground text-[0.6rem]">09:00 - 10:00</span>
                      <h6 className="font-bold text-foreground mt-0.5">Theory Lecture: Core Subject</h6>
                      <p className="text-muted-foreground text-[0.65rem] mt-0.5">Section A &middot; Room 302</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 size-2 rounded-full border-2 border-white bg-primary" />
                    <div>
                      <span className="font-mono text-muted-foreground text-[0.6rem]">11:15 - 12:15</span>
                      <h6 className="font-bold text-foreground mt-0.5">Theory Lecture: Elective Subject</h6>
                      <p className="text-muted-foreground text-[0.65rem] mt-0.5">Section B &middot; Room 108</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 size-2 rounded-full border-2 border-white bg-muted" />
                    <div>
                      <span className="font-mono text-muted-foreground text-[0.6rem]">Afternoon Slot</span>
                      <h6 className="font-semibold text-muted-foreground mt-0.5">Free Period / Self Study</h6>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Panel>
  );
}
