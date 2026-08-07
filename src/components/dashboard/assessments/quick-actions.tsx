import { Plus, ClipboardList, BarChart2, Download, GitBranch, Send } from "lucide-react";

interface QuickActionsProps {
  onCreateAssessment: () => void;
  onEnterMarks: () => void;
}

const ACTIONS = (handlers: QuickActionsProps) => [
  { label: "Create Assessment",   icon: Plus,          color: "from-blue-500 to-blue-600",   onClick: handlers.onCreateAssessment, id: "qa-create" },
  { label: "Enter Marks",         icon: ClipboardList, color: "from-indigo-500 to-indigo-600", onClick: handlers.onEnterMarks,       id: "qa-marks"  },
  { label: "View Analytics",      icon: BarChart2,     color: "from-sky-500 to-sky-600",  onClick: () => {},                     id: "qa-analytics" },
  { label: "Export Marks",        icon: Download,      color: "from-blue-600 to-indigo-700",    onClick: () => {},                     id: "qa-export" },
  { label: "Grade Distribution",  icon: GitBranch,     color: "from-indigo-600 to-blue-600", onClick: () => {},                 id: "qa-grades" },
  { label: "Publish Results",     icon: Send,          color: "from-sky-600 to-blue-700",    onClick: () => {},                     id: "qa-publish" },
];

export function QuickActions(props: QuickActionsProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <h3 className="text-sm font-bold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {ACTIONS(props).map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              id={action.id}
              onClick={action.onClick}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/40 bg-muted/10 hover:bg-muted/20 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <div className={`size-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${action.color} shadow-sm group-hover:shadow-md transition-shadow`}>
                <Icon className="size-5 text-white" />
              </div>
              <span className="text-[0.65rem] font-bold text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
