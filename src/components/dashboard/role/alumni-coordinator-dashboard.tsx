import { useMemo } from "react";
import { toast } from "sonner";
import { Globe, Users, Award, Calendar, Plus, Download } from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { fetchAlumniStats, fetchAlumniEvents } from "@/lib/roleDashboardService";

export function AlumniCoordinatorDashboard() {
  const stats = useMemo(() => fetchAlumniStats(), []);
  const events = useMemo(() => fetchAlumniEvents(), []);

  const renderIcon = (name: string) => {
    switch (name) {
      case "Globe":
        return Globe;
      case "Users":
        return Users;
      case "Award":
        return Award;
      default:
        return Calendar;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Alumni Relations Console
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Alumni Network Roster, Reunions, Endowment Contributions, Mentorship.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          ALUMNI COORDINATOR
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
          <Panel title="Upcoming Alumni Meetups & Events">
            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{ev.title}</h4>
                    <p className="text-xs text-muted-foreground">{ev.meta}</p>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    {ev.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Alumni Actions">
            <div className="space-y-2">
              <Button
                onClick={() => toast.info("Opening event planner...")}
                className="w-full justify-start bg-brand-gradient text-xs cursor-pointer"
              >
                <Plus className="size-4 mr-2" /> Organize Alumni Meetup
              </Button>
              <Button
                onClick={() => toast.success("Exporting alumni roster...")}
                variant="outline"
                className="w-full justify-start text-xs cursor-pointer"
              >
                <Download className="size-4 mr-2" /> Export Network Roster
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
