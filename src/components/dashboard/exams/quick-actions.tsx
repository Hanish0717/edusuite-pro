import { Calendar, FileText, ClipboardList, TrendingUp, Download, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  onActionSelect: (action: string) => void;
}

export function QuickActions({ onActionSelect }: QuickActionsProps) {
  const actions = [
    {
      id: "timetable",
      label: "View Timetable",
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-500/8",
      text: "text-blue-600"
    },
    {
      id: "question-papers",
      label: "Question Papers",
      icon: FileText,
      color: "from-violet-500 to-violet-600",
      bg: "bg-violet-500/8",
      text: "text-violet-600"
    },
    {
      id: "marks-entry",
      label: "Marks Entry",
      icon: ClipboardList,
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-500/8",
      text: "text-emerald-600"
    },
    {
      id: "evaluation",
      label: "Evaluation Progress",
      icon: Eye,
      color: "from-amber-500 to-amber-600",
      bg: "bg-amber-500/8",
      text: "text-amber-600"
    },
    {
      id: "analytics",
      label: "Exam Analytics",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-500/8",
      text: "text-purple-600"
    },
    {
      id: "reports",
      label: "Export Reports",
      icon: Download,
      color: "from-rose-500 to-rose-600",
      bg: "bg-rose-500/8",
      text: "text-rose-600"
    }
  ];

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <h3 className="text-sm font-bold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onActionSelect(act.id)}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-border/40 bg-muted/10 hover:bg-muted/20 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <div className={cn("size-10 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-sm group-hover:shadow-md transition-shadow", act.color)}>
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
