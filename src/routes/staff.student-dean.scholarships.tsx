import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Award, CheckCircle2, Clock, DollarSign, Download } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getStudentDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/student-dean/scholarships")({
  head: () => ({
    meta: [{ title: "Scholarships & Financial Aid — Student Dean" }],
  }),
  component: ScholarshipsPage,
});

function ScholarshipsPage() {
  const data = useMemo(() => getStudentDeanDashboardData(), []);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              FINANCIAL AID
            </Badge>
            <span className="text-xs text-muted-foreground">• Scholarship Approvals & Disbursement</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Scholarships & Freeships</h1>
          <p className="text-sm text-muted-foreground">State government fee reimbursements, merit scholarships, and SC/ST/BC welfare funds.</p>
        </div>

        <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
          <Download className="size-3.5" /> Export Audit Ledger
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Approved Amount" value={data.kpis.scholarshipsApproved} icon={Award} tone="success" />
        <KpiCard label="Approved Applications" value="1,420 Students" icon={CheckCircle2} tone="info" />
        <KpiCard label="Pending Applications" value="84 Applications" icon={Clock} tone="warning" />
        <KpiCard label="Govt Reimbursement" value="₹1.45 Cr" icon={DollarSign} tone="purple" />
      </div>

      <Panel title="Scholarship Applications Ledger" description="Filter by Category: Government, Merit, Minority, SC/ST, BC, EWS.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search student or scholarship scheme..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9 w-[160px] text-xs">
                <SelectValue placeholder="Category Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schemes</SelectItem>
                <SelectItem value="BC">BC Welfare</SelectItem>
                <SelectItem value="SC/ST">SC/ST Fund</SelectItem>
                <SelectItem value="Merit">Merit Scholarship</SelectItem>
                <SelectItem value="EWS">EWS Scheme</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Application Ref</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Scholarship Scheme</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-center">Sanctioned Amount</th>
                  <th className="p-3 font-mono">Applied Date</th>
                  <th className="p-3 text-center">Approval Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {data.scholarships
                  .filter((s) => (categoryFilter === "all" || s.category === categoryFilter) && (s.student.toLowerCase().includes(search.toLowerCase()) || s.scheme.toLowerCase().includes(search.toLowerCase())))
                  .map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-primary">{s.id}</td>
                      <td className="p-3 font-bold text-foreground">{s.student}</td>
                      <td className="p-3 font-bold">{s.scheme}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="font-mono text-[0.65rem]">{s.category}</Badge>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-emerald-600">{s.amount}</td>
                      <td className="p-3 font-mono text-muted-foreground">{s.appliedDate}</td>
                      <td className="p-3 text-center">
                        <Badge className={s["status"] === "Approved" ? "bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]" : "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]"}>
                          {s["status"]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  );
}
