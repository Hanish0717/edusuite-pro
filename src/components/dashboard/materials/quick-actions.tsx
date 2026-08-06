import { Upload, BookOpen, Download, BarChart2, FileText, Layers, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    toast.success(`Action: ${label}`, {
      description: "Executing quick shortcut task.",
    });
  };

  const actions = [
    { label: "Upload Material", icon: Upload, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { label: "Manage Materials", icon: Layers, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
    { label: "View Student Downloads", icon: Download, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    { label: "Export Material List", icon: FileText, color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
    { label: "Material Analytics", icon: BarChart2, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  ];

  return (
    <Card className="p-4 sm:p-5 border-border/80 rounded-2xl bg-card shadow-sm space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <BookOpen className="size-4 text-primary" /> Study Materials Quick Action Cockpit
        </h3>
        <Badge variant="secondary" className="font-mono text-[0.65rem]">
          Quick Shortcuts
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {actions.map((act, idx) => (
          <div
            key={idx}
            onClick={() => handleAction(act.label)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-sm cursor-pointer bg-card hover:bg-muted/30 border-border/70 min-w-0"
          >
            <span className={`grid size-8 place-items-center rounded-xl border mb-1.5 ${act.color}`}>
              <act.icon className="size-4" />
            </span>
            <span className="font-bold leading-snug truncate w-full text-[0.7rem]">{act.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

