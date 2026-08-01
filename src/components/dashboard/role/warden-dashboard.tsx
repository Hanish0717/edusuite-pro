import { useMemo } from "react";
import { toast } from "sonner";
import { BedDouble, CalendarCheck, ShieldAlert, CheckCircle2, Plus, Download } from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { fetchWardenStats, fetchHostelOccupancy } from "@/lib/roleDashboardService";

export function WardenDashboard() {
  const stats = useMemo(() => fetchWardenStats(), []);
  const blocks = useMemo(() => fetchHostelOccupancy(), []);

  const renderIcon = (name: string) => {
    switch (name) {
      case "BedDouble":
        return BedDouble;
      case "CalendarCheck":
        return CalendarCheck;
      case "ShieldAlert":
        return ShieldAlert;
      default:
        return CheckCircle2;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Hostel Warden Console
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Room Allocations, Out-Pass Approvals, Mess Inspection, Discipline Logs.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          HOSTEL WARDEN
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
          <Panel title="Hostel Blocks & Room Occupancy">
            <div className="space-y-3">
              {blocks.map((b) => (
                <div key={b.id} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{b.title}</h4>
                    <p className="text-xs text-muted-foreground">{b.meta}</p>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    {b.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Warden Quick Actions">
            <div className="space-y-2">
              <Button
                onClick={() => toast.info("Opening room allocation panel...")}
                className="w-full justify-start bg-brand-gradient text-xs cursor-pointer"
              >
                <Plus className="size-4 mr-2" /> Allocate Student Room
              </Button>
              <Button
                onClick={() => toast.success("Exporting active leave passes...")}
                variant="outline"
                className="w-full justify-start text-xs cursor-pointer"
              >
                <Download className="size-4 mr-2" /> Export Out-Pass Summary
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
