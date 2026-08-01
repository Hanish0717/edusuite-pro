import { useState } from "react";
import { toast } from "sonner";
import {
  FileSpreadsheet,
  Calendar,
  Award,
  CheckCircle2,
  Lock,
  Download,
  Plus,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ExamCellDashboard() {
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
        <KpiCard label="Upcoming Exams" value="48 Papers" icon={Calendar} />
        <KpiCard label="Hall Tickets Issued" value="4,850 Generated" icon={FileSpreadsheet} tone="info" />
        <KpiCard label="Valuation Completed" value="98.4%" icon={CheckCircle2} tone="success" />
        <KpiCard label="Revaluation Requests" value="14 Pending" icon={Award} tone="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Active Examination Batches">
            <div className="space-y-3">
              {[
                { batch: "B.Tech Sem 6 End Examinations 2026", status: "Valuation Complete", date: "Aug 1 - Aug 12" },
                { batch: "M.Tech Sem 2 Regular Examinations", status: "Hall Tickets Ready", date: "Aug 15 - Aug 22" },
                { batch: "MBA Semester 4 Final Viva & Project", status: "Marks Locked", date: "Jul 28 - Jul 30" },
              ].map((ex) => (
                <div key={ex.batch} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{ex.batch}</h4>
                    <p className="text-xs text-muted-foreground">Schedule: {ex.date}</p>
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
