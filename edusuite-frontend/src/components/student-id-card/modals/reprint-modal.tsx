import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ReprintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitRequest: (req: any) => void;
  student: any;
}

export function ReprintModal({ open, onOpenChange, onSubmitRequest, student }: ReprintModalProps) {
  const [reason, setReason] = useState("Barcode surface wear and tear");
  const [details, setDetails] = useState("");
  const [contactNumber, setContactNumber] = useState(student.emergencyContact.phone || "+91 98765 43210");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      toast.error("Please specify details of the wear or reason for reprint.");
      return;
    }

    const newReq = {
      requestId: `REQ-2026-R${Math.floor(100 + Math.random() * 900)}`,
      studentId: student.rollNumber,
      requestType: "Request Reprint",
      submittedDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
      status: "Pending",
      assignedTo: "Librarian",
      details: `Reprint requested. Reason: ${reason}. Details: ${details}`,
      remarks: "Forwarded to Library Printing Desk.",
    };

    onSubmitRequest(newReq);
    toast.success("✅ Your request has been submitted successfully. It has been forwarded to the Librarian for verification.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl">
        <DialogHeader className="space-y-1 text-left border-b border-slate-100 dark:border-slate-800 pb-3">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-purple-600" /> Request ID Card Reprint
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Request a fresh physical print of your smart ID pass. Forwarded to Chief Librarian for approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs pt-3">
          
          {/* REASON */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Reprint Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-9 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
            >
              <option value="Barcode surface wear and tear">Barcode surface wear and tear</option>
              <option value="Physical card lamination damaged">Physical card lamination damaged</option>
              <option value="RFID chip non-responsive at gate">RFID chip non-responsive at gate</option>
              <option value="Updated photo/academic year">Updated photo/academic year</option>
            </select>
          </div>

          {/* DETAILS */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Wear & Damage Description</label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide details on card condition..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* CONTACT NUMBER */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Contact Number</label>
            <Input
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="h-9 text-xs rounded-xl font-mono"
              required
            />
          </div>

          <DialogFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} size="sm" className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Submit Request
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
