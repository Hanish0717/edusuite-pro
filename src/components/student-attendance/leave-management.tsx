import React, { useState } from "react";
import { LeaveRequestItem, LeaveBalanceSummary } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Plus,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

interface LeaveManagementProps {
  balance: LeaveBalanceSummary;
  leaveRequests: LeaveRequestItem[];
  onOpenLeaveModal: () => void;
}

export function LeaveManagement({ balance, leaveRequests, onOpenLeaveModal }: LeaveManagementProps) {
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequestItem | null>(leaveRequests[0] || null);

  const handleWithdraw = (id: string) => {
    toast.success(`Leave request ${id} withdrawn successfully.`);
  };

  const handleUploadCert = () => {
    toast.success("Medical Certificate Upload Dialog Opened.");
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
            <Button onClick={handleUploadCert} variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-800">
              <Upload className="h-3.5 w-3.5 text-purple-600" /> Upload Medical Certificate
            </Button>
            <Button onClick={onOpenLeaveModal} size="sm" className="rounded-xl bg-[#0b193c] hover:bg-[#0b193c]/90 text-white text-xs gap-1.5 font-bold shadow-sm">
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
              {leaveRequests.map((req) => (
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
                          ? "bg-emerald-500/10 text-emerald-600"
                          : req.status === "Pending"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-red-500/10 text-red-600"
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
                        className="h-7 px-2 text-xs text-[#0b193c] dark:text-blue-400 hover:underline"
                      >
                        View Details
                      </Button>
                      {req.status === "Pending" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleWithdraw(req.id)}
                          className="h-7 px-2 text-xs text-red-600 hover:underline"
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

    </div>
  );
}
