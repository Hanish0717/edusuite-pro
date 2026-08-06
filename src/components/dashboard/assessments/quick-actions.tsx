import { Plus, ClipboardList, Download, Send } from "lucide-react";

interface QuickActionsProps {
  onCreateAssessment: () => void;
  onEnterMarks: () => void;
  onPublishResults?: () => void;
  onExportMarks?: () => void;
}

const ACTIONS = (handlers: QuickActionsProps) => [
  { label: "Create Assessment", icon: Plus,          color: "from-blue-500 to-blue-600",   onClick: handlers.onCreateAssessment, id: "qa-create" },
  { label: "Enter Marks",       icon: ClipboardList, color: "from-indigo-500 to-indigo-600", onClick: handlers.onEnterMarks,       id: "qa-marks"  },
  { label: "Publish Results",   icon: Send,          color: "from-sky-600 to-blue-700",    onClick: handlers.onPublishResults ?? (() => {}), id: "qa-publish" },
  { label: "Export Marks",      icon: Download,      color: "from-blue-600 to-indigo-700",  onClick: handlers.onExportMarks ?? (() => {}), id: "qa-export" },
];

export function QuickActions(props: QuickActionsProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <h3 className="text-sm font-bold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
