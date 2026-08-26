import { Clock, MapPin, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { TimetableSlot } from "@/data/faculty-mock-data";

interface TodayScheduleProps {
  schedule: TimetableSlot[];
}

export function TodaySchedule({ schedule }: TodayScheduleProps) {
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Ongoing":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse";
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Today's Schedule Cards
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {schedule.map((slot, idx) => (
          <Card
            key={idx}
            className="border border-border/70 py-0 shadow-card hover:shadow-elevated transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 h-16 w-16 bg-muted/10 blur-xl" />
            <CardContent className="p-4 space-y-3.5 text-xs">
              <div className="flex justify-between items-start">
                <span className="font-mono text-muted-foreground text-[0.65rem] font-bold flex items-center gap-1">
                  <Clock className="size-3" /> {slot.time}
                </span>
                <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.6rem] font-bold border ${getBadgeStyle(slot.status)}`}>
                  {slot.status}
                </Badge>
              </div>

              <div>
                <h4 className="font-bold text-sm leading-snug truncate">{slot.subject}</h4>
                <p className="text-[0.65rem] text-muted-foreground mt-0.5 font-medium flex items-center gap-1">
                  <Layers className="size-3" /> Section {slot.section}
                </p>
              </div>

              <div className="pt-2 border-t border-border/40 flex justify-between items-center text-muted-foreground text-[0.65rem] font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-primary/60" /> Room {slot.room}
                </span>
                <span>Theory</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {schedule.length === 0 && (
          <div className="col-span-full border border-dashed rounded-2xl bg-card p-6 text-center text-muted-foreground">
            No classes scheduled for today.
          </div>
        )}
      </div>
    </div>
  );
}
