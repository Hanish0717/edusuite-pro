import React from "react";
import { FineRecordItem } from "./types";
import { CreditCard, ShieldCheck, Download, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface FineTabProps {
  fines: FineRecordItem[];
  onOpenFinePaymentModal: (fine: FineRecordItem) => void;
}

export function FineTab({ fines, onOpenFinePaymentModal }: FineTabProps) {
  const pendingFines = fines.filter((f) => f.status === "Pending");
  const completedFines = fines.filter((f) => f.status !== "Pending");

  const totalPendingAmount = pendingFines.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* HEADER SUMMARY CARD */}
      <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-950/40 bg-gradient-to-r from-rose-50 to-pink-50/50 dark:from-rose-950/20 dark:to-slate-900 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500 text-white shadow-md">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Outstanding Library Fines</h3>
            <p className="text-xs text-slate-500">Overdue fees, barcode damage and library administrative charges</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Total Payable</span>
            <strong className="text-xl font-black text-rose-600 font-mono">₹{totalPendingAmount.toFixed(2)}</strong>
          </div>
          {pendingFines.length > 0 && (
            <Button
              onClick={() => onOpenFinePaymentModal(pendingFines[0])}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-10 px-5 shadow-md gap-1.5"
            >
              <ShieldCheck className="h-4 w-4" /> Pay All Outstanding
            </Button>
          )}
        </div>
      </div>

      {/* FINES TABLE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
            Fine Transactions Ledger ({fines.length})
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 font-mono">Fine ID</th>
                <th className="py-3 px-4">Book Title</th>
                <th className="py-3 px-4">Reason / Penalty</th>
                <th className="py-3 px-4 font-mono">Amount</th>
                <th className="py-3 px-4 font-mono">Date Incurred</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action / Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {fines.map((fine) => (
                <tr key={fine.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500">{fine.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">{fine.bookTitle}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{fine.reason}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">₹{fine.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{fine.dateIncurred}</td>
                  <td className="py-3 px-4">
                    <Badge
                      className={`text-[9px] font-mono ${
                        fine.status === "Pending"
                          ? "bg-rose-500 text-white animate-pulse"
                          : fine.status === "Paid"
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-500 text-white"
                      }`}
                    >
                      {fine.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {fine.status === "Pending" ? (
                      <Button
                        onClick={() => onOpenFinePaymentModal(fine)}
                        size="sm"
                        className="rounded-xl text-[11px] bg-rose-600 hover:bg-rose-700 text-white font-bold h-8"
                      >
                        Pay Now
                      </Button>
                    ) : (
                      <Button
                        onClick={() => toast.success(`Downloaded Receipt ${fine.transactionId || fine.id}`)}
                        size="sm"
                        variant="outline"
                        className="rounded-xl text-[11px] font-semibold h-8 gap-1"
                      >
                        <Download className="h-3.5 w-3.5 text-purple-600" /> Receipt
                      </Button>
                    )}
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
