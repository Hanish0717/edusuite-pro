import { useState } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Panel } from "@/components/dashboard/panel";
import type { SyllabusProgressData } from "@/data/faculty-mock-data";

interface SyllabusProgressProps {
  progress: SyllabusProgressData;
}

export function SyllabusProgress({ progress }: SyllabusProgressProps) {
  const [expandedUnit, setExpandedUnit] = useState<number | null>(null);

  const toggleUnit = (idx: number) => {
    setExpandedUnit(expandedUnit === idx ? null : idx);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "In-Progress":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-muted-foreground bg-muted border-border/40";
    }
  };

  return (
    <Panel
      title="Syllabus Progress Tracker"
      description="Weekly status of unit syllabus achievements"
      action={
        <span className="font-extrabold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full text-[0.62rem]">
          {progress.completionPercentage}% Done
        </span>
      }
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="space-y-4">
        {/* Core summary bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center font-bold">
            <span className="text-muted-foreground">Unit Coverage Index</span>
            <span>{progress.completedUnits} of {progress.totalUnits} Units Completed</span>
          </div>
          <Progress value={progress.completionPercentage} className="h-2 bg-primary/10 [&>div]:bg-brand-gradient" />
        </div>

        {/* Units accordions */}
        <div className="space-y-2 pt-2">
          {progress.units.map((unit, idx) => {
            const isExpanded = expandedUnit === idx;
            return (
              <div key={idx} className="border rounded-2xl bg-muted/20 overflow-hidden">
                <button
                  onClick={() => toggleUnit(idx)}
                  className="w-full flex justify-between items-center p-3 text-left font-semibold hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <span className="truncate pr-4">{unit.unitName}</span>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full border text-[0.58rem] font-bold ${getStatusColor(unit.status)}`}>
                      {unit.status}
                    </span>
                    {isExpanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="p-3 bg-card border-t border-border/40 space-y-3">
                    {/* Topics covered */}
                    {unit.topicsCovered.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="font-extrabold text-[0.6rem] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Topics Covered</p>
                        <div className="space-y-1 pl-1">
                          {unit.topicsCovered.map((topic, tid) => (
                            <div key={tid} className="flex items-center gap-1.5 text-muted-foreground text-[0.68rem]">
                              <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Topics remaining */}
                    {unit.topicsRemaining.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <p className="font-extrabold text-[0.6rem] text-amber-600 dark:text-amber-400 uppercase tracking-wider">Remaining Syllabus</p>
                        <div className="space-y-1 pl-1">
                          {unit.topicsRemaining.map((topic, tid) => (
                            <div key={tid} className="flex items-center gap-1.5 text-muted-foreground text-[0.68rem]">
                              <Circle className="size-3.5 text-muted-foreground/60 shrink-0" />
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {unit.topicsCovered.length === 0 && unit.topicsRemaining.length === 0 && (
                      <p className="text-[0.65rem] text-muted-foreground italic">No specific syllabus mapping recorded.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}
