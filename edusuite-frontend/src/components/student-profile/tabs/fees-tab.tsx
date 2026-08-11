import React from "react";
import { StudentProfileData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, CheckCircle2, Download, CreditCard, ShieldCheck, Sparkles } from "lucide-react";

interface FeesTabProps {
  student: StudentProfileData;
  onPayFees: () => void;
}

export function FeesTab({ student, onPayFees }: FeesTabProps) {
  const f = student.feesSummary;

  return (
    <div className="space-y-6">
      
      {/* 1. FINANCIAL SUMMARY METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Academic Fee</span>
          <div className="text-xl font-bold font-display text-slate-900 dark:text-white">
            ₹ {f.totalFee.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Semester 5 Annual Ledger</span>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-emerald-600">Total Paid Amount</span>
          <div className="text-xl font-bold font-display text-emerald-600">
            ₹ {f.paidFee.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Cleared</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Pending Dues</span>
          <div className="text-xl font-bold font-display text-slate-900 dark:text-white">
            ₹ {f.pendingFee.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600">Zero Due Balance</span>
        </div>

        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/20 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-amber-600">Merit Scholarship Grant</span>
          <div className="text-xl font-bold font-display text-amber-600">
            ₹ {f.scholarshipConcession.toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold">State Govt Excellence</span>
        </div>

      </div>

      {/* 2. PAYMENT TRANSACTIONS TABLE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-600" /> Payment Receipt History & Ledger
            </h4>
            <p className="text-xs text-slate-500">Official digital receipts with bank transaction references</p>
          </div>

          <Button onClick={onPayFees} size="sm" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm">
            <DollarSign className="h-3.5 w-3.5" /> Make Fee Payment
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/50">
                <th className="p-3 rounded-l-xl">Receipt No</th>
                <th className="p-3">Payment Date</th>
                <th className="p-3">Payment Mode</th>
                <th className="p-3">Description</th>
                <th className="p-3">Amount</th>
                <th className="p-3 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {f.transactions.map((tx) => (
                <tr key={tx.receiptNo} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-blue-600">{tx.receiptNo}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{tx.date}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{tx.mode}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{tx.description}</td>
                  <td className="p-3 font-bold font-mono text-emerald-600">₹ {tx.amount.toLocaleString()}</td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => alert(`Downloading Receipt ${tx.receiptNo} PDF...`)}
                      className="h-7 text-xs text-blue-600 hover:text-blue-700 p-1.5 gap-1"
                    >
                      <Download className="h-3.5 w-3.5" /> Receipt
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
