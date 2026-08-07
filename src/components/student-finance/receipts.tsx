import { useState } from "react";
import { ReceiptItem, StudentFinanceSummary } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Printer, Eye, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { downloadReceiptPdf } from "./finance-pdf-utils";

interface ReceiptsProps {
  receipts: ReceiptItem[];
  summary: StudentFinanceSummary;
  onOpenReceiptModal: (receipt: ReceiptItem) => void;
}

export function Receipts({ receipts, summary, onOpenReceiptModal }: ReceiptsProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadReceipt = async (rec: ReceiptItem) => {
    setDownloadingId(rec.receiptNumber);
    try {
      await downloadReceiptPdf(rec, summary);
    } finally {
      setDownloadingId(null);
    }
  };


  const handlePrintReceipt = (rec: ReceiptItem) => {
    const win = window.open("", "_blank", "width=700,height=600");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Receipt ${rec.receiptNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; padding: 32px; color: #0f172a; max-width: 600px; margin: 0 auto; }
            h1 { font-size: 16px; text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 8px; }
            .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f1f5f9; }
            .label { color: #94a3b8; font-size: 10px; }
            .value { font-weight: bold; }
            .total { margin-top: 16px; background: #f0fdf4; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; font-weight: bold; color: #059669; }
          </style>
        </head>
        <body>
          <h1>EduSuite Pro University — Payment Receipt</h1>
          <div class="row"><div><div class="label">Receipt Number</div><div class="value">${rec.receiptNumber}</div></div><div><div class="label">Date</div><div class="value">${rec.paymentDate}</div></div></div>
          <div class="row"><div><div class="label">Transaction ID</div><div class="value">${rec.transactionId}</div></div><div><div class="label">Mode</div><div class="value">${rec.paymentMode}</div></div></div>
          <div class="row"><div><div class="label">Academic Year</div><div class="value">${rec.academicYear}</div></div><div><div class="label">Semester</div><div class="value">Semester ${rec.semester}</div></div></div>
          <div class="total"><span>Total Amount Paid</span><span>₹ ${rec.amount.toLocaleString()}</span></div>
          <p style="text-align:center;margin-top:24px;font-size:10px;color:#94a3b8;">Computer generated receipt — EduSuite Pro University, Hyderabad</p>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

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
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-600" /> Digital Payment Receipts Vault
        </h3>

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
              {receipts.map((rec) => {
                const isThisDownloading = downloadingId === rec.receiptNumber;
                return (
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
                        {/* Eye — opens modal preview */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-blue-600 p-1"
                          title="Preview Receipt"
                          onClick={() => onOpenReceiptModal(rec)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {/* Download — generates PDF */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-emerald-600 p-1"
                          title="Download Receipt PDF"
                          disabled={isThisDownloading}
                          onClick={() => handleDownloadReceipt(rec)}
                        >
                          {isThisDownloading
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <Download className="h-3.5 w-3.5" />
                          }
                        </Button>
                        {/* Print — opens isolated print window */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-slate-500 p-1"
                          title="Print Receipt"
                          onClick={() => handlePrintReceipt(rec)}
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
