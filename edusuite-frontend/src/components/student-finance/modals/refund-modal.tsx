import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Building, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

interface RefundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (refund: any) => void;
}

export function RefundModal({ open, onOpenChange, onSuccess }: RefundModalProps) {
  const [amount, setAmount] = useState<number>(2000);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast.error("Please provide refund request justification");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess({
        requestId: `REF-2025-${Math.floor(100 + Math.random() * 900)}`,
        amount,
        reason,
        submittedDate: "Feb 01, 2025",
        approvalStatus: "Under Review",
        processingStage: "Document Audit",
        expectedRefundDate: "Feb 15, 2025",
      });
      onOpenChange(false);
      toast.success("Refund request lodged. Audit stage pending approval.");
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-amber-600" /> Request Fee Refund
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Submit a claim for duplicate payments, caution deposits or fee adjustments.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-2 text-xs">
          
          <div className="space-y-1">
            <label className="text-slate-500 font-semibold">Claim Amount (₹)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="h-9 rounded-xl font-mono text-xs"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 font-semibold">Reason for Refund</label>
            <textarea
              placeholder="Describe reason (e.g. Duplicate payment, hostel caution deposit refund...)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-20 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-xs"
              required
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs gap-1.5">
              {isSubmitting ? "Submitting..." : "Submit Refund Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
