import { Users, UserCog, Building2, IndianRupee, Activity, ShieldCheck } from "lucide-react";

import { ChartLegend, DonutChart, TrendAreaChart } from "@/components/dashboard/charts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import {
  ActivityWidget,
  AiInsightsWidget,
  QuickActionsWidget,
} from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/badge";
import { admissionTrend, moduleUsage } from "@/data/mock";

const systemHealth = [
  { label: "Database", status: "Healthy" },
  { label: "Server", status: "Healthy" },
  { label: "Storage", status: "72% used" },
  { label: "Last backup", status: "Today 02:00 AM" },
];

export function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Students" value="5,246" icon={Users} delta="8.5% vs last term" />
        <KpiCard label="Total Staff" value="623" icon={UserCog} delta="4.2%" tone="info" />
        <KpiCard label="Departments" value="23" icon={Building2} tone="success" />
        <KpiCard
          label="Total Revenue"
          value="Rs 12.45 Cr"
          icon={IndianRupee}
          delta="11.3%"
          tone="warning"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="System Overview"
          description="Admissions, attendance and fee collection"
          className="lg:col-span-2"
        >
          <TrendAreaChart
            data={admissionTrend}
            xKey="month"
            series={[
              { key: "admissions", label: "Admissions" },
              { key: "attendance", label: "Attendance" },
              { key: "fees", label: "Fees Collection" },
            ]}
            height={280}
          />
        </Panel>

        <Panel
          title="System Health"
          description="Platform status"
          action={
            <span className="grid size-9 place-items-center rounded-xl bg-success/10 text-success">
              <ShieldCheck className="size-4" />
            </span>
          }
        >
          <ul className="space-y-3">
            {systemHealth.map((item) => (
              <li key={item.label} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm">
                  <Activity className="size-4 text-muted-foreground" />
                  {item.label}
                </span>
                <Badge variant="secondary" className="shrink-0">
                  {item.status}
                </Badge>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Top Modules Usage" description="Share of platform activity">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <DonutChart data={moduleUsage} centerLabel="42%" />
            <ChartLegend items={moduleUsage} />
          </div>
        </Panel>
        <AiInsightsWidget />
        <ActivityWidget />
      </div>

      <QuickActionsWidget
        actions={[
          "Add institution",
          "Create user",
          "Assign privilege flag",
          "Run audit report",
          "Backup now",
        ]}
      />
    </div>
  );
}
