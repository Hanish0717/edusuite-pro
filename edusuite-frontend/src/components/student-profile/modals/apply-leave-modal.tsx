import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, Send } from "lucide-react";
import { toast } from "sonner";

interface ApplyLeaveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (leave: any) => void;
}

export function ApplyLeaveModal({ open, onOpenChange, onSuccess }: ApplyLeaveModalProps) {
  const [leaveType, setLeaveType] = useState("Medical Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSuccess({
        id: `LEV-${Math.floor(100 + Math.random() * 900)}`,
        type: leaveType,
        startDate: startDate || "2025-02-05",
        endDate: endDate || "2025-02-07",
        days: 3,
        reason: reason || "Medical reason as prescribed by campus doctor.",
        status: "Pending",
      });
      setIsSubmitting(false);
      onOpenChange(false);
      toast.success("Leave application submitted to Academic Advisor & HOD for approval!");
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" /> Apply for Student Leave / OD
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Submit leave request for HOD review. Medical certificates required for &gt;2 days.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Leave Category</Label>
            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger className="rounded-xl text-xs">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Medical Leave">Medical Leave (Fever / Surgery)</SelectItem>
                <SelectItem value="Duty Leave (OD)">On-Duty Leave (OD / Hackathon / Sports)</SelectItem>
                <SelectItem value="Casual Leave">Casual Leave (Family Emergency)</SelectItem>
                <SelectItem value="Internship OD">Internship / Industry Visit OD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Reason for Absence</Label>
            <Textarea
              placeholder="State detailed reason for leave..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="rounded-xl text-xs min-h-[80px]"
              required
            />
          </div>

          <div className="p-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center">
            <FileText className="h-5 w-5 text-slate-400 mx-auto mb-1" />
            <span className="text-[11px] text-slate-500 font-medium block">Attach Supporting Document (Optional)</span>
            <span className="text-[10px] text-slate-400">PDF, PNG, JPG up to 5MB</span>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"
            >
              {isSubmitting ? "Submitting..." : <><Send className="h-3.5 w-3.5" /> Submit Application</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
