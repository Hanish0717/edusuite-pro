import { BookOpen, FlaskConical, HelpCircle, ClipboardList, Users, PresentationIcon, FolderGit2, Mic } from "lucide-react";
import type { AssessmentItem, AssessmentType } from "./types";
import { cn } from "@/lib/utils";

interface AssessmentDashboardProps {
  assessments: AssessmentItem[];
}

const TYPE_CONFIG: Record<AssessmentType, { icon: React.ElementType; color: string; bg: string }> = {
  "Internal 1":        { icon: BookOpen,         color: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20" },
  "Internal 2":        { icon: BookOpen,         color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  "Quiz":              { icon: HelpCircle,       color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  "Assignment":        { icon: ClipboardList,    color: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20" },
  "Lab Assessment":    { icon: FlaskConical,     color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  "Viva":              { icon: Mic,              color: "text-rose-600 dark:text-rose-400",   bg: "bg-rose-500/10 border-rose-500/20" },
  "Seminar":           { icon: PresentationIcon, color: "text-teal-600 dark:text-teal-400",   bg: "bg-teal-500/10 border-teal-500/20" },
  "Project Evaluation":{ icon: FolderGit2,       color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
};

const ALL_TYPES: AssessmentType[] = [
  "Internal 1", "Internal 2", "Quiz", "Assignment",
  "Lab Assessment", "Viva", "Seminar", "Project Evaluation",
];

export function AssessmentDashboard({ assessments }: AssessmentDashboardProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <h3 className="text-sm font-bold text-foreground mb-4">Assessment Dashboard</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {ALL_TYPES.map((type) => {
          const cfg = TYPE_CONFIG[type];
          const Icon = cfg.icon;
          const items = assessments.filter((a) => a.type === type);
          const published = items.filter((a) => a.status === "Published").length;
          const draft = items.filter((a) => a.status === "Draft").length;

          return (
            <div
              key={type}
              className={cn(
                "flex flex-col items-center text-center gap-2 p-4 rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-default",
                cfg.bg
              )}
            >
              <Icon className={cn("size-6", cfg.color)} />
              <p className={cn("text-xl font-extrabold tabular-nums", cfg.color)}>{items.length}</p>
              <p className="text-[0.58rem] font-bold text-muted-foreground leading-tight text-center">{type}</p>
              {items.length > 0 && (
                <div className="flex gap-1 text-[0.5rem] font-bold">
                  {published > 0 && <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">{published} pub</span>}
                  {draft > 0 && <span className="bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">{draft} draft</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
