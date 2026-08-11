import { CalendarRange, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/dashboard/panel";

export function AttendanceCalendar() {
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleDateClick = (day: number) => {
    toast.info(`Opening details for August ${day}, 2026`, {
      description: "Class session: 100% submitted.",
    });
  };

  const getDayStyle = (day: number) => {
    // Sundays: 2, 9, 16, 23, 30
    const sundays = [2, 9, 16, 23, 30];
    // Submitted dates: 3 to 14 (except sundays)
    // Pending: 15 (except sundays)
    // College Event: 15 Aug (Independence Day)
    
    if (sundays.includes(day)) {
      return "bg-rose-500/5 text-rose-500 border-rose-500/10 font-bold";
    }
    if (day === 15) {
      return "bg-amber-500/10 text-amber-600 border-amber-500/20 font-extrabold";
    }
    if (day < 15) {
      return "bg-emerald-500/5 text-emerald-600 border-emerald-500/20 font-bold";
    }
    return "bg-muted/30 text-muted-foreground border-border/40";
  };

  return (
    <Panel
      title="Attendance Activity Calendar"
      description="Visual grid status of daily roll-call submittals and holidays"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="space-y-4">
        {/* Calendar days grid (7 cols representing Mon-Sun) */}
        <div className="grid grid-cols-7 gap-1.5 text-center font-bold text-muted-foreground text-[0.62rem] uppercase tracking-wider">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span className="text-rose-500">Sun</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {/* Pad offset if Aug 1st starts on Sat */}
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={`pad-${idx}`} className="h-10 rounded-xl border border-transparent" />
          ))}

          {daysInMonth.map((day) => (
            <div
              key={day}
              onClick={() => handleDateClick(day)}
              className={`h-10 rounded-xl border flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform duration-200 select-none ${getDayStyle(day)}`}
            >
              <span className="text-[0.72rem]">{day}</span>
              {day < 15 && ![2, 9].includes(day) && (
                <span className="size-1 rounded-full bg-emerald-500 mt-0.5" />
              )}
              {day === 15 && (
                <span className="size-1 rounded-full bg-amber-500 mt-0.5" />
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 pt-3 border-t border-border/40 text-[0.65rem] text-muted-foreground font-semibold">
          <div className="flex items-center gap-1.5"><span className="size-3 rounded bg-emerald-500/10 border border-emerald-500/20" /> Submitted</div>
          <div className="flex items-center gap-1.5"><span className="size-3 rounded bg-amber-500/10 border border-amber-500/20" /> Holiday / Event</div>
          <div className="flex items-center gap-1.5"><span className="size-3 rounded bg-rose-500/10 border border-rose-500/20" /> Non-Working</div>
          <div className="flex items-center gap-1.5"><span className="size-3 rounded bg-muted border border-border" /> Upcoming</div>
        </div>
      </div>
    </Panel>
  );
}
