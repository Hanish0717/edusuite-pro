import { useState } from "react";
import { Download, FileText, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/dashboard/panel";
import { useReports } from "../hooks/useReports";
import { ExportDialog } from "../components/dialogs/ExportDialog";
import { LoadingState } from "@/shared/components";
import type { AnalyticsReport } from "../types";

export function Reports() {
  const { reports, loading, error, exportReport } = useReports();
  const [selectedReport, setSelectedReport] = useState<AnalyticsReport | null>(null);
  const [exportFormat, setExportFormat] = useState<"PDF" | "Excel" | "CSV">("PDF");

  const handleOpenExport = (report: AnalyticsReport) => {
    setSelectedReport(report);
    // Auto-select first available format
    const firstFormat = report.formats[0];
    if (firstFormat) {
      setExportFormat(firstFormat);
    }
  };

  const handleConfirmExport = async () => {
    if (!selectedReport) return;
    await exportReport(selectedReport.id, exportFormat);
    setSelectedReport(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {loading ? (
        <LoadingState message="Generating compilation directories..." />
      ) : error ? (
        <div className="text-center p-6 text-red-500 font-semibold">{error}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <Panel
              key={report.id}
              title={report.title}
              description={`Institutional compliance auditing metrics for academic validation.`}
              action={
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 font-semibold text-[10px] font-mono">
                  {report.category}
                </Badge>
              }
            >
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                    <FileText className="size-3.5 text-emerald-500" />
                    <span>Size: {report.size}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                    <Clock className="size-3.5 text-primary" />
                    <span>Generated: {report.lastGenerated}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/40 pt-4">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground/80">
                    File: {report.id}
                  </span>
                  <Button
                    onClick={() => handleOpenExport(report)}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white font-semibold cursor-pointer gap-1.5 shadow-[0_2px_8px_rgba(29,78,216,0.15)]"
                  >
                    <Download className="size-3.5" /> Export Data
                  </Button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      {/* Export Format Dialog */}
      <ExportDialog
        report={selectedReport}
        format={exportFormat}
        onFormatChange={setExportFormat}
        onClose={() => setSelectedReport(null)}
        onConfirm={handleConfirmExport}
      />
    </div>
  );
}
