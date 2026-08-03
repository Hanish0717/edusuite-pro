import { Clock, MapPin, Layers } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import type { UpcomingClassItem } from "@/data/faculty-mock-data";

interface UpcomingClassesProps {
  classes: UpcomingClassItem[];
}

export function UpcomingClasses({ classes }: UpcomingClassesProps) {
  return (
    <Panel
      title="Upcoming Classes"
      description="Next 5 periods on your schedule"
      className="border border-border bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="space-y-3.5 text-xs">
        {classes.map((cls, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-all duration-300 relative"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Clock className="size-4" />
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex justify-between items-start gap-2">
                <h5 className="font-bold text-foreground truncate leading-snug">{cls.subject}</h5>
                <Badge className="bg-primary/15 text-primary hover:bg-primary/20 border-0 rounded-xl font-bold py-0.5 px-2 text-[0.58rem] shrink-0">
                  {cls.countdown}
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.65rem] text-muted-foreground font-medium">
                <span className="flex items-center gap-0.5"><Clock className="size-3" /> {cls.time}</span>
                <span className="flex items-center gap-0.5"><Layers className="size-3" /> Sec {cls.section}</span>
                <span className="flex items-center gap-0.5"><MapPin className="size-3" /> Rm {cls.room} ({cls.building.replace("Block ", "")})</span>
              </div>
            </div>
          </div>
        ))}
        {classes.length === 0 && (
          <p className="text-xs text-muted-foreground italic text-center py-4">No upcoming classes scheduled.</p>
        )}
      </div>
    </Panel>
  );
}
