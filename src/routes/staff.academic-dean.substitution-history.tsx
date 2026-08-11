import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { History, UserCheck, CheckCircle2 } from "lucide-react";

import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { getAcademicDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/academic-dean/substitution-history")({
  head: () => ({
    meta: [{ title: "Substitution History — Academic Dean" }],
  }),
  component: SubstitutionHistoryPage,
});

function SubstitutionHistoryPage() {
  const data = useMemo(() => getAcademicDeanDashboardData(), []);

  const historyLogs = useMemo(() => {
    return Array.from({ length: 12 }).map((_, idx) => {
      const orig = data.facultyList[idx % data.facultyList.length];
      const sub = data.facultyList[(idx + 3) % data.facultyList.length];
      return {
        id: `SUB-${20260800 + idx + 1}`,
        originalFaculty: orig?.name,
        substituteFaculty: sub?.name,
        date: `2026-08-${10 + (idx % 10)}`,
        period: `Period ${(idx % 5) + 1}`,
        subject: `CS${501 + (idx % 8)} - Subject Name ${idx + 1}`,
        reason: idx % 3 === 0 ? "Academic Conference" : idx % 2 === 0 ? "Medical Emergency" : "Institutional Duty",
        status: "Approved",
      };
    });
  }, [data.facultyList]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Faculty Substitution History</h1>
        <p className="text-sm text-muted-foreground">
          Audit ledger of past authorized faculty teaching substitution assignments.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Total Substitutions" value={String(historyLogs.length)} icon={History} tone="info" />
        <KpiCard label="Approved & Conducted" value="100%" icon={CheckCircle2} tone="success" />
        <KpiCard label="Faculty Impacted" value="18 Members" icon={UserCheck} tone="purple" />
      </div>

      <Panel title="Substitution Audit Trail" description="History table displaying Original Faculty, Substitute Faculty, Date, Period, Subject, Reason, and Status.">
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Ref ID</th>
                <th className="p-3">Original Faculty</th>
                <th className="p-3">Substitute Faculty</th>
                <th className="p-3 font-mono">Date</th>
                <th className="p-3 font-mono">Period</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Reason</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {historyLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono font-bold text-primary">{log.id}</td>
                  <td className="p-3 font-bold text-foreground">{log.originalFaculty}</td>
                  <td className="p-3 font-bold text-emerald-600">{log.substituteFaculty}</td>
                  <td className="p-3 font-mono text-muted-foreground">{log.date}</td>
                  <td className="p-3 font-mono">{log.period}</td>
                  <td className="p-3 font-medium">{log["subject"]}</td>
                  <td className="p-3 text-muted-foreground">{log.reason}</td>
                  <td className="p-3 text-center">
                    <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{log["status"]}</Badge>
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
