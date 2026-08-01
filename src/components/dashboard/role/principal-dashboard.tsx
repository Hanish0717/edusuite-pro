import {
  Award,
  Building2,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  BarChart3,
  ShieldCheck,
  GitBranch,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PrincipalDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Principal Executive Cockpit
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Executive Oversight, Institutional Analytics, Dept Performance & Final Approvals.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          PRINCIPAL
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="NAAC Audit Score" value="3.72 / 4.0" icon={Award} tone="success" />
        <KpiCard label="Overall Pass %" value="94.6%" icon={TrendingUp} />
        <KpiCard label="Pending Executive Approvals" value="4 Tickets" icon={GitBranch} tone="warning" />
        <KpiCard label="Faculty Strength" value="623 Members" icon={Building2} tone="info" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel
            title="Departmental Performance Scorecards"
            description="Institutional overview of pass percentage, attendance compliance, and research output."
          >
            <div className="space-y-3">
              {[
                { name: "Computer Science (CSE)", pass: "96.8%", attendance: "91.2%", budget: "On Track" },
                { name: "Electronics & Comm (ECE)", pass: "94.2%", attendance: "89.5%", budget: "On Track" },
                { name: "Mechanical Eng (ME)", pass: "92.0%", attendance: "87.8%", budget: "Under Review" },
                { name: "Electrical Eng (EEE)", pass: "93.5%", attendance: "88.9%", budget: "On Track" },
              ].map((dept) => (
                <div key={dept.name} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{dept.name}</h4>
                    <p className="text-xs text-muted-foreground">Attendance: {dept.attendance} | Pass Rate: {dept.pass}</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono">
                    {dept.budget}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Executive Sign-offs">
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-border/70 bg-card">
                <p className="text-xs font-bold font-mono text-amber-600">PURCHASE REQUISITION</p>
                <p className="text-sm font-semibold mt-1">IoT Lab Robotics Kits (Rs 2.45L)</p>
                <p className="text-xs text-muted-foreground mt-0.5">Approved by Inventory & Finance.</p>
                <Button size="sm" className="mt-3 w-full bg-brand-gradient text-xs cursor-pointer">
                  Approve Purchase Order
                </Button>
              </div>

              <div className="p-3.5 rounded-xl border border-border/70 bg-card">
                <p className="text-xs font-bold font-mono text-purple-600">RESULT DECLARATION</p>
                <p className="text-sm font-semibold mt-1">B.Tech Sem 6 Result Gazette</p>
                <p className="text-xs text-muted-foreground mt-0.5">Moderated by Exam Controller.</p>
                <Button size="sm" className="mt-3 w-full bg-brand-gradient text-xs cursor-pointer">
                  Authorize & Publish
                </Button>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
