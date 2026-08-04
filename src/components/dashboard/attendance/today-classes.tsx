import { Clock, Users, MapPin, ClipboardList, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TimetableSlot } from "@/data/faculty-mock-data";

interface TodayClassesProps {
  classes: TimetableSlot[];
  onTakeAttendance: (slot: TimetableSlot) => void;
  onViewRegister: (slot: TimetableSlot) => void;
}

export function TodayClasses({ classes, onTakeAttendance, onViewRegister }: TodayClassesProps) {
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Ongoing":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse";
      default:
        return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {classes.map((cls, idx) => (
        <Card
          key={idx}
          className="border border-border/70 py-0 shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 h-16 w-16 bg-muted/10 blur-xl" />
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="flex justify-between items-start">
              <span className="font-mono text-muted-foreground text-[0.65rem] font-bold">
                Period {idx + 1}
              </span>
              <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.6rem] font-bold border ${getBadgeStyle(cls.status)}`}>
                {cls.status}
              </Badge>
            </div>

            <div>
              <h4 className="font-extrabold text-sm leading-snug group-hover:text-primary transition-colors truncate">
                {cls.subject}
              </h4>
              <p className="text-[0.65rem] text-muted-foreground mt-0.5 font-bold">
                Section: {cls.section} &middot; Classroom: {cls.room}
              </p>
            </div>

            <div className="pt-3 border-t border-border/40 space-y-2 text-[0.65rem] text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5"><Clock className="size-3.5 text-primary/60" /> {cls.time}</span>
              <span className="flex items-center gap-1.5"><Users className="size-3.5 text-primary/60" /> Class Capacity: 66 Students</span>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => onViewRegister(cls)}
                variant="outline"
                className="flex-1 rounded-xl cursor-pointer hover:bg-muted text-[0.65rem] h-8 font-semibold flex items-center justify-center gap-1"
              >
                <Eye className="size-3.5" /> Register
              </Button>
              <Button
                onClick={() => onTakeAttendance(cls)}
                disabled={cls.status === "Completed"}
                className={`flex-1 rounded-xl text-[0.65rem] h-8 font-bold flex items-center justify-center gap-1 cursor-pointer bg-brand-gradient shadow-glow ${cls.status === "Completed" ? "opacity-50 pointer-events-none" : ""}`}
              >
                <ClipboardList className="size-3.5" /> Take Attendance
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
