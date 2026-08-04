import { useMemo } from "react";
import { toast } from "sonner";
import { BookOpen, FileSpreadsheet, CheckCircle2, Clock, Plus, Download } from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { fetchLmsStats, fetchLmsCourses } from "@/lib/roleDashboardService";

export function LmsDashboard() {
  const stats = useMemo(() => fetchLmsStats(), []);
  const courses = useMemo(() => fetchLmsCourses(), []);

  const renderIcon = (name: string) => {
    switch (name) {
      case "BookOpen":
        return BookOpen;
      case "FileSpreadsheet":
        return FileSpreadsheet;
      case "CheckCircle2":
        return CheckCircle2;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Learning Management System (LMS)
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Courseware Repository, Quiz Builder, Assignment Evaluator, Virtual Classrooms.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          LMS MANAGER
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
          <Panel title="Active Course Modules">
            <div className="space-y-3">
              {courses.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{c.title}</h4>
                    <p className="text-xs text-muted-foreground">{c.meta}</p>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    {c.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="LMS Actions">
            <div className="space-y-2">
              <Button
                onClick={() => toast.info("Opening courseware upload form...")}
                className="w-full justify-start bg-brand-gradient text-xs cursor-pointer"
              >
                <Plus className="size-4 mr-2" /> Upload Course Slides
              </Button>
              <Button
                onClick={() => toast.success("Exporting LMS engagement report...")}
                variant="outline"
                className="w-full justify-start text-xs cursor-pointer"
              >
                <Download className="size-4 mr-2" /> Export Usage Report
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
