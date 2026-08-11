import { Upload, BookOpen, Clock, BarChart2, FolderPlus, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/dashboard/panel";

interface QuickActionsProps {
  materialId?: string;
  onUploadClick?: () => void;
}

export function QuickActions({ materialId, onUploadClick }: QuickActionsProps) {
  const handleAction = (label: string) => {
    if (label === "Upload Material" && onUploadClick) {
      onUploadClick();
      return;
    }
    toast.success(`Cockpit shortcut triggered: ${label}`, {
      description: materialId ? `Scoping active folder: ${materialId}` : "Faculty dashboard shortcuts.",
    });
  };

  const actions = [
    { label: "Upload Material", icon: Upload, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { label: "View Library", icon: BookOpen, color: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
    { label: "Draft Materials", icon: Clock, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
    { label: "View Analytics", icon: BarChart2, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    { label: "Manage Categories", icon: FolderPlus, color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
    { label: "Category Help", icon: HelpCircle, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  ];

  return (
    <Panel
      title="Study Materials Shortcuts"
      description="Quick shortcuts to accelerate library uploads and categories creation"
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
