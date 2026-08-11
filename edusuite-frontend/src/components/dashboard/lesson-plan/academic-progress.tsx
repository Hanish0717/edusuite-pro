import { CircleDot, Award, Clock, Compass } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Progress } from "@/components/ui/progress";
import type { LessonPlanItem } from "@/data/faculty-mock-data";

interface AcademicProgressProps {
  plan: LessonPlanItem;
}

export function AcademicProgress({ plan }: AcademicProgressProps) {
  const completedCount = plan.units.filter((u) => u.status === "Completed").length;
  const remainingCount = plan.totalUnits - completedCount;

  return (
    <Panel
      title="Academic Progress Metrics"
      description="Syllabus coverage index and planned vs actual progress tracking"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="space-y-6">
        {/* Core Percentage Coverage */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-muted/40 text-center">
          <div>
            <p className="text-[0.6rem] uppercase font-extrabold tracking-wider text-muted-foreground">Overall Coverage</p>
            <p className="text-xl font-black mt-0.5 text-primary flex items-center justify-center gap-1">
              <Award className="size-4 text-primary/60" /> {plan.completionPercentage}%
            </p>
          </div>
          <div>
            <p className="text-[0.6rem] uppercase font-extrabold tracking-wider text-muted-foreground">Units Completed</p>
            <p className="text-sm font-extrabold mt-1.5 text-foreground">{completedCount} Units</p>
          </div>
          <div>
            <p className="text-[0.6rem] uppercase font-extrabold tracking-wider text-muted-foreground">Remaining Units</p>
            <p className="text-sm font-extrabold mt-1.5 text-foreground">{remainingCount} Units</p>
          </div>
        </div>

        {/* Planned vs Actual Bars */}
        <div className="space-y-4 pt-2">
          {/* Planned */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold">
              <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="size-3.5" /> Expected Progress (June-Sept)</span>
              <span>75% (Target)</span>
            </div>
            <Progress value={75} className="h-1.5 bg-primary/10 [&>div]:bg-blue-500" />
          </div>

          {/* Actual */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold">
              <span className="text-muted-foreground flex items-center gap-1.5"><Compass className="size-3.5 text-emerald-500" /> Actual Progress achieved</span>
              <span className="text-emerald-600 dark:text-emerald-400">{plan.completionPercentage}% (Actual)</span>
            </div>
            <Progress value={plan.completionPercentage} className="h-1.5 bg-primary/10 [&>div]:bg-emerald-500" />
          </div>
        </div>
      </div>
    </Panel>
  );
}
