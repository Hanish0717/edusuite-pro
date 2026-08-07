import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReceiptItem, StudentFinanceSummary } from "../types";
import { Download, Printer, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { downloadReceiptPdf } from "../finance-pdf-utils";


interface ReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: ReceiptItem | null;
  summary: StudentFinanceSummary;
}

export function ReceiptModal({ open, onOpenChange, receipt, summary }: ReceiptModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!receipt) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadReceiptPdf(receipt, summary);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    const el = document.getElementById("receipt-modal-print-area");
    if (!el) { window.print(); return; }
    const content = el.innerHTML;
    const win = window.open("", "_blank", "width=700,height=600");
    if (!win) { window.print(); return; }
    win.document.write(`
      <html>
        <head>
          <title>Receipt ${receipt.receiptNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; padding: 32px; color: #0f172a; max-width: 600px; margin: 0 auto; }
            h1 { font-size: 16px; text-align: center; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; }
            .label { font-size: 10px; color: #94a3b8; }
            .value { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th { background: #f1f5f9; padding: 8px; text-align: left; border: 1px solid #e2e8f0; }
            td { padding: 8px; border: 1px solid #e2e8f0; }
            .total { background: #f0fdf4; font-weight: bold; color: #059669; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl">
        <DialogHeader className="space-y-1 text-left border-b pb-3 border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-600 text-white font-black grid place-items-center font-display text-sm">
                ES
              </div>
              <div>
                <DialogTitle className="text-base font-bold">
                  Official Payment Receipt &mdash; EduSuite ERP
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 font-mono">
                  {receipt.receiptNumber} &middot; AY {receipt.academicYear}
                </DialogDescription>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
              VERIFIED PAID
            </Badge>
          </div>
        </DialogHeader>

        {/* Printable area */}
        <div id="receipt-modal-print-area" className="space-y-4 my-3 text-xs">

          <div>
            <h1>EduSuite Pro University — Official Payment Receipt</h1>
          </div>

          {/* STUDENT & TRANSACTION SUMMARY */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 block text-[10px]">Student Name</span>
              <strong className="text-slate-900 dark:text-white">{summary.studentName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Roll Number</span>
              <strong className="font-mono text-blue-600">{summary.rollNumber}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Transaction Ref ID</span>
              <strong className="font-mono text-slate-800 dark:text-slate-200">{receipt.transactionId}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Payment Date</span>
              <strong className="font-mono text-slate-800 dark:text-slate-200">{receipt.paymentDate}</strong>
            </div>
          </div>

          {/* PAYMENT DETAILS TABLE */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  <th className="p-2.5">Description</th>
                  <th className="p-2.5">Semester</th>
                  <th className="p-2.5">Payment Mode</th>
                  <th className="p-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900 dark:text-white">Academic Fee & Hostel Clearance</td>
                  <td className="p-2.5 font-mono">Semester {receipt.semester}</td>
                  <td className="p-2.5 text-slate-600 dark:text-slate-400">{receipt.paymentMode}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-blue-600">₹{receipt.amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 text-[11px]">
            <span>Total Paid Amount: <strong className="text-emerald-600 font-mono font-bold text-sm">₹{receipt.amount.toLocaleString()}</strong></span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Digital Seal Verified
            </span>
          </div>

        </div>

        <DialogFooter className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrint}
              className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-700"
            >
              <Printer className="h-3.5 w-3.5" /> Print
            </Button>
            <Button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"
            >
              {isDownloading ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating...</>
              ) : (
                <><Download className="h-3.5 w-3.5" /> Download PDF</>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
