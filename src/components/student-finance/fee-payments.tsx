import React from "react";
import { StudentFinanceSummary, FeeHeadItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Smartphone,
  Building,
  Wallet,
  AlertCircle,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

interface FeePaymentsProps {
  summary: StudentFinanceSummary;
  feeHeads: FeeHeadItem[];
  onOpenPaymentModal: () => void;
}

export function FeePayments({ summary, feeHeads, onOpenPaymentModal }: FeePaymentsProps) {
  const pendingHeads = feeHeads.filter((f) => f.status !== "Paid");

  return (
    <div className="space-y-6">
      
      {/* 1. TOP CARDS (6 METRICS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/20 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-rose-600 block">Pending Amount</span>
          <div className="text-lg font-bold font-display text-rose-600 font-mono">₹{summary.pendingAmount.toLocaleString()}</div>
          <span className="text-[9px] text-rose-600 font-semibold">Due Feb 15, 2025</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Current Semester Fee</span>
          <div className="text-lg font-bold font-display text-slate-900 dark:text-white font-mono">₹60,000</div>
          <span className="text-[9px] text-slate-400">Semester V Dues</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Late Fee Charged</span>
          <div className="text-lg font-bold font-display text-emerald-600 font-mono">₹{summary.lateFeeCharged}</div>
          <span className="text-[9px] text-emerald-600 font-semibold">No Late Fees</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Convenience Fee</span>
          <div className="text-lg font-bold font-display text-blue-600 font-mono">₹{summary.convenienceCharge}</div>
          <span className="text-[9px] text-slate-400">Zero for UPI</span>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-emerald-600 block">Payment Status</span>
          <div className="text-sm font-bold text-emerald-600">{summary.paymentStatus}</div>
          <span className="text-[9px] text-emerald-600 font-semibold">Installment #4 Active</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Supported Payment Modes</span>
          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">UPI / Cards / NB</div>
          <span className="text-[9px] text-slate-400">6 Gateways</span>
        </div>
      </div>

      {/* 2. SUPPORTED PAYMENT MODES BANNER */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-600" /> Supported Payment Methods & Gateways
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Pay via GPay, PhonePe, Paytm, HDFC/SBI NetBanking, Visa, Mastercard, or NEFT.</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline" className="gap-1 border-slate-300 font-mono"><Smartphone className="h-3 w-3 text-emerald-600" /> UPI</Badge>
          <Badge variant="outline" className="gap-1 border-slate-300 font-mono"><CreditCard className="h-3 w-3 text-blue-600" /> Credit/Debit</Badge>
          <Badge variant="outline" className="gap-1 border-slate-300 font-mono"><Building className="h-3 w-3 text-purple-600" /> Net Banking</Badge>
          <Badge variant="outline" className="gap-1 border-slate-300 font-mono"><Wallet className="h-3 w-3 text-amber-600" /> Wallet</Badge>
        </div>
      </div>

      {/* 3. FEE HEADS PAYMENT TABLE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Semester V Active Fee Dues</h3>
            <p className="text-xs text-slate-500">Breakdown of pending and cleared fee components</p>
          </div>

          <Button onClick={onOpenPaymentModal} size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm">
            <CreditCard className="h-3.5 w-3.5" /> Pay All Dues (₹{summary.pendingAmount.toLocaleString()})
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold">
                <th className="p-3">Fee Head Description</th>
                <th className="p-3">Category</th>
                <th className="p-3">Amount (₹)</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Late Fee</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {feeHeads.map((head) => (
                <tr key={head.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3">
                    <h4 className="font-bold text-slate-900 dark:text-white">{head.feeHead}</h4>
                    <p className="text-[10px] text-slate-400">{head.description}</p>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-[10px]">{head.category}</Badge>
                  </td>
                  <td className="p-3 font-bold font-mono text-slate-900 dark:text-white text-xs">
                    ₹{head.amount.toLocaleString()}
                  </td>
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{head.dueDate}</td>
                  <td className="p-3 font-mono text-emerald-600 font-bold">₹{head.lateFee}</td>
                  <td className="p-3">
                    <Badge className={head.status === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                      {head.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    {head.status === "Paid" ? (
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Cleared
                      </span>
                    ) : (
                      <Button size="sm" onClick={onOpenPaymentModal} className="h-7 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                        Pay Dues
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
