import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLeave: (data: {
    leaveType: "Casual Leave" | "Medical Leave" | "Emergency Leave" | "On Duty (OD)";
    fromDate: string;
    toDate: string;
    reason: string;
    emergencyContact?: string;
    documentName?: string;
  }) => void;
}

export function LeaveModal({ isOpen, onClose, onSubmitLeave }: LeaveModalProps) {
  const [leaveType, setLeaveType] = useState<"Casual Leave" | "Medical Leave" | "Emergency Leave" | "On Duty (OD)">("Casual Leave");
  const [fromDate, setFromDate] = useState("2025-01-25");
  const [toDate, setToDate] = useState("2025-01-25");
  const [reason, setReason] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("+91 9876543210");
  const [fileName, setFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please enter a valid reason for leave application.");
      return;
    }

    onSubmitLeave({
      leaveType,
      fromDate,
      toDate,
      reason,
      emergencyContact,
      documentName: fileName || undefined,
    });
    toast.success("Leave Request Submitted! Sent to Advisor and HOD.");
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      toast.success(`Attached document ${e.target.files[0].name}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Apply for Leave / On Duty</h3>
            <p className="text-xs text-slate-500">Submit formal leave application to Faculty Advisor & HOD</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* LEAVE TYPE */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Leave Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(["Casual Leave", "Medical Leave", "Emergency Leave", "On Duty (OD)"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLeaveType(type)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                    leaveType === type
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* DATE RANGE */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">From Date</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">To Date</label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
          </div>

          {/* REASON */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Reason for Absence</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State clear reason for leave application..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* EMERGENCY CONTACT */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Emergency Phone Number</label>
            <Input
              placeholder="+91 Mobile number..."
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="h-9 text-xs rounded-xl font-mono"
            />
          </div>

          {/* FILE UPLOAD */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Supporting Document (Medical Cert / OD Letter)
            </label>
            <div className="relative border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/60 transition-colors">
              <input
                type="file"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex items-center justify-center gap-2 text-slate-500">
                <Upload className="h-4 w-4 text-blue-600" />
                <span>{fileName ? fileName : "Click or drag medical certificate / OD letter"}</span>
              </div>
            </div>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setReason("");
                setFromDate("2025-01-25");
                setToDate("2025-01-25");
                setFileName(null);
                toast.info("Form reset.");
              }}
              size="sm"
              className="rounded-xl text-slate-500"
            >
              Reset
            </Button>
            <Button type="button" variant="outline" onClick={onClose} size="sm" className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-1.5 px-4">
              <CheckCircle2 className="h-4 w-4" /> Submit
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
