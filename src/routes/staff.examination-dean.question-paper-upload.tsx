import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Users,
  Calendar,
  CheckCircle2,
  Ticket,
  Clock,
  UserCheck,
  Upload,
  CheckSquare,
  Award,
  RefreshCw,
  AlertTriangle,
  Building2,
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

export const Route = createFileRoute("/staff/examination-dean/question-paper-upload")({
  head: () => ({
    meta: [{ title: "Question Paper Upload — Examination Dean" }],
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
  { code: "CS501", title: "Advanced Software Engineering", faculty: "Dr. Srinivas Rao", dept: "CSE", date: "2026-08-01", enc: "AES-256 Encrypted", status: "Uploaded" }
];
  }, []);

  const filteredData = useMemo(() => {
    return rawData.filter((item: Record<string, any>) => {
      const matchSearch = Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      );
      const matchFilter = filter === "all" || (item.status && String(item.status).toLowerCase().includes(filter.toLowerCase()));
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
              QUESTION PAPER MANAGEMENT
            </Badge>
            <span className="text-xs text-muted-foreground">• Examination Dean ERP Portal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Question Paper Upload</h1>
          <p className="text-sm text-muted-foreground">Encrypted question paper submission portal for paper setters.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> Export PDF / Excel
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
            <Plus className="size-3.5" /> Add Exam Record
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Papers" value="184 Subjects" icon={Users} tone="purple" />
        <KpiCard label="Uploaded" value="184 Papers" icon={Calendar} tone="success" />
        <KpiCard label="AES-256 Encrypted" value="100%" icon={Ticket} tone="info" />
        <KpiCard label="Status" value="Completed" icon={Award} tone="warning" />
      </div>

      
      <Panel title="Question Paper Upload Statistics Chart" description="Quantitative examination ledgers across academic departments.">
        <GroupedBarChart
          data={[
            { category: "CSE Dept", count: 1240 },
            { category: "ECE Dept", count: 980 },
            { category: "ME Dept", count: 750 },
            { category: "EEE Dept", count: 620 },
            { category: "Civil Dept", count: 540 },
            { category: "MBA Dept", count: 480 },
          ] as unknown as Record<string, unknown>[]}
          xKey="category"
          series={[{ key: "count", label: "Student Volume" }]}
          height={200}
        />
      </Panel>
      

      {/* MAIN DATA TABLE */}
      <Panel title="Question Paper Upload Master Ledger" description="Official Controller of Examinations records, schedules, marks entries, and hall allocations.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search examination records, students, subjects..."
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
                <SelectItem value="scheduled">Scheduled / Active</SelectItem>
                <SelectItem value="completed">Completed / Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Subject Code</th><th className="p-3">Subject Title</th><th className="p-3">Paper Setter Faculty</th><th className="p-3">Department</th><th className="p-3">Upload Date</th><th className="p-3">Encryption Status</th><th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {paginatedData.map((item: Record<string, any>, idx: number) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    {Object.values(item).map((val: any, cIdx: number) => (
                      <td key={cIdx} className="p-3 font-mono text-foreground">
                        {String(val).toLowerCase().includes("scheduled") || String(val).toLowerCase().includes("published") || String(val).toLowerCase().includes("generated") || String(val).toLowerCase().includes("passed") || String(val).toLowerCase().includes("approved") || String(val).toLowerCase().includes("verified") ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                        ) : String(val).toLowerCase().includes("pending") || String(val).toLowerCase().includes("open") || String(val).toLowerCase().includes("under review") ? (
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
