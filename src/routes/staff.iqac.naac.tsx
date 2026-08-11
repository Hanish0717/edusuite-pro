import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  BadgeCheck,
  ShieldCheck,
  FileText,
  ClipboardCheck,
  CheckCircle2,
  Users,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Send,
  Inbox,
  Bell,
  Save,
  Lock,
  Globe,
  Shield,
  User,
} from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GroupedBarChart } from "@/components/dashboard/charts";

export const Route = createFileRoute("/staff/iqac/naac")({
  head: () => ({
    meta: [{ title: "NAAC Accreditation — IQAC Dean" }],
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
  { code: "C1", name: "Curricular Aspects", weight: "150 Pts", score: "142 Pts", evidence: "100% Uploaded", status: "Verified" },
  { code: "C2", name: "Teaching-Learning and Evaluation", weight: "350 Pts", score: "338 Pts", evidence: "100% Uploaded", status: "Verified" },
  { code: "C3", name: "Research, Innovations and Extension", weight: "150 Pts", score: "140 Pts", evidence: "98% Uploaded", status: "Verified" },
  { code: "C4", name: "Infrastructure and Learning Resources", weight: "100 Pts", score: "95 Pts", evidence: "100% Uploaded", status: "Verified" },
  { code: "C5", name: "Student Support and Progression", weight: "100 Pts", score: "92 Pts", evidence: "96% Uploaded", status: "Verified" },
  { code: "C6", name: "Governance, Leadership and Management", weight: "100 Pts", score: "96 Pts", evidence: "100% Uploaded", status: "Verified" },
  { code: "C7", name: "Institutional Values & Best Practices", weight: "50 Pts", score: "48 Pts", evidence: "100% Uploaded", status: "Verified" }
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
              QUALITY ASSURANCE
            </Badge>
            <span className="text-xs text-muted-foreground">• IQAC Quality Module</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">NAAC Accreditation</h1>
          <p className="text-sm text-muted-foreground">Official higher education ERP management ledger and verified domain records.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> Export Report
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
            <Plus className="size-3.5" /> Add Quality Record
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="NAAC Target" value="3.78 A++" icon={BadgeCheck} tone="purple" />
        <KpiCard label="Criteria" value="7 Criteria" icon={ShieldCheck} tone="success" />
        <KpiCard label="Weightage" value="1,000 Pts" icon={FileText} tone="info" />
        <KpiCard label="Compliance" value="100%" icon={CheckCircle2} tone="warning" />
      </div>

      
      <Panel title="NAAC Accreditation Performance Chart" description="Quantitative quality benchmarks and criteria progress.">
        <GroupedBarChart
          data={[
            { category: "Criterion 1", score: 95 },
            { category: "Criterion 2", score: 96 },
            { category: "Criterion 3", score: 94 },
            { category: "Criterion 4", score: 92 },
            { category: "Criterion 5", score: 93 },
          ] as unknown as Record<string, unknown>[]}
          xKey="category"
          series={[{ key: "score", label: "Quality Score %" }]}
          height={200}
        />
      </Panel>
      

      {/* MAIN DATA TABLE */}
      <Panel title="NAAC Accreditation Ledger" description="Official NAAC, NBA & Institutional Quality Records.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search quality records..."
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
                <SelectItem value="verified">Verified / Active</SelectItem>
                <SelectItem value="pending">Pending / Open</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Criterion Code</th><th className="p-3">Criterion Name</th><th className="p-3">Weightage</th><th className="p-3">Scored Points</th><th className="p-3">Evidence Status</th><th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {paginatedData.map((item: Record<string, any>, idx: number) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    {Object.values(item).map((val: any, cIdx: number) => (
                      <td key={cIdx} className="p-3 font-mono text-foreground">
                        {String(val).toLowerCase().includes("verified") || String(val).toLowerCase().includes("accredited") || String(val).toLowerCase().includes("active") || String(val).toLowerCase().includes("approved") || String(val).toLowerCase().includes("achieved") ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                        ) : String(val).toLowerCase().includes("pending") || String(val).toLowerCase().includes("under review") || String(val).toLowerCase().includes("in progress") ? (
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
