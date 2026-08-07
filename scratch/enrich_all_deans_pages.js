import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');

function generateRichPageCode(routePath, title, description, serviceFunc, categoryName, columns, tableDataJS) {
  return `import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Users,
  Bell,
  Clock,
  Activity,
  FileSpreadsheet,
  BarChart3,
} from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GroupedBarChart, TrendLineChart } from "@/components/dashboard/charts";
import { ${serviceFunc} } from "@/lib/deansService";

export const Route = createFileRoute("${routePath}")({
  head: () => ({
    meta: [{ title: "${title} — EduSuite Pro" }],
  }),
  component: SubPageComponent,
});

function SubPageComponent() {
  const data = useMemo(() => ${serviceFunc}(), []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const rawItems = useMemo(() => {
    ${tableDataJS}
  }, [data]);

  const filteredItems = useMemo(() => {
    return rawItems.filter((item) => {
      const matchSearch = Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      );
      const matchStatus =
        statusFilter === "all" ||
        (item.status && String(item.status).toLowerCase() === statusFilter.toLowerCase());
      return matchSearch && matchStatus;
    });
  }, [rawItems, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              ${categoryName}
            </Badge>
            <span className="text-xs text-muted-foreground">• Live ERP Ledger</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
            <Download className="size-3.5" /> Export CSV
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
            <Printer className="size-3.5" /> Print
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="size-3.5" /> Add New Record
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Records" value={rawItems.length.toString()} icon={Building2} tone="info" />
        <KpiCard label="Filtered Count" value={filteredItems.length.toString()} icon={Users} tone="purple" />
        <KpiCard label="Compliance SLA" value="99.8%" icon={ShieldCheck} tone="success" />
        <KpiCard label="Audit Standard" value="Verified 2026" icon={CheckCircle2} tone="warning" />
      </div>

      {/* CHARTS ROW */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Distribution Metrics" description="Record volume breakdown.">
          <GroupedBarChart
            data={[
              { category: "Phase A", active: 24, pending: 4 },
              { category: "Phase B", active: 32, pending: 8 },
              { category: "Phase C", active: 28, pending: 2 },
              { category: "Phase D", active: 18, pending: 5 },
            ] as unknown as Record<string, unknown>[]}
            xKey="category"
            series={[
              { key: "active", label: "Completed" },
              { key: "pending", label: "In Review" },
            ]}
            height={200}
          />
        </Panel>

        <Panel title="Monthly Trend Analytics" description="Operational throughput over time.">
          <TrendLineChart
            data={[
              { month: "Jan", throughput: 82 },
              { month: "Feb", throughput: 88 },
              { month: "Mar", throughput: 94 },
              { month: "Apr", throughput: 91 },
              { month: "May", throughput: 98 },
            ] as unknown as Record<string, unknown>[]}
            xKey="month"
            series={[{ key: "throughput", label: "Efficiency %" }]}
            height={200}
          />
        </Panel>
      </div>

      {/* SEARCH, FILTERS & MAIN TABLE */}
      <Panel title="${title} Register" description="Real-time filterable data table.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search across all fields..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-[150px] text-xs">
                  <SelectValue placeholder="Status Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active / Verified</SelectItem>
                  <SelectItem value="pending">Pending / Open</SelectItem>
                  <SelectItem value="resolved">Resolved / Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  ${columns.map(c => `<th className="p-3">${c}</th>`).join('')}
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={${columns.length}} className="p-8 text-center text-muted-foreground text-xs">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      {Object.values(item).map((val, cIdx) => (
                        <td key={cIdx} className="p-3 font-mono text-foreground">
                          {String(val).toLowerCase().includes("active") || String(val).toLowerCase().includes("resolved") || String(val).toLowerCase().includes("disbursed") || String(val).toLowerCase().includes("certified") ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                          ) : String(val).toLowerCase().includes("pending") || String(val).toLowerCase().includes("in progress") || String(val).toLowerCase().includes("open") ? (
                            <Badge className="bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                          ) : (
                            String(val)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION BAR */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
            <span className="text-xs text-muted-foreground font-mono">
              Showing {filteredItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} entries
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  className="h-7 w-7 p-0 text-xs font-mono"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Panel>

      {/* RECENT ACTIVITIES & NOTIFICATIONS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Recent Audit Logs" description="Automated system activity log.">
          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-emerald-500" />
                <span className="font-bold">Ledger Synchronization Pass</span>
              </div>
              <span className="text-muted-foreground font-mono">10 mins ago</span>
            </div>
            <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <span className="font-bold">Monthly Compliance Verification</span>
              </div>
              <span className="text-muted-foreground font-mono">1 hour ago</span>
            </div>
          </div>
        </Panel>

        <Panel title="System Alerts" description="Category notifications and threshold alerts.">
          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-amber-500" />
                <span className="font-bold">SLA Review Scheduled for Friday</span>
              </div>
              <Badge variant="outline" className="font-mono text-[0.65rem]">High Priority</Badge>
            </div>
            <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500" />
                <span className="font-bold">All 100% Quality Norms Satisfied</span>
              </div>
              <Badge variant="outline" className="font-mono text-[0.65rem]">Verified</Badge>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
`;
}

console.log("Rich page template ready");
