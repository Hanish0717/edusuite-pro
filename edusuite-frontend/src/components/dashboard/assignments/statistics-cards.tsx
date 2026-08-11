import { FileText, ClipboardList, CheckCircle, Clock, Percent, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AssignmentItem } from "@/data/faculty-mock-data";

interface StatisticsCardsProps {
  assignments: AssignmentItem[];
}

export function StatisticsCards({ assignments }: StatisticsCardsProps) {
  const total = assignments.length;
  const active = assignments.filter((a) => a.status === "Active").length;
  const draft = assignments.filter((a) => a.status === "Draft").length;
  const closed = assignments.filter((a) => a.status === "Closed").length;
  
  // Pending evaluations: count submissions which are "Pending" or "Draft"
  const pendingEvaluation = assignments.reduce((sum, a) => {
    return sum + a.submissions.filter((s) => s.evaluationStatus !== "Evaluated" && s.status === "Submitted").length;
  }, 0);

  // Average submission rate percentage
  const totalStudents = assignments.reduce((sum, a) => sum + a.totalStudents, 0);
  const totalSubmissions = assignments.reduce((sum, a) => sum + a.submittedCount, 0);
  const submissionRate = totalStudents > 0 ? Math.round((totalSubmissions / totalStudents) * 100) : 0;

  const cards = [
    { label: "Total Assignments", value: `${total} Publish`, icon: FileText, color: "bg-blue-500/10 text-blue-600 border-blue-500/10" },
    { label: "Active Sheets", value: `${active} Active`, icon: ClipboardList, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/10" },
    { label: "Draft Templates", value: `${draft} Drafts`, icon: Clock, color: "bg-amber-500/10 text-amber-600 border-amber-500/10" },
    { label: "Closed Folders", value: `${closed} Closed`, icon: CheckCircle, color: "bg-rose-500/10 text-rose-600 border-rose-500/10" },
    { label: "Pending Grading", value: `${pendingEvaluation} backlog`, icon: AlertTriangle, color: "bg-violet-500/10 text-violet-600 border-violet-500/10" },
    { label: "Submission Rate", value: `${submissionRate}% ratio`, icon: Percent, color: "bg-teal-500/10 text-teal-600 border-teal-500/10" },
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
