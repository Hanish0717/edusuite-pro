import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  GitBranch,
  CheckCircle2,
  XCircle,
  Building,
  UserCheck,
  FileCheck,
  Lock,
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRole } from "@/context/role-context";

import {
  fetchWorkflows,
  processWorkflowStep,
  type WorkflowItem,
} from "@/lib/workflowService";
import { HodApprovalPanel } from "@/components/student-examinations/hod-approval-panel";

export const Route = createFileRoute("/approval-workflows")({
  head: () => ({
    meta: [{ title: "Approval Workflows — EduSuite Pro" }],
  }),
  component: ApprovalWorkflowsPage,
});

export function ApprovalWorkflowsPage() {
  const { hasFlag, role } = useRole();
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(() => fetchWorkflows());

  const canApproveStep = (stepFlag?: string) => {
    if (role === "super-admin") return true;
    if (!stepFlag) return true;
    return hasFlag(stepFlag);
  };

  const handleApprove = (id: string) => {
    setWorkflows((prev) => processWorkflowStep(prev, id, "approve", role));
    toast.success(`Workflow step for ${id} approved successfully!`);
  };

  const handleReject = (id: string) => {
    setWorkflows((prev) => processWorkflowStep(prev, id, "reject", role));
    toast.error(`Workflow step for ${id} rejected.`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
              <GitBranch className="size-6" />
            </span>
            <div>
              <h1 className="font-display text-xl font-extrabold sm:text-2xl">
                Multi-Level Approval Workflows
              </h1>
              <p className="text-sm text-muted-foreground">
                Sequential approval chains (Faculty → HOD → Dean → Principal) with role-based sign-off locks.
              </p>
            </div>
          </div>
          <Badge className="bg-brand-gradient text-white font-mono">
            ACTIVE WORKFLOW ENGINE
          </Badge>
        </header>

        {/* HOD EXAM & NPTEL REGISTRATION APPROVAL PANEL */}
        <HodApprovalPanel />

        <div className="space-y-6">
          {workflows.map((wf) => {
            const currentStep = wf.steps[wf.currentStepIndex];
            const isCompleted = wf.currentStepIndex >= wf.steps.length;

            return (
              <Panel
                key={wf.id}
                title={wf.title}
                description={`Category: ${wf.category} | Requested by ${wf.requestor} (${wf.department}) on ${wf.dateSubmitted}`}
                action={
                  <Badge variant="outline" className="font-mono text-xs">
                    {wf.id}
                  </Badge>
                }
              >
                <div className="space-y-6">
                  {/* WORKFLOW DIAGRAM STEPS */}
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {wf.steps.map((step, idx) => {
                      const isPast = idx < wf.currentStepIndex;
                      const isCurrent = idx === wf.currentStepIndex;
                      const isFuture = idx > wf.currentStepIndex;

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl border transition-all ${
                            isPast
                              ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10"
                              : isCurrent
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                              : "border-border/60 bg-muted/20 opacity-70"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[0.68rem] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                              Step {idx + 1}
                            </span>
                            {isPast && <CheckCircle2 className="size-4 text-emerald-600" />}
                            {isCurrent && (
                              <Badge className="bg-primary text-primary-foreground text-[0.65rem] px-1.5 py-0">
                                ACTIVE
                              </Badge>
                            )}
                            {isFuture && <Lock className="size-3.5 text-muted-foreground" />}
                          </div>

                          <h4 className="font-display text-sm font-bold">{step.label}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{step.notes}</p>

                          {step.actor && (
                            <p className="text-[0.68rem] font-mono text-emerald-600 dark:text-emerald-400 mt-2">
                              Signed: {step.actor} ({step.timestamp})
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* ACTION FOOTER */}
                  {!isCompleted && currentStep && (
                    <div className="p-4 rounded-xl bg-card border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          Current Action Required:{" "}
                          <span className="text-primary">{currentStep.label}</span>
                        </p>
                        <p className="text-[0.72rem] text-muted-foreground mt-0.5">
                          {currentStep.flagRequired
                            ? `Requires staff privilege flag: [${currentStep.flagRequired}]`
                            : "Open for role sign-off."}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {canApproveStep(currentStep.flagRequired) ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(wf.id)}
                              className="bg-brand-gradient text-xs cursor-pointer gap-1.5"
                            >
                              <CheckCircle2 className="size-4" /> Approve Step
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(wf.id)}
                              className="text-xs cursor-pointer gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                            >
                              <XCircle className="size-4" /> Reject
                            </Button>
                          </>
                        ) : (
                          <Badge variant="secondary" className="text-xs font-mono">
                            Sign-off Locked (Insufficient Privilege Flag)
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
