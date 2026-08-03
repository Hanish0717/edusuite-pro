import { Calendar } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import type { TimelineEvent } from "@/data/faculty-mock-data";

interface MaterialTimelineProps {
  timeline: TimelineEvent[];
}

export function MaterialTimeline({ timeline }: MaterialTimelineProps) {
  return (
    <Panel
      title="Material Audit Timelines"
      description="System logs tracking file uploads, visibility toggles, and revisions"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="relative border-l border-border/80 pl-4 ml-2.5 space-y-4 py-1">
        {timeline.map((item, idx) => (
          <div key={idx} className="relative group space-y-0.5">
            <div className="absolute -left-[21px] top-0.5 size-2.5 rounded-full border-2 border-white bg-primary group-hover:scale-110 transition-transform shadow-sm" />
            
            <h6 className="font-bold text-foreground leading-snug">{item.event}</h6>
            <p className="text-[0.62rem] text-muted-foreground font-semibold flex items-center gap-1">
              <Calendar className="size-3" /> {item.date}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
