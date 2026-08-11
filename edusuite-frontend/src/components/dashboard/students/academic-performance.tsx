import { Award, Compass, BookOpen, Layers } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Panel } from "@/components/dashboard/panel";

interface AcademicPerformanceProps {
  performance: {
    internalMarks: number;
    assignmentScore: number;
    quizScore: number;
    labPerformance: number;
    overallGrade: string;
  };
}

export function AcademicPerformance({ performance }: AcademicPerformanceProps) {
  const scores = [
    { label: "Internal Marks", value: performance.internalMarks, icon: Award, color: "bg-blue-500" },
    { label: "Assignments Average", value: performance.assignmentScore, icon: BookOpen, color: "bg-indigo-500" },
    { label: "Quizzes & Tests", value: performance.quizScore, icon: Compass, color: "bg-amber-500" },
    { label: "Laboratory Practice", value: performance.labPerformance, icon: Layers, color: "bg-purple-500" },
  ];

  return (
    <Panel
      title="Academic Performance Indices"
      description="Evaluation logs mapping internal scores and exam outcomes"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="space-y-5">
        {/* Core grade banner */}
        <div className="flex justify-between items-center p-3.5 rounded-2xl border bg-muted/40 font-bold">
          <div>
            <p className="text-[0.6rem] text-muted-foreground uppercase tracking-wider">Overall Grade</p>
            <p className="text-sm font-black text-foreground mt-0.5">Grade Level: {performance.overallGrade}</p>
          </div>
          <span className="grid size-10 place-items-center rounded-xl bg-brand-gradient text-white font-black text-sm shadow-glow">
            {performance.overallGrade}
          </span>
        </div>

        {/* Scores list */}
        <div className="space-y-3.5 pt-1">
          {scores.map((score, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <score.icon className="size-4 text-primary/60 shrink-0" />
                  {score.label}
                </span>
                <span className="text-foreground">{score.value}%</span>
              </div>
              <Progress value={score.value} className="h-1.5 bg-primary/10" />
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
