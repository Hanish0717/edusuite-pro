import React, { useEffect, useState } from "react";
import { Calendar, Plus, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchLeaveApplications, type LeaveApplication } from "./LeaveService";

export function LeaveModuleView() {
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveApplications()
      .then(setLeaves)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2">
            <Calendar className="size-6 text-primary" /> Leave Management Module
          </h1>
          <p className="text-sm text-muted-foreground">
            Submit leave requests, track balances, and process HOD/Principal leave approvals.
          </p>
        </div>
        <Button className="bg-brand-gradient text-white gap-2 font-semibold shadow-glow">
          <Plus className="size-4" /> Apply for Leave
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Casual Leave Balance</span>
          <p className="text-2xl font-bold font-mono text-emerald-600">08 / 12 Days</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Sick Leave Balance</span>
          <p className="text-2xl font-bold font-mono text-blue-600">09 / 10 Days</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Earned Leave Balance</span>
          <p className="text-2xl font-bold font-mono text-purple-600">14 / 15 Days</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <h3 className="font-bold text-base flex items-center gap-2">
          <FileText className="size-4 text-primary" /> Leave Requests Ledger
        </h3>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading leave requests...</p>
        ) : (
          <div className="divide-y divide-border/60">
            {leaves.map((leave) => (
              <div key={leave.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{leave.applicantName}</span>
                    <Badge variant="outline" className="text-[0.65rem] font-mono">
                      {leave.applicantRole}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">{leave.leaveType} Leave</span> ({leave.days} days): {leave.startDate} to {leave.endDate}
                  </p>
                  <p className="text-xs text-muted-foreground italic">"{leave.reason}"</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge
                    className={
                      leave.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : leave.status === "Rejected"
                        ? "bg-red-500/10 text-red-600 border-red-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }
                  >
                    {leave.status === "Approved" && <CheckCircle className="size-3 mr-1 inline" />}
                    {leave.status === "Rejected" && <XCircle className="size-3 mr-1 inline" />}
                    {leave.status === "Pending" && <Clock className="size-3 mr-1 inline" />}
                    {leave.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
