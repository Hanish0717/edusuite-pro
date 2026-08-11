import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Lock,
  GitBranch,
  Layers,
  FileSpreadsheet,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/dashboard/panel";
import {
  WorkflowItem,
  WorkflowDomainCategory,
  RiskLevel,
  DelegationRecord,
} from "@/types/approval";
import {
  getSlaStatus,
  canUserApproveStep,
} from "@/lib/workflowService";
import { EmergencyOverrideModal } from "./EmergencyOverrideModal";
import { toast } from "sonner";

interface ApprovalCenterProps {
  workflows: WorkflowItem[];
  delegations: DelegationRecord[];
  role: string;
  flags: Record<string, boolean>;
  onApproveStep: (id: string, comment?: string) => void;
  onRejectStep: (id: string, comment?: string) => void;
  onEmergencyOverride: (
    id: string,
    actionType: "Emergency Approve" | "Force Reject" | "Force Reassign" | "Cancel Workflow",
    reason: string
  ) => void;
  onEscalateWorkflow: (id: string, reason: string) => void;
}

const CATEGORIES: { label: string; value: WorkflowDomainCategory }[] = [
  { label: "Academic", value: "Academic" },
  { label: "Human Resources", value: "Human Resources" },
  { label: "Finance", value: "Finance" },
  { label: "Administration", value: "Administration" },
  { label: "Student Services", value: "Student Services" },
];

