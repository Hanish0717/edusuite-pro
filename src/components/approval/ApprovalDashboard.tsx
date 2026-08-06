import { useMemo } from "react";
import {
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Users,
  Activity,
  XCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { WorkflowItem, DelegationRecord } from "@/types/approval";
import { getSlaStatus } from "@/lib/workflowService";

interface ApprovalDashboardProps {
  workflows: WorkflowItem[];
  delegations: DelegationRecord[];
}

export function ApprovalDashboard({ workflows, delegations }: ApprovalDashboardProps) {
  // KPI Metrics Calculation
  const metrics = useMemo(() => {
    const pending = workflows.filter((w) => w.status === "Pending" || w.status === "Escalated");
    const escalated = workflows.filter((w) => w.isEscalated || w.status === "Escalated");
    const critical = workflows.filter((w) => w.riskLevel === "Critical" && w.status !== "Completed");
    const completed = workflows.filter((w) => w.status === "Completed");
    const rejected = workflows.filter((w) => w.status === "Rejected");
    const activeDelegations = delegations.filter((d) => d.status === "Active");

    const slaGreenCount = pending.filter((w) => getSlaStatus(w).status === "Green").length;
    const slaPercent = pending.length > 0 ? Math.round((slaGreenCount / pending.length) * 100) : 100;

    return {
      pendingCount: pending.length,
      escalatedCount: escalated.length,
      criticalCount: critical.length,
      completedCount: completed.length,
      rejectedCount: rejected.length,
      activeDelegationCount: activeDelegations.length,
      avgApprovalHours: 14.2,
      slaPercent,
    };
  }, [workflows, delegations]);

  // Chart Data Preparation
  const trendData = [
    { day: "Mon", Submitted: 12, Approved: 10, Escalated: 1 },
    { day: "Tue", Submitted: 18, Approved: 15, Escalated: 2 },
    { day: "Wed", Submitted: 24, Approved: 21, Escalated: 3 },
    { day: "Thu", Submitted: 15, Approved: 14, Escalated: 1 },
    { day: "Fri", Submitted: 30, Approved: 25, Escalated: 4 },
    { day: "Sat", Submitted: 9, Approved: 8, Escalated: 0 },
  ];

  const deptPerformanceData = [
    { dept: "Computer Science", Pending: 8, SLACompliance: 92 },
    { dept: "Electronics & Comm", Pending: 5, SLACompliance: 84 },
    { dept: "Exam Cell", Pending: 3, SLACompliance: 96 },
    { dept: "Finance Dept", Pending: 6, SLACompliance: 78 },
    { dept: "AI & Data Science", Pending: 4, SLACompliance: 88 },
  ];

  const riskPieData = useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    workflows.forEach((w) => {
      counts[w.riskLevel] = (counts[w.riskLevel] || 0) + 1;
    });
    return [
      { name: "Low Risk", value: counts.Low, color: "#10B981" },
      { name: "Medium Risk", value: counts.Medium, color: "#F59E0B" },
      { name: "High Risk", value: counts.High, color: "#F97316" },
      { name: "Critical Severity", value: counts.Critical, color: "#EF4444" },
    ];
  }, [workflows]);

  return (
    <div className="space-y-6">
      {/* KPI METRICS GRID */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Workflows</span>
            <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Clock className="size-5" />
            </span>
          </div>
          <p className="font-display text-2xl font-extrabold text-foreground">{metrics.pendingCount}</p>
          <span className="text-[0.72rem] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 mt-1">
            <Activity className="size-3" /> Active Operational Queue
          </span>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Escalated Requests</span>
            <span className="grid size-9 place-items-center rounded-xl bg-amber-500/20">
              <AlertTriangle className="size-5" />
            </span>
          </div>
          <p className="font-display text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {metrics.escalatedCount}
          </p>
          <span className="text-[0.72rem] text-amber-600/80 font-mono block mt-1">
            SLA Timeouts Exceeded
          </span>
        </div>

        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-destructive mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical Severity</span>
            <span className="grid size-9 place-items-center rounded-xl bg-destructive/20">
              <ShieldAlert className="size-5" />
            </span>
          </div>
          <p className="font-display text-2xl font-extrabold text-destructive">{metrics.criticalCount}</p>
          <span className="text-[0.72rem] text-destructive/80 font-mono block mt-1">
            Requires Executive Review
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Approval SLA Rate</span>
            <span className="grid size-9 place-items-center rounded-xl bg-emerald-500/20">
              <CheckCircle2 className="size-5" />
            </span>
          </div>
          <p className="font-display text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {metrics.slaPercent}%
          </p>
          <span className="text-[0.72rem] text-emerald-600/80 font-mono block mt-1">
            Target SLA Benchmark: 90%
          </span>
        </div>
      </div>

      {/* SECONDARY STAT STRIP */}
      <div className="grid gap-4 sm:grid-cols-4 bg-muted/20 border border-border/80 rounded-2xl p-3.5 text-xs">
        <div className="flex items-center gap-3 px-2">
          <div className="grid size-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="size-4" />
          </div>
          <div>
            <span className="text-muted-foreground block text-[0.7rem]">Completed Today</span>
            <strong className="text-sm font-extrabold">{metrics.completedCount} Workflows</strong>
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 border-l border-border/60">
          <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Clock className="size-4" />
          </div>
          <div>
            <span className="text-muted-foreground block text-[0.7rem]">Avg Processing Time</span>
            <strong className="text-sm font-extrabold">{metrics.avgApprovalHours} Hours</strong>
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 border-l border-border/60">
          <div className="grid size-8 place-items-center rounded-lg bg-indigo-500/10 text-indigo-600">
            <Users className="size-4" />
          </div>
          <div>
            <span className="text-muted-foreground block text-[0.7rem]">Active Delegations</span>
            <strong className="text-sm font-extrabold">{metrics.activeDelegationCount} Delegates</strong>
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 border-l border-border/60">
          <div className="grid size-8 place-items-center rounded-lg bg-rose-500/10 text-rose-600">
            <XCircle className="size-4" />
          </div>
          <div>
            <span className="text-muted-foreground block text-[0.7rem]">Rejected Workflows</span>
            <strong className="text-sm font-extrabold">{metrics.rejectedCount} Rejected</strong>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* CHART 1: APPROVAL TRENDS & VELOCITY */}
        <Panel
          title="Approval Velocity & Submissions"
          description="Daily workflow submission vs completion velocity across departments"
          action={<Badge variant="outline" className="font-mono text-xs">Real-time Stream</Badge>}
        >
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(var(--card))",
                    borderColor: "oklch(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="Submitted" fill="#4D78FF" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Approved" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Escalated" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* CHART 2: RISK LEVEL SEVERITY DISTRIBUTION */}
        <Panel
          title="Risk Classification Breakdown"
          description="Distribution of workflows by operational risk severity tier"
          action={<Badge variant="outline" className="font-mono text-xs">Risk Matrix</Badge>}
        >
          <div className="h-64 w-full flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(var(--card))",
                    borderColor: "oklch(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2 pr-4 text-xs font-medium">
              {riskPieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}:</span>
                  <strong className="text-foreground font-mono">{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* DEPARTMENT SLA COMPLIANCE HORIZONTAL TABLE */}
      <Panel
        title="Departmental Approval SLA Compliance"
        description="Monitoring response times and active queues per academic and administrative department"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground font-mono uppercase text-[0.68rem] tracking-wider">
                <th className="py-2.5 px-3">Department Name</th>
                <th className="py-2.5 px-3">Active Pending</th>
                <th className="py-2.5 px-3">SLA Compliance %</th>
                <th className="py-2.5 px-3 text-right">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {deptPerformanceData.map((d) => (
                <tr key={d.dept} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-foreground">{d.dept}</td>
                  <td className="py-3 px-3 font-mono">{d.Pending} Workflows</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden max-w-[140px]">
                        <div
                          className={`h-full rounded-full transition-all ${
                            d.SLACompliance >= 90
                              ? "bg-emerald-500"
                              : d.SLACompliance >= 80
                              ? "bg-amber-500"
                              : "bg-destructive"
                          }`}
                          style={{ width: `${d.SLACompliance}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold">{d.SLACompliance}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Badge
                      className={
                        d.SLACompliance >= 90
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      }
                    >
                      {d.SLACompliance >= 90 ? "OPTIMAL" : "ATTENTION"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
