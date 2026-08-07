import { Briefcase, Landmark, Calendar, Users, Eye, Edit3, Trash2, User } from "lucide-react";
import type { ResearchProjectItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProjectCardsProps {
  projects: ResearchProjectItem[];
  onViewProject?: (proj: ResearchProjectItem) => void;
  onEditProject?: (proj: ResearchProjectItem) => void;
  onDeleteProject?: (proj: ResearchProjectItem) => void;
}

export function ProjectCards({
  projects,
  onViewProject,
  onEditProject,
  onDeleteProject,
}: ProjectCardsProps) {
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

  const handleView = (proj: ResearchProjectItem) => {
    if (onViewProject) onViewProject(proj);
    else toast.info("Viewing Project", { description: `Project: "${proj.title}"` });
  };

  const handleEdit = (proj: ResearchProjectItem) => {
    if (onEditProject) onEditProject(proj);
    else toast.info("Edit Project", { description: `Editing "${proj.title}"` });
  };

  const handleDelete = (proj: ResearchProjectItem) => {
    if (onDeleteProject) onDeleteProject(proj);
    else toast.success(`Project "${proj.title}" deleted.`);
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
      {projects.map((proj) => {
        const piName = proj.teamMembers[0] || "Faculty Lead";
        const teamMembersText = proj.teamMembers.length > 1 ? proj.teamMembers.slice(1).join(", ") : "N/A";

        return (
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

              {/* Details panel */}
              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-border/30 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 col-span-2">
                  <Landmark className="size-3.5 text-muted-foreground/75 shrink-0" />
                  <span>Funding Agency: <strong className="text-foreground">{proj.fundingAgency}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <Calendar className="size-3.5 text-muted-foreground/75 shrink-0" />
                  <span>Duration: <strong className="text-foreground">{proj.duration}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <User className="size-3.5 text-muted-foreground/75 shrink-0" />
                  <span>Principal Investigator: <strong className="text-foreground">{piName}</strong></span>
                </div>
                {teamMembersText !== "N/A" && (
                  <div className="flex items-start gap-1.5 col-span-2">
                    <Users className="size-3.5 text-muted-foreground/75 mt-0.5 shrink-0" />
                    <span>Team Members: <strong className="text-foreground">{teamMembersText}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/30 mt-4">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs flex-1 gap-1 font-semibold"
                onClick={() => handleView(proj)}
              >
                <Eye className="size-3.5" /> View
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs flex-1 gap-1 font-semibold"
                onClick={() => handleEdit(proj)}
              >
                <Edit3 className="size-3.5" /> Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs flex-1 gap-1 font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                onClick={() => handleDelete(proj)}
              >
                <Trash2 className="size-3.5" /> Delete
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
