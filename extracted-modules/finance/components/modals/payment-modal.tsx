import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreditCard, QrCode, Building, Wallet, Smartphone, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";
import { StudentFinanceSummary } from "../types";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: StudentFinanceSummary;
  onSuccess: (amount: number) => void;
}

export function PaymentModal({ open, onOpenChange, summary, onSuccess }: PaymentModalProps) {
  const [paymentType, setPaymentType] = useState<"full" | "partial" | "installment">("full");
  const [customAmount, setCustomAmount] = useState<number>(summary.pendingAmount);
  const [selectedMode, setSelectedMode] = useState<"upi" | "card" | "netbanking" | "wallet">("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  const convenienceFee = selectedMode === "card" ? 150 : 0;
  const payAmount = paymentType === "full" ? summary.pendingAmount : customAmount;
  const totalPayable = payAmount + convenienceFee;

  const handlePayNow = () => {
    if (totalPayable <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(payAmount);
      onOpenChange(false);
      toast.success(`Payment of ₹${totalPayable.toLocaleString()} successful! Receipt generated.`);
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl">
        <DialogHeader className="space-y-1 text-left border-b pb-3 border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-600" /> Secure Online Fee Gateway
            </DialogTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono">
              256-BIT ENCRYPTED
            </Badge>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            Select payment type and payment gateway method to complete transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2 text-xs">
          
          {/* PAYMENT TYPE TOGGLE */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block">Select Payment Mode Option</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setPaymentType("full");
                  setCustomAmount(summary.pendingAmount);
                }}
                className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                  paymentType === "full"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Full Due (₹{summary.pendingAmount.toLocaleString()})
              </button>
              <button
                type="button"
                onClick={() => setPaymentType("partial")}
                className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                  paymentType === "partial"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Custom / Partial
              </button>
            </div>
          </div>

          {/* CUSTOM AMOUNT INPUT */}
          {paymentType === "partial" && (
            <div className="space-y-1">
              <label className="text-slate-500 font-semibold">Enter Amount to Pay (₹)</label>
              <Input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                className="h-9 rounded-xl font-mono text-sm"
              />
            </div>
          )}

          {/* PAYMENT METHOD SELECTION */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block">Payment Gateway Provider</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMode("upi")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  selectedMode === "upi"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-600"
                    : "border-slate-200 dark:border-slate-800 text-slate-600"
                }`}
              >
                <Smartphone className="h-4 w-4" />
                <span className="text-[10px] font-bold">UPI / GPay</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode("card")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  selectedMode === "card"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-600"
                    : "border-slate-200 dark:border-slate-800 text-slate-600"
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span className="text-[10px] font-bold">Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode("netbanking")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  selectedMode === "netbanking"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-600"
                    : "border-slate-200 dark:border-slate-800 text-slate-600"
                }`}
              >
                <Building className="h-4 w-4" />
                <span className="text-[10px] font-bold">NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode("wallet")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  selectedMode === "wallet"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-600"
                    : "border-slate-200 dark:border-slate-800 text-slate-600"
                }`}
              >
                <Wallet className="h-4 w-4" />
                <span className="text-[10px] font-bold">Wallets</span>
              </button>
            </div>
          </div>

          {/* TOTAL BREAKDOWN */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
            <div className="flex justify-between text-slate-500">
              <span>Selected Fee Amount:</span>
              <strong className="font-mono text-slate-900 dark:text-white">₹{payAmount.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Convenience Charge:</span>
              <strong className="font-mono text-slate-900 dark:text-white">₹{convenienceFee}</strong>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-700">
              <span>Total Amount Payable:</span>
              <span className="font-mono text-blue-600 text-sm">₹{totalPayable.toLocaleString()}</span>
            </div>
          </div>

        </div>

        <DialogFooter className="pt-2 gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl text-xs">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handlePayNow}
            disabled={isProcessing}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"
          >
            {isProcessing ? "Connecting to Gateway..." : `Pay ₹${totalPayable.toLocaleString()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
