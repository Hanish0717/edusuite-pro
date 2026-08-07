import { FileText, Clock, Layers, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LessonPlanItem } from "@/data/faculty-mock-data";

interface LessonPlanCardProps {
  plan: LessonPlanItem;
  onClick: () => void;
}

export function LessonPlanCard({ plan, onClick }: LessonPlanCardProps) {
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Active":
        return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
      default:
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "Lab":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  return (
    <Card
      onClick={onClick}
      className="border border-border/70 py-0 shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden cursor-pointer group"
    >
      <div className="absolute right-0 top-0 h-16 w-16 bg-muted/10 blur-xl" />
      <CardContent className="p-5 space-y-4 text-xs">
        <div className="flex justify-between items-start">
          <span className="font-mono text-muted-foreground text-[0.65rem] font-bold">
            {plan.code} &middot; Sem {plan.semester}
          </span>
          <div className="flex gap-1.5 shrink-0">
            <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.6rem] font-bold border ${getTypeStyle(plan.teachingMode)}`}>
              {plan.teachingMode}
            </Badge>
            <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.6rem] font-bold border ${getBadgeStyle(plan.status)}`}>
              {plan.status}
            </Badge>
          </div>
        </div>

        <div>
          <h4 className="font-extrabold text-sm leading-snug group-hover:text-primary transition-colors truncate">
            {plan.name}
          </h4>
          <p className="text-[0.65rem] text-muted-foreground mt-0.5 font-bold">
            AY {plan.academicYear} &middot; {plan.totalUnits} Units Mapped
          </p>
        </div>

        {/* Completion Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[0.6rem] font-bold text-muted-foreground">
            <span>Syllabus Coverage</span>
            <span className="text-foreground">{plan.completionPercentage}%</span>
          </div>
          <Progress value={plan.completionPercentage} className="h-1.5 bg-primary/10 [&>div]:bg-brand-gradient" />
        </div>

        <div className="pt-3 border-t border-border/40 flex justify-between items-center text-[0.65rem] text-muted-foreground font-medium">
          <span className="flex items-center gap-0.5"><Clock className="size-3 text-primary/60" /> {plan.weeklyHours} Hrs/Wk</span>
          <span className="flex items-center gap-0.5"><Layers className="size-3 text-primary/60" /> Sec: {plan.assignedSections.join(", ")}</span>
          <span className="text-[0.6rem] font-bold text-primary hover:underline bg-primary/10 px-2 py-0.5 rounded-lg">
            Session Planner &rarr;
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

