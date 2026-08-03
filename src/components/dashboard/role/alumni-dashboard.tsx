import { useMemo } from "react";
import { toast } from "sonner";
import { Globe, Users, Award, Calendar, Plus } from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { fetchAlumniStats, fetchAlumniEvents } from "@/lib/roleDashboardService";

export function AlumniDashboard() {
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
            Alumni Portal
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Alumni Network, Batch Reunions, Student Mentorship, Campus Visits.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          ALUMNI PERSONA
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
          <Panel title="Alumni Member Actions">
            <div className="space-y-2">
              <Button
                onClick={() => toast.success("Enrolled as Student Mentor for 2026 Batch!")}
                className="w-full justify-start bg-brand-gradient text-xs cursor-pointer"
              >
                <Plus className="size-4 mr-2" /> Offer Student Mentorship
              </Button>
              <Button
                onClick={() => toast.info("Opening campus pass request form...")}
                variant="outline"
                className="w-full justify-start text-xs cursor-pointer"
              >
                <Globe className="size-4 mr-2" /> Request Campus Visit Pass
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
