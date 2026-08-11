import React from "react";
import { BorrowHistoryItem } from "./types";
import { History, Download, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface HistoryTabProps {
  history: BorrowHistoryItem[];
}

export function HistoryTab({ history }: HistoryTabProps) {
  const handleDownloadReceipt = (receiptId: string, title: string) => {
    toast.success(`Downloaded Official Return Receipt ${receiptId} for "${title}".`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <History className="h-5 w-5 text-purple-600" /> Previously Issued Books History ({history.length})
          </h3>
          <p className="text-xs text-slate-500">
            Complete transaction record of previously borrowed items & receipts.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Book Details</th>
                <th className="py-3 px-4 font-mono">Issued Date</th>
                <th className="py-3 px-4 font-mono">Returned Date</th>
                <th className="py-3 px-4 font-mono">Fine Charged</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 dark:text-white max-w-xs truncate">{item.title}</p>
                    <p className="text-[11px] text-slate-500 font-mono">Author: {item.author} • ISBN: {item.isbn}</p>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">{item.issuedDate}</td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">{item.returnedDate}</td>
                  <td className="py-3 px-4 font-mono">
                    {item.finePaid > 0 ? (
                      <span className="text-rose-600 font-bold">₹{item.finePaid.toFixed(2)}</span>
                    ) : (
                      <span className="text-emerald-600">₹0.00</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-mono ${
                        item.status === "Returned"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      onClick={() => handleDownloadReceipt(item.receiptId, item.title)}
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-[11px] font-semibold h-8 gap-1"
                    >
                      <Download className="h-3.5 w-3.5 text-purple-600" /> Receipt
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
