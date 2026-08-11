import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, HelpCircle, Send } from "lucide-react";
import { toast } from "sonner";

interface FinanceQueryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinanceQueryModal({ open, onOpenChange }: FinanceQueryModalProps) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) {
      toast.error("Please fill in subject and query details");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      toast.success("Finance ticket lodged (Ticket #FIN-9012). Officer assigned.");
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" /> Raise Finance Query Ticket
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Submit a ticket directly to the Accounts & Finance Accounts desk.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-2 text-xs">
          <div className="space-y-1">
            <label className="text-slate-500 font-semibold">Query Category / Subject</label>
            <Input
              placeholder="e.g. Fee Mismatch, Payment Receipt missing..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-9 rounded-xl text-xs"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 font-semibold">Detailed Query Description</label>
            <textarea
              placeholder="Explain your payment issue or installment request..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-xs"
              required
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5">
              {isSubmitting ? "Lodging Ticket..." : "Submit Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
