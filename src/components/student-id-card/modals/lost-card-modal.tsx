import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface LostCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitRequest: (req: any) => void;
  student: any;
}

export function LostCardModal({ open, onOpenChange, onSubmitRequest, student }: LostCardModalProps) {
  const [reason, setReason] = useState("Misplaced during campus transit");
  const [dateLost, setDateLost] = useState("2026-08-01");
  const [description, setDescription] = useState("");
  const [contactNumber, setContactNumber] = useState(student.emergencyContact.phone || "+91 98765 43210");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please provide a brief description of how or where the card was lost.");
      return;
    }

    const newReq = {
      requestId: `REQ-2026-L${Math.floor(100 + Math.random() * 900)}`,
      studentId: student.rollNumber,
      requestType: "Lost ID Card",
      submittedDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
      status: "Pending",
      assignedTo: "Librarian",
      details: `Lost card report filed for ${dateLost}. Reason: ${reason}. Details: ${description}`,
      remarks: "Assigned to Chief Librarian for verification & duplicate pass clearance.",
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
            <AlertTriangle className="h-5 w-5 text-rose-600" /> Report Lost Student ID Card
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Filing a lost ID report invalidates the old RFID chip and forwards a duplicate pass request to the Librarian.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs pt-3">
          
          {/* REASON */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Reason / Incident Type</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-9 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
            >
              <option value="Misplaced during campus transit">Misplaced during campus transit</option>
              <option value="Stolen / Wallet Theft">Stolen / Wallet Theft</option>
              <option value="Left in Hostel / Transport">Left in Hostel / Transport</option>
              <option value="Damaged / Unreadable Chip">Damaged / Unreadable Chip</option>
            </select>
          </div>

          {/* DATE LOST */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Date Lost</label>
            <Input
              type="date"
              value={dateLost}
              onChange={(e) => setDateLost(e.target.value)}
              className="h-9 text-xs rounded-xl"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Description of Incident</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe where the card was last seen or details of loss..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              required
            />
          </div>

          {/* CONTACT NUMBER */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Contact Mobile Number</label>
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
            <Button type="submit" size="sm" className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Submit Request
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
