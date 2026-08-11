import React from "react";
import { FileSpreadsheet, CheckCircle2, Ticket, ArrowRight, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamWidgetProps {
  onOpenExamination: () => void;
}

export const ExamWidget: React.FC<ExamWidgetProps> = ({ onOpenExamination }) => {
  const statuses = [
    { title: "Hall Ticket Status", status: "Available for Download", icon: Ticket, isOk: true },
    { title: "Result Status", status: "Sem IV Published (CGPA 8.85)", icon: FileSpreadsheet, isOk: true },
    { title: "Course Registration", status: "Completed (6 Courses)", icon: CheckCircle2, isOk: true },
    { title: "Exam Registration", status: "Confirmed & Approved", icon: ShieldAlert, isOk: true }
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-primary" /> Examination Snapshot
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600">
          Mid-Sem Autumn 2026
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {statuses.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div key={idx} className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Icon className="h-3.5 w-3.5 text-primary" /> {st.title}
              </div>
              <div className="text-xs font-bold text-foreground line-clamp-1">{st.status}</div>
            </div>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onOpenExamination}
        className="w-full text-xs gap-1 h-9"
      >
        Open Examination Portal <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};
