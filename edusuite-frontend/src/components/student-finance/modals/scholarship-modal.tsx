import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Award, Upload, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface ScholarshipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (scholarship: any) => void;
}

export function ScholarshipModal({ open, onOpenChange, onSuccess }: ScholarshipModalProps) {
  const [scholarshipName, setScholarshipName] = useState("");
  const [category, setCategory] = useState<"Government Scheme" | "Institution Scholarship" | "Merit Scholarship">("Government Scheme");
  const [amount, setAmount] = useState<number>(30000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scholarshipName) {
      toast.error("Please enter scholarship scheme name");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess({
        id: `SCH-${Date.now()}`,
        name: scholarshipName,
        category,
        approvedAmount: amount,
        status: "Under Verification font-mono",
        approvalStage: "Document Verification",
        renewalDate: "Aug 2025",
        appliedDate: "Feb 01, 2025",
        disbursedAmount: 0,
      });
      onOpenChange(false);
      toast.success("Scholarship application submitted for finance committee review!");
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" /> Apply for Financial Scholarship
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Submit your scholarship application and supporting Income / Merit certificates.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-2 text-xs">
          
          <div className="space-y-1">
            <label className="text-slate-500 font-semibold">Scholarship Scheme Name</label>
            <Input
              placeholder="e.g. National Merit Higher Ed Scholarship"
              value={scholarshipName}
              onChange={(e) => setScholarshipName(e.target.value)}
              className="h-9 rounded-xl text-xs"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 font-semibold">Scholarship Category</label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs"
            >
              <option value="Government Scheme">Government Scheme</option>
              <option value="Institution Scholarship">Institution Scholarship</option>
              <option value="Merit Scholarship">Merit Scholarship</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 font-semibold">Estimated Grant Amount (₹)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="h-9 rounded-xl font-mono text-xs"
            />
          </div>

          {/* FILE UPLOAD SIMULATION */}
          <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-1">
            <Upload className="h-4 w-4 mx-auto text-purple-600" />
            <span className="text-slate-600 dark:text-slate-300 font-semibold block">Upload Supporting Certificates (PDF)</span>
            <span className="text-[10px] text-slate-400">Income Certificate, Marksheet & Aadhaar Card</span>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5">
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
