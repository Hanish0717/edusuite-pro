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
  Clock,
  AlertTriangle,
  TrendingUp,
  Filter,
  Search,
  RefreshCw,
  FileText,
  Send,
  Layers,
  Eye,
  Paperclip,
  History,
  Share2,
  Zap,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  Award,
  Users,
  Building2,
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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

function ApprovalWorkflowsPage() {
  const { hasFlag, role } = useRole();
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(() => fetchWorkflows());

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  // Modal Dialog States
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const [forwardRecipient, setForwardRecipient] = useState("");

  const canApproveStep = (stepFlag?: string) => {
    if ((role as any) === "super-admin" || (role as any) === "super_admin") return true;
    if (!stepFlag) return true;
    return hasFlag(stepFlag);
  };

  // Action Handlers
  const handleApprove = (id: string, title?: string) => {
    setWorkflows((prev) => processWorkflowStep(prev, id, "approve", role));
    toast.success(`Workflow step for ${title || id} approved successfully!`);
    if (isDetailModalOpen) setIsDetailModalOpen(false);
  };

  const handleReject = (id: string, title?: string) => {
    setWorkflows((prev) => processWorkflowStep(prev, id, "reject", role));
    toast.error(`Workflow step for ${title || id} rejected.`);
    if (isDetailModalOpen) setIsDetailModalOpen(false);
  };

  const handleEscalate = (id: string, title: string) => {
    setWorkflows((prev) => processWorkflowStep(prev, id, "escalate", role));
    toast.warning(`Escalated ${title} to Executive Principal Office (Priority set to Critical).`);
  };

  const handleForwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkflow || !forwardRecipient) return;
    setWorkflows((prev) =>
      processWorkflowStep(prev, selectedWorkflow.id, "forward", role, forwardRecipient)
    );
    toast.success(`Workflow ${selectedWorkflow.id} forwarded to ${forwardRecipient}`);
    setIsForwardModalOpen(false);
    setForwardRecipient("");
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setTypeFilter("All Types");
    setDeptFilter("All Departments");
    setPriorityFilter("All Priorities");
    setStatusFilter("All Statuses");
    toast.info("Filters reset to default view");
  };

  // Filter Options Derived
  const categoryOptions = ["All Types", ...Array.from(new Set(workflows.map((w) => w.category)))];
  const departmentOptions = ["All Departments", ...Array.from(new Set(workflows.map((w) => w.department)))];
  const priorityOptions = ["All Priorities", "Critical", "High", "Medium", "Low"];
  const statusOptions = ["All Statuses", "Pending", "In Review", "Approved", "Rejected", "Escalated", "Completed"];

  // Filtered Workflow List
  const filteredWorkflows = useMemo(() => {
    return workflows.filter((wf) => {
      const matchesSearch =
        wf.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wf.requestor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wf.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "All Types" || wf.category === typeFilter;
      const matchesDept = deptFilter === "All Departments" || wf.department === deptFilter;
      const matchesPriority = priorityFilter === "All Priorities" || (wf as any).priority === priorityFilter;
      const matchesStatus = statusFilter === "All Statuses" || wf.status === statusFilter;

      return matchesSearch && matchesType && matchesDept && matchesPriority && matchesStatus;
    });
  }, [workflows, searchTerm, typeFilter, deptFilter, priorityFilter, statusFilter]);

  // Dynamic Executive Summary Calculations
  const summaryMetrics = useMemo(() => {
    const totalPending = workflows.filter((w) => w.status === "Pending" || (w.status as any) === "In Review" || (w.status as any) === "Escalated").length;
    const approvedToday = 8;
    const rejectedToday = 2;
    const criticalRequests = workflows.filter((w) => (w as any).priority === "Critical").length;
    const avgApprovalTime = "4.2 Hours";
    const longestPending = "36 Hours (WF-PRM-5502)";

    return {
      totalPending,
      approvedToday,
      rejectedToday,
      criticalRequests,
      avgApprovalTime,
      longestPending,
    };
  }, [workflows]);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* PAGE HEADER */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
              <GitBranch className="size-6" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-xl font-extrabold sm:text-2xl text-foreground">
                  Multi-Level Approval Workflows
                </h1>
                <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                  Enterprise Approval Center
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Sequential approval chains (Faculty → HOD → Dean → Principal) with role-based sign-off locks & SLA enforcement.
              </p>
            </div>
          </div>
          <Badge className="bg-brand-gradient text-white font-mono text-xs shadow-sm">
            ACTIVE WORKFLOW ENGINE
          </Badge>
        </header>

        {/* SECTION 2: EXECUTIVE SUMMARY CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
            <span className="text-[0.68rem] font-semibold text-muted-foreground uppercase block">Pending Approvals</span>
            <p className="text-2xl font-bold font-mono text-amber-600">{summaryMetrics.totalPending}</p>
            <p className="text-[0.65rem] text-muted-foreground">Action required</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
            <span className="text-[0.68rem] font-semibold text-muted-foreground uppercase block">Approved Today</span>
            <p className="text-2xl font-bold font-mono text-emerald-600">{summaryMetrics.approvedToday}</p>
            <p className="text-[0.65rem] text-emerald-600 font-medium">100% Verified</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
            <span className="text-[0.68rem] font-semibold text-muted-foreground uppercase block">Rejected Today</span>
            <p className="text-2xl font-bold font-mono text-red-600">{summaryMetrics.rejectedToday}</p>
            <p className="text-[0.65rem] text-muted-foreground">Returned with notes</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
            <span className="text-[0.68rem] font-semibold text-muted-foreground uppercase block">Critical Requests</span>
            <p className="text-2xl font-bold font-mono text-red-600">{summaryMetrics.criticalRequests}</p>
            <p className="text-[0.65rem] text-red-600 font-medium">Fast-track SLA</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
            <span className="text-[0.68rem] font-semibold text-muted-foreground uppercase block">Avg Approval Time</span>
            <p className="text-2xl font-bold font-mono text-primary">{summaryMetrics.avgApprovalTime}</p>
            <p className="text-[0.65rem] text-muted-foreground">Institutional SLA</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
            <span className="text-[0.68rem] font-semibold text-muted-foreground uppercase block">Longest Pending</span>
            <p className="text-xs font-bold font-mono text-amber-600 truncate">{summaryMetrics.longestPending}</p>
            <p className="text-[0.65rem] text-amber-600 font-medium">Requires Escalate</p>
          </div>
        </div>

        {/* SECTION 9: APPROVAL ANALYTICS WIDGETS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1">
            <span className="text-muted-foreground text-[0.68rem] block font-medium">Requests Today</span>
            <span className="font-bold text-foreground font-mono">12 New</span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1">
            <span className="text-muted-foreground text-[0.68rem] block font-medium">Pending &gt; 48 Hours</span>
            <span className="font-bold text-red-600 font-mono">2 Overdue</span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1">
            <span className="text-muted-foreground text-[0.68rem] block font-medium">Avg SLA Benchmark</span>
            <span className="font-bold text-emerald-600 font-mono">4.2 Hours</span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1">
            <span className="text-muted-foreground text-[0.68rem] block font-medium">High Priority Count</span>
            <span className="font-bold text-amber-600 font-mono">5 High / Critical</span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1">
            <span className="text-muted-foreground text-[0.68rem] block font-medium">Fastest Department</span>
            <span className="font-bold text-emerald-600 text-[0.7rem] truncate block font-sans">CSE (1.8h avg)</span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1">
            <span className="text-muted-foreground text-[0.68rem] block font-medium">Slowest Department</span>
            <span className="font-bold text-amber-600 text-[0.7rem] truncate block font-sans">Mechanical (8.4h)</span>
          </div>
        </div>

        {/* SECTION 3: ADVANCED FILTERS BAR */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="size-4 text-primary" /> Advanced Workflow Filters
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <RefreshCw className="size-3" /> Reset Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            <div className="relative min-w-[160px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search ID, title, requestor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 text-xs" aria-label="Approval Type Filter">
                <SelectValue placeholder="Approval Type" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-xs">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="h-9 text-xs" aria-label="Department Filter">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map((dept) => (
                  <SelectItem key={dept} value={dept} className="text-xs">
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="h-9 text-xs" aria-label="Priority Filter">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((p) => (
                  <SelectItem key={p} value={p} className="text-xs">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs" aria-label="Status Filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* HOD EXAM & NPTEL REGISTRATION APPROVAL PANEL */}
        <HodApprovalPanel />

        {/* SECTION 4, 5, 6, 7: ENHANCED WORKFLOW CARDS LIST */}
        <div className="space-y-6">
          {filteredWorkflows.length === 0 ? (
            <div className="p-8 text-center bg-card rounded-2xl border border-border/80 space-y-2">
              <GitBranch className="size-8 mx-auto text-muted-foreground/50" />
              <p className="text-sm font-semibold">No workflow requests match your active filters.</p>
              <p className="text-xs text-muted-foreground">Try clearing your search term or adjusting filter dropdowns.</p>
              <Button size="sm" variant="outline" onClick={handleResetFilters} className="mt-2 text-xs">
                Clear Filters
              </Button>
            </div>
          ) : (
            filteredWorkflows.map((wf) => {
              const currentStep = wf.steps[wf.currentStepIndex];
              const isCompleted = wf.currentStepIndex >= wf.steps.length;

              return (
                <Panel
                  key={wf.id}
                  title={wf.title}
                  description={`Category: ${wf.category} | Department: ${wf.department} | Submitted by ${wf.requestor} on ${wf.dateSubmitted}`}
                  action={
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        className={
                          (wf as any).priority === "Critical"
                            ? "bg-red-500/10 text-red-600 border-red-500/20 text-xs"
                            : (wf as any).priority === "High"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs"
                        }
                      >
                        {(wf as any).priority} Priority
                      </Badge>
                      <Badge variant="outline" className="font-mono text-xs">
                        {wf.id}
                      </Badge>
                    </div>
                  }
                >
                  <div className="space-y-6">
                    {/* SECTION 4 & SECTION 5: METADATA & STATUS BADGES */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-muted/30 p-3 rounded-xl border border-border/60">
                      <div>
                        <span className="text-muted-foreground block text-[0.68rem] uppercase font-medium">Current Approver</span>
                        <span className="font-bold text-foreground font-sans">{(wf as any).currentApprover}</span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[0.68rem] uppercase font-medium">SLA Remaining</span>
                        <span className="font-bold text-emerald-600 font-mono flex items-center gap-1">
                          <Clock className="size-3 text-emerald-500" /> {(wf as any).slaRemaining}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[0.68rem] uppercase font-medium">Current Progress</span>
                        <span className="font-bold text-primary font-mono">
                          Step {Math.min(wf.currentStepIndex + 1, wf.steps.length)} of {wf.steps.length}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[0.68rem] uppercase font-medium">Workflow Status</span>
                        <Badge
                          className={
                            (wf.status as any) === "Approved" || wf.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]"
                              : wf.status === "Rejected"
                              ? "bg-red-500/10 text-red-600 border-red-500/20 text-[0.68rem]"
                              : wf.status === "Escalated"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.68rem]"
                              : "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[0.68rem]"
                          }
                        >
                          {wf.status}
                        </Badge>
                      </div>
                    </div>

                    {/* SECTION 6: APPROVAL TIMELINE (Faculty -> HOD -> Dean -> Principal -> Completed) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground">
                          Sequential Approval Flow Timeline
                        </span>
                        <span className="text-[0.68rem] font-mono text-muted-foreground">
                          {isCompleted ? "100% Chain Complete" : `Active: Step ${wf.currentStepIndex + 1}`}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
                        {wf.steps.map((step, idx) => {
                          const isPast = idx < wf.currentStepIndex;
                          const isCurrent = idx === wf.currentStepIndex;
                          const isFuture = idx > wf.currentStepIndex;

                          return (
                            <div
                              key={idx}
                              className={`p-3 rounded-xl border transition-all space-y-1.5 ${
                                isPast
                                  ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10"
                                  : isCurrent
                                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                  : "border-border/60 bg-muted/20 opacity-70"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[0.65rem] font-mono font-bold uppercase text-muted-foreground">
                                  Step {idx + 1}
                                </span>
                                {isPast && <CheckCircle2 className="size-4 text-emerald-600" />}
                                {isCurrent && (
                                  <Badge className="bg-primary text-primary-foreground text-[0.6rem] px-1 py-0">
                                    ACTIVE
                                  </Badge>
                                )}
                                {isFuture && <Lock className="size-3.5 text-muted-foreground" />}
                              </div>

                              <h4 className="font-display text-xs font-bold text-foreground line-clamp-1">{step.label}</h4>
                              <p className="text-[0.68rem] text-muted-foreground line-clamp-2">{step.notes}</p>

                              {step.actor && (
                                <p className="text-[0.65rem] font-mono text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                                  Signed: {step.actor} ({step.timestamp})
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* SECTION 7: QUICK ACTIONS BAR */}
                    <div className="p-4 rounded-xl bg-card border border-border/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground">
                          Current Required Action:{" "}
                          <span className="text-primary">{currentStep ? currentStep.label : "Workflow Complete"}</span>
                        </p>
                        <p className="text-[0.72rem] text-muted-foreground mt-0.5">
                          {currentStep?.flagRequired
                            ? `Requires staff privilege flag: [${currentStep.flagRequired}]`
                            : isCompleted
                            ? "Workflow execution completed."
                            : "Open for role sign-off."}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                        {/* Secondary View Actions */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedWorkflow(wf);
                            setIsDetailModalOpen(true);
                          }}
                          className="h-8 text-xs gap-1"
                        >
                          <Eye className="size-3.5" /> Details
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedWorkflow(wf);
                            setIsDocsModalOpen(true);
                          }}
                          className="h-8 text-xs gap-1"
                        >
                          <Paperclip className="size-3.5" /> Documents ({(wf as any).documents?.length || 0})
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedWorkflow(wf);
                            setIsHistoryModalOpen(true);
                          }}
                          className="h-8 text-xs gap-1"
                        >
                          <History className="size-3.5" /> History
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedWorkflow(wf);
                            setIsForwardModalOpen(true);
                          }}
                          className="h-8 text-xs gap-1 text-purple-600 border-purple-500/20 hover:bg-purple-500/10"
                        >
                          <Share2 className="size-3.5" /> Forward
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEscalate(wf.id, wf.title)}
                          disabled={(wf as any).priority === "Critical" || isCompleted}
                          className="h-8 text-xs gap-1 text-amber-600 border-amber-500/20 hover:bg-amber-500/10"
                        >
                          <ShieldAlert className="size-3.5" /> Escalate
                        </Button>

                        {/* Primary Approve & Reject Buttons */}
                        {!isCompleted && currentStep && (
                          canApproveStep(currentStep.flagRequired) ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(wf.id, wf.title)}
                                className="h-8 bg-brand-gradient text-white text-xs gap-1.5 font-semibold"
                              >
                                <CheckCircle2 className="size-3.5" /> Approve Step
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(wf.id, wf.title)}
                                className="h-8 text-xs gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                              >
                                <XCircle className="size-3.5" /> Reject
                              </Button>
                            </>
                          ) : (
                            <Badge variant="secondary" className="text-xs font-mono">
                              Sign-off Locked (Role Flag Required)
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </Panel>
              );
            })
          )}
        </div>

        {/* SECTION 8: RECENT APPROVAL ACTIVITY FEED */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <History className="size-5 text-primary" /> Recent Institutional Approval Activity Feed
            </h3>
            <Badge variant="secondary" className="font-mono text-xs">
              Live Audit Log
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.68rem] text-emerald-600 font-bold">Today 10:30 AM</span>
                <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem] px-1 py-0">Approved</Badge>
              </div>
              <p className="font-bold text-foreground">Faculty Promotion Approved</p>
              <p className="text-muted-foreground text-[0.7rem]">Prof. Meera Reddy (Mechanical) approved by Executive Principal Office.</p>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.68rem] text-blue-600 font-bold">Today 09:15 AM</span>
                <Badge className="bg-blue-500/10 text-blue-600 text-[0.65rem] px-1 py-0">Endorsed</Badge>
              </div>
              <p className="font-bold text-foreground">Budget Approved for GPU Cluster</p>
              <p className="text-muted-foreground text-[0.7rem]">R&D Grant (₹14.5 Lakhs) endorsed by Academic Dean & Finance Officer.</p>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.68rem] text-amber-600 font-bold">Yesterday 04:15 PM</span>
                <Badge className="bg-amber-500/10 text-amber-600 text-[0.65rem] px-1 py-0">In Review</Badge>
              </div>
              <p className="font-bold text-foreground">Purchase Request Submitted</p>
              <p className="text-muted-foreground text-[0.7rem]">Robotics Lab equipment requisition submitted by ECE Lab Admin.</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.68rem] text-emerald-600 font-bold">Yesterday 02:00 PM</span>
                <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem] px-1 py-0">Verified</Badge>
              </div>
              <p className="font-bold text-foreground">NPTEL Certificate Batch Verified</p>
              <p className="text-muted-foreground text-[0.7rem]">Batch of 42 student Swayam certificates verified by HOD CSE.</p>
            </div>

            <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.68rem] text-purple-600 font-bold">Jul 31, 2026</span>
                <Badge className="bg-purple-500/10 text-purple-600 text-[0.65rem] px-1 py-0">Override Approved</Badge>
              </div>
              <p className="font-bold text-foreground">Attendance Override Approved</p>
              <p className="text-muted-foreground text-[0.7rem]">Medical leave attendance override approved for Roll #22CS104.</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.68rem] text-emerald-600 font-bold">Jul 30, 2026</span>
                <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem] px-1 py-0">Completed</Badge>
              </div>
              <p className="font-bold text-foreground">Result Gazette Published</p>
              <p className="text-muted-foreground text-[0.7rem]">Sem 6 Supplementary Exam Gazette signed off by Principal Office.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL DIALOGS FOR QUICK ACTIONS */}
      {/* --------------------------------------------------------------------- */}

      {/* DIALOG 1: WORKFLOW DETAILS MODAL */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Eye className="size-5 text-primary" /> Workflow Request Details ({selectedWorkflow?.id})
            </DialogTitle>
          </DialogHeader>

          {selectedWorkflow && (
            <div className="space-y-4 pt-1 text-xs">
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-xs">
                    {selectedWorkflow.category}
                  </Badge>
                  <Badge
                    className={
                      (selectedWorkflow as any).priority === "Critical"
                        ? "bg-red-500/10 text-red-600 border-red-500/20"
                        : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    }
                  >
                    {(selectedWorkflow as any).priority} Priority
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-foreground">{selectedWorkflow.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{selectedWorkflow.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2.5 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground font-sans block text-[0.68rem]">Requested By:</span>
                  <span className="font-bold text-foreground font-sans text-xs">{selectedWorkflow.requestor}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground font-sans block text-[0.68rem]">Department:</span>
                  <span className="font-bold text-foreground font-sans text-xs">{selectedWorkflow.department}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground font-sans block text-[0.68rem]">Date Submitted:</span>
                  <span className="text-foreground text-xs">{selectedWorkflow.dateSubmitted}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground font-sans block text-[0.68rem]">SLA Clock:</span>
                  <span className="text-emerald-600 font-bold text-xs">{(selectedWorkflow as any).slaRemaining}</span>
                </div>
              </div>

              <DialogFooter className="pt-2 flex gap-2">
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)} className="text-xs">
                  Close Window
                </Button>
                {selectedWorkflow.currentStepIndex < selectedWorkflow.steps.length && (
                  <Button
                    onClick={() => handleApprove(selectedWorkflow.id, selectedWorkflow.title)}
                    className="bg-brand-gradient text-white text-xs font-semibold gap-1.5"
                  >
                    <CheckCircle2 className="size-3.5" /> Approve Current Step
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: WORKFLOW DOCUMENTS MODAL */}
      <Dialog open={isDocsModalOpen} onOpenChange={setIsDocsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Paperclip className="size-5 text-primary" /> Attached Documents & Evidences
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Official certificates and files attached to request {selectedWorkflow?.id}.
            </DialogDescription>
          </DialogHeader>

          {selectedWorkflow && (
            <div className="space-y-3 pt-1 text-xs">
              <div className="space-y-2">
                {(selectedWorkflow as any).documents?.map((doc: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="size-5 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate">{doc.name}</p>
                        <p className="text-[0.68rem] text-muted-foreground font-mono">
                          {doc.type} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success(`Downloading ${doc.name}`)}
                      className="h-7 text-xs px-2.5 shrink-0"
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsDocsModalOpen(false)} className="w-full text-xs">
                  Close Documents
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: WORKFLOW HISTORY MODAL */}
      <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <History className="size-5 text-primary" /> Workflow Audit Trail & History
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Step-by-step sign-off history and remarks for {selectedWorkflow?.id}.
            </DialogDescription>
          </DialogHeader>

          {selectedWorkflow && (
            <div className="space-y-3 pt-1 text-xs max-h-[50vh] overflow-y-auto pr-1">
              {(selectedWorkflow as any).history?.map((h: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-card border border-border/80 space-y-1 font-mono">
                  <div className="flex items-center justify-between text-[0.68rem]">
                    <span className="font-bold text-primary">{h.step}</span>
                    <span className="text-muted-foreground">{h.timestamp}</span>
                  </div>
                  <p className="font-bold text-foreground font-sans">{h.action} by {h.actor}</p>
                  <p className="text-muted-foreground text-[0.72rem] font-sans italic">{h.comments}</p>
                </div>
              ))}

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsHistoryModalOpen(false)} className="w-full text-xs">
                  Close History
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG 4: WORKFLOW FORWARD MODAL */}
      <Dialog open={isForwardModalOpen} onOpenChange={setIsForwardModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Share2 className="size-5 text-purple-600" /> Forward & Delegate Workflow Request
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Delegate sign-off responsibility for request {selectedWorkflow?.id} to another official.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleForwardSubmit} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Forward To Officer / Role *</Label>
              <Input
                required
                placeholder="e.g. Dr. P. V. Ramana (Vice Principal)"
                value={forwardRecipient}
                onChange={(e) => setForwardRecipient(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-2 flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsForwardModalOpen(false)} className="text-xs flex-1">
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex-1">
                Confirm Forward
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
