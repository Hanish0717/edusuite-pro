import { useMemo } from "react";
import { toast } from "sonner";
import { Bus, Users, CheckCircle2, ShieldAlert, Plus, Download } from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { fetchTransportStats, fetchBusRoutes } from "@/lib/roleDashboardService";

export function TransportDashboard() {
  const stats = useMemo(() => fetchTransportStats(), []);
  const routes = useMemo(() => fetchBusRoutes(), []);

  const renderIcon = (name: string) => {
    switch (name) {
      case "Bus":
        return Bus;
      case "Users":
        return Users;
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
            Campus Transport Console
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Bus Route Optimization, Driver Shifts, Student Passes, Maintenance Logs.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          TRANSPORT OFFICER
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
          <Panel title="Active Campus Bus Routes">
            <div className="space-y-3">
              {routes.map((rt) => (
                <div key={rt.id} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{rt.title}</h4>
                    <p className="text-xs text-muted-foreground">{rt.meta}</p>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    {rt.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Transport Actions">
            <div className="space-y-2">
              <Button
                onClick={() => toast.info("Opening route builder...")}
                className="w-full justify-start bg-brand-gradient text-xs cursor-pointer"
              >
                <Plus className="size-4 mr-2" /> Add New Bus Route
              </Button>
              <Button
                onClick={() => toast.success("Exporting driver shift schedule...")}
                variant="outline"
                className="w-full justify-start text-xs cursor-pointer"
              >
                <Download className="size-4 mr-2" /> Export Fleet Schedule
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
