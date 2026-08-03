import { useMemo } from "react";
import { toast } from "sonner";
import {
  FileSpreadsheet,
  Calendar,
  Award,
  CheckCircle2,
  Lock,
  Download,
} from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { fetchExamCellStats, fetchExamBatches } from "@/lib/roleDashboardService";

export function ExamCellDashboard() {
  const stats = useMemo(() => fetchExamCellStats(), []);
  const batches = useMemo(() => fetchExamBatches(), []);

  const renderIcon = (name: string) => {
    switch (name) {
      case "Calendar":
        return Calendar;
      case "FileSpreadsheet":
        return FileSpreadsheet;
      case "CheckCircle2":
        return CheckCircle2;
      default:
        return Award;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Exam Controller Management Console
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Examination Management, Scheduling, Hall Tickets, Gradebooks, Results, Revaluation.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          EXAM CONTROLLER (EXAM CELL)
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((kpi, idx) => {
          const IconComp = renderIcon(kpi.iconName);
          return (
            <KpiCard
              key={idx}
              label={kpi.label}
              value={kpi.value}
              icon={IconComp}
              tone={kpi.tone}
            />
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Active Examination Batches">
            <div className="space-y-3">
              {batches.map((ex) => (
                <div key={ex.id} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{ex.title}</h4>
                    <p className="text-xs text-muted-foreground">Schedule: {ex.meta}</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono">
                    {ex.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Exam Controller Actions">
            <div className="space-y-2">
              <Button
                onClick={() => toast.success("Generating bulk Hall Tickets for all enrolled students...")}
                className="w-full justify-start bg-brand-gradient text-xs cursor-pointer"
              >
                <Download className="size-4 mr-2" /> Generate Bulk Hall Tickets
              </Button>
              <Button
                onClick={() => toast.info("Locking gradebook SGPA/CGPA calculations...")}
                variant="outline"
                className="w-full justify-start text-xs cursor-pointer"
              >
                <Lock className="size-4 mr-2" /> Lock Gradebook & Moderation
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
