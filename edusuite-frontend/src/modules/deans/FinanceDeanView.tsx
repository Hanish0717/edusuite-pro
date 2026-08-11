import { useMemo } from "react";
import { Wallet, CreditCard, TrendingUp, ShieldCheck, DollarSign, Clock, Receipt, UserCheck, CheckCircle2, Building2 } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { GroupedBarChart, DonutChart } from "@/components/dashboard/charts";
import { DeanHeader } from "./components/DeanHeader";

export function FinanceDeanView() {
  return (
    <div className="space-y-6">
      <DeanHeader
        activeDeanId="finance-dean"
        title="Finance Dean Cockpit"
        subtitle="Institutional Budget Allocation, Fee Collection Ledgers, Payroll Processing, Expenditure & Statutory Financial Audits."
        badge="FINANCE DEAN"
      />

      {/* TOP KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Total Annual Budget" value="₹48.5 Cr" icon={Wallet} tone="purple" />
        <KpiCard label="Budget Utilized" value="₹36.2 Cr (74.6%)" icon={TrendingUp} tone="success" />
        <KpiCard label="Remaining Budget" value="₹12.3 Cr" icon={DollarSign} tone="info" />
        <KpiCard label="Fee Collection Today" value="₹42.5 Lacs" icon={CreditCard} tone="success" />
        <KpiCard label="Total Fee Collected" value="₹23.1 Cr" icon={CreditCard} tone="purple" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Pending Fee Dues" value="₹90.0 Lacs" icon={Clock} tone="warning" />
        <KpiCard label="Monthly Expenses" value="₹2.85 Cr" icon={Receipt} tone="info" />
        <KpiCard label="Vendor Payments Due" value="₹18.4 Lacs" icon={Building2} tone="warning" />
        <KpiCard label="Payroll Processed" value="100% Disbursed" icon={UserCheck} tone="success" />
        <KpiCard label="Audit Clearance" value="Clean Pass (A++)" icon={ShieldCheck} tone="purple" />
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Department-wise Budget Allocation vs Expenditure" description="Allocated annual budget vs actual spent across academic departments.">
          <GroupedBarChart
            data={[
              { dept: "CSE Dept", allocated: 8.5, spent: 7.2 },
              { dept: "ECE Dept", allocated: 6.8, spent: 5.4 },
              { dept: "ME Dept", allocated: 5.2, spent: 4.1 },
              { dept: "EEE Dept", allocated: 4.5, spent: 3.6 },
              { dept: "Civil Dept", allocated: 3.8, spent: 2.9 },
              { dept: "MBA Dept", allocated: 3.2, spent: 2.6 },
              { dept: "AI & DS Dept", allocated: 4.8, spent: 3.9 },
            ] as unknown as Record<string, unknown>[]}
            xKey="dept"
            series={[
              { key: "allocated", label: "Allocated Budget (₹ Cr)" },
              { key: "spent", label: "Spent Budget (₹ Cr)" },
            ]}
            height={220}
          />
        </Panel>

        <Panel title="Institutional Expenditure Breakdown" description="Category-wise expenditure allocation for FY 2025-26.">
          <DonutChart
            data={[
              { category: "Faculty & Staff Payroll", percentage: 58.5 },
              { category: "Lab Hardware & Infrastructure", percentage: 18.2 },
              { category: "Campus Utilities & Maintenance", percentage: 12.3 },
              { category: "Research & Library Subscriptions", percentage: 7.0 },
              { category: "Student Welfare & Scholarships", percentage: 4.0 },
            ] as unknown as Record<string, unknown>[]}
            categoryKey="category"
            valueKey="percentage"
          />
        </Panel>
      </div>

      {/* DEPARTMENTAL BUDGET & EXPENSE LEDGER */}
      <Panel title="Departmental Budget Utilization Ledger" description="Master department budget allocations, disbursements, and auditor verification status.">
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Department</th>
                <th className="p-3 font-mono">Allocated Budget</th>
                <th className="p-3 font-mono">Utilized Amount</th>
                <th className="p-3 font-mono">Remaining Balance</th>
                <th className="p-3 text-center">Utilization Rate</th>
                <th className="p-3 text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-bold text-foreground">Computer Science Engineering (CSE)</td>
                <td className="p-3 font-mono font-bold">₹8.50 Cr</td>
                <td className="p-3 font-mono font-bold text-emerald-600">₹7.20 Cr</td>
                <td className="p-3 font-mono font-bold text-primary">₹1.30 Cr</td>
                <td className="p-3 text-center font-mono font-bold">84.7%</td>
                <td className="p-3 text-center">
                  <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">Verified</Badge>
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-bold text-foreground">Electronics & Communication (ECE)</td>
                <td className="p-3 font-mono font-bold">₹6.80 Cr</td>
                <td className="p-3 font-mono font-bold text-emerald-600">₹5.40 Cr</td>
                <td className="p-3 font-mono font-bold text-primary">₹1.40 Cr</td>
                <td className="p-3 text-center font-mono font-bold">79.4%</td>
                <td className="p-3 text-center">
                  <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">Verified</Badge>
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-bold text-foreground">Artificial Intelligence & Data Science (AI & DS)</td>
                <td className="p-3 font-mono font-bold">₹4.80 Cr</td>
                <td className="p-3 font-mono font-bold text-emerald-600">₹3.90 Cr</td>
                <td className="p-3 font-mono font-bold text-primary">₹90.0 Lacs</td>
                <td className="p-3 text-center font-mono font-bold">81.25%</td>
                <td className="p-3 text-center">
                  <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">Verified</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
