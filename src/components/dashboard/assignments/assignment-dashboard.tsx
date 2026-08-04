import { Check, Clipboard, Eye, Calendar, Award, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AssignmentItem } from "@/data/faculty-mock-data";

interface AssignmentDashboardProps {
  assignments: AssignmentItem[];
}

export function AssignmentDashboard({ assignments }: AssignmentDashboardProps) {
  const published = assignments.filter((a) => a.status === "Active" || a.status === "Closed").length;
  const submissions = assignments.reduce((sum, a) => sum + a.submittedCount, 0);
  const totalStudents = assignments.reduce((sum, a) => sum + a.totalStudents, 0);
  const pending = totalStudents - submissions;
  
  // Overdue count: count submissions with "Overdue" status
  const overdue = assignments.reduce((sum, a) => {
    return sum + a.submissions.filter((s) => s.status === "Overdue").length;
  }, 0);

  // Evaluated: count submissions evaluated
  const evaluated = assignments.reduce((sum, a) => {
    return sum + a.submissions.filter((s) => s.evaluationStatus === "Evaluated").length;
  }, 0);

  // Average score
  const gradedSubmissions = assignments.flatMap((a) => a.submissions).filter((s) => s.marks !== undefined);
  const avgScore = gradedSubmissions.length > 0
    ? Math.round(gradedSubmissions.reduce((sum, s) => sum + (s.marks || 0), 0) / gradedSubmissions.length)
    : 0;

  const dashboards = [
    { label: "Published Sheets", value: published, icon: Send, color: "text-blue-500 bg-blue-500/10 border-blue-500/10" },
    { label: "Submissions Received", value: submissions, icon: Check, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/10" },
    { label: "Pending Roster", value: pending, icon: Clipboard, color: "text-amber-500 bg-amber-500/10 border-amber-500/10" },
    { label: "Overdue Submissions", value: overdue, icon: Calendar, color: "text-rose-500 bg-rose-500/10 border-rose-500/10" },
    { label: "Evaluated Papers", value: evaluated, icon: Eye, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/10" },
    { label: "Average Grade Score", value: `${avgScore}%`, icon: Award, color: "text-violet-500 bg-violet-500/10 border-violet-500/10" },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-xs">
      {dashboards.map((card, idx) => (
        <Card
          key={idx}
          className="border border-border/60 py-0 shadow-sm rounded-2xl bg-muted/20"
        >
          <CardContent className="flex items-center gap-3 p-3.5">
            <span className={`grid size-9 shrink-0 place-items-center rounded-xl border ${card.color}`}>
              <card.icon className="size-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-[0.55rem] text-muted-foreground uppercase tracking-wider truncate">
                {card.label}
              </p>
              <p className="mt-0.5 text-sm font-black tracking-tight text-foreground">
                {card.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
