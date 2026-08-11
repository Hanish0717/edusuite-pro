import { useState } from "react";
import { AlertTriangle, ShieldAlert, CheckCircle2, XCircle, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WorkflowItem } from "@/types/approval";
import { toast } from "sonner";

interface EmergencyOverrideModalProps {
  workflow: WorkflowItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmOverride: (
    workflowId: string,
    actionType: "Emergency Approve" | "Force Reject" | "Force Reassign" | "Cancel Workflow",
    reason: string
  ) => void;
}

export function EmergencyOverrideModal({
  workflow,
  isOpen,
  onClose,
  onConfirmOverride,
}: EmergencyOverrideModalProps) {
  const [actionType, setActionType] = useState<
    "Emergency Approve" | "Force Reject" | "Force Reassign" | "Cancel Workflow"
  >("Emergency Approve");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen || !workflow) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 10) {
      toast.error("Emergency override requires a detailed justification (minimum 10 characters).");
      return;
    }

    if (!confirmed) {
      toast.error("You must acknowledge the audit logging agreement checkbox.");
      return;
    }

    onConfirmOverride(workflow.id, actionType, reason.trim());
    toast.warning(`Emergency Override (${actionType}) executed for ${workflow.id}`);
    setReason("");
    setConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in-soft">
      <div className="relative w-full max-w-xl rounded-2xl border border-destructive/40 bg-card p-6 shadow-2xl space-y-5">
        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-destructive/20 text-destructive ring-4 ring-destructive/10 animate-pulse">
              <ShieldAlert className="size-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-extrabold text-foreground">
                  Super Admin Emergency Override
                </h3>
                <Badge variant="destructive" className="font-mono text-[0.65rem] uppercase">
                  GOVERNANCE PRIVILEGE
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Bypasses routine operational approvers. Logs IP, timestamp & device to immutable ledger.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* WORKFLOW METADATA CARD */}
        <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-primary">{workflow.id}</span>
            <Badge variant="outline" className="font-mono text-[0.68rem]">
              Risk: {workflow.riskLevel}
            </Badge>
          </div>
          <h4 className="font-bold text-foreground">{workflow.title}</h4>
          <p className="text-muted-foreground text-[0.72rem]">
            Requested by <strong className="text-foreground">{workflow.requestor}</strong> ({workflow.department})
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ACTION SELECTION */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Select Executive Action Type:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActionType("Emergency Approve")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  actionType === "Emergency Approve"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20"
                    : "border-border bg-card text-muted-foreground hover:border-emerald-500/50"
                }`}
              >
                <CheckCircle2 className="size-4" /> Emergency Approve
              </button>

              <button
                type="button"
                onClick={() => setActionType("Force Reject")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  actionType === "Force Reject"
                    ? "border-destructive bg-destructive/10 text-destructive ring-2 ring-destructive/20"
                    : "border-border bg-card text-muted-foreground hover:border-destructive/50"
                }`}
              >
                <XCircle className="size-4" /> Force Reject
              </button>

              <button
                type="button"
                onClick={() => setActionType("Force Reassign")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  actionType === "Force Reassign"
                    ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/20"
                    : "border-border bg-card text-muted-foreground hover:border-amber-500/50"
                }`}
              >
                <RefreshCw className="size-4" /> Force Reassign
              </button>

              <button
                type="button"
                onClick={() => setActionType("Cancel Workflow")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  actionType === "Cancel Workflow"
                    ? "border-slate-500 bg-slate-500/10 text-slate-700 dark:text-slate-300 ring-2 ring-slate-500/20"
                    : "border-border bg-card text-muted-foreground hover:border-slate-500/50"
                }`}
              >
                <AlertTriangle className="size-4" /> Cancel Workflow
              </button>
            </div>
          </div>

          {/* REASON INPUT */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mandatory Written Justification (Audit Log Record):
            </label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide explicit operational rationale for overriding routine approvers..."
              className="text-xs border-destructive/30 focus-visible:ring-destructive"
              required
            />
            <span className="text-[0.68rem] text-muted-foreground mt-1 block">
              Minimum 10 characters. This reason will be permanently attached to the immutable audit record.
            </span>
          </div>

          {/* CONFIRMATION CHECKBOX */}
          <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-[0.72rem]">
            <input
              type="checkbox"
              id="confirm-override"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 accent-destructive cursor-pointer"
            />
            <label htmlFor="confirm-override" className="text-muted-foreground leading-snug cursor-pointer">
              I acknowledge that executing an <strong className="text-foreground">Emergency Override</strong> bypasses standard departmental governance, generates a flagged audit trail, and notifies institutional auditors.
            </label>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-destructive hover:bg-destructive/90 text-white font-bold cursor-pointer gap-2"
              disabled={!confirmed || reason.trim().length < 10}
            >
              <ShieldAlert className="size-4" /> Execute Override
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
