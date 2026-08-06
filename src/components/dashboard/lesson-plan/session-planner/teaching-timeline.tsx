import React from "react";
import { Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TimelineItem {
  hourNumber: number;
  topic: string;
  status: "Completed" | "In Progress" | "Upcoming";
  date: string;
}

interface TeachingTimelineProps {
  timeline: TimelineItem[];
}

export function TeachingTimeline({ timeline }: TeachingTimelineProps) {
  return (
    <Card className="p-4 border-border/80 rounded-2xl bg-card shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
          <Clock className="size-4 text-primary" /> Session Sequence & Hour-by-Hour Timeline
        </h3>
        <Badge variant="secondary" className="font-mono text-xs">
          {timeline.length} Hours Planned
        </Badge>
      </div>

      <div className="relative border-l-2 border-primary/20 pl-4 ml-2 space-y-4 py-1">
        {timeline.map((item) => (
          <div key={item.hourNumber} className="relative group">
            <div
              className={`absolute -left-[21px] top-1 size-3 rounded-full border-2 border-background transition-transform ${
                item.status === "Completed"
                  ? "bg-emerald-500"
                  : item.status === "In Progress"
                  ? "bg-amber-500 animate-pulse scale-125"
                  : "bg-muted-foreground/40"
              }`}
            />
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
              <div>
                <span className="font-mono font-bold text-primary mr-2">Hour {item.hourNumber}</span>
                <span className="font-semibold text-foreground">{item.topic}</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[0.68rem]">
                <Badge
                  variant={
                    item.status === "Completed"
                      ? "secondary"
                      : item.status === "In Progress"
                      ? "outline"
                      : "default"
                  }
                  className={
                    item.status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : item.status === "In Progress"
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                  }
                >
                  {item.status === "In Progress" ? "Today's Class" : item.status}
                </Badge>
                <span className="text-muted-foreground">{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
