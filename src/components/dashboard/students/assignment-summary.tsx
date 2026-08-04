import { FileText, Calendar, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/dashboard/panel";

interface AssignmentSummaryProps {
  assignments: {
    title: string;
    subject: string;
    dueDate: string;
    status: "Submitted" | "Pending" | "Overdue";
  }[];
}

export function AssignmentSummary({ assignments }: AssignmentSummaryProps) {
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Pending":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse";
    }
  };

  return (
    <Panel
      title="ERP Assignments Registry"
      description="List of homework assignments and evaluation checklist"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="space-y-3">
        {assignments.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3.5 rounded-2xl border bg-muted/20 hover:bg-muted/40 transition-all duration-200"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <h6 className="font-extrabold text-[0.72rem] text-foreground leading-snug truncate">
                  {item.title}
                </h6>
                <div className="flex items-center gap-1.5 mt-0.5 text-[0.62rem] text-muted-foreground font-semibold">
                  <Calendar className="size-3 text-primary/60 shrink-0" />
                  <span>Due by {item.dueDate}</span>
                </div>
              </div>
            </div>
            
            <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.58rem] font-bold border shrink-0 ${getBadgeStyle(item.status)}`}>
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </Panel>
  );
}
