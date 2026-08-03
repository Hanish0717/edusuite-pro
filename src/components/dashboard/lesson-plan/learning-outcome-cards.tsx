import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, BookOpen } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import type { LearningOutcomeItem } from "@/data/faculty-mock-data";

interface LearningOutcomeCardsProps {
  outcomes: LearningOutcomeItem[];
}

export function LearningOutcomeCards({ outcomes }: LearningOutcomeCardsProps) {
  const [expandedOutcome, setExpandedOutcome] = useState<number | null>(null);

  const toggleOutcome = (idx: number) => {
    setExpandedOutcome(expandedOutcome === idx ? null : idx);
  };

  return (
    <Panel
      title="Learning Outcomes Mapping"
      description="Unit Outcomes linked to NBA Course Outcomes (CO)"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="space-y-2">
        {outcomes.map((item, idx) => {
          const isExpanded = expandedOutcome === idx;
          return (
            <div key={idx} className="border rounded-2xl bg-muted/20 overflow-hidden">
              <button
                onClick={() => toggleOutcome(idx)}
                className="w-full flex justify-between items-center p-3 text-left font-semibold hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-lg bg-primary/10 text-primary font-bold font-mono text-[0.65rem]">
                    {item.co}
                  </span>
                  <span className="truncate">Outcome Objectives</span>
                </div>
                
                <div className="flex items-center gap-2.5 shrink-0">
                  <Badge variant="outline" className="bg-indigo-500/5 text-indigo-600 border border-indigo-500/10 text-[0.58rem] font-bold">
                    {item.bloomsLevel}
                  </Badge>
                  {isExpanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-3 bg-card border-t border-border/40 space-y-2 text-muted-foreground text-[0.68rem] leading-normal pl-11">
                  {item.unitOutcomes.map((out, uidx) => (
                    <div key={uidx} className="flex items-start gap-1.5">
                      <Sparkles className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{out}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
