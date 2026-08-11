import React, { useState } from "react";
import { LeaveRequestItem, LeaveBalanceSummary } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Plus,
  Upload,
  Calendar,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Download,
  Trash2,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";

interface LeaveManagementProps {
  balance: LeaveBalanceSummary;
  leaveRequests: LeaveRequestItem[];
  onOpenLeaveModal: () => void;
}

export function LeaveManagement({ balance: initialBalance, leaveRequests: initialRequests, onOpenLeaveModal }: LeaveManagementProps) {
  const [requestsList, setRequestsList] = useState<LeaveRequestItem[]>(initialRequests);
  const [balance, setBalance] = useState<LeaveBalanceSummary>(initialBalance);
  
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequestItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Medical Cert Upload Form state
  const [medReason, setMedReason] = useState("");
  const [medFromDate, setMedFromDate] = useState("2025-01-26");
  const [medToDate, setMedToDate] = useState("2025-01-28");
  const [medFileName, setMedFileName] = useState<string | null>(null);

  const handleWithdraw = (id: string) => {
    setRequestsList((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "Withdrawn" as const, remarks: "Withdrawn by Student" } : req))
    );
    setBalance((prev) => ({
      ...prev,
      pending: Math.max(prev.pending - 1, 0),
      availableLeaves: prev.availableLeaves + 1,
    }));
    toast.success(`Leave request ${id} withdrawn successfully.`);
    if (selectedLeave?.id === id) {
      setSelectedLeave(null);
    }
  };

  const handleDownloadSlip = (req: LeaveRequestItem) => {
    const slipText = `EDUSUITE PRO COLLEGE OF ENGINEERING & TECHNOLOGY
=====================================================
OFFICIAL LEAVE APPLICATION ACKNOWLEDGMENT SLIP
=====================================================
Application Ref ID: ${req.id}
Student Name: Gudipati Chandra (Roll: 22071A0542)
Department: Computer Science & Engineering
Leave Type: ${req.leaveType}
Duration: ${req.fromDate} to ${req.toDate} (${req.days} Day)

REASON:
${req.reason}

APPROVAL STATUS: ${req.status}
Approved / Reviewed By: ${req.approvedBy}
Official Remarks: ${req.remarks}

Date Generated: ${new Date().toLocaleDateString()}
EduSuite ERP — Student Affairs Division`;

    const blob = new Blob([slipText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Leave_Acknowledgment_${req.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded Acknowledgment Slip for ${req.id}`);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medReason.trim()) {
      toast.error("Please enter a valid medical reason.");
      return;
    }

    const newMedRequest: LeaveRequestItem = {
      id: `LV-2025-MED-${Math.floor(100 + Math.random() * 900)}`,
      leaveType: "Medical Leave",
      reason: medReason,
      appliedDate: new Date().toLocaleDateString(),
      fromDate: medFromDate,
      toDate: medToDate,
      days: 3,
      status: "Pending",
      approvedBy: "Medical Board Review",
      remarks: "Attached Medical Certificate: " + (medFileName || "Medical_Proof.pdf"),
    };

    setRequestsList((prev) => [newMedRequest, ...prev]);
    setBalance((prev) => ({
      ...prev,
      medical: prev.medical + 3,
      appliedLeaves: prev.appliedLeaves + 3,
      pending: prev.pending + 1,
    }));

    toast.success("Medical Certificate uploaded & leave application submitted for approval!");
    setIsUploadModalOpen(false);
    setMedReason("");
    setMedFileName(null);
  };

  return (
    <div className="space-y-6">

      {/* 1. DASHBOARD CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Available Leaves</span>
          <strong className="text-xl font-extrabold text-[#0b193c] dark:text-blue-400 font-display">{balance.availableLeaves}</strong>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Applied Leaves</span>
          <strong className="text-xl font-extrabold text-[#0b193c] dark:text-blue-400 font-display">{balance.appliedLeaves}</strong>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Approved</span>
          <strong className="text-xl font-extrabold text-[#0b193c] dark:text-blue-400 font-display">{balance.approved}</strong>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Pending</span>
          <strong className="text-xl font-extrabold text-[#0b193c] dark:text-blue-400 font-display">{balance.pending}</strong>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Rejected</span>
          <strong className="text-xl font-extrabold text-[#0b193c] dark:text-blue-400 font-display">{balance.rejected}</strong>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Medical ML</span>
          <strong className="text-xl font-extrabold text-[#0b193c] dark:text-blue-400 font-display">{balance.medical}</strong>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Emergency</span>
          <strong className="text-xl font-extrabold text-[#0b193c] dark:text-blue-400 font-display">{balance.emergency}</strong>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">On Duty OD</span>
          <strong className="text-xl font-extrabold text-[#0b193c] dark:text-blue-400 font-display">{balance.onDuty}</strong>
        </div>
      </div>

      {/* 2. LEAVE REQUESTS TABLE */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#0b193c] dark:text-blue-400" /> Leave Applications Register
            </h3>
            <p className="text-xs text-slate-500">Official leave record & approval status</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-800 cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5 text-purple-600" /> Upload Medical Certificate
            </Button>
            <Button
              onClick={onOpenLeaveModal}
              size="sm"
              className="rounded-xl bg-[#0b193c] hover:bg-[#0b193c]/90 text-white text-xs gap-1.5 font-bold shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Apply Leave
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold">
                <th className="p-3">Ref ID</th>
                <th className="p-3">Leave Type</th>
                <th className="p-3">Reason</th>
                <th className="p-3">From</th>
                <th className="p-3">To</th>
                <th className="p-3">Days</th>
                <th className="p-3">Status</th>
                <th className="p-3">Approved By</th>
                <th className="p-3">Remarks</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {requestsList.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => setSelectedLeave(req)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer"
                >
                  <td className="p-3 font-mono font-bold text-[#0b193c] dark:text-blue-400">{req.id}</td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">{req.leaveType}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">{req.reason}</td>
                  <td className="p-3 font-mono text-slate-700 dark:text-slate-300">{req.fromDate}</td>
                  <td className="p-3 font-mono text-slate-700 dark:text-slate-300">{req.toDate}</td>
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{req.days} Day</td>
                  <td className="p-3">
                    <Badge
                      className={
                        req.status === "Approved"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : req.status === "Pending"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : req.status === "Withdrawn"
                          ? "bg-slate-500/10 text-slate-600 border-slate-500/20"
                          : "bg-red-500/10 text-red-600 border-red-500/20"
                      }
                    >
                      {req.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{req.approvedBy}</td>
                  <td className="p-3 text-slate-500 max-w-xs truncate">{req.remarks}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedLeave(req)}
                        className="h-7 px-2 text-xs text-[#0b193c] dark:text-blue-400 font-bold hover:underline cursor-pointer"
                      >
                        View Details
                      </Button>
                      {req.status === "Pending" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleWithdraw(req.id)}
                          className="h-7 px-2 text-xs text-red-600 font-bold hover:underline cursor-pointer"
                        >
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW LEAVE DETAILS MODAL */}
      {selectedLeave && (
        <Dialog open={!!selectedLeave} onOpenChange={() => setSelectedLeave(null)}>
          <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono font-bold text-[#0b193c] dark:text-blue-400 border-slate-300">
                  {selectedLeave.id}
                </Badge>
                <Badge
                  className={
                    selectedLeave.status === "Approved"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : selectedLeave.status === "Pending"
                      ? "bg-amber-500/10 text-amber-600"
                      : selectedLeave.status === "Withdrawn"
                      ? "bg-slate-500/10 text-slate-600"
                      : "bg-red-500/10 text-red-600"
                  }
                >
                  {selectedLeave.status}
                </Badge>
              </div>
              <DialogTitle className="text-base font-bold pt-2">
                {selectedLeave.leaveType} Details
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Applied on {selectedLeave.appliedDate}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 my-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block">From Date</span>
                  <strong>{selectedLeave.fromDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">To Date</span>
                  <strong>{selectedLeave.toDate} ({selectedLeave.days} Day)</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Reason for Application</span>
                <p>{selectedLeave.reason}</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Approval Information</span>
                <p><strong>Reviewed By:</strong> {selectedLeave.approvedBy}</p>
                <p><strong>Remarks:</strong> {selectedLeave.remarks}</p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                onClick={() => handleDownloadSlip(selectedLeave)}
                variant="outline"
                className="rounded-xl text-xs gap-1.5 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-purple-600" /> Acknowledgment Slip
              </Button>

              {selectedLeave.status === "Pending" && (
                <Button
                  onClick={() => handleWithdraw(selectedLeave.id)}
                  variant="destructive"
                  className="rounded-xl text-xs gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Withdraw Application
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* UPLOAD MEDICAL CERTIFICATE DIALOG */}
      {isUploadModalOpen && (
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Upload className="h-5 w-5 text-purple-600" /> Upload Medical Certificate
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Submit medical proof & doctor recommendations for Medical Leave approval
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUploadSubmit} className="space-y-4 my-2 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Illness / Reason</label>
                <Input
                  type="text"
                  placeholder="e.g. Viral Fever & Doctor Recommended Bed Rest"
                  value={medReason}
                  onChange={(e) => setMedReason(e.target.value)}
                  className="rounded-xl h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">From Date</label>
                  <Input
                    type="date"
                    value={medFromDate}
                    onChange={(e) => setMedFromDate(e.target.value)}
                    className="rounded-xl h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">To Date</label>
                  <Input
                    type="date"
                    value={medToDate}
                    onChange={(e) => setMedToDate(e.target.value)}
                    className="rounded-xl h-9 text-xs"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 text-center space-y-2">
                <Upload className="h-8 w-8 text-purple-600 mx-auto" />
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {medFileName ? medFileName : "Choose Medical Certificate File (PDF / JPG)"}
                </p>
                <p className="text-[10px] text-slate-500">Max File Size: 5MB</p>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setMedFileName(e.target.files[0].name);
                      toast.success(`Attached file ${e.target.files[0].name}`);
                    }
                  }}
                  className="cursor-pointer opacity-90 text-xs"
                />
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)} className="rounded-xl text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold gap-1 cursor-pointer">
                  <FileCheck className="h-3.5 w-3.5" /> Upload & Submit Application
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
