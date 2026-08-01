import React, { useEffect, useState } from "react";
import { Wallet, DollarSign, Download, CheckCircle, Clock, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchPayrollLedger, type SalarySlip } from "./PayrollService";

export function PayrollModuleView() {
  const [slips, setSlips] = useState<SalarySlip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayrollLedger()
      .then(setSlips)
      .finally(() => setLoading(false));
  }, []);

  const totalPayroll = slips.reduce((sum, s) => sum + s.netSalary, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2">
            <Wallet className="size-6 text-primary" /> Payroll & Salary Disbursement Module
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage salary structures, deductions, PF/ESI calculations, and automated monthly disbursements.
          </p>
        </div>
        <Button className="bg-brand-gradient text-white gap-2 font-semibold shadow-glow">
          <FileSpreadsheet className="size-4" /> Run Monthly Payroll Process
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Total Monthly Disbursement</span>
          <p className="text-2xl font-bold font-mono text-primary">₹{totalPayroll.toLocaleString("en-IN")}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Disbursed Count</span>
          <p className="text-2xl font-bold font-mono text-emerald-600">
            {slips.filter((s) => s.status === "Paid").length} / {slips.length} Employees
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Pending Approvals</span>
          <p className="text-2xl font-bold font-mono text-amber-600">
            {slips.filter((s) => s.status !== "Paid").length} Slips
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <h3 className="font-bold text-base flex items-center gap-2">
          <DollarSign className="size-4 text-primary" /> Faculty & Staff Payroll Ledger (July 2026)
        </h3>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading salary slips...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold uppercase">
                  <th className="py-3 px-3">Slip ID</th>
                  <th className="py-3 px-3">Employee</th>
                  <th className="py-3 px-3">Basic Pay</th>
                  <th className="py-3 px-3">HRA</th>
                  <th className="py-3 px-3">Allowances</th>
                  <th className="py-3 px-3">Deductions</th>
                  <th className="py-3 px-3">Net Salary</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {slips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-muted/20">
                    <td className="py-3 px-3 font-mono text-muted-foreground">{slip.id}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{slip.employeeName} ({slip.employeeId})</td>
                    <td className="py-3 px-3 font-mono">₹{slip.basicPay.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 font-mono">₹{slip.hra.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 font-mono">₹{slip.allowances.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 font-mono text-red-500">-₹{slip.deductions.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600">₹{slip.netSalary.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3">
                      <Badge
                        className={
                          slip.status === "Paid"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }
                      >
                        {slip.status === "Paid" ? <CheckCircle className="size-3 mr-1 inline" /> : <Clock className="size-3 mr-1 inline" />}
                        {slip.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                        <Download className="size-3" /> Slip
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
