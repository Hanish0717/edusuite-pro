import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Wallet,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Clock,
  Receipt,
  UserCheck,
  CheckCircle2,
  Users,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GroupedBarChart } from "@/components/dashboard/charts";

export const Route = createFileRoute("/staff/finance-dean/daily-expenses")({
  head: () => ({
    meta: [{ title: "Daily Expenses — Finance Dean" }],
  }),
  component: SubPageComponent,
});

function SubPageComponent() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const rawData = useMemo(() => {
    return [
  { vno: "VCH-2026-801", desc: "Library Journal Subscriptions & Books Courier", cat: "Operational", dept: "Central Library", amt: "₹18,500", date: "2026-08-04", status: "Paid" },
  { vno: "VCH-2026-802", desc: "Campus Diesel Generator Refuel Supply", cat: "Utilities", dept: "Estate Office", amt: "₹45,000", date: "2026-08-04", status: "Paid" }
];
  }, []);

  const filteredData = useMemo(() => {
    return rawData.filter((item: Record<string, any>) => {
      const matchSearch = Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      );
      const matchFilter = filter === "all" || (item["status"] && String(item["status"]).toLowerCase().includes(filter.toLowerCase()));
      return matchSearch && matchFilter;
    });
  }, [rawData, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              EXPENDITURE MANAGEMENT
            </Badge>
            <span className="text-xs text-muted-foreground">• Finance Dean ERP Portal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Daily Expenses</h1>
          <p className="text-sm text-muted-foreground">Petty cash expenses, campus maintenance vouchers, and daily disbursements.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> Export PDF / Excel
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
            <Plus className="size-3.5" /> Add Financial Record
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Daily Vouchers" value="₹1.45 Lacs" icon={Wallet} tone="purple" />
        <KpiCard label="Monthly Cumulative" value="₹2.85 Cr" icon={CreditCard} tone="success" />
        <KpiCard label="Audit Checked" value="100%" icon={TrendingUp} tone="info" />
        <KpiCard label="Status" value="Verified" icon={ShieldCheck} tone="warning" />
      </div>

      
      <Panel title="Daily Expenses Distribution Chart" description="Quantitative financial ledger across academic departments.">
        <GroupedBarChart
          data={[
            { category: "CSE Dept", amount: 8.5 },
            { category: "ECE Dept", amount: 6.8 },
            { category: "ME Dept", amount: 5.2 },
            { category: "EEE Dept", amount: 4.5 },
            { category: "Civil Dept", amount: 3.8 },
            { category: "MBA Dept", amount: 3.2 },
          ] as unknown as Record<string, unknown>[]}
          xKey="category"
          series={[{ key: "amount", label: "Financial Value (₹ Cr)" }]}
          height={200}
        />
      </Panel>
      

      {/* MAIN DATA TABLE */}
      <Panel title="Daily Expenses Master Ledger" description="Official institutional financial ledgers, audit vouchers, and budget allocations.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search financial records, vendors, student fees..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <Select value={filter} onValueChange={(val) => { setFilter(val); setCurrentPage(1); }}>
              <SelectTrigger className="h-9 w-[150px] text-xs">
                <SelectValue placeholder="Status Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid / Approved</SelectItem>
                <SelectItem value="pending">Pending / Due</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Voucher No</th><th className="p-3">Expense Description</th><th className="p-3">Category</th><th className="p-3">Department</th><th className="p-3">Amount</th><th className="p-3">Paid Date</th><th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {paginatedData.map((item: Record<string, any>, idx: number) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    {Object.values(item).map((val: any, cIdx: number) => (
                      <td key={cIdx} className="p-3 font-mono text-foreground">
                        {String(val).toLowerCase().includes("paid") || String(val).toLowerCase().includes("approved") || String(val).toLowerCase().includes("cleared") || String(val).toLowerCase().includes("disbursed") || String(val).toLowerCase().includes("verified") || String(val).toLowerCase().includes("active") ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                        ) : String(val).toLowerCase().includes("pending") || String(val).toLowerCase().includes("due") || String(val).toLowerCase().includes("under review") ? (
                          <Badge className="bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                        ) : (
                          String(val)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
            <span className="text-xs text-muted-foreground font-mono">
              Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </span>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 cursor-pointer" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                <ChevronLeft className="size-3.5" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button key={i} variant={currentPage === i + 1 ? "default" : "outline"} size="sm" className="h-7 w-7 p-0 text-xs font-mono cursor-pointer" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 cursor-pointer" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
