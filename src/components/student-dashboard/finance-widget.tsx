import React from "react";
import { Wallet, CreditCard, Award, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinanceWidgetProps {
  paidAmount: number;
  pendingAmount: number;
  scholarshipAmount: number;
  dueDate: string;
  onPayNow: () => void;
}

export const FinanceWidget: React.FC<FinanceWidgetProps> = ({
  paidAmount,
  pendingAmount,
  scholarshipAmount,
  dueDate,
  onPayNow,
}) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Wallet className="h-4 w-4 text-primary" /> Finance Snapshot
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-600">
          Due Date: {dueDate}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg border border-border/80 bg-emerald-500/[0.04] space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <CreditCard className="h-3 w-3 text-emerald-500" /> Fees Paid
          </span>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            ₹{paidAmount.toLocaleString()}
          </div>
        </div>

        <div className="p-3 rounded-lg border border-border/80 bg-rose-500/[0.04] space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Wallet className="h-3 w-3 text-rose-500" /> Pending
          </span>
          <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
            ₹{pendingAmount.toLocaleString()}
          </div>
        </div>

        <div className="p-3 rounded-lg border border-border/80 bg-amber-500/[0.04] space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Award className="h-3 w-3 text-amber-500" /> Scholarship
          </span>
          <div className="text-sm font-bold text-amber-600 dark:text-amber-400">
            ₹{scholarshipAmount.toLocaleString()}
          </div>
        </div>
      </div>

      <Button
        variant="default"
        size="sm"
        onClick={onPayNow}
        className="w-full text-xs gap-1 h-9"
      >
        Pay Fees Now <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};
