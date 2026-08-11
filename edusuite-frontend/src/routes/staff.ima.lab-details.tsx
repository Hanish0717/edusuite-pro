import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  FlaskConical,
  Cpu,
  Wrench,
  Box,
  ShoppingCart,
  ShieldAlert,
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


export const Route = createFileRoute("/staff/ima/lab-details")({
  head: () => ({
    meta: [{ title: "Lab Details — IMA Dean" }],
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
  { name: "AI & ML Lab (Room 302)", incharge: "Prof. Anil Reddy", eq: "40 Dell OptiPlex 7090", seat: "40 Seats", net: "1 Gbps Fiber", ac: "Dual 2-Ton AC", cctv: "Active HD", status: "Operational" },
  { name: "Networking Lab (Room 304)", incharge: "Dr. Sneha Rao", eq: "30 Cisco Switches", seat: "40 Seats", net: "1 Gbps Fiber", ac: "Dual 2-Ton AC", cctv: "Active HD", status: "Operational" }
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
              LABORATORY MANAGEMENT
            </Badge>
            <span className="text-xs text-muted-foreground">• IMA Infrastructure ERP</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Lab Details</h1>
          <p className="text-sm text-muted-foreground">Detailed infrastructure, AC, CCTV, projector, and equipment specifications.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> Export PDF / Excel
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
            <Plus className="size-3.5" /> Add New Record
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Smart Labs" value="14 Labs" icon={FlaskConical} tone="purple" />
        <KpiCard label="Projectors" value="18 Units" icon={Cpu} tone="success" />
        <KpiCard label="AC Units" value="36 ACs" icon={Wrench} tone="info" />
        <KpiCard label="Status" value="Verified" icon={CheckCircle2} tone="warning" />
      </div>

      

      {/* MAIN DATA TABLE */}
      <Panel title="Lab Details Master Ledger" description="Official institutional equipment, laboratory, and asset inventory records.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search inventory, lab, equipment..."
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
                <SelectItem value="active">Active / Working</SelectItem>
                <SelectItem value="maintenance">Under Repair</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Lab Name</th><th className="p-3">Faculty Incharge</th><th className="p-3">Equipment Count</th><th className="p-3">Seating</th><th className="p-3">Internet</th><th className="p-3">AC Status</th><th className="p-3">CCTV</th><th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {paginatedData.map((item: Record<string, any>, idx: number) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    {Object.values(item).map((val: any, cIdx: number) => (
                      <td key={cIdx} className="p-3 font-mono text-foreground">
                        {String(val).toLowerCase().includes("working") || String(val).toLowerCase().includes("active") || String(val).toLowerCase().includes("approved") || String(val).toLowerCase().includes("allocated") || String(val).toLowerCase().includes("completed") || String(val).toLowerCase().includes("operational") ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                        ) : String(val).toLowerCase().includes("maintenance") || String(val).toLowerCase().includes("pending") || String(val).toLowerCase().includes("in progress") ? (
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
