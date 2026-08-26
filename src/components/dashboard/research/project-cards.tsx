import { Briefcase, Landmark, Calendar, Users, DollarSign } from "lucide-react";
import type { ResearchProjectItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProjectCardsProps {
  projects: ResearchProjectItem[];
}

export function ProjectCards({ projects }: ProjectCardsProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
      case "Ongoing":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20";
      case "Proposed":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20";
      default:
        return "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20";
    }
  };

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-6 text-center text-muted-foreground text-sm">
        No projects recorded.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((proj) => (
        <div
          key={proj.id}
          className="flex flex-col justify-between p-5 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-4">
            {/* Header tag */}
            <div className="flex items-start justify-between gap-3">
              <div className="size-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Briefcase className="size-4.5 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge variant="outline" className={getStatusBadgeClass(proj.status)}>
                {proj.status}
              </Badge>
            </div>

            {/* Project Title */}
            <div>
              <h4 className="font-bold text-sm text-foreground leading-snug line-clamp-2">
                {proj.title}
              </h4>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Project Progress:</span>
                <span className="font-bold text-primary">{proj.progress}%</span>
              </div>
              <Progress value={proj.progress} className="h-2" />
            </div>

            {/* Details panel */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/30 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Landmark className="size-3.5 text-muted-foreground/75" />
                <span>Agency: <strong className="text-foreground">{proj.fundingAgency}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="size-3.5 text-muted-foreground/75" />
                <span>Budget: <strong className="text-foreground">{proj.budget}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <Calendar className="size-3.5 text-muted-foreground/75" />
                <span>Duration: <strong className="text-foreground">{proj.duration}</strong></span>
              </div>
              <div className="flex items-start gap-1.5 col-span-2 mt-1">
                <Users className="size-3.5 text-muted-foreground/75 mt-0.5 shrink-0" />
                <span>Team: <strong className="text-foreground">{proj.teamMembers.join(", ")}</strong></span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
