import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, BedDouble, Users, ShieldCheck, Wrench, Home } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getStudentDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/student-dean/hostel")({
  head: () => ({
    meta: [{ title: "Hostel & Mess Management — Student Dean" }],
  }),
  component: HostelManagementPage,
});

function HostelManagementPage() {
  const data = useMemo(() => getStudentDeanDashboardData(), []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              CAMPUS LIFE
            </Badge>
            <span className="text-xs text-muted-foreground">• Residence & Mess Management</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Hostel Management</h1>
          <p className="text-sm text-muted-foreground">Boys & Girls hostel occupancy, wardens roster, room allocations, and maintenance complaints.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Hostel Residents" value={data.kpis.hostelStudents.toLocaleString()} icon={BedDouble} tone="info" />
        <KpiCard label="Boys Hostel Block" value={data.kpis.boysHostel.toLocaleString()} icon={Users} tone="success" />
        <KpiCard label="Girls Hostel Block" value={data.kpis.girlsHostel.toLocaleString()} icon={Users} tone="purple" />
        <KpiCard label="Vacant Rooms" value={data.kpis.vacantHostelRooms.toString()} icon={Home} tone="warning" />
      </div>

      <Panel title="Hostel Blocks & Chief Wardens Roster" description="Master campus residential blocks.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 border border-border rounded-xl bg-card space-y-2">
            <h4 className="font-bold text-sm text-foreground">Boys Hostel Block A</h4>
            <p className="text-xs text-muted-foreground">Chief Warden: Col. R. S. Rathore</p>
            <div className="flex items-center justify-between text-xs font-mono">
              <span>Occupancy: 600 / 620</span>
              <Badge className="bg-emerald-500/10 text-emerald-600">96.7% Full</Badge>
            </div>
          </div>

          <div className="p-4 border border-border rounded-xl bg-card space-y-2">
            <h4 className="font-bold text-sm text-foreground">Boys Hostel Block B</h4>
            <p className="text-xs text-muted-foreground">Warden: Dr. M. N. Swamy</p>
            <div className="flex items-center justify-between text-xs font-mono">
              <span>Occupancy: 500 / 525</span>
              <Badge className="bg-emerald-500/10 text-emerald-600">95.2% Full</Badge>
            </div>
          </div>

          <div className="p-4 border border-border rounded-xl bg-card space-y-2">
            <h4 className="font-bold text-sm text-foreground">Girls Hostel Block C</h4>
            <p className="text-xs text-muted-foreground">Chief Warden: Mrs. G. Sujatha</p>
            <div className="flex items-center justify-between text-xs font-mono">
              <span>Occupancy: 750 / 780</span>
              <Badge className="bg-emerald-500/10 text-emerald-600">96.1% Full</Badge>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Hostel Maintenance & Mess Complaints" description="Live complaints log & warden resolutions.">
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Complaint Ref</th>
                <th className="p-3">Hostel Block</th>
                <th className="p-3">Issue Category</th>
                <th className="p-3">Assigned Warden</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {data.hostelComplaints.map((h) => (
                <tr key={h.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono font-bold text-primary">{h.id}</td>
                  <td className="p-3 font-bold text-foreground">{h.hostelBlock}</td>
                  <td className="p-3 font-bold">{h.issue}</td>
                  <td className="p-3 font-mono text-muted-foreground">{h.warden}</td>
                  <td className="p-3 text-center">
                    <Badge className={h.status === "Resolved" ? "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]" : "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]"}>
                      {h.status}
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
