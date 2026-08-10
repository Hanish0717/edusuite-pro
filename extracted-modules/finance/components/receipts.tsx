import React from "react";
import { ReceiptItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Printer, Mail, QrCode, Eye, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ReceiptsProps {
  receipts: ReceiptItem[];
  onOpenReceiptModal: (receipt: ReceiptItem) => void;
}

export function Receipts({ receipts, onOpenReceiptModal }: ReceiptsProps) {
  return (
    <div className="space-y-6">
      
      {/* 1. TOP METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Latest Receipt No</span>
          <div className="text-sm font-bold text-blue-600 font-mono">REC-2025-0091</div>
          <span className="text-[9px] text-slate-400">Issued Jan 14, 2025</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Total Issued Receipts</span>
          <div className="text-lg font-bold font-display text-emerald-600 font-mono">{receipts.length} Receipts</div>
          <span className="text-[9px] text-emerald-600 font-semibold">100% Tax Compliant</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Financial Year</span>
          <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">FY 2024 - 2025</div>
          <span className="text-[9px] text-slate-400">Autonomous Branch</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">QR Verification</span>
          <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> All Verified
          </div>
          <span className="text-[9px] text-slate-400">Digital Seal Active</span>
        </div>
      </div>

      {/* 2. RECEIPTS TABLE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" /> Digital Payment Receipts Vault
          </h3>
          <Button onClick={() => toast.success("Downloading zip archive of all receipts...")} size="sm" variant="outline" className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-700">
            <Download className="h-3.5 w-3.5 text-blue-600" /> Download All (.ZIP)
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold">
                <th className="p-3">Receipt Number</th>
                <th className="p-3">Transaction Ref</th>
                <th className="p-3">Amount (₹)</th>
                <th className="p-3">Payment Date</th>
                <th className="p-3">Payment Mode</th>
                <th className="p-3">Verification</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {receipts.map((rec) => (
                <tr key={rec.receiptNumber} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-blue-600">{rec.receiptNumber}</td>
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{rec.transactionId}</td>
                  <td className="p-3 font-bold font-mono text-emerald-600 text-xs">₹{rec.amount.toLocaleString()}</td>
                  <td className="p-3 font-mono text-slate-500">{rec.paymentDate}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{rec.paymentMode}</td>
                  <td className="p-3">
                    <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px] gap-1">
                      <CheckCircle2 className="h-3 w-3" /> QR Validated
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600 p-1" onClick={() => onOpenReceiptModal(rec)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-emerald-600 p-1" onClick={() => toast.success(`Downloading PDF for ${rec.receiptNumber}`)}>
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-slate-500 p-1" onClick={() => window.print()}>
                        <Printer className="h-3.5 w-3.5" />
                      </Button>
                    </div>
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
