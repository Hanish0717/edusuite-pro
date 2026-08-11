import React, { useEffect, useState } from "react";
import {
  Wallet,
  Plus,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  Building2,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  fetchFeeTransactions,
  fetchExpenseVouchers,
  collectFeePayment,
  createExpenseVoucher,
  INITIAL_TRANSACTIONS,
  INITIAL_VOUCHERS,
  type FeeTransaction,
  type ExpenseVoucher,
} from "./FinanceService";

export function FinanceModuleView() {
  const [transactions, setTransactions] = useState<FeeTransaction[]>(INITIAL_TRANSACTIONS);
  const [vouchers, setVouchers] = useState<ExpenseVoucher[]>(INITIAL_VOUCHERS);
  const [activeTab, setActiveTab] = useState<"transactions" | "vouchers">("transactions");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Dialog States
  const [isCollectFeeOpen, setIsCollectFeeOpen] = useState(false);
  const [isAddVoucherOpen, setIsAddVoucherOpen] = useState(false);

  // Forms
  const [feeForm, setFeeForm] = useState<Partial<FeeTransaction>>({
    rollNo: "23AIDS012",
    studentName: "Rohan Varma",
    department: "AI&DS",
    feeType: "Tuition Fee",
    amountPaid: 125000,
    paymentMode: "Online UPI",
  });

  const [voucherForm, setVoucherForm] = useState<Partial<ExpenseVoucher>>({
    department: "CSE",
    category: "Lab Equipment",
    description: "GPU Workstation Upgrade for Deep Learning Lab",
    amount: 350000,
  });

  const loadData = async () => {
    setLoading(true);
    const [tx, vc] = await Promise.all([fetchFeeTransactions(), fetchExpenseVouchers()]);
    setTransactions(tx);
    setVouchers(vc);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTx = transactions.filter((t) => {
    return (
      t.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      t.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      t.studentName.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleCollectFeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeForm.rollNo || !feeForm.studentName) return toast.error("Enter student roll number and name");
    const created = await collectFeePayment(feeForm);
    setTransactions((prev) => [created, ...prev]);
    setIsCollectFeeOpen(false);
    toast.success(`Fee Payment ₹${created.amountPaid.toLocaleString()} recorded for ${created.studentName}!`);
  };

  const handleAddVoucherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherForm.description) return toast.error("Enter voucher description");
    const created = await createExpenseVoucher(voucherForm);
    setVouchers((prev) => [created, ...prev]);
    setIsAddVoucherOpen(false);
    toast.success(`Expense Voucher ₹${created.amount.toLocaleString()} approved!`);
  };

  const handleExportCSV = () => {
    const headers = ["Transaction ID", "Roll No", "Student Name", "Department", "Fee Type", "Amount Paid (INR)", "Payment Mode", "Date", "Status"];
    const rows = filteredTx.map((t) => [t.transactionId, t.rollNo, `"${t.studentName}"`, t.department, `"${t.feeType}"`, t.amountPaid, t.paymentMode, t.paymentDate, t.receiptStatus]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Institutional_Finance_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported finance ledger to CSV!");
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
                Institutional Finance & Fee Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Financial Treasury & Accounts
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Tuition fee collection receipts, online UPI reconciliation, departmental expense vouchers, and treasury audit.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Export Ledger
          </Button>
          <Button size="sm" onClick={() => setIsAddVoucherOpen(true)} variant="outline" className="h-9 border-primary/30 text-primary gap-2 text-xs font-semibold">
            <FileText className="size-4" /> Record Voucher
          </Button>
          <Button size="sm" onClick={() => setIsCollectFeeOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
            <Plus className="size-4" /> Collect Fee Payment
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Fee Collections</span>
            <TrendingUp className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">₹14.25 Cr</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">Academic Year 2025-26</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Pending Fee Dues</span>
            <TrendingDown className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-600">₹1.85 Cr</p>
          <p className="text-[0.68rem] text-muted-foreground">Outstanding student balances</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Operating Expenses</span>
            <Wallet className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">₹6.40 Cr</p>
          <p className="text-[0.68rem] text-muted-foreground">Lab, Infra & Utility Expenses</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Treasury Balance</span>
            <ShieldCheck className="size-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">₹7.85 Cr</p>
          <p className="text-[0.68rem] text-purple-600 font-medium">Verified Reserve Fund</p>
        </div>
      </div>

      {/* SUBPARTS TAB SWITCHER */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80">
        <button onClick={() => setActiveTab("transactions")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "transactions" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          1. Student Fee Collection Receipts ({transactions.length})
        </button>
        <button onClick={() => setActiveTab("vouchers")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "vouchers" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          2. Department Expense Vouchers ({vouchers.length})
        </button>
      </div>

      {/* TAB 1: TRANSACTIONS */}
      {activeTab === "transactions" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Transaction ID</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Fee Type</th>
                  <th className="py-3 px-3">Amount Paid</th>
                  <th className="py-3 px-3">Payment Mode</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredTx.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{t.transactionId}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{t.studentName} ({t.rollNo})</td>
                    <td className="py-3 px-3">{t.department}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{t.feeType}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600">₹{t.amountPaid.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono text-primary">{t.paymentMode}</td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{t.paymentDate}</td>
                    <td className="py-3 px-3"><Badge className="bg-emerald-500/10 text-emerald-600">{t.receiptStatus}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: VOUCHERS */}
      {activeTab === "vouchers" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Voucher ID</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3">Voucher Amount</th>
                  <th className="py-3 px-3">Approved By</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {vouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{v.voucherId}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{v.department}</td>
                    <td className="py-3 px-3"><Badge variant="outline" className="font-mono text-xs">{v.category}</Badge></td>
                    <td className="py-3 px-3 text-muted-foreground">{v.description}</td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">₹{v.amount.toLocaleString()}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{v.approvedBy}</td>
                    <td className="py-3 px-3"><Badge className="bg-emerald-500/10 text-emerald-600">{v.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DIALOG 1: COLLECT FEE */}
      <Dialog open={isCollectFeeOpen} onOpenChange={setIsCollectFeeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Collect Student Fee Payment</DialogTitle></DialogHeader>
          <form onSubmit={handleCollectFeeSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Student Roll No *</Label><Input required placeholder="23AIDS012" value={feeForm.rollNo || ""} onChange={(e) => setFeeForm({ ...feeForm, rollNo: e.target.value })} className="h-9 text-xs font-mono uppercase" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Student Name *</Label><Input required placeholder="Rohan Varma" value={feeForm.studentName || ""} onChange={(e) => setFeeForm({ ...feeForm, studentName: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Amount Paid (INR)</Label><Input type="number" value={feeForm.amountPaid ?? 125000} onChange={(e) => setFeeForm({ ...feeForm, amountPaid: Number(e.target.value) })} className="h-9 text-xs font-mono" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsCollectFeeOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Record Payment</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: RECORD VOUCHER */}
      <Dialog open={isAddVoucherOpen} onOpenChange={setIsAddVoucherOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Record Department Expense Voucher</DialogTitle></DialogHeader>
          <form onSubmit={handleAddVoucherSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Description *</Label><Textarea required placeholder="GPU Workstation Upgrade for Deep Learning Lab" value={voucherForm.description || ""} onChange={(e) => setVoucherForm({ ...voucherForm, description: e.target.value })} className="text-xs min-h-[70px]" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Amount (INR)</Label><Input type="number" value={voucherForm.amount ?? 350000} onChange={(e) => setVoucherForm({ ...voucherForm, amount: Number(e.target.value) })} className="h-9 text-xs font-mono" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsAddVoucherOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Approve Voucher</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
