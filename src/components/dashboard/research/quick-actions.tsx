import { Plus, ShieldCheck, Download } from "lucide-react";

interface QuickActionsProps {
  onActionSelect: (action: string) => void;
}

export function QuickActions({ onActionSelect }: QuickActionsProps) {
  const actions = [
    {
      id: "add-publication",
      label: "Create Publication",
      icon: Plus,
    },
    {
      id: "add-project",
      label: "Add Project",
      icon: Plus,
    },
    {
      id: "add-patent",
      label: "Add Patent",
      icon: Plus,
    },
    {
      id: "upload-certificate",
      label: "Upload Certificate",
      icon: ShieldCheck,
    },
    {
      id: "export",
      label: "Export Profile",
      icon: Download,
    }
  ];

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <h3 className="text-sm font-bold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onActionSelect(act.id)}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-border/40 bg-muted/10 hover:bg-muted/20 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <div className="size-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm group-hover:shadow-md transition-shadow">
                <Icon className="size-5 text-white" />
              </div>
              <span className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
