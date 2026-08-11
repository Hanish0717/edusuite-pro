import { BookOpen, Users, Calendar, Clock, Layers, CheckCircle2, FileText, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssessmentItem, AssessmentType } from "./types";
import { StatusBadge, TypeBadge } from "./assessment-badges";

const TYPE_ICONS: Record<AssessmentType, React.ElementType> = {
  "Internal 1":         BookOpen,
  "Internal 2":         BookOpen,
  "Quiz":               Layers,
  "Assignment":         FileText,
  "Lab Assessment":     FlaskConical,
  "Viva":               Users,
  "Seminar":            Users,
  "Project Evaluation": CheckCircle2,
};

interface AssessmentCardProps {
  assessment: AssessmentItem;
  onClick: (a: AssessmentItem) => void;
}

export function AssessmentCard({ assessment: a, onClick }: AssessmentCardProps) {
  const Icon = TYPE_ICONS[a.type] ?? BookOpen;
  const pct = a.studentsAppeared > 0
    ? Math.round((a.studentsEvaluated / a.studentsAppeared) * 100)
    : 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(a)}
      onKeyDown={(e) => e.key === "Enter" && onClick(a)}
      className={cn(
        "group relative flex flex-col gap-4 p-5 rounded-2xl border border-border/50 bg-card",
        "hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
            <Icon className="size-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-2">{a.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{a.subject} · {a.code}</p>
          </div>
        </div>
        <StatusBadge status={a.status} />
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><Users className="size-3.5 shrink-0" /> Section {a.section}</span>
        <span className="flex items-center gap-1.5"><Calendar className="size-3.5 shrink-0" /> {a.date}</span>
        <span className="flex items-center gap-1.5"><Layers className="size-3.5 shrink-0" /> Max {a.maxMarks} Marks</span>
        <span className="flex items-center gap-1.5"><Clock className="size-3.5 shrink-0" /> {a.duration}</span>
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[0.68rem] text-muted-foreground">
          <span>Evaluated: <strong className="text-foreground">{a.studentsEvaluated} / {a.studentsAppeared}</strong></span>
          <span className="font-bold text-primary">{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-1 border-t border-border/40">
        <TypeBadge type={a.type} />
        <span className="text-[0.65rem] text-muted-foreground font-medium">
          Avg: <strong className="text-foreground">{a.performance.average}/{a.maxMarks}</strong>
        </span>
      </div>
    </div>
  );
}
