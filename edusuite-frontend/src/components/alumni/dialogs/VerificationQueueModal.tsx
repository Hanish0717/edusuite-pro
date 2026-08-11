import React, { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, CheckCircle2, XCircle, HelpCircle, UserCheck } from "lucide-react";
import { VerificationQueueItem } from "@/types/alumni";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VerificationQueueModalProps {
  queue: VerificationQueueItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (id: string, newStatus: VerificationQueueItem["status"]) => void;
}

export const VerificationQueueModal: React.FC<VerificationQueueModalProps> = ({
  queue,
  open,
  onOpenChange,
  onUpdateStatus,
}) => {
  const handleAction = (item: VerificationQueueItem, action: "Approve" | "Reject" | "Request Info") => {
    if (action === "Approve") {
      onUpdateStatus(item.id, "Approved");
      toast.success(`Approved alumni registration for ${item.fullName}!`, {
        description: `Account activated. Congratulations email sent to ${item.email}.`,
        icon: <UserCheck className="size-4 text-emerald-600" />,
      });
    } else if (action === "Reject") {
      onUpdateStatus(item.id, "Rejected");
      toast.error(`Rejected registration for ${item.fullName}.`);
    } else {
      onUpdateStatus(item.id, "Info Requested");
      toast.info(`Requested additional info from ${item.fullName}.`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-3xl p-6">
        <div className="space-y-4 font-sans">
          <DialogHeader className="pb-2 border-b border-border">
            <DialogTitle className="font-extrabold text-base flex items-center gap-2">
              <ShieldCheck className="size-5 text-[#2563EB]" /> Alumni Verification Queue (Admin Portal)
            </DialogTitle>
            <DialogDescription className="text-xs">
              Review and approve pending alumni registration applications verified against registrar records.
            </DialogDescription>
          </DialogHeader>

          {queue.length === 0 ? (
            <div className="p-8 text-center space-y-2 font-mono text-xs text-muted-foreground">
              <CheckCircle2 className="size-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-foreground">Verification Queue is Clear!</p>
              <p>No pending alumni registration applications awaiting review.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {queue.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-card border border-border space-y-3">
                  <div className="flex items-start justify-between gap-3 font-mono text-xs">
                    <div>
                      <h4 className="font-extrabold text-sm text-foreground font-sans">{item.fullName}</h4>
                      <p className="text-muted-foreground text-[0.72rem]">
                        Roll No: <strong>{item.rollNumber}</strong> • Batch of {item.graduationYear} ({item.dept})
                      </p>
                      <p className="text-primary font-bold text-[0.72rem] pt-0.5">
                        {item.designation} @ {item.company}
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-[0.62rem] ${
                        item.status === "Approved"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-300"
                          : item.status === "Rejected"
                          ? "bg-rose-500/10 text-rose-600 border-rose-300"
                          : "bg-amber-500/10 text-amber-600 border-amber-300"
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </div>

                  <div className="p-2.5 bg-muted/40 rounded-xl flex items-center justify-between font-mono text-[0.68rem]">
                    <span>✓ Student Record Match: <strong className="text-emerald-600">Verified</strong></span>
                    <span>Invited By: <strong>{item.invitedBy || "Direct Application"}</strong></span>
                  </div>

                  {item.status === "Pending Approval" && (
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => handleAction(item, "Approve")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 text-[0.72rem] rounded-xl gap-1"
                      >
                        <CheckCircle2 className="size-3.5" /> Approve Alumni
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(item, "Request Info")}
                        className="h-8 text-[0.72rem] rounded-xl gap-1"
                      >
                        <HelpCircle className="size-3.5" /> Request Info
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(item, "Reject")}
                        className="h-8 text-[0.72rem] text-rose-600 hover:bg-rose-50 rounded-xl gap-1"
                      >
                        <XCircle className="size-3.5" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <DialogFooter className="pt-2 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
              Close Queue
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
