import { useMemo } from "react";
import { BadgeCheck, ShieldCheck, FileText, ClipboardCheck, Activity, Award, CheckCircle2, Clock, Bell } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { GroupedBarChart, DonutChart } from "@/components/dashboard/charts";
import { DeanHeader } from "./components/DeanHeader";
import { getIqacDashboardData } from "@/lib/deansService";

export function IQACView() {
  const data = useMemo(() => getIqacDashboardData(), []);

  return (
    <div className="space-y-6">
      <DeanHeader
        activeDeanId="iqac"
        title="IQAC Dean Cockpit"
        subtitle="Internal Quality Assurance Cell (IQAC): NAAC A++ (3.78 CGPA) Accreditation, NBA Tier-1 Audits, AQAR Filings & Academic Audits."
        badge="IQAC DEAN"
      />

      {/* OVERALL IQAC KPIS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="NAAC Grade Score" value={data.kpis.naacScore} icon={BadgeCheck} tone="purple" />
        <KpiCard label="NBA Accredited Depts" value={data.kpis.nbaAccreditedDepts} icon={ShieldCheck} tone="success" />
        <KpiCard label="AQAR Filing Status" value={data.kpis.aqarStatus} icon={FileText} tone="info" />
        <KpiCard label="Compliance Pct" value="98.5%" icon={CheckCircle2} tone="success" />
        <KpiCard label="Pending Audits" value="2 Audits" icon={Clock} tone="warning" />
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="NAAC Seven Criteria Scores" description="Points scored out of maximum weightage.">
          <GroupedBarChart
            data={[
              { criterion: "C1: Curricular", score: 142 },
              { criterion: "C2: Teaching", score: 338 },
              { criterion: "C3: Research", score: 140 },
              { criterion: "C4: Infra", score: 95 },
              { criterion: "C5: Student Support", score: 92 },
              { criterion: "C6: Governance", score: 96 },
              { criterion: "C7: Innovations", score: 95 },
            ] as unknown as Record<string, unknown>[]}
            xKey="criterion"
            series={[{ key: "score", label: "Scored Points" }]}
            height={220}
          />
        </Panel>

        <Panel title="Quality Audit Compliance" description="Audit pass rate across departments.">
          <DonutChart
            data={[
              { category: "Compliant & Verified", percentage: 88 },
              { category: "Under Minor Revision", percentage: 9 },
              { category: "Audit Pending", percentage: 3 },
            ] as unknown as Record<string, unknown>[]}
            categoryKey="category"
            valueKey="percentage"
          />
        </Panel>
      </div>

      {/* NAAC SEVEN CRITERIA SCORECARD TABLE */}
      <Panel title="NAAC Seven Criteria Scorecard" description="Real-time audit performance across NAAC Quality Criteria.">
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Criterion ID</th>
                <th className="p-3">Criterion Description</th>
                <th className="p-3 text-center">Max Weightage</th>
                <th className="p-3 text-center">Current Score</th>
                <th className="p-3 text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {data.naacCriteria.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono font-bold text-primary">{c.id}</td>
                  <td className="p-3 font-bold text-foreground">{c.criterion}</td>
                  <td className="p-3 text-center font-mono">{c.weightage} Pts</td>
                  <td className="p-3 text-center font-mono font-bold text-emerald-600">{c.score} Pts</td>
                  <td className="p-3 text-center">
                    <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{c.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* RECENT ACTIVITIES & NOTIFICATIONS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Recent Quality Audit Activity" description="Live audit logs and department inspections.">
          <div className="space-y-3">
            {data.qualityAudits.map((a) => (
              <div key={a.id} className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-foreground">{a.id} - {a.dept} ({a.type})</h4>
                  <p className="text-muted-foreground font-mono">Date: {a.date} | Lead Auditor: Dr. External Audit</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 font-mono">{a.score}</Badge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="IQAC Broadcast Notifications" description="Institutional quality alerts and audit reminders.">
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-primary" />
                <div>
                  <h4 className="font-bold text-foreground">NAAC Mock Peer Team Visit</h4>
                  <p className="text-muted-foreground font-mono">Scheduled for August 18, 2026</p>
                </div>
              </div>
              <Badge variant="outline" className="font-mono">High Priority</Badge>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <div>
                  <h4 className="font-bold text-foreground">AQAR 2025-26 Desk Clearance</h4>
                  <p className="text-muted-foreground font-mono">Approved by Academic Council</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 font-mono">Verified</Badge>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
