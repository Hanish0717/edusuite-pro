import { useState } from "react";
import { Mail, Check, X, FileText, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { LeaveRequest } from "@/data/faculty-mock-data";

interface LeaveRequestPanelProps {
  initialRequests: LeaveRequest[];
}

export function LeaveRequestPanel({ initialRequests }: LeaveRequestPanelProps) {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests);

  const handleAction = (id: string, action: "Approved" | "Rejected") => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: action } : req))
    );

    if (action === "Approved") {
      toast.success("Leave Request Approved", {
        description: "Student attendance status marked as ML/OD for dates.",
      });
    } else {
      toast.error("Leave Request Rejected", {
        description: "Notification sent to the student profile.",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Rejected":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      default:
        return "bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse";
    }
  };

  return (
    <Panel
      title="Student Leave & OD Approval Panel"
      description="Pending leave requests requiring review and signature updates"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="p-4 border rounded-2xl bg-muted/20 hover:bg-muted/30 transition-colors space-y-3"
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <h5 className="font-extrabold text-[0.75rem] text-foreground leading-snug truncate">
                  {req.studentName}
                </h5>
                <p className="font-mono text-[0.62rem] text-muted-foreground mt-0.5 font-bold">
                  {req.rollNumber} &middot; {req.leaveType}
                </p>
              </div>
              <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.58rem] font-bold border shrink-0 ${getStatusColor(req.status)}`}>
                {req.status}
              </Badge>
            </div>

            {/* Content text */}
            <p className="text-[0.65rem] text-muted-foreground leading-normal italic font-medium">
              "{req.reason}"
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[0.62rem] text-muted-foreground font-semibold">
              <span className="flex items-center gap-1">
                From: {req.fromDate} &middot; To: {req.toDate}
              </span>
              {req.attachment && (
                <span className="flex items-center gap-0.5 text-primary">
                  <Paperclip className="size-3" /> Certificate.pdf
                </span>
              )}
            </div>

            {/* Actions */}
            {req.status === "Pending" && (
              <div className="flex gap-2 pt-1.5 justify-end">
                <Button
                  onClick={() => handleAction(req.id, "Rejected")}
                  variant="outline"
                  className="rounded-xl hover:bg-rose-500/10 hover:text-rose-600 border border-rose-500/20 text-rose-500 text-[0.62rem] h-8 px-3.5 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <X className="size-3.5" /> Reject
                </Button>
                <Button
                  onClick={() => handleAction(req.id, "Approved")}
                  className="rounded-xl bg-brand-gradient shadow-glow text-[0.62rem] h-8 px-4 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Check className="size-3.5" /> Approve
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}
