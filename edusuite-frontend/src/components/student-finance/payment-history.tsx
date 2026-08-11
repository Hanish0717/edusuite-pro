import React, { useState } from "react";
import { PaymentRecordItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, FileSpreadsheet, Printer, Eye } from "lucide-react";
import { toast } from "sonner";

interface PaymentHistoryProps {
  payments: PaymentRecordItem[];
  onOpenReceiptModal: (receipt: any) => void;
}

export function PaymentHistory({ payments, onOpenReceiptModal }: PaymentHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [modeFilter, setModeFilter] = useState("All");

  const modes = ["All", "UPI", "Credit Card", "Debit Card", "Net Banking", "Bank Transfer"];

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.feeHead.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = modeFilter === "All" || p.paymentMode === modeFilter;
    return matchesSearch && matchesMode;
  });

  return (
    <div className="space-y-6">
      
      {/* LEDGER CARD */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        
        {/* TOOLBAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search transaction ID, ref number or fee head..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-xs rounded-xl"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1">
              {modes.map((m) => (
                <button
                  key={m}
                  onClick={() => setModeFilter(m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    modeFilter === m
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <Button onClick={() => toast.success("Exported Payment History Ledger to Excel (.xlsx)")} size="sm" variant="outline" className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-700">
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" /> Export Excel
            </Button>
          </div>
        </div>

        {/* LEDGER TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold">
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Fee Component</th>
                <th className="p-3">Payment Mode</th>
                <th className="p-3">Reference No</th>
                <th className="p-3">Semester</th>
                <th className="p-3">Amount (₹)</th>
                <th className="p-3">Status</th>
                <th className="p-3">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((tx) => (
                <tr key={tx.transactionId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-blue-600">{tx.transactionId}</td>
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{tx.date}</td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">{tx.feeHead}</td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-[10px]">{tx.paymentMode}</Badge>
                  </td>
                  <td className="p-3 font-mono text-slate-500">{tx.referenceNumber}</td>
                  <td className="p-3 font-mono">Sem {tx.semester}</td>
                  <td className="p-3 font-bold font-mono text-emerald-600 text-xs">₹{tx.amount.toLocaleString()}</td>
                  <td className="p-3">
                    <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">{tx.status}</Badge>
                  </td>
                  <td className="p-3">
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600 p-1 gap-1" onClick={() => onOpenReceiptModal({
                      receiptNumber: tx.receiptNumber,
                      transactionId: tx.transactionId,
                      amount: tx.amount,
                      paymentDate: tx.date,
                      paymentMode: tx.paymentMode,
                      academicYear: "2024 - 2025",
                      semester: tx.semester,
                      qrVerified: true
                    })}>
                      <Eye className="h-3 w-3" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
