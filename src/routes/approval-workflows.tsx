import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { useRole } from "@/context/role-context";

export const Route = createFileRoute("/approval-workflows")({
  head: () => ({
    meta: [{ title: "Approval Workflows — EduSuite Pro" }],
  }),
  component: ApprovalWorkflowsPage,
});

interface WorkflowStep {
  role: string;
  label: string;
  flagRequired?: string;
  status: "completed" | "active" | "pending" | "rejected";
  actor?: string;
  timestamp?: string;
  notes?: string;
}

interface WorkflowItem {
  id: string;
  title: string;
  category: string;
  diagram: string;
  description: string;
  requestor: string;
  department: string;
  dateSubmitted: string;
  currentStepIndex: number;
  steps: WorkflowStep[];
}

const initialWorkflows: WorkflowItem[] = [
  {
    id: "WF-ATT-1029",
    title: "Attendance Override Request (Medical Leave)",
    category: "Attendance Override",
    diagram: "Faculty -> HOD -> Dean (Opt.) -> Locked",
    description: "Request to override 4 days attendance for student Roll #22CS104 due to hospitalization.",
    requestor: "Dr. Ravi Kumar (Faculty)",
    department: "CSE",
    dateSubmitted: "2026-08-01 09:30 AM",
    currentStepIndex: 1,
    steps: [
      {
        role: "Faculty",
        label: "Faculty (Initiated)",
        status: "completed",
        actor: "Dr. Ravi Kumar",
        timestamp: "09:30 AM",
        notes: "Medical certificate verified and attached.",
      },
      {
        role: "HOD",
        label: "HOD (Dept. Head Review)",
        flagRequired: "isHod",
        status: "active",
        notes: "Awaiting HOD approval or override signature.",
      },
      {
        role: "Dean",
        label: "Dean (Optional Approval)",
        flagRequired: "isDean",
        status: "pending",
        notes: "Required for absences > 3 days.",
      },
      {
        role: "System",
        label: "Attendance Record Locked",
        status: "pending",
        notes: "Biometric database will update upon final lock.",
      },
    ],
  },
  {
    id: "WF-LEV-8821",
    title: "Faculty Casual & Conference Leave Approval",
    category: "Leave Approval",
    diagram: "Faculty -> HOD -> HR -> Payroll",
    description: "3 days leave application for IEEE International Conference presentation.",
    requestor: "Prof. Ananya Sharma (Faculty)",
    department: "ECE",
    dateSubmitted: "2026-07-31 02:15 PM",
    currentStepIndex: 2,
    steps: [
      {
        role: "Faculty",
        label: "Faculty Application",
        status: "completed",
        actor: "Prof. Ananya Sharma",
        timestamp: "02:15 PM",
        notes: "Substitute lectures assigned to Prof. V. K. Rao.",
      },
      {
        role: "HOD",
        label: "HOD Approval",
        flagRequired: "isHod",
        status: "completed",
        actor: "Dr. S. K. Gupta (HOD ECE)",
        timestamp: "04:45 PM",
        notes: "Approved. Lecture substitution confirmed.",
      },
      {
        role: "HR",
        label: "HR Manager Validation",
        flagRequired: "isHRManager",
        status: "active",
        notes: "Validating casual leave quota balance.",
      },
      {
        role: "Payroll",
        label: "Payroll Sync",
        flagRequired: "isFinanceOfficer",
        status: "pending",
        notes: "Automatic monthly attendance ledger adjustment.",
      },
    ],
  },
  {
    id: "WF-PUR-4412",
    title: "IoT Robotics Lab Equipment Procurement",
    category: "Purchase Approval",
    diagram: "Dept. -> Inventory -> Finance -> Principal",
    description: "Requisition for 20 Microcontroller Kits and Oscilloscopes (Value: Rs 2,45,000).",
    requestor: "Dr. K. V. Prasad (Lab Incharge)",
    department: "CSE",
    dateSubmitted: "2026-07-29 11:00 AM",
    currentStepIndex: 2,
    steps: [
      {
        role: "Dept",
        label: "Dept. Requisition",
        status: "completed",
        actor: "Dr. K. V. Prasad (CSE Lab)",
        timestamp: "Jul 29, 11:00 AM",
        notes: "Specifications and vendor quotes attached.",
      },
      {
        role: "Inventory",
        label: "Inventory Verification",
        flagRequired: "isInventoryManager",
        status: "completed",
        actor: "R. M. Sundaram (Inventory Mgr)",
        timestamp: "Jul 29, 03:20 PM",
        notes: "Stock verified. Items not currently available in central store.",
      },
      {
        role: "Finance",
        label: "Finance Officer Sanction",
        flagRequired: "isFinanceOfficer",
        status: "active",
        notes: "Checking CSE Lab Budget Allocation for FY 2026-27.",
      },
      {
        role: "Principal",
        label: "Principal Executive Approval",
        flagRequired: "isPrincipal",
        status: "pending",
        notes: "Final financial approval for purchase order issuance.",
      },
    ],
  },
  {
    id: "WF-EXM-9904",
    title: "B.Tech End-Semester Examination Result Publishing",
    category: "Result Publishing",
    diagram: "Faculty -> Exam Cell -> Controller -> Principal -> Publish",
    description: "Final grades processing for Semester 6 CSE & ECE examination batch.",
    requestor: "Exam Cell Automation System",
    department: "Exam Branch",
    dateSubmitted: "2026-08-01 08:00 AM",
    currentStepIndex: 1,
    steps: [
      {
        role: "Faculty",
        label: "Faculty Valuation & Marks Entry",
        status: "completed",
        actor: "All Dept Evaluators",
        timestamp: "Jul 31, 06:00 PM",
        notes: "100% internal & external valuation completed.",
      },
      {
        role: "Exam Cell",
        label: "Exam Cell Moderation & Scrutiny",
        flagRequired: "isExamController",
        status: "active",
        notes: "Grace marks calculation and moderation committee check.",
      },
      {
        role: "Controller",
        label: "Exam Controller Grade Locking",
        flagRequired: "isExamController",
        status: "pending",
        notes: "Locking SGPA/CGPA calculations.",
      },
      {
        role: "Principal",
        label: "Principal Sign-off",
        flagRequired: "isPrincipal",
        status: "pending",
        notes: "Official authorization for result declaration.",
      },
      {
        role: "Publish",
        label: "Portal Publish (Student & Parent)",
        status: "pending",
        notes: "Live publishing on Student & Parent dashboards + SMS alerts.",
      },
    ],
  },
];

