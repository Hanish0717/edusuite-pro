import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileCheck2, AlertCircle, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface CorrectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitRequest: (req: any) => void;
  student: any;
}

export function CorrectionModal({ open, onOpenChange, onSubmitRequest, student }: CorrectionModalProps) {
  const [fieldsToCorrect, setFieldsToCorrect] = useState<string[]>([]);
  const [correctionDetails, setCorrectionDetails] = useState("");
  const [phone, setPhone] = useState(student.emergencyContact.phone || "");
  const [bloodGroup, setBloodGroup] = useState(student.bloodGroup || "");
  const [fileName, setFileName] = useState<string | null>(null);

  const availableFields = [
    "Name",
    "Photo",
    "Address",
    "Mobile Number",
    "Blood Group",
    "Emergency Contact",
  ];

  const toggleField = (field: string) => {
    setFieldsToCorrect((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fieldsToCorrect.length === 0) {
      toast.error("Please select at least one field to request correction.");
      return;
    }
    if (!correctionDetails.trim()) {
      toast.error("Please enter explanation details for the correction.");
      return;
    }

    const newReq = {
      requestId: `REQ-2026-0${Math.floor(100 + Math.random() * 900)}`,
      studentId: student.rollNumber,
      requestType: "Request Correction",
      submittedDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
      status: "Pending",
      assignedTo: "Librarian",
      details: `Correction requested for: ${fieldsToCorrect.join(", ")}. Note: ${correctionDetails}`,
      remarks: "Under review by Chief Librarian.",
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
            <FileCheck2 className="h-5 w-5 text-amber-600" /> Request ID Card Details Correction
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Students cannot directly edit official credentials. Submitting this request forwards it to the Chief Librarian for verification.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs pt-3">
          
          {/* SELECT FIELDS */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300">Select Fields Needing Correction:</label>
            <div className="grid grid-cols-2 gap-2">
              {availableFields.map((field) => {
                const selected = fieldsToCorrect.includes(field);
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={() => toggleField(field)}
                    className={`p-2 rounded-xl border text-left font-semibold text-xs transition-all ${
                      selected
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    {selected ? "✓ " : "+ "} {field}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CORRECTION DETAILS */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">New Proposed Values & Reason:</label>
            <textarea
              rows={3}
              value={correctionDetails}
              onChange={(e) => setCorrectionDetails(e.target.value)}
              placeholder="State exact new text or corrections required..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          {/* ATTACHMENT */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Supporting Proof Document (Optional):</label>
            <div className="relative border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center bg-slate-50 dark:bg-slate-800/40">
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFileName(e.target.files[0].name);
                    toast.success(`Attached ${e.target.files[0].name}`);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
                <Upload className="h-4 w-4 text-amber-600" />
                <span>{fileName ? fileName : "Click to upload proof (Aadhar/Gazette/Medical)"}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} size="sm" className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Submit Request
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
