import React, { useEffect, useState } from "react";
import {
  Wallet,
  DollarSign,
  Download,
  CheckCircle,
  Clock,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Filter,
  Eye,
  CreditCard,
  Building2,
  AlertCircle,
  Plus,
  FileText,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import {
  fetchPayrollLedger,
  generatePayslip,
  updateSalaryStatus,
  INITIAL_SALARY_SLIPS,
  type SalarySlip,
} from "./PayrollService";

const DEPARTMENTS = [
  "All Departments",
  "CSE",
  "ECE",
  "ME",
  "EEE",
  "CIVIL",
  "AI&DS",
];

const STATUS_TABS = ["All", "Paid", "Processing", "Pending Approval"] as const;

export function PayrollModuleView() {
  const [slips, setSlips] = useState<SalarySlip[]>(INITIAL_SALARY_SLIPS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "All" | "Paid" | "Processing" | "Pending Approval"
  >("All");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [loading, setLoading] = useState(false);

  // Dialog States
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState<SalarySlip | null>(null);

  // Form State for Generating Payslip
  const [formData, setFormData] = useState<Partial<SalarySlip>>({
    employeeName: "Dr. Ravi Kumar",
    employeeId: "EMP010",
    department: "CSE",
    designation: "Associate Professor",
    monthYear: "July 2026",
    basicPay: 75000,
    hra: 22500,
    allowances: 10000,
    deductions: 9000,
    status: "Processing",
    bankAccount: "HDFC-****-8812",
  });

  const loadData = async () => {
    setLoading(true);
    const data = await fetchPayrollLedger();
    setSlips(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Logic
  const filtered = slips.filter((slip) => {
    const matchesSearch =
      slip.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      slip.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      slip.department.toLowerCase().includes(search.toLowerCase()) ||
      slip.monthYear.toLowerCase().includes(search.toLowerCase()) ||
      slip.id.toLowerCase().includes(search.toLowerCase());

    const matchesTab = activeTab === "All" || slip.status === activeTab;
    const matchesDept = selectedDept === "All Departments" || slip.department === selectedDept;

    return matchesSearch && matchesTab && matchesDept;
  });

  // KPI Metrics
  const totalPayroll = slips.reduce((sum, s) => sum + s.netSalary, 0);
  const paidCount = slips.filter((s) => s.status === "Paid").length;
  const pendingCount = slips.filter((s) => s.status !== "Paid").length;
  const pendingAmount = slips
    .filter((s) => s.status !== "Paid")
    .reduce((sum, s) => sum + s.netSalary, 0);

  // Live Net Salary calculation for form
  const calcBasic = Number(formData.basicPay) || 0;
  const calcHra = Number(formData.hra) || 0;
  const calcAllowances = Number(formData.allowances) || 0;
  const calcDeductions = Number(formData.deductions) || 0;
  const computedNetSalary = calcBasic + calcHra + calcAllowances - calcDeductions;

  // Handlers
  const handleOpenGenerate = () => {
    setFormData({
      employeeName: "",
      employeeId: "",
      department: "CSE",
      designation: "Assistant Professor",
      monthYear: "July 2026",
      basicPay: 60000,
      hra: 18000,
      allowances: 8000,
      deductions: 7200,
      status: "Processing",
      bankAccount: "SBI-****-5501",
    });
    setIsGenerateDialogOpen(true);
  };

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.employeeId) {
      toast.error("Please enter employee name and employee ID.");
      return;
    }

    const created = await generatePayslip(formData);
    setSlips((prev) => [created, ...prev]);
    setIsGenerateDialogOpen(false);
    toast.success(
      `Payslip for ${created.employeeName} (${created.monthYear}) generated successfully! Net: ₹${created.netSalary.toLocaleString("en-IN")}`,
    );
  };

  const handleMarkPaid = async (slip: SalarySlip) => {
    await updateSalaryStatus(slip.id, "Paid");
    setSlips((prev) =>
      prev.map((s) =>
        s.id === slip.id
          ? { ...s, status: "Paid", paymentDate: new Date().toISOString().split("T")[0] }
          : s,
      ),
    );
    toast.success(`Salary marked as PAID for ${slip.employeeName} (${slip.id})!`);
  };

  const handleOpenView = (slip: SalarySlip) => {
    setSelectedSlip(slip);
    setIsViewDialogOpen(true);
  };

  const handleDownloadSlip = (slip: SalarySlip) => {
    const slipText = `=====================================================
            EDUSUITE PRO COLLEGE ERP
            OFFICIAL SALARY VOUCHER / PAYSLIP
=====================================================
Slip ID      : ${slip.id}
Pay Period   : ${slip.monthYear}
Payment Date : ${slip.paymentDate || "Pending"}
Status       : ${slip.status.toUpperCase()}

EMPLOYEE DETAILS:
-----------------------------------------------------
Name         : ${slip.employeeName}
Employee ID  : ${slip.employeeId}
Department   : ${slip.department}
Designation  : ${slip.designation}
Bank Account : ${slip.bankAccount || "N/A"}

SALARY BREAKDOWN:
-----------------------------------------------------
Basic Pay    : ₹${slip.basicPay.toLocaleString("en-IN")}
HRA          : ₹${slip.hra.toLocaleString("en-IN")}
Allowances   : ₹${slip.allowances.toLocaleString("en-IN")}
-----------------------------------------------------
Gross Earnings: ₹${(slip.basicPay + slip.hra + slip.allowances).toLocaleString("en-IN")}

DEDUCTIONS:
-----------------------------------------------------
PF / Tax / ESI: -₹${slip.deductions.toLocaleString("en-IN")}
-----------------------------------------------------
NET PAYABLE   : ₹${slip.netSalary.toLocaleString("en-IN")}

=====================================================
This is a computer-generated salary slip.
=====================================================`;

    const blob = new Blob([slipText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Payslip_${slip.employeeId}_${slip.monthYear.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded official payslip voucher for ${slip.employeeName}!`);
  };

  const handleExportCSV = () => {
    const headers = [
      "Slip ID",
      "Employee ID",
      "Employee Name",
      "Department",
      "Designation",
      "Month/Year",
      "Basic Pay",
      "HRA",
      "Allowances",
      "Deductions",
      "Net Salary",
      "Status",
      "Payment Date",
    ];
    const rows = filtered.map((s) => [
      s.id,
      s.employeeId,
      `"${s.employeeName}"`,
      s.department,
      `"${s.designation}"`,
      `"${s.monthYear}"`,
      s.basicPay,
      s.hra,
      s.allowances,
      s.deductions,
      s.netSalary,
      s.status,
      s.paymentDate || "Pending",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Payroll_Ledger_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filtered.length} payroll ledger entries to CSV!`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Wallet className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Payroll & Salary Disbursement Module
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Finance Core
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Manage faculty salary structures, PF/ESI deductions, automated monthly ledgers, and payslip generation.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="h-9 gap-2 text-xs font-medium border-border hover:bg-accent"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 gap-2 text-xs font-medium border-border hover:bg-accent"
          >
            <Download className="size-3.5" /> Export Ledger
          </Button>

          <Button
            size="sm"
            onClick={handleOpenGenerate}
            className="h-9 bg-brand-gradient text-white gap-2 font-semibold text-xs shadow-glow hover:opacity-95"
          >
            <FileSpreadsheet className="size-4" /> Run Monthly Payroll
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Total Monthly Payroll</span>
            <DollarSign className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">
            ₹{totalPayroll.toLocaleString("en-IN")}
          </p>
          <p className="text-[0.68rem] text-muted-foreground">July 2026 gross disbursement</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Disbursed Slips</span>
            <CheckCircle className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">
            {paidCount} / {slips.length} Paid
          </p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">Bank transfer complete</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Pending Disbursement</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-600">
            ₹{pendingAmount.toLocaleString("en-IN")}
          </p>
          <p className="text-[0.68rem] text-muted-foreground">{pendingCount} slips in process</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Average Salary</span>
            <TrendingUp className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">
            ₹{slips.length ? Math.round(totalPayroll / slips.length).toLocaleString("en-IN") : 0}
          </p>
          <p className="text-[0.68rem] text-muted-foreground">Per employee avg</p>
        </div>
      </div>

      {/* Control Bar & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-sm">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/50">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-1 sm:flex-none items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search employee, ID, month..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Department Filter */}
          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="h-9 w-[140px] text-xs" aria-label="Department Filter">
              <Filter className="size-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept} className="text-xs">
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Salary Ledger Table */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <DollarSign className="size-4 text-primary" /> Salary Disbursement Ledger
            <Badge variant="secondary" className="font-mono text-xs">
              {filtered.length} Entries
            </Badge>
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <RefreshCw className="size-5 animate-spin text-primary" />
            Loading payroll ledger...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl space-y-2">
            <Wallet className="size-7 text-muted-foreground mx-auto" />
            <p className="text-xs text-muted-foreground font-medium">No salary slips found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <th className="py-3 px-3">Slip ID</th>
                  <th className="py-3 px-3">Employee Name</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Basic Pay</th>
                  <th className="py-3 px-3">HRA</th>
                  <th className="py-3 px-3">Allowances</th>
                  <th className="py-3 px-3">Deductions</th>
                  <th className="py-3 px-3">Net Payable</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((slip) => (
                  <tr key={slip.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{slip.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-foreground">{slip.employeeName}</div>
                      <div className="text-[0.68rem] text-muted-foreground font-mono">
                        {slip.employeeId} &middot; {slip.monthYear}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="font-mono text-[0.68rem]">
                        {slip.department}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-mono text-foreground">
                      ₹{slip.basicPay.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 font-mono text-foreground">
                      ₹{slip.hra.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 font-mono text-foreground">
                      ₹{slip.allowances.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 font-mono text-red-500 font-medium">
                      -₹{slip.deductions.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600 text-sm">
                      ₹{slip.netSalary.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        className={
                          slip.status === "Paid"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.68rem]"
                        }
                      >
                        {slip.status === "Paid" ? (
                          <CheckCircle className="size-3 mr-1 inline" />
                        ) : (
                          <Clock className="size-3 mr-1 inline" />
                        )}
                        {slip.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenView(slip)}
                          className="h-7 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
                          title="View Breakdown"
                        >
                          <Eye className="size-3.5" /> Details
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadSlip(slip)}
                          className="h-7 text-xs font-medium gap-1 text-primary border-primary/30 hover:bg-primary/10"
                          title="Download Official Payslip Voucher"
                        >
                          <Download className="size-3" /> Slip
                        </Button>

                        {slip.status !== "Paid" && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkPaid(slip)}
                            className="h-7 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                          >
                            <CheckCircle className="size-3" /> Mark Paid
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DIALOG 1: GENERATE PAYSLIP MODAL */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <FileSpreadsheet className="size-5 text-primary" /> Run Monthly Payroll / Generate Payslip
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Calculate monthly salary structure, allowances, and tax deductions for staff.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGenerateSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Employee Name *</Label>
                <Input
                  required
                  placeholder="e.g. Dr. Rajesh Sharma"
                  value={formData.employeeName || ""}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Employee ID *</Label>
                <Input
                  required
                  placeholder="e.g. EMP001"
                  value={formData.employeeId || ""}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(val) => setFormData({ ...formData, department: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Dept" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.filter((d) => d !== "All Departments").map((dept) => (
                      <SelectItem key={dept} value={dept} className="text-xs">
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Pay Month & Year</Label>
                <Input
                  placeholder="e.g. July 2026"
                  value={formData.monthYear || ""}
                  onChange={(e) => setFormData({ ...formData, monthYear: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Basic Pay (₹) *</Label>
                <Input
                  type="number"
                  required
                  value={formData.basicPay || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, basicPay: Number(e.target.value) })
                  }
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">HRA (₹)</Label>
                <Input
                  type="number"
                  value={formData.hra || ""}
                  onChange={(e) => setFormData({ ...formData, hra: Number(e.target.value) })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Special Allowances (₹)</Label>
                <Input
                  type="number"
                  value={formData.allowances || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, allowances: Number(e.target.value) })
                  }
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Deductions (PF / Tax) (₹)</Label>
                <Input
                  type="number"
                  value={formData.deductions || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, deductions: Number(e.target.value) })
                  }
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            {/* Computed Net Salary Preview */}
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Calculated Net Payable:</span>
              <span className="text-lg font-bold font-mono text-primary">
                ₹{computedNetSalary.toLocaleString("en-IN")}
              </span>
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsGenerateDialogOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">
                Generate Salary Slip
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: VIEW PAYSLIP BREAKDOWN MODAL */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="size-5 text-primary" /> Salary Slip Dossier
            </DialogTitle>
          </DialogHeader>

          {selectedSlip && (
            <div className="space-y-4 pt-1">
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {selectedSlip.id}
                  </Badge>
                  <Badge
                    className={
                      selectedSlip.status === "Paid"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }
                  >
                    {selectedSlip.status}
                  </Badge>
                </div>
                <h2 className="text-base font-bold text-foreground">{selectedSlip.employeeName}</h2>
                <p className="text-xs text-primary font-medium">
                  {selectedSlip.employeeId} &middot; {selectedSlip.department} ({selectedSlip.monthYear})
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60 font-mono">
                  <span className="text-muted-foreground font-sans">Basic Pay:</span>
                  <span className="font-bold text-foreground">₹{selectedSlip.basicPay.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60 font-mono">
                  <span className="text-muted-foreground font-sans">HRA:</span>
                  <span className="font-medium text-foreground">₹{selectedSlip.hra.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60 font-mono">
                  <span className="text-muted-foreground font-sans">Allowances:</span>
                  <span className="font-medium text-foreground">₹{selectedSlip.allowances.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60 font-mono text-red-500">
                  <span className="text-muted-foreground font-sans">Deductions (PF/Tax):</span>
                  <span className="font-medium">-₹{selectedSlip.deductions.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30 font-mono">
                  <span className="text-foreground font-bold font-sans">NET SALARY PAYABLE:</span>
                  <span className="font-bold text-lg text-primary">₹{selectedSlip.netSalary.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground">Bank Account:</span>
                  <span className="font-mono text-foreground">{selectedSlip.bankAccount || "HDFC-****-9901"}</span>
                </div>
              </div>

              <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadSlip(selectedSlip)}
                  className="w-full text-xs gap-1.5 text-primary border-primary/30"
                >
                  <Download className="size-3.5" /> Download Payslip Voucher
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="w-full text-xs"
                >
                  Close Dossier
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
