import { useMemo } from "react";
import { FlaskConical, Cpu, Wrench, Box, ShoppingCart, ShieldAlert, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { GroupedBarChart, DonutChart } from "@/components/dashboard/charts";
import { DeanHeader } from "./components/DeanHeader";

export function IMAView() {
  return (
    <div className="space-y-6">
      <DeanHeader
        activeDeanId="ima"
        title="IMA Infrastructure & Lab ERP Cockpit"
        subtitle="Infrastructure, Laboratories, Equipment Inventory, Asset Register, Maintenance Requests, AMC & Purchases."
        badge="IMA DEAN"
      />

      {/* TOP KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Total Laboratories" value="18 Labs" icon={FlaskConical} tone="purple" />
        <KpiCard label="Total Equipment Assets" value="1,240 Assets" icon={Cpu} tone="info" />
        <KpiCard label="Working Equipment" value="1,180 (95.1%)" icon={CheckCircle2} tone="success" />
        <KpiCard label="Under Maintenance" value="32 Assets" icon={Wrench} tone="warning" />
        <KpiCard label="Damaged / Scrapped" value="8 Units" icon={AlertTriangle} tone="destructive" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Pending Maintenance" value="12 Requests" icon={Clock} tone="warning" />
        <KpiCard label="Total Asset Register" value="₹4.82 Cr" icon={Box} tone="purple" />
        <KpiCard label="Pending Purchase Reqs" value="6 Requests" icon={ShoppingCart} tone="info" />
        <KpiCard label="Warranty Expiring Soon" value="14 Items" icon={ShieldAlert} tone="destructive" />
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Department-wise Laboratories & Equipment" description="Distribution of high-end equipment across departments.">
          <GroupedBarChart
            data={[
              { dept: "CSE Dept", labs: 6, equipment: 480 },
              { dept: "ECE Dept", labs: 4, equipment: 320 },
              { dept: "ME Dept", labs: 3, equipment: 210 },
              { dept: "EEE Dept", labs: 3, equipment: 150 },
              { dept: "Civil Dept", labs: 2, equipment: 80 },
            ] as unknown as Record<string, unknown>[]}
            xKey="dept"
            series={[
              { key: "labs", label: "Laboratories" },
              { key: "equipment", label: "Equipment Count" },
            ]}
            height={220}
          />
        </Panel>

        <Panel title="Equipment Health & Maintenance Status" description="Live status breakdown of all campus hardware assets.">
          <DonutChart
            data={[
              { category: "Fully Functional", percentage: 95.1 },
              { category: "Under Routine Servicing", percentage: 2.6 },
              { category: "Under AMC Repair", percentage: 1.7 },
              { category: "Scrapped / Disposed", percentage: 0.6 },
            ] as unknown as Record<string, unknown>[]}
            categoryKey="category"
            valueKey="percentage"
          />
        </Panel>
      </div>

      {/* RECENT MAINTENANCE & PURCHASE LEDGER */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Active Maintenance Requests" description="Urgent equipment and lab infrastructure repairs.">
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-foreground">EQ-CSE-102: Dell OptiPlex 7090 RAM Upgrade</h4>
                <p className="text-muted-foreground font-mono">Location: AI & ML Lab (Room 302) | Tech: Dell Engineers</p>
              </div>
              <Badge className="bg-amber-500/10 text-amber-600 font-mono">In Progress</Badge>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-foreground">EQ-ECE-405: Agilent Oscilloscope Calibration</h4>
                <p className="text-muted-foreground font-mono">Location: VLSI Lab (Room 204) | Tech: Agilent Tech</p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 font-mono">Completed</Badge>
            </div>
          </div>
        </Panel>

        <Panel title="Pending Purchase Orders" description="High-priority lab equipment procurement requisitions.">
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-foreground">PO-2026-801: 30x Cisco Catalyst 2960 Switches</h4>
                <p className="text-muted-foreground font-mono">Dept: Networking Lab | Vendor: Cisco India | Cost: ₹12.5 Lacs</p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 font-mono">Approved</Badge>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-foreground">PO-2026-802: 5x Epson Laser Projectors</h4>
                <p className="text-muted-foreground font-mono">Dept: Smart Seminar Halls | Vendor: Epson | Cost: ₹4.2 Lacs</p>
              </div>
              <Badge className="bg-amber-500/10 text-amber-600 font-mono">Pending Desk Approval</Badge>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
