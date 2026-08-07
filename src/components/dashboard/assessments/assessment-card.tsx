import { BookOpen, Users, Calendar, Layers, CheckCircle2, FileText, FlaskConical, Eye, Edit3, Trash2, Send, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  onClick?: (a: AssessmentItem) => void;
  onView?: (a: AssessmentItem) => void;
  onEnterMarks?: (a: AssessmentItem) => void;
  onEdit?: (a: AssessmentItem) => void;
  onPublish?: (a: AssessmentItem) => void;
  onDelete?: (a: AssessmentItem) => void;
}

export function AssessmentCard({
  assessment: a,
  onClick,
  onView,
  onEnterMarks,
  onEdit,
  onPublish,
  onDelete,
}: AssessmentCardProps) {
  const Icon = TYPE_ICONS[a.type] ?? BookOpen;
  const pct = a.studentsAppeared > 0
    ? Math.round((a.studentsEvaluated / a.studentsAppeared) * 100)
    : 0;

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onView) onView(a);
    else if (onClick) onClick(a);
  };

  const handleMarks = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEnterMarks) onEnterMarks(a);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(a);
  };

  const handlePublish = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPublish) onPublish(a);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(a);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 p-5 rounded-2xl border border-border/50 bg-card",
        "hover:shadow-lg hover:border-primary/30 transition-all duration-300"
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
            <p className="text-xs text-muted-foreground mt-0.5">{a.subject} ({a.code})</p>
          </div>
        </div>
        <StatusBadge status={a.status} />
      </div>

      {/* Primary details grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><Users className="size-3.5 shrink-0" /> Section {a.section}</span>
        <span className="flex items-center gap-1.5"><Calendar className="size-3.5 shrink-0" /> {a.date}</span>
        <span className="flex items-center gap-1.5"><Layers className="size-3.5 shrink-0" /> Max {a.maxMarks} Marks</span>
        <span className="flex items-center gap-1.5">
          Average: <strong className="text-foreground ml-1">{a.performance.average}/{a.maxMarks}</strong>
        </span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[0.68rem] text-muted-foreground">
          <span>Evaluation Progress: <strong className="text-foreground">{a.studentsEvaluated} / {a.studentsAppeared}</strong></span>
          <span className="font-bold text-primary">{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Type badge */}
      <div className="flex items-center justify-between pt-1 border-t border-border/40">
        <TypeBadge type={a.type} />
        <span className="text-[0.65rem] text-muted-foreground">AY {a.academicYear} · Sem {a.semester}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-1 pt-2 border-t border-border/40 flex-wrap">
        <Button variant="outline" size="sm" className="h-7 text-xs px-2 gap-1" onClick={handleView} title="View Details">
          <Eye className="size-3.5" /> View
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs px-2 gap-1 text-indigo-600 hover:text-indigo-700" onClick={handleMarks} title="Enter Marks">
          <PenTool className="size-3.5" /> Marks
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs px-2 gap-1" onClick={handleEdit} title="Edit Assessment">
          <Edit3 className="size-3.5" /> Edit
        </Button>
        {a.status !== "Published" && (
          <Button variant="outline" size="sm" className="h-7 text-xs px-2 gap-1 text-emerald-600 hover:text-emerald-700" onClick={handlePublish} title="Publish">
            <Send className="size-3.5" /> Publish
          </Button>
        )}
        <Button variant="outline" size="sm" className="h-7 text-xs px-2 gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20" onClick={handleDelete} title="Delete">
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
