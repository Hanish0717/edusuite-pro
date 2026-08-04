import { BookOpen, CheckCircle, FileText, Layers, Clock, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { LessonPlanItem } from "@/data/faculty-mock-data";

interface StatisticsCardsProps {
  plans: LessonPlanItem[];
}

export function StatisticsCards({ plans }: StatisticsCardsProps) {
  const total = plans.length;
  const completed = plans.filter((p) => p.status === "Completed").length;
  const active = plans.filter((p) => p.status === "Active").length;
  const pending = plans.filter((p) => p.status === "Pending").length;
  
  const totalUnits = plans.reduce((sum, p) => sum + p.totalUnits, 0);
  
  const avgCompletion = total > 0
    ? Math.round(plans.reduce((sum, p) => sum + p.completionPercentage, 0) / total)
    : 0;

  const cards = [
    { label: "Total Plans", value: `${total} Courses`, icon: BookOpen, color: "bg-blue-500/10 text-blue-600 border-blue-500/10" },
    { label: "Completed Plans", value: `${completed} Completed`, icon: CheckCircle, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/10" },
    { label: "Active Plans", value: `${active} Active`, icon: FileText, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/10" },
    { label: "Pending Layouts", value: `${pending} Pending`, icon: Clock, color: "bg-amber-500/10 text-amber-600 border-amber-500/10" },
    { label: "Planned Units", value: `${totalUnits} Units`, icon: Layers, color: "bg-violet-500/10 text-violet-600 border-violet-500/10" },
    { label: "Average Coverage", value: `${avgCompletion}% Index`, icon: ShieldCheck, color: "bg-teal-500/10 text-teal-600 border-teal-500/10" },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-xs">
      {cards.map((card, idx) => (
        <Card
          key={idx}
          className="border border-border/70 py-0 shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1"
        >
          <CardContent className="flex flex-col items-center text-center p-4">
            <span className={`grid size-9 place-items-center rounded-xl border mb-2.5 ${card.color}`}>
              <card.icon className="size-4.5" />
            </span>
            <p className="font-extrabold text-muted-foreground uppercase tracking-wider text-[0.55rem]">
              {card.label}
            </p>
            <p className="mt-1 text-base font-black tracking-tight text-foreground">
              {card.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
