import { createFileRoute } from "@tanstack/react-router";
import React, { useMemo, useState, useEffect } from "react";
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
  FileSpreadsheet,
  Printer,
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

import { fetchPayrollLedger } from "@/modules/payroll/PayrollService";

export const Route = createFileRoute("/staff/finance-dean/staff-payroll")({
  head: () => ({
    meta: [{ title: "Staff Payroll — Finance Dean" }],
  }),
  component: SubPageComponent,
});

function SubPageComponent() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [rawData, setRawData] = useState<Record<string, any>[]>([]);

  // Dialog & Add Record States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    role: "",
    dept: "",
    basic: "",
    net: "",
    status: "Paid",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const ledger = await fetchPayrollLedger();
        const mapped = ledger.map((item) => ({
          id: item.employeeId || item.id,
          name: item.employeeName,
          role: item.designation,
          dept: item.department,
          basic: `₹${item.basicPay.toLocaleString("en-IN")}`,
          net: `₹${item.netSalary.toLocaleString("en-IN")}`,
          status: item.status,
        }));
        setRawData(mapped);
      } catch {}
    }
    loadData();
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

  // Export PDF Handler
  const handleExportPDF = () => {
    toast.success("Generating Staff Payroll PDF Report...");
    window.print();
  };

  // Export Excel CSV Handler
  const handleExportExcel = () => {
    const headers = ["Emp ID", "Staff Name", "Role / Designation", "Department", "Basic Salary", "Net Salary", "Status"];
    const csvHeader = headers.join(",") + "\n";
    const csvRows = filteredData.map(row => [
      `"${row.id || ""}"`,
      `"${row.name || ""}"`,
      `"${row.role || ""}"`,
      `"${row.dept || ""}"`,
      `"${row.basic || ""}"`,
      `"${row.net || ""}"`,
      `"${row.status || ""}"`
    ].join(",")).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "staff-payroll-ledger.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Staff Payroll Excel CSV file downloaded successfully!");
  };

  // Add Financial Record Handler
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      toast.error("Please fill in required fields (Staff Name and Role).");
      return;
    }
    const newRecord = {
      id: formData.id || `EMP-STF-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      role: formData.role,
      dept: formData.dept || "Administration",
      basic: formData.basic.startsWith("₹") ? formData.basic : `₹${Number(formData.basic || 45000).toLocaleString("en-IN")}`,
      net: formData.net.startsWith("₹") ? formData.net : `₹${Number(formData.net || 55000).toLocaleString("en-IN")}`,
      status: formData.status || "Paid",
    };
    setRawData([newRecord, ...rawData]);
    setIsAddOpen(false);
    setFormData({ id: "", name: "", role: "", dept: "", basic: "", net: "", status: "Paid" });
    toast.success("New Staff Financial Record added successfully!");
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              PAYROLL
            </Badge>
            <span className="text-xs text-muted-foreground">• Finance Dean ERP Portal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Staff Payroll</h1>
          <p className="text-sm text-muted-foreground">Administrative & technical staff salary ledgers and monthly bank credits.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleExportPDF} className="h-8 text-xs gap-1.5 cursor-pointer">
            <Printer className="size-3.5" /> Print PDF
          </Button>
          <Button size="sm" variant="outline" onClick={handleExportExcel} className="h-8 text-xs gap-1.5 cursor-pointer">
            <FileSpreadsheet className="size-3.5" /> Export Excel CSV
          </Button>
          <Button size="sm" onClick={() => setIsAddOpen(true)} className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
            <Plus className="size-3.5" /> Add Financial Record
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Staff Payroll" value="₹1.00 Cr / Mo" icon={Wallet} tone="purple" />
        <KpiCard label="Staff Members" value="180 Staff" icon={CreditCard} tone="success" />
        <KpiCard label="Bank Direct Credit" value="100%" icon={TrendingUp} tone="info" />
        <KpiCard label="Status" value="Paid" icon={ShieldCheck} tone="warning" />
      </div>

      {/* MAIN DATA TABLE */}
      <Panel title="Staff Payroll Master Ledger" description="Official institutional financial ledgers, audit vouchers, and budget allocations.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search financial records, vendors, staff..."
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
                  <th className="p-3">Emp ID</th>
                  <th className="p-3">Staff Name</th>
                  <th className="p-3">Role / Designation</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Basic Salary</th>
                  <th className="p-3">Net Salary</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {paginatedData.map((item: Record<string, any>, idx: number) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono text-foreground font-semibold">{item.id}</td>
                    <td className="p-3 font-medium text-foreground">{item.name}</td>
                    <td className="p-3 text-muted-foreground">{item.role}</td>
                    <td className="p-3 text-muted-foreground">{item.dept}</td>
                    <td className="p-3 font-mono">{item.basic}</td>
                    <td className="p-3 font-mono font-semibold text-foreground">{item.net}</td>
                    <td className="p-3">
                      {String(item.status).toLowerCase().includes("paid") || String(item.status).toLowerCase().includes("approved") ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{item.status}</Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]">{item.status}</Badge>
                      )}
                    </td>
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

      {/* ADD FINANCIAL RECORD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Staff Financial Record</DialogTitle>
            <DialogDescription>
              Enter administrative / technical staff payroll & financial details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Employee ID</label>
              <Input
                placeholder="e.g. EMP-STF-009"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Staff Full Name *</label>
              <Input
                placeholder="e.g. Rajesh Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-8 text-xs"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Role / Designation *</label>
              <Input
                placeholder="e.g. Senior System Admin"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="h-8 text-xs"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Department</label>
              <Input
                placeholder="e.g. IT & Infrastructure"
                value={formData.dept}
                onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Basic Salary (₹)</label>
                <Input
                  type="number"
                  placeholder="58000"
                  value={formData.basic}
                  onChange={(e) => setFormData({ ...formData, basic: e.target.value })}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Net Salary (₹)</label>
                <Input
                  type="number"
                  placeholder="72000"
                  value={formData.net}
                  onChange={(e) => setFormData({ ...formData, net: e.target.value })}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Disbursement Status</label>
              <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid / Disbursed</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Pending">Pending Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="h-8 text-xs">
                Cancel
              </Button>
              <Button type="submit" className="h-8 text-xs bg-primary font-semibold">
                Add Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
