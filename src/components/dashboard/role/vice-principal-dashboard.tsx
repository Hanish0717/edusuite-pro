import { useMemo } from "react";
import { toast } from "sonner";
import { Award, UserCog, CheckCircle2, ShieldAlert, Download, FileText } from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { fetchVicePrincipalStats, fetchVicePrincipalAudits } from "@/lib/roleDashboardService";

export function VicePrincipalDashboard() {
  const stats = useMemo(() => fetchVicePrincipalStats(), []);
  const audits = useMemo(() => fetchVicePrincipalAudits(), []);

  const renderIcon = (name: string) => {
    switch (name) {
      case "Award":
        return Award;
      case "UserCog":
        return UserCog;
      case "CheckCircle2":
        return CheckCircle2;
      default:
        return ShieldAlert;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Vice Principal Cockpit
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Academic Compliance, Faculty Attendance, Timetable Integrity, Grievance Escalations.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          VICE PRINCIPAL
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
          <Panel title="Academic Integrity & Department Audits">
            <div className="space-y-3">
              {audits.map((a) => (
                <div key={a.id} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{a.title}</h4>
                    <p className="text-xs text-muted-foreground">{a.meta}</p>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    {a.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Vice Principal Actions">
            <div className="space-y-2">
              <Button
                onClick={() => toast.success("Generated Academic Compliance Report!")}
                className="w-full justify-start bg-brand-gradient text-xs cursor-pointer"
              >
                <FileText className="size-4 mr-2" /> Generate Compliance Report
              </Button>
              <Button
                onClick={() => toast.info("Opening timetable clash resolver...")}
                variant="outline"
                className="w-full justify-start text-xs cursor-pointer"
              >
                <Download className="size-4 mr-2" /> Resolve Timetable Clashes
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
