import { Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import type { MonthlyPlanItem } from "@/data/faculty-mock-data";

interface MonthlyPlannerProps {
  monthlyPlan: MonthlyPlanItem[];
}

export function MonthlyPlanner({ monthlyPlan }: MonthlyPlannerProps) {
  const handleMonthClick = (monthName: string) => {
    toast.success(`Opening detailed logs for: ${monthName}`, {
      description: "Showing experimental unit schedules.",
    });
  };

  const getStatusColor = (progress: string) => {
    switch (progress) {
      case "Completed":
      case "Completed on July 24":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Ongoing":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-muted text-muted-foreground border-border/40";
    }
  };

  return (
    <Panel
      title="Monthly Planning Calendar"
      description="Overview of expected syllabus completion markers by month"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {monthlyPlan.map((month, idx) => (
          <div
            key={idx}
            onClick={() => handleMonthClick(month.monthName)}
            className="p-4 border rounded-2xl bg-muted/20 hover:bg-muted/40 hover:shadow-sm transition-all duration-300 cursor-pointer space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="font-display font-extrabold text-sm flex items-center gap-1.5 text-foreground">
                  <Calendar className="size-4 text-primary" /> {month.monthName}
                </span>
                <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.58rem] font-bold border ${getStatusColor(month.actualProgress)}`}>
                  {month.actualProgress === "Pending" ? "Pending" : "Active"}
                </Badge>
              </div>
              <p className="text-[0.62rem] text-muted-foreground mt-1.5 leading-normal">
                Planned: {month.plannedUnits.join(", ")} &middot; Topics: {month.topics.join(", ")}
              </p>
            </div>
            
            <div className="pt-2 border-t border-border/40 text-[0.62rem] text-muted-foreground font-medium mt-3 flex items-center justify-between">
              <span>Expected by {month.expectedCompletion}</span>
              <span className="font-semibold text-primary">{month.actualProgress}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
