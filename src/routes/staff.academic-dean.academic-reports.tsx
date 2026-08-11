import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { FileText, Download, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAcademicDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/academic-dean/academic-reports")({
  head: () => ({
    meta: [{ title: "Academic Reports — Academic Dean" }],
  }),
  component: AcademicReportsPage,
});

function AcademicReportsPage() {
  const data = useMemo(() => getAcademicDeanDashboardData(), []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Academic Reports & Dossiers</h1>
        <p className="text-sm text-muted-foreground">
          Official generated reports for Course Completion, Faculty Performance, Department Performance, Attendance, and Results.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Generated Dossiers" value={String(data.reports.length)} icon={FileText} tone="info" />
        <KpiCard label="Syllabus Completion" value="94.8%" icon={ShieldCheck} tone="success" />
        <KpiCard label="Result Pass Rate" value="92.6%" icon={ShieldCheck} tone="purple" />
      </div>

      <Panel title="Academic Council Reports Ledger" description="Official downloadable reports signed off by the Academic Dean.">
        <div className="grid gap-4 sm:grid-cols-2">
          {data.reports.map((rep) => (
            <div key={rep.id} className="p-4 rounded-xl border border-border bg-card space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-[0.65rem]">{rep.category}</Badge>
                <span className="text-[0.65rem] font-mono text-muted-foreground">{rep.generatedDate}</span>
              </div>
              <h4 className="font-bold text-sm text-foreground">{rep.title}</h4>
              <div className="text-xs font-mono font-bold text-emerald-600">
                {rep.metric} ({rep.value})
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success(`Downloading official dossier: ${rep.title}...`)}
                className="w-full text-xs cursor-pointer gap-1.5 mt-2"
              >
                <Download className="size-3.5" /> Download Dossier PDF
              </Button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
