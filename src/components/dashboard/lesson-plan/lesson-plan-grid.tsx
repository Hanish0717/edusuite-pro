import { LessonPlanCard } from "./lesson-plan-card";
import { EmptyState } from "./empty-state";
import type { LessonPlanItem } from "@/data/faculty-mock-data";

interface LessonPlanGridProps {
  plans: LessonPlanItem[];
  onSelectPlan: (plan: LessonPlanItem) => void;
}

export function LessonPlanGrid({ plans, onSelectPlan }: LessonPlanGridProps) {
  if (plans.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((p) => (
        <LessonPlanCard
          key={p.id}
          plan={p}
          onClick={() => onSelectPlan(p)}
        />
      ))}
    </div>
  );
}
