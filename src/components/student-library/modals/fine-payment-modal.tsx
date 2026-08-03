import React, { useState } from "react";
import { FineRecordItem } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, ShieldCheck, QrCode } from "lucide-react";
import { toast } from "sonner";

interface FinePaymentModalProps {
  fine: FineRecordItem | null;
  onClose: () => void;
  onConfirmPayment: (fineId: string) => void;
}

export function FinePaymentModal({ fine, onClose, onConfirmPayment }: FinePaymentModalProps) {
  const [method, setMethod] = useState<"UPI" | "Card" | "NetBanking">("UPI");
  const [loading, setLoading] = useState(false);

  if (!fine) return null;

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      onConfirmPayment(fine.id);
      setLoading(false);
      toast.success(`Payment of ₹${fine.amount.toFixed(2)} successful! Receipt generated.`);
      onClose();
    }, 800);
  };

  return (
    <Dialog open={!!fine} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader className="text-left border-b pb-3 border-slate-100 dark:border-slate-800">
          <DialogTitle className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-rose-600" /> Pay Library Fine
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Secure gateway payment for overdue charges & library penalties.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Fine ID:</span>
              <span className="font-mono text-slate-900 dark:text-white font-bold">{fine.id}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Item:</span>
              <span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{fine.bookTitle}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Reason:</span>
              <span className="text-rose-600 font-medium">{fine.reason}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between items-center">
              <span className="font-bold text-slate-900 dark:text-white">Total Payable:</span>
              <span className="text-lg font-black text-rose-600 font-mono">₹{fine.amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Select Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {(["UPI", "Card", "NetBanking"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                    method === m
                      ? "border-purple-600 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {m === "UPI" && "GPay / UPI"}
                  {m === "Card" && "Debit / Credit"}
                  {m === "NetBanking" && "Net Banking"}
                </button>
              ))}
            </div>
          </div>

          {method === "UPI" && (
            <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <QrCode className="h-7 w-7 text-purple-600" />
              </div>
              <div className="text-[11px]">
                <p className="font-bold text-slate-900 dark:text-white">Scan or Enter UPI ID</p>
                <p className="text-slate-500 font-mono">edusuite.library@icici</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 border-t pt-3 border-slate-100 dark:border-slate-800">
          <Button onClick={onClose} variant="outline" className="rounded-xl text-xs">
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={handlePay}
            className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5"
          >
            <ShieldCheck className="h-4 w-4" />
            {loading ? "Processing Payment..." : `Pay ₹${fine.amount.toFixed(2)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
