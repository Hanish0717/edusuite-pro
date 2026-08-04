import { CheckCircle2, Circle, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/dashboard/panel";
import type { UnitDetail } from "@/data/faculty-mock-data";

interface UnitPlannerProps {
  units: UnitDetail[];
  weeklyHours: number;
}

export function UnitPlanner({ units, weeklyHours }: UnitPlannerProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "In-Progress":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse";
      default:
        return "bg-muted text-muted-foreground border-border/40";
    }
  };

  // Planned hours mock based on index
  const getPlannedHours = (idx: number) => {
    return (idx + 1) * weeklyHours;
  };

  return (
    <Panel
      title="Unit-wise Planning Details"
      description="Breakdown of core syllabus units, target hours, and timelines"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="space-y-4">
        {units.map((unit, idx) => (
          <div
            key={idx}
            className="p-4 border rounded-2xl bg-muted/20 hover:bg-muted/30 transition-colors space-y-3"
          >
            {/* Header row */}
            <div className="flex justify-between items-start gap-2">
              <div>
                <h5 className="font-extrabold text-[0.75rem] text-foreground leading-snug">{unit.unitName}</h5>
                <div className="flex items-center gap-3 text-[0.62rem] text-muted-foreground mt-1 font-medium">
                  <span className="flex items-center gap-0.5"><Clock className="size-3" /> {getPlannedHours(idx)} planned hours</span>
                  <span className="flex items-center gap-0.5"><Calendar className="size-3" /> Target: Aug {10 + idx * 5}, 2026</span>
                </div>
              </div>
              <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.58rem] font-bold border shrink-0 ${getStatusColor(unit.status)}`}>
                {unit.status}
              </Badge>
            </div>

            {/* Syllabus progress list details */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              {/* Covered topics */}
              {unit.topicsCovered.length > 0 && (
                <div className="space-y-1">
                  <p className="font-extrabold text-[0.58rem] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Completed Topics</p>
                  {unit.topicsCovered.map((topic, tid) => (
                    <div key={tid} className="flex items-center gap-1.5 text-muted-foreground text-[0.65rem]">
                      <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Remaining topics */}
              {unit.topicsRemaining.length > 0 && (
                <div className="space-y-1 pt-1">
                  <p className="font-extrabold text-[0.58rem] text-amber-600 dark:text-amber-400 uppercase tracking-wider">Topics Remaining</p>
                  {unit.topicsRemaining.map((topic, tid) => (
                    <div key={tid} className="flex items-center gap-1.5 text-muted-foreground text-[0.65rem]">
                      <Circle className="size-3 text-muted-foreground/60 shrink-0" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
