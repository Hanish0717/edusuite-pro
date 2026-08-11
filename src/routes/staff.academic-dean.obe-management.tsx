import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Building2,
  Users,
  BookOpen,
  Calendar,
  Monitor,
  UserCheck,
  Award,
  AlertCircle,
  Trophy,
  Clock,
  Building,
  UserPlus,
  History,
  Briefcase,
  Layers,
  BarChart2,
  TrendingUp,
  Target,
  GitMerge,
  CheckSquare,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit3,
  Trash2,
  Printer,
  FileSpreadsheet,
  RefreshCw,
} from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { GroupedBarChart } from "@/components/dashboard/charts";

export const Route = createFileRoute("/staff/academic-dean/obe-management")({
  head: () => ({
    meta: [{ title: "OBE Management — Academic Dean" }],
  }),
  component: SubPageComponent,
});

function SubPageComponent() {
  const initialData = useMemo(() => {
    return [
  { code: "PRG-CSE", prog: "B.Tech Computer Science", align: "100% OBE Compliant", po: "84.5% Attainment", audit: "Passed NBA Standard", status: "Verified" }
];
  }, []);

  const [data, setData] = useState<Record<string, any>[]>(initialData);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const headers = ["Program Code","Degree Program","OBE Alignment","PO Attainment Avg","Audit Status","Status"];

  const filteredData = useMemo(() => {
    return data.filter((item: Record<string, any>) => {
      const matchSearch = Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      );
      const matchFilter = filter === "all" || (item["status"] && String(item["status"]).toLowerCase().includes(filter.toLowerCase()));
      return matchSearch && matchFilter;
    });
  }, [data, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // EXPORT HANDLERS
  const handleExportPDF = () => {
    toast.success("OBE Management PDF Report generated & ready for download.");
    window.print();
  };

  const handleExportExcel = () => {
    const csvHeader = headers.join(",") + "\n";
    const csvRows = filteredData.map(row => Object.values(row).map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "obe-management-ledger.csv";
    a.click();
    toast.success("Excel CSV file downloaded successfully!");
  };

  // ADD RECORD HANDLER
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord = { ...formData };
    headers.forEach((h, idx) => {
      const key = "col" + idx;
      if (!newRecord[key]) {
        newRecord[key] = idx === headers.length - 1 ? "Active" : "Sample " + h;
      }
    });
    setData([newRecord, ...data]);
    setIsAddOpen(false);
    setFormData({});
    toast.success("New OBE Management record created successfully!");
  };

  // EDIT RECORD HANDLER
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRow) return;
    setData(data.map((item) => (item === selectedRow ? { ...item, ...formData } : item)));
    setIsEditOpen(false);
    setSelectedRow(null);
    toast.success("Record updated successfully!");
  };

  // DELETE RECORD HANDLER
  const handleDelete = (row: Record<string, any>) => {
    setData(data.filter((item) => item !== row));
    toast.success("Record deleted successfully!");
  };

  // ACTION TOGGLE HANDLER
  const handleToggleStatus = (row: Record<string, any>) => {
    setData(
      data.map((item) => {
        if (item === row) {
          const currentStatus = String(item["status"] || Object.values(item)[Object.values(item).length - 1]);
          const newStatus = currentStatus.toLowerCase().includes("pending") ? "Approved" : "Pending";
          const updated = { ...item };
          const keys = Object.keys(updated);
          updated[keys[keys.length - 1]] = newStatus;
          if (updated["status"]) updated["status"] = newStatus;
          return updated;
        }
        return item;
      })
    );
    toast.success("Status toggled successfully!");
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              ACADEMIC QUALITY
            </Badge>
            <span className="text-xs text-muted-foreground">• Academic Dean ERP Portal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">OBE Management</h1>
          <p className="text-sm text-muted-foreground">Outcome-Based Education (OBE) framework implementation and bloom's taxonomy audit.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleExportPDF} className="h-8 text-xs gap-1.5 cursor-pointer">
            <Printer className="size-3.5" /> Print PDF
          </Button>
          <Button size="sm" variant="outline" onClick={handleExportExcel} className="h-8 text-xs gap-1.5 cursor-pointer">
            <FileSpreadsheet className="size-3.5" /> Export Excel CSV
          </Button>
          <Button size="sm" onClick={() => { setFormData({}); setIsAddOpen(true); }} className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
            <Plus className="size-3.5" /> Add New Record
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="OBE Framework" value="Active 100%" icon={Building2} tone="purple" onClick={() => { setFilter("all"); toast.info("Filter reset to all records"); }} className="cursor-pointer hover:border-primary/50 transition-all" />
        <KpiCard label="Bloom's Mapped" value="6 Levels" icon={Users} tone="success" onClick={() => { setFilter("active"); toast.info("Filtering active records"); }} className="cursor-pointer hover:border-primary/50 transition-all" />
        <KpiCard label="PO Attainment" value="84.5% Avg" icon={BookOpen} tone="info" onClick={() => { setFilter("completed"); toast.info("Filtering completed records"); }} className="cursor-pointer hover:border-primary/50 transition-all" />
        <KpiCard label="Status" value="Verified" icon={Award} tone="warning" onClick={() => { setFilter("pending"); toast.info("Filtering pending records"); }} className="cursor-pointer hover:border-primary/50 transition-all" />
      </div>

      
      <Panel title="OBE Management Analytics Distribution" description="Quantitative ERP breakdown across institutional departments.">
        <GroupedBarChart
          data={[
            { category: "CSE Dept", metric: 1240 },
            { category: "ECE Dept", metric: 980 },
            { category: "ME Dept", metric: 750 },
            { category: "EEE Dept", metric: 620 },
            { category: "Civil Dept", metric: 540 },
            { category: "MBA Dept", metric: 480 },
          ] as unknown as Record<string, unknown>[]}
          xKey="category"
          series={[{ key: "metric", label: "Volume" }]}
          height={200}
        />
      </Panel>
      

      {/* MAIN DATA TABLE */}
      <Panel title="OBE Management Master Ledger" description="Official executive records, interactive search, filters, pagination, and actions.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search obe management records..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={(val) => { setFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 w-[150px] text-xs">
                  <SelectValue placeholder="Status Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active / Approved</SelectItem>
                  <SelectItem value="pending">Pending / Review</SelectItem>
                  <SelectItem value="completed">Completed / Dispatched</SelectItem>
                </SelectContent>
              </Select>

              <Button size="sm" variant="ghost" onClick={() => { setSearch(""); setFilter("all"); toast.success("Filters reset"); }} className="h-9 text-xs gap-1 cursor-pointer">
                <RefreshCw className="size-3.5" /> Reset
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="p-3">{h}</th>
                  ))}
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={headers.length + 1} className="p-8 text-center text-muted-foreground">
                      No matching records found. Try adjusting your search query or status filter.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item: Record<string, any>, idx: number) => {
                    const rowValues = Object.values(item);
                    return (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        {rowValues.map((val: any, cIdx: number) => (
                          <td key={cIdx} className="p-3 font-mono text-foreground">
                            {String(val).toLowerCase().includes("active") || String(val).toLowerCase().includes("approved") || String(val).toLowerCase().includes("completed") || String(val).toLowerCase().includes("verified") || String(val).toLowerCase().includes("accredited") || String(val).toLowerCase().includes("paid") || String(val).toLowerCase().includes("issued") || String(val).toLowerCase().includes("passed") || String(val).toLowerCase().includes("placed") || String(val).toLowerCase().includes("released") ? (
                              <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                            ) : String(val).toLowerCase().includes("pending") || String(val).toLowerCase().includes("under review") || String(val).toLowerCase().includes("remedial") || String(val).toLowerCase().includes("shortlisted") || String(val).toLowerCase().includes("due") ? (
                              <Badge className="bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                            ) : (
                              String(val)
                            )}
                          </td>
                        ))}
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 cursor-pointer" title="View Details" onClick={() => { setSelectedRow(item); setIsViewOpen(true); }}>
                              <Eye className="size-3.5 text-muted-foreground hover:text-foreground" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 cursor-pointer" title="Edit Record" onClick={() => { setSelectedRow(item); setFormData(item); setIsEditOpen(true); }}>
                              <Edit3 className="size-3.5 text-primary" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 cursor-pointer" title="Toggle Approval Status" onClick={() => handleToggleStatus(item)}>
                              <CheckSquare className="size-3.5 text-emerald-600" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 cursor-pointer" title="Delete Record" onClick={() => handleDelete(item)}>
                              <Trash2 className="size-3.5 text-rose-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
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

      {/* ADD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New OBE Management Record</DialogTitle>
            <DialogDescription>Enter details to create a new record in the ERP ledger.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-3 py-2">
            {headers.map((h, i) => (
              <div key={i} className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground">{h}</label>
                <Input
                  required
                  placeholder={`Enter ${h}...`}
                  value={formData["col" + i] || ""}
                  onChange={(e) => setFormData({ ...formData, ["col" + i]: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
            ))}
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-bold">Save Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit OBE Management Record</DialogTitle>
            <DialogDescription>Modify record details and update ERP status.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-3 py-2">
            {selectedRow &&
              Object.keys(selectedRow).map((key, i) => (
                <div key={i} className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">{headers[i] || key}</label>
                  <Input
                    value={formData[key] || ""}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              ))}
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-bold">Update Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* VIEW DIALOG */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>OBE Management Record Details</DialogTitle>
            <DialogDescription>Detailed view of official record entries.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {selectedRow &&
              Object.entries(selectedRow).map(([key, val], i) => (
                <div key={i} className="flex justify-between items-center text-xs py-1 border-b border-border/50">
                  <span className="font-bold text-muted-foreground">{headers[i] || key}</span>
                  <span className="font-mono text-foreground font-semibold">{String(val)}</span>
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
