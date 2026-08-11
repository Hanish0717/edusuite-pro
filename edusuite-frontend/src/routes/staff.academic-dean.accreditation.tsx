import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { ShieldCheck, Award, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAcademicDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/academic-dean/accreditation")({
  head: () => ({
    meta: [{ title: "Accreditation — Academic Dean" }],
  }),
  component: AccreditationPage,
});

function AccreditationPage() {
  const data = useMemo(() => getAcademicDeanDashboardData(), []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Academic Accreditation & Quality Compliance</h1>
        <p className="text-sm text-muted-foreground">
          NAAC A++ status, NBA Tier-1 department certifications, and OBE attainment audits.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="NAAC Grade" value="Grade A++ (3.78 CGPA)" icon={Award} tone="purple" />
        <KpiCard label="NBA Accredited Depts" value="12 / 15 Depts" icon={ShieldCheck} tone="success" />
        <KpiCard label="OBE Attainment" value="89.2% Target" icon={CheckCircle2} tone="info" />
        <KpiCard label="AQAR Compliance" value="100% Complete" icon={FileSpreadsheet} tone="warning" />
      </div>

      <Panel title="Departmental Accreditation Status Ledger" description="Accreditation status, validity, and Tier ratings per department.">
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Dept Code</th>
                <th className="p-3">Department Name</th>
                <th className="p-3">HOD</th>
                <th className="p-3">Accreditation Body</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {data.departments.map((d) => (
                <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono font-bold text-primary">{d.code}</td>
                  <td className="p-3 font-bold text-foreground">{d.name}</td>
                  <td className="p-3 text-muted-foreground">{d.hod}</td>
                  <td className="p-3 font-mono">{d.accreditation}</td>
                  <td className="p-3">
                    <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">
                      {d.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success(`Viewing SAR Report for ${d.name}`)}
                      className="text-xs cursor-pointer"
                    >
                      View SAR Document
                    </Button>
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
