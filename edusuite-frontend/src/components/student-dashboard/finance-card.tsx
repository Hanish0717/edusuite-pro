import React from "react";
import { FinanceSnapshot } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, IndianRupee, ShieldCheck, ChevronRight } from "lucide-react";

interface FinanceCardProps {
  finance: FinanceSnapshot;
  onNavigate: (route: string) => void;
}

export function StudentFinanceCard({ finance, onNavigate }: FinanceCardProps) {
  const isPaid = finance.pendingAmount === 0;

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 flex flex-col justify-between">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <IndianRupee className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Fee & Payment Ledger
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Academic Year 2024 - 2025 Statement
            </p>
          </div>
        </div>

        <Badge
          className={`text-[10px] font-mono px-2 py-0.5 ${
            isPaid
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-600 border-rose-500/20"
          }`}
        >
          {isPaid ? "✓ ZERO DUES" : "PENDING DUES"}
        </Badge>
      </div>

      {/* METRICS DISPLAY */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 block">Pending Outstanding Amount</span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
              ₹{finance.pendingAmount.toLocaleString()}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Total Fee: ₹{finance.totalFees.toLocaleString()}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs flex items-center justify-between">
          <span className="text-emerald-700 dark:text-emerald-300 font-medium truncate">
            {finance.scholarshipStatus}
          </span>
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-400 block">Next Due Date</span>
            <strong className="font-mono font-bold text-slate-900 dark:text-white">
              {finance.dueDate}
            </strong>
          </div>
          <div className="p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-400 block">Late Fine Amount</span>
            <strong className="font-mono font-bold text-emerald-600">
              ₹{finance.fineAmount}
            </strong>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <Button
        onClick={() => onNavigate("/student/finance")}
        className="w-full h-9 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 shadow-xs"
      >
        Open Finance Portal <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
