import { PlusCircle, FileText, CheckCircle, FileSpreadsheet, BarChart2, Clock } from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/dashboard/panel";

interface QuickActionsProps {
  assignmentId?: string;
  onCreateClick?: () => void;
}

export function QuickActions({ assignmentId, onCreateClick }: QuickActionsProps) {
  const handleAction = (label: string) => {
    if (label === "Create Assignment" && onCreateClick) {
      onCreateClick();
      return;
    }
    toast.success(`Cockpit Action Triggered: ${label}`, {
      description: assignmentId ? `Scoping active folder: ${assignmentId}` : "Faculty dashboard shortcuts.",
    });
  };

  const actions = [
    { label: "Create Assignment", icon: PlusCircle, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { label: "View Submissions", icon: FileText, color: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
    { label: "Evaluate Assignments", icon: CheckCircle, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
    { label: "Export Marks", icon: FileSpreadsheet, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    { label: "Assignment Analytics", icon: BarChart2, color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
    { label: "Draft Assignments", icon: Clock, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  ];

  return (
    <Panel
      title="Assignment Cockpit Shortcuts"
      description="Quick shortcuts to accelerate folder organization and grading tasks"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map((act, idx) => (
          <div
            key={idx}
            onClick={() => handleAction(act.label)}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-sm cursor-pointer bg-muted/20 hover:bg-muted/30"
          >
            <span className={`grid size-8 place-items-center rounded-lg border mb-2 ${act.color}`}>
              <act.icon className="size-4" />
            </span>
            <span className="font-bold leading-normal truncate w-full text-[0.65rem]">{act.label}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
