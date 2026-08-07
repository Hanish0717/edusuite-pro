import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  GitBranch,
  LayoutDashboard,
  Layers,
  Wrench,
  Zap,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/context/role-context";

import {
  fetchWorkflows,
  fetchDelegations,
  fetchTemplates,
  processStandardStep,
  processEmergencyOverride,
  processEscalation,
  createDelegation,
  revokeDelegation,
  saveWorkflowTemplate,
} from "@/lib/workflowService";

import { ApprovalDashboard } from "@/components/approval/ApprovalDashboard";
import { ApprovalCenter } from "@/components/approval/ApprovalCenter";
import { WorkflowBuilder } from "@/components/approval/WorkflowBuilder";
import { EscalationManager } from "@/components/approval/EscalationManager";
import { DelegationManager } from "@/components/approval/DelegationManager";
import { AuditLogViewer } from "@/components/approval/AuditLogViewer";

export const Route = createFileRoute("/approval-workflows")({
  head: () => ({
    meta: [{ title: "Enterprise Approval & Governance Suite — EduSuite Pro" }],
  }),
  component: ApprovalWorkflowsPage,
});

type TabType =
  | "dashboard"
  | "approval-center"
  | "workflow-builder"
  | "escalations"
  | "delegations"
  | "audit-logs";

export function ApprovalWorkflowsPage() {
  const { role, flags, profile } = useRole();
  const [activeTab, setActiveTab] = useState<TabType>("approval-center");

  // Reactive State Holders
  const [workflows, setWorkflows] = useState(() => fetchWorkflows());
  const [delegations, setDelegations] = useState(() => fetchDelegations());
  const [templates, setTemplates] = useState(() => fetchTemplates());

  // Step Approval Action
  const handleApproveStep = (id: string, comment?: string) => {
    setWorkflows((prev) =>
      processStandardStep(prev, id, "approve", profile.personaName, role, comment)
    );
    toast.success(`Workflow ${id} step approved successfully!`);
  };

  // Step Rejection Action
  const handleRejectStep = (id: string, comment?: string) => {
    setWorkflows((prev) =>
      processStandardStep(prev, id, "reject", profile.personaName, role, comment)
    );
    toast.error(`Workflow ${id} step rejected.`);
  };

  // Super Admin Emergency Override Action
  const handleEmergencyOverride = (
    id: string,
    actionType: "Emergency Approve" | "Force Reject" | "Force Reassign" | "Cancel Workflow",
    reason: string
  ) => {
    setWorkflows((prev) =>
      processEmergencyOverride(
        prev,
        id,
        actionType,
        reason,
        profile.personaName,
        "10.0.0.1 (Executive Vault)",
        "Super Admin Terminal"
      )
    );
  };

  // Escalation Trigger Action
  const handleEscalateWorkflow = (id: string, reason: string) => {
    setWorkflows((prev) => processEscalation(prev, id, reason));
    toast.warning(`Workflow ${id} escalated to higher authority level.`);
  };

  // Delegation Actions
  const handleCreateDelegation = (newDel: any) => {
    const updated = createDelegation(newDel);
    setDelegations([...updated]);
  };

  const handleRevokeDelegation = (id: string) => {
    const updated = revokeDelegation(id);
    setDelegations([...updated]);
  };

  // Workflow Template Action
  const handleSaveTemplate = (tmpl: any) => {
    const updated = saveWorkflowTemplate(tmpl);
    setTemplates([...updated]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* TOP HEADER */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
              <GitBranch className="size-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-extrabold sm:text-2xl">
                  Enterprise Approval & Governance Suite
                </h1>
                {role === "super-admin" && (
                  <Badge className="bg-destructive text-white font-mono text-[0.65rem]">
                    <ShieldAlert className="size-3 mr-1" /> PLATFORM GOVERNANCE MODE
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Separation of duties engine • Operational sign-offs stay with HODs/Deans • Super Admin governance & Emergency Overrides
              </p>
            </div>
          </div>

          <Badge className="bg-brand-gradient text-white font-mono text-xs px-3 py-1 self-start sm:self-auto">
            ENTERPRISE ERP V4.2
          </Badge>
        </header>

        {/* TOP SUB-NAVIGATION TABS */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-border/80 pb-3 no-scrollbar">
          <button
            onClick={() => setActiveTab("approval-center")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "approval-center"
                ? "bg-brand-gradient text-white shadow-md shadow-primary/20"
                : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Layers className="size-4" /> Approval Center
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "dashboard"
                ? "bg-brand-gradient text-white shadow-md shadow-primary/20"
                : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="size-4" /> Executive Dashboard
          </button>

          <button
            onClick={() => setActiveTab("workflow-builder")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "workflow-builder"
                ? "bg-brand-gradient text-white shadow-md shadow-primary/20"
                : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Wrench className="size-4" /> Workflow Builder
          </button>

          <button
            onClick={() => setActiveTab("escalations")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "escalations"
                ? "bg-brand-gradient text-white shadow-md shadow-primary/20"
                : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Zap className="size-4" /> Escalation Manager
          </button>

          <button
            onClick={() => setActiveTab("delegations")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "delegations"
                ? "bg-brand-gradient text-white shadow-md shadow-primary/20"
                : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <UserCheck className="size-4" /> Delegations Manager
          </button>

          <button
            onClick={() => setActiveTab("audit-logs")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "audit-logs"
                ? "bg-brand-gradient text-white shadow-md shadow-primary/20"
                : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <ShieldCheck className="size-4" /> Immutable Audit Ledger
          </button>
        </div>

        {/* ACTIVE TAB CONTENT RENDERER */}
        {activeTab === "approval-center" && (
          <ApprovalCenter
            workflows={workflows}
            delegations={delegations}
            role={role}
            flags={Array.isArray(flags) ? flags.reduce((acc, f) => ({ ...acc, [f]: true }), {} as Record<string, boolean>) : (flags || {})}
            onApproveStep={handleApproveStep}
            onRejectStep={handleRejectStep}
            onEmergencyOverride={handleEmergencyOverride}
            onEscalateWorkflow={handleEscalateWorkflow}
          />
        )}

        {activeTab === "dashboard" && (
          <ApprovalDashboard workflows={workflows} delegations={delegations} />
        )}

        {activeTab === "workflow-builder" && (
          <WorkflowBuilder templates={templates} onSaveTemplate={handleSaveTemplate} />
        )}

        {activeTab === "escalations" && (
          <EscalationManager
            workflows={workflows}
            onEscalateWorkflow={handleEscalateWorkflow}
          />
        )}

        {activeTab === "delegations" && (
          <DelegationManager
            delegations={delegations}
            onCreateDelegation={handleCreateDelegation}
            onRevokeDelegation={handleRevokeDelegation}
          />
        )}

        {activeTab === "audit-logs" && <AuditLogViewer workflows={workflows} />}
      </div>
    </DashboardLayout>
  );
}
