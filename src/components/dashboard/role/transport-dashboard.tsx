import {
  Bus,
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function TransportDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Transport & Fleet Management Console
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Fleet & Logistics, Bus Routes, Drivers Roster, Student Passes, Maintenance Logs.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          TRANSPORT MANAGER
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active Buses" value="32 Vehicles" icon={Bus} tone="success" />
        <KpiCard label="Bus Passes Issued" value="1,840 Students" icon={Users} tone="info" />
        <KpiCard label="Routes Operational" value="16 City Routes" icon={CheckCircle2} />
        <KpiCard label="Vehicles in Maintenance" value="2 Buses" icon={Clock} tone="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Campus Bus Route Status">
            <div className="space-y-3">
              {[
                { route: "Route 01 — LB Nagar via Koti & Abids", bus: "KA-01-EQ-4021", driver: "K. Mohan Rao", occupancy: "54 / 60 Seats", status: "On Time" },
                { route: "Route 04 — Kukatpally via Hitech City", bus: "KA-01-EQ-4025", driver: "M. Narsing", occupancy: "58 / 60 Seats", status: "On Time" },
                { route: "Route 08 — Secunderabad Station", bus: "KA-01-EQ-4029", driver: "G. Appa Rao", occupancy: "60 / 60 Seats", status: "Full" },
              ].map((r) => (
                <div key={r.route} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{r.route}</h4>
                    <p className="text-xs text-muted-foreground">Bus: {r.bus} | Driver: {r.driver} | {r.occupancy}</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono">
                    {r.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Logistics Actions">
            <div className="space-y-2">
              <Button className="w-full justify-start bg-brand-gradient text-xs cursor-pointer">
                <Plus className="size-4 mr-2" /> Issue Student Bus Pass
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs cursor-pointer">
                <Bus className="size-4 mr-2" /> Log Maintenance / Service
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
