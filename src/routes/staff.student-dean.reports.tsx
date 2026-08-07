import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Download, FileSpreadsheet, FileText } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/staff/student-dean/reports")({
  head: () => ({ meta: [{ title: "Student Reports & Analytics — Student Dean" }] }),
  component: StudentReportsPage,
});

function StudentReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">REPORTS & ANALYTICS</Badge>
            <span className="text-xs text-muted-foreground">• Executive Student Affairs Dossiers</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Student Reports Dashboard</h1>
          <p className="text-sm text-muted-foreground">Export PDF and Excel reports for department strength, year-wise analytics, and student performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <FileText className="size-3.5" /> Export All PDF
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <FileSpreadsheet className="size-3.5" /> Export All Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Analytics Dossiers" value="18 Dossiers" icon={BarChart3} tone="info" />
        <KpiCard label="Department Audits" value="100% Verified" icon={FileText} tone="success" />
        <KpiCard label="Performance Score" value="94.2%" icon={BarChart3} tone="purple" />
        <KpiCard label="Export Format" value="PDF & XLSX" icon={FileSpreadsheet} tone="warning" />
      </div>

      <Panel title="Available Student Reports Catalog" description="Click button to generate or download report file.">
        <div className="space-y-3">
          {[
            { title: "Annual Department Student Strength Audit Report", metric: "5,420 Enrolled Students", date: "2026-08-01" },
            { title: "Year-wise Demographics & Admission Quota Report", metric: "Convenor, Merit & Management", date: "2026-08-02" },
            { title: "Student Academic CGPA Performance Dossier", metric: "Avg CGPA 8.12", date: "2026-08-03" },
          ].map((r, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <div>
                <h4 className="font-bold text-foreground text-sm">{r.title}</h4>
                <p className="text-muted-foreground font-mono">{r.metric} • Generated: {r.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-7 text-[0.65rem] gap-1 cursor-pointer">
                  <Download className="size-3" /> PDF
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[0.65rem] gap-1 cursor-pointer">
                  <Download className="size-3" /> Excel
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
