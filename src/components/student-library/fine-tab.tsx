import React, { useState } from "react";
import { FineRecordItem } from "./types";
import { CreditCard, Download, ShieldCheck, ShieldAlert, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FineNoticeModal } from "./fine-notice-modal";
import { FineRecordModal } from "./fine-record-modal";

interface FineTabProps {
  fines: FineRecordItem[];
}

export function FineTab({ fines }: FineTabProps) {
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [selectedFineForRecord, setSelectedFineForRecord] = useState<FineRecordItem | null>(null);

  const pendingFines = fines.filter((f) => f.status === "Pending");
  const totalPending = pendingFines.reduce((sum, f) => sum + f.fineAmount, 0);

  return (
    <div className="space-y-6">
      {/* FINE SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Fine Total</span>
            <ShieldAlert className="h-5 w-5 text-rose-600" />
          </div>
          <p className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
            ₹{totalPending.toFixed(2)}
          </p>
          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
            Overdue Rate: ₹5.00 / late day
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fine Status</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {totalPending > 0 ? `${pendingFines.length} Overdue Penalty Recorded` : "Account Good Standing"}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Clear fines at library accounts counter to maintain borrowing privilege.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-2 flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Accounts Standing</span>
          <Button
            onClick={() => setNoticeModalOpen(true)}
            className="w-full rounded-xl text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold h-9 gap-1.5"
          >
            <CreditCard className="h-4 w-4" /> Fine Notice Info
          </Button>
        </div>
      </div>

      {/* FINES TABLE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs space-y-3">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
            Fine Transactions Ledger ({fines.length})
          </h4>
        </div>

        {fines.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 font-mono">Fine ID</th>
                  <th className="py-3 px-4">Book Title</th>
                  <th className="py-3 px-4 font-mono">Due Date</th>
                  <th className="py-3 px-4 font-mono">Late Days</th>
                  <th className="py-3 px-4 font-mono">Rate/Day</th>
                  <th className="py-3 px-4 font-mono">Total Fine</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right font-sans">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {fines.map((fine) => (
                  <tr key={fine.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{fine.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                      {fine.bookTitle}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{fine.dueDate}</td>
                    <td className="py-3 px-4 font-mono font-bold text-rose-600">{fine.lateDays} Days</td>
                    <td className="py-3 px-4 font-mono text-slate-500">₹{fine.ratePerDay.toFixed(2)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      ₹{fine.fineAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={`text-[9px] font-mono ${
                          fine.status === "Pending"
                            ? "bg-rose-500 text-white font-bold"
                            : "bg-emerald-500 text-white"
                        }`}
                      >
                        {fine.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        onClick={() => setSelectedFineForRecord(fine)}
                        size="sm"
                        variant="outline"
                        className="rounded-xl text-[11px] font-semibold h-8 gap-1 border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                      >
                        <FileText className="h-3.5 w-3.5" /> Record
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center border-t border-slate-100 dark:border-slate-800 space-y-2">
            <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">No fines recorded</h4>
            <p className="text-xs text-slate-500 font-medium">
              Your library account is in good standing with zero pending fees.
            </p>
          </div>
        )}
      </div>

      {/* READ ONLY DYNAMIC MODALS */}
      <FineNoticeModal
        open={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
        fine={pendingFines[0] || fines[0] || null}
      />

      <FineRecordModal
        open={!!selectedFineForRecord}
        onClose={() => setSelectedFineForRecord(null)}
        fine={selectedFineForRecord}
      />
    </div>
  );
}
