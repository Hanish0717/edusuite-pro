import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/dashboard/panel";
import type { WeeklyPlanItem } from "@/data/faculty-mock-data";

interface WeeklyPlannerProps {
  weeklyPlan: WeeklyPlanItem[];
}

export function WeeklyPlanner({ weeklyPlan }: WeeklyPlannerProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Ongoing":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-muted text-muted-foreground border-border/40";
    }
  };

  return (
    <Panel
      title="Weekly Planner"
      description="Week-wise schedule distribution of topics and evaluations"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="overflow-x-auto max-w-full">
        <Table className="min-w-[550px] text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Week No.</TableHead>
              <TableHead>Planned Topics</TableHead>
              <TableHead className="w-[120px]">Teaching Method</TableHead>
              <TableHead className="w-[120px]">Assessment</TableHead>
              <TableHead className="w-[90px] text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {weeklyPlan.map((week) => (
              <TableRow key={week.weekNum} className="hover:bg-muted/40">
                <TableCell className="font-mono font-bold text-center">Week {week.weekNum}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-bold text-foreground leading-normal">{week.plannedTopics.join(", ")}</p>
                    <p className="text-[0.62rem] text-muted-foreground leading-normal italic">
                      Objectives: {week.learningObjectives.join("; ")}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{week.teachingMethod.join(", ")}</TableCell>
                <TableCell className="font-medium text-muted-foreground">{week.assessmentMethod}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.58rem] font-bold border ${getStatusColor(week.status)}`}>
                    {week.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Panel>
  );
}
