import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ShieldCheck, CheckCircle2, Building2, Users } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getResearchDevelopmentDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/research-development/assign-substitute")({
  head: () => ({
    meta: [{ title: "Assign Substitute Faculty — EduSuite Pro" }],
  }),
  component: PageComponent,
});

function PageComponent() {
  const data = useMemo(() => getResearchDevelopmentDashboardData(), []);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assign Substitute Faculty</h1>
        <p className="text-sm text-muted-foreground">Reassign class slots to substitute faculty.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Module Records" value="Verified" icon={Building2} tone="info" />
        <KpiCard label="Compliance Status" value="100% Valid" icon={ShieldCheck} tone="success" />
        <KpiCard label="Active Audit" value="2026-27" icon={CheckCircle2} tone="purple" />
        <KpiCard label="Status" value="Active" icon={Users} tone="warning" />
      </div>

      <Panel title="Assign Substitute Faculty Register" description="Real-time management ledger.">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search directory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          
          <div className="p-4 border border-border rounded-xl bg-card space-y-3">
            <h4 className="font-bold text-sm text-foreground">Verified Module Register</h4>
            <p className="text-xs text-muted-foreground">All records for this module are active and synchronized with the ERP backend.</p>
            <div className="flex gap-2 font-mono text-xs">
              <Badge className="bg-emerald-500/10 text-emerald-600">Active Status</Badge>
              <Badge variant="outline">ERP Synchronized</Badge>
            </div>
          </div>

        </div>
      </Panel>
    </div>
  );
}