export function ApprovalWorkflowsPage() {
  const { role, hasFlag, profile } = useRole();
  const [items, setItems] = useState<WorkflowItem[]>(initialWorkflows);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>("WF-ATT-1029");
  const [actionNotes, setActionNotes] = useState<string>("");

  const activeWorkflow = items.find((w) => w.id === selectedWorkflowId) || items[0];

  const handleApprove = () => {
    if (!activeWorkflow) return;
    const currIdx = activeWorkflow.currentStepIndex;

    if (currIdx >= activeWorkflow.steps.length - 1 && activeWorkflow.steps[currIdx].status === "completed") {
      toast.info("This approval workflow has already been fully processed!");
      return;
    }

    const updatedSteps = [...activeWorkflow.steps];
    updatedSteps[currIdx] = {
      ...updatedSteps[currIdx],
      status: "completed",
      actor: `${profile.personaName} (${profile.label})`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      notes: actionNotes || "Approved step according to institutional delegated authority.",
    };

    const nextIdx = Math.min(currIdx + 1, updatedSteps.length - 1);
    if (nextIdx > currIdx && nextIdx < updatedSteps.length) {
      updatedSteps[nextIdx] = {
        ...updatedSteps[nextIdx],
        status: "active",
      };
    }

    const updatedItems = items.map((w) =>
      w.id === activeWorkflow.id
        ? {
            ...w,
            currentStepIndex: nextIdx,
            steps: updatedSteps,
          }
        : w,
    );

    setItems(updatedItems);
    setActionNotes("");
    toast.success(`Step approved successfully! Processed by ${profile.personaName}.`);
  };

  const handleReject = () => {
    if (!activeWorkflow) return;
    const currIdx = activeWorkflow.currentStepIndex;

    const updatedSteps = [...activeWorkflow.steps];
    updatedSteps[currIdx] = {
      ...updatedSteps[currIdx],
      status: "rejected",
      actor: `${profile.personaName} (${profile.label})`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      notes: actionNotes || "Request rejected during review.",
    };

    const updatedItems = items.map((w) =>
      w.id === activeWorkflow.id
        ? {
            ...w,
            steps: updatedSteps,
          }
        : w,
    );

    setItems(updatedItems);
    setActionNotes("");
    toast.error(`Workflow request ${activeWorkflow.id} marked as Rejected.`);
  };

  const currentStep = activeWorkflow.steps[activeWorkflow.currentStepIndex];
  const isSuperAdmin = role === "super-admin";
  const userCanApprove =
    isSuperAdmin ||
    !currentStep.flagRequired ||
    hasFlag(currentStep.flagRequired);

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
                Approval Workflows Engine
              </h1>
              <p className="text-sm text-muted-foreground">
                Multi-level approval workflows with role checking, privilege flag evaluation, and department scope enforcement.
              </p>
            </div>
          </div>
          <Badge className="bg-brand-gradient text-white px-3 py-1.5 text-xs font-semibold">
            Diagram Template Compliant
          </Badge>
        </header>

        {/* WORKFLOW TEMPLATE SUMMARY CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-card hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">Workflow 1</Badge>
              <Lock className="size-4 text-amber-500" />
            </div>
            <h3 className="mt-2 font-display text-base font-bold">Attendance Override</h3>
            <p className="mt-1 text-xs text-muted-foreground font-mono">
              Faculty → HOD → Dean (Opt.) → Locked
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-card hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">Workflow 2</Badge>
              <UserCheck className="size-4 text-blue-500" />
            </div>
            <h3 className="mt-2 font-display text-base font-bold">Leave Approval</h3>
            <p className="mt-1 text-xs text-muted-foreground font-mono">
              Faculty → HOD → HR → Payroll
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-card hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">Workflow 3</Badge>
              <Building className="size-4 text-emerald-500" />
            </div>
            <h3 className="mt-2 font-display text-base font-bold">Purchase Approval</h3>
            <p className="mt-1 text-xs text-muted-foreground font-mono">
              Dept. → Inventory → Finance → Principal
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-card hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">Workflow 4</Badge>
              <FileCheck className="size-4 text-purple-500" />
            </div>
            <h3 className="mt-2 font-display text-base font-bold">Result Publishing</h3>
            <p className="mt-1 text-xs text-muted-foreground font-mono">
              Faculty → Exam Cell → Controller → Principal → Publish
            </p>
          </div>
        </div>

        {/* WORKFLOW TRACKER & SIMULATOR */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Workflows List */}
          <div className="space-y-4">
            <Panel title="Active Approval Tickets" description="Select a workflow request to evaluate or approve.">
              <div className="space-y-3">
                {items.map((item) => {
                  const isSelected = item.id === selectedWorkflowId;
                  const isDone = item.steps.every((s) => s.status === "completed");
                  const isRejected = item.steps.some((s) => s.status === "rejected");

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedWorkflowId(item.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/60 hover:bg-accent/10"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-semibold text-muted-foreground">
                          {item.id}
                        </span>
                        {isDone ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.65rem]">
                            COMPLETED
                          </Badge>
                        ) : isRejected ? (
                          <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-[0.65rem]">
                            REJECTED
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.65rem]">
                            IN PROGRESS
                          </Badge>
                        )}
                      </div>
                      <h4 className="mt-1.5 font-display text-sm font-bold truncate">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        {item.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
                        <span>{item.department} Dept</span>
                        <span>{item.dateSubmitted}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>

          {/* Workflow Interactive Visualizer */}
          <div className="lg:col-span-2 space-y-6">
            <Panel
              title={activeWorkflow.title}
              description={`ID: ${activeWorkflow.id} | Initiated by ${activeWorkflow.requestor}`}
              action={
                <Badge variant="outline" className="font-mono text-xs">
                  {activeWorkflow.category}
                </Badge>
              }
            >
              <div className="space-y-6">
                {/* Workflow Diagram Banner */}
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 flex items-center gap-3">
                  <GitBranch className="size-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Standard Workflow Pathway
                    </p>
                    <p className="font-mono text-sm font-semibold text-foreground truncate">
                      {activeWorkflow.diagram}
                    </p>
                  </div>
                </div>

                {/* Step-by-Step Stepper Component */}
                <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-border/60">
                  {activeWorkflow.steps.map((step, idx) => {
                    const isCompleted = step.status === "completed";
                    const isActive = step.status === "active";
                    const isRejected = step.status === "rejected";

                    return (
                      <div key={idx} className="relative flex items-start gap-4 group">
                        {/* Step Marker */}
                        <div
                          className={`relative z-10 grid size-12 shrink-0 place-items-center rounded-2xl font-bold transition-all shadow-sm ${
                            isCompleted
                              ? "bg-emerald-500 text-white"
                              : isRejected
                              ? "bg-red-500 text-white"
                              : isActive
                              ? "bg-brand-gradient text-white ring-4 ring-primary/20 animate-pulse"
                              : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="size-6" />
                          ) : isRejected ? (
                            <XCircle className="size-6" />
                          ) : (
                            <span className="font-mono text-base">{idx + 1}</span>
                          )}
                        </div>

                        {/* Step Content Card */}
                        <div
                          className={`flex-1 p-4 rounded-2xl border transition-all ${
                            isActive
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-border/60 bg-card"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4 className="font-display text-base font-bold flex items-center gap-2">
                              {step.label}
                              {step.flagRequired && (
                                <Badge variant="secondary" className="text-[0.65rem] font-mono">
                                  Flag: {step.flagRequired}
                                </Badge>
                              )}
                            </h4>
                            <span className="text-xs font-mono text-muted-foreground">
                              {step.timestamp || (isActive ? "Awaiting Action" : "Pending")}
                            </span>
                          </div>

                          {step.actor && (
                            <p className="mt-1 text-xs font-medium text-primary">
                              Processed by: {step.actor}
                            </p>
                          )}

                          <p className="mt-2 text-xs text-muted-foreground">
                            {step.notes}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ACTION DECISION PANEL */}
                <div className="p-5 rounded-2xl border border-border bg-card shadow-card space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display text-base font-bold">Perform Approval Action</h4>
                      <p className="text-xs text-muted-foreground">
                        Your Active Login: <span className="font-semibold text-foreground">{profile.personaName}</span> ({profile.label})
                      </p>
                    </div>
                    {userCanApprove ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        Authorized to Approve
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        Missing Required Privilege Flag ({currentStep?.flagRequired})
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Approval Comments / Audit Notes:
                    </label>
                    <Input
                      placeholder="e.g., Verified documents and granted attendance override."
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      className="h-10 text-sm"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      onClick={handleApprove}
                      disabled={!userCanApprove}
                      className="bg-brand-gradient shadow-glow gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="size-4" /> Approve Current Step
                    </Button>

                    <Button
                      onClick={handleReject}
                      disabled={!userCanApprove}
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2 cursor-pointer"
                    >
                      <XCircle className="size-4" /> Reject Request
                    </Button>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
