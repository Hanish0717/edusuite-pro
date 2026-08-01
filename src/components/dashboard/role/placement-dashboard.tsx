import { useMemo } from "react";
import { toast } from "sonner";
import { Briefcase, Users, Award, TrendingUp, Plus, Download } from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { fetchPlacementStats, fetchPlacementDrives } from "@/lib/roleDashboardService";

export function PlacementDashboard() {
  const stats = useMemo(() => fetchPlacementStats(), []);
  const drives = useMemo(() => fetchPlacementDrives(), []);

  const renderIcon = (name: string) => {
    switch (name) {
      case "Briefcase":
        return Briefcase;
      case "Users":
        return Users;
      case "Award":
        return Award;
      default:
        return TrendingUp;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Placement & Career Cell Console
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Campus Drives, Recruiter Onboarding, Offer Tracking, Placement Analytics.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          PLACEMENT OFFICER
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
          <Panel title="Active Recruitment Drives">
            <div className="space-y-3">
              {drives.map((d) => (
                <div key={d.id} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{d.title}</h4>
                    <p className="text-xs text-muted-foreground">{d.meta}</p>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    {d.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Placement Actions">
            <div className="space-y-2">
              <Button
                onClick={() => toast.info("Opening recruiter invite form...")}
                className="w-full justify-start bg-brand-gradient text-xs cursor-pointer"
              >
                <Plus className="size-4 mr-2" /> Schedule Campus Drive
              </Button>
              <Button
                onClick={() => toast.success("Exporting placement summary spreadsheet...")}
                variant="outline"
                className="w-full justify-start text-xs cursor-pointer"
              >
                <Download className="size-4 mr-2" /> Export Placement Report
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