export function ApprovalCenter({
  workflows,
  delegations,
  role,
  flags,
  onApproveStep,
  onRejectStep,
  onEmergencyOverride,
  onEscalateWorkflow,
}: ApprovalCenterProps) {
  const [activeDomain, setActiveDomain] = useState<WorkflowDomainCategory>("Academic");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [riskFilter, setRiskFilter] = useState<string>("All");
  const [slaFilter, setSlaFilter] = useState<string>("All");

  // Selection state for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [overrideModalWorkflow, setOverrideModalWorkflow] = useState<WorkflowItem | null>(null);

  // Filtered Workflows
  const filteredWorkflows = useMemo(() => {
    return workflows.filter((w) => {
      if (w.domainCategory !== activeDomain) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          w.title.toLowerCase().includes(q) ||
          w.id.toLowerCase().includes(q) ||
          w.requestor.toLowerCase().includes(q) ||
          w.department.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (statusFilter !== "All") {
        if (statusFilter === "Pending" && w.status !== "Pending") return false;
        if (statusFilter === "Escalated" && !w.isEscalated) return false;
        if (statusFilter === "Completed" && w.status !== "Completed") return false;
        if (statusFilter === "Rejected" && w.status !== "Rejected") return false;
        if (statusFilter === "High Priority" && w.riskLevel !== "High" && w.riskLevel !== "Critical")
          return false;
      }

      if (riskFilter !== "All" && w.riskLevel !== riskFilter) return false;

      if (slaFilter !== "All") {
        const sla = getSlaStatus(w);
        if (sla.status !== slaFilter) return false;
      }

      return true;
    });
  }, [workflows, activeDomain, searchQuery, statusFilter, riskFilter, slaFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredWorkflows.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredWorkflows.map((w) => w.id));
    }
  };

  const handleBulkEscalate = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => onEscalateWorkflow(id, "Bulk timeout escalation by administrator"));
    toast.warning(`Escalated ${selectedIds.length} workflows to next hierarchy level.`);
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    toast.success(`Exporting ${filteredWorkflows.length} approval records to CSV...`);
  };

  return (
    <div className="space-y-6">
      {/* DOMAIN CATEGORY TAB BAR */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-3 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const count = workflows.filter(
            (w) => w.domainCategory === cat.value && w.status !== "Completed"
          ).length;
          const isActive = activeDomain === cat.value;

          return (
            <button
              key={cat.value}
              onClick={() => {
                setActiveDomain(cat.value);
                setSelectedIds([]);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-brand-gradient text-white shadow-md shadow-primary/20"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>{cat.label}</span>
              {count > 0 && (
                <Badge
                  className={`text-[0.65rem] px-1.5 py-0 rounded-md font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                  }`}
                >
                  {count}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* FILTER BAR & CONTROLS */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Workflow ID, Title, Requestor or Department..."
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Only</option>
            <option value="Escalated">Escalated</option>
            <option value="High Priority">High Priority & Critical</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* RISK LEVEL FILTER */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="All">All Risk Tiers</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
            <option value="Critical">Critical Severity</option>
          </select>

          {/* SLA FILTER */}
          <select
            value={slaFilter}
            onChange={(e) => setSlaFilter(e.target.value)}
            className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="All">All SLA States</option>
            <option value="Green">Green (Within SLA)</option>
            <option value="Yellow">Yellow (Near Expiry)</option>
            <option value="Red">Red (SLA Breached)</option>
          </select>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            className="text-xs cursor-pointer gap-1.5"
          >
            <FileSpreadsheet className="size-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* BULK SELECTION ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-primary/10 border border-primary/30 p-3 text-xs text-primary font-bold animate-fade-in-soft">
          <span>{selectedIds.length} workflows selected</span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleBulkEscalate}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer gap-1.5"
            >
              <Zap className="size-4" /> Bulk Escalate Selected
            </Button>
          </div>
        </div>
      )}

      {/* WORKFLOW CARDS LIST */}
      <div className="space-y-6">
        {filteredWorkflows.length === 0 ? (
          <Panel>
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <Layers className="size-10 mx-auto text-muted-foreground/40" />
              <p className="font-bold text-foreground">No workflow items match the selected criteria.</p>
              <p className="text-xs">Adjust your domain category, risk level, or SLA filters.</p>
            </div>
          </Panel>
        ) : (
          filteredWorkflows.map((wf) => {
            const currentStep = wf.steps[wf.currentStepIndex];
            const isCompleted = wf.status === "Completed" || wf.currentStepIndex >= wf.steps.length;
            const sla = getSlaStatus(wf);

            // Access Control: Can current user approve standard daily step?
            const isAuthorizedOperationalApprover = currentStep
              ? canUserApproveStep(currentStep, role, flags, delegations)
              : false;

            const isSuperAdmin = role === "super-admin";

            return (
              <Panel
                key={wf.id}
                title={wf.title}
                description={`Requested by ${wf.requestor} (${wf.department}) on ${wf.dateSubmitted}`}
                action={
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(wf.id)}
                      onChange={() => toggleSelect(wf.id)}
                      className="size-4 rounded accent-primary cursor-pointer"
                    />

                    {/* RISK LEVEL BADGE */}
                    <Badge
                      className={
                        wf.riskLevel === "Critical"
                          ? "bg-destructive text-destructive-foreground font-extrabold animate-pulse"
                          : wf.riskLevel === "High"
                          ? "bg-amber-500 text-white font-bold"
                          : wf.riskLevel === "Medium"
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      }
                    >
                      {wf.riskLevel} Risk
                    </Badge>

                    {/* SLA STATUS BADGE */}
                    {!isCompleted && (
                      <Badge
                        className={
                          sla.status === "Red"
                            ? "bg-destructive/10 text-destructive border-destructive/30 font-mono text-xs"
                            : sla.status === "Yellow"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/30 font-mono text-xs"
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-mono text-xs"
                        }
                      >
                        <Clock className="size-3 mr-1" /> {sla.displayText}
                      </Badge>
                    )}

                    <Badge variant="outline" className="font-mono text-xs">
                      {wf.id}
                    </Badge>
                  </div>
                }
              >
                <div className="space-y-5">
                  {/* DESCRIPTION & OVERRIDE BADGE */}
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs text-muted-foreground">{wf.description}</p>
                    {wf.overrideDetails && (
                      <Badge className="bg-destructive text-white font-mono text-[0.65rem] shrink-0 gap-1">
                        <ShieldAlert className="size-3" /> EMERGENCY OVERRIDE ({wf.overrideDetails.actionType})
                      </Badge>
                    )}
                  </div>

                  {/* MULTI-LEVEL STEP TIMELINE */}
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                    {wf.steps.map((step, idx) => {
                      const isPast = idx < wf.currentStepIndex;
                      const isCurrent = idx === wf.currentStepIndex && !isCompleted;
                      const isFuture = idx > wf.currentStepIndex && !isCompleted;

                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border transition-all ${
                            isPast
                              ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10"
                              : isCurrent
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                              : "border-border/60 bg-muted/20 opacity-70"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[0.65rem] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                              Step {idx + 1}: {step.role}
                            </span>
                            {isPast && <CheckCircle2 className="size-4 text-emerald-600" />}
                            {isCurrent && (
                              <Badge className="bg-primary text-primary-foreground text-[0.6rem] px-1.5 py-0">
                                ACTIVE
                              </Badge>
                            )}
                            {isFuture && <Lock className="size-3 text-muted-foreground" />}
                          </div>

                          <h4 className="font-display text-xs font-bold">{step.label}</h4>
                          <p className="text-[0.72rem] text-muted-foreground mt-1 leading-snug">
                            {step.notes}
                          </p>

                          {step.actor && (
                            <p className="text-[0.68rem] font-mono text-emerald-600 dark:text-emerald-400 mt-2 font-semibold">
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
                          Current Action Stage:{" "}
                          <span className="text-primary">{currentStep.label}</span>
                        </p>
                        <p className="text-[0.72rem] text-muted-foreground mt-0.5">
                          {currentStep.flagRequired
                            ? `Requires Operational Privilege Flag: [${currentStep.flagRequired}]`
                            : "Open for operational sign-off."}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* STANDARD OPERATIONAL APPROVAL BUTTONS */}
                        {isAuthorizedOperationalApprover ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => onApproveStep(wf.id)}
                              className="bg-brand-gradient text-xs cursor-pointer gap-1.5 font-bold"
                            >
                              <CheckCircle2 className="size-4" /> Approve Step
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onRejectStep(wf.id)}
                              className="text-xs cursor-pointer gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                            >
                              <XCircle className="size-4" /> Reject
                            </Button>
                          </>
                        ) : (
                          <Badge variant="secondary" className="text-[0.7rem] font-mono text-muted-foreground">
                            Sign-off Locked (Daily Operational Role Required)
                          </Badge>
                        )}

                        {/* MANUAL ESCALATION BUTTON */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEscalateWorkflow(wf.id, "Manual escalation by administrator")}
                          className="text-xs cursor-pointer text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 gap-1.5"
                        >
                          <AlertTriangle className="size-3.5" /> Escalate
                        </Button>

                        {/* SUPER ADMIN EMERGENCY OVERRIDE BUTTON */}
                        {isSuperAdmin && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setOverrideModalWorkflow(wf)}
                            className="text-xs font-bold cursor-pointer gap-1.5 ml-1 shadow-sm"
                          >
                            <ShieldAlert className="size-3.5" /> Emergency Override
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Panel>
            );
          })
        )}
      </div>

      {/* SUPER ADMIN EMERGENCY OVERRIDE MODAL */}
      <EmergencyOverrideModal
        workflow={overrideModalWorkflow}
        isOpen={Boolean(overrideModalWorkflow)}
        onClose={() => setOverrideModalWorkflow(null)}
        onConfirmOverride={(id, actionType, reason) => {
          onEmergencyOverride(id, actionType, reason);
          setOverrideModalWorkflow(null);
        }}
      />
    </div>
  );
}
