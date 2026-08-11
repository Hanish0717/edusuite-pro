import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, QrCode, Building, CheckCircle2, ShieldCheck, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface PayFeesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  onPaymentSuccess: () => void;
}

export function PayFeesModal({ open, onOpenChange, amount, onPaymentSuccess }: PayFeesModalProps) {
  const [method, setMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success("Payment completed successfully! Official ERP Receipt generated.");
      onPaymentSuccess();
    }, 1200);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" /> EduSuite Payment Gateway
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Encrypted PCI-DSS compliant fee collection portal for Academic Term 2024-25.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-6 text-center space-y-3">
            <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Payment Successful!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Receipt <strong className="font-mono text-slate-800 dark:text-slate-200">#RCP-2025-00918</strong> has been emailed to your registered address.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-left text-xs font-mono border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between"><span>Amount Paid:</span><strong className="text-emerald-600">₹ {amount.toLocaleString()}</strong></div>
              <div className="flex justify-between"><span>Transaction ID:</span><span>TXN998124019</span></div>
              <div className="flex justify-between"><span>Date & Time:</span><span>{new Date().toLocaleString()}</span></div>
            </div>
            <Button onClick={handleClose} className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
              Done & View Updated Ledger
            </Button>
          </div>
        ) : (
          <div className="space-y-4 my-2">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Total Payable Amount</span>
                <span className="text-2xl font-black font-display text-slate-900 dark:text-white">
                  ₹ {amount > 0 ? amount.toLocaleString() : "75,000"}
                </span>
              </div>
              <Badge className="bg-blue-500/10 text-blue-600 font-semibold">Semester V Tuition</Badge>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Payment Method</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod("upi")}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    method === "upi"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <QrCode className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-xs font-bold block">UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("card")}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    method === "card"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <CreditCard className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-xs font-bold block">Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("netbanking")}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    method === "netbanking"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Building className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-xs font-bold block">NetBanking</span>
                </button>
              </div>
            </div>

            {method === "upi" && (
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-center text-xs space-y-2">
                <QrCode className="h-28 w-28 text-slate-800 mx-auto bg-white p-2 rounded-lg shadow-sm" />
                <p className="text-[11px] text-slate-500 font-medium">Scan with GPay, PhonePe, Paytm, or BHIM</p>
                <div className="font-mono font-bold text-blue-600 text-xs">edusuite.campus@hdfcbank</div>
              </div>
            )}

            <DialogFooter className="pt-2 gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button
                onClick={handlePay}
                disabled={isProcessing}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm shadow-emerald-500/20"
              >
                {isProcessing ? "Authorizing Payment..." : `Proceed to Pay ₹ ${(amount || 75000).toLocaleString()}`}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
