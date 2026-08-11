import { Clock, Users, Calendar, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AssignmentItem } from "@/data/faculty-mock-data";

interface AssignmentCardProps {
  assignment: AssignmentItem;
  onClick: () => void;
}

export function AssignmentCard({ assignment, onClick }: AssignmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Draft":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-muted text-muted-foreground border-border/40";
    }
  };

  const getEvaluationColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "In-Progress":
        return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 animate-pulse";
      default:
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
  };

  const submissionPct = assignment.totalStudents > 0
    ? Math.round((assignment.submittedCount / assignment.totalStudents) * 100)
    : 0;

  return (
    <Card
      onClick={onClick}
      className="border border-border/70 py-0 shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden cursor-pointer group"
    >
      <div className="absolute right-0 top-0 h-16 w-16 bg-muted/10 blur-xl" />
      <CardContent className="p-5 space-y-4 text-xs">
        <div className="flex justify-between items-start">
          <span className="font-mono text-muted-foreground text-[0.65rem] font-bold">
            {assignment.code} &middot; Section {assignment.section}
          </span>
          <div className="flex gap-1.5 shrink-0">
            <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.58rem] font-bold border ${getEvaluationColor(assignment.evaluationStatus)}`}>
              Grading: {assignment.evaluationStatus}
            </Badge>
            <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.58rem] font-bold border ${getStatusColor(assignment.status)}`}>
              {assignment.status}
            </Badge>
          </div>
        </div>

        <div>
          <h4 className="font-extrabold text-sm leading-snug group-hover:text-primary transition-colors truncate">
            {assignment.title}
          </h4>
          <p className="text-[0.65rem] text-muted-foreground mt-0.5 font-bold">
            Max Score: {assignment.maxMarks} Marks &middot; AY {assignment.academicYear}
          </p>
        </div>

        {/* Submissions Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[0.6rem] font-bold text-muted-foreground">
            <span>Submissions Received</span>
            <span className="text-foreground">{assignment.submittedCount} / {assignment.totalStudents} ({submissionPct}%)</span>
          </div>
          <Progress value={submissionPct} className="h-1.5 bg-primary/10 [&>div]:bg-brand-gradient" />
        </div>

        <div className="pt-3 border-t border-border/40 flex justify-between items-center text-[0.65rem] text-muted-foreground font-medium">
          <span className="flex items-center gap-1"><Calendar className="size-3.5 text-primary/60" /> Due: {assignment.dueDate}</span>
          <span className="flex items-center gap-1"><Users className="size-3.5 text-primary/60" /> Class: {assignment.totalStudents} Students</span>
        </div>
      </CardContent>
    </Card>
  );
}
