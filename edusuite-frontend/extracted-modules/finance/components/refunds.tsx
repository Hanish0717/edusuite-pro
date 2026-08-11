import React from "react";
import { RefundRequestItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw, Plus, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

interface RefundsProps {
  refunds: RefundRequestItem[];
  onOpenRefundModal: () => void;
}

export function Refunds({ refunds, onOpenRefundModal }: RefundsProps) {
  return (
    <div className="space-y-6">
      
      {/* 1. TOP CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/20 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-amber-600 block">Total Refund Claims</span>
          <div className="text-lg font-bold font-display text-amber-600 font-mono">₹7,000</div>
          <span className="text-[9px] text-amber-600 font-semibold">2 Requests Total</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Active Status</span>
          <div className="text-sm font-bold text-blue-600">Document Audit</div>
          <span className="text-[9px] text-slate-400">1 Request Under Review</span>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-emerald-600 block">Processed Refunds</span>
          <div className="text-lg font-bold font-display text-emerald-600 font-mono">₹5,000</div>
          <span className="text-[9px] text-emerald-600 font-semibold">Credited to Bank</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Expected Refund Date</span>
          <div className="text-xs font-bold text-slate-900 dark:text-white font-mono mt-1">Feb 15, 2025</div>
          <span className="text-[9px] text-slate-400">Next Audit Dispatch</span>
        </div>
      </div>

      {/* 2. TABLE & REQUEST REFUND TOOLBAR */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-amber-600" /> Fee Refund & Adjustment Tracker
            </h3>
            <p className="text-xs text-slate-500">Track status of fee returns, caution deposit refunds and overpayments</p>
          </div>

          <Button onClick={onOpenRefundModal} size="sm" className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs gap-1.5 shadow-sm">
            <Plus className="h-3.5 w-3.5" /> Submit Refund Claim
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold">
                <th className="p-3">Request ID</th>
                <th className="p-3">Claim Reason</th>
                <th className="p-3">Amount (₹)</th>
                <th className="p-3">Submitted Date</th>
                <th className="p-3">Processing Stage</th>
                <th className="p-3">Expected Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {refunds.map((ref) => (
                <tr key={ref.requestId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-amber-600">{ref.requestId}</td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">{ref.reason}</td>
                  <td className="p-3 font-bold font-mono text-slate-900 dark:text-white text-xs">₹{ref.amount.toLocaleString()}</td>
                  <td className="p-3 font-mono text-slate-500">{ref.submittedDate}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{ref.processingStage}</td>
                  <td className="p-3 font-mono text-slate-500">{ref.expectedRefundDate}</td>
                  <td className="p-3">
                    <Badge className={ref.approvalStatus === "Processed" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                      {ref.approvalStatus}
                    </Badge>
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
